import SacredBackground from '@/components/SacredBackground';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { apiFetch } from '@/src/core/config';
import { ASTRO_CITIES } from '@/src/features/astrology/api/astrologyClient';
import { useAnalysisAccess, showAnalysisLockedAlert } from '@/src/hooks/useAnalysisAccess';

const COLORS = {
  primary: '#EAB308',
  gold: '#D4AF37',
  purple: '#A855F7',
  cyan: '#0EA5E9',
  emerald: '#10B981',
  rose: '#F43F5E',
  text: '#F3F4F6',
  textMuted: '#9CA3AF',
  cardBg: 'rgba(15, 15, 22, 0.88)',
  border: 'rgba(234, 179, 8, 0.3)',
};

export default function KariyerAnaliziScreen() {
  const router = useRouter();
  const { isUnlocked: isPurchasedOrAdmin } = useAnalysisAccess('career');

  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('12:00');
  const [cityQuery, setCityQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [activeLayer, setActiveLayer] = useState<'material' | 'soul'>('material');

  const isEffectiveUnlocked = Boolean(result?.isUnlocked || isPurchasedOrAdmin);

  // Tarih formatlayıcı (YYYY-AA-GG)
  const handleDateChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    let formatted = cleaned;
    if (cleaned.length > 4) {
      formatted = cleaned.slice(0, 4) + '-' + cleaned.slice(4);
    }
    if (cleaned.length > 6) {
      formatted = formatted.slice(0, 7) + '-' + cleaned.slice(6, 8);
    }
    setBirthDate(formatted);
  };

  // Saat formatlayıcı (SS:DD)
  const handleTimeChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    let formatted = cleaned;
    if (cleaned.length > 2) {
      formatted = cleaned.slice(0, 2) + ':' + cleaned.slice(2, 4);
    }
    setBirthTime(formatted);
  };

  // Şehir otomatik tamamlama
  useEffect(() => {
    const fetchCities = async () => {
      if (cityQuery.trim().length < 3 || selectedCity) {
        if (cityQuery.trim().length < 3) setSuggestions([]);
        return;
      }
      try {
        const res = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityQuery.trim())}&count=8&language=tr`
        );
        const data = await res.json();
        setSuggestions(data.results || []);
      } catch {
        setSuggestions([]);
      }
    };
    const timer = setTimeout(fetchCities, 350);
    return () => clearTimeout(timer);
  }, [cityQuery, selectedCity]);

  const handleCalculate = async () => {
    setError(null);

    if (!fullName.trim()) {
      setError('Lütfen Ad ve Soyadınızı giriniz.');
      return;
    }
    if (!birthDate || birthDate.length < 10) {
      setError('Lütfen Doğum Tarihinizi YYYY-AA-GG formatında giriniz.');
      return;
    }

    let resolvedCity = selectedCity;

    // Kullanıcı listeden tıklamadan şehir adını yazıp doğrudan butona bastıysa otomatik eşleştir
    if (!resolvedCity && cityQuery.trim().length >= 2) {
      const qNorm = cityQuery.split(',')[0].trim().toLocaleLowerCase('tr-TR');
      const staticMatch = ASTRO_CITIES.find(
        (c: any) =>
          c.name.toLocaleLowerCase('tr-TR') === qNorm ||
          c.name.toLocaleLowerCase('tr-TR').startsWith(qNorm)
      );
      if (staticMatch) {
        resolvedCity = {
          name: staticMatch.name,
          lat: staticMatch.lat,
          lon: staticMatch.lon,
          country: staticMatch.country || 'Türkiye',
          tz: staticMatch.tz || 'Europe/Istanbul',
        };
        setSelectedCity(resolvedCity);
      } else {
        try {
          setIsLoading(true);
          const geoRes = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
              cityQuery.split(',')[0].trim()
            )}&count=1&language=tr`
          );
          const geoData = await geoRes.json();
          if (geoData.results && geoData.results.length > 0) {
            const first = geoData.results[0];
            resolvedCity = {
              name: first.name,
              lat: first.latitude,
              lon: first.longitude,
              country: first.country || 'Türkiye',
              tz: first.timezone || 'Europe/Istanbul',
            };
            setSelectedCity(resolvedCity);
          }
        } catch {
          // yedek arama başarısızsa standart uyarıya düş
        }
      }
    }

    if (!resolvedCity) {
      setIsLoading(false);
      setError('Lütfen Doğum Yerinizi (Şehir) yazıp seçiniz.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await apiFetch('/api/astrology/career', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          birthDate,
          birthTime: birthTime || '12:00',
          birthCity: resolvedCity,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Kariyer analizi hesaplanırken bir hata oluştu.');
      }
      if (isPurchasedOrAdmin) {
        data.isUnlocked = true;
      }
      setResult(data);
    } catch (err: any) {
      setError(err?.message || 'Hesaplama sırasında beklenmeyen bir hata oluştu.');
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
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={26} color={COLORS.primary} />
            </TouchableOpacity>
            <View style={styles.headerBadge}>
              <Ionicons name="briefcase-outline" size={22} color={COLORS.primary} />
            </View>
            <Text style={styles.title}>Mesleki Yatkınlık & Kariyer</Text>
            <Text style={styles.subtitle}>
              Gezegenlerinizin, yetenek açılarınızın ve kadersel döngülerinizin senteziyle en uygun meslek alanlarınızı ve servet rotanızı keşfedin.
            </Text>
          </View>

          {error && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={18} color="#F87171" style={{ marginRight: 8 }} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {!result ? (
            <BlurView intensity={28} tint="dark" style={styles.formCard}>
              <Text style={styles.label}>Adınız ve Soyadınız</Text>
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Örn: Baha Yılmaz"
                placeholderTextColor="#6B7280"
              />

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Doğum Tarihi</Text>
                  <TextInput
                    style={styles.input}
                    value={birthDate}
                    onChangeText={handleDateChange}
                    placeholder="YYYY-AA-GG"
                    placeholderTextColor="#6B7280"
                    keyboardType="numeric"
                    maxLength={10}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Doğum Saati</Text>
                  <TextInput
                    style={styles.input}
                    value={birthTime}
                    onChangeText={handleTimeChange}
                    placeholder="12:00"
                    placeholderTextColor="#6B7280"
                    keyboardType="numeric"
                    maxLength={5}
                  />
                </View>
              </View>

              {/* Doğum Yeri — Buton ile arasında ferah boşluk bırakıldı */}
              <View style={{ marginBottom: 24, zIndex: 1000 }}>
                <Text style={styles.label}>Doğum Yeri (Şehir)</Text>
                <TextInput
                  style={styles.input}
                  value={cityQuery}
                  onChangeText={(t) => {
                    setCityQuery(t);
                    setSelectedCity(null);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Doğduğunuz şehri yazın (Örn: İstanbul)..."
                  placeholderTextColor="#6B7280"
                />
                <Text style={{ fontSize: 11.5, color: selectedCity ? '#34D399' : '#9CA3AF', marginTop: 4 }}>
                  {selectedCity
                    ? `✓ Seçilen Konum: ${selectedCity.name}, ${selectedCity.country}`
                    : 'En az 3 harf yazarak açılan listeden doğduğunuz şehri seçiniz.'}
                </Text>

                {showSuggestions && suggestions.length > 0 && (
                  <View style={styles.suggestionsBox}>
                    <ScrollView keyboardShouldPersistTaps="always" style={{ maxHeight: 165 }}>
                      {suggestions.map((item, idx) => (
                        <TouchableOpacity
                          key={`c-sug-${idx}`}
                          style={styles.suggestionRow}
                          onPress={() => {
                            const cObj = {
                              name: item.name,
                              lat: item.latitude,
                              lon: item.longitude,
                              country: item.country || 'Türkiye',
                              tz: item.timezone || 'Europe/Istanbul',
                            };
                            setSelectedCity(cObj);
                            setCityQuery(`${item.name}, ${item.country || ''}`);
                            setShowSuggestions(false);
                            Keyboard.dismiss();
                          }}
                        >
                          <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 13.5 }}>{item.name}</Text>
                          <Text style={{ color: '#9CA3AF', fontSize: 11.5 }}>
                            {item.admin1 ? `${item.admin1}, ` : ''}{item.country}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handleCalculate}
                disabled={isLoading}
                activeOpacity={0.85}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#000" />
                ) : (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Ionicons name="briefcase" size={18} color="#000" />
                    <Text style={styles.submitBtnText}>Kariyer Raporumu Çıkar</Text>
                    <Ionicons name="arrow-forward" size={16} color="#000" />
                  </View>
                )}
              </TouchableOpacity>
            </BlurView>
          ) : (
            <View style={{ gap: 14 }}>
              {/* Üst Bar: Kişi Bilgisi + Yeni Hesaplama */}
              <View style={styles.topInfoBar}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#FFF' }}>
                    {result.personalInfo?.fullName}
                  </Text>
                  <Text style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>
                    {result.personalInfo?.birthDate} • {result.personalInfo?.birthTime} • {result.personalInfo?.cityName}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.resetBtn}
                  onPress={() => setResult(null)}
                >
                  <Ionicons name="refresh" size={14} color={COLORS.primary} />
                  <Text style={styles.resetBtnText}>Yeni Analiz</Text>
                </TouchableOpacity>
              </View>

              {/* Katman Seçici: Maddi Kariyer vs Ruhsal/Drakonik Kariyer */}
              <View style={styles.layerSwitchRow}>
                <TouchableOpacity
                  style={[styles.layerBtn, activeLayer === 'material' && styles.layerBtnActiveGold]}
                  onPress={() => setActiveLayer('material')}
                >
                  <Ionicons name="briefcase" size={14} color={activeLayer === 'material' ? '#000' : COLORS.primary} />
                  <Text style={[styles.layerBtnText, activeLayer === 'material' && { color: '#000' }]}>
                    Maddi Dünya Kariyeri
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.layerBtn, activeLayer === 'soul' && styles.layerBtnActivePurple]}
                  onPress={() => setActiveLayer('soul')}
                >
                  <Ionicons name="sparkles" size={14} color={activeLayer === 'soul' ? '#FFF' : '#C084FC'} />
                  <Text style={[styles.layerBtnText, activeLayer === 'soul' && { color: '#FFF' }]}>
                    Ruhsal & İlahi Çağrı
                  </Text>
                </TouchableOpacity>
              </View>

              {activeLayer === 'material' ? (
                <>
                  {/* 1. Kozmik Kariyer Kimliği */}
                  {result.coreIdentity && (
                    <View style={styles.card}>
                      <Text style={styles.cardTag}>KOZMİK KARİYER KİMLİĞİ</Text>
                      <Text style={styles.cardHeadline}>{result.coreIdentity.archetypeTitle}</Text>
                      <Text style={styles.cardBody}>{result.coreIdentity.executiveSummary}</Text>

                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                        <View style={styles.SignatureChip}>
                          <Text style={styles.SignatureChipLabel}>MC (Tepe Noktası)</Text>
                          <Text style={styles.SignatureChipVal}>{result.coreIdentity.mcSign}</Text>
                        </View>
                        <View style={styles.SignatureChip}>
                          <Text style={styles.SignatureChipLabel}>Yükselen</Text>
                          <Text style={styles.SignatureChipVal}>{result.coreIdentity.ascSign}</Text>
                        </View>
                        <View style={styles.SignatureChip}>
                          <Text style={styles.SignatureChipLabel}>Güneş & Ay</Text>
                          <Text style={styles.SignatureChipVal}>
                            {result.coreIdentity.sunSign} / {result.coreIdentity.moonSign}
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}

                  {/* 2. En Güçlü Meslek Alanları (Top Professions) */}
                  {result.topProfessions && result.topProfessions.length > 0 && (
                    <View style={styles.card}>
                      <Text style={styles.cardTag}>ÖNE ÇIKAN MESLEKİ POTANSİYELLER</Text>
                      <Text style={styles.cardHeadline}>En Yüksek Uyumlu Kariyer Alanlarınız</Text>
                      {result.topProfessions.slice(0, isEffectiveUnlocked ? 10 : 2).map((prof: any, idx: number) => (
                        <View key={`prof-${idx}`} style={styles.subCard}>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                            <Text style={{ fontSize: 14.5, fontWeight: 'bold', color: '#FFF', flex: 1 }}>
                              {prof.title || prof.category}
                            </Text>
                            {prof.matchScore && (
                              <View style={styles.scorePill}>
                                <Text style={styles.scorePillText}>%{prof.matchScore} Uyum</Text>
                              </View>
                            )}
                          </View>
                          {prof.specificRoles && (
                            <Text style={{ fontSize: 12.5, color: COLORS.primary, fontWeight: '600', marginBottom: 4 }}>
                              Önerilen Roller: {Array.isArray(prof.specificRoles) ? prof.specificRoles.join(' • ') : prof.specificRoles}
                            </Text>
                          )}
                          <Text style={{ fontSize: 13, color: '#D1D5DB', lineHeight: 19 }}>
                            {prof.astroReason || prof.description}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* 3. Çalışma & Odak Modeli + Servet Rotası */}
                  {result.workStyle && (
                    <View style={styles.card}>
                      <Text style={styles.cardTag}>ODAK & ÇALIŞMA STRATEJİSİ</Text>
                      <Text style={styles.cardHeadline}>{result.workStyle.idealEnvironment}</Text>
                      <Text style={styles.cardBody}>{result.workStyle.leadershipStyle}</Text>
                    </View>
                  )}

                  {result.wealthBlueprint && (
                    <View style={styles.card}>
                      <Text style={[styles.cardTag, { color: COLORS.emerald }]}>MADDİ BEREKET & SERVET ROTASI</Text>
                      <Text style={styles.cardHeadline}>{result.wealthBlueprint.moneyArchetype}</Text>
                      <Text style={styles.cardBody}>{result.wealthBlueprint.incomeStrategy}</Text>
                    </View>
                  )}

                  {!isEffectiveUnlocked && (
                    <TouchableOpacity
                      style={styles.lockedBanner}
                      activeOpacity={0.85}
                      onPress={() => showAnalysisLockedAlert('Kapsamlı Kariyer Raporu Kilitli')}
                    >
                      <Ionicons name="lock-closed" size={26} color={COLORS.gold} style={{ marginBottom: 8 }} />
                      <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#FFF', textAlign: 'center', marginBottom: 6 }}>
                        7 Sektör Dağılımı, 10 Gezegen Mesleki Deşifresi ve 6 Kadim Modül Kilitlidir
                      </Text>
                      <Text style={{ fontSize: 12.5, color: '#D1D5DB', textAlign: 'center', lineHeight: 18 }}>
                        Tüm kilitli kariyer modüllerine ve indirilebilir özel PDF raporuna erişmek için kapsamlı raporunuzu aktif edebilirsiniz.
                      </Text>
                    </TouchableOpacity>
                  )}
                </>
              ) : (
                /* Ruhsal & Drakonik Kariyer Katmanı */
                result.soulCareer ? (
                  <View style={styles.card}>
                    <Text style={[styles.cardTag, { color: '#C084FC' }]}>DRAKONİK RUH HARİTASI & İLAHİ ÇAĞRI</Text>
                    <Text style={styles.cardHeadline}>
                      {result.soulCareer.soulMissionTitle || 'Ruhsal Enkarnasyon Misyonunuz'}
                    </Text>
                    <Text style={styles.cardBody}>
                      {result.soulCareer.soulCallingSummary || result.soulCareer.draconicMcInterpretation}
                    </Text>
                    {!isEffectiveUnlocked && (
                      <TouchableOpacity
                        style={[styles.lockedBanner, { marginTop: 14 }]}
                        onPress={() => showAnalysisLockedAlert('Drakonik Ruh Kariyeri Kilitli')}
                      >
                        <Ionicons name="lock-closed" size={24} color={COLORS.gold} style={{ marginBottom: 6 }} />
                        <Text style={{ fontSize: 14.5, fontWeight: 'bold', color: '#FFF', textAlign: 'center' }}>
                          Ruh & Madde Bütünsel Sentez Köprüsü Kapsamlı Rapora Dahildir
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ) : null
              )}
            </View>
          )}

          <View style={{ height: 90 }} />
        </ScrollView>
      </SacredBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingTop: Platform.OS === 'android' ? 68 : 58,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  backBtn: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: 6,
    zIndex: 10,
  },
  headerBadge: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: 'rgba(234,179,8,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(234,179,8,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 12.5,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 10,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239,68,68,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.35)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  errorText: {
    color: '#FCA5A5',
    fontSize: 13,
    flex: 1,
  },
  formCard: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: 'rgba(10,10,16,0.75)',
  },
  label: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#D1D5DB',
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: '#FFF',
  },
  suggestionsBox: {
    marginTop: 6,
    backgroundColor: '#0F172A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(234,179,8,0.4)',
    overflow: 'hidden',
  },
  suggestionRow: {
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  submitBtnText: {
    color: '#000',
    fontSize: 15,
    fontWeight: '800',
  },
  topInfoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(234,179,8,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(234,179,8,0.35)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  resetBtnText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  layerSwitchRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(15,15,22,0.9)',
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  layerBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  layerBtnActiveGold: {
    backgroundColor: COLORS.primary,
  },
  layerBtnActivePurple: {
    backgroundColor: '#7E22CE',
  },
  layerBtnText: {
    fontSize: 12.5,
    fontWeight: 'bold',
    color: '#9CA3AF',
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
  },
  cardTag: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.7,
    marginBottom: 4,
  },
  cardHeadline: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
    lineHeight: 23,
  },
  cardBody: {
    fontSize: 14,
    color: '#E5E7EB',
    lineHeight: 21,
  },
  SignatureChip: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  SignatureChipLabel: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  SignatureChipVal: {
    fontSize: 12.5,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 1,
  },
  subCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
  },
  scorePill: {
    backgroundColor: 'rgba(16,185,129,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.35)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  scorePillText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#34D399',
  },
  lockedBanner: {
    backgroundColor: 'rgba(212,175,55,0.1)',
    borderWidth: 1.5,
    borderColor: 'rgba(212,175,55,0.4)',
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
  },
});

