import SacredBackground from '@/components/SacredBackground';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
// @ts-ignore
import tzlookup from 'tz-lookup';
import { apiFetch } from '@/src/core/config';
import { getMe } from '@/src/core/api/client';
import { ASTRO_CITIES } from '@/src/features/astrology/api/astrologyClient';
import {
  generate7LayersDailyGuide,
  SevenLayersDailyGuideReport,
  GuidePlanetaryHourSlot,
} from '@/src/features/astrology/engine/DailyRitualGuideEngine';

export const DAILY_GUIDE_STORAGE_KEY = '@7layers_daily_guide_context_v1';

const COLORS = {
  background: '#000000',
  primary: '#D4AF37',
  secondary: '#0EA5E9',
  text: '#E0E0E0',
  textMuted: '#9CA3AF',
  cardBg: 'rgba(10, 14, 24, 0.88)',
  border: 'rgba(212, 175, 55, 0.35)',
};

const GUIDE_FREQ_WEBVIEW_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script>
    let audioCtx = null;
    let masterGain = null;
    let currentOscillator = null;
    let currentLfo = null;

    function startAudio(freq) {
      if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        audioCtx = new AudioContext();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      stopAudio();

      currentOscillator = audioCtx.createOscillator();
      currentOscillator.type = 'sine';
      currentOscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);

      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.48, audioCtx.currentTime);

      currentLfo = audioCtx.createOscillator();
      currentLfo.type = 'sine';
      currentLfo.frequency.value = 0.5;
      let lfoGain = audioCtx.createGain();
      lfoGain.gain.value = 0.18;

      currentLfo.connect(lfoGain);
      lfoGain.connect(masterGain.gain);

      currentOscillator.connect(masterGain);
      masterGain.connect(audioCtx.destination);

      currentOscillator.start();
      currentLfo.start();
    }

    function stopAudio() {
      if (currentOscillator) {
        try { currentOscillator.stop(); currentOscillator.disconnect(); } catch (e) {}
        currentOscillator = null;
      }
      if (currentLfo) {
        try { currentLfo.stop(); currentLfo.disconnect(); } catch (e) {}
        currentLfo = null;
      }
      if (masterGain) {
        try { masterGain.disconnect(); } catch (e) {}
        masterGain = null;
      }
    }
  </script>
</head>
<body style="margin:0;padding:0;background:transparent;"></body>
</html>
`;

export default function GunlukRehberScreen() {
  const router = useRouter();
  const [isAdminChecking, setIsAdminChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const today = new Date();
  const defaultTDate = today.toISOString().split('T')[0];
  const defaultTTime = today.toTimeString().slice(0, 5);

  useEffect(() => {
    (async () => {
      try {
        const me: any = await getMe();
        setIsAdmin(me?.role === 'admin');
      } catch {
        setIsAdmin(false);
      } finally {
        setIsAdminChecking(false);
      }
    })();
  }, []);

  const [natalDateStr, setNatalDateStr] = useState('1990-01-01');
  const [natalTimeStr, setNatalTimeStr] = useState('12:00');
  const [selectedCityData, setSelectedCityData] = useState<any>(ASTRO_CITIES[0]);
  const [searchQuery, setSearchQuery] = useState(
    `${ASTRO_CITIES[0].name}, ${ASTRO_CITIES[0].country}`
  );
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [transitDateStr, setTransitDateStr] = useState(defaultTDate);
  const [transitTimeStr, setTransitTimeStr] = useState(defaultTTime);
  const [appliedDateStr, setAppliedDateStr] = useState(defaultTDate);
  const [appliedTimeStr, setAppliedTimeStr] = useState(defaultTTime);
  const [selectedTransitCityData, setSelectedTransitCityData] = useState<any>(null);
  const [transitSearchQuery, setTransitSearchQuery] = useState('');
  const [transitSuggestions, setTransitSuggestions] = useState<any[]>([]);
  const [showTransitSuggestions, setShowTransitSuggestions] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [transitData, setTransitData] = useState<any>(null);
  const [showFullHoraTable, setShowFullHoraTable] = useState(false);

  // Canlı Frekans Çalar
  const freqWebViewRef = useRef<WebView>(null);
  const [playingChakraHz, setPlayingChakraHz] = useState<number | null>(null);

  // Canlı Pranayama Nefes Sayacı
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'INHALE' | 'HOLD' | 'EXHALE'>('INHALE');
  const [breathSecondsLeft, setBreathSecondsLeft] = useState(4);
  const [breathRound, setBreathRound] = useState(1);

  const stopChakraFrequency = () => {
    setPlayingChakraHz(null);
    freqWebViewRef.current?.injectJavaScript('stopAudio(); true;');
  };

  const toggleChakraFrequency = (hz: number) => {
    if (playingChakraHz === hz) {
      stopChakraFrequency();
    } else {
      setPlayingChakraHz(hz);
      freqWebViewRef.current?.injectJavaScript(`startAudio(${hz}); true;`);
    }
  };

  useEffect(() => {
    return () => {
      freqWebViewRef.current?.injectJavaScript('stopAudio(); true;');
    };
  }, []);

  // Geocoding search for Natal City
  useEffect(() => {
    if (searchQuery.trim().length < 3) {
      setSuggestions([]);
      return;
    }
    const fetchCities = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(
            searchQuery
          )}`,
          {
            headers: {
              'User-Agent': '7LayersApp/1.0 (Contact: admin@7layers.com)',
              'Accept-Language': 'tr-TR',
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          if (data && Array.isArray(data)) {
            const mapped = data.map((item: any) => {
              const parts = item.display_name.split(',').map((s: string) => s.trim());
              const name = item.name || parts[0];
              const country = parts[parts.length - 1] || '';
              const admin1 = parts.length > 2 ? parts[1] : '';
              const latNum = parseFloat(item.lat);
              const lonNum = parseFloat(item.lon);
              let tz = 'Europe/Istanbul';
              try {
                tz = tzlookup(latNum, lonNum);
              } catch {}
              return {
                name,
                lat: latNum,
                lon: lonNum,
                tz,
                latitude: latNum,
                longitude: lonNum,
                timezone: tz,
                country,
                admin1,
              };
            });
            setSuggestions(mapped);
          }
        }
      } catch {}
    };
    const timer = setTimeout(fetchCities, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Geocoding search for Transit City
  useEffect(() => {
    if (transitSearchQuery.trim().length < 3) {
      setTransitSuggestions([]);
      return;
    }
    const fetchTransitCities = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(
            transitSearchQuery
          )}`,
          {
            headers: {
              'User-Agent': '7LayersApp/1.0 (Contact: admin@7layers.com)',
              'Accept-Language': 'tr-TR',
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          if (data && Array.isArray(data)) {
            const mapped = data.map((item: any) => {
              const parts = item.display_name.split(',').map((s: string) => s.trim());
              const name = item.name || parts[0];
              const country = parts[parts.length - 1] || '';
              const admin1 = parts.length > 2 ? parts[1] : '';
              const latNum = parseFloat(item.lat);
              const lonNum = parseFloat(item.lon);
              let tz = 'Europe/Istanbul';
              try {
                tz = tzlookup(latNum, lonNum);
              } catch {}
              return {
                name,
                lat: latNum,
                lon: lonNum,
                tz,
                latitude: latNum,
                longitude: lonNum,
                timezone: tz,
                country,
                admin1,
              };
            });
            setTransitSuggestions(mapped);
          }
        }
      } catch {}
    };
    const timer = setTimeout(fetchTransitCities, 500);
    return () => clearTimeout(timer);
  }, [transitSearchQuery]);

  const executeCalculation = async (params: {
    nDate: string;
    nTime: string;
    nCity: any;
    tCity: any;
    tDate: string;
    tTime: string;
  }) => {
    if (params.nDate.length !== 10 || params.nTime.length !== 5) {
      Alert.alert('Eksik Bilgi', 'Lütfen doğum tarihini YYYY-AA-GG ve saatini SS:DD formatında giriniz.');
      return;
    }
    if (params.tDate.length !== 10 || params.tTime.length !== 5) {
      Alert.alert('Eksik Bilgi', 'Lütfen uygulama tarihini YYYY-AA-GG ve saatini SS:DD formatında giriniz.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiFetch('/api/astrology/calculate-transit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          natalDate: params.nDate,
          natalTime: params.nTime,
          transitDate: params.tDate,
          transitTime: params.tTime,
          cityData: params.nCity,
          transitCityData: params.tCity || params.nCity,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Günlük rehber hesaplaması başarısız oldu.');
      }
      setAppliedDateStr(params.tDate);
      setAppliedTimeStr(params.tTime);
      setTransitData(result.data);
      try {
        await AsyncStorage.setItem(
          DAILY_GUIDE_STORAGE_KEY,
          JSON.stringify({
            natalDateStr: params.nDate,
            natalTimeStr: params.nTime,
            selectedCityData: params.nCity,
            selectedTransitCityData: params.tCity,
            transitDateStr: params.tDate,
            transitTimeStr: params.tTime,
            autoLoad: false,
          })
        );
      } catch {}
    } catch (err: any) {
      Alert.alert('Hata', err.message || 'Günlük rehber hesaplanırken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load saved context on mount
  useEffect(() => {
    const loadSavedContext = async () => {
      try {
        const raw = await AsyncStorage.getItem(DAILY_GUIDE_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          const nDate = parsed.natalDateStr || '1990-01-01';
          const nTime = parsed.natalTimeStr || '12:00';
          const nCity = parsed.selectedCityData || ASTRO_CITIES[0];
          const tCity = parsed.selectedTransitCityData || null;
          const tDate = parsed.transitDateStr || defaultTDate;
          const tTime = parsed.transitTimeStr || defaultTTime;

          setNatalDateStr(nDate);
          setNatalTimeStr(nTime);
          setSelectedCityData(nCity);
          setSearchQuery(`${nCity.name}, ${nCity.country || ''}`.replace(/,\s*$/, ''));
          if (tCity) {
            setSelectedTransitCityData(tCity);
            setTransitSearchQuery(`${tCity.name}, ${tCity.country || ''}`.replace(/,\s*$/, ''));
          }
          setTransitDateStr(tDate);
          setTransitTimeStr(tTime);

          if (parsed.autoLoad) {
            void executeCalculation({
              nDate,
              nTime,
              nCity,
              tCity,
              tDate,
              tTime,
            });
          }
        }
      } catch {}
    };
    void loadSavedContext();
  }, []);

  const shiftDateStrByDays = (baseDateStr: string, deltaDays: number): string => {
    const parts = baseDateStr.split('-').map(Number);
    const dt =
      parts.length === 3 && !isNaN(parts[0])
        ? new Date(Date.UTC(parts[0], parts[1] - 1, parts[2], 12, 0, 0))
        : new Date();
    dt.setUTCDate(dt.getUTCDate() + deltaDays);
    return dt.toISOString().split('T')[0];
  };

  const handleFormatDate = (text: string, setter: (v: string) => void) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = '';
    if (cleaned.length > 0) formatted = cleaned.substring(0, 4);
    if (cleaned.length > 4) formatted += '-' + cleaned.substring(4, 6);
    if (cleaned.length > 6) formatted += '-' + cleaned.substring(6, 8);
    setter(formatted);
  };

  const handleFormatTime = (text: string, setter: (v: string) => void) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = '';
    if (cleaned.length > 0) formatted = cleaned.substring(0, 2);
    if (cleaned.length > 2) formatted += ':' + cleaned.substring(2, 4);
    setter(formatted);
  };

  const dailyGuide: SevenLayersDailyGuideReport | null = useMemo(() => {
    if (!transitData) return null;
    const activeCity = selectedTransitCityData || selectedCityData || ASTRO_CITIES[0];
    const [y, m, d] = appliedDateStr.split('-').map(Number);
    const [hh, mm] = (appliedTimeStr || '12:00').split(':').map(Number);
    const targetDateObj =
      y && m && d ? new Date(y, m - 1, d, hh || 12, mm || 0, 0) : new Date();

    return generate7LayersDailyGuide({
      transitPlanets: transitData.transitPlanets,
      allTransitAspects: transitData.transitAspects,
      natalPlanets: transitData.natalChart.planets,
      natalHouses: transitData.natalChart.houses,
      targetDate: targetDateObj,
      dateStr: appliedDateStr,
      lat: activeCity?.lat ?? activeCity?.latitude ?? 41.0082,
      lon: activeCity?.lon ?? activeCity?.longitude ?? 28.9784,
      cityName: activeCity?.name || 'İstanbul',
    });
  }, [transitData, appliedDateStr, appliedTimeStr, selectedCityData, selectedTransitCityData]);

  // Interactive Breathwork Timer Effect
  useEffect(() => {
    if (!isBreathingActive || !dailyGuide) return;
    const { inhaleSec, holdSec, exhaleSec, recommendedRounds } = dailyGuide.breathGuide;

    const timer = setInterval(() => {
      setBreathSecondsLeft((prev) => {
        if (prev > 1) return prev - 1;
        if (breathPhase === 'INHALE') {
          setBreathPhase('HOLD');
          return holdSec;
        }
        if (breathPhase === 'HOLD') {
          setBreathPhase('EXHALE');
          return exhaleSec;
        }
        if (breathRound >= recommendedRounds) {
          setIsBreathingActive(false);
          setBreathPhase('INHALE');
          setBreathRound(1);
          return inhaleSec;
        }
        setBreathRound((r) => r + 1);
        setBreathPhase('INHALE');
        return inhaleSec;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isBreathingActive, breathPhase, breathRound, dailyGuide]);

  const toggleBreathTimer = () => {
    if (!dailyGuide) return;
    if (isBreathingActive) {
      setIsBreathingActive(false);
      return;
    }
    setBreathPhase('INHALE');
    setBreathSecondsLeft(dailyGuide.breathGuide.inhaleSec);
    setBreathRound(1);
    setIsBreathingActive(true);
  };

  const renderHoraRow = (slot: GuidePlanetaryHourSlot) => {
    return (
      <View
        key={`${slot.isDay ? 'd' : 'n'}-${slot.index}`}
        style={[
          styles.horaCard,
          slot.isCurrentNow
            ? { backgroundColor: 'rgba(16,185,129,0.16)', borderColor: '#10B981' }
            : slot.isGoldenForToday
            ? { backgroundColor: 'rgba(212,175,55,0.13)', borderColor: 'rgba(212,175,55,0.5)' }
            : { backgroundColor: 'rgba(0,0,0,0.45)', borderColor: 'rgba(255,255,255,0.1)' },
        ]}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 8 }}>
          <View
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: slot.color + '20',
              borderWidth: 1,
              borderColor: slot.color + '60',
              marginRight: 10,
            }}
          >
            <Text style={{ fontSize: 17, fontWeight: '900', color: slot.color }}>
              {slot.symbol}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
              <Text style={{ fontSize: 13.5, fontWeight: '800', color: '#FFF' }}>
                {slot.planetTr} Saati
              </Text>
              <Text style={{ fontSize: 10.5, color: '#9CA3AF', fontWeight: '600' }}>
                ({slot.isDay ? `☀️ Gündüz ${slot.index}.` : `🌙 Gece ${slot.index}.`})
              </Text>
              {slot.isCurrentNow && (
                <View
                  style={{
                    backgroundColor: '#10B981',
                    paddingHorizontal: 6,
                    paddingVertical: 1.5,
                    borderRadius: 6,
                  }}
                >
                  <Text style={{ fontSize: 9.5, fontWeight: '900', color: '#000' }}>
                    ŞU AN AKTİF
                  </Text>
                </View>
              )}
            </View>
            {slot.goldenReason ? (
              <Text style={{ fontSize: 11, color: '#FDE68A', marginTop: 2, fontWeight: '600' }}>
                ✦ {slot.goldenReason}
              </Text>
            ) : null}
          </View>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ fontSize: 12.5, fontWeight: '900', color: '#FFF' }}>
            {slot.startFormatted} - {slot.endFormatted}
          </Text>
          {slot.isGoldenForToday && (
            <Text style={{ fontSize: 10, color: '#FBBF24', fontWeight: '700', marginTop: 2 }}>
              ★ Altın Vakit
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <SacredBackground>
      {/* Hidden WebView Audio Synthesizer */}
      <View style={{ width: 0, height: 0, overflow: 'hidden', position: 'absolute' }}>
        <WebView
          ref={freqWebViewRef}
          originWhitelist={['*']}
          source={{ html: GUIDE_FREQ_WEBVIEW_HTML }}
          mediaPlaybackRequiresUserAction={false}
          javaScriptEnabled={true}
        />
      </View>

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            stopChakraFrequency();
            setIsBreathingActive(false);
            router.back();
          }}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.headerTitle}>Günlük Meditasyon Rehberi</Text>
          <Text style={styles.headerSubtitle}>
            Çakra • Gezegen Saati • Nefes • Mudra • Yön • Taş
          </Text>
        </View>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {isAdminChecking ? (
          <View style={{ paddingVertical: 60, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : !isAdmin ? (
          <BlurView intensity={25} tint="dark" style={styles.formCard}>
            <View style={{ alignItems: 'center', paddingVertical: 16 }}>
              <Ionicons name="lock-closed" size={38} color={COLORS.primary} />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '900',
                  color: '#FFF',
                  textAlign: 'center',
                  marginTop: 12,
                  marginBottom: 8,
                }}
              >
                Bu Modül Şu An Yalnızca Yönetici (Admin) Erişimine Açıktır
              </Text>
              <Text
                style={{
                  fontSize: 12.5,
                  color: '#D1D5DB',
                  textAlign: 'center',
                  lineHeight: 18,
                  marginBottom: 16,
                }}
              >
                Günlük Meditasyon Rehberi modülü kalibrasyon aşamasında olduğu için şu anda yalnızca Admin yetkisine sahip hesaplarla görüntülenebilir.
              </Text>
              <TouchableOpacity
                style={[styles.calcBtn, { paddingHorizontal: 24 }]}
                onPress={() => router.back()}
              >
                <Text style={styles.calcBtnText}>Geri Dön</Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        ) : !dailyGuide ? (
          <BlurView intensity={25} tint="dark" style={styles.formCard}>
            <Text style={styles.sectionHeader}>1. Doğum Bilgileriniz (Natal)</Text>

            <Text style={styles.label}>Doğum Tarihi (YYYY-AA-GG)</Text>
            <TextInput
              style={styles.input}
              value={natalDateStr}
              onChangeText={(t) => handleFormatDate(t, setNatalDateStr)}
              placeholder="Örn: 1990-05-15"
              placeholderTextColor="#666"
              keyboardType="numeric"
              maxLength={10}
            />

            <Text style={styles.label}>Doğum Saati (SS:DD)</Text>
            <TextInput
              style={styles.input}
              value={natalTimeStr}
              onChangeText={(t) => handleFormatTime(t, setNatalTimeStr)}
              placeholder="Örn: 14:30"
              placeholderTextColor="#666"
              keyboardType="numeric"
              maxLength={5}
            />

            <Text style={styles.label}>Doğum Şehri</Text>
            <View style={{ zIndex: 1000, position: 'relative' }}>
              <TextInput
                style={styles.input}
                value={searchQuery}
                onChangeText={(t) => {
                  setSearchQuery(t);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Doğum şehrinizi yazın..."
                placeholderTextColor="#666"
              />
              {showSuggestions && searchQuery.length >= 3 && suggestions.length > 0 && (
                <View style={styles.suggestionsContainer}>
                  <ScrollView keyboardShouldPersistTaps="always" style={{ maxHeight: 150 }}>
                    {suggestions.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.suggestionItem}
                        onPress={() => {
                          setSelectedCityData(item);
                          setSearchQuery(
                            `${item.name}, ${item.admin1 || ''} ${item.country}`
                              .replace(/, \s*/g, ', ')
                              .trim()
                          );
                          setShowSuggestions(false);
                          Keyboard.dismiss();
                        }}
                      >
                        <Text style={styles.suggestionText}>
                          {item.name}, {item.admin1 ? `${item.admin1}, ` : ''}
                          {item.country}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            <Text style={[styles.sectionHeader, { marginTop: 16, color: COLORS.secondary }]}>
              2. Uygulama Tarihi & Bulunduğunuz Şehir
            </Text>

            <Text style={styles.label}>Uygulama Tarihi (YYYY-AA-GG)</Text>
            <TextInput
              style={styles.input}
              value={transitDateStr}
              onChangeText={(t) => handleFormatDate(t, setTransitDateStr)}
              placeholder="Örn: 2026-11-21"
              placeholderTextColor="#666"
              keyboardType="numeric"
              maxLength={10}
            />

            <Text style={styles.label}>Referans Saat (SS:DD)</Text>
            <TextInput
              style={styles.input}
              value={transitTimeStr}
              onChangeText={(t) => handleFormatTime(t, setTransitTimeStr)}
              placeholder="Örn: 12:00"
              placeholderTextColor="#666"
              keyboardType="numeric"
              maxLength={5}
            />

            <Text style={styles.label}>Bulunduğunuz Şehir (Gezegen Saati İçin Opsiyonel)</Text>
            <View style={{ zIndex: 999, position: 'relative', marginBottom: 16 }}>
              <TextInput
                style={styles.input}
                value={transitSearchQuery}
                onChangeText={(t) => {
                  setTransitSearchQuery(t);
                  setShowTransitSuggestions(true);
                }}
                onFocus={() => setShowTransitSuggestions(true)}
                placeholder="Boş bırakılırsa doğum şehri alınır..."
                placeholderTextColor="#888"
              />
              {showTransitSuggestions &&
                transitSearchQuery.length >= 3 &&
                transitSuggestions.length > 0 && (
                  <View style={styles.suggestionsContainer}>
                    <ScrollView keyboardShouldPersistTaps="always" style={{ maxHeight: 150 }}>
                      {transitSuggestions.map((item, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.suggestionItem}
                          onPress={() => {
                            setSelectedTransitCityData(item);
                            setTransitSearchQuery(
                              `${item.name}, ${item.admin1 || ''} ${item.country}`
                                .replace(/, \s*/g, ', ')
                                .trim()
                            );
                            setShowTransitSuggestions(false);
                            Keyboard.dismiss();
                          }}
                        >
                          <Text style={styles.suggestionText}>
                            {item.name}, {item.admin1 ? `${item.admin1}, ` : ''}
                            {item.country}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
            </View>

            <TouchableOpacity
              style={styles.calcBtn}
              disabled={isLoading}
              onPress={() =>
                executeCalculation({
                  nDate: natalDateStr,
                  nTime: natalTimeStr,
                  nCity: selectedCityData,
                  tCity: selectedTransitCityData,
                  tDate: transitDateStr,
                  tTime: transitTimeStr,
                })
              }
            >
              {isLoading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <>
                  <Ionicons name="book" size={18} color="#000" />
                  <Text style={styles.calcBtnText}>Günlük Meditasyon Rehberimi Aç</Text>
                </>
              )}
            </TouchableOpacity>
          </BlurView>
        ) : (
          <View style={{ gap: 14 }}>
            {/* İleri / Geri Tarih Gezgini & Harita Değiştir Barı */}
            <View style={styles.navCard}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 10,
                }}
              >
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={{ fontSize: 11, color: '#9CA3AF' }}>Harita & Konum:</Text>
                  <Text style={{ fontSize: 13, fontWeight: '800', color: '#FFF' }}>
                    {natalDateStr} • {(selectedTransitCityData || selectedCityData)?.name}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    stopChakraFrequency();
                    setIsBreathingActive(false);
                    setTransitData(null);
                  }}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.18)',
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 10,
                  }}
                >
                  <Text style={{ fontSize: 11.5, fontWeight: '700', color: COLORS.primary }}>
                    Bilgileri Değiştir
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <TouchableOpacity
                  disabled={isLoading}
                  onPress={() => {
                    const prevD = shiftDateStrByDays(transitDateStr, -1);
                    setTransitDateStr(prevD);
                    void executeCalculation({
                      nDate: natalDateStr,
                      nTime: natalTimeStr,
                      nCity: selectedCityData,
                      tCity: selectedTransitCityData,
                      tDate: prevD,
                      tTime: transitTimeStr,
                    });
                  }}
                  style={styles.dayStepBtn}
                >
                  <Text style={styles.dayStepBtnText}>◀ -1 Gün</Text>
                </TouchableOpacity>

                <TextInput
                  style={[
                    styles.input,
                    {
                      flex: 1.4,
                      marginBottom: 0,
                      paddingVertical: 7,
                      paddingHorizontal: 10,
                      fontSize: 12.5,
                      textAlign: 'center',
                    },
                  ]}
                  value={transitDateStr}
                  onChangeText={(t) => handleFormatDate(t, setTransitDateStr)}
                  placeholder="YYYY-AA-GG"
                  placeholderTextColor="#666"
                  keyboardType="numeric"
                  maxLength={10}
                />

                <TextInput
                  style={[
                    styles.input,
                    {
                      flex: 0.85,
                      marginBottom: 0,
                      paddingVertical: 7,
                      paddingHorizontal: 8,
                      fontSize: 12.5,
                      textAlign: 'center',
                    },
                  ]}
                  value={transitTimeStr}
                  onChangeText={(t) => handleFormatTime(t, setTransitTimeStr)}
                  placeholder="SS:DD"
                  placeholderTextColor="#666"
                  keyboardType="numeric"
                  maxLength={5}
                />

                <TouchableOpacity
                  disabled={isLoading}
                  onPress={() => {
                    const nextD = shiftDateStrByDays(transitDateStr, 1);
                    setTransitDateStr(nextD);
                    void executeCalculation({
                      nDate: natalDateStr,
                      nTime: natalTimeStr,
                      nCity: selectedCityData,
                      tCity: selectedTransitCityData,
                      tDate: nextD,
                      tTime: transitTimeStr,
                    });
                  }}
                  style={styles.dayStepBtn}
                >
                  <Text style={styles.dayStepBtnText}>+1 Gün ▶</Text>
                </TouchableOpacity>
              </View>

              <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                <TouchableOpacity
                  disabled={isLoading}
                  onPress={() => {
                    const nD = new Date().toISOString().split('T')[0];
                    const nT = new Date().toTimeString().slice(0, 5);
                    setTransitDateStr(nD);
                    setTransitTimeStr(nT);
                    void executeCalculation({
                      nDate: natalDateStr,
                      nTime: natalTimeStr,
                      nCity: selectedCityData,
                      tCity: selectedTransitCityData,
                      tDate: nD,
                      tTime: nT,
                    });
                  }}
                  style={{
                    flex: 1,
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.15)',
                    borderRadius: 10,
                    paddingVertical: 8,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '700' }}>Bugün</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  disabled={isLoading}
                  onPress={() =>
                    executeCalculation({
                      nDate: natalDateStr,
                      nTime: natalTimeStr,
                      nCity: selectedCityData,
                      tCity: selectedTransitCityData,
                      tDate: transitDateStr,
                      tTime: transitTimeStr,
                    })
                  }
                  style={{
                    flex: 1.6,
                    backgroundColor: COLORS.primary,
                    borderRadius: 10,
                    paddingVertical: 8,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#000" />
                  ) : (
                    <Ionicons name="refresh" size={14} color="#000" />
                  )}
                  <Text style={{ color: '#000', fontSize: 12, fontWeight: '900' }}>
                    Tarihi Tara
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 5'li Ezoterik Reçete Özeti (Çakra • Nefes • Topraklanma • Gezegen Saati • Renk) & 4 Adımlı Plan */}
            <View
              style={[
                styles.layerCard,
                {
                  borderColor: 'rgba(212,175,55,0.5)',
                  backgroundColor: 'rgba(212,175,55,0.08)',
                },
              ]}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 10,
                  flexWrap: 'wrap',
                  gap: 6,
                }}
              >
                <Text style={{ fontSize: 11.5, fontWeight: '900', color: '#FDE68A' }}>
                  ✨ GÜNÜN 5&apos;Lİ EZOTERİK REÇETESİ ({appliedDateStr})
                </Text>
                <View
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                    borderRadius: 8,
                  }}
                >
                  <Text style={{ fontSize: 10, fontWeight: '800', color: '#FFF' }}>
                    {dailyGuide.fivePillarSummary.activeWorldsSummary}
                  </Text>
                </View>
              </View>

              {/* 5'li Hızlı Reçete Kartları */}
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 10 }}>
                <View
                  style={{
                    flex: 1,
                    minWidth: '47%',
                    backgroundColor: 'rgba(0,0,0,0.55)',
                    borderWidth: 1,
                    borderColor: 'rgba(212,175,55,0.4)',
                    borderRadius: 12,
                    padding: 9,
                  }}
                >
                  <Text style={{ fontSize: 9.5, fontWeight: '900', color: '#D4AF37' }}>
                    1. AKTİF ÇAKRA DEVRESİ
                  </Text>
                  <Text style={{ fontSize: 12, fontWeight: '900', color: '#FFF', marginTop: 2 }}>
                    {dailyGuide.fivePillarSummary.activeChakrasSummary}
                  </Text>
                </View>

                <View
                  style={{
                    flex: 1,
                    minWidth: '47%',
                    backgroundColor: 'rgba(0,0,0,0.55)',
                    borderWidth: 1,
                    borderColor: 'rgba(14,165,233,0.4)',
                    borderRadius: 12,
                    padding: 9,
                  }}
                >
                  <Text style={{ fontSize: 9.5, fontWeight: '900', color: '#38BDF8' }}>
                    2. NEFES TEKNİĞİ
                  </Text>
                  <Text style={{ fontSize: 12, fontWeight: '900', color: '#FFF', marginTop: 2 }}>
                    {dailyGuide.fivePillarSummary.breathTypeSummary}
                  </Text>
                </View>

                <View
                  style={{
                    flex: 1,
                    minWidth: '47%',
                    backgroundColor: 'rgba(0,0,0,0.55)',
                    borderWidth: 1,
                    borderColor: 'rgba(16,185,129,0.4)',
                    borderRadius: 12,
                    padding: 9,
                  }}
                >
                  <Text style={{ fontSize: 9.5, fontWeight: '900', color: '#34D399' }}>
                    3. TOPRAKLANMA SÜRESİ
                  </Text>
                  <Text style={{ fontSize: 12, fontWeight: '900', color: '#FFF', marginTop: 2 }}>
                    {dailyGuide.fivePillarSummary.groundingSummary}
                  </Text>
                </View>

                <View
                  style={{
                    flex: 1,
                    minWidth: '47%',
                    backgroundColor: 'rgba(0,0,0,0.55)',
                    borderWidth: 1,
                    borderColor: 'rgba(245,158,11,0.4)',
                    borderRadius: 12,
                    padding: 9,
                  }}
                >
                  <Text style={{ fontSize: 9.5, fontWeight: '900', color: '#FBBF24' }}>
                    4. GEZEGEN SAATİ (HORA)
                  </Text>
                  <Text style={{ fontSize: 12, fontWeight: '900', color: '#FFF', marginTop: 2 }}>
                    {dailyGuide.directionTattvaGuide.rulingPlanetSymbol}{' '}
                    {dailyGuide.fivePillarSummary.planetaryHourSummary}
                  </Text>
                </View>

                <View
                  style={{
                    width: '100%',
                    backgroundColor: 'rgba(0,0,0,0.55)',
                    borderWidth: 1,
                    borderColor: 'rgba(244,63,94,0.4)',
                    borderRadius: 12,
                    padding: 9,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <View>
                    <Text style={{ fontSize: 9.5, fontWeight: '900', color: '#FB7185' }}>
                      5. GÜNÜN RENK REZONANSI
                    </Text>
                    <Text style={{ fontSize: 12, fontWeight: '900', color: '#FFF', marginTop: 2 }}>
                      {dailyGuide.fivePillarSummary.colorSummary}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 11,
                      backgroundColor: dailyGuide.fivePillarSummary.colorHex,
                      borderWidth: 1.5,
                      borderColor: '#FFF',
                    }}
                  />
                </View>
              </View>

              {dailyGuide.crystalAromaGuide.dailyRitualChecklist.map((step, idx) => (
                <View
                  key={`m-step-${idx}`}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    backgroundColor: 'rgba(0,0,0,0.45)',
                    borderRadius: 12,
                    padding: 10,
                    marginBottom: 7,
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.08)',
                  }}
                >
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color="#D4AF37"
                    style={{ marginRight: 8, marginTop: 1 }}
                  />
                  <Text style={{ fontSize: 12.5, color: '#E5E7EB', lineHeight: 18, flex: 1 }}>
                    {step}
                  </Text>
                </View>
              ))}
            </View>

            {/* KATMAN 1: GÜNLÜK DERECELİ ÇAKRA & CANLI FREKANS ÇALAR */}
            <View
              style={[
                styles.layerCard,
                {
                  borderColor:
                    dailyGuide.chakraPrescription.mode === 'NATURAL_REST'
                      ? 'rgba(16,185,129,0.45)'
                      : 'rgba(212,175,55,0.5)',
                },
              ]}
            >
              <Text style={{ fontSize: 10.5, fontWeight: '900', color: '#D4AF37', marginBottom: 3 }}>
                1. KATMAN • DİNA-GOCHAR GÜNLÜK DERECELİ ÇAKRA & FREKANS
              </Text>
              <Text style={{ fontSize: 16, fontWeight: '900', color: '#FFF', marginBottom: 6 }}>
                {dailyGuide.chakraPrescription.headline}
              </Text>
              <Text style={{ fontSize: 12.5, color: '#D1D5DB', lineHeight: 18, marginBottom: 12 }}>
                {dailyGuide.chakraPrescription.explanation}
              </Text>

              {dailyGuide.chakraPrescription.recommendedChakras.map((item, idx) => {
                const isThisPlaying = playingChakraHz === item.hz;
                return (
                  <View
                    key={`m-chk-${item.chakraId}-${idx}`}
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      borderRadius: 14,
                      padding: 12,
                      marginBottom: 8,
                      borderWidth: 1,
                      borderColor: isThisPlaying ? item.color : 'rgba(255,255,255,0.1)',
                    }}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 6,
                      }}
                    >
                      <View style={{ flex: 1, marginRight: 8 }}>
                        <Text
                          style={{
                            fontSize: 10.5,
                            fontWeight: '800',
                            color: item.color,
                            marginBottom: 2,
                          }}
                        >
                          {dailyGuide.chakraPrescription.recommendedChakras.length > 1
                            ? `${idx + 1}. ÇAKRA ODAĞI • `
                            : ''}
                          {item.planetSource}
                        </Text>
                        <Text style={{ fontSize: 14, fontWeight: '800', color: '#FFF' }}>
                          {item.fullName} ({item.hz} Hz)
                        </Text>
                      </View>

                      <TouchableOpacity
                        onPress={() => toggleChakraFrequency(item.hz)}
                        style={{
                          backgroundColor: isThisPlaying
                            ? 'rgba(239,68,68,0.22)'
                            : 'rgba(212,175,55,0.22)',
                          borderWidth: 1.2,
                          borderColor: isThisPlaying ? '#EF4444' : '#D4AF37',
                          borderRadius: 10,
                          paddingHorizontal: 11,
                          paddingVertical: 7,
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 5,
                        }}
                      >
                        <Ionicons
                          name={isThisPlaying ? 'stop-circle' : 'play-circle'}
                          size={16}
                          color={isThisPlaying ? '#F87171' : '#FDE68A'}
                        />
                        <Text
                          style={{
                            fontSize: 11.5,
                            fontWeight: '800',
                            color: isThisPlaying ? '#F87171' : '#FDE68A',
                          }}
                        >
                          {isThisPlaying ? 'Durdur' : `${item.hz} Hz Aç`}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={{ fontSize: 12, color: '#D1D5DB', lineHeight: 17 }}>
                      {item.reason}
                    </Text>
                  </View>
                );
              })}
            </View>

            {/* KATMAN 2: O GÜN MEDİTASYON İÇİN EN ETKİLİ GEZEGEN SAATİ (HORA) */}
            <View style={[styles.layerCard, { borderColor: 'rgba(245,158,11,0.45)' }]}>
              <Text style={{ fontSize: 10.5, fontWeight: '900', color: '#FBBF24', marginBottom: 3 }}>
                2. KATMAN • KELDANİ GEZEGEN SAATİ (HORA) ZAMANLAYICISI
              </Text>
              <Text style={{ fontSize: 16, fontWeight: '900', color: '#FFF', marginBottom: 8 }}>
                En Etkili Meditasyon Vakitleri (
                {dailyGuide.planetaryHourGuide.targetPlanetsTr.join(' & ')})
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 6,
                  marginBottom: 10,
                }}
              >
                <View style={styles.metaChip}>
                  <Text style={styles.metaChipText}>
                    ☀️ Doğuş: {dailyGuide.planetaryHourGuide.sunriseFormatted}
                  </Text>
                </View>
                <View style={styles.metaChip}>
                  <Text style={styles.metaChipText}>
                    🌙 Batış: {dailyGuide.planetaryHourGuide.sunsetFormatted}
                  </Text>
                </View>
                <View style={styles.metaChip}>
                  <Text style={styles.metaChipText}>
                    Günün Hâkimi: {dailyGuide.planetaryHourGuide.dayRulerSymbol}{' '}
                    {dailyGuide.planetaryHourGuide.dayRulerTr}
                  </Text>
                </View>
              </View>

              <Text style={{ fontSize: 12.5, color: '#D1D5DB', lineHeight: 18, marginBottom: 12 }}>
                {dailyGuide.planetaryHourGuide.guidanceText}
              </Text>

              {dailyGuide.planetaryHourGuide.nextGoldenHour && (
                <View
                  style={{
                    backgroundColor: 'rgba(212,175,55,0.16)',
                    borderWidth: 1,
                    borderColor: '#D4AF37',
                    borderRadius: 14,
                    padding: 12,
                    marginBottom: 12,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={{ fontSize: 10, fontWeight: '900', color: '#FDE68A' }}>
                      ★ ÖNERİLEN SIRADAKİ ALTIN MEDİTASYON SAATİ
                    </Text>
                    <Text style={{ fontSize: 15, fontWeight: '900', color: '#FFF', marginTop: 2 }}>
                      {dailyGuide.planetaryHourGuide.nextGoldenHour.symbol}{' '}
                      {dailyGuide.planetaryHourGuide.nextGoldenHour.planetTr} Saati
                    </Text>
                    <Text style={{ fontSize: 11, color: '#FDE68A', marginTop: 2 }}>
                      {dailyGuide.planetaryHourGuide.nextGoldenHour.goldenReason}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 13.5, fontWeight: '900', color: '#FDE68A' }}>
                      {dailyGuide.planetaryHourGuide.nextGoldenHour.startFormatted} -{' '}
                      {dailyGuide.planetaryHourGuide.nextGoldenHour.endFormatted}
                    </Text>
                    <Text style={{ fontSize: 10.5, color: '#D1D5DB', marginTop: 2 }}>
                      {dailyGuide.planetaryHourGuide.nextGoldenHour.isDay
                        ? '☀️ Gündüz'
                        : '🌙 Gece'}
                    </Text>
                  </View>
                </View>
              )}

              <Text
                style={{
                  fontSize: 11.5,
                  fontWeight: '800',
                  color: '#E5E7EB',
                  marginBottom: 8,
                }}
              >
                Günün Tüm Altın Meditasyon Vakitleri (
                {dailyGuide.planetaryHourGuide.goldenHours.length} Vakit):
              </Text>
              {dailyGuide.planetaryHourGuide.goldenHours.map(renderHoraRow)}

              <TouchableOpacity
                onPress={() => setShowFullHoraTable((v) => !v)}
                style={{
                  marginTop: 6,
                  backgroundColor: 'rgba(255,255,255,0.07)',
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.14)',
                  borderRadius: 10,
                  paddingVertical: 10,
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#FDE68A' }}>
                  {showFullHoraTable
                    ? '▲ 24 Saatlik Tam Gezegen Saatleri Tablosunu Gizle'
                    : '▼ 24 Saatlik Tam Gezegen Saatleri Tablosunu Gör'}
                </Text>
              </TouchableOpacity>

              {showFullHoraTable && (
                <View style={{ marginTop: 12 }}>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '800',
                      color: '#FBBF24',
                      marginBottom: 6,
                    }}
                  >
                    ☀️ Gündüz Gezegen Saatleri (1 - 12)
                  </Text>
                  {dailyGuide.planetaryHourGuide.allDayHours.map(renderHoraRow)}

                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '800',
                      color: '#818CF8',
                      marginTop: 10,
                      marginBottom: 6,
                    }}
                  >
                    🌙 Gece Gezegen Saatleri (1 - 12)
                  </Text>
                  {dailyGuide.planetaryHourGuide.allNightHours.map(renderHoraRow)}
                </View>
              )}
            </View>

            {/* KATMAN 3: SWARA YOGA BURUN KANALI & CANLI PRANAYAMA NEFES SAYACI */}
            <View style={[styles.layerCard, { borderColor: 'rgba(14,165,233,0.45)' }]}>
              <Text style={{ fontSize: 10.5, fontWeight: '900', color: '#38BDF8', marginBottom: 3 }}>
                3. KATMAN • SWARA YOGA BURUN KANALI & PRANAYAMA NEFESİ
              </Text>
              <Text style={{ fontSize: 16, fontWeight: '900', color: '#FFF', marginBottom: 3 }}>
                {dailyGuide.breathGuide.pranayamaName}
              </Text>
              <Text style={{ fontSize: 12, color: '#7DD3FC', fontWeight: '700', marginBottom: 8 }}>
                {dailyGuide.breathGuide.activeNostrilBadge}
              </Text>
              <Text style={{ fontSize: 12.5, color: '#D1D5DB', lineHeight: 18, marginBottom: 12 }}>
                {dailyGuide.breathGuide.whyThisBreath}
              </Text>

              {/* İnteraktif Canlı Nefes Sayacı Kutusu */}
              <View
                style={{
                  backgroundColor: 'rgba(14,165,233,0.12)',
                  borderWidth: 1.2,
                  borderColor: isBreathingActive ? '#34D399' : 'rgba(14,165,233,0.4)',
                  borderRadius: 16,
                  padding: 14,
                  alignItems: 'center',
                  marginBottom: 12,
                }}
              >
                <Text style={{ fontSize: 10.5, fontWeight: '900', color: '#7DD3FC', marginBottom: 8 }}>
                  CANLI PRANAYAMA NEFES SAYACI ({dailyGuide.breathGuide.inhaleSec} -{' '}
                  {dailyGuide.breathGuide.holdSec} - {dailyGuide.breathGuide.exhaleSec} SN)
                </Text>

                <View
                  style={{
                    width: 116,
                    height: 116,
                    borderRadius: 58,
                    borderWidth: 3,
                    borderColor: !isBreathingActive
                      ? '#38BDF8'
                      : breathPhase === 'INHALE'
                      ? '#34D399'
                      : breathPhase === 'HOLD'
                      ? '#FBBF24'
                      : '#38BDF8',
                    backgroundColor: 'rgba(0,0,0,0.55)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 12,
                  }}
                >
                  {isBreathingActive ? (
                    <>
                      <Text style={{ fontSize: 11, fontWeight: '900', color: '#E5E7EB' }}>
                        {breathPhase === 'INHALE'
                          ? 'NEFES AL'
                          : breathPhase === 'HOLD'
                          ? 'MERKEZDE TUT'
                          : 'YAVAŞÇA VER'}
                      </Text>
                      <Text style={{ fontSize: 26, fontWeight: '900', color: '#FFF' }}>
                        {breathSecondsLeft} sn
                      </Text>
                      <Text style={{ fontSize: 10, fontWeight: '700', color: '#7DD3FC' }}>
                        Tur {breathRound} / {dailyGuide.breathGuide.recommendedRounds}
                      </Text>
                    </>
                  ) : (
                    <>
                      <Ionicons name="leaf-outline" size={26} color="#38BDF8" />
                      <Text style={{ fontSize: 12, fontWeight: '800', color: '#FFF', marginTop: 4 }}>
                        {dailyGuide.breathGuide.recommendedRounds} Tur
                      </Text>
                    </>
                  )}
                </View>

                <TouchableOpacity
                  onPress={toggleBreathTimer}
                  style={{
                    backgroundColor: isBreathingActive ? 'rgba(239,68,68,0.22)' : '#0EA5E9',
                    borderWidth: isBreathingActive ? 1 : 0,
                    borderColor: '#EF4444',
                    paddingHorizontal: 18,
                    paddingVertical: 10,
                    borderRadius: 12,
                    width: '100%',
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12.5,
                      fontWeight: '900',
                      color: isBreathingActive ? '#FCA5A5' : '#000',
                    }}
                  >
                    {isBreathingActive
                      ? '⏹ Nefes Sayacını Durdur'
                      : '▶ Canlı Nefes Sayacını Başlat'}
                  </Text>
                </TouchableOpacity>
              </View>

              {dailyGuide.breathGuide.stepByStep.map((st, idx) => (
                <Text
                  key={`m-bst-${idx}`}
                  style={{ fontSize: 12, color: '#E5E7EB', lineHeight: 18, marginBottom: 6 }}
                >
                  <Text style={{ fontWeight: '900', color: '#38BDF8' }}>{idx + 1}. </Text>
                  {st}
                </Text>
              ))}
            </View>

            {/* KATMAN 4: PARMAK MÜHRÜ (HASTA MUDRA) & BİJA MANTRA */}
            <View style={[styles.layerCard, { borderColor: 'rgba(168,85,247,0.45)' }]}>
              <Text style={{ fontSize: 10.5, fontWeight: '900', color: '#C084FC', marginBottom: 3 }}>
                4. KATMAN • PARMAK MÜHRÜ (HASTA MUDRA) & BİJA MANTRA
              </Text>
              <Text style={{ fontSize: 16, fontWeight: '900', color: '#FFF', marginBottom: 10 }}>
                Sinir Sistemi & Meridyen Kilidi
              </Text>

              {dailyGuide.mudraMantraList.map((mm, idx) => (
                <View
                  key={`m-mm-${mm.chakraId}-${idx}`}
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    borderRadius: 14,
                    padding: 12,
                    marginBottom: 10,
                    borderWidth: 1,
                    borderColor: mm.color + '55',
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: 6,
                      marginBottom: 6,
                    }}
                  >
                    <Text style={{ fontSize: 11.5, fontWeight: '900', color: mm.color }}>
                      {mm.chakraShortName} ({mm.hz} Hz)
                    </Text>
                    <View
                      style={{
                        backgroundColor: 'rgba(212,175,55,0.18)',
                        borderWidth: 1,
                        borderColor: 'rgba(212,175,55,0.4)',
                        paddingHorizontal: 8,
                        paddingVertical: 3,
                        borderRadius: 8,
                      }}
                    >
                      <Text style={{ fontSize: 11, fontWeight: '900', color: '#FDE68A' }}>
                        🕉️ Mantra: {mm.bijaMantra} ({mm.mantraRepetitions})
                      </Text>
                    </View>
                  </View>

                  <Text style={{ fontSize: 14.5, fontWeight: '800', color: '#FFF', marginBottom: 3 }}>
                    ✋ {mm.mudraName}
                  </Text>
                  <Text style={{ fontSize: 12, color: '#D1D5DB', lineHeight: 18, marginBottom: 8 }}>
                    {mm.handPosture}
                  </Text>
                  <Text style={{ fontSize: 11.5, color: '#FDE68A', fontWeight: '700', marginBottom: 4 }}>
                    🔊 {mm.mantraPronunciation}
                  </Text>
                  <Text style={{ fontSize: 12, color: '#9CA3AF', lineHeight: 17 }}>
                    {mm.meditationFocus}
                  </Text>
                </View>
              ))}
            </View>

            {/* KATMAN 5: MEDİTASYON OTURUŞ YÖNÜ (DİG-SHUDDHİ) & TATTVA GEOMETRİSİ */}
            <View style={[styles.layerCard, { borderColor: 'rgba(16,185,129,0.45)' }]}>
              <Text style={{ fontSize: 10.5, fontWeight: '900', color: '#34D399', marginBottom: 3 }}>
                5. KATMAN • DİG-SHUDDHİ PUSULA YÖNÜ & TATTVA GEOMETRİSİ
              </Text>
              <Text style={{ fontSize: 16, fontWeight: '900', color: '#FFF', marginBottom: 10 }}>
                Oturuş Yönünüz: {dailyGuide.directionTattvaGuide.compassDirectionTr}
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  borderRadius: 14,
                  padding: 12,
                  marginBottom: 10,
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.1)',
                }}
              >
                <View
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 14,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: dailyGuide.directionTattvaGuide.tattvaColorHex + '22',
                    borderWidth: 1,
                    borderColor: dailyGuide.directionTattvaGuide.tattvaColorHex + '66',
                    marginRight: 12,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 22,
                      fontWeight: '900',
                      color: dailyGuide.directionTattvaGuide.tattvaColorHex,
                    }}
                  >
                    {dailyGuide.directionTattvaGuide.tattvaSymbol}
                  </Text>
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: '800',
                      color: dailyGuide.directionTattvaGuide.tattvaColorHex,
                    }}
                  >
                    {dailyGuide.directionTattvaGuide.compassCode} (
                    {dailyGuide.directionTattvaGuide.compassAngleDeg}°)
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 11.5, fontWeight: '700', color: '#6EE7B7' }}>
                    {dailyGuide.directionTattvaGuide.sanskritDirectionName}
                  </Text>
                  <Text style={{ fontSize: 13.5, fontWeight: '800', color: '#FFF', marginTop: 2 }}>
                    {dailyGuide.directionTattvaGuide.tattvaName} •{' '}
                    {dailyGuide.directionTattvaGuide.tattvaGeometryName}
                  </Text>
                  <Text style={{ fontSize: 11.5, color: '#9CA3AF', marginTop: 2 }}>
                    {dailyGuide.directionTattvaGuide.tattvaElementTr}
                  </Text>
                </View>
              </View>

              <Text style={{ fontSize: 12.5, color: '#D1D5DB', lineHeight: 18 }}>
                {dailyGuide.directionTattvaGuide.visualizationGuide}
              </Text>
            </View>

            {/* KATMAN 6: DOĞAL TAŞ / KRİSTAL, TÜTSÜ & RENK REZONANSI */}
            <View style={[styles.layerCard, { borderColor: 'rgba(244,63,94,0.45)' }]}>
              <Text style={{ fontSize: 10.5, fontWeight: '900', color: '#FB7185', marginBottom: 3 }}>
                6. KATMAN • DOĞAL TAŞ, TÜTSÜ & FREKANS RENGİ REÇETESİ
              </Text>
              <Text style={{ fontSize: 16, fontWeight: '900', color: '#FFF', marginBottom: 10 }}>
                Günün Kristal, Aromaterapi & Bitki İksiri
              </Text>

              <View style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: 11.5, fontWeight: '800', color: '#FDA4AF', marginBottom: 6 }}>
                  💎 Önerilen Doğal Taşlar:
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                  {dailyGuide.crystalAromaGuide.primaryCrystals.map((cr, i) => (
                    <View
                      key={`m-cr-${i}`}
                      style={{
                        backgroundColor: 'rgba(244,63,94,0.15)',
                        borderWidth: 1,
                        borderColor: 'rgba(244,63,94,0.35)',
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        borderRadius: 8,
                      }}
                    >
                      <Text style={{ fontSize: 12, fontWeight: '700', color: '#FFE4E6' }}>
                        {cr}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: 11.5, fontWeight: '800', color: '#FDE68A', marginBottom: 6 }}>
                  🌿 Tütsü & Uçucu Yağlar:
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                  {dailyGuide.crystalAromaGuide.incenseAndOils.map((inc, i) => (
                    <View
                      key={`m-inc-${i}`}
                      style={{
                        backgroundColor: 'rgba(245,158,11,0.15)',
                        borderWidth: 1,
                        borderColor: 'rgba(245,158,11,0.35)',
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        borderRadius: 8,
                      }}
                    >
                      <Text style={{ fontSize: 12, fontWeight: '700', color: '#FEF3C7' }}>
                        {inc}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              <View
                style={{
                  backgroundColor: 'rgba(0,0,0,0.45)',
                  borderRadius: 12,
                  padding: 12,
                  gap: 6,
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.08)',
                }}
              >
                <Text style={{ fontSize: 12, color: '#D1D5DB', lineHeight: 17 }}>
                  <Text style={{ fontWeight: '800', color: '#34D399' }}>Topraklanma Süresi: </Text>
                  {dailyGuide.crystalAromaGuide.groundingDurationLabel}
                </Text>
                <Text style={{ fontSize: 12, color: '#D1D5DB', lineHeight: 17 }}>
                  <Text style={{ fontWeight: '800', color: '#FDE68A' }}>Günün Frekans Rengi: </Text>
                  {dailyGuide.crystalAromaGuide.colorToneName}
                </Text>
                <Text style={{ fontSize: 11.5, color: '#9CA3AF', lineHeight: 16 }}>
                  {dailyGuide.crystalAromaGuide.colorReason}
                </Text>
                <Text style={{ fontSize: 12, color: '#D1D5DB', lineHeight: 17 }}>
                  <Text style={{ fontWeight: '800', color: '#FDA4AF' }}>Kristal Kullanımı: </Text>
                  {dailyGuide.crystalAromaGuide.crystalPlacement}
                </Text>
                <Text style={{ fontSize: 12, color: '#D1D5DB', lineHeight: 17 }}>
                  <Text style={{ fontWeight: '800', color: '#6EE7B7' }}>Önerilen Bitki Çayı: </Text>
                  {dailyGuide.crystalAromaGuide.herbalTeaOrElixir}
                </Text>
              </View>
            </View>
          </View>
        )}

        <View style={{ height: 90 }} />
      </ScrollView>
    </SacredBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 52,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.2)',
  },
  backButton: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFF',
  },
  headerSubtitle: {
    fontSize: 11,
    color: COLORS.primary,
    marginTop: 2,
  },
  scrollContent: {
    padding: 14,
  },
  formCard: {
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: 'rgba(10, 12, 20, 0.85)',
    overflow: 'hidden',
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 6,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    color: '#FFF',
    fontSize: 14,
    marginBottom: 12,
  },
  suggestionsContainer: {
    backgroundColor: '#121624',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 12,
    marginTop: -8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  suggestionItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  suggestionText: {
    color: '#FFF',
    fontSize: 13,
  },
  calcBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 6,
  },
  calcBtnText: {
    color: '#000',
    fontWeight: '900',
    fontSize: 14,
  },
  navCard: {
    backgroundColor: 'rgba(12, 16, 26, 0.92)',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.35)',
  },
  dayStepBtn: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  dayStepBtnText: {
    color: '#FFF',
    fontSize: 11.5,
    fontWeight: '800',
  },
  layerCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 18,
    padding: 15,
    borderWidth: 1.2,
    borderColor: COLORS.border,
  },
  horaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 11,
    borderRadius: 13,
    borderWidth: 1,
    marginBottom: 7,
  },
  metaChip: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  metaChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E5E7EB',
  },
});
