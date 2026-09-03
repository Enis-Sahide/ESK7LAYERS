import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Ortak backend (Next.js web app) API adresi.
// Öncelik: EXPO_PUBLIC_API_URL env → app.json extra.apiBaseUrl → localhost (dev).
// Gerçek cihaz/emülatörde localhost çalışmaz; app.json > expo.extra.apiBaseUrl
// alanına dağıtılmış web API adresini (örn https://api.example.com) yazın.
const getBackendUrl = (): string => {
  // 1. Tarayıcıda yerel test yapıyorsak (localhost:8081 veya 127.0.0.1), 
  // istekleri daima yerel Next.js backend'ine (localhost:3000) yönlendir.
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:3000';
    }
  }

  // 2. Eğer env ile API adresi tanımlanmışsa (örn: canlı siteye bağlanmak için), onu kullan.
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  return (
    ((Constants.expoConfig?.extra as any)?.apiBaseUrl as string) ||
    'https://www.7layers.tr'
  );
};

export const API_BASE_URL: string = getBackendUrl();
