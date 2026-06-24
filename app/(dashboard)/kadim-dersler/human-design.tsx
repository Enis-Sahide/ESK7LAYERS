import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Image, LayoutAnimation, Platform, UIManager } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useProgress } from '../../../src/context/ProgressContext';
import { useContent } from '@/src/core/content/useContent';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const COLORS = {
  background: '#0B0F19',
  primary: '#D4AF37', // Gold
  secondary: '#8A2BE2', // Purple
  tertiary: '#FF453A', // Red
  text: '#E0E0E0',
  textMuted: '#9CA3AF',
  cardBg: 'rgba(20, 25, 40, 0.7)',
  highlight: 'rgba(212, 175, 55, 0.15)',
};

const SubAccordionItem = ({ item, isExpanded, onToggle }: { item: { title: string, content: string }, isExpanded: boolean, onToggle: () => void }) => {
  return (
    <View style={styles.subAccordionContainer}>
      <TouchableOpacity style={styles.subAccordionHeader} onPress={onToggle} activeOpacity={0.8}>
        <Text style={styles.subSectionTitle}>{item.title}</Text>
        <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={18} color={COLORS.textMuted} />
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.subAccordionContent}>
          <Text style={styles.methodText}>{item.content}</Text>
        </View>
      )}
    </View>
  );
};

const AccordionItem = ({ lessonKey, isExpanded, onToggle }: { lessonKey: string, isExpanded: boolean, onToggle: () => void }) => {
  const { data: lessons } = useContent<Record<string, any>>('/api/content/lessons?discipline=human_design');
  const [expandedSubLesson, setExpandedSubLesson] = useState<number | null>(null);
  const lesson = (lessons ?? {})[lessonKey];

  if (!lesson) return null;

  const handleSubToggle = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSubLesson(prev => prev === index ? null : index);
  };

  return (
    <View style={styles.accordionContainer}>
      <TouchableOpacity style={styles.accordionHeader} onPress={onToggle} activeOpacity={0.8}>
        <Text style={styles.sectionTitle}>{lesson.title}</Text>
        <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={24} color={COLORS.primary} />
      </TouchableOpacity>
      
      {isExpanded && (
        <View style={styles.accordionContent}>
          {lesson.image && (
            <Image 
              source={lesson.image} 
              style={styles.lessonImage} 
              resizeMode="cover"
            />
          )}
          {lesson.content ? <Text style={styles.methodText}>{lesson.content}</Text> : null}
          
          {lesson.items && lesson.items.length > 0 && (
            <View style={{ marginTop: 15 }}>
              {lesson.items.map((item: any, index: number) => (
                <SubAccordionItem 
                  key={index} 
                  item={item} 
                  isExpanded={expandedSubLesson === index}
                  onToggle={() => handleSubToggle(index)}
                />
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default function HumanDesignCurriculumScreen() {
  const [activeTab, setActiveTab] = useState<'neofit' | 'adept' | 'master'>('neofit');
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);
  const { hasAccess, isAdmin } = useProgress();

  const handleTabPress = (tab: 'neofit' | 'adept' | 'master') => {
    setActiveTab(tab);
    setExpandedLesson(null);
  };

  const handleToggle = (key: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedLesson(prev => prev === key ? null : key);
  };

  return (
    <ImageBackground 
      source={{ uri: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2094&auto=format&fit=crop' }} 
      style={styles.container}
      blurRadius={10}
    >
      <View style={styles.overlay} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Human Design</Text>
          <Text style={styles.subtitle}>Genetik Şifreler ve Kozmik Tasarımın</Text>
        </View>

        {/* Sekmeler (Tabs) */}
        <View style={styles.tabContainer}>
          <TouchableOpacity style={[styles.tab, activeTab === 'neofit' && styles.activeTab]} onPress={() => handleTabPress('neofit')}>
            <Text style={[styles.tabText, activeTab === 'neofit' && styles.activeTabText]}>I. Çıraklık</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'adept' && styles.activeTab, !(hasAccess('human_2') || isAdmin) && { opacity: 0.5 }]} 
            onPress={() => (hasAccess('human_2') || isAdmin) ? handleTabPress('adept') : alert("Bu dersi/dereceyi açabilmeniz için en az Kalfalık seviyesine ulaşmış olmanız gerekmektedir.")}
          >
            <Text style={[styles.tabText, activeTab === 'adept' && styles.activeTabText]}>
              {!(hasAccess('human_2') || isAdmin) && <Ionicons name="lock-closed" size={14} color={COLORS.textMuted} style={{ marginRight: 5 }} />} II. Kalfalık
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'master' && styles.activeTab, !(hasAccess('human_master') || isAdmin) && { opacity: 0.5 }]} 
            onPress={() => (hasAccess('human_master') || isAdmin) ? handleTabPress('master') : alert("Bu dersi/dereceyi açabilmeniz için en az Üstatlık seviyesine ulaşmış olmanız gerekmektedir.")}
          >
            <Text style={[styles.tabText, activeTab === 'master' && styles.activeTabText]}>
              {!(hasAccess('human_master') || isAdmin) && <Ionicons name="lock-closed" size={14} color={COLORS.textMuted} style={{ marginRight: 5 }} />} III. Üstatlık
            </Text>
          </TouchableOpacity>
        </View>

        {/* I. NEOFİT SEKME İÇERİĞİ */}
        {activeTab === 'neofit' && (
          <View>
            <BlurView intensity={30} tint="dark" style={styles.introCard}>
              <Ionicons name="finger-print" size={40} color={COLORS.primary} style={{ marginBottom: 15 }} />
              <Text style={styles.introTitle}>Kozmik Parmak İzi</Text>
              <Text style={styles.introText}>
                Human Design sistemi seni "yeni birine" dönüştürmek için değil, <Text style={{fontWeight: 'bold', color: COLORS.primary}}>orijinal, saf genetik kodunu</Text> sana hatırlatmak için tasarlanmıştır.
              </Text>
            </BlurView>

            <AccordionItem lessonKey="1_nedir" isExpanded={expandedLesson === '1_nedir'} onToggle={() => handleToggle('1_nedir')} />
            <AccordionItem lessonKey="1_tipler" isExpanded={expandedLesson === '1_tipler'} onToggle={() => handleToggle('1_tipler')} />
            <AccordionItem lessonKey="1_otorite" isExpanded={expandedLesson === '1_otorite'} onToggle={() => handleToggle('1_otorite')} />
          </View>
        )}

        {/* II. ADEPT SEKME İÇERİĞİ */}
        {activeTab === 'adept' && (
          <View>
            <BlurView intensity={30} tint="dark" style={styles.introCard}>
              <Ionicons name="pulse" size={40} color={COLORS.primary} style={{ marginBottom: 15 }} />
              <Text style={styles.introTitle}>9 Enerji Merkezi</Text>
              <Text style={styles.introText}>
                Çakra sisteminin daha gelişmiş bir versiyonu olan 9 Merkezli bedenimizde, <Text style={{fontWeight: 'bold', color: COLORS.primary}}>tanımlı (renkli)</Text> olan yerler sabit gücümüzü, <Text style={{fontWeight: 'bold', color: COLORS.primary}}>tanımsız (beyaz)</Text> yerler ise dış dünyadan en çok etkilendiğimiz (ve öğrendiğimiz) sınıflarımızı gösterir.
              </Text>
            </BlurView>

            <AccordionItem lessonKey="2_merkez_mantigi" isExpanded={expandedLesson === '2_merkez_mantigi'} onToggle={() => handleToggle('2_merkez_mantigi')} />
            <AccordionItem lessonKey="2_basinc_farkindalik" isExpanded={expandedLesson === '2_basinc_farkindalik'} onToggle={() => handleToggle('2_basinc_farkindalik')} />
            <AccordionItem lessonKey="2_motor_yon" isExpanded={expandedLesson === '2_motor_yon'} onToggle={() => handleToggle('2_motor_yon')} />
          </View>
        )}

        {/* III. MASTER SEKME İÇERİĞİ */}
        {activeTab === 'master' && (
          <View>
            <BlurView intensity={30} tint="dark" style={styles.introCard}>
              <Ionicons name="planet" size={40} color={COLORS.primary} style={{ marginBottom: 15 }} />
              <Text style={styles.introTitle}>I-Ching ve DNA</Text>
              <Text style={styles.introText}>
                Human Design haritasındaki 64 Kapı, insan DNA'sındaki <Text style={{fontWeight: 'bold', color: COLORS.primary}}>64 Kodon</Text> ile eşleşir. Artık evrensel enerjinin mekaniğini tüm detaylarıyla idrak etme vakti.
              </Text>
            </BlurView>

            <AccordionItem lessonKey="3_kirmizi_siyah" isExpanded={expandedLesson === '3_kirmizi_siyah'} onToggle={() => handleToggle('3_kirmizi_siyah')} />
            <AccordionItem lessonKey="3_profiller" isExpanded={expandedLesson === '3_profiller'} onToggle={() => handleToggle('3_profiller')} />
            <AccordionItem lessonKey="3_kanallar" isExpanded={expandedLesson === '3_kanallar'} onToggle={() => handleToggle('3_kanallar')} />
            <AccordionItem lessonKey="3_64_kapilar_detay" isExpanded={expandedLesson === '3_64_kapilar_detay'} onToggle={() => handleToggle('3_64_kapilar_detay')} />
          </View>
        )}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(11, 15, 25, 0.85)', 
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textMuted,
    fontStyle: 'italic',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 4,
    marginBottom: 30,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    color: COLORS.textMuted,
    fontWeight: '600',
    fontSize: 14,
  },
  activeTabText: {
    color: COLORS.background,
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
    color: COLORS.text,
    marginBottom: 10,
  },
  introText: {
    fontSize: 15,
    color: COLORS.textMuted,
    lineHeight: 24,
  },
  accordionContainer: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    flex: 1,
  },
  accordionContent: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(212, 175, 55, 0.1)',
  },
  lessonImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 15,
  },
  methodText: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 24,
  },
  subAccordionContainer: {
    marginTop: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    overflow: 'hidden',
  },
  subAccordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  subSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
  },
  subAccordionContent: {
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
});
