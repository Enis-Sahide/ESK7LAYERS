import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground, Animated, TextInput } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES } from '@/src/theme';
import { WebView } from 'react-native-webview';
import Slider from '@react-native-community/slider';

const ESOTERIC_BG = { uri: 'https://mbqjklupfoqbcfxusigs.supabase.co/storage/v1/object/public/app-assets/images/backgrounds/esoteric_bg.png' };

const FREQUENCIES = [
  { id: '1', hz: 396, name: 'Korku ve Suçluluk', desc: 'Kök çakrayı temizler, engelleri kaldırır.', intent: 'Tüm eski korkularımı ve suçluluk duygularımı sevgiyle serbest bırakıyorum. Evrende tamamen güvendeyim.', color: '#FF3B30' },
  { id: '2', hz: 417, name: 'Değişimi Kolaylaştırma', desc: 'Sakral çakrayı arındırır, negatif enerjiyi ve travmaları temizler.', intent: 'Geçmişin yüklerinden özgürleşiyorum. Hayatımdaki mucizevi değişimleri sevgiyle kabul ediyorum.', color: '#FF9500' },
  { id: '3', hz: 528, name: 'DNA Onarımı ve Mucize', desc: 'Solar pleksus çakrasını dengeler, yaşam enerjisini artırır, frekansı yükseltir.', intent: 'Hücrelerim evrenin sevgi frekansıyla yenileniyor. Kendi içimdeki mucizevi şifa gücüne uyanıyorum.', color: '#FFCC00' },
  { id: '4', hz: 639, name: 'İlişkiler ve Bağlantı', desc: 'Kalp çakrasını açar, evrensel uyum getirir.', intent: 'Kendimi ve tüm varoluşu şefkatle kucaklıyorum. İlişkilerim saf sevgi, uyum ve denge içinde akıyor.', color: '#34C759' },
  { id: '5', hz: 741, name: 'Sezgi ve Uyanış', desc: 'Boğaz çakrasını açar, içgüdüleri güçlendirir, zihni berraklaştırır.', intent: 'Zihnimdeki tüm yanılsamalar (illüzyonlar) çözülüyor. İçsel rehberliğimi net bir şekilde duyuyorum.', color: '#32ADE6' },
  { id: '6', hz: 852, name: 'Kozmik Bağlantı', desc: 'Üçüncü göz çakrasını dengeler, üst benlikle bağ kurdurur, ruhani uyanış.', intent: 'Yüksek bilincimle tam bir bütünlük içindeyim. Evrensel gerçeği kalbimin gözüyle, açıkça görebiliyorum.', color: '#007AFF' },
  { id: '7', hz: 963, name: 'İlahi Bütünlük', desc: 'Tepe çakrayı açar, evrensel bilinçle tam bağlantı sağlar.', intent: 'Ben evrenin ta kendisiyim. İlahi olanla aramdaki tüm sınırlar kalktı ve sonsuz ışığa uyandım.', color: '#AF52DE' },
];

const ORGAN_FREQUENCIES = [
  { id: 'org_1', hz: 110.0, name: 'Mide Şifası', desc: 'Mide sağlığını destekler, sindirimi rahatlatır.', intent: 'Sindirimi sevgiyle kabul ediyor, midemi şifalandırıyorum.', color: '#FFCC00' }, // Solar Pleksus Çakrası
  { id: 'org_2', hz: 117.3, name: 'Pankreas Şifası', desc: 'Pankreası dengeler, kan şekerini düzenlemeye yardımcı olur.', intent: 'Pankreasım sağlıklı ve dengede, bedenimi besliyor.', color: '#FFCC00' }, // Solar Pleksus Çakrası
  { id: 'org_3', hz: 220.0, name: 'Akciğer Şifası', desc: 'Akciğer kapasitesini artırır, nefesi derinleştirir.', intent: 'Hayatın nefesini tam ve derinden içime çekiyorum.', color: '#34C759' }, // Kalp Çakrası
  { id: 'org_4', hz: 315.8, name: 'Beyin Şifası', desc: 'Zihinsel yorgunluğu giderir, beyin fonksiyonlarını dengeler.', intent: 'Zihnim berrak ve sakin, yüksek bilincimle uyum içindeyim.', color: '#AF52DE' }, // Tepe Çakrası
  { id: 'org_5', hz: 317.8, name: 'Karaciğer Şifası', desc: 'Karaciğerin arınmasını ve detoksifikasyonunu destekler.', intent: 'Bedenimdeki tüm toksinlerden ve öfkeden arınıyorum.', color: '#FFCC00' }, // Solar Pleksus Çakrası
  { id: 'org_6', hz: 319.9, name: 'Böbrek Şifası', desc: 'Böbrek sağlığını destekler, korkulardan arınmaya yardımcı olur.', intent: 'Korkuyu serbest bırakıyor, derin bir güven duygusuyla doluyorum.', color: '#FF9500' }, // Sakral Çakra
  { id: 'org_7', hz: 321.9, name: 'Kan ve Dolaşım', desc: 'Kan hücrelerini canlandırır, dolaşımı rahatlatır.', intent: 'Yaşam enerjisi tüm bedenimde özgürce dolaşıyor.', color: '#FF3B30' }, // Kök Çakra
];

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

            // Adding a subtle LFO for a "bowl" effect
            let lfo = audioCtx.createOscillator();
            lfo.type = 'sine';
            lfo.frequency.value = 0.5; // 0.5 Hz pulse
            let lfoGain = audioCtx.createGain();
            lfoGain.gain.value = 0.2; // subtle depth
            
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

        function setFrequency(freq) {
            if (currentOscillator && audioCtx) {
                currentOscillator.frequency.setTargetAtTime(freq, audioCtx.currentTime, 0.1);
            }
        }

        document.addEventListener('message', function(event) {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'PLAY') {
                    startAudio(data.freq);
                } else if (data.type === 'STOP') {
                    stopAudio();
                } else if (data.type === 'SET_FREQ') {
                    setFrequency(data.freq);
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
                } else if (data.type === 'SET_FREQ') {
                    setFrequency(data.freq);
                }
            } catch (e) {}
        });
    </script>
</head>
<body style="background:transparent;"></body>
</html>
`;

export default function MeditationScreen() {
  const router = useRouter();
  const webviewRef = useRef<WebView>(null);
  
  const [activeFreq, setActiveFreq] = useState<any>(null); // From FREQUENCIES or Custom
  const [isPlaying, setIsPlaying] = useState(false);
  const [customHz, setCustomHz] = useState<number>(432); // Default to 432 Hz
  const [customTimerStr, setCustomTimerStr] = useState<string>('');

  // Süre seçimi ve geri sayım için state'ler
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null); // Dakika cinsinden. null = sonsuz
  const [timeRemaining, setTimeRemaining] = useState<number>(0); // Saniye cinsinden
  const [animBar] = useState(new Animated.Value(1));
  const [showOrgans, setShowOrgans] = useState(false);
  const [showChakras, setShowChakras] = useState(true);

  // Ekrandan çıkınca müziği durdur
  useFocusEffect(
    useCallback(() => {
      return () => {
        stopSound();
      };
    }, [])
  );

  useEffect(() => {
    if (isPlaying) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animBar, { toValue: 1.5, duration: 500, useNativeDriver: true }),
          Animated.timing(animBar, { toValue: 1, duration: 500, useNativeDriver: true })
        ])
      ).start();
    } else {
      animBar.stopAnimation();
    }
  }, [isPlaying]);

  // Zamanlayıcı geri sayım mantığı
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && selectedDuration !== null && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            stopSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, selectedDuration, timeRemaining]);

  const sendToWebView = (message: any) => {
    if (webviewRef.current) {
      webviewRef.current.postMessage(JSON.stringify(message));
    }
  };

  const stopSound = () => {
    sendToWebView({ type: 'STOP' });
    setIsPlaying(false);
  };

  const playSound = (hz: number) => {
    sendToWebView({ type: 'PLAY', freq: hz });
    setIsPlaying(true);
    
    if (selectedDuration !== null && timeRemaining <= 0) {
      setTimeRemaining(selectedDuration * 60);
    }
  };

  const toggleCustomPlay = () => {
    if (isPlaying && activeFreq === 'CUSTOM') {
      stopSound();
    } else {
      setActiveFreq('CUSTOM');
      playSound(customHz);
    }
  };

  const onCustomHzChange = (val: number) => {
    const rounded = Math.round(val);
    setCustomHz(rounded);
    if (isPlaying && activeFreq === 'CUSTOM') {
      sendToWebView({ type: 'SET_FREQ', freq: rounded });
    }
  };

  const adjustCustomHz = (amount: number) => {
    const newHz = Math.max(1, Math.min(20000, customHz + amount));
    setCustomHz(newHz);
    if (isPlaying && activeFreq === 'CUSTOM') {
      sendToWebView({ type: 'SET_FREQ', freq: newHz });
    }
  };

  const togglePresetPlay = (freq: any) => {
    if (activeFreq?.id === freq.id && isPlaying) {
      stopSound();
    } else {
      setActiveFreq(freq);
      setCustomHz(freq.hz);
      playSound(freq.hz);
    }
  };

  const handleDurationChangeSeconds = (totalSeconds: number | null) => {
    // We reuse selectedDuration to mean 'total seconds' or 'minutes' depending on context,
    // but the easiest is to just setTimeRemaining(totalSeconds) and bypass selectedDuration for custom,
    // or set selectedDuration to the fraction. 
    // Wait, the current logic is:
    // selectedDuration is in MINUTES.
    // Let's change selectedDuration to store SECONDS instead of minutes.
    // Wait, handleDurationChange takes minutes for the preset buttons.
  };

  const handleDurationChange = (val: number | null) => {
    // val is in MINUTES for presets.
    setSelectedDuration(val);
    if (isPlaying) {
      if (val === null) {
        setTimeRemaining(0);
      } else {
        setTimeRemaining(val * 60);
      }
    }
  };

  const applyCustomTimer = () => {
    const str = customTimerStr.replace(',', '.');
    if (!str) return;

    let totalSecs = 0;
    if (str.includes('.')) {
      const parts = str.split('.');
      const m = parseInt(parts[0]) || 0;
      const s = parseInt(parts[1]) || 0;
      totalSecs = (m * 60) + s;
    } else {
      const m = parseInt(str) || 0;
      totalSecs = m * 60;
    }

    if (totalSecs > 0) {
      setSelectedDuration(totalSecs / 60); // Store as minutes so it works with selectedDuration logic
      if (isPlaying) setTimeRemaining(totalSecs);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <ImageBackground source={ESOTERIC_BG} style={styles.container} resizeMode="cover">
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(10, 15, 30, 0.85)' }]} />
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
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="close" size={32} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Frekans Odası</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Özel Frekans Üretici Paneli (FrequencyGenerator Tarzı) */}
        <View style={styles.generatorPanel}>
          <Text style={styles.generatorTitle}>Özel Frekans</Text>
          <View style={styles.hzDisplayContainer}>
            <Text style={styles.hzDisplayValue}>{customHz}</Text>
            <Text style={styles.hzDisplayUnit}>Hz</Text>
          </View>

          {/* Slider ve + / - Tuşları */}
          <View style={styles.sliderRow}>
            <TouchableOpacity style={styles.adjustBtn} onPress={() => adjustCustomHz(-1)}>
              <Ionicons name="remove" size={24} color="#FFF" />
            </TouchableOpacity>
            
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={2000}
              value={customHz}
              onValueChange={onCustomHzChange}
              minimumTrackTintColor={COLORS.primary}
              maximumTrackTintColor="rgba(255,255,255,0.2)"
              thumbTintColor={COLORS.primary}
            />

            <TouchableOpacity style={styles.adjustBtn} onPress={() => adjustCustomHz(1)}>
              <Ionicons name="add" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          {/* Play/Stop Butonu */}
          <TouchableOpacity 
            style={[styles.playBtn, (isPlaying && activeFreq === 'CUSTOM') && styles.playBtnActive]} 
            onPress={toggleCustomPlay}
          >
            <Ionicons name={(isPlaying && activeFreq === 'CUSTOM') ? "stop" : "play"} size={36} color="#000" style={{ marginLeft: (isPlaying && activeFreq === 'CUSTOM') ? 0 : 4 }} />
          </TouchableOpacity>
        </View>

        {/* Süre Seçimi */}
        <View style={styles.timerSelectionContainer}>
          <Text style={styles.timerTitle}>Dinleme Süresi:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingBottom: 5, alignItems: 'center' }}>
            
            {/* Özel Süre */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 5 }}>
              <TextInput 
                style={styles.customTimerInput}
                placeholder="Örn: 3.45"
                placeholderTextColor="rgba(255,255,255,0.3)"
                keyboardType="decimal-pad"
                value={customTimerStr}
                onChangeText={setCustomTimerStr}
              />
              <TouchableOpacity style={styles.customTimerBtn} onPress={applyCustomTimer}>
                <Text style={styles.customTimerBtnText}>Ayarla</Text>
              </TouchableOpacity>
            </View>

            {[
              { label: '∞', value: null },
              { label: '5 Dk', value: 5 },
              { label: '15 Dk', value: 15 },
            ].map((option, idx) => {
              const isSelected = selectedDuration === option.value && !customTimerStr;
              return (
                <TouchableOpacity
                  key={idx}
                  style={[styles.timerBtn, isSelected && styles.timerBtnSelected]}
                  onPress={() => {
                    setCustomTimerStr('');
                    handleDurationChange(option.value);
                  }}
                >
                  <Text style={[styles.timerBtnText, isSelected && styles.timerBtnTextSelected, option.label === '∞' && { fontSize: 18, marginTop: -2 }]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}

          </ScrollView>
          {timeRemaining > 0 && isPlaying && (
            <Text style={styles.timeRemainingText}>Kalan Süre: {formatTime(timeRemaining)}</Text>
          )}
        </View>

        <TouchableOpacity 
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20, marginBottom: 15 }} 
          onPress={() => setShowChakras(!showChakras)}
        >
          <Text style={[styles.presetsTitle, { marginTop: 0, marginBottom: 0, marginRight: 8 }]}>Çakra Frekansları</Text>
          <Ionicons name={showChakras ? "chevron-up" : "chevron-down"} size={20} color="rgba(255,255,255,0.6)" />
        </TouchableOpacity>

        {showChakras && FREQUENCIES.map((freq) => {
          const isActive = activeFreq?.id === freq.id;
          
          return (
            <TouchableOpacity 
              key={freq.id}
              style={[
                styles.freqCard, 
                isActive && { borderColor: freq.color, backgroundColor: 'rgba(255,255,255,0.1)' }
              ]}
              onPress={() => togglePresetPlay(freq)}
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
                  <Text style={[styles.hzText, { color: freq.color }]}>{freq.hz} Hz</Text>
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
                  <Animated.View style={[styles.bar, { backgroundColor: freq.color, height: 15, transform: [{ scaleY: animBar }] }]} />
                  <Animated.View style={[styles.bar, { backgroundColor: freq.color, height: 25, transform: [{ scaleY: animBar }] }]} />
                  <Animated.View style={[styles.bar, { backgroundColor: freq.color, height: 10, transform: [{ scaleY: animBar }] }]} />
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity 
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20, marginBottom: 5 }} 
          onPress={() => setShowOrgans(!showOrgans)}
        >
          <Text style={[styles.presetsTitle, { marginTop: 0, marginBottom: 0, marginRight: 8 }]}>Organ Şifalandırma Frekansları</Text>
          <Ionicons name={showOrgans ? "chevron-up" : "chevron-down"} size={20} color="rgba(255,255,255,0.6)" />
        </TouchableOpacity>
        
        {showOrgans && (
          <>
            <Text style={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginBottom: 15, paddingHorizontal: 20, fontSize: 13, fontFamily: 'Outfit_400Regular' }}>
              * Araştırmacı Barbara Hero'nun sağlıklı organlardaki ses dalgası ölçümlerine dayanır. Ortalama dinleme süresi 15 dakikadır.
            </Text>

            {ORGAN_FREQUENCIES.map((freq) => {
          const isActive = activeFreq?.id === freq.id;
          
          return (
            <TouchableOpacity 
              key={freq.id}
              style={[
                styles.freqCard, 
                isActive && { borderColor: freq.color, backgroundColor: 'rgba(255,255,255,0.1)' }
              ]}
              onPress={() => {
                togglePresetPlay(freq);
                if (activeFreq?.id !== freq.id) {
                  // Seçildiğinde otomatik 15 dakika ayarla (900 saniye)
                  handleDurationChange(15);
                  setCustomTimerStr('');
                }
              }}
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
                  <Text style={[styles.hzText, { color: freq.color }]}>{freq.hz} Hz</Text>
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
                  <Animated.View style={[styles.bar, { backgroundColor: freq.color, height: 15, transform: [{ scaleY: animBar }] }]} />
                  <Animated.View style={[styles.bar, { backgroundColor: freq.color, height: 25, transform: [{ scaleY: animBar }] }]} />
                  <Animated.View style={[styles.bar, { backgroundColor: freq.color, height: 10, transform: [{ scaleY: animBar }] }]} />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
          </>
        )}
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
  
  // Generator Panel Styles
  generatorPanel: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    marginBottom: 25,
  },
  generatorTitle: {
    color: COLORS.textMuted,
    fontSize: 16,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  hzDisplayContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  hzDisplayValue: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#FFF',
    fontVariant: ['tabular-nums'],
  },
  hzDisplayUnit: {
    fontSize: 24,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 30,
  },
  slider: {
    flex: 1,
    height: 40,
    marginHorizontal: 10,
  },
  adjustBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  playBtnActive: {
    backgroundColor: COLORS.error || '#FF3B30',
    shadowColor: COLORS.error || '#FF3B30',
  },

  timerSelectionContainer: {
    marginBottom: 25,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 15,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  timerTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  timerBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  timerBtnSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  timerBtnText: {
    color: COLORS.text,
    fontSize: 14,
  },
  timerBtnTextSelected: {
    color: '#000',
    fontWeight: 'bold',
  },
  customTimerInput: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    color: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    width: 70,
    marginRight: 10,
    textAlign: 'center',
  },
  customTimerBtn: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  customTimerBtnText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  timeRemainingText: {
    marginTop: 15,
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 1,
  },

  presetsTitle: {
    color: COLORS.textMuted,
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 15,
    textAlign: 'center',
    marginTop: 10,
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
  }
});
