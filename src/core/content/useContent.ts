import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config';

// Bellek-içi cache (uygulama ömrü boyunca tek fetch hedefi) + AsyncStorage
// (offline / hızlı açılış). Strateji: stale-while-revalidate.
const mem = new Map<string, unknown>();

export function useContent<T = any>(path: string) {
  const [data, setData] = useState<T | null>((mem.get(path) as T) ?? null);
  const [loading, setLoading] = useState(!mem.has(path));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const cacheKey = '@content:' + path;

    (async () => {
      // 1) Bellek
      if (mem.has(path)) {
        setData(mem.get(path) as T);
        setLoading(false);
      } else {
        // 2) AsyncStorage (eski veriyi hemen göster)
        try {
          const raw = await AsyncStorage.getItem(cacheKey);
          if (raw && active && !mem.has(path)) {
            const parsed = JSON.parse(raw);
            mem.set(path, parsed.data);
            setData(parsed.data as T);
            setLoading(false);
          }
        } catch {
          /* yoksay */
        }
      }

      // 3) Ağdan tazele
      try {
        const res = await fetch(API_BASE_URL + path);
        if (!res.ok) throw new Error('İçerik yüklenemedi (' + res.status + ')');
        const json = (await res.json()) as T;
        if (!active) return;
        mem.set(path, json);
        setData(json);
        setError(null);
        setLoading(false);
        AsyncStorage.setItem(cacheKey, JSON.stringify({ data: json, t: Date.now() })).catch(() => {});
      } catch (e: any) {
        if (!active) return;
        if (!mem.has(path)) setError(String(e?.message || e));
        setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [path]);

  return { data, loading, error };
}

export function useMarketplace() {
  const { data, loading, error } = useContent<{
    categories: any[];
    vendors: any[];
    products: any[];
  }>('/api/content/marketplace');
  return {
    categories: data?.categories ?? [],
    vendors: data?.vendors ?? [],
    products: data?.products ?? [],
    loading,
    error,
  };
}
