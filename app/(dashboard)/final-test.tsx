import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES } from '@/src/theme';
import { FINAL_QUIZ_QUESTIONS } from '@/src/data/finalQuiz';
import { supabase } from '@/src/services/supabase';
import { useProgress } from '@/src/context/ProgressContext';

const ESOTERIC_BG = require('@/assets/images/esoteric_bg_indigo.png');

// Fisher-Yates shuffle algorithm
const shuffleArray = (array: any[]) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

export default function FinalTestScreen() {
  const router = useRouter();
  
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const { unlockTier } = useProgress();

  // Initialize and shuffle questions on mount
  useEffect(() => {
    // Sadece soruları değil, şıkları da kendi içinde karıştıralım
    const shuffledQuestions = shuffleArray(FINAL_QUIZ_QUESTIONS).map(q => ({
      ...q,
      options: shuffleArray(q.options)
    }));
    setQuestions(shuffledQuestions);
  }, []);

  const handleOptionSelect = (option: string) => {
    if (selectedOption !== null) return; // Prevent double clicking
    
    setSelectedOption(option);
    
    const isCorrect = option === questions[currentIndex].correctAnswer;
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    }

    // Wait a bit to show correct/wrong colors, then move to next question
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedOption(null);
      } else {
        setIsFinished(true);
      }
    }, 1200);
  };

  if (questions.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{color: 'white'}}>Kozmik Sorular Yükleniyor...</Text>
      </View>
    );
  }

  // --- SONUÇ EKRANI ---
  if (isFinished) {
    const totalQuestions = questions.length;
    const score = correctCount * 2; // Her soru 2 puan (50 soru x 2 = 100)
    
    let title = "";
    let message = "";
    let icon = "star";
    let color = COLORS.primary;

    if (score >= 90) {
      title = "Üstat";
      message = "Kadim sırların tamamına vakıf oldun. Enerji kanalların ve çakraların mükemmel bir ahenk içinde titreşiyor.";
      icon = "infinite";
    } else if (score >= 70) {
      title = "Işık İşçisi";
      message = "Gizem okulunun öğretilerini büyük ölçüde kavramışsın. Çok az eksiğin kaldı.";
    } else if (score >= 50) {
      title = "Uyanış Yolcusu";
      message = "İçsel uyanışın başlamış ancak zihnin hala bazı kavramlarda dalgalanıyor. Bilgileri tekrar gözden geçirmelisin.";
      color = COLORS.success;
      icon = "half-outline";
    } else {
      title = "Arayışta";
      message = "Henüz sırlar okulunun kapısındasın. Enerji merkezleri hakkında daha fazla meditasyon yapmalı ve okumalısın.";
      color = COLORS.error;
      icon = "alert-circle";
    }

    useEffect(() => {
      if (isFinished) {
        const saveResult = async () => {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase.auth.updateUser({
              data: {
                spiritual_title: title,
                spiritual_score: score
              }
            });
          }
          if (score >= 85) {
            await unlockTier('kadim_dersler_access');
          }
        };
        saveResult();
      }
    }, [isFinished, score, title]);

    return (
      <ImageBackground source={ESOTERIC_BG} style={styles.container} resizeMode="cover">
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(10, 11, 16, 0.8)' }]} />
        <View style={styles.resultContainer}>
          <Ionicons name={icon as any} size={80} color={color} style={{ marginBottom: 20 }} />
          <Text style={[styles.resultTitle, { color }]}>{title}</Text>
          
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreText}>{score}</Text>
            <Text style={styles.scoreSubtext}>/ 100</Text>
          </View>
          
          <Text style={styles.statsText}>{totalQuestions} Sorudan {correctCount} Doğru Cevap</Text>
          
          <Text style={styles.resultMessage}>{message}</Text>
          
          <TouchableOpacity 
            style={styles.returnBtn}
            onPress={() => router.replace('/(dashboard)')}
          >
            <Text style={styles.returnBtnText}>Akademiye Dön</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  // --- SINAV EKRANI ---
  const currentQuestion = questions[currentIndex];
  const progressPercent = ((currentIndex) / questions.length) * 100;

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
          <Text style={styles.headerTitle}>Sırların Sınavı</Text>
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${progressPercent}%` }]} />
          </View>
          <Text style={styles.progressText}>Soru {currentIndex + 1} / {questions.length}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <BlurView intensity={40} tint="dark" style={styles.questionCard}>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
        </BlurView>

        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option: string, index: number) => {
            const isSelected = selectedOption === option;
            const isCorrectOption = option === currentQuestion.correctAnswer;
            
            let optionStyle: any[] = [styles.optionBtn];
            let iconName = "ellipse-outline";
            let iconColor = COLORS.textMuted;

            if (selectedOption !== null) {
              if (isCorrectOption) {
                optionStyle.push(styles.optionCorrect);
                iconName = "checkmark-circle";
                iconColor = COLORS.success;
              } else if (isSelected && !isCorrectOption) {
                optionStyle.push(styles.optionWrong);
                iconName = "close-circle";
                iconColor = COLORS.error;
              }
            } else if (isSelected) {
              iconName = "ellipse";
              iconColor = COLORS.primary;
            }

            return (
              <TouchableOpacity 
                key={index} 
                style={optionStyle}
                onPress={() => handleOptionSelect(option)}
                disabled={selectedOption !== null}
                activeOpacity={0.7}
              >
                <Ionicons name={iconName as any} size={22} color={iconColor} style={{ marginRight: 15 }} />
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            );
          })}
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
    paddingTop: 30,
    paddingBottom: 50,
  },
  questionCard: {
    padding: 25,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.4)',
    marginBottom: 30,
    overflow: 'hidden',
  },
  questionText: {
    fontSize: 20,
    color: COLORS.text,
    lineHeight: 30,
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
  optionCorrect: {
    backgroundColor: 'rgba(52, 199, 89, 0.15)',
    borderColor: COLORS.success,
  },
  optionWrong: {
    backgroundColor: 'rgba(255, 59, 48, 0.15)',
    borderColor: COLORS.error,
  },
  optionText: {
    color: COLORS.text,
    fontSize: 16,
    flex: 1,
    lineHeight: 24,
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  scoreCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: 'rgba(212, 175, 55, 0.5)',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  scoreSubtext: {
    fontSize: 18,
    color: COLORS.textMuted,
  },
  statsText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  resultMessage: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    fontStyle: 'italic',
  },
  returnBtn: {
    backgroundColor: COLORS.primaryDark,
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  returnBtnText: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: 'bold',
  }
});
