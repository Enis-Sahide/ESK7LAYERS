import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { COLORS, SIZES } from '@/src/theme';
import { runeBindings } from '@/src/data/runeLessons';

const ESOTERIC_BG = require('@/assets/images/backgrounds/esoteric_bg.png');

export default function Rune2Screen() {
  const router = useRouter();

  return (
    <ImageBackground source={ESOTERIC_BG} style={styles.container} resizeMode="cover">
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(10, 15, 30, 0.85)' }]} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={28} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rune Bağlamaları</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.introText}>
          Frekansların birbiriyle dansı, tek bir sembolün gücünü kozmik bir şifaya dönüştürür. Uyumlanmış semboller, niyetle birleştiğinde evrenin en güçlü tılsımlarını yaratır.
        </Text>
        
        {runeBindings.map((binding) => (
          <BlurView intensity={30} tint="dark" style={styles.runeCard} key={binding.id}>
            <View style={styles.runeHeader}>
              <Ionicons name="layers-outline" size={24} color={COLORS.primary} style={{marginRight: 10}}/>
              <Text style={styles.runeName}>{binding.title}</Text>
            </View>
            
            {binding.image && (
              <View style={styles.imageContainer}>
                <Image source={binding.image} style={styles.bindingImage} resizeMode="contain" />
              </View>
            )}

            <Text style={styles.meaningText}>{binding.description}</Text>
            
            <View style={styles.divider} />
            
            <Text style={styles.usageTitle}>Kullanılan Semboller:</Text>
            <View style={styles.symbolsBadge}>
              <Text style={styles.symbolsText}>{binding.runesUsed}</Text>
            </View>

            <Text style={styles.usageTitle}>Ritüel Uygulaması:</Text>
            <Text style={styles.usageText}>{binding.usageInstructions}</Text>
          </BlurView>
        ))}

        <View style={{height: 50}}/>
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
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.2)',
    zIndex: 10,
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
    padding: 20,
  },
  introText: {
    fontSize: 16,
    color: COLORS.text,
    fontStyle: 'italic',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 30,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  runeCard: {
    padding: 20,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    marginBottom: 20,
    overflow: 'hidden',
  },
  runeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  runeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    flex: 1,
  },
  meaningText: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 24,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    marginVertical: 15,
  },
  usageTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
    marginBottom: 8,
    marginTop: 5,
  },
  symbolsBadge: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 15,
  },
  symbolsText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    letterSpacing: 1,
  },
  usageText: {
    fontSize: 14,
    color: COLORS.textMuted,
    lineHeight: 22,
  },
  imageContainer: {
    width: '100%',
    height: 180,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    marginBottom: 15,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  bindingImage: {
    width: '100%',
    height: '100%',
  }
});
