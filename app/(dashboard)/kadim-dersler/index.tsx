import SacredBackground from '@/components/SacredBackground';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '@/src/theme';
import { useProgress } from '@/src/context/ProgressContext';
import { ROLE_LEVELS } from '@/src/core/auth/roles';
import { useContent } from '@/src/core/content/useContent';

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
  { id: 'sembolizm', title: 'Kadim Sembolizm', icon: 'shapes-outline', route: '/(dashboard)/kadim-dersler/sembolizm' },
  { id: 'numeroloji', title: 'Numeroloji', icon: 'calculator-outline', route: '/(dashboard)/kadim-dersler/numeroloji' },
  { id: 'rune', title: 'Rune Tılsımları', icon: 'diamond-outline', route: '/(dashboard)/kadim-dersler/rune' },
  { id: 'tarot', title: 'Tarot ve Arkana', icon: 'albums-outline', route: '/(dashboard)/kadim-dersler/tarot' },
  { id: 'yoga', title: 'Yoga Asanaları', icon: 'fitness-outline', route: '/(dashboard)/kadim-dersler/yoga' },
];

export default function LessonsHubScreen() {
  const router = useRouter();
  const { hasAccess, role, isAdmin } = useProgress();
  const hasFullAccess = hasAccess('kadim_dersler_access') && hasAccess('duygusal_hastaliklar_access');
  
  const { data: resourcesData } = useContent<any[]>('/api/content/resources');
  const userLvl = ROLE_LEVELS[role] ?? 0;
  const filteredResources = (resourcesData ?? []).filter((r: any) => r.level <= userLvl);

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

        <TouchableOpacity 
          style={styles.examsBanner} 
          onPress={() => router.push('/(dashboard)/tests')}
          activeOpacity={0.8}
        >
          <View style={styles.examsBannerLeft}>
            <View style={styles.examsIconContainer}>
              <Ionicons name="trophy" size={22} color="#000" />
            </View>
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.examsTitle}>Sınavlar</Text>
              <Text style={styles.examsSubtitle}>Derece Değerlendirmeleri</Text>
            </View>
          </View>
          <Ionicons name="arrow-forward" size={24} color={COLORS.primary} />
        </TouchableOpacity>

        {/* Seviyeye Uygun Kaynaklar */}
        <View style={styles.resourcesSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <View style={styles.sectionIconContainer}>
                <Ionicons name="book-outline" size={20} color={COLORS.primary} />
              </View>
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.sectionTitle}>Seviyeye Uygun Kaynaklar</Text>
                <Text style={styles.sectionSubtitle}>Tekamül derecenize göre açılan rehberler</Text>
              </View>
            </View>
          </View>

          {filteredResources.length === 0 ? (
            <Text style={styles.noResourcesText}>Henüz bu seviyeye uygun kaynak bulunmuyor.</Text>
          ) : (
            filteredResources.map((res: any) => {
              const isPdf = res.type === 'pdf';
              const isBook = res.type === 'book';
              
              const handleOpenResource = () => {
                if (res.fileUrl) {
                  if (Platform.OS === 'web') {
                    window.open(res.fileUrl, '_blank');
                  } else {
                    Alert.alert(
                      "Kaynağı Aç",
                      `${res.title} dosyasını açmak istiyor musunuz?`,
                      [
                        { text: "İptal", style: "cancel" },
                        { text: "Aç", onPress: () => {
                          import('react-native').then(rn => {
                            rn.Linking.openURL(res.fileUrl);
                          });
                        }}
                      ]
                    );
                  }
                } else {
                  Alert.alert("Bilgi", "Bu önerilen fiziksel bir kitaptır. Kütüphanelerden veya kitapçılardan edinebilirsiniz.");
                }
              };

              return (
                <TouchableOpacity 
                  key={res.id} 
                  style={styles.resourceCard} 
                  activeOpacity={0.8}
                  onPress={handleOpenResource}
                >
                  <View style={styles.resourceCardTop}>
                    <View style={[styles.badge, { 
                      backgroundColor: isPdf ? 'rgba(239, 68, 68, 0.15)' : isBook ? 'rgba(59, 130, 246, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                      borderColor: isPdf ? 'rgba(239, 68, 68, 0.3)' : isBook ? 'rgba(59, 130, 246, 0.3)' : 'rgba(16, 185, 129, 0.3)'
                    }]}>
                      <Text style={[styles.badgeText, { 
                        color: isPdf ? '#EF4444' : isBook ? '#3B82F6' : '#10B981'
                      }]}>
                        {res.type === 'pdf' ? 'PDF' : res.type === 'book' ? 'KİTAP' : 'ARAŞTIRMA'}
                      </Text>
                    </View>
                    <Text style={styles.resourceLevelText}>Seviye: {res.level}</Text>
                  </View>
                  
                  <Text style={styles.resourceTitle}>{res.title}</Text>
                  {res.description ? <Text style={styles.resourceDesc}>{res.description}</Text> : null}

                  {res.fileUrl ? (
                    <View style={styles.resourceLinkBtn}>
                      <Text style={styles.resourceLinkText}>
                        {isPdf ? 'Dosyayı İndir' : 'Kaynağa Git'}
                      </Text>
                      <Ionicons name="open-outline" size={14} color={COLORS.primary} style={{marginLeft: 4}} />
                    </View>
                  ) : (
                    <Text style={styles.resourcePhysicalText}>Arayış ve Keşif Kaynağı (Bireysel Araştırma)</Text>
                  )}
                </TouchableOpacity>
              );
            })
          )}
        </View>

        <View style={{height: 80}} />
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
  examsBanner: {
    marginTop: 20,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    borderRadius: SIZES.radius,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  examsBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  examsIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  examsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  examsSubtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  resourcesSection: {
    marginTop: 25,
  },
  sectionHeader: {
    marginBottom: 15,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  sectionSubtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  noResourcesText: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 10,
  },
  resourceCard: {
    backgroundColor: 'rgba(20, 20, 20, 0.6)',
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 15,
    marginBottom: 12,
  },
  resourceCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  resourceLevelText: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  resourceTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 6,
  },
  resourceDesc: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 18,
    marginBottom: 8,
  },
  resourceLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  resourceLinkText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  resourcePhysicalText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontStyle: 'italic',
    marginTop: 4,
  },
});
