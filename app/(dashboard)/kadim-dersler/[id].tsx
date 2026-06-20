import SacredBackground from '@/components/SacredBackground';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { COLORS, SIZES } from '@/src/theme';

const ESOTERIC_BG = require('@/assets/images/esoteric_bg_indigo.webp');

const LESSON_TITLES: Record<string, string> = {
  'tarot': 'Tarot ve Arkana',
  'sembolizm': 'Kadim Sembolizm',
  'human-design': 'Human Design',
  'rune': 'Rune Taşları',
  'numeroloji': 'Numeroloji',
  'yoga': 'Yoga Asanaları',
  'astroloji': 'Ezoterik Astroloji',
  'ruh-beden': 'Ruh & Beden Sağlığı',
};

export default function KadimDerslerScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const title = LESSON_TITLES[id as string] || 'Kadim Öğreti';

  return (
    <SacredBackground>

      <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={28} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.content}>
        <Ionicons name="hourglass-outline" size={60} color={COLORS.primary} style={{ marginBottom: 20, opacity: 0.8 }} />
        <Text style={styles.soonText}>Bu Kadim Kapı Henüz Kapalı</Text>
        <Text style={styles.descText}>
          {title} öğretisi yakında inisiyasyon sürecinize eklenecektir. Sırların açığa çıkacağı zamanı bekleyin.
        </Text>
      </View>
    </SacredBackground>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  soonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
    textAlign: 'center',
    textShadowColor: 'rgba(212, 175, 55, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  descText: {
    fontSize: 15,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 24,
    fontStyle: 'italic',
  }
});
