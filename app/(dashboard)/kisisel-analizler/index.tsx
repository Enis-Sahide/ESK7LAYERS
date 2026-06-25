import SacredBackground from '@/components/SacredBackground';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '@/src/theme';

const ESOTERIC_BG = require('@/assets/images/esoteric_bg_indigo.webp');

interface AnalysisTool {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  color: string;
  isAvailable: boolean;
}

const ANALYSIS_TOOLS: AnalysisTool[] = [
  { 
    id: 'numeroloji', 
    title: 'Numeroloji Analizi', 
    description: 'İsim ve doğum tarihinizle detaylı analiz veya sadece doğum tarihinizle Pisagor Sayısal Titreşimlerinizi analiz edin.',
    icon: 'infinite-outline', 
    route: '/(dashboard)/kisisel-analizler/numeroloji',
    color: '#FFCC00',
    isAvailable: true
  },
  { 
    id: 'humandesign', 
    title: 'Human Design Vücut Grafiği', 
    description: 'Doğum saati ve konumunuza göre enerji tipinizi, otoritenizi ve stratejinizi keşfedin.',
    icon: 'body-outline', 
    route: '/(dashboard)/kisisel-analizler/human-design',
    color: '#32ADE6',
    isAvailable: true
  },
  { 
    id: 'astroloji', 
    title: 'Astrolojik Doğum Haritası', 
    description: 'Gezegenlerin doğum anınızdaki konumlarıyla ruhunuzun kozmik planını analiz edin.',
    icon: 'planet-outline', 
    route: '/(dashboard)/kisisel-analizler/astroloji',
    color: '#FF9500',
    isAvailable: true
  },
  { 
    id: 'anlikgokyuzu', 
    title: 'Anlık Gökyüzü (Transit)', 
    description: 'Şu anki gökyüzü konumlarını ve doğum haritanızla olan transit etkileşimlerini analiz edin.',
    icon: 'telescope-outline', 
    route: '/(dashboard)/kisisel-analizler/anlik-gokyuzu',
    color: '#AF52DE',
    isAvailable: true
  },
  { 
    id: 'chakraanalysis', 
    title: 'Çakra Analizi', 
    description: 'Doğum haritanız ve çakra enerjileriniz arasındaki ilişkiyi analiz edin ve blokajları keşfedin.',
    icon: 'scan-circle-outline', 
    route: '/(dashboard)/chakra-analysis',
    color: '#FF3B30',
    isAvailable: true
  }
];

export default function AnalysisHubScreen() {
  const router = useRouter();

  return (
    <SacredBackground>

      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={28} color={COLORS.primary} />
        </TouchableOpacity>
        <View style={{alignItems: 'center'}}>
          <Text style={styles.headerTitle}>Analizler</Text>
          <Text style={styles.headerSubtitle}>Kendini Bilme Yolculuğu</Text>
        </View>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {ANALYSIS_TOOLS.map((tool) => (
          <TouchableOpacity 
            key={tool.id} 
            style={[styles.toolCard, !tool.isAvailable && { opacity: 0.6 }]} 
            onPress={() => tool.isAvailable ? router.push(tool.route as any) : null}
            activeOpacity={0.8}
            disabled={!tool.isAvailable}
          >
            <View style={[styles.iconContainer, { backgroundColor: tool.color + '20', borderColor: tool.color }]}>
              <Ionicons name={tool.icon} size={28} color={tool.color} />
            </View>
            <View style={styles.cardContent}>
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <Text style={[styles.cardTitle, { color: tool.color }]}>{tool.title}</Text>
                {!tool.isAvailable && (
                  <View style={styles.soonBadge}>
                    <Text style={styles.soonText}>Yakında</Text>
                  </View>
                )}
              </View>
              <Text style={styles.cardDesc}>{tool.description}</Text>
            </View>
            
            {tool.isAvailable && (
              <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} style={{ marginLeft: 10 }} />
            )}
          </TouchableOpacity>
        ))}
        <View style={{height: 100}} />
      </ScrollView>
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
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary },
  headerSubtitle: { fontSize: 12, color: COLORS.textMuted, marginTop: 4 },
  scrollContent: { padding: 20 },
  toolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(10, 10, 10, 0.7)',
    borderRadius: SIZES.radius,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
  soonBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  soonText: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: 'bold',
  }
});
