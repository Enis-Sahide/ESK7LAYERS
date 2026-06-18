import SacredBackground from '@/components/SacredBackground';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, TextInput, Keyboard, LayoutAnimation, UIManager, Platform, Switch, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
// @ts-ignore
import tzlookup from 'tz-lookup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPlanetaryHours, getPlanetInfo, PlanetaryHour } from '@/src/features/astrology/engine/PlanetaryHours';
import { COLORS, SIZES } from '@/src/theme';
import { refreshAllAlarms, getAlarmRules, addAlarmRule, removeAlarmRule, updateAlarmRule, AlarmRule } from '@/src/utils/AlarmManager';

const REPEAT_OPTIONS = [
  { label: 'Tek sefer', value: 'once' },
  { label: 'Her zaman', value: 'always' },
  { label: 'Hiçbir zaman', value: 'never' },
  { label: 'Hafta içi', value: 'weekday' },
  { label: 'Hafta sonu', value: 'weekend' },
  { label: 'Pazartesileri', value: 'monday' },
  { label: 'Salıları', value: 'tuesday' },
  { label: 'Çarşambaları', value: 'wednesday' },
  { label: 'Perşembeleri', value: 'thursday' },
  { label: 'Cumaları', value: 'friday' },
  { label: 'Cumartesileri', value: 'saturday' },
  { label: 'Pazarları', value: 'sunday' },
];


const PLANET_OPTIONS = [
  { label: 'Satürn ♄', value: 'Saturn' },
  { label: 'Jüpiter ♃', value: 'Jupiter' },
  { label: 'Mars ♂', value: 'Mars' },
  { label: 'Güneş ☉', value: 'Sun' },
  { label: 'Venüs ♀', value: 'Venus' },
  { label: 'Merkür ☿', value: 'Mercury' },
  { label: 'Ay ☽', value: 'Moon' },
];

const MINS_OPTIONS = [
  { label: '45 dk önce', value: -45 },
  { label: '30 dk önce', value: -30 },
  { label: '20 dk önce', value: -20 },
  { label: '15 dk önce', value: -15 },
  { label: '10 dk önce', value: -10 },
  { label: '5 dk önce', value: -5 },
  { label: 'Tam vaktinde', value: 0 },
  { label: '5 dk sonra', value: 5 },
  { label: '10 dk sonra', value: 10 },
  { label: '15 dk sonra', value: 15 },
  { label: '20 dk sonra', value: 20 },
  { label: '30 dk sonra', value: 30 },
  { label: '45 dk sonra', value: 45 },
];

export default function GezegenSaatleriScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [hoursData, setHoursData] = useState<{ dayHours: PlanetaryHour[], nightHours: PlanetaryHour[], sunrise: Date, sunset: Date } | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [expandedHour, setExpandedHour] = useState<string | null>(null);
  
  // Rules and Settings State
  const [alarmRules, setAlarmRules] = useState<AlarmRule[]>([]);
  const [quietHours, setQuietHours] = useState<boolean>(true);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [activeAlarms, setActiveAlarms] = useState<string[]>([]);
  const [currentCoords, setCurrentCoords] = useState<{lat: number, lon: number} | null>(null);

  // Reusable custom picker state
  const [customPickerVisible, setCustomPickerVisible] = useState(false);
  const [customPickerTitle, setCustomPickerTitle] = useState('');
  const [customPickerOptions, setCustomPickerOptions] = useState<{ label: string, value: any }[]>([]);
  const [customPickerSelectedValue, setCustomPickerSelectedValue] = useState<any>(null);
  const [customPickerCallback, setCustomPickerCallback] = useState<(value: any) => void>(() => {});

  // Add Alarm State
  const [showAddAlarmModal, setShowAddAlarmModal] = useState(false);
  const [newAlarmPlanet, setNewAlarmPlanet] = useState('Jupiter');
  const [newAlarmOffset, setNewAlarmOffset] = useState(0);
  const [newAlarmRepeat, setNewAlarmRepeat] = useState<'once' | 'always' | 'never' | 'weekday' | 'weekend' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'>('always');

  // Planet specific alarms modal state
  const [planetAlarmsModalVisible, setPlanetAlarmsModalVisible] = useState(false);
  const [selectedPlanetForAlarms, setSelectedPlanetForAlarms] = useState('Jupiter');

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

  const loadRules = async () => {
    try {
      const rules = await getAlarmRules();
      setAlarmRules(rules);
    } catch (e) {}
  };

  useEffect(() => {
    const loadSavedLocation = async () => {
      try {
        const savedWidget = await AsyncStorage.getItem('@show_planetary_widget');
        if (savedWidget === 'true') setShowWidget(true);
        const sQuiet = await AsyncStorage.getItem('@quiet_hours');
        if (sQuiet) setQuietHours(sQuiet === 'true');
        const sAlarms = await AsyncStorage.getItem('@active_alarms');
        if (sAlarms) setActiveAlarms(JSON.parse(sAlarms));

        await loadRules();

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

  const openCustomPicker = (
    title: string,
    options: { label: string, value: any }[],
    currentVal: any,
    callback: (val: any) => void
  ) => {
    setCustomPickerTitle(title);
    setCustomPickerOptions(options);
    setCustomPickerSelectedValue(currentVal);
    setCustomPickerCallback(() => callback);
    setCustomPickerVisible(true);
  };

  const handleCreateRule = async () => {
    try {
      await addAlarmRule({
        planet: newAlarmPlanet,
        offsetMinutes: newAlarmOffset,
        repeatType: newAlarmRepeat,
        actionType: 'notify',
      });
      await loadRules();
      if (currentCoords) {
        const actives = await refreshAllAlarms(currentCoords.lat, currentCoords.lon, timezone || '');
        setActiveAlarms(actives);
      }
      setShowAddAlarmModal(false);
    } catch (err) {}
  };

  const handleDeleteRule = async (id: string) => {
    try {
      await removeAlarmRule(id);
      await loadRules();
      if (currentCoords) {
        const actives = await refreshAllAlarms(currentCoords.lat, currentCoords.lon, timezone || '');
        setActiveAlarms(actives);
      }
    } catch (err) {}
  };

  const handleUpdateRule = async (id: string, updates: Partial<AlarmRule>) => {
    try {
      await updateAlarmRule(id, updates);
      await loadRules();
      if (currentCoords) {
        const actives = await refreshAllAlarms(currentCoords.lat, currentCoords.lon, timezone || '');
        setActiveAlarms(actives);
      }
    } catch (err) {}
  };

  const handleQuietHoursChange = async (val: boolean) => {
    setQuietHours(val);
    await AsyncStorage.setItem('@quiet_hours', val ? 'true' : 'false');
    if (currentCoords) {
      const actives = await refreshAllAlarms(currentCoords.lat, currentCoords.lon, timezone || '');
      setActiveAlarms(actives);
    }
  };

  const renderHourList = (hours: PlanetaryHour[], title: string, isDayMode: boolean) => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {hours.map((hour, idx) => {
        const info = getPlanetInfo(hour.planet);
        const isActive = isCurrentHour(hour.startTime, hour.endTime);
        const id = `${isDayMode ? 'day' : 'night'}-${idx}`;
        const isExpanded = expandedHour === id;

        // Check if there are active rules for this planet
        const planetRules = alarmRules.filter(r => r.planet === hour.planet && r.repeatType !== 'never');
        const hasRule = planetRules.length > 0;

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
                <TouchableOpacity 
                  onPress={(e) => { 
                    e.stopPropagation(); 
                    setSelectedPlanetForAlarms(hour.planet);
                    setPlanetAlarmsModalVisible(true); 
                  }}
                  style={{ padding: 6 }}
                >
                  <Ionicons 
                    name={hasRule ? "notifications" : "notifications-outline"} 
                    size={24} 
                    color={hasRule ? COLORS.primary : COLORS.textMuted} 
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
              <Text style={styles.widgetToggleDesc}>Kurulu alarmları buradan yönetin.</Text>
            </View>
            <Ionicons name="settings-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>

          {renderHourList(hoursData.dayHours, 'Gündüz Saatleri', true)}
          {renderHourList(hoursData.nightHours, 'Gece Saatleri', false)}
          
          <View style={{height: 50}} />
        </ScrollView>
      ) : null}

      {/* Settings Modal (Bildirim Ayarları) */}
      <Modal visible={showSettingsModal} transparent animationType="slide" onRequestClose={() => setShowSettingsModal(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowSettingsModal(false)}>
          <View style={[styles.modalContent, { height: '80%' }]} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Bildirim Ayarları</Text>
              <TouchableOpacity onPress={() => setShowSettingsModal(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, marginTop: 10 }}>
              {/* Gece Rahatsız Etme */}
              <View style={styles.quietHoursContainer}>
                <View style={{ flex: 1, paddingRight: 15 }}>
                  <Text style={styles.sectionSubTitle}>Gece Rahatsız Etme</Text>
                  <Text style={styles.sectionDesc}>Açıksa, 00:00 ile 07:00 arasındaki saatlere alarm kurulmaz.</Text>
                </View>
                <Switch
                  value={quietHours}
                  onValueChange={handleQuietHoursChange}
                  trackColor={{ false: 'rgba(255,255,255,0.1)', true: COLORS.primary }}
                  thumbColor={quietHours ? '#fff' : '#ccc'}
                />
              </View>

              {/* Rules List Title */}
              <View style={styles.rulesListHeader}>
                <Text style={styles.rulesListTitle}>Aktif Alarmlar</Text>
                <TouchableOpacity 
                  style={styles.rulesAddMiniBtn} 
                  onPress={() => {
                    setNewAlarmPlanet('Jupiter');
                    setNewAlarmOffset(0);
                    setNewAlarmRepeat('always');
                    setShowAddAlarmModal(true);
                  }}
                >
                  <Ionicons name="add" size={16} color="#000" />
                  <Text style={styles.rulesAddMiniBtnText}>Ekle</Text>
                </TouchableOpacity>
              </View>

              {/* Rules List */}
              {alarmRules.length === 0 ? (
                <View style={styles.emptyStateContainer}>
                  <Ionicons name="notifications-off-outline" size={48} color={COLORS.textMuted} />
                  <Text style={styles.emptyStateText}>Henüz bir alarm eklemediniz.</Text>
                  <Text style={styles.emptyStateSubtext}>Belirli bir gezegen saati geldiğinde haberdar olmak için yeni bir alarm ekleyin.</Text>
                </View>
              ) : (
                alarmRules.map((rule) => {
                  const info = getPlanetInfo(rule.planet);
                  const repeatLabel = REPEAT_OPTIONS.find(o => o.value === rule.repeatType)?.label || rule.repeatType;
                  
                  let offsetLabel = 'Tam vaktinde';
                  if (rule.offsetMinutes < 0) offsetLabel = `${Math.abs(rule.offsetMinutes)} dk önce`;
                  if (rule.offsetMinutes > 0) offsetLabel = `${rule.offsetMinutes} dk sonra`;

                  return (
                    <View key={rule.id} style={[styles.ruleCard, { borderLeftColor: info.color }]}>
                      <View style={styles.ruleCardHeader}>
                        <View style={styles.ruleCardTitleGroup}>
                          <View style={[styles.rulePlanetSymbolBg, { backgroundColor: info.color + '20' }]}>
                            <Text style={[styles.rulePlanetSymbol, { color: info.color }]}>{info.symbol}</Text>
                          </View>
                          <Text style={styles.ruleCardTitle}>{info.name} Saati</Text>
                        </View>
                        <TouchableOpacity style={styles.ruleDeleteBtn} onPress={() => handleDeleteRule(rule.id)}>
                          <Ionicons name="trash-outline" size={20} color={COLORS.error} />
                        </TouchableOpacity>
                      </View>

                      <View style={styles.ruleDetailsContainer}>
                        {/* Offset Edit */}
                        <TouchableOpacity 
                          style={styles.ruleDetailItem} 
                          onPress={() => openCustomPicker('Bildirim Zamanı', MINS_OPTIONS, rule.offsetMinutes, (val) => handleUpdateRule(rule.id, { offsetMinutes: val }))}
                        >
                          <Ionicons name="time-outline" size={14} color={COLORS.primary} />
                          <Text style={styles.ruleDetailText}>{offsetLabel}</Text>
                          <Ionicons name="chevron-down" size={12} color={COLORS.textMuted} />
                        </TouchableOpacity>

                        {/* Repeat Edit */}
                        <TouchableOpacity 
                          style={styles.ruleDetailItem} 
                          onPress={() => openCustomPicker('Tekrar Ayarı', REPEAT_OPTIONS, rule.repeatType, (val) => handleUpdateRule(rule.id, { repeatType: val }))}
                        >
                          <Ionicons name="calendar-outline" size={14} color={COLORS.primary} />
                          <Text style={styles.ruleDetailText}>{repeatLabel}</Text>
                          <Ionicons name="chevron-down" size={12} color={COLORS.textMuted} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })
              )}
              <View style={{ height: 30 }} />
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Add Alarm Modal */}
      <Modal visible={showAddAlarmModal} transparent animationType="fade" onRequestClose={() => setShowAddAlarmModal(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowAddAlarmModal(false)}>
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Yeni Alarm</Text>
              <TouchableOpacity onPress={() => setShowAddAlarmModal(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Planet Field */}
            <View style={styles.modalFormGroup}>
              <Text style={styles.modalFormLabel}>Gezegen Saati</Text>
              <TouchableOpacity 
                style={styles.modalDropdown} 
                onPress={() => openCustomPicker('Gezegen Seçin', PLANET_OPTIONS, newAlarmPlanet, setNewAlarmPlanet)}
              >
                <Text style={styles.modalDropdownText}>
                  {PLANET_OPTIONS.find(o => o.value === newAlarmPlanet)?.label || 'Seçin'}
                </Text>
                <Ionicons name="chevron-down" size={16} color={COLORS.primary} />
              </TouchableOpacity>
            </View>

            {/* Offset Field */}
            <View style={styles.modalFormGroup}>
              <Text style={styles.modalFormLabel}>Bildirim Zamanı</Text>
              <TouchableOpacity 
                style={styles.modalDropdown} 
                onPress={() => openCustomPicker('Bildirim Zamanı', MINS_OPTIONS, newAlarmOffset, setNewAlarmOffset)}
              >
                <Text style={styles.modalDropdownText}>
                  {MINS_OPTIONS.find(o => o.value === newAlarmOffset)?.label || 'Seçin'}
                </Text>
                <Ionicons name="chevron-down" size={16} color={COLORS.primary} />
              </TouchableOpacity>
            </View>

            {/* Repeat Field */}
            <View style={styles.modalFormGroup}>
              <Text style={styles.modalFormLabel}>Tekrar Ayarı</Text>
              <TouchableOpacity 
                style={styles.modalDropdown} 
                onPress={() => openCustomPicker('Tekrar Ayarı', REPEAT_OPTIONS, newAlarmRepeat, setNewAlarmRepeat)}
              >
                <Text style={styles.modalDropdownText}>
                  {REPEAT_OPTIONS.find(o => o.value === newAlarmRepeat)?.label || 'Seçin'}
                </Text>
                <Ionicons name="chevron-down" size={16} color={COLORS.primary} />
              </TouchableOpacity>
            </View>


            {/* Save Button */}
            <TouchableOpacity style={styles.modalSaveBtn} onPress={handleCreateRule}>
              <Text style={styles.modalSaveBtnText}>Kaydet ve Kur</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Planet Alarms Modal (Gezegen Özelinde Alarmlar) */}
      <Modal visible={planetAlarmsModalVisible} transparent animationType="slide" onRequestClose={() => setPlanetAlarmsModalVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setPlanetAlarmsModalVisible(false)}>
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>
                {getPlanetInfo(selectedPlanetForAlarms).name} Saati Alarmları
              </Text>
              <TouchableOpacity onPress={() => setPlanetAlarmsModalVisible(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: 15, marginBottom: 20 }}>
              {alarmRules.filter(r => r.planet === selectedPlanetForAlarms).length === 0 ? (
                <View style={{ alignItems: 'center', paddingVertical: 20 }}>
                  <Ionicons name="notifications-outline" size={48} color={COLORS.textMuted} style={{ marginBottom: 10 }} />
                  <Text style={{ color: '#fff', textAlign: 'center', marginBottom: 15 }}>
                    Bu gezegen için aktif bir alarm bulunmamaktadır.
                  </Text>
                  <TouchableOpacity 
                    style={[styles.modalSaveBtn, { width: '100%' }]} 
                    onPress={() => {
                      setNewAlarmPlanet(selectedPlanetForAlarms);
                      setNewAlarmOffset(0);
                      setNewAlarmRepeat('always');
                      setPlanetAlarmsModalVisible(false);
                      setShowAddAlarmModal(true);
                    }}
                  >
                    <Text style={styles.modalSaveBtnText}>+ Alarm Ekle</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  {alarmRules.filter(r => r.planet === selectedPlanetForAlarms).map(rule => {
                    const repeatLabel = REPEAT_OPTIONS.find(o => o.value === rule.repeatType)?.label || rule.repeatType;
                    
                    let offsetLabel = 'Tam vaktinde';
                    if (rule.offsetMinutes < 0) offsetLabel = `${Math.abs(rule.offsetMinutes)} dk önce`;
                    if (rule.offsetMinutes > 0) offsetLabel = `${rule.offsetMinutes} dk sonra`;

                    return (
                      <View key={rule.id} style={styles.compactRuleRow}>
                        <View style={{ flex: 1 }}>
                          <Text style={{ color: '#fff', fontWeight: 'bold' }}>{offsetLabel}</Text>
                          <Text style={{ color: COLORS.textMuted, fontSize: 12 }}>{repeatLabel}</Text>
                        </View>
                        <TouchableOpacity style={styles.ruleDeleteBtn} onPress={() => handleDeleteRule(rule.id)}>
                          <Ionicons name="trash-outline" size={18} color={COLORS.error} />
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                  
                  <TouchableOpacity 
                    style={[styles.modalSaveBtn, { width: '100%', marginTop: 15, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.4)' }]} 
                    onPress={() => {
                      setNewAlarmPlanet(selectedPlanetForAlarms);
                      setNewAlarmOffset(0);
                      setNewAlarmRepeat('always');
                      setPlanetAlarmsModalVisible(false);
                      setShowAddAlarmModal(true);
                    }}
                  >
                    <Text style={[styles.modalSaveBtnText, { color: COLORS.primary }]}>+ Yeni Alarm Ekle</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setPlanetAlarmsModalVisible(false)}>
              <Text style={styles.modalCancelText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Reusable Custom Picker Modal */}
      <Modal visible={customPickerVisible} transparent animationType="fade" onRequestClose={() => setCustomPickerVisible(false)}>
        <TouchableOpacity style={styles.pickerOverlay} activeOpacity={1} onPress={() => setCustomPickerVisible(false)}>
          <View style={styles.pickerContent} onStartShouldSetResponder={() => true}>
            <Text style={styles.pickerTitle}>{customPickerTitle}</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              {customPickerOptions.map((item, index) => {
                const isSelected = item.value === customPickerSelectedValue;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.pickerOption, isSelected && styles.pickerOptionSelected]}
                    onPress={() => {
                      customPickerCallback(item.value);
                      setCustomPickerVisible(false);
                    }}
                  >
                    <Text style={[styles.pickerOptionText, isSelected && styles.pickerOptionTextSelected]}>
                      {item.label}
                    </Text>
                    {isSelected && <Ionicons name="checkmark" size={20} color={COLORS.primary} />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <TouchableOpacity style={styles.pickerCloseBtn} onPress={() => setCustomPickerVisible(false)}>
              <Text style={styles.pickerCloseBtnText}>İptal</Text>
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
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  quietHoursContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  sectionSubTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  sectionDesc: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 4,
  },
  rulesListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 5,
  },
  rulesListTitle: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  rulesAddMiniBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  rulesAddMiniBtnText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyStateContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderStyle: 'dashed',
  },
  emptyStateText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
  ruleCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  ruleCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  ruleCardTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rulePlanetSymbolBg: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rulePlanetSymbol: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  ruleCardTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  ruleDeleteBtn: {
    padding: 4,
  },
  ruleDetailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  ruleDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  ruleDetailText: {
    color: '#fff',
    fontSize: 11,
  },
  modalFormGroup: {
    marginBottom: 15,
  },
  modalFormLabel: {
    color: COLORS.textMuted,
    fontSize: 13,
    marginBottom: 6,
  },
  modalDropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  modalDropdownText: {
    color: '#fff',
    fontSize: 14,
  },
  modalSaveBtn: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  modalSaveBtnText: {
    color: '#000',
    fontSize: 15,
    fontWeight: 'bold',
  },
  compactRuleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  pickerContent: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#1a1f33',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.4)',
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 15,
    textAlign: 'center',
  },
  pickerOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 4,
  },
  pickerOptionSelected: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  pickerOptionText: {
    color: '#fff',
    fontSize: 14,
  },
  pickerOptionTextSelected: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  pickerCloseBtn: {
    marginTop: 15,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  pickerCloseBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
