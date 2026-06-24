import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useProgress } from '../../../src/context/ProgressContext';

const COLORS = {
  background: '#0B0F19',
  primary: '#D4AF37', // Gold
  secondary: '#8A2BE2', // Purple
  tertiary: '#FF453A', // Red
  text: '#E0E0E0',
  textMuted: '#9CA3AF',
  cardBg: 'rgba(20, 25, 40, 0.7)',
  highlight: 'rgba(212, 175, 55, 0.15)',
};

export default function YogaCurriculumScreen() {
  const [activeTab, setActiveTab] = useState<'cirak' | 'kalfa' | 'ustat'>('cirak');
  const { hasAccess, isAdmin } = useProgress();

  const handleTabPress = (tab: 'cirak' | 'kalfa' | 'ustat') => {
    if (tab === 'kalfa' && !(hasAccess('yoga_2') || isAdmin)) {
      alert("Bu dersi/dereceyi açabilmeniz için en az Kalfalık seviyesine ulaşmış olmanız gerekmektedir.");
      return;
    }
    if (tab === 'ustat' && !(hasAccess('yoga_master') || isAdmin)) {
      alert("Bu dersi/dereceyi açabilmeniz için en az Üstatlık seviyesine ulaşmış olmanız gerekmektedir.");
      return;
    }
    setActiveTab(tab);
  };

  return (
    <ImageBackground 
      source={{ uri: 'https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?q=80&w=2070&auto=format&fit=crop' }} 
      style={styles.container}
      blurRadius={10}
    >
      <View style={styles.overlay} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Yoga Asanaları</Text>
          <Text style={styles.subtitle}>Bedenin, Zihnin ve Ruhun Ezoterik Birleşimi</Text>
        </View>

        {/* Sekmeler (Tabs) */}
        <View style={styles.tabContainer}>
          <TouchableOpacity style={[styles.tab, activeTab === 'cirak' && styles.activeTab]} onPress={() => handleTabPress('cirak')}>
            <Text style={[styles.tabText, activeTab === 'cirak' && styles.activeTabText]}>I. Çırak</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, activeTab === 'kalfa' && styles.activeTab, !(hasAccess('yoga_2') || isAdmin) && { opacity: 0.5 }]} onPress={() => handleTabPress('kalfa')}>
            <Text style={[styles.tabText, activeTab === 'kalfa' && styles.activeTabText]}>
              {!(hasAccess('yoga_2') || isAdmin) && <Ionicons name="lock-closed" size={14} color={COLORS.textMuted} />} II. Kalfa
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, activeTab === 'ustat' && styles.activeTab, !(hasAccess('yoga_master') || isAdmin) && { opacity: 0.5 }]} onPress={() => handleTabPress('ustat')}>
            <Text style={[styles.tabText, activeTab === 'ustat' && styles.activeTabText]}>
              {!(hasAccess('yoga_master') || isAdmin) && <Ionicons name="lock-closed" size={14} color={COLORS.textMuted} />} III. Üstat
            </Text>
          </TouchableOpacity>
        </View>

        {/* I. ÇIRAK SEKME İÇERİĞİ */}
        {activeTab === 'cirak' && (
          <View>
            <BlurView intensity={30} tint="dark" style={styles.introCard}>
              <Ionicons name="leaf" size={40} color={COLORS.primary} style={{ marginBottom: 15 }} />
              <Text style={styles.introTitle}>Köklenme ve Felsefe</Text>
              <Text style={styles.introText}>
                <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Yoga</Text> kelimesi, Sanskritçe <Text style={{fontWeight: 'bold', color: COLORS.primary}}>"Yuj"</Text> kökünden gelir ve <Text style={{fontWeight: 'bold', color: COLORS.primary}}>"Bütünleşmek/Birleşmek"</Text> anlamına gelir. Bireysel ruhun evrensel ruhla birleştiği, egonun eridiği yerdir.
              </Text>
            </BlurView>

            <Image source={{ uri: 'https://mbqjklupfoqbcfxusigs.supabase.co/storage/v1/object/public/app-assets/images/yoga/neophyte_lotus.png' }} style={styles.heroImage} resizeMode="cover" />

            <Text style={styles.sectionTitle}>1. Ashtanga: 8 Basamaklı Yol</Text>
            <View style={styles.methodCard}>
              <Text style={styles.methodText}>
                Bilge <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Patanjali</Text>'nin kurduğu sisteme <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Ashtanga (8 Uzuv)</Text> denir. Bu basamaklar şunlardır:
              </Text>
              <Text style={styles.methodExample}>
                1. Yama (Ahlaki Disiplinler){"\n"}
                2. Niyama (Kişisel Gözlemler){"\n"}
                3. Asana (Fiziksel Duruşlar){"\n"}
                4. Pranayama (Nefes Kontrolü){"\n"}
                5. Pratyahara (Duyuları Geri Çekme){"\n"}
                6. Dharana (Odaklanma){"\n"}
                7. Dhyana (Meditasyon){"\n"}
                8. Samadhi (Mutlak Birleşme)
              </Text>
            </View>

            <Text style={styles.sectionTitle}>2. Asana: Rahat ve Sabit Duruş</Text>
            <View style={styles.methodCard}>
              <Text style={styles.methodText}>
                Patanjali'ye göre <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Asana'nın tam anlamı "Rahat ve Sabit Oturuş/Duruş"</Text> demektir (Sthiram sukham asanam). Temel asanalarımız:
              </Text>
              <View style={styles.highlightBox}>
                <Text style={styles.methodExample}>
                  • <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Tadasana (Dağ Pozu):</Text> Köklenmenin ve ayakta duruşun en temel asanasıdır. Tüm ayakta pozların anasıdır.{"\n"}
                  • <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Balasana (Çocuk Pozu):</Text> Dinlenme, içe dönme ve ego teslimiyeti pozudur. Sistem burada sakinleşir.{"\n"}
                  • <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Vriksasana (Ağaç Pozu):</Text> Tek ayak üzerinde denge pozudur. Zihni sabitlemek için bakışları <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Drishti'ye (Odak Noktası)</Text> kilitleriz.{"\n"}
                  • <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Savasana (Ceset Pozu):</Text> Dersin <Text style={{fontWeight: 'bold', color: COLORS.primary}}>en sonunda uygulanan</Text> yatarak dinlenme pozudur. Amacı tüm pratiğin hücresel entegrasyonudur.
                </Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>3. Pranayama: Yaşam Enerjisi</Text>
            <View style={styles.methodCard}>
              <Text style={styles.methodText}>
                <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Pranayama, yaşam enerjisini (Nefesi) kontrol etmektir.</Text>
              </Text>
              <Text style={styles.methodExample}>
                • <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Ujjayi Nefesi:</Text> Glottis kaslarının hafif sıkılmasıyla yaratılan <Text style={{fontWeight: 'bold', color: COLORS.primary}}>"Okyanus dalgası sesi"</Text> çıkaran nefestir. Bedeni içten ısıtır.
              </Text>
            </View>
          </View>
        )}

        {/* II. KALFA SEKME İÇERİĞİ */}
        {activeTab === 'kalfa' && (
          <View>
            <BlurView intensity={30} tint="dark" style={styles.introCard}>
              <Ionicons name="flame" size={40} color={COLORS.primary} style={{ marginBottom: 15 }} />
              <Text style={styles.introTitle}>Enerji Akışları ve Kilitler</Text>
              <Text style={styles.introText}>
                Hatha Yoga kelimesindeki <Text style={{fontWeight: 'bold', color: COLORS.primary}}>"Ha" Güneşi, "Tha" Ayı</Text> temsil eder. Kalfa, nefes ile hareketi (<Text style={{fontWeight: 'bold', color: COLORS.primary}}>Vinyasa</Text>) mükemmel senkronize eden kişidir.
              </Text>
            </BlurView>

            <Image source={{ uri: 'https://mbqjklupfoqbcfxusigs.supabase.co/storage/v1/object/public/app-assets/images/yoga/surya_namaskar.png' }} style={styles.heroImage} resizeMode="contain" />

            <Text style={styles.sectionTitle}>1. Surya Namaskar & Akış Dinamikleri</Text>
            <View style={styles.methodCard}>
              <Text style={styles.methodText}>
                <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Surya Namaskar (Güneşe Selam):</Text> Tam <Text style={{fontWeight: 'bold', color: COLORS.primary}}>12 asanadan</Text> oluşan ardışık kozmik bir döngüdür. Kurucusu <Text style={{fontWeight: 'bold', color: COLORS.primary}}>K. Pattabhi Jois</Text> olan Ashtanga Vinyasa sisteminin belkemiğidir.
              </Text>
              <View style={styles.highlightBox}>
                <Text style={styles.methodExample}>
                  • <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Adho Mukha Svanasana (Aşağı Bakan Köpek):</Text> Göğüs kafesi yere eridiği için en çok <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Kalp Çakrasını</Text> uyarır.{"\n"}
                  • <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Chaturanga Dandasana:</Text> Şınavın alt pozisyonudur. <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Omuzlar dirsek hizasında, kollar kaburgalara yapışık</Text> olmalıdır.{"\n"}
                  • <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Kobra vs Yukarı Bakan Köpek:</Text> <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Kobra (Bhujangasana)'da kalça ve uyluklar YERDEDİR.</Text> Yukarı Bakan Köpekte ise dizler ve kalça HAVADADIR.{"\n"}
                  • <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Virabhadrasana (Savaşçı Pozları):</Text> Hindu efsanesine göre Shiva'nın öfkesiyle saç telinden yarattığı savaşçıdır. Egoyla olan savaşı temsil eder.{"\n"}
                  • <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Kapotasana (Güvercin Pozu):</Text> Derin bir <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Kalça Açıcıdır</Text>. Yogaya göre <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Psoas (Kalça) kası "Duygu Çöplüğüdür"</Text> ve travmalar en çok burada depolanır.
                </Text>
              </View>
            </View>

            <Image source={{ uri: 'https://mbqjklupfoqbcfxusigs.supabase.co/storage/v1/object/public/app-assets/images/yoga/nadis_anatomy.png' }} style={styles.heroImage} resizeMode="contain" />

            <Text style={styles.sectionTitle}>2. Enerji Anatomisi (Nadi ve Vayu)</Text>
            <View style={styles.methodCard}>
              <Text style={styles.methodText}>
                Fiziksel bedenin ötesinde, prana enerjisi 72.000 <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Nadi (Kanal)</Text> içinde akar. Hatha Pradipika'ya göre hastalıkların sebebi <Text style={{fontWeight: 'bold', color: COLORS.primary}}>bu nadilerdeki tıkanıklıklardır.</Text>
              </Text>
              <View style={styles.highlightBox}>
                <Text style={styles.methodExample}>
                  • <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Ida Nadi:</Text> Sol burun deliği ile bağlantılı, Ay (Dişil/Serinletici) kanalıdır.{"\n"}
                  • <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Pingala Nadi:</Text> Sağ burun deliği ile bağlantılı, Güneş (Eril/Isıtıcı) kanalıdır.{"\n"}
                  • <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Sushumna Nadi:</Text> Omurganın tam ortasından geçen <Text style={{fontWeight: 'bold', color: COLORS.primary}}>ana enerji kanalıdır.</Text>{"\n"}
                  • <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Nadi Shodhana Nefesi:</Text> Dönüşümlü burun nefesidir. <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Sağ ve sol beyni (Güneş-Ay enerjilerini) dengeler.</Text>{"\n"}
                  • <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Apana Vayu:</Text> Bedendeki 5 rüzgardan biridir, <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Aşağı doğru akan boşaltım ve topraklanma</Text> enerjisidir.
                </Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>3. Bandhalar (Enerji Kilitleri)</Text>
            <View style={styles.methodCard}>
              <Text style={styles.methodText}>Enerjinin sızmasını önleyen fiziksel kilitlerdir.</Text>
              <Text style={styles.methodExample}>
                • <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Mula Bandha:</Text> Pelvik taban kaslarının sıkılmasıdır.{"\n"}
                • <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Uddiyana Bandha:</Text> Karın vakumudur. <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Sadece nefes tamamen VERİLDİKTEN SONRA uygulanır.</Text>{"\n"}
                • <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Jalandhara Bandha:</Text> <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Çenenin göğse (sternum) kilitlenmesidir.</Text>{"\n"}
                • <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Maha Bandha (Büyük Kilit):</Text> <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Üç kilidin aynı anda uygulanmasıdır.</Text>
              </Text>
            </View>
          </View>
        )}

        {/* III. ÜSTAT SEKME İÇERİĞİ */}
        {activeTab === 'ustat' && (
          <View>
            <BlurView intensity={30} tint="dark" style={styles.introCard}>
              <Ionicons name="infinite" size={40} color={COLORS.primary} style={{ marginBottom: 15 }} />
              <Text style={styles.introTitle}>Sırların Zirvesi ve Aydınlanma</Text>
              <Text style={styles.introText}>
                Üstat; illüzyon perdesini kaldıran, <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Kundaliniyi</Text> uyandıran ve Samadhi'ye ulaşan ruhani kâşiftir. Tantrik felsefede Güneş ve Ay (Pingala ve Ida) <Text style={{fontWeight: 'bold', color: COLORS.primary}}>3. Gözde (Ajna) birleştiğinde dualite biter.</Text>
              </Text>
            </BlurView>

            <Image source={{ uri: 'https://mbqjklupfoqbcfxusigs.supabase.co/storage/v1/object/public/app-assets/images/yoga/master_kundalini.png' }} style={styles.heroImage} resizeMode="contain" />

            <Text style={styles.sectionTitle}>1. Kundalini ve İleri Pratikler</Text>
            <View style={styles.methodCard}>
              <View style={styles.highlightBox}>
                <Text style={styles.methodExample}>
                  • <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Kundalini:</Text> Kök çakrada <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Kuyruk Sokumu tabanında (3.5 kez kıvrılmış)</Text> uyuyan sembolik yılan ateşidir.{"\n"}
                  • <Text style={{fontWeight: 'bold', color: COLORS.primary}}>3 Granthi (Düğüm):</Text> Kundalini yükselirken <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Brahma, Vishnu ve Rudra düğümlerini (Granthi)</Text> delmek zorundadır.{"\n"}
                  • <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Kriya Yoga:</Text> Yogananda'ya göre <Text style={{fontWeight: 'bold', color: COLORS.primary}}>prana enerjisini doğrudan omurga etrafında dolaştırarak</Text> evrimi hızlandıran sistemdir.{"\n"}
                  • <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Sirsasana (Baş Duruşu):</Text> Taç çakradan damlayan <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Amrita (Nektar)</Text> ateş çakrasında yanıp bitmesin diye süreci tersine çevirir. Bu yüzden Asanaların Kralıdır.{"\n"}
                  • <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Padmasana (Lotus):</Text> Topukların basıncı sayesinde <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Apana (Aşağı akan) enerjisini yukarı iterek</Text> meditasyonu kilitler.
                </Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>2. Mudralar, Mantralar ve Uyku</Text>
            <View style={styles.methodCard}>
              <Text style={styles.methodExample}>
                • <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Kechari Mudra:</Text> Sırların sırrıdır. <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Dilin genze kıvrılarak</Text> epifizden damlayan Soma nektarını yakalamasıdır.{"\n"}
                • <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Jnana Mudra:</Text> İşaret (Ego) ve Başparmak (Evren) birleşimidir.{"\n"}
                • <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Mantra Gücü:</Text> Anlama değil, <Text style={{fontWeight: 'bold', color: COLORS.primary}}>ses titreşimlerinin (Naad) epifiz bezini ve çakraları yeniden kodlamasına</Text> dayanır.{"\n"}
                • <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Trataka:</Text> <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Ajna (3. Göz)</Text> çakrasını uyarmak için muma sabit bakıştır.{"\n"}
                • <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Yoga Nidra:</Text> Bilincin uyanık kaldığı <Text style={{fontWeight: 'bold', color: COLORS.primary}}>"Bilinçli Uyku"</Text> şifa sistemidir.{"\n"}
                • <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Savasana Sırrı:</Text> Bedeni terk edip astral uyanıklığın provasını yapmaktır, <Text style={{fontWeight: 'bold', color: COLORS.primary}}>"Bilinçli Ölü Taklidi"</Text> olarak bilinir.
              </Text>
            </View>

            <Text style={styles.sectionTitle}>3. Samadhi ve Felsefi Derinlik</Text>
            <View style={styles.methodCard}>
              <Text style={styles.methodText}>Patanjali'nin 8. basamağının ötesine geçen son sırlar:</Text>
              <View style={styles.highlightBox}>
                <Text style={styles.methodExample}>
                  • <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Pratyahara:</Text> <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Duyu organlarının</Text> dış dünyadan tamamen geri çekilmesidir.{"\n"}
                  • <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Samyama:</Text> Son 3 uzvun (<Text style={{fontWeight: 'bold', color: COLORS.primary}}>Dharana, Dhyana, Samadhi</Text>) kesintisiz birleşik akışıdır.{"\n"}
                  • <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Kleshas (Izdıraplar):</Text> Patanjali'ye göre acıların EN TEMEL nedeni <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Avidya (Cehâlet/Gerçeği görememe)</Text>'dir.{"\n"}
                  • <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Karma Yoga:</Text> <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Eylemin sonucundan beklenti duymadan</Text> hizmet etmektir.{"\n"}
                  • <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Ahimsa:</Text> Düşüncede, sözde ve eylemde <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Şiddetsizliktir</Text>.{"\n"}
                  • <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Samadhi:</Text> <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Gözlemleyen ile gözlemlenenin BİR olmasıdır</Text>. Son evresi <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Nirvikalpa Samadhi</Text>, egonun tohumsuz ve mutlak geri dönüşsüz yıkımıdır.
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(11, 15, 25, 0.85)', 
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textMuted,
    fontStyle: 'italic',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 4,
    marginBottom: 30,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    color: COLORS.textMuted,
    fontWeight: '600',
    fontSize: 14,
  },
  activeTabText: {
    color: COLORS.background,
    fontWeight: 'bold',
  },
  introCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    marginBottom: 30,
    overflow: 'hidden',
  },
  introTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
  },
  introText: {
    fontSize: 15,
    color: COLORS.textMuted,
    lineHeight: 24,
  },
  heroImage: {
    width: '100%',
    height: 250,
    borderRadius: 16,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 15,
    marginTop: 10,
  },
  methodCard: {
    backgroundColor: COLORS.cardBg,
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
    marginBottom: 25,
  },
  methodText: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 24,
    marginBottom: 12,
  },
  highlightBox: {
    backgroundColor: COLORS.highlight,
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)'
  },
  methodExample: {
    fontSize: 14,
    color: COLORS.textMuted,
    lineHeight: 24,
  },
});
