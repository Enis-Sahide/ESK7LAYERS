import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground, Animated } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES } from '@/src/theme';
import { Audio } from 'expo-av';

const ESOTERIC_BG = require('@/assets/images/backgrounds/esoteric_bg.png');

// NOT: Bu URL'ler geçicidir. Müşteriniz gerçek frekans seslerini (mp3) verdiğinde assets içine alıp require() ile buraya koyabilirsiniz.
const FREQUENCIES = [
  { id: '1', hz: '396 Hz', name: 'Korku ve Suçluluk', desc: 'Kök çakrayı temizler, engelleri kaldırır.', intent: 'Tüm eski korkularımı ve suçluluk duygularımı sevgiyle serbest bırakıyorum. Evrende tamamen güvendeyim.', color: '#FF3B30', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: '2', hz: '417 Hz', name: 'Değişimi Kolaylaştırma', desc: 'Negatif enerjiyi ve travmaları temizler.', intent: 'Geçmişin yüklerinden özgürleşiyorum. Hayatımdaki mucizevi değişimleri sevgiyle kabul ediyorum.', color: '#FF9500', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: '3', hz: '528 Hz', name: 'DNA Onarımı ve Mucize', desc: 'Yaşam enerjisini artırır, frekansı yükseltir.', intent: 'Hücrelerim evrenin sevgi frekansıyla yenileniyor. Kendi içimdeki mucizevi şifa gücüne uyanıyorum.', color: '#34C759', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  { id: '4', hz: '639 Hz', name: 'İlişkiler ve Bağlantı', desc: 'Kalp çakrasını açar, evrensel uyum getirir.', intent: 'Kendimi ve tüm varoluşu şefkatle kucaklıyorum. İlişkilerim saf sevgi, uyum ve denge içinde akıyor.', color: '#00C7BE', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
  { id: '5', hz: '741 Hz', name: 'Sezgi ve Uyanış', desc: 'İçgüdüleri güçlendirir, zihni berraklaştırır.', intent: 'Zihnimdeki tüm yanılsamalar (illüzyonlar) çözülüyor. İçsel rehberliğimi net bir şekilde duyuyorum.', color: '#32ADE6', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
  { id: '6', hz: '852 Hz', name: 'Kozmik Bağlantı', desc: 'Üst benlikle bağ kurdurur, ruhani uyanış.', intent: 'Yüksek bilincimle tam bir bütünlük içindeyim. Evrensel gerçeği kalbimin gözüyle, açıkça görebiliyorum.', color: '#AF52DE', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3' },
];

export default function MeditationScreen() {
  const router = useRouter();
  const [activeFreq, setActiveFreq] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  // Süre seçimi ve geri sayım için state'ler
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null); // Dakika cinsinden. null = sonsuz
  const [timeRemaining, setTimeRemaining] = useState<number>(0); // Saniye cinsinden


  // Ekrandan çıkınca müziği kesinlikle durdur (Expo Router Focus Effect)
  useFocusEffect(
    useCallback(() => {
      return () => {
        if (soundRef.current) {
          soundRef.current.stopAsync();
          soundRef.current.unloadAsync();
          soundRef.current = null;
          setIsPlaying(false);
          setActiveFreq(null);
        }
      };
    }, [])
  );

  // Müzik çalma/durdurma fonksiyonu
  const togglePlay = async (freq: any) => {
    try {
      // Eğer aynı frekansa tıklandıysa ve çalıyorsa durdur
      if (activeFreq?.id === freq.id && isPlaying) {
        if (soundRef.current) await soundRef.current.pauseAsync();
        setIsPlaying(false);
        return;
      }

      // Aynı frekans ama duraklatılmışsa devam et
      if (activeFreq?.id === freq.id && !isPlaying && soundRef.current) {
        await soundRef.current.playAsync();
        setIsPlaying(true);
        return;
      }

      // Yeni bir frekans seçildiyse eskisi kapat
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }

      setActiveFreq(freq);
      setIsPlaying(true);
      
      // Süre ayarını başlat
      if (selectedDuration !== null) {
        setTimeRemaining(selectedDuration * 60);
      } else {
        setTimeRemaining(0);
      }

      // Arka plan sesi için ayarlar
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
      });

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: freq.url },
        { shouldPlay: true, isLooping: true, volume: 1.0 }
      );
      
      soundRef.current = newSound;
      setSound(newSound);

    } catch (error) {
      console.log('Frekans çalma hatası:', error);
    }
  };

  // Zamanlayıcı geri sayım mantığı
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && selectedDuration !== null && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Süre doldu
            if (soundRef.current) {
              soundRef.current.stopAsync();
            }
            setIsPlaying(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, selectedDuration, timeRemaining]);

  // Süre değiştirildiğinde aktifse kalan süreyi güncelle
  const handleDurationChange = (val: number | null) => {
    setSelectedDuration(val);
    if (isPlaying) {
      if (val === null) {
        setTimeRemaining(0);
      } else {
        setTimeRemaining(val * 60);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <ImageBackground source={ESOTERIC_BG} style={styles.container} resizeMode="cover">
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(10, 15, 30, 0.8)' }]} />
      <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="close" size={32} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Frekans Odası</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.subtitle}>
          Ruhunuzun ihtiyacı olan frekansı seçin. Meditasyona başlarken gözlerinizi kapatın ve bedeninizi müziğin titreşimine bırakın.
        </Text>

        {/* Süre Seçimi */}
        <View style={styles.timerSelectionContainer}>
          <Text style={styles.timerTitle}>Dinleme Süresi:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingBottom: 5 }}>
            {[
              { label: 'Sonsuz', value: null },
              { label: '5 Dk', value: 5 },
              { label: '10 Dk', value: 10 },
              { label: '15 Dk', value: 15 },
              { label: '30 Dk', value: 30 },
            ].map((option, idx) => {
              const isSelected = selectedDuration === option.value;
              return (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.timerBtn,
                    isSelected && { backgroundColor: COLORS.primary, borderColor: COLORS.primary }
                  ]}
                  onPress={() => handleDurationChange(option.value)}
                >
                  <Text style={[
                    styles.timerBtnText,
                    isSelected && { color: '#000', fontWeight: 'bold' }
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {FREQUENCIES.map((freq) => {
          const isActive = activeFreq?.id === freq.id;
          
          return (
            <TouchableOpacity 
              key={freq.id}
              style={[
                styles.freqCard, 
                isActive && { borderColor: freq.color, backgroundColor: 'rgba(255,255,255,0.1)' }
              ]}
              onPress={() => togglePlay(freq)}
              activeOpacity={0.8}
            >
              <LinearGradient 
                colors={isActive ? [freq.color + '40', 'transparent'] : ['transparent', 'transparent']} 
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill} 
              />
              
              <View style={[styles.hzCircle, { borderColor: freq.color, backgroundColor: isActive ? freq.color + '20' : 'transparent' }]}>
                {isActive && isPlaying ? (
                  <Ionicons name="pause" size={24} color={freq.color} />
                ) : (
                  <Ionicons name="play" size={24} color={freq.color} style={{ marginLeft: 3 }} />
                )}
              </View>

              <View style={styles.freqInfo}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginBottom: 4 }}>
                  <Text style={[styles.hzText, { color: freq.color }]}>{freq.hz}</Text>
                  <Text style={styles.freqName}> - {freq.name}</Text>
                </View>
                <Text style={styles.freqDesc}>{freq.desc}</Text>
                
                {isActive && (
                  <View style={[styles.intentContainer, { borderColor: freq.color + '40' }]}>
                    <Text style={[styles.intentTitle, { color: freq.color }]}>Odak Niyeti:</Text>
                    <Text style={styles.intentText}>"{freq.intent}"</Text>
                  </View>
                )}
              </View>

              {isActive && isPlaying && (
                <View style={styles.playingIndicator}>
                  <Animated.View style={[styles.bar, { backgroundColor: freq.color, height: 15 }]} />
                  <Animated.View style={[styles.bar, { backgroundColor: freq.color, height: 25 }]} />
                  <Animated.View style={[styles.bar, { backgroundColor: freq.color, height: 10 }]} />
                  {selectedDuration !== null && (
                    <Text style={{ color: freq.color, fontSize: 13, marginLeft: 10, fontWeight: 'bold', fontVariant: ['tabular-nums'] }}>
                      {formatTime(timeRemaining)}
                    </Text>
                  )}
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
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
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  backBtn: {
    marginRight: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  scrollContent: {
    padding: SIZES.padding,
    paddingBottom: 50,
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 30,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  freqCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 15,
    backgroundColor: 'rgba(0,0,0,0.4)',
    overflow: 'hidden',
  },
  hzCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  freqInfo: {
    flex: 1,
  },
  hzText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  freqName: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  freqDesc: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  playingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
    marginLeft: 10,
    gap: 3,
  },
  bar: {
    width: 3,
    borderRadius: 2,
  },
  intentContainer: {
    marginTop: 12,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 8,
    borderWidth: 1,
  },
  intentTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  intentText: {
    color: '#E0E0E0',
    fontSize: 13,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  timerSelectionContainer: {
    marginBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 15,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  timerTitle: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  timerBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  timerBtnText: {
    color: COLORS.text,
    fontSize: 13,
  }
});
