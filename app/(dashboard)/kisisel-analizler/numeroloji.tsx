import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground, TextInput, Alert, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { COLORS, SIZES } from '@/src/theme';
import { numerologyData } from '@/src/data/numerologyData';

const ESOTERIC_BG = require('@/assets/images/esoteric_bg_indigo.png');

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
  
  const [results, setResults] = useState<NumerologyResults | null>(null);

  const calculateNumerology = () => {
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

    // Life Path (Hayat Kulvarı)
    const dRed = reduceNumber(d);
    const mRed = reduceNumber(m);
    const yRed = reduceNumber(y);
    const lifePathSum = dRed + mRed + yRed;
    const lifePath = reduceNumber(lifePathSum);
    const lifePathRaw = `${lifePathSum}/${lifePath}`;

    // Name Analysis
    const upperName = name.toLocaleUpperCase('tr-TR').replace(/[^A-ZÇĞİÖŞÜ]/g, '');
    let destinySum = 0;
    let soulUrgeSum = 0;
    let personalitySum = 0;
    
    // Chakra Matrix (1-9 counts)
    const matrix = [0, 0, 0, 0, 0, 0, 0, 0, 0];

    for (let char of upperName) {
      const val = LETTER_VALUES[char];
      if (val) {
        destinySum += val;
        matrix[val - 1]++;
        
        if (VOWELS.includes(char)) {
          soulUrgeSum += val;
        } else {
          personalitySum += val;
        }
      }
    }

    const destiny = reduceNumber(destinySum);
    const soulUrge = reduceNumber(soulUrgeSum);
    const personality = reduceNumber(personalitySum);
    const purpose = reduceNumber(destiny + soulUrge); // Varoluş Amacı

    // Missing numbers (Karmik Sınavlar)
    const missing: number[] = [];
    matrix.forEach((count, idx) => {
      if (count === 0) missing.push(idx + 1);
    });
    const challenges = missing.length > 0 ? missing.join('-') : 'Yok';

    setResults({
      lifePathRaw,
      lifePath,
      destiny,
      soulUrge,
      personality,
      purpose,
      challenges,
      chakraMatrix: matrix
    });
    
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 300);
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

  return (
    <ImageBackground source={ESOTERIC_BG} style={styles.container} resizeMode="cover">
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(10, 15, 30, 0.85)' }]} />
      
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
        
        {!results && (
          <BlurView intensity={30} tint="dark" style={styles.introCard}>
            <Ionicons name="infinite" size={40} color={COLORS.primary} style={{ marginBottom: 10 }} />
            <Text style={styles.introTitle}>Pisagor'un Kadim İlimi</Text>
            <Text style={styles.introText}>
              İsminizin ve doğum tarihinizin evrensel barkodunu çözerek ruhunuzun amacını, doğuştan gelen yeteneklerinizi, kişilik rakamınızı ve çakra analizlerinizi ortaya çıkarın.
            </Text>
          </BlurView>
        )}

        <View style={styles.calculatorSection}>
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
              onSubmitEditing={calculateNumerology}
            />
          </View>

          <TouchableOpacity style={styles.calcBtn} onPress={calculateNumerology} activeOpacity={0.8}>
            <Ionicons name="calculator" size={20} color={COLORS.background} style={{ marginRight: 8 }} />
            <Text style={styles.calcBtnText}>{results ? "Yeniden Hesapla" : "Analizi Çıkar"}</Text>
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

        <View style={{ height: 50 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
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
  planetText: { fontSize: 12, color: COLORS.primary, marginLeft: 8, fontWeight: 'bold' }
});
