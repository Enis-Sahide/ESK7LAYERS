import SacredBackground from '@/components/SacredBackground';
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, UIManager } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { COLORS, SIZES } from '@/src/theme';
import { useProgress } from '../../../src/context/ProgressContext';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function SembolizmCurriculumScreen() {
  const router = useRouter();
  const { hasAccess, isAdmin } = useProgress();
  const [activeTab, setActiveTab] = useState<'cirak' | 'kalfa' | 'ustat'>('cirak');

  const isKalfaUnlocked = hasAccess('sembolizm_2') || isAdmin;
  const isUstatUnlocked = hasAccess('sembolizm_3') || hasAccess('sembolizm_master') || isAdmin;

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
        <Text style={styles.headerTitle}>Kadim Sembolizm</Text>
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

        {/* 1. DERECE */}
        {activeTab === 'cirak' && (
          <BlurView intensity={30} tint="dark" style={styles.introCard}>
            <Ionicons name="shapes-outline" size={40} color={COLORS.primary} style={{ marginBottom: 15 }} />
            <Text style={styles.introTitle}>1. Derece: Çıraklık</Text>
            <Text style={styles.introText}>
              Bu seviyeye ait ders içeriği henüz eklenmemiştir. Sırların açığa çıkacağı zamanı bekleyin.
            </Text>
          </BlurView>
        )}

        {/* 2. DERECE */}
        {activeTab === 'kalfa' && isKalfaUnlocked && (
          <BlurView intensity={30} tint="dark" style={styles.introCard}>
            <Ionicons name="shapes-outline" size={40} color={COLORS.primary} style={{ marginBottom: 15 }} />
            <Text style={styles.introTitle}>2. Derece: Kalfalık</Text>
            <Text style={styles.introText}>
              Bu seviyeye ait ders içeriği henüz eklenmemiştir. Sırların açığa çıkacağı zamanı bekleyin.
            </Text>
          </BlurView>
        )}

        {/* 3. DERECE */}
        {activeTab === 'ustat' && isUstatUnlocked && (
          <BlurView intensity={30} tint="dark" style={styles.introCard}>
            <Ionicons name="shapes-outline" size={40} color={COLORS.primary} style={{ marginBottom: 15 }} />
            <Text style={styles.introTitle}>3. Derece: Üstatlık</Text>
            <Text style={styles.introText}>
              Bu seviyeye ait ders içeriği henüz eklenmemiştir. Sırların açığa çıkacağı zamanı bekleyin.
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
});
