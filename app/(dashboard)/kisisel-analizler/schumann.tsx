import SacredBackground from '@/components/SacredBackground';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES } from '@/src/theme';
import { apiFetch } from '@/src/core/api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { useProgress } from '@/src/context/ProgressContext';
import Slider from '@react-native-community/slider';

interface KpHistoryItem {
  time: string;
  kp: number;
  predicted?: boolean;
}

interface KpData {
  current_kp: number;
  status_label: string;
  status_desc: string;
  updated_at: string;
  history: KpHistoryItem[];
}

export default function SchumannScreen() {
  const router = useRouter();
  const { role, isAdmin } = useProgress();
  const isApprenticeOrAbove = role === 'apprentice' || role === 'journeyman' || role === 'master' || role === 'admin' || isAdmin;
  const [data, setData] = useState<KpData | null>(null);
  const [simulatedKp, setSimulatedKp] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [hoveredBar, setHoveredBar] = useState<KpHistoryItem | null>(null);
  const [hoveredSpectrogramBar, setHoveredSpectrogramBar] = useState<KpHistoryItem | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
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
    try {
      const res = await apiFetch('/api/schumann');
      if (res) {
        if (res.history) {
          res.history = res.history.slice(-24); // Last 24 items (72 hours)
        }
        setData(res);
        if (res.history && res.history.length > 0) {
          const nowMs = Date.now();
          const lastRealIndex = res.history.reduce((lastIdx: number, item: KpHistoryItem, idx: number) => {
            const isForecast = new Date(item.time.endsWith('Z') ? item.time : item.time + 'Z').getTime() > nowMs;
            return !isForecast ? idx : lastIdx;
          }, res.history.length - 1);
          setHoveredSpectrogramBar(prev => prev || res.history[lastRealIndex]);
          setHoveredBar(prev => prev || res.history[lastRealIndex]);
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

  const getSpiritualLabel = (kp: number) => {
    if (kp >= 5.0) return 'DNA Aktivasyonu & Işık Portalı';
    if (kp >= 4.0) return 'Yüksek Sezgi ve Hücresel Uyanış';
    if (kp >= 3.0) return 'Enerjisel Kıpırdanma ve Yenilenme';
    return 'Dengeli Enerji Akışı';
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
      return {
        label: 'JEOMANYETİK FIRTINA AKTİF!',
        desc: 'Güçlü kozmik enerji fırtınası devrede! Hücresel uyanış portalları açık. Fiziksel yorgunluk, yoğun rüyalar ve yüksek enerjisel titreşim dalgaları olasıdır.'
      };
    }
  };

  const historyToRender = data?.history ? data.history.map((item, idx) => {
    // Son ölçüm indeksini bul (tahmin/predicted olmayan en son eleman)
    const lastMeasuredIdx = data.history.reduce((lastIdx, currItem, currIdx) => {
      if (!currItem.predicted) {
        return currIdx;
      }
      return lastIdx;
    }, -1);

    if (simulatedKp !== null && idx === lastMeasuredIdx) {
      return { ...item, kp: simulatedKp };
    }
    return item;
  }) : [];

  // Find index of the first forecast block to draw "ŞİMDİ" divider line
  const firstForecastIndex = historyToRender.findIndex(item => item.predicted) ?? -1;

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
          {/* 1. Güncel Durum Paneli */}
          {(() => {
            const activeKp = simulatedKp !== null ? simulatedKp : (data?.current_kp ?? 0);
            const activeLabel = simulatedKp !== null ? getSimulatedStatus(simulatedKp).label : data?.status_label;
            const activeDesc = simulatedKp !== null ? getSimulatedStatus(simulatedKp).desc : data?.status_desc;
            return (
              <BlurView intensity={40} tint="dark" style={styles.statusCard}>
                <View style={styles.statusCardTop}>
                  <View style={styles.radialContainer}>
                    <View style={[styles.outerGlowRing, { borderColor: getKpColor(activeKp) }]}>
                      <Text style={[styles.radialVal, { color: getKpColor(activeKp) }]}>
                        {activeKp.toFixed(2)}
                      </Text>
                      <Text style={styles.radialUnit}>Genlik</Text>
                    </View>
                  </View>

                  <View style={styles.statusInfoContainer}>
                    <Text style={styles.statusLabelText}>
                      {activeLabel}
                    </Text>
                    <Text style={styles.statusSpiritualText}>
                      {getSpiritualLabel(activeKp)}
                    </Text>
                    <Text style={styles.updatedAtText}>
                      Son Ölçüm Zamanı: {data ? formatTime(data.updated_at) : ''}
                    </Text>
                  </View>
                </View>

                {activeDesc ? (
                  <View style={styles.statusCardBottom}>
                    <View style={styles.statusCardDivider} />
                    <Text style={styles.statusAnalysisText}>{activeDesc}</Text>
                  </View>
                ) : null}
              </BlurView>
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
              Farklı Genlik seviyelerinin etkilerini ve renk değişimlerini test edin
            </Text>
            
            <View style={styles.sliderWrapper}>
              <Text style={styles.sliderLabel}>Genlik 0</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={9}
                step={0.1}
                value={simulatedKp !== null ? simulatedKp : 0}
                onValueChange={(val) => setSimulatedKp(val)}
                minimumTrackTintColor={COLORS.primary}
                maximumTrackTintColor="rgba(255, 255, 255, 0.2)"
                thumbTintColor={COLORS.primary}
              />
              <Text style={styles.sliderLabel}>Genlik 9</Text>
            </View>

            <View style={styles.simulatorFooter}>
              <Text style={styles.simulatorFooterText}>
                Simüle Edilen Değer: <Text style={styles.simulatorValueText}>
                  {simulatedKp !== null ? `${simulatedKp.toFixed(1)} (Test)` : 'Canlı Akış'}
                </Text>
              </Text>
              {simulatedKp !== null && (
                <TouchableOpacity 
                  style={styles.resetBtn} 
                  onPress={() => setSimulatedKp(null)}
                >
                  <Text style={styles.resetBtnText}>Sıfırla</Text>
                </TouchableOpacity>
              )}
            </View>
          </BlurView>

          {/* Schumann Rezonansı Frekans Spektrogramı (Şelale Grafiği) */}
          <BlurView intensity={30} tint="dark" style={styles.spectrogramCard}>
            <Text style={styles.chartTitle}>Schumann Rezonans Spektrogramı</Text>
            <Text style={styles.chartSubtitle}>
              Atmosferik boşlukta rezonans frekanslarının uyarılma şiddeti (Koyu yeşilden kırmızıya geçişler ve beyaz dikey patlamalar)
            </Text>

            {/* Spectrogram Tooltip */}
            <View style={styles.spectrogramTooltipContainer}>
              {hoveredSpectrogramBar ? (
                <View style={styles.spectrogramTooltip}>
                  <Text style={styles.spectrogramTooltipText}>
                    Zaman: <Text style={{ fontWeight: 'bold', color: '#fff' }}>{formatTimeRange(hoveredSpectrogramBar.time)}</Text>
                    {new Date(hoveredSpectrogramBar.time.endsWith('Z') ? hoveredSpectrogramBar.time : hoveredSpectrogramBar.time + 'Z').getTime() > Date.now() 
                      ? ' (Tahmin)' 
                      : ' (Ölçüm)'}
                    {' | '}
                    Genlik: <Text style={{ fontWeight: 'bold', color: getKpColor(hoveredSpectrogramBar.kp) }}>{hoveredSpectrogramBar.kp.toFixed(2)}</Text>
                    {' | '}
                    <Text style={{ fontWeight: 'bold', color: COLORS.primary }}>{getSpiritualLabel(hoveredSpectrogramBar.kp)}</Text>
                  </Text>
                </View>
              ) : (
                <Text style={styles.tooltipPlaceholder}>Detayları görmek için dalgaların üzerine dokunun</Text>
              )}
            </View>

            <View style={styles.spectrogramWrapper}>
              {/* Sabit Hz etiketleri (Sol Taraf) */}
              <View style={styles.hzScale}>
                <Text style={styles.hzText}>0 Hz</Text>
                <Text style={styles.hzText}>8 Hz</Text>
                <Text style={styles.hzText}>16 Hz</Text>
                <Text style={styles.hzText}>24 Hz</Text>
                <Text style={styles.hzText}>32 Hz</Text>
                <Text style={styles.hzText}>40 Hz</Text>
              </View>

              {/* Fluid Şelale Alanı (Tüm Ekran Genişliğine Sığacak Şekilde) */}
              <View style={styles.spectrogramMainContainer}>
                {historyToRender && historyToRender.length >= 2 ? (
                  <View style={{ flex: 1, height: '100%', flexDirection: 'row', position: 'relative' }}>
                    {historyToRender.map((item, idx) => {
                      const kp = item.kp;
                      const isForecast = !!item.predicted;
                      const isHovered = hoveredSpectrogramBar && hoveredSpectrogramBar.time === item.time;

                      return (
                        <TouchableOpacity 
                          key={idx} 
                          style={styles.spectrogramColFluid}
                          activeOpacity={0.8}
                          onPress={() => setHoveredSpectrogramBar(item)}
                        >
                          {/* 1. Frekans Spektrumu Gradyan Sütunu (Her zaman görünür Cyan Çizgiler) */}
                          <LinearGradient
                            colors={getBaseCyanColors(isForecast)}
                            locations={RESONANCE_LOCATIONS}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            style={[styles.colBgGradient, { opacity: item.predicted ? 0.65 : 1 }]}
                          />

                          {/* 2. Ekstra Genlik (Kp) 0.1 ve üzeri olduğunda üzerine yarı şeffaf genlik rengi ekle */}
                          {kp >= 0.1 && (
                            <LinearGradient
                              colors={getKpColors(kp, isForecast)}
                              locations={RESONANCE_LOCATIONS}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 0, y: 1 }}
                              style={styles.colOverlayGradient}
                            />
                          )}

                          {/* 3. Dikey Beyaz Işıma (Kp >= 5.0 Fırtına Durumu) */}
                          {kp >= 5.0 && (
                            <LinearGradient
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                              colors={['transparent', 'rgba(255, 255, 255, 0.3)', '#FFFFFF', 'rgba(255, 255, 255, 0.3)', 'transparent']}
                              style={styles.colWhiteGlow}
                            />
                          )}

                          {/* 4. Seçim Vurgusu (Ortalanmış Sarı Çizgi ve Noktalar) */}
                          {isHovered && (
                            <View style={styles.fluidSelectorContainer}>
                              <View style={styles.selectorLine} />
                              <View style={[styles.selectorDot, { top: '0%' }]} />
                              <View style={[styles.selectorDot, { top: '19.6%' }]} />
                              <View style={[styles.selectorDot, { top: '35.3%' }]} />
                              <View style={[styles.selectorDot, { top: '50.8%' }]} />
                              <View style={[styles.selectorDot, { top: '66.0%' }]} />
                              <View style={[styles.selectorDot, { top: '81.0%' }]} />
                            </View>
                          )}

                          {/* 5. Zaman Etiketi (Sadece 4 sütunda bir sığması için gösterilir) */}
                          {idx % 4 === 0 && (() => {
                            const d = new Date(item.time.endsWith('Z') ? item.time : item.time + 'Z');
                            const hours = d.getHours().toString().padStart(2, '0');
                            const isDayTransition = hours === '00';
                            
                            let hourLabel = hours;
                            let labelColor = 'rgba(255, 255, 255, 0.45)';
                            let fontWeight: 'normal' | 'bold' = 'normal';
                            
                            if (isDayTransition) {
                              const dayNamesShort = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
                              const dayName = dayNamesShort[d.getDay()];
                              hourLabel = `${dayName} ${hours}`;
                              labelColor = item.predicted ? '#00e5ff80' : '#00E5FF';
                              fontWeight = 'bold';
                            }
                            
                            return (
                              <Text style={[
                                styles.spectrogramTimeText, 
                                { color: labelColor, fontWeight: fontWeight }
                              ]} numberOfLines={1}>
                                {hourLabel}
                              </Text>
                            );
                          })()}

                          {/* 6. ŞİMDİ Sınırı (İlk Tahmin Sütununun Sol Kenarında Çizilir) */}
                          {idx === firstForecastIndex && (
                            <View style={styles.spectrogramNowLineFluid}>
                              <Text style={styles.spectrogramNowTextFluid}>ŞİMDİ</Text>
                            </View>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ) : null}
              </View>

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
          </BlurView>

          {/* 2. Jeomanyetik Kp Eğilim Grafiği */}
          <BlurView intensity={30} tint="dark" style={styles.chartCard}>
            <Text style={styles.chartTitle}>Jeomanyetik Genlik Eğilimi (Son 72 Saat)</Text>
            <Text style={styles.chartSubtitle}>
              Ölçülen jeomanyetik fırtına değerlerinin saatlik blokları (Kesikli sütunlar 24 saatlik tahmindir)
            </Text>

            {/* Custom Tap Tooltip Display */}
            <View style={styles.barTooltipContainer}>
              {hoveredBar ? (
                <View style={styles.barTooltip}>
                  <Text style={styles.tooltipText}>
                     Zaman: <Text style={{ fontWeight: 'bold', color: '#fff' }}>{formatTimeRange(hoveredBar.time)}</Text>  |  
                     Genlik: <Text style={{ fontWeight: 'bold', color: getKpColor(hoveredBar.kp) }}>{hoveredBar.kp.toFixed(2)}</Text>
                     {hoveredBar.predicted ? ' (⚠️ Tahmin - Değişebilir)' : ' (✅ Kesinleşmiş Ölçüm)'}
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

              {historyToRender.map((item, idx) => {
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
              {historyToRender.map((item, idx) => {
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
                <Text style={styles.guideSectionTitle}>Planetary K-Index (Kp Endeksi) Nedir?</Text>
                <Text style={styles.guideParagraph}>
                  Dünya genelindeki manyetometre ölçüm istasyonlarından gelen verilerin birleştirilmesiyle oluşturulan ve gezegenimizin manyetik alanındaki düzensizlikleri 0 ile 9 arasında ölçen resmi bir küresel endekstir. Kp değerinin 5 ve üzeri olması, küresel çapta bir Jeomanyetik Fırtına (Geomagnetic Storm) durumunu gösterir.
                </Text>

                <Text style={styles.guideSectionTitle}>Küresel Fırtına vs. Yerel Atmosferik Gürültü:</Text>
                <Text style={styles.guideParagraph}>
                  Bölgesel tekil anten grafikleri (Sibirya vb.), o bölgedeki yerel yıldırımlar veya elektrik gürültüleri sebebiyle yüksek beyaz patlamalar gösterebilir. Ancak bu yerel olaylar küresel insan biyolojisini etkilemez. Sistemimizdeki küresel Kp endeksi ise yerel gürültüleri filtreleyerek sadece Dünya'yı ve insan biyo-alanını doğrudan etkileyen gerçek jeomanyetik güneş fırtınası hareketlerini gösterir.
                </Text>

                <Text style={styles.guideSectionTitle}>Güneş Fırtınası ve Biyolojik Etkiler:</Text>
                <Text style={styles.guideParagraph}>
                  Dünya'nın manyetik alanı ile insan kalp ritmi, sinir sistemi dengesi ve melatonin salgısı doğrudan senkronizedir. Kp endeksinin yükseldiği günlerde baş ağrısı, yorgunluk, rüyalarda berraklık veya uyku bozuklukları gibi kozmik adaptasyon semptomları yaşanması oldukça yaygındır.
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
  statusCard: {
    padding: 20,
    borderRadius: SIZES.radius * 1.5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 20,
    overflow: 'hidden',
  },
  statusCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  statusCardBottom: {
    width: '100%',
    marginTop: 15,
  },
  statusCardDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    width: '100%',
    marginBottom: 12,
  },
  statusAnalysisText: {
    fontSize: 11.5,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 18,
  },
  radialContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  outerGlowRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 6,
  },
  radialVal: {
    fontSize: 22,
    fontWeight: '900',
    fontFamily: Platform.OS === 'ios' ? 'Courier-Bold' : 'monospace',
  },
  radialUnit: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: -2,
    fontWeight: '600',
  },
  statusInfoContainer: {
    flex: 1,
  },
  statusLabelText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  statusSpiritualText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
    marginBottom: 8,
  },
  updatedAtText: {
    fontSize: 10,
    color: COLORS.textMuted,
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
    height: 30,
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
    height: 30,
    justifyContent: 'center',
    marginBottom: 5,
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
    flexDirection: 'row',
    height: 160,
    marginTop: 10,
    backgroundColor: '#050505',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    position: 'relative',
    overflow: 'hidden',
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
