import { Stack, useRouter, usePathname } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useProgress } from '@/src/context/ProgressContext';
import { isAuthenticated, onAuthChange } from '@/src/core/api/client';
import { ROLE_LEVELS, type MinRole } from '@/src/core/auth/roles';
import { COLORS } from '@/src/theme';

// ── SAYFA (ROUTE) BAZLI MİNİMUM ROL ───────────────────────────────
// Anahtar: yol içinde geçen segment. Yetersiz seviye → sınavlara yönlenir. admin her zaman geçer.
// Örnek: 'kadim-uygulamalar': 'master'
const ROUTE_MIN_ROLE: Record<string, MinRole> = {
  'kadim-uygulamalar': 'master',
};

export default function DashboardLayout() {
  const pathname = usePathname();
  const router = useRouter();
  const { role } = useProgress();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;

    const checkAccess = async () => {
      // 1) Oturum kontrolü: Mobil uygulamada tüm sayfalar/içerikler için giriş zorunludur.
      // Hesabı açık olmayan veya token'ı düşen kullanıcı anında giriş ekranına yönlendirilir.
      const authed = await isAuthenticated();
      if (!authed) {
        if (active) {
          setIsAuthorized(false);
          router.replace('/(auth)/login');
        }
        return;
      }

      const isAdminDashboard = pathname.includes('admin-dashboard');

      // 2) Rol/seviye kontrolü
      if (role === 'admin') {
        if (active) setIsAuthorized(true);
        return;
      }
      if (isAdminDashboard && role !== 'admin') {
        if (active) {
          setIsAuthorized(false);
          router.replace('/(dashboard)');
        }
        return;
      }
      const key = Object.keys(ROUTE_MIN_ROLE).find((k) => pathname.includes(k));
      if (key) {
        const min = ROUTE_MIN_ROLE[key];
        if ((ROLE_LEVELS[role] ?? 0) < (ROLE_LEVELS[min] ?? 0)) {
          if (active) {
            setIsAuthorized(false);
            router.replace('/(dashboard)/tests');
          }
          return;
        }
      }

      if (active) setIsAuthorized(true);
    };

    checkAccess();

    // Oturum kapandığında veya token süresi dolduğunda (401) anında login ekranına at
    const unsub = onAuthChange(() => {
      checkAccess();
    });

    return () => {
      active = false;
      unsub();
    };
  }, [pathname, role]);

  if (isAuthorized === null || !isAuthorized) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}

