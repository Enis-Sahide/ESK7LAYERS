import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ImageBackground, KeyboardAvoidingView, Platform, Dimensions, Modal } from 'react-native';
import { BlurView } from 'expo-blur';
import Svg, { Polygon, Rect, Line, Circle, Polyline, Text as SvgText, G, Path, Image as SvgImage } from 'react-native-svg';
import { generateChart, HumanDesignChart, CenterCode, PLANET_SYMBOLS, CHANNELS } from '../../../src/utils/HumanDesignEngine';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import moment from 'moment-timezone';

const COLORS = {
  background: '#0F172A', // Dark Navy to match the app's theme
  primary: '#0EA5E9', // Cyan/Blue to match the title text in the screenshot
  accent: '#E63946', // Red for unconscious (Design)
  conscious: '#FFFFFF', // White for conscious (Personality) text on dark bg
  text: '#E0E0E0',
  textMuted: '#9CA3AF',
  cardBg: 'rgba(15, 23, 42, 0.8)',
};
const CENTER_COORDS: Record<CenterCode, { x: number, y: number, shape: string, color: string, s: number }> = {
  Head: { x: 200, y: 50, shape: 'triangle', color: '#F4D03F', s: 25 },
  Ajna: { x: 200, y: 110, shape: 'triangle-down', color: '#A8D5BA', s: 25 },
  Throat: { x: 200, y: 190, shape: 'square', color: '#D2B48C', s: 22 },
  G: { x: 200, y: 300, shape: 'diamond', color: '#F4D03F', s: 35 },
  Heart: { x: 255, y: 340, shape: 'triangle-down', color: '#E63946', s: 24 },
  Sacral: { x: 200, y: 400, shape: 'square', color: '#E63946', s: 25 },
  Root: { x: 200, y: 510, shape: 'square', color: '#D2B48C', s: 25 },
  Spleen: { x: 90, y: 400, shape: 'triangle-right', color: '#D2B48C', s: 30 },
  SolarPlexus: { x: 310, y: 400, shape: 'triangle-left', color: '#D2B48C', s: 30 },
};

const GATE_COORDS: Record<number, { x: number, y: number }> = {
  // Head
  64: { x: 185, y: 75 }, 61: { x: 200, y: 75 }, 63: { x: 215, y: 75 },
  // Ajna
  47: { x: 185, y: 85 }, 24: { x: 200, y: 85 }, 4: { x: 215, y: 85 },
  17: { x: 188, y: 110 }, 43: { x: 200, y: 135 }, 11: { x: 212, y: 110 },
  // Throat
  62: { x: 185, y: 168 }, 23: { x: 200, y: 168 }, 56: { x: 215, y: 168 },
  16: { x: 178, y: 180 }, 35: { x: 222, y: 180 },
  20: { x: 178, y: 190 }, 12: { x: 222, y: 190 },
  31: { x: 178, y: 200 }, 45: { x: 222, y: 200 },
  8: { x: 190, y: 212 }, 33: { x: 210, y: 212 },
  // G
  7: { x: 182, y: 282 }, 1: { x: 200, y: 265 }, 13: { x: 218, y: 282 },
  10: { x: 165, y: 300 }, 25: { x: 235, y: 300 },
  15: { x: 182, y: 318 }, 2: { x: 200, y: 335 }, 46: { x: 218, y: 318 },
  // Heart
  21: { x: 250, y: 316 }, 51: { x: 243, y: 340 },
  26: { x: 255, y: 364 }, 40: { x: 267, y: 340 },
  // Sacral
  5: { x: 185, y: 375 }, 14: { x: 200, y: 375 }, 29: { x: 215, y: 375 },
  34: { x: 175, y: 390 }, 59: { x: 225, y: 390 },
  27: { x: 175, y: 425 }, 
  42: { x: 190, y: 425 }, 3: { x: 205, y: 425 }, 9: { x: 220, y: 425 },
  // Root
  53: { x: 190, y: 485 }, 60: { x: 205, y: 485 }, 52: { x: 220, y: 485 },
  54: { x: 175, y: 495 }, 19: { x: 225, y: 495 },
  38: { x: 175, y: 505 }, 39: { x: 225, y: 505 },
  58: { x: 175, y: 515 }, 41: { x: 225, y: 515 },
  // Spleen
  48: { x: 60, y: 370 }, 57: { x: 95, y: 387 }, 44: { x: 75, y: 377 }, 50: { x: 120, y: 400 },
  32: { x: 100, y: 410 }, 28: { x: 80, y: 420 }, 18: { x: 60, y: 430 },
  // Solar Plexus
  36: { x: 340, y: 370 }, 22: { x: 325, y: 377 }, 37: { x: 305, y: 387 }, 6: { x: 280, y: 400 },
  49: { x: 300, y: 410 }, 55: { x: 320, y: 420 }, 30: { x: 340, y: 430 },
};

const ALL_CITIES = [
  { name: 'Adana', tz: 'Europe/Istanbul', country: 'Türkiye' }, { name: 'Adıyaman', tz: 'Europe/Istanbul', country: 'Türkiye' },
  { name: 'Afyonkarahisar', tz: 'Europe/Istanbul', country: 'Türkiye' }, { name: 'Ağrı', tz: 'Europe/Istanbul', country: 'Türkiye' },
  { name: 'Amasya', tz: 'Europe/Istanbul', country: 'Türkiye' }, { name: 'Ankara', tz: 'Europe/Istanbul', country: 'Türkiye' },
  { name: 'Antalya', tz: 'Europe/Istanbul', country: 'Türkiye' }, { name: 'Artvin', tz: 'Europe/Istanbul', country: 'Türkiye' },
  { name: 'Aydın', tz: 'Europe/Istanbul', country: 'Türkiye' }, { name: 'Balıkesir', tz: 'Europe/Istanbul', country: 'Türkiye' },
  { name: 'Bilecik', tz: 'Europe/Istanbul', country: 'Türkiye' }, { name: 'Bingöl', tz: 'Europe/Istanbul', country: 'Türkiye' },
  { name: 'Bitlis', tz: 'Europe/Istanbul', country: 'Türkiye' }, { name: 'Bolu', tz: 'Europe/Istanbul', country: 'Türkiye' },
  { name: 'Burdur', tz: 'Europe/Istanbul', country: 'Türkiye' }, { name: 'Bursa', tz: 'Europe/Istanbul', country: 'Türkiye' },
  { name: 'Çanakkale', tz: 'Europe/Istanbul', country: 'Türkiye' }, { name: 'Çankırı', tz: 'Europe/Istanbul', country: 'Türkiye' },
  { name: 'Çorum', tz: 'Europe/Istanbul', country: 'Türkiye' }, { name: 'Denizli', tz: 'Europe/Istanbul', country: 'Türkiye' },
  { name: 'Diyarbakır', tz: 'Europe/Istanbul', country: 'Türkiye' }, { name: 'Edirne', tz: 'Europe/Istanbul', country: 'Türkiye' },
  { name: 'Elazığ', tz: 'Europe/Istanbul', country: 'Türkiye' }, { name: 'Erzincan', tz: 'Europe/Istanbul', country: 'Türkiye' },
  { name: 'Erzurum', tz: 'Europe/Istanbul', country: 'Türkiye' }, { name: 'Eskişehir', tz: 'Europe/Istanbul', country: 'Türkiye' },
  { name: 'Gaziantep', tz: 'Europe/Istanbul', country: 'Türkiye' }, { name: 'Giresun', tz: 'Europe/Istanbul', country: 'Türkiye' },
  { name: 'Gümüşhane', tz: 'Europe/Istanbul', country: 'Türkiye' }, { name: 'Hakkâri', tz: 'Europe/Istanbul', country: 'Türkiye' },
  { name: 'Hatay', tz: 'Europe/Istanbul', country: 'Türkiye' }, { name: 'Isparta', tz: 'Europe/Istanbul', country: 'Türkiye' },
  { name: 'Mersin', tz: 'Europe/Istanbul', country: 'Türkiye' }, { name: 'İstanbul', tz: 'Europe/Istanbul', country: 'Türkiye' },
  { name: 'İzmir', tz: 'Europe/Istanbul', country: 'Türkiye' }, { name: 'Kars', tz: 'Europe/Istanbul', country: 'Türkiye' },
  { name: 'Kastamonu', tz: 'Europe/Istanbul', country: 'Türkiye' }, { name: 'Kayseri', tz: 'Europe/Istanbul', country: 'Türkiye' },
  { name: 'Kırklareli', tz: 'Europe/Istanbul', country: 'Türkiye' }, { name: 'Kırşehir', tz: 'Europe/Istanbul', country: 'Türkiye' },
  { name: 'Kocaeli', tz: 'Europe/Istanbul', country: 'Türkiye' }, { name: 'Konya', tz: 'Europe/Istanbul', country: 'Türkiye' },
  { name: 'Kütahya', tz: 'Europe/Istanbul', country: 'Türkiye' }, { name: 'Malatya', tz: 'Europe/Istanbul', country: 'Türkiye' },
  { name: 'Manisa', tz: 'Europe/Istanbul', country: 'Türkiye' }, { name: 'Kahramanmaraş', tz: 'Europe/Istanbul', country: 'Türkiye' },
  { name: 'Mardin', tz: 'Europe/Istanbul', country: 'Türkiye' }, { name: 'Muğla', tz: 'Europe/Istanbul', country: 'Türkiye' },
  { name: 'Muş', tz: 'Europe/Istanbul', country: 'Türkiye' }, { name: 'Nevşehir', tz: 'Europe/Istanbul', country: 'Türkiye' },
  { name: 'Niğde', tz: 'Europe/Istanbul', country: 'Türkiye' }, { name: 'Ordu', tz: 'Europe/Istanbul', country: 'Türkiye' },
  { name: 'Rize', tz: 'Europe/Istanbul', country: 'Türkiye' }, { name: 'Sakarya', tz: 'Europe/Istanbul', country: 'Türkiye' },
  { name: 'Samsun', tz: 'Europe/Istanbul', country: 'Türkiye' }, { name: 'Siirt', tz: 'Europe/Istanbul', country: 'Türkiye' },
  { name: 'Sinop', tz: 'Europe/Istanbul', country: 'Türkiye' }, { name: 'Sivas', tz: 'Europe/Istanbul', country: 'Türkiye' },
  { name: 'Tekirdağ', tz: 'Europe/Istanbul', country: 'Türkiye' }, { name: 'Tokat', tz: 'Europe/Istanbul', country: 'Türkiye' },
  { name: 'Trabzon', tz: 'Europe/Istanbul', country: 'Türkiye' }, { name: 'Tunceli', tz: 'Europe/Istanbul', country: 'Türkiye' },
  { name: 'Şanlıurfa', tz: 'Europe/Istanbul', country: 'Türkiye' }, { name: 'Uşak', tz: 'Europe/Istanbul', country: 'Türkiye' },
  { name: 'Van', tz: 'Europe/Istanbul', country: 'Türkiye' }, { name: 'Yozgat', tz: 'Europe/Istanbul', country: 'Türkiye' },
  { name: 'Zonguldak', tz: 'Europe/Istanbul', country: 'Türkiye' }, { name: 'Aksaray', tz: 'Europe/Istanbul', country: 'Türkiye' },
  { name: 'Bayburt', tz: 'Europe/Istanbul', country: 'Türkiye' }, { name: 'Karaman', tz: 'Europe/Istanbul', country: 'Türkiye' },
  { name: 'Kırıkkale', tz: 'Europe/Istanbul', country: 'Türkiye' }, { name: 'Batman', tz: 'Europe/Istanbul', country: 'Türkiye' },
  { name: 'Şırnak', tz: 'Europe/Istanbul', country: 'Türkiye' }, { name: 'Bartın', tz: 'Europe/Istanbul', country: 'Türkiye' },
  { name: 'Ardahan', tz: 'Europe/Istanbul', country: 'Türkiye' }, { name: 'Iğdır', tz: 'Europe/Istanbul', country: 'Türkiye' },
  { name: 'Yalova', tz: 'Europe/Istanbul', country: 'Türkiye' }, { name: 'Karabük', tz: 'Europe/Istanbul', country: 'Türkiye' },
  { name: 'Kilis', tz: 'Europe/Istanbul', country: 'Türkiye' }, { name: 'Osmaniye', tz: 'Europe/Istanbul', country: 'Türkiye' },
  { name: 'Düzce', tz: 'Europe/Istanbul', country: 'Türkiye' },
  // International
  { name: 'Berlin', tz: 'Europe/Berlin', country: 'Almanya' }, { name: 'Münih', tz: 'Europe/Berlin', country: 'Almanya' },
  { name: 'Frankfurt', tz: 'Europe/Berlin', country: 'Almanya' }, { name: 'Londra', tz: 'Europe/London', country: 'İngiltere' },
  { name: 'Manchester', tz: 'Europe/London', country: 'İngiltere' }, { name: 'New York', tz: 'America/New_York', country: 'ABD' },
  { name: 'Los Angeles', tz: 'America/Los_Angeles', country: 'ABD' }, { name: 'Bakü', tz: 'Asia/Baku', country: 'Azerbaycan' },
];

const AVAILABLE_COUNTRIES = ['Türkiye', 'Almanya', 'İngiltere', 'ABD', 'Azerbaycan'];

export default function HumanDesignScreen() {
  const router = useRouter();
  const [name, setName] = useState('Enis Şahide Kesik');
  const [dateStr, setDateStr] = useState('1995-03-17');
  const [timeStr, setTimeStr] = useState('18:05');
  
  const [country, setCountry] = useState('Türkiye');
  const [showCountryModal, setShowCountryModal] = useState(false);

  const [city, setCity] = useState('Europe/Istanbul');
  const [searchQuery, setSearchQuery] = useState('İstanbul');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const [chart, setChart] = useState<HumanDesignChart | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Filtrelenmiş iller (sadece seçili ülke için, maksimum 3 adet)
  const filteredCities = ALL_CITIES.filter(c => 
    c.country === country &&
    c.name.toLocaleLowerCase('tr-TR').startsWith(searchQuery.toLocaleLowerCase('tr-TR'))
  ).slice(0, 3);

  const dateInputRef = useRef<TextInput>(null);
  const timeInputRef = useRef<TextInput>(null);

  const handleDateChange = (text: string) => {
    let cleaned = text.replace(/\D/g, '');
    let formatted = '';
    
    if (cleaned.length > 0) formatted = cleaned.substring(0, 4);
    if (cleaned.length > 4) formatted += '-' + cleaned.substring(4, 6);
    if (cleaned.length > 6) formatted += '-' + cleaned.substring(6, 8);
    
    setDateStr(formatted);

    if (cleaned.length === 8) {
      timeInputRef.current?.focus();
    }
  };

  const handleTimeChange = (text: string) => {
    let cleaned = text.replace(/\D/g, '');
    let formatted = '';
    
    if (cleaned.length > 0) formatted = cleaned.substring(0, 2);
    if (cleaned.length > 2) formatted += ':' + cleaned.substring(2, 4);
    
    setTimeStr(formatted);
  };

  const handleCalculate = () => {
    try {
      setIsLoading(true);
      if (dateStr.length !== 10 || timeStr.length !== 5) {
        Alert.alert("Hata", "Lütfen tarihi (YYYY-AA-GG) ve saati (SS:DD) tam formatında girin.");
        setIsLoading(false);
        return;
      }

      const dateTimeString = `${dateStr} ${timeStr}`;
      const m = moment.tz(dateTimeString, "YYYY-MM-DD HH:mm", city);
      
      if (!m.isValid()) {
        Alert.alert("Hata", "Girilen tarih geçerli değil. Lütfen formatı kontrol edin.");
        setIsLoading(false);
        return;
      }

      const result = generateChart(m.toDate());
      setChart(result);
    } catch (err: any) {
      console.error(err);
      Alert.alert("Hata", "Hesaplama hatası: " + (err?.message || err));
    } finally {
      setIsLoading(false);
    }
  };

  const drawSilhouette = () => {
    return null; // Arka plan resmi tamamen kaldırıldı. Saf vektör kullanıyoruz.
  };

  const drawChannels = () => {
    if (!chart) return null;
    const elements: JSX.Element[] = [];

    CHANNELS.forEach(ch => {
       const g1 = ch.gates[0];
       const g2 = ch.gates[1];
       const c1 = GATE_COORDS[g1];
       const c2 = GATE_COORDS[g2];
       if (!c1 || !c2) return;
       elements.push(<Path d={`M ${c1.x} ${c1.y} L ${c2.x} ${c2.y}`} stroke="#E2E8F0" strokeWidth="6" strokeLinecap="round" key={`bg-${ch.id}`} />);
    });
    // 2. Aktif kanallar (yarım/tam)
    CHANNELS.forEach(ch => {
       const g1 = ch.gates[0];
       const g2 = ch.gates[1];
       const c1 = GATE_COORDS[g1];
       const c2 = GATE_COORDS[g2];
       if (!c1 || !c2) return;

       const mx = (c1.x + c2.x) / 2;
       const my = (c1.y + c2.y) / 2;
       const g1Path = `M ${c1.x} ${c1.y} L ${mx} ${my}`;
       const g2Path = `M ${c2.x} ${c2.y} L ${mx} ${my}`;

       const g1Cons = chart.conscious.some(p => p.gate === g1);
       const g1Unc = chart.unconscious.some(p => p.gate === g1);
       const g2Cons = chart.conscious.some(p => p.gate === g2);
       const g2Unc = chart.unconscious.some(p => p.gate === g2);

       const drawHalf = (pathD: string, isConscious: boolean, isUnconscious: boolean, keyPrefix: string) => {
          if (isConscious && isUnconscious) {
            elements.push(<Path d={pathD} stroke="#111" strokeWidth="6" strokeLinecap="butt" fill="none" key={`${keyPrefix}-b`} />);
            elements.push(<Path d={pathD} stroke={COLORS.accent} strokeWidth="6" strokeLinecap="butt" strokeDasharray="6 6" fill="none" key={`${keyPrefix}-r`} />);
          } else if (isConscious) {
            elements.push(<Path d={pathD} stroke="#111" strokeWidth="6" strokeLinecap="butt" fill="none" key={`${keyPrefix}-con`} />);
          } else if (isUnconscious) {
            elements.push(<Path d={pathD} stroke={COLORS.accent} strokeWidth="6" strokeLinecap="butt" fill="none" key={`${keyPrefix}-unc`} />);
          }
       }

       drawHalf(g1Path, g1Cons, g1Unc, `g1-${ch.id}`);
       drawHalf(g2Path, g2Cons, g2Unc, `g2-${ch.id}`);
    });
    
    return elements;
  };

  const drawCenters = () => {
    if (!chart) return null;
    return Object.entries(CENTER_COORDS).map(([center, def]) => {
      const isDefined = chart.definedCenters.includes(center as CenterCode);
      
      const fill = isDefined ? def.color : '#FFFFFF';
      const stroke = isDefined ? 'none' : '#94A3B8'; // İnaktif merkezlere hafif gri kenarlık
      const s = def.s;
      
      const drawShape = (dx: number, dy: number) => {
        const sw = isDefined ? "0" : "1";
        if (def.shape === 'square') {
          return <Rect x={def.x - s + dx} y={def.y - s + dy} width={s*2} height={s*2} fill={fill} stroke={stroke} strokeWidth={sw} key="mg" />;
        } else if (def.shape === 'diamond') {
          return <Polygon points={`${def.x + dx},${def.y-s-2 + dy} ${def.x+s+2 + dx},${def.y + dy} ${def.x + dx},${def.y+s+2 + dy} ${def.x-s-2 + dx},${def.y + dy}`} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" key="mg" />;
        } else if (def.shape === 'triangle') {
          return <Polygon points={`${def.x + dx},${def.y-s + dy} ${def.x+s + dx},${def.y+s + dy} ${def.x-s + dx},${def.y+s + dy}`} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" key="mg" />;
        } else if (def.shape === 'triangle-down') {
          return <Polygon points={`${def.x-s + dx},${def.y-s + dy} ${def.x+s + dx},${def.y-s + dy} ${def.x + dx},${def.y+s + dy}`} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" key="mg" />;
        } else if (def.shape === 'triangle-left') {
          return <Polygon points={`${def.x+s + dx},${def.y-s + dy} ${def.x+s + dx},${def.y+s + dy} ${def.x-s + dx},${def.y + dy}`} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" key="mg" />;
        } else if (def.shape === 'triangle-right') {
          return <Polygon points={`${def.x-s + dx},${def.y-s + dy} ${def.x+s + dx},${def.y + dy} ${def.x-s + dx},${def.y+s + dy}`} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" key="mg" />;
        }
        return null;
      };

      return (
        <G key={center}>
          {drawShape(0, 0)}
        </G>
      );
    });
  }

  const drawGates = () => {
    if (!chart) return null;
    return Object.entries(GATE_COORDS).map(([gateId, coords]) => {
      const gNum = parseInt(gateId);
      const isCons = chart.conscious.some(p => p.gate === gNum);
      const isUnc = chart.unconscious.some(p => p.gate === gNum);
      const isActive = isCons || isUnc;
      
      let shiftX = 0;
      let shiftY = 0;
      let centerSize = 10;
      
      const centerCoordsObj = CHANNELS.find(ch => ch.gates.includes(gNum));
      if (centerCoordsObj) {
        const c1Name = centerCoordsObj.centers[0];
        const c2Name = centerCoordsObj.centers[1];
        const c1 = CENTER_COORDS[c1Name as CenterCode];
        const c2 = CENTER_COORDS[c2Name as CenterCode];
        const dist1 = Math.hypot(c1.x - coords.x, c1.y - coords.y);
        const dist2 = Math.hypot(c2.x - coords.x, c2.y - coords.y);
        const myCenter = dist1 < dist2 ? c1 : c2;
        centerSize = myCenter.s;
        
        const dx = myCenter.x - coords.x;
        const dy = myCenter.y - coords.y;
        const len = Math.hypot(dx, dy);
        if (len > 0) {
           shiftX = (dx / len) * (centerSize * 0.30);
           shiftY = (dy / len) * (centerSize * 0.30);
        }
      }

      const textX = coords.x + shiftX;
      const textY = coords.y + shiftY;

      return (
        <G key={`glabel-${gateId}`}>
          {isActive && <Circle cx={textX} cy={textY - 2} r={8} fill="rgba(255,255,255,0.95)" />}
          <SvgText x={textX} y={textY + 2.5} fontSize="12" fill={isActive ? "#0F172A" : "#64748B"} fontWeight={isActive ? "900" : "bold"} textAnchor="middle">{gNum}</SvgText>
        </G>
      );
    });
  };

  // Yücelim (Exaltation) ve Düşüş (Detriment) okları için simülatör
  // Gerçek I'Ching veritabanı 384 satır gerektirdiği için görsel tasarımı tamamlamak adına deterministik simüle ediyoruz.
  const getFixationArrow = (gate: number, line: number) => {
    // Şimdilik pasif hale getirildi. Gerçek Rave I'Ching veritabanı entegre edildiğinde açılacak.
    return null;
  };

  return (
    <ImageBackground source={{ uri: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2094&auto=format&fit=crop' }} style={styles.container} blurRadius={15}>
      <View style={styles.overlay} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <TouchableOpacity 
              style={{ position: 'absolute', left: 0, top: 2, padding: 5, zIndex: 10 }} 
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={28} color={COLORS.primary} />
            </TouchableOpacity>
            <Text style={styles.title}>İnsan Tasarımı Haritası</Text>
            <Text style={styles.subtitle}>Gerçek Astronomik Ephemeris Motoru</Text>
          </View>

          {!chart && (
            <BlurView intensity={40} tint="dark" style={styles.formCard}>
              <Text style={styles.formInfo}>
                Girdiğiniz anın gökyüzü konumlarını hesaplayarak Jovian Archive standartlarında milimetrik bir Human Design grafiği oluşturur. Doğum yeri bilgisi, o günkü yaz saati (Daylight Saving) kurallarını otomatik hesaplamak için %100 doğrulukla kullanılır.
              </Text>
              
              <Text style={styles.label}>İsim Soyisim</Text>
              <TextInput 
                style={styles.input} 
                value={name} 
                onChangeText={setName} 
                placeholder="Örn: Enis Şahide Kesik" 
                placeholderTextColor="#666" 
                returnKeyType="next"
                onSubmitEditing={() => dateInputRef.current?.focus()}
              />

              <Text style={styles.label}>Doğum Tarihi (YYYY-AA-GG)</Text>
              <TextInput 
                ref={dateInputRef}
                style={styles.input} 
                value={dateStr} 
                onChangeText={handleDateChange} 
                placeholder="Örn: 1990-05-15" 
                placeholderTextColor="#666" 
                keyboardType="numeric" 
                maxLength={10}
                returnKeyType="next"
              />
              
              <Text style={styles.label}>Doğum Saati (SS:DD)</Text>
              <TextInput 
                ref={timeInputRef}
                style={styles.input} 
                value={timeStr} 
                onChangeText={handleTimeChange} 
                placeholder="Örn: 14:30" 
                placeholderTextColor="#666" 
                keyboardType="numeric" 
                maxLength={5}
                returnKeyType="done"
              />
              
              <Text style={styles.label}>Doğum Ülkesi</Text>
              <TouchableOpacity style={[styles.input, { justifyContent: 'center' }]} onPress={() => setShowCountryModal(true)}>
                <Text style={{ color: '#000', fontSize: 15 }}>{country}</Text>
              </TouchableOpacity>
              
              <Text style={styles.label}>Doğum Şehri (Ara)</Text>
              <View style={{ zIndex: 99 }}>
                <TextInput
                  style={styles.input}
                  value={searchQuery}
                  onChangeText={(t) => {
                    setSearchQuery(t);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => {
                    if (searchQuery === 'İstanbul') setSearchQuery('');
                    setShowSuggestions(true);
                  }}
                  placeholder={`Örn: ${country === 'Türkiye' ? 'İstan...' : 'Berlin...'}`}
                  placeholderTextColor="#666"
                />
                {showSuggestions && searchQuery.length > 0 && (
                  <View style={styles.suggestionsContainer}>
                    {filteredCities.length > 0 ? filteredCities.map((c, i) => (
                      <TouchableOpacity 
                        key={i} 
                        style={styles.suggestionItem}
                        onPress={() => {
                          setCity(c.tz);
                          setSearchQuery(c.name);
                          setShowSuggestions(false);
                        }}
                      >
                        <Text style={styles.suggestionText}>{c.name}</Text>
                      </TouchableOpacity>
                    )) : (
                      <View style={styles.suggestionItem}>
                        <Text style={styles.suggestionText}>Sonuç bulunamadı</Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
              
              <TouchableOpacity style={styles.button} onPress={handleCalculate} disabled={isLoading}>
                <Text style={styles.buttonText}>{isLoading ? 'Hesaplanıyor...' : 'Haritayı Hesapla'}</Text>
              </TouchableOpacity>
            </BlurView>
          )}

          <Modal visible={showCountryModal} animationType="fade" transparent={true}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Ülke Seçin</Text>
                  <TouchableOpacity onPress={() => setShowCountryModal(false)}>
                    <Ionicons name="close" size={24} color="#333" />
                  </TouchableOpacity>
                </View>
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }}>
                  {AVAILABLE_COUNTRIES.map((c, i) => (
                    <TouchableOpacity key={i} style={styles.modalOption} onPress={() => {
                      setCountry(c);
                      setSearchQuery('');
                      setShowCountryModal(false);
                      setShowSuggestions(false);
                    }}>
                      <Text style={styles.modalOptionText}>{c}</Text>
                      {country === c && <Ionicons name="checkmark" size={20} color={COLORS.primary} />}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </Modal>

          {chart && (
            <View>
              <TouchableOpacity style={styles.resetButton} onPress={() => setChart(null)}>
                <Ionicons name="arrow-back" size={20} color={COLORS.primary} />
                <Text style={styles.resetButtonText}>Yeni Hesaplama</Text>
              </TouchableOpacity>

              <Text style={styles.chartNameTitle}>{name || 'İsimsiz Harita'}</Text>

              <View style={styles.visualLayout}>
                {/* Sol Kolon - Design */}
                <View style={styles.sidebarColumn}>
                  <Text style={[styles.sidebarTitle, {color: COLORS.accent}]}>Design</Text>
                  {chart.unconscious.map((p, i) => (
                    <View key={`unc-${i}`} style={styles.planetRow}>
                      <Text style={[styles.planetIcon, {color: COLORS.accent}]}>{PLANET_SYMBOLS[p.planet] || '?'}</Text>
                      <Text style={[styles.planetGate, {color: COLORS.accent}]}>{p.gate}.{p.line}</Text>
                      <View style={{ width: 12 }}>{getFixationArrow(p.gate, p.line)}</View>
                    </View>
                  ))}
                </View>

                {/* Orta SVG Bodygraph */}
                <View style={styles.bodygraphWrapper}>
                  <Svg width="100%" height="100%" viewBox="40 10 320 540">
                    {drawSilhouette()}
                    {drawChannels()}
                    {drawCenters()}
                    {drawGates()}
                  </Svg>
                </View>

                {/* Sağ Kolon - Personality */}
                <View style={styles.sidebarColumn}>
                  <Text style={[styles.sidebarTitle, {color: COLORS.conscious}]}>Personality</Text>
                  {chart.conscious.map((p, i) => (
                    <View key={`con-${i}`} style={styles.planetRow}>
                      <View style={{ width: 12 }}>{getFixationArrow(p.gate, p.line)}</View>
                      <Text style={[styles.planetGate, {color: COLORS.conscious}]}>{p.gate}.{p.line}</Text>
                      <Text style={[styles.planetIcon, {color: COLORS.conscious}]}>{PLANET_SYMBOLS[p.planet] || '?'}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <BlurView intensity={30} tint="light" style={styles.textAnalysisCard}>
                <View style={styles.textRow}>
                  <Text style={styles.textLabel}>Profil:</Text>
                  <Text style={styles.textValue}>{chart.profile}</Text>
                </View>
                <View style={styles.textRow}>
                  <Text style={styles.textLabel}>Tür:</Text>
                  <Text style={styles.textValue}>{chart.type}</Text>
                </View>
                <View style={styles.textRow}>
                  <Text style={styles.textLabel}>Strateji:</Text>
                  <Text style={styles.textValue}>{chart.strategy}</Text>
                </View>
                <View style={styles.textRow}>
                  <Text style={styles.textLabel}>İmza:</Text>
                  <Text style={styles.textValue}>{chart.signature}</Text>
                </View>
                <View style={styles.textRow}>
                  <Text style={styles.textLabel}>Benlik Olmayan Tema:</Text>
                  <Text style={styles.textValue}>{chart.notSelfTheme}</Text>
                </View>
                <View style={styles.textRow}>
                  <Text style={styles.textLabel}>İç Otorite:</Text>
                  <Text style={styles.textValue}>{chart.authority}</Text>
                </View>
                <View style={styles.textRow}>
                  <Text style={styles.textLabel}>Enkarnasyon Haçı:</Text>
                  <Text style={styles.textValue}>{chart.incarnationCross}</Text>
                </View>
              </BlurView>

            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(15, 23, 42, 0.85)' },
  scrollContent: { paddingTop: 60, paddingHorizontal: 10, paddingBottom: 40 },
  header: { marginBottom: 20, paddingHorizontal: 5, alignItems: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', color: COLORS.primary, marginBottom: 4 },
  subtitle: { fontSize: 13, color: COLORS.textMuted, fontStyle: 'italic' },
  formCard: { padding: 20, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', backgroundColor: COLORS.cardBg },
  formInfo: { color: COLORS.text, fontSize: 13, lineHeight: 20, marginBottom: 20 },
  label: { color: COLORS.text, fontSize: 13, fontWeight: '600', marginBottom: 8, marginTop: 15 },
  input: { backgroundColor: 'rgba(255,255,255,0.05)', color: COLORS.text, padding: 15, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', fontSize: 15 },
  button: { backgroundColor: COLORS.primary, padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 30 },
  buttonText: { color: '#2A1635', fontSize: 16, fontWeight: 'bold' },
  resetButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  resetButtonText: { color: COLORS.primary, fontSize: 15, fontWeight: '600', marginLeft: 8 },
  chartNameTitle: { fontSize: 28, fontFamily: 'serif', color: COLORS.text, textAlign: 'center', marginBottom: 20 },
  
  suggestionsContainer: {
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    marginTop: -4,
    paddingTop: 4,
    maxHeight: 150,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  suggestionText: {
    fontSize: 15,
    color: COLORS.text
  },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '40%',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  modalOptionText: {
    fontSize: 16,
    color: COLORS.text,
    flex: 1,
  },
  
  visualLayout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 460,
    marginBottom: 20,
    alignItems: 'stretch'
  },
  sidebarColumn: {
    width: '18%',
    justifyContent: 'space-between',
    paddingVertical: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  sidebarTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  planetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: 2,
  },
  planetIcon: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  planetGate: {
    fontSize: 12,
    fontWeight: '700',
  },
  bodygraphWrapper: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary, // Sayfa başlığındaki mavi
    borderRadius: 8,
    overflow: 'hidden',
  },
  
  textAnalysisCard: {
    backgroundColor: 'rgba(42, 22, 53, 0.8)',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  textLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.primary,
    width: '40%',
  },
  textValue: {
    fontSize: 15,
    color: COLORS.text,
    flex: 1,
  }
});
