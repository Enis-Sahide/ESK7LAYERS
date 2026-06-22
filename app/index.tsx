import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { isAuthenticated, getMe, onAuthChange } from '@/src/core/api/client';
import { COLORS } from '@/src/theme';

export default function Index() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    const route = async () => {
      try {
        if (await isAuthenticated()) {
          const me: any = await getMe();
          if (!mounted) return;
          if (!me?.user?.race) {
            router.replace('/(onboarding)/race-reveal');
          } else {
            router.replace('/(dashboard)');
          }
        } else {
          if (mounted) router.replace('/(auth)/login');
        }
      } catch {
        if (mounted) router.replace('/(auth)/login');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    route();
    const unsub = onAuthChange(() => {
      route();
    });
    return () => {
      mounted = false;
      unsub();
    };
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.background, justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return null;
}
