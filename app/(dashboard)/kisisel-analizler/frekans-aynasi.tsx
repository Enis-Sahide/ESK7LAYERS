import SacredBackground from '@/components/SacredBackground';
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, Modal, ActivityIndicator, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
// @ts-ignore
import tzlookup from 'tz-lookup';
import { AstroCity } from '@/src/features/astrology/api/astrologyClient';
import { apiFetch } from '@/src/core/api/client';
import { COLORS, SIZES } from '@/src/theme';

const AVAILABLE_COUNTRIES = [
  'Türkiye', 'Almanya', 'Amerika Birleşik Devletleri', 'İngiltere', 'Fransa', 
  'Hollanda', 'Avusturya', 'Belçika', 'İsviçre', 'Azerbaycan', 'Kıbrıs'
];

export default function FrekansAynasiScreen() {
  const router = useRouter();

  const [dateStr, setDateStr] = useState('');
  const [timeStr, setTimeStr] = useState('');
  const [country, setCountry] = useState('Türkiye');
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [activeConsciousness, setActiveConsciousness] = useState<any>(null);

  const dateInputRef = useRef<TextInput>(null);
  const timeInputRef = useRef<TextInput>(null);

  const [selectedCityData, setSelectedCityData] = useState<AstroCity | null>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  // Geocoding city search
  useEffect(() => {
    if (searchQuery.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    const fetchCities = async () => {
      try {
        const query = searchQuery + (country ? `, ${country}` : '');
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(query)}`, {
          headers: {
            'User-Agent': '7LayersApp/1.0 (Contact: admin@7layers.com)',
            'Accept-Language': 'tr-TR'
          }
        });
        if (response.ok) {
          const data = await response.json();
          if (data && Array.isArray(data)) {
            const mapped = data.map((item: any) => {
              const parts = item.display_name.split(',').map((s: string) => s.trim());
              const name = item.name || parts[0];
              const countryName = parts[parts.length - 1] || '';
              const admin1 = parts.length > 2 ? parts[1] : '';
              const latNum = parseFloat(item.lat);
              const lonNum = parseFloat(item.lon);
              let tz = 'Europe/Istanbul';
              try {
                tz = tzlookup(latNum, lonNum);
              } catch (e) {
                console.error("tzlookup error:", e);
              }
              return {
                name,
                lat: latNum,
                lon: lonNum,
                tz,
                country: countryName,
                admin1
              };
            });
            setSuggestions(mapped);
          }
        }
      } catch (error) {
        console.error("Geocoding Error:", error);
      }
    };

    const debounceTimer = setTimeout(fetchCities, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, country]);

  const handleDateChange = (text: string) => {
    let cleaned = text.replace(/\D/g, '');
    let formatted = '';
    if (cleaned.length > 0) formatted = cleaned.substring(0, 4);
    if (cleaned.length > 4) formatted += '-' + cleaned.substring(4, 6);
    if (cleaned.length > 6) formatted += '-' + cleaned.substring(6, 8);
    setDateStr(formatted);
    if (cleaned.length === 8) timeInputRef.current?.focus();
  };

  const handleTimeChange = (text: string) => {
    let cleaned = text.replace(/\D/g, '');
    let formatted = '';
    if (cleaned.length > 0) formatted = cleaned.substring(0, 2);
    if (cleaned.length > 2) formatted += ':' + cleaned.substring(2, 4);
    setTimeStr(formatted);
  };

  const handleCalculate = async () => {
    if (!selectedCityData) {
      Alert.alert("Eksik Bilgi", "Lütfen doğum şehri arayıp seçiniz.");
      return;
    }
    if (!dateStr || !timeStr) {
      Alert.alert("Eksik Bilgi", "Lütfen doğum tarihi ve saatini doldurunuz.");
      return;
    }

    setIsLoading(true);
    try {
      const data = await apiFetch('/api/astrology/kabbalah', {
        method: 'POST',
        body: JSON.stringify({
          localDate: dateStr,
          localTime: timeStr,
          cityData: selectedCityData
        })
      });

      if (!data.success) {
        throw new Error(data.error || "Hesaplama hatası");
      }

      const ac = data.data?.kabbalahAnalysis?.activeConsciousness;
      if (!ac) {
        throw new Error("Frekans analizi verisi oluşturulamadı.");
      }

      setActiveConsciousness(ac);
    } catch (error: any) {
      console.error('Frekans Aynası hesaplama hatası:', error);
      Alert.alert("Hata", error.message || 'Frekans aynası oluşturulurken bir hata meydana geldi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <SacredBackground>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={{ position: 'absolute', left: 0, top: 2, padding: 5 }} 
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={28} color={COLORS.primary} />
            </TouchableOpacity>
            <Text style={styles.title}>Frekans Aynası</Text>
            <Text style={styles.subtitle}>Hangi Haritanızı Çalıştırıyorsunuz?</Text>
          </View>

          {/* Form Card (When no result) */}
          {!activeConsciousness && (
            <View style={styles.formCard}>
              <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 16}}>
                <Ionicons name="sparkles" size={22} color="#0EA5E9" style={{marginRight: 8}} />
                <Text style={styles.formTitle}>Doğum Bilgilerinizi Girin</Text>
              </View>

              <Text style={styles.formDesc}>
                Canlı gökyüzü transitlerinin haritanıza uyguladığı kozmik sınavı ve tutumunuzun hangi alemi aktive ettiğini görmek için doğum bilgilerinizi girin:
              </Text>

              {/* Country Selection */}
              <Text style={styles.inputLabel}>DOĞUM ÜLKESİ</Text>
              <TouchableOpacity 
                style={styles.inputContainer} 
                onPress={() => setShowCountryModal(true)}
              >
                <Ionicons name="globe-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                <Text style={styles.inputText}>{country}</Text>
                <Ionicons name="chevron-down" size={20} color="#9CA3AF" style={{marginLeft: 'auto'}} />
              </TouchableOpacity>

              {/* City Search */}
              <Text style={styles.inputLabel}>DOĞUM ŞEHRİ</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="location-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Şehir / İlçe arayın..."
                  placeholderTextColor="#6B7280"
                  value={searchQuery}
                  onChangeText={(txt) => {
                    setSearchQuery(txt);
                    setShowSuggestions(true);
                    if (selectedCityData && selectedCityData.name !== txt) {
                      setSelectedCityData(null);
                    }
                  }}
                  onFocus={() => setShowSuggestions(true)}
                />
              </View>

              {/* City Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <View style={styles.suggestionsContainer}>
                  {suggestions.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.suggestionItem}
                      onPress={() => {
                        setSelectedCityData(item);
                        setSearchQuery(item.name + (item.admin1 ? `, ${item.admin1}` : ''));
                        setShowSuggestions(false);
                        Keyboard.dismiss();
                      }}
                    >
                      <Ionicons name="location-sharp" size={16} color={COLORS.primary} style={{marginRight: 8}} />
                      <Text style={styles.suggestionText} numberOfLines={1}>
                        {item.name} {item.admin1 ? `(${item.admin1})` : ''} - {item.country}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Date Input */}
              <Text style={styles.inputLabel}>DOĞUM TARİHİ (YYYY-AA-GG)</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="calendar-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                <TextInput
                  ref={dateInputRef}
                  style={styles.input}
                  placeholder="1990-05-15"
                  placeholderTextColor="#6B7280"
                  value={dateStr}
                  onChangeText={handleDateChange}
                  keyboardType="numeric"
                  maxLength={10}
                />
              </View>

              {/* Time Input */}
              <Text style={styles.inputLabel}>DOĞUM SAATİ (SS:DD)</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="time-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                <TextInput
                  ref={timeInputRef}
                  style={styles.input}
                  placeholder="14:30"
                  placeholderTextColor="#6B7280"
                  value={timeStr}
                  onChangeText={handleTimeChange}
                  keyboardType="numeric"
                  maxLength={5}
                />
              </View>

              <TouchableOpacity 
                style={[styles.calcButton, (!selectedCityData || !dateStr || !timeStr) && { opacity: 0.6 }]} 
                onPress={handleCalculate}
                disabled={isLoading || !selectedCityData || !dateStr || !timeStr}
              >
                {isLoading ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <>
                    <Ionicons name="sparkles" size={18} color="#000" style={{marginRight: 8}} />
                    <Text style={styles.calcButtonText}>FREKANSIMI TEŞHİS ET</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* Results: Active Consciousness & Frequency Mirror */}
          {activeConsciousness && (
            <View style={{marginTop: 8}}>
              {/* Aktif Bilinç Boyutu & Frekans Aynası Kartı */}
              <View style={styles.activeConsciousnessCard}>
                <View style={styles.acHeaderRow}>
                  <View style={styles.acBadge}>
                    <Text style={styles.acBadgeText}>CANLI GÖKYÜZÜ AYNASI</Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 6, marginBottom: 12}}>
                  <View style={styles.acIconWrap}>
                    <Ionicons name="sparkles" size={20} color="#0EA5E9" />
                  </View>
                  <View style={{flex: 1, marginLeft: 10}}>
                    <Text style={styles.acMainTitle}>Kozmik Sınav & Frekans Aynanız</Text>
                    <Text style={styles.acSubTitle}>Hangi Haritanızı Çalıştırıyorsunuz?</Text>
                  </View>
                </View>

                {/* Sınav Kutusu */}
                <View style={styles.acAdviceBox}>
                  <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 4}}>
                    <View style={styles.acChallengeBadge}>
                      <Text style={styles.acChallengeBadgeText}>GÜNCEL SINAV</Text>
                    </View>
                    <Text style={styles.acChallengeTitle}>
                      {activeConsciousness.currentTheme || activeConsciousness.title}
                    </Text>
                  </View>
                  <Text style={styles.acChallengeDesc}>
                    {activeConsciousness.cosmicChallenge || activeConsciousness.explanation}
                  </Text>
                  <View style={styles.acTriggerBox}>
                    <Text style={styles.acTriggerText}>
                      <Text style={{fontWeight: 'bold', color: '#38BDF8'}}>⚡ Tetikleyici: </Text>
                      {activeConsciousness.transitSummary || activeConsciousness.reason}
                    </Text>
                  </View>
                </View>

                {/* Frekans Aynası 4 Alem */}
                {activeConsciousness.spectrum && (
                  <View style={styles.acSpectrumContainer}>
                    <Text style={styles.acSpectrumHeading}>🪞 4 Alem Frekans Aynanız</Text>
                    <Text style={styles.acSpectrumSub}>
                      Bu sınav karşısındaki tutumunuz, o an hangi haritanızı çalıştırdığınızı gösterir:
                    </Text>

                    {/* 1. Assiah */}
                    <View style={[styles.acSpectrumCard, { borderColor: 'rgba(239, 68, 68, 0.4)', backgroundColor: 'rgba(239, 68, 68, 0.08)' }]}>
                      <View style={styles.acCardHeaderRow}>
                        <Text style={[styles.acCardTitle, { color: '#EF4444' }]}>1. Assiah (Madde)</Text>
                        <Text style={[styles.acLevelTag, { color: '#F87171', backgroundColor: 'rgba(239, 68, 68, 0.2)' }]}>REAKTİF DÜZEY</Text>
                      </View>
                      <Text style={styles.acLevelHeading}>{activeConsciousness.spectrum.assiah.title}</Text>
                      <Text style={styles.acReactionText}>{activeConsciousness.spectrum.assiah.reaction}</Text>
                      <View style={[styles.acDiagnosisBox, { borderColor: 'rgba(239, 68, 68, 0.2)' }]}>
                        <Text style={styles.acDiagnosisText}>
                          <Text style={{fontWeight: 'bold', color: '#EF4444'}}>Teşhis: </Text>
                          {activeConsciousness.spectrum.assiah.diagnosis}
                        </Text>
                      </View>
                    </View>

                    {/* 2. Yetzirah */}
                    <View style={[styles.acSpectrumCard, { borderColor: 'rgba(14, 165, 233, 0.4)', backgroundColor: 'rgba(14, 165, 233, 0.08)' }]}>
                      <View style={styles.acCardHeaderRow}>
                        <Text style={[styles.acCardTitle, { color: '#0EA5E9' }]}>2. Yetzirah (Duygu)</Text>
                        <Text style={[styles.acLevelTag, { color: '#38BDF8', backgroundColor: 'rgba(14, 165, 233, 0.2)' }]}>DUYGUSAL ŞİFA</Text>
                      </View>
                      <Text style={styles.acLevelHeading}>{activeConsciousness.spectrum.yetzirah.title}</Text>
                      <Text style={styles.acReactionText}>{activeConsciousness.spectrum.yetzirah.reaction}</Text>
                      <View style={[styles.acDiagnosisBox, { borderColor: 'rgba(14, 165, 233, 0.2)' }]}>
                        <Text style={styles.acDiagnosisText}>
                          <Text style={{fontWeight: 'bold', color: '#0EA5E9'}}>Teşhis: </Text>
                          {activeConsciousness.spectrum.yetzirah.diagnosis}
                        </Text>
                      </View>
                    </View>

                    {/* 3. Beriyah */}
                    <View style={[styles.acSpectrumCard, { borderColor: 'rgba(245, 158, 11, 0.4)', backgroundColor: 'rgba(245, 158, 11, 0.08)' }]}>
                      <View style={styles.acCardHeaderRow}>
                        <Text style={[styles.acCardTitle, { color: '#F59E0B' }]}>3. Beriyah (Zihin)</Text>
                        <Text style={[styles.acLevelTag, { color: '#FBBF24', backgroundColor: 'rgba(245, 158, 11, 0.2)' }]}>BİLGE İRADE</Text>
                      </View>
                      <Text style={styles.acLevelHeading}>{activeConsciousness.spectrum.beriyah.title}</Text>
                      <Text style={styles.acReactionText}>{activeConsciousness.spectrum.beriyah.reaction}</Text>
                      <View style={[styles.acDiagnosisBox, { borderColor: 'rgba(245, 158, 11, 0.2)' }]}>
                        <Text style={styles.acDiagnosisText}>
                          <Text style={{fontWeight: 'bold', color: '#F59E0B'}}>Teşhis: </Text>
                          {activeConsciousness.spectrum.beriyah.diagnosis}
                        </Text>
                      </View>
                    </View>

                    {/* 4. Atzilut */}
                    <View style={[styles.acSpectrumCard, { borderColor: 'rgba(168, 85, 247, 0.4)', backgroundColor: 'rgba(168, 85, 247, 0.08)' }]}>
                      <View style={styles.acCardHeaderRow}>
                        <Text style={[styles.acCardTitle, { color: '#A855F7' }]}>4. Atzilut (Kudret)</Text>
                        <Text style={[styles.acLevelTag, { color: '#C084FC', backgroundColor: 'rgba(168, 85, 247, 0.2)' }]}>KOZMİK BİRLİK</Text>
                      </View>
                      <Text style={styles.acLevelHeading}>{activeConsciousness.spectrum.atzilut.title}</Text>
                      <Text style={styles.acReactionText}>{activeConsciousness.spectrum.atzilut.reaction}</Text>
                      <View style={[styles.acDiagnosisBox, { borderColor: 'rgba(168, 85, 247, 0.2)' }]}>
                        <Text style={styles.acDiagnosisText}>
                          <Text style={{fontWeight: 'bold', color: '#A855F7'}}>Teşhis: </Text>
                          {activeConsciousness.spectrum.atzilut.diagnosis}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}

                <Text style={styles.acFootnote}>
                  ⚠️ Ezoterik İlke: Bir kriz anındaki bilinçli tutumunuz o an hangi haritanızı çalıştırdığınızı belirler. Reaksiyonunuzu korkudan (Assiah) bilgelik ve teslimiyete (Beriyah & Atzilut) yükselterek üst potansiyelinizi hayata çekebilirsiniz.
                </Text>
              </View>

              {/* Action Buttons */}
              <View style={{gap: 10, marginTop: 16}}>
                <TouchableOpacity
                  style={styles.kabbalahNavBtn}
                  onPress={() => router.push('/(dashboard)/kisisel-analizler/kabalistik-4-alem' as any)}
                >
                  <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
                    <Ionicons name="moon" size={18} color="#D4AF37" style={{marginRight: 10}} />
                    <View>
                      <Text style={{color: '#FFF', fontWeight: 'bold', fontSize: 13}}>Kabalistik 4 Alem Haritanız</Text>
                      <Text style={{color: '#9CA3AF', fontSize: 11}}>Tropikal, Drakonik, Harmonik ve Helyosentrik haritalarınız</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#D4AF37" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.reCalcBtn}
                  onPress={() => setActiveConsciousness(null)}
                >
                  <Ionicons name="refresh" size={16} color="#FFF" style={{marginRight: 6}} />
                  <Text style={{color: '#FFF', fontWeight: '600', fontSize: 13}}>Bilgileri Değiştir / Yeniden Sorgula</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

        </ScrollView>

        {/* Country Modal */}
        <Modal visible={showCountryModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Ülke Seçin</Text>
                <TouchableOpacity onPress={() => setShowCountryModal(false)}>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              <ScrollView>
                {AVAILABLE_COUNTRIES.map((item, idx) => (
                  <TouchableOpacity 
                    key={idx} 
                    style={styles.modalOption}
                    onPress={() => {
                      setCountry(item);
                      setShowCountryModal(false);
                      setSearchQuery('');
                      setSelectedCityData(null);
                    }}
                  >
                    <Text style={styles.modalOptionText}>{item}</Text>
                    {country === item && <Ionicons name="checkmark" size={20} color={COLORS.primary} />}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

      </SacredBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
    width: '100%',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#0EA5E9',
    marginTop: 4,
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: 'rgba(20, 20, 25, 0.85)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.25)',
  },
  formTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  formDesc: {
    fontSize: 12,
    color: '#9CA3AF',
    lineHeight: 18,
    marginBottom: 16,
  },
  inputLabel: {
    color: '#9CA3AF',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 14,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#FFF',
    fontSize: 14,
  },
  inputText: {
    color: '#FFF',
    fontSize: 14,
  },
  suggestionsContainer: {
    backgroundColor: 'rgba(15, 23, 42, 0.98)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginTop: -10,
    marginBottom: 14,
    maxHeight: 180,
    overflow: 'hidden',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  suggestionText: {
    color: '#FFF',
    fontSize: 13,
    flex: 1,
  },
  calcButton: {
    backgroundColor: '#0EA5E9',
    borderRadius: 14,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  calcButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  activeConsciousnessCard: {
    backgroundColor: 'rgba(14, 165, 233, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.3)',
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
  },
  acHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  acBadge: {
    backgroundColor: 'rgba(14, 165, 233, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.3)',
  },
  acBadgeText: {
    color: '#0EA5E9',
    fontSize: 10,
    fontWeight: 'bold',
  },
  acIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(14, 165, 233, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  acMainTitle: {
    color: '#0EA5E9',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  acSubTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  acAdviceBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  acChallengeBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  acChallengeBadgeText: {
    color: '#F59E0B',
    fontSize: 9,
    fontWeight: 'bold',
  },
  acChallengeTitle: {
    color: '#0EA5E9',
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
  },
  acChallengeDesc: {
    color: '#E5E7EB',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 6,
    marginBottom: 8,
  },
  acTriggerBox: {
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.2)',
  },
  acTriggerText: {
    color: '#BAE6FD',
    fontSize: 11,
    lineHeight: 16,
  },
  acSpectrumContainer: {
    marginTop: 14,
  },
  acSpectrumHeading: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  acSpectrumSub: {
    color: '#9CA3AF',
    fontSize: 11,
    lineHeight: 15,
    marginBottom: 10,
  },
  acSpectrumCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
  },
  acCardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  acCardTitle: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  acLevelTag: {
    fontSize: 9,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  acLevelHeading: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  acReactionText: {
    color: '#D1D5DB',
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 8,
  },
  acDiagnosisBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 8,
    borderWidth: 1,
    padding: 8,
  },
  acDiagnosisText: {
    color: '#E5E7EB',
    fontSize: 11,
    lineHeight: 16,
  },
  acFootnote: {
    color: '#9CA3AF',
    fontSize: 10,
    lineHeight: 15,
    marginTop: 8,
    fontStyle: 'italic',
  },
  kabbalahNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  reCalcBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.6)', 
    justifyContent: 'flex-end' 
  },
  modalContent: { 
    backgroundColor: '#FFF', 
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20, 
    height: '50%', 
    padding: 20 
  },
  modalHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 20 
  },
  modalTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#333' 
  },
  modalOption: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingVertical: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#EEE' 
  },
  modalOptionText: { 
    fontSize: 16, 
    color: '#333' 
  }
});
