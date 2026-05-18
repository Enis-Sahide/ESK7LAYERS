import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '@/src/theme';

const ESOTERIC_BG = { uri: 'https://mbqjklupfoqbcfxusigs.supabase.co/storage/v1/object/public/app-assets/images/backgrounds/esoteric_bg.png' };

interface LessonCategory {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
}

const LESSON_CATEGORIES: LessonCategory[] = [
  { id: 'kabbalah', title: 'Evrensel Kabbalah', icon: 'git-network-outline', route: '/(dashboard)/kadim-dersler/kabbalah' },
  { id: 'tarot', title: 'Tarot ve Arkana', icon: 'albums-outline', route: '/(dashboard)/kadim-dersler/tarot' },
  { id: 'sembolizm', title: 'Kadim Sembolizm', icon: 'shapes-outline', route: '/(dashboard)/kadim-dersler/sembolizm' },
  { id: 'human', title: 'Human Design', icon: 'finger-print-outline', route: '/(dashboard)/kadim-dersler/human-design' },
  { id: 'astroloji', title: 'Ezoterik Astroloji', icon: 'planet-outline', route: '/(dashboard)/kadim-dersler/astroloji' },
  { id: 'rune', title: 'Rune Tılsımları', icon: 'diamond-outline', route: '/(dashboard)/kadim-dersler/rune' },
  { id: 'numeroloji', title: 'Numeroloji', icon: 'calculator-outline', route: '/(dashboard)/kadim-dersler/numeroloji' },
  { id: 'yoga', title: 'Yoga Asanaları', icon: 'fitness-outline', route: '/(dashboard)/kadim-dersler/yoga' },
  { id: 'ruh-beden', title: 'Ruh & Beden Sağlığı', icon: 'leaf-outline', route: '/(dashboard)/kadim-dersler/ruh-beden' },
];

export default function LessonsHubScreen() {
  const router = useRouter();

  return (
    <ImageBackground source={ESOTERIC_BG} style={styles.container} resizeMode="cover">
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(10, 15, 30, 0.85)' }]} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={28} color={COLORS.primary} />
        </TouchableOpacity>
        <View style={{alignItems: 'center'}}>
          <Text style={styles.headerTitle}>Kadim Dersler</Text>
          <Text style={styles.headerSubtitle}>Okült İlimler Kütüphanesi</Text>
        </View>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {LESSON_CATEGORIES.map((cat) => (
          <View key={cat.id} style={styles.cardContainer}>
            <TouchableOpacity 
              style={styles.categoryCard} 
              onPress={() => router.push(cat.route as any)}
              activeOpacity={0.8}
            >
              <View style={styles.cardLeft}>
                <View style={styles.iconContainer}>
                  <Ionicons name={cat.icon} size={24} color={COLORS.primary} />
                </View>
                <Text style={styles.cardTitle}>{cat.title}</Text>
              </View>
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={COLORS.primary} 
              />
            </TouchableOpacity>
          </View>
        ))}

        <View style={{height: 100}} />
      </ScrollView>
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
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary },
  headerSubtitle: { fontSize: 12, color: COLORS.textMuted, marginTop: 4 },
  scrollContent: { padding: 20 },
  cardContainer: {
    marginBottom: 15,
    borderRadius: SIZES.radius,
    backgroundColor: 'rgba(20, 25, 40, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    overflow: 'hidden',
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  cardTitle: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '600',
  },
});
