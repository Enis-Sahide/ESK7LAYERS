import SacredBackground from '@/components/SacredBackground';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '@/src/theme';
import { useProgress } from '@/src/context/ProgressContext';
import { ROLE_LEVELS } from '@/src/core/auth/roles';

interface LessonCategory {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  isUnderConstruction?: boolean;
}

const LESSON_CATEGORIES: LessonCategory[] = [
  { id: 'duygusal-hastaliklar', title: 'Hastalıkların Duygusal Nedenleri', icon: 'heart-half-outline', route: '/(dashboard)/kadim-dersler/duygusal-hastaliklar' },
  { id: 'akupunktur', title: 'Akupunktur ve Meridyenler', icon: 'body-outline', route: '/(dashboard)/kadim-dersler/akupunktur' },
  { id: 'kabbalah', title: 'Evrensel Kabbalah', icon: 'git-network-outline', route: '/(dashboard)/kadim-dersler/kabbalah' },
  { id: 'astroloji', title: 'Ezoterik Astroloji', icon: 'planet-outline', route: '/(dashboard)/kadim-dersler/astroloji' },
  { id: 'human', title: 'Human Design', icon: 'finger-print-outline', route: '/(dashboard)/kadim-dersler/human-design' },
  { id: 'sembolizm', title: 'Kadim Sembolizm', icon: 'shapes-outline', route: '/(dashboard)/kadim-dersler/sembolizm', isUnderConstruction: true },
  { id: 'numeroloji', title: 'Numeroloji', icon: 'calculator-outline', route: '/(dashboard)/kadim-dersler/numeroloji' },
  { id: 'rune', title: 'Rune Tılsımları', icon: 'diamond-outline', route: '/(dashboard)/kadim-dersler/rune' },
  { id: 'tarot', title: 'Tarot ve Arkana', icon: 'albums-outline', route: '/(dashboard)/kadim-dersler/tarot', isUnderConstruction: true },
  { id: 'yoga', title: 'Yoga Asanaları', icon: 'fitness-outline', route: '/(dashboard)/kadim-dersler/yoga' },
];

export default function LessonsHubScreen() {
  const router = useRouter();
  const { hasAccess, role, isAdmin } = useProgress();
  const hasFullAccess = hasAccess('kadim_dersler_access') && hasAccess('duygusal_hastaliklar_access');

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      alert(`${title}\n\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const handlePress = (cat: LessonCategory) => {
    const userLvl = ROLE_LEVELS[role] ?? 0;
    console.log("Mobile handlePress click:", { catId: cat.id, role, userLvl });
    if (cat.id !== 'duygusal-hastaliklar' && userLvl < 1 && !isAdmin) {
      return;
    }
    if (cat.isUnderConstruction && !isAdmin) {
      showAlert("Yapım Aşamasında", "Bu ders yapım aşamasındadır.");
      return;
    }
    router.push(cat.route as any);
  };

  return (
    <SacredBackground>
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
        {LESSON_CATEGORIES.map((cat) => {
          const userLvl = ROLE_LEVELS[role] ?? 0;
          const isLocked = cat.id !== 'duygusal-hastaliklar' && userLvl < 1 && !isAdmin;
          return (
            <View key={cat.id} style={styles.cardContainer}>
              <TouchableOpacity 
                style={[styles.categoryCard, (cat.isUnderConstruction && !isAdmin) && { opacity: 0.6 }, isLocked && { opacity: 0.5 }]} 
                onPress={() => handlePress(cat)}
                activeOpacity={0.8}
              >
                <View style={styles.cardLeft}>
                  <View style={styles.iconContainer}>
                    <Ionicons name={cat.icon} size={24} color={isLocked ? COLORS.textMuted : COLORS.primary} />
                  </View>
                  <Text style={[styles.cardTitle, isLocked && { color: COLORS.textMuted }]}>
                    {cat.title}
                  </Text>
                </View>
                <Ionicons 
                  name={isLocked ? "lock-closed" : (cat.isUnderConstruction && !isAdmin) ? "construct-outline" : "chevron-forward"} 
                  size={20} 
                  color={isLocked ? COLORS.textMuted : (cat.isUnderConstruction && !isAdmin) ? COLORS.textMuted : COLORS.primary} 
                />
              </TouchableOpacity>
            </View>
          );
        })}

        <View style={{height: 100}} />
      </ScrollView>


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
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary },
  headerSubtitle: { fontSize: 12, color: COLORS.textMuted, marginTop: 4 },
  scrollContent: { padding: 20 },
  cardContainer: {
    marginBottom: 15,
    borderRadius: SIZES.radius,
    backgroundColor: 'rgba(10, 10, 10, 0.7)',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#000000',
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    padding: 25,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E0E0E0',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalBtnConfirm: {
    backgroundColor: '#D4AF37',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  modalBtnTextConfirm: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
});
