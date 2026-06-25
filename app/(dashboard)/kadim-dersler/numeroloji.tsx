import SacredBackground from '@/components/SacredBackground';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground, LayoutAnimation, Platform, UIManager, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { COLORS, SIZES } from '@/src/theme';
import { useContent } from '@/src/core/content/useContent';
import { useProgress } from '@/src/context/ProgressContext';

// LayoutAnimation'u Android'de etkinleştirmek için:
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ESOTERIC_BG = require('@/assets/images/esoteric_bg_indigo.webp');

const showAlert = (title: string, message: string) => {
  if (Platform.OS === 'web') {
    alert(`${title}\n\n${message}`);
  } else {
    Alert.alert(title, message);
  }
};

export default function NumerolojiEgitimScreen() {
  const router = useRouter();
  const { hasAccess, isAdmin } = useProgress();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'cirak' | 'kalfa' | 'ustat'>('cirak');

  const isKalfaUnlocked = hasAccess('numeroloji_2') || isAdmin;
  const isUstatUnlocked = hasAccess('numeroloji_3') || isAdmin;

  const { data: numData } = useContent<Record<number, any>>('/api/content/numerology/meanings');

  // Convert object to array and sort numerically
  const numbersArray = Object.values(numData ?? {}).sort((a: any, b: any) => a.number - b.number);

  return (
    <SacredBackground>

      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={28} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Numeroloji (İnisiyasyon)</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabBtn, activeTab === 'cirak' && styles.tabBtnActive]} 
          onPress={() => setActiveTab('cirak')}
        >
          <Text style={[styles.tabText, activeTab === 'cirak' && styles.tabTextActive]}>1. Derece</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tabBtn, activeTab === 'kalfa' && styles.tabBtnActive, !isKalfaUnlocked && { opacity: 0.5 }]} 
          onPress={() => isKalfaUnlocked ? setActiveTab('kalfa') : showAlert("Derece Kilitli", "Bu dersi/dereceyi açabilmeniz için en az Kalfalık seviyesine ulaşmış olmanız gerekmektedir.")}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {!isKalfaUnlocked && <Ionicons name="lock-closed" size={14} color={COLORS.textMuted} style={{ marginRight: 5 }} />}
            <Text style={[styles.tabText, activeTab === 'kalfa' && styles.tabTextActive]}>2. Derece</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tabBtn, activeTab === 'ustat' && styles.tabBtnActive, !isUstatUnlocked && { opacity: 0.5 }]} 
          onPress={() => isUstatUnlocked ? setActiveTab('ustat') : showAlert("Derece Kilitli", "Bu dersi/dereceyi açabilmeniz için en az Üstatlık seviyesine ulaşmış olmanız gerekmektedir.")}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {!isUstatUnlocked && <Ionicons name="lock-closed" size={14} color={COLORS.textMuted} style={{ marginRight: 5 }} />}
            <Text style={[styles.tabText, activeTab === 'ustat' && styles.tabTextActive]}>3. Derece</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {activeTab === 'cirak' && (
          <View>
            {/* Giriş Bilgisi */}
            <BlurView intensity={30} tint="dark" style={styles.introCard}>
              <Ionicons name="infinite" size={40} color={COLORS.primary} style={{ marginBottom: 15 }} />
          <Text style={styles.introTitle}>Pisagor ve Sayıların Evreni</Text>
          <Text style={styles.introText}>
            "Evrenin dili matematiktir." der Pisagor. Kadim Numeroloji felsefesine göre, var olan her şey belirli bir titreşime sahiptir ve bu titreşimler sayılar aracılığıyla okunabilir. İsimler, tarihler ve olaylar rastgele değildir; 1'den 9'a kadar olan ilkel enerjilerin dansıdır.
          </Text>
          <Text style={[styles.introText, { marginTop: 10 }]}>
            Bu derste, temel sayıların (1-9) ve yüksek frekanslı Üstat Sayıların (11, 22, 33) ezoterik anlamlarını, yönettikleri elementleri ve temsil ettikleri evrensel ilkeleri öğreneceksiniz.
          </Text>
        </BlurView>

        {/* Hesaplama Yöntemleri */}
        <Text style={styles.sectionTitle}>Hesaplama Yöntemleri</Text>

        <View style={styles.methodCard}>
          <Text style={styles.methodTitle}>1. Yaşam Yolu Sayısı (Life Path)</Text>
          <Text style={styles.methodText}>
            Ruhunuzun bu hayattaki rotasını gösterir. Doğum tarihinizdeki (Gün, Ay, Yıl) tüm rakamların tek tek toplanmasıyla bulunur. Çıkan sonuç tek haneye düşene kadar toplanır.
          </Text>
          <Text style={styles.methodExample}>Örnek: 15.08.1990 {"\n"}1+5 + 0+8 + 1+9+9+0 = 33 (Üstat sayı olduğu için sadeleşmez. Olmasaydı tekrar toplanırdı.)</Text>
        </View>

        <View style={styles.methodCard}>
          <Text style={styles.methodTitle}>2. Kader / İfade Sayısı (Destiny)</Text>
          <Text style={styles.methodText}>
            Doğuştan sahip olduğunuz yetenekleri ifade eder. Nüfus cüzdanınızdaki tam adınızın Pisagor tablosundaki sayısal değerlerinin toplanmasıyla bulunur.
          </Text>
          <View style={styles.tableContainer}>
            <Text style={styles.tableText}><Text style={styles.tableHeader}>1:</Text> A, J, S, Ş</Text>
            <Text style={styles.tableText}><Text style={styles.tableHeader}>2:</Text> B, K, T</Text>
            <Text style={styles.tableText}><Text style={styles.tableHeader}>3:</Text> C, Ç, L, U, Ü</Text>
            <Text style={styles.tableText}><Text style={styles.tableHeader}>4:</Text> D, M, V</Text>
            <Text style={styles.tableText}><Text style={styles.tableHeader}>5:</Text> E, N, W</Text>
            <Text style={styles.tableText}><Text style={styles.tableHeader}>6:</Text> F, O, Ö, X</Text>
            <Text style={styles.tableText}><Text style={styles.tableHeader}>7:</Text> G, Ğ, P, Y</Text>
            <Text style={styles.tableText}><Text style={styles.tableHeader}>8:</Text> H, Q, Z</Text>
            <Text style={styles.tableText}><Text style={styles.tableHeader}>9:</Text> I, İ, R</Text>
          </View>
        </View>

        <View style={styles.methodCard}>
          <Text style={styles.methodTitle}>3. Ruh Güdüsü Sayısı (Soul Urge)</Text>
          <Text style={styles.methodText}>
            En derin içsel arzularınızı temsil eder. Yalnızca isminizdeki SESLİ HARFLERİN (A, E, I, İ, O, Ö, U, Ü) sayısal değerlerinin toplanmasıyla bulunur.
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 15 }]}>Sayıların Sırrı</Text>

        {/* Sayıların Listesi */}
        {numbersArray.map((item) => {
          const isExpanded = expandedId === item.number;

          return (
            <TouchableOpacity 
              key={item.number} 
              style={styles.numberCard}
              activeOpacity={0.9}
              onPress={() => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                setExpandedId(isExpanded ? null : item.number);
              }}
            >
              <View style={[styles.cardHeader, !isExpanded && { borderBottomWidth: 0, marginBottom: 0, paddingBottom: 0 }]}>
                <View style={styles.numberBadge}>
                  <Text style={styles.numberText}>{item.number}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 15 }}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                    <Ionicons name="planet-outline" size={14} color={COLORS.primary} />
                    <Text style={styles.planetText}>{item.planet} • {item.element}</Text>
                  </View>
                </View>
                <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={22} color={COLORS.textMuted} />
              </View>

              {isExpanded && (
                <View style={{ marginTop: 20 }}>
                  <View style={styles.traitBox}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                      <Ionicons name="sunny" size={16} color="#FFD700" style={{ marginRight: 6 }} />
                      <Text style={styles.traitTitle}>Işık Yönü (Aydınlık)</Text>
                    </View>
                    <Text style={styles.traitText}>{item.constructivePotentials}</Text>
                  </View>

                  <View style={styles.traitBox}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                      <Ionicons name="moon" size={16} color="#A0A0A0" style={{ marginRight: 6 }} />
                      <Text style={[styles.traitTitle, { color: '#A0A0A0' }]}>Gölge Yönü (Karanlık)</Text>
                    </View>
                    <Text style={styles.traitText}>{item.negativePotentials}</Text>
                  </View>

                  <View style={styles.pathBox}>
                    <Text style={styles.pathTitle}>Kader ve Yaşam Yolunda {item.number}</Text>
                    <Text style={styles.pathText}>{item.lifePathDetails}</Text>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
          </View>
        )}

        {activeTab === 'kalfa' && (
          <View>
            <BlurView intensity={30} tint="dark" style={styles.introCard}>
              <Ionicons name="eye" size={40} color={COLORS.primary} style={{ marginBottom: 15 }} />
              <Text style={styles.introTitle}>Gölgeler, Borçlar ve Zirveler</Text>
              <Text style={styles.introText}>
                Çırak, sayıların sadece ışık yönlerini görür. Bir Kalfa ise gölgelerin içindeki karmik borçları, ruhun eksik frekanslarını ve hayatın 4 büyük 'Zirve' (Pinnacle) döngüsünü okuyabilen kişidir.
              </Text>
            </BlurView>

            <Text style={styles.sectionTitle}>1. Karmik Borçların Bedelleri</Text>
            <View style={styles.methodCard}>
              <Text style={styles.methodText}>
                Karmik borç sayıları, önceki yaşamlardan getirilen ruhsal günahların bedelleridir. Bir hesaplamada sadeleştirme yapmadan önce 13, 14, 16 veya 19 buluyorsanız, bu sayılar spesifik bir borcu işaret eder.
              </Text>
              <Text style={styles.methodExample}>
                • 13 (Tembelliğin Bedeli): Önceki yaşamlarda sorumluluktan kaçanların borcudur. Bu hayatta kişi çok çalışmalı, pes etmemeli ve disiplinli olmalıdır. İşler her zaman zorlu ilerler.{"\n"}
                • 14 (Özgürlüğün Suistimali): Fiziksel zevklerin veya başkalarının özgürlüğünü kısıtlamanın bedelidir. Bağımlılıklardan (alkol, cinsellik vb.) kaçınmak ve esnekliği öğrenmek zorundadır.{"\n"}
                • 16 (Kibrin Yıkımı): İllegal aşklar veya ego ile başkalarının hayatını yıkmanın cezasıdır. Hayatlarında beklenmedik 'Kule' yıkımları yaşarlar. Kibri bırakıp Tanrı'ya teslim olmayı öğrenmelidirler.{"\n"}
                • 19 (Zorbalığın Cezası): Gücün ve otoritenin bencilce kullanılmasının bedelidir. Bu kişiler bu hayatta kimsenin yardımını alamaz, her şeyi tek başlarına yapmak zorunda kalır ve liderliği sevgiyle öğrenirler.
              </Text>
            </View>

            <Text style={styles.sectionTitle}>2. Zirve Döngüleri (Pinnacle Cycles)</Text>
            <View style={styles.methodCard}>
              <Text style={styles.methodText}>
                İnsan hayatı 4 büyük bahar veya "Zirve" dönemine ayrılır. Bu döngüler kişinin o dönemki potansiyelini ve deneyim alanını gösterir.
              </Text>
              <Text style={styles.methodExample}>
                1. Zirve: Doğum Ayı + Doğum Günü (Gençlik ve uyanış yılları){"\n"}
                2. Zirve: Doğum Günü + Doğum Yılı (Orta yaş, aile ve kariyer){"\n"}
                3. Zirve: 1. Zirve + 2. Zirve (Olgunluk ve ustalık dönemi){"\n"}
                4. Zirve: Doğum Ayı + Doğum Yılı (Bilgelik ve ruhsal hasat)
              </Text>
              <Text style={[styles.methodText, { marginTop: 10, color: COLORS.secondary }]}>
                Formül: İlk Zirvenin bitiş yaşı "36 - Yaşam Yolu Sayısı" formülüyle hesaplanır. İkinci ve üçüncü zirveler her zaman tam 9 yıl sürer. Dördüncü zirve ise ölene kadar devam eder.
              </Text>
            </View>

            <Text style={styles.sectionTitle}>3. Eksik Sayılar (Karmic Lessons)</Text>
            <View style={styles.methodCard}>
              <Text style={styles.methodText}>
                Doğum isminizdeki tüm harfler Pisagor tablosuna yerleştirildiğinde (Örn: A=1, B=2...), hiç bulunmayan sayılar sizin "Karmik Dersleriniz" yani eksik frekanslarınızdır.
              </Text>
              <Text style={styles.methodExample}>
                Hiç 1 yoksa: Liderlik ve inisiyatif alma dersi.{"\n"}
                Hiç 4 yoksa: Disiplin, çalışma ve köklenme dersi.{"\n"}
                Hiç 8 yoksa: Parayı yönetme ve otorite kurma dersi.
              </Text>
            </View>
          </View>
        )}

        {activeTab === 'ustat' && (
          <View>
            <BlurView intensity={30} tint="dark" style={styles.introCard}>
              <Ionicons name="star" size={40} color={COLORS.primary} style={{ marginBottom: 15 }} />
              <Text style={styles.introTitle}>Okült Geçitler ve Karanlık Döngüler</Text>
              <Text style={styles.introText}>
                Üstat, zamanın ve kaderin ötesini görür. Keldani sırlarına vakıftır. Zirvelerin aydınlığında değil, "Mücadele Döngülerinin" karanlığında yürümeyi bilir ve zamanın ruhunu okur.
              </Text>
            </BlurView>

            <Text style={styles.sectionTitle}>1. Mücadele Döngüleri (Challenge Cycles)</Text>
            <View style={styles.methodCard}>
              <Text style={styles.methodText}>
                Zirve döngülerinin tam zıttıdır. Numerolojideki çoğu hesaplamanın aksine toplama ile değil, "Çıkarma (Fark Alma)" ile hesaplanır. Hayatınızın karanlık dehlizlerini, içsel şeytanlarınızı ve kör noktalarınızı gösterir. Sonuç her zaman Mutlak Değerdir (Negatif olamaz) ve hiçbir zaman 9 olamaz.
              </Text>
              <Text style={styles.methodExample}>
                1. Mücadele: |Doğum Ayı - Doğum Günü|{"\n"}
                2. Mücadele: |Doğum Günü - Doğum Yılı|{"\n"}
                Ana (3.) Mücadele: |1. Mücadele - 2. Mücadele|{"\n"}
                4. Mücadele: |Doğum Ayı - Doğum Yılı|
              </Text>
            </View>

            <Text style={styles.sectionTitle}>2. Pisagor vs. Keldani (Chaldean) Sistemi</Text>
            <View style={styles.methodCard}>
              <Text style={styles.methodText}>
                Pisagor sistemi 1-9 arası ardışık harf dizilimini (A=1, B=2, C=3) kullanır. Ancak antik Babil kaynaklı Keldani Sistemi çok daha mistiktir. Keldani sisteminde harfler sese dayalı titreşir ve **hiçbir harfin değeri 9 olamaz.** Çünkü 9 kutsal Tanrısal sayıdır ve fani harflere atanamaz.
              </Text>
              <Text style={styles.methodExample}>
                Keldani Tablosu:{"\n"}
                1 = A, I, J, Q, Y{"\n"}
                2 = B, K, R{"\n"}
                3 = C, G, L, S{"\n"}
                4 = D, M, T{"\n"}
                5 = E, H, N, X{"\n"}
                6 = U, V, W{"\n"}
                7 = O, Z{"\n"}
                8 = F, P
              </Text>
            </View>

            <Text style={styles.sectionTitle}>3. Kişisel Zaman Okuması (Zaman Gezginliği)</Text>
            <View style={styles.methodCard}>
              <Text style={styles.methodText}>
                Evren 9 yıllık epik döngülerle hareket eder. Kişisel Yılınız, ruhunuzun o an evrensel tiyatroda hangi sahnede olduğunu söyler.
              </Text>
              <Text style={styles.methodExample}>
                Kişisel Yıl Formülü: Doğum Gününüz + Doğum Ayınız + İçinde Bulunduğumuz Evrensel Yıl (Örn: 2026=10=1).{"\n"}
                Eğer bu toplam örneğin 9 çıkıyorsa; bu sizin için hasat, bitiş ve temizlik yılıdır.
              </Text>
            </View>

            <Text style={styles.sectionTitle}>4. Temel Taşı ve Zirve Taşı</Text>
            <View style={styles.methodCard}>
              <Text style={styles.methodText}>
                Bir kişinin ismindeki **İlk Harf (Temel Taşı - Cornerstone)** onun hayata karşı ilk reaksiyonunu, ilk savunma mekanizmasını gösterir. **Son Harf (Zirve Taşı - Capstone)** ise bir projeyi nasıl tamamladığını veya sorunları nasıl sonlandırdığını gösterir. İlk Sesli Harf ise ruhun dünyevi dünyaya bakan ilk penceresidir.
              </Text>
            </View>
          </View>
        )}

        <View style={{ height: 50 }} />
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
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.2)',
    backgroundColor: 'rgba(10, 15, 30, 0.5)',
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBtnActive: {
    borderBottomWidth: 3,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  scrollContent: { padding: 20 },
  
  introCard: {
    padding: 25,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.4)',
    alignItems: 'center',
    marginBottom: 30,
    overflow: 'hidden'
  },
  introTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFCC00', marginBottom: 15, textAlign: 'center' },
  introText: { fontSize: 15, color: COLORS.text, textAlign: 'center', lineHeight: 24, opacity: 0.9 },
  
  methodCard: {
    backgroundColor: 'rgba(212, 175, 55, 0.05)',
    borderRadius: SIZES.radius,
    padding: 20,
    marginBottom: 15,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  methodTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary, marginBottom: 8 },
  methodText: { fontSize: 14, color: COLORS.text, lineHeight: 22, opacity: 0.85 },
  methodExample: { fontSize: 13, color: '#FF9500', marginTop: 10, fontStyle: 'italic', backgroundColor: 'rgba(0,0,0,0.3)', padding: 10, borderRadius: 5 },
  tableContainer: { marginTop: 15, flexDirection: 'row', flexWrap: 'wrap', backgroundColor: 'rgba(0,0,0,0.4)', padding: 15, borderRadius: 8 },
  tableText: { width: '33%', fontSize: 14, color: COLORS.text, marginBottom: 8 },
  tableHeader: { fontWeight: 'bold', color: COLORS.primary },

  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 20,
    marginLeft: 5,
  },

  numberCard: {
    backgroundColor: 'rgba(20, 25, 40, 0.7)',
    borderRadius: SIZES.radius,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.1)',
  },
  numberBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFCC00',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  planetText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '500',
    marginLeft: 5,
  },
  traitBox: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  traitTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  traitText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 22,
    opacity: 0.85,
  },
  pathBox: {
    marginTop: 10,
    paddingLeft: 15,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  pathTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 6,
  },
  pathText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 22,
    fontStyle: 'italic',
    opacity: 0.8,
  }
});
