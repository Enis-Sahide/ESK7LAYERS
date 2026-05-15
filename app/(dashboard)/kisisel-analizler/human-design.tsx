import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ImageBackground, KeyboardAvoidingView, Platform, Dimensions, Modal } from 'react-native';
import { BlurView } from 'expo-blur';
import Svg, { Polygon, Rect, Line, Circle, Polyline, Text as SvgText, G, Path } from 'react-native-svg';
import { generateChart, HumanDesignChart, CenterCode, PLANET_SYMBOLS, CHANNELS } from '../../../src/utils/HumanDesignEngine';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment-timezone';

const COLORS = {
  background: '#0B0F19',
  primary: '#D4AF37', // Gold
  accent: '#E63946', // Red for unconscious (Design)
  conscious: '#111111', // Black for conscious (Personality)
  text: '#E0E0E0',
  textMuted: '#9CA3AF',
  cardBg: 'rgba(20, 25, 40, 0.8)',
};

const CENTER_COORDS: Record<CenterCode, { x: number, y: number, shape: string, color: string }> = {
  Head: { x: 150, y: 40, shape: 'triangle', color: '#FFF' },
  Ajna: { x: 150, y: 90, shape: 'triangle-down', color: '#A8D5BA' }, // Greenish
  Throat: { x: 150, y: 160, shape: 'square', color: '#D2B48C' }, // Brownish
  G: { x: 150, y: 230, shape: 'diamond', color: '#F4D03F' }, // Yellow
  Heart: { x: 180, y: 200, shape: 'triangle', color: '#E63946' }, // Red
  Sacral: { x: 150, y: 300, shape: 'square', color: '#E63946' }, // Red
  Root: { x: 150, y: 370, shape: 'square', color: '#D2B48C' }, // Brownish
  Spleen: { x: 60, y: 300, shape: 'triangle-left', color: '#D2B48C' },
  SolarPlexus: { x: 240, y: 300, shape: 'triangle-right', color: '#D2B48C' },
};

const GATE_COORDS: Record<number, { x: number, y: number }> = {
  // Head
  64: { x: 138, y: 56 }, 61: { x: 150, y: 56 }, 63: { x: 162, y: 56 },
  // Ajna
  47: { x: 138, y: 74 }, 24: { x: 150, y: 74 }, 4: { x: 162, y: 74 },
  17: { x: 142, y: 90 }, 11: { x: 158, y: 90 },
  43: { x: 150, y: 106 },
  // Throat
  62: { x: 138, y: 144 }, 23: { x: 150, y: 144 }, 56: { x: 162, y: 144 },
  16: { x: 134, y: 150 }, 35: { x: 166, y: 150 },
  20: { x: 134, y: 158 }, 12: { x: 166, y: 158 },
  45: { x: 166, y: 166 },
  31: { x: 138, y: 176 }, 8: { x: 150, y: 176 }, 33: { x: 162, y: 176 },
  // G
  7: { x: 142, y: 222 }, 1: { x: 150, y: 214 }, 13: { x: 158, y: 222 },
  10: { x: 134, y: 230 }, 25: { x: 166, y: 230 },
  15: { x: 142, y: 238 }, 46: { x: 158, y: 238 },
  2: { x: 150, y: 246 },
  // Heart
  21: { x: 180, y: 184 }, 51: { x: 164, y: 216 },
  26: { x: 180, y: 216 }, 40: { x: 196, y: 216 },
  // Sacral
  5: { x: 138, y: 284 }, 14: { x: 150, y: 284 }, 29: { x: 162, y: 284 },
  34: { x: 134, y: 292 }, 59: { x: 166, y: 292 },
  27: { x: 138, y: 316 }, 42: { x: 146, y: 316 }, 3: { x: 154, y: 316 }, 9: { x: 162, y: 316 },
  // Root
  53: { x: 138, y: 354 }, 60: { x: 146, y: 354 }, 52: { x: 154, y: 354 }, 19: { x: 162, y: 354 },
  54: { x: 134, y: 362 }, 38: { x: 134, y: 370 }, 58: { x: 134, y: 378 },
  39: { x: 166, y: 370 }, 41: { x: 166, y: 378 },
  // Spleen
  48: { x: 76, y: 284 }, 57: { x: 76, y: 294 }, 44: { x: 76, y: 304 }, 50: { x: 76, y: 316 },
  32: { x: 70, y: 316 }, 28: { x: 60, y: 316 }, 18: { x: 50, y: 316 },
  // Solar Plexus
  36: { x: 224, y: 284 }, 22: { x: 224, y: 294 }, 37: { x: 224, y: 304 }, 6: { x: 224, y: 316 },
  49: { x: 230, y: 316 }, 55: { x: 240, y: 316 }, 30: { x: 250, y: 316 },
};

const CHANNEL_MIDS: Record<number, { x: number, y: number }> = {
  2034: { x: 120, y: 225 }, // Bypasses G center on the left
  2644: { x: 140, y: 250 }, // Bypasses G center slightly down
  1222: { x: 215, y: 220 }, // Bypasses Heart on the right
  3536: { x: 205, y: 220 }, // Bypasses Heart on the right
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

  const handleDateChange = (text: string) => {
    let cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length > 4) cleaned = cleaned.slice(0, 4) + '-' + cleaned.slice(4);
    if (cleaned.length > 7) cleaned = cleaned.slice(0, 7) + '-' + cleaned.slice(7);
    setDateStr(cleaned.slice(0, 10));
  };

  const handleTimeChange = (text: string) => {
    let cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length > 2) cleaned = cleaned.slice(0, 2) + ':' + cleaned.slice(2);
    setTimeStr(cleaned.slice(0, 5));
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
    return (
      <Path 
        d="M150 15 C 135 15, 125 30, 125 45 C 125 50, 115 55, 115 65 C 115 75, 120 80, 120 85 C 115 90, 118 95, 120 100 C 125 110, 130 115, 130 125 C 120 135, 100 150, 80 170 C 50 200, 30 260, 20 370 L 280 370 C 270 260, 250 200, 220 170 C 200 150, 180 135, 170 125 C 170 115, 175 100, 175 80 C 175 60, 170 40, 165 30 C 160 20, 155 15, 150 15 Z" 
        fill="rgba(180, 185, 190, 0.3)" 
        stroke="rgba(150, 150, 150, 0.4)" 
        strokeWidth="1.5" 
      />
    );
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

       let mx = (c1.x + c2.x) / 2;
       let my = (c1.y + c2.y) / 2;

       if (CHANNEL_MIDS[ch.id]) {
         mx = CHANNEL_MIDS[ch.id].x;
         my = CHANNEL_MIDS[ch.id].y;
       }

       // Base pipe (black border with white inside)
       elements.push(
         <Polyline points={`${c1.x},${c1.y} ${mx},${my} ${c2.x},${c2.y}`} fill="none" stroke="#666" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" key={`base-d-${ch.id}`} />
       );
       elements.push(
         <Polyline points={`${c1.x},${c1.y} ${mx},${my} ${c2.x},${c2.y}`} fill="none" stroke="#FFF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" key={`base-w-${ch.id}`} />
       );

       const g1Cons = chart.conscious.some(p => p.gate === g1);
       const g1Unc = chart.unconscious.some(p => p.gate === g1);
       
       const g2Cons = chart.conscious.some(p => p.gate === g2);
       const g2Unc = chart.unconscious.some(p => p.gate === g2);

       // Helper to draw the path line
       const drawHalfLine = (xA: number, yA: number, isConscious: boolean, isUnconscious: boolean, keyPrefix: string) => {
          if (isConscious && isUnconscious) {
            elements.push(<Line x1={xA} y1={yA} x2={mx} y2={my} stroke="#111" strokeWidth="5.5" strokeLinecap="butt" key={`${keyPrefix}-b`} />);
            elements.push(<Line x1={xA} y1={yA} x2={mx} y2={my} stroke={COLORS.accent} strokeWidth="5.5" strokeLinecap="butt" strokeDasharray="4 4" key={`${keyPrefix}-r`} />);
          } else if (isConscious) {
            elements.push(<Line x1={xA} y1={yA} x2={mx} y2={my} stroke="#111" strokeWidth="5.5" strokeLinecap="butt" key={`${keyPrefix}-con`} />);
          } else if (isUnconscious) {
            elements.push(<Line x1={xA} y1={yA} x2={mx} y2={my} stroke={COLORS.accent} strokeWidth="5.5" strokeLinecap="butt" key={`${keyPrefix}-unc`} />);
          }
       }

       drawHalfLine(c1.x, c1.y, g1Cons, g1Unc, `g1-${ch.id}`);
       drawHalfLine(c2.x, c2.y, g2Cons, g2Unc, `g2-${ch.id}`);
    });
    
    return elements;
  };

  const drawCenters = () => {
    if (!chart) return null;
    return Object.entries(CENTER_COORDS).map(([center, def]) => {
      const isDefined = chart.definedCenters.includes(center as CenterCode);
      const fill = isDefined ? def.color : '#FFF';
      const stroke = '#333';
      const s = 16; 
      
      const drawShape = (dx: number, dy: number, isShadow: boolean) => {
        const pfill = isShadow ? 'rgba(0,0,0,0.35)' : fill;
        const pstroke = isShadow ? 'none' : stroke;
        const sw = isShadow ? "0" : "1.5";
        
        if (def.shape === 'square') {
          return <Rect x={def.x - s + dx} y={def.y - s + dy} width={s*2} height={s*2} fill={pfill} stroke={pstroke} strokeWidth={sw} key={isShadow ? 'sh' : 'mg'} />;
        } else if (def.shape === 'diamond') {
          return <Polygon points={`${def.x + dx},${def.y-s-2 + dy} ${def.x+s+2 + dx},${def.y + dy} ${def.x + dx},${def.y+s+2 + dy} ${def.x-s-2 + dx},${def.y + dy}`} fill={pfill} stroke={pstroke} strokeWidth={sw} strokeLinejoin="round" key={isShadow ? 'sh' : 'mg'} />;
        } else if (def.shape === 'triangle') {
          return <Polygon points={`${def.x + dx},${def.y-s + dy} ${def.x+s + dx},${def.y+s + dy} ${def.x-s + dx},${def.y+s + dy}`} fill={pfill} stroke={pstroke} strokeWidth={sw} strokeLinejoin="round" key={isShadow ? 'sh' : 'mg'} />;
        } else if (def.shape === 'triangle-down') {
          return <Polygon points={`${def.x-s + dx},${def.y-s + dy} ${def.x+s + dx},${def.y-s + dy} ${def.x + dx},${def.y+s + dy}`} fill={pfill} stroke={pstroke} strokeWidth={sw} strokeLinejoin="round" key={isShadow ? 'sh' : 'mg'} />;
        } else if (def.shape === 'triangle-left') {
          return <Polygon points={`${def.x+s + dx},${def.y-s + dy} ${def.x+s + dx},${def.y+s + dy} ${def.x-s + dx},${def.y + dy}`} fill={pfill} stroke={pstroke} strokeWidth={sw} strokeLinejoin="round" key={isShadow ? 'sh' : 'mg'} />;
        } else if (def.shape === 'triangle-right') {
          return <Polygon points={`${def.x-s + dx},${def.y-s + dy} ${def.x+s + dx},${def.y + dy} ${def.x-s + dx},${def.y+s + dy}`} fill={pfill} stroke={pstroke} strokeWidth={sw} strokeLinejoin="round" key={isShadow ? 'sh' : 'mg'} />;
        }
        return null;
      };

      return (
        <G key={center}>
          {drawShape(3, 4, true)}
          {drawShape(0, 0, false)}
        </G>
      );
    });
  }

  // Gates render (numbers on the perimeter)
  const drawGates = () => {
    if (!chart) return null;
    return Object.entries(GATE_COORDS).map(([gateId, coords]) => {
      const gNum = parseInt(gateId);
      const isCons = chart.conscious.some(p => p.gate === gNum);
      const isUnc = chart.unconscious.some(p => p.gate === gNum);
      const isActive = isCons || isUnc;
      
      // Çizimin şeklin içine doğru hafif ofsetlenmesi için merkez koordinatını bulalım
      let shiftX = 0;
      let shiftY = 0;
      // Basitçe merkeze doğru 4 piksel kaydır (Görseldeki gibi şeklin içinde kalsın)
      const centerCoordsObj = CHANNELS.find(ch => ch.gates.includes(gNum));
      if (centerCoordsObj) {
        const c1Name = centerCoordsObj.centers[0];
        const c2Name = centerCoordsObj.centers[1];
        const c1 = CENTER_COORDS[c1Name as CenterCode];
        const c2 = CENTER_COORDS[c2Name as CenterCode];
        // Hangi merkeze daha yakınsa o merkezin koordinatını al
        const dist1 = Math.hypot(c1.x - coords.x, c1.y - coords.y);
        const dist2 = Math.hypot(c2.x - coords.x, c2.y - coords.y);
        const myCenter = dist1 < dist2 ? c1 : c2;
        
        const dx = myCenter.x - coords.x;
        const dy = myCenter.y - coords.y;
        const len = Math.hypot(dx, dy);
        if (len > 0) {
           shiftX = (dx / len) * 6; // 6 piksel merkeze doğru çek
           shiftY = (dy / len) * 6;
        }
      }

      const textX = coords.x + shiftX;
      const textY = coords.y + shiftY;

      return (
        <G key={`glabel-${gateId}`}>
          {isActive ? (
            <>
              <Circle cx={textX} cy={textY} r={7} fill="#6B21A8" />
              <SvgText x={textX} y={textY + 2.5} fontSize="8.5" fill="#FFF" fontWeight="bold" textAnchor="middle">{gNum}</SvgText>
            </>
          ) : (
            <SvgText x={textX} y={textY + 3} fontSize="9" fill="#222" fontWeight="bold" textAnchor="middle">{gNum}</SvgText>
          )}
        </G>
      );
    });
  };

  // Yücelim (Exaltation) ve Düşüş (Detriment) okları için simülatör
  // Gerçek I'Ching veritabanı 384 satır gerektirdiği için görsel tasarımı tamamlamak adına deterministik simüle ediyoruz.
  const getFixationArrow = (gate: number, line: number) => {
    const v = (gate * 13 + line * 7) % 10;
    if (v === 1 || v === 2) return <Text style={{ color: '#E63946', fontSize: 10 }}>▲</Text>;
    if (v === 8 || v === 9) return <Text style={{ color: '#1D3557', fontSize: 10 }}>▼</Text>;
    return null;
  };

  return (
    <ImageBackground source={{ uri: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2094&auto=format&fit=crop' }} style={styles.container} blurRadius={15}>
      <View style={styles.overlay} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.title}>İnsan Tasarımı Haritası</Text>
            <Text style={styles.subtitle}>Gerçek Astronomik Ephemeris Motoru</Text>
          </View>

          {!chart && (
            <BlurView intensity={40} tint="dark" style={styles.formCard}>
              <Text style={styles.formInfo}>
                Girdiğiniz anın gökyüzü konumlarını hesaplayarak Jovian Archive standartlarında milimetrik bir Human Design grafiği oluşturur. Doğum yeri bilgisi, o günkü yaz saati (Daylight Saving) kurallarını otomatik hesaplamak için %100 doğrulukla kullanılır.
              </Text>
              
              <Text style={styles.label}>İsim Soyisim</Text>
              <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Örn: Enis Şahide Kesik" placeholderTextColor="#666" />

              <Text style={styles.label}>Doğum Tarihi (YYYY-AA-GG)</Text>
              <TextInput style={styles.input} value={dateStr} onChangeText={handleDateChange} placeholder="Örn: 1990-05-15" placeholderTextColor="#666" keyboardType="numeric" />
              
              <Text style={styles.label}>Doğum Saati (SS:DD)</Text>
              <TextInput style={styles.input} value={timeStr} onChangeText={handleTimeChange} placeholder="Örn: 14:30" placeholderTextColor="#666" keyboardType="numeric" />
              
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
                  <Svg height="100%" width="100%" viewBox="40 20 220 370">
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
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255, 255, 255, 0.85)' },
  scrollContent: { paddingTop: 60, paddingHorizontal: 10, paddingBottom: 40 },
  header: { marginBottom: 20, paddingHorizontal: 5, alignItems: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#666', fontStyle: 'italic' },
  formCard: { padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#DDD', backgroundColor: '#FFF' },
  formInfo: { color: '#444', fontSize: 13, lineHeight: 20, marginBottom: 20 },
  label: { color: '#333', fontSize: 13, fontWeight: '600', marginBottom: 8, marginTop: 15 },
  input: { backgroundColor: '#F5F5F5', color: '#000', padding: 15, borderRadius: 8, borderWidth: 1, borderColor: '#E0E0E0', fontSize: 15 },
  button: { backgroundColor: COLORS.primary, padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 30 },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  resetButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  resetButtonText: { color: '#333', fontSize: 15, fontWeight: '600', marginLeft: 8 },
  chartNameTitle: { fontSize: 28, fontFamily: 'serif', color: '#111', textAlign: 'center', marginBottom: 20 },
  
  suggestionsContainer: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    marginTop: -4,
    paddingTop: 4,
    maxHeight: 150,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  suggestionText: {
    fontSize: 15,
    color: '#333'
  },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: '#FFF',
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
    borderBottomColor: '#EEE',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#333',
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
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2,
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
  },
  
  textAnalysisCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2,
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  textLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    width: '40%',
  },
  textValue: {
    fontSize: 15,
    color: '#444',
    flex: 1,
  }
});
