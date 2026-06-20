import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import SacredBackground from '@/components/SacredBackground';

export default function ImeceHealthScreen() {
  const router = useRouter();

  const handleOpenLink = () => {
    Linking.openURL('https://imecesistem.com.tr/davet/TM/BT90000000114');
  };

  const productSeries = [
    {
      title: 'SUP Gıda Takviyeleri (Jel Serisi)',
      icon: 'heart-outline',
      desc: 'Bitkilerin, şifalı mantarların ve deniz bileşenlerinin gücünü jel formunda sunan, hücre savunması ve yenilenmesini destekleyen patentli seri.',
      items: [
        { name: 'Sup Detoks Mix Jel', desc: 'Toksinlerin atılmasını ve karaciğer fonksiyonlarını destekleyen arındırıcı formül.' },
        { name: 'Sup Propolis Mix Jel', desc: 'Bağışıklık sistemini güçlendiren hücresel savunma kalkanı.' },
        { name: 'Sup Reishi & Spirulina Jelleri', desc: 'Stres dengesi, zengin protein, mineral ve hücresel enerji takviyesi.' },
        { name: 'Sup Krill Mix Jel', desc: 'Hücre emilimi yüksek Omega-3, kalp ve beyin sağlığı desteği.' }
      ]
    },
    {
      title: 'Hyranus Kişisel Bakım',
      icon: 'sparkles-outline',
      desc: 'Tene ve saça uyumlu, kimyasal koruyucular içermeyen özel saç ve cilt bakım serisi. Saç derisinin mikrobiyom dengesini korur.',
      items: []
    },
    {
      title: "Coffee's Şah & Şifalı Gıdalar",
      icon: 'cafe-outline',
      desc: 'Kırmızı Reishi özlü kahve serisi ve içme suyunun alkali dengesini sağlayan Sup Alkali pH Damlası.',
      items: []
    },
    {
      title: 'Manyetik Biyoenerji Denge Serisi',
      icon: 'pulse-outline',
      desc: 'Çevremizdeki elektromanyetik kirliliğin vücudumuz üzerindeki olumsuz etkilerini dengelemek üzere tasarlanmış biyoenerji takıları.',
      items: []
    }
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <SacredBackground>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#D4AF37" />
            <Text style={styles.backButtonText}>Keşfet</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>BÜTÜNSEL ŞİFA & TEKNOLOJİ</Text>
            </View>
            <Text style={styles.heroTitle}>İmece Sağlık Teknolojisi</Text>
            <Text style={styles.heroDesc}>
              19 Şubat 2015'te tamamlayıcı tıp alanında uzun yıllara dayanan deneyimle kurulan İmece Sistem, doğanın şifasını ve devrim niteliğindeki biyotıbbi teknolojileri bir araya getiren bir bütünsel sağlık platformudur.
            </Text>
          </View>

          {/* Tech Highlights */}
          <View style={styles.techHighlights}>
            <View style={styles.techCard}>
              <View style={[styles.techIconWrapper, { borderColor: 'rgba(16, 185, 129, 0.4)' }]}>
                <Ionicons name="analytics" size={24} color="#10B981" />
              </View>
              <Text style={styles.techCardTitle}>Çift Teknoloji Sinerjisi</Text>
              <Text style={styles.techCardDesc}>
                İmece gıda takviyeleri, sıradan tabletlerden farklı olarak Jel Süspansiyon Teknolojisi ile Negatif İyonlama Teknolojisi'ni dünyada eşsiz bir sinerjiyle bir arada kullanır. Bu sayede emilimi ve biyoyararlanımı maksimuma çıkararak hücresel düzeyde hızlı nüfuz sağlar.
              </Text>
            </View>

            <View style={styles.techCard}>
              <View style={[styles.techIconWrapper, { borderColor: 'rgba(20, 184, 166, 0.4)' }]}>
                <Ionicons name="leaf" size={24} color="#14B8A6" />
              </View>
              <Text style={styles.techCardTitle}>Doğal Koruyuculuk</Text>
              <Text style={styles.techCardDesc}>
                Gıda takviyelerinden kişisel bakım ürünlerine kadar tüm ürün gruplarında sentetik koruyucu kimyasallar kullanılmaz. Doğa dostu ve insan hücresine uyumlu patentli koruma sistemleri sayesinde, vücudunuza kimyasal yük bindirmeden hücresel düzeyde temiz ve doğal bir destek sağlanır.
              </Text>
            </View>
          </View>

          {/* Product Series Title */}
          <View style={styles.sectionHeader}>
            <Ionicons name="compass" size={22} color="#10B981" />
            <Text style={styles.sectionTitle}>İmece Ürün Serileri & İçerikleri</Text>
          </View>

          {/* Product Series List */}
          <View style={styles.seriesContainer}>
            {productSeries.map((series, index) => (
              <View key={index} style={styles.seriesCard}>
                <View style={styles.seriesHeader}>
                  <View style={styles.seriesIconBg}>
                    <Ionicons name={series.icon as any} size={20} color="#10B981" />
                  </View>
                  <Text style={styles.seriesTitle}>{series.title}</Text>
                </View>
                <Text style={styles.seriesDesc}>{series.desc}</Text>

                {series.items.length > 0 && (
                  <View style={styles.itemsGrid}>
                    {series.items.map((item, idx) => (
                      <View key={idx} style={styles.itemBubble}>
                        <View style={styles.itemTitleRow}>
                          <Ionicons name="checkmark-circle-outline" size={14} color="#10B981" style={{ marginRight: 6 }} />
                          <Text style={styles.itemName}>{item.name}</Text>
                        </View>
                        <Text style={styles.itemDesc}>{item.desc}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* Quality & Certifications */}
          <View style={styles.qualityCard}>
            <View style={styles.qualityHeader}>
              <Ionicons name="ribbon" size={22} color="#10B981" />
              <Text style={styles.qualityTitle}>Kalite Güvencesi & Sertifikalar</Text>
            </View>
            <Text style={styles.qualityDesc}>
              İmece Sistem, tamamlayıcı tıp standartlarına uygun, hijyenik ve modern tesislerde üretim yapmaktadır. Üretim süreçleri uluslararası standartlara (ISO 9001, ISO 22000 gıda güvenliği yönetim sistemleri ve GMP - İyi Üretim Uygulamaları) uygun olarak sertifikalandırılmıştır.
            </Text>
            <View style={styles.badgeRow}>
              <Text style={styles.qualityBadge}>✓ GMP Uyumlu</Text>
              <Text style={styles.qualityBadge}>✓ ISO 22000</Text>
              <Text style={styles.qualityBadge}>✓ Helal Sertifikalı</Text>
              <Text style={styles.qualityBadge}>✓ Patentli Formül</Text>
            </View>
          </View>

          {/* CTA Card */}
          <View style={styles.ctaCard}>
            <View style={styles.ctaIconBg}>
              <Ionicons name="heart" size={28} color="#10B981" />
            </View>
            <Text style={styles.ctaTitle}>İmece ile Sağlığınızı Desteklemeye Başlayın</Text>
            <Text style={styles.ctaDesc}>
              Tercihli müşteri olarak İmece dünyasına adım atın, patentli gıda takviyelerine ve şifa ürünlerine avantajlı fiyatlarla güvenle ulaşın.
            </Text>
            <TouchableOpacity style={styles.ctaButton} onPress={handleOpenLink} activeOpacity={0.8}>
              <Text style={styles.ctaButtonText}>Tercihli Müşteri Ol & Alışverişe Başla</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </SacredBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  backButtonText: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
  },
  scrollContent: {
    paddingBottom: 50,
  },
  heroSection: {
    padding: 20,
    alignItems: 'center',
    textAlign: 'center',
    marginTop: 20,
  },
  badge: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.25)',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  badgeText: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  heroDesc: {
    fontSize: 14,
    color: '#A0A0B0',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  techHighlights: {
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 30,
  },
  techCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    padding: 20,
  },
  techIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  techCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  techCardDesc: {
    fontSize: 13,
    color: '#8E8E93',
    lineHeight: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(16, 185, 129, 0.2)',
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  seriesContainer: {
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 30,
  },
  seriesCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    padding: 20,
  },
  seriesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  seriesIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  seriesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  seriesDesc: {
    fontSize: 13,
    color: '#A0A0B0',
    lineHeight: 18,
    marginBottom: 16,
  },
  itemsGrid: {
    gap: 10,
  },
  itemBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
  },
  itemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  itemDesc: {
    fontSize: 11,
    color: '#8E8E93',
    lineHeight: 15,
    paddingLeft: 20,
  },
  qualityCard: {
    marginHorizontal: 20,
    backgroundColor: 'rgba(16, 185, 129, 0.04)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.15)',
    padding: 20,
    marginBottom: 30,
  },
  qualityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  qualityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  qualityDesc: {
    fontSize: 13,
    color: '#A0A0B0',
    lineHeight: 18,
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  qualityBadge: {
    fontSize: 11,
    color: '#34D399',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontWeight: '600',
  },
  ctaCard: {
    marginHorizontal: 20,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    padding: 24,
    alignItems: 'center',
    textAlign: 'center',
  },
  ctaIconBg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  ctaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  ctaDesc: {
    fontSize: 13,
    color: '#A0A0B0',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  ctaButton: {
    backgroundColor: '#10B981',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
