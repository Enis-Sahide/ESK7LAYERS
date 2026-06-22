import Constants from 'expo-constants';

// Ortak backend (Next.js web app) API adresi.
// Öncelik: EXPO_PUBLIC_API_URL env → app.json extra.apiBaseUrl → localhost (dev).
// Gerçek cihaz/emülatörde localhost çalışmaz; app.json > expo.extra.apiBaseUrl
// alanına dağıtılmış web API adresini (örn https://api.example.com) yazın.
export const API_BASE_URL: string =
  (process.env.EXPO_PUBLIC_API_URL as string) ||
  ((Constants.expoConfig?.extra as any)?.apiBaseUrl as string) ||
  'http://localhost:3000';
