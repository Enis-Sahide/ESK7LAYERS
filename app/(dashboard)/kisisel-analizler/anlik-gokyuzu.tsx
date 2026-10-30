import SacredBackground from '@/components/SacredBackground';
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ImageBackground, KeyboardAvoidingView, Platform, Dimensions, Modal, Keyboard, ActivityIndicator } from 'react-native';
import { BlurView } from 'expo-blur';
import Svg, { Circle, Line, Text as SvgText, G } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import moment from 'moment-timezone';
// @ts-ignore
import tzlookup from 'tz-lookup';
import { getTransitHouseInterpretation, getTransitAspectInterpretation } from '@/src/features/astrology/engine/TransitInterpretations';
import {
  generateUnifiedPlanetTransit,
  UnifiedPlanetTransit,
  generateUnifiedSkyPlanets,
  UnifiedSkyPlanet,
  generateCurrentSkyOverview,
  CurrentSkyOverview,
  generatePersonalTransitOverview,
  PersonalTransitOverview,
} from '@/src/features/astrology/engine/TransitSynthesisEngine';
import { AstroPoint, TransitAspect } from '@/src/features/astrology/engine/AstrologyConstants';

import { API_BASE_URL, apiFetch } from '@/src/core/config';
import MobileTransitTimelineChart from '@/src/features/astrology/components/MobileTransitTimelineChart';
import MobileMundaneSkyWheel from '@/src/features/astrology/components/MobileMundaneSkyWheel';
import { getSkyPlanetSignInterpretation, getSkyAspectInterpretation } from '@/src/features/astrology/engine/SkyAspectInterpretations';
import { ASTRO_CITIES } from '@/src/features/astrology/api/astrologyClient';
import { generateAstrologyChart } from '@/src/features/astrology/engine/AstrologyEngine';
import { LinearGradient } from 'expo-linear-gradient';
import MobileLunationCard, { LunationBackendData } from '@/src/features/astrology/components/MobileLunationCard';

const { width } = Dimensions.get('window');
const CHART_SIZE = width - 20;
const CENTER = CHART_SIZE / 2;
const RADIUS = CENTER - 50;

const R_ZODIAC_OUTER = RADIUS;
const R_ZODIAC_INNER = RADIUS - 25;
const R_NATAL_PLANETS = RADIUS - 45;
const R_TRANSIT_PLANETS = RADIUS + 20;
const R_CUSP_NUM = RADIUS - 60;

const COLORS = {
  background: '#000000',
  primary: '#D4AF37', // Gold
  secondary: '#0EA5E9', // Cyan/Blue
  text: '#E0E0E0',
  textMuted: '#9CA3AF',
  cardBg: 'rgba(10, 10, 10, 0.85)',
  border: 'rgba(212, 175, 55, 0.3)',
};

const ZODIAC_ORDER = ['Koç', 'Boğa', 'İkizler', 'Yengeç', 'Aslan', 'Başak', 'Terazi', 'Akrep', 'Yay', 'Oğlak', 'Kova', 'Balık'];

const ZODIAC_COLORS: Record<string, string> = {
  'Koç': '#FF453A', 'Aslan': '#FF453A', 'Yay': '#FF453A', // Fire
  'Boğa': '#32D74B', 'Başak': '#32D74B', 'Oğlak': '#32D74B', // Earth
  'İkizler': '#FFD60A', 'Terazi': '#FFD60A', 'Kova': '#FFD60A', // Air
  'Yengeç': '#0A84FF', 'Akrep': '#0A84FF', 'Balık': '#0A84FF', // Water
};

const ZODIAC_SYMBOLS: Record<string, string> = {
  'Koç': '♈', 'Boğa': '♉', 'İkizler': '♊', 'Yengeç': '♋', 
  'Aslan': '♌', 'Başak': '♍', 'Terazi': '♎', 'Akrep': '♏', 
  'Yay': '♐', 'Oğlak': '♑', 'Kova': '♒', 'Balık': '♓'
};

const PLANET_SYMBOLS: Record<string, string> = {
  'Güneş': '☉', 'Ay': '☽', 'Merkür': '☿', 'Venüs': '♀', 'Mars': '♂', 
  'Jüpiter': '♃', 'Satürn': '♄', 'Uranüs': '♅', 'Neptün': '♆', 'Plüton': '♇',
  'Yükselen (ASC)': 'ASC', 'Tepe Noktası (MC)': 'MC', 'Kuzey Ay Düğümü': '☊',
  'Kiron': '⚷', 'Vertex (Vx)': 'Vx', 'Şans Noktası (POF)': '⊗', 'Lilith': '⚸'
};

const ASPECT_COLORS: Record<string, string> = {
  'Kavuşum': '#D4AF37', 'Sekstil': '#0A84FF', 'Kare': '#FF453A', 'Üçgen': '#32D74B', 'Karşıt': '#FF453A', 'Görmeyen': '#0A84FF'
};

const ASPECT_SYMBOLS: Record<string, string> = {
  'Kavuşum': '☌', 'Sekstil': '⚹', 'Kare': '□', 'Üçgen': '△', 'Karşıt': '☍', 'Görmeyen': '⚻'
};

interface TransitChartData {
  natalChart: {
    planets: AstroPoint[];
    ascendant: AstroPoint;
    midheaven: AstroPoint;
    houses: AstroPoint[];
    aspects: { planet1: string; planet2: string; type: string; orb: number; isExact: boolean }[];
  };
  transitPlanets: AstroPoint[];
  transitAspects: TransitAspect[];
}

export default function AnlikGokyuzuScreen() {
  const router = useRouter();
  
  // Natal (Birth) Inputs
  const [natalDateStr, setNatalDateStr] = useState('');
  const [natalTimeStr, setNatalTimeStr] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedCityData, setSelectedCityData] = useState<any>(null);

  // Transit City Inputs
  const [transitSearchQuery, setTransitSearchQuery] = useState('');
  const [showTransitSuggestions, setShowTransitSuggestions] = useState(false);
  const [transitSuggestions, setTransitSuggestions] = useState<any[]>([]);
  const [selectedTransitCityData, setSelectedTransitCityData] = useState<any>(null);

  // Transit Inputs
  const today = new Date();
  const defaultTDate = today.toISOString().split('T')[0];
  const defaultTTime = today.toTimeString().slice(0, 5);
  const [transitDateStr, setTransitDateStr] = useState(defaultTDate);
  const [transitTimeStr, setTransitTimeStr] = useState(defaultTTime);

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [transitData, setTransitData] = useState<TransitChartData | null>(null);
  const [selectedInterp, setSelectedInterp] = useState<{ title: string, content: string } | null>(null);
  const [isHousesExpanded, setIsHousesExpanded] = useState(false);
  const [isAspectsExpanded, setIsAspectsExpanded] = useState(false);



  // Timeline (Gantt) states
  const [activeTab, setActiveTab] = useState<'BIWHEEL' | 'TIMELINE'>('BIWHEEL');
  const [timelineData, setTimelineData] = useState<any>(null);
  const [timelineRange, setTimelineRange] = useState<'1m' | '3m' | '6m' | '1y'>('1m');
  const [isTimelineLoading, setIsTimelineLoading] = useState(false);
  const [showLockModal, setShowLockModal] = useState(false);

  // User Local Timezone (Auto-detected from phone/device without permissions)
  const [userTz, setUserTz] = useState<string>('Europe/Istanbul');
  const [tzOffsetHours, setTzOffsetHours] = useState<number>(3);

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Istanbul';
      const offset = -new Date().getTimezoneOffset() / 60;
      setUserTz(tz);
      setTzOffsetHours(offset);
    } catch {
      // fallback to Europe/Istanbul
    }
  }, []);

  // Mode: PERSONAL (Doğum Haritası Üzerine) vs MUNDANE (Kolektif Gökyüzü)
  const [analysisMode, setAnalysisMode] = useState<'PERSONAL' | 'MUNDANE'>('PERSONAL');
  const [skySubTab, setSkySubTab] = useState<'WHEEL' | 'TIMELINE'>('WHEEL');
  const [skyViewMode, setSkyViewMode] = useState<'OVERVIEW' | 'SYNTHESIS' | 'LIST'>('OVERVIEW');
  const [personalViewMode, setPersonalViewMode] = useState<'OVERVIEW' | 'PLANETS' | 'TABLES'>('OVERVIEW');
  const [skyChartData, setSkyChartData] = useState<any>(null);
  const [isSkyChartLoading, setIsSkyChartLoading] = useState(false);
  const [skyAspectFilter, setSkyAspectFilter] = useState<'ALL' | 'HARMONIOUS' | 'CHALLENGING' | 'CONJUNCTION'>('ALL');
  const [isMundanePlanetsExpanded, setIsMundanePlanetsExpanded] = useState(true);
  const [isMundaneAspectsExpanded, setIsMundaneAspectsExpanded] = useState(true);

  // Mundane Sentez Memos (Kozmik Hava Durumu ve 13 Gezegen Kartı)
  const currentSkyOverview = React.useMemo(() => {
    if (!skyChartData?.planets || !skyChartData?.aspects) return null;
    return generateCurrentSkyOverview(skyChartData.planets, skyChartData.aspects);
  }, [skyChartData]);

  const unifiedSkyPlanets = React.useMemo(() => {
    if (!skyChartData?.planets || !skyChartData?.aspects) return [];
    return generateUnifiedSkyPlanets(skyChartData.planets, skyChartData.aspects, 'orb');
  }, [skyChartData]);

  // Kişisel Transit Sentez Memos (Bütünleşik Özet ve 10 Gezegen Kartı)
  const personalOverview = React.useMemo(() => {
    if (!transitData) return null;
    return generatePersonalTransitOverview(
      transitData.transitPlanets,
      transitData.transitAspects,
      transitData.natalChart.planets,
      transitData.natalChart.houses
    );
  }, [transitData]);

  const unifiedPersonalPlanets = React.useMemo(() => {
    if (!transitData) return [];
    return transitData.transitPlanets.map(p =>
      generateUnifiedPlanetTransit(
        p,
        transitData.transitAspects,
        transitData.natalChart.planets,
        transitData.natalChart.houses
      )
    );
  }, [transitData]);

  // Backend API'den çekilen Ay Fazı ve 6 Aylık Güneş Tutulması Çatısı Verileri
  const [mundaneLunationData, setMundaneLunationData] = useState<LunationBackendData | null>(null);
  const [personalLunationData, setPersonalLunationData] = useState<LunationBackendData | null>(null);

  // Sayfa açıldığında kolektif ay fazını backend'den getir
  useEffect(() => {
    (async () => {
      try {
        const lRes = await apiFetch('/api/astrology/lunation');
        if (lRes.ok) {
          const lJson = await lRes.json();
          if (lJson && lJson.success) {
            setMundaneLunationData(lJson.data);
          }
        }
      } catch (e) {
        // sessiz geçiş
      }
    })();
  }, []);

  const [skyTimelineData, setSkyTimelineData] = useState<any>(null);
  const [skyTimelineRange, setSkyTimelineRange] = useState<'1m' | '3m' | '6m' | '1y'>('1m');
  const [isSkyTimelineLoading, setIsSkyTimelineLoading] = useState(false);

  const fetchSkyChart = async (dStr: string = transitDateStr, tStr: string = transitTimeStr) => {
    setIsSkyChartLoading(true);
    try {
      const rawCity = selectedTransitCityData || selectedCityData || ASTRO_CITIES.find(c => c.name === 'İstanbul') || ASTRO_CITIES[0];
      const city = {
        name: rawCity.name,
        lat: rawCity.lat ?? rawCity.latitude ?? 41.0082,
        lon: rawCity.lon ?? rawCity.longitude ?? 28.9784,
        tz: rawCity.tz || rawCity.timezone || userTz || 'Europe/Istanbul'
      };

      const mObj = moment.tz(`${dStr} ${tStr}:00`, 'YYYY-MM-DD HH:mm:ss', city.tz);
      const dateObj = mObj.toDate();
      const skyChart: any = generateAstrologyChart(dateObj, city);
      // Mundane / Anlık Gökyüzü için katı orb filtresi (Ay maks 4.5°, diğerleri maks 3.5°, Görmeyen maks 2.0°)
      const mundaneAspects = (skyChart.aspects || []).filter((asp: any) => {
        const hasMoon = asp.planet1 === 'Ay' || asp.planet2 === 'Ay';
        if (asp.type === 'Görmeyen') return asp.orb <= 2.0;
        const maxOrb = hasMoon ? 4.5 : 3.5;
        return asp.orb <= maxOrb;
      });

      // Kesinlik önceliğine göre küçükten büyüğe sırala (0.0° en başta)
      mundaneAspects.sort((a: any, b: any) => a.orb - b.orb);

      const enrichedAspects = mundaneAspects.map((asp: any) => ({
        ...asp,
        interpretation: getSkyAspectInterpretation(asp.planet1, asp.planet2, asp.type)
      }));

      setSkyChartData({
        date: dStr,
        time: tStr,
        city: city.name,
        planets: skyChart.planets,
        ascendant: skyChart.ascendant,
        midheaven: skyChart.midheaven,
        houses: skyChart.houses,
        aspects: enrichedAspects
      });

      // Kolektif ay fazı ve tutulma çatısını backend API'den güncelle
      try {
        const lRes = await apiFetch(`/api/astrology/lunation?date=${dStr}`);
        if (lRes.ok) {
          const lJson = await lRes.json();
          if (lJson && lJson.success) {
            setMundaneLunationData(lJson.data);
          }
        }
      } catch (lErr) {
        console.warn('Mundane lunation fetch error:', lErr);
      }
    } catch (e) {
      console.error('Sky chart local calculation error:', e);
    } finally {
      setIsSkyChartLoading(false);
    }
  };

  const fetchSkyTimeline = async (rangeToFetch: '1m' | '3m' | '6m' | '1y' = skyTimelineRange) => {
    setIsSkyTimelineLoading(true);
    try {
      const response = await apiFetch('/api/astrology/sky-timeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startDateStr: transitDateStr,
          range: rangeToFetch,
          userTz,
          tzOffsetHours
        })
      });
      if (response.ok) {
        const data = await response.json();
        if (data && data.success) {
          setSkyTimelineData(data.data);
        }
      } else {
        console.warn('Sky timeline response status:', response.status);
      }
    } catch (e) {
      console.error('Sky timeline fetch error:', e);
    } finally {
      setIsSkyTimelineLoading(false);
    }
  };

  const fetchTimeline = async (rangeToFetch: '1m' | '3m' | '6m' | '1y' = timelineRange) => {
    if (!selectedCityData) return;
    setIsTimelineLoading(true);
    try {
      const response = await apiFetch('/api/astrology/transit-timeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          natalDate: natalDateStr,
          natalTime: natalTimeStr,
          cityData: selectedCityData,
          range: rangeToFetch,
          startDateStr: transitDateStr,
          userTz,
          tzOffsetHours
        })
      });
      if (response.ok) {
        const data = await response.json();
        if (data && data.success) {
          setTimelineData(data.data);
        }
      }
    } catch (e) {
      console.error('Mobile timeline fetch error:', e);
    } finally {
      setIsTimelineLoading(false);
    }
  };

  const dateInputRef = useRef<TextInput>(null);
  const timeInputRef = useRef<TextInput>(null);
  const tDateInputRef = useRef<TextInput>(null);
  const tTimeInputRef = useRef<TextInput>(null);

  // Geocoding city search
  useEffect(() => {
    if (searchQuery.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    const fetchCities = async () => {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(searchQuery)}`, {
          headers: {
            'User-Agent': '7LayersApp/1.0 (Contact: admin@7layers.com)',
            'Accept-Language': 'tr-TR'
          }
        });
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
              } catch (e) {
                console.error("tzlookup error:", e);
              }
              return {
                name,
                latitude: latNum,
                longitude: lonNum,
                timezone: tz,
                country,
                admin1
              };
            });
            setSuggestions(mapped);
          }
        }
      } catch (error) {
        console.error("Geocoding Error:", error);
      }
    };

    const debounceTimer = setTimeout(fetchCities, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Geocoding transit city search
  useEffect(() => {
    if (transitSearchQuery.trim().length < 3) {
      setTransitSuggestions([]);
      return;
    }

    const fetchTransitCities = async () => {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(transitSearchQuery)}`, {
          headers: {
            'User-Agent': '7LayersApp/1.0 (Contact: admin@7layers.com)',
            'Accept-Language': 'tr-TR'
          }
        });
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
              } catch (e) {
                console.error("tzlookup error:", e);
              }
              return {
                name,
                latitude: latNum,
                longitude: lonNum,
                timezone: tz,
                country,
                admin1
              };
            });
            setTransitSuggestions(mapped);
          }
        }
      } catch (error) {
        console.error("Geocoding Error:", error);
      }
    };

    const debounceTimer = setTimeout(fetchTransitCities, 500);
    return () => clearTimeout(debounceTimer);
  }, [transitSearchQuery]);

  const handleNatalDateChange = (text: string) => {
    let cleaned = text.replace(/\D/g, '');
    let formatted = '';
    if (cleaned.length > 0) formatted = cleaned.substring(0, 4);
    if (cleaned.length > 4) formatted += '-' + cleaned.substring(4, 6);
    if (cleaned.length > 6) formatted += '-' + cleaned.substring(6, 8);
    setNatalDateStr(formatted);
    if (cleaned.length === 8) {
      timeInputRef.current?.focus();
    }
  };

  const handleNatalTimeChange = (text: string) => {
    let cleaned = text.replace(/\D/g, '');
    let formatted = '';
    if (cleaned.length > 0) formatted = cleaned.substring(0, 2);
    if (cleaned.length > 2) formatted += ':' + cleaned.substring(2, 4);
    setNatalTimeStr(formatted);
    if (cleaned.length === 4) {
      tDateInputRef.current?.focus();
    }
  };

  const handleTransitDateChange = (text: string) => {
    let cleaned = text.replace(/\D/g, '');
    let formatted = '';
    if (cleaned.length > 0) formatted = cleaned.substring(0, 4);
    if (cleaned.length > 4) formatted += '-' + cleaned.substring(4, 6);
    if (cleaned.length > 6) formatted += '-' + cleaned.substring(6, 8);
    setTransitDateStr(formatted);
    if (cleaned.length === 8) {
      tTimeInputRef.current?.focus();
    }
  };

  const handleTransitTimeChange = (text: string) => {
    let cleaned = text.replace(/\D/g, '');
    let formatted = '';
    if (cleaned.length > 0) formatted = cleaned.substring(0, 2);
    if (cleaned.length > 2) formatted += ':' + cleaned.substring(2, 4);
    setTransitTimeStr(formatted);
  };

  const handleCalculate = async () => {
    if (natalDateStr.length !== 10 || natalTimeStr.length !== 5) {
      Alert.alert("Eksik Bilgi", "Lütfen doğum tarihini ve saatini tam olarak giriniz.");
      return;
    }
    if (transitDateStr.length !== 10 || transitTimeStr.length !== 5) {
      Alert.alert("Eksik Bilgi", "Lütfen transit tarihini ve saatini tam olarak giriniz.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiFetch('/api/astrology/calculate-transit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          natalDate: natalDateStr,
          natalTime: natalTimeStr,
          transitDate: transitDateStr,
          transitTime: transitTimeStr,
          cityData: selectedCityData,
          transitCityData: selectedTransitCityData
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Transit hesaplaması başarısız oldu.');
      }

      setTransitData(result.data);
      fetchTimeline('1m');

      // Backend API'den 6 Aylık Güneş Tutulması Çatısı ve Kişisel Ev Portalı Çek
      if (result.data?.natalChart?.houses) {
        try {
          const natalHouses = result.data.natalChart.houses.map((h: any) => ({
            house: h.house,
            sign: h.sign
          }));
          const pRes = await apiFetch('/api/astrology/lunation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              targetDate: transitDateStr,
              natalHouses
            })
          });
          if (pRes.ok) {
            const pJson = await pRes.json();
            if (pJson && pJson.success) {
              setPersonalLunationData(pJson.data);
            }
          }
        } catch (err) {
          console.warn('Personal lunation fetch error:', err);
        }
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert("Hata", error.message || "Transitler hesaplanırken bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderBiWheel = () => {
    if (!transitData) return null;
    const chartData = transitData.natalChart;
    const ascDegree = chartData.ascendant.longitude;

    const getX = (lon: number, r: number) => CENTER + r * Math.cos((180 + ascDegree - lon) * Math.PI / 180);
    const getY = (lon: number, r: number) => CENTER + r * Math.sin((180 + ascDegree - lon) * Math.PI / 180);

    return (
      <View style={styles.chartWrapper}>
        <Svg width={CHART_SIZE} height={CHART_SIZE} viewBox={`0 0 ${CHART_SIZE} ${CHART_SIZE}`}>
          {/* Inner / Outer Circles */}
          <Circle cx={CENTER} cy={CENTER} r={R_ZODIAC_INNER} stroke="rgba(212,175,55,0.3)" strokeWidth="1.5" fill="none" />
          <Circle cx={CENTER} cy={CENTER} r={R_ZODIAC_OUTER} stroke="rgba(212,175,55,0.3)" strokeWidth="1.5" fill="none" />
          <Circle cx={CENTER} cy={CENTER} r={R_TRANSIT_PLANETS + 15} stroke="rgba(50,215,75,0.3)" strokeWidth="1" fill="none" strokeDasharray={[4, 4]} />

          {/* 12 Zodiac Sign Areas */}
          {Array.from({ length: 12 }).map((_, i) => {
            const signLon = i * 30;
            const midLon = signLon + 15;
            const signName = ZODIAC_ORDER[i];
            return (
              <G key={`zod-${i}`}>
                <Line 
                  x1={getX(signLon, R_ZODIAC_OUTER)} 
                  y1={getY(signLon, R_ZODIAC_OUTER)} 
                  x2={getX(signLon, R_ZODIAC_INNER)} 
                  y2={getY(signLon, R_ZODIAC_INNER)} 
                  stroke="rgba(212,175,55,0.3)" 
                  strokeWidth="1" 
                />
                <SvgText 
                  x={getX(midLon, RADIUS - 12)} 
                  y={getY(midLon, RADIUS - 12) + 4} 
                  fontSize="12" 
                  fill={ZODIAC_COLORS[signName]} 
                  textAnchor="middle" 
                  fontWeight="bold"
                >
                  {ZODIAC_SYMBOLS[signName]}
                </SvgText>
              </G>
            );
          })}

          {/* House Cusps Lines & Cusp Degrees */}
          {chartData.houses.map((h, i) => {
            const isAngle = h.house === 1 || h.house === 4 || h.house === 7 || h.house === 10;
            return (
              <G key={`house-line-${i}`}>
                <Line 
                  x1={getX(h.longitude, 20)} 
                  y1={getY(h.longitude, 20)} 
                  x2={getX(h.longitude, R_ZODIAC_INNER)} 
                  y2={getY(h.longitude, R_ZODIAC_INNER)} 
                  stroke={isAngle ? "#D4AF37" : "rgba(212,175,55,0.2)"} 
                  strokeWidth={isAngle ? "2" : "1"} 
                  strokeDasharray={isAngle ? undefined : [4, 4]} 
                />
                <SvgText 
                  x={getX(h.longitude, R_CUSP_NUM)} 
                  y={getY(h.longitude, R_CUSP_NUM) + 3} 
                  fontSize={isAngle ? "9" : "8"} 
                  fill={isAngle ? "#D4AF37" : COLORS.textMuted} 
                  textAnchor="middle" 
                  fontWeight={isAngle ? "bold" : "normal"}
                >
                  {`${h.house}`}
                </SvgText>
              </G>
            );
          })}

          {/* Aspect Lines between Natal Planets */}
          {chartData.aspects.filter(a => a.orb <= 5).map((a, i) => {
            const p1 = chartData.planets.find(p => p.name === a.planet1);
            const p2 = chartData.planets.find(p => p.name === a.planet2);
            if (!p1 || !p2) return null;

            let color = 'rgba(255,255,255,0.08)';
            if (a.type === 'Üçgen') color = 'rgba(50,215,75,0.4)';
            if (a.type === 'Kare' || a.type === 'Karşıt') color = 'rgba(255,69,58,0.4)';
            if (a.type === 'Sekstil') color = 'rgba(10,132,255,0.4)';

            return (
              <Line 
                key={`asp-${i}`} 
                x1={getX(p1.longitude, R_NATAL_PLANETS)} 
                y1={getY(p1.longitude, R_NATAL_PLANETS)} 
                x2={getX(p2.longitude, R_NATAL_PLANETS)} 
                y2={getY(p2.longitude, R_NATAL_PLANETS)} 
                stroke={color} 
                strokeWidth={a.isExact ? "1.5" : "0.8"} 
              />
            );
          })}

          {/* Natal Planets (Inner Circle, Gold) */}
          {chartData.planets.map((p, i) => {
            let rOffset = 0;
            for (let j = 0; j < i; j++) {
              if (Math.abs(p.longitude - chartData.planets[j].longitude) < 6) rOffset += 12;
            }
            const px = getX(p.longitude, R_NATAL_PLANETS - rOffset);
            const py = getY(p.longitude, R_NATAL_PLANETS - rOffset);
            return (
              <G key={`natal-pl-${i}`}>
                <Circle cx={px} cy={py} r="8" fill="#0F172A" stroke="#D4AF37" strokeWidth="0.8" />
                <SvgText x={px} y={py + 3} fontSize="9" fill="#D4AF37" textAnchor="middle" fontWeight="bold">
                  {PLANET_SYMBOLS[p.name] || p.name.substring(0, 2)}
                </SvgText>
              </G>
            );
          })}

          {/* Transit Planets (Outer Circle, Cyan/Blue) */}
          {transitData.transitPlanets.map((p, i) => {
            let rOffset = 0;
            for (let j = 0; j < i; j++) {
              if (Math.abs(p.longitude - transitData.transitPlanets[j].longitude) < 6) rOffset += 12;
            }
            const px = getX(p.longitude, R_TRANSIT_PLANETS + rOffset);
            const py = getY(p.longitude, R_TRANSIT_PLANETS + rOffset);
            return (
              <G key={`transit-pl-${i}`}>
                <Circle cx={px} cy={py} r="8" fill="#0F172A" stroke="#0EA5E9" strokeWidth="0.8" />
                <SvgText x={px} y={py + 3} fontSize="9" fill="#0EA5E9" textAnchor="middle" fontWeight="bold">
                  {PLANET_SYMBOLS[p.name] || p.name.substring(0, 2)}
                </SvgText>
              </G>
            );
          })}
        </Svg>
      </View>
    );
  };

  const renderCurrentSkyOverview = () => {
    if (!currentSkyOverview) return null;
    return (
      <View style={styles.guidanceCard}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <Ionicons name="sparkles" size={22} color="#0EA5E9" style={{ marginRight: 8 }} />
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text style={{ fontSize: 11.5, fontWeight: '900', color: '#0EA5E9', letterSpacing: 0.5 }}>
                GÜNÜN KOZMİK HAVA DURUMU
              </Text>
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#D1D5DB' }}>
                {currentSkyOverview.subHeadline}
              </Text>
            </View>
            <Text style={[styles.guidanceTitle, { color: '#FFF', fontSize: 18, lineHeight: 24, marginTop: 2 }]}>
              {currentSkyOverview.headline}
            </Text>
          </View>
        </View>

        <Text style={[styles.guidanceText, { color: '#E5E7EB', fontSize: 15, lineHeight: 23 }]}>
          {currentSkyOverview.vibeNarrative}
        </Text>

        {/* 3D Kozmik Frekans Barometresi */}
        <View style={{ marginTop: 16, padding: 14, backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }}>
          <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#0EA5E9', marginBottom: 12, letterSpacing: 0.5 }}>
            KOZMİK FREKANS BAROMETRESİ
          </Text>

          {/* Zihinsel */}
          <View style={{ marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
              <Text style={{ fontSize: 13.5, fontWeight: '600', color: '#E5E7EB' }}>🧠 Zihinsel Odak: {currentSkyOverview.barometer.mental.label}</Text>
              <Text style={{ fontSize: 12.5, color: '#38BDF8', fontWeight: 'bold' }}>{currentSkyOverview.barometer.mental.tone}</Text>
            </View>
            <View style={{ height: 8, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 4, overflow: 'hidden' }}>
              <View style={{ width: `${currentSkyOverview.barometer.mental.score}%`, height: '100%', backgroundColor: '#38BDF8', borderRadius: 4 }} />
            </View>
          </View>

          {/* Duygusal */}
          <View style={{ marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
              <Text style={{ fontSize: 13.5, fontWeight: '600', color: '#E5E7EB' }}>🌊 Duygusal Akış: {currentSkyOverview.barometer.emotional.label}</Text>
              <Text style={{ fontSize: 12.5, color: '#C084FC', fontWeight: 'bold' }}>{currentSkyOverview.barometer.emotional.tone}</Text>
            </View>
            <View style={{ height: 8, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 4, overflow: 'hidden' }}>
              <View style={{ width: `${currentSkyOverview.barometer.emotional.score}%`, height: '100%', backgroundColor: '#A855F7', borderRadius: 4 }} />
            </View>
          </View>

          {/* Eylem */}
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
              <Text style={{ fontSize: 13.5, fontWeight: '600', color: '#E5E7EB' }}>⚡ Eylem & Atılım: {currentSkyOverview.barometer.action.label}</Text>
              <Text style={{ fontSize: 12.5, color: '#FCD34D', fontWeight: 'bold' }}>{currentSkyOverview.barometer.action.tone}</Text>
            </View>
            <View style={{ height: 8, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 4, overflow: 'hidden' }}>
              <View style={{ width: `${currentSkyOverview.barometer.action.score}%`, height: '100%', backgroundColor: '#D4AF37', borderRadius: 4 }} />
            </View>
          </View>
        </View>

        {/* Fırsatlar & Dikkat Edilmesi Gerekenler */}
        <View style={{ marginTop: 14 }}>
          {currentSkyOverview.opportunities.length > 0 && (
            <View style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: 'rgba(16, 185, 129, 0.3)', marginBottom: 10 }}>
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#34D399', marginBottom: 6 }}>
                🌟 Bugünün Fırsatları:
              </Text>
              {currentSkyOverview.opportunities.map((item, idx) => (
                <Text key={`sko-${idx}`} style={{ fontSize: 13.5, color: '#F3F4F6', lineHeight: 20, marginBottom: 3 }}>
                  • {item}
                </Text>
              ))}
            </View>
          )}

          {currentSkyOverview.cautions.length > 0 && (
            <View style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.3)', marginBottom: 10 }}>
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#F87171', marginBottom: 6 }}>
                ⚠️ Neden Kaçınmalı?
              </Text>
              {currentSkyOverview.cautions.map((item, idx) => (
                <Text key={`skc-${idx}`} style={{ fontSize: 13.5, color: '#F3F4F6', lineHeight: 20, marginBottom: 3 }}>
                  • {item}
                </Text>
              ))}
            </View>
          )}
        </View>

        {/* Pik Yapan Kilit Açılar */}
        {currentSkyOverview.topAspects.length > 0 && (
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#D1D5DB', marginBottom: 8, letterSpacing: 0.5 }}>
              ⚡ ŞU AN GÖKYÜZÜNDE PİK YAPAN KİLİT AÇILAR
            </Text>
            {currentSkyOverview.topAspects.map((asp, idx) => (
              <TouchableOpacity
                key={`skap-${idx}`}
                activeOpacity={0.7}
                onPress={() => setSelectedInterp({
                  title: `${asp.p1} - ${asp.p2} (${asp.aspectType})`,
                  content: `${asp.summary}\n\nTolerans: ${asp.orb.toFixed(1)}° (${asp.badge})`
                })}
                style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: 11, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', marginBottom: 8 }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <Text style={{ fontSize: 14.5, fontWeight: 'bold', color: asp.isHarmonious ? '#34D399' : '#FBBF24' }}>
                    {asp.p1} {asp.aspectType} {asp.p2}
                  </Text>
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#38BDF8' }}>
                    {asp.badge}
                  </Text>
                </View>
                <Text style={{ fontSize: 13, color: '#E5E7EB', lineHeight: 18 }}>
                  {asp.summary}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* 13 Gezegen Detayına Geçiş Butonu */}
        <TouchableOpacity
          onPress={() => setSkyViewMode('SYNTHESIS')}
          style={{ marginTop: 14, backgroundColor: 'rgba(14, 165, 233, 0.18)', borderWidth: 1.2, borderColor: '#0EA5E9', borderRadius: 12, paddingVertical: 12, alignItems: 'center' }}
        >
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#38BDF8' }}>
            Tüm Gezegenlerin (13 Cismin) Detaylı Kartlarını Gör →
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderUnifiedSkyPlanets = () => {
    return (
      <View style={{ marginTop: 10 }}>
        {/* Header bar */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, paddingHorizontal: 4 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#FFF' }}>13 Gezegenin Bütünleşik Konumları</Text>
          <TouchableOpacity onPress={() => setSkyViewMode('OVERVIEW')} style={{ flexDirection: 'row', alignItems: 'center', padding: 4 }}>
            <Ionicons name="arrow-back" size={16} color="#D4AF37" style={{ marginRight: 4 }} />
            <Text style={{ fontSize: 13.5, fontWeight: 'bold', color: '#D4AF37' }}>Sade Özete Dön</Text>
          </TouchableOpacity>
        </View>

        {unifiedSkyPlanets.map((sp, idx) => (
          <View
            key={`usp-${idx}`}
            style={{
              backgroundColor: 'rgba(20,20,25,0.75)',
              borderRadius: 18,
              padding: 16,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.08)',
              marginBottom: 14,
            }}
          >
            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)', paddingBottom: 12, marginBottom: 12 }}>
              <Text style={{ fontSize: 28, width: 38, textAlign: 'center', color: '#0EA5E9', fontWeight: 'bold', marginRight: 10 }}>
                {PLANET_SYMBOLS[sp.planetName] || '★'}
              </Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16.5, fontWeight: 'bold', color: '#FFF', lineHeight: 22 }}>
                  {sp.humanThemeTitle}
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                  <View style={{ backgroundColor: 'rgba(212,175,55,0.12)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(212,175,55,0.35)' }}>
                    <Text style={{ fontSize: 12, color: '#D4AF37', fontWeight: 'bold' }}>
                      {sp.planetName} ({ZODIAC_SYMBOLS[sp.sign] || ''} {sp.sign} {sp.degreeInSign}°)
                    </Text>
                  </View>
                  <View style={{ backgroundColor: 'rgba(255,255,255,0.06)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' }}>
                    <Text style={{ fontSize: 12, color: '#D1D5DB' }}>{sp.ingressPhase.badge}</Text>
                  </View>
                  {sp.hdGateInfo && (
                    <View style={{ backgroundColor: 'rgba(52,211,153,0.12)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(52,211,153,0.35)' }}>
                      <Text style={{ fontSize: 12, color: '#34D399', fontWeight: '600' }}>
                        🧬 Kapı {sp.hdGateInfo.gate}: {sp.hdGateInfo.title}
                      </Text>
                    </View>
                  )}
                  {sp.minOrb !== undefined ? (
                    <View style={{ backgroundColor: sp.minOrb <= 1.0 ? 'rgba(52,211,153,0.18)' : 'rgba(14,165,233,0.18)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, borderWidth: 1, borderColor: sp.minOrb <= 1.0 ? '#34D399' : '#0EA5E9' }}>
                      <Text style={{ fontSize: 12, color: sp.minOrb <= 1.0 ? '#34D399' : '#38BDF8', fontWeight: 'bold' }}>
                        ★ Orb: {sp.minOrb.toFixed(1)}° {sp.minOrb <= 1.0 ? '(Pik)' : ''}
                      </Text>
                    </View>
                  ) : (
                    <View style={{ backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 }}>
                      <Text style={{ fontSize: 11.5, color: '#9CA3AF' }}>Majör Açı Yok</Text>
                    </View>
                  )}
                  {sp.isRetrograde && (
                    <View style={{ backgroundColor: 'rgba(239,68,68,0.18)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, borderWidth: 1, borderColor: '#EF4444' }}>
                      <Text style={{ fontSize: 12, color: '#F87171', fontWeight: 'bold' }}>Rx Retro</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* Narrative Box */}
            <View style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' }}>
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#38BDF8', marginBottom: 6, letterSpacing: 0.5 }}>
                7LAYERS YAŞAM ALANI ÖZETİ
              </Text>
              <Text style={{ fontSize: 14, color: '#E5E7EB', lineHeight: 21 }}>
                {sp.humanNarrative}
              </Text>
              {sp.hdGateInfo && (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)' }}>
                  <Text style={{ fontSize: 12.5, color: '#F87171' }}>▲ Gölge: {sp.hdGateInfo.shadow}</Text>
                  <Text style={{ fontSize: 12.5, color: '#9CA3AF' }}>➔</Text>
                  <Text style={{ fontSize: 12.5, color: '#34D399', fontWeight: '600' }}>✨ Hediye: {sp.hdGateInfo.gift}</Text>
                </View>
              )}
            </View>

            {/* Active Aspects */}
            {sp.aspects.length > 0 && (
              <View style={{ marginTop: 6 }}>
                <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#D1D5DB', marginBottom: 6 }}>
                  EŞZAMANLI AÇILAR:
                </Text>
                {sp.aspects.map((asp, aIdx) => (
                  <TouchableOpacity
                    key={`usp-asp-${aIdx}`}
                    activeOpacity={0.7}
                    onPress={() => setSelectedInterp({
                      title: `${sp.planetName} - ${asp.targetPlanet} (${asp.aspectType})`,
                      content: `${asp.summary}\n\nTolerans: ${asp.orb.toFixed(1)}° (${asp.orbStrength || 'Aktif'})`
                    })}
                    style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.35)', padding: 9, borderRadius: 8, marginBottom: 5 }}
                  >
                    <Text style={{ fontSize: 13, color: asp.isHarmonious ? '#34D399' : '#FBBF24', fontWeight: 'bold' }}>
                      {asp.aspectType} {asp.targetPlanet}
                    </Text>
                    <Text style={{ fontSize: 12, color: '#9CA3AF' }}>
                      Orb: {asp.orb.toFixed(1)}°
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Daily Advice */}
            {sp.dailyAdvice && (
              <View style={{ marginTop: 8, padding: 10, backgroundColor: 'rgba(212,175,55,0.08)', borderRadius: 10, borderWidth: 1, borderColor: 'rgba(212,175,55,0.25)' }}>
                <Text style={{ fontSize: 13, color: '#FDE68A', lineHeight: 19 }}>
                  <Text style={{ fontWeight: 'bold', color: '#D4AF37' }}>Tavsiye: </Text>
                  {sp.dailyAdvice}
                </Text>
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderPersonalTransitOverview = () => {
    if (!personalOverview) return null;
    return (
      <View style={styles.guidanceCard}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <Ionicons name="sparkles" size={22} color={COLORS.primary} style={{ marginRight: 8 }} />
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text style={{ fontSize: 11.5, fontWeight: '900', color: COLORS.secondary, letterSpacing: 0.5 }}>
                BÜTÜNLEŞİK KİŞİSEL TRANSİT ANALİZİ
              </Text>
              <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.primary }}>
                {personalOverview.subHeadline}
              </Text>
            </View>
            <Text style={[styles.guidanceTitle, { fontSize: 18, lineHeight: 24, marginTop: 2 }]}>{personalOverview.headline}</Text>
          </View>
        </View>

        <Text style={[styles.guidanceText, { color: '#E5E7EB', fontSize: 15, lineHeight: 23 }]}>{personalOverview.themeDescription}</Text>

        {/* Bugünün Odak Yaşam Alanları */}
        {personalOverview.focusHouses.length > 0 && (
          <View style={{ marginTop: 14, padding: 14, backgroundColor: 'rgba(0,0,0,0.35)', borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }}>
            <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#38BDF8', marginBottom: 10, letterSpacing: 0.5 }}>
              BUGÜNÜN ODAK YAŞAM ALANLARI
            </Text>
            {personalOverview.focusHouses.map((fh, idx) => (
              <View key={`pfh-${idx}`} style={{ marginBottom: 8, paddingBottom: 8, borderBottomWidth: idx < personalOverview.focusHouses.length - 1 ? 1 : 0, borderBottomColor: 'rgba(255,255,255,0.06)' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#FFF' }}>{fh.title}</Text>
                  <Text style={{ fontSize: 12, color: '#D4AF37', fontWeight: 'bold' }}>{fh.planetNames.join(', ')}</Text>
                </View>
                <Text style={{ fontSize: 13, color: '#D1D5DB', marginTop: 3, lineHeight: 18 }}>{fh.description}</Text>
              </View>
            ))}
          </View>
        )}

        {/* 3 Boyutlu Kişisel Enerji Barometresi */}
        <View style={{ marginTop: 16, padding: 14, backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }}>
          <Text style={{ fontSize: 13, fontWeight: 'bold', color: COLORS.primary, marginBottom: 12, letterSpacing: 0.5 }}>
            KİŞİSEL ENERJİ & AKIŞ BAROMETRESİ
          </Text>

          {/* Zihinsel */}
          <View style={{ marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
              <Text style={{ fontSize: 13.5, fontWeight: '600', color: '#E5E7EB' }}>Zihinsel Netlik: {personalOverview.barometer.mental.label}</Text>
              <Text style={{ fontSize: 12.5, color: '#38BDF8', fontWeight: 'bold' }}>{personalOverview.barometer.mental.tone} (%{personalOverview.barometer.mental.score})</Text>
            </View>
            <View style={{ height: 8, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 4, overflow: 'hidden' }}>
              <View style={{ width: `${personalOverview.barometer.mental.score}%`, height: '100%', backgroundColor: '#38BDF8', borderRadius: 4 }} />
            </View>
          </View>

          {/* Duygusal */}
          <View style={{ marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
              <Text style={{ fontSize: 13.5, fontWeight: '600', color: '#E5E7EB' }}>Duygusal Denge: {personalOverview.barometer.emotional.label}</Text>
              <Text style={{ fontSize: 12.5, color: '#34D399', fontWeight: 'bold' }}>{personalOverview.barometer.emotional.tone} (%{personalOverview.barometer.emotional.score})</Text>
            </View>
            <View style={{ height: 8, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 4, overflow: 'hidden' }}>
              <View style={{ width: `${personalOverview.barometer.emotional.score}%`, height: '100%', backgroundColor: '#34D399', borderRadius: 4 }} />
            </View>
          </View>

          {/* Eylem */}
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
              <Text style={{ fontSize: 13.5, fontWeight: '600', color: '#E5E7EB' }}>Eylem & İlerleme: {personalOverview.barometer.action.label}</Text>
              <Text style={{ fontSize: 12.5, color: '#FCD34D', fontWeight: 'bold' }}>{personalOverview.barometer.action.tone} (%{personalOverview.barometer.action.score})</Text>
            </View>
            <View style={{ height: 8, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 4, overflow: 'hidden' }}>
              <View style={{ width: `${personalOverview.barometer.action.score}%`, height: '100%', backgroundColor: '#FBBF24', borderRadius: 4 }} />
            </View>
          </View>
        </View>

        {/* Fırsatlar & Sınavlar */}
        <View style={{ marginTop: 14 }}>
          {personalOverview.opportunities.length > 0 && (
            <View style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: 'rgba(16, 185, 129, 0.3)', marginBottom: 10 }}>
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#34D399', marginBottom: 6 }}>
                🌟 Bugün Sizin İçin Fırsatlar & Destekler:
              </Text>
              {personalOverview.opportunities.map((opp, idx) => (
                <Text key={`popp-${idx}`} style={{ fontSize: 13.5, color: '#F3F4F6', lineHeight: 20, marginBottom: 3 }}>
                  • {opp}
                </Text>
              ))}
            </View>
          )}

          {personalOverview.cautions.length > 0 && (
            <View style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.3)', marginBottom: 10 }}>
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#F87171', marginBottom: 6 }}>
                ⚠️ Dikkat Edilmesi Gereken Sınavlar:
              </Text>
              {personalOverview.cautions.map((cau, idx) => (
                <Text key={`pcau-${idx}`} style={{ fontSize: 13.5, color: '#F3F4F6', lineHeight: 20, marginBottom: 3 }}>
                  • {cau}
                </Text>
              ))}
            </View>
          )}
        </View>

        {/* En Etkin Kişisel Tetikleyiciler (Pik Transitler) */}
        {personalOverview.topAspects.length > 0 && (
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#D1D5DB', marginBottom: 8, letterSpacing: 0.5 }}>
              ⚡ EN ETKİN KİŞİSEL TETİKLEYİCİLER (PİK TRANSİTLER)
            </Text>
            {personalOverview.topAspects.map((asp, idx) => (
              <TouchableOpacity
                key={`ptap-${idx}`}
                activeOpacity={0.7}
                onPress={() => setSelectedInterp({
                  title: `T.${asp.transitPlanet} ${asp.aspectType} N.${asp.natalPlanet}`,
                  content: `${asp.summary}\n\nTolerans: ${asp.orb.toFixed(1)}° (${asp.badge})\nT: ${asp.transitSign} ${asp.transitDegree}° ➔ N: ${asp.natalSign} ${asp.natalDegree}° (${asp.natalHouse}. Evinizde)`
                })}
                style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: 11, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', marginBottom: 8 }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <Text style={{ fontSize: 14.5, fontWeight: 'bold', color: '#FFF' }}>
                    T.{asp.transitPlanet} {asp.aspectType} N.{asp.natalPlanet}
                  </Text>
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: COLORS.secondary }}>
                    {asp.badge}
                  </Text>
                </View>
                <Text style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 4 }}>
                  T: {asp.transitSign} {asp.transitDegree}° ➔ N: {asp.natalSign} {asp.natalDegree}° ({asp.natalHouse}. Evinizde)
                </Text>
                <Text style={{ fontSize: 13, color: '#E5E7EB', lineHeight: 18 }}>
                  {asp.summary}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Günün Yaşam Reçetesi & Gezegen Kartları Butonu */}
        <View style={{ marginTop: 12, padding: 12, backgroundColor: 'rgba(212, 175, 55, 0.1)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.3)' }}>
          <Text style={{ fontSize: 13.5, color: '#FDE68A', lineHeight: 20 }}>
            <Text style={{ fontWeight: 'bold', color: COLORS.primary }}>Günün Yaşam Reçetesi: </Text>
            {personalOverview.lifeAdvice}
          </Text>
          <TouchableOpacity
            onPress={() => setPersonalViewMode('PLANETS')}
            style={{ marginTop: 10, alignSelf: 'flex-end', padding: 4 }}
          >
            <Text style={{ fontSize: 13.5, fontWeight: 'bold', color: '#38BDF8' }}>
              10 Gezegen Kartını Gör →
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderUnifiedPersonalPlanets = () => {
    return (
      <View style={{ marginTop: 10 }}>
        {/* Header Bar */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, paddingHorizontal: 4 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#FFF' }}>10 Kişisel Gezegen Kartı</Text>
          <TouchableOpacity onPress={() => setPersonalViewMode('OVERVIEW')} style={{ flexDirection: 'row', alignItems: 'center', padding: 4 }}>
            <Ionicons name="arrow-back" size={16} color={COLORS.primary} style={{ marginRight: 4 }} />
            <Text style={{ fontSize: 13.5, fontWeight: 'bold', color: COLORS.primary }}>Sade Özete Dön</Text>
          </TouchableOpacity>
        </View>

        {unifiedPersonalPlanets.map((ut, idx) => (
          <View
            key={`upt-${idx}`}
            style={{
              backgroundColor: 'rgba(20,20,25,0.75)',
              borderRadius: 18,
              padding: 16,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.08)',
              marginBottom: 14,
            }}
          >
            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)', paddingBottom: 12, marginBottom: 12 }}>
              <Text style={{ fontSize: 28, width: 38, textAlign: 'center', color: '#0EA5E9', fontWeight: 'bold', marginRight: 10 }}>
                {PLANET_SYMBOLS[ut.planetName] || '★'}
              </Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16.5, fontWeight: 'bold', color: '#FFF', lineHeight: 22 }}>
                  {ut.humanThemeTitle}
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                  <View style={{ backgroundColor: 'rgba(212,175,55,0.12)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(212,175,55,0.35)' }}>
                    <Text style={{ fontSize: 12, color: '#D4AF37', fontWeight: 'bold' }}>
                      {ut.planetName} ({ZODIAC_SYMBOLS[ut.sign] || ''} {ut.sign} {ut.degreeInSign}°)
                    </Text>
                  </View>
                  <View style={{ backgroundColor: 'rgba(14,165,233,0.12)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(14,165,233,0.35)' }}>
                    <Text style={{ fontSize: 12, color: '#38BDF8', fontWeight: 'bold' }}>
                      🏠 {ut.houseTitle.split(':')[1]?.trim() || ut.houseTitle}
                    </Text>
                  </View>
                  {ut.hdGateInfo && (
                    <View style={{ backgroundColor: 'rgba(52,211,153,0.12)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(52,211,153,0.35)' }}>
                      <Text style={{ fontSize: 12, color: '#34D399', fontWeight: '600' }}>
                        🧬 Kapı {ut.hdGateInfo.gate}: {ut.hdGateInfo.title}
                      </Text>
                    </View>
                  )}
                  {ut.isRetrograde && (
                    <View style={{ backgroundColor: 'rgba(239,68,68,0.18)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, borderWidth: 1, borderColor: '#EF4444' }}>
                      <Text style={{ fontSize: 12, color: '#F87171', fontWeight: 'bold' }}>Rx Retro</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* Narrative Box */}
            <View style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' }}>
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#38BDF8', marginBottom: 6, letterSpacing: 0.5 }}>
                7LAYERS YAŞAM ALANI ÖZETİ
              </Text>
              <Text style={{ fontSize: 14, color: '#E5E7EB', lineHeight: 21 }}>
                {ut.humanNarrative}
              </Text>
              {ut.hdGateInfo && (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)' }}>
                  <Text style={{ fontSize: 12.5, color: '#F87171' }}>▲ Gölge: {ut.hdGateInfo.shadow}</Text>
                  <Text style={{ fontSize: 12.5, color: '#9CA3AF' }}>➔</Text>
                  <Text style={{ fontSize: 12.5, color: '#34D399', fontWeight: '600' }}>✨ Hediye: {ut.hdGateInfo.gift}</Text>
                </View>
              )}
            </View>

            {/* Active Natal Aspects */}
            {ut.aspects.length > 0 ? (
              <View style={{ marginTop: 6 }}>
                <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#D1D5DB', marginBottom: 6 }}>
                  EŞZAMANLI NATAL AÇILAR:
                </Text>
                {ut.aspects.map((asp, aIdx) => (
                  <TouchableOpacity
                    key={`upt-asp-${aIdx}`}
                    activeOpacity={0.7}
                    onPress={() => setSelectedInterp({
                      title: `T.${ut.planetName} - N.${asp.natalPlanet} (${asp.aspectType})`,
                      content: `${asp.summary}\n\nTolerans: ${asp.orb.toFixed(1)}°${asp.natalHouse ? ` (${asp.natalHouse}. Ev)` : ''}`
                    })}
                    style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.35)', padding: 9, borderRadius: 8, marginBottom: 5 }}
                  >
                    <Text style={{ fontSize: 13, color: asp.isHarmonious ? '#34D399' : '#FBBF24', fontWeight: 'bold' }}>
                      {asp.aspectType} Natal {asp.natalPlanet} {asp.natalHouse ? `[${asp.natalHouse}. Ev]` : ''}
                    </Text>
                    <Text style={{ fontSize: 12, color: '#9CA3AF' }}>
                      Orb: {asp.orb.toFixed(1)}°
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: 8, borderRadius: 8 }}>
                <Text style={{ fontSize: 12, color: '#9CA3AF', fontStyle: 'italic' }}>
                  Şu anda doğrudan majör bir natal gezegene açı yapmıyor; {ut.house}. evinizin genel atmosferini dönüştürüyor.
                </Text>
              </View>
            )}

            {/* Action Advice */}
            {ut.actionAdvice && (
              <View style={{ marginTop: 8, padding: 10, backgroundColor: 'rgba(212,175,55,0.08)', borderRadius: 10, borderWidth: 1, borderColor: 'rgba(212,175,55,0.25)' }}>
                <Text style={{ fontSize: 13, color: '#FDE68A', lineHeight: 19 }}>
                  <Text style={{ fontWeight: 'bold', color: '#D4AF37' }}>Eylem Tavsiyesi: </Text>
                  {ut.actionAdvice}
                </Text>
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <SacredBackground>

        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <TouchableOpacity 
              style={{ position: 'absolute', left: 0, top: 2, padding: 5 }} 
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={28} color={COLORS.primary} />
            </TouchableOpacity>
            <Text style={styles.title}>Anlık Gökyüzü</Text>
            <Text style={styles.subtitle}>Gezegenlerin Anlık Etkileri (Transit)</Text>
          </View>

          {/* Mode Switcher: Kişisel Transitler vs Kolektif Gökyüzü */}
          <View style={styles.modeSwitchContainer}>
            <TouchableOpacity
              onPress={() => setAnalysisMode('PERSONAL')}
              style={[styles.modeSwitchBtn, analysisMode === 'PERSONAL' && styles.modeSwitchBtnActive]}
            >
              <Ionicons name="person" size={13} color={analysisMode === 'PERSONAL' ? '#000' : '#D4AF37'} style={{ marginRight: 5 }} />
              <Text style={[styles.modeSwitchText, analysisMode === 'PERSONAL' && styles.modeSwitchTextActive]}>
                Kişisel Transitler
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setAnalysisMode('MUNDANE');
                if (!skyChartData && !isSkyChartLoading) {
                  fetchSkyChart();
                }
                if (!skyTimelineData && !isSkyTimelineLoading) {
                  fetchSkyTimeline(skyTimelineRange);
                }
              }}
              style={[styles.modeSwitchBtn, analysisMode === 'MUNDANE' && styles.modeSwitchBtnActive]}
            >
              <Ionicons name="globe-outline" size={13} color={analysisMode === 'MUNDANE' ? '#000' : '#0EA5E9'} style={{ marginRight: 5 }} />
              <Text style={[styles.modeSwitchText, analysisMode === 'MUNDANE' && styles.modeSwitchTextActive]}>
                Kolektif Gökyüzü
              </Text>
            </TouchableOpacity>
          </View>

          {analysisMode === 'MUNDANE' ? (
            <View style={{ marginTop: 6 }}>
              {/* Mundane Sub-Tab Switcher: Çark vs Zaman Çizelgesi */}
              <View style={styles.tabSelector}>
                <TouchableOpacity
                  onPress={() => {
                    setSkySubTab('WHEEL');
                    if (!skyChartData && !isSkyChartLoading) {
                      fetchSkyChart();
                    }
                  }}
                  style={[styles.tabBtn, skySubTab === 'WHEEL' && { backgroundColor: '#0EA5E9' }]}
                >
                  <Ionicons name="compass-outline" size={14} color={skySubTab === 'WHEEL' ? '#000' : '#0EA5E9'} style={{ marginRight: 5 }} />
                  <Text style={[styles.tabBtnText, skySubTab === 'WHEEL' && { color: '#000' }]}>
                    Gökyüzü Çarkı & Açıları
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setSkySubTab('TIMELINE');
                    if (!skyTimelineData && !isSkyTimelineLoading) {
                      fetchSkyTimeline(skyTimelineRange);
                    }
                  }}
                  style={[styles.tabBtn, skySubTab === 'TIMELINE' && { backgroundColor: '#0EA5E9' }]}
                >
                  <Ionicons name="calendar-outline" size={14} color={skySubTab === 'TIMELINE' ? '#000' : '#0EA5E9'} style={{ marginRight: 5 }} />
                  <Text style={[styles.tabBtnText, skySubTab === 'TIMELINE' && { color: '#000' }]}>
                    Kozmik Zaman Çizelgesi
                  </Text>
                </TouchableOpacity>
              </View>

              {skySubTab === 'WHEEL' ? (
                isSkyChartLoading && !skyChartData ? (
                  <View style={{ padding: 40, alignItems: 'center', backgroundColor: 'rgba(20,20,25,0.7)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', marginTop: 10 }}>
                    <ActivityIndicator size="large" color="#0EA5E9" style={{ marginBottom: 12 }} />
                    <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 14, marginBottom: 4 }}>
                      Kolektif Gökyüzü Taranıyor...
                    </Text>
                    <Text style={{ color: '#9CA3AF', fontSize: 11, textAlign: 'center' }}>
                      Gezegenlerin burç dereceleri ve aralarındaki anlık açılar taranıyor.
                    </Text>
                  </View>
                ) : (
                  <View>
                    {/* ☀️ Kolektif Aktif Ay Fazı & 6 Aylık Güneş Tutulması Çatısı */}
                    {mundaneLunationData && (
                      <MobileLunationCard data={mundaneLunationData} isCompact={true} />
                    )}

                    {/* Sky Date Toolbar */}
                    <View style={styles.skyDateToolbar}>
                      <View style={styles.skyDateBadge}>
                        <Ionicons name="time-outline" size={15} color="#0EA5E9" />
                        <Text style={styles.skyDateText}>
                          {transitDateStr.split('-').reverse().join('.')} {transitTimeStr} (Canlı Gökyüzü)
                        </Text>
                      </View>
                      <TouchableOpacity 
                        style={styles.refreshSkyBtn}
                        onPress={() => fetchSkyChart()}
                        disabled={isSkyChartLoading}
                      >
                        {isSkyChartLoading ? (
                          <ActivityIndicator size="small" color="#0EA5E9" />
                        ) : (
                          <>
                            <Ionicons name="refresh" size={13} color="#0EA5E9" />
                            <Text style={styles.refreshSkyBtnText}>Yenile</Text>
                          </>
                        )}
                      </TouchableOpacity>
                    </View>

                    {/* Mobile Mundane Sky Wheel */}
                    <MobileMundaneSkyWheel
                      planets={skyChartData?.planets || []}
                      aspects={skyChartData?.aspects || []}
                      ascendant={skyChartData?.ascendant}
                      onSelectPlanet={(p) => {
                        const pDeg = Math.floor(p.degreeInSign ?? (p as any).degree ?? 0);
                        const pMin = (p.minutes !== undefined && !isNaN(p.minutes))
                          ? Math.round(Number(p.minutes))
                          : Math.floor(((p.degreeInSign ?? 0) - pDeg) * 60);
                        const interp = getSkyPlanetSignInterpretation(p.name, p.sign, pDeg, pMin, p.isRetrograde);
                        setSelectedInterp({
                          title: interp.title,
                          content: interp.content + (interp.extra ? `\n\n【Kozmik Rezonans】\n${interp.extra}` : '')
                        });
                      }}
                      onSelectAspect={(asp) => {
                        if ((asp as any).interpretation) {
                          const interp = (asp as any).interpretation;
                          setSelectedInterp({
                            title: interp.title,
                            content: `${interp.summary}\n\n【Kolektif Tema】\n${interp.collectiveTheme}\n\n【Günün Tavsiyesi】\n${interp.dailyAdvice}\n\n【Çakra Rezonansı】\n${interp.chakraResonance}`
                          });
                        } else {
                          const calcInterp = getSkyAspectInterpretation(asp.planet1, asp.planet2, asp.type);
                          setSelectedInterp({
                            title: calcInterp.title,
                            content: `${calcInterp.summary}\n\n【Kolektif Tema】\n${calcInterp.collectiveTheme}\n\n【Günün Tavsiyesi】\n${calcInterp.dailyAdvice}\n\n【Çakra Rezonansı】\n${calcInterp.chakraResonance}`
                          });
                        }
                      }}
                    />

                    {/* Mundane 3-View Switcher: Günün Özeti | 13 Gezegen | Açı Listesi */}
                    <View style={styles.subViewSwitcher}>
                      <TouchableOpacity
                        onPress={() => setSkyViewMode('OVERVIEW')}
                        style={[styles.subViewBtn, skyViewMode === 'OVERVIEW' && styles.subViewBtnActiveCyan]}
                      >
                        <Ionicons name="sparkles" size={13} color={skyViewMode === 'OVERVIEW' ? '#000' : '#0EA5E9'} style={{ marginRight: 4 }} />
                        <Text style={[styles.subViewBtnText, skyViewMode === 'OVERVIEW' && styles.subViewBtnTextActive]}>
                          Günün Özeti
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => setSkyViewMode('SYNTHESIS')}
                        style={[styles.subViewBtn, skyViewMode === 'SYNTHESIS' && styles.subViewBtnActiveCyan]}
                      >
                        <Ionicons name="planet-outline" size={13} color={skyViewMode === 'SYNTHESIS' ? '#000' : '#0EA5E9'} style={{ marginRight: 4 }} />
                        <Text style={[styles.subViewBtnText, skyViewMode === 'SYNTHESIS' && styles.subViewBtnTextActive]}>
                          13 Gezegen
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => setSkyViewMode('LIST')}
                        style={[styles.subViewBtn, skyViewMode === 'LIST' && styles.subViewBtnActiveCyan]}
                      >
                        <Ionicons name="list" size={13} color={skyViewMode === 'LIST' ? '#000' : '#0EA5E9'} style={{ marginRight: 4 }} />
                        <Text style={[styles.subViewBtnText, skyViewMode === 'LIST' && styles.subViewBtnTextActive]}>
                          Açı Listesi
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {skyViewMode === 'OVERVIEW' && renderCurrentSkyOverview()}
                    {skyViewMode === 'SYNTHESIS' && renderUnifiedSkyPlanets()}
                    {skyViewMode === 'LIST' && (
                      <>
                        {/* Section 1: Anlık Gezegen Yerleşimleri */}
                    <TouchableOpacity 
                      style={styles.listSectionHeader}
                      activeOpacity={0.7}
                      onPress={() => setIsMundanePlanetsExpanded(!isMundanePlanetsExpanded)}
                    >
                      <Text style={[styles.listSectionTitle, { color: '#0EA5E9' }]}>Anlık Gezegen Yerleşimleri (Gökyüzü)</Text>
                      <Ionicons name={isMundanePlanetsExpanded ? "chevron-up" : "chevron-down"} size={20} color="#0EA5E9" />
                    </TouchableOpacity>

                    {isMundanePlanetsExpanded && (
                      <View style={styles.listCard}>
                        {(skyChartData?.planets || []).filter((p: any) => ['Güneş', 'Ay', 'Merkür', 'Venüs', 'Mars', 'Jüpiter', 'Satürn', 'Uranüs', 'Neptün', 'Plüton', 'Kiron'].includes(p.name)).map((p: any, i: number) => {
                          const pDeg = Math.floor(p.degreeInSign ?? p.degree ?? 0);
                          const pMin = (p.minutes !== undefined && !isNaN(p.minutes))
                            ? Math.round(Number(p.minutes))
                            : Math.floor(((p.degreeInSign ?? 0) - pDeg) * 60);

                          return (
                            <TouchableOpacity 
                              key={`mpl-${i}`} 
                              style={styles.listRow}
                              activeOpacity={0.7}
                              onPress={() => {
                                const interp = getSkyPlanetSignInterpretation(p.name, p.sign, pDeg, pMin, p.isRetrograde);
                                setSelectedInterp({
                                  title: interp.title,
                                  content: interp.content + (interp.extra ? `\n\n【Kozmik Rezonans】\n${interp.extra}` : '')
                                });
                              }}
                            >
                              <View style={styles.listRowLeft}>
                                <Text style={[styles.planetSymbolIcon, { color: '#0EA5E9' }]}>{PLANET_SYMBOLS[p.name] || '★'}</Text>
                                <Text style={styles.listRowMain}>{p.name}</Text>
                              </View>

                              <View style={styles.listRowMiddle}>
                                <Text style={{ fontSize: 13, fontWeight: 'bold', color: ZODIAC_COLORS[p.sign] || '#FFF' }}>
                                  {p.sign}
                                </Text>
                              </View>

                              <View style={[styles.listRowRight, { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }]}>
                                <Text style={{ fontSize: 12, color: COLORS.textMuted }}>
                                  {`${pDeg}° ${String(pMin).padStart(2, '0')}'`}
                                </Text>
                                {p.isRetrograde && (
                                  <Text style={{ fontSize: 11, color: '#FF453A', fontWeight: 'bold', marginLeft: 4 }}>
                                    Rx
                                  </Text>
                                )}
                                <Ionicons name="chevron-forward" size={14} color="#666" style={{ marginLeft: 6 }} />
                              </View>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    )}

                    {/* Section 2: Kolektif Açılar Tablosu */}
                    {(() => {
                      const filteredAspects = (skyChartData?.aspects || []).filter((asp: any) => {
                        if (skyAspectFilter === 'ALL') return true;
                        if (skyAspectFilter === 'HARMONIOUS') return asp.type === 'Üçgen' || asp.type === 'Sekstil';
                        if (skyAspectFilter === 'CHALLENGING') return asp.type === 'Kare' || asp.type === 'Karşıt';
                        if (skyAspectFilter === 'CONJUNCTION') return asp.type === 'Kavuşum';
                        return true;
                      });

                      return (
                        <>
                          <TouchableOpacity 
                            style={styles.listSectionHeader}
                            activeOpacity={0.7}
                            onPress={() => setIsMundaneAspectsExpanded(!isMundaneAspectsExpanded)}
                          >
                            <Text style={[styles.listSectionTitle, { color: '#0EA5E9' }]}>
                              Kolektif Gökyüzü Açıları ({filteredAspects.length})
                            </Text>
                            <Ionicons name={isMundaneAspectsExpanded ? "chevron-up" : "chevron-down"} size={20} color="#0EA5E9" />
                          </TouchableOpacity>

                          {isMundaneAspectsExpanded && (
                            <View style={styles.listCard}>
                              {/* Aspect Filter Chips */}
                              <View style={styles.filterChipsRow}>
                                {[
                                  { id: 'ALL', label: 'Tümü' },
                                  { id: 'HARMONIOUS', label: 'Uyumlu' },
                                  { id: 'CHALLENGING', label: 'Zorlayıcı' },
                                  { id: 'CONJUNCTION', label: 'Kavuşum' }
                                ].map(f => (
                                  <TouchableOpacity
                                    key={f.id}
                                    onPress={() => setSkyAspectFilter(f.id as any)}
                                    style={[styles.filterChip, skyAspectFilter === f.id && styles.filterChipActive]}
                                  >
                                    <Text style={[styles.filterChipText, skyAspectFilter === f.id && styles.filterChipTextActive]}>
                                      {f.label}
                                    </Text>
                                  </TouchableOpacity>
                                ))}
                              </View>

                              {filteredAspects.length === 0 ? (
                                <Text style={styles.emptyText}>Bu filtreye uygun aktif açı bulunamadı.</Text>
                              ) : (
                                filteredAspects.map((aspect: any, i: number) => (
                                  <TouchableOpacity 
                                    key={`masp-${i}`} 
                                    style={styles.listRow}
                                    activeOpacity={0.7}
                                    onPress={() => {
                                      if (aspect.interpretation) {
                                        const interp = aspect.interpretation;
                                        setSelectedInterp({
                                          title: interp.title,
                                          content: `${interp.summary}\n\n【Kolektif Tema】\n${interp.collectiveTheme}\n\n【Günün Tavsiyesi】\n${interp.dailyAdvice}\n\n【Çakra Rezonansı】\n${interp.chakraResonance}`
                                        });
                                      } else {
                                        const calcInterp = getSkyAspectInterpretation(aspect.planet1, aspect.planet2, aspect.type);
                                        setSelectedInterp({
                                          title: calcInterp.title,
                                          content: `${calcInterp.summary}\n\n【Kolektif Tema】\n${calcInterp.collectiveTheme}\n\n【Günün Tavsiyesi】\n${calcInterp.dailyAdvice}\n\n【Çakra Rezonansı】\n${calcInterp.chakraResonance}`
                                        });
                                      }
                                    }}
                                  >
                                    <View style={styles.listRowLeft}>
                                      <Text style={[styles.planetSymbolIcon, { color: '#0EA5E9' }]}>{PLANET_SYMBOLS[aspect.planet1] || '★'}</Text>
                                      <Text style={styles.listRowMain}>{aspect.planet1}</Text>
                                    </View>

                                    <View style={[styles.listRowMiddle, { flexDirection: 'column', alignItems: 'center' }]}>
                                      <Text style={[styles.aspectBadge, { color: ASPECT_COLORS[aspect.type] || '#FFF' }]}>
                                        {ASPECT_SYMBOLS[aspect.type] || ''} {aspect.type}
                                      </Text>
                                      <Text style={{ fontSize: 10, color: aspect.orb <= 1.0 ? '#32D74B' : aspect.orb <= 2.5 ? '#0EA5E9' : COLORS.textMuted, fontWeight: aspect.orb <= 1.0 ? 'bold' : 'normal' }}>
                                        Orb: {aspect.orb.toFixed(1)}° {aspect.orb <= 1.0 ? '★ Pik' : aspect.orb <= 2.5 ? '• Aktif' : ''}
                                      </Text>
                                    </View>

                                    <View style={[styles.listRowRight, { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }]}>
                                      <Text style={[styles.listRowMain, { marginRight: 6 }]}>{aspect.planet2}</Text>
                                      <Text style={[styles.planetSymbolIcon, { color: '#0EA5E9' }]}>{PLANET_SYMBOLS[aspect.planet2] || '★'}</Text>
                                      <Ionicons name="chevron-forward" size={14} color="#666" style={{ marginLeft: 6 }} />
                                    </View>
                                  </TouchableOpacity>
                                ))
                              )}
                            </View>
                          )}
                        </>
                      );
                    })()}
                      </>
                    )}
                  </View>
                )
              ) : (
                // TIMELINE SUBTAB
                isSkyTimelineLoading && !skyTimelineData ? (
                  <View style={{ padding: 40, alignItems: 'center', backgroundColor: 'rgba(20,20,25,0.7)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', marginTop: 10 }}>
                    <ActivityIndicator size="large" color="#0EA5E9" style={{ marginBottom: 12 }} />
                    <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 14, marginBottom: 4 }}>
                      Kolektif Gökyüzü Çizelgesi Hesaplanıyor...
                    </Text>
                    <Text style={{ color: '#9CA3AF', fontSize: 11, textAlign: 'center' }}>
                      Gökyüzündeki gezegenlerin birbiriyle oluşturduğu büyük döngüler taranıyor.
                    </Text>
                  </View>
                ) : (
                  <View style={{ marginTop: 10 }}>
                    <MobileTransitTimelineChart
                      items={skyTimelineData?.items || []}
                      startDateStr={skyTimelineData?.startDate || transitDateStr}
                      endDateStr={skyTimelineData?.endDate || transitDateStr}
                      range={skyTimelineRange}
                      onRangeChange={(newRange) => {
                        setSkyTimelineRange(newRange);
                        fetchSkyTimeline(newRange);
                      }}
                      isLoading={isSkyTimelineLoading}
                      isPremium={true}
                      isMundane={true}
                      userTimezone={skyTimelineData?.timeZone || userTz}
                      tzOffsetHours={skyTimelineData?.tzOffsetHours ?? tzOffsetHours}
                    />
                  </View>
                )
              )}
            </View>
          ) : (
            !transitData ? (
            <BlurView intensity={25} tint="dark" style={styles.formCard}>
              
              <Text style={styles.sectionHeader}>1. Doğum Bilgileriniz (Natal)</Text>
              
              <Text style={styles.label}>Doğum Tarihi (YYYY-AA-GG)</Text>
              <TextInput
                ref={dateInputRef}
                style={styles.input}
                value={natalDateStr}
                onChangeText={handleNatalDateChange}
                placeholder="Örn: 2012-12-22"
                placeholderTextColor="#666"
                keyboardType="numeric"
                maxLength={10}
              />

              <Text style={styles.label}>Doğum Saati (SS:DD)</Text>
              <TextInput
                ref={timeInputRef}
                style={styles.input}
                value={natalTimeStr}
                onChangeText={handleNatalTimeChange}
                placeholder="Örn: 12:12"
                placeholderTextColor="#666"
                keyboardType="numeric"
                maxLength={5}
              />

              <Text style={styles.label}>Doğum Şehri (Ara)</Text>
              <View style={{ zIndex: 1000, position: 'relative' }}>
                <TextInput
                  style={styles.input}
                  value={searchQuery}
                  onChangeText={(t) => {
                    setSearchQuery(t);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => {
                    setShowSuggestions(true);
                  }}
                  placeholder="Şehir adı yazın..."
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
                            setSelectedCityData({
                              name: item.name,
                              lat: item.latitude,
                              lon: item.longitude,
                              tz: item.timezone || 'Europe/Istanbul',
                              country: item.country
                            });
                            setSearchQuery(`${item.name}, ${item.admin1 || ''} ${item.country}`.replace(/, \s*/g, ', ').trim());
                            setShowSuggestions(false);
                            Keyboard.dismiss();
                          }}
                        >
                          <Text style={styles.suggestionText}>{item.name}, {item.admin1 ? `${item.admin1}, ` : ''}{item.country}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              <Text style={[styles.sectionHeader, { marginTop: 15, color: COLORS.secondary }]}>2. Transit (Hesaplama) Tarihi</Text>

              <Text style={styles.label}>Transit Tarihi (YYYY-AA-GG)</Text>
              <TextInput
                ref={tDateInputRef}
                style={styles.input}
                value={transitDateStr}
                onChangeText={handleTransitDateChange}
                placeholder="Örn: 2012-12-22"
                placeholderTextColor="#666"
                keyboardType="numeric"
                maxLength={10}
              />

              <Text style={styles.label}>Transit Saati (SS:DD)</Text>
              <TextInput
                ref={tTimeInputRef}
                style={styles.input}
                value={transitTimeStr}
                onChangeText={handleTransitTimeChange}
                placeholder="Örn: 12:12"
                placeholderTextColor="#666"
                keyboardType="numeric"
                maxLength={5}
              />

              <Text style={styles.label}>Transit Şehri (Opsiyonel)</Text>
              <View style={{ zIndex: 999, position: 'relative' }}>
                <TextInput
                  style={styles.input}
                  value={transitSearchQuery}
                  onChangeText={(t) => {
                    setTransitSearchQuery(t);
                    setShowTransitSuggestions(true);
                  }}
                  onFocus={() => {
                    setShowTransitSuggestions(true);
                  }}
                  placeholder="Arama yapmazsanız doğum şehri kullanılacaktır..."
                  placeholderTextColor="#666"
                />
                {showTransitSuggestions && transitSearchQuery.length >= 3 && transitSuggestions.length > 0 && (
                  <View style={styles.suggestionsContainer}>
                    <ScrollView keyboardShouldPersistTaps="always" style={{ maxHeight: 150 }}>
                      {transitSuggestions.map((item, index) => (
                        <TouchableOpacity 
                          key={index} 
                          style={styles.suggestionItem}
                          onPress={() => {
                            setSelectedTransitCityData({
                              name: item.name,
                              lat: item.latitude,
                              lon: item.longitude,
                              tz: item.timezone || 'Europe/Istanbul',
                              country: item.country
                            });
                            setTransitSearchQuery(`${item.name}, ${item.admin1 || ''} ${item.country}`.replace(/, \s*/g, ', ').trim());
                            setShowTransitSuggestions(false);
                            Keyboard.dismiss();
                          }}
                        >
                          <Text style={styles.suggestionText}>{item.name}, {item.admin1 ? `${item.admin1}, ` : ''}{item.country}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              <TouchableOpacity style={styles.button} onPress={handleCalculate} disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator size="small" color="#0F172A" />
                ) : (
                  <Text style={styles.buttonText}>Transit Haritamı Hesapla</Text>
                )}
              </TouchableOpacity>
            </BlurView>
          ) : (
            <View>
              {/* Reset/Back Button */}
              <TouchableOpacity style={styles.resetBtn} onPress={() => {
                setTransitData(null);
                setTimelineData(null);
                setActiveTab('BIWHEEL');
                setTransitSearchQuery('');
                setSelectedTransitCityData(null);
              }}>
                <Ionicons name="arrow-back" size={18} color={COLORS.primary} style={{ marginRight: 6 }} />
                <Text style={styles.resetBtnText}>Yeni Sorgulama</Text>
              </TouchableOpacity>

              {/* Natal and Transit Info Header */}
              <View style={styles.infoCard}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                  <View style={[styles.colorDot, { backgroundColor: COLORS.primary }]} />
                  <Text style={styles.infoText}>Doğum: {selectedCityData.name} • {natalDateStr.split('-').reverse().join('.')} {natalTimeStr}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={[styles.colorDot, { backgroundColor: COLORS.secondary }]} />
                  <Text style={styles.infoText}>Transit: {selectedTransitCityData ? `${selectedTransitCityData.name} • ` : ''}{transitDateStr.split('-').reverse().join('.')} {transitTimeStr}</Text>
                </View>
              </View>

              {/* Tab Selector: Anlık Harita vs Zaman Çizelgesi */}
              <View style={styles.tabSelector}>
                <TouchableOpacity
                  onPress={() => setActiveTab('BIWHEEL')}
                  style={[styles.tabBtn, activeTab === 'BIWHEEL' && styles.tabBtnActive]}
                >
                  <Ionicons name="compass-outline" size={15} color={activeTab === 'BIWHEEL' ? '#000' : '#9CA3AF'} style={{ marginRight: 5 }} />
                  <Text style={[styles.tabBtnText, activeTab === 'BIWHEEL' && styles.tabBtnTextActive]}>
                    Anlık Harita
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setActiveTab('TIMELINE');
                    if (!timelineData && !isTimelineLoading) {
                      fetchTimeline(timelineRange);
                    }
                  }}
                  style={[styles.tabBtn, activeTab === 'TIMELINE' && styles.tabBtnActive]}
                >
                  <Ionicons name="sparkles" size={15} color={activeTab === 'TIMELINE' ? '#000' : '#9CA3AF'} style={{ marginRight: 5 }} />
                  <Text style={[styles.tabBtnText, activeTab === 'TIMELINE' && styles.tabBtnTextActive]}>
                    Zaman Çizelgesi (Gantt)
                  </Text>
                </TouchableOpacity>
              </View>

              {activeTab === 'BIWHEEL' ? (
                <>
                  {/* ☀️ Kişisel Harita 6 Aylık Güneş Tutulması Çatısı & Ezoterik Ev Portalı */}
                  {personalLunationData && (
                    <MobileLunationCard data={personalLunationData} isCompact={false} />
                  )}

                  {/* Dual Wheel Chart */}
                  {renderBiWheel()}

                  {/* Personal 3-View Switcher: Bütünleşik Özet | 10 Gezegen | Ayrık Tablolar */}
              <View style={styles.subViewSwitcher}>
                <TouchableOpacity
                  onPress={() => setPersonalViewMode('OVERVIEW')}
                  style={[styles.subViewBtn, personalViewMode === 'OVERVIEW' && styles.subViewBtnActiveGold]}
                >
                  <Ionicons name="sparkles" size={13} color={personalViewMode === 'OVERVIEW' ? '#000' : '#D4AF37'} style={{ marginRight: 4 }} />
                  <Text style={[styles.subViewBtnText, personalViewMode === 'OVERVIEW' && styles.subViewBtnTextActive]}>
                    Bütünleşik Özet
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setPersonalViewMode('PLANETS')}
                  style={[styles.subViewBtn, personalViewMode === 'PLANETS' && styles.subViewBtnActiveGold]}
                >
                  <Ionicons name="planet-outline" size={13} color={personalViewMode === 'PLANETS' ? '#000' : '#D4AF37'} style={{ marginRight: 4 }} />
                  <Text style={[styles.subViewBtnText, personalViewMode === 'PLANETS' && styles.subViewBtnTextActive]}>
                    10 Gezegen
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setPersonalViewMode('TABLES')}
                  style={[styles.subViewBtn, personalViewMode === 'TABLES' && styles.subViewBtnActiveGold]}
                >
                  <Ionicons name="grid-outline" size={13} color={personalViewMode === 'TABLES' ? '#000' : '#D4AF37'} style={{ marginRight: 4 }} />
                  <Text style={[styles.subViewBtnText, personalViewMode === 'TABLES' && styles.subViewBtnTextActive]}>
                    Ayrık Tablolar
                  </Text>
                </TouchableOpacity>
              </View>

              {personalViewMode === 'OVERVIEW' && renderPersonalTransitOverview()}
              {personalViewMode === 'PLANETS' && renderUnifiedPersonalPlanets()}
              {personalViewMode === 'TABLES' && (
                <>
                  {/* Lists of Transit House placements */}
                  <TouchableOpacity 
                    style={styles.listSectionHeader}
                    activeOpacity={0.7}
                    onPress={() => setIsHousesExpanded(!isHousesExpanded)}
                  >
                    <Text style={styles.listSectionTitle}>Transit Gezegenler & Natal Evler</Text>
                    <Ionicons name={isHousesExpanded ? "chevron-up" : "chevron-down"} size={20} color={COLORS.primary} />
                  </TouchableOpacity>

                  {isHousesExpanded && (
                    <View style={styles.listCard}>
                      {transitData.transitPlanets.map((p, i) => (
                        <TouchableOpacity 
                          key={`th-${i}`} 
                          style={styles.listRow}
                          activeOpacity={0.7}
                          onPress={() => setSelectedInterp(getTransitHouseInterpretation(p.name, p.house))}
                        >
                          <View style={styles.listRowLeft}>
                            <Text style={[styles.planetSymbolIcon, { color: COLORS.secondary }]}>{PLANET_SYMBOLS[p.name] || '★'}</Text>
                            <Text style={styles.listRowMain}>Transit {p.name}</Text>
                          </View>
                          <Text style={styles.listRowMiddle}>{p.house}. Evinizde</Text>
                          <Text style={[styles.listRowRight, { color: ZODIAC_COLORS[p.sign] || COLORS.textMuted }]}>{p.sign}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  {/* Lists of Transit aspects */}
                  <TouchableOpacity 
                    style={styles.listSectionHeader}
                    activeOpacity={0.7}
                    onPress={() => setIsAspectsExpanded(!isAspectsExpanded)}
                  >
                    <Text style={styles.listSectionTitle}>Transit - Natal Açıları</Text>
                    <Ionicons name={isAspectsExpanded ? "chevron-up" : "chevron-down"} size={20} color={COLORS.primary} />
                  </TouchableOpacity>

                  {isAspectsExpanded && (
                    <View style={styles.listCard}>
                      {transitData.transitAspects.length === 0 ? (
                        <Text style={styles.emptyText}>Gezegen geçişlerinin şu an doğum gezegenlerinizle majör bir açısı bulunmuyor.</Text>
                      ) : (
                        transitData.transitAspects.sort((a, b) => a.orb - b.orb).map((aspect, i) => (
                          <TouchableOpacity 
                            key={`ta-${i}`} 
                            style={styles.listRow}
                            activeOpacity={0.7}
                            onPress={() => setSelectedInterp(getTransitAspectInterpretation(aspect.transitPlanet, aspect.natalPlanet, aspect.type))}
                          >
                            <View style={styles.listRowLeft}>
                              <Text style={[styles.planetSymbolIcon, { color: COLORS.secondary }]}>{PLANET_SYMBOLS[aspect.transitPlanet] || '★'}</Text>
                              <Text style={styles.listRowMain}>T.{aspect.transitPlanet}</Text>
                            </View>
                            
                            <View style={{ alignItems: 'center', flex: 1.2 }}>
                              <Text style={[styles.aspectBadge, { color: ASPECT_COLORS[aspect.type] || '#FFF' }]}>{aspect.type}</Text>
                              <Text style={{ fontSize: 10, color: COLORS.textMuted }}>Orb: {aspect.orb.toFixed(1)}° {aspect.isExact ? '(Tam)' : ''}</Text>
                            </View>

                            <View style={[styles.listRowRight, { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }]}>
                              <Text style={[styles.listRowMain, { marginRight: 6 }]}>N.{aspect.natalPlanet}</Text>
                              <Text style={[styles.planetSymbolIcon, { color: COLORS.primary }]}>{PLANET_SYMBOLS[aspect.natalPlanet] || '★'}</Text>
                            </View>
                          </TouchableOpacity>
                        ))
                      )}
                    </View>
                  )}
                </>
              )}
                </>
              ) : (
                isTimelineLoading && !timelineData ? (
                  <View style={{ padding: 40, alignItems: 'center', backgroundColor: 'rgba(20,20,25,0.7)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', marginTop: 10 }}>
                    <ActivityIndicator size="large" color={COLORS.primary} style={{ marginBottom: 12 }} />
                    <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 14, marginBottom: 4 }}>
                      Kozmik Zaman Çizelgesi Hesaplanıyor...
                    </Text>
                    <Text style={{ color: '#9CA3AF', fontSize: 11, textAlign: 'center' }}>
                      Gezegenlerin gökyüzü yörüngeleri ve açı başlangıç-bitiş tarihleri taranıyor.
                    </Text>
                  </View>
                ) : (
                  <View style={{ marginTop: 10 }}>
                    <MobileTransitTimelineChart
                      items={timelineData?.items || []}
                      startDateStr={timelineData?.startDate || transitDateStr}
                      endDateStr={timelineData?.endDate || transitDateStr}
                      range={timelineRange}
                      onRangeChange={(newRange) => {
                        setTimelineRange(newRange);
                        fetchTimeline(newRange);
                      }}
                      isLoading={isTimelineLoading}
                      isPremium={true}
                      userTimezone={timelineData?.timeZone || userTz}
                      tzOffsetHours={timelineData?.tzOffsetHours ?? tzOffsetHours}
                    />
                  </View>
                )
              )}
            </View>
          )
        )}

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Modal for detail explanations */}
        <Modal visible={!!selectedInterp} animationType="slide" transparent={true} onRequestClose={() => setSelectedInterp(null)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedInterp?.title}</Text>
                <TouchableOpacity onPress={() => setSelectedInterp(null)}>
                  <Ionicons name="close-circle" size={28} color={COLORS.textMuted} />
                </TouchableOpacity>
              </View>
              <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
                <Text style={styles.modalText}>{selectedInterp?.content}</Text>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Modal for Premium Lock */}
        <Modal visible={showLockModal} animationType="fade" transparent={true} onRequestClose={() => setShowLockModal(false)}>
          <View style={[styles.modalOverlay, { justifyContent: 'center', padding: 20 }]}>
            <View style={[styles.modalContent, { height: 'auto', borderRadius: 24, padding: 24, alignItems: 'center' }]}>
              <View style={styles.lockModalIcon}>
                <Ionicons name="lock-closed" size={28} color="#D4AF37" />
              </View>
              <Text style={styles.lockModalTitle}>Detaylı Analiz Kilitli</Text>
              <Text style={styles.lockModalDesc}>
                Uzun vadeli kozmik zaman çizelgeleri ve derin çakra analizleri Kapsamlı Rapor kapsamında sunulmaktadır. Hesabınızda aktif bir rapor tanımlı değildir. Hesap ve rapor yönetimi için platformumuzu web tarayıcınız üzerinden ziyaret edebilirsiniz.
              </Text>
              <TouchableOpacity
                onPress={() => setShowLockModal(false)}
                style={styles.modalUpgradeBtn}
              >
                <LinearGradient
                  colors={['#D4AF37', '#0EA5E9']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.modalUpgradeBtnGrad}
                >
                  <Text style={styles.modalUpgradeBtnText}>Tamam</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </SacredBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: 15, paddingTop: Platform.OS === 'android' ? 72 : 60 },
  header: { marginBottom: 20, alignItems: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', color: COLORS.primary, marginBottom: 4 },
  subtitle: { fontSize: 13, color: COLORS.textMuted, fontStyle: 'italic' },
  
  formCard: { padding: 20, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, overflow: 'visible' },
  sectionHeader: { fontSize: 15, fontWeight: 'bold', color: COLORS.primary, marginBottom: 15 },
  label: { fontSize: 13, color: COLORS.text, marginBottom: 6, fontWeight: '600', marginTop: 10 },
  input: { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 15, color: '#FFF', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  
  suggestionsContainer: { position: 'absolute', top: 52, left: 0, right: 0, backgroundColor: '#1E293B', borderRadius: 8, borderWidth: 1, borderColor: COLORS.secondary, overflow: 'hidden', elevation: 5, zIndex: 1000 },
  suggestionItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  suggestionText: { color: COLORS.text, fontSize: 14 },
  
  button: { backgroundColor: COLORS.primary, padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#0F172A', fontSize: 16, fontWeight: 'bold' },

  resetBtn: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, alignSelf: 'flex-start' },
  resetBtnText: { color: COLORS.primary, fontSize: 15, fontWeight: '600' },

  infoCard: { backgroundColor: COLORS.cardBg, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: COLORS.border, marginBottom: 15 },
  colorDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  infoText: { color: COLORS.text, fontSize: 13, fontWeight: '600' },

  chartWrapper: { alignItems: 'center', justifyContent: 'center', marginVertical: 10, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 20, padding: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },

  guidanceCard: { backgroundColor: 'rgba(212, 175, 55, 0.05)', borderRadius: 16, padding: 18, borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.3)', marginVertical: 15 },
  guidanceTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary },
  guidanceText: { fontSize: 14, color: COLORS.text, lineHeight: 22 },

  listSectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8, paddingHorizontal: 4 },
  listSectionTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary, paddingLeft: 4 },
  listCard: { backgroundColor: COLORS.cardBg, borderRadius: 16, padding: 12, borderWidth: 1, borderColor: COLORS.border, marginBottom: 15 },
  listRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  listRowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1.2 },
  planetSymbolIcon: { fontSize: 18, width: 24, textAlign: 'center', fontWeight: 'bold' },
  listRowMain: { fontSize: 14, color: COLORS.text, fontWeight: '600' },
  listRowMiddle: { fontSize: 14, color: COLORS.text, fontWeight: 'bold', flex: 1, textAlign: 'center' },
  listRowRight: { fontSize: 14, fontWeight: 'bold', flex: 1, textAlign: 'right' },
  emptyText: { color: COLORS.textMuted, fontSize: 13, textAlign: 'center', paddingVertical: 10 },
  aspectBadge: { fontSize: 12, fontWeight: 'bold', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.05)' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#000000', borderTopLeftRadius: 24, borderTopRightRadius: 24, height: '60%', padding: 22, borderWidth: 1, borderColor: COLORS.primary },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)', paddingBottom: 10 },
  modalTitle: { fontSize: 17, fontWeight: 'bold', color: COLORS.primary, flex: 1, marginRight: 8 },
  modalText: { fontSize: 15, color: COLORS.text, lineHeight: 24 },

  tabSelector: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 14, padding: 3, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', marginBottom: 16 },
  tabBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 11 },
  tabBtnActive: { backgroundColor: COLORS.primary },
  tabBtnText: { fontSize: 13, fontWeight: 'bold', color: '#9CA3AF' },
  tabBtnTextActive: { color: '#000' },

  lockModalIcon: { width: 56, height: 56, borderRadius: 18, backgroundColor: 'rgba(212,175,55,0.15)', borderWidth: 1, borderColor: 'rgba(212,175,55,0.4)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  lockModalTitle: { fontSize: 17, fontWeight: 'bold', color: '#FFF', marginBottom: 6, textAlign: 'center' },
  lockModalDesc: { fontSize: 13, color: '#9CA3AF', textAlign: 'center', lineHeight: 19, marginBottom: 16, paddingHorizontal: 10 },
  modalUpgradeBtn: { width: '100%', borderRadius: 12, overflow: 'hidden' },
  modalUpgradeBtnGrad: { paddingVertical: 12, alignItems: 'center', justifyContent: 'center' },
  modalUpgradeBtnText: { fontSize: 14, fontWeight: 'bold', color: '#000' },

  modeSwitchContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(20, 20, 25, 0.85)',
    borderRadius: 14,
    padding: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 16
  },
  modeSwitchBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 11
  },
  modeSwitchBtnActive: {
    backgroundColor: '#D4AF37'
  },
  modeSwitchText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9CA3AF'
  },
  modeSwitchTextActive: {
    color: '#000',
    fontWeight: 'bold'
  },
  filterChipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  filterChipActive: {
    backgroundColor: 'rgba(14, 165, 233, 0.25)',
    borderColor: '#0EA5E9',
  },
  filterChipText: {
    fontSize: 12.5,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#0EA5E9',
    fontWeight: 'bold',
  },
  skyDateToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(20, 20, 25, 0.7)',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.2)',
    marginBottom: 12,
  },
  skyDateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skyDateText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  refreshSkyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(14, 165, 233, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0EA5E9',
  },
  refreshSkyBtnText: {
    color: '#0EA5E9',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  frekansMiniBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(14, 165, 233, 0.08)',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.25)',
  },
  frekansMiniIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(14, 165, 233, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  frekansMiniTitle: {
    color: '#0EA5E9',
    fontSize: 13,
    fontWeight: 'bold',
  },
  frekansMiniSub: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 1,
  },
  subViewSwitcher: {
    flexDirection: 'row',
    backgroundColor: 'rgba(20, 20, 25, 0.85)',
    borderRadius: 12,
    padding: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 12,
  },
  subViewBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 9,
  },
  subViewBtnActiveCyan: {
    backgroundColor: '#0EA5E9',
  },
  subViewBtnActiveGold: {
    backgroundColor: '#D4AF37',
  },
  subViewBtnText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  subViewBtnTextActive: {
    color: '#000',
    fontWeight: 'bold',
  },
});
