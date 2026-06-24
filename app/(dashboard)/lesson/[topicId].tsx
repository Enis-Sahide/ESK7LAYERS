import SacredBackground from '@/components/SacredBackground';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, ImageBackground, Animated } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES } from '@/src/theme';
import { useContent } from '@/src/core/content/useContent';
import { WebView } from 'react-native-webview';

const ESOTERIC_BG = require('@/assets/images/esoteric_bg_indigo.webp');

const WEBVIEW_HTML = `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <script>
        let audioCtx = null;
        let masterGain = null;
        let currentOscillator = null;

        function startAudio(freq) {
            if (!audioCtx) {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (!AudioContext) return;
                audioCtx = new AudioContext();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            
            stopAudio();

            currentOscillator = audioCtx.createOscillator();
            currentOscillator.type = 'sine';
            currentOscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);

            masterGain = audioCtx.createGain();
            masterGain.gain.setValueAtTime(0.5, audioCtx.currentTime);

            let lfo = audioCtx.createOscillator();
            lfo.type = 'sine';
            lfo.frequency.value = 0.5;
            let lfoGain = audioCtx.createGain();
            lfoGain.gain.value = 0.2;
            
            lfo.connect(lfoGain);
            lfoGain.connect(masterGain.gain);

            currentOscillator.connect(masterGain);
            masterGain.connect(audioCtx.destination);

            currentOscillator.start();
            lfo.start();
        }

        function stopAudio() {
            if (currentOscillator) {
                currentOscillator.stop();
                currentOscillator.disconnect();
                currentOscillator = null;
            }
            if (masterGain) {
                masterGain.disconnect();
                masterGain = null;
            }
        }

        document.addEventListener('message', function(event) {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'PLAY') {
                    startAudio(data.freq);
                } else if (data.type === 'STOP') {
                    stopAudio();
                }
            } catch (e) {}
        });
        
        window.addEventListener('message', function(event) {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'PLAY') {
                    startAudio(data.freq);
                } else if (data.type === 'STOP') {
                    stopAudio();
                }
            } catch (e) {}
        });
    </script>
</head>
<body style="background:transparent;"></body>
</html>
`;

// Çakra Renkleri (Görsel Uyum İçin)
const CHAKRA_COLORS: Record<string, string> = {
  '1': '#FF3B30',
  '2': '#FF9500',
  '3': '#FFCC00',
  '4': '#34C759',
  '5': '#00C7BE',
  '6': '#32ADE6',
  '7': '#AF52DE',
};

export default function LessonScreen() {
  const router = useRouter();
  const { topicId, chakraId } = useLocalSearchParams();
  const webviewRef = useRef<WebView>(null);
  
  const chakraColor = CHAKRA_COLORS[chakraId as string] || COLORS.primary;
  const lessonKey = `${chakraId}_${topicId}`;
  const { data: lessonsData } = useContent<Record<string, any>>('/api/content/chakra-lessons');
  const lessonData = (lessonsData ?? {})[lessonKey];

  useEffect(() => {
    let timeout: any;
    if (lessonData?.frequency) {
      // WebView'in yüklenmesini biraz bekle ve frekansı gönder
      timeout = setTimeout(() => {
        if (webviewRef.current) {
          webviewRef.current.postMessage(JSON.stringify({ type: 'PLAY', freq: lessonData.frequency }));
        }
      }, 1000);
    }

    return () => {
      clearTimeout(timeout);
      if (webviewRef.current) {
        webviewRef.current.postMessage(JSON.stringify({ type: 'STOP' }));
      }
    };
  }, [lessonData]);

  if (!lessonsData) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: 'white' }}>Yükleniyor...</Text>
      </View>
    );
  }

  if (!lessonData) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{color: 'white'}}>Bu dersin kadim parşömeni henüz yazılmadı...</Text>
        <TouchableOpacity onPress={() => router.back()} style={{marginTop: 20}}>
          <Text style={{color: COLORS.primary}}>Geri Dön</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SacredBackground>
      {/* Merkezde Renk, Köşelere Doğru Şeffaf (Soft Glow) */}
      <LinearGradient 
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        colors={['transparent', chakraColor + '50', 'transparent']}
        locations={[0.1, 0.5, 0.9]}
        style={StyleSheet.absoluteFill} 
      />
      <LinearGradient 
        start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }}
        colors={['transparent', chakraColor + '50', 'transparent']}
        locations={[0.1, 0.5, 0.9]}
        style={StyleSheet.absoluteFill} 
      />
      
      {/* Kenarları karanlık, merkezi aydınlık tutan yarı saydam koruyucu filtre ve Cam Efekti */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(10, 11, 16, 0.5)' }]} />
      <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />

      <WebView 
        ref={webviewRef}
        source={{ html: WEBVIEW_HTML }}
        style={{ width: 0, height: 0, opacity: 0 }}
        originWhitelist={['*']}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
        javaScriptEnabled={true}
      />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/(dashboard)')} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={28} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: chakraColor }]}>Çakra Rehberi</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {topicId === 'meditasyon' && (
          <TouchableOpacity 
            style={[styles.guidelineBanner, { borderColor: chakraColor + '40' }]}
            onPress={() => router.push('/(dashboard)/chakra-guidelines')}
            activeOpacity={0.8}
          >
            <View style={[styles.guidelineIcon, { backgroundColor: chakraColor + '20' }]}>
              <Ionicons name="warning" size={22} color={chakraColor} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.guidelineTitle, { color: chakraColor }]}>Çalışma Disiplini</Text>
              <Text style={styles.guidelineSub}>Meditasyona başlamadan önce mutlaka okuyun</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={chakraColor} />
          </TouchableOpacity>
        )}

        {/* REHBER İÇERİĞİ */}
        <BlurView intensity={30} tint="dark" style={styles.scrollCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="sparkles-outline" size={22} color={COLORS.primary} />
            <Text style={styles.cardTitle}>{lessonData.title}</Text>
          </View>
          
          {lessonData.image && (
            <Animated.Image 
              source={lessonData.image} 
              style={{ width: '100%', height: 220, borderRadius: SIZES.radius, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.3)' }} 
              resizeMode="cover" 
            />
          )}

          {lessonData.astrology && (
            <View style={styles.astrologyContainer}>
              {/* Gezegen */}
              <View style={styles.astroBox}>
                <Text style={styles.astroSymbol}>{lessonData.astrology.planetSymbol}</Text>
                <Text style={styles.astroLabel}>Gezegen</Text>
                <Text style={[styles.astroValue, { color: chakraColor }]}>{lessonData.astrology.planet}</Text>
              </View>
              
              {/* Burçlar */}
              <View style={styles.astroBox}>
                <Text style={styles.astroSymbol}>{lessonData.astrology.signs.map((s: any) => s.symbol).join(' ')}</Text>
                <Text style={styles.astroLabel}>Burç</Text>
                <Text style={[styles.astroValue, { color: chakraColor }]}>{lessonData.astrology.signs.map((s: any) => s.name).join(' & ')}</Text>
              </View>

              {/* Gün */}
              <View style={styles.astroBox}>
                <Ionicons name="calendar-outline" size={24} color={COLORS.text} style={{marginBottom: 6, marginTop: 2}} />
                <Text style={styles.astroLabel}>Gün</Text>
                <Text style={[styles.astroValue, { color: chakraColor }]}>{lessonData.astrology.day}</Text>
              </View>
            </View>
          )}

          <Text style={styles.contentText}>{lessonData.content}</Text>
        </BlurView>
        
        <View style={{ height: 40 }} />
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
    backgroundColor: 'rgba(10, 15, 30, 0.5)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.2)',
  },
  backBtn: {
    padding: 8,
    marginRight: 10,
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    textShadowColor: 'rgba(212, 175, 55, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  scrollContent: {
    padding: SIZES.padding,
    paddingTop: 25,
  },
  scrollCard: {
    padding: 20,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.2)',
    paddingBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginLeft: 10,
  },
  contentText: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  astrologyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
    marginTop: 5,
    gap: 10,
  },
  astroBox: {
    flex: 1,
    backgroundColor: 'rgba(212, 175, 55, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    borderRadius: SIZES.radius,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  astroSymbol: {
    fontSize: 22,
    color: COLORS.text,
    marginBottom: 4,
  },
  astroLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  astroValue: {
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  questionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 20,
    lineHeight: 22,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: SIZES.radius,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 10,
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
    fontSize: 15,
    flex: 1,
  },
  successMessageContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderRadius: SIZES.radius,
    alignItems: 'center',
  },
  successMessage: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  xpText: {
    color: COLORS.success,
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
  errorMessageContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  errorMessage: {
    color: COLORS.error,
    fontSize: 14,
    fontStyle: 'italic',
  },
  guidelineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: SIZES.radius,
    borderWidth: 1,
    marginBottom: 20,
  },
  guidelineIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  guidelineTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  guidelineSub: {
    fontSize: 12,
    color: COLORS.textMuted,
  }
});
