import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES } from '@/src/theme';
import { CHAKRA_ANALYSIS_QUESTIONS } from '@/src/data/chakraAnalysisQuestions';
import { MODULES } from '@/app/(dashboard)/index'; // Re-using modules data if needed or just defining them locally

const ESOTERIC_BG = { uri: 'https://mbqjklupfoqbcfxusigs.supabase.co/storage/v1/object/public/app-assets/images/backgrounds/esoteric_bg.png' };

// Çakra Renkleri
const CHAKRA_COLORS: Record<number, string> = {
  1: '#FF3B30',
  2: '#FF9500',
  3: '#FFCC00',
  4: '#34C759',
  5: '#00C7BE',
  6: '#32ADE6',
  7: '#AF52DE',
};

const CHAKRA_NAMES: Record<number, string> = {
  1: 'Kök Çakra',
  2: 'Sakral Çakra',
  3: 'Solar Pleksus',
  4: 'Kalp Çakrası',
  5: 'Boğaz Çakrası',
  6: 'Üçüncü Göz',
  7: 'Tepe Çakra',
};

export default function ChakraAnalysisScreen() {
  const router = useRouter();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ chakraId: number, score: number }[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const handleAnswer = (score: number) => {
    const currentQ = CHAKRA_ANALYSIS_QUESTIONS[currentIndex];
    
    setAnswers(prev => [...prev, { chakraId: currentQ.chakraId, score }]);

    if (currentIndex < CHAKRA_ANALYSIS_QUESTIONS.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  // --- SONUÇ EKRANI ---
  if (isFinished) {
    // Çakra skorlarını hesapla
    const chakraScores: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 };
    
    answers.forEach(ans => {
      chakraScores[ans.chakraId] += ans.score;
    });

    // Her çakranın maksimum puanı = 3 soru * 2 puan = 6 puan.
    // Puan ne kadar yüksekse tıkanıklık (dengesizlik) o kadar fazla demektir.
    const results = Object.keys(chakraScores).map(id => {
      const numericId = parseInt(id);
      const rawScore = chakraScores[numericId];
      const blockagePercent = Math.round((rawScore / 6) * 100);
      
      return {
        id: numericId,
        name: CHAKRA_NAMES[numericId],
        color: CHAKRA_COLORS[numericId],
        score: rawScore,
        percent: blockagePercent
      };
    });

    // En çok tıkalı olandan en az tıkalı olana doğru sırala
    results.sort((a, b) => b.percent - a.percent);

    return (
      <ImageBackground source={ESOTERIC_BG} style={styles.container} resizeMode="cover">
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(10, 11, 16, 0.8)' }]} />
        
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
                <Text style={[styles.healBtnText, { color: chakra.color }]}>Şifa Frekansını Başlat</Text>
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

          <View style={{ height: 50 }} />
        </ScrollView>
      </ImageBackground>
    );
  }

  // --- ANALİZ EKRANI ---
  const currentQuestion = CHAKRA_ANALYSIS_QUESTIONS[currentIndex];
  const progressPercent = ((currentIndex) / CHAKRA_ANALYSIS_QUESTIONS.length) * 100;

  return (
    <ImageBackground source={ESOTERIC_BG} style={styles.container} resizeMode="cover">
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(10, 11, 16, 0.7)' }]} />
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
          <Text style={styles.progressText}>Soru {currentIndex + 1} / {CHAKRA_ANALYSIS_QUESTIONS.length}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.infoBadge}>
          <Ionicons name="information-circle" size={16} color={COLORS.primary} />
          <Text style={styles.infoBadgeText}>Lütfen hayatınızın genel akışını düşünerek dürüstçe cevaplayın.</Text>
        </View>

        <BlurView intensity={40} tint="dark" style={styles.questionCard}>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
        </BlurView>

        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionBtn} onPress={() => handleAnswer(0)} activeOpacity={0.7}>
            <Ionicons name="leaf-outline" size={24} color={COLORS.success} style={{ marginRight: 15 }} />
            <Text style={styles.optionText}>Hiçbir Zaman</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionBtn} onPress={() => handleAnswer(1)} activeOpacity={0.7}>
            <Ionicons name="water-outline" size={24} color={COLORS.warning} style={{ marginRight: 15 }} />
            <Text style={styles.optionText}>Bazen</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionBtn} onPress={() => handleAnswer(2)} activeOpacity={0.7}>
            <Ionicons name="flame-outline" size={24} color={COLORS.error} style={{ marginRight: 15 }} />
            <Text style={styles.optionText}>Sık Sık</Text>
          </TouchableOpacity>
        </View>
        
      </ScrollView>
    </ImageBackground>
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
    backgroundColor: 'rgba(10, 15, 30, 0.8)',
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
  }
});
