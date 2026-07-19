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
import * as Notifications from 'expo-notifications';
import { useProgress } from '@/src/context/ProgressContext';
import Slider from '@react-native-community/slider';

interface SolarWindData {
  speed: number;
  density: number;
  temperature: number;
  bz: number;
  bt: number;
  time: string;
}

interface NOAADiscussion {
  solar_activity_tr: string;
  geomagnetic_field_tr: string;
  solar_wind_tr: string;
  raw_date: string;
}

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
  solar_wind?: SolarWindData;
  noaa_discussion?: NOAADiscussion;
  cosmic_impact_score?: number;
  cosmic_status_label?: string;
  cosmic_status_desc?: string;
  schumann_real?: RealSchumannRow;
}

export default function SchumannScreen() {
  const router = useRouter();
  const { role, isAdmin } = useProgress();
  const isApprenticeOrAbove = role === 'apprentice' || role === 'journeyman' || role === 'master' || role === 'admin' || isAdmin;
  const [data, setData] = useState<KpData | null>(null);
  const [simulatedA1, setSimulatedA1] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [hoveredBar, setHoveredBar] = useState<KpHistoryItem | null>(null);
  const [hoveredSpectrogramBar, setHoveredSpectrogramBar] = useState<KpHistoryItem | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isNoaaReportOpen, setIsNoaaReportOpen] = useState(false);
  const [imageTimestamp, setImageTimestamp] = useState<number>(Date.now());
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
    if (a1 < 8) {
      return parseFloat((0.5 + ((a1 - 4) / 4) * 2.5).toFixed(2));
    } else if (a1 < 15) {
      return parseFloat((3.0 + ((a1 - 8) / 7) * 3.0).toFixed(2));
    } else if (a1 < 25) {
      return parseFloat((6.0 + ((a1 - 15) / 10) * 2.5).toFixed(2));
    } else {
      return parseFloat(Math.min(10.0, 8.5 + ((a1 - 25) / 25) * 1.5).toFixed(2));
    }
  };

  const getEstimatedImpact = (kpVal: number) => {
    const speedVal = 300 + (kpVal / 9) * 500;
    const densityVal = 3 + (kpVal / 9) * 15;
    const btVal = 5 + (kpVal / 9) * 15;
    const bzVal = 5 - (kpVal / 9) * 15;
    
    const kpWeight = (kpVal / 9) * 4.0;
    const speedWeight = Math.max(0, Math.min(2.5, ((speedVal - 300) / 500) * 2.5));
    const densityWeight = Math.max(0, Math.min(2.0, ((densityVal - 2) / 15) * 2.0));
    const btWeight = Math.max(0, Math.min(1.5, ((btVal - 5) / 15) * 1.5));
    
    const bzMultiplier = bzVal < 0 ? (1.0 + Math.min(0.25, (Math.abs(bzVal) / 20) * 0.25)) : 1.0;
    
    const rawImpact = kpWeight + speedWeight + densityWeight + btWeight;
    return parseFloat(Math.min(10.0, rawImpact * bzMultiplier).toFixed(2));
  };

  const getCalculatedImpactForData = (currentData: KpData | null, kpVal: number) => {
    if (!currentData?.solar_wind) {
      return getEstimatedImpact(kpVal);
    }
    
    const kpWeight = (kpVal / 9) * 4.0;
    
    const speedVal = currentData.solar_wind.speed || 350;
    const speedWeight = Math.max(0, Math.min(2.5, ((speedVal - 300) / 500) * 2.5));
    
    const densityVal = currentData.solar_wind.density || 4;
    const densityWeight = Math.max(0, Math.min(2.0, ((densityVal - 2) / 15) * 2.0));
    
    const btVal = currentData.solar_wind.bt || 5;
    const btWeight = Math.max(0, Math.min(1.5, ((btVal - 5) / 15) * 1.5));
    
    const bzVal = currentData.solar_wind.bz || 0;
    const bzMultiplier = bzVal < 0 ? (1.0 + Math.min(0.25, (Math.abs(bzVal) / 20) * 0.25)) : 1.0;
    
    const rawImpact = kpWeight + speedWeight + densityWeight + btWeight;
    return parseFloat(Math.min(10.0, rawImpact * bzMultiplier).toFixed(2));
  };

  const getCalculatedImpact = (kpVal: number) => {
    return getCalculatedImpactForData(data, kpVal);
  };

  const RESONANCE_LOCATIONS = [
    0.0,
    0.17, 0.196, 0.22, // 7.83 Hz
    0.33, 0.353, 0.38, // 14.1 Hz
    0.48, 0.508, 0.53, // 20.3 Hz
    0.64, 0.660, 0.68, // 26.4 Hz
    0.79, 0.810, 0.83, // 32.4 Hz
    1.0
  ];

  const getBaseCyanColors = (isForecast: boolean) => {
    const baseColor = isForecast ? 'rgba(5, 5, 10, 0.2)' : 'rgba(0, 15, 45, 0.9)';
    const alpha = isForecast ? 0.35 * 0.35 : 0.35;
    const getAlphaHex = (a: number) => {
      const val = Math.min(255, Math.max(0, Math.round(a * 255)));
      return val.toString(16).padStart(2, '0');
    };
    const c = '#006E8C' + getAlphaHex(alpha);
    return [
      baseColor, // 0.0
      baseColor, // 0.17
      c,         // 0.196 (7.83 Hz)
      baseColor, // 0.22
      baseColor, // 0.33
      c,         // 0.353 (14.1 Hz)
      baseColor, // 0.38
      baseColor, // 0.48
      c,         // 0.508 (20.3 Hz)
      baseColor, // 0.53
      baseColor, // 0.64
      c,         // 0.660 (26.4 Hz)
      baseColor, // 0.68
      baseColor, // 0.79
      c,         // 0.810 (32.4 Hz)
      baseColor, // 0.83
      baseColor, // 1.0
    ];
  };

  const getKpColors = (kp: number, isForecast: boolean) => {
    const resColor = getResonanceColor(kp);
    const getRgba = (alpha: number) => {
      return `rgba(${Math.round(resColor.r)}, ${Math.round(resColor.g)}, ${Math.round(resColor.b)}, ${alpha})`;
    };
    
    const a1 = 1.0;
    const a2 = 0.8;
    const a3 = 0.6;
    const a4 = 0.4;
    const a5 = 0.2;
    
    const fFactor = isForecast ? 0.35 : 1.0;
    
    return [
      'transparent', // 0.0
      'transparent', // 0.17
      getRgba(a1 * fFactor), // 0.196 (7.83 Hz)
      'transparent', // 0.22
      'transparent', // 0.33
      getRgba(a2 * fFactor), // 0.353 (14.1 Hz)
      'transparent', // 0.38
      'transparent', // 0.48
      getRgba(a3 * fFactor), // 0.508 (20.3 Hz)
      'transparent', // 0.53
      'transparent', // 0.64
      getRgba(a4 * fFactor), // 0.660 (26.4 Hz)
      'transparent', // 0.68
      'transparent', // 0.79
      getRgba(a5 * fFactor), // 0.810 (32.4 Hz)
      'transparent', // 0.83
      'transparent', // 1.0
    ];
  };

  const fetchData = async (showPulse = true) => {
    if (showPulse) setLoading(true);
    setImageTimestamp(Date.now());
    try {
      const res = await apiFetch('/api/schumann');
      if (res) {
        if (res.history) {
          res.history = res.history.slice(-24); // Last 24 items (72 hours)
        }
        setData(res);
        if (res.history && res.history.length > 0) {
          const lastRealIndex = res.history.reduce((lastIdx: number, item: KpHistoryItem, idx: number) => {
            const isForecast = !!item.predicted;
            return !isForecast ? idx : lastIdx;
          }, res.history.length - 1);

          const mappedHistory = res.history.map((item: any, idx: number) => {
            const isLastReal = idx === lastRealIndex;
            if (isLastReal) {
              if (simulatedA1 !== null) {
                return { ...item, kp: getSchumannScoreFromA1(simulatedA1) };
              }
              const activeKp = item.kp;
              const activeImpact = getCalculatedImpactForData(res, activeKp);
              return { ...item, kp: activeImpact };
            }
            const estimatedImpact = getEstimatedImpact(item.kp);
            return { ...item, kp: estimatedImpact };
          });

          setHoveredSpectrogramBar(prev => {
            if (!prev) return mappedHistory[lastRealIndex];
            const found = mappedHistory.find((h: any) => h.time === prev.time);
            return found || mappedHistory[lastRealIndex];
          });

          setHoveredBar(prev => {
            const kpHistory = res.history.map((h: any, idx: number) => {
              if (simulatedA1 !== null && idx === lastRealIndex) {
                const activeKp = Math.min(9.0, (simulatedA1 / 75.0) * 9.0);
                return { ...h, kp: activeKp };
              }
              return h;
            });
            if (!prev) return kpHistory[lastRealIndex];
            const found = kpHistory.find((h: any) => h.time === prev.time);
            return found || kpHistory[lastRealIndex];
          });
        }
      }
    } catch (e) {
      console.error('Error fetching Kp in mobile:', e);
      Alert.alert('Hata', 'Rezonans verileri alınamadı. Lütfen internet bağlantınızı kontrol edin.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Check saved notification settings
    AsyncStorage.getItem('schumann_notifications').then(val => {
      if (val === 'true') setNotificationsEnabled(true);
    });

    // Poll every 5 minutes
    const interval = setInterval(() => fetchData(false), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleNotifications = async () => {
    if (!isApprenticeOrAbove) {
      Alert.alert(
        "Çıraklık Derecesi Gerekli",
        "Kozmik Rezonans bildirimlerini aktif edebilmek için en az Çırak (Seviye 1) seviyesinde olmalısınız. Seviye atlamak için lütfen derslerinizi ve sınavlarınızı tamamlayın."
      );
      return;
    }
    const newState = !notificationsEnabled;
    setNotificationsEnabled(newState);
    await AsyncStorage.setItem('schumann_notifications', String(newState));

    if (newState) {
      try {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status === 'granted') {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: 'Kozmik Rezonans Bildirimleri Aktif!',
              body: 'Jeomanyetik fırtına (Kp ≥ 5) ve yoğun ışık kapısı geçişlerinde tarayıcınıza ve cihazınıza anlık bildirim gönderilecektir.',
            },
            trigger: null,
          });
        } else {
          Alert.alert('Bildirim İzni Gerekli', 'Rezonans bildirimlerini alabilmek için cihaz ayarlarından bildirim izinlerini etkinleştirmeniz gerekir.');
          setNotificationsEnabled(false);
          await AsyncStorage.setItem('schumann_notifications', 'false');
        }
      } catch (e) {
        console.error('Notification error:', e);
      }
    }
  };

  const getKpColor = (kp: number) => {
    if (kp < 3) return '#10B981'; // Sakin (Yeşil)
    if (kp < 4) return '#F59E0B'; // Aktif (Sarı)
    if (kp < 5) return '#F97316'; // Kararsız (Turuncu)
    return '#EF4444'; // Fırtına (Kırmızı)
  };

  const getScoreColor = (score: number) => {
    if (score < 3.0) return '#00E5FF'; // Mavi (Cyan)
    if (score < 5.0) return '#10B981'; // Yeşil (Green)
    if (score < 7.0) return '#EF4444'; // Kırmızı (Red)
    return '#FFFFFF'; // Beyaz (Zirve Parlama / G3+)
  };

  const getSchumannLevelLabel = (score: number) => {
    if (score < 3.0) return 'Düşük Seviye (Sakin / G0)';
    if (score < 5.0) return 'Hafif Uyarım (Aktif / G0)';
    if (score < 6.0) return 'Orta Fırtına (G1 Seviyesi)';
    if (score < 7.0) return 'Güçlü Fırtına (G2 Seviyesi)';
    if (score < 8.0) return 'Şiddetli Fırtına (G3 Seviyesi)';
    if (score < 9.0) return 'Ağır Fırtına (G4 Seviyesi)';
    return 'Zirve Patlama (Ekstrem G5 Fırtınası)';
  };

  const getSchumannEsotericTitle = (score: number) => {
    if (score < 3.0) return 'Topraklanma & Entegrasyon';
    if (score < 5.0) return 'Hafif Uyarım & Uyanış Kapısı';
    if (score < 6.0) return 'Kalp Çakrası Açılımı & Sezgi Sıçraması';
    if (score < 7.0) return 'DNA Aktivasyonu & Astral Kapı';
    if (score < 8.0) return 'Taç Çakra Portalı & Işık Gövde Geçişi';
    if (score < 9.0) return 'Boyutlar Arası Geçiş & Hücresel Simya';
    return 'Ekstrem Kozmik Bütünleşme & Hücresel Simya';
  };

  const getSchumannEsotericDesc = (score: number) => {
    if (score < 3.0) return 'Enerji alanı dengelidir. Alınan kozmik bilgilerin entegrasyonu, meditasyon ve köklenmek için en uygun zamandır.';
    if (score < 5.0) return 'Hafif uyarım fazı. Rüyalarda netleşme ve aurada temizlik başlar. Yeni frekanslara uyumlanmak için kapı açılmıştır.';
    if (score < 6.0) return 'Kalp merkezinde genişleme, yüksek empati ve sezgisel yeteneklerde artış görülür. Bedenin elektromanyetik alanı genişler.';
    if (score < 7.0) return 'Güçlü plazma akışı devrededir. Işık kodlarının DNA sarmallarına entegrasyonu başlar. Astral seyahat deneyimleri sıklaşabilir.';
    if (score < 8.0) return 'Taç çakradan yüksek miktarda kozmik ışık girişi olur. Zaman algısında bükülmeler ve yüksek boyutlu rehberlik alımı gerçekleşir.';
    if (score < 9.0) return 'Hücresel düzeyde simyasal dönüşüm dalgası. Kollektif bilinçte büyük uyanış tetiklemeleri, yüksek boyutlu portalların tam açılışı.';
    return 'Zirve enerjisel portal devrede. Sinir sisteminin en yüksek kapasitede çalışması ve kozmik bilinçle bütünleşme anıdır. Bol dinlenme ve topraklanma gerekir.';
  };

  const getSpiritualLabel = (score: number) => {
    if (score >= 8.5) return 'Zirve Hücresel Uyanış (Zirve Portal)';
    if (score >= 7.0) return 'Yoğun Enerji Portalı (Giriş Aktif)';
    if (score >= 5.0) return 'Yüksek Kozmik Uyarılma (Aktif)';
    if (score >= 3.0) return 'Hafif Enerjisel Dalgalanma (Uyarılmış)';
    return 'Dengeli & Dingin Akış (Sakin)';
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



  const generateRulesAnalysis = (score: number, speed: number, density: number, bz: number, bt: number, kp: number, a1: number, f1: number) => {
    // 1. Zirve Ekstrem Schumann Fırtınası (Ekstrem G5 Fırtınası)
    if (score >= 9.0) {
      return {
        title: 'Ekstrem Schumann Rezonans Fırtınası (G5 Zirve Seviyesi)',
        science: `Tomsk Rasathanesi ölçümlerine göre Schumann Rezonansı ana mod genliği (A1) tarihi zirvesine ulaşarak ${a1.toFixed(1)} seviyesine çıktı. Frekans ${f1.toFixed(2)} Hz düzeyinde ekstrem titreşiyor. İyonosfer tabakası tam doygunluk sınırında elektrik yüküyle yüklü.`,
        symptoms: 'Sinir sisteminin en yüksek kapasitede uyarılması, derin trans benzeri uyku halleri veya mutlak uykusuzluk, baş ve ensede çok yoğun basınç, kulaklarda çok yüksek tonda uğultu/çınlama sesleri, aşırı duyarlılık ve bedensel hafiflik/ağırlık hissi dalgalanmaları.',
        spiritual: 'Zirve boyutlar arası geçiş portalı ve hücresel simya devrededir. Kollektif bilinçle ve kozmik kaynakla bütünleşme anıdır. Bol alkali su tüketin ve çıplak ayakla nemli toprağa basarak mutlak topraklanma sağlayın. Zihni tamamen susturarak teslimiyet meditasyonu yapın.'
      };
    }

    // 2. Ağır Schumann Fırtınası (G4 Seviyesi)
    if (score >= 8.0) {
      return {
        title: 'Ağır Schumann Rezonans Fırtınası (G4 Seviyesi)',
        science: `Tomsk Rasathanesi ölçümlerine göre Schumann Rezonansı ana mod genliği (A1) ekstrem bir yükselişle ${a1.toFixed(1)} seviyesine ulaştı. Frekans ${f1.toFixed(2)} Hz düzeyinde seyrediyor. İyonosfer tabakası çok yüksek manyetik basınç altında.`,
        symptoms: 'Yoğun fiziksel yorgunluk ve kas seğirmeleri (frekans uyumlanması), baş bölgesinde taç kısmına doğru yayılan basınç, uyku düzeninde derin kaymalar (gece yarısı uyanıp tekrar uyuyamama), zaman algısında geçici bükülmeler.',
        spiritual: 'Taç çakra portalı tamamen açılmıştır ve yüksek boyutlu ışık bedene geçiş enerjisi aktiftir. Bugün kendinizi zorlayacak fiziksel işlerden kesinlikle kaçının. Taç çakranızdan giren beyaz ışığın bedeninizi yıkayarak yere aktığını imgeleyin.'
      };
    }

    // 3. Şiddetli Schumann Fırtınası (G3 Seviyesi)
    if (score >= 7.0) {
      return {
        title: 'Şiddetli Schumann Rezonans Fırtınası (G3 Seviyesi)',
        science: `Tomsk Rasathanesi ölçümlerine göre Schumann Rezonansı ana mod genliği (A1) sıradışı bir sıçramayla ${a1.toFixed(1)} seviyesine ulaştı. Frekans ${f1.toFixed(2)} Hz civarında seyrediyor. İyonosfer tabakası yoğun bir elektrik yüküyle titreşiyor.`,
        symptoms: 'Sinir sisteminde belirgin uyarılma, uyku düzeninde dalgalanmalar (derin uykusuzluk ya da rüya yoğunluğu), baş ve ense bölgesinde hafif basınç, kulaklarda kesintisiz tiz çınlamalar ve çok canlı, sembolik rüyalar.',
        spiritual: 'DNA sarmallarında uyarım ve ışık kodlarının entegrasyonu aktiftir. Bedeninizi yormadan hafif egzersizler yapın. Bol su tüketin, topraklanın ve yüksek frekanslı meditasyonlara odaklanın.'
      };
    }

    // 2. Aktif Schumann Manyetik Fırtınası (G1-G2 Seviyesi)
    if (score >= 5.0) {
      return {
        title: 'Aktif Schumann Manyetik Fırtınası (G1-G2 Seviyesi)',
        science: `Tomsk Rasathanesi verilerinde Schumann Rezonansı genliği (A1) yüksek uyarım göstererek ${a1.toFixed(1)} seviyesine ulaştı. Frekans ${f1.toFixed(2)} Hz olarak iyonosferik dalgalanmaları tetikliyor.`,
        symptoms: 'Kalp atışlarında ani hızlanma veya genişleme hissi, vücutta hafif statik elektrik birikimi (dokunulan yerlerin çarpması), hafif eklem ve şakak ağrıları, uykuya dalmakta gecikme ve içsel sabırsızlık.',
        spiritual: 'Kalp çakrası ve aura alanı genişlemektedir. Bedendeki fazla elektriği boşaltmak için tuzlu su banyosu yapın veya çıplak elle toprağa dokunun. Kalp merkezli nefes pratikleri (4 saniye al, 4 saniye ver) yaparak kozmik akışı bedende dengeleyin.'
      };
    }

    // 3. Hafif Schumann Dalgalanması (Hafif Uyarım Seviyesi)
    if (score >= 3.0) {
      return {
        title: 'Hafif Schumann Dalgalanması (Hafif Uyarım Seviyesi)',
        science: `Schumann Rezonansı ana mod genliği (A1) ${a1.toFixed(1)} seviyesine çıkarak hafif bir hareketlenme gösteriyor. Frekans ${f1.toFixed(2)} Hz civarında stabil seyrediyor.`,
        symptoms: 'Rüyalarda belirgin netleşme ve sembolizm artışı, sezgisel uyanışlar, zihinde yaratıcı fikir patlamaları, kulaklarda hafif dalgalı uğultular ve hafif tatlı bir yorgunluk/esneme hali.',
        spiritual: 'Uyanış kapıları hafifçe uyarılmaktadır. Meditasyon, günlük tutma, rüya analizleri yapma ve yaratıcı projelere odaklanma için harika bir akıştır. Üçüncü göz bölgesine mavi/mor bir ışık hayal ederek odaklanabilirsiniz.'
      };
    }
    
    // 4. Güneş Rüzgarı Hızı Sıçraması
    if (speed >= 500) {
      return {
        title: 'Kozmik Plazma Rüzgarı Dalgası (Hızlı Akış)',
        science: `Güneş yüzeyindeki koronal deliklerden kopan yüksek hızlı plazma akışı saniyede ${Math.round(speed)} km hıza ulaşarak manyetik kalkanımızı sıkıştırıyor. Schumann Rezonansı ana mod genliği (A1): ${a1.toFixed(1)}, frekansı: ${f1.toFixed(2)} Hz.`,
        symptoms: 'Fiziksel bedende ani bir enerjik uyarılma, sabırsızlık/huzursuzluk hissi, kalp atışlarında hızlanma dalgaları, hafif sersemlik ve kulaklarda dalgalı frekans sesleri.',
        spiritual: 'Artan plazma akışı, aura alanınızı temizlemek ve eski hücresel kalıpları salıvermek için çalışır. Birikmiş statik elektriği nötrlemek için ılık/tuzlu bir duş alın. Kalp merkezli nefes pratikleri (4 saniye al, 4 saniye ver) yaparak akışı bedende dengeleyin.'
      };
    }
    
    // 5. Kalkan Açılması (Bz Güney)
    if (bz <= -3.0) {
      return {
        title: 'Manyetik Kalkan Geçiş Portalı (Bz Güney Yönlü)',
        science: `Dünya'nın koruyucu manyetik kalkanının yönünü belirleyen Bz parametresi güneye yönelerek ${bz.toFixed(1)} nT seviyesine ulaştı. Kalkanımızda açılan bu kapı güneş rüzgarı sızıntısını artırırken, Schumann Rezonansı genliği ${a1.toFixed(1)} ve frekansı ${f1.toFixed(2)} Hz olarak ölçüldü.`,
        symptoms: 'Yüksek duygusal duyarlılık, empati yeteneğinde aşırı artış, başkalarının enerjilerini hissetme, hafif şakak ağrıları ve rüyalarda yoğun astral semboller.',
        spiritual: 'Kalkanın açık olması ruhsal olarak alıcı (reseptif) modda olduğumuzu gösterir. Negatif enerjilerden korunmak için kendinizi mor bir ışık küresi içinde hayal edin. Adaçayı veya üzerlik otu yakarak yaşam alanınızı arındırın.'
      };
    }
    
    // 6. Parçacık Yoğunluğu Sıçraması
    if (density >= 10.0) {
      return {
        title: 'Yoğun Parçacık Bombardımanı (Proton Yoğunluğu)',
        science: `Güneş rüzgarındaki parçacık (proton) yoğunluğu cm³ başına ${density.toFixed(1)} seviyesine ulaştı. Schumann Rezonansı ana mod genliği (A1) ${a1.toFixed(1)} ve frekansı ${f1.toFixed(2)} Hz olarak kaydedildi.`,
        symptoms: 'Eklem ağrıları, kas seğirmeleri, aşırı fiziksel yorgunluk ve uykuya geçişte zorlanma, göz arkesinde hafif sızlama veya basınç.',
        spiritual: 'Artan proton akışı, hücresel şablonumuzda ve DNA yapımızda yoğun bir elektromanyetik dönüşüm tetikler. Ağır yiyeceklerden kaçının, hafif beslenin ve bol su için. Vücuttaki iletkenliği ve topraklanmayı artırmak için magnezyum takviyesi alabilirsiniz.'
      };
    }
    
    // 7. Sakin ve Dengeli Durum
    return {
      title: 'Dingin Elektromanyetik Akış (Sakin Faz)',
      science: `Güneş rüzgarı hızı (${Math.round(speed)} km/s) ve parçacık yoğunluğu (${density.toFixed(1)} p/cm³) normal sınırlarında. Tomsk Rasathanesi ölçümlerine göre Schumann Rezonansı ana frekansı ${f1.toFixed(2)} Hz (Genlik A1: ${a1.toFixed(1)}) seviyesinde dengeli ve doğal titreşiminde seyrediyor.`,
      symptoms: 'Zihinsel netlik, dengeli enerji seviyeleri, sakin uyku düzeni ve bedensel rahatlık. Zihnin gürültüsünü yatıştırmak, yeni bilgiler öğrenmek, kadim dersleri çalışmak ve kök çakra meditasyonları yapmak için en ideal dönemdir. Enerjinizin merkezlendiği bu dingin zamanı tefekkür ile değerlendirebilirsiniz.',
      spiritual: 'Zihnin gürültüsünü yatıştırmak, yeni bilgiler öğrenmek, kadim dersleri çalışmak ve kök çakra meditasyonları yapmak için en ideal dönemdir. Enerjinizin merkezlendiği bu dingin zamanı tefekkür ile değerlendirebilirsiniz.'
    };
  };

  const historyToRender = data?.history ? data.history.map((item, idx) => {
    const lastMeasuredIdx = data.history.reduce((lastIdx, currItem, currIdx) => {
      if (!currItem.predicted) {
        return currIdx;
      }
      return lastIdx;
    }, -1);

    if (idx === lastMeasuredIdx) {
      if (simulatedA1 !== null) {
        return { ...item, kp: getSchumannScoreFromA1(simulatedA1) };
      }
      const activeKp = item.kp;
      const activeImpact = getCalculatedImpact(activeKp);
      return { ...item, kp: activeImpact };
    }
    
    const estimatedImpact = getEstimatedImpact(item.kp);
    return { ...item, kp: estimatedImpact };
  }) : [];

  const kpHistoryToRender = data?.history ? data.history.map((item, idx) => {
    const lastMeasuredIdx = data.history.reduce((lastIdx, currItem, currIdx) => {
      if (!currItem.predicted) {
        return currIdx;
      }
      return lastIdx;
    }, -1);

    if (simulatedA1 !== null && idx === lastMeasuredIdx) {
      const activeKp = Math.min(9.0, (simulatedA1 / 75.0) * 9.0);
      return { ...item, kp: activeKp };
    }
    return item;
  }) : [];

  // Find index of the first forecast block to draw "ŞİMDİ" divider line
  const firstForecastIndex = historyToRender.findIndex(item => item.predicted) ?? -1;

  const activeSpectrogramBar = hoveredSpectrogramBar 
    ? (historyToRender.find(item => item.time === hoveredSpectrogramBar.time) || hoveredSpectrogramBar) 
    : null;

  const activeKpBar = hoveredBar 
    ? (kpHistoryToRender.find(item => item.time === hoveredBar.time) || hoveredBar) 
    : null;

  return (
    <SacredBackground>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={28} color={COLORS.primary} />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.headerTitle}>Schumann Rezonansı</Text>
          <Text style={styles.headerSubtitle}>Canlı Jeomanyetik Kp ve Kozmik Akış</Text>
        </View>
        <View style={{ width: 44 }} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Kozmik dalgalanmalar ölçülüyor...</Text>
        </View>
      ) : (
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          {/* 1. Kozmik Oracle / Durum Raporu */}
          {(() => {
            // Determine active metrics (simulated or live)
            let a1 = data?.schumann_real?.a1 ?? 6.0;
            let f1 = data?.schumann_real?.f1 ?? 7.83;
            
            if (simulatedA1 !== null) {
              a1 = simulatedA1;
              f1 = 7.83 + (simulatedA1 / 75.0) * 0.5;
            }

            const score = simulatedA1 !== null ? getSchumannScoreFromA1(simulatedA1) : (data?.cosmic_impact_score ?? 0.5);
            
            // Keep solar wind and Kp index strictly at their live values (do not simulate)
            const activeKp = data?.current_kp ?? 0;
            const speed = data?.solar_wind?.speed ?? 350;
            const density = data?.solar_wind?.density ?? 4;
            const bz = data?.solar_wind?.bz ?? 0;
            const bt = data?.solar_wind?.bt ?? 5;

            const analysis = generateRulesAnalysis(score, speed, density, bz, bt, activeKp, a1, f1);

            return (
              <View style={styles.oracleCard}>
                <View style={styles.oracleHeader}>
                  <View style={[styles.oracleScoreBadge, { borderColor: getScoreColor(score) }]}>
                    <Text style={styles.oracleScoreLabel}>SR İndeks</Text>
                    <Text style={[styles.oracleScoreVal, { color: getScoreColor(score) }]}>
                      {score.toFixed(1)}
                    </Text>
                    <Text style={styles.oracleScoreAmp}>
                      A1: {a1.toFixed(1)}
                    </Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.oracleBadge}>Kozmik Oracle / Durum Raporu {data?.schumann_real && `- GÖZLEM SAATİ: ${formatRealTime(data.schumann_real.time_utc)}`}</Text>
                    <Text style={styles.oracleTitle}>{analysis.title}</Text>
                    <TouchableOpacity 
                      activeOpacity={0.7}
                      onPress={() => Alert.alert(
                        `Fırtına Seviyesi: ${getSchumannLevelLabel(score)}`,
                        `Ezoterik Anlam: ${getSchumannEsotericTitle(score)}\n\n${getSchumannEsotericDesc(score)}`,
                        [{ text: "Anladım" }]
                      )}
                      style={{
                        borderColor: getScoreColor(score) + '40',
                        borderWidth: 1,
                        backgroundColor: getScoreColor(score) + '15',
                        borderRadius: 6,
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                        marginTop: 6,
                        alignSelf: 'flex-start'
                      }}
                    >
                      <Text style={{
                        color: getScoreColor(score) === '#FFFFFF' ? '#FFD700' : getScoreColor(score),
                        fontSize: 9,
                        fontWeight: 'bold'
                      }}>
                        {getSchumannLevelLabel(score)} ⓘ
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Teşhis Paragrafları Stacked */}
                <View style={styles.oracleSegment}>
                  <View style={styles.oracleSegmentHeader}>
                    <Ionicons name="medical-outline" size={14} color="#00E5FF" />
                    <Text style={[styles.oracleSegmentTitle, { color: '#00E5FF' }]}>🔬 Bilimsel Teşhis</Text>
                  </View>
                  <Text style={styles.oracleSegmentBody}>{analysis.science}</Text>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => Alert.alert(
                      "Rasathane Ölçüm Notu",
                      "Spektrogram verileri Tomsk (Rusya) Rasathanesi'nden alınmaktadır. Schumann Rezonansı küresel bir fenomen olsa da, ölçülen genlik seviyeleri ve anlık beyaz parlamalar istasyon çevresindeki yerel yıldırım fırtınalarından da etkilenebilmektedir.",
                      [{ text: "Anladım" }]
                    )}
                    style={{
                      marginTop: 10,
                      paddingTop: 8,
                      borderTopWidth: 1,
                      borderTopColor: 'rgba(255, 255, 255, 0.05)',
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}
                  >
                    <Ionicons name="globe-outline" size={12} color="#00E5FF" style={{ marginRight: 4 }} />
                    <Text style={{
                      fontSize: 10,
                      color: '#00E5FF',
                      fontWeight: 'bold'
                    }}>
                      Rasathane Ölçüm Notu ⓘ
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.oracleSegment}>
                  <View style={styles.oracleSegmentHeader}>
                    <Ionicons name="flash-outline" size={14} color="#D4AF37" />
                    <Text style={[styles.oracleSegmentTitle, { color: '#D4AF37' }]}>⚡ Beden Reaksiyonları</Text>
                  </View>
                  <Text style={styles.oracleSegmentBody}>{analysis.symptoms}</Text>
                </View>

                <View style={styles.oracleSegment}>
                  <View style={styles.oracleSegmentHeader}>
                    <Ionicons name="body-outline" size={14} color="pink" />
                    <Text style={[styles.oracleSegmentTitle, { color: 'pink' }]}>🧘 Ruhsal Rehberlik</Text>
                  </View>
                  <Text style={styles.oracleSegmentBody}>{analysis.spiritual}</Text>
                </View>
              </View>
            );
          })()}

          {/* Kozmik Enerji Simülatörü */}
          <BlurView intensity={30} tint="dark" style={styles.simulatorCard}>
            <View style={styles.simulatorHeader}>
              <Text style={styles.simulatorTitle}>Kozmik Enerji Simülatörü</Text>
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>TEST PANELİ</Text>
              </View>
            </View>
            <Text style={styles.simulatorSubtitle}>
              Farklı Schumann A1 genliği seviyelerinin iyonosferik etkilerini ve renk değişimlerini test edin
            </Text>
            
            <View style={styles.sliderWrapper}>
              <Text style={styles.sliderLabel}>A1 4.0</Text>
              <Slider
                style={styles.slider}
                minimumValue={4.0}
                maximumValue={75.0}
                step={0.5}
                value={simulatedA1 !== null ? simulatedA1 : (data?.schumann_real?.a1 ?? 6.0)}
                onValueChange={(val) => setSimulatedA1(val)}
                minimumTrackTintColor={COLORS.primary}
                maximumTrackTintColor="rgba(255, 255, 255, 0.2)"
                thumbTintColor={COLORS.primary}
              />
              <Text style={styles.sliderLabel}>A1 75.0</Text>
            </View>

            <View style={styles.simulatorFooter}>
              <Text style={styles.simulatorFooterText}>
                Simüle Edilen Değer: <Text style={styles.simulatorValueText}>
                  {simulatedA1 !== null ? `A1 Genliği ${simulatedA1.toFixed(1)}` : 'Canlı Akış'}
                </Text>
              </Text>
              {simulatedA1 !== null && (
                <TouchableOpacity 
                  style={styles.resetBtn} 
                  onPress={() => setSimulatedA1(null)}
                >
                  <Text style={styles.resetBtnText}>Sıfırla</Text>
                </TouchableOpacity>
              )}
            </View>
          </BlurView>

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

            {/* Watermark Logo & Text */}
            <View style={styles.watermarkContainer}>
              <Image 
                source={require('../../../assets/images/icon.png')} 
                style={styles.watermarkLogo} 
                resizeMode="contain"
              />
              <Text style={styles.watermarkText}>7LAYERS</Text>
            </View>
          </BlurView>

          {/* 2. Güneş Rüzgarı & Manyetik Alan İstasyonu (2x3 Grid) */}
          {!loading && data?.solar_wind && (
            (() => {
              // Keep solar wind and Kp index strictly at their live values (do not simulate)
              const activeKp = data.current_kp ?? 0;
              const speed = data.solar_wind.speed ?? 350;
              const density = data.solar_wind.density ?? 4;
              const bz = data.solar_wind.bz ?? 0;
              const bt = data.solar_wind.bt ?? 5;
              const temp = data.solar_wind.temperature ?? 150000;

              const showInfoAlert = (title: string, desc: string) => {
                Alert.alert(title, desc, [{ text: "Tamam" }]);
              };

              return (
                <BlurView intensity={30} tint="dark" style={styles.stationCard}>
                  <View style={styles.stationHeaderContainer}>
                    <Ionicons name="sunny-outline" size={18} color="#00E5FF" style={{ marginRight: 6 }} />
                    <Text style={styles.stationTitle}>Kozmik Hava Durumu & Güneş Rüzgarı</Text>
                  </View>
                  <Text style={styles.stationSubtitle}>
                    Uydularla L1 noktasında ölçülen anlık uzay havası verileri (Açıklama için kartlara dokunun).
                  </Text>

                  <View style={styles.stationGrid}>
                    {/* 1. Kp Kartı */}
                    <TouchableOpacity 
                      style={styles.stationGridItem} 
                      activeOpacity={0.7}
                      onPress={() => showInfoAlert(
                        "Kp Endeksi Nedir?", 
                        "Dünya genelindeki manyetometre ölçüm istasyonlarından gelen verilerin birleştirilmesiyle oluşturulan küresel jeomanyetik aktivite derecesidir (0-9 arası). Değer yükseldikçe manyetik fırtına olasılığı artar."
                      )}
                    >
                      <View style={styles.stationItemHeader}>
                        <Text style={styles.stationItemLabel}>Kp Endeksi ⓘ</Text>
                        <Ionicons name="pulse-outline" size={14} color="#F59E0B" />
                      </View>
                      <View>
                        <Text style={styles.stationItemValue}>Kp {activeKp.toFixed(1)}</Text>
                        <Text style={[styles.stationItemSubtext, { color: activeKp >= 5 ? '#EF4444' : activeKp >= 3 ? '#F59E0B' : '#10B981' }]}>
                          {activeKp >= 5 ? 'Fırtına' : activeKp >= 3 ? 'Uyarılmış' : 'Sakin'}
                        </Text>
                      </View>
                    </TouchableOpacity>

                    {/* 2. Rüzgar Hızı Kartı */}
                    <TouchableOpacity 
                      style={styles.stationGridItem} 
                      activeOpacity={0.7}
                      onPress={() => showInfoAlert(
                        "Güneş Rüzgarı Hızı Nedir?", 
                        "Güneş'ten fırlayan plazmanın saniyedeki hızıdır. Yüksek rüzgar hızları manyetik kalkanı sıkıştırarak iyonosferi uyarır."
                      )}
                    >
                      <View style={styles.stationItemHeader}>
                        <Text style={styles.stationItemLabel}>Güneş Hızı ⓘ</Text>
                        <Ionicons name="speedometer-outline" size={14} color="#00E5FF" />
                      </View>
                      <View>
                        <Text style={styles.stationItemValue}>{Math.round(speed)} km/s</Text>
                        <Text style={[styles.stationItemSubtext, { color: speed >= 600 ? '#EF4444' : speed >= 450 ? '#F59E0B' : '#10B981' }]}>
                          {speed >= 600 ? 'Çok Hızlı' : speed >= 450 ? 'Hızlı' : 'Sakin'}
                        </Text>
                      </View>
                    </TouchableOpacity>

                    {/* 3. Proton Yoğunluğu Kartı */}
                    <TouchableOpacity 
                      style={styles.stationGridItem} 
                      activeOpacity={0.7}
                      onPress={() => showInfoAlert(
                        "Proton Yoğunluğu Nedir?", 
                        "Güneş rüzgarı içindeki santimetreküp başına düşen proton miktarıdır. Yoğun parçacık bombardımanı atmosferdeki elektriksel yükü artırır."
                      )}
                    >
                      <View style={styles.stationItemHeader}>
                        <Text style={styles.stationItemLabel}>Yoğunluk ⓘ</Text>
                        <Ionicons name="apps-outline" size={14} color="#A78BFA" />
                      </View>
                      <View>
                        <Text style={styles.stationItemValue}>{density.toFixed(1)} p/cm³</Text>
                        <Text style={[styles.stationItemSubtext, { color: COLORS.textMuted }]}>Parçacık</Text>
                      </View>
                    </TouchableOpacity>

                    {/* 4. Bz Kartı */}
                    <TouchableOpacity 
                      style={styles.stationGridItem} 
                      activeOpacity={0.7}
                      onPress={() => showInfoAlert(
                        "Bz Değeri (Yön) Nedir?", 
                        "Manyetik alanın kuzey-güney doğrultusudur. Değerin güneye doğru (-) gitmesi, Dünya kalkanında geçici kapılar açarak enerjinin atmosfere sızmasına sebep olur."
                      )}
                    >
                      <View style={styles.stationItemHeader}>
                        <Text style={styles.stationItemLabel}>Bz Değeri ⓘ</Text>
                        <Ionicons name="shield-outline" size={14} color={bz < 0 ? '#EF4444' : '#10B981'} />
                      </View>
                      <View>
                        <Text style={[styles.stationItemValue, { color: bz < 0 ? '#EF4444' : '#10B981' }]}>{bz.toFixed(1)} nT</Text>
                        <Text style={[styles.stationItemSubtext, { color: bz < 0 ? '#EF4444' : '#10B981' }]}>
                          {bz < 0 ? 'Kalkan Açık' : 'Kalkan Kapalı'}
                        </Text>
                      </View>
                    </TouchableOpacity>

                    {/* 5. Bt Kartı */}
                    <TouchableOpacity 
                      style={styles.stationGridItem} 
                      activeOpacity={0.7}
                      onPress={() => showInfoAlert(
                        "Toplam Alan (Bt) Nedir?", 
                        "Güneşler arası manyetik alanın toplam gücünü gösterir. Bt gücü ne kadar yüksekse manyetik uyarımın şiddeti o kadar fazla olur."
                      )}
                    >
                      <View style={styles.stationItemHeader}>
                        <Text style={styles.stationItemLabel}>Toplam Bt ⓘ</Text>
                        <Ionicons name="magnet-outline" size={14} color="#F59E0B" />
                      </View>
                      <View>
                        <Text style={styles.stationItemValue}>{bt.toFixed(1)} nT</Text>
                        <Text style={[styles.stationItemSubtext, { color: COLORS.textMuted }]}>Alan Gücü</Text>
                      </View>
                    </TouchableOpacity>

                    {/* 6. Sıcaklık Kartı */}
                    <TouchableOpacity 
                      style={styles.stationGridItem} 
                      activeOpacity={0.7}
                      onPress={() => showInfoAlert(
                        "Plazma Sıcaklığı Nedir?", 
                        "Güneş rüzgarı plazmasının termal sıcaklığıdır. Yüksek değerler koronal delik veya patlama kaynaklı sıcak akışları gösterir."
                      )}
                    >
                      <View style={styles.stationItemHeader}>
                        <Text style={styles.stationItemLabel}>Sıcaklık ⓘ</Text>
                        <Ionicons name="thermometer-outline" size={14} color="#FB923C" />
                      </View>
                      <View>
                        <Text style={styles.stationItemValue}>{(temp / 1000).toFixed(0)}k K</Text>
                        <Text style={[styles.stationItemSubtext, { color: COLORS.textMuted }]}>Kelvin</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </BlurView>
              );
            })()
          )}

          {/* 2. Jeomanyetik Kp Eğilim Grafiği */}
          <BlurView intensity={30} tint="dark" style={styles.chartCard}>
            <Text style={styles.chartTitle}>Jeomanyetik Kp Eğilimi (Son 72 Saat)</Text>
            <Text style={styles.chartSubtitle}>
              Ölçülen jeomanyetik fırtına değerlerinin saatlik blokları (Kesikli sütunlar 24 saatlik tahmindir)
            </Text>

            {/* Custom Tap Tooltip Display */}
            <View style={styles.barTooltipContainer}>
              {activeKpBar ? (
                <View style={styles.barTooltip}>
                  <Text style={styles.tooltipText}>
                     Zaman: <Text style={{ fontWeight: 'bold', color: '#fff' }}>{formatTimeRange(activeKpBar.time)}</Text>  |  
                     Kp Değeri: <Text style={{ fontWeight: 'bold', color: getKpColor(activeKpBar.kp) }}>{activeKpBar.kp.toFixed(2)}</Text>
                     {activeKpBar.predicted ? ' (⚠️ Tahmin - Değişebilir)' : ' (✅ Kesinleşmiş Ölçüm)'}
                  </Text>
                </View>
              ) : (
                <Text style={styles.tooltipPlaceholder}>Detayları görmek için sütunların üzerine dokunun</Text>
              )}
            </View>

            {/* Bar Chart Canvas Area */}
            <View style={styles.chartContainer}>
              {/* Horizontal Grid lines */}
              <View style={styles.chartGridLines}>
                <View style={styles.chartGridLine} />
                <View style={styles.chartGridLine} />
                <View style={styles.chartGridLine} />
                <View style={styles.chartGridLine} />
              </View>

              {kpHistoryToRender.map((item, idx) => {
                const barHeight = Math.max(12, (item.kp / 9) * 120);
                const barColor = getKpColor(item.kp);
                const isForecast = !!item.predicted;

                return (
                  <TouchableOpacity
                    key={idx}
                    style={styles.barWrapper}
                    activeOpacity={0.8}
                    onPress={() => setHoveredBar(item)}
                  >
                    {/* The bar view */}
                    <View 
                      style={[
                        styles.barColumn,
                        {
                          height: barHeight,
                          backgroundColor: isForecast ? barColor + '30' : barColor,
                          borderColor: barColor,
                          borderStyle: isForecast ? 'dashed' : 'solid',
                          borderWidth: isForecast ? 1.5 : 0,
                        }
                      ]}
                    />

                    {/* "ŞİMDİ" Divider Line Overlay */}
                    {idx === firstForecastIndex && (
                      <View style={styles.nowLineContainer}>
                        <View style={styles.nowLineDashed} />
                        <Text style={styles.nowLineText}>ŞİMDİ</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}

              {/* Watermark Logo & Text */}
              <View style={styles.watermarkContainer}>
                <Image 
                  source={require('../../../assets/images/icon.png')} 
                  style={styles.watermarkLogo} 
                  resizeMode="contain"
                />
                <Text style={styles.watermarkText}>7LAYERS</Text>
              </View>
            </View>

            {/* X Axis Time Labels */}
            <View style={styles.chartXAxisContainer}>
              {kpHistoryToRender.map((item, idx) => {
                const isLabel = idx % 4 === 0;
                return (
                  <View key={idx} style={styles.chartXAxisSlot}>
                    {isLabel && (() => {
                      const d = new Date(item.time.endsWith('Z') ? item.time : item.time + 'Z');
                      const hours = d.getHours().toString().padStart(2, '0');
                      const isDayTransition = hours === '00';
                      
                      let label = hours;
                      let labelColor = 'rgba(255, 255, 255, 0.45)';
                      let fontWeight: 'normal' | 'bold' = 'normal';
                      
                      if (isDayTransition) {
                        const dayNamesShort = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
                        const dayName = dayNamesShort[d.getDay()];
                        label = `${dayName} ${hours}`;
                        labelColor = '#00E5FF';
                        fontWeight = 'bold';
                      }
                      
                      return (
                        <Text style={[styles.chartXAxisLabel, { color: labelColor, fontWeight: fontWeight }]}>
                          {label}
                        </Text>
                      );
                    })()}
                  </View>
                );
              })}
            </View>

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

          {/* 3. Bildirimler Ayarı */}
          <BlurView intensity={35} tint="dark" style={styles.notificationCard}>
            <View style={styles.notificationRow}>
              <View style={styles.notificationLeft}>
                <Ionicons 
                  name={!isApprenticeOrAbove ? "lock-closed-outline" : (notificationsEnabled ? "notifications-outline" : "notifications-off-outline")} 
                  size={24} 
                  color={!isApprenticeOrAbove ? '#FFD700' : COLORS.primary} 
                />
                <View style={{ marginLeft: 15, flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <Text style={styles.notificationTitle}>Kozmik Rezonans Bildirimleri</Text>
                    {!isApprenticeOrAbove && (
                      <View style={{ backgroundColor: 'rgba(212, 175, 55, 0.15)', borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.4)', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 1 }}>
                        <Text style={{ color: '#FFD700', fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase' }}>Çırak Seviyesi</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.notificationDesc}>
                    {!isApprenticeOrAbove 
                      ? 'Bu özellik Çırak seviyesi ve üzeri üyelerimiz içindir. Seviyenizi yükselterek bildirimleri aktif edebilirsiniz.' 
                      : 'Manyetik fırtınalarda anlık uyanış kapısı uyarıları'}
                  </Text>
                </View>
              </View>
              <TouchableOpacity 
                style={[
                  styles.toggleBtn, 
                  !isApprenticeOrAbove ? styles.toggleBtnLocked : (notificationsEnabled ? styles.toggleBtnActive : styles.toggleBtnInactive)
                ]}
                onPress={toggleNotifications}
              >
                <Text style={[styles.toggleBtnText, { color: !isApprenticeOrAbove ? '#FFD700' : (notificationsEnabled ? '#000' : COLORS.primary) }]}>
                  {!isApprenticeOrAbove ? 'Kilitli' : (notificationsEnabled ? 'Açık' : 'Kapalı')}
                </Text>
              </TouchableOpacity>
            </View>
          </BlurView>

          {/* 4. NOAA Günlük Uzay Havası Raporu (Açılır/Kapanır) */}
          {data?.noaa_discussion && (data.noaa_discussion.solar_activity_tr || data.noaa_discussion.geomagnetic_field_tr || data.noaa_discussion.solar_wind_tr) && (
            <BlurView intensity={25} tint="dark" style={[styles.guideCard, { marginBottom: 20 }]}>
              <TouchableOpacity 
                style={styles.guideHeader} 
                onPress={() => setIsNoaaReportOpen(!isNoaaReportOpen)}
                activeOpacity={0.8}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 10 }}>
                  <Ionicons name="book-outline" size={24} color="#00E5FF" style={{ marginRight: 10 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.guideHeaderTitle}>NOAA Günlük Uzay Havası Raporu</Text>
                  </View>
                </View>
                <Ionicons 
                  name={isNoaaReportOpen ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color={COLORS.textMuted} 
                />
              </TouchableOpacity>

              {isNoaaReportOpen && (
                <View style={styles.guideContent}>
                  <Text style={[styles.guideParagraph, { marginTop: 10, marginBottom: 15 }]}>
                    U.S. SWPC Uzay Tahmin Merkezi tarafından hazırlanan günlük bilimsel raporun Türkçe çevirisi.
                  </Text>

                  {data.noaa_discussion.raw_date && (
                    <View style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderWidth: 1,
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: 12,
                      padding: 10,
                      marginBottom: 15,
                      alignSelf: 'flex-start'
                    }}>
                      <Text style={{ color: COLORS.textMuted, fontSize: 10, fontWeight: 'bold', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' }}>
                        Yayınlanma: {data.noaa_discussion.raw_date}
                      </Text>
                    </View>
                  )}

                  {data.noaa_discussion.solar_activity_tr && (
                    <View style={styles.oracleSegment}>
                      <View style={styles.oracleSegmentHeader}>
                        <Ionicons name="sunny-outline" size={14} color="#00E5FF" />
                        <Text style={[styles.oracleSegmentTitle, { color: '#00E5FF' }]}>Güneş Aktivitesi Özet & Tahmini</Text>
                      </View>
                      <Text style={styles.oracleSegmentBody}>
                        {data.noaa_discussion.solar_activity_tr}
                      </Text>
                    </View>
                  )}

                  {data.noaa_discussion.solar_wind_tr && (
                    <View style={styles.oracleSegment}>
                      <View style={styles.oracleSegmentHeader}>
                        <Ionicons name="pulse-outline" size={14} color="cyan" />
                        <Text style={[styles.oracleSegmentTitle, { color: 'cyan' }]}>Güneş Rüzgarı Analizi</Text>
                      </View>
                      <Text style={styles.oracleSegmentBody}>
                        {data.noaa_discussion.solar_wind_tr}
                      </Text>
                    </View>
                  )}

                  {data.noaa_discussion.geomagnetic_field_tr && (
                    <View style={styles.oracleSegment}>
                      <View style={styles.oracleSegmentHeader}>
                        <Ionicons name="flash-outline" size={14} color="#F59E0B" />
                        <Text style={[styles.oracleSegmentTitle, { color: '#F59E0B' }]}>Jeomanyetik Alan & Fırtına Tahmini</Text>
                      </View>
                      <Text style={styles.oracleSegmentBody}>
                        {data.noaa_discussion.geomagnetic_field_tr}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </BlurView>
          )}

          {/* 5. Bilgilendirme Bölümü (Açılır/Kapanır) */}
          <BlurView intensity={25} tint="dark" style={styles.guideCard}>
            <TouchableOpacity 
              style={styles.guideHeader} 
              onPress={() => setIsGuideOpen(!isGuideOpen)}
              activeOpacity={0.8}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="information-circle-outline" size={24} color={COLORS.primary} style={{ marginRight: 10 }} />
                <Text style={styles.guideHeaderTitle}>Jeomanyetik Rezonans Kılavuzu</Text>
              </View>
              <Ionicons 
                name={isGuideOpen ? "chevron-up" : "chevron-down"} 
                size={20} 
                color={COLORS.textMuted} 
              />
            </TouchableOpacity>

            {isGuideOpen && (
              <View style={styles.guideContent}>
                <Text style={styles.guideSectionTitle}>Grafiklerin Yapısı ve Okunması:</Text>
                <Text style={styles.guideParagraph}>
                  • <Text style={{ color: '#fff', fontWeight: 'bold' }}>Schumann Rezonans Spektrogramı:</Text> Elektromanyetik alanın dikey eksende frekans (0 - 40 Hz), yatay eksende ise zaman bazlı uyarılma düzeyini gösterir. Bu grafik, Space Observing System 70 (Tomsk, Rusya) rasathanesinde bulunan ELF alıcı antenleri aracılığıyla doğrudan yeryüzünden ölçülen gerçek zamanlı sonogram verilerini temsil eder. Zaman dilimi farkını en üstteki çift göstergeli anlık zaman panelinden (Yerel ve Tomsk) takip edebilirsiniz.
                  {"\n\n"}
                  • <Text style={{ color: '#fff', fontWeight: 'bold' }}>Jeomanyetik Kp Eğilimi:</Text> 72 saatlik zaman diliminde ölçülen ve tahmin edilen jeomanyetik fırtına derecelerini (Kp) gösterir. Düz sütunlar kesinleşmiş geçmiş ölçümleri, kesikli sınırları olan sütunlar ise gelecek 24 saatlik tahmini temsil eder.
                </Text>

                <Text style={styles.guideSectionTitle}>Kozmik Oracle / Durum Raporu Nedir?</Text>
                <Text style={styles.guideParagraph}>
                  Gözlemevinden alınan canlı Schumann Rezonansı genliği (A1), spektrogram uyarım dalgaları ve uydulardan alınan jeomanyetik parametreleri (Kp Endeksi, Hız, Yoğunluk, Bz kalkan durumu, Bt alan gücü ve Sıcaklık) anlık olarak inceleyen yerel kural motorudur. Bu motor, uzay havasındaki dalgalanmaları yorumlayarak size üç alanda bilgi verir:
                  {"\n\n"}
                  🔬 <Text style={{ color: '#fff', fontWeight: 'bold' }}>Bilimsel Teşhis:</Text> İyonosfer ve manyetosferde gerçekleşen fiziksel olayların bilimsel açıklaması.
                  {"\n\n"}
                  ⚡ <Text style={{ color: '#fff', fontWeight: 'bold' }}>Beden Reaksiyonları:</Text> Artan kozmik plazmanın sinir sistemi, uyku düzeni ve baş bölgesi üzerindeki olası fiziksel etkileri.
                  {"\n\n"}
                  🧘 <Text style={{ color: '#fff', fontWeight: 'bold' }}>Ruhsal Rehberlik:</Text> Enerjiyi topraklamak, aura alanını korumak ve uyanış kapılarından faydalanmak için önerilen meditasyon ve nefes pratikleri.
                </Text>

                <Text style={styles.guideSectionTitle}>Kozmik Enerji Simülatörü (Test Paneli):</Text>
                <Text style={styles.guideParagraph}>
                  Uygulamadaki test sürgüsü yardımıyla Schumann A1 Genlik değerini (4.0 - 75.0 arası) manuel olarak değiştirebilirsiniz. Sürgüyü oynattığınızda, Kozmik Oracle teşhisi, beden reaksiyonları ve ruhsal rehberlik önerileri senkronize bir şekilde güncellenerek yüksek rezonans titreşimlerinin etkilerini test etmenizi sağlar. Güneş rüzgarı parametreleri (Kp, hız, yoğunluk vb.) ise simülasyondan izole edilerek canlı değerlerinde sabit kalır. "Canlı Veriye Dön" butonuyla gerçek verilere dönebilirsiniz.
                </Text>

                <Text style={styles.guideSectionTitle}>Güneş Rüzgarı Sözlüğü:</Text>
                <Text style={styles.guideParagraph}>
                  • <Text style={{ color: '#fff', fontWeight: 'bold' }}>Schumann Tahmini (SR Skoru):</Text> Tomsk rasathanesi spektrogram görüntüsündeki dikey uyarım parlamalarının (flare) piksel yoğunluğu ve fiziksel A1 mod genliğinin anlık bileşiminden hesaplanan, 0.0 - 10.0 arası bir iyonosferik uyarım göstergesidir. Tıpkı Richter ölçeği gibi, canlı uzay havası dalgalanmalarının ve rezonans uyarım şiddetinin seviyesini (Sakin, Hafif, Aktif, Zirve) tek bir skorla anlamanızı sağlar.
                  {"\n\n"}
                  • <Text style={{ color: '#fff', fontWeight: 'bold' }}>Kp Endeksi:</Text> Dünya genelindeki manyetometrelerden alınan verilerle hesaplanan 0-9 arası jeomanyetik aktivite derecesidir. 5 ve üzeri, küresel manyetik fırtınaları (NOAA G1-G5 seviyeleri) ifade eder.
                  {"\n\n"}
                  • <Text style={{ color: '#fff', fontWeight: 'bold' }}>Güneş Rüzgarı Hızı:</Text> Güneş yüzeyinden kopup saniyede süzülen plazma hızıdır. Hız arttıkça Dünya'nın koruyucu kalkanı daha çok sıkışır.
                  {"\n\n"}
                  • <Text style={{ color: '#fff', fontWeight: 'bold' }}>Proton Yoğunluğu:</Text> Plazmakadi santimetreküp başına düşen parçacık miktarıdır. Yoğunluk yükseldikçe atmosferle girilen enerjisel etkileşim artar.
                  {"\n\n"}
                  • <Text style={{ color: '#fff', fontWeight: 'bold' }}>Bz Değeri (Yön):</Text> Manyetik kalkanın kuzey-güney yönüdür. Bz'nin eksiye (-) yani güneye yönelmesi, Dünya'nın kalkanında kapılar açarak plazmanın içeri sızmasını kolaylaştırır.
                  {"\n\n"}
                  • <Text style={{ color: '#fff', fontWeight: 'bold' }}>Toplam Alan (Bt):</Text> Gezegenler arası manyetik alanın toplam gücünü nT cinsinden gösterir.
                  {"\n\n"}
                  • <Text style={{ color: '#fff', fontWeight: 'bold' }}>Sıcaklık:</Text> Güneş plazmasının termal sıcaklığıdır. Yüksek termal değerler taç küre kütle atılımlarını (CME) işaret eder.
                </Text>

                <Text style={styles.guideSectionTitle}>Saat Dilimi ve Yerel Saat Dönüşümü:</Text>
                <Text style={styles.guideParagraph}>
                  Bölgesel gözlemevi grafikleri genellikle istasyonun kurulu olduğu ülkenin yerel saat dilimine göre çizilir (örneğin Asya/Sibirya gözlemevleri kendi yerel saatini kullanır). Bu gösterge paneli ise uluslararası uzay havası verilerini tamamen sizin cihazınızın yerel saat dilimine dönüştürerek gösterir. Bu nedenle yabancı grafiklerle aranızda saat farkı bulunması tamamen normaldir; buradaki saatler doğrudan kendi gününüzdeki anı temsil eder.
                </Text>

                <Text style={styles.guideSectionTitle}>Kozmik Hava Tahmini: Gelecek 24 Saat Nasıl Hesaplanır?</Text>
                <Text style={styles.guideParagraph}>
                  Dünya ile Güneş arasındaki (L1 noktasındaki) DSCOVR ve ACE uzay uyduları, Güneş patlamasıyla fırlayan parçacıkları yola çıktığı an ölçer. Bu parçacıkların Dünya'ya ulaşması 15 saat ile 3 gün sürer. Sistemimiz, uyduların yolda yakaladığı bu verileri işleyerek henüz gezegenimize ulaşmamış olan bu "kozmik bilgi paketçiklerini" saatlik modellemeler halinde önceden sunar. Böylece uyanış portallarını önceden görebilirsiniz.
                </Text>
              </View>
            )}
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
});
