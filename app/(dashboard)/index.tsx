import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Animated, Easing, Image, ImageBackground } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { getMe, logout as apiLogout } from '@/src/core/api/client';
import { COLORS, SIZES } from '@/src/theme';
import { useContent } from '@/src/core/content/useContent';
import { useProgress } from '@/src/context/ProgressContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPlanetaryHours, getPlanetInfo, PlanetaryHour } from '@/src/features/astrology/engine/PlanetaryHours';
import SacredBackground from '@/components/SacredBackground';

const ESOTERIC_BG = require('@/assets/images/esoteric_bg_indigo.webp');

const { width } = Dimensions.get('window');


// İçerik Kategorileri (7 Çakra - 7 Katman)
// MODULES (ana sayfa çakra kartları) içeriği DB'den gelir (/api/content/chakras → modules)

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

const PlanetaryHourWidget = () => {
  const router = useRouter();
  const [data, setData] = useState<{ hour: PlanetaryHour, info: any, minsLeft: number } | null>(null);
  
  useFocusEffect(
    useCallback(() => {
      let interval: any;
      let isActive = true;
      
      const fetchHour = async () => {
        try {
          const savedWidget = await AsyncStorage.getItem('@show_planetary_widget');
          if (savedWidget !== 'true' && isActive) {
            setData(null);
            return;
          }

          const savedLocation = await AsyncStorage.getItem('last_planet_hours_location');
          if (!savedLocation || !isActive) return;
          const { lat, lon } = JSON.parse(savedLocation);
          
          const updateCurrent = () => {
            if (!isActive) return;
            const now = new Date();
            const { hours } = getPlanetaryHours(now, lat, lon);
            const current = hours.find((h: PlanetaryHour) => now >= h.startTime && now < h.endTime);
            
            if (current) {
              const info = getPlanetInfo(current.planet);
              const minsLeft = Math.max(0, Math.floor((current.endTime.getTime() - now.getTime()) / 60000));
              setData({ hour: current, info, minsLeft });
            } else {
              setData(null);
            }
          };
          
          updateCurrent();
          interval = setInterval(updateCurrent, 30000); // Check every 30 seconds
        } catch (e) {
          // Handle silently
        }
      };
      
      fetchHour();
      
      return () => {
        isActive = false;
        clearInterval(interval);
      };
    }, [])
  );

  if (!data) return null; // Don't show if location not set

  return (
    <TouchableOpacity 
      style={[styles.planetaryWidget, { borderColor: data.info.color }]} 
      onPress={() => router.push('/(dashboard)/kisisel-analizler/gezegen-saatleri')}
      activeOpacity={0.7}
    >
      <View style={[styles.planetIconWrapper, { backgroundColor: data.info.color + '20', borderColor: data.info.color }]}>
        <Text style={[styles.planetWidgetIcon, { color: data.info.color }]}>{data.info.symbol}</Text>
      </View>
      <View style={{ flex: 1, marginLeft: 15 }}>
        <Text style={styles.planetWidgetTitle}>Şu Anki Gezegen Saati</Text>
        <Text style={[styles.planetWidgetName, { color: data.info.color }]}>{data.info.name}</Text>
      </View>
      <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
        <Text style={styles.planetWidgetTime}>{data.minsLeft} dk kaldı</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
          <Text style={{ fontSize: 10, color: COLORS.textMuted }}>Tüm Saatler</Text>
          <Ionicons name="chevron-forward" size={12} color={COLORS.textMuted} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function DashboardScreen() {
  const router = useRouter();
  const { hasAccess } = useProgress();
  const [userName, setUserName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userTitle, setUserTitle] = useState('Arayışta');
  const [userRole, setUserRole] = useState('free');
  const [isToolsExpanded, setIsToolsExpanded] = useState(false);
  const [isLessonsExpanded, setIsLessonsExpanded] = useState(false);
  const [isTimelineExpanded, setIsTimelineExpanded] = useState(false);
  
  const currentDay = new Date().getDay(); // 0: Pazar, 1: Pzt ...
  const [selectedDay, setSelectedDay] = useState(currentDay);
  const { data: chakraData } = useContent<{ modules: any[] }>('/api/content/chakras');
  const MODULES = chakraData?.modules ?? [];
  const selectedInfo = DAY_CHAKRA_MAP[selectedDay];
  const selectedChakra = MODULES.find((m: any) => m.id === selectedInfo.chakraId);
  const { data: affirmations } = useContent<Record<number, { text: string; author: string }>>('/api/content/affirmations');
  const dailyAffirmation = (affirmations ?? {})[selectedDay];

  useEffect(() => {
    const loadUser = async () => {
      try {
        const me: any = await getMe();
        if (me?.user) {
          setUserName(me.user.fullName?.split(' ')[0] || 'Yolcu');
          setIsLoggedIn(true);
          setUserRole(me.role || 'free');
          const roleLabels: Record<string, string> = {
            free: 'Arayışta',
            apprentice: 'Çırak',
            journeyman: 'Kalfa',
            master: 'Usta',
            admin: 'Yönetici',
          };
          setUserTitle(roleLabels[me.role] || 'Arayışta');
        } else {
          setIsLoggedIn(false);
        }
      } catch {
        setIsLoggedIn(false); // misafir
      }
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    await apiLogout();
    router.replace('/(auth)/login');
  };

  const handleLogin = () => {
    router.push('/(auth)/login');
  };

  return (
    <SacredBackground>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Üst Bilgi Başlığı */}
        <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerProfile}
          onPress={() => router.push('/(dashboard)/profile')}
          activeOpacity={0.7}
        >
          <Image source={require('@/assets/images/indir.webp')} style={styles.headerAvatar} />
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
        </TouchableOpacity>
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

        <PlanetaryHourWidget />

        {/* Modüller: Anatomik Çakra Haritası */}
        <Text style={styles.sectionTitle}>7 İnisiyasyon Katmanı</Text>
        
        <View style={styles.anatomicalContainer}>
          <Image 
            source={{ uri: 'https://mbqjklupfoqbcfxusigs.supabase.co/storage/v1/object/public/app-assets/images/human_silhouette.png' }} 
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
                <Text style={[styles.guidelinesText, { color: COLORS.primaryDark }]}>Çakra Analizi</Text>
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
                style={[styles.chakraNode, { top: mod.top as any }]}
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

             {/* Kadim Uygulamalar Linki */}
             {isLoggedIn && (userRole === 'admin' || userRole === 'master') && (
               <>
                 <TouchableOpacity 
                    style={styles.fabMenuItem} 
                    onPress={() => { 
                      router.push('/(dashboard)/kadim-uygulamalar'); 
                      setIsToolsExpanded(false);
                    }}
                  >
                   <Ionicons name="flask-outline" size={20} color="#E0A96D" style={{ marginRight: 10 }} />
                   <Text style={styles.fabMenuText}>Kadim Uygulamalar</Text>
                 </TouchableOpacity>

                 <View style={styles.fabMenuDivider} />
               </>
             )}

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

             {/* Analizler Merkezi Linki */}
             <TouchableOpacity style={styles.fabMenuItem} onPress={() => { router.push('/(dashboard)/kisisel-analizler'); setIsToolsExpanded(false); }}>
               <Ionicons name="analytics" size={20} color="#FF9500" style={{ marginRight: 10 }} />
               <Text style={styles.fabMenuText}>Analizler</Text>
             </TouchableOpacity>

             <View style={styles.fabMenuDivider} />

             {/* Ay Döngüleri */}
             <TouchableOpacity style={styles.fabMenuItem} onPress={() => { router.push('/(dashboard)/kisisel-analizler/ay-donguleri'); setIsToolsExpanded(false); }}>
               <Ionicons name="moon-outline" size={20} color="#AF52DE" style={{ marginRight: 10 }} />
               <Text style={styles.fabMenuText}>Ay Döngüleri</Text>
             </TouchableOpacity>

             <View style={styles.fabMenuDivider} />

             <TouchableOpacity style={styles.fabMenuItem} onPress={() => { router.push('/(dashboard)/kisisel-analizler/gezegen-saatleri'); setIsToolsExpanded(false); }}>
               <Ionicons name="time-outline" size={20} color="#34C759" style={{ marginRight: 10 }} />
               <Text style={styles.fabMenuText}>Gezegen Saatleri</Text>
             </TouchableOpacity>

             <View style={styles.fabMenuDivider} />

             {/* Sınavlar Merkezi Linki */}
             <TouchableOpacity style={styles.fabMenuItem} onPress={() => { router.push('/(dashboard)/tests'); }}>
               <Ionicons name="school" size={20} color="#FFCC00" style={{ marginRight: 10 }} />
               <Text style={styles.fabMenuText}>Sınavlar</Text>
             </TouchableOpacity>

             <View style={styles.fabMenuDivider} />

             {/* Keşfet Linki */}
             <TouchableOpacity style={styles.fabMenuItem} onPress={() => { router.push('/(tabs)/store'); setIsToolsExpanded(false); }}>
               <Ionicons name="compass" size={20} color="#10B981" style={{ marginRight: 10 }} />
               <Text style={styles.fabMenuText}>Keşfet</Text>
             </TouchableOpacity>

             <View style={styles.fabMenuDivider} />

             {/* Profil ve Ayarlar */}
             <TouchableOpacity style={styles.fabMenuItem} onPress={() => { router.push('/(dashboard)/profile'); setIsToolsExpanded(false); }}>
               <Ionicons name="settings-outline" size={20} color="#34C759" style={{ marginRight: 10 }} />
               <Text style={styles.fabMenuText}>Profil ve Ayarlar</Text>
             </TouchableOpacity>

             <View style={styles.fabMenuDivider} />

             {/* Admin Paneli */}
             {isLoggedIn && userRole === 'admin' && (
               <>
                 <TouchableOpacity style={styles.fabMenuItem} onPress={() => { router.push('/(dashboard)/admin-dashboard'); setIsToolsExpanded(false); }}>
                   <Ionicons name="shield-checkmark-outline" size={20} color="#FFD700" style={{ marginRight: 10 }} />
                   <Text style={styles.fabMenuText}>Admin Paneli</Text>
                 </TouchableOpacity>
                 <View style={styles.fabMenuDivider} />
               </>
             )}

             {isLoggedIn ? (
               <TouchableOpacity style={[styles.fabMenuItem, { marginBottom: 10 }]} onPress={handleLogout}>
                 <Ionicons name="log-out-outline" size={20} color={COLORS.error} style={{ marginRight: 10 }} />
                 <Text style={[styles.fabMenuText, { color: COLORS.error }]}>Çıkış Yap</Text>
               </TouchableOpacity>
             ) : (
               <TouchableOpacity style={[styles.fabMenuItem, { marginBottom: 10 }]} onPress={handleLogin}>
                 <Ionicons name="log-in-outline" size={20} color={COLORS.primary} style={{ marginRight: 10 }} />
                 <Text style={[styles.fabMenuText, { color: COLORS.primary }]}>Giriş Yap</Text>
               </TouchableOpacity>
             )}

           </ScrollView>
        </TouchableOpacity>
      )}
    </SacredBackground>
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
  mainToolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(10, 10, 10, 0.7)',
    borderRadius: SIZES.radius,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  mainToolIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  mainToolTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  mainToolDesc: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 18,
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
    backgroundColor: 'rgba(10, 10, 10, 0.95)',
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
  },
  planetaryWidget: {
    flexDirection: 'row',
    backgroundColor: 'rgba(10, 10, 10, 0.7)',
    borderRadius: SIZES.radius,
    padding: 15,
    marginBottom: 25,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderTopColor: 'rgba(212, 175, 55, 0.2)',
    borderBottomColor: 'rgba(212, 175, 55, 0.2)',
    borderRightColor: 'rgba(212, 175, 55, 0.2)',
    alignItems: 'center',
  },
  planetIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  planetWidgetIcon: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  planetWidgetTitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  planetWidgetName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  planetWidgetTime: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
  }
});
