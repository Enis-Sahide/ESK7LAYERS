import SacredBackground from '@/components/SacredBackground';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { COLORS, SIZES } from '@/src/theme';
import { useProgress } from '@/src/context/ProgressContext';

const ESOTERIC_BG = require('@/assets/images/esoteric_bg_indigo.webp');

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
    subTests: [
      { title: '1. Derece: Çıraklık (50 S.)', route: '/(dashboard)/kadim-dersler/test/kabbalah_1' },
      { title: '2. Derece: Kalfalık (50 S.)', route: '/(dashboard)/kadim-dersler/test/kabbalah_2' },
    ]
  },
  { 
    id: 'astroloji', 
    title: 'Ezoterik Astroloji', 
    icon: 'planet-outline', 
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
    subTests: [
      { title: '1. Derece: Çıraklık', route: '/(dashboard)/kadim-dersler/test/human_1' },
      { title: '2. Derece: Kalfalık', route: '/(dashboard)/kadim-dersler/test/human_2', requiredUnlock: 'human_2' },
      { title: '3. Derece: Üstatlık', route: '/(dashboard)/kadim-dersler/test/human_3', requiredUnlock: 'human_master', isHighlight: true },
    ]
  },
  { 
    id: 'sembolizm', 
    title: 'Kadim Sembolizm', 
    icon: 'shapes-outline', 
    subTests: [
      { title: '1. Derece: Çıraklık', route: '/(dashboard)/kadim-dersler/test/sembolizm_1' },
      { title: '2. Derece: Kalfalık', route: '/(dashboard)/kadim-dersler/test/sembolizm_2', requiredUnlock: 'sembolizm_2' },
      { title: '3. Derece: Üstatlık', route: '/(dashboard)/kadim-dersler/test/sembolizm_3', requiredUnlock: 'sembolizm_master', isHighlight: true },
    ]
  },
  { 
    id: 'numeroloji', 
    title: 'Numeroloji', 
    icon: 'calculator-outline', 
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
    subTests: [
      { title: '1. Kademe: Semboller', route: '/(dashboard)/kadim-dersler/test/rune1' },
      { title: '2. Kademe: Bağlamalar', route: '/(dashboard)/kadim-dersler/test/rune2', requiredUnlock: 'rune_2' },
      { title: 'Büyük Final Sınavı', route: '/(dashboard)/kadim-dersler/test/runeFinal', requiredUnlock: 'rune_master', isHighlight: true },
    ]
  },
  { 
    id: 'tarot', 
    title: 'Tarot ve Arkana', 
    icon: 'albums-outline', 
    subTests: [
      { title: '1. Derece: Çıraklık', route: '/(dashboard)/kadim-dersler/test/tarot_1' },
      { title: '2. Derece: Kalfalık', route: '/(dashboard)/kadim-dersler/test/tarot_2', requiredUnlock: 'tarot_2' },
      { title: '3. Derece: Üstatlık', route: '/(dashboard)/kadim-dersler/test/tarot_3', requiredUnlock: 'tarot_master', isHighlight: true },
    ]
  },
  { 
    id: 'yoga', 
    title: 'Yoga Asanaları', 
    icon: 'fitness-outline', 
    subTests: [
      { title: '1. Derece: Çıraklık', route: '/(dashboard)/kadim-dersler/test/yoga_1' },
      { title: '2. Derece: Kalfalık', route: '/(dashboard)/kadim-dersler/test/yoga_2', requiredUnlock: 'yoga_2' },
      { title: '3. Derece: Üstatlık', route: '/(dashboard)/kadim-dersler/test/yoga_3', requiredUnlock: 'yoga_master', isHighlight: true },
    ]
  },
];

const getTestLevel = (routePath: string): number => {
  if (!routePath) return 0;
  const path = routePath.toLowerCase();
  if (path.endsWith('_3') || path.endsWith('final') || path.endsWith('yoga_3') || path.endsWith('numeroloji_3') || path.endsWith('astroloji_3') || path.endsWith('human_3') || path.endsWith('akupunktur_3') || path.endsWith('runefinal') || path.endsWith('sembolizm_3') || path.endsWith('tarot_3')) {
    return 3;
  }
  if (path.endsWith('_2') || path.endsWith('2') || path.endsWith('rune2') || path.endsWith('yoga_2') || path.endsWith('numeroloji_2') || path.endsWith('astroloji_2') || path.endsWith('human_2') || path.endsWith('akupunktur_2') || path.endsWith('sembolizm_2') || path.endsWith('tarot_2')) {
    return 2;
  }
  if (path.endsWith('_1') || path.endsWith('1') || path.endsWith('rune1') || path.endsWith('yoga_1') || path.endsWith('numeroloji_1') || path.endsWith('astroloji_1') || path.endsWith('human_1') || path.endsWith('akupunktur_1') || path.endsWith('sembolizm_1') || path.endsWith('tarot_1')) {
    return 1;
  }
  return 0;
};

const getTestId = (routePath: string): string => {
  if (routePath.includes('final-test')) return 'aura';
  return routePath.split('/').pop() ?? '';
};

const getTestDisplayName = (quizId: string): string => {
  if (quizId === 'aura') return 'Aura & Çakra Sınavı';
  if (quizId === 'duygusal_hastaliklar_50') return 'Hastalıkların Duygusal Nedenleri';
  
  for (const cat of TEST_CATEGORIES) {
    if (cat.subTests) {
      for (const sub of cat.subTests) {
        const subId = sub.route.split('/').pop();
        if (subId === quizId) {
          return `${cat.title} - ${sub.title.replace(/\s*\(.*?\)\s*/g, '')}`;
        }
      }
    }
  }
  return quizId;
};

export default function TestsHubScreen() {
  const router = useRouter();
  const { hasAccess, resetProgress, isAdmin, role, passedExams, examAttempts } = useProgress();
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

  const ROLE_LEVELS: Record<string, number> = {
    free: 0,
    apprentice: 1,
    journeyman: 2,
    master: 3,
    admin: 999,
  };
  const userLevel = ROLE_LEVELS[role] ?? 0;

  const filteredCategories = TEST_CATEGORIES.map(cat => {
    // 1. Direct route (no subtests)
    if (cat.route) {
      const level = getTestLevel(cat.route);
      if (isAdmin || level === userLevel) {
        return cat;
      }
      return null;
    }
    // 2. Has subtests
    if (cat.subTests) {
      const sub = cat.subTests.filter(s => {
        const level = getTestLevel(s.route);
        return isAdmin || level === userLevel;
      });
      if (sub.length > 0) {
        return { ...cat, subTests: sub };
      }
      return null;
    }
    return cat;
  }).filter((c): c is TestCategory => c !== null);

  return (
    <SacredBackground>

      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/(dashboard)')} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={28} color={COLORS.primary} />
        </TouchableOpacity>
        <View style={{alignItems: 'center'}}>
          <Text style={styles.headerTitle}>Sınav Merkezi</Text>
          <Text style={styles.headerSubtitle}>Öğrendiklerini Test Et</Text>
        </View>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {filteredCategories.map((cat) => {
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
                    cat.subTests ? (isExpanded ? "chevron-up" : "chevron-down") : 
                    (cat.route && passedExams.includes(getTestId(cat.route))) ? "checkmark-circle" : "play-circle-outline"
                  } 
                  size={24} 
                  color={
                    (cat.subTests || (cat.isUnderConstruction && !isAdmin)) ? COLORS.textMuted : 
                    (cat.route && passedExams.includes(getTestId(cat.route))) ? COLORS.success : COLORS.primary
                  } 
                />
              </TouchableOpacity>

              {isExpanded && cat.subTests && (
                <View style={styles.subTestsContainer}>
                  {cat.subTests.map((sub, index) => {
                    const lockKey = sub.requiredUnlock ?? (sub.route?.split('/').pop() ?? '');
                    const isLocked = isAdmin ? false : !hasAccess(lockKey);
                    const examId = sub.route?.split('/').pop() ?? '';
                    const hasPassed = passedExams.includes(examId);

                    return (
                      <TouchableOpacity 
                        key={index}
                        style={[styles.subTestBtn, sub.isHighlight && { borderLeftColor: '#FFCC00' }, isLocked && { opacity: 0.5 }]}
                        onPress={() => isLocked ? alert("Bu sınava girmek için önceki dereceyi geçmelisin!") : router.push(sub.route as any)}
                        activeOpacity={0.7}
                      >
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                          {isLocked ? (
                            <Ionicons name="lock-closed" size={14} color={COLORS.textMuted} style={{ marginRight: 8 }} />
                          ) : hasPassed ? (
                            <Ionicons name="checkmark-circle" size={16} color={COLORS.success} style={{ marginRight: 8 }} />
                          ) : (
                            <Ionicons name="play-outline" size={14} color={COLORS.primary} style={{ marginRight: 8 }} />
                          )}
                          <Text style={[styles.subTestTitle, sub.isHighlight && { color: '#FFCC00', fontWeight: 'bold' }, hasPassed && { color: COLORS.success }]}>
                            {sub.title}
                          </Text>
                        </View>
                        {hasPassed && (
                          <View style={{ backgroundColor: 'rgba(52, 199, 89, 0.1)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, marginRight: 8 }}>
                            <Text style={{ color: COLORS.success, fontSize: 10, fontWeight: 'bold' }}>Tamamlandı</Text>
                          </View>
                        )}
                        <Ionicons name={isLocked ? "lock-closed-outline" : "arrow-forward"} size={16} color={sub.isHighlight ? '#FFCC00' : COLORS.textMuted} />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })}

        {/* Geçmiş Sınav Sonuçları Tablosu */}
        {Object.keys(examAttempts || {}).length > 0 && (
          <View style={styles.resultsSection}>
            <Text style={styles.sectionHeading}>Geçmiş Sınav Sonuçlarınız</Text>
            
            <View style={styles.tableHeader}>
              <Text style={[styles.headerCell, { flex: 2.2 }]}>Sınav Adı</Text>
              <Text style={[styles.headerCell, { flex: 1.2, textAlign: 'center' }]}>Tarih</Text>
              <Text style={[styles.headerCell, { flex: 0.8, textAlign: 'right' }]}>Skor</Text>
            </View>

            {Object.entries(examAttempts || {}).map(([quizId, val]) => {
              const date = typeof val === 'string' ? val : val?.date ?? '';
              const score = typeof val === 'object' && val ? val.score : null;
              const hasPassed = score !== null && score >= 80;

              return (
                <View key={quizId} style={styles.tableRow}>
                  <Text style={[styles.rowCell, { flex: 2.2, fontWeight: 'bold' }]}>
                    {getTestDisplayName(quizId)}
                  </Text>
                  <Text style={[styles.rowCell, { flex: 1.2, textAlign: 'center', fontSize: 11, color: COLORS.textMuted }]}>
                    {date ? date.split('-').reverse().join('.') : '-'}
                  </Text>
                  <View style={{ flex: 0.8, alignItems: 'flex-end' }}>
                    <View style={[
                      styles.scoreBadge,
                      { backgroundColor: score === null ? 'rgba(255,255,255,0.08)' : hasPassed ? 'rgba(52, 199, 89, 0.15)' : 'rgba(255, 69, 58, 0.15)' }
                    ]}>
                      <Text style={[
                        styles.scoreText,
                        { color: score === null ? COLORS.textMuted : hasPassed ? COLORS.success : '#FF453A' }
                      ]}>
                        {score !== null ? `%${score}` : '-'}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}

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
  },
  resultsSection: {
    marginTop: 30,
    backgroundColor: 'rgba(10, 10, 10, 0.8)',
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    padding: 18,
    marginBottom: 20,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.2)',
    paddingBottom: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: 8,
    marginBottom: 10,
  },
  headerCell: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  rowCell: {
    color: COLORS.text,
    fontSize: 13,
  },
  scoreBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  scoreText: {
    fontSize: 11,
    fontWeight: 'bold',
  }
});
