import SacredBackground from '@/components/SacredBackground';
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Linking } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, SIZES } from '@/src/theme';

const { width } = Dimensions.get('window');

interface LevelDetail {
  title: string;
  roleKey: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  badge: string;
  accessList: string[];
}

const LEVELS_DATA: LevelDetail[] = [
  {
    title: 'Arayışta',
    roleKey: 'free',
    icon: 'search-outline',
    color: '#8E8E93',
    badge: 'Arayış Derecesi',
    accessList: [
      'Gezegen saatleri',
      'Yıllık ay döngüleri',
      'Doğum haritası analizi',
      'Anlık gökyüzü etkileşimleri',
      'Numeroloji analizi',
      'İnsan tasarımı haritası',
      'Çakra analizi',
      'Çakra bilgileri ve meditasyonları',
      'Çakra ve organ şifalandırma frekansları',
      'Nefes egzersizleri',
      'Hastalıkların duygusal nedenleri dersi',
      'Aura çakra sınavı',
      'Hastalıkların duygusal nedenleri sınavı'
    ]
  },
  {
    title: 'Çırak',
    roleKey: 'apprentice',
    icon: 'school-outline',
    color: '#32ADE6',
    badge: '1. Aşama Derecesi',
    accessList: [
      'Her dersin çıraklık seviyesi',
      'Çıraklık dersi sınavları',
      'Arayış derecesi içeriklerinin tamamı'
    ]
  },
  {
    title: 'Kalfa',
    roleKey: 'journeyman',
    icon: 'git-commit-outline',
    color: '#AF52DE',
    badge: '2. Aşama Derecesi',
    accessList: [
      'Her dersin çıraklık ve kalfa seviyesi',
      'Kalfa dersi sınavları',
      'İnsan tasarımı detaylı analiz',
      'Arayış derecesi içeriklerin tamamı'
    ]
  },
  {
    title: 'Usta',
    roleKey: 'master',
    icon: 'ribbon-outline',
    color: '#D4AF37',
    badge: 'Mistik Derece (VIP)',
    accessList: [
      '4 katmanlı harita analizi',
      'Kadim uygulamalar',
      'Her dersin çıraklık, kalfa ve ustalık seviyesi',
      'Ustalık dersi sınavları',
      'Alt derecelerin tüm içerikleri'
    ]
  }
];

export default function LevelsScreen() {
  const router = useRouter();

  const handleOpenWeb = () => {
    Linking.openURL('http://localhost:3000/membership').catch((err) => {
      console.error("Web sitesi açılamadı:", err);
    });
  };

  return (
    <SacredBackground>
      <BlurView intensity={45} tint="dark" style={StyleSheet.absoluteFill} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={28} color={COLORS.primary} />
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.headerTitle}>Tekamül Dereceleri</Text>
          <Text style={styles.headerSubtitle}>Mistik Dereceler ve Kriterler</Text>
        </View>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Kriterler Kartı */}
        <BlurView intensity={30} tint="dark" style={styles.criteriaCard}>
          <View style={styles.criteriaHeader}>
            <Ionicons name="shield-checkmark" size={24} color={COLORS.primary} />
            <Text style={styles.criteriaTitle}>Derece Geçiş Kriterleri</Text>
          </View>
          <Text style={styles.criteriaText}>
            • Bir üst derecedeki dersleri ve sınavları açabilmek için mevcut aşamanızın sınavlarından <Text style={{color: COLORS.primary, fontWeight: 'bold'}}>en az %80</Text> başarı puanı almalısınız.
          </Text>
          <Text style={styles.criteriaText}>
            • Örneğin; açılmış olan tüm <Text style={{color: '#32ADE6', fontWeight: 'bold'}}>Çıraklık Sınavlarını %80 ve üzeri</Text> başarıyla tamamlayan adaylar, bir üst aşama olan <Text style={{color: '#AF52DE', fontWeight: 'bold'}}>Kalfalık aşamasına</Text> geçmeye hak kazanırlar.
          </Text>
        </BlurView>

        {/* Dereceler Listesi */}
        {LEVELS_DATA.map((lvl) => (
          <View key={lvl.roleKey} style={[styles.levelCard, { borderColor: lvl.color + '40' }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconWrapper, { backgroundColor: lvl.color + '15', borderColor: lvl.color }]}>
                <Ionicons name={lvl.icon} size={24} color={lvl.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardTitle, { color: lvl.color }]}>{lvl.title}</Text>
                <Text style={styles.cardBadge}>{lvl.badge}</Text>
              </View>
            </View>

            <View style={styles.accessListContainer}>
              <Text style={styles.accessTitle}>Erişebileceği Özellikler:</Text>
              {lvl.accessList.map((item, idx) => (
                <View key={idx} style={styles.accessItem}>
                  <Ionicons name="checkmark-circle-outline" size={16} color={lvl.color} style={{ marginRight: 8, marginTop: 2 }} />
                  <Text style={styles.accessText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Web Sitesine Yönlendirme Kartı */}
        <BlurView intensity={35} tint="dark" style={styles.redirectCard}>
          <Ionicons name="information-circle-outline" size={32} color="#D4AF37" style={{ marginBottom: 12 }} />
          <Text style={styles.redirectTitle}>Aşama Aktivasyon İşlemi</Text>
          <Text style={styles.redirectText}>
            Mobil uygulama üzerinden doğrudan aşama geçişi veya derece aktivasyon işlemi gerçekleştirilmemektedir. Hak kazandığınız veya ilerlemek istediğiniz yeni dereceleri etkinleştirmek için lütfen web sitemizi ziyaret edin.
          </Text>
          <Text style={styles.redirectTextSub}>
            Web sitemiz üzerinden hesabınıza giriş yaparak, hak kazandığınız dereceleri kolayca aktif edebilirsiniz.
          </Text>
          
          <TouchableOpacity style={styles.webBtn} onPress={handleOpenWeb}>
            <Ionicons name="globe-outline" size={20} color="#000" style={{ marginRight: 8 }} />
            <Text style={styles.webBtnText}>Web Sitesini İncele</Text>
          </TouchableOpacity>
        </BlurView>

        <View style={{ height: 100 }} />
      </ScrollView>
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
  headerSubtitle: { fontSize: 12, color: '#9CA3AF', marginTop: 4 },
  scrollContent: { padding: 20 },
  criteriaCard: {
    backgroundColor: 'rgba(212, 175, 55, 0.05)',
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    padding: 15,
    marginBottom: 25,
  },
  criteriaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  criteriaTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  criteriaText: {
    fontSize: 13,
    color: '#E5E7EB',
    lineHeight: 20,
    marginBottom: 8,
  },
  levelCard: {
    backgroundColor: 'rgba(10, 10, 10, 0.65)',
    borderRadius: SIZES.radius,
    borderWidth: 1,
    padding: 18,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    paddingBottom: 12,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardBadge: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  accessListContainer: {
    marginTop: 15,
  },
  accessTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 10,
  },
  accessItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  accessText: {
    fontSize: 13,
    color: '#D1D5DB',
    flex: 1,
    lineHeight: 18,
  },
  redirectCard: {
    backgroundColor: 'rgba(10, 10, 10, 0.8)',
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    padding: 22,
    alignItems: 'center',
    marginTop: 10,
  },
  redirectTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  redirectText: {
    fontSize: 13,
    color: '#E5E7EB',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 10,
  },
  redirectTextSub: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  webBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  webBtnText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  }
});
