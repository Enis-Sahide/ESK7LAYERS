import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ImageBackground, KeyboardAvoidingView, Platform, Dimensions, Modal } from 'react-native';
import { BlurView } from 'expo-blur';
import Svg, { Circle, Line, Text as SvgText, G } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { generateAstrologyChart, NatalChartData, ASTRO_CITIES, ZodiacSign } from '../../../src/utils/AstrologyEngine';
import { getFullPlanetInterpretation, getAspectInterpretation } from '../../../src/utils/AstrologyInterpretations';

const AVAILABLE_COUNTRIES = [
  'Türkiye', 'Almanya', 'Amerika Birleşik Devletleri', 'İngiltere', 'Fransa', 
  'Hollanda', 'Avusturya', 'Belçika', 'İsviçre', 'Azerbaycan', 'Kıbrıs'
];

const { width } = Dimensions.get('window');
const CHART_SIZE = width - 40;
const CENTER = CHART_SIZE / 2;
const RADIUS = CENTER - 40;

const COLORS = {
  background: '#0F172A',
  primary: '#D4AF37', // Gold
  text: '#E0E0E0',
  textMuted: '#9CA3AF',
  cardBg: 'rgba(20, 25, 40, 0.85)',
  border: 'rgba(212, 175, 55, 0.3)',
};

const ZODIAC_COLORS: Record<ZodiacSign, string> = {
  'Koç': '#FF453A', 'Aslan': '#FF453A', 'Yay': '#FF453A', // Fire
  'Boğa': '#32D74B', 'Başak': '#32D74B', 'Oğlak': '#32D74B', // Earth
  'İkizler': '#FFD60A', 'Terazi': '#FFD60A', 'Kova': '#FFD60A', // Air
  'Yengeç': '#0A84FF', 'Akrep': '#0A84FF', 'Balık': '#0A84FF', // Water
};

const ZODIAC_SYMBOLS: Record<ZodiacSign, string> = {
  'Koç': '♈', 'Boğa': '♉', 'İkizler': '♊', 'Yengeç': '♋', 
  'Aslan': '♌', 'Başak': '♍', 'Terazi': '♎', 'Akrep': '♏', 
  'Yay': '♐', 'Oğlak': '♑', 'Kova': '♒', 'Balık': '♓'
};

const PLANET_SYMBOLS: Record<string, string> = {
  'Güneş': '☉', 'Ay': '☽', 'Merkür': '☿', 'Venüs': '♀', 'Mars': '♂', 
  'Jüpiter': '♃', 'Satürn': '♄', 'Uranüs': '♅', 'Neptün': '♆', 'Plüton': '♇',
  'Yükselen (ASC)': 'ASC', 'Tepe Noktası (MC)': 'MC'
};

export default function AnlikGokyuzuScreen() {
  const [country, setCountry] = useState('Türkiye');
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [cityKey, setCityKey] = useState('İstanbul');
  const [searchQuery, setSearchQuery] = useState('İstanbul');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chart, setChart] = useState<NatalChartData | null>(null);
  const [selectedInterp, setSelectedInterp] = useState<{title: string, content: string} | null>(null);

  const filteredCities = ASTRO_CITIES.filter(c => 
    c.country === country &&
    c.name.toLocaleLowerCase('tr-TR').startsWith(searchQuery.toLocaleLowerCase('tr-TR'))
  ).map(c => c.name).slice(0, 4);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      try {
        const targetDate = new Date(); // Current system time
        const result = generateAstrologyChart(targetDate, cityKey, false);
        setChart(result);
      } catch (error) {
        Alert.alert("Hesaplama Hatası", "Gökyüzü haritası oluşturulurken bir sorun oluştu.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  const renderSvgWheel = () => {
    if (!chart) return null;

    // Ascendant defines the start (left side, 180 degrees in SVG math, usually represented as 9 o'clock)
    // To make ASC at 9 o'clock and go counter-clockwise in SVG (where Y goes down), 
    // we use the formula: angle = 180 + ascLon - lon
    const ascLon = chart.ascendant.longitude;

    const getX = (lon: number, r: number) => CENTER + r * Math.cos((180 + ascLon - lon) * Math.PI / 180);
    const getY = (lon: number, r: number) => CENTER + r * Math.sin((180 + ascLon - lon) * Math.PI / 180);

    return (
      <Svg width={CHART_SIZE} height={CHART_SIZE}>
        {/* Outer Wheel (Zodiac Signs) */}
        <Circle cx={CENTER} cy={CENTER} r={RADIUS + 30} stroke={COLORS.border} strokeWidth="1" fill="none" />
        <Circle cx={CENTER} cy={CENTER} r={RADIUS} stroke={COLORS.border} strokeWidth="2" fill="rgba(0,0,0,0.3)" />
        <Circle cx={CENTER} cy={CENTER} r={RADIUS - 40} stroke={COLORS.border} strokeWidth="1" fill="none" />

        {/* 12 House/Sign Divisions */}
        {chart.houses.map((h, i) => {
          const x1 = getX(h.longitude, RADIUS + 30);
          const y1 = getY(h.longitude, RADIUS + 30);
          const x2 = getX(h.longitude, RADIUS - 40);
          const y2 = getY(h.longitude, RADIUS - 40);
          
          // Sign Symbol Position (middle of the house)
          const midLon = h.longitude + 15;
          const sx = getX(midLon, RADIUS + 15);
          const sy = getY(midLon, RADIUS + 15);

          return (
            <G key={`house-${i}`}>
              <Line x1={CENTER} y1={CENTER} x2={x1} y2={y1} stroke={COLORS.border} strokeWidth="1" />
              <SvgText x={sx} y={sy + 6} fontSize="18" fill={ZODIAC_COLORS[h.sign]} textAnchor="middle" fontWeight="bold">
                {ZODIAC_SYMBOLS[h.sign]}
              </SvgText>
              {/* House Number */}
              <SvgText x={getX(midLon, RADIUS - 30)} y={getY(midLon, RADIUS - 30) + 4} fontSize="12" fill={COLORS.textMuted} textAnchor="middle">
                {h.house}
              </SvgText>
            </G>
          );
        })}

        {/* Aspects Lines */}
        {chart.aspects.filter(a => a.orb <= 5).map((a, i) => {
          const p1 = chart.planets.find(p => p.name === a.planet1);
          const p2 = chart.planets.find(p => p.name === a.planet2);
          if (!p1 || !p2) return null;
          
          let color = 'rgba(255,255,255,0.1)';
          if (a.type === 'Üçgen') color = '#32D74B';
          if (a.type === 'Kare' || a.type === 'Karşıt') color = '#FF453A';
          if (a.type === 'Sekstil') color = '#0A84FF';

          return (
            <Line 
              key={`asp-${i}`} 
              x1={getX(p1.longitude, RADIUS - 40)} 
              y1={getY(p1.longitude, RADIUS - 40)} 
              x2={getX(p2.longitude, RADIUS - 40)} 
              y2={getY(p2.longitude, RADIUS - 40)} 
              stroke={color} 
              strokeWidth={a.isExact ? "2" : "1"} 
              opacity={0.6}
            />
          );
        })}

        {/* Planets */}
        {chart.planets.map((p, i) => {
          // Spread planets out slightly if they are conjunct to avoid text overlap
          // Simplified here, using exactly their degree
          const px = getX(p.longitude, RADIUS - 55);
          const py = getY(p.longitude, RADIUS - 55);
          return (
            <G key={`planet-${i}`}>
              <Circle cx={px} cy={py} r="10" fill="#000" stroke={COLORS.primary} strokeWidth="1" />
              <SvgText x={px} y={py + 5} fontSize="14" fill={COLORS.primary} textAnchor="middle" fontWeight="bold">
                {PLANET_SYMBOLS[p.name]}
              </SvgText>
            </G>
          );
        })}

        {/* ASC / MC Markers */}
        <SvgText x={getX(chart.ascendant.longitude, RADIUS + 40)} y={getY(chart.ascendant.longitude, RADIUS + 40)} fontSize="14" fill={COLORS.primary} textAnchor="middle" fontWeight="bold">ASC</SvgText>
        <SvgText x={getX(chart.midheaven.longitude, RADIUS + 40)} y={getY(chart.midheaven.longitude, RADIUS + 40)} fontSize="14" fill={COLORS.primary} textAnchor="middle" fontWeight="bold">MC</SvgText>
      </Svg>
    );
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ImageBackground source={{ uri: 'https://mbqjklupfoqbcfxusigs.supabase.co/storage/v1/object/public/app-assets/images/backgrounds/esoteric_bg.png' }} style={styles.container} resizeMode="cover">
        <View style={StyleSheet.absoluteFill} />
        <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />

        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.title}>Anlık Gökyüzü</Text>
            <Text style={styles.subtitle}>Şu an yıldızlar bize ne fısıldıyor?</Text>
          </View>

          {!chart ? (
            <BlurView intensity={20} tint="light" style={styles.formCard}>
              <Text style={styles.label}>Bulunduğunuz Ülke</Text>
              <TouchableOpacity style={[styles.input, { justifyContent: 'center' }]} onPress={() => setShowCountryModal(true)}>
                <Text style={{ color: '#000', fontSize: 15 }}>{country}</Text>
              </TouchableOpacity>

              <Text style={styles.label}>Şu Anki Şehir (Ara)</Text>
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
                          setCityKey(c);
                          setSearchQuery(c);
                          setShowSuggestions(false);
                        }}
                      >
                        <Text style={styles.suggestionText}>{c}</Text>
                      </TouchableOpacity>
                    )) : (
                      <View style={styles.suggestionItem}>
                        <Text style={styles.suggestionText}>
                          {country !== 'Türkiye' ? 'Yurtdışı lokasyonları için merkez seçilir' : 'Sonuç bulunamadı'}
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </View>

              <TouchableOpacity style={styles.button} onPress={() => handleCalculate()} disabled={isLoading}>
                <Text style={styles.buttonText}>{isLoading ? 'Gökyüzü Okunuyor...' : 'Anlık Haritayı Çıkar'}</Text>
              </TouchableOpacity>
            </BlurView>
          ) : (
            <View>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20}}>
                <TouchableOpacity style={styles.resetBtn} onPress={() => setChart(null)}>
                  <Ionicons name="arrow-back" size={20} color={COLORS.primary} />
                  <Text style={styles.resetBtnText}>Geri</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.chartContainer}>
                {renderSvgWheel()}
              </View>

              <View style={styles.reportContainer}>
                <Text style={styles.reportTitle}>Gökyüzünün Big 3'ü</Text>
                
                <View style={styles.bigThreeCard}>
                  <View style={styles.bigThreeItem}>
                    <Text style={styles.bigThreeLabel}>Güneş (Ego)</Text>
                    <Text style={[styles.bigThreeValue, { color: ZODIAC_COLORS[chart.planets.find(p => p.name === 'Güneş')?.sign || 'Koç'] }]}>
                      {chart.planets.find(p => p.name === 'Güneş')?.sign}
                    </Text>
                  </View>
                  <View style={styles.bigThreeItem}>
                    <Text style={styles.bigThreeLabel}>Ay (Ruh)</Text>
                    <Text style={[styles.bigThreeValue, { color: ZODIAC_COLORS[chart.planets.find(p => p.name === 'Ay')?.sign || 'Koç'] }]}>
                      {chart.planets.find(p => p.name === 'Ay')?.sign}
                    </Text>
                  </View>
                  <View style={styles.bigThreeItem}>
                    <Text style={styles.bigThreeLabel}>Yükselen (Beden)</Text>
                    <Text style={[styles.bigThreeValue, { color: ZODIAC_COLORS[chart.ascendant.sign] }]}>
                      {chart.ascendant.sign}
                    </Text>
                  </View>
                </View>

                <Text style={styles.reportTitle}>Gezegen Yerleşimleri</Text>
                <View style={styles.planetsList}>
                  {chart.planets.map((p, i) => (
                    <TouchableOpacity 
                      key={i} 
                      style={styles.planetRow}
                      onPress={() => setSelectedInterp(getFullPlanetInterpretation(p.name, p.sign, p.house))}
                    >
                      <Text style={styles.planetSymbol}>{PLANET_SYMBOLS[p.name]}</Text>
                      <Text style={styles.planetName}>{p.name}</Text>
                      <Text style={[styles.planetSign, { color: ZODIAC_COLORS[p.sign] }]}>{p.sign}</Text>
                      <Text style={styles.planetHouse}>{p.house}. Ev</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.reportTitle}>Önemli Açılar (Karmik Dinamikler)</Text>
                <View style={styles.aspectsList}>
                  {chart.aspects.filter(a => a.orb <= 5).map((a, i) => (
                    <TouchableOpacity 
                      key={i} 
                      style={styles.aspectRow}
                      onPress={() => setSelectedInterp(getAspectInterpretation(a.planet1, a.planet2, a.type))}
                    >
                      <Text style={styles.aspectPlanets}>{a.planet1} - {a.planet2}</Text>
                      <Text style={styles.aspectType}>{a.type}</Text>
                      {a.isExact && <Text style={styles.aspectExact}>Tam Açı!</Text>}
                    </TouchableOpacity>
                  ))}
                  {chart.aspects.filter(a => a.orb <= 5).length === 0 && (
                    <Text style={{color: COLORS.textMuted}}>Şu an gökyüzünde dar orblu kesin bir majör açı bulunmuyor.</Text>
                  )}
                </View>

              </View>
            </View>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>

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

      </ImageBackground>
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
  
  button: { backgroundColor: COLORS.primary, padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: COLORS.background, fontSize: 18, fontWeight: 'bold' },

  resetBtn: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  resetBtnText: { color: COLORS.primary, fontSize: 16, marginLeft: 5 },

  chartContainer: { alignItems: 'center', marginVertical: 20, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 200, padding: 10 },
  
  reportContainer: { marginTop: 20 },
  reportTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary, marginBottom: 15, marginTop: 20, borderBottomWidth: 1, borderBottomColor: COLORS.border, paddingBottom: 5 },
  
  bigThreeCard: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: COLORS.cardBg, borderRadius: 12, padding: 15, borderWidth: 1, borderColor: COLORS.border },
  bigThreeItem: { alignItems: 'center', flex: 1 },
  bigThreeLabel: { fontSize: 12, color: COLORS.textMuted, marginBottom: 5 },
  bigThreeValue: { fontSize: 16, fontWeight: 'bold' },

  planetsList: { backgroundColor: COLORS.cardBg, borderRadius: 12, padding: 15, borderWidth: 1, borderColor: COLORS.border },
  planetRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  planetSymbol: { fontSize: 18, color: COLORS.primary, width: 30, textAlign: 'center' },
  planetName: { flex: 1, color: COLORS.text, fontSize: 16 },
  planetSign: { flex: 1, fontSize: 16, fontWeight: '600', textAlign: 'right' },
  planetHouse: { flex: 1, color: COLORS.textMuted, textAlign: 'right' },

  aspectsList: { backgroundColor: COLORS.cardBg, borderRadius: 12, padding: 15, borderWidth: 1, borderColor: COLORS.border },
  aspectRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  aspectPlanets: { flex: 2, color: COLORS.text, fontSize: 15 },
  aspectType: { flex: 1, color: COLORS.primary, fontSize: 15, textAlign: 'right' },
  aspectExact: { color: '#FF453A', fontSize: 12, fontWeight: 'bold', marginLeft: 10 },

  interpModalContent: { backgroundColor: COLORS.cardBg, borderTopLeftRadius: 24, borderTopRightRadius: 24, height: '65%', padding: 25, borderWidth: 1, borderColor: COLORS.primary },
  interpModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(212,175,55,0.2)', paddingBottom: 15 },
  interpModalTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary, flex: 1, marginRight: 10 },
  interpModalText: { fontSize: 16, color: COLORS.text, lineHeight: 26 }
});
