import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Animated, Easing, Image, ImageBackground, ActivityIndicator, Platform, BackHandler, Modal, Switch, TextInput, NativeModules, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { getMe, logout as apiLogout, apiFetch } from '@/src/core/api/client';
import { COLORS, SIZES } from '@/src/theme';
import { useContent } from '@/src/core/content/useContent';
import { useProgress } from '@/src/context/ProgressContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPlanetaryHours, getPlanetInfo, PlanetaryHour, PLANET_DAY_GUIDELINES } from '@/src/features/astrology/engine/PlanetaryHours';
import SacredBackground from '@/components/SacredBackground';
import * as Notifications from 'expo-notifications';

if (Platform.OS !== 'web') {
  try {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
  } catch {
    // ignore
  }
}

const ESOTERIC_BG = require('@/assets/images/esoteric_bg_indigo.webp');

const { width } = Dimensions.get('window');


// İçerik Kategorileri (7 Çakra - 7 Katman)
// MODULES (ana sayfa çakra kartları) içeriği DB'den gelir (/api/content/chakras → modules)

const DAY_CHAKRA_MAP: Record<number, { name: string, planet: string, chakraId: number, symbol: string }> = {
  0: { name: 'Pazar', planet: 'Güneş Günü', chakraId: 3, symbol: '☉' },
  1: { name: 'Pazartesi', planet: 'Ay Günü', chakraId: 4, symbol: '☽' },
  2: { name: 'Salı', planet: 'Mars Günü', chakraId: 1, symbol: '♂' },
  3: { name: 'Çarşamba', planet: 'Merkür Günü', chakraId: 5, symbol: '☿' },
  4: { name: 'Perşembe', planet: 'Jüpiter Günü', chakraId: 6, symbol: '♃' },
  5: { name: 'Cuma', planet: 'Venüs Günü', chakraId: 2, symbol: '♀' },
  6: { name: 'Cumartesi', planet: 'Satürn Günü', chakraId: 7, symbol: '♄' },
};

const MarqueeText = ({ text }: { text: string }) => {
  const animatedValue = useRef(new Animated.Value(width)).current;

  useEffect(() => {
    const startAnimation = () => {
      animatedValue.setValue(width);
      Animated.timing(animatedValue, {
        toValue: -1200, 
        duration: 20000, 
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(startAnimation, 3000); 
      });
    };

    startAnimation();
  }, [text]);

  return (
    <View style={styles.marqueeContainer}>
      <Animated.Text style={[styles.marqueeText, { transform: [{ translateX: animatedValue }] }]}>
        {text}
      </Animated.Text>
    </View>
  );
};

const getLiveMoonPhaseSummary = (date = new Date()) => {
  // Known new moon reference: Jan 6, 2000 18:14 UTC
  const synodicMonth = 29.53058867;
  const knownNewMoon = Date.UTC(2000, 0, 6, 18, 14, 0);
  const diffDays = (date.getTime() - knownNewMoon) / (1000 * 60 * 60 * 24);
  const phaseRatio = ((diffDays % synodicMonth) + synodicMonth) % synodicMonth / synodicMonth;
  const illumination = Math.round((1 - Math.cos(phaseRatio * 2 * Math.PI)) * 50);

  if (phaseRatio < 0.03 || phaseRatio > 0.97) {
    return { icon: '🌑', name: 'Yeni Ay Fazı', desc: 'Yeni niyet ve tohum ekmek için kozmik sıfır noktası', illumination };
  } else if (phaseRatio < 0.24) {
    return { icon: '🌒', name: 'Hilal (Büyüyen Ay)', desc: 'İvme kazanma, adım atma ve projeleri büyütme enerjisi', illumination };
  } else if (phaseRatio <= 0.26) {
    return { icon: '🌓', name: 'İlk Dördün', desc: 'Kararlılık, engelleri aşma ve irade ortaya koyma fazı', illumination };
  } else if (phaseRatio < 0.47) {
    return { icon: '🌔', name: 'Şişkin Ay', desc: 'Detayları olgunlaştırma, hazırlık ve sabırlı ilerleme', illumination };
  } else if (phaseRatio <= 0.53) {
    return { icon: '🌕', name: 'Dolunay Fazı', desc: 'Farkındalık zirvesi, tamamlanma ve duygusal aydınlanma', illumination };
  } else if (phaseRatio < 0.74) {
    return { icon: '🌖', name: 'Küçülen Şişkin Ay', desc: 'Şükür, paylaşım, içgörü ve deneyimleri sindirme zamanı', illumination };
  } else if (phaseRatio <= 0.76) {
    return { icon: '🌗', name: 'Son Dördün', desc: 'Arınma, yükleri bırakma ve zihinsel sadeleşme evresi', illumination };
  }
  return { icon: '🌘', name: 'Balsamik Ay', desc: 'İçe dönüş, dinlenme, tefekkür ve ruhsal hazırlık', illumination };
};

export type WidgetChartMode = 'body' | 'soul' | 'synthesis';

interface ZodiacMeta {
  sign: string;
  symbol: string;
  element: string;
  ruler: string;
}

const ZODIAC_SECTORS: ZodiacMeta[] = [
  { sign: 'Koç', symbol: '♈', element: 'Ateş', ruler: 'Mars' },
  { sign: 'Boğa', symbol: '♉', element: 'Toprak', ruler: 'Venüs' },
  { sign: 'İkizler', symbol: '♊', element: 'Hava', ruler: 'Merkür' },
  { sign: 'Yengeç', symbol: '♋', element: 'Su', ruler: 'Ay' },
  { sign: 'Aslan', symbol: '♌', element: 'Ateş', ruler: 'Güneş' },
  { sign: 'Başak', symbol: '♍', element: 'Toprak', ruler: 'Merkür' },
  { sign: 'Terazi', symbol: '♎', element: 'Hava', ruler: 'Venüs' },
  { sign: 'Akrep', symbol: '♏', element: 'Su', ruler: 'Plüton/Mars' },
  { sign: 'Yay', symbol: '♐', element: 'Ateş', ruler: 'Jüpiter' },
  { sign: 'Oğlak', symbol: '♑', element: 'Toprak', ruler: 'Satürn' },
  { sign: 'Kova', symbol: '♒', element: 'Hava', ruler: 'Uranüs/Satürn' },
  { sign: 'Balık', symbol: '♓', element: 'Su', ruler: 'Neptün/Jüpiter' },
];

interface WidgetBirthProfile {
  birthDate: string;
  birthTime: string;
  chartMode: WidgetChartMode;
  zodiacSign: string;
  zodiacSymbol: string;
  element: string;
  rulingPlanet: string;
  soulZodiacSign: string;
  soulZodiacSymbol: string;
  soulElement: string;
  soulRulingPlanet: string;
  northNodeSign: string;
  lifePath: number;
  personalDay: number;
  transitMoonSign: string;
  transitMoonSymbol: string;
  aspectName: string;
  personalDo: string;
  personalAvoid: string;
}

const reduceDigit = (num: number): number => {
  let n = Math.abs(num);
  while (n > 9) {
    let s = 0;
    while (n > 0) {
      s += n % 10;
      n = Math.floor(n / 10);
    }
    n = s;
  }
  return n === 0 ? 1 : n;
};

const getTransitMoonSignIndexJS = (nowMillis: number): number => {
  const jd = nowMillis / 86400000.0 + 2440587.5;
  const t = (jd - 2451545.0) / 36525.0;
  const degToRad = Math.PI / 180.0;

  const lPrime = 218.3164477 + 481267.88123421 * t;
  const d = (297.8501921 + 445267.1114034 * t) * degToRad;
  const m = (357.5291092 + 35999.0502909 * t) * degToRad;
  const mPrime = (134.9633964 + 477198.8675055 * t) * degToRad;
  const f = (93.2720950 + 483202.0175233 * t) * degToRad;

  const lon =
    lPrime +
    6.288774 * Math.sin(mPrime) +
    1.274027 * Math.sin(2.0 * d - mPrime) +
    0.658314 * Math.sin(2.0 * d) +
    0.213618 * Math.sin(2.0 * mPrime) -
    0.185116 * Math.sin(m) -
    0.114332 * Math.sin(2.0 * f);

  const normLon = ((lon % 360.0) + 360.0) % 360.0;
  return Math.max(0, Math.min(11, Math.floor(normLon / 30.0)));
};

const getAspectThemeForSignDiffJS = (diff: number) => {
  const d = ((diff % 12) + 12) % 12;
  if (d === 0) {
    return {
      aspectName: 'Kavuşum',
      bodyDo: 'Kişisel inisiyatif alma, duygusal yenilenme ve özgüvenle adım atma',
      bodyAvoid: 'Aşırı hassasiyet, benmerkezcilik ve sabırsız kararlar',
      soulDo: 'Doğrudan öz-merkezinize akan yüksek sezgi, güçlü niyet koyma ve ruhsal uyanış',
      soulAvoid: 'Duygusal taşkınlık, subjektif tepkisellik ve bedenin ani dürtülerine kapılma',
    };
  }
  if (d === 4 || d === 8) {
    return {
      aspectName: 'Üçgen Açı',
      bodyDo: 'Yaratıcı üretim, uyumlu iletişim, şifa çalışmaları ve akışta ilerleme',
      bodyAvoid: 'Tembellik, rehavet ve enerjinin kendiliğinden akacağına fazla güvenme',
      soulDo: 'Element uyumuyla zahmetsiz ilham akışı, kalp-zihin dengesi ve yüksek tezahür',
      soulAvoid: 'Konfor alanında rehavete kapılma ve gelen ruhsal fırsatları erteleme',
    };
  }
  if (d === 2 || d === 10) {
    return {
      aspectName: 'Sekstil Açı',
      bodyDo: 'Yeni bağlantılar kurma, öğrenme, araştırma ve somut işbirliği adımları',
      bodyAvoid: 'Aynı anda çok işe bölünme, kararsızlık ve odak kaybı',
      soulDo: 'Boğaz ve üçüncü göz çakrasından berrak idrak, eşzamanlılıkları okuma ve paylaşım',
      soulAvoid: 'Zihinsel dağınıklık, yüzeysel konuşmalar ve dikkati dış gürültüye dağıtma',
    };
  }
  if (d === 3 || d === 9) {
    return {
      aspectName: 'Kare Açı',
      bodyDo: 'Sabırlı hareket etme, yarım kalan zorlu işleri disiplinle çözme ve köklenme',
      bodyAvoid: 'Aceleci tartışmalar, duygusal gerilim ve dürtüsel güç savaşları',
      soulDo: 'İçsel sürtünmeyi farkındalığa dönüştürme, nefesle merkezlenme ve nefs terbiyesi',
      soulAvoid: 'Beden otomatizminin öfke, alınganlık, inatlaşma ve savunmacı ego tepkisi',
    };
  }
  if (d === 6) {
    return {
      aspectName: 'Karşıt Açı',
      bodyDo: 'Empati, diplomasi, uzlaşma ve karşıt bakış açılarını dengede buluşturma',
      bodyAvoid: 'İkili ilişkilerde gerilim, alınganlık ve uçlarda gezinme',
      soulDo: 'İlişkilerde ayna yasasını okuma, dualiteyi kalp merkezinde birleştirme',
      soulAvoid: 'Gölgeyi karşı tarafa yansıtma (projeksiyon), onay bekleme veya kutuplaşma',
    };
  }
  return {
    aspectName: 'İnce Ayar',
    bodyDo: 'Detayları düzenleme, bedensel dinlenme, detoks ve zihinsel sadeleşme',
    bodyAvoid: 'Gereksiz evham, mükemmeliyetçi stres ve enerjiyi tüketen kuruntular',
    soulDo: 'İçe dönüş, tefekkür, enerji alanını sadeleştirme ve sessiz sezgisel hazırlık',
    soulAvoid: 'Belirsizlikten huzursuz olma, aşırı zihinsel kurgu ve zorlama kontrol çabası',
  };
};

const computeWidgetBirthProfile = (
  birthDateStr: string,
  birthTimeStr = '',
  chartMode: WidgetChartMode = 'soul'
): WidgetBirthProfile | null => {
  const cleaned = birthDateStr.trim();
  const parts = cleaned.split(/[./-]/);
  if (parts.length !== 3) return null;
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);
  if (!day || !month || !year || day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > 2100) {
    return null;
  }

  let hour = 12;
  let minute = 0;
  if (birthTimeStr.trim().includes(':')) {
    const tParts = birthTimeStr.trim().split(':');
    const h = parseInt(tParts[0], 10);
    const m = parseInt(tParts[1], 10);
    if (!isNaN(h) && h >= 0 && h <= 23) hour = h;
    if (!isNaN(m) && m >= 0 && m <= 59) minute = m;
  }

  // Astronomical Julian Day & Tropical / Draconic Sun calculation (Yetzirah: North Node = 0° Aries)
  const y = month <= 2 ? year - 1 : year;
  const m = month <= 2 ? month + 12 : month;
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  const utHours = hour - 3 + minute / 60;
  const jd =
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    day +
    utHours / 24 +
    B -
    1524.5;
  const T = (jd - 2451545.0) / 36525.0;

  const L0 = (((280.46646 + 36000.76983 * T + 0.0003032 * T * T) % 360) + 360) % 360;
  const M = (((357.52911 + 35999.05029 * T - 0.0001537 * T * T) % 360) + 360) % 360;
  const Mrad = (M * Math.PI) / 180;
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad) +
    0.000289 * Math.sin(3 * Mrad);

  const sunTropicalLon = (((L0 + C) % 360) + 360) % 360;
  const northNodeLon = (((125.04452 - 1934.136261 * T + 0.0020708 * T * T) % 360) + 360) % 360;
  const sunDraconicLon = (((sunTropicalLon - northNodeLon) % 360) + 360) % 360;

  const bodySignIdx = Math.floor(sunTropicalLon / 30) % 12;
  const soulSignIdx = Math.floor(sunDraconicLon / 30) % 12;
  const bodyMeta = ZODIAC_SECTORS[bodySignIdx] || ZODIAC_SECTORS[0];
  const soulMeta = ZODIAC_SECTORS[soulSignIdx] || ZODIAC_SECTORS[0];
  const nodeMeta = ZODIAC_SECTORS[Math.floor(northNodeLon / 30) % 12] || ZODIAC_SECTORS[0];

  const lifePath = reduceDigit(reduceDigit(day) + reduceDigit(month) + reduceDigit(year));
  const now = new Date();
  const personalDay = reduceDigit(
    reduceDigit(day) +
      reduceDigit(month) +
      reduceDigit(now.getDate()) +
      reduceDigit(now.getMonth() + 1) +
      reduceDigit(now.getFullYear())
  );

  const moonSignIdx = getTransitMoonSignIndexJS(now.getTime());
  const moonMeta = ZODIAC_SECTORS[moonSignIdx] || ZODIAC_SECTORS[0];
  const targetSignIdx = chartMode === 'body' ? bodySignIdx : soulSignIdx;
  const aspect = getAspectThemeForSignDiffJS(moonSignIdx - targetSignIdx);

  let personalDo = '';
  let personalAvoid = '';
  if (chartMode === 'soul') {
    personalDo = `✓ Ruh Haritası (${moonMeta.symbol} Ay ${moonMeta.sign} • ${aspect.aspectName}): ${aspect.soulDo} (${soulMeta.ruler} üst oktavı)`;
    personalAvoid = `✗ Beden Gölgesi (${bodyMeta.sign} / ${bodyMeta.element} Otomatiği): ${aspect.soulAvoid}`;
  } else if (chartMode === 'synthesis') {
    personalDo = `✓ Sentez (${moonMeta.symbol} Ay ${moonMeta.sign} • ${aspect.aspectName}): ${aspect.soulDo}`;
    personalAvoid = `✗ Gölge Uyarısı (${bodyMeta.element} → ${soulMeta.element}): ${aspect.bodyAvoid}`;
  } else {
    personalDo = `✓ Beden Haritası (${moonMeta.symbol} Ay ${moonMeta.sign} • ${aspect.aspectName}): ${aspect.bodyDo} (${bodyMeta.ruler} uyumu)`;
    personalAvoid = `✗ Kaçının (${bodyMeta.element} Elementi): ${aspect.bodyAvoid}`;
  }

  return {
    birthDate: `${String(day).padStart(2, '0')}.${String(month).padStart(2, '0')}.${year}`,
    birthTime: birthTimeStr.trim(),
    chartMode,
    zodiacSign: bodyMeta.sign,
    zodiacSymbol: bodyMeta.symbol,
    element: bodyMeta.element,
    rulingPlanet: bodyMeta.ruler,
    soulZodiacSign: soulMeta.sign,
    soulZodiacSymbol: soulMeta.symbol,
    soulElement: soulMeta.element,
    soulRulingPlanet: soulMeta.ruler,
    northNodeSign: nodeMeta.sign,
    lifePath,
    personalDay,
    transitMoonSign: moonMeta.sign,
    transitMoonSymbol: moonMeta.symbol,
    aspectName: aspect.aspectName,
    personalDo,
    personalAvoid,
  };
};

const PlanetaryHourWidget = ({ visible = true }: { visible?: boolean }) => {
  const router = useRouter();
  const [data, setData] = useState<{ hour: PlanetaryHour, info: any, minsLeft: number, cityName: string } | null>(null);
  
  useFocusEffect(
    useCallback(() => {
      let interval: any;
      let isActive = true;
      
      const fetchHour = async () => {
        try {
          const savedWidget = await AsyncStorage.getItem('@show_planetary_widget');
          if (savedWidget === 'false' && isActive) {
            setData(null);
            return;
          }

          const savedLocation = await AsyncStorage.getItem('last_planet_hours_location');
          let lat = 41.0082;
          let lon = 28.9784;
          let cityName = 'İstanbul';

          if (savedLocation) {
            const parsed = JSON.parse(savedLocation);
            if (typeof parsed.lat === 'number' && typeof parsed.lon === 'number') {
              lat = parsed.lat;
              lon = parsed.lon;
              cityName = parsed.name ? String(parsed.name).split(',')[0] : 'Seçili Konum';
            }
          }
          
          const updateCurrent = () => {
            if (!isActive) return;
            const now = new Date();
            let pData = getPlanetaryHours(now, lat, lon);
            
            if (now < pData.sunrise) {
              const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
              pData = getPlanetaryHours(yesterday, lat, lon);
            }
            
            const current = pData.hours.find((h: PlanetaryHour) => now >= h.startTime && now < h.endTime);
            
            if (current) {
              const info = getPlanetInfo(current.planet);
              const minsLeft = Math.max(0, Math.floor((current.endTime.getTime() - now.getTime()) / 60000));
              setData({ hour: current, info, minsLeft, cityName });
            } else {
              setData(null);
            }
          };
          
          updateCurrent();
          interval = setInterval(updateCurrent, 30000); // Check every 30 seconds
        } catch (e) {
          // Handle silently
        }
      };
      
      fetchHour();
      
      return () => {
        isActive = false;
        clearInterval(interval);
      };
    }, [visible])
  );

  if (!visible || !data) return null;

  return (
    <TouchableOpacity 
      style={[styles.planetaryWidget, { borderColor: data.info.color }]} 
      onPress={() => router.push('/(dashboard)/kisisel-analizler/gezegen-saatleri')}
      activeOpacity={0.7}
    >
      <View style={[styles.planetIconWrapper, { backgroundColor: data.info.color + '20', borderColor: data.info.color }]}>
        <Text style={[styles.planetWidgetIcon, { color: data.info.color }]}>{data.info.symbol}</Text>
      </View>
      <View style={{ flex: 1, marginLeft: 15 }}>
        <Text style={styles.planetWidgetTitle}>Şu Anki Gezegen Saati • {data.cityName}</Text>
        <Text style={[styles.planetWidgetName, { color: data.info.color }]}>{data.info.name}</Text>
      </View>
      <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
        <Text style={styles.planetWidgetTime}>{data.minsLeft} dk kaldı</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
          <Text style={{ fontSize: 10, color: COLORS.textMuted }}>Tüm Saatler</Text>
          <Ionicons name="chevron-forward" size={12} color={COLORS.textMuted} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const CosmicMoonWeatherWidget = ({ visible = true }: { visible?: boolean }) => {
  const router = useRouter();
  if (!visible) return null;

  const moon = getLiveMoonPhaseSummary(new Date());

  return (
    <TouchableOpacity
      style={[styles.schumannWidget, { borderLeftColor: '#38BDF8', marginBottom: 15 }]}
      onPress={() => router.push('/(dashboard)/kisisel-analizler/ay-donguleri')}
      activeOpacity={0.75}
    >
      <View style={styles.schumannRow}>
        <View style={[styles.planetIconWrapper, { backgroundColor: 'rgba(56,189,248,0.16)', borderColor: '#38BDF8' }]}>
          <Text style={{ fontSize: 19 }}>{moon.icon}</Text>
        </View>
        <View style={{ flex: 1, marginLeft: 15 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={[styles.schumannTitle, { color: '#7DD3FC' }]}>Kozmik Gökyüzü & Ay Fazı</Text>
            <View style={{ backgroundColor: 'rgba(56,189,248,0.18)', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 1 }}>
              <Text style={{ color: '#7DD3FC', fontSize: 9.5, fontWeight: '800' }}>%{moon.illumination} Aydınlık</Text>
            </View>
          </View>
          <Text style={[styles.schumannStatusName, { color: '#fff' }]}>{moon.name}</Text>
        </View>
        <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
          <Ionicons name="arrow-forward" size={14} color="#7DD3FC" />
        </View>
      </View>
      <View style={styles.schumannFooter}>
        <Text style={styles.schumannFooterText} numberOfLines={1}>✨ {moon.desc}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 10, color: '#7DD3FC', fontWeight: 'bold' }}>Gökyüzü Çarkı</Text>
          <Ionicons name="chevron-forward" size={12} color="#7DD3FC" style={{ marginLeft: 2 }} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const SchumannMiniWidget = () => {
  const router = useRouter();

  return (
    <TouchableOpacity 
      style={[styles.schumannWidget, { borderLeftColor: COLORS.primary }]} 
      onPress={() => router.push('/(dashboard)/kisisel-analizler/schumann')}
      activeOpacity={0.7}
    >
      <View style={styles.schumannRow}>
        <View style={[styles.planetIconWrapper, { backgroundColor: COLORS.primary + '20', borderColor: COLORS.primary }]}>
          <Ionicons name="flash-outline" size={18} color={COLORS.primary} />
        </View>
        
        <View style={{ flex: 1, marginLeft: 15 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={styles.schumannTitle}>Schumann Rezonansı</Text>
          </View>
          <Text style={[styles.schumannStatusName, { color: '#fff' }]}>
            Canlı Spektrogram Ölçümü
          </Text>
        </View>

        <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
          <Ionicons name="arrow-forward" size={14} color={COLORS.primary} />
        </View>
      </View>

      <View style={styles.schumannFooter}>
        <Text style={styles.schumannFooterText}>🧘 Dünya'nın kalp atışlarını izleyin</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 10, color: COLORS.primary }}>Canlı İzle</Text>
          <Ionicons name="chevron-forward" size={12} color={COLORS.primary} style={{ marginLeft: 2 }} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function DashboardScreen() {
  const router = useRouter();
  const { hasAccess } = useProgress();
  const [userName, setUserName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userTitle, setUserTitle] = useState('Arayışta');
  const [userRole, setUserRole] = useState('free');
  const [isToolsExpanded, setIsToolsExpanded] = useState(false);
  const [isLessonsExpanded, setIsLessonsExpanded] = useState(false);
  const [isTimelineExpanded, setIsTimelineExpanded] = useState(false);
  const [unreadChatReplies, setUnreadChatReplies] = useState(0);
  const [latestReplyNotif, setLatestReplyNotif] = useState<any | null>(null);
  const seenReplyNotifsRef = useRef<Set<string>>(new Set());
  const initialReplyFetchRef = useRef(false);

  // Widget Visibility States
  const [showWidgetModal, setShowWidgetModal] = useState(false);
  const [widgetBirthDate, setWidgetBirthDate] = useState('');
  const [widgetBirthTime, setWidgetBirthTime] = useState('');
  const [widgetChartMode, setWidgetChartMode] = useState<WidgetChartMode>('soul');
  const [savedBirthProfile, setSavedBirthProfile] = useState<WidgetBirthProfile | null>(null);
  const [widgetPrefs, setWidgetPrefs] = useState({
    planetaryHour: true,
    cosmicWeather: true,
    schumann: true,
    meclis: true,
    lockScreenNotif: false,
  });

  useEffect(() => {
    (async () => {
      try {
        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('cosmic-widget-channel', {
            name: '7Layers Kozmik Pusula',
            importance: Notifications.AndroidImportance.HIGH,
            lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
            sound: null,
          }).catch(() => {});
        }
        const [pHour, cWeather, sch, mec, lockN, savedBDate, savedBTime, savedCMode] = await Promise.all([
          AsyncStorage.getItem('@show_planetary_widget'),
          AsyncStorage.getItem('@show_cosmic_weather_widget'),
          AsyncStorage.getItem('@show_schumann_widget'),
          AsyncStorage.getItem('@show_meclis_widget'),
          AsyncStorage.getItem('@show_lockscreen_widget'),
          AsyncStorage.getItem('@widget_birth_date'),
          AsyncStorage.getItem('@widget_birth_time'),
          AsyncStorage.getItem('@widget_chart_mode'),
        ]);
        const activeMode: WidgetChartMode =
          savedCMode === 'body' || savedCMode === 'soul' || savedCMode === 'synthesis'
            ? savedCMode
            : 'soul';
        setWidgetChartMode(activeMode);
        if (savedBDate) {
          setWidgetBirthDate(savedBDate);
          if (savedBTime) setWidgetBirthTime(savedBTime);
          const computed = computeWidgetBirthProfile(savedBDate, savedBTime || '', activeMode);
          if (computed) {
            setSavedBirthProfile(computed);
            if (Platform.OS === 'android' && NativeModules.CosmicWidgetModule?.saveBirthProfile) {
              NativeModules.CosmicWidgetModule.saveBirthProfile(
                computed.birthDate,
                computed.birthTime,
                computed.zodiacSign,
                computed.element,
                computed.rulingPlanet,
                computed.lifePath,
                computed.chartMode,
                computed.soulZodiacSign,
                computed.soulElement,
                computed.soulRulingPlanet
              ).catch(() => {});
            }
          }
        }
        const isLockEnabled = lockN !== 'false';
        setWidgetPrefs({
          planetaryHour: pHour !== 'false',
          cosmicWeather: cWeather !== 'false',
          schumann: sch !== 'false',
          meclis: mec !== 'false',
          lockScreenNotif: isLockEnabled,
        });
        if (isLockEnabled) {
          void syncLockScreenCosmicWidget(true);
        }
      } catch {
        // ignore
      }
    })();
  }, []);

  const handleBirthDateInputChange = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 8);
    let formatted = digits;
    if (digits.length > 4) {
      formatted = `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4, 8)}`;
    } else if (digits.length > 2) {
      formatted = `${digits.slice(0, 2)}.${digits.slice(2, 4)}`;
    }
    setWidgetBirthDate(formatted);
  };

  const handleBirthTimeInputChange = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    let formatted = digits;
    if (digits.length > 2) {
      formatted = `${digits.slice(0, 2)}:${digits.slice(2, 4)}`;
    }
    setWidgetBirthTime(formatted);
  };

  const handleSelectChartMode = async (mode: WidgetChartMode) => {
    setWidgetChartMode(mode);
    await AsyncStorage.setItem('@widget_chart_mode', mode).catch(() => {});
    const targetDate = widgetBirthDate.trim() || savedBirthProfile?.birthDate || '';
    const targetTime = widgetBirthTime.trim() || savedBirthProfile?.birthTime || '';
    if (!targetDate) return;
    const computed = computeWidgetBirthProfile(targetDate, targetTime, mode);
    if (!computed) return;
    setSavedBirthProfile(computed);
    if (Platform.OS === 'android' && NativeModules.CosmicWidgetModule?.saveBirthProfile) {
      await NativeModules.CosmicWidgetModule.saveBirthProfile(
        computed.birthDate,
        computed.birthTime,
        computed.zodiacSign,
        computed.element,
        computed.rulingPlanet,
        computed.lifePath,
        computed.chartMode,
        computed.soulZodiacSign,
        computed.soulElement,
        computed.soulRulingPlanet
      ).catch(() => {});
    }
    if (widgetPrefs.lockScreenNotif) {
      await syncLockScreenCosmicWidget(true);
    }
  };

  const handleSaveWidgetBirthProfile = async () => {
    const computed = computeWidgetBirthProfile(widgetBirthDate, widgetBirthTime, widgetChartMode);
    if (!computed) {
      Alert.alert('Geçersiz Tarih', 'Lütfen doğum tarihinizi GG.AA.YYYY formatında (örneğin 15.05.1992) girin.');
      return;
    }
    try {
      await Promise.all([
        AsyncStorage.setItem('@widget_birth_date', computed.birthDate),
        AsyncStorage.setItem('@widget_birth_time', computed.birthTime),
        AsyncStorage.setItem('@widget_chart_mode', computed.chartMode),
      ]);
      setSavedBirthProfile(computed);
      if (Platform.OS === 'android' && NativeModules.CosmicWidgetModule?.saveBirthProfile) {
        await NativeModules.CosmicWidgetModule.saveBirthProfile(
          computed.birthDate,
          computed.birthTime,
          computed.zodiacSign,
          computed.element,
          computed.rulingPlanet,
          computed.lifePath,
          computed.chartMode,
          computed.soulZodiacSign,
          computed.soulElement,
          computed.soulRulingPlanet
        );
      }
      if (widgetPrefs.lockScreenNotif) {
        await syncLockScreenCosmicWidget(true);
      }
      const modeTitle =
        computed.chartMode === 'soul'
          ? `✨ Ruh Haritası (${computed.soulZodiacSymbol} ${computed.soulZodiacSign})`
          : computed.chartMode === 'synthesis'
          ? `☯️ Sentez (Beden: ${computed.zodiacSign} → Ruh: ${computed.soulZodiacSign})`
          : `🌍 Beden Haritası (${computed.zodiacSymbol} ${computed.zodiacSign})`;
      Alert.alert(
        '✨ Kişisel Widget Aktif',
        `${modeTitle} • ☽ Transit Ay: ${computed.transitMoonSymbol} ${computed.transitMoonSign} (${computed.aspectName})\n\nBeden Burcu: ${computed.zodiacSymbol} ${computed.zodiacSign} (${computed.element})\nRuh Burcu (Drakonik): ${computed.soulZodiacSymbol} ${computed.soulZodiacSign} (${computed.soulElement})\n\nAna ekran ve kilit ekranı widget'larınız seçtiğiniz harita katmanına göre güncellendi!`
      );
    } catch {
      Alert.alert('Bilgi', 'Doğum bilgileriniz kaydedildi.');
    }
  };

  const handleClearWidgetBirthProfile = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem('@widget_birth_date'),
        AsyncStorage.removeItem('@widget_birth_time'),
      ]);
      setWidgetBirthDate('');
      setWidgetBirthTime('');
      setSavedBirthProfile(null);
      if (Platform.OS === 'android' && NativeModules.CosmicWidgetModule?.clearBirthProfile) {
        await NativeModules.CosmicWidgetModule.clearBirthProfile();
      }
      if (widgetPrefs.lockScreenNotif) {
        await syncLockScreenCosmicWidget(true);
      }
    } catch {
      // ignore
    }
  };

  const handlePinHomeWidget = async (widgetType: 'mini' | 'schumann' | 'cosmic' | 'planetary' | 'chakra', label: string) => {
    if (Platform.OS !== 'android') {
      Alert.alert('Bilgi', 'Ana ekran widget sabitleme özelliği Android cihazlarda desteklenmektedir.');
      return;
    }
    try {
      if (NativeModules.CosmicWidgetModule?.pinWidgetToHomeScreen) {
        const ok = await NativeModules.CosmicWidgetModule.pinWidgetToHomeScreen(widgetType);
        if (!ok) {
          Alert.alert(
            'Manuel Ekleme',
            `Telefonunuzun ana ekranında boş bir yere basılı tutup "Widget'lar -> 7LAYERS" listesinden "${label}" aracını sürükleyip bırakabilirsiniz.`
          );
        }
      } else {
        Alert.alert(
          'Bilgi',
          `Ana ekranda boş bir yere basılı tutup "Widget'lar -> 7LAYERS" menüsünden "${label}" widget'ını ekleyebilirsiniz.`
        );
      }
    } catch {
      Alert.alert(
        'Manuel Ekleme',
        `Ana ekranda boş bir yere basılı tutup "Widget'lar -> 7LAYERS" menüsünden "${label}" widget'ını ekleyebilirsiniz.`
      );
    }
  };

  const syncLockScreenCosmicWidget = useCallback(async (enabled: boolean) => {
    if (Platform.OS === 'web') return;
    try {
      await Notifications.dismissNotificationAsync('cosmic-lockscreen-widget').catch(() => {});
      if (!enabled) return;

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') return;

      const savedLocation = await AsyncStorage.getItem('last_planet_hours_location');
      let lat = 41.0082;
      let lon = 28.9784;
      if (savedLocation) {
        const parsed = JSON.parse(savedLocation);
        if (typeof parsed.lat === 'number' && typeof parsed.lon === 'number') {
          lat = parsed.lat;
          lon = parsed.lon;
        }
      }

      const now = new Date();
      let pData = getPlanetaryHours(now, lat, lon);
      if (now < pData.sunrise) {
        pData = getPlanetaryHours(new Date(now.getTime() - 86400000), lat, lon);
      }
      const current = pData.hours.find((h: PlanetaryHour) => now >= h.startTime && now < h.endTime);
      const pInfo = current ? getPlanetInfo(current.planet) : { symbol: '☉', name: 'Güneş' };
      const minsLeft = current ? Math.max(0, Math.floor((current.endTime.getTime() - now.getTime()) / 60000)) : 0;
      const moon = getLiveMoonPhaseSummary(now);
      const dayInfo = DAY_CHAKRA_MAP[now.getDay()];
      const bDate = await AsyncStorage.getItem('@widget_birth_date');
      const bTime = await AsyncStorage.getItem('@widget_birth_time');
      const cModeRaw = await AsyncStorage.getItem('@widget_chart_mode');
      const cMode: WidgetChartMode =
        cModeRaw === 'body' || cModeRaw === 'soul' || cModeRaw === 'synthesis' ? cModeRaw : 'soul';
      const bProfile = bDate ? computeWidgetBirthProfile(bDate, bTime || '', cMode) : null;

      const activeSignLabel = bProfile
        ? bProfile.chartMode === 'soul'
          ? `✨ Ruh: ${bProfile.soulZodiacSymbol} ${bProfile.soulZodiacSign}`
          : bProfile.chartMode === 'synthesis'
          ? `☯️ ${bProfile.zodiacSign}→${bProfile.soulZodiacSign}`
          : `🌍 Beden: ${bProfile.zodiacSymbol} ${bProfile.zodiacSign}`
        : '';

      await Notifications.scheduleNotificationAsync({
        identifier: 'cosmic-lockscreen-widget',
        content: {
          title: bProfile
            ? `${pInfo.symbol} ${pInfo.name} (${minsLeft} dk) • ${activeSignLabel} • ☽ Ay ${bProfile.transitMoonSign}`
            : `${pInfo.symbol} Gezegen Saati: ${pInfo.name} (${minsLeft} dk kaldı)`,
          body: bProfile
            ? `${bProfile.personalDo} | ${moon.icon} ${moon.name} (%${moon.illumination})`
            : `${moon.icon} ${moon.name} (%${moon.illumination}) • ${dayInfo.name}: ${dayInfo.planet}`,
          sticky: true,
          ...(Platform.OS === 'android' ? { channelId: 'cosmic-widget-channel' } : {}),
        },
        trigger: null,
      });
    } catch {
      // ignore
    }
  }, []);

  const toggleWidgetPref = async (
    key: 'planetaryHour' | 'cosmicWeather' | 'schumann' | 'meclis' | 'lockScreenNotif',
    storageKey: string,
    val: boolean
  ) => {
    setWidgetPrefs((prev) => ({ ...prev, [key]: val }));
    try {
      await AsyncStorage.setItem(storageKey, val ? 'true' : 'false');
      if (key === 'lockScreenNotif') {
        await syncLockScreenCosmicWidget(val);
      }
    } catch {
      // ignore
    }
  };

  // Ana sayfadayken geri tuşuna basıldığında boşluğa düşme uyarısı vermeden güvenle çık
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        BackHandler.exitApp();
        return true;
      };
      const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => sub.remove();
    }, [])
  );
  
  const currentDay = new Date().getDay(); // 0: Pazar, 1: Pzt ...
  const [selectedDay, setSelectedDay] = useState(currentDay);
  const { data: chakraData } = useContent<{ modules: any[] }>('/api/content/chakras');
  const MODULES = chakraData?.modules ?? [];
  const selectedInfo = DAY_CHAKRA_MAP[selectedDay];
  const selectedChakra = MODULES.find((m: any) => m.id === selectedInfo.chakraId);
  const { data: affirmations } = useContent<Record<number, { text: string; author: string }>>('/api/content/affirmations');
  const dailyAffirmation = (affirmations ?? {})[selectedDay];

  useEffect(() => {
    const loadUser = async () => {
      try {
        const me: any = await getMe();
        if (me?.user) {
          setUserName(me.user.fullName?.split(' ')[0] || 'Yolcu');
          setIsLoggedIn(true);
          setUserRole(me.role || 'free');
          const roleLabels: Record<string, string> = {
            free: 'Arayışta',
            apprentice: 'Çırak',
            journeyman: 'Kalfa',
            master: 'Usta',
            admin: 'Yönetici',
          };
          setUserTitle(roleLabels[me.role] || 'Arayışta');
        } else {
          setIsLoggedIn(false);
        }
      } catch {
        setIsLoggedIn(false); // misafir
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      setUnreadChatReplies(0);
      setLatestReplyNotif(null);
      return;
    }

    let active = true;

    (async () => {
      try {
        if (Platform.OS !== 'web') {
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;
          if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
          }
          if (finalStatus === 'granted') {
            const tokenRes = await Notifications.getExpoPushTokenAsync();
            if (tokenRes?.data) {
              await apiFetch('/api/chat/notifications', {
                method: 'POST',
                body: JSON.stringify({
                  action: 'register_push_token',
                  expoPushToken: tokenRes.data,
                }),
              });
            }
          }
        }
      } catch {
        // Ignore on simulator / Expo Go without push entitlement
      }
    })();

    const pollChatNotifications = async () => {
      try {
        const data: any = await apiFetch('/api/chat/notifications');
        if (!active || !data?.success) return;

        const list: any[] = data.notifications || [];
        const unread = list.filter((n) => !n.isRead);
        setUnreadChatReplies(data.unreadCount || 0);
        setLatestReplyNotif(unread[0] || null);

        if (!initialReplyFetchRef.current) {
          list.forEach((n) => seenReplyNotifsRef.current.add(n.id));
          initialReplyFetchRef.current = true;
        } else {
          const newest = unread.find((n) => !seenReplyNotifsRef.current.has(n.id));
          list.forEach((n) => seenReplyNotifsRef.current.add(n.id));
          if (newest && Platform.OS !== 'web') {
            try {
              await Notifications.scheduleNotificationAsync({
                content: {
                  title: `${newest.roomIcon || '🏛️'} ${newest.roomTitle} • Yeni Yanıt`,
                  body: `@${newest.senderName}: "${newest.messagePreview}"`,
                  data: { roomId: newest.roomId },
                },
                trigger: null,
              });
            } catch {
              // ignore
            }
          }
        }
      } catch {
        // ignore
      }
    };

    void pollChatNotifications();
    const timer = setInterval(pollChatNotifications, 9000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [isLoggedIn]);

  const handleLogout = async () => {
    await apiLogout();
    router.replace('/(auth)/login');
  };

  const handleLogin = () => {
    router.push('/(auth)/login');
  };

  return (
    <SacredBackground>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Üst Bilgi Başlığı */}
        <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerProfile}
          onPress={() => router.push('/(dashboard)/profile')}
          activeOpacity={0.7}
        >
          <Image source={require('@/assets/images/gold-logo.png')} style={styles.headerAvatar} />
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
              <Text style={styles.welcomeText}>Hoş Geldin, </Text>
              <View style={styles.titleBadge}>
                <Ionicons name="sparkles" size={10} color="#FFD700" style={{ marginRight: 3 }} />
                <Text style={styles.titleBadgeText}>{userTitle}</Text>
              </View>
            </View>
            <Text style={styles.nameText}>{userName}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.headerMenuBtn} 
          onPress={() => {
            setIsToolsExpanded(true);
            setIsLessonsExpanded(false);
          }}
        >
          <Ionicons name="ellipsis-vertical" size={26} color={COLORS.text} />
        </TouchableOpacity>
      </View>

        {/* Günlük Çakra Rehberi */}
        <BlurView intensity={40} tint="dark" style={styles.profileCard}>
          <TouchableOpacity 
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
            onPress={() => setIsTimelineExpanded(!isTimelineExpanded)}
            activeOpacity={0.7}
          >
            <View style={[styles.levelBadge, { marginBottom: 0, backgroundColor: selectedChakra?.color + '40' }]}>
              <Text style={[styles.levelText, { color: selectedChakra?.color }]}>{selectedInfo.name}: {selectedInfo.planet}</Text>
            </View>
            <Ionicons name={isTimelineExpanded ? "chevron-up" : "chevron-down"} size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
          
          {isTimelineExpanded && (
            <View style={{ marginTop: 15 }}>
              <Text style={[styles.hintText, { textAlign: 'left', fontSize: 14, color: COLORS.text, marginBottom: 20, fontStyle: 'normal' }]}>
                {selectedDay === currentDay ? 'Bugün ' : ''}<Text style={{ color: selectedChakra?.color, fontWeight: 'bold' }}>{selectedChakra?.title}'nı</Text> onurlandırmak ve enerjisini aktive etmek için en verimli gün.
              </Text>

              {/* Haftanın Günleri Timeline */}
              <View style={styles.weekTimeline}>
                {[1, 2, 3, 4, 5, 6, 0].map((dayIndex) => { // Pzt'den Pazara sıralama
                  const info = DAY_CHAKRA_MAP[dayIndex];
                  const chakra = MODULES.find(m => m.id === info.chakraId);
                  const isSelected = selectedDay === dayIndex;
                  const isToday = currentDay === dayIndex;

                  return (
                    <TouchableOpacity key={dayIndex} style={styles.dayNode} onPress={() => setSelectedDay(dayIndex)} activeOpacity={0.7}>
                      <View style={[
                        styles.dayCircle, 
                        isSelected ? { backgroundColor: chakra?.color, shadowColor: chakra?.color, shadowOpacity: 0.8, shadowRadius: 8, elevation: 5 } : { backgroundColor: 'rgba(255,255,255,0.1)' }
                      ]}>
                        <Text style={[styles.dayInitial, isSelected && { color: '#000', fontWeight: 'bold' }]}>
                          {info.name.substring(0, 3)}
                        </Text>
                      </View>
                      {isToday && <View style={[styles.activeDot, { backgroundColor: isSelected ? chakra?.color : COLORS.textMuted }]} />}
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Günün Olumlaması (Birleştirildi) */}
              {dailyAffirmation && (
                <View style={{ marginTop: 25, paddingTop: 20, borderTopWidth: 1, borderTopColor: 'rgba(212, 175, 55, 0.2)' }}>
                  <Text style={{ fontSize: 36, color: selectedChakra?.color || COLORS.primary, alignSelf: 'center', marginBottom: 10, textShadowColor: selectedChakra?.color, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 10 }}>{selectedInfo.symbol}</Text>
                  <Text style={styles.affirmationText}>"{dailyAffirmation.text}"</Text>
                  <Text style={[styles.affirmationAuthor, { color: selectedChakra?.color || COLORS.primaryDark, marginBottom: 15 }]}>— {dailyAffirmation.author}</Text>

                  {/* Planetary Day Guidelines */}
                  {(() => {
                    const planetKeys = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
                    const key = planetKeys[selectedDay];
                    const guide = PLANET_DAY_GUIDELINES[key];
                    if (!guide) return null;
                    return (
                      <View style={{ borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.05)', paddingTop: 15, marginTop: 10 }}>
                        <Text style={{ color: selectedChakra?.color || COLORS.primary, fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 8, alignSelf: 'center' }}>
                          {guide.symbol} {guide.name} Günü Enerjisi
                        </Text>
                        <View style={{ gap: 8 }}>
                          <View>
                            <Text style={{ color: '#34D399', fontSize: 11, fontWeight: 'bold', marginBottom: 2 }}>✓ Yapılması Önerilenler:</Text>
                            <Text style={{ color: COLORS.textMuted, fontSize: 11, lineHeight: 15, textAlign: 'justify' }}>{guide.do}</Text>
                          </View>
                          <View>
                            <Text style={{ color: '#F87171', fontSize: 11, fontWeight: 'bold', marginBottom: 2 }}>✗ Kaçınılması Gerekenler:</Text>
                            <Text style={{ color: COLORS.textMuted, fontSize: 11, lineHeight: 15, textAlign: 'justify' }}>{guide.avoid}</Text>
                          </View>
                        </View>
                      </View>
                    );
                  })()}
                </View>
              )}
            </View>
          )}
        </BlurView>

        {/* Kozmik Widget Başlığı & Özelleştirme Butonu */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, paddingHorizontal: 4 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Ionicons name="grid-outline" size={15} color={COLORS.primary} />
            <Text style={{ color: COLORS.primary, fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 }}>
              Canlı Kozmik Widget'lar
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowWidgetModal(true)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              backgroundColor: 'rgba(212,175,55,0.12)',
              borderWidth: 1,
              borderColor: 'rgba(212,175,55,0.35)',
              borderRadius: 12,
              paddingHorizontal: 10,
              paddingVertical: 5,
            }}
          >
            <Ionicons name="options-outline" size={13} color="#FDE68A" />
            <Text style={{ color: '#FDE68A', fontSize: 11, fontWeight: '700' }}>Widget Ayarları</Text>
          </TouchableOpacity>
        </View>

        <PlanetaryHourWidget visible={widgetPrefs.planetaryHour} />
        <CosmicMoonWeatherWidget visible={widgetPrefs.cosmicWeather} />
        {widgetPrefs.schumann && <SchumannMiniWidget />}

        {/* Ezoterik Meclis & Sohbet Odaları Kartı */}
        {widgetPrefs.meclis && (
        <TouchableOpacity
          style={[
            styles.schumannWidget,
            {
              borderLeftColor: unreadChatReplies > 0 ? '#F59E0B' : '#A855F7',
              marginBottom: 20,
            },
          ]}
          onPress={() =>
            router.push(
              latestReplyNotif?.roomId
                ? (`/(dashboard)/meclis?room=${encodeURIComponent(latestReplyNotif.roomId)}` as any)
                : '/(dashboard)/meclis'
            )
          }
          activeOpacity={0.75}
        >
          <View style={styles.schumannRow}>
            <View
              style={[
                styles.planetIconWrapper,
                {
                  backgroundColor:
                    unreadChatReplies > 0 ? 'rgba(245,158,11,0.22)' : 'rgba(168,85,247,0.18)',
                  borderColor: unreadChatReplies > 0 ? '#F59E0B' : '#A855F7',
                },
              ]}
            >
              <Ionicons
                name={unreadChatReplies > 0 ? 'notifications' : 'chatbubbles-outline'}
                size={18}
                color={unreadChatReplies > 0 ? '#FCD34D' : '#D8B4FE'}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 15 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={[styles.schumannTitle, { color: '#D8B4FE' }]}>
                  7Layers Kadim Meclis
                </Text>
                {unreadChatReplies > 0 && (
                  <View
                    style={{
                      backgroundColor: '#F59E0B',
                      borderRadius: 10,
                      paddingHorizontal: 7,
                      paddingVertical: 1.5,
                    }}
                  >
                    <Text style={{ color: '#000', fontSize: 10, fontWeight: '900' }}>
                      {unreadChatReplies} Yeni Yanıt
                    </Text>
                  </View>
                )}
              </View>
              <Text style={[styles.schumannStatusName, { color: '#fff' }]} numberOfLines={1}>
                {latestReplyNotif
                  ? `@${latestReplyNotif.senderName}: "${latestReplyNotif.messagePreview}"`
                  : 'Ezoterik Sohbet Odaları (8 Oda)'}
              </Text>
            </View>
            <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
              <Ionicons name="arrow-forward" size={14} color={unreadChatReplies > 0 ? '#FCD34D' : '#D8B4FE'} />
            </View>
          </View>
          <View style={styles.schumannFooter}>
            <Text style={styles.schumannFooterText} numberOfLines={1}>
              {latestReplyNotif
                ? `${latestReplyNotif.roomIcon || '🏛️'} ${latestReplyNotif.roomTitle} odasında mesajınıza yanıt geldi`
                : '🏛️ Kabala, Sembolizm, Astroloji & Human Design'}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 10, color: unreadChatReplies > 0 ? '#FCD34D' : '#D8B4FE', fontWeight: 'bold' }}>
                {unreadChatReplies > 0 ? 'Yanıtı Gör' : 'Meclise Katıl'}
              </Text>
              <Ionicons name="chevron-forward" size={12} color={unreadChatReplies > 0 ? '#FCD34D' : '#D8B4FE'} style={{ marginLeft: 2 }} />
            </View>
          </View>
        </TouchableOpacity>
        )}

        {/* Modüller: Anatomik Çakra Haritası */}
        <Text style={styles.sectionTitle}>7 İnisiyasyon Katmanı</Text>
        
        <View style={styles.anatomicalContainer}>
          <Image 
            source={{ uri: 'https://mbqjklupfoqbcfxusigs.supabase.co/storage/v1/object/public/app-assets/images/human_silhouette.png' }} 
            style={styles.silhouetteImage} 
            resizeMode="cover" 
          />
          
          {/* Çalışma Kuralları & Analiz Butonları */}
          <View style={styles.topButtonsContainer}>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <TouchableOpacity 
                style={styles.guidelinesBtn}
                onPress={() => router.push('/(dashboard)/chakra-analysis')}
                activeOpacity={0.5}
              >
                <Ionicons name="scan-circle-outline" size={16} color={COLORS.primaryDark} style={{ marginRight: 5 }} />
                <Text style={[styles.guidelinesText, { color: COLORS.primaryDark }]}>Çakra Analizi</Text>
              </TouchableOpacity>
            </View>

            <View style={{ width: 1, height: 15, backgroundColor: 'rgba(212, 175, 55, 0.4)', marginHorizontal: 10 }} />

            <View style={{ flex: 1, alignItems: 'flex-start' }}>
              <TouchableOpacity 
                style={styles.guidelinesBtn}
                onPress={() => router.push('/(dashboard)/chakra-guidelines')}
                activeOpacity={0.5}
              >
                <Ionicons name="warning-outline" size={14} color={COLORS.primaryDark} style={{ marginRight: 5 }} />
                <Text style={[styles.guidelinesText, { color: COLORS.primaryDark }]}>Önemli Hususlar</Text>
              </TouchableOpacity>
            </View>
          </View>

          {MODULES.map((mod) => {
            const isUnlocked = true;
            return (
              <TouchableOpacity 
                key={mod.id} 
                style={[styles.chakraNode, { top: mod.top as any }]}
                activeOpacity={0.8}
                onPress={() => {
                  if (isUnlocked) {
                    router.push(`/chakra/${mod.id}`);
                  }
                }}
              >
                <View style={[styles.nodeCircle, { backgroundColor: mod.color + '30', borderColor: mod.color, shadowColor: mod.color }]} />
                <View style={styles.nodeLabelContainer}>
                  <Text style={[styles.nodeTitle, { color: mod.color }]}>{mod.title}</Text>
                  <Text style={styles.nodeSubtitle}>{mod.subtitle}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{height: 100}} />
      </ScrollView>

      {/* Ekranın Altında Akan Yazı */}
      <MarqueeText text="Gerçek katman katmandır ve yapman gereken unuttuklarını hatırlayarak katmanları açmaktır. Hatırladıkça aydınlık artacak ve ışığın kaynağını bulacaksın..." />

      {/* Kozmik Widget Yöneticisi Modalı */}
      <Modal
        visible={showWidgetModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowWidgetModal(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', padding: 16 }}>
          <View style={{ backgroundColor: '#0E121D', borderRadius: 22, borderWidth: 1, borderColor: 'rgba(212,175,55,0.45)', padding: 18, maxHeight: '90%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="options" size={18} color="#FDE68A" />
                <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '800' }}>Kozmik Widget Merkezi</Text>
              </View>
              <TouchableOpacity onPress={() => setShowWidgetModal(false)}>
                <Ionicons name="close" size={22} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Kişisel Doğum Bilgisi Giriş Kartı */}
              <View style={{
                backgroundColor: 'rgba(212,175,55,0.08)',
                borderWidth: 1,
                borderColor: 'rgba(212,175,55,0.35)',
                borderRadius: 16,
                padding: 12,
                marginBottom: 14
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={{ color: '#FDE68A', fontSize: 12, fontWeight: '800', flex: 1, marginRight: 6 }} numberOfLines={1} adjustsFontSizeToFit>
                    🎯 Widget Kişisel Doğum &amp; Harita Katmanı
                  </Text>
                  {savedBirthProfile && (
                    <View style={{ backgroundColor: 'rgba(16,185,129,0.18)', borderWidth: 1, borderColor: 'rgba(16,185,129,0.45)', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2, flexShrink: 0 }}>
                      <Text style={{ color: '#34D399', fontSize: 9.5, fontWeight: '800' }}>
                        {savedBirthProfile.chartMode === 'soul'
                          ? 'RUH HARİTASI AKTİF'
                          : savedBirthProfile.chartMode === 'synthesis'
                          ? 'SENTEZ MOD AKTİF'
                          : 'BEDEN HARİTASI AKTİF'}
                      </Text>
                    </View>
                  )}
                </View>
                <Text style={{ color: '#D1D5DB', fontSize: 11, lineHeight: 15, marginBottom: 10 }}>
                  Doğum tarihinize göre hem <Text style={{ color: '#FDE68A', fontWeight: '700' }}>Beden Haritası (Tropikal)</Text> hem de <Text style={{ color: '#A78BFA', fontWeight: '700' }}>Ruh Haritası (Drakonik / Kuzey Ay Düğümü 0° Koç)</Text> burcunuz hesaplanır. Çalıştırdığınız harita katmanını seçin:
                </Text>

                {/* Harita Katmanı Seçici: Beden vs Ruh vs Sentez */}
                <View style={{ flexDirection: 'row', gap: 6, marginBottom: 10 }}>
                  {([
                    { mode: 'body' as const, label: '🌍 Beden', sub: 'Tropikal' },
                    { mode: 'soul' as const, label: '✨ Ruh Haritası', sub: 'Drakonik' },
                    { mode: 'synthesis' as const, label: '☯️ Sentez', sub: 'Beden + Ruh' },
                  ]).map((opt) => {
                    const isSelected = widgetChartMode === opt.mode;
                    return (
                      <TouchableOpacity
                        key={opt.mode}
                        onPress={() => handleSelectChartMode(opt.mode)}
                        style={{
                          flex: 1,
                          backgroundColor: isSelected ? 'rgba(212,175,55,0.22)' : 'rgba(0,0,0,0.4)',
                          borderWidth: 1,
                          borderColor: isSelected ? '#D4AF37' : 'rgba(255,255,255,0.12)',
                          borderRadius: 10,
                          paddingVertical: 6,
                          paddingHorizontal: 4,
                          alignItems: 'center',
                        }}
                      >
                        <Text style={{ color: isSelected ? '#FDE68A' : '#E5E7EB', fontSize: 10.5, fontWeight: '800' }}>
                          {opt.label}
                        </Text>
                        <Text style={{ color: isSelected ? '#D4AF37' : '#9CA3AF', fontSize: 9, marginTop: 1 }}>
                          {opt.sub}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10 }}>
                  <View style={{ flex: 2 }}>
                    <Text style={{ color: '#9CA3AF', fontSize: 10, fontWeight: '700', marginBottom: 4 }}>DOĞUM TARİHİ (GG.AA.YYYY)</Text>
                    <TextInput
                      value={widgetBirthDate}
                      onChangeText={handleBirthDateInputChange}
                      placeholder="Örn: 15.05.1990"
                      placeholderTextColor="#6B7280"
                      keyboardType="number-pad"
                      maxLength={10}
                      style={{
                        backgroundColor: 'rgba(0,0,0,0.45)',
                        borderWidth: 1,
                        borderColor: 'rgba(255,255,255,0.15)',
                        borderRadius: 10,
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        color: '#FFFFFF',
                        fontSize: 13,
                        fontWeight: '700',
                      }}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#9CA3AF', fontSize: 10, fontWeight: '700', marginBottom: 4 }}>SAAT (OPSİYONEL)</Text>
                    <TextInput
                      value={widgetBirthTime}
                      onChangeText={handleBirthTimeInputChange}
                      placeholder="14:30"
                      placeholderTextColor="#6B7280"
                      keyboardType="number-pad"
                      maxLength={5}
                      style={{
                        backgroundColor: 'rgba(0,0,0,0.45)',
                        borderWidth: 1,
                        borderColor: 'rgba(255,255,255,0.15)',
                        borderRadius: 10,
                        paddingHorizontal: 10,
                        paddingVertical: 8,
                        color: '#FFFFFF',
                        fontSize: 13,
                        fontWeight: '700',
                      }}
                    />
                  </View>
                </View>

                {savedBirthProfile && (
                  <View style={{ backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 10, padding: 9, marginBottom: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }}>
                    <View style={{ flexDirection: 'row', gap: 6, marginBottom: 6 }}>
                      <View style={{
                        flex: 1,
                        backgroundColor: savedBirthProfile.chartMode === 'body' ? 'rgba(212,175,55,0.16)' : 'rgba(255,255,255,0.04)',
                        borderRadius: 8,
                        padding: 6,
                        borderWidth: 1,
                        borderColor: savedBirthProfile.chartMode === 'body' ? 'rgba(212,175,55,0.5)' : 'rgba(255,255,255,0.08)',
                      }}>
                        <Text style={{ color: '#9CA3AF', fontSize: 9, fontWeight: '700' }}>🌍 BEDEN HARİTASI (ASSİAH)</Text>
                        <Text style={{ color: '#FDE68A', fontSize: 11.5, fontWeight: '800', marginTop: 1 }}>
                          {savedBirthProfile.zodiacSymbol} {savedBirthProfile.zodiacSign} ({savedBirthProfile.element})
                        </Text>
                      </View>
                      <View style={{
                        flex: 1,
                        backgroundColor: savedBirthProfile.chartMode === 'soul' ? 'rgba(167,139,250,0.18)' : 'rgba(255,255,255,0.04)',
                        borderRadius: 8,
                        padding: 6,
                        borderWidth: 1,
                        borderColor: savedBirthProfile.chartMode === 'soul' ? 'rgba(167,139,250,0.55)' : 'rgba(255,255,255,0.08)',
                      }}>
                        <Text style={{ color: '#C4B5FD', fontSize: 9, fontWeight: '700' }}>✨ RUH HARİTASI (DRAKONİK)</Text>
                        <Text style={{ color: '#DDD6FE', fontSize: 11.5, fontWeight: '800', marginTop: 1 }}>
                          {savedBirthProfile.soulZodiacSymbol} {savedBirthProfile.soulZodiacSign} ({savedBirthProfile.soulElement})
                        </Text>
                      </View>
                    </View>
                    <Text style={{ color: '#FDE68A', fontSize: 10.5, fontWeight: '800', marginBottom: 3 }}>
                      ☽ Transit Ay: {savedBirthProfile.transitMoonSymbol} {savedBirthProfile.transitMoonSign} ({savedBirthProfile.aspectName}) • KAD: {savedBirthProfile.northNodeSign}
                    </Text>
                    <Text style={{ color: '#34D399', fontSize: 10.5, fontWeight: '700', lineHeight: 14 }}>
                      {savedBirthProfile.personalDo}
                    </Text>
                    <Text style={{ color: '#F87171', fontSize: 10, marginTop: 2, lineHeight: 14 }}>
                      {savedBirthProfile.personalAvoid}
                    </Text>
                  </View>
                )}

                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity
                    onPress={handleSaveWidgetBirthProfile}
                    style={{
                      flex: 1,
                      backgroundColor: '#D4AF37',
                      borderRadius: 10,
                      paddingVertical: 9,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ color: '#000000', fontSize: 12, fontWeight: '800' }}>
                      Widget&apos;a Kaydet &amp; Kişiselleştir
                    </Text>
                  </TouchableOpacity>
                  {savedBirthProfile && (
                    <TouchableOpacity
                      onPress={handleClearWidgetBirthProfile}
                      style={{
                        backgroundColor: 'rgba(239,68,68,0.15)',
                        borderWidth: 1,
                        borderColor: 'rgba(239,68,68,0.4)',
                        borderRadius: 10,
                        paddingHorizontal: 12,
                        paddingVertical: 9,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text style={{ color: '#F87171', fontSize: 11, fontWeight: '700' }}>Genel Moda Dön</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              <Text style={{ color: '#9CA3AF', fontSize: 12, lineHeight: 17, marginBottom: 10 }}>
                Ana sayfanızda ve telefonunuzun kilit/bildirim ekranında görmek istediğiniz kozmik araçları özelleştirin:
              </Text>

              {[
                {
                  key: 'planetaryHour' as const,
                  storageKey: '@show_planetary_widget',
                  title: '🪐 Anlık Gezegen Saati Widget\'ı',
                  sub: 'Bulunduğunuz konuma göre aktif Keldani gezegen saatini ve kalan süreyi gösterir.',
                },
                {
                  key: 'cosmicWeather' as const,
                  storageKey: '@show_cosmic_weather_widget',
                  title: '🌙 Gökyüzü & Ay Fazı Widget\'ı',
                  sub: 'Canlı Ay fazını, aydınlanma oranını ve günün kozmik akışını gösterir.',
                },
                {
                  key: 'schumann' as const,
                  storageKey: '@show_schumann_widget',
                  title: '⚡ Schumann Rezonansı Widget\'ı',
                  sub: 'Dünya\'nın elektromanyetik kalp atışı spektrogramına hızlı erişim sağlar.',
                },
                {
                  key: 'meclis' as const,
                  storageKey: '@show_meclis_widget',
                  title: '🏛️ 7Layers Kadim Meclis Widget\'ı',
                  sub: '8 ezoterik sohbet odasına ve gelen yanıt bildirimlerine hızlı erişim kartı.',
                },
                {
                  key: 'lockScreenNotif' as const,
                  storageKey: '@show_lockscreen_widget',
                  title: '📱 Kilit Ekranı & Bildirim Paneli Widget\'ı',
                  sub: 'Telefonun bildirim ve kilit ekranında canlı Gezegen Saati & Ay Fazı pusulası tutar.',
                },
              ].map((item) => (
                <View
                  key={item.key}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingVertical: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: 'rgba(255,255,255,0.06)',
                  }}
                >
                  <View style={{ flex: 1, paddingRight: 12 }}>
                    <Text style={{ color: '#F3F4F6', fontSize: 13, fontWeight: '700' }}>{item.title}</Text>
                    <Text style={{ color: '#9CA3AF', fontSize: 11, marginTop: 2 }}>{item.sub}</Text>
                  </View>
                  <Switch
                    value={widgetPrefs[item.key]}
                    onValueChange={(val) => toggleWidgetPref(item.key, item.storageKey, val)}
                    trackColor={{ false: '#374151', true: 'rgba(212,175,55,0.55)' }}
                    thumbColor={widgetPrefs[item.key] ? '#D4AF37' : '#9CA3AF'}
                  />
                </View>
              ))}

              <View style={{ marginTop: 14, padding: 12, borderRadius: 14, backgroundColor: 'rgba(212,175,55,0.08)', borderWidth: 1, borderColor: 'rgba(212,175,55,0.28)' }}>
                <Text style={{ color: '#FDE68A', fontSize: 12, fontWeight: '800', marginBottom: 4 }}>
                  📌 Telefon Ana Ekranına Widget Ekle (5 Seçenek)
                </Text>
                <Text style={{ color: '#D1D5DB', fontSize: 10.5, lineHeight: 15, marginBottom: 10 }}>
                  Aşağıdaki butonlara dokunarak veya telefonunuzun ana ekranında boş bir yere basılı tutup &ldquo;Widget&apos;lar &rarr; 7LAYERS&rdquo; menüsünden istediğiniz boyuttaki widget&apos;ı ekleyebilirsiniz:
                </Text>

                {[
                  {
                    type: 'mini' as const,
                    badge: '2x1 DAR BOY (YENİ)',
                    title: '🪐 Mini Kozmik Saat & Semboller',
                    desc: 'Dar alanlar için aktif Gezegen Saati, kalan dakika, Ay fazı (%) ve Çakra Hz sembolleri.',
                  },
                  {
                    type: 'cosmic' as const,
                    badge: '4x2 TAM BOY',
                    title: '🧭 Kozmik Pusula (Hepsi Bir Arada)',
                    desc: 'Gezegen saati, canlı Ay fazı, Beden/Ruh haritası sentezi ve günlük rehberlik.',
                  },
                  {
                    type: 'planetary' as const,
                    badge: '4x2 ORTA BOY',
                    title: '⏳ Canlı Gezegen Saatleri Akışı',
                    desc: 'Aktif gezegen saati anlamı ve sıradaki 3 gezegen saati çizelgesi.',
                  },
                  {
                    type: 'chakra' as const,
                    badge: '4x2 ORTA BOY',
                    title: '🌙 Günün Çakrası & Ay Fazı',
                    desc: 'Günün çakra frekansı (Hz), olumlaması ve canlı Ay fazı aydınlanma oranı.',
                  },
                ].map((w) => (
                  <View
                    key={w.type}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: 'rgba(0,0,0,0.45)',
                      borderRadius: 10,
                      padding: 10,
                      marginBottom: 8,
                      borderWidth: 1,
                      borderColor: w.type === 'mini' ? 'rgba(212,175,55,0.45)' : 'rgba(255,255,255,0.08)',
                    }}
                  >
                    <View style={{ flex: 1, paddingRight: 10 }}>
                      <Text style={{ color: '#D4AF37', fontSize: 9, fontWeight: '800' }}>{w.badge}</Text>
                      <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '700', marginTop: 1 }}>{w.title}</Text>
                      <Text style={{ color: '#9CA3AF', fontSize: 10, marginTop: 2, lineHeight: 13.5 }}>{w.desc}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handlePinHomeWidget(w.type, w.title)}
                      style={{
                        backgroundColor: '#D4AF37',
                        paddingHorizontal: 11,
                        paddingVertical: 8,
                        borderRadius: 9,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text style={{ color: '#000000', fontSize: 10.5, fontWeight: '800' }}>+ Ekle</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Kayan Menü Arka Planı (Açıkken) */}
      {isToolsExpanded && (
        <TouchableOpacity style={styles.topMenuOverlay} activeOpacity={1} onPress={() => setIsToolsExpanded(false)}>
           {/* Menü İçeriği */}
           <ScrollView style={styles.floatingMenuContainer} onStartShouldSetResponder={() => true} showsVerticalScrollIndicator={false}>
             
             {/* Kadim Dersler Linki */}
             <TouchableOpacity 
                style={styles.fabMenuItem} 
                onPress={() => { 
                  router.push('/(dashboard)/kadim-dersler'); 
                  setIsToolsExpanded(false);
                }}
              >
               <Ionicons name="book" size={20} color={COLORS.primary} style={{ marginRight: 10 }} />
               <Text style={styles.fabMenuText}>Kadim Dersler</Text>
             </TouchableOpacity>

             <View style={styles.fabMenuDivider} />

             {/* Kadim Uygulamalar Linki */}
             {isLoggedIn && (userRole === 'admin' || userRole === 'master') && (
               <>
                 <TouchableOpacity 
                    style={styles.fabMenuItem} 
                    onPress={() => { 
                      router.push('/(dashboard)/kadim-uygulamalar'); 
                      setIsToolsExpanded(false);
                    }}
                  >
                   <Ionicons name="flask-outline" size={20} color="#E0A96D" style={{ marginRight: 10 }} />
                   <Text style={styles.fabMenuText}>Kadim Uygulamalar</Text>
                 </TouchableOpacity>

                 <View style={styles.fabMenuDivider} />
               </>
             )}

             <TouchableOpacity style={styles.fabMenuItem} onPress={() => { router.push('/(dashboard)/meditation'); }}>
               <Ionicons name="musical-notes" size={20} color="#32ADE6" style={{ marginRight: 10 }} />
               <Text style={styles.fabMenuText}>Frekans Odası</Text>
             </TouchableOpacity>

             <View style={styles.fabMenuDivider} />

             <TouchableOpacity style={styles.fabMenuItem} onPress={() => { router.push('/(dashboard)/breathwork'); setIsToolsExpanded(false); }}>
               <Ionicons name="water" size={20} color="#FF9500" style={{ marginRight: 10 }} />
               <Text style={styles.fabMenuText}>Nefes Egzersizi</Text>
             </TouchableOpacity>

             <View style={styles.fabMenuDivider} />

             {/* Ezoterik Meclis (Sohbet Odaları) */}
             <TouchableOpacity style={styles.fabMenuItem} onPress={() => { router.push('/(dashboard)/meclis'); setIsToolsExpanded(false); }}>
               <Ionicons name="chatbubbles-outline" size={20} color="#D8B4FE" style={{ marginRight: 10 }} />
               <Text style={styles.fabMenuText}>Ezoterik Meclis (Sohbet)</Text>
             </TouchableOpacity>

             <View style={styles.fabMenuDivider} />

             {/* Blog */}
             <TouchableOpacity style={styles.fabMenuItem} onPress={() => { router.push('/(dashboard)/blog'); setIsToolsExpanded(false); }}>
               <Ionicons name="book-outline" size={20} color="#E0A96D" style={{ marginRight: 10 }} />
               <Text style={styles.fabMenuText}>Blog</Text>
             </TouchableOpacity>

             <View style={styles.fabMenuDivider} />

             {/* Analizler Merkezi Linki */}
             <TouchableOpacity style={styles.fabMenuItem} onPress={() => { router.push('/(dashboard)/kisisel-analizler'); setIsToolsExpanded(false); }}>
               <Ionicons name="analytics" size={20} color="#FF9500" style={{ marginRight: 10 }} />
               <Text style={styles.fabMenuText}>Analizler</Text>
             </TouchableOpacity>

             {/* Ay Döngüleri */}
             <TouchableOpacity style={styles.fabMenuItem} onPress={() => { router.push('/(dashboard)/kisisel-analizler/ay-donguleri'); setIsToolsExpanded(false); }}>
               <Ionicons name="moon-outline" size={20} color="#AF52DE" style={{ marginRight: 10 }} />
               <Text style={styles.fabMenuText}>Ay Döngüleri</Text>
             </TouchableOpacity>

             <View style={styles.fabMenuDivider} />

             <TouchableOpacity style={styles.fabMenuItem} onPress={() => { router.push('/(dashboard)/kisisel-analizler/gezegen-saatleri'); setIsToolsExpanded(false); }}>
               <Ionicons name="time-outline" size={20} color="#34C759" style={{ marginRight: 10 }} />
               <Text style={styles.fabMenuText}>Gezegen Saatleri</Text>
             </TouchableOpacity>

             <View style={styles.fabMenuDivider} />

             {/* Seviyeler Linki */}
             <TouchableOpacity style={styles.fabMenuItem} onPress={() => { router.push('/(dashboard)/seviyeler'); setIsToolsExpanded(false); }}>
               <Ionicons name="shield-outline" size={20} color="#D4AF37" style={{ marginRight: 10 }} />
                  <Text style={styles.fabMenuText}>Seviyeler</Text>
             </TouchableOpacity>

             <View style={styles.fabMenuDivider} />

             {/* Profil ve Ayarlar */}
             <TouchableOpacity style={styles.fabMenuItem} onPress={() => { router.push('/(dashboard)/profile'); setIsToolsExpanded(false); }}>
               <Ionicons name="settings-outline" size={20} color="#34C759" style={{ marginRight: 10 }} />
               <Text style={styles.fabMenuText}>Profil ve Ayarlar</Text>
             </TouchableOpacity>

             <View style={styles.fabMenuDivider} />

             {/* Admin Paneli */}
             {isLoggedIn && userRole === 'admin' && (
               <>
                 <TouchableOpacity style={styles.fabMenuItem} onPress={() => { router.push('/(dashboard)/admin-dashboard'); setIsToolsExpanded(false); }}>
                   <Ionicons name="shield-checkmark-outline" size={20} color="#FFD700" style={{ marginRight: 10 }} />
                   <Text style={styles.fabMenuText}>Admin Paneli</Text>
                 </TouchableOpacity>
                 <View style={styles.fabMenuDivider} />
               </>
             )}

             {isLoggedIn ? (
               <TouchableOpacity style={[styles.fabMenuItem, { marginBottom: 10 }]} onPress={handleLogout}>
                 <Ionicons name="log-out-outline" size={20} color={COLORS.error} style={{ marginRight: 10 }} />
                 <Text style={[styles.fabMenuText, { color: COLORS.error }]}>Çıkış Yap</Text>
               </TouchableOpacity>
             ) : (
               <TouchableOpacity style={[styles.fabMenuItem, { marginBottom: 10 }]} onPress={handleLogin}>
                 <Ionicons name="log-in-outline" size={20} color={COLORS.primary} style={{ marginRight: 10 }} />
                 <Text style={[styles.fabMenuText, { color: COLORS.primary }]}>Giriş Yap</Text>
               </TouchableOpacity>
             )}

           </ScrollView>
        </TouchableOpacity>
      )}
    </SacredBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SIZES.padding,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerProfile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 45,
    height: 45,
    borderRadius: 25,
    marginRight: 15,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  welcomeText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  titleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.5)',
  },
  titleBadgeText: {
    color: '#FFD700',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  logoutBtn: {
    padding: 8,
  },
  profileCard: {
    padding: 20,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.4)',
    marginBottom: 35,
    overflow: 'hidden',
  },
  levelBadge: {
    backgroundColor: COLORS.primaryDark,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  levelText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  weekTimeline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  dayNode: {
    alignItems: 'center',
    gap: 5,
  },
  dayCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayInitial: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 2,
  },
  hintText: {
    color: COLORS.textMuted,
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  affirmationCard: {
    padding: 20,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    marginBottom: 35,
    backgroundColor: 'rgba(212, 175, 55, 0.05)',
  },
  affirmationText: {
    color: COLORS.text,
    fontSize: 15,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 10,
  },
  affirmationAuthor: {
    color: COLORS.primaryDark,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  mainToolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(10, 10, 10, 0.7)',
    borderRadius: SIZES.radius,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  mainToolIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  mainToolTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  mainToolDesc: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 20,
    color: COLORS.primaryDark,
    marginBottom: 15,
    fontWeight: 'bold',
  },
  anatomicalContainer: {
    height: 700,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 10,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: SIZES.radius * 2,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    overflow: 'hidden',
  },
  silhouetteImage: {
    width: '100%',
    height: '120%',
    opacity: 0.8,
    position: 'absolute',
    top: '-3%',
  },
  chakraNode: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 140, 
    left: '50%',
    transform: [{ translateX: -70 }], // tam ortalama
  },
  nodeCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 15,
    elevation: 8,
  },
  nodeLabelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  nodeTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  nodeSubtitle: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  marqueeContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    backgroundColor: 'rgba(15, 15, 25, 0.95)',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(212, 175, 55, 0.4)',
    overflow: 'hidden',
  },
  marqueeText: {
    color: COLORS.primary,
    fontSize: 14,
    fontStyle: 'italic',
    width: 2000,
    letterSpacing: 1,
  },
  topButtonsContainer: {
    position: 'absolute',
    top: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    zIndex: 10,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.2)',
  },
  guidelinesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  guidelinesText: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  headerMenuBtn: {
    padding: 5,
    marginLeft: 15,
  },
  topMenuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingTop: 90, 
    paddingRight: 20,
    alignItems: 'flex-end',
    zIndex: 100,
  },
  floatingMenuContainer: {
    backgroundColor: 'rgba(10, 10, 10, 0.95)',
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    width: 280,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  fabMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  fabMenuText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: 'bold',
  },
  fabMenuDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 15,
  },
  fabLessonsSubmenu: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingLeft: 45,
    paddingRight: 15,
    paddingVertical: 10,
    gap: 15,
  },
  fabSubItem: {
    paddingVertical: 4,
  },
  fabSubText: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  planetaryWidget: {
    flexDirection: 'row',
    backgroundColor: 'rgba(10, 10, 10, 0.7)',
    borderRadius: SIZES.radius,
    padding: 15,
    marginBottom: 25,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderTopColor: 'rgba(212, 175, 55, 0.2)',
    borderBottomColor: 'rgba(212, 175, 55, 0.2)',
    borderRightColor: 'rgba(212, 175, 55, 0.2)',
    alignItems: 'center',
  },
  planetIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  planetWidgetIcon: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  planetWidgetTitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  planetWidgetName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  planetWidgetTime: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  schumannWidget: {
    backgroundColor: 'rgba(10, 10, 10, 0.7)',
    borderRadius: SIZES.radius,
    padding: 15,
    marginBottom: 25,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderTopColor: 'rgba(212, 175, 55, 0.2)',
    borderBottomColor: 'rgba(212, 175, 55, 0.2)',
    borderRightColor: 'rgba(212, 175, 55, 0.2)',
  },
  schumannRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  schumannTitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  glowingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  schumannStatusName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  kpBadgeContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  kpBadgeText: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  schumannFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  schumannFooterText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontStyle: 'italic',
  }
});
