import SacredBackground from '@/components/SacredBackground';
import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator, 
  Modal, 
  Dimensions, 
  Keyboard 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { API_BASE_URL } from '@/src/core/config';
import { ASTRO_CITIES, AstroCity } from '@/src/features/astrology/api/astrologyClient';

const { width } = Dimensions.get('window');

type EventType = 
  | 'marriage' 
  | 'child_birth' 
  | 'career_promotion' 
  | 'accident_surgery' 
  | 'death_relative' 
  | 'relocation' 
  | 'graduation' 
  | 'divorce' 
  | 'financial_crisis' 
  | 'spiritual_awakening';

interface LifeEvent {
  id: string;
  type: EventType;
  title: string;
  date: string;
}

interface EventTemplate {
  type: EventType;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  hint: string;
}

const EVENT_TEMPLATES: EventTemplate[] = [
  { type: 'marriage', label: 'Evlilik / Ciddi İlişki', icon: 'heart', color: '#FB7185', hint: 'Resmi nikah veya kadersel ilişki başlangıç tarihi' },
  { type: 'child_birth', label: 'Çocuk Doğumu', icon: 'sparkles', color: '#FBBF24', hint: 'İlk veya sonraki çocuğunuzun doğum tarihi' },
  { type: 'career_promotion', label: 'İşe Giriş / Önemli Terfi', icon: 'briefcase', color: '#60A5FA', hint: 'İlk resmi iş, büyük kariyer başlangıcı veya terfi' },
  { type: 'accident_surgery', label: 'Kaza / Büyük Ameliyat', icon: 'medical', color: '#F87171', hint: 'Hastaneye yatış, hayati operasyon veya ciddi kaza' },
  { type: 'death_relative', label: 'Birinci Derece Yakın Kaybı', icon: 'shield-outline', color: '#9CA3AF', hint: 'Anne, baba veya kardeş vefat tarihi' },
  { type: 'relocation', label: 'Taşınma / Şehir-Ülke Değişikliği', icon: 'home', color: '#34D399', hint: 'Kalıcı şehir veya ülke değişikliği, yeni ev' },
  { type: 'graduation', label: 'Mezuniyet / Büyük Başarı', icon: 'school', color: '#C084FC', hint: 'Üniversite mezuniyeti veya büyük ödül' },
  { type: 'divorce', label: 'Boşanma / Ciddi Ayrılık', icon: 'flash', color: '#FB923C', hint: 'Resmi boşanma veya uzun ilişkinin kesin bitişi' },
  { type: 'financial_crisis', label: 'Maddi Kriz / İflas', icon: 'flame', color: '#EAB308', hint: 'Büyük maddi kayıp veya iflas dönüm noktası' },
  { type: 'spiritual_awakening', label: 'Ruhsal Uyanış / Dönüm Noktası', icon: 'planet', color: '#818CF8', hint: 'Hayat görüşünüzü kökten değiştiren kırılma' },
];

interface BenchmarkPreset {
  id: string;
  name: string;
  title: string;
  officialTime: string;
  birthDate: string;
  cityName: string;
  element: 'fire' | 'earth' | 'air' | 'water';
  bodyType: 'slender' | 'athletic' | 'stocky' | 'petite' | 'curvy';
  timeWindowType: 'all' | 'morning' | 'afternoon' | 'evening' | 'night' | 'custom';
  events: LifeEvent[];
}

const BENCHMARK_PRESETS: BenchmarkPreset[] = [
  {
    id: 'diana',
    name: 'Prenses Diana',
    title: 'İngiltere Prensesi',
    officialTime: '19:45 (Resmi Belge)',
    birthDate: '1961-07-01',
    cityName: 'Londra',
    element: 'water',
    bodyType: 'slender',
    timeWindowType: 'evening',
    events: [
      { id: 'd1', type: 'marriage', title: 'Prens Charles ile Evlilik', date: '1981-07-29' },
      { id: 'd2', type: 'child_birth', title: 'Prens William Doğumu (1. Çocuk)', date: '1982-06-21' },
      { id: 'd3', type: 'child_birth', title: 'Prens Harry Doğumu (2. Çocuk)', date: '1984-09-15' },
      { id: 'd4', type: 'death_relative', title: 'Baba Vefatı (John Spencer)', date: '1992-03-29' },
      { id: 'd5', type: 'divorce', title: 'Resmi Boşanma', date: '1996-08-28' },
    ]
  },
  {
    id: 'jobs',
    name: 'Steve Jobs',
    title: 'Apple Kurucusu',
    officialTime: '19:15 (Resmi Belge)',
    birthDate: '1955-02-24',
    cityName: 'San Francisco',
    element: 'earth',
    bodyType: 'slender',
    timeWindowType: 'evening',
    events: [
      { id: 'j1', type: 'career_promotion', title: "Apple'ın Kuruluşu", date: '1976-04-01' },
      { id: 'j2', type: 'financial_crisis', title: "Apple'dan Kovulması", date: '1985-09-16' },
      { id: 'j3', type: 'marriage', title: 'Laurene Powell ile Evlilik', date: '1991-03-18' },
      { id: 'j4', type: 'career_promotion', title: "Apple'a CEO Olarak Dönüşü", date: '1997-09-16' },
      { id: 'j5', type: 'accident_surgery', title: 'Kanser Ameliyatı', date: '2004-07-31' },
    ]
  },
  {
    id: 'obama',
    name: 'Barack Obama',
    title: 'ABD 44. Başkanı',
    officialTime: '19:24 (Resmi Belge)',
    birthDate: '1961-08-04',
    cityName: 'Honolulu',
    element: 'air',
    bodyType: 'athletic',
    timeWindowType: 'evening',
    events: [
      { id: 'o1', type: 'marriage', title: 'Michelle Robinson ile Evlilik', date: '1992-10-03' },
      { id: 'o2', type: 'death_relative', title: 'Anne Vefatı (Ann Dunham)', date: '1995-11-07' },
      { id: 'o3', type: 'child_birth', title: 'Malia Doğumu (1. Çocuk)', date: '1998-07-04' },
      { id: 'o4', type: 'career_promotion', title: 'ABD Başkanı Seçilmesi', date: '2008-11-04' },
    ]
  }
];

export default function DogumSaatiBelirlemeScreen() {
  const router = useRouter();

  // Wizard Steps: 1: Tarih & Şehir, 2: Mizaç, 3: Olaylar, 4: Sonuç
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  // Step 1: Doğum Bilgileri
  const [dateKnowledgeMode, setDateKnowledgeMode] = useState<'exact' | 'month' | 'season'>('exact');
  const [birthDate, setBirthDate] = useState<string>('1992-06-15');
  const [birthYear, setBirthYear] = useState<number>(1991);
  const [birthMonth, setBirthMonth] = useState<number>(4);
  const [birthSeason, setBirthSeason] = useState<'spring' | 'summer' | 'autumn' | 'winter'>('spring');

  // Şehir Arama
  const [selectedCity, setSelectedCity] = useState<AstroCity>(ASTRO_CITIES[0]);
  const [citySearch, setCitySearch] = useState<string>('');
  const [showCitySuggestions, setShowCitySuggestions] = useState<boolean>(false);
  const [citySuggestions, setCitySuggestions] = useState<any[]>([]);

  // Zaman Dilimi
  const [timeWindowType, setTimeWindowType] = useState<'all' | 'morning' | 'afternoon' | 'evening' | 'night' | 'custom'>('evening');
  const [customStartHour, setCustomStartHour] = useState<number>(17);
  const [customEndHour, setCustomEndHour] = useState<number>(23);

  // Step 2: Mizaç ve Beden
  const [elementTemperament, setElementTemperament] = useState<'fire' | 'earth' | 'air' | 'water'>('fire');
  const [bodyType, setBodyType] = useState<'slender' | 'athletic' | 'stocky' | 'petite' | 'curvy'>('athletic');

  // Step 3: Olaylar
  const [events, setEvents] = useState<LifeEvent[]>([
    { id: '1', type: 'career_promotion', title: 'İlk İşe Giriş', date: '2015-09-01' },
    { id: '2', type: 'relocation', title: 'Şehir Değişikliği / Taşınma', date: '2019-04-12' },
    { id: '3', type: 'marriage', title: 'Evlilik / Ciddi İlişki', date: '2021-08-20' },
  ]);

  // Yeni Olay Ekleme
  const [newEventTemplate, setNewEventTemplate] = useState<EventType>('career_promotion');
  const [newEventTitle, setNewEventTitle] = useState<string>('');
  const [newEventDate, setNewEventDate] = useState<string>('');
  const [showEventSelector, setShowEventSelector] = useState<boolean>(false);

  // Hesaplama ve Sonuç
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Nominatim Şehir Arama Debounce
  useEffect(() => {
    if (citySearch.trim().length < 3) {
      setCitySuggestions([]);
      return;
    }

    const fetchCities = async () => {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(citySearch)}`, {
          headers: {
            'User-Agent': '7LayersApp/1.0 (Contact: admin@7layers.com)',
            'Accept-Language': 'tr-TR'
          }
        });
        if (response.ok) {
          const data = await response.json();
          setCitySuggestions(data.map((item: any) => ({
            name: item.display_name.split(',')[0],
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon),
            country: item.display_name.split(',').pop()?.trim() || 'Türkiye',
            tz: 'Europe/Istanbul'
          })));
        }
      } catch (e) {
        console.error('City search error:', e);
      }
    };

    const timer = setTimeout(fetchCities, 500);
    return () => clearTimeout(timer);
  }, [citySearch]);

  const handleLoadPreset = (preset: BenchmarkPreset) => {
    setActivePreset(preset.id);
    setDateKnowledgeMode('exact');
    setBirthDate(preset.birthDate);
    const targetCity = ASTRO_CITIES.find(c => c.name.toLowerCase().includes(preset.cityName.toLowerCase())) || {
      name: preset.cityName,
      lat: preset.cityName === 'San Francisco' ? 37.7749 : preset.cityName === 'Honolulu' ? 21.3069 : 51.5074,
      lon: preset.cityName === 'San Francisco' ? -122.4194 : preset.cityName === 'Honolulu' ? -157.8583 : -0.1278,
      tz: preset.cityName === 'San Francisco' ? 'America/Los_Angeles' : preset.cityName === 'Honolulu' ? 'Pacific/Honolulu' : 'Europe/London',
      country: preset.cityName === 'Londra' ? 'İngiltere' : 'ABD'
    };
    setSelectedCity(targetCity as AstroCity);
    setBodyType(preset.bodyType);
    setElementTemperament(preset.element);
    setEvents([...preset.events]);
    setTimeWindowType(preset.timeWindowType);
    setCurrentStep(3);
  };

  const getAccuracyGauge = () => {
    const count = events.length;
    if (count === 0) return { percent: 40, label: 'Yetersiz Veri', color: '#6B7280' };
    if (count === 1) return { percent: 65, label: 'Temel Yakınsama', color: '#F59E0B' };
    if (count === 2) return { percent: 80, label: 'İyi Korelasyon', color: '#3B82F6' };
    if (count === 3) return { percent: 92, label: 'Yüksek Doğruluk', color: '#10B981' };
    return { percent: 99.6, label: 'Maksimum Kesinlik (%99+)', color: '#D4AF37' };
  };

  const accuracy = getAccuracyGauge();

  const handleAddEvent = () => {
    if (!newEventDate || newEventDate.length < 10) {
      Alert.alert('Eksik Tarih', 'Lütfen olayın gerçekleştiği tarihi (YYYY-AA-GG) tam giriniz.');
      return;
    }
    const template = EVENT_TEMPLATES.find(t => t.type === newEventTemplate);
    const title = newEventTitle.trim() || template?.label || 'Önemli Olay';

    const newEv: LifeEvent = {
      id: Date.now().toString(),
      type: newEventTemplate,
      title,
      date: newEventDate
    };

    setEvents(prev => [...prev, newEv]);
    setNewEventTitle('');
    setNewEventDate('');
    setShowEventSelector(false);
  };

  const handleRemoveEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const handleCalculate = async () => {
    if (events.length === 0) {
      Alert.alert('Olay Gerekli', 'Lütfen doğum saatinizi belirlemek için en az 1 kadersel yaşam olayı ekleyiniz.');
      return;
    }

    setIsCalculating(true);
    setErrorMsg('');

    let startHour = 0;
    let endHour = 24;

    if (timeWindowType === 'morning') { startHour = 6; endHour = 12; }
    else if (timeWindowType === 'afternoon') { startHour = 12; endHour = 18; }
    else if (timeWindowType === 'evening') { startHour = 17; endHour = 23; }
    else if (timeWindowType === 'night') { startHour = 0; endHour = 6; }
    else if (timeWindowType === 'custom') { startHour = customStartHour; endHour = customEndHour; }

    const payload = {
      dateMode: dateKnowledgeMode,
      birthDate: dateKnowledgeMode === 'exact' ? birthDate : undefined,
      birthYear: dateKnowledgeMode !== 'exact' ? birthYear : undefined,
      birthMonth: dateKnowledgeMode === 'month' ? birthMonth : undefined,
      birthSeason: dateKnowledgeMode === 'season' ? birthSeason : undefined,
      birthCity: {
        name: selectedCity.name,
        lat: selectedCity.lat,
        lon: selectedCity.lon,
        tz: selectedCity.tz || 'Europe/Istanbul',
        country: selectedCity.country || 'Türkiye'
      },
      timeWindow: { startHour, endHour },
      bodyType,
      elementTemperament,
      events
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/astrology/rectification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const resJson = await response.json();
      if (!response.ok || !resJson.success) {
        throw new Error(resJson.error || 'Rektifikasyon hesaplaması başarısız oldu.');
      }

      setResult(resJson.data);
      setCurrentStep(4);
    } catch (err: any) {
      console.error('Rectification Calculation Error:', err);
      setErrorMsg(err.message || 'Hesaplama sırasında beklenmeyen bir hata oluştu.');
      Alert.alert('Hata', err.message || 'Hesaplama sırasında beklenmeyen bir hata oluştu.');
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <SacredBackground>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={26} color="#D4AF37" />
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.headerTitle}>Doğum Saati Belirleme</Text>
          <Text style={styles.headerSubtitle}>Kadersel Rektifikasyon & İlerleme Analizi</Text>
        </View>
        <View style={{ width: 26 }} />
      </View>

      {/* Step Progress Indicator */}
      <View style={styles.stepIndicatorContainer}>
        {[
          { step: 1, label: 'Doğum', icon: 'calendar-outline' as const },
          { step: 2, label: 'Mizaç', icon: 'flame-outline' as const },
          { step: 3, label: 'Olaylar', icon: 'sparkles-outline' as const },
          { step: 4, label: 'Sonuç', icon: 'time-outline' as const },
        ].map(s => (
          <TouchableOpacity
            key={s.step}
            onPress={() => {
              if (s.step < currentStep || (s.step === 4 && result)) {
                setCurrentStep(s.step);
              }
            }}
            style={styles.stepItem}
            disabled={s.step > currentStep && !(s.step === 4 && result)}
          >
            <View style={[
              styles.stepCircle,
              currentStep === s.step && styles.stepCircleActive,
              currentStep > s.step && styles.stepCircleCompleted
            ]}>
              <Ionicons 
                name={currentStep > s.step ? 'checkmark' : s.icon} 
                size={14} 
                color={currentStep >= s.step ? '#000' : '#9CA3AF'} 
              />
            </View>
            <Text style={[
              styles.stepLabel,
              currentStep === s.step && styles.stepLabelActive
            ]}>
              {s.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* STEP 1: DOĞUM BİLGİLERİ */}
        {currentStep === 1 && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="calendar" size={20} color="#D4AF37" />
              <Text style={styles.cardTitle}>1. Doğum Bilgileri & Zaman Penceresi</Text>
            </View>

            {/* Tarih Bilgisi Modu */}
            <Text style={styles.fieldLabel}>Doğum Tarihini Ne Kadar Biliyorsunuz?</Text>
            <View style={styles.modeSegment}>
              {[
                { id: 'exact', label: 'Kesin Gün' },
                { id: 'month', label: 'Ay ve Yıl' },
                { id: 'season', label: 'Mevsim ve Yıl' },
              ].map(m => (
                <TouchableOpacity
                  key={m.id}
                  onPress={() => setDateKnowledgeMode(m.id as any)}
                  style={[styles.segmentBtn, dateKnowledgeMode === m.id && styles.segmentBtnActive]}
                >
                  <Text style={[styles.segmentBtnText, dateKnowledgeMode === m.id && styles.segmentBtnTextActive]}>
                    {m.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Exact Date Input */}
            {dateKnowledgeMode === 'exact' && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Doğum Tarihi (YYYY-AA-GG)</Text>
                <TextInput
                  style={styles.input}
                  value={birthDate}
                  onChangeText={setBirthDate}
                  placeholder="Örn: 1992-06-15"
                  placeholderTextColor="#666"
                />
              </View>
            )}

            {/* Month/Year Input */}
            {dateKnowledgeMode === 'month' && (
              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.inputLabel}>Doğum Yılı</Text>
                  <TextInput
                    style={styles.input}
                    value={birthYear.toString()}
                    onChangeText={t => setBirthYear(parseInt(t) || 1990)}
                    keyboardType="numeric"
                    placeholder="1990"
                    placeholderTextColor="#666"
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Doğum Ayı (1-12)</Text>
                  <TextInput
                    style={styles.input}
                    value={birthMonth.toString()}
                    onChangeText={t => setBirthMonth(parseInt(t) || 1)}
                    keyboardType="numeric"
                    placeholder="6"
                    placeholderTextColor="#666"
                  />
                </View>
              </View>
            )}

            {/* Season Input */}
            {dateKnowledgeMode === 'season' && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Doğum Yılı</Text>
                <TextInput
                  style={styles.input}
                  value={birthYear.toString()}
                  onChangeText={t => setBirthYear(parseInt(t) || 1990)}
                  keyboardType="numeric"
                  placeholder="1990"
                  placeholderTextColor="#666"
                />
                <Text style={[styles.inputLabel, { marginTop: 10 }]}>Mevsim</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                  {[
                    { id: 'spring', label: '🌸 İlkbahar' },
                    { id: 'summer', label: '☀️ Yaz' },
                    { id: 'autumn', label: '🍂 Sonbahar' },
                    { id: 'winter', label: '❄️ Kış' },
                  ].map(s => (
                    <TouchableOpacity
                      key={s.id}
                      onPress={() => setBirthSeason(s.id as any)}
                      style={[styles.pillBtn, birthSeason === s.id && styles.pillBtnActiveGold]}
                    >
                      <Text style={[styles.pillBtnText, birthSeason === s.id && { color: '#000', fontWeight: 'bold' }]}>
                        {s.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Doğum Şehri */}
            <View style={[styles.inputGroup, { marginTop: 10 }]}>
              <Text style={styles.inputLabel}>Doğum Şehri</Text>
              <TextInput
                style={styles.input}
                value={citySearch || selectedCity.name}
                onChangeText={t => {
                  setCitySearch(t);
                  setShowCitySuggestions(true);
                }}
                onFocus={() => setShowCitySuggestions(true)}
                placeholder="Şehir adı yazın..."
                placeholderTextColor="#666"
              />
              {showCitySuggestions && citySuggestions.length > 0 && (
                <View style={styles.suggestionsBox}>
                  {citySuggestions.map((c, idx) => (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => {
                        setSelectedCity(c);
                        setCitySearch(c.name);
                        setShowCitySuggestions(false);
                        Keyboard.dismiss();
                      }}
                      style={styles.suggestionRow}
                    >
                      <Text style={styles.suggestionText}>{c.name}, {c.country}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Tahmini Zaman Penceresi */}
            <Text style={[styles.fieldLabel, { marginTop: 14 }]}>Günün Hangi Diliminde Doğdunuz?</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
              {[
                { id: 'all', label: 'Tüm Gün (24 Saat)' },
                { id: 'morning', label: 'Sabah (06-12)' },
                { id: 'afternoon', label: 'Öğle (12-18)' },
                { id: 'evening', label: 'Akşam (17-23)' },
                { id: 'night', label: 'Gece (00-06)' },
              ].map(w => (
                <TouchableOpacity
                  key={w.id}
                  onPress={() => setTimeWindowType(w.id as any)}
                  style={[styles.pillBtn, timeWindowType === w.id && styles.pillBtnActiveGold]}
                >
                  <Text style={[styles.pillBtnText, timeWindowType === w.id && { color: '#000', fontWeight: 'bold' }]}>
                    {w.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Next Button */}
            <TouchableOpacity
              onPress={() => setCurrentStep(2)}
              style={styles.primaryActionBtn}
            >
              <Text style={styles.primaryActionBtnText}>Devam Et: Mizaç & Beden</Text>
              <Ionicons name="arrow-forward" size={18} color="#000" />
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 2: MİZAÇ VE BEDEN */}
        {currentStep === 2 && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="flame" size={20} color="#F59E0B" />
              <Text style={styles.cardTitle}>2. Fiziksel Mizaç & Beden Morfolojisi</Text>
            </View>
            <Text style={styles.cardDescription}>
              Antik ve modern rektifikasyonda Yükselen Burç (ASC), kişinin beden yapısını ve ilk tepkilerini belirler.
            </Text>

            {/* 4 Element Mizaç */}
            <Text style={styles.fieldLabel}>Baskın Mizaç & Tepki Tarzınız</Text>
            <View style={{ gap: 8, marginBottom: 16 }}>
              {[
                { id: 'fire', icon: 'flame', label: 'Ateş Mizacı', desc: 'Dinamik, sabırsız, cesur, doğrudan harekete geçen', color: '#EF4444' },
                { id: 'earth', icon: 'earth', label: 'Toprak Mizacı', desc: 'Sakin, temkinli, sabırlı, dayanıklı ve pratik', color: '#10B981' },
                { id: 'air', icon: 'swap-horizontal', label: 'Hava Mizacı', desc: 'Konuşkan, zihinsel, meraklı, sosyal ve hızlı', color: '#3B82F6' },
                { id: 'water', icon: 'water', label: 'Su Mizacı', desc: 'Duygusal, sezgisel, içe dönük, derin ve korumacı', color: '#06B6D4' },
              ].map(el => (
                <TouchableOpacity
                  key={el.id}
                  onPress={() => setElementTemperament(el.id as any)}
                  style={[
                    styles.temperamentCard,
                    elementTemperament === el.id && { borderColor: el.color, backgroundColor: `${el.color}15` }
                  ]}
                >
                  <View style={[styles.temperamentIcon, { backgroundColor: `${el.color}25` }]}>
                    <Ionicons name={el.icon as any} size={20} color={el.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.temperamentTitle, elementTemperament === el.id && { color: el.color }]}>
                      {el.label}
                    </Text>
                    <Text style={styles.temperamentDesc}>{el.desc}</Text>
                  </View>
                  {elementTemperament === el.id && (
                    <Ionicons name="checkmark-circle" size={20} color={el.color} />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Beden Tipi */}
            <Text style={styles.fieldLabel}>Beden Yapınız / Kemik Çatınız</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {[
                { id: 'slender', label: 'Narin / İnce Uzun' },
                { id: 'athletic', label: 'Atletik / Kaslı' },
                { id: 'stocky', label: 'Tıknaz / Güçlü Kemikli' },
                { id: 'petite', label: 'Minyon / Zarif' },
                { id: 'curvy', label: 'Kıvrımlı / Yuvarlak Hatlı' },
              ].map(b => (
                <TouchableOpacity
                  key={b.id}
                  onPress={() => setBodyType(b.id as any)}
                  style={[styles.pillBtn, bodyType === b.id && styles.pillBtnActiveGold]}
                >
                  <Text style={[styles.pillBtnText, bodyType === b.id && { color: '#000', fontWeight: 'bold' }]}>
                    {b.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Navigation Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                onPress={() => setCurrentStep(1)}
                style={styles.secondaryBtn}
              >
                <Ionicons name="arrow-back" size={16} color="#9CA3AF" />
                <Text style={styles.secondaryBtnText}>Geri</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setCurrentStep(3)}
                style={[styles.primaryActionBtn, { flex: 1, marginLeft: 10 }]}
              >
                <Text style={styles.primaryActionBtnText}>Olaylara Geç</Text>
                <Ionicons name="arrow-forward" size={18} color="#000" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* STEP 3: YAŞAM OLAYLARI */}
        {currentStep === 3 && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="sparkles" size={20} color="#34D399" />
              <Text style={styles.cardTitle}>3. Kadersel Yaşam Olayları</Text>
            </View>
            <Text style={styles.cardDescription}>
              Rektifikasyon, önemli yaşam olaylarınızın gerçekleştiği tarihlerde gökyüzü açılarını geriye doğru tarayarak kesin doğum anınızı bulur.
            </Text>

            {/* Accuracy Gauge */}
            <View style={styles.accuracyCard}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <Text style={styles.accuracyLabel}>Tahmini Hesaplama Kesinliği</Text>
                <Text style={[styles.accuracyPercent, { color: accuracy.color }]}>%{accuracy.percent}</Text>
              </View>
              <View style={styles.accuracyTrack}>
                <View style={[styles.accuracyFill, { width: `${accuracy.percent}%`, backgroundColor: accuracy.color }]} />
              </View>
              <Text style={styles.accuracyHint}>
                {events.length} olay girildi • {accuracy.label}
              </Text>
            </View>

            {/* Benchmark Preset Pills */}
            <View style={styles.presetSection}>
              <Text style={styles.presetSectionTitle}>Veya Hazır Test Profili Yükleyin:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                {BENCHMARK_PRESETS.map(p => (
                  <TouchableOpacity
                    key={p.id}
                    onPress={() => handleLoadPreset(p)}
                    style={[styles.presetCard, activePreset === p.id && styles.presetCardActive]}
                  >
                    <Text style={[styles.presetName, activePreset === p.id && { color: '#D4AF37' }]}>{p.name}</Text>
                    <Text style={styles.presetTime}>{p.officialTime}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Eklenen Olaylar */}
            <View style={{ marginVertical: 14 }}>
              <Text style={styles.fieldLabel}>Eklenen Kadersel Olaylar ({events.length})</Text>
              {events.map((ev, idx) => {
                const tmpl = EVENT_TEMPLATES.find(t => t.type === ev.type);
                return (
                  <View key={ev.id} style={styles.eventRow}>
                    <View style={[styles.eventRowIcon, { backgroundColor: `${tmpl?.color || '#D4AF37'}20` }]}>
                      <Ionicons name={tmpl?.icon || 'sparkles'} size={18} color={tmpl?.color || '#D4AF37'} />
                    </View>
                    <View style={{ flex: 1, marginHorizontal: 10 }}>
                      <Text style={styles.eventRowTitle}>{ev.title}</Text>
                      <Text style={styles.eventRowDate}>{ev.date} • {tmpl?.label}</Text>
                    </View>
                    <TouchableOpacity onPress={() => handleRemoveEvent(ev.id)} style={styles.deleteBtn}>
                      <Ionicons name="trash-outline" size={18} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>

            {/* Yeni Olay Ekleme Butonu & Modalı */}
            <TouchableOpacity
              onPress={() => setShowEventSelector(!showEventSelector)}
              style={styles.addEventToggleBtn}
            >
              <Ionicons name={showEventSelector ? "close-circle" : "add-circle"} size={20} color="#D4AF37" />
              <Text style={styles.addEventToggleBtnText}>
                {showEventSelector ? "Formu Kapat" : "+ Yeni Yaşam Olayı Ekle"}
              </Text>
            </TouchableOpacity>

            {showEventSelector && (
              <View style={styles.addEventBox}>
                <Text style={styles.inputLabel}>Olay Türü Seçin</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, marginBottom: 12 }}>
                  {EVENT_TEMPLATES.map(t => (
                    <TouchableOpacity
                      key={t.type}
                      onPress={() => {
                        setNewEventTemplate(t.type);
                        setNewEventTitle(t.label);
                      }}
                      style={[styles.pillBtn, newEventTemplate === t.type && styles.pillBtnActiveGold]}
                    >
                      <Text style={[styles.pillBtnText, newEventTemplate === t.type && { color: '#000', fontWeight: 'bold' }]}>
                        {t.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <Text style={styles.inputLabel}>Olay Başlığı (Opsiyonel)</Text>
                <TextInput
                  style={styles.input}
                  value={newEventTitle}
                  onChangeText={setNewEventTitle}
                  placeholder="Örn: Terfi Aldığım Gün"
                  placeholderTextColor="#666"
                />

                <Text style={[styles.inputLabel, { marginTop: 8 }]}>Olay Tarihi (YYYY-AA-GG)</Text>
                <TextInput
                  style={styles.input}
                  value={newEventDate}
                  onChangeText={setNewEventDate}
                  placeholder="Örn: 2018-05-24"
                  placeholderTextColor="#666"
                />

                <TouchableOpacity
                  onPress={handleAddEvent}
                  style={[styles.primaryActionBtn, { marginTop: 12 }]}
                >
                  <Text style={styles.primaryActionBtnText}>Listeye Ekle</Text>
                  <Ionicons name="checkmark" size={18} color="#000" />
                </TouchableOpacity>
              </View>
            )}

            {/* Hesaba Başla Butonu */}
            <TouchableOpacity
              onPress={handleCalculate}
              disabled={isCalculating}
              style={[styles.calculateBtn, { marginTop: 20 }]}
            >
              <LinearGradient
                colors={['#D4AF37', '#0EA5E9']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.calculateBtnGrad}
              >
                {isCalculating ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <ActivityIndicator size="small" color="#000" />
                    <Text style={styles.calculateBtnText}>Solar Arc & Transitler Taranıyor...</Text>
                  </View>
                ) : (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Ionicons name="flash" size={20} color="#000" />
                    <Text style={styles.calculateBtnText}>Doğum Saatimi Hesapla</Text>
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setCurrentStep(2)} style={styles.prevTextBtn}>
              <Text style={styles.prevTextBtnLabel}>← Mizaç Adımına Dön</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 4: SONUÇ RAPORU */}
        {currentStep === 4 && result && (
          <View style={{ width: '100%', gap: 16 }}>
            {/* Best Time Hero Card */}
            <LinearGradient
              colors={['rgba(212, 175, 55, 0.25)', 'rgba(14, 165, 233, 0.2)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroCard}
            >
              <View style={styles.heroBadge}>
                <Ionicons name="checkmark-done" size={14} color="#D4AF37" />
                <Text style={styles.heroBadgeText}>EN YÜKSEK KORELASYONLU DOĞUM SAATİ</Text>
              </View>

              <Text style={styles.heroTimeText}>
                {result.bestCandidate?.timeStr?.slice(0, 5) || '19:42'}
              </Text>

              <View style={styles.heroMetaRow}>
                <View style={styles.heroMetaItem}>
                  <Text style={styles.heroMetaLabel}>Yükselen (ASC)</Text>
                  <Text style={styles.heroMetaVal}>{result.bestCandidate?.ascSign} {Math.round(result.bestCandidate?.ascDegree || 0)}°</Text>
                </View>
                <View style={[styles.heroMetaItem, { borderLeftWidth: 1, borderRightWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }]}>
                  <Text style={styles.heroMetaLabel}>Tepe Noktası (MC)</Text>
                  <Text style={styles.heroMetaVal}>{result.bestCandidate?.mcSign} {Math.round(result.bestCandidate?.mcDegree || 0)}°</Text>
                </View>
                <View style={styles.heroMetaItem}>
                  <Text style={styles.heroMetaLabel}>Güven Skoru</Text>
                  <Text style={[styles.heroMetaVal, { color: '#10B981' }]}>
                    %{Math.round(result.bestCandidate?.confidencePercent || 92)}
                  </Text>
                </View>
              </View>
            </LinearGradient>

            {/* Doğrulanan Olaylar */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                <Text style={styles.cardTitle}>Astrolojik Doğrulamalar</Text>
              </View>
              <Text style={styles.cardDescription}>
                Aşağıdaki olaylar belirtilen doğum saatinde tam orblarla teyit edilmiştir:
              </Text>

              {result.bestCandidate?.eventMatches?.map((em: any, idx: number) => (
                <View key={idx} style={styles.matchCard}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <Text style={styles.matchTitle}>{em.eventTitle}</Text>
                    <View style={styles.orbPill}>
                      <Text style={styles.orbPillText}>Orb: {em.orb?.toFixed(2)}°</Text>
                    </View>
                  </View>
                  <Text style={styles.matchTech}>{em.technique} • {em.aspect} ({em.matchedPoint})</Text>
                  <Text style={styles.matchExpl}>{em.explanation}</Text>
                </View>
              ))}
            </View>

            {/* Alternatif Zirveler */}
            {result.topCandidates && result.topCandidates.length > 1 && (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Ionicons name="list" size={20} color="#3B82F6" />
                  <Text style={styles.cardTitle}>Diğer Olası Saat Adayları</Text>
                </View>
                {result.topCandidates.slice(1, 4).map((c: any, idx: number) => (
                  <View key={idx} style={styles.candidateRow}>
                    <View>
                      <Text style={styles.candidateTime}>{c.timeStr?.slice(0, 5)}</Text>
                      <Text style={styles.candidateAsc}>ASC: {c.ascSign}</Text>
                    </View>
                    <View style={styles.candidateScorePill}>
                      <Text style={styles.candidateScoreText}>Skor: {Math.round(c.confidencePercent || 0)}%</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Eylem Butonları */}
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: '/(dashboard)/kisisel-analizler/astroloji',
                  params: {
                    date: dateKnowledgeMode === 'exact' ? birthDate : `${birthYear}-06-15`,
                    time: result.bestCandidate?.timeStr?.slice(0, 5) || '12:00',
                    city: selectedCity.name
                  }
                });
              }}
              style={styles.calculateBtn}
            >
              <LinearGradient
                colors={['#D4AF37', '#0EA5E9']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.calculateBtnGrad}
              >
                <Text style={styles.calculateBtnText}>Bu Saatle Doğum Haritamı Aç</Text>
                <Ionicons name="planet" size={18} color="#000" />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setResult(null);
                setCurrentStep(1);
              }}
              style={styles.secondaryActionBtn}
            >
              <Text style={styles.secondaryActionBtnText}>Yeni Hesaplama Yap</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SacredBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.15)',
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#D4AF37' },
  headerSubtitle: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },
  
  stepIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 14,
    backgroundColor: 'rgba(10, 10, 15, 0.6)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  stepItem: { alignItems: 'center' },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    marginBottom: 4,
  },
  stepCircleActive: {
    backgroundColor: '#D4AF37',
    borderColor: '#D4AF37',
  },
  stepCircleCompleted: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  stepLabel: { fontSize: 10, color: '#9CA3AF' },
  stepLabelActive: { color: '#D4AF37', fontWeight: 'bold' },

  scrollContent: { padding: 16 },

  card: {
    backgroundColor: 'rgba(20, 20, 25, 0.85)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 18,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFF',
  },
  cardDescription: {
    fontSize: 12,
    color: '#9CA3AF',
    lineHeight: 18,
    marginBottom: 16,
  },

  fieldLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 8,
  },
  modeSegment: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    padding: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 14,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 9,
  },
  segmentBtnActive: {
    backgroundColor: '#D4AF37',
  },
  segmentBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  segmentBtnTextActive: {
    color: '#000',
    fontWeight: 'bold',
  },

  inputGroup: { marginBottom: 12 },
  inputRow: { flexDirection: 'row' },
  inputLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 4,
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#FFF',
    fontSize: 13,
  },

  suggestionsBox: {
    backgroundColor: '#1E293B',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3B82F6',
    marginTop: 4,
    overflow: 'hidden',
  },
  suggestionRow: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  suggestionText: {
    color: '#FFF',
    fontSize: 12,
  },

  pillBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  pillBtnActiveGold: {
    backgroundColor: '#D4AF37',
    borderColor: '#D4AF37',
  },
  pillBtnText: {
    fontSize: 11,
    color: '#9CA3AF',
  },

  temperamentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  temperamentIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  temperamentTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 2,
  },
  temperamentDesc: {
    fontSize: 11,
    color: '#9CA3AF',
  },

  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  secondaryBtnText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },

  primaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D4AF37',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  primaryActionBtnText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },

  accuracyCard: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 14,
  },
  accuracyLabel: { fontSize: 11, color: '#9CA3AF' },
  accuracyPercent: { fontSize: 12, fontWeight: 'bold' },
  accuracyTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
    marginVertical: 6,
  },
  accuracyFill: { height: '100%', borderRadius: 3 },
  accuracyHint: { fontSize: 10, color: '#9CA3AF' },

  presetSection: { marginBottom: 14 },
  presetSectionTitle: { fontSize: 11, color: '#9CA3AF', marginBottom: 8, fontWeight: '600' },
  presetCard: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  presetCardActive: {
    borderColor: '#D4AF37',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  presetName: { fontSize: 11, fontWeight: 'bold', color: '#FFF' },
  presetTime: { fontSize: 9, color: '#9CA3AF', marginTop: 2 },

  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: 8,
  },
  eventRowIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventRowTitle: { fontSize: 12, fontWeight: 'bold', color: '#FFF' },
  eventRowDate: { fontSize: 10, color: '#9CA3AF', marginTop: 2 },
  deleteBtn: { padding: 6 },

  addEventToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    gap: 6,
  },
  addEventToggleBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#D4AF37',
  },

  addEventBox: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    marginTop: 10,
  },

  calculateBtn: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  calculateBtnGrad: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calculateBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000',
  },

  prevTextBtn: {
    alignItems: 'center',
    marginTop: 12,
    padding: 6,
  },
  prevTextBtnLabel: {
    fontSize: 11,
    color: '#9CA3AF',
  },

  /* Sonuç Ekranı Stilleri */
  heroCard: {
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    alignItems: 'center',
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 10,
  },
  heroBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  heroTimeText: {
    fontSize: 44,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 2,
    marginBottom: 14,
  },
  heroMetaRow: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 14,
    paddingVertical: 10,
  },
  heroMetaItem: {
    flex: 1,
    alignItems: 'center',
  },
  heroMetaLabel: {
    fontSize: 9,
    color: '#9CA3AF',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  heroMetaVal: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFF',
  },

  matchCard: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: 8,
  },
  matchTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFF',
  },
  orbPill: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  orbPillText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#34D399',
  },
  matchTech: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 4,
  },
  matchExpl: {
    fontSize: 11,
    color: '#9CA3AF',
    lineHeight: 16,
  },

  candidateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  candidateTime: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
  },
  candidateAsc: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  candidateScorePill: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  candidateScoreText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#60A5FA',
  },

  secondaryActionBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  secondaryActionBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  }
});
