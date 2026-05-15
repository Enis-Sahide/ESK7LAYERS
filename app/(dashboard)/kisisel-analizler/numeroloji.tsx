import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground, TextInput, Alert, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { COLORS, SIZES } from '@/src/theme';
import { numerologyData } from '@/src/data/numerologyData';

const ESOTERIC_BG = require('@/assets/images/backgrounds/esoteric_bg.png');

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
  
  const [results, setResults] = useState<{
    lifePath: number;
    destiny: number;
    soulUrge: number;
  } | null>(null);

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

    const lifePathSum = reduceNumber(d) + reduceNumber(m) + reduceNumber(y);
    const lifePath = reduceNumber(lifePathSum);

    const upperName = name.toLocaleUpperCase('tr-TR').replace(/[^A-ZÇĞİÖŞÜ]/g, '');
    let destinySum = 0;
    let soulUrgeSum = 0;

    for (let char of upperName) {
      const val = LETTER_VALUES[char];
      if (val) {
        destinySum += val;
        if (VOWELS.includes(char)) {
          soulUrgeSum += val;
        }
      }
    }

    const destiny = reduceNumber(destinySum);
    const soulUrge = reduceNumber(soulUrgeSum);

    setResults({ lifePath, destiny, soulUrge });
    
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 300);
  };

  const renderNumberCard = (title: string, num: number, type: 'lifePath' | 'destiny' | 'shadow') => {
    const data = numerologyData[num] || numerologyData[reduceNumber(num)];
    
    if (!data) return null;

    let desc = '';
    if (type === 'lifePath') desc = data.lifePath;
    else if (type === 'destiny') desc = data.destiny;
    else desc = `Işık Yönü: ${data.light}\n\nGölge Yönü: ${data.shadow}`;

    return (
      <View style={styles.resultCard}>
        <View style={styles.resultHeader}>
          <View style={styles.numberBadge}>
            <Text style={styles.numberText}>{num}</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 15 }}>
            <Text style={styles.resultTitle}>{title}</Text>
            <Text style={styles.resultSubtitle}>{data.title}</Text>
          </View>
        </View>
        <Text style={styles.resultDesc}>{desc}</Text>
        
        <View style={styles.planetaryRow}>
          <Ionicons name="planet-outline" size={16} color={COLORS.primary} />
          <Text style={styles.planetText}>Gezegen: {data.planet} • Element: {data.element}</Text>
        </View>
      </View>
    );
  };

  return (
    <ImageBackground source={ESOTERIC_BG} style={styles.container} resizeMode="cover">
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(10, 15, 30, 0.8)' }]} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={28} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Numeroloji Hesaplayıcı</Text>
        <View style={{ width: 28 }} />
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
      >
        <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        
        <BlurView intensity={30} tint="dark" style={styles.introCard}>
          <Ionicons name="infinite" size={40} color={COLORS.primary} style={{ marginBottom: 10 }} />
          <Text style={styles.introTitle}>Pisagor'un Kadim İlimi</Text>
          <Text style={styles.introText}>
            İsminizin ve doğum tarihinizin evrensel barkodunu çözerek ruhunuzun amacını, doğuştan gelen yeteneklerinizi ve en derin arzularınızı ortaya çıkarın.
          </Text>
        </BlurView>

        <View style={styles.calculatorSection}>
          <Text style={styles.sectionTitle}>Kişisel Frekans Hesaplayıcı</Text>
          
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
            <Text style={styles.calcBtnText}>Sırlarımı Açığa Çıkar</Text>
          </TouchableOpacity>
        </View>

        {results && (
          <View style={styles.resultsContainer}>
            <Text style={styles.sectionTitle}>Kadim Analiz Sonuçlarınız</Text>
            {renderNumberCard("Yaşam Yolu Sayınız", results.lifePath, 'lifePath')}
            {renderNumberCard("Kader (İfade) Sayınız", results.destiny, 'destiny')}
            {renderNumberCard("Ruh Güdüsü (Kalp) Sayınız", results.soulUrge, 'shadow')}
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFCC00',
    marginBottom: 20,
    textAlign: 'center'
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
  resultCard: {
    backgroundColor: 'rgba(20, 25, 40, 0.8)',
    borderRadius: SIZES.radius,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  numberBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
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
  resultTitle: { fontSize: 14, color: COLORS.textMuted, marginBottom: 4 },
  resultSubtitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  resultDesc: { fontSize: 14, color: COLORS.text, lineHeight: 22, opacity: 0.9 },
  planetaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(212, 175, 55, 0.2)',
  },
  planetText: { fontSize: 12, color: COLORS.primary, marginLeft: 8, fontWeight: 'bold' }
});
