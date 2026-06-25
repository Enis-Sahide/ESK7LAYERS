import SacredBackground from '@/components/SacredBackground';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, UIManager, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { COLORS, SIZES } from '@/src/theme';
import Svg, { Path, Circle, G } from 'react-native-svg';

const { width } = Dimensions.get('window');

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function MicrocosmicOrbitScreen() {
  const router = useRouter();
  
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'IDLE' | 'INHALE' | 'HOLD_TOP' | 'EXHALE' | 'HOLD_BOTTOM'>('IDLE');
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const INHALE_MS = 6000;
  const HOLD_TOP_MS = 2000;
  const EXHALE_MS = 6000;
  const HOLD_BOTTOM_MS = 2000;

  const phaseRef = useRef(phase);
  const activeRef = useRef(isActive);
  
  useEffect(() => {
    phaseRef.current = phase;
    activeRef.current = isActive;
  }, [phase, isActive]);

  useEffect(() => {
    if (!isActive) {
      setPhase('IDLE');
      setProgress(0);
      setTimeLeft(0);
      setCycles(0);
      return;
    }

    let animationFrame: number;
    let startTime = Date.now();
    let currentDuration = INHALE_MS;
    
    if (phaseRef.current === 'IDLE') {
      setPhase('INHALE');
      phaseRef.current = 'INHALE';
      setCycles(0);
    } else {
      if (phaseRef.current === 'INHALE') currentDuration = INHALE_MS;
      if (phaseRef.current === 'HOLD_TOP') currentDuration = HOLD_TOP_MS;
      if (phaseRef.current === 'EXHALE') currentDuration = EXHALE_MS;
      if (phaseRef.current === 'HOLD_BOTTOM') currentDuration = HOLD_BOTTOM_MS;
    }

    const tick = () => {
      if (!activeRef.current) return;
      
      const now = Date.now();
      const elapsed = now - startTime;
      let p = elapsed / currentDuration;

      if (p >= 1) {
        p = 0;
        startTime = now;
        if (phaseRef.current === 'INHALE') {
          setPhase('HOLD_TOP');
          currentDuration = HOLD_TOP_MS;
        } else if (phaseRef.current === 'HOLD_TOP') {
          setPhase('EXHALE');
          currentDuration = EXHALE_MS;
        } else if (phaseRef.current === 'EXHALE') {
          setPhase('HOLD_BOTTOM');
          currentDuration = HOLD_BOTTOM_MS;
        } else if (phaseRef.current === 'HOLD_BOTTOM') {
          setPhase('INHALE');
          currentDuration = INHALE_MS;
          setCycles(c => c + 1);
        }
      }

      setProgress(p);
      setTimeLeft(Math.ceil((currentDuration - elapsed) / 1000));
      animationFrame = requestAnimationFrame(tick);
    };

    animationFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrame);
  }, [isActive]);

  const getInstruction = () => {
    switch (phase) {
      case 'IDLE': return 'Hazır olduğunuzda başlatın';
      case 'INHALE': return 'Nefes Al: Omurgadan yukarı (Yang)';
      case 'HOLD_TOP': return 'Tut: Tepe çakrada toplayın';
      case 'EXHALE': return 'Nefes Ver: Göğüsten aşağı (Yin)';
      case 'HOLD_BOTTOM': return 'Tut: Göbek altında mühürleyin';
      default: return '';
    }
  };

  let cx = 150;
  let cy = 250;
  
  if (phase === 'INHALE') {
    const angle = progress * Math.PI; 
    cx = 150 + Math.sin(angle) * 80;
    cy = 250 - progress * 200; 
  } else if (phase === 'HOLD_TOP') {
    cx = 150;
    cy = 50;
  } else if (phase === 'EXHALE') {
    const angle = progress * Math.PI;
    cx = 150 - Math.sin(angle) * 80;
    cy = 50 + progress * 200; 
  } else if (phase === 'HOLD_BOTTOM' || phase === 'IDLE') {
    cx = 150;
    cy = 250;
  }

  const orbColor = phase === 'INHALE' ? '#EF4444' : phase === 'EXHALE' ? '#3B82F6' : '#A855F7';

  return (
    <SacredBackground>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={28} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mikrokozmik Yörünge</Text>
        <TouchableOpacity 
          onPress={() => setSoundEnabled(!soundEnabled)} 
          style={styles.soundBtn}
        >
          <Ionicons 
            name={soundEnabled ? "volume-medium-outline" : "volume-mute-outline"} 
            size={24} 
            color="#FFF" 
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.textContainer}>
          <Text style={styles.subtitle}>
            Bedeninizin ana meridyenlerinde "Chi" enerjisini dolaştırın. İçsel simyanın temeli olan bu pratik, hücresel şifayı başlatır.
          </Text>
        </View>

        {/* Warning Alert */}
        <BlurView intensity={20} tint="dark" style={styles.warningCard}>
          <Ionicons name="shield-half-outline" size={24} color={COLORS.primary} style={{ marginRight: 12, marginTop: 2 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.warningTitle}>Usta Tavsiyesi:</Text>
            <Text style={styles.warningText}>
              Gözlerinizi kapatın. Dilinizi üst damağınıza yapıştırın. Nefes alırken enerjiyi omurganızdan yukarı çekin, nefes verirken göğsünüzden göbek deliğinin 3 parmak altına (Dantian) indirin.
            </Text>
          </View>
        </BlurView>

        {/* Animation & Timer Container */}
        <BlurView intensity={30} tint="dark" style={styles.visualizerCard}>
          {isActive && (
            <View style={styles.cycleBadge}>
              <Text style={styles.cycleText}>{cycles} Tur</Text>
            </View>
          )}

          {/* Breathing Instruction */}
          <View style={styles.instructionWrapper}>
            <Text style={[
              styles.instructionText,
              phase === 'INHALE' && { color: '#EF4444' },
              phase === 'EXHALE' && { color: '#3B82F6' },
              phase === 'HOLD_TOP' && { color: '#A855F7' },
              phase === 'HOLD_BOTTOM' && { color: '#A855F7' }
            ]}>
              {getInstruction()}
            </Text>
            
            {isActive && (
              <View style={styles.timerWrapper}>
                <Text style={[
                  styles.timerText,
                  phase === 'INHALE' && { color: '#EF4444' },
                  phase === 'EXHALE' && { color: '#3B82F6' },
                  phase === 'HOLD_TOP' && { color: '#A855F7' },
                  phase === 'HOLD_BOTTOM' && { color: '#A855F7' }
                ]}>
                  {timeLeft}
                </Text>
                
                {/* Progress bar */}
                <View style={styles.progressBarBg}>
                  <View style={[
                    styles.progressBarFill,
                    { width: `${progress * 100}%` },
                    phase === 'INHALE' && { backgroundColor: '#EF4444' },
                    phase === 'EXHALE' && { backgroundColor: '#3B82F6' },
                    phase === 'HOLD_TOP' && { backgroundColor: '#A855F7' },
                    phase === 'HOLD_BOTTOM' && { backgroundColor: '#A855F7' }
                  ]} />
                </View>
              </View>
            )}
          </View>

          {/* SVG Orbit Visualizer */}
          <View style={styles.svgWrapper}>
            <Svg width="300" height="300" viewBox="0 0 300 300" style={styles.svg}>
              {/* Path 1: Inhale Path (Right Side/Back/Yang) */}
              <Path 
                d="M 150 250 A 80 100 0 0 0 150 50" 
                fill="none" 
                stroke="rgba(239, 68, 68, 0.3)" 
                strokeWidth="4" 
                strokeDasharray="6,6" 
              />
              {/* Path 2: Exhale Path (Left Side/Front/Yin) */}
              <Path 
                d="M 150 50 A 80 100 0 0 0 150 250" 
                fill="none" 
                stroke="rgba(59, 130, 246, 0.3)" 
                strokeWidth="4" 
                strokeDasharray="6,6" 
              />

              {/* Chakras / Energy Centers */}
              <Circle cx="150" cy="250" r="10" fill="#EF4444" opacity="0.9" /> {/* Root */}
              <Circle cx="150" cy="50" r="10" fill="#A855F7" opacity="0.9" />  {/* Crown */}
              <Circle cx="150" cy="180" r="8" fill="#F59E0B" opacity="0.6" />  {/* Navel */}
              <Circle cx="150" cy="120" r="8" fill="#10B981" opacity="0.6" />  {/* Heart */}
              <Circle cx="150" cy="80" r="8" fill="#3B82F6" opacity="0.6" />   {/* Throat */}

              {/* The Moving Energy Orb */}
              <G transform={`translate(${cx - 150}, ${cy - 150})`}>
                <Circle cx="150" cy="150" r="14" fill={orbColor} />
                <Circle cx="150" cy="150" r="24" fill={orbColor} opacity="0.3" />
              </G>
            </Svg>
          </View>

          {/* Controls */}
          <View style={styles.controlsRow}>
            <TouchableOpacity 
              onPress={() => setIsActive(!isActive)}
              style={styles.playBtn}
            >
              <Ionicons name={isActive ? "pause" : "play"} size={32} color="#FFF" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => { setIsActive(false); setPhase('IDLE'); setProgress(0); setTimeLeft(0); }}
              style={styles.resetBtn}
            >
              <Ionicons name="refresh" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        </BlurView>

        <View style={{height: 100}} />
      </ScrollView>
    </SacredBackground>
  );
}

const styles = StyleSheet.create({
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
  backBtn: { padding: 5, backgroundColor: 'rgba(212, 175, 55, 0.1)', borderRadius: 12 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary },
  soundBtn: { padding: 8, backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 12 },
  scrollContent: { padding: 20 },
  textContainer: {
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 22,
    textAlign: 'center',
  },
  warningCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    flexDirection: 'row',
    marginBottom: 25,
    overflow: 'hidden',
  },
  warningTitle: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  warningText: {
    color: '#E0E0E0',
    fontSize: 13,
    lineHeight: 20,
  },
  visualizerCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.15)',
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    overflow: 'hidden',
    minHeight: 520,
  },
  cycleBadge: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.4)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  cycleText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 13,
  },
  instructionWrapper: {
    alignItems: 'center',
    marginTop: 20,
    height: 110,
    justifyContent: 'center',
    width: '100%',
  },
  instructionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  timerWrapper: {
    alignItems: 'center',
    width: '100%',
  },
  timerText: {
    fontSize: 36,
    fontWeight: '900',
    marginBottom: 8,
  },
  progressBarBg: {
    width: 150,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    width: 0,
  },
  svgWrapper: {
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: 300,
    height: 300,
  },
  svg: {
    overflow: 'visible',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginTop: 'auto',
  },
  playBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  resetBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
