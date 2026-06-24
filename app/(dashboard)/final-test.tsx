import SacredBackground from '@/components/SacredBackground';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, ImageBackground, ActivityIndicator, Alert, BackHandler, Platform, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES } from '@/src/theme';
import { useContent } from '@/src/core/content/useContent';
import { useProgress } from '@/src/context/ProgressContext';
import { examCheck, examFinish, examStart, isAuthenticated } from '@/src/core/api/client';

const ESOTERIC_BG = require('@/assets/images/esoteric_bg_indigo.webp');

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
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [reveal, setReveal] = useState<{ correctText: string | null } | null>(null);
  const [isLoadingCheck, setIsLoadingCheck] = useState(true);
  const [blockedReason, setBlockedReason] = useState<string | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const examStarted = useRef(false);
  const { refresh } = useProgress();
  const { data: finalQuestions } = useContent<any[]>('/api/content/final-quiz');

  useEffect(() => {
    let cleaned = false;

    async function checkExamAccess() {
      if (!(await isAuthenticated())) {
        if (Platform.OS === 'web') {
          window.alert("Sınava girmek için lütfen önce giriş yapın.");
        } else {
          Alert.alert("Giriş Gerekli", "Sınava girmek için lütfen önce giriş yapın.");
        }
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace('/(dashboard)/tests');
        }
        return;
      }
      try {
        await examStart('aura');
        examStarted.current = true;
        setIsLoadingCheck(false);
      } catch (err: any) {
        setBlockedReason(err?.message || "Sınav doğrulaması sırasında bir hata oluştu.");
        setIsLoadingCheck(false);
      }
    }

    checkExamAccess();

    return () => {
      if (!cleaned) {
        cleaned = true;
        if (examStarted.current) {
          examFinish('aura').catch((e) => console.error("Failed to clear active session:", e));
        }
      }
    };
  }, []);

  const handleBackPress = () => {
    setShowExitConfirm(true);
  };

  useEffect(() => {
    const backAction = () => {
      handleBackPress();
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);

  // Initialize and shuffle questions when content loads
  useEffect(() => {
    if (!finalQuestions || finalQuestions.length === 0) return;
    // Sadece soruları değil, şıkları da kendi içinde karıştıralım
    const shuffledQuestions = shuffleArray(finalQuestions).map(q => ({
      ...q,
      options: shuffleArray(q.options)
    }));
    setQuestions(shuffledQuestions);
  }, [finalQuestions]);

  // Bitince cevapları SUNUCUYA gönder ('aura' → final soruları, %85 ile kadim_dersler_access açar)
  useEffect(() => {
    if (!isFinished) return;
    examFinish('aura', answers)
      .then(() => refresh())
      .catch((e) => console.error('Sınav gönderim hatası:', e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFinished]);

  const handleOptionSelect = async (option: string) => {
    if (selectedOption !== null) return; // Prevent double clicking

    const q = questions[currentIndex];
    setSelectedOption(option);
    setAnswers(prev => ({ ...prev, [String(q.id)]: option }));

    try {
      const res = await examCheck('aura', String(q.id), option);
      setReveal({ correctText: res.correctAnswer });
      if (res.correct) setCorrectCount(prev => prev + 1);
    } catch {
      setReveal({ correctText: null });
    }

    // Renkleri göster, sonra sonraki soruya geç
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedOption(null);
        setReveal(null);
      } else {
        setIsFinished(true);
      }
    }, 1200);
  };

  if (isLoadingCheck) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ color: 'white', marginTop: 10 }}>Sınav doğrulaması yapılıyor...</Text>
      </View>
    );
  }

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

    return (
      <SacredBackground>

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
      </SacredBackground>
    );
  }

  // --- SINAV EKRANI ---
  const currentQuestion = questions[currentIndex];
  const progressPercent = ((currentIndex) / questions.length) * 100;

  if (blockedReason) {
    return (
      <SacredBackground>
        <View style={styles.blockedContainer}>
          <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
          <View style={styles.blockedCard}>
            <Ionicons name="alert-circle-outline" size={64} color="#FF3B30" style={{ marginBottom: 20 }} />
            <Text style={styles.blockedTitle}>Sınav Girişi Engellendi</Text>
            <Text style={styles.blockedText}>{blockedReason}</Text>
            <TouchableOpacity 
              style={styles.blockedBtn}
              onPress={() => router.replace('/(dashboard)/tests')}
            >
              <Text style={styles.blockedBtnText}>Mabede Dön</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SacredBackground>
    );
  }

  return (
    <SacredBackground>

      <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />

      {/* Header & Progress */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={28} color={COLORS.primary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Aura & Çakra Sınavı</Text>
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
            const showCorrect = reveal !== null && option === reveal.correctText;
            const showWrong = reveal !== null && isSelected && option !== reveal.correctText;
            const isPending = reveal === null && isSelected;
            
            let optionStyle: any[] = [styles.optionBtn];
            let iconName = "ellipse-outline";
            let iconColor = COLORS.textMuted;
            let showSpinner = false;

            if (showCorrect) {
              optionStyle.push(styles.optionCorrect);
              iconName = "checkmark-circle";
              iconColor = COLORS.success;
            } else if (showWrong) {
              optionStyle.push(styles.optionWrong);
              iconName = "close-circle";
              iconColor = COLORS.error;
            } else if (isPending) {
              optionStyle.push({ borderColor: COLORS.primary, backgroundColor: 'rgba(212, 175, 55, 0.15)' });
              showSpinner = true;
            } else if (selectedOption !== null) {
              optionStyle.push({ opacity: 0.4 });
            }

            return (
              <TouchableOpacity 
                key={index} 
                style={optionStyle}
                onPress={() => handleOptionSelect(option)}
                disabled={selectedOption !== null}
                activeOpacity={0.7}
              >
                {showSpinner ? (
                  <ActivityIndicator size="small" color={COLORS.primary} style={{ marginRight: 15 }} />
                ) : (
                  <Ionicons name={iconName as any} size={22} color={iconColor} style={{ marginRight: 15 }} />
                )}
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        
      </ScrollView>

      <Modal
        visible={showExitConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowExitConfirm(false)}
      >
        <View style={styles.modalOverlay}>
          <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
          <View style={styles.modalCard}>
            <Ionicons name="alert-circle-outline" size={48} color="#FF3B30" style={{ marginBottom: 15 }} />
            <Text style={styles.modalTitle}>Sınavdan Çıkış</Text>
            <Text style={styles.modalText}>
              Sınavdan çıkmak istediğinize emin misiniz? Çıkış yaparsanız bugünkü sınav hakkınız yanacaktır ve bugün tekrar giremezsiniz.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.modalBtnCancel]} 
                onPress={() => setShowExitConfirm(false)}
              >
                <Text style={styles.modalBtnTextCancel}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.modalBtnConfirm]} 
                onPress={async () => {
                  setShowExitConfirm(false);
                  router.replace('/(dashboard)/tests');
                }}
              >
                <Text style={styles.modalBtnTextConfirm}>Çıkış Yap</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#0c0314',
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    padding: 25,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 14,
    color: COLORS.textMuted,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnCancel: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  modalBtnConfirm: {
    backgroundColor: '#FF3B30',
  },
  modalBtnTextCancel: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
  modalBtnTextConfirm: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  blockedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  blockedCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.2)',
    padding: 30,
    alignItems: 'center',
  },
  blockedTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
    textAlign: 'center',
  },
  blockedText: {
    fontSize: 14,
    color: COLORS.textMuted,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 30,
  },
  blockedBtn: {
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  blockedBtnText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
  }
});
