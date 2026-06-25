import SacredBackground from '@/components/SacredBackground';
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, LayoutAnimation, Platform, UIManager } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
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
        <Text key={index} style={{ fontStyle: 'italic', color: '#9CA3AF' }}>
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
        <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={18} color="#9CA3AF" />
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
  const { data: lessons } = useContent<Record<string, any>>('/api/content/lessons?discipline=akupunktur');
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

export default function AkupunkturScreen() {
  const router = useRouter();
  const { hasAccess, isAdmin } = useProgress();
  const [activeTab, setActiveTab] = useState<'cirak' | 'kalfa' | 'ustat'>('cirak');
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);

  const handleTabPress = (tab: 'cirak' | 'kalfa' | 'ustat') => {
    if (tab === 'kalfa' && !(hasAccess('akupunktur_2') || isAdmin)) {
      alert("Bu dersi/dereceyi açabilmeniz için en az Kalfalık seviyesine ulaşmış olmanız gerekmektedir.");
      return;
    }
    if (tab === 'ustat' && !(hasAccess('akupunktur_master') || isAdmin)) {
      alert("Bu dersi/dereceyi açabilmeniz için en az Üstatlık seviyesine ulaşmış olmanız gerekmektedir.");
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
    <SacredBackground>
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
            onPress={() => handleTabPress('cirak')}
          >
            <Text style={[styles.tabText, activeTab === 'cirak' && styles.tabTextActive]}>1. Derece</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabBtn, activeTab === 'kalfa' && styles.tabBtnActive, !(hasAccess('akupunktur_2') || isAdmin) && { opacity: 0.5 }]} 
            onPress={() => handleTabPress('kalfa')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {!(hasAccess('akupunktur_2') || isAdmin) && <Ionicons name="lock-closed" size={14} color="#9CA3AF" style={{ marginRight: 5 }} />}
              <Text style={[styles.tabText, activeTab === 'kalfa' && styles.tabTextActive]}>2. Derece</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabBtn, activeTab === 'ustat' && styles.tabBtnActive, !(hasAccess('akupunktur_master') || isAdmin) && { opacity: 0.5 }]} 
            onPress={() => handleTabPress('ustat')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {!(hasAccess('akupunktur_master') || isAdmin) && <Ionicons name="lock-closed" size={14} color="#9CA3AF" style={{ marginRight: 5 }} />}
              <Text style={[styles.tabText, activeTab === 'ustat' && styles.tabTextActive]}>3. Derece</Text>
            </View>
          </TouchableOpacity>
        </View>

        {activeTab === 'cirak' && (
          <View style={styles.tabContentContainer}>
            <AccordionItem lessonKey="1_temel_sifa" isExpanded={expandedLesson === '1_temel_sifa'} onToggle={() => handleToggle('1_temel_sifa')} />
          </View>
        )}

        {activeTab === 'kalfa' && (
          <View style={styles.tabContentContainer}>
            <AccordionItem lessonKey="2_12_meridyen" isExpanded={expandedLesson === '2_12_meridyen'} onToggle={() => handleToggle('2_12_meridyen')} />
          </View>
        )}

        {activeTab === 'ustat' && (
          <View style={styles.tabContentContainer}>
            <AccordionItem lessonKey="3_dugumler_cozmek" isExpanded={expandedLesson === '3_dugumler_cozmek'} onToggle={() => handleToggle('3_dugumler_cozmek')} />
          </View>
        )}
        <View style={{ height: 40 }} />
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
    color: '#E0E0E0',
    marginBottom: 10,
    textAlign: 'center',
  },
  introText: {
    color: '#9CA3AF',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    fontStyle: 'italic',
  },
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
  tabContentContainer: {
    marginTop: 10,
  },
  accordionContainer: {
    backgroundColor: 'rgba(20, 25, 40, 0.7)',
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
    color: '#E0E0E0',
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
    color: '#E0E0E0',
    flex: 1,
  },
  subAccordionContent: {
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
});
