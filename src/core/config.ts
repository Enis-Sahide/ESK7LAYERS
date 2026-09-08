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
