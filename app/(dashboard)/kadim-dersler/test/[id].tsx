import SacredBackground from '@/components/SacredBackground';
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { COLORS, SIZES } from '@/src/theme';
import { allQuizzes } from '@/src/data/allQuizzes';
import { useProgress } from '@/src/context/ProgressContext';

const ESOTERIC_BG = require('@/assets/images/esoteric_bg_indigo.png');

export default function KadimDerslerTestScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { unlockTier } = useProgress();
  
  const quizData = allQuizzes[id as string];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (isFinished && quizData) {
      const totalQuestions = quizData.questions.length;
      const score = (correctCount / totalQuestions) * 100;
      
      if (score === 100) {
        if (id === 'numeroloji_1') unlockTier('numeroloji_2');
        if (id === 'numeroloji_2') unlockTier('numeroloji_3');
        if (id === 'numeroloji_3') unlockTier('numeroloji_master');
        
        // Rune Kilitleri
        if (id === 'rune1') unlockTier('rune_2');
        if (id === 'rune2') unlockTier('rune_master');
        
        // Yoga Kilitleri
        if (id === 'yoga_1') unlockTier('yoga_2');
        if (id === 'yoga_2') unlockTier('yoga_master');
        
        // Human Design Kilitleri
        if (id === 'human_1') unlockTier('human_2');
        if (id === 'human_2') unlockTier('human_master');

        // Astroloji Kilitleri
        if (id === 'astroloji_1') unlockTier('astroloji_2');
        if (id === 'astroloji_2') unlockTier('astroloji_master');

        // Akupunktur Kilitleri
        if (id === 'akupunktur_1') unlockTier('akupunktur_2');
        if (id === 'akupunktur_2') unlockTier('akupunktur_master');
      }

      if (score >= 85) {
        if (id === 'duygusal_hastaliklar_50') unlockTier('duygusal_hastaliklar_access');
      }
    }
  }, [isFinished]);

  if (!quizData) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{color: 'white'}}>Sınav yükleniyor veya bulunamadı...</Text>
      </View>
    );
  }

  const currentQuestion = quizData.questions[currentIndex];

  const handleOptionSelect = (optionIndex: number) => {
    if (selectedOption !== null) return; 
    
    setSelectedOption(optionIndex);
    
    const isCorrect = optionIndex === currentQuestion.correctAnswerIndex;
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    }

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleNextQuestion = () => {
    if (currentIndex < quizData.questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
    } else {
      setIsFinished(true);
    }
  };

  const handleBackPress = () => {
    Alert.alert(
      "Sınavdan Çıkış",
      "Testten çıkmak istediğinize emin misiniz? Mevcut ilerlemeniz silinecektir.",
      [
        { text: "İptal", style: "cancel" },
        { 
          text: "Çıkış Yap", 
          style: "destructive", 
          onPress: () => router.back() 
        }
      ]
    );
  };

  if (isFinished) {
    const totalQuestions = quizData.questions.length;
    const score = (correctCount / totalQuestions) * 100;
    
    let title = "";
    let message = "";
    let color = COLORS.primary;

    if (score === 100) {
      const isMasterTest = id && (id.toString().includes('_3') || id.toString().includes('Final'));
      
      if (isMasterTest) {
        title = "Kadim Üstat";
        message = "Sembollerin ruhuna tamamen vakıfsın. Bu öğretideki en derin sırları çözdün ve Üstatlık mertebesine ulaştın!";
      } else {
        title = "Tam İdrak (Kilit Kırıldı)";
        message = "Bu derecenin temelini başarıyla kavradın. Bir sonraki ezoterik derecenin kapısı sana açıldı!";
      }
    } else if (score >= 60) {
      title = "Işık İşçisi";
      message = "Bilgeliğin artıyor ancak zihnin hala dalgalanıyor. Sonraki dereceye geçmek için tam idrak (100) gereklidir.";
    } else {
      title = "Arayışta";
      message = "Henüz sırlar okulunun başındasın. Öğretileri sessizlikte tekrar dinlemeli ve idrak etmelisin.";
      color = COLORS.error;
    }

    return (
      <SacredBackground>

        <View style={styles.resultContainer}>
          <Ionicons name="sparkles" size={80} color={color} style={{ marginBottom: 20 }} />
          <Text style={[styles.resultTitle, { color }]}>{title}</Text>
          <Text style={styles.scoreText}>Başarı: %{score.toFixed(0)}</Text>
          <Text style={styles.resultMessage}>{message}</Text>
          <Text style={styles.detailText}>{totalQuestions} Sorudan {correctCount} Doğru Yanıt</Text>
          
          <TouchableOpacity style={styles.btnPrimary} onPress={() => router.back()}>
            <Text style={styles.btnPrimaryText}>Mabede Dön</Text>
          </TouchableOpacity>
        </View>
      </SacredBackground>
    );
  }

  return (
    <SacredBackground>

      
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={28} color={COLORS.primary} />
        </TouchableOpacity>
        <View style={{alignItems: 'center'}}>
          <Text style={styles.headerTitle}>{quizData.title}</Text>
          <Text style={styles.questionCounter}>Soru {currentIndex + 1} / {quizData.questions.length}</Text>
        </View>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollContent}>
        <BlurView intensity={40} tint="dark" style={styles.questionCard}>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
        </BlurView>

        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentQuestion.correctAnswerIndex;
            const showCorrect = selectedOption !== null && isCorrect;
            const showWrong = selectedOption !== null && isSelected && !isCorrect;

            let bgColor = 'rgba(20, 25, 40, 0.7)';
            let borderColor = 'rgba(212, 175, 55, 0.3)';

            if (showCorrect) {
              bgColor = 'rgba(52, 199, 89, 0.2)';
              borderColor = COLORS.success;
            } else if (showWrong) {
              bgColor = 'rgba(255, 59, 48, 0.2)';
              borderColor = COLORS.error;
            }

            return (
              <TouchableOpacity 
                key={idx}
                style={[styles.optionBtn, { backgroundColor: bgColor, borderColor }]}
                onPress={() => handleOptionSelect(idx)}
                activeOpacity={0.7}
                disabled={selectedOption !== null}
              >
                <Text style={styles.optionText}>{option}</Text>
                {showCorrect && <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />}
                {showWrong && <Ionicons name="close-circle" size={20} color={COLORS.error} />}
              </TouchableOpacity>
            );
          })}
        </View>

        {selectedOption !== null && (
          <View style={styles.explanationContainer}>
            <View style={styles.explanationHeader}>
              <Ionicons name="information-circle-outline" size={20} color={COLORS.primary} style={{marginRight: 8}}/>
              <Text style={styles.explanationTitle}>Kadim Bilgi</Text>
            </View>
            <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
            
            <TouchableOpacity 
              style={styles.nextBtn}
              onPress={handleNextQuestion}
              activeOpacity={0.8}
            >
              <Text style={styles.nextBtnText}>
                {currentIndex < quizData.questions.length - 1 ? 'Sonraki Soru' : 'Sonucu Gör'}
              </Text>
              <Ionicons name="arrow-forward" size={16} color={COLORS.background} style={{marginLeft: 5}}/>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
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
  questionCounter: { fontSize: 12, color: COLORS.textMuted, marginTop: 4 },
  scrollContent: { padding: 20 },
  questionCard: {
    padding: 25,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.5)',
    marginBottom: 30,
    alignItems: 'center',
  },
  questionText: {
    fontSize: 18,
    color: COLORS.text,
    lineHeight: 28,
    textAlign: 'center',
    fontWeight: '500',
  },
  optionsContainer: { gap: 15 },
  optionBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderRadius: SIZES.radius,
    borderWidth: 1,
  },
  optionText: { flex: 1, fontSize: 15, color: COLORS.text, marginRight: 10, lineHeight: 22 },
  explanationContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderRadius: SIZES.radius,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  explanationTitle: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  explanationText: {
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  resultTitle: { fontSize: 32, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  scoreText: { fontSize: 24, color: COLORS.text, marginBottom: 20, fontWeight: 'bold' },
  resultMessage: { fontSize: 16, color: COLORS.textMuted, textAlign: 'center', lineHeight: 24, marginBottom: 30, fontStyle: 'italic' },
  detailText: { fontSize: 14, color: COLORS.text, marginBottom: 40, opacity: 0.8 },
  btnPrimary: {
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  btnPrimaryText: { color: COLORS.primary, fontSize: 16, fontWeight: 'bold' },
  nextBtn: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextBtnText: {
    color: COLORS.background,
    fontWeight: 'bold',
    fontSize: 14,
  }
});
