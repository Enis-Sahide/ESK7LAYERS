import SacredBackground from '@/components/SacredBackground';
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ImageBackground, KeyboardAvoidingView, Platform, Dimensions, Modal, LayoutAnimation, UIManager } from 'react-native';
import { BlurView } from 'expo-blur';
import Svg, { Circle, Line, Text as SvgText, G, Path } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as moment from 'moment-timezone';
import { fetchAstrologyChart, NatalChartData, ASTRO_CITIES, ZodiacSign } from '@/src/features/astrology/api/astrologyClient';
import { getFullPlanetInterpretation, getHouseCuspInterpretation } from '@/src/features/astrology/engine/AstrologyInterpretations';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const AVAILABLE_COUNTRIES = [
  'Türkiye', 'Almanya', 'Amerika Birleşik Devletleri', 'İngiltere', 'Fransa', 
  'Hollanda', 'Avusturya', 'Belçika', 'İsviçre', 'Azerbaycan', 'Kıbrıs'
];

const { width } = Dimensions.get('window');
const CHART_SIZE = width - 20;
const CENTER = CHART_SIZE / 2;
const RADIUS = CENTER - 50; // Inner working radius

const COLORS = {
  background: '#0F172A',
  primary: '#D4AF37', // Gold
  text: '#E0E0E0',
  textMuted: '#9CA3AF',
  cardBg: 'rgba(20, 25, 40, 0.85)',
  border: 'rgba(212, 175, 55, 0.3)',
};

const ZODIAC_COLORS: Record<ZodiacSign, string> = {
  'Koç': '#FF453A', 'Aslan': '#FF453A', 'Yay': '#FF453A',
  'Boğa': '#32D74B', 'Başak': '#32D74B', 'Oğlak': '#32D74B',
  'İkizler': '#FFD60A', 'Terazi': '#FFD60A', 'Kova': '#FFD60A',
  'Yengeç': '#0A84FF', 'Akrep': '#0A84FF', 'Balık': '#0A84FF',
};

const ZODIAC_SYMBOLS: Record<ZodiacSign, string> = {
  'Koç': '♈', 'Boğa': '♉', 'İkizler': '♊', 'Yengeç': '♋', 
  'Aslan': '♌', 'Başak': '♍', 'Terazi': '♎', 'Akrep': '♏', 
  'Yay': '♐', 'Oğlak': '♑', 'Kova': '♒', 'Balık': '♓'
};

const ZODIAC_ORDER: ZodiacSign[] = [
  'Koç', 'Boğa', 'İkizler', 'Yengeç', 'Aslan', 'Başak', 
  'Terazi', 'Akrep', 'Yay', 'Oğlak', 'Kova', 'Balık'
];

const PLANET_SYMBOLS: Record<string, string> = {
  'Güneş': '☉', 'Ay': '☽', 'Merkür': '☿', 'Venüs': '♀', 'Mars': '♂', 
  'Jüpiter': '♃', 'Satürn': '♄', 'Uranüs': '♅', 'Neptün': '♆', 'Plüton': '♇',
  'Yükselen (ASC)': 'ASC', 'Tepe Noktası (MC)': 'MC', 'Kuzey Ay Düğümü': '☊',
  'Vertex (Vx)': 'Vx', 'Şans Noktası (POF)': '⊗'
};

const ASPECT_SYMBOLS: Record<string, string> = {
  'Kavuşum': '☌', 'Sekstil': '⚹', 'Kare': '□', 'Üçgen': '△', 'Karşıt': '☍', 'Görmeyen': '⚻'
};

const ASPECT_COLORS: Record<string, string> = {
  'Kavuşum': '#D4AF37', 'Sekstil': '#0A84FF', 'Kare': '#FF453A', 'Üçgen': '#32D74B', 'Karşıt': '#FF453A', 'Görmeyen': '#0A84FF'
};

export default function AstrolojiAnalysisScreen() {
  const router = useRouter();
  const [dateStr, setDateStr] = useState('');
  const [timeStr, setTimeStr] = useState('');
  const [country, setCountry] = useState('Türkiye');
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [cityKey, setCityKey] = useState('İstanbul');
  const [selectedInterp, setSelectedInterp] = useState<{ title: string, content: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('İstanbul');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chartType, setChartType] = useState<'Tropikal' | 'Drakonik'>('Tropikal');
  const [chart, setChart] = useState<NatalChartData | null>(null);
  const [expandedAspects, setExpandedAspects] = useState(true);
  const [expandedPlanets, setExpandedPlanets] = useState(true);
  const [expandedHouses, setExpandedHouses] = useState(true);

  const toggleSection = (section: 'aspects' | 'planets' | 'houses') => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (section === 'aspects') setExpandedAspects(!expandedAspects);
    else if (section === 'planets') setExpandedPlanets(!expandedPlanets);
    else if (section === 'houses') setExpandedHouses(!expandedHouses);
  };

  const filteredCities = ASTRO_CITIES.filter(c => 
    c.country === country &&
    c.name.toLocaleLowerCase('tr-TR').startsWith(searchQuery.toLocaleLowerCase('tr-TR'))
  ).map(c => c.name).slice(0, 4);

  const dateInputRef = useRef<TextInput>(null);
  const timeInputRef = useRef<TextInput>(null);

  const handleDateChange = (text: string) => {
    let cleaned = text.replace(/\D/g, '');
    let formatted = '';
    if (cleaned.length > 0) formatted = cleaned.substring(0, 4);
    if (cleaned.length > 4) formatted += '-' + cleaned.substring(4, 6);
    if (cleaned.length > 6) formatted += '-' + cleaned.substring(6, 8);
    setDateStr(formatted);
    if (cleaned.length === 8) timeInputRef.current?.focus();
  };

  const handleTimeChange = (text: string) => {
    let cleaned = text.replace(/\D/g, '');
    let formatted = '';
    if (cleaned.length > 0) formatted = cleaned.substring(0, 2);
    if (cleaned.length > 2) formatted += ':' + cleaned.substring(2, 4);
    setTimeStr(formatted);
  };

  const handleCalculate = async () => {
    if (!dateStr || !timeStr) {
      Alert.alert("Hata", "Lütfen doğum tarihi ve saatini girin.");
      return;
    }
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hour, minute] = timeStr.split(':').map(Number);

    if (!year || !month || !day || isNaN(hour) || isNaN(minute)) {
      Alert.alert("Geçersiz Format", "Tarih YYYY-AA-GG, Saat SS:DD formatında olmalıdır.");
      return;
    }

    setIsLoading(true);
    try {
      let birthDate;
      let finalCity = cityKey;
      
      const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      
      const matchedCity = ASTRO_CITIES.find(c => c.name.toLocaleLowerCase('tr-TR') === searchQuery.trim().toLocaleLowerCase('tr-TR'));
      if (matchedCity) {
        finalCity = matchedCity.name;
      }

      if (moment && typeof moment.tz === 'function') {
        const m = moment.tz(dateString, "YYYY-MM-DD HH:mm", "Europe/Istanbul");
        birthDate = m.toDate();
      } else {
        birthDate = new Date(year, month - 1, day, hour, minute);
      }
      
      const result = await fetchAstrologyChart(birthDate, finalCity);
      setChart(result);
    } catch (error) {
      Alert.alert("Hesaplama Hatası", "Harita sunucudan alınırken bir sorun oluştu.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderSvgWheel = () => {
    if (!chart) return null;

    const ascLon = chart.ascendant.longitude;
    const getX = (lon: number, r: number) => CENTER + r * Math.cos((180 + ascLon - lon) * Math.PI / 180);
    const getY = (lon: number, r: number) => CENTER + r * Math.sin((180 + ascLon - lon) * Math.PI / 180);

    const R_TICKS_OUTER = RADIUS + 40;
    const R_TICKS_INNER = RADIUS + 35;
    const R_ZODIAC_OUTER = RADIUS + 35;
    const R_ZODIAC_INNER = RADIUS + 10;
    const R_CUSP_NUM = RADIUS + 45;
    const R_PLANETS = RADIUS - 15;
    const R_ASPECTS = RADIUS - 40;

    return (
      <Svg width={CHART_SIZE} height={CHART_SIZE}>
        {/* Aspect Lines */}
        <Circle cx={CENTER} cy={CENTER} r={R_ASPECTS} stroke={COLORS.border} strokeWidth="1" fill="rgba(0,0,0,0.4)" />
        {chart.aspects.filter(a => a.type !== 'Kavuşum').map((a, i) => {
          const p1 = chart.planets.find(p => p.name === a.planet1) || (a.planet1.includes('ASC') ? chart.ascendant : chart.midheaven);
          const p2 = chart.planets.find(p => p.name === a.planet2) || (a.planet2.includes('ASC') ? chart.ascendant : chart.midheaven);
          if (!p1 || !p2) return null;
          
          return (
            <Line 
              key={`asp-${i}`} 
              x1={getX(p1.longitude, R_ASPECTS)} 
              y1={getY(p1.longitude, R_ASPECTS)} 
              x2={getX(p2.longitude, R_ASPECTS)} 
              y2={getY(p2.longitude, R_ASPECTS)} 
              stroke={ASPECT_COLORS[a.type] || COLORS.border} 
              strokeWidth={a.isExact ? "1.5" : "0.5"} 
              opacity={0.7}
            />
          );
        })}

        {/* Inner Rings */}
        <Circle cx={CENTER} cy={CENTER} r={R_ZODIAC_INNER} stroke={COLORS.border} strokeWidth="1.5" fill="none" />
        <Circle cx={CENTER} cy={CENTER} r={R_ZODIAC_OUTER} stroke={COLORS.border} strokeWidth="1.5" fill="none" />
        <Circle cx={CENTER} cy={CENTER} r={R_TICKS_OUTER} stroke={COLORS.border} strokeWidth="1" fill="none" />

        {/* 360 Degree Ticks */}
        {Array.from({ length: 360 }).map((_, i) => {
          const isTen = i % 10 === 0;
          const isFive = i % 5 === 0;
          
          let length = 2; // 1 degree tick
          if (isTen) length = 6;
          else if (isFive) length = 4;
          
          const x1 = getX(i, R_TICKS_OUTER);
          const y1 = getY(i, R_TICKS_OUTER);
          const x2 = getX(i, R_TICKS_OUTER - length);
          const y2 = getY(i, R_TICKS_OUTER - length);

          return (
            <Line 
              key={`tick-${i}`} 
              x1={x1} 
              y1={y1} 
              x2={x2} 
              y2={y2} 
              stroke={isTen ? COLORS.primary : COLORS.border} 
              strokeWidth={isTen ? "1" : "0.5"} 
            />
          );
        })}

        {/* Zodiac Signs */}
        {Array.from({ length: 12 }).map((_, i) => {
          const signLon = i * 30; 
          const x1 = getX(signLon, R_ZODIAC_OUTER);
          const y1 = getY(signLon, R_ZODIAC_OUTER);
          const x2 = getX(signLon, R_ZODIAC_INNER);
          const y2 = getY(signLon, R_ZODIAC_INNER);
          
          const midLon = signLon + 15;
          const sx = getX(midLon, RADIUS + 22);
          const sy = getY(midLon, RADIUS + 22);
          
          const signName = ZODIAC_ORDER[i];

          return (
            <G key={`zodiac-${i}`}>
              <Line x1={x1} y1={y1} x2={x2} y2={y2} stroke={COLORS.border} strokeWidth="1" />
              <SvgText x={sx} y={sy + 6} fontSize="16" fill={ZODIAC_COLORS[signName]} textAnchor="middle" fontWeight="bold">
                {ZODIAC_SYMBOLS[signName]}
              </SvgText>
            </G>
          );
        })}

        {/* House Lines */}
        {chart.houses.map((h, i) => {
          const x1 = getX(h.longitude, R_ZODIAC_INNER);
          const y1 = getY(h.longitude, R_ZODIAC_INNER);
          const xOut = getX(h.longitude, R_TICKS_OUTER + 5);
          const yOut = getY(h.longitude, R_TICKS_OUTER + 5);
          const isAngle = h.house === 1 || h.house === 4 || h.house === 7 || h.house === 10;

          return (
            <G key={`house-${i}`}>
              <Line 
                x1={getX(h.longitude, R_ASPECTS)} 
                y1={getY(h.longitude, R_ASPECTS)} 
                x2={x1} 
                y2={y1} 
                stroke={isAngle ? COLORS.primary : COLORS.border} 
                strokeWidth={isAngle ? "2" : "1"} 
                strokeDasharray={isAngle ? "" : "4, 4"} 
              />
              <Line x1={getX(h.longitude, R_TICKS_OUTER)} y1={getY(h.longitude, R_TICKS_OUTER)} x2={xOut} y2={yOut} stroke={isAngle ? COLORS.primary : COLORS.border} strokeWidth={isAngle ? "2" : "1"} />
              <SvgText 
                x={getX(h.longitude, R_CUSP_NUM + (isAngle ? 5 : 0))} 
                y={getY(h.longitude, R_CUSP_NUM + (isAngle ? 5 : 0)) + 4} 
                fontSize={isAngle ? "12" : "10"} 
                fill={isAngle ? COLORS.primary : COLORS.textMuted} 
                textAnchor="middle"
                fontWeight={isAngle ? "bold" : "normal"}
              >
                {`${String(h.degreeInSign).padStart(2, '0')}° ${h.house}. ${String(h.minutes).padStart(2, '0')}'`}
              </SvgText>
            </G>
          );
        })}

        {/* Planets */}
        {chart.planets.map((p, i) => {
          // Stagger overlap
          let rOffset = 0;
          for(let j=0; j<i; j++) {
             if (Math.abs(p.longitude - chart.planets[j].longitude) < 5) rOffset += 18;
          }
          const px = getX(p.longitude, R_PLANETS - rOffset);
          const py = getY(p.longitude, R_PLANETS - rOffset);
          
          return (
            <G key={`planet-${i}`}>
              <Line x1={getX(p.longitude, R_ZODIAC_INNER)} y1={getY(p.longitude, R_ZODIAC_INNER)} x2={px} y2={py} stroke={COLORS.border} strokeWidth="0.5" strokeDasharray="1, 2" />
              <Circle cx={px} cy={py} r="10" fill={COLORS.background} stroke={COLORS.border} strokeWidth="1" />
              <SvgText x={px} y={py + 4} fontSize="12" fill={COLORS.primary} textAnchor="middle" fontWeight="bold">
                {PLANET_SYMBOLS[p.name]}
              </SvgText>
              <SvgText x={px + 15} y={py - 5} fontSize="9" fill={COLORS.textMuted} textAnchor="start">
                {`${p.degreeInSign}°${String(p.minutes).padStart(2,'0')}'`}
              </SvgText>
              {p.isRetrograde && (
                <SvgText x={px + 15} y={py + 5} fontSize="9" fill="#FF453A" textAnchor="start" fontWeight="bold">Rx</SvgText>
              )}
            </G>
          );
        })}
      </Svg>
    );
  };

  const renderAspectGrid = () => {
    if (!chart) return null;
    const bodies = [
      chart.planets.find(p => p.name === 'Güneş'),
      chart.planets.find(p => p.name === 'Ay'),
      chart.planets.find(p => p.name === 'Merkür'),
      chart.planets.find(p => p.name === 'Venüs'),
      chart.planets.find(p => p.name === 'Mars'),
      chart.planets.find(p => p.name === 'Jüpiter'),
      chart.planets.find(p => p.name === 'Satürn'),
      chart.planets.find(p => p.name === 'Uranüs'),
      chart.planets.find(p => p.name === 'Neptün'),
      chart.planets.find(p => p.name === 'Plüton'),
      chart.ascendant,
      chart.midheaven
    ].filter(Boolean) as (NatalChartData['planets'][0])[];

    return (
      <View style={styles.gridContainer}>
        {bodies.map((body, row) => (
          <View key={`row-${row}`} style={styles.gridRow}>
            <View style={styles.gridLabelCellRight}><Text style={styles.gridSymbol}>{PLANET_SYMBOLS[body.name] || body.name}</Text></View>
            {bodies.slice(0, row).map((colBody, col) => {
              const aspect = chart.aspects.find(a => 
                (a.planet1 === body.name && a.planet2 === colBody.name) || 
                (a.planet2 === body.name && a.planet1 === colBody.name)
              );
              return (
                <View key={`cell-${row}-${col}`} style={styles.gridCell}>
                  {aspect ? (
                    <Text style={[styles.gridAspectSymbol, { color: ASPECT_COLORS[aspect.type] }]}>
                      {ASPECT_SYMBOLS[aspect.type]}
                    </Text>
                  ) : null}
                </View>
              );
            })}
          </View>
        ))}
        <View style={styles.gridRow}>
          <View style={styles.gridLabelCellRight}></View>
          {bodies.slice(0, bodies.length - 1).map((colBody, col) => (
             <View key={`col-label-${col}`} style={styles.gridLabelCellBottom}>
               <Text style={styles.gridSymbol}>{PLANET_SYMBOLS[colBody.name] || colBody.name}</Text>
             </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <SacredBackground>
        <View style={StyleSheet.absoluteFill} />
        <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />

        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <TouchableOpacity 
              style={{ position: 'absolute', left: 0, top: 2, padding: 5 }} 
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={28} color={COLORS.primary} />
            </TouchableOpacity>
            <Text style={styles.title}>Ezoterik Doğum Haritası</Text>
            <Text style={styles.subtitle}>Kozmik Şifrenizi Çözün</Text>
          </View>

          {!chart ? (
            <BlurView intensity={20} tint="light" style={styles.formCard}>
              {/* FORM FIELDS REMAIN SAME */}
              <Text style={styles.label}>Doğum Tarihi (YYYY-AA-GG)</Text>
              <TextInput ref={dateInputRef} style={styles.input} value={dateStr} onChangeText={handleDateChange} placeholder="Örn: 1990-05-15" placeholderTextColor="#666" keyboardType="numeric" maxLength={10} returnKeyType="next" />
              <Text style={styles.label}>Doğum Saati (SS:DD)</Text>
              <TextInput ref={timeInputRef} style={styles.input} value={timeStr} onChangeText={handleTimeChange} placeholder="Örn: 14:30" placeholderTextColor="#666" keyboardType="numeric" maxLength={5} returnKeyType="done" />
              <Text style={styles.label}>Doğum Ülkesi</Text>
              <TouchableOpacity style={[styles.input, { justifyContent: 'center' }]} onPress={() => setShowCountryModal(true)}>
                <Text style={{ color: '#000', fontSize: 15 }}>{country}</Text>
              </TouchableOpacity>
              <Text style={styles.label}>Doğum Şehri (Ara)</Text>
              <View style={{ zIndex: 99 }}>
                <TextInput style={styles.input} value={searchQuery} onChangeText={(t) => { setSearchQuery(t); setShowSuggestions(true); }} onFocus={() => { if (searchQuery === 'İstanbul') setSearchQuery(''); setShowSuggestions(true); }} placeholder={`Örn: ${country === 'Türkiye' ? 'İstan...' : 'Berlin...'}`} placeholderTextColor="#666" />
                {showSuggestions && searchQuery.length > 0 && (
                  <View style={styles.suggestionsContainer}>
                    {filteredCities.length > 0 ? filteredCities.map((c, i) => (
                      <TouchableOpacity key={i} style={styles.suggestionItem} onPress={() => { setCityKey(c); setSearchQuery(c); setShowSuggestions(false); }}>
                        <Text style={styles.suggestionText}>{c}</Text>
                      </TouchableOpacity>
                    )) : (
                      <View style={styles.suggestionItem}><Text style={styles.suggestionText}>{country !== 'Türkiye' ? 'Yurtdışı lokasyonları için merkez seçilir' : 'Sonuç bulunamadı'}</Text></View>
                    )}
                  </View>
                )}
              </View>
              <TouchableOpacity style={styles.button} onPress={() => handleCalculate()} disabled={isLoading}>
                <Text style={styles.buttonText}>{isLoading ? 'Yıldızlar Okunuyor...' : 'Haritayı Hesapla'}</Text>
              </TouchableOpacity>
            </BlurView>
          ) : (
            <View>
              <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 20}}>
                <TouchableOpacity style={styles.resetBtn} onPress={() => setChart(null)}>
                  <Ionicons name="arrow-back" size={20} color={COLORS.primary} />
                  <Text style={styles.resetBtnText}>Geri</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.chartTitle}>Kişisel Doğum Haritanız</Text>
              <Text style={styles.chartInfoText}>{dateStr} • {timeStr} • {searchQuery}</Text>

              <View style={styles.chartOuterContainer}>
                {renderSvgWheel()}
              </View>

              <View style={styles.dataContainer}>
                <TouchableOpacity style={styles.sectionHeaderBtn} onPress={() => toggleSection('aspects')}>
                  <Text style={styles.sectionHeader}>Açı Tablosu</Text>
                  <Ionicons name={expandedAspects ? "chevron-up" : "chevron-down"} size={20} color={COLORS.primary} />
                </TouchableOpacity>
                {expandedAspects && (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ padding: 10 }}>
                    {renderAspectGrid()}
                  </ScrollView>
                )}

                <TouchableOpacity style={styles.sectionHeaderBtn} onPress={() => toggleSection('planets')}>
                  <Text style={styles.sectionHeader}>Gezegen Yerleşimleri</Text>
                  <Ionicons name={expandedPlanets ? "chevron-up" : "chevron-down"} size={20} color={COLORS.primary} />
                </TouchableOpacity>
                {expandedPlanets && (
                  <View style={styles.dataTable}>
                    <View style={styles.tableHeaderRow}>
                      <Text style={styles.tableHeader}>Gezegen</Text>
                      <Text style={styles.tableHeader}>Burç</Text>
                      <Text style={styles.tableHeader}>Derece</Text>
                      <Text style={styles.tableHeader}>Ev</Text>
                    </View>
                    {[...chart.planets, chart.ascendant, chart.midheaven].map((p, i) => (
                      <TouchableOpacity 
                        key={i} 
                        style={styles.tableRow}
                        onPress={() => setSelectedInterp(getFullPlanetInterpretation(p.name, p.sign, p.house))}
                      >
                        <Text style={styles.tableCell}><Text style={{color: COLORS.primary}}>{PLANET_SYMBOLS[p.name] || ''}</Text> {p.name}</Text>
                        <Text style={[styles.tableCell, {color: ZODIAC_COLORS[p.sign]}]}>{p.sign}</Text>
                        <Text style={styles.tableCell}>
                          {`${String(p.degreeInSign).padStart(2,'0')}° ${String(p.minutes).padStart(2,'0')}'`}
                          {p.isRetrograde && <Text style={{color: '#FF453A', fontSize: 10}}> Rx</Text>}
                        </Text>
                        <Text style={styles.tableCell}>{p.house}.</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                <TouchableOpacity style={styles.sectionHeaderBtn} onPress={() => toggleSection('houses')}>
                  <Text style={styles.sectionHeader}>Ev Girişleri (Cusps)</Text>
                  <Ionicons name={expandedHouses ? "chevron-up" : "chevron-down"} size={20} color={COLORS.primary} />
                </TouchableOpacity>
                {expandedHouses && (
                  <View style={styles.dataTable}>
                    <View style={styles.tableHeaderRow}>
                      <Text style={styles.tableHeader}>Ev</Text>
                      <Text style={styles.tableHeader}>Burç</Text>
                      <Text style={styles.tableHeader}>Derece</Text>
                    </View>
                    {chart.houses.map((h, i) => (
                      <TouchableOpacity 
                        key={i} 
                        style={styles.tableRow}
                        onPress={() => setSelectedInterp(getHouseCuspInterpretation(h.house, h.sign))}
                      >
                        <Text style={styles.tableCell}>{h.house}. Ev {h.house===1?'(ASC)':h.house===10?'(MC)':h.house===4?'(IC)':h.house===7?'(DSC)':''}</Text>
                        <Text style={[styles.tableCell, {color: ZODIAC_COLORS[h.sign]}]}>{h.sign}</Text>
                        <Text style={styles.tableCell}>{`${String(h.degreeInSign).padStart(2,'0')}° ${String(h.minutes).padStart(2,'0')}'`}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>
          )}
          <View style={{ height: 100 }} />
        </ScrollView>
        <Modal visible={showCountryModal} animationType="fade" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}><Text style={styles.modalTitle}>Ülke Seçin</Text><TouchableOpacity onPress={() => setShowCountryModal(false)}><Ionicons name="close" size={24} color="#333" /></TouchableOpacity></View>
              <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }}>
                {AVAILABLE_COUNTRIES.map((c, i) => (
                  <TouchableOpacity key={i} style={styles.modalOption} onPress={() => { setCountry(c); setSearchQuery(''); setShowCountryModal(false); setShowSuggestions(false); }}>
                    <Text style={styles.modalOptionText}>{c}</Text>
                    {country === c && <Ionicons name="checkmark" size={20} color={COLORS.primary} />}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Interpretation Modal */}
        <Modal visible={!!selectedInterp} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.interpModalContent}>
              <View style={styles.interpModalHeader}>
                <Text style={styles.interpModalTitle}>{selectedInterp?.title}</Text>
                <TouchableOpacity onPress={() => setSelectedInterp(null)}>
                  <Ionicons name="close-circle" size={28} color={COLORS.textMuted} />
                </TouchableOpacity>
              </View>
              <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
                <Text style={styles.interpModalText}>{selectedInterp?.content}</Text>
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
  scrollContent: { padding: 20, paddingTop: 60 },
  header: { marginBottom: 30, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.primary, marginBottom: 5 },
  subtitle: { fontSize: 16, color: COLORS.textMuted, fontStyle: 'italic' },
  
  formCard: { padding: 20, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, overflow: 'visible' },
  label: { fontSize: 14, color: COLORS.text, marginBottom: 8, fontWeight: '600' },
  input: { backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 8, padding: 12, marginBottom: 20, fontSize: 16, color: '#000' },
  
  suggestionsContainer: { position: 'absolute', top: 50, left: 0, right: 0, backgroundColor: '#1A1A2E', borderRadius: 8, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden', elevation: 5, zIndex: 100 },
  suggestionItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  suggestionText: { color: COLORS.text, fontSize: 16 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, height: '50%', padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  modalOption: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  modalOptionText: { fontSize: 16, color: '#333' },
  
  typeToggleContainer: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 8, padding: 2, marginBottom: 20 },
  typeToggleBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 6 },
  typeToggleActive: { backgroundColor: COLORS.primary },
  typeToggleText: { color: COLORS.textMuted, fontWeight: 'bold' },
  typeToggleTextActive: { color: '#000' },

  smallToggleContainer: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20, padding: 2 },
  smallToggleBtn: { paddingHorizontal: 15, paddingVertical: 6, borderRadius: 18 },
  smallToggleActive: { backgroundColor: COLORS.primary },
  smallToggleText: { color: COLORS.textMuted, fontSize: 12, fontWeight: 'bold' },
  smallToggleTextActive: { color: '#000' },
  
  button: { backgroundColor: COLORS.primary, padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: COLORS.background, fontSize: 18, fontWeight: 'bold' },

  resetBtn: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  resetBtnText: { color: COLORS.primary, fontSize: 16, marginLeft: 5 },
  
  chartTitle: { fontSize: 24, fontFamily: 'serif', color: COLORS.text, textAlign: 'center', marginBottom: 6 },
  chartInfoText: { fontSize: 14, color: COLORS.textMuted, textAlign: 'center', marginBottom: 20, fontStyle: 'italic' },

  chartOuterContainer: { alignItems: 'center', marginVertical: 20 },
  
  dataContainer: { marginTop: 10 },
  sectionHeaderBtn: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 15, paddingBottom: 5, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  sectionHeader: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary },

  gridContainer: { flexDirection: 'column', alignItems: 'flex-start' },
  gridRow: { flexDirection: 'row', alignItems: 'center' },
  gridCell: { width: 30, height: 30, borderWidth: 1, borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
  gridLabelCellRight: { width: 30, height: 30, justifyContent: 'center', alignItems: 'center', marginRight: 5 },
  gridLabelCellBottom: { width: 30, height: 30, justifyContent: 'center', alignItems: 'center', marginTop: 5 },
  gridSymbol: { color: COLORS.primary, fontSize: 16, fontWeight: 'bold' },
  gridAspectSymbol: { fontSize: 18, fontWeight: 'bold' },

  dataTable: { backgroundColor: COLORS.cardBg, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden' },
  tableHeaderRow: { flexDirection: 'row', backgroundColor: 'rgba(212, 175, 55, 0.1)', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  tableHeader: { flex: 1, color: COLORS.primary, fontWeight: 'bold', textAlign: 'center', fontSize: 14 },
  tableRow: { flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  tableCell: { flex: 1, color: COLORS.text, textAlign: 'center', fontSize: 13 },

  interpModalContent: { backgroundColor: COLORS.cardBg, borderTopLeftRadius: 24, borderTopRightRadius: 24, height: '65%', padding: 25, borderWidth: 1, borderColor: COLORS.primary },
  interpModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(212,175,55,0.2)', paddingBottom: 15 },
  interpModalTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary, flex: 1, marginRight: 10 },
  interpModalText: { fontSize: 16, color: COLORS.text, lineHeight: 26 }
});
