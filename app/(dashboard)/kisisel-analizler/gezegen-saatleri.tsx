import SacredBackground from '@/components/SacredBackground';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, ImageBackground, TouchableOpacity, TextInput, Keyboard, LayoutAnimation, UIManager, Platform, Switch, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import tzlookup from 'tz-lookup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPlanetaryHours, getPlanetInfo, PlanetaryHour } from '@/src/features/astrology/engine/PlanetaryHours';
import { COLORS, SIZES } from '@/src/theme';
import { refreshAllAlarms, addSingleAlarm, removeSingleAlarm, subscribePlanet, unsubscribePlanet } from '@/src/utils/AlarmManager';

const ESOTERIC_BG = require('@/assets/images/esoteric_bg_indigo.png');

export default function GezegenSaatleriScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [hoursData, setHoursData] = useState<{ dayHours: PlanetaryHour[], nightHours: PlanetaryHour[], sunrise: Date, sunset: Date } | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [expandedHour, setExpandedHour] = useState<string | null>(null);
  
  // Notification State
  const [notifyMinutes, setNotifyMinutes] = useState<number>(0);
  const [quietHours, setQuietHours] = useState<boolean>(true);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [activeAlarms, setActiveAlarms] = useState<string[]>([]);
  const [alarmModalVisible, setAlarmModalVisible] = useState(false);
  const [selectedAlarmHour, setSelectedAlarmHour] = useState<PlanetaryHour | null>(null);
  const [currentCoords, setCurrentCoords] = useState<{lat: number, lon: number} | null>(null);

  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const [cityInput, setCityInput] = useState('');
  const [currentLocationName, setCurrentLocationName] = useState<string | null>(null);
  const [timezone, setTimezone] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showWidget, setShowWidget] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const getNext7Days = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const datesList = getNext7Days();

  useEffect(() => {
    const loadSavedLocation = async () => {
      try {
        const savedWidget = await AsyncStorage.getItem('@show_planetary_widget');
        if (savedWidget === 'true') setShowWidget(true);
        const sMins = await AsyncStorage.getItem('@notify_minutes');
        if (sMins) setNotifyMinutes(parseInt(sMins));
        const sQuiet = await AsyncStorage.getItem('@quiet_hours');
        if (sQuiet) setQuietHours(sQuiet === 'true');
        const sAlarms = await AsyncStorage.getItem('@active_alarms');
        if (sAlarms) setActiveAlarms(JSON.parse(sAlarms));

        const savedLocation = await AsyncStorage.getItem('last_planet_hours_location');
        if (savedLocation) {
          const { lat, lon, name, tz } = JSON.parse(savedLocation);
          setCurrentCoords({lat, lon});
          setCityInput(name);
          setLoading(true);
          loadHoursFromCoords(lat, lon, name, tz, selectedDate);

          // Top up alarms
          refreshAllAlarms(lat, lon, tz).then(actives => {
            setActiveAlarms(actives);
          });
        }
      } catch (e) {}
    };
    loadSavedLocation();

    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, [selectedDate]);

  useEffect(() => {
    if (!cityInput.trim() || cityInput.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(cityInput)}`, {
          headers: {
            'User-Agent': '7LayersApp/1.0 (Contact: admin@7layers.com)',
            'Accept-Language': 'tr-TR'
          }
        });
        if (response.ok) {
          const data = await response.json();
          if (data && Array.isArray(data)) {
            setSuggestions(data.map((item: any) => ({
              displayName: item.display_name,
              lat: parseFloat(item.lat),
              lon: parseFloat(item.lon),
              shortName: item.name || item.display_name.split(',')[0]
            })));
          }
        }
      } catch (err) {
        // Fail silently for background suggestions
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchSuggestions();
    }, 600);

    return () => clearTimeout(delayDebounceFn);
  }, [cityInput]);

  const loadHoursFromCoords = (lat: number, lon: number, locationName: string, tz: string, date: Date) => {
    try {
      const data = getPlanetaryHours(date, lat, lon);
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

  const handleSelectSuggestion = (suggestion: any) => {
    const tz = tzlookup(suggestion.lat, suggestion.lon);
    const name = suggestion.shortName.toUpperCase();
    
    setCityInput(suggestion.shortName);
    setCurrentCoords({ lat: suggestion.lat, lon: suggestion.lon });
    loadHoursFromCoords(suggestion.lat, suggestion.lon, name, tz, selectedDate);
    
    AsyncStorage.setItem('last_planet_hours_location', JSON.stringify({
      lat: suggestion.lat,
      lon: suggestion.lon,
      name: name,
      tz: tz
    })).catch(() => {});
    
    setSuggestions([]);
    setShowSuggestions(false);
    Keyboard.dismiss();
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
        const name = cityInput.trim().toUpperCase();
        loadHoursFromCoords(latitude, longitude, name, tz, selectedDate);
        
        AsyncStorage.setItem('last_planet_hours_location', JSON.stringify({
          lat: latitude,
          lon: longitude,
          name: name,
          tz: tz
        })).catch(() => {});
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

  const handleSetAlarm = async (type: 'single' | 'all') => {
    if (!selectedAlarmHour || !currentCoords) return;
    
    if (type === 'single') {
      await addSingleAlarm(selectedAlarmHour.startTime.toISOString(), selectedAlarmHour.planet);
    } else {
      await subscribePlanet(selectedAlarmHour.planet);
    }
    
    const actives = await refreshAllAlarms(currentCoords.lat, currentCoords.lon, timezone || '');
    setActiveAlarms(actives);
    
    setAlarmModalVisible(false);
    setSelectedAlarmHour(null);
  };

  const handleCancelAlarm = async (type: 'single' | 'all') => {
    if (!selectedAlarmHour || !currentCoords) return;
    
    if (type === 'single') {
      await removeSingleAlarm(selectedAlarmHour.startTime.toISOString());
    } else {
      await unsubscribePlanet(selectedAlarmHour.planet);
    }
    
    const actives = await refreshAllAlarms(currentCoords.lat, currentCoords.lon, timezone || '');
    setActiveAlarms(actives);
    
    setAlarmModalVisible(false);
    setSelectedAlarmHour(null);
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
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                {isActive && (
                  <View style={styles.activeBadge}>
                    <Text style={styles.activeBadgeText}>ŞU AN</Text>
                  </View>
                )}
                <TouchableOpacity onPress={(e) => { e.stopPropagation(); setSelectedAlarmHour(hour); setAlarmModalVisible(true); }}>
                  <Ionicons 
                    name={activeAlarms.includes(hour.startTime.toISOString()) ? "notifications" : "notifications-outline"} 
                    size={24} 
                    color={activeAlarms.includes(hour.startTime.toISOString()) ? COLORS.primary : COLORS.textMuted} 
                  />
                </TouchableOpacity>
              </View>
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
    <SacredBackground>

      
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
        <View style={{ flex: 1, position: 'relative', zIndex: 100 }}>
          <TextInput
            style={[styles.searchInput, { marginRight: 0 }]}
            placeholder="Şehir Ara (örn: İstanbul)"
            placeholderTextColor={COLORS.textMuted}
            value={cityInput}
            onChangeText={(text) => {
              setCityInput(text);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onSubmitEditing={searchCity}
          />
          {showSuggestions && suggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              <ScrollView keyboardShouldPersistTaps="always" style={{ maxHeight: 200 }}>
                {suggestions.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionItem}
                    onPress={() => handleSelectSuggestion(item)}
                  >
                    <Text style={styles.suggestionText}>{item.displayName}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
        <TouchableOpacity style={[styles.searchBtn, { marginLeft: 10 }]} onPress={searchCity}>
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
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateSelector}>
            {datesList.map((d, index) => {
              const isSelected = d.getDate() === selectedDate.getDate() && d.getMonth() === selectedDate.getMonth();
              const isToday = index === 0;
              const dateStr = d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
              const dayStr = d.toLocaleDateString('tr-TR', { weekday: 'short' });
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.dateTab, isSelected && styles.dateTabActive]}
                  onPress={() => setSelectedDate(d)}
                >
                  <Text style={[styles.dateTabText, isSelected && styles.dateTabTextActive]}>{isToday ? 'Bugün' : dateStr}</Text>
                  <Text style={[styles.dateTabSubText, isSelected && styles.dateTabTextActive]}>{dayStr}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={20} color={COLORS.primary} style={{ marginRight: 8 }} />
            <Text style={styles.infoText}>
              <Text style={{fontWeight: 'bold', color: COLORS.primary}}>{currentLocationName}</Text> için <Text style={{fontWeight: 'bold'}}>{selectedDate.toLocaleDateString('tr-TR', {day: 'numeric', month: 'long', weekday: 'long'})}</Text> Gündüz saati Güneş'in doğuşuyla ({formatTime(hoursData.sunrise, timezone)}), gece saati ise Güneş'in batışıyla ({formatTime(hoursData.sunset, timezone)}) başlar.
            </Text>
          </View>

          <View style={styles.widgetToggleContainer}>
            <View style={{ flex: 1 }}>
              <Text style={styles.widgetToggleTitle}>Ana Sayfada Göster</Text>
              <Text style={styles.widgetToggleDesc}>O anki gezegen saatini ana ekranda widget olarak gösterir.</Text>
            </View>
            <Switch
              value={showWidget}
              onValueChange={async (val) => {
                setShowWidget(val);
                await AsyncStorage.setItem('@show_planetary_widget', val ? 'true' : 'false');
              }}
              trackColor={{ false: 'rgba(255,255,255,0.1)', true: COLORS.primary }}
              thumbColor={showWidget ? '#fff' : '#ccc'}
            />
          </View>

          <TouchableOpacity style={styles.widgetToggleContainer} onPress={() => setShowSettingsModal(true)}>
            <View style={{ flex: 1 }}>
              <Text style={styles.widgetToggleTitle}>Bildirim Ayarları</Text>
              <Text style={styles.widgetToggleDesc}>{notifyMinutes > 0 ? `${notifyMinutes} dk önce` : 'Tam vaktinde'} haber ver | Gece Sessizliği: {quietHours ? 'Açık' : 'Kapalı'}</Text>
            </View>
            <Ionicons name="settings-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>

          {renderHourList(hoursData.dayHours, 'Gündüz Saatleri', true)}
          {renderHourList(hoursData.nightHours, 'Gece Saatleri', false)}
          
          <View style={{height: 50}} />
        </ScrollView>
      ) : null}

      {/* Alarm Type Modal */}
      <Modal visible={alarmModalVisible} transparent animationType="slide" onRequestClose={() => setAlarmModalVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setAlarmModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Alarm Kur</Text>
            {selectedAlarmHour && (
              <Text style={styles.modalSubtitle}>{getPlanetInfo(selectedAlarmHour.planet).name} Saati ({formatTime(selectedAlarmHour.startTime, timezone)})</Text>
            )}
            
            {selectedAlarmHour && activeAlarms.includes(selectedAlarmHour.startTime.toISOString()) ? (
              <>
                <TouchableOpacity style={[styles.modalOptionBtn, {backgroundColor: 'rgba(255,59,48,0.1)'}]} onPress={() => handleCancelAlarm('single')}>
                  <Ionicons name="trash-outline" size={24} color={COLORS.error} style={{ marginRight: 10 }} />
                  <Text style={[styles.modalOptionText, {color: COLORS.error}]}>Bu Saatin Alarmını İptal Et</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalOptionBtn, {backgroundColor: 'rgba(255,59,48,0.1)'}]} onPress={() => handleCancelAlarm('all')}>
                  <Ionicons name="close-circle-outline" size={24} color={COLORS.error} style={{ marginRight: 10 }} />
                  <Text style={[styles.modalOptionText, {color: COLORS.error}]}>Bu Gezegenin Tüm Alarmlarını İptal Et</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity style={styles.modalOptionBtn} onPress={() => handleSetAlarm('single')}>
                  <Ionicons name="time-outline" size={24} color={COLORS.primary} style={{ marginRight: 10 }} />
                  <Text style={styles.modalOptionText}>Sadece Bu Saate Kur</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.modalOptionBtn} onPress={() => handleSetAlarm('all')}>
                  <Ionicons name="calendar-outline" size={24} color={COLORS.primary} style={{ marginRight: 10 }} />
                  <View>
                    <Text style={styles.modalOptionText}>Tüm Saatlere Kur (7 Gün)</Text>
                    <Text style={{fontSize: 10, color: COLORS.textMuted}}>Bu gezegenin önümüzdeki tüm saatlerine alarm kurar.</Text>
                  </View>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setAlarmModalVisible(false)}>
              <Text style={styles.modalCancelText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Settings Modal */}
      <Modal visible={showSettingsModal} transparent animationType="fade" onRequestClose={() => setShowSettingsModal(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowSettingsModal(false)}>
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <Text style={styles.modalTitle}>Bildirim Ayarları</Text>
            
            <View style={{ marginVertical: 15 }}>
              <Text style={{color: '#fff', marginBottom: 10, fontWeight: 'bold'}}>Bildirim Zamanı</Text>
              <View style={{flexDirection: 'row', gap: 10}}>
                {[0, 5, 10, 15].map(min => (
                  <TouchableOpacity 
                    key={min} 
                    style={[styles.timeOptionBtn, notifyMinutes === min && { backgroundColor: COLORS.primary }]}
                    onPress={async () => {
                      setNotifyMinutes(min);
                      await AsyncStorage.setItem('@notify_minutes', min.toString());
                    }}
                  >
                    <Text style={{color: '#fff'}}>{min === 0 ? 'Tam' : `${min} dk`}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 15, justifyContent: 'space-between' }}>
              <View style={{flex: 1, paddingRight: 15}}>
                <Text style={{color: '#fff', fontWeight: 'bold'}}>Gece Rahatsız Etme</Text>
                <Text style={{color: COLORS.textMuted, fontSize: 11, marginTop: 4}}>Açıksa, 00:00 ile 07:00 arasındaki saatlere alarm kurulmaz.</Text>
              </View>
              <Switch
                value={quietHours}
                onValueChange={async (val) => {
                  setQuietHours(val);
                  await AsyncStorage.setItem('@quiet_hours', val ? 'true' : 'false');
                }}
                trackColor={{ false: 'rgba(255,255,255,0.1)', true: COLORS.primary }}
                thumbColor={quietHours ? '#fff' : '#ccc'}
              />
            </View>

            <TouchableOpacity style={[styles.modalCancelBtn, { backgroundColor: COLORS.primary, borderWidth: 0 }]} onPress={() => setShowSettingsModal(false)}>
              <Text style={[styles.modalCancelText, {color: '#1a1f33'}]}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

    </SacredBackground>
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
  },
  dateSelector: {
    flexDirection: 'row',
    marginBottom: 20,
    paddingBottom: 5,
  },
  dateTab: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: SIZES.radius,
    marginRight: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  dateTabActive: {
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    borderColor: COLORS.primary,
  },
  dateTabText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: 'bold',
  },
  dateTabSubText: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  dateTabTextActive: {
    color: COLORS.primary,
  },
  widgetToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 25, 40, 0.7)',
    padding: 15,
    borderRadius: SIZES.radius,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  widgetToggleTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 2,
  },
  widgetToggleDesc: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1a1f33',
    padding: 25,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 5,
  },
  modalSubtitle: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 20,
  },
  modalOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: SIZES.radius,
    marginBottom: 10,
  },
  modalOptionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  modalCancelBtn: {
    marginTop: 15,
    padding: 15,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  modalCancelText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  timeOptionBtn: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: SIZES.radius,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 45,
    left: 0,
    right: 0,
    backgroundColor: '#1A1D30',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.4)',
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  suggestionText: {
    color: '#fff',
    fontSize: 14,
  }
});
