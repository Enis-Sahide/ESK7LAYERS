import SacredBackground from '@/components/SacredBackground';
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ImageBackground, KeyboardAvoidingView, Platform, Dimensions, Modal, LayoutAnimation, UIManager, ActivityIndicator } from 'react-native';
import { BlurView } from 'expo-blur';
import Svg, { Circle, Line, Text as SvgText, G } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as moment from 'moment-timezone';
import { ASTRO_CITIES, AstroCity, ZodiacSign, NatalChartData } from '@/src/features/astrology/api/astrologyClient';
// Interpretations are fetched from the backend API.
import { API_BASE_URL } from '@/src/core/config';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const AVAILABLE_COUNTRIES = [
  'Türkiye', 'Almanya', 'Amerika Birleşik Devletleri', 'İngiltere', 'Fransa', 
  'Hollanda', 'Avusturya', 'Belçika', 'İsviçre', 'Azerbaycan', 'Kıbrıs'
];

const { width } = Dimensions.get('window');
const CHART_SIZE = width - 40;
const CENTER = CHART_SIZE / 2;
const RADIUS = CENTER - 45;

const ZODIAC_COLORS: Record<string, string> = {
  'Koç': '#FF453A', 'Aslan': '#FF453A', 'Yay': '#FF453A',
  'Boğa': '#32D74B', 'Başak': '#32D74B', 'Oğlak': '#32D74B',
  'İkizler': '#FFD60A', 'Terazi': '#FFD60A', 'Kova': '#FFD60A',
  'Yengeç': '#0A84FF', 'Akrep': '#0A84FF', 'Balık': '#0A84FF',
};

const ZODIAC_SYMBOLS: Record<string, string> = {
  'Koç': '♈', 'Boğa': '♉', 'İkizler': '♊', 'Yengeç': '♋', 
  'Aslan': '♌', 'Başak': '♍', 'Terazi': '♎', 'Akrep': '♏', 
  'Yay': '♐', 'Oğlak': '♑', 'Kova': '♒', 'Balık': '♓'
};

const ZODIAC_ORDER = [
  'Koç', 'Boğa', 'İkizler', 'Yengeç', 'Aslan', 'Başak', 
  'Terazi', 'Akrep', 'Yay', 'Oğlak', 'Kova', 'Balık'
];

const PLANET_SYMBOLS: Record<string, string> = {
  'Güneş': '☉', 'Ay': '☽', 'Merkür': '☿', 'Venüs': '♀', 'Mars': '♂', 
  'Jüpiter': '♃', 'Satürn': '♄', 'Uranüs': '♅', 'Neptün': '♆', 'Plüton': '♇',
  'Dünya': '⨁',
  'Yükselen (ASC)': 'ASC', 'Tepe Noktası (MC)': 'MC', 'Kuzey Ay Düğümü': '☊',
  'Kiron': '⚷',
  'Vertex (Vx)': 'Vx', 'Şans Noktası (POF)': '⊗', 'Lilith': '⚸'
};

const ASPECT_COLORS: Record<string, string> = {
  'Kavuşum': '#D4AF37', 'Sekstil': '#0A84FF', 'Kare': '#FF453A', 'Üçgen': '#32D74B', 'Karşıt': '#FF453A', 'Görmeyen': '#0A84FF'
};

export default function KabbalahAnalysisScreen() {
  const router = useRouter();

  const [dateStr, setDateStr] = useState('');
  const [timeStr, setTimeStr] = useState('12:00');
  const [country, setCountry] = useState('Türkiye');
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('İstanbul');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [chartData, setChartData] = useState<any>(null);
  const [kabbalahAnalysis, setKabbalahAnalysis] = useState<any>(null);
  const [interpretations, setInterpretations] = useState<any>(null);
  const [selectedWorld, setSelectedWorld] = useState<'assiah' | 'yetzirah' | 'beriyah' | 'atzilut'>('assiah');
  const [selectedInterp, setSelectedInterp] = useState<{title: string, content: string} | null>(null);

  const dateInputRef = useRef<TextInput>(null);
  const timeInputRef = useRef<TextInput>(null);

  const filteredCities = ASTRO_CITIES.filter(c => 
    c.country === country &&
    c.name.toLocaleLowerCase('tr-TR').startsWith(searchQuery.toLocaleLowerCase('tr-TR'))
  ).map(c => c.name).slice(0, 4);

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
      Alert.alert("Eksik Bilgi", "Lütfen doğum tarihi ve saatini doldurunuz.");
      return;
    }

    const matchedCity = ASTRO_CITIES.find(c => c.name.toLocaleLowerCase('tr-TR') === searchQuery.trim().toLocaleLowerCase('tr-TR')) || ASTRO_CITIES[0];

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/astrology/kabbalah`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          localDate: dateStr,
          localTime: timeStr,
          cityData: matchedCity
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Hesaplama hatası");
      }

      setChartData(data.data.charts);
      setKabbalahAnalysis(data.data.kabbalahAnalysis);
      setInterpretations(data.data.interpretations);
      setSelectedWorld('assiah');
    } catch (error: any) {
      console.error('Kabalistik hesaplama hatası:', error);
      Alert.alert("Hata", error.message || 'Harita oluşturulurken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderSvgWheel = (currentChart: NatalChartData | null) => {
    if (!currentChart) return null;

    const ascLon = currentChart.ascendant.longitude;
    const getX = (lon: number, r: number) => CENTER + r * Math.cos((180 + ascLon - lon) * Math.PI / 180);
    const getY = (lon: number, r: number) => CENTER + r * Math.sin((180 + ascLon - lon) * Math.PI / 180);

    const R_TICKS_OUTER = RADIUS + 30;
    const R_ZODIAC_OUTER = RADIUS + 25;
    const R_ZODIAC_INNER = RADIUS + 5;
    const R_CUSP_NUM = RADIUS + 35;
    const R_PLANETS = RADIUS - 12;
    const R_ASPECTS = RADIUS - 30;

    return (
      <View style={styles.chartWrapper}>
        <Svg width={CHART_SIZE} height={CHART_SIZE}>
          {/* Aspect Lines */}
          <Circle cx={CENTER} cy={CENTER} r={R_ASPECTS} stroke="rgba(212,175,55,0.2)" strokeWidth="1" fill="rgba(0,0,0,0.5)" />
          {currentChart.aspects.filter(a => a.type !== 'Kavuşum').map((a, i) => {
            const p1 = currentChart.planets.find(p => p.name === a.planet1) || (a.planet1.includes('ASC') ? currentChart.ascendant : currentChart.midheaven);
            const p2 = currentChart.planets.find(p => p.name === a.planet2) || (a.planet2.includes('ASC') ? currentChart.ascendant : currentChart.midheaven);
            if (!p1 || !p2) return null;
            
            return (
              <Line 
                key={`asp-${i}`} 
                x1={getX(p1.longitude, R_ASPECTS)} y1={getY(p1.longitude, R_ASPECTS)} 
                x2={getX(p2.longitude, R_ASPECTS)} y2={getY(p2.longitude, R_ASPECTS)} 
                stroke={ASPECT_COLORS[a.type] || "rgba(212,175,55,0.3)"} 
                strokeWidth={a.isExact ? "1.5" : "0.5"} 
                opacity={0.5}
              />
            );
          })}

          {/* Inner Rings */}
          <Circle cx={CENTER} cy={CENTER} r={R_ZODIAC_INNER} stroke="rgba(212,175,55,0.2)" strokeWidth="1.5" fill="none" />
          <Circle cx={CENTER} cy={CENTER} r={R_ZODIAC_OUTER} stroke="rgba(212,175,55,0.2)" strokeWidth="1.5" fill="none" />
          <Circle cx={CENTER} cy={CENTER} r={R_TICKS_OUTER} stroke="rgba(212,175,55,0.2)" strokeWidth="1" fill="none" />

          {/* Zodiac Signs */}
          {Array.from({ length: 12 }).map((_, i) => {
            const signLon = i * 30; 
            const midLon = signLon + 15;
            const signName = ZODIAC_ORDER[i];

            return (
              <G key={`zodiac-${i}`}>
                <Line x1={getX(signLon, R_ZODIAC_OUTER)} y1={getY(signLon, R_ZODIAC_OUTER)} x2={getX(signLon, R_ZODIAC_INNER)} y2={getY(signLon, R_ZODIAC_INNER)} stroke="rgba(212,175,55,0.2)" strokeWidth="1" />
                <SvgText x={getX(midLon, RADIUS + 15)} y={getY(midLon, RADIUS + 15) + 4} fontSize="14" fill={ZODIAC_COLORS[signName]} textAnchor="middle" fontWeight="bold">
                  {ZODIAC_SYMBOLS[signName]}
                </SvgText>
              </G>
            );
          })}

          {/* House Lines */}
          {currentChart.houses.map((h, i) => {
            const isAngle = h.house === 1 || h.house === 4 || h.house === 7 || h.house === 10;
            return (
              <G key={`house-${i}`}>
                <Line 
                  x1={getX(h.longitude, R_ASPECTS)} y1={getY(h.longitude, R_ASPECTS)} 
                  x2={getX(h.longitude, R_ZODIAC_INNER)} y2={getY(h.longitude, R_ZODIAC_INNER)} 
                  stroke={isAngle ? "#D4AF37" : "rgba(212,175,55,0.2)"} 
                  strokeWidth={isAngle ? "1.5" : "0.5"} 
                  strokeDasharray={isAngle ? "" : "3, 3"} 
                />
                <SvgText x={getX(h.longitude, R_CUSP_NUM)} y={getY(h.longitude, R_CUSP_NUM) + 3} fontSize="9" fill={isAngle ? "#D4AF37" : "#9CA3AF"} textAnchor="middle">
                  {`${h.house}`}
                </SvgText>
              </G>
            );
          })}

          {/* Planets */}
          {currentChart.planets.map((p, i) => {
            let rOffset = 0;
            for(let j=0; j<i; j++) {
               if (Math.abs(p.longitude - currentChart.planets[j].longitude) < 5) rOffset += 14;
            }
            const px = getX(p.longitude, R_PLANETS - rOffset);
            const py = getY(p.longitude, R_PLANETS - rOffset);
            
            return (
              <G key={`planet-${i}`}>
                <Circle cx={px} cy={py} r="8" fill="#000" stroke="#D4AF37" strokeWidth="0.8" />
                <SvgText x={px} y={py + 3} fontSize="9" fill="#D4AF37" textAnchor="middle" fontWeight="bold">
                  {PLANET_SYMBOLS[p.name] || p.name[0]}
                </SvgText>
              </G>
            );
          })}
        </Svg>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <SacredBackground>
        <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />

        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={28} color={COLORS.primary} />
            </TouchableOpacity>
            <View style={{alignItems: 'center'}}>
              <Text style={styles.headerTitle}>Kabalistik 4 Alem</Text>
              <Text style={styles.headerSubtitle}>Sefirot Ağacı Analizi</Text>
            </View>
            <View style={{ width: 28 }} />
          </View>

          {!chartData ? (
            <View style={styles.formCard}>
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
              <TouchableOpacity style={styles.pickerSelector} onPress={() => setShowCountryModal(true)}>
                <Text style={styles.pickerText}>{country}</Text>
                <Ionicons name="chevron-down" size={18} color="#9CA3AF" />
              </TouchableOpacity>

              <Text style={styles.label}>Doğum Şehri (Ara)</Text>
              <View style={{ zIndex: 99 }}>
                <TextInput 
                  style={styles.input} 
                  value={searchQuery} 
                  onChangeText={(t) => { setSearchQuery(t); setShowSuggestions(true); }} 
                  onFocus={() => { if (searchQuery === 'İstanbul') setSearchQuery(''); setShowSuggestions(true); }} 
                  placeholder={`Örn: ${country === 'Türkiye' ? 'İstan...' : 'Berlin...'}`} 
                  placeholderTextColor="#666" 
                />
                {showSuggestions && searchQuery.length > 0 && (
                  <View style={styles.suggestionsContainer}>
                    {filteredCities.map((c, i) => (
                      <TouchableOpacity key={i} style={styles.suggestionItem} onPress={() => { setSearchQuery(c); setShowSuggestions(false); }}>
                        <Text style={styles.suggestionText}>{c}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              <TouchableOpacity style={styles.calcBtn} onPress={handleCalculate} disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator color="#000" size="small" />
                ) : (
                  <Text style={styles.calcBtnText}>Sefirot Kapılarını Aç</Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              {/* Reset trigger */}
              <TouchableOpacity style={styles.resetBtn} onPress={() => { setChartData(null); setKabbalahAnalysis(null); setInterpretations(null); }}>
                <Ionicons name="refresh-outline" size={16} color={COLORS.primary} />
                <Text style={styles.resetBtnText}>Yeni Bir Sorgulama Yap</Text>
              </TouchableOpacity>

              {/* Ascendant banner */}
              <View style={styles.ascendantBanner}>
                <Ionicons name="sparkles-outline" size={24} color={COLORS.primary} style={{ marginBottom: 5 }} />
                <Text style={styles.ascTitle}>1. Beden Haritası Yönetici Analizi</Text>
                <Text style={styles.ascDesc}>{searchQuery} • {dateStr.split('-').reverse().join('.')} {timeStr}</Text>
                <Text style={styles.ascResult}>Yükselen Burç: <Text style={{fontWeight: 'bold', color: COLORS.primary}}>{chartData.assiah.ascendant.sign}</Text></Text>
              </View>

              {/* Shortcut Level Banner */}
              {kabbalahAnalysis && kabbalahAnalysis.shortcutLevel > 0 && (
                <View style={styles.shortcutBanner}>
                  <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 8}}>
                    <Ionicons name="flash" size={18} color="#FFCC00" style={{marginRight: 6}} />
                    <Text style={styles.shortcutTitle}>Kozmik Kestirme Yolunuz (Shortcut)</Text>
                  </View>
                  <Text style={styles.shortcutText}>{kabbalahAnalysis.shortcutMessage}</Text>
                </View>
              )}

              {/* World Tabs */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
                {[
                  { id: 'assiah', label: '1. Assiah', sub: 'Tropikal' },
                  { id: 'yetzirah', label: '2. Yetzirah', sub: 'Drakonik' },
                  { id: 'beriyah', label: '3. Beriyah', sub: '9. Harmonik' },
                  { id: 'atzilut', label: '4. Atzilut', sub: 'Helyosentrik' }
                ].map((w) => (
                  <TouchableOpacity 
                    key={w.id} 
                    style={[styles.tabBtn, selectedWorld === w.id && styles.tabBtnActive]} 
                    onPress={() => setSelectedWorld(w.id as any)}
                  >
                    <Text style={[styles.tabText, selectedWorld === w.id && styles.tabTextActive]}>{w.label}</Text>
                    <Text style={[styles.tabSubText, selectedWorld === w.id && styles.tabSubTextActive]}>{w.sub}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Active World Card */}
              {kabbalahAnalysis && (
                <View style={styles.worldCard}>
                  {(() => {
                    const idx = selectedWorld === 'assiah' ? 0 : selectedWorld === 'yetzirah' ? 1 : selectedWorld === 'beriyah' ? 2 : 3;
                    const wInfo = kabbalahAnalysis.worlds[idx];
                    return (
                      <View>
                        <View style={styles.worldHeader}>
                          <View>
                            <Text style={styles.worldHebrew}>{wInfo.hebrewName}</Text>
                            <Text style={styles.worldTitle}>{wInfo.name} - {wInfo.title}</Text>
                          </View>
                          <View style={styles.worldRulerBadge}>
                            <Text style={styles.worldRulerText}>{wInfo.naturalRuler}</Text>
                          </View>
                        </View>
                        <Text style={styles.worldDesc}>{wInfo.description}</Text>
                        <Text style={styles.worldThoth}>{wInfo.thothInfo}</Text>
                      </View>
                    );
                  })()}
                </View>
              )}

              {/* SVG Chart display */}
              <View style={styles.chartOuterContainer}>
                {renderSvgWheel(chartData[selectedWorld])}
              </View>

              {/* Placements List */}
              <View style={styles.listSection}>
                <Text style={styles.sectionHeading}>Gezegen Konumları</Text>
                {chartData[selectedWorld].planets.map((p: any, idx: number) => (
                  <TouchableOpacity 
                    key={idx} 
                    style={styles.listItem}
                    onPress={() => setSelectedInterp(interpretations?.[selectedWorld]?.[p.name] || null)}
                  >
                    <View style={styles.listItemLeft}>
                      <View style={styles.planetIcon}>
                        <Text style={styles.planetIconText}>{PLANET_SYMBOLS[p.name] || p.name[0]}</Text>
                      </View>
                      <View>
                        <Text style={styles.planetName}>{p.name}</Text>
                        <Text style={styles.houseName}>{p.house}. Ev</Text>
                      </View>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={[styles.signName, { color: ZODIAC_COLORS[p.sign] || '#E0E0E0' }]}>{ZODIAC_SYMBOLS[p.sign]} {p.sign}</Text>
                      <Text style={styles.degreeName}>{p.degreeInSign}°{p.minutes}' {p.isRetrograde && 'Rx'}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

            </View>
          )}

          <View style={{height: 100}} />
        </ScrollView>

        {/* Country selector modal */}
        <Modal visible={showCountryModal} animationType="fade" transparent={true}>
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowCountryModal(false)}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Ülke Seçin</Text>
                <TouchableOpacity onPress={() => setShowCountryModal(false)}>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              <ScrollView style={{ flex: 1 }}>
                {AVAILABLE_COUNTRIES.map((c, i) => (
                  <TouchableOpacity key={i} style={styles.modalOption} onPress={() => { setCountry(c); setSearchQuery(''); setShowCountryModal(false); }}>
                    <Text style={styles.modalOptionText}>{c}</Text>
                    {country === c && <Ionicons name="checkmark" size={20} color={COLORS.primary} />}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Interpretations modal */}
        <Modal visible={!!selectedInterp} animationType="slide" transparent={true} onRequestClose={() => setSelectedInterp(null)}>
          <View style={styles.modalOverlay}>
            <View style={styles.interpModalContent}>
              <View style={styles.interpModalHeader}>
                <Text style={styles.interpModalTitle}>{selectedInterp?.title}</Text>
                <TouchableOpacity onPress={() => setSelectedInterp(null)}>
                  <Ionicons name="close-circle" size={28} color="#9CA3AF" />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.2)',
  },
  backBtn: { padding: 5, backgroundColor: 'rgba(212, 175, 55, 0.1)', borderRadius: 12 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary },
  headerSubtitle: { fontSize: 12, color: '#9CA3AF', marginTop: 4 },
  scrollContent: { padding: 20 },
  formCard: {
    backgroundColor: 'rgba(10, 10, 10, 0.7)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    padding: 20,
    marginTop: 10,
  },
  label: { fontSize: 13, color: COLORS.primary, marginBottom: 8, fontWeight: '600' },
  input: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    color: '#000',
  },
  pickerSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  pickerText: { color: '#000', fontSize: 16 },
  suggestionsContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: '#1A1A2E',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    zIndex: 100,
  },
  suggestionItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  suggestionText: { color: '#FFF', fontSize: 16 },
  calcBtn: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  calcBtnText: { color: '#000', fontSize: 16, fontWeight: 'bold' },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(212,175,55,0.1)',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    gap: 6,
  },
  resetBtnText: { color: COLORS.primary, fontSize: 14, fontWeight: '600' },
  ascendantBanner: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    borderRadius: 16,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  ascTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginBottom: 2 },
  ascDesc: { color: '#9CA3AF', fontSize: 12, marginBottom: 8 },
  ascResult: { color: '#FFF', fontSize: 14 },
  shortcutBanner: {
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.4)',
    borderRadius: 16,
    padding: 15,
    marginBottom: 25,
  },
  shortcutTitle: { color: '#FFCC00', fontSize: 14, fontWeight: 'bold' },
  shortcutText: { color: '#E5E7EB', fontSize: 13, lineHeight: 18 },
  tabsScroll: {
    flexDirection: 'row',
    marginBottom: 25,
  },
  tabBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginRight: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    borderColor: COLORS.primary,
  },
  tabText: { color: '#9CA3AF', fontSize: 13, fontWeight: 'bold' },
  tabTextActive: { color: '#FFF' },
  tabSubText: { color: '#6B7280', fontSize: 10, marginTop: 2 },
  tabSubTextActive: { color: COLORS.primary },
  worldCard: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 15,
    marginBottom: 25,
  },
  worldHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  worldHebrew: { color: COLORS.primary, fontSize: 18, fontWeight: 'bold' },
  worldTitle: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  worldRulerBadge: {
    backgroundColor: 'rgba(212,175,55,0.1)',
    borderWidth: 0.5,
    borderColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  worldRulerText: { color: COLORS.primary, fontSize: 11, fontWeight: 'bold' },
  worldDesc: { color: '#9CA3AF', fontSize: 13, lineHeight: 18, marginBottom: 8 },
  worldThoth: { color: COLORS.primary, fontSize: 12, lineHeight: 18, fontStyle: 'italic' },
  chartOuterContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  listSection: {
    marginTop: 15,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212,175,55,0.2)',
    paddingBottom: 6,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.05)',
    padding: 12,
    marginBottom: 10,
  },
  listItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  planetIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(212,175,55,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  planetIconText: { color: COLORS.primary, fontSize: 14, fontWeight: 'bold' },
  planetName: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  houseName: { color: '#9CA3AF', fontSize: 11 },
  signName: { fontSize: 13, fontWeight: '600' },
  degreeName: { color: '#6B7280', fontSize: 11, fontFamily: 'monospace', marginTop: 2 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, height: '40%', padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  modalOption: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  modalOptionText: { fontSize: 16, color: '#333' },
  interpModalContent: { backgroundColor: 'rgba(10,10,10,0.95)', borderTopLeftRadius: 24, borderTopRightRadius: 24, height: '65%', padding: 25, borderWidth: 1, borderColor: COLORS.primary },
  interpModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(212,175,55,0.2)', paddingBottom: 15 },
  interpModalTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary, flex: 1, marginRight: 10 },
  interpModalText: { fontSize: 15, color: '#E5E7EB', lineHeight: 24 }
});
