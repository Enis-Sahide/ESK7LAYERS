import SacredBackground from '@/components/SacredBackground';
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { COLORS, SIZES } from '@/src/theme';
import { runeSymbols } from '@/src/data/runeLessons';

const ESOTERIC_BG = require('@/assets/images/esoteric_bg_indigo.png');

export default function Rune1Screen() {
  const router = useRouter();

  return (
    <SacredBackground>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={28} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rune Sembolleri</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.introText}>
          Kadim bilgelerin kayalara kazıdığı bu sırlar, yalnızca frekansı doğru okuyan gözlere fısıldar. 24 Elder Futhark sembolünün kozmik sırrını, elementlerini ve şifalarını keşfet.
        </Text>
        
        {runeSymbols.map((rune) => (
          <BlurView intensity={30} tint="dark" style={styles.runeCard} key={rune.id}>
            <View style={styles.runeHeader}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.runeName}>{rune.name}</Text>
                <Text style={{fontSize: 42, color: COLORS.primary, marginLeft: 12, fontWeight: '400'}}>{rune.symbol}</Text>
              </View>
              <Text style={styles.elementBadge}>{rune.element}</Text>
            </View>
            <Text style={styles.meaningText}>{rune.meaning}</Text>
            
            <View style={styles.divider} />
            
            <Text style={styles.usageTitle}>Ritüel ve Tılsım Kullanımı:</Text>
            <Text style={styles.usageText}>{rune.usage}</Text>

            {rune.ritual && (
              <>
                <Text style={styles.usageTitle}>Rune'un Mesajı:</Text>
                <Text style={styles.usageText}>{rune.ritual}</Text>
              </>
            )}
            
            <View style={styles.metaContainer}>
              <View style={styles.metaBadge}>
                <Ionicons name="diamond-outline" size={12} color={COLORS.primaryDark} style={{marginRight: 4}} />
                <Text style={styles.metaText}>{rune.stone}</Text>
              </View>
              <View style={styles.metaBadge}>
                <Ionicons name="planet-outline" size={12} color={COLORS.primaryDark} style={{marginRight: 4}} />
                <Text style={styles.metaText}>{rune.astrology}</Text>
              </View>
              <View style={styles.metaBadge}>
                <Ionicons name="leaf-outline" size={12} color={COLORS.primaryDark} style={{marginRight: 4}} />
                <Text style={styles.metaText}>{rune.plant}</Text>
              </View>
              <View style={styles.metaBadge}>
                <Ionicons name="paw-outline" size={12} color={COLORS.primaryDark} style={{marginRight: 4}} />
                <Text style={styles.metaText}>{rune.animal}</Text>
              </View>
              <View style={styles.metaBadge}>
                <Ionicons name="book-outline" size={12} color={COLORS.primaryDark} style={{marginRight: 4}} />
                <Text style={styles.metaText}>{rune.mythology}</Text>
              </View>
              <View style={styles.metaBadge}>
                <Ionicons name="male-female-outline" size={12} color={COLORS.primaryDark} style={{marginRight: 4}} />
                <Text style={styles.metaText}>{rune.polarite || rune.polarity}</Text>
              </View>
              <View style={styles.metaBadge}>
                <Ionicons name="star-outline" size={12} color={COLORS.primaryDark} style={{marginRight: 4}} />
                <Text style={styles.metaText}>{rune.tarot}</Text>
              </View>
            </View>
          </BlurView>
        ))}
        <View style={{height: 50}}/>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  runeName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    letterSpacing: 2,
  },
  elementBadge: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    color: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.6)',
    overflow: 'hidden',
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
  },
  usageText: {
    fontSize: 14,
    color: COLORS.textMuted,
    lineHeight: 22,
    marginBottom: 15,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  metaText: {
    fontSize: 12,
    color: COLORS.text,
  }
});
