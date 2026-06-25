import { Stack, useRouter, usePathname } from 'expo-router';
import { useEffect } from 'react';
import { useProgress } from '@/src/context/ProgressContext';
import { isAuthenticated } from '@/src/core/api/client';
import { ROLE_LEVELS, type MinRole } from '@/src/core/auth/roles';

// ── GİRİŞ ZORUNLU BÖLÜMLER (web ile aynı mantık) ──────────────────
// Public: Ana Sayfa, Frekans Odası (meditation), Nefes (breathwork), Analiz (kisisel-analizler).
// Aşağıdaki segmentler en az GİRİŞ ister (misafir → /(auth)/login):
const AUTH_REQUIRED = ['kadim-dersler', 'tests', 'final-test', 'store', 'profile'];

// ── SAYFA (ROUTE) BAZLI MİNİMUM ROL ───────────────────────────────
// Anahtar: yol içinde geçen segment. Yetersiz seviye → sınavlara yönlenir. admin her zaman geçer.
// Örnek (yorumu açıp kullan):
//   'vip-teknolojiler': 'master',
const ROUTE_MIN_ROLE: Record<string, MinRole> = {
  // 'vip-teknolojiler': 'master',
};

export default function DashboardLayout() {
  const pathname = usePathname();
  const router = useRouter();
  const { role } = useProgress();

  useEffect(() => {
    let active = true;
    (async () => {
      const isAdminDashboard = pathname.includes('admin-dashboard');
      // 1) Giriş kontrolü (misafir kilitli bölüme giremez)
      if (AUTH_REQUIRED.some((s) => pathname.includes(s)) || isAdminDashboard) {
        if (!(await isAuthenticated())) {
          if (active) router.replace('/(auth)/login');
          return;
        }
      }
      // 2) Rol/seviye kontrolü
      if (role === 'admin') return;
      if (isAdminDashboard && role !== 'admin') {
        if (active) router.replace('/(dashboard)');
        return;
      }
      const key = Object.keys(ROUTE_MIN_ROLE).find((k) => pathname.includes(k));
      if (!key) return;
      const min = ROUTE_MIN_ROLE[key];
      if ((ROLE_LEVELS[role] ?? 0) < (ROLE_LEVELS[min] ?? 0)) {
        if (active) router.replace('/(dashboard)/tests');
      }
    })();
    return () => {
      active = false;
    };
  }, [pathname, role]);

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
