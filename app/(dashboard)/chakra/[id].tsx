import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES } from '@/src/theme';
import { ImageBackground } from 'react-native';

const ESOTERIC_BG = require('@/assets/images/backgrounds/esoteric_bg.png');

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

// Çakra Eğitim Rehberi Başlıkları
const TOPICS = [
  { id: 'nedir', title: 'Çakra Hakkında & Tıkanıklıklar', icon: 'information-circle-outline' },
  { id: 'meditasyon', title: 'Aktivasyon ve Meditasyon', icon: 'body-outline' },
  { id: 'dengeleme', title: 'Şifa ve Dengeleme Rehberi', icon: 'leaf-outline' },
  { id: 'tasavvuf', title: 'Sufizm ve Nefs Mertebesi', icon: 'book-outline' },
  { id: 'sentez', title: 'Tamamlayıcı', icon: 'infinite-outline' },
];

export default function ChakraDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const chakra = CHAKRAS[id as keyof typeof CHAKRAS];

  if (!chakra) {
    return (
      <View style={styles.container}>
        <Text style={{color: 'white'}}>Çakra bulunamadı.</Text>
      </View>
    );
  }

  return (
    <ImageBackground 
      source={ESOTERIC_BG}
      style={styles.container}
      resizeMode="cover"
    >
      {/* Merkezde Renk, Köşelere Doğru Şeffaf (Soft Glow) */}
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
      
      {/* Kenarları karanlık, merkezi aydınlık tutan yarı saydam koruyucu filtre ve Cam Efekti */}
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

        {TOPICS.map((topic: any) => (
          <TouchableOpacity 
            key={topic.id} 
            style={styles.topicWrapper}
            onPress={() => router.push(`/lesson/${topic.id}?chakraId=${id}`)}
          >
            <BlurView intensity={30} tint="dark" style={styles.topicCard}>
              <View style={[styles.iconContainer, { backgroundColor: chakra.color + '20', borderColor: chakra.color }]}>
                <Ionicons name={topic.icon} size={24} color={chakra.color} />
              </View>
              <View style={styles.topicTextContainer}>
                <Text style={styles.topicTitle}>{topic.title}</Text>
                <Text style={styles.topicDesc}>Seviye {id} Öğretileri</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
            </BlurView>
          </TouchableOpacity>
        ))}

        <View style={styles.scrollFooter}>
          <Ionicons name="rose-outline" size={24} color={COLORS.primaryDark} />
        </View>
        
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
    paddingHorizontal: SIZES.padding,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.3)',
    backgroundColor: 'rgba(10, 15, 30, 0.5)',
  },
  backBtn: {
    padding: 8,
    marginRight: 10,
  },
  headerTitleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textShadowColor: 'rgba(212, 175, 55, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    fontStyle: 'italic',
    letterSpacing: 1,
  },
  scrollContent: {
    padding: SIZES.padding,
    paddingBottom: 40,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    marginTop: 15,
  },
  progressNode: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  progressLine: {
    width: 35,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  progressText: {
    color: COLORS.primaryDark,
    textAlign: 'center',
    fontSize: 13,
    marginBottom: 20,
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
  scrollFooter: {
    alignItems: 'center',
    marginTop: 30,
    opacity: 0.5,
  },
  infoText: {
    color: COLORS.text,
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 35,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  topicWrapper: {
    marginBottom: 15,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
  },
  topicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 1,
  },
  topicTextContainer: {
    flex: 1,
  },
  topicTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  topicDesc: {
    color: COLORS.primaryDark,
    fontSize: 13,
  }
});
