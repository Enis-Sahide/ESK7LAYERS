import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Ortak backend (Next.js web app) API adresi.
// Öncelik: EXPO_PUBLIC_API_URL env → app.json extra.apiBaseUrl → https://www.7layers.tr
export const getBackendUrl = (): string => {
  // 1. Eğer env ile özel bir API adresi tanımlanmışsa öncelikli kullan
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // 2. Tarayıcıda yerel test yapılıyorsa (web localhost:8081)
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:3000';
    }
  }

  // 3. Canlı API adresi (app.json extra veya varsayılan https://www.7layers.tr)
  return (
    ((Constants.expoConfig?.extra as any)?.apiBaseUrl as string) ||
    'https://www.7layers.tr'
  );
};

export const API_BASE_URL: string = getBackendUrl();

export const getLocalDevUrl = (): string => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000';
  }
  return 'http://localhost:3000';
};

export const apiFetch = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, options);
    // If response is 404 (endpoint not yet deployed to production) and we are in __DEV__, try local dev server
    if (!res.ok && res.status === 404 && typeof __DEV__ !== 'undefined' && __DEV__ && !endpoint.startsWith('http')) {
      const devUrl = `${getLocalDevUrl()}${endpoint}`;
      try {
        const devRes = await fetch(devUrl, options);
        if (devRes.ok) return devRes;
      } catch {
        // Fallback to original response
      }
    }
    return res;
  } catch (err) {
    if (typeof __DEV__ !== 'undefined' && __DEV__ && !endpoint.startsWith('http')) {
      const devUrl = `${getLocalDevUrl()}${endpoint}`;
      try {
        return await fetch(devUrl, options);
      } catch {}
    }
    throw err;
  }
};
