import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '@/src/theme';

const ESOTERIC_BG = require('@/assets/images/esoteric_bg_indigo.png');

export default function AkupunkturScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'cirak' | 'kalfa' | 'ustat'>('cirak');

  return (
    <ImageBackground source={ESOTERIC_BG} style={styles.container} resizeMode="cover">
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(10, 15, 30, 0.85)' }]} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={28} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Akupunktur ve Meridyenler</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.introContainer}>
          <Ionicons name="body-outline" size={40} color="#34C759" style={{ marginBottom: 15 }} />
          <Text style={styles.introTitle}>Enerji Kanalları (Chi)</Text>
          <Text style={styles.introText}>
            Bedenimizdeki görünmez enerji otoyolları olan meridyenler, yaşam gücümüzün (Chi) akışını sağlar. Bu akış tıkandığında hastalıklar başlar.
          </Text>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabBtn, activeTab === 'cirak' && styles.tabBtnActive]} 
            onPress={() => setActiveTab('cirak')}
          >
            <Text style={[styles.tabText, activeTab === 'cirak' && styles.tabTextActive]}>1. Derece</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabBtn, activeTab === 'kalfa' && styles.tabBtnActive]} 
            onPress={() => setActiveTab('kalfa')}
          >
            <Text style={[styles.tabText, activeTab === 'kalfa' && styles.tabTextActive]}>2. Derece</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabBtn, activeTab === 'ustat' && styles.tabBtnActive]} 
            onPress={() => setActiveTab('ustat')}
          >
            <Text style={[styles.tabText, activeTab === 'ustat' && styles.tabTextActive]}>3. Derece</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'cirak' && (
          <View style={styles.tabContentContainer}>
            <Text style={styles.sectionTitle}>Çıraklık: Temel Şifa Enerjisi</Text>
            <Text style={styles.ruleContent}>
              Akupunktur, bedenin yaşam enerjisi (Chi veya Prana) akışını dengelemeye dayanan binlerce yıllık kadim bir şifa yöntemidir.
            </Text>
            <View style={styles.highlightBox}>
              <Text style={styles.methodExample}>
                • <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Chi (Yaşam Enerjisi):</Text> Evreni ve bedeni canlı tutan evrensel frekanstır.{"\n"}
                • <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Yin ve Yang:</Text> Bedenimizdeki organlar zıt kutupların (Eril/Dişil, Ateş/Su, Sıcak/Soğuk) dengesiyle çalışır. Hastalık, bu dengenin bozulmasıdır.{"\n"}
                • <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Meridyenler:</Text> Chi enerjisinin içinde aktığı nehirlerdir.
              </Text>
            </View>
          </View>
        )}

        {activeTab === 'kalfa' && (
          <View style={styles.tabContentContainer}>
            <Text style={styles.sectionTitle}>Kalfalık: 12 Ana Meridyen</Text>
            <Text style={styles.ruleContent}>
              Ezoterik anatomiye göre bedenimizde organlara bağlı 12 Ana Meridyen bulunur. Her organ sadece kan pompalamaz, aynı zamanda bir duyguyu da depolar.
            </Text>
            <View style={styles.highlightBox}>
              <Text style={styles.methodExample}>
                • <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Akciğer Meridyeni:</Text> Keder, yas ve üzüntüyü barındırır.{"\n"}
                • <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Karaciğer Meridyeni:</Text> Öfke, nefret ve hayal kırıklığının merkezidir.{"\n"}
                • <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Böbrek Meridyeni:</Text> Derin korkuları ve fobileri depolar. Yaşam enerjisinin bataryasıdır.{"\n"}
                • <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Mide Meridyeni:</Text> Yeni olayları, durumları ve fikirleri sindirememe, uzun süreli endişeleri tutar.{"\n"}
                • <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Kalp Meridyeni:</Text> Neşe, sevgi ve ruhun (Shen) tahtıdır. Katılaşmış kalp, kriz yaratır.
              </Text>
            </View>
          </View>
        )}

        {activeTab === 'ustat' && (
          <View style={styles.tabContentContainer}>
            <Text style={styles.sectionTitle}>Üstatlık: Düğümleri Çözmek</Text>
            <Text style={styles.ruleContent}>
              Hastalıklar, enerjinin (Chi) kanallarda duygusal travmalarla tıkanması sonucu oluşur. Akupunktur noktaları, bu tıkanıklıkların açıldığı, nehrin akışının tekrar sağlandığı enerji düğümleridir.
            </Text>
            <View style={styles.highlightBox}>
              <Text style={styles.methodExample}>
                • <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Yönetici Meridyenler:</Text> Ren Mai (Kavrama) ve Du Mai (Yönetme) kanalları omurga ve ön hattan geçerek tüm çakraları birbirine bağlar.{"\n"}
                • <Text style={{fontWeight: 'bold', color: COLORS.primary}}>İğnelerin Sırrı:</Text> İğneler (veya akupresür noktalarına yapılan niyetli basılar), sinir sistemine şok vererek biriken öfke ve kederi serbest bırakır.{"\n"}
                • <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Hücresel Hafıza:</Text> Bedene atılan kördüğümler, bilinçli yüzleşme ve affetme ritüeli ile fiziksel olarak çözülür. Şifa, organın frekansının tekrar evrenle uyumlanmasıdır.
              </Text>
            </View>
          </View>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </ImageBackground>
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
  backBtn: { padding: 5, backgroundColor: 'rgba(212, 175, 55, 0.1)', borderRadius: 12 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary },
  scrollContent: { padding: SIZES.padding },
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
    color: COLORS.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  introText: {
    color: COLORS.textMuted,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: SIZES.radius,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: SIZES.radius - 2 },
  tabBtnActive: { backgroundColor: 'rgba(212, 175, 55, 0.2)' },
  tabText: { color: COLORS.textMuted, fontSize: 13, fontWeight: '600' },
  tabTextActive: { color: COLORS.primary },
  tabContentContainer: { marginTop: 5 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary, marginBottom: 10 },
  ruleContent: { color: COLORS.text, fontSize: 14, lineHeight: 22 },
  highlightBox: {
    backgroundColor: 'rgba(212, 175, 55, 0.05)',
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
    padding: 15,
    borderRadius: 5,
    marginTop: 15,
  },
  methodExample: { color: COLORS.text, fontSize: 14, lineHeight: 24 },
});
