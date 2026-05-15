import { useEffect, useState } from 'react';
import { Redirect, useRouter } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { supabase } from '@/src/services/supabase';
import { COLORS } from '@/src/theme';

export default function Index() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const race = session.user.user_metadata?.race;
        if (!race) {
          router.replace('/(onboarding)/race-reveal');
        } else {
          router.replace('/(dashboard)');
        }
      } else {
        router.replace('/(auth)/login');
      }
      setLoading(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        const race = session.user.user_metadata?.race;
        if (!race) {
          router.replace('/(onboarding)/race-reveal');
        } else {
          router.replace('/(dashboard)');
        }
      } else {
        router.replace('/(auth)/login');
      }
    });
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.background, justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // Fallback (Aslında useEffect router.replace yapıyor)
  return null;
}
