import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Animated, Easing, Image, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '@/src/services/supabase';
import { COLORS, SIZES } from '@/src/theme';
import { DAILY_AFFIRMATIONS } from '@/src/data/affirmations';
import { useProgress } from '@/src/context/ProgressContext';

const ESOTERIC_BG = { uri: 'https://mbqjklupfoqbcfxusigs.supabase.co/storage/v1/object/public/app-assets/images/backgrounds/esoteric_bg.png' };

const { width } = Dimensions.get('window');

const AVATARS: Record<string, any> = {
  'pleiades': { uri: 'https://mbqjklupfoqbcfxusigs.supabase.co/storage/v1/object/public/app-assets/images/avatars/pleiades.png' },
  'sirius': { uri: 'https://mbqjklupfoqbcfxusigs.supabase.co/storage/v1/object/public/app-assets/images/avatars/sirius.png' },
  'arcturus': { uri: 'https://mbqjklupfoqbcfxusigs.supabase.co/storage/v1/object/public/app-assets/images/avatars/arcturus.png' },
  'andromeda': { uri: 'https://mbqjklupfoqbcfxusigs.supabase.co/storage/v1/object/public/app-assets/images/avatars/andromeda.png' },
  'lyra': { uri: 'https://mbqjklupfoqbcfxusigs.supabase.co/storage/v1/object/public/app-assets/images/avatars/lyra.png' },
  'orion': { uri: 'https://mbqjklupfoqbcfxusigs.supabase.co/storage/v1/object/public/app-assets/images/avatars/orion.png' },
  'mintaka': { uri: 'https://mbqjklupfoqbcfxusigs.supabase.co/storage/v1/object/public/app-assets/images/avatars/mintaka.png' },
  'orion_pleiades': { uri: 'https://mbqjklupfoqbcfxusigs.supabase.co/storage/v1/object/public/app-assets/images/avatars/orion_pleiades.png' },
  'blue_avians': { uri: 'https://mbqjklupfoqbcfxusigs.supabase.co/storage/v1/object/public/app-assets/images/avatars/sirius.png' },
  'sirius_pleiades': { uri: 'https://mbqjklupfoqbcfxusigs.supabase.co/storage/v1/object/public/app-assets/images/avatars/pleiades.png' },
  'lyra_arcturus': { uri: 'https://mbqjklupfoqbcfxusigs.supabase.co/storage/v1/object/public/app-assets/images/avatars/arcturus.png' },
  'atlantis': { uri: 'https://mbqjklupfoqbcfxusigs.supabase.co/storage/v1/object/public/app-assets/images/avatars/mintaka.png' },
  'indigo': { uri: 'https://mbqjklupfoqbcfxusigs.supabase.co/storage/v1/object/public/app-assets/images/avatars/pleiades.png' },
};

// İçerik Kategorileri (7 Çakra - 7 Katman)
const MODULES = [
  { id: 1, title: 'Kök Çakra', subtitle: 'Temel Bilgiler', reqLevel: 1, imageIcon: { uri: 'https://mbqjklupfoqbcfxusigs.supabase.co/storage/v1/object/public/app-assets/images/chakras/root.png' }, color: '#FF3B30', top: '82%' },
  { id: 2, title: 'Sakral Çakra', subtitle: 'Bağlar ve Yaratım', reqLevel: 2, imageIcon: { uri: 'https://mbqjklupfoqbcfxusigs.supabase.co/storage/v1/object/public/app-assets/images/chakras/sacral.png' }, color: '#FF9500', top: '72%' },
  { id: 3, title: 'Solar Pleksus', subtitle: 'İrade ve Güç', reqLevel: 3, imageIcon: { uri: 'https://mbqjklupfoqbcfxusigs.supabase.co/storage/v1/object/public/app-assets/images/chakras/solar.png' }, color: '#FFCC00', top: '62%' },
  { id: 4, title: 'Kalp Çakrası', subtitle: 'Sevgi ve Denge', reqLevel: 4, imageIcon: { uri: 'https://mbqjklupfoqbcfxusigs.supabase.co/storage/v1/object/public/app-assets/images/chakras/heart.png' }, color: '#34C759', top: '52%' },
  { id: 5, title: 'Boğaz Çakrası', subtitle: 'İfade ve Gerçek', reqLevel: 5, imageIcon: { uri: 'https://mbqjklupfoqbcfxusigs.supabase.co/storage/v1/object/public/app-assets/images/chakras/throat.png' }, color: '#00C7BE', top: '37%' },
  { id: 6, title: 'Üçüncü Göz', subtitle: 'Sezgi ve İdrak', reqLevel: 6, imageIcon: { uri: 'https://mbqjklupfoqbcfxusigs.supabase.co/storage/v1/object/public/app-assets/images/chakras/thirdeye.png' }, color: '#32ADE6', top: '25%' },
  { id: 7, title: 'Tepe Çakra', subtitle: 'Kozmik Bağlantı', reqLevel: 7, imageIcon: { uri: 'https://mbqjklupfoqbcfxusigs.supabase.co/storage/v1/object/public/app-assets/images/chakras/crown.png' }, color: '#AF52DE', top: '15%' },
];

const DAY_CHAKRA_MAP: Record<number, { name: string, planet: string, chakraId: number, symbol: string }> = {
  0: { name: 'Pazar', planet: 'Güneş Günü', chakraId: 3, symbol: '☉' },
  1: { name: 'Pazartesi', planet: 'Ay Günü', chakraId: 4, symbol: '☽' },
  2: { name: 'Salı', planet: 'Mars Günü', chakraId: 1, symbol: '♂' },
  3: { name: 'Çarşamba', planet: 'Merkür Günü', chakraId: 5, symbol: '☿' },
  4: { name: 'Perşembe', planet: 'Jüpiter Günü', chakraId: 6, symbol: '♃' },
  5: { name: 'Cuma', planet: 'Venüs Günü', chakraId: 2, symbol: '♀' },
  6: { name: 'Cumartesi', planet: 'Satürn Günü', chakraId: 7, symbol: '♄' },
};

const MarqueeText = ({ text }: { text: string }) => {
  const animatedValue = useRef(new Animated.Value(width)).current;

  useEffect(() => {
    const startAnimation = () => {
      animatedValue.setValue(width);
      Animated.timing(animatedValue, {
        toValue: -1200, 
        duration: 20000, 
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(startAnimation, 3000); 
      });
    };

    startAnimation();
  }, [text]);

  return (
    <View style={styles.marqueeContainer}>
      <Animated.Text style={[styles.marqueeText, { transform: [{ translateX: animatedValue }] }]}>
        {text}
      </Animated.Text>
    </View>
  );
};

export default function DashboardScreen() {
  const router = useRouter();
  const { hasAccess } = useProgress();
  const [userName, setUserName] = useState('');
  const [userTitle, setUserTitle] = useState('Arayışta');
  const [userRace, setUserRace] = useState<string | null>(null);
  const [isToolsExpanded, setIsToolsExpanded] = useState(false);
  const [isLessonsExpanded, setIsLessonsExpanded] = useState(false);
  const [isTimelineExpanded, setIsTimelineExpanded] = useState(false);
  
  const currentDay = new Date().getDay(); // 0: Pazar, 1: Pzt ...
  const [selectedDay, setSelectedDay] = useState(currentDay);
  const selectedInfo = DAY_CHAKRA_MAP[selectedDay];
  const selectedChakra = MODULES.find(m => m.id === selectedInfo.chakraId);
  const dailyAffirmation = DAILY_AFFIRMATIONS[selectedDay];

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserName(user.user_metadata?.full_name?.split(' ')[0] || 'Yolcu');
        setUserRace(user.user_metadata?.race || null);
        if (user.user_metadata?.spiritual_title) {
          setUserTitle(user.user_metadata.spiritual_title);
        }
      }
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/(auth)/login');
  };

  return (
    <ImageBackground 
      source={ESOTERIC_BG}
      style={styles.container}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Üst Bilgi Başlığı */}
        <View style={styles.header}>
        <View style={styles.headerProfile}>
          {userRace && AVATARS[userRace] && (
            <Image source={AVATARS[userRace]} style={styles.headerAvatar} />
          )}
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
              <Text style={styles.welcomeText}>Hoş Geldin, </Text>
              <View style={styles.titleBadge}>
                <Ionicons name="sparkles" size={10} color="#FFD700" style={{ marginRight: 3 }} />
                <Text style={styles.titleBadgeText}>{userTitle}</Text>
              </View>
            </View>
            <Text style={styles.nameText}>{userName}</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.headerMenuBtn} 
          onPress={() => {
            setIsToolsExpanded(true);
            setIsLessonsExpanded(false);
          }}
        >
          <Ionicons name="ellipsis-vertical" size={26} color={COLORS.text} />
        </TouchableOpacity>
      </View>

        {/* Günlük Çakra Rehberi */}
        <BlurView intensity={40} tint="dark" style={styles.profileCard}>
          <TouchableOpacity 
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
            onPress={() => setIsTimelineExpanded(!isTimelineExpanded)}
            activeOpacity={0.7}
          >
            <View style={[styles.levelBadge, { marginBottom: 0, backgroundColor: selectedChakra?.color + '40' }]}>
              <Text style={[styles.levelText, { color: selectedChakra?.color }]}>{selectedInfo.name}: {selectedInfo.planet}</Text>
            </View>
            <Ionicons name={isTimelineExpanded ? "chevron-up" : "chevron-down"} size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
          
          {isTimelineExpanded && (
            <View style={{ marginTop: 15 }}>
              <Text style={[styles.hintText, { textAlign: 'left', fontSize: 14, color: COLORS.text, marginBottom: 20, fontStyle: 'normal' }]}>
                {selectedDay === currentDay ? 'Bugün ' : ''}<Text style={{ color: selectedChakra?.color, fontWeight: 'bold' }}>{selectedChakra?.title}'nı</Text> onurlandırmak ve enerjisini aktive etmek için en verimli gün.
              </Text>

              {/* Haftanın Günleri Timeline */}
              <View style={styles.weekTimeline}>
                {[1, 2, 3, 4, 5, 6, 0].map((dayIndex) => { // Pzt'den Pazara sıralama
                  const info = DAY_CHAKRA_MAP[dayIndex];
                  const chakra = MODULES.find(m => m.id === info.chakraId);
                  const isSelected = selectedDay === dayIndex;
                  const isToday = currentDay === dayIndex;

                  return (
                    <TouchableOpacity key={dayIndex} style={styles.dayNode} onPress={() => setSelectedDay(dayIndex)} activeOpacity={0.7}>
                      <View style={[
                        styles.dayCircle, 
                        isSelected ? { backgroundColor: chakra?.color, shadowColor: chakra?.color, shadowOpacity: 0.8, shadowRadius: 8, elevation: 5 } : { backgroundColor: 'rgba(255,255,255,0.1)' }
                      ]}>
                        <Text style={[styles.dayInitial, isSelected && { color: '#000', fontWeight: 'bold' }]}>
                          {info.name.substring(0, 3)}
                        </Text>
                      </View>
                      {isToday && <View style={[styles.activeDot, { backgroundColor: isSelected ? chakra?.color : COLORS.textMuted }]} />}
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Günün Olumlaması (Birleştirildi) */}
              {dailyAffirmation && (
                <View style={{ marginTop: 25, paddingTop: 20, borderTopWidth: 1, borderTopColor: 'rgba(212, 175, 55, 0.2)' }}>
                  <Text style={{ fontSize: 36, color: selectedChakra?.color || COLORS.primary, alignSelf: 'center', marginBottom: 10, textShadowColor: selectedChakra?.color, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 10 }}>{selectedInfo.symbol}</Text>
                  <Text style={styles.affirmationText}>"{dailyAffirmation.text}"</Text>
                  <Text style={[styles.affirmationAuthor, { color: selectedChakra?.color || COLORS.primaryDark }]}>— {dailyAffirmation.author}</Text>
                </View>
              )}
            </View>
          )}
        </BlurView>



        {/* Modüller: Anatomik Çakra Haritası */}
        <Text style={styles.sectionTitle}>7 İnisiyasyon Katmanı</Text>
        
        <View style={styles.anatomicalContainer}>
          <Image 
            source={require('../../assets/images/human_silhouette.png')} 
            style={styles.silhouetteImage} 
            resizeMode="cover" 
          />
          
          {/* Çalışma Kuralları & Analiz Butonları */}
          <View style={styles.topButtonsContainer}>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <TouchableOpacity 
                style={styles.guidelinesBtn}
                onPress={() => router.push('/(dashboard)/chakra-analysis')}
                activeOpacity={0.5}
              >
                <Ionicons name="scan-circle-outline" size={16} color={COLORS.primaryDark} style={{ marginRight: 5 }} />
                <Text style={[styles.guidelinesText, { color: COLORS.primaryDark }]}>Aura Analizi</Text>
              </TouchableOpacity>
            </View>

            <View style={{ width: 1, height: 15, backgroundColor: 'rgba(212, 175, 55, 0.4)', marginHorizontal: 10 }} />

            <View style={{ flex: 1, alignItems: 'flex-start' }}>
              <TouchableOpacity 
                style={styles.guidelinesBtn}
                onPress={() => router.push('/(dashboard)/chakra-guidelines')}
                activeOpacity={0.5}
              >
                <Ionicons name="warning-outline" size={14} color={COLORS.primaryDark} style={{ marginRight: 5 }} />
                <Text style={[styles.guidelinesText, { color: COLORS.primaryDark }]}>Önemli Hususlar</Text>
              </TouchableOpacity>
            </View>
          </View>

          {MODULES.map((mod) => {
            const isUnlocked = true;
            return (
              <TouchableOpacity 
                key={mod.id} 
                style={[styles.chakraNode, { top: mod.top }]}
                activeOpacity={0.8}
                onPress={() => {
                  if (isUnlocked) {
                    router.push(`/chakra/${mod.id}`);
                  }
                }}
              >
                <View style={[styles.nodeCircle, { backgroundColor: mod.color + '30', borderColor: mod.color, shadowColor: mod.color }]} />
                <View style={styles.nodeLabelContainer}>
                  <Text style={[styles.nodeTitle, { color: mod.color }]}>{mod.title}</Text>
                  <Text style={styles.nodeSubtitle}>{mod.subtitle}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{height: 100}} />
      </ScrollView>

      {/* Ekranın Altında Akan Yazı */}
      <MarqueeText text="Gerçek katman katmandır ve yapman gereken unuttuklarını hatırlayarak katmanları açmaktır. Hatırladıkça aydınlık artacak ve ışığın kaynağını bulacaksın..." />

      {/* Kayan Menü Arka Planı (Açıkken) */}
      {isToolsExpanded && (
        <TouchableOpacity style={styles.topMenuOverlay} activeOpacity={1} onPress={() => setIsToolsExpanded(false)}>
           {/* Menü İçeriği */}
           <ScrollView style={styles.floatingMenuContainer} onStartShouldSetResponder={() => true} showsVerticalScrollIndicator={false}>
             
             {/* Kadim Dersler Linki */}
             <TouchableOpacity 
                style={styles.fabMenuItem} 
                onPress={() => { 
                  router.push('/(dashboard)/kadim-dersler'); 
                  setIsToolsExpanded(false);
                }}
              >
               <Ionicons name="book" size={20} color={COLORS.primary} style={{ marginRight: 10 }} />
               <Text style={styles.fabMenuText}>Kadim Dersler</Text>
             </TouchableOpacity>

             <View style={styles.fabMenuDivider} />

             <TouchableOpacity style={styles.fabMenuItem} onPress={() => { router.push('/(dashboard)/meditation'); }}>
               <Ionicons name="musical-notes" size={20} color="#32ADE6" style={{ marginRight: 10 }} />
               <Text style={styles.fabMenuText}>Frekans Odası</Text>
             </TouchableOpacity>

             <View style={styles.fabMenuDivider} />

             <TouchableOpacity style={styles.fabMenuItem} onPress={() => { router.push('/(dashboard)/breathwork'); }}>
               <Ionicons name="water" size={20} color="#FF9500" style={{ marginRight: 10 }} />
               <Text style={styles.fabMenuText}>Nefes Egzersizi</Text>
             </TouchableOpacity>

             <View style={styles.fabMenuDivider} />

             {/* Kişisel Analizler Merkezi Linki */}
             <TouchableOpacity style={styles.fabMenuItem} onPress={() => { router.push('/(dashboard)/kisisel-analizler'); }}>
               <Ionicons name="analytics" size={20} color="#FF9500" style={{ marginRight: 10 }} />
               <Text style={styles.fabMenuText}>Kişisel Analizler</Text>
             </TouchableOpacity>

             <View style={styles.fabMenuDivider} />

             {/* Sınavlar Merkezi Linki */}
             <TouchableOpacity style={styles.fabMenuItem} onPress={() => { router.push('/(dashboard)/tests'); }}>
               <Ionicons name="school" size={20} color="#FFCC00" style={{ marginRight: 10 }} />
               <Text style={styles.fabMenuText}>Öğrendiklerini Test Et</Text>
             </TouchableOpacity>

             <View style={styles.fabMenuDivider} />

             {/* Profil ve Ayarlar */}
             <TouchableOpacity style={styles.fabMenuItem} onPress={() => { router.push('/(dashboard)/profile'); setIsToolsExpanded(false); }}>
               <Ionicons name="settings-outline" size={20} color="#34C759" style={{ marginRight: 10 }} />
               <Text style={styles.fabMenuText}>Profil ve Ayarlar</Text>
             </TouchableOpacity>

             <View style={styles.fabMenuDivider} />

             <TouchableOpacity style={[styles.fabMenuItem, { marginBottom: 10 }]} onPress={handleLogout}>
               <Ionicons name="log-out-outline" size={20} color={COLORS.error} style={{ marginRight: 10 }} />
               <Text style={[styles.fabMenuText, { color: COLORS.error }]}>Çıkış Yap</Text>
             </TouchableOpacity>

           </ScrollView>
        </TouchableOpacity>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SIZES.padding,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerProfile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 45,
    height: 45,
    borderRadius: 25,
    marginRight: 15,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  welcomeText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  titleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.5)',
  },
  titleBadgeText: {
    color: '#FFD700',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  logoutBtn: {
    padding: 8,
  },
  profileCard: {
    padding: 20,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.4)',
    marginBottom: 35,
    overflow: 'hidden',
  },
  levelBadge: {
    backgroundColor: COLORS.primaryDark,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  levelText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  weekTimeline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  dayNode: {
    alignItems: 'center',
    gap: 5,
  },
  dayCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayInitial: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 2,
  },
  hintText: {
    color: COLORS.textMuted,
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  affirmationCard: {
    padding: 20,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    marginBottom: 35,
    backgroundColor: 'rgba(212, 175, 55, 0.05)',
  },
  affirmationText: {
    color: COLORS.text,
    fontSize: 15,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 10,
  },
  affirmationAuthor: {
    color: COLORS.primaryDark,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  sectionTitle: {
    fontSize: 20,
    color: COLORS.primaryDark,
    marginBottom: 15,
    fontWeight: 'bold',
  },
  anatomicalContainer: {
    height: 700,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 10,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: SIZES.radius * 2,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    overflow: 'hidden',
  },
  silhouetteImage: {
    width: '100%',
    height: '120%',
    opacity: 0.8,
    position: 'absolute',
    top: '-3%',
  },
  chakraNode: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 140, 
    left: '50%',
    transform: [{ translateX: -70 }], // tam ortalama
  },
  nodeCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 15,
    elevation: 8,
  },
  nodeLabelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  nodeTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  nodeSubtitle: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  marqueeContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    backgroundColor: 'rgba(15, 15, 25, 0.95)',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(212, 175, 55, 0.4)',
    overflow: 'hidden',
  },
  marqueeText: {
    color: COLORS.primary,
    fontSize: 14,
    fontStyle: 'italic',
    width: 2000,
    letterSpacing: 1,
  },
  topButtonsContainer: {
    position: 'absolute',
    top: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    zIndex: 10,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.2)',
  },
  guidelinesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  guidelinesText: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  headerMenuBtn: {
    padding: 5,
    marginLeft: 15,
  },
  topMenuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingTop: 90, 
    paddingRight: 20,
    alignItems: 'flex-end',
    zIndex: 100,
  },
  floatingMenuContainer: {
    backgroundColor: 'rgba(20, 25, 40, 0.95)',
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    width: 280,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  fabMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  fabMenuText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: 'bold',
  },
  fabMenuDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 15,
  },
  fabLessonsSubmenu: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingLeft: 45,
    paddingRight: 15,
    paddingVertical: 10,
    gap: 15,
  },
  fabSubItem: {
    paddingVertical: 4,
  },
  fabSubText: {
    color: COLORS.textMuted,
    fontSize: 14,
  }
});
