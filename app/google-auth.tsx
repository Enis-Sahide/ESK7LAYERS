import React, { useEffect } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { COLORS } from '@/src/theme';
import { setTokens } from '@/src/core/api/client';

export default function GoogleAuthCallbackScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    accessToken?: string;
    refreshToken?: string;
    auth_error?: string;
  }>();

  useEffect(() => {
    let mounted = true;
    (async () => {
      const access = typeof params.accessToken === 'string' ? params.accessToken : null;
      const refresh = typeof params.refreshToken === 'string' ? params.refreshToken : null;
      if (access && refresh) {
        await setTokens(access, refresh);
        if (mounted) {
          router.replace('/(dashboard)');
        }
      } else {
        if (mounted) {
          router.replace('/login');
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, [params.accessToken, params.refreshToken, params.auth_error, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.text}>Google hesabınız doğrulanıyor...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  text: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
});

