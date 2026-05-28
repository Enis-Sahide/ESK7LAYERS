import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, ImageBackground, TouchableOpacity, TextInput, Keyboard, LayoutAnimation, UIManager, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import tzlookup from 'tz-lookup';
import { getPlanetaryHours, getPlanetInfo, PlanetaryHour } from '@/src/utils/PlanetaryHours';
import { COLORS, SIZES } from '@/src/theme';

const ESOTERIC_BG = require('@/assets/images/esoteric_bg_indigo.png');

export default function GezegenSaatleriScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [hoursData, setHoursData] = useState<{ dayHours: PlanetaryHour[], nightHours: PlanetaryHour[], sunrise: Date, sunset: Date } | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [expandedHour, setExpandedHour] = useState<string | null>(null);
  
  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const [cityInput, setCityInput] = useState('');
  const [currentLocationName, setCurrentLocationName] = useState<string | null>(null);
  const [timezone, setTimezone] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const loadHoursFromCoords = (lat: number, lon: number, locationName: string, tz: string) => {
    try {
      const data = getPlanetaryHours(new Date(), lat, lon);
      setHoursData({
        dayHours: data.hours.filter(h => h.isDay),
        nightHours: data.hours.filter(h => !h.isDay),
        sunrise: data.sunrise,
        sunset: data.sunset
      });
      setCurrentLocationName(locationName);
      setTimezone(tz);
      setErrorMsg(null);
    } catch (err: any) {
      setErrorMsg('Hesaplama sırasında bir hata oluştu: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const searchCity = async () => {
    if (!cityInput.trim()) return;
    Keyboard.dismiss();
    setLoading(true);
    setErrorMsg(null);
    try {
      let latitude: number | undefined;
      let longitude: number | undefined;

      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityInput)}`, {
          headers: {
            'User-Agent': '7LayersApp/1.0 (Contact: admin@7layers.com)',
            'Accept-Language': 'tr-TR'
          }
        });
        
        if (!response.ok) {
          throw new Error('Ağ hatası: Konum servisine ulaşılamadı.');
        }

        const data = await response.json();
        if (data && data.length > 0) {
          latitude = parseFloat(data[0].lat);
          longitude = parseFloat(data[0].lon);
        }

      if (latitude !== undefined && longitude !== undefined) {
        const tz = tzlookup(latitude, longitude);
        loadHoursFromCoords(latitude, longitude, cityInput.trim().toUpperCase(), tz);
      } else {
        setErrorMsg('Şehir bulunamadı. Lütfen geçerli bir şehir adı girin (örn: Istanbul).');
        setLoading(false);
      }
    } catch (err: any) {
      setErrorMsg('Arama sırasında hata oluştu: ' + err.message);
      setLoading(false);
    }
  };

  const formatTime = (date: Date, tz?: string | null) => {
    try {
      return date.toLocaleTimeString('tr-TR', { 
        hour: '2-digit', 
        minute: '2-digit',
        timeZone: tz || undefined
      });
    } catch {
      return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    }
  };

  const isCurrentHour = (start: Date, end: Date) => {
    return currentTime >= start && currentTime < end;
  };

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedHour(expandedHour === id ? null : id);
  };

  const renderHourList = (hours: PlanetaryHour[], title: string, isDayMode: boolean) => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {hours.map((hour, idx) => {
        const info = getPlanetInfo(hour.planet);
        const isActive = isCurrentHour(hour.startTime, hour.endTime);
        const id = `${isDayMode ? 'day' : 'night'}-${idx}`;
        const isExpanded = expandedHour === id;

        return (
          <TouchableOpacity 
            key={idx} 
            activeOpacity={0.8}
            onPress={() => toggleExpand(id)}
            style={[
              styles.hourCard, 
              { borderLeftColor: info.color },
              isActive && styles.activeHourCard
            ]}
          >
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={[styles.symbolContainer, { backgroundColor: info.color + '20', borderColor: info.color }]}>
                <Text style={[styles.planetSymbol, { color: info.color }]}>{info.symbol}</Text>
              </View>
              <View style={styles.hourDetails}>
                <Text style={styles.hourTime}>
                  {formatTime(hour.startTime, timezone)} - {formatTime(hour.endTime, timezone)}
                </Text>
                <Text style={[styles.planetName, { color: info.color }]}>
                  {hour.index}. Saat: {info.name}
                </Text>
              </View>
              {isActive && (
                <View style={styles.activeBadge}>
                  <Text style={styles.activeBadgeText}>ŞU AN</Text>
                </View>
              )}
            </View>
            
            {isExpanded && (
              <View style={styles.expandedContent}>
                <Text style={styles.descriptionText}>{info.description}</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <ImageBackground source={ESOTERIC_BG} style={styles.container} resizeMode="cover">
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(10, 15, 30, 0.85)' }]} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={28} color={COLORS.primary} />
        </TouchableOpacity>
        <View style={{alignItems: 'center'}}>
          <Text style={styles.headerTitle}>Gezegen Saatleri</Text>
        </View>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Şehir Ara (örn: İstanbul)"
          placeholderTextColor={COLORS.textMuted}
          value={cityInput}
          onChangeText={setCityInput}
          onSubmitEditing={searchCity}
        />
        <TouchableOpacity style={styles.searchBtn} onPress={searchCity}>
          <Ionicons name="search" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Gökyüzü haritası ve konumunuz analiz ediliyor...</Text>
        </View>
      ) : errorMsg ? (
        <View style={styles.centerContainer}>
          <Ionicons name="warning" size={48} color={COLORS.error} />
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      ) : hoursData ? (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={20} color={COLORS.primary} style={{ marginRight: 8 }} />
            <Text style={styles.infoText}>
              <Text style={{fontWeight: 'bold', color: COLORS.primary}}>{currentLocationName}</Text> için Gündüz saati Güneş'in doğuşuyla ({formatTime(hoursData.sunrise, timezone)}), gece saati ise Güneş'in batışıyla ({formatTime(hoursData.sunset, timezone)}) başlar.
            </Text>
          </View>

          {renderHourList(hoursData.dayHours, 'Gündüz Saatleri', true)}
          {renderHourList(hoursData.nightHours, 'Gece Saatleri', false)}
          
          <View style={{height: 50}} />
        </ScrollView>
      ) : null}
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
    paddingBottom: 15,
  },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary },
  
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.2)',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    paddingHorizontal: 15,
    color: COLORS.text,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  searchBtn: {
    backgroundColor: COLORS.primary,
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: COLORS.primary,
    marginTop: 15,
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    color: COLORS.error,
    marginTop: 15,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  scrollContent: {
    padding: 20,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    padding: 15,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    marginBottom: 20,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    color: COLORS.text,
    fontSize: 13,
    lineHeight: 18,
  },
  sectionContainer: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
    marginBottom: 15,
    marginLeft: 5,
  },
  hourCard: {
    flexDirection: 'column',
    backgroundColor: 'rgba(20, 25, 40, 0.7)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRightColor: 'rgba(212, 175, 55, 0.1)',
    borderTopColor: 'rgba(212, 175, 55, 0.1)',
    borderBottomColor: 'rgba(212, 175, 55, 0.1)',
  },
  activeHourCard: {
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    borderColor: 'rgba(212, 175, 55, 0.5)',
    borderLeftWidth: 6,
  },
  symbolContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  planetSymbol: {
    fontSize: 22,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  hourDetails: {
    flex: 1,
  },
  hourTime: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 4,
    fontWeight: '500',
  },
  planetName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  activeBadgeText: {
    color: '#000',
    fontSize: 10,
    fontWeight: 'bold',
  },
  expandedContent: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(212, 175, 55, 0.2)',
  },
  descriptionText: {
    color: COLORS.text,
    fontSize: 13,
    lineHeight: 20,
    fontStyle: 'italic',
  }
});
