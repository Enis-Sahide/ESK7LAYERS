import SacredBackground from '@/components/SacredBackground';
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
  const { data: lessons } = useContent<Record<string, any>>('/api/content/lessons?discipline=astrology');
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

export default function AstrolojiCurriculumScreen() {
  const [activeTab, setActiveTab] = useState<'neofit' | 'adept' | 'master'>('neofit');
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);
  const { hasAccess, isAdmin } = useProgress();

  const handleToggle = (key: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedLesson(prev => prev === key ? null : key);
  };

  return (
    <SacredBackground>
      <View style={styles.overlay} />
      <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Başlık */}
        <View style={styles.header}>
          <Text style={styles.title}>Ezoterik Astroloji</Text>
          <Text style={styles.subtitle}>4 Katmanlı Ruhsal Harita Okuma Sanatı</Text>
        </View>

        {/* Tab Menüsü */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'neofit' && styles.activeTab]}
            onPress={() => { setActiveTab('neofit'); setExpandedLesson(null); }}
          >
            <Text style={[styles.tabText, activeTab === 'neofit' && styles.activeTabText]}>I. Çıraklık</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'adept' && styles.activeTab, !(hasAccess('astroloji_2') || isAdmin) && { opacity: 0.5 }]}
            onPress={() => {
              if (hasAccess('astroloji_2') || isAdmin) {
                setActiveTab('adept'); setExpandedLesson(null);
              } else {
                alert("Bu dersi/dereceyi açabilmeniz için en az Kalfalık seviyesine ulaşmış olmanız gerekmektedir.");
              }
            }}
          >
            <Text style={[styles.tabText, activeTab === 'adept' && styles.activeTabText]}>
              {!(hasAccess('astroloji_2') || isAdmin) && <Ionicons name="lock-closed" size={14} color={COLORS.textMuted} style={{ marginRight: 5 }} />} II. Kalfalık
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'master' && styles.activeTab, !(hasAccess('astroloji_master') || isAdmin) && { opacity: 0.5 }]}
            onPress={() => {
              if (hasAccess('astroloji_master') || isAdmin) {
                setActiveTab('master'); setExpandedLesson(null);
              } else {
                alert("Bu dersi/dereceyi açabilmeniz için en az Üstatlık seviyesine ulaşmış olmanız gerekmektedir.");
              }
            }}
          >
            <Text style={[styles.tabText, activeTab === 'master' && styles.activeTabText]}>
              {!(hasAccess('astroloji_master') || isAdmin) && <Ionicons name="lock-closed" size={14} color={COLORS.textMuted} style={{ marginRight: 5 }} />} III. Üstatlık
            </Text>
          </TouchableOpacity>
        </View>

        {/* Çıraklık (Seviye 1) İçeriği */}
        {activeTab === 'neofit' && (
          <View>
            <View style={styles.introCard}>
              <Text style={styles.introTitle}>Fiziksel İllüzyon (Assiah)</Text>
              <Text style={styles.introText}>
                Sıradan insanların gördüğü dünyevi katmandır. Beden sağlığı, para, iş, eş gibi fiziksel tezahürlerin okunmasını ve haritanın nasıl sentezleneceğini içerir.
              </Text>
            </View>

            <AccordionItem lessonKey="1_nedir" isExpanded={expandedLesson === '1_nedir'} onToggle={() => handleToggle('1_nedir')} />
            <AccordionItem lessonKey="1_harita_nasil_okunur" isExpanded={expandedLesson === '1_harita_nasil_okunur'} onToggle={() => handleToggle('1_harita_nasil_okunur')} />
            <AccordionItem lessonKey="1_evler_katman1" isExpanded={expandedLesson === '1_evler_katman1'} onToggle={() => handleToggle('1_evler_katman1')} />
            <AccordionItem lessonKey="1_gezegenler" isExpanded={expandedLesson === '1_gezegenler'} onToggle={() => handleToggle('1_gezegenler')} />
          </View>
        )}

        {/* Kalfalık (Seviye 2) İçeriği */}
        {activeTab === 'adept' && (
          <View>
            <View style={styles.introCard}>
              <Text style={styles.introTitle}>Psikolojik ve Karmik (Yetzirah & Briah)</Text>
              <Text style={styles.introText}>
                Olayların arkasındaki "Neden?" sorusunu cevaplarız. Ruhun geçmiş yaşam borçları, içsel çatışmalar ve gölge arketiplerin okunduğu derin katmandır.
              </Text>
            </View>

            <AccordionItem lessonKey="2_evler_katman2" isExpanded={expandedLesson === '2_evler_katman2'} onToggle={() => handleToggle('2_evler_katman2')} />
            <AccordionItem lessonKey="2_karmik_katman" isExpanded={expandedLesson === '2_karmik_katman'} onToggle={() => handleToggle('2_karmik_katman')} />
            <AccordionItem lessonKey="2_evler_katman3" isExpanded={expandedLesson === '2_evler_katman3'} onToggle={() => handleToggle('2_evler_katman3')} />
          </View>
        )}

        {/* Üstatlık (Seviye 3) İçeriği */}
        {activeTab === 'master' && (
          <View>
            <View style={styles.introCard}>
              <Text style={styles.introTitle}>İlahi Plan (Atziluth)</Text>
              <Text style={styles.introText}>
                Ruhun dünyevi acılarından arınıp evrensel bilince ulaştığı en yüksek frekanstır. Sabit yıldızlar ve tekamül kodlarının şifrelerini içerir.
              </Text>
            </View>

            <AccordionItem lessonKey="3_ezoterik_katman" isExpanded={expandedLesson === '3_ezoterik_katman'} onToggle={() => handleToggle('3_ezoterik_katman')} />
            <AccordionItem lessonKey="3_burclar_ezoterik" isExpanded={expandedLesson === '3_burclar_ezoterik'} onToggle={() => handleToggle('3_burclar_ezoterik')} />
          </View>
        )}
      </ScrollView>
    </SacredBackground>
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
