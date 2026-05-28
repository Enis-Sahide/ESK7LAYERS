import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '@/src/theme';
import { useProgress } from '@/src/context/ProgressContext';

const ESOTERIC_BG = require('@/assets/images/esoteric_bg_indigo.png');

interface LessonCategory {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  requiredUnlock?: string;
}

const LESSON_CATEGORIES: LessonCategory[] = [
  { id: 'duygusal-hastaliklar', title: 'Hastalıkların Duygusal Nedenleri', icon: 'heart-half-outline', route: '/(dashboard)/kadim-dersler/duygusal-hastaliklar' },
  { id: 'akupunktur', title: 'Akupunktur ve Meridyenler', icon: 'body-outline', route: '/(dashboard)/kadim-dersler/akupunktur', requiredUnlock: 'kadim_dersler_access' },
  { id: 'kabbalah', title: 'Evrensel Kabbalah', icon: 'git-network-outline', route: '/(dashboard)/kadim-dersler/kabbalah', requiredUnlock: 'kadim_dersler_access' },
  { id: 'astroloji', title: 'Ezoterik Astroloji', icon: 'planet-outline', route: '/(dashboard)/kadim-dersler/astroloji', requiredUnlock: 'kadim_dersler_access' },
  { id: 'human', title: 'Human Design', icon: 'finger-print-outline', route: '/(dashboard)/kadim-dersler/human-design', requiredUnlock: 'kadim_dersler_access' },
  { id: 'sembolizm', title: 'Kadim Sembolizm', icon: 'shapes-outline', route: '/(dashboard)/kadim-dersler/sembolizm', requiredUnlock: 'kadim_dersler_access' },
  { id: 'numeroloji', title: 'Numeroloji', icon: 'calculator-outline', route: '/(dashboard)/kadim-dersler/numeroloji', requiredUnlock: 'kadim_dersler_access' },
  { id: 'rune', title: 'Rune Tılsımları', icon: 'diamond-outline', route: '/(dashboard)/kadim-dersler/rune', requiredUnlock: 'kadim_dersler_access' },
  { id: 'tarot', title: 'Tarot ve Arkana', icon: 'albums-outline', route: '/(dashboard)/kadim-dersler/tarot', requiredUnlock: 'kadim_dersler_access' },
  { id: 'yoga', title: 'Yoga Asanaları', icon: 'fitness-outline', route: '/(dashboard)/kadim-dersler/yoga', requiredUnlock: 'kadim_dersler_access' },
];

export default function LessonsHubScreen() {
  const router = useRouter();
  const { hasAccess } = useProgress();
  const hasFullAccess = hasAccess('kadim_dersler_access') && hasAccess('duygusal_hastaliklar_access');

  const handlePress = (cat: LessonCategory) => {
    if (cat.requiredUnlock && !hasFullAccess) {
      alert("Bu derse erişmek için Çakra Final Sınavı ve Hastalıkların Duygusal Nedenleri Sınavından en az %85 almalısın!");
      return;
    }
    router.push(cat.route as any);
  };

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
              style={[styles.categoryCard, (cat.requiredUnlock && !hasFullAccess) && { opacity: 0.6 }]} 
              onPress={() => handlePress(cat)}
              activeOpacity={0.8}
            >
              <View style={styles.cardLeft}>
                <View style={styles.iconContainer}>
                  <Ionicons name={cat.icon} size={24} color={COLORS.primary} />
                </View>
                <Text style={styles.cardTitle}>
                  {(cat.requiredUnlock && !hasFullAccess) && <Ionicons name="lock-closed" size={16} color={COLORS.textMuted} style={{ marginRight: 5 }} />}
                  {cat.title}
                </Text>
              </View>
              <Ionicons 
                name={(cat.requiredUnlock && !hasFullAccess) ? "lock-closed-outline" : "chevron-forward"} 
                size={20} 
                color={(cat.requiredUnlock && !hasFullAccess) ? COLORS.textMuted : COLORS.primary} 
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
