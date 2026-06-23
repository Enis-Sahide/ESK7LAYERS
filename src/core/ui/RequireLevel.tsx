import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useProgress } from '@/src/context/ProgressContext';
import { meetsRole, type MinRole } from '@/src/core/auth/roles';
import { COLORS, SIZES } from '@/src/theme';

const ROLE_NAMES: Record<MinRole, string> = {
  free: 'Ücretsiz Üyelik',
  apprentice: 'Çıraklık',
  journeyman: 'Kalfalık',
  master: 'Ustalık',
};

interface Props {
  children: React.ReactNode;
  minimumRole: MinRole;
  fallback?: React.ReactNode;
}

// Web'deki RequireRole'ün mobil karşılığı.
// Kullanıcının rolü yeterliyse children'ı, değilse kilit/yükseltme ekranını gösterir.
export default function RequireLevel({ children, minimumRole, fallback }: Props) {
  const { role } = useProgress();
  const router = useRouter();

  if (meetsRole(role, minimumRole)) {
    return <>{children}</>;
  }

  if (fallback) return <>{fallback}</>;

  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Ionicons name="lock-closed-outline" size={28} color={COLORS.primary} />
      </View>
      <Text style={styles.title}>
        {minimumRole === 'free'
          ? 'Giriş Gerekiyor'
          : `${ROLE_NAMES[minimumRole]} Mührü Gerekiyor`}
      </Text>
      <Text style={styles.desc}>
        {minimumRole === 'free'
          ? 'Bu bölümü görmek için lütfen giriş yapın.'
          : 'Bu kadim bilgiye erişmek için seviyeni yükseltmelisin.'}
      </Text>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => router.push(minimumRole === 'free' ? '/(auth)/login' : '/(dashboard)/tests')}
        activeOpacity={0.85}
      >
        <Text style={styles.btnText}>
          {minimumRole === 'free' ? 'Giriş Yap' : 'Sınavlara Git'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 24,
    borderRadius: SIZES?.radius ?? 16,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.3)',
    backgroundColor: 'rgba(20,25,40,0.6)',
    alignItems: 'center',
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(212,175,55,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  title: { color: COLORS.text, fontSize: 16, fontWeight: 'bold', marginBottom: 6, textAlign: 'center' },
  desc: { color: COLORS.textMuted, fontSize: 13, textAlign: 'center', marginBottom: 16, lineHeight: 19 },
  btn: {
    backgroundColor: 'rgba(212,175,55,0.2)',
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingHorizontal: 28,
    paddingVertical: 11,
    borderRadius: 24,
  },
  btnText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 14 },
});
