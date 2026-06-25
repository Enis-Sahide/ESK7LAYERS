import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Image, LayoutAnimation, Platform, UIManager, Alert } from 'react-native';
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

const getImageSource = (img: any) => {
  if (!img) return null;
  if (typeof img === 'string') return { uri: img };
  if (img.uri) return { uri: img.uri };
  return img;
};

const renderFormattedText = (text: string) => {
  if (!text) return null;
  // Fotoğraf linklerini gizle
  let cleanText = text.replace(/!\[.*?\]\(.*?\)/g, '');
  cleanText = cleanText.replace(/<img.*?src=".*?".*?>/g, '');
  
  // GitHub alert formatlarını Türkçeye ve Emojiye çevir
  cleanText = cleanText.replace(/>\s*\[!WARNING\]/gi, '⚠️ **DİKKAT:**');
  cleanText = cleanText.replace(/>\s*\[!TIP\]/gi, '💡 **İPUCU:**');
  cleanText = cleanText.replace(/>\s*\[!NOTE\]/gi, '📝 **NOT:**');
  cleanText = cleanText.replace(/>\s*\[!IMPORTANT\]/gi, '⭐ **ÖNEMLİ:**');
  
  // Satır başlarındaki ">" alıntı işaretlerini temizle
  cleanText = cleanText.replace(/\n>\s?/g, '\n');
  
  // **kalın** ve *eğik* metinleri ayır ve stillendir
  const parts = cleanText.split(/(\*\*.*?\*\*|\*.*?\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <Text key={index} style={{ fontWeight: 'bold', color: COLORS.primary }}>
          {part.slice(2, -2)}
        </Text>
      );
    } else if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <Text key={index} style={{ fontStyle: 'italic', color: COLORS.textMuted }}>
          {part.slice(1, -1)}
        </Text>
      );
    }
    return <Text key={index}>{part}</Text>;
  });
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
          <Text style={styles.methodText}>{renderFormattedText(item.content)}</Text>
        </View>
      )}
    </View>
  );
};

const AccordionItem = ({ lessonKey, isExpanded, onToggle }: { lessonKey: string, isExpanded: boolean, onToggle: () => void }) => {
  const { data: lessons } = useContent<Record<string, any>>('/api/content/lessons?discipline=yoga');
  const [expandedSubLesson, setExpandedSubLesson] = useState<number | null>(null);
  const lesson = (lessons ?? {})[lessonKey];

  if (!lesson) return null;

  const handleSubToggle = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSubLesson(prev => prev === index ? null : index);
  };

  const imageSource = getImageSource(lesson.image);

  return (
    <View style={styles.accordionContainer}>
      <TouchableOpacity style={styles.accordionHeader} onPress={onToggle} activeOpacity={0.8}>
        <Text style={styles.sectionTitle}>{lesson.title}</Text>
        <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={24} color={COLORS.primary} />
      </TouchableOpacity>
      
      {isExpanded && (
        <View style={styles.accordionContent}>
          {imageSource && (
            <Image 
              source={imageSource} 
              style={styles.lessonImage} 
              resizeMode="cover"
            />
          )}
          {lesson.content ? <Text style={styles.methodText}>{renderFormattedText(lesson.content)}</Text> : null}
          
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

export default function YogaCurriculumScreen() {
  const [activeTab, setActiveTab] = useState<'cirak' | 'kalfa' | 'ustat'>('cirak');
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);
  const { hasAccess, isAdmin } = useProgress();

  const handleTabPress = (tab: 'cirak' | 'kalfa' | 'ustat') => {
    if (tab === 'kalfa' && !(hasAccess('yoga_2') || isAdmin)) {
      Alert.alert("Derece Kilitli", "Bu dersi/dereceyi açabilmeniz için en az Kalfalık seviyesine ulaşmış olmanız gerekmektedir.");
      return;
    }
    if (tab === 'ustat' && !(hasAccess('yoga_master') || isAdmin)) {
      Alert.alert("Derece Kilitli", "Bu dersi/dereceyi açabilmeniz için en az Üstatlık seviyesine ulaşmış olmanız gerekmektedir.");
      return;
    }
    setActiveTab(tab);
    setExpandedLesson(null);
  };

  const handleToggle = (key: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedLesson(prev => prev === key ? null : key);
  };

  return (
    <ImageBackground 
      source={{ uri: 'https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?q=80&w=2070&auto=format&fit=crop' }} 
      style={styles.container}
      blurRadius={10}
    >
      <View style={styles.overlay} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Yoga Asanaları</Text>
          <Text style={styles.subtitle}>Bedenin, Zihnin ve Ruhun Ezoterik Birleşimi</Text>
        </View>

        {/* Sekmeler (Tabs) */}
        <View style={styles.tabContainer}>
          <TouchableOpacity style={[styles.tab, activeTab === 'cirak' && styles.activeTab]} onPress={() => handleTabPress('cirak')}>
            <Text style={[styles.tabText, activeTab === 'cirak' && styles.activeTabText]}>1. Derece</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, activeTab === 'kalfa' && styles.activeTab, !(hasAccess('yoga_2') || isAdmin) && { opacity: 0.5 }]} onPress={() => handleTabPress('kalfa')}>
            <Text style={[styles.tabText, activeTab === 'kalfa' && styles.activeTabText]}>
              {!(hasAccess('yoga_2') || isAdmin) && <Ionicons name="lock-closed" size={14} color={COLORS.textMuted} style={{ marginRight: 5 }} />} 2. Derece
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, activeTab === 'ustat' && styles.activeTab, !(hasAccess('yoga_master') || isAdmin) && { opacity: 0.5 }]} onPress={() => handleTabPress('ustat')}>
            <Text style={[styles.tabText, activeTab === 'ustat' && styles.activeTabText]}>
              {!(hasAccess('yoga_master') || isAdmin) && <Ionicons name="lock-closed" size={14} color={COLORS.textMuted} style={{ marginRight: 5 }} />} 3. Derece
            </Text>
          </TouchableOpacity>
        </View>

        {/* I. ÇIRAK SEKME İÇERİĞİ */}
        {activeTab === 'cirak' && (
          <View>
            <BlurView intensity={30} tint="dark" style={styles.introCard}>
              <Ionicons name="leaf" size={40} color={COLORS.primary} style={{ marginBottom: 15 }} />
              <Text style={styles.introTitle}>Köklenme ve Felsefe</Text>
              <Text style={styles.introText}>
                <Text style={{fontWeight: 'bold', color: COLORS.primary}} font-medium>Yoga</Text> kelimesi, Sanskritçe <Text style={{fontWeight: 'bold', color: COLORS.primary}}>"Yuj"</Text> kökünden gelir ve <Text style={{fontWeight: 'bold', color: COLORS.primary}}>"Bütünleşmek/Birleşmek"</Text> anlamına gelir. Bireysel ruhun evrensel ruhla birleştiği, egonun eridiği yerdir.
              </Text>
            </BlurView>

            <AccordionItem lessonKey="1_ashtanga" isExpanded={expandedLesson === '1_ashtanga'} onToggle={() => handleToggle('1_ashtanga')} />
            <AccordionItem lessonKey="1_asana" isExpanded={expandedLesson === '1_asana'} onToggle={() => handleToggle('1_asana')} />
            <AccordionItem lessonKey="1_pranayama" isExpanded={expandedLesson === '1_pranayama'} onToggle={() => handleToggle('1_pranayama')} />
          </View>
        )}

        {/* II. KALFA SEKME İÇERİĞİ */}
        {activeTab === 'kalfa' && (
          <View>
            <BlurView intensity={30} tint="dark" style={styles.introCard}>
              <Ionicons name="flame" size={40} color={COLORS.primary} style={{ marginBottom: 15 }} />
              <Text style={styles.introTitle}>Enerji Akışları ve Kilitler</Text>
              <Text style={styles.introText}>
                Hatha Yoga kelimesindeki <Text style={{fontWeight: 'bold', color: COLORS.primary}}>"Ha" Güneşi, "Tha" Ayı</Text> temsil eder. Kalfa, nefes ile hareketi (<Text style={{fontWeight: 'bold', color: COLORS.primary}}>Vinyasa</Text>) mükemmel senkronize eden kişidir.
              </Text>
            </BlurView>

            <AccordionItem lessonKey="2_surya_namaskar" isExpanded={expandedLesson === '2_surya_namaskar'} onToggle={() => handleToggle('2_surya_namaskar')} />
            <AccordionItem lessonKey="2_nadi_vayu" isExpanded={expandedLesson === '2_nadi_vayu'} onToggle={() => handleToggle('2_nadi_vayu')} />
            <AccordionItem lessonKey="2_bandhalar" isExpanded={expandedLesson === '2_bandhalar'} onToggle={() => handleToggle('2_bandhalar')} />
          </View>
        )}

        {/* III. ÜSTAT SEKME İÇERİĞİ */}
        {activeTab === 'ustat' && (
          <View>
            <BlurView intensity={30} tint="dark" style={styles.introCard}>
              <Ionicons name="infinite" size={40} color={COLORS.primary} style={{ marginBottom: 15 }} />
              <Text style={styles.introTitle}>Sırların Zirvesi ve Aydınlanma</Text>
              <Text style={styles.introText}>
                Üstat; illüzyon perdesini kaldıran, <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Kundaliniyi</Text> uyandıran ve Samadhi'ye ulaşan ruhani kâşiftir. Tantrik felsefede Güneş ve Ay (Pingala ve Ida) <Text style={{fontWeight: 'bold', color: COLORS.primary}}>3. Gözde (Ajna) birleştiğinde dualite biter.</Text>
              </Text>
            </BlurView>

            <AccordionItem lessonKey="3_kundalini" isExpanded={expandedLesson === '3_kundalini'} onToggle={() => handleToggle('3_kundalini')} />
            <AccordionItem lessonKey="3_mudra_mantra" isExpanded={expandedLesson === '3_mudra_mantra'} onToggle={() => handleToggle('3_mudra_mantra')} />
            <AccordionItem lessonKey="3_samadhi" isExpanded={expandedLesson === '3_samadhi'} onToggle={() => handleToggle('3_samadhi')} />
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
