import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, LayoutAnimation, Platform, UIManager, TextInput, KeyboardAvoidingView } from 'react-native';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '@/src/theme';
import { EMOTIONAL_DISEASES } from '@/src/data/emotionalDiseases';

const ESOTERIC_BG = { uri: 'https://mbqjklupfoqbcfxusigs.supabase.co/storage/v1/object/public/app-assets/images/backgrounds/esoteric_bg.png' };

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export default function RuhBedenScreen() {
  const router = useRouter();
  const [expandedSection, setExpandedSection] = useState<'akupunktur' | 'diseases' | null>(null);
  const [activeAkupunkturTab, setActiveAkupunkturTab] = useState<'cirak' | 'kalfa' | 'ustat'>('cirak');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleExpand = (section: 'akupunktur' | 'diseases') => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSection(expandedSection === section ? null : section);
    if (expandedSection !== section) {
      setSearchQuery('');
    }
  };

  const filteredDiseases = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return EMOTIONAL_DISEASES.filter(d => 
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      d.cause.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 20);
  }, [searchQuery]);

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ImageBackground source={ESOTERIC_BG} style={styles.container} resizeMode="cover">
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(10, 15, 30, 0.85)' }]} />
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={28} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ruh & Beden Sağlığı</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.introContainer}>
            <Ionicons name="leaf" size={40} color={COLORS.primary} style={{ marginBottom: 15 }} />
            <Text style={styles.introTitle}>Bütüncül Şifa Yolu</Text>
            <Text style={styles.introText}>
              İnsan bedensel, zihinsel ve ruhsal özellikleri açısından evrenle paralellik gösteren bir mikrokozmostur. Gerçek şifa, sadece fiziksel semptomları değil, ruhsal kökenleri de iyileştirmekle başlar.
            </Text>
          </View>

          {/* AKUPUNKTUR BÖLÜMÜ */}
          <TouchableOpacity 
            activeOpacity={0.8} 
            onPress={() => toggleExpand('akupunktur')}
            style={{ marginBottom: 15 }}
          >
            <BlurView intensity={20} tint="dark" style={[styles.ruleCard, { marginBottom: 0 }]}>
              <View style={[styles.ruleHeader, expandedSection !== 'akupunktur' && { marginBottom: 0 }]}>
                <View style={[styles.iconContainer, { backgroundColor: '#34C75915', borderColor: '#34C75940' }]}>
                  <Ionicons name="body-outline" size={22} color="#34C759" />
                </View>
                <Text style={[styles.ruleTitle, { color: COLORS.textMuted }]}>Akupunktur ve Enerji Meridyenleri</Text>
                <Ionicons name={expandedSection === 'akupunktur' ? "chevron-up" : "chevron-down"} size={20} color={COLORS.textMuted} />
              </View>
              
              {expandedSection === 'akupunktur' && (
                <View>
                  {/* TABS */}
                  <View style={styles.tabContainer}>
                    <TouchableOpacity 
                      style={[styles.tabBtn, activeAkupunkturTab === 'cirak' && styles.tabBtnActive]} 
                      onPress={() => setActiveAkupunkturTab('cirak')}
                    >
                      <Text style={[styles.tabText, activeAkupunkturTab === 'cirak' && styles.tabTextActive]}>1. Derece</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.tabBtn, activeAkupunkturTab === 'kalfa' && styles.tabBtnActive]} 
                      onPress={() => setActiveAkupunkturTab('kalfa')}
                    >
                      <Text style={[styles.tabText, activeAkupunkturTab === 'kalfa' && styles.tabTextActive]}>2. Derece</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.tabBtn, activeAkupunkturTab === 'ustat' && styles.tabBtnActive]} 
                      onPress={() => setActiveAkupunkturTab('ustat')}
                    >
                      <Text style={[styles.tabText, activeAkupunkturTab === 'ustat' && styles.tabTextActive]}>3. Derece</Text>
                    </TouchableOpacity>
                  </View>

                  {/* TAB CONTENT */}
                  {activeAkupunkturTab === 'cirak' && (
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

                  {activeAkupunkturTab === 'kalfa' && (
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

                  {activeAkupunkturTab === 'ustat' && (
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
                </View>
              )}
            </BlurView>
          </TouchableOpacity>

          {/* HASTALIKLARIN DUYGUSAL NEDENLERİ BÖLÜMÜ */}
          <TouchableOpacity 
            activeOpacity={0.8} 
            onPress={() => toggleExpand('diseases')}
            style={{ marginBottom: 15 }}
          >
            <BlurView intensity={20} tint="dark" style={[styles.ruleCard, { marginBottom: 0 }]}>
              <View style={[styles.ruleHeader, expandedSection !== 'diseases' && { marginBottom: 0 }]}>
                <View style={[styles.iconContainer, { backgroundColor: '#FF3B3015', borderColor: '#FF3B3040' }]}>
                  <Ionicons name="heart-half-outline" size={22} color="#FF3B30" />
                </View>
                <Text style={[styles.ruleTitle, { color: COLORS.textMuted }]}>Hastalıkların Duygusal Nedenleri</Text>
                <Ionicons name={expandedSection === 'diseases' ? "chevron-up" : "chevron-down"} size={20} color={COLORS.textMuted} />
              </View>
              
              {expandedSection === 'diseases' && (
                <View>
                  <Text style={styles.ruleContent}>
                    Ezoterik öğretilere göre her fiziksel rahatsızlığın kökeninde çözülmemiş bir duygusal veya zihinsel blokaj yatar. Beden, zihnin taşıyamadığı yükleri fiziksel bir dilde ifade eder. Şifa, ancak bu duygusal köklerin fark edilip serbest bırakılmasıyla tamamlanır.
                  </Text>
                  
                  <View style={styles.searchContainer}>
                    <View style={styles.searchInputContainer}>
                      <Ionicons name="search" size={20} color={COLORS.textMuted} style={styles.searchIcon} />
                      <TextInput
                        style={styles.searchInput}
                        placeholder="Hastalık ara... (Örn: Baş ağrısı, Mide)"
                        placeholderTextColor={COLORS.textMuted + '80'}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                      />
                      {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                          <Ionicons name="close-circle" size={20} color={COLORS.textMuted} />
                        </TouchableOpacity>
                      )}
                    </View>

                    {searchQuery.length > 0 && (
                      <View style={styles.resultsContainer}>
                        {filteredDiseases.length > 0 ? (
                          filteredDiseases.map((disease, i) => (
                            <View key={i} style={styles.diseaseCard}>
                              <Text style={styles.diseaseName}>{disease.name}</Text>
                              <View style={styles.diseaseRow}>
                                <Ionicons name="alert-circle-outline" size={16} color="#FF9500" style={styles.diseaseIcon} />
                                <Text style={styles.diseaseCause}>{disease.cause}</Text>
                              </View>
                              <View style={styles.diseaseRow}>
                                <Ionicons name="heart-circle-outline" size={16} color="#34C759" style={styles.diseaseIcon} />
                                <Text style={styles.diseaseAffirmation}>{disease.affirmation}</Text>
                              </View>
                            </View>
                          ))
                        ) : (
                          <Text style={styles.noResultText}>Sonuç bulunamadı.</Text>
                        )}
                      </View>
                    )}
                  </View>
                </View>
              )}
            </BlurView>
          </TouchableOpacity>
        
          <View style={{ height: 40 }} />
        </ScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
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
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: SIZES.radius - 2,
  },
  tabBtnActive: {
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
  },
  tabText: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  tabTextActive: {
    color: COLORS.primary,
  },
  tabContentContainer: {
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
  },
  highlightBox: {
    backgroundColor: 'rgba(212, 175, 55, 0.05)',
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
    padding: 15,
    borderRadius: 5,
    marginTop: 15,
  },
  methodExample: {
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 24,
  },
  searchContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    paddingTop: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: SIZES.radius,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 15,
  },
  resultsContainer: {
    marginTop: 15,
  },
  diseaseCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: SIZES.radius,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  diseaseName: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  diseaseRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  diseaseIcon: {
    marginTop: 2,
    marginRight: 8,
  },
  diseaseCause: {
    color: COLORS.text,
    fontSize: 13,
    lineHeight: 20,
    flex: 1,
  },
  diseaseAffirmation: {
    color: '#34C759',
    fontSize: 13,
    lineHeight: 20,
    fontStyle: 'italic',
    flex: 1,
  },
  noResultText: {
    color: COLORS.textMuted,
    textAlign: 'center',
    padding: 20,
    fontStyle: 'italic',
  }
});
