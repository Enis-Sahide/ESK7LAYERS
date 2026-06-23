import SacredBackground from '@/components/SacredBackground';
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, LayoutAnimation, Platform, UIManager } from 'react-native';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { COLORS, SIZES } from '@/src/theme';
import { useContent } from '@/src/core/content/useContent';

const ESOTERIC_BG = require('@/assets/images/esoteric_bg_indigo.webp');

// DB'deki guidelines lucide ikon adlarını kullanır → Ionicons adına eşle.
const ICON_MAP: Record<string, any> = {
  'arrow-up': 'arrow-up-outline',
  leaf: 'leaf-outline',
  droplet: 'water-outline',
  infinity: 'infinite-outline',
  'cup-soda': 'pint-outline',
  'shield-check': 'shield-checkmark-outline',
  utensils: 'restaurant-outline',
  smartphone: 'phone-portrait-outline',
};

export default function ChakraGuidelinesScreen() {
  const router = useRouter();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const { data: guidelinesData } = useContent<any[]>('/api/content/guidelines');
  const GUIDELINES = guidelinesData ?? [];

  const toggleExpand = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <SacredBackground>

      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={28} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Önemli Hususlar</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.introContainer}>
          <Ionicons name="warning" size={40} color="#FFD700" style={{ marginBottom: 10 }} />
          <Text style={styles.introTitle}>Çakra Çalışması Disiplini</Text>
          <Text style={styles.introText}>
            Enerji merkezleriyle çalışmak son derece güçlü bir dönüşüm sürecidir. 
            Bu uyanış yolculuğunda zarar görmemek ve ruhsal dengenizi korumak için 
            aşağıdaki kadim kurallara sıkı sıkıya uymanız önerilir.
          </Text>
        </View>

        {GUIDELINES.map((item, index) => {
          const isExpanded = expandedIndex === index;
          return (
            <TouchableOpacity 
              key={index} 
              activeOpacity={0.8} 
              onPress={() => toggleExpand(index)}
              style={{ marginBottom: 15 }}
            >
              <BlurView intensity={20} tint="dark" style={[styles.ruleCard, { marginBottom: 0 }]}>
                <View style={[styles.ruleHeader, !isExpanded && { marginBottom: 0 }]}>
                  <View style={[styles.iconContainer, { backgroundColor: item.color + '15', borderColor: item.color + '40' }]}>
                    <Ionicons name={(ICON_MAP[item.icon] ?? 'ellipse-outline') as any} size={22} color={item.color} />
                  </View>
                  <Text style={[styles.ruleTitle, { color: COLORS.textMuted }]}>{item.title}</Text>
                  <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={20} color={COLORS.textMuted} />
                </View>
                {isExpanded && (
                  <Text style={styles.ruleContent}>{item.content}</Text>
                )}
              </BlurView>
            </TouchableOpacity>
          );
        })}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SacredBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  backBtn: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  scrollContent: {
    padding: SIZES.padding,
  },
  introContainer: {
    alignItems: 'center',
    marginBottom: 30,
    padding: 20,
    backgroundColor: 'rgba(212, 175, 55, 0.05)',
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  introTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 10,
    textAlign: 'center',
  },
  introText: {
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  ruleCard: {
    padding: 20,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 15,
    overflow: 'hidden',
  },
  ruleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  ruleTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
  },
  ruleContent: {
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 22,
  }
});
