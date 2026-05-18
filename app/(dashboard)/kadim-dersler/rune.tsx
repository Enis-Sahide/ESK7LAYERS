import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { COLORS, SIZES } from '@/src/theme';
import { useProgress } from '../../../src/context/ProgressContext';

const ESOTERIC_BG = { uri: 'https://mbqjklupfoqbcfxusigs.supabase.co/storage/v1/object/public/app-assets/images/backgrounds/esoteric_bg.png' };

export default function RuneMainScreen() {
  const router = useRouter();
  const { hasAccess } = useProgress();

  return (
    <ImageBackground source={ESOTERIC_BG} style={styles.container} resizeMode="cover">
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(10, 15, 30, 0.7)' }]} />
      <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={28} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rune Tılsımları</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>Dersler</Text>

        <TouchableOpacity 
          style={styles.card}
          onPress={() => router.push('/(dashboard)/kadim-dersler/rune1')}
          activeOpacity={0.8}
        >
          <BlurView intensity={40} tint="dark" style={styles.cardBlur}>
            <Text style={{fontSize: 40, color: COLORS.primary, marginBottom: 10, textAlign: 'center'}}>ᚠ</Text>
            <Text style={styles.cardTitle}>Rune Sembolleri</Text>
            <Text style={styles.cardDesc}>
              24 Elder Futhark sembolünün anlamları, kullanımları ve kadim enerjileri.
            </Text>
          </BlurView>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.card, !hasAccess('rune_2') && { opacity: 0.5 }]}
          onPress={() => {
            if (hasAccess('rune_2')) {
              router.push('/(dashboard)/kadim-dersler/rune2');
            } else {
              alert("Bu derece kilitli! Önce Rune Sembolleri Sınavını (1. Kademe) %100 başarıyla geçmelisin.");
            }
          }}
          activeOpacity={0.8}
        >
          <BlurView intensity={40} tint="dark" style={styles.cardBlur}>
            <Image source={{ uri: 'https://mbqjklupfoqbcfxusigs.supabase.co/storage/v1/object/public/app-assets/images/runes/fear_bindrune.png' }} style={{width: 50, height: 50, marginBottom: 10, resizeMode: 'contain'}} />
            <Text style={styles.cardTitle}>
              {!hasAccess('rune_2') && <Ionicons name="lock-closed" size={20} color={COLORS.primary} />} Rune Bağlamaları
            </Text>
            <Text style={styles.cardDesc}>
              Sembollerin birleşimiyle oluşan tılsımlar, ritüeller ve rüya kapanı.
            </Text>
          </BlurView>
        </TouchableOpacity>

      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.2)',
  },
  backBtn: { padding: 5 },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 40,
    fontStyle: 'italic',
    textShadowColor: 'rgba(212, 175, 55, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  card: {
    marginBottom: 20,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.4)',
  },
  cardBlur: {
    padding: 30,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
  },
  cardDesc: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  }
});
