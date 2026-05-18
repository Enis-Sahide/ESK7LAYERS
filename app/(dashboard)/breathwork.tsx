import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, ImageBackground, Dimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { COLORS, SIZES } from '@/src/theme';

const ESOTERIC_BG = { uri: 'https://mbqjklupfoqbcfxusigs.supabase.co/storage/v1/object/public/app-assets/images/backgrounds/esoteric_bg.png' };
const { width } = Dimensions.get('window');

const TECHNIQUES = [
  { id: '478', name: 'Kadim 4-7-8', desc: 'Uyku ve Sakinlik', instruction: 'Dilinizi üst dişlerinizin arkasına yerleştirin. Nefesi burnunuzdan karnınıza (diyaframa) doğru alın. Ağzınızdan güçlü bir "hııış" sesiyle verin.', phases: [{ name: 'NEFES AL', time: 4 }, { name: 'TUT', time: 7 }, { name: 'NEFES VER', time: 8 }] },
  { id: 'box', name: 'Kare Nefes', desc: 'Odaklanma ve Denge', instruction: 'Dik oturun. Burnunuzdan göğüs kafesinizi eşit genişleterek alın. Nefesi tutarken omuzlarınızı kasmayın. Akciğerler boşaldığında huzurla bekleyin.', phases: [{ name: 'NEFES AL', time: 4 }, { name: 'TUT', time: 4 }, { name: 'NEFES VER', time: 4 }, { name: 'BEKLE', time: 4 }] },
  { id: 'ujjayi', name: 'Ateş Nefesi', desc: 'Enerji ve Canlılık', instruction: 'Sadece burundan alın ve verin. Karın kaslarınızı bir körük gibi kullanarak nefesi hızlı ve ritmik bir şekilde itin. Göğüs hareketsiz kalmalıdır.', phases: [{ name: 'NEFES AL', time: 3 }, { name: 'NEFES VER', time: 3 }] },
  { id: 'relax', name: 'Stres Savar', desc: 'Anksiyete Giderici', instruction: 'Sadece burnunuzdan derin diyafram nefesi alın. Verirken dudaklarınızı ıslık çalacakmış gibi büzün ve havayı çok yavaşça üfleyerek verin.', phases: [{ name: 'NEFES AL', time: 4 }, { name: 'TUT', time: 4 }, { name: 'NEFES VER', time: 6 }, { name: 'BEKLE', time: 2 }] },
  { id: 'bhramari', name: 'Arı Nefesi', desc: 'Zihni Susturur', instruction: 'Gözlerinizi ve kulaklarınızı hafifçe kapatın. Burnunuzdan derin nefes alın. Verirken kapalı ağızla arı gibi "mmmm" diye mırıldanıp titreşimi beyninizde hissedin.', phases: [{ name: 'NEFES AL', time: 4 }, { name: 'NEFES VER', time: 8 }] },
  { id: 'sama', name: 'Sama Vritti', desc: 'Sağ-Sol Lob Dengesi', instruction: 'Beyin loblarını eşitler. Omurganız dik olsun. Akciğerlerinize dolan ve boşalan havanın eşit sürede (6 saniye) olmasına tam odaklanın.', phases: [{ name: 'NEFES AL', time: 6 }, { name: 'NEFES VER', time: 6 }] },
  { id: 'tummo', name: 'Tummo', desc: 'İçsel Isı ve Güç', instruction: 'Derin nefes alıp karın kaslarınızı ve pelvik tabanınızı sıkın (kök kilidi). Bedendeki sıcaklığın arttığını imgeleyin. Ardından çok yavaşça nefesi verin.', phases: [{ name: 'NEFES AL', time: 4 }, { name: 'TUT', time: 4 }, { name: 'NEFES VER', time: 8 }] },
];

export default function BreathworkScreen() {
  const router = useRouter();
  const [isActive, setIsActive] = useState(false);
  const isActiveRef = useRef(false);
  const [selectedTech, setSelectedTech] = useState(TECHNIQUES[0]);
  const [phase, setPhase] = useState('DURUYOR');
  const [timeLeft, setTimeLeft] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  
  // Animasyon Değerleri
  const scaleValue = useRef(new Animated.Value(1)).current;
  const opacityValue = useRef(new Animated.Value(0.5)).current;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startBreathing = () => {
    setIsActive(true);
    isActiveRef.current = true;
    setCycleCount(0);
    runPhase(0);
  };

  const stopBreathing = () => {
    setIsActive(false);
    isActiveRef.current = false;
    setPhase('DURUYOR');
    setTimeLeft(0);
    if (timerRef.current) clearTimeout(timerRef.current);
    Animated.timing(scaleValue, { toValue: 1, duration: 1000, useNativeDriver: true }).start();
    Animated.timing(opacityValue, { toValue: 0.5, duration: 1000, useNativeDriver: true }).start();
  };

  const runPhase = (index: number) => {
    if (!isActiveRef.current) return;

    if (index >= selectedTech.phases.length) {
      setCycleCount(prev => prev + 1);
      index = 0; // Döngüyü başa sar
    }

    const currentPhase = selectedTech.phases[index];
    setPhase(currentPhase.name);
    setTimeLeft(currentPhase.time);

    let toScale = 1;
    let toOpacity = 0.5;

    if (currentPhase.name === 'NEFES AL') {
      toScale = 2.5;
      toOpacity = 1;
    } else if (currentPhase.name === 'NEFES VER') {
      toScale = 1;
      toOpacity = 0.5;
    } else if (currentPhase.name === 'TUT') {
      // Eğer bir önceki nefes alma ise büyük tut, nefes verme ise küçük tut
      toScale = index > 0 && selectedTech.phases[index - 1].name === 'NEFES AL' ? 2.5 : 1;
      toOpacity = toScale === 2.5 ? 1 : 0.5;
    } else if (currentPhase.name === 'BEKLE') {
      toScale = 1;
      toOpacity = 0.5;
    }

    Animated.parallel([
      Animated.timing(scaleValue, {
        toValue: toScale,
        duration: currentPhase.time * 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(opacityValue, {
        toValue: toOpacity,
        duration: currentPhase.time * 1000,
        useNativeDriver: true,
      })
    ]).start();

    timerRef.current = setTimeout(() => {
      if (isActiveRef.current) runPhase(index + 1);
    }, currentPhase.time * 1000);
  };

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive, phase]);

  // Sayfadan çıkınca durdur
  useEffect(() => {
    return () => {
      stopBreathing();
    };
  }, []);

  return (
    <ImageBackground source={ESOTERIC_BG} style={styles.container} resizeMode="cover">
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(10, 15, 30, 0.85)' }]} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="close" size={32} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Nefes Egzersizi</Text>
      </View>

      <View style={styles.content}>
        {!isActive && (
          <View style={styles.techSelectionContainer}>
            <Text style={styles.subtitle}>Uygulamak istediğiniz tekniği seçin:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 15 }}>
              {TECHNIQUES.map(tech => (
                <TouchableOpacity 
                  key={tech.id} 
                  style={[styles.techCard, selectedTech.id === tech.id && styles.techCardActive]}
                  onPress={() => setSelectedTech(tech)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.techTitle, selectedTech.id === tech.id && { color: '#FF9500' }]}>{tech.name}</Text>
                  <Text style={styles.techDesc}>{tech.desc}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Seçili Tekniğin Detaylı Talimatı */}
        <View style={[styles.instructionContainer, isActive && { marginTop: 20 }]}>
          <Text style={styles.instructionTitle}>{selectedTech.name} Talimatı:</Text>
          <Text style={styles.instructionText}>{selectedTech.instruction}</Text>
        </View>

        <View style={styles.animationContainer}>
          {/* Arka plan parlaklığı */}
          <Animated.View 
            style={[
              styles.glowCircle, 
              { 
                transform: [{ scale: scaleValue }],
                opacity: opacityValue,
              }
            ]} 
          />
          
          {/* Sabit merkez daire ve Yazılar */}
          <View style={styles.centerCircle}>
            <Text style={styles.phaseText}>{phase}</Text>
            {isActive && <Text style={styles.timerText}>{timeLeft}</Text>}
          </View>

          {isActive && (
            <View style={styles.cycleBadge}>
              <Text style={styles.cycleText}>Tamamlanan Tur: {cycleCount}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity 
          style={[styles.actionBtn, isActive ? styles.stopBtn : styles.startBtn]} 
          onPress={isActive ? stopBreathing : startBreathing}
          activeOpacity={0.8}
        >
          <Ionicons name={isActive ? "stop" : "play"} size={24} color="#FFF" style={{ marginRight: 10 }} />
          <Text style={styles.actionBtnText}>{isActive ? "DURDUR" : "BAŞLA"}</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  backBtn: {
    marginRight: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF9500',
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  techSelectionContainer: {
    height: 120,
    marginBottom: 20,
  },
  techCard: {
    padding: 15,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: SIZES.radius,
    minWidth: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  techCardActive: {
    backgroundColor: 'rgba(255, 149, 0, 0.1)',
    borderColor: '#FF9500',
  },
  techTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  techDesc: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  instructionContainer: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 15,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    width: '100%',
    marginBottom: 20,
  },
  instructionTitle: {
    color: '#FF9500',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  instructionText: {
    color: COLORS.text,
    fontSize: 13,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 15,
  },
  animationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
  },
  glowCircle: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 149, 0, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255, 149, 0, 0.5)',
  },
  centerCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderWidth: 1,
    borderColor: '#FF9500',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#FF9500',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  phaseText: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 5,
  },
  timerText: {
    color: '#FF9500',
    fontSize: 32,
    fontWeight: 'bold',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
    marginBottom: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  startBtn: {
    backgroundColor: '#FF9500',
  },
  stopBtn: {
    backgroundColor: 'rgba(255, 59, 48, 0.8)',
  },
  actionBtnText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  cycleBadge: {
    position: 'absolute',
    bottom: 40,
    backgroundColor: 'rgba(255, 149, 0, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FF9500',
  },
  cycleText: {
    color: '#FF9500',
    fontWeight: 'bold',
    fontSize: 14,
  }
});
