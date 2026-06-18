import SacredBackground from '@/components/SacredBackground';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { COLORS, SIZES } from '@/src/theme';
import { useProgress } from '@/src/context/ProgressContext';

const ESOTERIC_BG = require('@/assets/images/esoteric_bg_indigo.png');

interface TestCategory {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  route?: string;
  isUnderConstruction?: boolean;
  subTests?: { title: string; route: string; isHighlight?: boolean; requiredUnlock?: string }[];
}

const TEST_CATEGORIES: TestCategory[] = [
  { id: 'aura', title: 'Aura & Çakra (50 S.)', icon: 'body-outline', route: '/(dashboard)/final-test' },
  { 
    id: 'duygusal_hastaliklar', 
    title: 'Hastalıkların Duygusal Nedenleri (50 S.)', 
    icon: 'heart-half-outline', 
    route: '/(dashboard)/kadim-dersler/test/duygusal_hastaliklar_50'
  },
  { 
    id: 'akupunktur', 
    title: 'Akupunktur ve Meridyenler', 
    icon: 'body-outline', 
    isUnderConstruction: true,
    subTests: [
      { title: '1. Derece: Çıraklık', route: '/(dashboard)/kadim-dersler/test/akupunktur_1' },
      { title: '2. Derece: Kalfalık', route: '/(dashboard)/kadim-dersler/test/akupunktur_2', requiredUnlock: 'akupunktur_2' },
      { title: '3. Derece: Üstatlık', route: '/(dashboard)/kadim-dersler/test/akupunktur_3', requiredUnlock: 'akupunktur_master', isHighlight: true },
    ]
  },
  { 
    id: 'kabbalah', 
    title: 'Evrensel Kabbalah', 
    icon: 'git-network-outline', 
    isUnderConstruction: true,
    subTests: [
      { title: '1. Derece: Çıraklık (50 S.)', route: '/(dashboard)/kadim-dersler/test/kabbalah_1' },
      { title: '2. Derece: Kalfalık (50 S.)', route: '/(dashboard)/kadim-dersler/test/kabbalah_2' },
    ]
  },
  { 
    id: 'astroloji', 
    title: 'Ezoterik Astroloji', 
    icon: 'planet-outline', 
    isUnderConstruction: true,
    subTests: [
      { title: '1. Derece: Çıraklık', route: '/(dashboard)/kadim-dersler/test/astroloji_1' },
      { title: '2. Derece: Kalfalık', route: '/(dashboard)/kadim-dersler/test/astroloji_2', requiredUnlock: 'astroloji_2' },
      { title: '3. Derece: Üstatlık', route: '/(dashboard)/kadim-dersler/test/astroloji_3', requiredUnlock: 'astroloji_master', isHighlight: true },
    ]
  },
  { 
    id: 'human', 
    title: 'Human Design', 
    icon: 'finger-print-outline', 
    isUnderConstruction: true,
    subTests: [
      { title: '1. Derece: Çıraklık', route: '/(dashboard)/kadim-dersler/test/human_1' },
      { title: '2. Derece: Kalfalık', route: '/(dashboard)/kadim-dersler/test/human_2', requiredUnlock: 'human_2' },
      { title: '3. Derece: Üstatlık', route: '/(dashboard)/kadim-dersler/test/human_3', requiredUnlock: 'human_master', isHighlight: true },
    ]
  },
  { id: 'sembolizm', title: 'Kadim Sembolizm', icon: 'shapes-outline', route: '/(dashboard)/kadim-dersler/sembolizm-test', isUnderConstruction: true },
  { 
    id: 'numeroloji', 
    title: 'Numeroloji', 
    icon: 'calculator-outline', 
    isUnderConstruction: true,
    subTests: [
      { title: '1. Derece: Çıraklık', route: '/(dashboard)/kadim-dersler/test/numeroloji_1' },
      { title: '2. Derece: Kalfalık', route: '/(dashboard)/kadim-dersler/test/numeroloji_2', requiredUnlock: 'numeroloji_2' },
      { title: '3. Derece: Üstatlık', route: '/(dashboard)/kadim-dersler/test/numeroloji_3', requiredUnlock: 'numeroloji_3', isHighlight: true },
    ]
  },
  {
    id: 'rune',
    title: 'Rune',
    icon: 'diamond-outline',
    isUnderConstruction: true,
    subTests: [
      { title: '1. Kademe: Semboller', route: '/(dashboard)/kadim-dersler/test/rune1' },
      { title: '2. Kademe: Bağlamalar', route: '/(dashboard)/kadim-dersler/test/rune2', requiredUnlock: 'rune_2' },
      { title: 'Büyük Final Sınavı', route: '/(dashboard)/kadim-dersler/test/runeFinal', requiredUnlock: 'rune_master', isHighlight: true },
    ]
  },
  { id: 'tarot', title: 'Tarot ve Arkana', icon: 'albums-outline', route: '/(dashboard)/kadim-dersler/tarot-test', isUnderConstruction: true },
  { 
    id: 'yoga', 
    title: 'Yoga Asanaları', 
    icon: 'fitness-outline', 
    isUnderConstruction: true,
    subTests: [
      { title: '1. Derece: Çıraklık', route: '/(dashboard)/kadim-dersler/test/yoga_1' },
      { title: '2. Derece: Kalfalık', route: '/(dashboard)/kadim-dersler/test/yoga_2', requiredUnlock: 'yoga_2' },
      { title: '3. Derece: Üstatlık', route: '/(dashboard)/kadim-dersler/test/yoga_3', requiredUnlock: 'yoga_master', isHighlight: true },
    ]
  },
];

export default function TestsHubScreen() {
  const router = useRouter();
  const { hasAccess, resetProgress, isAdmin } = useProgress();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const hasFullAccess = hasAccess('kadim_dersler_access') && hasAccess('duygusal_hastaliklar_access');

  const handlePress = (category: TestCategory) => {
    if (category.isUnderConstruction && !isAdmin) {
      Alert.alert("Yapım Aşamasında", "Bu sınavlar yapım aşamasındadır.");
      return;
    }

    if (category.subTests) {
      setExpandedId(expandedId === category.id ? null : category.id);
    } else if (category.route) {
      router.push(category.route as any);
    }
  };

  return (
    <SacredBackground>

      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={28} color={COLORS.primary} />
        </TouchableOpacity>
        <View style={{alignItems: 'center'}}>
          <Text style={styles.headerTitle}>Sınav Merkezi</Text>
          <Text style={styles.headerSubtitle}>Öğrendiklerini Test Et</Text>
        </View>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {TEST_CATEGORIES.map((cat) => {
          const isExpanded = expandedId === cat.id;
          
          return (
            <View key={cat.id} style={styles.cardContainer}>
              <TouchableOpacity 
                style={[styles.categoryCard, cat.isUnderConstruction && !isAdmin && { opacity: 0.6 }]} 
                onPress={() => handlePress(cat)}
                activeOpacity={0.8}
              >
                <View style={styles.cardLeft}>
                  <View style={styles.iconContainer}>
                    <Ionicons name={cat.icon} size={24} color={COLORS.primary} />
                  </View>
                  <Text style={styles.cardTitle}>
                    {cat.isUnderConstruction && !isAdmin && <Ionicons name="construct-outline" size={16} color={COLORS.textMuted} style={{ marginRight: 5 }} />}
                    {cat.title}
                  </Text>
                </View>
                <Ionicons 
                  name={
                    (cat.isUnderConstruction && !isAdmin) ? "construct-outline" :
                    cat.subTests ? (isExpanded ? "chevron-up" : "chevron-down") : "play-circle-outline"
                  } 
                  size={24} 
                  color={(cat.subTests || (cat.isUnderConstruction && !isAdmin)) ? COLORS.textMuted : COLORS.primary} 
                />
              </TouchableOpacity>

              {isExpanded && cat.subTests && (
                <View style={styles.subTestsContainer}>
                  {cat.subTests.map((sub, index) => {
                    const isLocked = isAdmin ? false : (sub.requiredUnlock ? !hasAccess(sub.requiredUnlock) : false);

                    return (
                      <TouchableOpacity 
                        key={index}
                        style={[styles.subTestBtn, sub.isHighlight && { borderLeftColor: '#FFCC00' }, isLocked && { opacity: 0.5 }]}
                        onPress={() => isLocked ? alert("Bu sınava girmek için önceki dereceyi geçmelisin!") : router.push(sub.route as any)}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.subTestTitle, sub.isHighlight && { color: '#FFCC00', fontWeight: 'bold' }]}>
                          {isLocked && <Ionicons name="lock-closed" size={14} color={COLORS.textMuted} style={{ marginRight: 5 }} />} {sub.title}
                        </Text>
                        <Ionicons name={isLocked ? "lock-closed-outline" : "arrow-forward"} size={16} color={sub.isHighlight ? '#FFCC00' : COLORS.textMuted} />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
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
    flex: 1,
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
    flexShrink: 1,
  },
  subTestsContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(212, 175, 55, 0.1)',
    paddingVertical: 10,
  },
  subTestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginLeft: 15,
    borderLeftWidth: 2,
    borderLeftColor: 'rgba(212, 175, 55, 0.3)',
  },
  subTestTitle: {
    fontSize: 14,
    color: COLORS.textMuted,
  }
});
