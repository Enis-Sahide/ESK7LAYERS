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

import { API_BASE_URL } from '@/src/core/config';

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

interface AstroPoint {
  name: string;
  longitude: number;
  sign: string;
  degreeInSign: number;
  minutes: number;
  house: number;
  isRetrograde?: boolean;
}

interface TransitAspect {
  transitPlanet: string;
  natalPlanet: string;
  type: string;
  orb: number;
  isExact: boolean;
}

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

  // Transit Inputs
  const [transitDateStr, setTransitDateStr] = useState('');
  const [transitTimeStr, setTransitTimeStr] = useState('');

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [transitData, setTransitData] = useState<TransitChartData | null>(null);
  const [selectedInterp, setSelectedInterp] = useState<{ title: string, content: string } | null>(null);
  const [isHousesExpanded, setIsHousesExpanded] = useState(true);
  const [isAspectsExpanded, setIsAspectsExpanded] = useState(true);

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
      const response = await fetch(`${API_BASE_URL}/api/astrology/calculate-transit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          natalDate: natalDateStr,
          natalTime: natalTimeStr,
          transitDate: transitDateStr,
          transitTime: transitTimeStr,
          cityData: selectedCityData
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Transit hesaplaması başarısız oldu.');
      }

      setTransitData(result.data);
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

    const getX = (lon: number, r: number) => CENTER + r * Math.cos((lon - ascDegree + 180) * Math.PI / 180);
    const getY = (lon: number, r: number) => CENTER + r * Math.sin((lon - ascDegree + 180) * Math.PI / 180);

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

  const renderAIRecommendation = () => {
    if (!transitData) return null;
    const tMoon = transitData.transitPlanets.find(p => p.name === 'Ay');
    const tSun = transitData.transitPlanets.find(p => p.name === 'Güneş');
    const exactAspects = [...transitData.transitAspects].filter(a => a.orb <= 3).sort((a, b) => a.orb - b.orb);

    const getHouseFocus = (house: number) => {
      const foci: Record<number, string> = {
        1: "kişisel imajınız ve yeni başlangıçlarınız",
        2: "maddi kaynaklarınız ve öz değeriniz",
        3: "iletişim trafiğiniz ve yakın çevreniz",
        4: "eviniz, aileniz ve iç dünyanız",
        5: "aşk hayatınız ve yaratıcılığınız",
        6: "günlük rutinleriniz ve sağlığınız",
        7: "ikili ilişkileriniz ve ortaklıklarınız",
        8: "kriz yönetimi ve ortak finansal kaynaklarınız",
        9: "inançlarınız ve hayata bakış açınız",
        10: "kariyeriniz ve toplumsal statünüz",
        11: "sosyal çevreniz ve geleceğe dair umutlarınız",
        12: "bilinçaltınız ve ruhsal şifalanma süreciniz"
      };
      return foci[house] || "yaşamınızın bu alanı";
    };

    const getPlanetTheme = (planetName: string) => {
      const themes: Record<string, string> = {
        'Güneş': 'kimlik ve özgüven',
        'Ay': 'duygusal dünya ve aile',
        'Merkür': 'iletişim ve zihinsel kararlar',
        'Venüs': 'ikili ilişkiler ve maddi değerler',
        'Mars': 'cesaret ve eylemler',
        'Jüpiter': 'inançlar ve vizyon',
        'Satürn': 'sorumluluklar ve sınırlar',
        'Uranüs': 'özgürlük ve ani değişimler',
        'Neptün': 'hayaller ve sezgiler',
        'Plüton': 'krizler ve köklü dönüşümler',
        'Kiron': 'geçmiş yaralar ve şifalanma',
        'Kuzey Ay Düğümü': 'kadersel yönelimler',
        'Yükselen (ASC)': 'dış imaj ve başlangıçlar',
        'Tepe Noktası (MC)': 'kariyer ve toplumsal statü',
        'Vertex (Vx)': 'kadersel karşılaşmalar',
        'Şans Noktası (POF)': 'kısmet akışı',
        'Lilith': 'bastırılmış arzular'
      };
      return themes[planetName] || planetName;
    };

    const getTransitAction = (planetName: string) => {
      const actions: Record<string, string> = {
        'Güneş': 'bilinçli farkındalığınızı',
        'Ay': 'duygusal dalgalanmalarınızı',
        'Merkür': 'zihinsel trafiğinizi ve düşüncelerinizi',
        'Venüs': 'sevgi dilinizi ve uyum arayışınızı',
        'Mars': 'mücadele gücünüzü ve eylem enerjinizi',
        'Jüpiter': 'büyüme isteğinizi ve iyimserliğinizi',
        'Satürn': 'sorumluluk duygunuzu ve ciddiyetinizi',
        'Uranüs': 'uyanışlarınızı ve özgürlük ihtiyacınızı',
        'Neptün': 'ilhamınızı ve ruhsal derinliğinizi',
        'Plüton': 'köklü dönüşüm ve güç arzunuzu',
        'Kiron': 'şifalandırıcı enerjinizi',
        'Kuzey Ay Düğümü': 'kadersel ilerleyişinizi'
      };
      return actions[planetName] || `${planetName} enerjinizi`;
    };

    const getAspectSummary = (tPlanet: string, nPlanet: string, type: string) => {
      const tAction = getTransitAction(tPlanet);
      const nTheme = getPlanetTheme(nPlanet);
      
      if (type === 'Kavuşum') return `gökyüzündeki ${tPlanet} transiti, haritanızdaki "${nTheme}" alanına doğrudan nüfuz ediyor. Bu durum, ${tAction} tam olarak bu konular üzerinde yoğunlaştırarak hayatınızda yepyeni bir döngü başlatıyor.`;
      if (type === 'Üçgen' || type === 'Sekstil') return `gökyüzündeki ${tPlanet} transiti, "${nTheme}" konularına çok destekleyici bir akış gönderiyor. ${tAction} bu alanlarda çok rahat kullanabilir, önünüze çıkan sürpriz fırsatları kolayca değerlendirebilirsiniz.`;
      if (type === 'Kare' || type === 'Karşıt') return `gökyüzündeki ${tPlanet} transiti ile "${nTheme}" alanınız arasında sert bir sürtüşme var. ${tAction} bu konularda bir kriz veya eşik atlama zorunluluğu yaratarak sizi kabuk kırmaya itecektir.`;
      
      return `gökyüzündeki ${tPlanet} transiti, "${nTheme}" üzerinde yeni bir farkındalık yaratıyor.`;
    };

    let paragraphs = [];
    
    // Paragraph 1: Sun & Moon
    let p1 = "";
    if (tSun) p1 += `Bugün Güneş, haritanızda ${tSun.house}. evinizi aydınlatıyor. Bu dönemde odak noktanız ${getHouseFocus(tSun.house)} üzerine yoğunlaşacaktır. `;
    if (tMoon) p1 += `Duygusal pusulanız olan Ay ise an itibarıyla ${tMoon.house}. evinizden geçiş yapıyor; bu durum bugünkü ruh halinizi ve anlık reaksiyonlarınızı doğrudan "${getHouseFocus(tMoon.house)}" konularına yönlendirecek.`;
    paragraphs.push(p1);

    // Paragraph 2: Exact Aspects
    if (exactAspects.length > 0) {
      const mainAspect = exactAspects[0];
      let p2 = `Günün en belirgin kadersel tetiklenmesi ise Transit ${mainAspect.transitPlanet} ile Natal ${mainAspect.natalPlanet} arasındaki ${mainAspect.orb.toFixed(1)}° toleranslı ${mainAspect.type} açısıdır. `;
      p2 += `Astrolojik olarak bu enerji; ${getAspectSummary(mainAspect.transitPlanet, mainAspect.natalPlanet, mainAspect.type)}`;
      paragraphs.push(p2);

      const hardAspects = exactAspects.filter(a => a.type === 'Kare' || a.type === 'Karşıt');
      if (hardAspects.length > 0) {
        const topHardAspects = hardAspects.slice(0, 3);
        const affectedThemes = Array.from(new Set(topHardAspects.map(a => getPlanetTheme(a.natalPlanet)).filter(Boolean)));
        
        if (affectedThemes.length > 0) {
           const themesText = affectedThemes.join(', ').replace(/, ([^,]*)$/, ' ve $1');
           paragraphs.push(`⚠️ Gökyüzünde ayrıca gerilimli etkileşimler devrede. Özellikle "${themesText}" konularında dışarıdan gelen baskılara karşı bugün ani tepkiler vermekten veya fevri kararlar almaktan kaçınmalısınız. Olaylara daha geniş bir perspektiften bakmak ve sabırlı kalmak size çok şey kazandıracaktır.`);
        } else {
           paragraphs.push(`⚠️ Gökyüzünde ayrıca bazı sert etkileşimler devrede olduğu için, bugün genel olarak ani tepkiler vermekten veya fevri kararlar almaktan kaçınmanız çok önemli. Sabırlı olmak size kazandıracaktır.`);
        }
      } else {
        paragraphs.push(`✨ Gökyüzündeki bu uyumlu akış, size yenilikler ve fırsatlar sunmak için destekleyici bir enerji veriyor. Harekete geçmek için harika bir gün!`);
      }
    } else {
      paragraphs.push(`Bugün gökyüzü natal gezegenlerinizle çok sert veya kadersel bir çarpışma yapmıyor. Evrensel enerjiler sizi zorlamadan, daha sakin, stabil ve içe dönük bir gün geçirmenize olanak tanıyor.`);
    }

    return (
      <View style={styles.guidanceCard}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <Ionicons name="sparkles" size={24} color={COLORS.primary} style={{ marginRight: 8 }} />
          <Text style={styles.guidanceTitle}>Günlük Gökyüzü Rehberi</Text>
        </View>
        {paragraphs.map((par, idx) => {
          let customColor = COLORS.text;
          if (idx === paragraphs.length - 1 && par.includes('⚠️')) customColor = '#FCA5A5';
          if (idx === paragraphs.length - 1 && par.includes('✨')) customColor = '#38BDF8';
          return (
            <Text key={idx} style={[styles.guidanceText, { color: customColor, marginTop: idx > 0 ? 10 : 0 }]}>
              {par}
            </Text>
          );
        })}
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

          {!transitData ? (
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
              <TouchableOpacity style={styles.resetBtn} onPress={() => setTransitData(null)}>
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
                  <Text style={styles.infoText}>Transit: {transitDateStr.split('-').reverse().join('.')} {transitTimeStr}</Text>
                </View>
              </View>

              {/* Dual Wheel Chart */}
              {renderBiWheel()}

              {/* AI Guidance Text */}
              {renderAIRecommendation()}

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
            </View>
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

      </SacredBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: 15, paddingTop: 60 },
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
  modalText: { fontSize: 15, color: COLORS.text, lineHeight: 24 }
});
