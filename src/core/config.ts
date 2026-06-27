import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Ortak backend (Next.js web app) API adresi.
// Öncelik: EXPO_PUBLIC_API_URL env → app.json extra.apiBaseUrl → localhost (dev).
// Gerçek cihaz/emülatörde localhost çalışmaz; app.json > expo.extra.apiBaseUrl
// alanına dağıtılmış web API adresini (örn https://api.example.com) yazın.
const getBackendUrl = (): string => {
  // Eğer tarayıcıda yerel çalışıyorsak (localhost:8081), istekleri yerel backend'e (localhost:3000) yönlendir.
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:3000';
    }
  }

  return (
    (process.env.EXPO_PUBLIC_API_URL as string) ||
    ((Constants.expoConfig?.extra as any)?.apiBaseUrl as string) ||
    'http://localhost:3000'
  );
};

export const API_BASE_URL: string = getBackendUrl();
