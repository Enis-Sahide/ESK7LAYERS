import SacredBackground from '@/components/SacredBackground';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES } from '@/src/theme';
import { apiFetch } from '@/src/core/api/client';
import { API_BASE_URL } from '@/src/core/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useProgress } from '@/src/context/ProgressContext';
import Slider from '@react-native-community/slider';

interface KpHistoryItem {
  time: string;
  kp: number;
  predicted?: boolean;
}

interface RealSchumannRow {
  time_tomsk: string;
  time_utc: string;
  a1: number;
  f1: number;
  q1: number;
  a2: number;
  f2: number;
  q2: number;
  a3: number;
  f3: number;
  q3: number;
  a4: number;
  f4: number;
  q4: number;
}

interface KpData {
  current_kp: number;
  status_label: string;
  status_desc: string;
  updated_at: string;
  history: KpHistoryItem[];
  cosmic_impact_score?: number;
  cosmic_status_label?: string;
  cosmic_status_desc?: string;
  schumann_real?: RealSchumannRow;
  peak_a1_24h?: number;
  peak_score_24h?: number;
}

export default function SchumannScreen() {
  const router = useRouter();
  const { role, isAdmin } = useProgress();
  const isApprenticeOrAbove = role === 'apprentice' || role === 'journeyman' || role === 'master' || role === 'admin' || isAdmin;
  const [data, setData] = useState<KpData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [imageTimestamp, setImageTimestamp] = useState<number>(Date.now());
  const [simulatedA1, setSimulatedA1] = useState<number | null>(null);
  const getResonanceColor = (kp: number) => {
    const stops = [
      { kp: 0.0, r: 0, g: 110, b: 140 },   // Deep green-blue (quiet)
      { kp: 2.0, r: 16, g: 185, b: 129 },  // Emerald green (normal)
      { kp: 3.5, r: 245, g: 158, b: 11 },  // Amber/yellow (unsettled)
      { kp: 4.3, r: 249, g: 115, b: 22 },  // Orange (active)
      { kp: 4.8, r: 239, g: 68, b: 68 },   // Red (high)
      { kp: 5.2, r: 255, g: 255, b: 255 }  // Solid white (storm)
    ];

    let low = stops[0];
    let high = stops[stops.length - 1];

    for (let i = 0; i < stops.length - 1; i++) {
      if (kp >= stops[i].kp && kp <= stops[i + 1].kp) {
        low = stops[i];
        high = stops[i + 1];
        break;
      }
    }

    const range = high.kp - low.kp;
    const factor = range === 0 ? 0 : (kp - low.kp) / range;

    return {
      r: low.r + (high.r - low.r) * factor,
      g: low.g + (high.g - low.g) * factor,
      b: low.b + (high.b - low.b) * factor
    };
  };

  const getSchumannScoreFromA1 = (a1: number) => {
    if (a1 <= 0) return 0.5;
    if (a1 < 8.0) {
      return parseFloat((0.5 + (a1 / 8.0) * 2.4).toFixed(2));
    } else if (a1 < 15.0) {
      return parseFloat((3.0 + ((a1 - 8.0) / 7.0) * 1.9).toFixed(2));
    } else if (a1 < 25.0) {
      return parseFloat((5.0 + ((a1 - 15.0) / 10.0) * 0.9).toFixed(2));
    } else if (a1 < 40.0) {
      return parseFloat((6.0 + ((a1 - 25.0) / 15.0) * 0.9).toFixed(2));
    } else if (a1 < 55.0) {
      return parseFloat((7.0 + ((a1 - 40.0) / 15.0) * 0.9).toFixed(2));
    } else if (a1 < 70.0) {
      return parseFloat((8.0 + ((a1 - 55.0) / 15.0) * 0.9).toFixed(2));
    } else {
      return parseFloat((9.0 + Math.min(1.0, ((a1 - 70.0) / 30.0) * 1.0)).toFixed(2));
    }
  };

  const getSchumannGLevel = (a1: number) => {
    if (a1 < 8.0) return 'G0';
    if (a1 < 15.0) return 'G0';
    if (a1 < 25.0) return 'G1';
    if (a1 < 40.0) return 'G2';
    if (a1 < 55.0) return 'G3';
    if (a1 < 70.0) return 'G4';
    return 'G5';
  };

  const getScoreTextColor = (a1: number) => {
    if (a1 < 8.0) return '#000000'; // Black text on Cyan background
    if (a1 >= 40.0) return '#000000'; // Black text on White background
    return '#FFFFFF'; // White text on other backgrounds
  };

  const fetchData = async (showPulse = true) => {
    if (showPulse) setLoading(true);
    setImageTimestamp(Date.now());
    try {
      const res = await apiFetch(`/api/schumann?t=${Date.now()}`);
      if (res) {
        setData(res);
      }
    } catch (e) {
      console.error('Error fetching Schumann in mobile:', e);
      Alert.alert('Hata', 'Rezonans verileri alınamadı. Lütfen internet bağlantınızı kontrol edin.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Poll every 5 minutes
    const interval = setInterval(() => fetchData(false), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getKpColor = (kp: number) => {
    if (kp < 3) return '#10B981'; // Sakin (Yeşil)
    if (kp < 4) return '#F59E0B'; // Aktif (Sarı)
    if (kp < 5) return '#F97316'; // Kararsız (Turuncu)
    return '#EF4444'; // Fırtına (Kırmızı)
  };

  const getScoreColor = (a1: number) => {
    if (a1 < 8.0) return '#00E5FF'; // Mavi (Cyan)
    if (a1 < 15.0) return '#10B981'; // Yeşil (Green)
    if (a1 < 40.0) return '#EF4444'; // G1-G2: Kırmızı (Red)
    return '#FFFFFF'; // G3-G5: Beyaz (White)
  };

  const getSchumannLevelLabel = (a1: number) => {
    if (a1 < 8.0) return 'Düşük Seviye (Sakin / G0)';
    if (a1 < 15.0) return 'Hafif Uyarım (Aktif / G0)';
    if (a1 < 25.0) return 'Hafif Fırtına (G1 Seviyesi)';
    if (a1 < 40.0) return 'Orta Fırtına (G2 Seviyesi)';
    if (a1 < 55.0) return 'Güçlü Fırtına (G3 Seviyesi)';
    if (a1 < 70.0) return 'Ağır Fırtına (G4 Seviyesi)';
    return 'Zirve Patlama (Ekstrem G5 Fırtınası)';
  };

  const getSchumannEsotericTitle = (a1: number) => {
    if (a1 < 8.0) return 'Topraklanma & Entegrasyon';
    if (a1 < 15.0) return 'Hafif Uyarım & Uyanış Kapısı';
    if (a1 < 25.0) return 'Kalp Çakrası Açılımı & Sezgi Sıçraması';
    if (a1 < 40.0) return 'DNA Aktivasyonu & Astral Kapı';
    if (a1 < 55.0) return 'Taç Çakra Portalı & Işık Gövde Geçişi';
    if (a1 < 70.0) return 'Boyutlar Arası Geçiş & Hücresel Simya';
    return 'Ekstrem Kozmik Bütünleşme & Hücresel Simya';
  };

  const getSchumannEsotericDesc = (a1: number) => {
    if (a1 < 8.0) return 'Enerji alanı dengelidir. Alınan kozmik bilgilerin entegrasyonu, meditasyon ve köklenmek için en uygun zamandır.';
    if (a1 < 15.0) return 'Hafif uyarım fazı. Rüyalarda netleşme ve aurada temizlik başlar. Yeni frekanslara uyumlanmak için kapı açılmıştır.';
    if (a1 < 25.0) return 'Kalp merkezinde genişleme, yüksek empati ve sezgisel yeteneklerde artış görülür. Bedenin elektromanyetik alanı genişler.';
    if (a1 < 40.0) return 'Güçlü plazma akışı devrededir. Işık kodlarının DNA sarmallarına entegrasyonu başlar. Astral seyahat deneyimleri sıklaşabilir.';
    if (a1 < 55.0) return 'Taç çakradan yüksek miktarda kozmik ışık girişi olur. Zaman algısında bükülmeler ve yüksek boyutlu rehberlik alımı gerçekleşir.';
    if (a1 < 70.0) return 'Hücresel düzeyde simyasal dönüşüm dalgası. Kollektif bilinçte büyük uyanış tetiklemeleri, yüksek boyutlu portalların tam açılışı.';
    return 'Zirve enerjisel portal devrede. Sinir sisteminin en yüksek kapasitede çalışması ve kozmik bilinçle bütünleşme anıdır. Bol dinlenme ve topraklanma gerekir.';
  };


  const formatTime = (timeStr: string) => {
    try {
      const d = new Date(timeStr.endsWith('Z') ? timeStr : timeStr + 'Z');
      const dayNames = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
      const day = dayNames[d.getDay()];
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      return `${day} ${hours}:${minutes}`;
    } catch (e) {
      return timeStr;
    }
  };

  const formatRealTime = (utcTimeStr?: string) => {
    if (!utcTimeStr) return '---';
    try {
      const d = new Date(utcTimeStr);
      return d.toLocaleString('tr-TR', {
        dateStyle: 'medium',
        timeStyle: 'short'
      });
    } catch (e) {
      return utcTimeStr;
    }
  };

  const formatTomskTime = (utcTimeStr?: string) => {
    if (!utcTimeStr) return '---';
    try {
      const d = new Date(utcTimeStr);
      const tomskDate = new Date(d.getTime() + 7 * 60 * 60 * 1000);
      return tomskDate.toLocaleString('tr-TR', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'UTC'
      });
    } catch (e) {
      return utcTimeStr;
    }
  };

  const formatTimeRange = (timeStr: string) => {
    try {
      const dStart = new Date(timeStr.endsWith('Z') ? timeStr : timeStr + 'Z');
      const dEnd = new Date(dStart.getTime() + 3 * 60 * 60 * 1000);
      const dayNames = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
      
      const startDay = dayNames[dStart.getDay()];
      const startHours = String(dStart.getHours()).padStart(2, '0');
      
      const endDay = dayNames[dEnd.getDay()];
      const endHours = String(dEnd.getHours()).padStart(2, '0');
      
      if (startDay !== endDay) {
        return `${startDay} ${startHours}:00 - ${endDay} ${endHours}:00`;
      }
      return `${startDay} ${startHours}:00 - ${endHours}:00`;
    } catch (e) {
      return timeStr;
    }
  };

  const getSimulatedStatus = (kpVal: number) => {
    if (kpVal < 3.0) {
      return {
        label: 'Sakin Jeomanyetik Alan',
        desc: 'Manyetik alan sakin. Enerji akışları dengeli ve entegrasyon için elverişli. İçsel huzur ve meditasyon çalışmaları için uygun bir zaman.'
      };
    } else if (kpVal < 4.0) {
      return {
        label: 'Aktif Kozmik Enerji',
        desc: 'Manyetik alanda aktif kıpırdanmalar var. Hücrelerde hafif bir uyarım, rüyalarda canlanma veya geçici uykusuzluk hissedilebilir.'
      };
    } else if (kpVal < 5.0) {
      return {
        label: 'Yoğun Jeomanyetik Hareketlilik',
        desc: 'Jeomanyetik hareketlilik yoğunlaşıyor. Baş ağrısı, sezgilerde artış ve enerjisel hassasiyet gözlemlenebilir. Topraklanmaya önem verin.'
      };
    } else {
      let gLevel = 'G1';
      let gDesc = 'Küçük';
      if (kpVal >= 9.0) { gLevel = 'G5'; gDesc = 'Sıra Dışı'; }
      else if (kpVal >= 8.0) { gLevel = 'G4'; gDesc = 'Şiddetli'; }
      else if (kpVal >= 7.0) { gLevel = 'G3'; gDesc = 'Güçlü'; }
      else if (kpVal >= 6.0) { gLevel = 'G2'; gDesc = 'Orta'; }
      else { gLevel = 'G1'; gDesc = 'Küçük'; }

      return {
        label: `JEOMANYETİK FIRTINA: ${gLevel} (${gDesc})`,
        desc: `Güçlü kozmik enerji fırtınası devrede! NOAA G-Skalasına göre ${gLevel} seviyesinde ${gDesc.toLowerCase()} jeomanyetik fırtına yaşanmaktadır. Hücresel uyanış portalları açık. Fiziksel yorgunluk, yoğun rüyalar ve yüksek enerjisel titreşim dalgaları olasıdır.`
      };
    }
  };

  const FALLBACK_SCHUMANN_RULES = [
    {
      minScore: '0.0',
      title: 'Dingin Elektromanyetik Akış (Sakin Faz)',
      symptoms: 'Zihinsel netlik, dengeli enerji seviyeleri, sakin uyku düzeni ve bedensel rahatlık. Olağanüstü bir uyarılma belirtisi beklenmez.',
      spiritual: 'Zihnin gürültüsünü yatıştırmak, yeni bilgiler öğrenmek, kadim dersleri çalışmak ve kök çakra meditasyonları yapmak için en ideal dönemdir. Enerjinizin merkezlendiği bu dingin zamanı tefekkür ile değerlendirebilirsiniz.'
    },
    {
      minScore: '3.0',
      title: 'Hafif Schumann Dalgalanması (Hafif Uyarım Seviyesi)',
      symptoms: 'Rüyalarda belirgin netleşme ve sembolizm artışı, sezgisel uyanışlar, zihinde yaratıcı fikir patlamaları, kulaklarda hafif dalgalı uğultular ve hafif tatlı bir yorgunluk/esneme hali.',
      spiritual: 'Uyanış kapıları hafifçe uyarılmaktadır. Meditasyon, günlük tutma, rüya analizleri yapma ve yaratıcı projelere odaklanma için harika bir akıştır. Üçüncü göz bölgesine mavi/mor bir ışık hayal ederek odaklanabilirsiniz.'
    },
    {
      minScore: '5.0',
      title: 'Aktif Schumann Manyetik Fırtınası (G1-G2 Seviyesi)',
      symptoms: 'Kalp atışlarında ani hızlanma veya genişleme hissi, vücutta hafif statik elektrik birikimi (dokunulan yerlerin çarpması), hafif eklem ve şakak ağrıları, uykuya dalmakta gecikme ve içsel sabırsızlık.',
      spiritual: 'Kalp çakrası ve aura alanı genişlemektedir. Bedendeki fazla elektriği boşaltmak için tuzlu su banyosu yapın veya çıplak elle toprağa dokunun. Kalp merkezli nefes pratikleri (4 saniye al, 4 saniye ver) yaparak kozmik akışı bedende dengeleyin.'
    },
    {
      minScore: '7.0',
      title: 'Şiddetli Schumann Fırtınası (G3 Seviyesi)',
      symptoms: 'Sinir sisteminde belirgin uyarılma, uyku düzeninde dalgalanmalar (derin uykusuzluk ya da rüya yoğunluğu), baş ve ense bölgesinde hafif basınç, kulaklarda kesintisiz tiz çınlamalar ve çok canlı, sembolik rüyalar.',
      spiritual: 'DNA sarmallarında uyarım ve ışık kodlarının entegrasyonu aktiftir. Bedeninizi yormadan hafif egzersizler yapın. Bol su tüketin, topraklanın ve yüksek frekanslı meditasyonlara odaklanın.'
    },
    {
      minScore: '8.0',
      title: 'Ağır Schumann Fırtınası (G4 Seviyesi)',
      symptoms: 'Yoğun fiziksel yorgunluk ve kas seğirmeleri (frekans uyumlanması), baş bölgesinde taç kısmına doğru yayılan basınç, uyku düzeninde derin kaymalar (gece yarısı uyanıp tekrar uyuyamama), zaman algısında geçici bükülmeler.',
      spiritual: 'Taç çakra portalı tamamen açılmıştır ve yüksek boyutlu ışık bedene geçiş enerjisi aktiftir. Bugün kendinizi zorlayacak fiziksel işlerden kesinlikle kaçının. Taç çakranızdan giren beyaz ışığın bedeninizi yıkayarak yere aktığını imgeleyin.'
    },
    {
      minScore: '9.0',
      title: 'Ekstrem Schumann Rezonans Fırtınası (G5 Zirve Seviyesi)',
      symptoms: 'Sinir sisteminin en yüksek kapasitede uyarılması, derin trans benzeri uyku halleri veya mutlak uykusuzluk, baş ve ensede çok yoğun basınç, kulaklarda çok yüksek tonda uğultu/çınlama sesleri, aşırı duyarlılık ve bedensel hafiflik/ağırlık hissi dalgalanmaları.',
      spiritual: 'Zirve boyutlar arası geçiş portalı ve hücresel simya devrededir. Kollektif bilinçle ve kozmik kaynakla bütünleşme anıdır. Bol alkali su tüketin ve çıplak ayakla nemli toprağa basarak mutlak topraklanma sağlayın. Zihni tamamen susturarak teslimiyet meditasyonu yapın.'
    }
  ];

  const generateRulesAnalysis = (score: number, a1: number, f1: number) => {
    const rules = (data as any)?.schumann_rules || FALLBACK_SCHUMANN_RULES;
    const sortedRules = [...rules].sort((a, b) => parseFloat(a.minScore) - parseFloat(b.minScore));
    let matchedRule = sortedRules[0];
    for (const rule of sortedRules) {
      if (score >= parseFloat(rule.minScore)) {
        matchedRule = rule;
      }
    }

    let scienceText = matchedRule.science;
    if (!scienceText) {
      if (parseFloat(matchedRule.minScore) >= 9.0) {
        scienceText = `Tomsk Rasathanesi ölçümlerine göre Schumann Rezonansı ana mod genliği (A1) tarihi zirvesine ulaşarak ${a1.toFixed(1)} seviyesine çıktı. Frekans ${f1.toFixed(2)} Hz düzeyinde ekstrem titreşiyor. İyonosfer tabakası tam doygunluk sınırında elektrik yüküyle yüklü.`;
      } else if (parseFloat(matchedRule.minScore) >= 8.0) {
        scienceText = `Tomsk Rasathanesi ölçümlerine göre Schumann Rezonansı ana mod genliği (A1) ekstrem bir yükselişle ${a1.toFixed(1)} seviyesine ulaştı. Frekans ${f1.toFixed(2)} Hz düzeyinde seyrediyor. İyonosfer tabakası çok yüksek manyetik basınç altında.`;
      } else if (parseFloat(matchedRule.minScore) >= 7.0) {
        scienceText = `Tomsk Rasathanesi ölçümlerine göre Schumann Rezonansı ana mod genliği (A1) sıradışı bir sıçramayla ${a1.toFixed(1)} seviyesine ulaştı. Frekans ${f1.toFixed(2)} Hz civarında seyrediyor. İyonosfer tabakası yoğun bir elektrik yüküyle titreşiyor.`;
      } else if (parseFloat(matchedRule.minScore) >= 5.0) {
        scienceText = `Tomsk Rasathanesi verilerinde Schumann Rezonansı genliği (A1) yüksek uyarım göstererek ${a1.toFixed(1)} seviyesine ulaştı. Frekans ${f1.toFixed(2)} Hz olarak iyonosferik dalgalanmaları tetikliyor.`;
      } else if (parseFloat(matchedRule.minScore) >= 3.0) {
        scienceText = `Schumann Rezonansı ana mod genliği (A1) ${a1.toFixed(1)} seviyesine çıkarak hafif bir hareketlenme gösteriyor. Frekans ${f1.toFixed(2)} Hz civarında stabil seyrediyor.`;
      } else {
        scienceText = `Tomsk Rasathanesi ölçümlerine göre Schumann Rezonansı ana frekansı ${f1.toFixed(2)} Hz (Genlik A1: ${a1.toFixed(1)}) seviyesinde dengeli ve doğal titreşiminde seyrediyor. İyonosfer tabakası sakin durumda.`;
      }
    }

    return {
      title: matchedRule.title,
      science: scienceText,
      symptoms: matchedRule.symptoms,
      spiritual: matchedRule.spiritual,
    };
  };

  return (
    <SacredBackground>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={28} color={COLORS.primary} />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.headerTitle}>Schumann Rezonansı</Text>
          <Text style={styles.headerSubtitle}>Tomsk Spektrogram ve Rezonans Analizi</Text>
        </View>
        <View style={{ width: 44 }} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Rezonans verileri ölçülüyor...</Text>
        </View>
      ) : (
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          {/* Schumann Rezonansı Frekans Spektrogramı (Şelale Grafiği) */}
          <BlurView intensity={30} tint="dark" style={styles.spectrogramCard}>
            <Text style={styles.chartTitle}>Schumann Rezonansı</Text>
            <Text style={styles.chartSubtitle}>
              Atmosferik boşlukta rezonans frekanslarının uyarılma şiddeti. Bu veriler Space Observing System 70 (Tomsk, Rusya) rasathanesinden canlı olarak alınmaktadır.
            </Text>

            {/* Spectrogram Header with Local & Tomsk Times */}
            {data?.schumann_real && (
              <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                borderRadius: 12,
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.05)',
                paddingVertical: 8,
                paddingHorizontal: 12,
                marginBottom: 12,
                gap: 8
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 8 }}>
                  <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#00E5FF', marginRight: 6 }} />
                  <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#00E5FF' }}>CANLI GÖZLEMEVİ</Text>
                </View>
                <Text style={{ fontSize: 11, color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                  Yerel: <Text style={{ color: '#00E5FF' }}>{formatRealTime(data.schumann_real.time_utc)}</Text>
                </Text>
                <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>|</Text>
                <Text style={{ fontSize: 11, color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold' }}>
                  Tomsk: <Text style={{ color: '#A78BFA' }}>{formatTomskTime(data.schumann_real.time_utc)}</Text>
                </Text>
              </View>
            )}

            <ScrollView 
              horizontal={true} 
              showsHorizontalScrollIndicator={true}
              style={{ marginVertical: 10, borderRadius: 8, backgroundColor: '#050505', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' }}
              contentContainerStyle={{ width: 750, paddingBottom: 15 }}
            >
              <View style={{ width: 750 }}>
                {loading ? (
                  <View style={{ height: 200, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="small" color={COLORS.primary} />
                  </View>
                ) : (
                  <Image 
                    source={{ uri: `${API_BASE_URL}/api/schumann/image?t=${imageTimestamp}` }}
                    style={{ width: 750, height: 200 }}
                    resizeMode="stretch"
                  />
                )}
              </View>
            </ScrollView>

            {/* Chart Legend */}
            <View style={styles.legendContainer}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
                <Text style={styles.legendTextSmall}>Sakin (0-3)</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
                <Text style={styles.legendTextSmall}>Aktif (3-4)</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
                <Text style={styles.legendTextSmall}>Fırtına (5+)</Text>
              </View>
              <View style={[styles.legendItem, { borderLeftWidth: 1, borderLeftColor: 'rgba(255,255,255,0.1)', paddingLeft: 10 }]}>
                <View style={[styles.legendDot, { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#D4AF37', borderStyle: 'dashed' }]} />
                <Text style={styles.legendTextSmall}>Tahmin</Text>
              </View>
            </View>
          </BlurView>

          {/* Schumann Rezonansı Kılavuzu */}
          <BlurView intensity={25} tint="dark" style={styles.guideCard}>
            <View style={styles.guideHeader}>
              <Ionicons name="information-circle-outline" size={24} color={COLORS.primary} style={{ marginRight: 10 }} />
              <Text style={styles.guideHeaderTitle}>Schumann Rezonansı Kılavuzu</Text>
            </View>

            <View style={styles.guideContent}>
              <Text style={styles.guideSectionTitle}>Grafik Renklerinin Anlamı:</Text>
              <View style={{ gap: 8, marginBottom: 15 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#000028', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' }} />
                  <Text style={{ color: '#fff', fontSize: 12 }}><Text style={{ fontWeight: 'bold' }}>Mavi/Koyu Mavi:</Text> Sakin durum ve arka plan elektromanyetik gürültüsü.</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#10B981' }} />
                  <Text style={{ color: '#fff', fontSize: 12 }}><Text style={{ fontWeight: 'bold' }}>Yeşil:</Text> Doğal rezonans çizgileri (7.83 Hz ve üst modlar).</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#F59E0B' }} />
                  <Text style={{ color: '#fff', fontSize: 12 }}><Text style={{ fontWeight: 'bold' }}>Sarı/Turuncu:</Text> Hafif ve orta seviyede uyarılma/frekans artışı.</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#EF4444' }} />
                  <Text style={{ color: '#fff', fontSize: 12 }}><Text style={{ fontWeight: 'bold' }}>Kırmızı:</Text> Aktif manyetik fırtınalar ve plazma akışları.</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#fff' }} />
                  <Text style={{ color: '#fff', fontSize: 12 }}><Text style={{ fontWeight: 'bold' }}>Beyaz:</Text> Zirve elektromanyetik uyarılma ve anlık parlamalar.</Text>
                </View>
              </View>

              <Text style={styles.guideSectionTitle}>Rezonans Seviyeleri ve Etkileri:</Text>

              {/* G0 Sakin */}
              <View style={styles.levelCard}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                  <Text style={{ color: '#22D3EE', fontSize: 11, fontWeight: 'bold', backgroundColor: 'rgba(34, 211, 238, 0.1)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>Sakin Faz (A1 &lt; 8.0)</Text>
                  <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>Dingin Elektromanyetik Akış</Text>
                </View>
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 18, marginBottom: 4 }}><Text style={{ color: '#fff', fontWeight: 'bold' }}>⚡ Beden:</Text> Zihinsel netlik, dengeli enerji, sakin uyku ve bedensel rahatlık.</Text>
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 18 }}><Text style={{ color: '#fff', fontWeight: 'bold' }}>🧘 Ruhsal:</Text> Tefekkür, zihni susturma ve kök çakra meditasyonları için en ideal dönem.</Text>
              </View>

              {/* G0 Uyarım */}
              <View style={styles.levelCard}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                  <Text style={{ color: '#34D399', fontSize: 11, fontWeight: 'bold', backgroundColor: 'rgba(52, 211, 153, 0.1)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>Hafif Uyarım (A1 8-15)</Text>
                  <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>Hafif Schumann Dalgalanması</Text>
                </View>
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 18, marginBottom: 4 }}><Text style={{ color: '#fff', fontWeight: 'bold' }}>⚡ Beden:</Text> Rüyalarda netlik/sembol artışı, hafif tatlı yorgunluk ve kulakta hafif uğultu.</Text>
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 18 }}><Text style={{ color: '#fff', fontWeight: 'bold' }}>🧘 Ruhsal:</Text> Rüya analizi, günlük tutma ve üçüncü göz meditasyonları için harika bir akış.</Text>
              </View>

              {/* G1-G2 */}
              <View style={styles.levelCard}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                  <Text style={{ color: '#F59E0B', fontSize: 11, fontWeight: 'bold', backgroundColor: 'rgba(245, 158, 11, 0.1)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>Aktif Fırtına (A1 15-40)</Text>
                  <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>Manyetik Fırtına (G1-G2)</Text>
                </View>
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 18, marginBottom: 4 }}><Text style={{ color: '#fff', fontWeight: 'bold' }}>⚡ Beden:</Text> Kalp genişlemesi, statik elektrik (çarpılma), hafif şakak/eklem ağrısı ve uykusuzluk.</Text>
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 18 }}><Text style={{ color: '#fff', fontWeight: 'bold' }}>🧘 Ruhsal:</Text> Kalp çakrası açılımı. Tuzlu su banyosu, topraklanma ve kalp nefesi önerilir.</Text>
              </View>

              {/* G3 */}
              <View style={styles.levelCard}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                  <Text style={{ color: '#F97316', fontSize: 11, fontWeight: 'bold', backgroundColor: 'rgba(249, 115, 22, 0.1)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>Güçlü Fırtına (A1 40-55)</Text>
                  <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>Şiddetli Fırtına (G3)</Text>
                </View>
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 18, marginBottom: 4 }}><Text style={{ color: '#fff', fontWeight: 'bold' }}>⚡ Beden:</Text> Sinir sistemi uyarılması, uyku dalgalanmaları, kulak çınlaması ve ense basıncı.</Text>
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 18 }}><Text style={{ color: '#fff', fontWeight: 'bold' }}>🧘 Ruhsal:</Text> DNA aktivasyonu ve ışık kodu entegrasyonu. Bol su ve hafif esneme pratikleri.</Text>
              </View>

              {/* G4 */}
              <View style={styles.levelCard}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                  <Text style={{ color: '#EF4444', fontSize: 11, fontWeight: 'bold', backgroundColor: 'rgba(239, 68, 68, 0.1)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>Ağır Fırtına (A1 55-70)</Text>
                  <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>Ağır Schumann Fırtınası (G4)</Text>
                </View>
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 18, marginBottom: 4 }}><Text style={{ color: '#fff', fontWeight: 'bold' }}>⚡ Beden:</Text> Yoğun yorgunluk/kas seğirmesi, taç bölgesinde basınç ve zaman algısında bükülme.</Text>
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 18 }}><Text style={{ color: '#fff', fontWeight: 'bold' }}>🧘 Ruhsal:</Text> Taç çakra portalı açık. Ağır fiziksel işlerden kaçının ve beyaz ışık imgelemesi yapın.</Text>
              </View>

              {/* G5 */}
              <View style={styles.levelCard}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                  <Text style={{ color: '#fff', fontSize: 11, fontWeight: 'bold', backgroundColor: 'rgba(255, 255, 255, 0.1)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, borderStyle: 'solid', borderWidth: 1, borderColor: '#fff' }}>Zirve Fırtına (A1 &gt;= 70)</Text>
                  <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>Ekstrem Rezonans Fırtınası (G5)</Text>
                </View>
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 18, marginBottom: 4 }}><Text style={{ color: '#fff', fontWeight: 'bold' }}>⚡ Beden:</Text> Derin trans/aşırı uykusuzluk, ensede yoğun basınç ve kulaklarda yüksek tonlu çınlama.</Text>
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 18 }}><Text style={{ color: '#fff', fontWeight: 'bold' }}>🧘 Ruhsal:</Text> Boyutlar arası geçiş portalı. Alkali su tüketimi ve çıplak ayakla toprağa basış.</Text>
              </View>
            </View>
          </BlurView>

          <View style={{ height: 100 }} />
        </ScrollView>
      )}
    </SacredBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.2)',
  },
  backBtn: {
    padding: 8,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.textMuted,
    fontSize: 14,
    marginTop: 15,
  },
  scrollContent: {
    padding: 20,
  },
  oracleCard: {
    padding: 20,
    borderRadius: SIZES.radius * 1.5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.02)',
    marginBottom: 20,
  },
  oracleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    paddingBottom: 12,
    marginBottom: 12,
    gap: 12,
  },
  oracleBadge: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#00E5FF',
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0,229,255,0.25)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  oracleTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  oracleScoreBadge: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  oracleScoreLabel: {
    fontSize: 7,
    color: COLORS.textMuted,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  oracleScoreVal: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 0,
  },
  oracleScoreAmp: {
    fontSize: 8,
    color: 'rgba(255,255,255,0.55)',
    fontWeight: 'bold',
    marginTop: 1,
  },
  oracleSegment: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  oracleSegmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  oracleSegmentTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: 6,
    textTransform: 'uppercase',
  },
  oracleSegmentBody: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 19,
  },
  stationCard: {
    padding: 20,
    borderRadius: SIZES.radius * 1.5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 20,
    overflow: 'hidden',
  },
  stationHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  stationTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
  },
  stationSubtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    lineHeight: 15,
    marginBottom: 15,
  },
  stationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  stationGridItem: {
    width: '48%',
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    minHeight: 90,
    justifyContent: 'space-between',
  },
  stationItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  stationItemLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '600',
    flex: 1,
    flexWrap: 'wrap',
    marginRight: 4,
  },
  stationItemValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  stationItemSubtext: {
    fontSize: 9,
    fontWeight: '600',
    marginTop: 2,
  },
  chartCard: {
    padding: 20,
    borderRadius: SIZES.radius * 1.5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 20,
    overflow: 'hidden',
  },
  chartTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    lineHeight: 15,
    marginBottom: 15,
  },
  barTooltipContainer: {
    minHeight: 30,
    justifyContent: 'center',
    marginBottom: 15,
  },
  barTooltip: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignSelf: 'center',
  },
  tooltipText: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  tooltipPlaceholder: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 140,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    position: 'relative',
  },
  chartGridLines: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 10,
    bottom: 10,
    justifyContent: 'space-between',
    pointerEvents: 'none',
    zIndex: 1,
  },
  chartGridLine: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    width: '100%',
    height: 1,
  },
  chartXAxisContainer: {
    flexDirection: 'row',
    height: 20,
    marginTop: 6,
  },
  chartXAxisSlot: {
    flex: 1,
    alignItems: 'flex-start',
    marginHorizontal: 1.5,
  },
  chartXAxisLabel: {
    fontSize: 8,
    fontFamily: Platform.OS === 'ios' ? 'Courier-Bold' : 'monospace',
    position: 'absolute',
    left: -10,
    width: 40,
    textAlign: 'center',
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
    marginHorizontal: 1.5,
    position: 'relative',
  },
  barColumn: {
    width: '100%',
    borderRadius: 3,
  },
  nowLineContainer: {
    position: 'absolute',
    left: '50%',
    bottom: -10,
    height: 160,
    width: 30,
    alignItems: 'center',
    transform: [{ translateX: -15 }],
    pointerEvents: 'none',
  },
  nowLineDashed: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: '#00E5FF',
    borderStyle: 'dashed',
  },
  nowLineText: {
    fontSize: 8,
    color: '#00E5FF',
    fontWeight: 'bold',
    backgroundColor: '#000',
    paddingHorizontal: 3,
    marginTop: 2,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendTextSmall: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  notificationCard: {
    padding: 16,
    borderRadius: SIZES.radius * 1.5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 20,
    overflow: 'hidden',
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notificationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  notificationDesc: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  toggleBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  toggleBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  toggleBtnInactive: {
    backgroundColor: 'transparent',
    borderColor: 'rgba(212, 175, 55, 0.4)',
  },
  toggleBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  analysisCard: {
    padding: 20,
    borderRadius: SIZES.radius * 1.5,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    marginBottom: 20,
    overflow: 'hidden',
  },
  analysisTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
  },
  analysisBodyText: {
    fontSize: 13,
    color: '#fff',
    lineHeight: 20,
  },
  toggleBtnLocked: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderColor: 'rgba(212, 175, 55, 0.5)',
  },
  spectrogramCard: {
    padding: 20,
    borderRadius: SIZES.radius * 1.5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 20,
    overflow: 'hidden',
  },
  spectrogramTooltipContainer: {
    minHeight: 30,
    justifyContent: 'center',
    marginBottom: 5,
    paddingVertical: 2,
  },
  spectrogramTooltip: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignSelf: 'center',
  },
  spectrogramTooltipText: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  spectrogramWrapper: {
    height: 180,
    marginTop: 10,
    backgroundColor: '#050505',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    position: 'relative',
    overflow: 'hidden',
  },
  spectrogramImage: {
    width: '100%',
    height: '100%',
  },
  hzScale: {
    width: 45,
    height: 120, // Match the gradient height (140 - 20)
    justifyContent: 'space-between',
    paddingVertical: 4, // Small padding to center texts inside the rows
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.08)',
    zIndex: 10,
  },
  spectrogramMainContainer: {
    flex: 1,
    height: 140,
  },
  spectrogramColFluid: {
    flex: 1,
    height: '100%',
    position: 'relative',
    justifyContent: 'flex-end',
    paddingBottom: 22,
  },
  colBgGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 20,
  },
  colOverlayGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 20,
  },
  colWhiteGlow: {
    position: 'absolute',
    left: '20%',
    right: '20%',
    top: 0,
    bottom: 20,
    opacity: 0.75,
  },
  fluidSelectorContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 20,
    pointerEvents: 'none',
    zIndex: 8,
  },
  selectorLine: {
    position: 'absolute',
    left: '50%',
    marginLeft: -0.75,
    top: 0,
    bottom: 0,
    width: 1.5,
    backgroundColor: '#FFD700', // Gold line
    opacity: 0.8,
  },
  selectorDot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFD700', // Gold dot
    borderWidth: 1,
    borderColor: '#000',
    left: '50%',
    marginLeft: -3,
    transform: [{ translateY: -3 }],
  },
  hzText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.primary,
    fontFamily: Platform.OS === 'ios' ? 'Courier-Bold' : 'monospace',
  },
  spectrogramTimeText: {
    fontSize: 10,
    color: COLORS.textMuted,
    textAlign: 'center',
    position: 'absolute',
    bottom: 4,
    left: -15,
    right: -15,
  },
  spectrogramNowLineFluid: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 20,
    width: 0,
    borderLeftWidth: 1.5,
    borderLeftColor: '#00E5FF',
    borderStyle: 'dashed',
    zIndex: 5,
    alignItems: 'center',
  },
  spectrogramNowTextFluid: {
    fontSize: 9,
    color: '#00E5FF',
    fontWeight: 'bold',
    backgroundColor: '#000',
    paddingHorizontal: 2,
    position: 'absolute',
    bottom: -16,
    left: -16,
    width: 32,
    textAlign: 'center',
  },
  guideCard: {
    borderRadius: SIZES.radius * 1.5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  guideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  guideHeaderTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  guideContent: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  guideSectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 15,
    marginBottom: 4,
  },
  guideParagraph: {
    fontSize: 11,
    color: COLORS.textMuted,
    lineHeight: 16,
  },
  watermarkContainer: {
    position: 'absolute',
    right: 12,
    top: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    zIndex: 20,
    pointerEvents: 'none',
  },
  watermarkLogo: {
    width: 14,
    height: 14,
    marginRight: 6,
    borderRadius: 7,
  },
  watermarkText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Bold' : 'sans-serif-condensed',
  },
  simulatorCard: {
    padding: 20,
    borderRadius: SIZES.radius * 1.5,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    marginBottom: 20,
    overflow: 'hidden',
  },
  simulatorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  simulatorTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
  },
  badgeContainer: {
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.4)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#00E5FF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  simulatorSubtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    lineHeight: 15,
    marginBottom: 15,
  },
  sliderWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  sliderLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    width: 55,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  simulatorFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  simulatorFooterText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  simulatorValueText: {
    fontWeight: 'bold',
    color: '#fff',
  },
  resetBtn: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  resetBtnText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: 'bold',
  },
  levelCard: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
});
