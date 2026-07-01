import SacredBackground from '@/components/SacredBackground';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES } from '@/src/theme';
import { apiFetch } from '@/src/core/api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { useProgress } from '@/src/context/ProgressContext';

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
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [hoveredBar, setHoveredBar] = useState<KpHistoryItem | null>(null);
  const [hoveredSpectrogramBar, setHoveredSpectrogramBar] = useState<KpHistoryItem | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const canvasRef = useRef<any>(null);

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

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    if (!canvasRef.current || !data || !data.history || data.history.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Draw background
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, width, height);

    const cols = data.history;
    const currentMs = Date.now();

    for (let x = 0; x < width; x++) {
      const pct = x / width;
      const indexFloat = pct * (cols.length - 1);
      const indexLow = Math.floor(indexFloat);
      const indexHigh = Math.min(indexLow + 1, cols.length - 1);
      const weight = indexFloat - indexLow;

      const kpLow = cols[indexLow].kp;
      const kpHigh = cols[indexHigh].kp;
      const kp = kpLow + (kpHigh - kpLow) * weight;

      const isPredicted = new Date(cols[Math.min(indexHigh, cols.length - 1)].time.endsWith('Z') ? cols[Math.min(indexHigh, cols.length - 1)].time : cols[Math.min(indexHigh, cols.length - 1)].time + 'Z').getTime() > currentMs;

      let baseR = 3;
      let baseG = 3;
      let baseB = 10;

      if (kp >= 4.5) {
        const stormGlowFactor = Math.min(1, (kp - 4.5) / 0.7);
        const glowIntensity = stormGlowFactor * 252;
        baseR += glowIntensity;
        baseG += glowIntensity;
        baseB += glowIntensity * 0.95;
      }

      const resColor = getResonanceColor(kp);

      for (let y = 0; y < height; y++) {
        const freqPct = (height - y) / height;
        const freqHz = freqPct * 40;

        const resonances = [7.83, 14.1, 20.3, 26.4, 32.4];
        let onResonance = false;
        let resonanceDist = 999;

        resonances.forEach(res => {
          const dist = Math.abs(freqHz - res);
          if (dist < 2.0) {
            onResonance = true;
            resonanceDist = Math.min(resonanceDist, dist);
          }
        });

        const sensorNoise = (Math.random() - 0.5) * 8;

        let r = baseR;
        let g = baseG;
        let b = baseB;

        if (onResonance) {
          const strength = Math.pow(Math.max(0, 1 - resonanceDist / 2.0), 2.2);
          r += resColor.r * strength;
          g += resColor.g * strength;
          b += resColor.b * strength;
        }

        if (kp >= 4.0) {
          const scanPattern = Math.sin(y * 0.1) * Math.cos(x * 0.05);
          if (scanPattern > 0.4) {
            const scanStrength = (kp / 9) * 20;
            r += scanStrength;
            g += scanStrength;
            b += scanStrength;
          }
        }

        r += sensorNoise;
        g += sensorNoise;
        b += sensorNoise;

        if (isPredicted) {
          r *= 0.65;
          g *= 0.65;
          b *= 0.70;
        }

        r = Math.min(255, Math.max(0, r));
        g = Math.min(255, Math.max(0, g));
        b = Math.min(255, Math.max(0, b));

        ctx.fillStyle = `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }, [data]);

  const getRowColor = (hz: number, kp: number, isForecast: boolean) => {
    const getAlphaHex = (alpha: number) => {
      const val = Math.min(255, Math.max(0, Math.round(alpha * 255)));
      return val.toString(16).padStart(2, '0');
    };

    const intensity = kp / 9.0; // 0.0 to 1.0
    let baseColor = '#00D4FF';
    let baseAlpha = 0.35;

    if (hz === 0) {
      baseColor = '#00E5FF';
      baseAlpha = 0.03 + intensity * 0.12; // Very faint cyan
    } else if (hz === 8) {
      baseColor = '#FFA500'; // Amber/Gold (Constant color!)
      baseAlpha = 0.25 + intensity * 0.65; // Dynamic opacity
    } else if (hz === 16) {
      baseColor = '#00E676'; // Neon Green (Constant color!)
      baseAlpha = 0.15 + intensity * 0.55;
    } else if (hz === 24) {
      baseColor = '#00E5FF'; // Cyan (Constant color!)
      baseAlpha = 0.10 + intensity * 0.45;
    } else if (hz === 32) {
      baseColor = '#007AFF'; // Blue (Constant color!)
      baseAlpha = 0.08 + intensity * 0.35;
    } else if (hz === 40) {
      baseColor = '#7B1FA2'; // Purple/Indigo (Constant color!)
      baseAlpha = 0.05 + intensity * 0.25;
    }

    if (isForecast) {
      baseAlpha *= 0.35;
    }

    return baseColor + getAlphaHex(baseAlpha);
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

  // Find index of the first forecast block to draw "ŞİMDİ" divider line
  const nowMs = Date.now();
  const firstForecastIndex = data?.history.findIndex(item => new Date(item.time.endsWith('Z') ? item.time : item.time + 'Z').getTime() > nowMs) ?? -1;

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
          <BlurView intensity={40} tint="dark" style={styles.statusCard}>
            <View style={styles.radialContainer}>
              <View style={[styles.outerGlowRing, { borderColor: getKpColor(data?.current_kp ?? 0) }]}>
                <Text style={[styles.radialVal, { color: getKpColor(data?.current_kp ?? 0) }]}>
                  {(data?.current_kp ?? 0).toFixed(2)}
                </Text>
                <Text style={styles.radialUnit}>Kp</Text>
              </View>
            </View>

            <View style={styles.statusInfoContainer}>
              <Text style={styles.statusLabelText}>
                {data?.status_label}
              </Text>
              <Text style={styles.statusSpiritualText}>
                {getSpiritualLabel(data?.current_kp ?? 0)}
              </Text>
              <Text style={styles.updatedAtText}>
                Son Ölçüm Zamanı: {data ? formatTime(data.updated_at) : ''}
              </Text>
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

              {/* Kaydırılabilir Şelale Alanı (Sağ Taraf) */}
              <ScrollView 
                horizontal={true} 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.spectrogramScrollContent}
              >
                {data?.history && data.history.length >= 2 ? (
                  <View style={{ width: data.history.length * 42, height: '100%', position: 'relative' }}>
                    {Platform.OS === 'web' ? (
                      <canvas
                        ref={canvasRef}
                        width={data.history.length * 42}
                        height={140}
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          width: data.history.length * 42,
                          height: 140,
                          backgroundColor: '#050505',
                        }}
                      />
                    ) : (
                      <>
                        {/* 1. Background: 6 Horizontal Gradients */}
                        <View style={styles.horizontalGradientsContainer}>
                          {[0, 8, 16, 24, 32, 40].map((hz) => (
                            <LinearGradient
                              key={hz}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                              colors={data.history.map(item => getRowColor(hz, item.kp, new Date(item.time.endsWith('Z') ? item.time : item.time + 'Z').getTime() > Date.now()))}
                              style={[
                                styles.horizontalGradientRow,
                                {
                                  top: hz === 0 ? '8%' : hz === 8 ? '24%' : hz === 16 ? '46%' : hz === 24 ? '66%' : hz === 32 ? '84%' : '97%',
                                  marginTop: -8,
                                }
                              ]}
                            />
                          ))}
                        </View>

                        {/* 2. Middle: Vertical Mask Overlay */}
                        <LinearGradient
                          colors={[
                            'rgba(5,5,5,0.98)', 
                            'rgba(5,5,5,0.0)', 
                            'rgba(5,5,5,0.98)', 
                            'rgba(5,5,5,0.0)', 
                            'rgba(5,5,5,0.98)', 
                            'rgba(5,5,5,0.0)', 
                            'rgba(5,5,5,0.98)', 
                            'rgba(5,5,5,0.0)', 
                            'rgba(5,5,5,0.98)', 
                            'rgba(5,5,5,0.0)', 
                            'rgba(5,5,5,0.98)', 
                            'rgba(5,5,5,0.0)', 
                            'rgba(5,5,5,0.98)'
                          ]}
                          locations={[0.0, 0.08, 0.16, 0.24, 0.36, 0.46, 0.56, 0.66, 0.76, 0.84, 0.92, 0.97, 1.0]}
                          style={styles.verticalMask}
                          pointerEvents="none"
                        />
                      </>
                    )}

                    {/* 3. Foreground: Interactive columns */}
                    <View style={styles.interactiveColumnsContainer}>
                      {data.history.map((item, idx) => {
                        const kp = item.kp;
                        const isForecast = new Date(item.time.endsWith('Z') ? item.time : item.time + 'Z').getTime() > Date.now();
                        const showLightning = kp >= 4.0 && !isForecast;
                        const isHovered = hoveredSpectrogramBar && hoveredSpectrogramBar.time === item.time;

                        return (
                          <TouchableOpacity 
                            key={idx} 
                            style={styles.spectrogramCol}
                            activeOpacity={0.8}
                            onPress={() => setHoveredSpectrogramBar(item)}
                          >
                            {/* Dikey Manyetik Patlama Çizgileri */}
                            {showLightning && (
                              <View style={[styles.lightningLine, { opacity: (kp / 9) * 0.5 + 0.15 }]} />
                            )}

                            {/* Seçim Vurgusu (Sarı Çizgi ve 6 Nokta) */}
                            {isHovered && (
                              <View style={styles.selectorLineContainer}>
                                <View style={styles.selectorLine} />
                                <View style={[styles.selectorDot, { top: '8%' }]} />
                                <View style={[styles.selectorDot, { top: '24%' }]} />
                                <View style={[styles.selectorDot, { top: '46%' }]} />
                                <View style={[styles.selectorDot, { top: '66%' }]} />
                                <View style={[styles.selectorDot, { top: '84%' }]} />
                                <View style={[styles.selectorDot, { top: '97%' }]} />
                              </View>
                            )}

                            {/* Zaman Etiketi */}
                            {idx % 4 === 0 && (() => {
                              const d = new Date(item.time.endsWith('Z') ? item.time : item.time + 'Z');
                              const dayNames = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
                              return (
                                <Text style={styles.spectrogramTimeText}>
                                  {dayNames[d.getDay()]} {d.getHours().toString().padStart(2, '0')}:00
                                </Text>
                              );
                            })()}

                            {/* ŞİMDİ Çizgisi */}
                            {idx === firstForecastIndex && (
                              <View style={styles.spectrogramNowLineContainer}>
                                <View style={styles.spectrogramNowLine} />
                                <Text style={styles.spectrogramNowText}>ŞİMDİ</Text>
                              </View>
                            )}
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                ) : null}
              </ScrollView>
            </View>
          </BlurView>

          {/* 2. Jeomanyetik Kp Eğilim Grafiği */}
          <BlurView intensity={30} tint="dark" style={styles.chartCard}>
            <Text style={styles.chartTitle}>Jeomanyetik Kp Eğilimi (Son 72 Saat)</Text>
            <Text style={styles.chartSubtitle}>
              Ölçülen jeomanyetik fırtına değerlerinin saatlik blokları (Kesikli sütunlar 24 saatlik tahmindir)
            </Text>

            {/* Custom Tap Tooltip Display */}
            <View style={styles.barTooltipContainer}>
              {hoveredBar ? (
                <View style={styles.barTooltip}>
                  <Text style={styles.tooltipText}>
                     Zaman: <Text style={{ fontWeight: 'bold', color: '#fff' }}>{formatTimeRange(hoveredBar.time)}</Text>  |  
                     Kp: <Text style={{ fontWeight: 'bold', color: getKpColor(hoveredBar.kp) }}>{hoveredBar.kp.toFixed(2)}</Text>
                     {hoveredBar.predicted ? ' (⚠️ Tahmin - Değişebilir)' : ' (✅ Kesinleşmiş Ölçüm)'}
                  </Text>
                </View>
              ) : (
                <Text style={styles.tooltipPlaceholder}>Detayları görmek için sütunların üzerine dokunun</Text>
              )}
            </View>

            {/* Bar Chart Canvas Area */}
            <View style={styles.chartContainer}>
              {data?.history?.map((item, idx) => {
                const barHeight = Math.max(12, (item.kp / 9) * 120);
                const barColor = getKpColor(item.kp);
                const isForecast = new Date(item.time.endsWith('Z') ? item.time : item.time + 'Z').getTime() > Date.now();

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

          {/* 4. Enerji Analizi Durum Kartı */}
          {data?.status_desc && (
            <BlurView intensity={40} tint="dark" style={styles.analysisCard}>
              <Text style={styles.analysisTitle}>Jeomanyetik Enerji Analizi</Text>
              <Text style={styles.analysisBodyText}>{data.status_desc}</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: SIZES.radius * 1.5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 20,
    overflow: 'hidden',
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
    height: 140, // Match the gradient height (160 - 20)
    justifyContent: 'space-between',
    paddingVertical: 4, // Small padding to center texts inside the rows
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.08)',
    zIndex: 10,
  },
  selectorLineContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 20,
    pointerEvents: 'none',
    zIndex: 8,
  },
  selectorLine: {
    position: 'absolute',
    left: 20,
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
    left: 18,
    transform: [{ translateY: -3 }],
  },
  hzText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.primary,
    fontFamily: Platform.OS === 'ios' ? 'Courier-Bold' : 'monospace',
  },
  spectrogramScrollContent: {
    paddingRight: 20,
  },
  spectrogramCol: {
    width: 42,
    height: '100%',
    position: 'relative',
    justifyContent: 'flex-end',
    paddingBottom: 22,
  },
  horizontalGradientsContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 20,
    backgroundColor: '#050505',
  },
  horizontalGradientRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 16,
  },
  verticalMask: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 20,
  },
  interactiveColumnsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  lightningLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  spectrogramTimeText: {
    fontSize: 8,
    color: COLORS.textMuted,
    textAlign: 'center',
    position: 'absolute',
    bottom: 4,
    left: 0,
    right: 0,
  },
  spectrogramNowLineContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 20,
    width: 1,
    alignItems: 'center',
    zIndex: 5,
    pointerEvents: 'none',
  },
  spectrogramNowLine: {
    flex: 1,
    borderLeftWidth: 1.5,
    borderLeftColor: '#00E5FF',
    borderStyle: 'dashed',
  },
  spectrogramNowText: {
    fontSize: 7,
    color: '#00E5FF',
    fontWeight: 'bold',
    backgroundColor: '#000',
    paddingHorizontal: 2,
    marginTop: 2,
    position: 'absolute',
    bottom: 2,
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
});
