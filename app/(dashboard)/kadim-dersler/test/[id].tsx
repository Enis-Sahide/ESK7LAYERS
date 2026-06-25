import SacredBackground from '@/components/SacredBackground';
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground, Alert, ActivityIndicator, BackHandler, Platform, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { COLORS, SIZES } from '@/src/theme';
import { useContent } from '@/src/core/content/useContent';
import { useProgress } from '@/src/context/ProgressContext';
import { examStart, examFinish, examCheck, isAuthenticated } from '@/src/core/api/client';

const ESOTERIC_BG = require('@/assets/images/esoteric_bg_indigo.webp');

export default function KadimDerslerTestScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { refresh } = useProgress();

  const { data: quizzes } = useContent<Record<string, any>>('/api/content/quizzes');
  const quizData = (quizzes ?? {})[id as string];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoadingCheck, setIsLoadingCheck] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [reveal, setReveal] = useState<{ correctText: string | null; explanation: string | null } | null>(null);
  const [blockedReason, setBlockedReason] = useState<string | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const examStarted = useRef(false);

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
        // Tek-cihaz + günlük limit kontrolü + aktif oturum kaydı (sunucu tarafı)
        await examStart(id as string);
        examStarted.current = true;
        setIsLoadingCheck(false);
      } catch (err: any) {
        setBlockedReason(err?.message || "Sınav doğrulaması sırasında bir hata oluştu.");
        setIsLoadingCheck(false);
      }
    }

    checkExamAccess();

    // Çıkışta/unmount'ta aktif sınav oturumunu temizle
    return () => {
      if (!cleaned) {
        cleaned = true;
        if (examStarted.current) {
          clearActiveSession();
        }
      }
    };
  }, [id]);

  const clearActiveSession = async () => {
    try {
      // score yok → sadece aktif sınav oturumunu temizler
      await examFinish(id as string);
    } catch (e) {
      console.error("Failed to clear active exam session:", e);
    }
  };

  useEffect(() => {
    if (isFinished && quizData) {
      // Skoru ve kilidi SUNUCU belirler; istemci sadece cevapları gönderir.
      examFinish(id as string, answers)
        .then(() => refresh())
        .catch((e) => console.error('Unlock error:', e));
    }
  }, [isFinished]);

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

  if (isLoadingCheck) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }]}>
        <Text style={{color: 'white'}}>Sınav doğrulaması yapılıyor...</Text>
      </View>
    );
  }

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

  if (!quizData) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{color: 'white'}}>Sınav yükleniyor veya bulunamadı...</Text>
      </View>
    );
  }

  const currentQuestion = quizData.questions[currentIndex];

  const handleOptionSelect = async (optionIndex: number) => {
    if (selectedOption !== null) return;

    const optionText = currentQuestion.options[optionIndex];
    setSelectedOption(optionIndex);
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: optionText }));

    try {
      const res = await examCheck(id as string, currentQuestion.id, optionText);
      setReveal({ correctText: res.correctAnswer, explanation: res.explanation });
      if (res.correct) setCorrectCount(prev => prev + 1);
    } catch {
      setReveal({ correctText: null, explanation: null });
    }

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleNextQuestion = () => {
    if (currentIndex < quizData.questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setReveal(null);
    } else {
      setIsFinished(true);
    }
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
          {currentQuestion.options.map((option: string, idx: number) => {
            const isSelected = selectedOption === idx;
            const isCorrect = reveal != null && option === reveal.correctText;
            const showCorrect = reveal !== null && isCorrect;
            const showWrong = reveal !== null && isSelected && !isCorrect;
            const isPending = reveal === null && isSelected;

            let bgColor = 'rgba(10, 10, 10, 0.7)';
            let borderColor = 'rgba(212, 175, 55, 0.3)';
            let textOpacity = 1;

            if (showCorrect) {
              bgColor = 'rgba(52, 199, 89, 0.2)';
              borderColor = COLORS.success;
            } else if (showWrong) {
              bgColor = 'rgba(255, 59, 48, 0.2)';
              borderColor = COLORS.error;
            } else if (isPending) {
              bgColor = 'rgba(212, 175, 55, 0.15)';
              borderColor = COLORS.primary;
            } else if (selectedOption !== null) {
              bgColor = 'rgba(10, 10, 10, 0.3)';
              borderColor = 'rgba(255, 255, 255, 0.05)';
              textOpacity = 0.4;
            }

            return (
              <TouchableOpacity 
                key={idx}
                style={[styles.optionBtn, { backgroundColor: bgColor, borderColor }]}
                onPress={() => handleOptionSelect(idx)}
                activeOpacity={0.7}
                disabled={selectedOption !== null}
              >
                <Text style={[styles.optionText, { opacity: textOpacity }]}>{option}</Text>
                {showCorrect && <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />}
                {showWrong && <Ionicons name="close-circle" size={20} color={COLORS.error} />}
                {isPending && <ActivityIndicator size="small" color={COLORS.primary} />}
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
            <Text style={styles.explanationText}>{reveal?.explanation}</Text>
            
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
    backgroundColor: '#000000',
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
