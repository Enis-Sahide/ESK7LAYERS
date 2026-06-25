import SacredBackground from '@/components/SacredBackground';
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, LayoutAnimation, Platform, UIManager, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { COLORS, SIZES } from '@/src/theme';
import { useProgress } from '../../../src/context/ProgressContext';
import { useContent } from '@/src/core/content/useContent';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const getImageSource = (img: any) => {
  if (!img) return null;
  if (typeof img === 'string') return { uri: img };
  if (img.uri) return { uri: img.uri };
  return img;
};

export default function RuneCurriculumScreen() {
  const router = useRouter();
  const { hasAccess, isAdmin } = useProgress();
  const [activeTab, setActiveTab] = useState<'cirak' | 'kalfa' | 'ustat'>('cirak');

  const isKalfaUnlocked = hasAccess('rune_2') || isAdmin;
  const isUstatUnlocked = hasAccess('rune_3') || isAdmin;

  const { data: runesData } = useContent<any[]>('/api/content/runes');
  const { data: bindingsData } = useContent<any[]>('/api/content/rune-bindings');

  const handleTabPress = (tab: 'cirak' | 'kalfa' | 'ustat') => {
    if (tab === 'kalfa' && !isKalfaUnlocked) {
      return;
    }
    if (tab === 'ustat' && !isUstatUnlocked) {
      return;
    }
    setActiveTab(tab);
  };

  return (
    <SacredBackground>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={28} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rune Tılsımları</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Tab Menüsü */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabBtn, activeTab === 'cirak' && styles.tabBtnActive]} 
            onPress={() => handleTabPress('cirak')}
          >
            <Text style={[styles.tabText, activeTab === 'cirak' && styles.tabTextActive]}>1. Derece</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabBtn, activeTab === 'kalfa' && styles.tabBtnActive, !isKalfaUnlocked && { opacity: 0.5 }]} 
            onPress={() => handleTabPress('kalfa')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {!isKalfaUnlocked && <Ionicons name="lock-closed" size={14} color="#9CA3AF" style={{ marginRight: 5 }} />}
              <Text style={[styles.tabText, activeTab === 'kalfa' && styles.tabTextActive]}>2. Derece</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabBtn, activeTab === 'ustat' && styles.tabBtnActive, !isUstatUnlocked && { opacity: 0.5 }]} 
            onPress={() => handleTabPress('ustat')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {!isUstatUnlocked && <Ionicons name="lock-closed" size={14} color="#9CA3AF" style={{ marginRight: 5 }} />}
              <Text style={[styles.tabText, activeTab === 'ustat' && styles.tabTextActive]}>3. Derece</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* 1. DERECE (SEMBOLLER) */}
        {activeTab === 'cirak' && (
          <View>
            <BlurView intensity={30} tint="dark" style={styles.introCard}>
              <Ionicons name="diamond-outline" size={40} color={COLORS.primary} style={{ marginBottom: 15 }} />
              <Text style={styles.introTitle}>ᚠ - Elder Futhark Sembolleri</Text>
              <Text style={styles.introText}>
                Kadim bilgelerin kayalara kazıdığı bu sırlar, yalnızca frekansı doğru okuyan gözlere fısıldar. 24 Elder Futhark sembolünün kozmik sırrını, elementlerini ve şifalarını keşfet.
              </Text>
            </BlurView>

            {(runesData ?? []).map((rune: any) => (
              <BlurView intensity={30} tint="dark" style={styles.runeCard} key={rune.id || rune.name}>
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
                  {rune.stone && (
                    <View style={styles.metaBadge}>
                      <Ionicons name="diamond-outline" size={12} color={COLORS.primary} style={{marginRight: 4}} />
                      <Text style={styles.metaText}>{rune.stone}</Text>
                    </View>
                  )}
                  {rune.astrology && (
                    <View style={styles.metaBadge}>
                      <Ionicons name="planet-outline" size={12} color={COLORS.primary} style={{marginRight: 4}} />
                      <Text style={styles.metaText}>{rune.astrology}</Text>
                    </View>
                  )}
                  {rune.plant && (
                    <View style={styles.metaBadge}>
                      <Ionicons name="leaf-outline" size={12} color={COLORS.primary} style={{marginRight: 4}} />
                      <Text style={styles.metaText}>{rune.plant}</Text>
                    </View>
                  )}
                  {rune.animal && (
                    <View style={styles.metaBadge}>
                      <Ionicons name="paw-outline" size={12} color={COLORS.primary} style={{marginRight: 4}} />
                      <Text style={styles.metaText}>{rune.animal}</Text>
                    </View>
                  )}
                  {rune.mythology && (
                    <View style={styles.metaBadge}>
                      <Ionicons name="book-outline" size={12} color={COLORS.primary} style={{marginRight: 4}} />
                      <Text style={styles.metaText}>{rune.mythology}</Text>
                    </View>
                  )}
                  {(rune.polarite || rune.polarity) && (
                    <View style={styles.metaBadge}>
                      <Ionicons name="male-female-outline" size={12} color={COLORS.primary} style={{marginRight: 4}} />
                      <Text style={styles.metaText}>{rune.polarite || rune.polarity}</Text>
                    </View>
                  )}
                  {rune.tarot && (
                    <View style={styles.metaBadge}>
                      <Ionicons name="star-outline" size={12} color={COLORS.primary} style={{marginRight: 4}} />
                      <Text style={styles.metaText}>{rune.tarot}</Text>
                    </View>
                  )}
                </View>
              </BlurView>
            ))}
          </View>
        )}

        {/* 2. DERECE (BAĞLAMALAR) */}
        {activeTab === 'kalfa' && (
          <View>
            <BlurView intensity={30} tint="dark" style={styles.introCard}>
              <Ionicons name="layers-outline" size={40} color={COLORS.primary} style={{ marginBottom: 15 }} />
              <Text style={styles.introTitle}>Rune Bağlamaları (Bindrunes)</Text>
              <Text style={styles.introText}>
                Frekansların birbiriyle dansı, tek bir sembolün gücünü kozmik bir şifaya dönüştürür. Uyumlanmış semboller, niyetle birleştiğinde evrenin en güçlü tılsımlarını yaratır.
              </Text>
            </BlurView>

            {(bindingsData ?? []).map((binding: any) => (
              <BlurView intensity={30} tint="dark" style={styles.runeCard} key={binding.id || binding.title}>
                <View style={styles.runeHeader}>
                  <Ionicons name="layers-outline" size={24} color={COLORS.primary} style={{marginRight: 10}}/>
                  <Text style={styles.runeName}>{binding.title}</Text>
                </View>
                
                {binding.image && (
                  <View style={styles.imageContainer}>
                    <Image source={getImageSource(binding.image)} style={styles.bindingImage} resizeMode="contain" />
                  </View>
                )}

                <Text style={styles.meaningText}>{binding.description}</Text>
                
                <View style={styles.divider} />
                
                <View style={styles.symbolsBadge}>
                  <Text style={styles.symbolsText}>{binding.runesUsed}</Text>
                </View>

                <Text style={styles.usageTitle}>Ritüel Uygulaması:</Text>
                <Text style={styles.usageText}>{binding.usageInstructions}</Text>
              </BlurView>
            ))}
          </View>
        )}

        {/* 3. DERECE (ÜSTAT) */}
        {activeTab === 'ustat' && (
          <BlurView intensity={30} tint="dark" style={[styles.introCard, { paddingVertical: 40, alignItems: 'center' }]}>
            <Ionicons name="lock-closed" size={48} color={COLORS.primary} style={{ marginBottom: 15 }} />
            <Text style={styles.introTitle}>Mistik Bilgi Kilitli</Text>
            <Text style={styles.introText}>
              Bu ilmin Üstatlık derecesi henüz aktarılmamıştır. Tapınaktaki çalışmalarınıza devam edin.
            </Text>
          </BlurView>
        )}

        <View style={{height: 50}}/>
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
  scrollContent: { padding: SIZES.padding },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 4,
    marginBottom: 30,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabBtnActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    color: '#9CA3AF',
    fontWeight: '600',
    fontSize: 14,
  },
  tabTextActive: {
    color: '#0B0F19',
    fontWeight: 'bold',
  },
  introCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    marginBottom: 30,
    overflow: 'hidden',
  },
  introTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E0E0E0',
    marginBottom: 10,
  },
  introText: {
    fontSize: 15,
    color: '#9CA3AF',
    lineHeight: 24,
  },
  runeCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#E0E0E0',
  },
  elementBadge: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: 'bold',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  meaningText: {
    fontSize: 15,
    color: '#E0E0E0',
    lineHeight: 24,
    marginBottom: 15,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 15,
  },
  usageTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 5,
  },
  usageText: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 22,
    marginBottom: 15,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  metaText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  bindingImage: {
    width: '90%',
    height: '90%',
  },
  symbolsBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  symbolsText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
});
