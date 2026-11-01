import Constants from 'expo-constants';
import { Platform } from 'react-native';

export const getProductionUrl = (): string => {
  return (
    ((Constants.expoConfig?.extra as any)?.apiBaseUrl as string) ||
    'https://www.7layers.tr'
  );
};

export const getLocalDevUrl = (): string => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000';
  }
  return 'http://localhost:3000';
};

// Ortak backend (Next.js web app) API adresi.
// Geliştirme (__DEV__) modunda yerel Next.js sunucusuna (10.0.2.2:3000 / localhost:3000) öncelik verir.
export const getBackendUrl = (): string => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    return getLocalDevUrl();
  }

  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:3000';
    }
  }

  return getProductionUrl();
};

export const API_BASE_URL: string = getBackendUrl();

export const apiFetch = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
  if (endpoint.startsWith('http')) {
    return fetch(endpoint, options);
  }

  // __DEV__ modunda önce yerel sunucuyu dene, ulaşılamazsa canlı sunucuya düş
  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    const devUrl = `${getLocalDevUrl()}${endpoint}`;
    try {
      const devRes = await fetch(devUrl, options);
      if (devRes.ok || devRes.status < 500) {
        return devRes;
      }
    } catch {
      // Yerel sunucu kapalıysa canlı sunucuya düş
    }
    return fetch(`${getProductionUrl()}${endpoint}`, options);
  }

  return fetch(`${API_BASE_URL}${endpoint}`, options);
};
