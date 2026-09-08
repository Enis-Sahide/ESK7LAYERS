import SacredBackground from '@/components/SacredBackground';
import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput, 
  Alert, 
  KeyboardAvoidingView, 
  Platform, 
  Keyboard, 
  ActivityIndicator 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { COLORS, SIZES } from '@/src/theme';
import { useContent } from '@/src/core/content/useContent';
import { API_BASE_URL } from '@/src/core/config';
import { 
  PhoneticChakraEngine, 
  CHAKRA_METADATA, 
  BODY_CENTERS_METADATA,
  TargetGoal, 
  SimulationComparison, 
  BrandAnalysisResult, 
  SuggestedNameItem,
  BodyCenter
} from '@/src/features/numerology/engine/PhoneticChakraEngine';
import { isAuthenticated, onAuthChange } from '@/src/core/api/client';

// Master numbers
const isMaster = (num: number) => num === 11 || num === 22 || num === 33;

const reduceNumber = (num: number): number => {
  if (isMaster(num)) return num;
  let sum = num;
  while (sum > 9 && !isMaster(sum)) {
    sum = sum.toString().split('').reduce((a, b) => a + parseInt(b), 0);
  }
  return sum;
};

interface NumerologyResults {
  lifePathRaw: string;
  lifePath: number;
  destiny: number;
  soulUrge: number;
  personality: number;
  purpose: number;
  challenges: string;
  chakraMatrix: number[];
}

export default function NumerolojiKisiselAnalizScreen() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const dayRef = useRef<TextInput>(null);
  const monthRef = useRef<TextInput>(null);
  const yearRef = useRef<TextInput>(null);
  
  const [name, setName] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Tabs: 'name' | 'date' | 'brand'
  const [activeTab, setActiveTab] = useState<'name' | 'date' | 'brand'>('name');

  // Simulator Inputs in Name Tab
  const [additionalNameInput, setAdditionalNameInput] = useState('');
  const [selectedGoal, setSelectedGoal] = useState<TargetGoal>('wealth');
  const [simulationData, setSimulationData] = useState<SimulationComparison | null>(null);

  // Brand Inputs & Result
  const [brandName, setBrandName] = useState('');
  const [brandSlogan, setBrandSlogan] = useState('');
  const [brandResult, setBrandResult] = useState<BrandAnalysisResult | null>(null);

  // İçerik API'den (sayı anlamları + hesap sözlükleri)
  const { data: numMeanings } = useContent<Record<number, any>>('/api/content/numerology/meanings');
  const { data: calcData } = useContent<Record<string, Record<string, any>>>('/api/content/numerology/calc');
  const numerologyData: Record<number, any> = numMeanings ?? {};
  const lifePathData: Record<number, any> = calcData?.life_path ?? {};
  const birthdayData: Record<number, any> = calcData?.birthday ?? {};
  const arrowsData: Record<string, any> = calcData?.arrows ?? {};
  const emptyArrowsData: Record<string, any> = calcData?.empty_arrows ?? {};
  const personalYearData: Record<number, any> = calcData?.personal_year ?? {};

  const [results, setResults] = useState<NumerologyResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [dateResults, setDateResults] = useState<{
    lifePath: { number: number; calculationString: string };
    birthday: number;
    arrows: { arrowKeys: string[]; emptyArrowKeys: string[]; visualString: string };
    personalYear: { number: number; calculationString: string };
  } | null>(null);

  useEffect(() => {
    isAuthenticated().then(setIsLoggedIn);
    const unsub = onAuthChange(() => {
      isAuthenticated().then(setIsLoggedIn);
    });
    return unsub;
  }, []);

  const calculateNumerology = async () => {
    if (!name || !day || !month || !year) {
      Alert.alert("Eksik Bilgi", "Lütfen tüm alanları doldurun.");
      return;
    }

    const d = parseInt(day);
    const m = parseInt(month);
    const y = parseInt(year);

    if (isNaN(d) || isNaN(m) || isNaN(y) || d < 1 || d > 31 || m < 1 || m > 12 || y < 1900 || y > 2100) {
      Alert.alert("Geçersiz Tarih", "Lütfen geçerli bir doğum tarihi girin.");
      return;
    }

    setLoading(true);
    try {
      const formattedMonth = String(m).padStart(2, '0');
      const formattedDay = String(d).padStart(2, '0');
      const birthDateStr = `${y}-${formattedMonth}-${formattedDay}`;

      const response = await fetch(`${API_BASE_URL}/api/numerology`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ birthDate: birthDateStr, name }),
      });

      if (!response.ok) {
        throw new Error('API hatası');
      }

      const data = await response.json();
      
      const dRed = reduceNumber(d);
      const mRed = reduceNumber(m);
      const yRed = reduceNumber(y);
      const lifePathSum = dRed + mRed + yRed;
      const lifePathRaw = `${lifePathSum}/${data.lifePath.number}`;

      setResults({
        lifePathRaw,
        lifePath: data.lifePath.number,
        destiny: data.nameAnalysis.destiny,
        soulUrge: data.nameAnalysis.soulUrge,
        personality: data.nameAnalysis.personality,
        purpose: data.nameAnalysis.purpose,
        challenges: data.nameAnalysis.challenges,
        chakraMatrix: data.nameAnalysis.chakraMatrix
      });

      // Initial simulation with no / existing additional name
      const sim = PhoneticChakraEngine.simulatePersonalName(name, additionalNameInput);
      setSimulationData(sim);
      
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 300);
    } catch (error) {
      console.error('API Error:', error);
      Alert.alert("Hata", "Hesaplama yapılırken bir sorun oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdditionalNameChange = (newAddName: string) => {
    setAdditionalNameInput(newAddName);
    if (name.trim()) {
      const sim = PhoneticChakraEngine.simulatePersonalName(name, newAddName);
      setSimulationData(sim);
    }
  };

  const calculateBrandNumerology = () => {
    if (!brandName.trim()) {
      Alert.alert("Eksik Bilgi", "Lütfen marka veya şirket adını girin.");
      return;
    }
    setLoading(true);
    try {
      const fullBrand = brandSlogan.trim() ? `${brandName.trim()} ${brandSlogan.trim()}` : brandName.trim();
      const res = PhoneticChakraEngine.analyzeBrand(fullBrand);
      setBrandResult(res);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 300);
    } catch (error) {
      console.error("Brand analysis error:", error);
      Alert.alert("Hata", "Marka akustiği analiz edilirken bir sorun oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const getMatrixText = (count: number) => {
    if (count === 0) return 'Eksik';
    if (count === 1) return '1 Harf';
    return `${count} Harf`;
  };

  const renderDetailBlock = (title: string, subtitle: string, content: string) => {
    if (!content) return null;
    return (
      <View style={{ marginBottom: 20 }}>
        <Text style={styles.detailTitle}>{title}</Text>
        {subtitle && <Text style={styles.detailSubtitle}>{subtitle}</Text>}
        <Text style={styles.detailText}>{content}</Text>
      </View>
    );
  };

  const renderAnalysisCard = (title: string, num: number, dataKey: 'lifePathDetails' | 'destinyDetails' | 'soulUrgeDetails' | 'personalityDetails' | 'description') => {
    const data = numerologyData[num] || numerologyData[reduceNumber(num)];
    if (!data) return null;

    return (
      <View key={title} style={styles.analysisCard}>
        <View style={styles.analysisHeader}>
          <View style={styles.numberBadge}>
            <Text style={styles.numberText}>{num}</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 15 }}>
            <Text style={styles.analysisMainTitle}>{title}</Text>
            <Text style={styles.analysisTypology}>{data.typology}</Text>
          </View>
        </View>

        {renderDetailBlock("Genel Analiz", "", dataKey === 'description' ? data.description : data[dataKey])}
        
        {dataKey === 'description' && (
          <>
            {renderDetailBlock("Yapıcı Potansiyeller", "", data.constructivePotentials)}
            {renderDetailBlock("Gölge Yönler", "", data.negativePotentials)}
            {renderDetailBlock("İkili İlişkiler", "", data.relationships)}
            {renderDetailBlock("Kariyer ve İş", "", data.career)}
          </>
        )}

        <View style={styles.planetaryRow}>
          <Ionicons name="planet-outline" size={16} color={COLORS.primary} />
          <Text style={styles.planetText}>Gezegen: {data.planet} • Element: {data.element}</Text>
        </View>
      </View>
    );
  };

  const calculateDateNumerology = async () => {
    if (!day || !month || !year) {
      Alert.alert("Eksik Bilgi", "Lütfen doğum tarihini doldurun.");
      return;
    }
    const d = parseInt(day);
    const m = parseInt(month);
    const y = parseInt(year);

    if (isNaN(d) || isNaN(m) || isNaN(y) || d < 1 || d > 31 || m < 1 || m > 12 || y < 1900 || y > 2100) {
      Alert.alert("Geçersiz Tarih", "Lütfen geçerli bir doğum tarihi girin.");
      return;
    }

    setLoading(true);
    try {
      const formattedMonth = String(m).padStart(2, '0');
      const formattedDay = String(d).padStart(2, '0');
      const birthDateStr = `${y}-${formattedMonth}-${formattedDay}`;

      const response = await fetch(`${API_BASE_URL}/api/numerology`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ birthDate: birthDateStr }),
      });

      if (!response.ok) {
        throw new Error('API hatası');
      }

      const data = await response.json();
      setDateResults(data);
      
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 300);
    } catch (error) {
      console.error('API Error:', error);
      Alert.alert("Hata", "Hesaplama yapılırken bir sorun oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const CollapsibleCard = ({ title, badgeNumber, subtitle, children }: { title: string, badgeNumber?: number | string, subtitle?: string, children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <View style={styles.collapsibleCard}>
        <TouchableOpacity 
          style={styles.collapsibleHeader} 
          onPress={() => setIsOpen(!isOpen)} 
          activeOpacity={0.7}
        >
          {badgeNumber !== undefined && (
            <View style={styles.collapsibleBadge}>
              <Text style={styles.collapsibleBadgeText}>{badgeNumber}</Text>
            </View>
          )}
          <View style={{ flex: 1, marginLeft: badgeNumber !== undefined ? 12 : 0 }}>
            <Text style={styles.collapsibleTitle}>{title}</Text>
            {subtitle && <Text style={styles.collapsibleSubtitle}>{subtitle}</Text>}
          </View>
          <Ionicons name={isOpen ? "chevron-up" : "chevron-down"} size={20} color={COLORS.primary} />
        </TouchableOpacity>
        {isOpen && (
          <View style={styles.collapsibleContent}>
            {children}
          </View>
        )}
      </View>
    );
  };

  return (
    <SacredBackground>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={28} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ezoterik Numeroloji & Akustik</Text>
        <View style={{ width: 28 }} />
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
      >
        <ScrollView 
          ref={scrollViewRef} 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false} 
          keyboardShouldPersistTaps="handled"
        >
        
        {!results && !dateResults && !brandResult && (
          <BlurView intensity={30} tint="dark" style={styles.introCard}>
            <Ionicons 
              name={activeTab === 'brand' ? "business" : "infinite"} 
              size={40} 
              color={COLORS.primary} 
              style={{ marginBottom: 10 }} 
            />
            <Text style={styles.introTitle}>
              {activeTab === 'brand' ? 'Ezoterik Marka & Kurumsal Akustik' : "Pisagor'un Kadim İlimi"}
            </Text>
            {activeTab === 'name' ? (
              <Text style={styles.introText}>
                İsminizin ve doğum tarihinizin evrensel barkodunu çözerek ruhunuzun amacını, doğuştan gelen yeteneklerinizi, 4 bedensel rezonans merkezini ve çakra analizlerinizi ortaya çıkarın.
              </Text>
            ) : activeTab === 'date' ? (
              <Text style={styles.introText}>
                Doğum tarihinizdeki sayısal titreşimleri çözümleyerek Yaşam Yolu, Doğum Günü yeteneği, Pisagor Okları ve Kişisel Yıl raporunuzu ortaya çıkarın.
              </Text>
            ) : (
              <Text style={styles.introText}>
                Şirketinizin, markanızın veya projenizin ismindeki fonetik ses dalgalarını, Ouroboros kapalı aura döngüsünü ve sektörel başarı uyumunu analiz edin.
              </Text>
            )}
          </BlurView>
        )}

        {/* CALCULATOR / INPUT SECTION */}
        <View style={styles.calculatorSection}>
          <View style={styles.tabContainer}>
            <TouchableOpacity 
              style={[styles.tabButton, activeTab === 'name' && styles.activeTabButton]} 
              onPress={() => {
                setActiveTab('name');
                setResults(null);
                setDateResults(null);
                setBrandResult(null);
              }}
            >
              <Ionicons 
                name="person-outline" 
                size={14} 
                color={activeTab === 'name' ? COLORS.background : COLORS.primary} 
                style={{ marginRight: 4 }} 
              />
              <Text style={[styles.tabButtonText, activeTab === 'name' && styles.activeTabButtonText]}>İsim & Tarih</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.tabButton, activeTab === 'date' && styles.activeTabButton]} 
              onPress={() => {
                setActiveTab('date');
                setResults(null);
                setDateResults(null);
                setBrandResult(null);
              }}
            >
              <Ionicons 
                name="calendar-outline" 
                size={14} 
                color={activeTab === 'date' ? COLORS.background : COLORS.primary} 
                style={{ marginRight: 4 }} 
              />
              <Text style={[styles.tabButtonText, activeTab === 'date' && styles.activeTabButtonText]}>Sadece Tarih</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.tabButton, activeTab === 'brand' && styles.activeTabButton]} 
              onPress={() => {
                setActiveTab('brand');
                setResults(null);
                setDateResults(null);
                setBrandResult(null);
              }}
            >
              <Ionicons 
                name="business-outline" 
                size={14} 
                color={activeTab === 'brand' ? COLORS.background : COLORS.primary} 
                style={{ marginRight: 4 }} 
              />
              <Text style={[styles.tabButtonText, activeTab === 'brand' && styles.activeTabButtonText]}>Marka Akustiği</Text>
            </TouchableOpacity>
          </View>

          {/* NAME & DATE TAB INPUTS */}
          {activeTab === 'name' && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nüfus Cüzdanındaki Tam Adınız</Text>
              <TextInput
                style={styles.input}
                placeholder="Örn: Fatma Yılmaz"
                placeholderTextColor="rgba(255,255,255,0.3)"
                value={name}
                onChangeText={setName}
                returnKeyType="next"
                onSubmitEditing={() => dayRef.current?.focus()}
                blurOnSubmit={false}
              />
            </View>
          )}

          {/* DATE INPUTS FOR NAME & DATE TABS */}
          {activeTab !== 'brand' && (
            <>
              <Text style={styles.inputLabel}>Doğum Tarihiniz</Text>
              <View style={styles.dateInputRow}>
                <TextInput
                  ref={dayRef}
                  style={[styles.dateInput, { flex: 1 }]}
                  placeholder="GG"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  keyboardType="number-pad"
                  maxLength={2}
                  value={day}
                  onChangeText={(text) => {
                    setDay(text);
                    if (text.length === 2) monthRef.current?.focus();
                  }}
                />
                <Text style={{ color: COLORS.textMuted, fontSize: 18, marginHorizontal: 8 }}>/</Text>
                <TextInput
                  ref={monthRef}
                  style={[styles.dateInput, { flex: 1 }]}
                  placeholder="AA"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  keyboardType="number-pad"
                  maxLength={2}
                  value={month}
                  onChangeText={(text) => {
                    setMonth(text);
                    if (text.length === 2) yearRef.current?.focus();
                  }}
                />
                <Text style={{ color: COLORS.textMuted, fontSize: 18, marginHorizontal: 8 }}>/</Text>
                <TextInput
                  ref={yearRef}
                  style={[styles.dateInput, { flex: 1.5 }]}
                  placeholder="YYYY"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  keyboardType="number-pad"
                  maxLength={4}
                  value={year}
                  onChangeText={(text) => {
                    setYear(text);
                    if (text.length === 4) Keyboard.dismiss();
                  }}
                  returnKeyType="done"
                  onSubmitEditing={activeTab === 'name' ? calculateNumerology : calculateDateNumerology}
                />
              </View>

              <TouchableOpacity 
                style={styles.calcBtn} 
                onPress={activeTab === 'name' ? calculateNumerology : calculateDateNumerology} 
                activeOpacity={0.8}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={COLORS.background} style={{ marginRight: 8 }} />
                ) : (
                  <Ionicons name="calculator" size={20} color={COLORS.background} style={{ marginRight: 8 }} />
                )}
                <Text style={styles.calcBtnText}>
                  {loading ? "Hesaplanıyor..." : (results || dateResults ? "Yeniden Hesapla" : "Analizi Çıkar")}
                </Text>
              </TouchableOpacity>
            </>
          )}

          {/* BRAND TAB INPUTS */}
          {activeTab === 'brand' && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Marka veya Şirket Adı *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Örn: Tesla, Apple, Maya, Hermes..."
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  value={brandName}
                  onChangeText={setBrandName}
                  autoCapitalize="words"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Slogan veya İkincil İsim (Opsiyonel)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Örn: Think Different, Danışmanlık..."
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  value={brandSlogan}
                  onChangeText={setBrandSlogan}
                />
              </View>
              <TouchableOpacity 
                style={styles.calcBtn} 
                onPress={calculateBrandNumerology} 
                activeOpacity={0.8}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={COLORS.background} style={{ marginRight: 8 }} />
                ) : (
                  <Ionicons name="sparkles" size={18} color={COLORS.background} style={{ marginRight: 8 }} />
                )}
                <Text style={styles.calcBtnText}>
                  {loading ? "Analiz Ediliyor..." : (brandResult ? "Yeniden Analiz Et" : "Marka Akustiğini Analiz Et")}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* RESULTS: NAME & DATE TAB */}
        {results && activeTab === 'name' && (
          <View style={styles.resultsContainer}>
            <Text style={styles.mainHeading}>{name.toLocaleUpperCase('tr-TR')} ÖZEL KISA NUMEROLOJİ ANALİZİ</Text>

            {/* ÖZET TABLOSU */}
            <View style={styles.summaryTable}>
              <View style={styles.summaryRowHeader}>
                <Text style={styles.summaryCellHeader}>HAYAT KULVARI</Text>
                <Text style={styles.summaryCellHeader}>KİŞİLİK RAKAMI</Text>
                <Text style={styles.summaryCellHeader}>İSİM NUMARASI</Text>
              </View>
              <View style={styles.summaryRowData}>
                <Text style={styles.summaryCellData}>{results.lifePathRaw}</Text>
                <Text style={styles.summaryCellData}>{results.personality}</Text>
                <Text style={styles.summaryCellData}>{results.destiny}</Text>
              </View>
              
              <View style={[styles.summaryRowHeader, { marginTop: 10 }]}>
                <Text style={styles.summaryCellHeader}>EN BÜYÜK SINAV</Text>
                <Text style={styles.summaryCellHeader}>RUHUNU TANIMLAMA</Text>
                <Text style={styles.summaryCellHeader}>VAROLUŞ AMACI</Text>
              </View>
              <View style={styles.summaryRowData}>
                <Text style={[styles.summaryCellData, { color: COLORS.error }]}>{results.challenges}</Text>
                <Text style={styles.summaryCellData}>{results.soulUrge}</Text>
                <Text style={styles.summaryCellData}>{results.purpose}</Text>
              </View>
            </View>

            {/* ÇAKRA SÜTUNU VE AÇIKLAMASI */}
            <View style={styles.chakraSection}>
              <View style={styles.chakraTable}>
                <View style={styles.chakraTableHeader}>
                  <Text style={styles.chakraTableTitle}>ÇAKRA SÜTUNU</Text>
                </View>
                {[9,8,7,6,5,4,3,2,1].map((c) => (
                  <View key={c} style={styles.chakraRow}>
                    <Text style={styles.chakraNum}>{c}. ÇAKRA</Text>
                    <Text style={[styles.chakraVal, results.chakraMatrix[c-1] === 0 && styles.chakraValMissing]}>
                      {getMatrixText(results.chakraMatrix[c-1])}
                    </Text>
                  </View>
                ))}
              </View>
              <View style={styles.chakraInfo}>
                <View style={styles.infoHighlightBox}>
                  <Ionicons name="sparkles" size={16} color={COLORS.primary} style={{ marginRight: 6 }} />
                  <Text style={styles.infoTextHighlight}>
                    Enerji Meridyenleri
                  </Text>
                </View>
                <Text style={styles.infoText}>
                  Yandaki tablo, isminizi oluşturan harflerin 9 temel çakranıza ne kadar enerji (frekans) gönderdiğini gösterir. Bu dağılım, doğuştan gelen ruhsal yeteneklerinizi ve karmik dersleri belirler.
                </Text>
                
                <View style={styles.infoItem}>
                  <View style={[styles.infoDot, { backgroundColor: COLORS.error }]} />
                  <Text style={styles.infoDesc}><Text style={{fontWeight: 'bold', color: COLORS.error}}>Eksik:</Text> Bu yaşamdaki karmik sınavınızdır.</Text>
                </View>

                <View style={styles.infoItem}>
                  <View style={[styles.infoDot, { backgroundColor: COLORS.textMuted }]} />
                  <Text style={styles.infoDesc}><Text style={{fontWeight: 'bold', color: COLORS.text}}>1 Harf:</Text> Doğal ve dengeli enerji akışı.</Text>
                </View>

                <View style={styles.infoItem}>
                  <View style={[styles.infoDot, { backgroundColor: '#34C759' }]} />
                  <Text style={styles.infoDesc}><Text style={{fontWeight: 'bold', color: '#34C759'}}>2 Harf:</Text> Güçlü ve verimli potansiyel.</Text>
                </View>

                <View style={styles.infoItem}>
                  <View style={[styles.infoDot, { backgroundColor: '#FFCC00' }]} />
                  <Text style={styles.infoDesc}><Text style={{fontWeight: 'bold', color: '#FFCC00'}}>3 Harf:</Text> Oldukça baskın bir güç.</Text>
                </View>

                <View style={styles.infoItem}>
                  <View style={[styles.infoDot, { backgroundColor: COLORS.primary }]} />
                  <Text style={styles.infoDesc}><Text style={{fontWeight: 'bold', color: COLORS.primary}}>4+ Harf:</Text> Ana taşıyıcı kolon yeteneğinizdir.</Text>
                </View>
              </View>
            </View>

            {/* DETAYLI ANALİZLER */}
            <View style={styles.detailedAnalysisSection}>
              {renderAnalysisCard("Hayat Kulvarı (Yaşam Yolu)", results.lifePath, "lifePathDetails")}
              {renderAnalysisCard("En Ön Plandaki Kişilik", results.personality, "personalityDetails")}
              {renderAnalysisCard("İsim Numaranız (Kader)", results.destiny, "description")}
              {renderAnalysisCard("Ruhunuzu Tanımlama (Ruh Güdüsü)", results.soulUrge, "soulUrgeDetails")}
            </View>

            {/* 4 BEDENSEL REZONANS MERKEZİ */}
            {simulationData && (
              <View style={{ marginTop: 25 }}>
                <View style={styles.sectionHeaderBox}>
                  <Ionicons name="compass-outline" size={20} color={COLORS.primary} style={{ marginRight: 8 }} />
                  <Text style={styles.sectionHeaderTitle}>Bedensel Rezonans Merkezleri</Text>
                </View>
                <Text style={styles.sectionSubtitleText}>
                  Sesin doğduğu organlar ve isminizin beden üzerindeki titreşim dağılımı:
                </Text>

                <View style={styles.bodyCentersGrid}>
                  {/* Kalp & Göğüs */}
                  <View style={[styles.bodyCenterCard, { borderColor: 'rgba(34, 197, 94, 0.3)' }]}>
                    <View style={styles.bodyCenterHeader}>
                      <View style={styles.bodyCenterTitleRow}>
                        <Ionicons name="heart" size={16} color="#22C55E" style={{ marginRight: 6 }} />
                        <Text style={styles.bodyCenterName}>Kalp & Göğüs</Text>
                      </View>
                      <Text style={[styles.bodyCenterPct, { color: '#22C55E' }]}>
                        %{simulationData.simulatedBodyResonance.heart.percentage}
                      </Text>
                    </View>
                    <View style={styles.progressBarTrack}>
                      <View style={[styles.progressBarFill, { width: `${simulationData.simulatedBodyResonance.heart.percentage}%`, backgroundColor: '#22C55E' }]} />
                    </View>
                    <Text style={styles.bodyCenterSub}>Sevgi & Bereket (A, M, L, D, V)</Text>
                  </View>

                  {/* Karın & Mide */}
                  <View style={[styles.bodyCenterCard, { borderColor: 'rgba(234, 179, 8, 0.3)' }]}>
                    <View style={styles.bodyCenterHeader}>
                      <View style={styles.bodyCenterTitleRow}>
                        <Ionicons name="flame" size={16} color="#EAB308" style={{ marginRight: 6 }} />
                        <Text style={styles.bodyCenterName}>Karın & Mide</Text>
                      </View>
                      <Text style={[styles.bodyCenterPct, { color: '#EAB308' }]}>
                        %{simulationData.simulatedBodyResonance.stomach.percentage}
                      </Text>
                    </View>
                    <View style={styles.progressBarTrack}>
                      <View style={[styles.progressBarFill, { width: `${simulationData.simulatedBodyResonance.stomach.percentage}%`, backgroundColor: '#EAB308' }]} />
                    </View>
                    <Text style={styles.bodyCenterSub}>İrade & Eylem (U, Ü, O, Ö, K, Ç, C, T)</Text>
                  </View>

                  {/* Boğaz & İfade */}
                  <View style={[styles.bodyCenterCard, { borderColor: 'rgba(6, 182, 212, 0.3)' }]}>
                    <View style={styles.bodyCenterHeader}>
                      <View style={styles.bodyCenterTitleRow}>
                        <Ionicons name="chatbubble-ellipses" size={16} color="#06B6D4" style={{ marginRight: 6 }} />
                        <Text style={styles.bodyCenterName}>Boğaz & İfade</Text>
                      </View>
                      <Text style={[styles.bodyCenterPct, { color: '#06B6D4' }]}>
                        %{simulationData.simulatedBodyResonance.throat.percentage}
                      </Text>
                    </View>
                    <View style={styles.progressBarTrack}>
                      <View style={[styles.progressBarFill, { width: `${simulationData.simulatedBodyResonance.throat.percentage}%`, backgroundColor: '#06B6D4' }]} />
                    </View>
                    <Text style={styles.bodyCenterSub}>İfade & Görünürlük (E, H, N, B, P)</Text>
                  </View>

                  {/* Kafa & Zihin */}
                  <View style={[styles.bodyCenterCard, { borderColor: 'rgba(168, 85, 247, 0.3)' }]}>
                    <View style={styles.bodyCenterHeader}>
                      <View style={styles.bodyCenterTitleRow}>
                        <Ionicons name="bulb" size={16} color="#A855F7" style={{ marginRight: 6 }} />
                        <Text style={styles.bodyCenterName}>Kafa & Zihin</Text>
                      </View>
                      <Text style={[styles.bodyCenterPct, { color: '#A855F7' }]}>
                        %{simulationData.simulatedBodyResonance.head.percentage}
                      </Text>
                    </View>
                    <View style={styles.progressBarTrack}>
                      <View style={[styles.progressBarFill, { width: `${simulationData.simulatedBodyResonance.head.percentage}%`, backgroundColor: '#A855F7' }]} />
                    </View>
                    <Text style={styles.bodyCenterSub}>Sezgi & Prestij (I, İ, Y, S, Ş, Z, F, J, R)</Text>
                  </View>
                </View>
              </View>
            )}

            {/* EK İSİM SİMÜLATÖRÜ & ÇAKRA TAMAMLAMA */}
            {!isLoggedIn ? (
              <View style={styles.authGateCard}>
                <View style={styles.authGateIconBox}>
                  <Ionicons name="lock-closed" size={30} color={COLORS.primary} />
                </View>
                <Text style={styles.authGateBadge}>ÖZEL LABORATUVAR</Text>
                <Text style={styles.authGateTitle}>Ek İsim Simülatörü & Beden Rezonansı</Text>
                <Text style={styles.authGateDesc}>
                  İsminize ikinci bir isim ekleyerek eksik çakralarınızı kapatma, 4 bedensel rezonans merkezini dengeleme ve hedefinize uygun akıllı isim önerilerini canlı test edebilmek için lütfen giriş yapın veya ücretsiz hesap açın.
                </Text>
                <View style={styles.authGateBtnRow}>
                  <TouchableOpacity 
                    style={styles.authGatePrimaryBtn} 
                    onPress={() => router.push('/(auth)/login')}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="log-in-outline" size={18} color="#000" style={{ marginRight: 6 }} />
                    <Text style={styles.authGatePrimaryBtnText}>Giriş Yap</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.authGateSecondaryBtn} 
                    onPress={() => router.push('/(auth)/register')}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="person-add-outline" size={18} color="#FFF" style={{ marginRight: 6 }} />
                    <Text style={styles.authGateSecondaryBtnText}>Ücretsiz Hesap Aç</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : simulationData ? (
              <View style={styles.simulatorCard}>
                <View style={styles.simulatorHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.authGateBadge}>ÖZEL LABORATUVAR</Text>
                    <Text style={styles.simulatorTitle}>Ek İsim Simülatörü</Text>
                  </View>
                  <View style={styles.scoreChangeBadge}>
                    <Text style={styles.scoreChangeOld}>{simulationData.scoreChange.originalScore}</Text>
                    <Ionicons name="arrow-forward" size={14} color={COLORS.primary} style={{ marginHorizontal: 4 }} />
                    <Text style={styles.scoreChangeNew}>{simulationData.scoreChange.simulatedScore}</Text>
                    {simulationData.scoreChange.difference > 0 && (
                      <View style={styles.scoreDiffPill}>
                        <Text style={styles.scoreDiffText}>+{simulationData.scoreChange.difference}</Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Input */}
                <View style={{ marginBottom: 12 }}>
                  <Text style={styles.inputLabel}>Test Etmek İstediğiniz Ek İsim:</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <TextInput
                      style={[styles.input, { flex: 1 }]}
                      placeholder="Örn: Melis, Berk, Defne, Arya, Gizem..."
                      placeholderTextColor="rgba(255,255,255,0.3)"
                      value={additionalNameInput}
                      onChangeText={handleAdditionalNameChange}
                      autoCapitalize="words"
                    />
                    {additionalNameInput.trim().length > 0 && (
                      <TouchableOpacity 
                        style={styles.resetSimBtn} 
                        onPress={() => handleAdditionalNameChange('')}
                      >
                        <Ionicons name="close-circle-outline" size={24} color={COLORS.primary} />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                {/* Dominant Verdict */}
                <View style={styles.verdictBox}>
                  <Ionicons name="sparkles" size={16} color={COLORS.primary} style={{ marginRight: 6 }} />
                  <Text style={styles.verdictText}>
                    {simulationData.dominantBodyVerdict}
                  </Text>
                </View>

                {/* Newly Filled Chakras Alert */}
                {simulationData.newlyFilledChakras.length > 0 && (
                  <View style={styles.newlyFilledBox}>
                    <Ionicons name="checkmark-circle" size={18} color="#22C55E" style={{ marginRight: 8 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.newlyFilledTitle}>Yeni Kapanan Karmik Çakralar:</Text>
                      <Text style={styles.newlyFilledList}>
                        {simulationData.newlyFilledChakras.map(ch => `${ch}. Çakra (${CHAKRA_METADATA[ch].name})`).join(', ')}
                      </Text>
                    </View>
                  </View>
                )}

                {/* 9-Chakra Live Comparison Matrix */}
                <Text style={[styles.inputLabel, { marginTop: 12, marginBottom: 8 }]}>9 Çakra Canlı Matris Değişimi:</Text>
                <View style={styles.liveMatrixGrid}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(c => {
                    const origCount = simulationData.originalMatrix[c - 1];
                    const simCount = simulationData.simulatedMatrix[c - 1];
                    const isNewlyFilled = origCount === 0 && simCount > 0;
                    const isStillEmpty = simCount === 0;

                    return (
                      <View 
                        key={c} 
                        style={[
                          styles.matrixPill, 
                          isNewlyFilled ? styles.matrixPillNewlyFilled : isStillEmpty ? styles.matrixPillEmpty : styles.matrixPillActive
                        ]}
                      >
                        <Text style={styles.matrixPillNum}>{c}. Çakra</Text>
                        <Text style={styles.matrixPillCount}>{simCount}</Text>
                        <Text style={[
                          styles.matrixPillStatus, 
                          isNewlyFilled ? { color: '#22C55E' } : isStillEmpty ? { color: COLORS.error } : { color: COLORS.textMuted }
                        ]}>
                          {isNewlyFilled ? 'Yeni!' : isStillEmpty ? 'Eksik' : 'Aktif'}
                        </Text>
                      </View>
                    );
                  })}
                </View>

                {/* Hedefe Göre Akıllı Öneriler */}
                <View style={styles.smartRecsSection}>
                  <Text style={styles.smartRecsTitle}>Hedefinize Göre Tavsiye Edilen Ek İsimler:</Text>
                  
                  {/* Goal Selector */}
                  <View style={styles.goalSelectorRow}>
                    {[
                      { id: 'wealth', label: '💰 Para', color: '#D4AF37' },
                      { id: 'fame', label: '🌟 Şöhret', color: '#AF52DE' },
                      { id: 'love', label: '💖 Aşk', color: '#EC4899' },
                      { id: 'spiritual', label: '🧘 Sezgi', color: '#3B82F6' },
                    ].map(g => (
                      <TouchableOpacity
                        key={g.id}
                        onPress={() => setSelectedGoal(g.id as any)}
                        style={[styles.goalPill, selectedGoal === g.id && { backgroundColor: g.color }]}
                      >
                        <Text style={[styles.goalPillText, selectedGoal === g.id && { color: '#000', fontWeight: 'bold' }]}>
                          {g.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Recommendations List */}
                  <View style={styles.recommendedCardsList}>
                    {PhoneticChakraEngine.getRecommendedNamesForMissingChakras(simulationData.originalMissing, selectedGoal).slice(0, 6).map((item, idx) => (
                      <View key={idx} style={styles.recItemCard}>
                        <View style={styles.recItemHeader}>
                          <Text style={styles.recItemName}>{item.name}</Text>
                          <View style={[styles.recItemBadge, {
                            backgroundColor: item.bodyCenter === 'heart' ? 'rgba(34,197,94,0.15)' :
                                             item.bodyCenter === 'stomach' ? 'rgba(234,179,8,0.15)' :
                                             item.bodyCenter === 'throat' ? 'rgba(6,182,212,0.15)' : 'rgba(168,85,247,0.15)'
                          }]}>
                            <Text style={[styles.recItemBadgeText, {
                              color: item.bodyCenter === 'heart' ? '#22C55E' :
                                     item.bodyCenter === 'stomach' ? '#EAB308' :
                                     item.bodyCenter === 'throat' ? '#06B6D4' : '#A855F7'
                            }]}>
                              {item.bodyCenter === 'heart' ? 'Kalp' : item.bodyCenter === 'stomach' ? 'Karın' : item.bodyCenter === 'throat' ? 'Boğaz' : 'Zihin'}
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.recItemReason}>{item.reason}</Text>
                        <TouchableOpacity 
                          style={styles.recSimulateBtn} 
                          onPress={() => handleAdditionalNameChange(item.name)}
                        >
                          <Ionicons name="play-outline" size={14} color={COLORS.primary} style={{ marginRight: 4 }} />
                          <Text style={styles.recSimulateBtnText}>Bu İsmi Simüle Et</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            ) : null}

          </View>
        )}

        {/* RESULTS: BRAND TAB */}
        {brandResult && activeTab === 'brand' && (
          <View style={styles.resultsContainer}>
            {!isLoggedIn ? (
              <View style={styles.authGateCard}>
                <View style={styles.authGateIconBox}>
                  <Ionicons name="lock-closed" size={30} color={COLORS.primary} />
                </View>
                <Text style={styles.authGateBadge}>KURUMSAL AKUSTİK RAPORU</Text>
                <Text style={styles.authGateTitle}>Marka & Şirket Akustiği Kilidi</Text>
                <Text style={styles.authGateDesc}>
                  Markanızın Ouroboros aura kalkanını, sektörel başarı uyumunu ve çakra akustik analizini görüntülemek için lütfen giriş yapın veya ücretsiz hesap açın.
                </Text>
                <View style={styles.authGateBtnRow}>
                  <TouchableOpacity 
                    style={styles.authGatePrimaryBtn} 
                    onPress={() => router.push('/(auth)/login')}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="log-in-outline" size={18} color="#000" style={{ marginRight: 6 }} />
                    <Text style={styles.authGatePrimaryBtnText}>Giriş Yap</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.authGateSecondaryBtn} 
                    onPress={() => router.push('/(auth)/register')}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="person-add-outline" size={18} color="#FFF" style={{ marginRight: 6 }} />
                    <Text style={styles.authGateSecondaryBtnText}>Ücretsiz Hesap Aç</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <>
                {/* Brand Header */}
                <View style={styles.brandHeaderCard}>
                  <Text style={styles.authGateBadge}>KURUMSAL AKUSTİK & REZONANS RAPORU</Text>
                  <Text style={styles.brandTitleText}>{brandResult.brandName}</Text>
                  <Text style={styles.brandSubText}>
                    {brandResult.cleanLetters.length} Harf • {9 - brandResult.missingChakras.length}/9 Çakra Rezonansı
                  </Text>
                  
                  <View style={styles.scoreContainerRow}>
                    <View style={styles.scoreCircle}>
                      <Text style={styles.scoreCircleNum}>{brandResult.acousticScore}</Text>
                      <Text style={styles.scoreCircleTotal}>/ 100</Text>
                    </View>
                    <View style={{ marginLeft: 15, flex: 1 }}>
                      <Text style={styles.scoreLabel}>Akustik Rezonans Skoru</Text>
                      <Text style={styles.scoreVerdict}>
                        {brandResult.acousticScore >= 80 ? '👑 Zirve Titreşim' : brandResult.acousticScore >= 60 ? '⚡ Güçlü Rezonans' : '🌱 Geliştirilebilir'}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Dominant Body Verdict */}
                <View style={styles.verdictBox}>
                  <Ionicons name="sparkles" size={18} color={COLORS.primary} style={{ marginRight: 8 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.verdictText, { fontWeight: 'bold', color: COLORS.primary }]}>İsmin Bedensel Konuşma Tarzı:</Text>
                    <Text style={styles.verdictText}>{brandResult.dominantBodyVerdict}</Text>
                  </View>
                </View>

                {/* 4 Bedensel Rezonans Merkezi */}
                <View style={styles.sectionHeaderBox}>
                  <Ionicons name="compass-outline" size={20} color={COLORS.primary} style={{ marginRight: 8 }} />
                  <Text style={styles.sectionHeaderTitle}>Bedensel Rezonans Merkezleri</Text>
                </View>
                <View style={styles.bodyCentersGrid}>
                  {/* Kalp */}
                  <View style={[styles.bodyCenterCard, { borderColor: 'rgba(34, 197, 94, 0.3)' }]}>
                    <View style={styles.bodyCenterHeader}>
                      <View style={styles.bodyCenterTitleRow}>
                        <Ionicons name="heart" size={16} color="#22C55E" style={{ marginRight: 6 }} />
                        <Text style={styles.bodyCenterName}>Kalp & Göğüs</Text>
                      </View>
                      <Text style={[styles.bodyCenterPct, { color: '#22C55E' }]}>%{brandResult.bodyResonance.heart.percentage}</Text>
                    </View>
                    <View style={styles.progressBarTrack}>
                      <View style={[styles.progressBarFill, { width: `${brandResult.bodyResonance.heart.percentage}%`, backgroundColor: '#22C55E' }]} />
                    </View>
                    <Text style={styles.bodyCenterSub}>A, M, L, D, V (Güven & Aidiyet)</Text>
                  </View>

                  {/* Karın */}
                  <View style={[styles.bodyCenterCard, { borderColor: 'rgba(234, 179, 8, 0.3)' }]}>
                    <View style={styles.bodyCenterHeader}>
                      <View style={styles.bodyCenterTitleRow}>
                        <Ionicons name="flame" size={16} color="#EAB308" style={{ marginRight: 6 }} />
                        <Text style={styles.bodyCenterName}>Karın & Mide</Text>
                      </View>
                      <Text style={[styles.bodyCenterPct, { color: '#EAB308' }]}>%{brandResult.bodyResonance.stomach.percentage}</Text>
                    </View>
                    <View style={styles.progressBarTrack}>
                      <View style={[styles.progressBarFill, { width: `${brandResult.bodyResonance.stomach.percentage}%`, backgroundColor: '#EAB308' }]} />
                    </View>
                    <Text style={styles.bodyCenterSub}>U, Ü, O, Ö, K, Ç, C, T (Eylem & Satış)</Text>
                  </View>

                  {/* Boğaz */}
                  <View style={[styles.bodyCenterCard, { borderColor: 'rgba(6, 182, 212, 0.3)' }]}>
                    <View style={styles.bodyCenterHeader}>
                      <View style={styles.bodyCenterTitleRow}>
                        <Ionicons name="chatbubble-ellipses" size={16} color="#06B6D4" style={{ marginRight: 6 }} />
                        <Text style={styles.bodyCenterName}>Boğaz & İfade</Text>
                      </View>
                      <Text style={[styles.bodyCenterPct, { color: '#06B6D4' }]}>%{brandResult.bodyResonance.throat.percentage}</Text>
                    </View>
                    <View style={styles.progressBarTrack}>
                      <View style={[styles.progressBarFill, { width: `${brandResult.bodyResonance.throat.percentage}%`, backgroundColor: '#06B6D4' }]} />
                    </View>
                    <Text style={styles.bodyCenterSub}>E, H, N, B, P (Yayılım & İfade)</Text>
                  </View>

                  {/* Zihin */}
                  <View style={[styles.bodyCenterCard, { borderColor: 'rgba(168, 85, 247, 0.3)' }]}>
                    <View style={styles.bodyCenterHeader}>
                      <View style={styles.bodyCenterTitleRow}>
                        <Ionicons name="bulb" size={16} color="#A855F7" style={{ marginRight: 6 }} />
                        <Text style={styles.bodyCenterName}>Kafa & Zihin</Text>
                      </View>
                      <Text style={[styles.bodyCenterPct, { color: '#A855F7' }]}>%{brandResult.bodyResonance.head.percentage}</Text>
                    </View>
                    <View style={styles.progressBarTrack}>
                      <View style={[styles.progressBarFill, { width: `${brandResult.bodyResonance.head.percentage}%`, backgroundColor: '#A855F7' }]} />
                    </View>
                    <Text style={styles.bodyCenterSub}>I, İ, Y, S, Ş, Z, F, J, R (Prestij & Kalkan)</Text>
                  </View>
                </View>

                {/* Ouroboros Rozeti */}
                <View style={[styles.ouroborosCard, brandResult.ouroboros.isClosed ? styles.ouroborosCardClosed : styles.ouroborosCardOpen]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <Ionicons 
                      name={brandResult.ouroboros.isClosed ? "shield-checkmark" : "shield-outline"} 
                      size={24} 
                      color={brandResult.ouroboros.isClosed ? "#22C55E" : COLORS.textMuted} 
                      style={{ marginRight: 10 }}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.ouroborosTitle}>{brandResult.ouroboros.badge}</Text>
                      <Text style={[styles.ouroborosBadgeTag, { color: brandResult.ouroboros.isClosed ? '#22C55E' : COLORS.textMuted }]}>
                        {brandResult.ouroboros.isClosed ? 'KAPALI AURA KALKANI' : 'AÇIK ENERJİ HATTI'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.ouroborosDesc}>{brandResult.ouroboros.description}</Text>
                  <View style={styles.stoneGrid}>
                    <View style={styles.stoneBox}>
                      <Text style={styles.stoneLabel}>Temel Taşı (İlk Harf):</Text>
                      <Text style={styles.stoneValue}>{brandResult.cornerstone.char} ({brandResult.cornerstone.bodyCenterName} - {brandResult.cornerstone.element})</Text>
                    </View>
                    <View style={styles.stoneBox}>
                      <Text style={styles.stoneLabel}>Zirve Taşı (Son Harf):</Text>
                      <Text style={styles.stoneValue}>{brandResult.capstone.char} ({brandResult.capstone.bodyCenterName} - {brandResult.capstone.element})</Text>
                    </View>
                  </View>
                </View>

                {/* Sektörel Uyumluluk Kartları */}
                <View style={styles.sectionHeaderBox}>
                  <Ionicons name="trending-up-outline" size={20} color="#22C55E" style={{ marginRight: 8 }} />
                  <Text style={styles.sectionHeaderTitle}>Sektörel Başarı & Çekim Endeksi</Text>
                </View>
                <View style={styles.industryList}>
                  {[
                    { title: '💰 Finans, E-Ticaret & Satış', data: brandResult.industryScores.finance },
                    { title: '🎨 Sanat, Tasarım & AI', data: brandResult.industryScores.creative },
                    { title: '📚 Eğitim, Akademi & Ruhsal', data: brandResult.industryScores.educationSpiritual },
                    { title: '⚡ Teknoloji & İnovasyon', data: brandResult.industryScores.technology },
                  ].map((ind, idx) => (
                    <View key={idx} style={styles.industryCard}>
                      <View style={styles.industryHeader}>
                        <Text style={styles.industryTitle}>{ind.title}</Text>
                        <View style={[styles.industryScoreBadge, {
                          backgroundColor: ind.data.level === 'high' ? 'rgba(34,197,94,0.15)' :
                                           ind.data.level === 'medium' ? 'rgba(234,179,8,0.15)' : 'rgba(255,255,255,0.05)'
                        }]}>
                          <Text style={[styles.industryScoreText, {
                            color: ind.data.level === 'high' ? '#22C55E' :
                                   ind.data.level === 'medium' ? '#EAB308' : COLORS.textMuted
                          }]}>
                            %{ind.data.score} Uyum
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.industryVerdict}>{ind.data.verdict}</Text>
                    </View>
                  ))}
                </View>

                {/* 9 Çakra Dağılımı */}
                <View style={styles.brandChakraCard}>
                  <Text style={styles.brandChakraTitle}>9 Çakra Frekans Dağılımı</Text>
                  <View style={{ gap: 8 }}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(chNum => {
                      const count = brandResult.matrix[chNum - 1];
                      const meta = CHAKRA_METADATA[chNum];
                      return (
                        <View key={chNum} style={styles.chakraBarRow}>
                          <Text style={styles.chakraBarNum}>{chNum}.</Text>
                          <Text style={styles.chakraBarName} numberOfLines={1}>{meta.name}</Text>
                          <View style={styles.chakraBarTrack}>
                            <View 
                              style={[
                                styles.chakraBarFill, 
                                { 
                                  width: count === 0 ? '0%' : `${Math.min(100, count * 33)}%`,
                                  backgroundColor: meta.color 
                                }
                              ]} 
                            />
                          </View>
                          <Text style={[styles.chakraBarCount, { color: count === 0 ? COLORS.error : '#22C55E' }]}>
                            {count === 0 ? 'Eksik' : `${count} Harf`}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>

                {/* Güçlü Yönler & Tavsiyeler */}
                <View style={styles.strengthsRecsRow}>
                  <View style={styles.strengthsBox}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                      <Ionicons name="checkmark-circle" size={16} color="#22C55E" style={{ marginRight: 6 }} />
                      <Text style={styles.strengthsTitle}>Markanın Güçlü Frekansları</Text>
                    </View>
                    {brandResult.strengths.map((str, idx) => (
                      <Text key={idx} style={styles.strengthItemText}>• {str}</Text>
                    ))}
                  </View>

                  <View style={styles.recsBox}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                      <Ionicons name="sparkles" size={16} color={COLORS.primary} style={{ marginRight: 6 }} />
                      <Text style={styles.recsTitle}>Büyüme & Optimizasyon İpuçları</Text>
                    </View>
                    {brandResult.recommendations.map((rec, idx) => (
                      <Text key={idx} style={styles.recItemText}>• {rec}</Text>
                    ))}
                  </View>
                </View>
              </>
            )}
          </View>
        )}

        {/* RESULTS: DATE ONLY TAB */}
        {dateResults && activeTab === 'date' && (
          <View style={styles.resultsContainer}>
            <Text style={styles.mainHeading}>DOĞUM TARİHİ SAYISAL ANALİZİ</Text>
            
            {/* Yaşam Yolu Numarası */}
            <CollapsibleCard 
              title={`Yaşam Yolu Numarası - ${dateResults.lifePath.number}`}
              badgeNumber={dateResults.lifePath.number}
              subtitle={dateResults.lifePath.calculationString}
            >
              <View style={styles.webDetailSection}>
                <Text style={styles.webDetailHeading}>Karakter ve Potansiyeller:</Text>
                <Text style={styles.webDetailText}>
                  {lifePathData[dateResults.lifePath.number]?.character}
                </Text>
                
                <Text style={[styles.webDetailHeading, { marginTop: 12 }]}>Zayıf Yönler ve Öğrenilmesi Gerekenler:</Text>
                <Text style={styles.webDetailText}>
                  {lifePathData[dateResults.lifePath.number]?.weakness}
                </Text>
              </View>
            </CollapsibleCard>

            {/* Doğum Günü Numarası */}
            <CollapsibleCard 
              title={`Doğum Günü Numarası - ${dateResults.birthday} (Yetenek)`}
              badgeNumber={dateResults.birthday}
              subtitle={`${day}.${month}.${year}`}
            >
              <View style={styles.webDetailSection}>
                <Text style={styles.webDetailHeading}>Karakter ve Potansiyeller:</Text>
                <Text style={styles.webDetailText}>
                  {birthdayData[dateResults.birthday]?.character}
                </Text>
                
                <Text style={[styles.webDetailHeading, { marginTop: 12 }]}>Zayıf Yönler ve Öğrenilmesi Gerekenler:</Text>
                <Text style={styles.webDetailText}>
                  {birthdayData[dateResults.birthday]?.weakness}
                </Text>
              </View>
            </CollapsibleCard>

            {/* Pisagor Okları */}
            <CollapsibleCard 
              title="Pisagor Okları"
              subtitle={dateResults.arrows.visualString}
            >
              <View style={styles.webDetailSection}>
                {dateResults.arrows.arrowKeys.map(arrowKey => {
                  const arrow = arrowsData[arrowKey];
                  if (!arrow) return null;
                  return (
                    <View key={arrowKey} style={styles.arrowBlock}>
                      <View style={styles.arrowHeader}>
                        <Ionicons name="arrow-forward-circle" size={18} color="#FFCC00" />
                        <Text style={styles.arrowTitle}>{arrow.name} (Tam Ok {arrowKey})</Text>
                      </View>
                      <Text style={styles.arrowDesc}>{arrow.description}</Text>
                    </View>
                  );
                })}
                
                {dateResults.arrows.emptyArrowKeys.map(arrowKey => {
                  const arrow = emptyArrowsData[arrowKey];
                  if (!arrow) return null;
                  return (
                    <View key={`empty-${arrowKey}`} style={styles.arrowBlock}>
                      <View style={styles.arrowHeader}>
                        <Ionicons name="alert-circle-outline" size={18} color={COLORS.textMuted} />
                        <Text style={[styles.arrowTitle, { color: COLORS.textMuted }]}>{arrow.name} (Boş Ok {arrowKey})</Text>
                      </View>
                      <Text style={styles.arrowDesc}>{arrow.description}</Text>
                    </View>
                  );
                })}

                {dateResults.arrows.arrowKeys.length === 0 && dateResults.arrows.emptyArrowKeys.length === 0 && (
                  <Text style={styles.webDetailText}>
                    Haritanızda tam oluşmuş veya tamamen boş bir Pisagor Oku bulunmamaktadır. Bu durum esnekliğinizi ve farklı enerjilere açık olduğunuzu gösterir.
                  </Text>
                )}
              </View>
            </CollapsibleCard>

            {/* Kişisel Yıl Raporu */}
            <CollapsibleCard 
              title={`Kişisel Yıl Raporu - ${dateResults.personalYear.number}`}
              badgeNumber={dateResults.personalYear.number}
              subtitle={dateResults.personalYear.calculationString}
            >
              <View style={styles.webDetailSection}>
                <Text style={styles.webDetailHeading}>
                  {personalYearData[dateResults.personalYear.number]?.title}
                </Text>
                <Text style={styles.webDetailText}>
                  {personalYearData[dateResults.personalYear.number]?.description}
                </Text>
              </View>
            </CollapsibleCard>
          </View>
        )}

        <View style={{ height: 50 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SacredBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 17, fontWeight: 'bold', color: COLORS.primary },
  scrollContent: { padding: 20 },
  introCard: {
    padding: 20,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    alignItems: 'center',
    marginBottom: 25,
    overflow: 'hidden'
  },
  introTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary, marginBottom: 10, textAlign: 'center' },
  introText: { fontSize: 14, color: COLORS.text, textAlign: 'center', lineHeight: 22, opacity: 0.9 },
  calculatorSection: {
    backgroundColor: 'rgba(10, 10, 10, 0.6)',
    padding: 20,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.5)',
  },
  inputGroup: { marginBottom: 15 },
  inputLabel: { fontSize: 13, color: COLORS.primary, marginBottom: 8, fontWeight: '600' },
  input: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    borderRadius: 8,
    padding: 14,
    color: COLORS.text,
    fontSize: 15,
  },
  dateInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dateInput: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    borderRadius: 8,
    color: COLORS.text,
    fontSize: 16,
    height: 50,
    textAlign: 'center',
    minWidth: 0,
  },
  calcBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    padding: 15,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calcBtnText: { color: COLORS.background, fontWeight: 'bold', fontSize: 15 },
  
  resultsContainer: {
    marginTop: 35,
  },
  mainHeading: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 20,
    textTransform: 'uppercase'
  },
  summaryTable: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.5)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 25,
  },
  summaryRowHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.2)',
    paddingBottom: 5,
  },
  summaryCellHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: 10,
    color: COLORS.primaryDark,
    fontWeight: 'bold',
  },
  summaryRowData: {
    flexDirection: 'row',
    paddingTop: 10,
  },
  summaryCellData: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },

  chakraSection: {
    flexDirection: 'row',
    marginBottom: 25,
  },
  chakraTable: {
    flex: 0.85,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.5)',
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  chakraTableHeader: {
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    paddingVertical: 8,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.5)',
  },
  chakraTableTitle: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 12,
  },
  chakraRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  chakraNum: { color: COLORS.textMuted, fontSize: 11 },
  chakraVal: { color: COLORS.text, fontWeight: 'bold', fontSize: 11 },
  chakraValMissing: { color: COLORS.error },
  chakraInfo: {
    flex: 1.15,
  },
  infoHighlightBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  infoTextHighlight: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  infoText: {
    fontSize: 11,
    color: COLORS.textMuted,
    lineHeight: 16,
    marginBottom: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  infoDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 5,
    marginRight: 6,
  },
  infoDesc: {
    flex: 1,
    fontSize: 11,
    color: COLORS.textMuted,
    lineHeight: 15,
  },

  detailedAnalysisSection: {
    marginTop: 10,
  },
  analysisCard: {
    backgroundColor: 'rgba(10, 10, 10, 0.8)',
    borderRadius: SIZES.radius,
    padding: 18,
    marginBottom: 18,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  analysisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.2)',
  },
  numberBadge: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  analysisMainTitle: { fontSize: 12, color: COLORS.textMuted, marginBottom: 4, textTransform: 'uppercase' },
  analysisTypology: { fontSize: 15, fontWeight: 'bold', color: COLORS.primary },
  
  detailTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  detailSubtitle: {
    fontSize: 12,
    color: COLORS.primaryDark,
    marginBottom: 4,
    fontStyle: 'italic',
  },
  detailText: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 20,
    opacity: 0.9,
  },

  planetaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(212, 175, 55, 0.2)',
  },
  planetText: { fontSize: 12, color: COLORS.primary, marginLeft: 8, fontWeight: 'bold' },

  // Tabs
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 8,
    padding: 3,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 6,
  },
  activeTabButton: {
    backgroundColor: COLORS.primary,
  },
  tabButtonText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  activeTabButtonText: {
    color: COLORS.background,
  },

  // Collapsible cards
  collapsibleCard: {
    backgroundColor: 'rgba(10, 10, 10, 0.8)',
    borderRadius: SIZES.radius,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    overflow: 'hidden',
  },
  collapsibleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  collapsibleBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  collapsibleBadgeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  collapsibleTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  collapsibleSubtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  collapsibleContent: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(212, 175, 55, 0.1)',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  webDetailSection: {
    paddingVertical: 4,
  },
  webDetailHeading: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 5,
  },
  webDetailText: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 19,
    opacity: 0.9,
  },
  arrowBlock: {
    marginBottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  arrowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  arrowTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFCC00',
    marginLeft: 6,
  },
  arrowDesc: {
    fontSize: 12.5,
    color: COLORS.text,
    lineHeight: 18,
    opacity: 0.8,
  },

  // 4 Bedensel Rezonans Merkezi
  sectionHeaderBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  sectionSubtitleText: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 12,
  },
  bodyCentersGrid: {
    gap: 10,
    marginBottom: 20,
  },
  bodyCenterCard: {
    backgroundColor: 'rgba(10, 10, 10, 0.7)',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
  },
  bodyCenterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  bodyCenterTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bodyCenterName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  bodyCenterPct: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  bodyCenterSub: {
    fontSize: 11,
    color: COLORS.textMuted,
  },

  // Auth Gate
  authGateCard: {
    backgroundColor: 'rgba(175, 82, 222, 0.08)',
    borderColor: 'rgba(175, 82, 222, 0.35)',
    borderWidth: 1.5,
    borderRadius: SIZES.radius,
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  authGateIconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(175, 82, 222, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(175, 82, 222, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  authGateBadge: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 2,
    color: COLORS.primary,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  authGateTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  authGateDesc: {
    fontSize: 12.5,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18,
  },
  authGateBtnRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  authGatePrimaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
  },
  authGatePrimaryBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000',
  },
  authGateSecondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 12,
    borderRadius: 8,
  },
  authGateSecondaryBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFF',
  },

  // Simulator
  simulatorCard: {
    backgroundColor: 'rgba(175, 82, 222, 0.06)',
    borderColor: 'rgba(175, 82, 222, 0.3)',
    borderWidth: 1.5,
    borderRadius: SIZES.radius,
    padding: 18,
    marginTop: 20,
    marginBottom: 20,
  },
  simulatorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  simulatorTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  scoreChangeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  scoreChangeOld: { fontSize: 13, color: COLORS.textMuted, fontWeight: 'bold' },
  scoreChangeNew: { fontSize: 16, color: '#22C55E', fontWeight: 'bold' },
  scoreDiffPill: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 6,
  },
  scoreDiffText: { fontSize: 11, color: '#22C55E', fontWeight: 'bold' },
  resetSimBtn: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  verdictBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  verdictText: {
    fontSize: 12.5,
    color: COLORS.text,
    lineHeight: 18,
    flex: 1,
  },
  newlyFilledBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
  },
  newlyFilledTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#22C55E',
    marginBottom: 2,
  },
  newlyFilledList: {
    fontSize: 11.5,
    color: COLORS.text,
  },

  liveMatrixGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 18,
  },
  matrixPill: {
    width: '31%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
  matrixPillNewlyFilled: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderColor: '#22C55E',
  },
  matrixPillEmpty: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  matrixPillActive: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  matrixPillNum: { fontSize: 10, color: COLORS.textMuted },
  matrixPillCount: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginVertical: 2 },
  matrixPillStatus: { fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase' },

  smartRecsSection: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: 16,
  },
  smartRecsTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
  },
  goalSelectorRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 14,
  },
  goalPill: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  goalPillText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  recommendedCardsList: {
    gap: 10,
  },
  recItemCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 12,
  },
  recItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  recItemName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  recItemBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  recItemBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  recItemReason: {
    fontSize: 11.5,
    color: COLORS.textMuted,
    lineHeight: 16,
    marginBottom: 10,
  },
  recSimulateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    borderRadius: 6,
    paddingVertical: 7,
  },
  recSimulateBtnText: {
    fontSize: 11.5,
    fontWeight: 'bold',
    color: COLORS.primary,
  },

  // Brand Results
  brandHeaderCard: {
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(212, 175, 55, 0.35)',
    borderRadius: SIZES.radius,
    padding: 20,
    marginBottom: 16,
  },
  brandTitleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 4,
    marginBottom: 4,
  },
  brandSubText: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 16,
  },
  scoreContainerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  scoreCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  scoreCircleNum: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  scoreCircleTotal: {
    fontSize: 9,
    color: COLORS.textMuted,
  },
  scoreLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
    marginBottom: 2,
  },
  scoreVerdict: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#22C55E',
  },

  // Ouroboros Card
  ouroborosCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  ouroborosCardClosed: {
    backgroundColor: 'rgba(34, 197, 94, 0.06)',
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  ouroborosCardOpen: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  ouroborosTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  ouroborosBadgeTag: {
    fontSize: 9.5,
    fontWeight: 'bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  ouroborosDesc: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 18,
    marginBottom: 12,
  },
  stoneGrid: {
    gap: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 10,
    borderRadius: 8,
  },
  stoneBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stoneLabel: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '600',
  },
  stoneValue: {
    fontSize: 11,
    color: COLORS.text,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },

  // Industry List
  industryList: {
    gap: 10,
    marginBottom: 20,
  },
  industryCard: {
    backgroundColor: 'rgba(10, 10, 10, 0.7)',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  industryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  industryTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  industryScoreBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  industryScoreText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  industryVerdict: {
    fontSize: 11.5,
    color: COLORS.textMuted,
    lineHeight: 16,
  },

  // Brand Chakra Card
  brandChakraCard: {
    backgroundColor: 'rgba(10, 10, 10, 0.7)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 16,
  },
  brandChakraTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  chakraBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chakraBarNum: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.textMuted,
    width: 16,
  },
  chakraBarName: {
    fontSize: 11,
    color: COLORS.text,
    width: 90,
  },
  chakraBarTrack: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  chakraBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  chakraBarCount: {
    fontSize: 11,
    fontWeight: 'bold',
    width: 48,
    textAlign: 'right',
  },

  // Strengths & Recs
  strengthsRecsRow: {
    gap: 12,
    marginBottom: 20,
  },
  strengthsBox: {
    backgroundColor: 'rgba(34, 197, 94, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.25)',
    borderRadius: 12,
    padding: 14,
  },
  strengthsTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#22C55E',
  },
  strengthItemText: {
    fontSize: 12,
    color: COLORS.text,
    lineHeight: 18,
    marginBottom: 4,
  },
  recsBox: {
    backgroundColor: 'rgba(212, 175, 55, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.25)',
    borderRadius: 12,
    padding: 14,
  },
  recsTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  recItemText: {
    fontSize: 12,
    color: COLORS.text,
    lineHeight: 18,
    marginBottom: 4,
  },
});
