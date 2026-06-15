import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, ImageBackground, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES } from '@/src/theme';

import SacredBackground from '@/components/SacredBackground';

const ESOTERIC_BG = require('@/assets/images/esoteric_bg_indigo.png');
const API_BASE_URL = 'http://192.168.1.9:3000/api';

interface ChakraQuestion {
  id: number;
  chakraId: string;
  text: string;
}

export default function ChakraAnalysisScreen() {
  const router = useRouter();
  
  const [questions, setQuestions] = useState<ChakraQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: number, score: number }[]>([]);
  const [results, setResults] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/chakra-analysis`);
      if (!response.ok) {
        throw new Error('Analiz soruları sunucudan alınamadı.');
      }
      const data = await response.json();
      if (data.success && data.questions) {
        setQuestions(data.questions);
      } else {
        throw new Error(data.error || 'Sorular yüklenemedi.');
      }
    } catch (err: any) {
      console.error('Fetch questions error:', err);
      setError(err.message || 'Bir bağlantı hatası oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (score: number) => {
    const currentQ = questions[currentIndex];
    const newAnswers = [...answers, { questionId: currentQ.id, score }];
    setAnswers(newAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setSubmitting(true);
      try {
        const response = await fetch(`${API_BASE_URL}/chakra-analysis`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ answers: newAnswers }),
        });
        if (!response.ok) {
          throw new Error('Analiz hesaplaması başarısız oldu.');
        }
        const data = await response.json();
        if (data.success && data.results) {
          setResults(data.results);
          setIsFinished(true);
        } else {
          throw new Error(data.error || 'Sonuçlar hesaplanamadı.');
        }
      } catch (err: any) {
        console.error('Submit answers error:', err);
        Alert.alert('Bağlantı Hatası', err.message || 'Cevaplarınız gönderilirken bir sorun oluştu. Lütfen tekrar deneyin.');
      } finally {
        setSubmitting(false);
      }
    }
  };

  // --- YÜKLEME VE HATA EKRANLARI ---
  if (loading || submitting) {
    return (
      <SacredBackground>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>
            {loading ? 'Analiz soruları yükleniyor...' : 'Enerji bedeniniz analiz ediliyor, raporunuz hazırlanıyor...'}
          </Text>
        </View>
      </SacredBackground>
    );
  }

  if (error) {
    return (
      <SacredBackground>
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={60} color={COLORS.error} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchQuestions}>
            <Text style={styles.retryBtnText}>Yeniden Dene</Text>
          </TouchableOpacity>
        </View>
      </SacredBackground>
    );
  }

  // --- SONUÇ EKRANI ---
  if (isFinished) {
    return (
      <SacredBackground>
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={28} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Analiz Raporu</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={{ alignItems: 'center', marginBottom: 30 }}>
            <Ionicons name="scan-circle-outline" size={60} color={COLORS.primary} />
            <Text style={styles.resultMainTitle}>Enerji Bedeni Haritanız</Text>
            <Text style={styles.resultSubTitle}>
              Yüksek yüzdeler, o çakrada biriken yoğun tıkanıklığı ve dengesizliği (aşırı veya az çalışmayı) gösterir.
            </Text>
          </View>

          {/* En Kritik Çakralar (İlk 2) */}
          <Text style={styles.sectionTitle}>⚠️ Acil Şifalanması Gerekenler</Text>
          
          {results.slice(0, 2).map((chakra) => (
            <BlurView key={`crit_${chakra.id}`} intensity={40} tint="dark" style={[styles.resultCard, { borderColor: chakra.color + '80' }]}>
              <View style={styles.resultCardHeader}>
                <View style={[styles.colorDot, { backgroundColor: chakra.color }]} />
                <Text style={[styles.chakraName, { color: chakra.color }]}>{chakra.name}</Text>
                <Text style={styles.percentText}>% {chakra.percent} Tıkalı</Text>
              </View>
              
              <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { width: `${chakra.percent}%`, backgroundColor: chakra.color }]} />
              </View>

              <TouchableOpacity 
                style={[styles.healBtn, { backgroundColor: chakra.color + '20', borderColor: chakra.color }]}
                onPress={() => router.push(`/(dashboard)/chakra/${chakra.id}` as any)}
              >
                <Ionicons name="medical-outline" size={18} color={chakra.color} style={{ marginRight: 8 }} />
                <Text style={[styles.healBtnText, { color: chakra.color }]}>Şifalandır</Text>
              </TouchableOpacity>
            </BlurView>
          ))}

          {/* Diğer Çakralar */}
          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Diğer Enerji Merkezleri</Text>
          {results.slice(2).map((chakra) => (
            <View key={`other_${chakra.id}`} style={styles.miniResultCard}>
              <View style={styles.resultCardHeader}>
                <View style={[styles.colorDot, { backgroundColor: chakra.color }]} />
                <Text style={styles.miniChakraName}>{chakra.name}</Text>
                <Text style={styles.miniPercentText}>% {chakra.percent}</Text>
              </View>
              <View style={styles.miniProgressContainer}>
                <View style={[styles.progressBar, { width: `${chakra.percent}%`, backgroundColor: chakra.color }]} />
              </View>
            </View>
          ))}

          {/* Dengelemek için frekans odası yönlendirmesi */}
          <TouchableOpacity 
            style={styles.frequencyRoomBtn} 
            onPress={() => router.push('/(dashboard)/meditation' as any)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#D4AF37', '#AA7C11']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.frequencyGradient}
            >
              <Text style={styles.frequencyRoomBtnText}>Dengelemek İçin Frekans Odasına Git →</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={{ height: 50 }} />
        </ScrollView>
      </SacredBackground>
    );
  }

  // --- ANALİZ EKRANI ---
  const currentQuestion = questions[currentIndex];
  const progressPercent = questions.length > 0 ? (currentIndex / questions.length) * 100 : 0;

  if (!currentQuestion) return null;

  return (
    <SacredBackground>
      <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />

      {/* Header & Progress */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="close" size={28} color={COLORS.textMuted} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Çakra Dengesizlik Analizi</Text>
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${progressPercent}%` }]} />
          </View>
          <Text style={styles.progressText}>Soru {currentIndex + 1} / {questions.length}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.infoBadge}>
          <Ionicons name="information-circle" size={16} color={COLORS.primary} />
          <Text style={styles.infoBadgeText}>Lütfen hayatınızın genel akışını düşünerek dürüstçe cevaplayın.</Text>
        </View>

        <BlurView intensity={40} tint="dark" style={styles.questionCard}>
          <Text style={styles.questionText}>{currentQuestion.text}</Text>
        </BlurView>

        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionBtn} onPress={() => handleAnswer(1)} activeOpacity={0.7}>
            <Text style={styles.optionText}>Hiçbir Zaman</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionBtn} onPress={() => handleAnswer(2)} activeOpacity={0.7}>
            <Text style={styles.optionText}>Bazen</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionBtn} onPress={() => handleAnswer(3)} activeOpacity={0.7}>
            <Text style={styles.optionText}>Her Zaman</Text>
          </TouchableOpacity>
        </View>
        
      </ScrollView>
    </SacredBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: SIZES.padding,
    paddingBottom: 20,
    backgroundColor: 'rgba(10, 15, 30, 0.50)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.2)',
  },
  backBtn: {
    padding: 8,
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  progressContainer: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 5,
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  progressText: {
    color: COLORS.textMuted,
    fontSize: 12,
    textAlign: 'right',
  },
  scrollContent: {
    padding: SIZES.padding,
    paddingTop: 20,
    paddingBottom: 50,
  },
  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    padding: 10,
    borderRadius: SIZES.radius,
    marginBottom: 20,
  },
  infoBadgeText: {
    color: COLORS.primary,
    fontSize: 12,
    marginLeft: 8,
    fontStyle: 'italic',
  },
  questionCard: {
    padding: 30,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.4)',
    marginBottom: 30,
    minHeight: 150,
    justifyContent: 'center',
  },
  questionText: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 15,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: SIZES.radius,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  optionText: {
    color: COLORS.text,
    fontSize: 16,
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  resultMainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 10,
    marginBottom: 10,
  },
  resultSubTitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  resultCard: {
    padding: 20,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    marginBottom: 15,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  resultCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  chakraName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  percentText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  healBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    marginTop: 15,
  },
  healBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  miniResultCard: {
    padding: 15,
    borderRadius: SIZES.radius,
    backgroundColor: 'rgba(255,255,255,0.03)',
    marginBottom: 10,
  },
  miniChakraName: {
    fontSize: 15,
    color: COLORS.text,
    flex: 1,
  },
  miniPercentText: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  miniProgressContainer: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  loadingText: {
    color: COLORS.text,
    fontSize: 16,
    marginTop: 15,
    textAlign: 'center',
  },
  errorText: {
    color: COLORS.error || '#FF3B30',
    fontSize: 16,
    marginTop: 15,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: SIZES.radius,
  },
  retryBtnText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
  },
  frequencyRoomBtn: {
    marginTop: 25,
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  frequencyGradient: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frequencyRoomBtnText: {
    color: '#0A0B10',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
