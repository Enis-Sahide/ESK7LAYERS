import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ImageBackground, KeyboardAvoidingView, Platform, Dimensions, Modal, Keyboard } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Polygon, Rect, Line, Circle, Polyline, Text as SvgText, G, Path, Image as SvgImage } from 'react-native-svg';
import { generateChart, HumanDesignChart, CenterCode, PLANET_SYMBOLS, CHANNELS } from '@/src/features/human-design/engine/HumanDesignEngine';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import moment from 'moment-timezone';
import tzlookup from 'tz-lookup';
import { useContent } from '@/src/core/content/useContent';

const API_BASE_URL = 'https://7layers.tr/api';

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
  Head: { x: 200, y: 45, shape: 'triangle', color: '#F4D03F', s: 28 },
  Ajna: { x: 200, y: 115, shape: 'triangle-down', color: '#A8D5BA', s: 28 },
  Throat: { x: 200, y: 190, shape: 'square', color: '#D2B48C', s: 25 },
  G: { x: 200, y: 300, shape: 'diamond', color: '#F4D03F', s: 35 },
  Heart: { x: 255, y: 340, shape: 'triangle', color: '#E1464F', s: 24 },
  Sacral: { x: 200, y: 400, shape: 'square', color: '#E1464F', s: 25 },
  Root: { x: 200, y: 480, shape: 'square', color: '#D2B48C', s: 25 },
  Spleen: { x: 90, y: 390, shape: 'triangle-right', color: '#D2B48C', s: 30 },
  SolarPlexus: { x: 310, y: 390, shape: 'triangle-left', color: '#D2B48C', s: 30 },
};

const GATE_COORDS: Record<number, { x: number, y: number }> = {
  // Head
  64: { x: 183, y: 70 }, 61: { x: 200, y: 70 }, 63: { x: 217, y: 70 },
  // Ajna
  47: { x: 183, y: 90 }, 24: { x: 200, y: 90 }, 4: { x: 217, y: 90 },
  17: { x: 183, y: 109 }, 43: { x: 200, y: 136 }, 11: { x: 217, y: 109 },
  // Throat
  62: { x: 183, y: 168 }, 23: { x: 200, y: 168 }, 56: { x: 217, y: 168 },
  16: { x: 178, y: 176 }, 35: { x: 222, y: 176 },
  20: { x: 178, y: 190 }, 12: { x: 222, y: 190 },
  45: { x: 222, y: 204 },
  31: { x: 186, y: 212 }, 8: { x: 200, y: 212 }, 33: { x: 214, y: 212 },
  // G
  7: { x: 186, y: 279 }, 1: { x: 200, y: 272 }, 13: { x: 214, y: 279 },
  10: { x: 172, y: 300 }, 25: { x: 228, y: 300 },
  15: { x: 186, y: 321 }, 2: { x: 200, y: 328 }, 46: { x: 214, y: 321 },
  // Heart
  21: { x: 255, y: 322 }, 51: { x: 240, y: 350 },
  26: { x: 240, y: 360 }, 40: { x: 270, y: 360 },
  // Sacral
  5: { x: 186, y: 378 }, 14: { x: 200, y: 378 }, 29: { x: 214, y: 378 },
  34: { x: 178, y: 386 }, 27: { x: 178, y: 414 },
  59: { x: 222, y: 400 },
  42: { x: 186, y: 422 }, 3: { x: 200, y: 422 }, 9: { x: 214, y: 422 },
  // Root
  53: { x: 186, y: 458 }, 60: { x: 200, y: 458 }, 52: { x: 214, y: 458 },
  54: { x: 178, y: 468 }, 19: { x: 222, y: 468 },
  38: { x: 178, y: 480 }, 39: { x: 222, y: 480 },
  58: { x: 178, y: 492 }, 41: { x: 222, y: 492 },
  // Spleen
  48: { x: 65, y: 362 }, 57: { x: 85, y: 372 }, 44: { x: 115, y: 387 },
  50: { x: 105, y: 398 }, 32: { x: 85, y: 408 }, 28: { x: 75, y: 412 }, 18: { x: 65, y: 418 },
  // Solar Plexus
  36: { x: 335, y: 362 }, 22: { x: 315, y: 372 }, 37: { x: 295, y: 382 },
  6: { x: 285, y: 387 }, 49: { x: 295, y: 398 }, 55: { x: 315, y: 408 }, 30: { x: 335, y: 418 },
};

export default function HumanDesignScreen() {
  const router = useRouter();
  const [dateStr, setDateStr] = useState('');
  const [timeStr, setTimeStr] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('İstanbul');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedCityData, setSelectedCityData] = useState<any>({
    name: 'İstanbul',
    lat: 41.0082,
    lon: 28.9784,
    tz: 'Europe/Istanbul',
    country: 'Türkiye'
  });
  
  const [chart, setChart] = useState<HumanDesignChart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeGateId, setActiveGateId] = useState<number | null>(null);

  const { data: gatesData } = useContent<any[]>('/api/content/hd-gates');
  const activeGateData = activeGateId && gatesData ? gatesData.find((g: any) => g.id === activeGateId) : null;

  const dateInputRef = useRef<TextInput>(null);
  const timeInputRef = useRef<TextInput>(null);

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
          } else {
            setSuggestions([]);
          }
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Geocoding API Error:", error);
        setSuggestions([]);
      }
    };

    const debounceTimer = setTimeout(fetchCities, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

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

  const handleCalculate = async () => {
    try {
      setIsLoading(true);
      if (dateStr.length !== 10 || timeStr.length !== 5) {
        Alert.alert("Hata", "Lütfen tarihi (YYYY-AA-GG) ve saati (SS:DD) tam formatında girin.");
        setIsLoading(false);
        return;
      }

      const [year, month, day] = dateStr.split('-').map(Number);
      const [hour, minute] = timeStr.split(':').map(Number);

      if (!year || !month || !day || isNaN(hour) || isNaN(minute)) {
        Alert.alert("Geçersiz Format", "Tarih YYYY-AA-GG, Saat SS:DD formatında olmalıdır.");
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/human-design`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          year,
          month,
          day,
          hour,
          minute,
          lat: selectedCityData.lat,
          lon: selectedCityData.lon,
          tz: selectedCityData.tz
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Human Design API isteği başarısız oldu.');
      }

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

    // Render 16-48 last to keep it clean on top
    const sortedChannels = [...CHANNELS].sort((a, b) => {
      if (a.id === 1648) return 1;
      if (b.id === 1648) return -1;
      return 0;
    });

    // 1. Background channels (white/grey paths)
    sortedChannels.forEach(ch => {
       const g1 = ch.gates[0];
       const g2 = ch.gates[1];
       const c1 = GATE_COORDS[g1];
       const c2 = GATE_COORDS[g2];
       if (!c1 || !c2) return;
       let p0x = c1.x, p0y = c1.y;
       let p2x = c2.x, p2y = c2.y;

       let bgPathD = `M ${p0x} ${p0y} L ${p2x} ${p2y}`;
       
       // Curved Integration Paths
       if ([1020, 1034, 2034, 2057, 1648].includes(ch.id)) {
         let cx = 0, cy = 0;
         if (ch.id === 1020) { cx = 120; cy = p2y; }
         else if (ch.id === 1034) { cx = 60; cy = p0y; }
         else if (ch.id === 2034) { cx = 80; cy = p0y; }
         else if (ch.id === 2057) { cx = 40; cy = p0y; }
         else if (ch.id === 1648) { cx = 0; cy = Math.min(p0y, p2y); }
         bgPathD = `M ${p0x} ${p0y} Q ${cx} ${cy} ${p2x} ${p2y}`;
       }

       elements.push(<Path d={bgPathD} stroke="#94A3B8" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" key={`bg-out-${ch.id}`} />);
       elements.push(<Path d={bgPathD} stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" key={`bg-${ch.id}`} />);
    });
    
    // 2. Active channels (colored paths)
    sortedChannels.forEach(ch => {
       const g1 = ch.gates[0];
       const g2 = ch.gates[1];
       const c1 = GATE_COORDS[g1];
       const c2 = GATE_COORDS[g2];
       if (!c1 || !c2) return;
       let p0x = c1.x, p0y = c1.y;
       let p2x = c2.x, p2y = c2.y;

       const mx = (p0x + p2x) / 2;
       const my = (p0y + p2y) / 2;
       let g1Path = `M ${p0x} ${p0y} L ${mx} ${my}`;
       let g2Path = `M ${p2x} ${p2y} L ${mx} ${my}`;

       // Curved Integration Paths
       if ([1020, 1034, 2034, 2057, 1648].includes(ch.id)) {
         let cx = 0, cy = 0;
         if (ch.id === 1020) { cx = 120; cy = p2y; }
         else if (ch.id === 1034) { cx = 60; cy = p0y; }
         else if (ch.id === 2034) { cx = 80; cy = p0y; }
         else if (ch.id === 2057) { cx = 40; cy = p0y; }
         else if (ch.id === 1648) { cx = 0; cy = Math.min(p0y, p2y); }
         
         const pmx = 0.25 * p0x + 0.5 * cx + 0.25 * p2x;
         const pmy = 0.25 * p0y + 0.5 * cy + 0.25 * p2y;
         
         const c1x = 0.5 * (p0x + cx), c1y = 0.5 * (p0y + cy);
         const c2x = 0.5 * (cx + p2x), c2y = 0.5 * (cy + p2y);

         g1Path = `M ${p0x} ${p0y} Q ${c1x} ${c1y} ${pmx} ${pmy}`;
         g2Path = `M ${p2x} ${p2y} Q ${c2x} ${c2y} ${pmx} ${pmy}`;
       }

       const g1Cons = chart.conscious.some(p => p.gate === g1);
       const g1Unc = chart.unconscious.some(p => p.gate === g1);
       const g2Cons = chart.conscious.some(p => p.gate === g2);
       const g2Unc = chart.unconscious.some(p => p.gate === g2);

       const drawHalf = (pathD: string, isConscious: boolean, isUnconscious: boolean, keyPrefix: string) => {
          if (!isConscious && !isUnconscious) return;
          
          elements.push(<Path d={pathD} stroke="#000" strokeWidth="8" strokeLinecap="butt" strokeLinejoin="round" fill="none" key={`${keyPrefix}-outline`} />);
          
          if (isConscious && isUnconscious) {
            elements.push(<Path d={pathD} stroke="#111" strokeWidth="6" strokeLinecap="butt" strokeLinejoin="round" fill="none" key={`${keyPrefix}-b`} />);
            elements.push(<Path d={pathD} stroke={COLORS.accent} strokeWidth="6" strokeLinecap="butt" strokeLinejoin="round" strokeDasharray="3 3" fill="none" key={`${keyPrefix}-r`} />);
          } else if (isConscious) {
            elements.push(<Path d={pathD} stroke="#111" strokeWidth="6" strokeLinecap="butt" strokeLinejoin="round" fill="none" key={`${keyPrefix}-con`} />);
          } else if (isUnconscious) {
            elements.push(<Path d={pathD} stroke={COLORS.accent} strokeWidth="6" strokeLinecap="butt" strokeLinejoin="round" fill="none" key={`${keyPrefix}-unc`} />);
          }
       };

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
      const stroke = isDefined ? 'none' : '#94A3B8';
      const s = def.s;
      
      const drawShape = () => {
        const sw = isDefined ? 0 : 1;
        if (def.shape === 'square') {
          return <Rect x={def.x - s} y={def.y - s} width={s*2} height={s*2} fill={fill} stroke={stroke} strokeWidth={sw} key="mg" />;
        } else if (def.shape === 'diamond') {
          return <Polygon points={`${def.x},${def.y-s-2} ${def.x+s+2},${def.y} ${def.x},${def.y+s+2} ${def.x-s-2},${def.y}`} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" key="mg" />;
        } else if (def.shape === 'triangle') {
          return <Polygon points={`${def.x},${def.y-s} ${def.x+s},${def.y+s} ${def.x-s},${def.y+s}`} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" key="mg" />;
        } else if (def.shape === 'triangle-down') {
          return <Polygon points={`${def.x-s},${def.y-s} ${def.x+s},${def.y-s} ${def.x},${def.y+s}`} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" key="mg" />;
        } else if (def.shape === 'triangle-left') {
          return <Polygon points={`${def.x+s},${def.y-s} ${def.x+s},${def.y+s} ${def.x-s},${def.y}`} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" key="mg" />;
        } else if (def.shape === 'triangle-right') {
          return <Polygon points={`${def.x-s},${def.y-s} ${def.x+s},${def.y} ${def.x-s},${def.y+s}`} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" key="mg" />;
        }
        return null;
      };

      return (
        <G key={center}>
          {drawShape()}
        </G>
      );
    });
  };

  const drawGates = () => {
    if (!chart) return null;
    return Object.entries(GATE_COORDS).map(([gateId, coords]) => {
      const gNum = parseInt(gateId);
      const isCons = chart.conscious.some(p => p.gate === gNum);
      const isUnc = chart.unconscious.some(p => p.gate === gNum);
      const isActive = isCons || isUnc;
      
      const textX = coords.x;
      const textY = coords.y;

      return (
        <G key={`glabel-${gateId}`} onPress={() => setActiveGateId(gNum)}>
          {isActive && <Circle cx={textX} cy={textY} r={5.5} fill="#000" stroke="none" />}
          <SvgText x={textX} y={textY + 3.0} fontSize="8" fill={isActive ? "#FFF" : "#64748B"} fontWeight={isActive ? "900" : "bold"} textAnchor="middle">{gNum}</SvgText>
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
              
              <Text style={styles.label}>Doğum Şehri (Ara)</Text>
              <View style={{ zIndex: 99, position: 'relative' }}>
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
                  placeholder="Örn: İstanbul"
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
              
              <TouchableOpacity style={styles.button} onPress={handleCalculate} disabled={isLoading}>
                <Text style={styles.buttonText}>{isLoading ? 'Hesaplanıyor...' : 'Haritayı Hesapla'}</Text>
              </TouchableOpacity>
            </BlurView>
          )}

          {chart && (
            <View>
              <TouchableOpacity style={styles.resetButton} onPress={() => setChart(null)}>
                <Ionicons name="arrow-back" size={20} color={COLORS.primary} />
                <Text style={styles.resetButtonText}>Yeni Hesaplama</Text>
              </TouchableOpacity>

              <Text style={styles.chartNameTitle}>Kişisel Haritanız</Text>
              <Text style={styles.chartInfoText}>{dateStr} • {timeStr} • {selectedCityData.name}</Text>

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
                <LinearGradient colors={['#e6c27a', '#c59b3f']} style={styles.bodygraphWrapper}>
                  <Svg width="100%" height="100%" viewBox="40 10 320 540">
                    {drawSilhouette()}
                    {drawChannels()}
                    {drawCenters()}
                    {drawGates()}
                  </Svg>
                </LinearGradient>

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

      {/* Modal for Gate Details */}
      <Modal visible={!!activeGateId} animationType="slide" transparent={true} onRequestClose={() => setActiveGateId(null)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setActiveGateId(null)}>
          <View style={styles.gateModalContent}>
            <View style={styles.gateModalHeader}>
              <View style={styles.gateBadge}>
                <Text style={styles.gateBadgeText}>{activeGateId}</Text>
              </View>
              <Text style={styles.gateModalTitle}>{activeGateData?.title}</Text>
              <TouchableOpacity onPress={() => setActiveGateId(null)}>
                <Ionicons name="close-circle" size={28} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
              <View style={styles.gateDetailBox}>
                <View style={styles.gateDetailRow}>
                  <Text style={styles.gateDetailLabel}>I Ching:</Text>
                  <Text style={styles.gateDetailValue}>{activeGateData?.iching}</Text>
                </View>
                <View style={styles.gateDetailRow}>
                  <Text style={styles.gateDetailLabel}>Astroloji:</Text>
                  <Text style={[styles.gateDetailValue, { color: COLORS.primary }]}>{activeGateData?.astrology}</Text>
                </View>
                <View style={styles.gateDetailRow}>
                  <Text style={styles.gateDetailLabel}>Biyoloji:</Text>
                  <Text style={styles.gateDetailValue}>{activeGateData?.biology}</Text>
                </View>
              </View>
              <Text style={styles.gateDescription}>{activeGateData?.description}</Text>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(15, 23, 42, 0.55)' },
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
  chartNameTitle: { fontSize: 28, fontFamily: 'serif', color: COLORS.text, textAlign: 'center', marginBottom: 6 },
  chartInfoText: { fontSize: 14, color: COLORS.textMuted, textAlign: 'center', marginBottom: 20, fontStyle: 'italic' },
  
  suggestionsContainer: {
    position: 'absolute',
    top: 55,
    left: 0,
    right: 0,
    backgroundColor: '#1E293B',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.4)',
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  suggestionText: {
    color: '#fff',
    fontSize: 14,
  },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  gateModalContent: {
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '60%',
    padding: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  gateModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    paddingBottom: 15,
  },
  gateBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(14, 165, 233, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.4)',
  },
  gateBadgeText: {
    color: '#0EA5E9',
    fontWeight: 'bold',
    fontSize: 16,
  },
  gateModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    flex: 1,
  },
  gateDetailBox: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: 20,
  },
  gateDetailRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  gateDetailLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#9CA3AF',
    width: 80,
  },
  gateDetailValue: {
    fontSize: 14,
    color: '#FFF',
    flex: 1,
  },
  gateDescription: {
    fontSize: 15,
    color: '#E0E0E0',
    lineHeight: 24,
    fontStyle: 'italic',
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
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 5,
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
