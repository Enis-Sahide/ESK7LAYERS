import SacredBackground from '@/components/SacredBackground';
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ImageBackground, LayoutAnimation, Platform, UIManager, Animated } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES } from '@/src/theme';
import { LESSONS } from '@/src/data/chakraLessons';

const ESOTERIC_BG = require('@/assets/images/esoteric_bg_indigo.webp');

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const { width } = Dimensions.get('window');

const CHAKRAS = {
  '1': { title: 'Kök Çakra', subtitle: 'Temel Bilgiler', color: '#FF3B30' },
  '2': { title: 'Sakral Çakra', subtitle: 'Bağlar ve Yaratım', color: '#FF9500' },
  '3': { title: 'Solar Pleksus', subtitle: 'İrade ve Güç', color: '#FFCC00' },
  '4': { title: 'Kalp Çakrası', subtitle: 'Sevgi ve Denge', color: '#34C759' },
  '5': { title: 'Boğaz Çakrası', subtitle: 'İfade ve Gerçek', color: '#00C7BE' },
  '6': { title: 'Üçüncü Göz', subtitle: 'Sezgi ve İdrak', color: '#32ADE6' },
  '7': { title: 'Tepe Çakra', subtitle: 'Kozmik Bağlantı', color: '#AF52DE' },
};

const TOPICS = [
  { id: 'nedir', title: 'Çakra Hakkında & Tıkanıklıklar', icon: 'information-circle-outline' },
  { id: 'dengeleme', title: 'Şifa ve Dengeleme Rehberi', icon: 'leaf-outline' },
  { id: 'tasavvuf', title: 'Sufizm ve Nefs Mertebesi', icon: 'book-outline' },
  { id: 'meditasyon', title: 'Aktivasyon ve Meditasyon', icon: 'body-outline' },
];

export default function ChakraDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null);
  
  const chakra = CHAKRAS[id as keyof typeof CHAKRAS];

  if (!chakra) {
    return (
      <View style={styles.container}>
        <Text style={{color: 'white'}}>Çakra bulunamadı.</Text>
      </View>
    );
  }

  const handleTopicPress = (topicId: string) => {
    if (topicId === 'meditasyon') {
      router.push(`/lesson/${topicId}?chakraId=${id}`);
      return;
    }
    
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedTopicId(expandedTopicId === topicId ? null : topicId);
  };

  const renderExpandedContent = (topicId: string) => {
    const lessonKey = `${id}_${topicId}`;
    const lessonData = LESSONS[lessonKey];

    if (!lessonData) {
      return (
        <View style={styles.expandedContent}>
          <Text style={{color: COLORS.textMuted, fontStyle: 'italic', textAlign: 'center'}}>Bu dersin kadim parşömeni henüz yazılmadı...</Text>
        </View>
      );
    }

    return (
      <View style={styles.expandedContent}>
        {lessonData.image && (
          <Animated.Image 
            source={lessonData.image} 
            style={{ width: '100%', height: 200, borderRadius: SIZES.radius, marginBottom: 15, borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.3)' }} 
            resizeMode="cover" 
          />
        )}

        {lessonData.astrology && (
          <View style={styles.astrologyContainer}>
            <View style={styles.astroBox}>
              <Text style={styles.astroSymbol}>{lessonData.astrology.planetSymbol}</Text>
              <Text style={styles.astroLabel}>Gezegen</Text>
              <Text style={[styles.astroValue, { color: chakra.color }]}>{lessonData.astrology.planet}</Text>
            </View>
            
            <View style={styles.astroBox}>
              <Text style={styles.astroSymbol}>{lessonData.astrology.signs.map((s: any) => s.symbol).join(' ')}</Text>
              <Text style={styles.astroLabel}>Burç</Text>
              <Text style={[styles.astroValue, { color: chakra.color }]}>{lessonData.astrology.signs.map((s: any) => s.name).join(' & ')}</Text>
            </View>

            <View style={styles.astroBox}>
              <Ionicons name="calendar-outline" size={24} color={COLORS.text} style={{marginBottom: 6, marginTop: 2}} />
              <Text style={styles.astroLabel}>Gün</Text>
              <Text style={[styles.astroValue, { color: chakra.color }]}>{lessonData.astrology.day}</Text>
            </View>
          </View>
        )}

        <Text style={styles.contentText}>{lessonData.content}</Text>
      </View>
    );
  };

  return (
    <SacredBackground>
      <LinearGradient 
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        colors={['transparent', chakra.color + '60', 'transparent']}
        locations={[0.1, 0.5, 0.9]}
        style={StyleSheet.absoluteFill} 
      />
      <LinearGradient 
        start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }}
        colors={['transparent', chakra.color + '60', 'transparent']}
        locations={[0.1, 0.5, 0.9]}
        style={StyleSheet.absoluteFill} 
      />
      
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(10, 11, 16, 0.4)' }]} />
      <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={28} color={COLORS.primary} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.title, { color: chakra.color }]}>{chakra.title}</Text>
          <Text style={styles.subtitle}>{chakra.subtitle}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={{ height: 15 }} />

        {TOPICS.map((topic: any) => {
          const isExpanded = expandedTopicId === topic.id;
          
          return (
            <TouchableOpacity 
              key={topic.id} 
              style={styles.topicWrapper}
              onPress={() => handleTopicPress(topic.id)}
              activeOpacity={0.8}
            >
              <BlurView intensity={isExpanded ? 40 : 30} tint="dark" style={[styles.topicCard, isExpanded && { borderColor: chakra.color + '80' }]}>
                <View style={styles.topicHeaderRow}>
                  <View style={[styles.iconContainer, { backgroundColor: chakra.color + '20', borderColor: chakra.color }]}>
                    <Ionicons name={topic.icon} size={24} color={chakra.color} />
                  </View>
                  <View style={styles.topicTextContainer}>
                    <Text style={[styles.topicTitle, isExpanded && { color: chakra.color }]}>{topic.title}</Text>
                  </View>
                  <Ionicons 
                    name={topic.id === 'meditasyon' ? "arrow-forward" : (isExpanded ? "chevron-up" : "chevron-down")} 
                    size={20} 
                    color={topic.id === 'meditasyon' ? chakra.color : COLORS.textMuted} 
                  />
                </View>
                
                {isExpanded && renderExpandedContent(topic.id)}
              </BlurView>
            </TouchableOpacity>
          );
        })}

        <View style={styles.scrollFooter}>
          <Ionicons name="rose-outline" size={24} color={COLORS.primaryDark} />
        </View>
      </ScrollView>
    </SacredBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', paddingTop: 60, paddingHorizontal: SIZES.padding, paddingBottom: 20,
    borderBottomWidth: 1, borderBottomColor: 'rgba(212, 175, 55, 0.3)', backgroundColor: 'rgba(10, 15, 30, 0.5)',
  },
  backBtn: { padding: 8, marginRight: 10 },
  headerTitleContainer: { flex: 1 },
  title: {
    fontSize: 26, fontWeight: 'bold', textShadowColor: 'rgba(212, 175, 55, 0.2)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4,
  },
  subtitle: { fontSize: 14, color: COLORS.textMuted, fontStyle: 'italic', letterSpacing: 1 },
  scrollContent: { padding: SIZES.padding, paddingBottom: 40 },
  scrollFooter: { alignItems: 'center', marginTop: 30, opacity: 0.5 },
  topicWrapper: { marginBottom: 15, borderRadius: SIZES.radius, overflow: 'hidden' },
  topicCard: {
    padding: 15, borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  topicHeaderRow: {
    flexDirection: 'row', alignItems: 'center',
  },
  iconContainer: {
    width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 15, borderWidth: 1,
  },
  topicTextContainer: { flex: 1 },
  topicTitle: { color: COLORS.text, fontSize: 17, fontWeight: 'bold', marginBottom: 4, letterSpacing: 0.5 },
  topicDesc: { color: COLORS.primaryDark, fontSize: 13 },
  expandedContent: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(212, 175, 55, 0.2)'
  },
  contentText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  astrologyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 8,
  },
  astroBox: {
    flex: 1,
    backgroundColor: 'rgba(212, 175, 55, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  astroSymbol: {
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 4,
  },
  astroLabel: {
    fontSize: 9,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  astroValue: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  }
});
