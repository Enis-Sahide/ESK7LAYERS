import SacredBackground from '@/components/SacredBackground';
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground, TextInput, Alert, KeyboardAvoidingView, Platform, Keyboard, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { COLORS, SIZES } from '@/src/theme';
import { useContent } from '@/src/core/content/useContent';

const ESOTERIC_BG = require('@/assets/images/esoteric_bg_indigo.webp');

const LETTER_VALUES: Record<string, number> = {
  A: 1, J: 1, S: 1, Ş: 1,
  B: 2, K: 2, T: 2,
  C: 3, Ç: 3, L: 3, U: 3, Ü: 3,
  D: 4, M: 4, V: 4,
  E: 5, N: 5, W: 5,
  F: 6, O: 6, Ö: 6, X: 6,
  G: 7, Ğ: 7, P: 7, Y: 7,
  H: 8, Q: 8, Z: 8,
  I: 9, İ: 9, R: 9
};

const VOWELS = ['A', 'E', 'I', 'İ', 'O', 'Ö', 'U', 'Ü'];
import { API_BASE_URL } from '@/src/core/config';

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
  const [activeTab, setActiveTab] = useState<'name' | 'date'>('name');
  const [loading, setLoading] = useState(false);
  const [dateResults, setDateResults] = useState<{
    lifePath: { number: number; calculationString: string };
    birthday: number;
    arrows: { arrowKeys: string[]; emptyArrowKeys: string[]; visualString: string };
    personalYear: { number: number; calculationString: string };
  } | null>(null);

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

      const response = await fetch(`${API_BASE_URL}/numerology`, {
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
      <View style={styles.analysisCard}>
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

      const response = await fetch(`${API_BASE_URL}/numerology`, {
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
        <Text style={styles.headerTitle}>Numeroloji Analizi</Text>
        <View style={{ width: 28 }} />
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
      >
        <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        
        {!results && !dateResults && (
          <BlurView intensity={30} tint="dark" style={styles.introCard}>
            <Ionicons name="infinite" size={40} color={COLORS.primary} style={{ marginBottom: 10 }} />
            <Text style={styles.introTitle}>Pisagor'un Kadim İlimi</Text>
            {activeTab === 'name' ? (
              <Text style={styles.introText}>
                İsminizin ve doğum tarihinizin evrensel barkodunu çözerek ruhunuzun amacını, doğuştan gelen yeteneklerinizi, kişilik rakamınızı ve çakra analizlerinizi ortaya çıkarın.
              </Text>
            ) : (
              <Text style={styles.introText}>
                Doğum tarihinizdeki sayısal titreşimleri çözümleyerek Yaşam Yolu, Doğum Günü yeteneği, Pisagor Okları ve Kişisel Yıl raporunuzu ortaya çıkarın.
              </Text>
            )}
          </BlurView>
        )}

        <View style={styles.calculatorSection}>
          <View style={styles.tabContainer}>
            <TouchableOpacity 
              style={[styles.tabButton, activeTab === 'name' && styles.activeTabButton]} 
              onPress={() => {
                setActiveTab('name');
                setResults(null);
                setDateResults(null);
              }}
            >
              <Ionicons name="person-outline" size={16} color={activeTab === 'name' ? COLORS.background : COLORS.primary} style={{ marginRight: 6 }} />
              <Text style={[styles.tabButtonText, activeTab === 'name' && styles.activeTabButtonText]}>İsim & Tarih</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tabButton, activeTab === 'date' && styles.activeTabButton]} 
              onPress={() => {
                setActiveTab('date');
                setResults(null);
                setDateResults(null);
              }}
            >
              <Ionicons name="calendar-outline" size={16} color={activeTab === 'date' ? COLORS.background : COLORS.primary} style={{ marginRight: 6 }} />
              <Text style={[styles.tabButtonText, activeTab === 'date' && styles.activeTabButtonText]}>Sadece Tarih</Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'name' && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nüfus Cüzdanındaki Tam Adınız</Text>
              <TextInput
                style={styles.input}
                placeholder="Örn: Meryem Yılmaz"
                placeholderTextColor="rgba(255,255,255,0.3)"
                value={name}
                onChangeText={setName}
                returnKeyType="next"
                onSubmitEditing={() => dayRef.current?.focus()}
                blurOnSubmit={false}
              />
            </View>
          )}

          <Text style={styles.inputLabel}>Doğum Tarihiniz</Text>
          <View style={styles.dateInputRow}>
            <TextInput
              ref={dayRef}
              style={[styles.input, { flex: 1 }]}
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
            <Text style={{ color: COLORS.textMuted, fontSize: 20 }}> / </Text>
            <TextInput
              ref={monthRef}
              style={[styles.input, { flex: 1 }]}
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
            <Text style={{ color: COLORS.textMuted, fontSize: 20 }}> / </Text>
            <TextInput
              ref={yearRef}
              style={[styles.input, { flex: 1.5 }]}
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
        </View>

        {results && (
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
                  Yandaki tablo, isminizi oluşturan harflerin 9 temel çakranıza ne kadar enerji (frekans) gönderdiğini gösterir. Bu dağılım, doğuştan gelen ruhsal yeteneklerinizi ve bu hayatta öğrenmeniz gereken karmik dersleri belirler.
                </Text>
                
                <View style={styles.infoItem}>
                  <View style={[styles.infoDot, { backgroundColor: COLORS.error }]} />
                  <Text style={styles.infoDesc}><Text style={{fontWeight: 'bold', color: COLORS.error}}>Eksik:</Text> Bu yaşamdaki karmik sınavınızdır. Bu enerjide ustalaşana kadar bilinçli olarak çaba göstermeniz gerekir.</Text>
                </View>

                <View style={styles.infoItem}>
                  <View style={[styles.infoDot, { backgroundColor: COLORS.textMuted }]} />
                  <Text style={styles.infoDesc}><Text style={{fontWeight: 'bold', color: COLORS.text}}>1 Harf:</Text> Doğal ve dengeli bir enerji akışı vardır. Ekstra bir efor gerektirmez.</Text>
                </View>

                <View style={styles.infoItem}>
                  <View style={[styles.infoDot, { backgroundColor: '#34C759' }]} />
                  <Text style={styles.infoDesc}><Text style={{fontWeight: 'bold', color: '#34C759'}}>2 Harf:</Text> Güçlü ve verimli bir enerji hattıdır. Potansiyeliniz bu alanda oldukça belirgindir.</Text>
                </View>

                <View style={styles.infoItem}>
                  <View style={[styles.infoDot, { backgroundColor: '#FFCC00' }]} />
                  <Text style={styles.infoDesc}><Text style={{fontWeight: 'bold', color: '#FFCC00'}}>3 Harf:</Text> Oldukça baskın bir güçtür. Karakterinizi ve seçimlerinizi güçlü bir şekilde yönlendirir.</Text>
                </View>

                <View style={styles.infoItem}>
                  <View style={[styles.infoDot, { backgroundColor: COLORS.primary }]} />
                  <Text style={styles.infoDesc}><Text style={{fontWeight: 'bold', color: COLORS.primary}}>4+ Harf:</Text> Hayat amacınızı gerçekleştirirken en çok yaslandığınız, ana taşıyıcı kolonunuz olan yeteneğinizdir.</Text>
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

          </View>
        )}

        {dateResults && (
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
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary },
  scrollContent: { padding: 20 },
  introCard: {
    padding: 20,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    alignItems: 'center',
    marginBottom: 30,
    overflow: 'hidden'
  },
  introTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary, marginBottom: 10 },
  introText: { fontSize: 14, color: COLORS.text, textAlign: 'center', lineHeight: 22, opacity: 0.9 },
  calculatorSection: {
    backgroundColor: 'rgba(20, 25, 40, 0.6)',
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
    padding: 15,
    color: COLORS.text,
    fontSize: 16,
  },
  dateInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  calcBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    padding: 15,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calcBtnText: { color: COLORS.background, fontWeight: 'bold', fontSize: 16 },
  
  resultsContainer: {
    marginTop: 40,
  },
  mainHeading: {
    fontSize: 18,
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
    marginBottom: 30,
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
    marginBottom: 30,
  },
  chakraTable: {
    flex: 0.8,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.5)',
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 15,
  },
  chakraTableHeader: {
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    paddingVertical: 10,
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
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.1)',
  },
  chakraNum: {
    flex: 1,
    paddingVertical: 8,
    paddingLeft: 10,
    fontSize: 12,
    color: COLORS.textMuted,
    borderRightWidth: 1,
    borderRightColor: 'rgba(212, 175, 55, 0.1)',
  },
  chakraVal: {
    flex: 1,
    paddingVertical: 8,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  chakraValMissing: {
    color: COLORS.error,
  },
  chakraInfo: {
    flex: 1.2,
    justifyContent: 'center',
  },
  infoText: {
    fontSize: 12,
    color: COLORS.text,
    lineHeight: 18,
    marginBottom: 15,
  },
  infoHighlightBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    marginBottom: 8,
    alignSelf: 'flex-start'
  },
  infoTextHighlight: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
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
    lineHeight: 16,
  },

  detailedAnalysisSection: {
    marginTop: 10,
  },
  analysisCard: {
    backgroundColor: 'rgba(20, 25, 40, 0.8)',
    borderRadius: SIZES.radius,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  analysisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.2)',
  },
  numberBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  analysisMainTitle: { fontSize: 13, color: COLORS.textMuted, marginBottom: 4, textTransform: 'uppercase' },
  analysisTypology: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary },
  
  detailTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 5,
  },
  detailSubtitle: {
    fontSize: 13,
    color: COLORS.primaryDark,
    marginBottom: 5,
    fontStyle: 'italic',
  },
  detailText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 22,
    opacity: 0.9,
  },

  planetaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(212, 175, 55, 0.2)',
  },
  planetText: { fontSize: 12, color: COLORS.primary, marginLeft: 8, fontWeight: 'bold' },

  // New styles
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 8,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 6,
  },
  activeTabButton: {
    backgroundColor: COLORS.primary,
  },
  tabButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  activeTabButtonText: {
    color: COLORS.background,
  },
  collapsibleCard: {
    backgroundColor: 'rgba(20, 25, 40, 0.8)',
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  collapsibleBadgeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  collapsibleTitle: {
    fontSize: 15,
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
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 6,
  },
  webDetailText: {
    fontSize: 13.5,
    color: COLORS.text,
    lineHeight: 20,
    opacity: 0.9,
  },
  arrowBlock: {
    marginBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  arrowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  arrowTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFCC00',
    marginLeft: 6,
  },
  arrowDesc: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 18,
    opacity: 0.8,
  }
});
