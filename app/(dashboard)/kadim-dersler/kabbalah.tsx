import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Image, LayoutAnimation, Platform, UIManager, Modal, SafeAreaView, Dimensions, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useProgress } from '../../../src/context/ProgressContext';
import { useContent } from '@/src/core/content/useContent';
import { useRouter } from 'expo-router';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

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

const renderFormattedText = (text: string) => {
  if (!text) return null;
  // Fotoğraf linklerini gizle (mobilde çalışmayan C:/ yolları ve HTML img etiketleri)
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

const SubAccordionItem = ({ item, isExpanded, onToggle, onImagePress }: { item: { title: string, content: string, image?: any }, isExpanded: boolean, onToggle: () => void, onImagePress?: (image: any) => void }) => {
  return (
    <View style={styles.subAccordionContainer}>
      <TouchableOpacity style={styles.subAccordionHeader} onPress={onToggle} activeOpacity={0.8}>
        <Text style={styles.subSectionTitle}>{item.title}</Text>
        <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={18} color={COLORS.textMuted} />
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.subAccordionContent}>
          {item.image && (
            <TouchableOpacity onPress={() => onImagePress && onImagePress(item.image)} activeOpacity={0.9}>
              <Image 
                source={item.image} 
                style={styles.lessonImage} 
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
          <Text style={styles.methodText}>{renderFormattedText(item.content)}</Text>
        </View>
      )}
    </View>
  );
};

const AccordionItem = ({ lessonKey, isExpanded, onToggle, onImagePress }: { lessonKey: string, isExpanded: boolean, onToggle: () => void, onImagePress?: (image: any) => void }) => {
  const { data: lessons } = useContent<Record<string, any>>('/api/content/lessons?discipline=kabbalah');
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
            <TouchableOpacity onPress={() => onImagePress && onImagePress(lesson.image)} activeOpacity={0.9}>
              <Image 
                source={lesson.image} 
                style={styles.lessonImage} 
                resizeMode="cover"
              />
            </TouchableOpacity>
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
                  onImagePress={onImagePress}
                />
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default function KabbalahCurriculumScreen() {
  const router = useRouter();
  const { hasAccess, isAdmin } = useProgress();
  const [activeTab, setActiveTab] = useState<'ciraklik' | 'kalfalik' | 'ustat'>('ciraklik');
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);
  
  // ImageViewing state
  const [isViewerVisible, setIsViewerVisible] = useState(false);
  const [viewerImage, setViewerImage] = useState<any>(null);

  const isKalfaUnlocked = hasAccess('kabbalah_2') || isAdmin;
  const isUstatUnlocked = hasAccess('kabbalah_3') || isAdmin;

  const handleImagePress = (imageSource: any) => {
    try {
      setViewerImage(imageSource);
      setIsViewerVisible(true);
    } catch (e) {
      console.log("Could not set viewer image");
    }
  };

  const handleTabPress = (tab: 'ciraklik' | 'kalfalik' | 'ustat') => {
    if (tab === 'kalfalik' && !isKalfaUnlocked) {
      return;
    }
    if (tab === 'ustat' && !isUstatUnlocked) {
      return;
    }
    setActiveTab(tab);
    setExpandedLesson(null);
  };

  const handleToggle = (key: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedLesson(prev => prev === key ? null : key);
  };

  const { data: kabbalahLessons } = useContent<Record<string, any>>('/api/content/lessons?discipline=kabbalah');
  const ciraklikKeys = Object.keys(kabbalahLessons ?? {}).filter(k => k.startsWith('ciraklik'));
  const kalfalikKeys = Object.keys(kabbalahLessons ?? {}).filter(k => k.startsWith('kalfalik'));

  return (
    <ImageBackground 
      source={{ uri: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2094&auto=format&fit=crop' }} 
      style={styles.container}
      blurRadius={10}
    >
      <View style={styles.overlay} />

        <Modal
        visible={isViewerVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsViewerVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={() => setIsViewerVisible(false)}
          >
            <Ionicons name="close-circle" size={40} color="#FFF" />
          </TouchableOpacity>
          <ScrollView 
            contentContainerStyle={styles.modalScroll}
            maximumZoomScale={4}
            minimumZoomScale={1}
            bouncesZoom={true}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >
            <TouchableOpacity activeOpacity={1} style={styles.modalImageWrapper}>
              {viewerImage && (
                <Image 
                  source={viewerImage} 
                  style={styles.fullScreenImage} 
                  resizeMode="contain"
                />
              )}
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={28} color={COLORS.primary} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Evrensel Kabbalah</Text>
            <Text style={styles.subtitle}>Hayat Ağacı ve Kozmik Şifreler</Text>
          </View>
        </View>

        {/* Sekmeler (Tabs) */}
        <View style={styles.tabContainer}>
          <TouchableOpacity style={[styles.tab, activeTab === 'ciraklik' && styles.activeTab]} onPress={() => handleTabPress('ciraklik')}>
            <Text style={[styles.tabText, activeTab === 'ciraklik' && styles.activeTabText]}>1. Derece</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'kalfalik' && styles.activeTab, !isKalfaUnlocked && { opacity: 0.5 }]} 
            onPress={() => handleTabPress('kalfalik')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {!isKalfaUnlocked && <Ionicons name="lock-closed" size={14} color={COLORS.textMuted} style={{ marginRight: 5 }} />}
              <Text style={[styles.tabText, activeTab === 'kalfalik' && styles.activeTabText]}>2. Derece</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'ustat' && styles.activeTab, !isUstatUnlocked && { opacity: 0.5 }]} 
            onPress={() => handleTabPress('ustat')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {!isUstatUnlocked && <Ionicons name="lock-closed" size={14} color={COLORS.textMuted} style={{ marginRight: 5 }} />}
              <Text style={[styles.tabText, activeTab === 'ustat' && styles.activeTabText]}>3. Derece</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* I. ÇIRAKLIK SEKME İÇERİĞİ */}
        {activeTab === 'ciraklik' && (
          <View>
            <BlurView intensity={30} tint="dark" style={styles.introCard}>
              <Ionicons name="git-network-outline" size={40} color={COLORS.primary} style={{ marginBottom: 15 }} />
              <Text style={styles.introTitle}>Yaşam Ağacına Giriş</Text>
              <Text style={styles.introText}>
                Kabbalah, aklın değil <Text style={{fontWeight: 'bold', color: COLORS.primary}}>evrensel ve ilahi olanın tek dilidir</Text>. Evrenin yaratılışını, kozmik düzeni ve insanın bu düzendeki rolünü anlatan kadim bir bilgeliktir.
              </Text>
            </BlurView>

            {ciraklikKeys.map(key => (
              <AccordionItem 
                key={key} 
                lessonKey={key} 
                isExpanded={expandedLesson === key} 
                onToggle={() => handleToggle(key)} 
                onImagePress={handleImagePress}
              />
            ))}
          </View>
        )}

        {/* II. KALFALIK SEKME İÇERİĞİ */}
        {activeTab === 'kalfalik' && (
          <View>
            <BlurView intensity={30} tint="dark" style={styles.introCard}>
              <Ionicons name="planet-outline" size={40} color={COLORS.primary} style={{ marginBottom: 15 }} />
              <Text style={styles.introTitle}>Pratik Kabbalah ve Thoth</Text>
              <Text style={styles.introText}>
                Pozitif varoluş, Kozmos Tanrıları ve niyetin gücü... Hayatınızı ve auranızı yönetmeyi öğrenerek, bir <Text style={{fontWeight: 'bold', color: COLORS.primary}}>Kozmos Tanrısı</Text> olarak yaratım sürecine aktif katılım vakti.
              </Text>
            </BlurView>

            {kalfalikKeys.map(key => (
              <AccordionItem 
                key={key} 
                lessonKey={key} 
                isExpanded={expandedLesson === key} 
                onToggle={() => handleToggle(key)} 
                onImagePress={handleImagePress}
              />
            ))}
          </View>
        )}

        {/* III. ÜSTATLIK SEKME İÇERİĞİ */}
        {activeTab === 'ustat' && (
          <BlurView intensity={30} tint="dark" style={[styles.introCard, { paddingVertical: 40, alignItems: 'center' }]}>
            <Ionicons name="lock-closed" size={48} color={COLORS.primary} style={{ marginBottom: 15 }} />
            <Text style={styles.introTitle}>Mistik Bilgi Hazırlanıyor</Text>
            <Text style={styles.introText}>
              Bu derecenin öğretileri henüz aktarılmamıştır. Tapınak çalışmalarına devam edin.
            </Text>
          </BlurView>
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    marginRight: 15,
    padding: 8,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderRadius: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  modalImageWrapper: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.8,
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: 20,
    zIndex: 10,
  },
});
