import SacredBackground from '@/components/SacredBackground';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '@/src/theme';
import { useProgress } from '@/src/context/ProgressContext';

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
    id: 'kabalistik4alem', 
    title: 'Kabalistik 4 Alem', 
    description: 'Sefirot ağacındaki kadersel sıçrama noktalarınızı bulun.',
    icon: 'moon-outline', 
    route: '/(dashboard)/kisisel-analizler/kabalistik-4-alem',
    color: '#D4AF37',
    isAvailable: true
  },
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
  const { role, isAdmin } = useProgress();
  const isMasterOrAdmin = role === 'master' || role === 'admin' || isAdmin;

  const handlePress = (tool: AnalysisTool) => {
    if (!tool.isAvailable) return;
    
    if (tool.id === 'kabalistik4alem' && !isMasterOrAdmin) {
      Alert.alert(
        "Ustalık Derecesi Gerekli",
        "Kabalistik 4 Alem analizine erişebilmek için Usta seviyesinde olmalısınız. Seviye atlamak için lütfen sınavlarınızı tamamlayın."
      );
      return;
    }
    
    router.push(tool.route as any);
  };

  return (
    <SacredBackground>
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
