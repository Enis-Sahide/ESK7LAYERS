import SacredBackground from '@/components/SacredBackground';
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, UIManager, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { COLORS, SIZES } from '@/src/theme';
import { useContent } from '@/src/core/content/useContent';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ICON_MAP: Record<string, keyof typeof Ionicons.glyphMap> = {
  Activity: 'activity-outline',
  Droplet: 'water-outline',
  Flame: 'flame-outline',
  Brain: 'bulb-outline',
  Hexagon: 'cube-outline',
  Fingerprint: 'finger-print-outline'
};

export default function KadimUygulamalarScreen() {
  const router = useRouter();
  const { data: vipData, loading } = useContent<any[]>('/api/content/vip-technologies');
  const [constructionModule, setConstructionModule] = useState<any | null>(null);

  const modules = vipData ?? [];

  const handlePress = (mod: any) => {
    if (mod.id === 'mikrokozmik') {
      router.push('/(dashboard)/kadim-uygulamalar/mikrokozmik');
    } else {
      setConstructionModule(mod);
    }
  };

  return (
    <SacredBackground>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={28} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kadim Uygulamalar</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Banner */}
        <BlurView intensity={30} tint="dark" style={styles.introCard}>
          <View style={styles.shieldWrapper}>
            <Ionicons name="shield-outline" size={40} color={COLORS.primary} />
          </View>
          <Text style={styles.introTitle}>İçsel Simya Laboratuvarı</Text>
          <Text style={styles.introText}>
            Yalnızca Usta seviyesini geçen inisiyelerin girebildiği ezoterik laboratuvar. Burada insan biyo-bilgisayarını hacklemeyi ve yüksek enerjileri yönlendirmeyi öğreneceksiniz.
          </Text>
        </BlurView>

        {/* Modules List */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Laboratuvar haznesine erişiliyor...</Text>
          </View>
        ) : (
          modules.map((mod) => {
            const iconName = ICON_MAP[mod.icon] || 'flask-outline';
            return (
              <View key={mod.id} style={styles.cardContainer}>
                <TouchableOpacity 
                  style={styles.moduleCard} 
                  onPress={() => handlePress(mod)}
                  activeOpacity={0.8}
                >
                  <View style={styles.cardLeft}>
                    <View style={styles.iconContainer}>
                      <Ionicons name={iconName} size={24} color={COLORS.primary} />
                    </View>
                    <View style={{ flex: 1, paddingRight: 10 }}>
                      <Text style={styles.cardTitle}>{mod.title}</Text>
                      <Text style={styles.cardDesc}>{mod.description}</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
            );
          })
        )}

        <View style={{height: 100}} />
      </ScrollView>

      {/* Under Construction Popup Modal */}
      <Modal
        visible={!!constructionModule}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setConstructionModule(null)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setConstructionModule(null)}
        >
          <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
          <TouchableOpacity 
            style={styles.modalCard} 
            activeOpacity={1}
            onPress={() => {}}
          >
            <TouchableOpacity 
              style={styles.modalCloseBtn}
              onPress={() => setConstructionModule(null)}
            >
              <Ionicons name="close" size={24} color="#9CA3AF" />
            </TouchableOpacity>

            <View style={styles.modalIconWrapper}>
              <Ionicons name="hammer-outline" size={32} color={COLORS.primary} />
            </View>

            <Text style={styles.modalTitle}>{constructionModule?.title}</Text>
            <Text style={styles.modalBadge}>Laboratuvar İnşa Halinde</Text>
            
            <Text style={styles.modalText}>
              Bu kadim teknoloji için ilerleyen aşamalarda interaktif animasyonlar, nefes asistanları ve laboratuvar araçları eklenecektir. Altyapı hazırlıkları tamamlanıyor.
            </Text>

            <TouchableOpacity 
              style={styles.modalBtnConfirm}
              onPress={() => setConstructionModule(null)}
            >
              <Text style={styles.modalBtnTextConfirm}>Anladım</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SacredBackground>
  );
}

const styles = StyleSheet.create({
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
  backBtn: { padding: 5, backgroundColor: 'rgba(212, 175, 55, 0.1)', borderRadius: 12 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary },
  scrollContent: { padding: 20 },
  introCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    marginBottom: 30,
    overflow: 'hidden',
    alignItems: 'center',
  },
  shieldWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  introTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E0E0E0',
    marginBottom: 10,
    textAlign: 'center',
  },
  introText: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 22,
    textAlign: 'center',
  },
  loadingContainer: {
    paddingVertical: 50,
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  cardContainer: {
    marginBottom: 15,
    borderRadius: SIZES.radius,
    backgroundColor: 'rgba(10, 10, 10, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    overflow: 'hidden',
  },
  moduleCard: {
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
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  cardTitle: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 16,
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
    position: 'relative',
  },
  modalCloseBtn: {
    position: 'absolute',
    top: 15,
    right: 15,
    padding: 5,
  },
  modalIconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E0E0E0',
    marginBottom: 5,
    textAlign: 'center',
  },
  modalBadge: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 15,
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
