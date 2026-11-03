import Constants from 'expo-constants';

export const getProductionUrl = (): string => {
  return (
    ((Constants.expoConfig?.extra as any)?.apiBaseUrl as string) ||
    'https://www.7layers.tr'
  );
};

// Ortak backend (Next.js web app) canlı API adresi.
export const getBackendUrl = (): string => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  return getProductionUrl();
};

export const API_BASE_URL: string = getBackendUrl();

export const apiFetch = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
  if (endpoint.startsWith('http')) {
    return fetch(endpoint, options);
  }

  return fetch(`${API_BASE_URL}${endpoint}`, options);
};
