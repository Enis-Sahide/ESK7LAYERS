import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config';

// Kendi JWT auth'umuz için token saklama + fetch wrapper.
// Supabase yerine geçer. Access + refresh token AsyncStorage'da tutulur.

const ACCESS_KEY = '@auth:access';
const REFRESH_KEY = '@auth:refresh';

let accessToken: string | null = null;
let refreshToken: string | null = null;
let loaded = false;

type Listener = () => void;
const listeners = new Set<Listener>();
export function onAuthChange(cb: Listener): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}
function notify() {
  listeners.forEach((l) => {
    try {
      l();
    } catch {
      /* yoksay */
    }
  });
}

async function loadTokens() {
  if (loaded) return;
  try {
    accessToken = await AsyncStorage.getItem(ACCESS_KEY);
    refreshToken = await AsyncStorage.getItem(REFRESH_KEY);
  } catch {
    /* yoksay */
  }
  loaded = true;
}

export async function setTokens(access: string | null, refresh: string | null) {
  accessToken = access;
  refreshToken = refresh;
  loaded = true;
  try {
    if (access) await AsyncStorage.setItem(ACCESS_KEY, access);
    else await AsyncStorage.removeItem(ACCESS_KEY);
    if (refresh) await AsyncStorage.setItem(REFRESH_KEY, refresh);
    else await AsyncStorage.removeItem(REFRESH_KEY);
  } catch {
    /* yoksay */
  }
}

export async function isAuthenticated(): Promise<boolean> {
  await loadTokens();
  return !!accessToken;
}

async function rawFetch(path: string, opts: RequestInit, withAuth: boolean) {
  await loadTokens();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((opts.headers as Record<string, string>) || {}),
  };
  if (withAuth && accessToken) headers['Authorization'] = 'Bearer ' + accessToken;
  return fetch(API_BASE_URL + path, { ...opts, headers });
}

async function parse<T>(res: Response): Promise<T> {
  const text = await res.text();
  const json = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error((json && json.error) || 'İstek başarısız (' + res.status + ')');
  return json as T;
}

// Auth gerektiren çağrı; 401'de refresh dener, sonra bir kez tekrar dener.
export async function apiFetch<T = any>(path: string, opts: RequestInit = {}): Promise<T> {
  let res = await rawFetch(path, opts, true);
  if (res.status === 401 && refreshToken) {
    const r = await rawFetch(
      '/api/auth/refresh',
      { method: 'POST', body: JSON.stringify({ refreshToken }) },
      false,
    );
    if (r.ok) {
      const data: any = await r.json();
      await setTokens(data.accessToken, data.refreshToken);
      res = await rawFetch(path, opts, true);
    } else {
      await setTokens(null, null);
      notify();
    }
  }
  return parse<T>(res);
}

async function postNoAuth<T = any>(path: string, body: any): Promise<T> {
  const res = await rawFetch(path, { method: 'POST', body: JSON.stringify(body) }, false);
  return parse<T>(res);
}

// ── Auth metotları ──────────────────────────────────────────────
export async function login(email: string, password: string) {
  const data: any = await postNoAuth('/api/auth/login', { email, password });
  await setTokens(data.accessToken, data.refreshToken);
  notify();
  return data;
}

export async function register(email: string, password: string, fullName?: string) {
  const data: any = await postNoAuth('/api/auth/register', { email, password, fullName });
  await setTokens(data.accessToken, data.refreshToken);
  notify();
  return data;
}

export async function logout() {
  try {
    await apiFetch('/api/auth/logout', { method: 'POST', body: JSON.stringify({ refreshToken }) });
  } catch {
    /* yoksay */
  }
  await setTokens(null, null);
  notify();
}

export async function getMe() {
  return apiFetch('/api/auth/me');
}

export async function forgotPassword(email: string) {
  return postNoAuth('/api/auth/forgot-password', { email });
}

export async function updateProfile(patch: { fullName?: string; race?: string }) {
  return apiFetch('/api/auth/profile', { method: 'PATCH', body: JSON.stringify(patch) });
}

export async function changePassword(password: string) {
  return apiFetch('/api/auth/change-password', { method: 'POST', body: JSON.stringify({ password }) });
}

// ── Progress metotları ──────────────────────────────────────────
export async function getProgress() {
  return apiFetch('/api/progress');
}
export async function unlockTierRemote(tierId: string) {
  return apiFetch('/api/progress/unlock', { method: 'POST', body: JSON.stringify({ tierId }) });
}
export async function examStart(quizId: string) {
  return apiFetch('/api/progress/exam/start', {
    method: 'POST',
    body: JSON.stringify({ quizId, device: 'mobile' }),
  });
}
export async function examFinish(quizId: string, score?: number) {
  return apiFetch('/api/progress/exam/finish', {
    method: 'POST',
    body: JSON.stringify({ quizId, score }),
  });
}
