import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Keyboard
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import SacredBackground from '@/components/SacredBackground';
import { COLORS } from '@/src/theme';
import {
  analyzePersonalSymbolCodes,
  SymbolCodeAnalysisResult,
  PersonalSymbolCodeItem,
  MapLayerType
} from '@/src/features/numerology/SymbolCodeEngine';

export default function SymbolCodesMobileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ name?: string; day?: string; month?: string; year?: string }>();

  const [fullName, setFullName] = useState(params.name || 'Bahadır');
  const [day, setDay] = useState(params.day || '15');
  const [month, setMonth] = useState(params.month || '05');
  const [year, setYear] = useState(params.year || '1990');
  const [birthHour, setBirthHour] = useState('');
  const [birthMinute, setBirthMinute] = useState('');

  const [result, setResult] = useState<SymbolCodeAnalysisResult | null>(null);
  const [selectedCodeId, setSelectedCodeId] = useState<string>('karmic-debt');
  const [layerFilter, setLayerFilter] = useState<'all' | MapLayerType>('all');
  const [showAllExpanded, setShowAllExpanded] = useState<boolean>(false);

  const runAnalysis = (n: string, d: string, m: string, y: string, bh?: string, bm?: string) => {
    const cleanName = (n || 'Bahadır').trim();
    const formattedDate = `${y || '1990'}-${String(m || '05').padStart(2, '0')}-${String(d || '15').padStart(2, '0')}`;
    const timeStr = bh && bh.trim() !== '' ? `${bh.trim()}:${(bm || '00').trim()}` : undefined;
    const computed = analyzePersonalSymbolCodes(cleanName, formattedDate, timeStr);
    setResult(computed);
  };

  useEffect(() => {
    runAnalysis(fullName, day, month, year, birthHour, birthMinute);
  }, []);

  const handleCalculate = () => {
    Keyboard.dismiss();
    runAnalysis(fullName, day, month, year, birthHour, birthMinute);
  };

  const filteredCodes = result
    ? result.codes.filter((c) => (layerFilter === 'all' ? true : c.layer === layerFilter))
    : [];

  const activeCode: PersonalSymbolCodeItem | undefined =
    result?.codes.find((c) => c.id === selectedCodeId) || filteredCodes[0] || result?.codes[0];

  return (
    <SacredBackground>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            Üst Benlik Sembol & Kodlar
          </Text>
          <Text style={styles.headerSubtitle}>
            3 Harita • 12 Kişisel Kod & Eşzamanlılık Sözlüğü
          </Text>
        </View>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* GİRİŞ KARTI */}
        <View style={styles.inputCard}>
          <View style={styles.badgePill}>
            <Ionicons name="key-outline" size={13} color={COLORS.primary} />
            <Text style={styles.badgePillText}>RUH • BEDEN • KARMİK SİMYA KODLARI</Text>
          </View>

          <Text style={styles.inputLabel}>Nüfus Cüzdanındaki Tam Adınız (Ruh Haritası)</Text>
          <TextInput
            style={styles.textInput}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Örn: Ahmet Yılmaz"
            placeholderTextColor="rgba(255,255,255,0.35)"
          />

          <Text style={[styles.inputLabel, { marginTop: 12 }]}>Doğum Tarihiniz (Beden Haritası)</Text>
          <View style={styles.dateRow}>
            <TextInput
              style={[styles.dateInput, { flex: 1 }]}
              value={day}
              onChangeText={setDay}
              placeholder="GG"
              placeholderTextColor="rgba(255,255,255,0.35)"
              keyboardType="number-pad"
              maxLength={2}
            />
            <Text style={styles.dateSlash}>/</Text>
            <TextInput
              style={[styles.dateInput, { flex: 1 }]}
              value={month}
              onChangeText={setMonth}
              placeholder="AA"
              placeholderTextColor="rgba(255,255,255,0.35)"
              keyboardType="number-pad"
              maxLength={2}
            />
            <Text style={styles.dateSlash}>/</Text>
            <TextInput
              style={[styles.dateInput, { flex: 1.4 }]}
              value={year}
              onChangeText={setYear}
              placeholder="YYYY"
              placeholderTextColor="rgba(255,255,255,0.35)"
              keyboardType="number-pad"
              maxLength={4}
            />
          </View>

          <Text style={[styles.inputLabel, { color: '#2DD4BF' }]}>
            Doğum Saatiniz (Opsiyonel • İlk Nefes Kapısı & Keldani Nöbetçi Gezegen)
          </Text>
          <View style={styles.dateRow}>
            <TextInput
              style={[styles.dateInput, { flex: 1 }]}
              value={birthHour}
              onChangeText={setBirthHour}
              placeholder="Saat (Örn: 14)"
              placeholderTextColor="rgba(255,255,255,0.35)"
              keyboardType="number-pad"
              maxLength={2}
            />
            <Text style={styles.dateSlash}>:</Text>
            <TextInput
              style={[styles.dateInput, { flex: 1 }]}
              value={birthMinute}
              onChangeText={setBirthMinute}
              placeholder="Dakika (Örn: 26)"
              placeholderTextColor="rgba(255,255,255,0.35)"
              keyboardType="number-pad"
              maxLength={2}
            />
          </View>

          <TouchableOpacity style={styles.calcBtn} onPress={handleCalculate} activeOpacity={0.85}>
            <Ionicons name="sparkles" size={18} color="#000" style={{ marginRight: 8 }} />
            <Text style={styles.calcBtnText}>Kişisel Kodları & Sembolleri Çöz</Text>
          </TouchableOpacity>
        </View>

        {result && (
          <>
            {/* 3 HARİTA ÖZETİ */}
            <View style={styles.mapSummaryContainer}>
              <View style={[styles.mapSummaryBox, { borderColor: 'rgba(212,175,55,0.4)' }]}>
                <Text style={[styles.mapSummaryTitle, { color: '#D4AF37' }]}>
                  1. HARİTA • RUH HARİTASI (BRIAH)
                </Text>
                <Text style={styles.mapSummaryText}>{result.mapBalanceSummary.soulDominantNote}</Text>
              </View>

              <View style={[styles.mapSummaryBox, { borderColor: 'rgba(56,189,248,0.4)' }]}>
                <Text style={[styles.mapSummaryTitle, { color: '#38BDF8' }]}>
                  2. HARİTA • BEDEN HARİTASI (ASSIAH)
                </Text>
                <Text style={styles.mapSummaryText}>{result.mapBalanceSummary.bodyDominantNote}</Text>
              </View>

              <View style={[styles.mapSummaryBox, { borderColor: 'rgba(244,63,94,0.4)' }]}>
                <Text style={[styles.mapSummaryTitle, { color: '#F43F5E' }]}>
                  3. HARİTA • KARMİK SİMYA & AURA (YETZIRAH)
                </Text>
                <Text style={styles.mapSummaryText}>{result.mapBalanceSummary.bridgeSynthesisNote}</Text>
              </View>
            </View>

            {/* FİLTRE SEKME ÇUBUĞU */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionHeading}>Astro-Numerolojik 12 Kişisel Kodunuz</Text>
              <Text style={styles.sectionSub}>
                Detaylı ezoterik açıklamasını ve Üst Benlik sembolünü okumak için herhangi bir kod kutusuna dokunun:
              </Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterRow}
              >
                {[
                  { id: 'all', label: 'Tümü (12)' },
                  { id: 'alchemy', label: '3. Harita: Karmik & Aura (6)' },
                  { id: 'soul', label: '1. Ruh Haritası (3)' },
                  { id: 'body', label: '2. Beden Haritası (3)' }
                ].map((tab) => {
                  const active = layerFilter === tab.id;
                  return (
                    <TouchableOpacity
                      key={tab.id}
                      onPress={() => setLayerFilter(tab.id as any)}
                      style={[styles.filterChip, active && styles.filterChipActive]}
                    >
                      <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                        {tab.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}

                <TouchableOpacity
                  onPress={() => setShowAllExpanded((p) => !p)}
                  style={[
                    styles.filterChip,
                    showAllExpanded && { backgroundColor: 'rgba(16,185,129,0.2)', borderColor: '#10B981' }
                  ]}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      showAllExpanded && { color: '#6EE7B7', fontWeight: '700' }
                    ]}
                  >
                    {showAllExpanded ? 'Tek Kart Göster' : 'Tümünü Alt Alta Aç'}
                  </Text>
                </TouchableOpacity>
              </ScrollView>

              {/* 11 KOD IZGARASI */}
              <View style={styles.codesGrid}>
                {filteredCodes.map((item) => {
                  const isSelected = activeCode?.id === item.id && !showAllExpanded;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.codeGridItem,
                        isSelected && {
                          borderColor: COLORS.primary,
                          backgroundColor: 'rgba(212,175,55,0.12)'
                        }
                      ]}
                      onPress={() => {
                        setSelectedCodeId(item.id);
                        setShowAllExpanded(false);
                      }}
                      activeOpacity={0.82}
                    >
                      <Text style={[styles.codeLayerMini, { color: item.color }]} numberOfLines={1}>
                        {item.layer === 'soul'
                          ? 'RUH HARİTASI'
                          : item.layer === 'body'
                          ? 'BEDEN HARİTASI'
                          : '3. HARİTA • SİMYA'}
                      </Text>
                      <Text style={styles.codeShortTitle} numberOfLines={1}>
                        {item.shortTitle}
                      </Text>
                      <Text style={[styles.codeBigVal, { color: item.color }]} numberOfLines={1}>
                        {item.codeValue}
                      </Text>
                      <Text style={styles.codeSubLabel} numberOfLines={1}>
                        {item.subLabel}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* SEÇİLİ KODUN DERİN AÇIKLAMA KARTI */}
              {(showAllExpanded ? filteredCodes : activeCode ? [activeCode] : []).map((codeItem) => (
                <View
                  key={codeItem.id}
                  style={[styles.detailCard, { borderColor: codeItem.color + '66' }]}
                >
                  <View style={styles.detailHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.detailLayerBadge, { color: codeItem.color }]}>
                        {codeItem.layerBadge}
                      </Text>
                      <Text style={styles.detailTitle}>
                        {codeItem.title}:{' '}
                        <Text style={{ color: codeItem.color }}>{codeItem.codeValue}</Text>
                      </Text>
                      <Text style={styles.detailArchetype}>{codeItem.archetypeTitle}</Text>
                    </View>
                  </View>

                  <View style={styles.summaryBox}>
                    <Text style={styles.summaryBoxHeading}>Ezoterik Özeti</Text>
                    <Text style={styles.summaryBoxText}>{codeItem.summary}</Text>
                    <Text style={[styles.summaryBoxHeading, { color: '#38BDF8', marginTop: 10 }]}>
                      Nasıl Hesaplandı?
                    </Text>
                    <Text style={styles.summaryBoxText}>{codeItem.calculationFormula}</Text>
                  </View>

                  {codeItem.sections.map((sec, sIdx) => (
                    <View key={sIdx} style={styles.deepSectionBox}>
                      <Text style={[styles.deepSectionHeading, { color: codeItem.color }]}>
                        {sec.heading}
                      </Text>
                      <Text style={styles.deepSectionContent}>{sec.content}</Text>
                    </View>
                  ))}

                  {/* Üst Benlik Sembol & Saat Kutusu */}
                  <View style={styles.triggerBox}>
                    <Text style={styles.triggerTitle}>
                      ⚡ ÜST BENLİK SEMBOL & SAAT TETİKLEYİCİLERİ (
                      {codeItem.higherSelfTrigger.clockCodes.join(' • ')})
                    </Text>
                    <Text style={styles.triggerMeta}>
                      <Text style={{ color: '#D4AF37', fontWeight: '700' }}>Totem / Sembol: </Text>
                      {codeItem.higherSelfTrigger.totemSymbol}
                    </Text>
                    <Text style={styles.triggerMeta}>
                      <Text style={{ color: '#D4AF37', fontWeight: '700' }}>Kutsal Geometri: </Text>
                      {codeItem.higherSelfTrigger.geometricSymbol}
                    </Text>
                    <Text style={styles.triggerInstantMsg}>
                      {codeItem.higherSelfTrigger.instantMessage}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* ÜST BENLİK GÜNLÜK SEMBOL & EŞZAMANLILIK SÖZLÜĞÜ */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionHeading}>
                Üst Benlik Günlük Sembol & Saat Sözlüğü
              </Text>
              <Text style={styles.sectionSub}>
                Günlük hayatta saatlerde, plakalarda veya rüyalarda bu kişisel kodlarınızla karşılaştığınızda Üst Benliğinizin size verdiği mesajlar:
              </Text>

              {result.synchronicitySignals.map((sig, idx) => (
                <View
                  key={idx}
                  style={[styles.syncCard, { borderColor: sig.color + '55' }]}
                >
                  <View style={styles.syncHeaderRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.syncSourceTag, { color: sig.color }]}>
                        {sig.sourceCodeName}
                      </Text>
                      <Text style={styles.syncTitle}>{sig.title}</Text>
                    </View>
                    <View style={[styles.syncCodeBadge, { borderColor: sig.color }]}>
                      <Text style={[styles.syncCodeBadgeText, { color: sig.color }]}>
                        {sig.code}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.syncTotemText}>
                    Eşleşen Sembol: <Text style={{ color: '#FFF', fontWeight: '700' }}>{sig.symbolArchetype}</Text>
                  </Text>

                  <Text style={styles.syncWhenText}>{sig.whenYouSeeIt}</Text>

                  <View style={styles.syncActionBox}>
                    <Text style={styles.syncActionText}>
                      <Text style={{ fontWeight: '700', color: '#34D399' }}>Ne Yapmalısınız? </Text>
                      {sig.actionStep}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SacredBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 52,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212,175,55,0.18)'
  },
  backBtn: {
    padding: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)'
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800'
  },
  headerSubtitle: {
    color: COLORS.primary,
    fontSize: 11,
    marginTop: 2
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 60
  },
  inputCard: {
    backgroundColor: 'rgba(12,14,22,0.92)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.3)',
    marginBottom: 16
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(212,175,55,0.12)',
    borderColor: 'rgba(212,175,55,0.35)',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 12,
    gap: 6
  },
  badgePillText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6
  },
  inputLabel: {
    color: '#E5E7EB',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6
  },
  textInput: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    color: '#FFF',
    fontSize: 14
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14
  },
  dateInput: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingVertical: 10,
    textAlign: 'center',
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700'
  },
  dateSlash: {
    color: '#9CA3AF',
    fontSize: 16,
    marginHorizontal: 8
  },
  calcBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  calcBtnText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '800'
  },
  mapSummaryContainer: {
    gap: 10,
    marginBottom: 16
  },
  mapSummaryBox: {
    backgroundColor: 'rgba(15,18,28,0.9)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1
  },
  mapSummaryTitle: {
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 4,
    letterSpacing: 0.5
  },
  mapSummaryText: {
    color: '#D1D5DB',
    fontSize: 12,
    lineHeight: 18
  },
  sectionCard: {
    backgroundColor: 'rgba(12,14,22,0.94)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.28)',
    marginBottom: 18
  },
  sectionHeading: {
    color: COLORS.primary,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 4
  },
  sectionSub: {
    color: '#9CA3AF',
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 12
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 12
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    backgroundColor: 'rgba(255,255,255,0.04)'
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary
  },
  filterChipText: {
    color: '#D1D5DB',
    fontSize: 11,
    fontWeight: '600'
  },
  filterChipTextActive: {
    color: '#000',
    fontWeight: '800'
  },
  codesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 14
  },
  codeGridItem: {
    width: '48.5%',
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)'
  },
  codeLayerMini: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.4,
    marginBottom: 2
  },
  codeShortTitle: {
    color: '#9CA3AF',
    fontSize: 10,
    fontWeight: '700'
  },
  codeBigVal: {
    fontSize: 22,
    fontWeight: '900',
    marginVertical: 4
  },
  codeSubLabel: {
    color: '#9CA3AF',
    fontSize: 10
  },
  detailCard: {
    backgroundColor: 'rgba(18,21,34,0.95)',
    borderRadius: 18,
    padding: 15,
    borderWidth: 1.5,
    marginTop: 8
  },
  detailHeader: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    paddingBottom: 10,
    marginBottom: 12
  },
  detailLayerBadge: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: 4
  },
  detailTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800'
  },
  detailArchetype: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 3
  },
  summaryBox: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)'
  },
  summaryBoxHeading: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 4,
    textTransform: 'uppercase'
  },
  summaryBoxText: {
    color: '#E5E7EB',
    fontSize: 12.5,
    lineHeight: 19
  },
  deepSectionBox: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)'
  },
  deepSectionHeading: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 5
  },
  deepSectionContent: {
    color: '#D1D5DB',
    fontSize: 12.5,
    lineHeight: 19
  },
  triggerBox: {
    backgroundColor: 'rgba(212,175,55,0.1)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.35)',
    marginTop: 4
  },
  triggerTitle: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 6
  },
  triggerMeta: {
    color: '#E5E7EB',
    fontSize: 12,
    marginBottom: 3
  },
  triggerInstantMsg: {
    color: '#FEF3C7',
    fontSize: 12.5,
    lineHeight: 19,
    marginTop: 6,
    fontStyle: 'italic'
  },
  syncCard: {
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    marginBottom: 12
  },
  syncHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 8
  },
  syncSourceTag: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: 2
  },
  syncTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800'
  },
  syncCodeBadge: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(255,255,255,0.04)'
  },
  syncCodeBadgeText: {
    fontSize: 11,
    fontWeight: '900'
  },
  syncTotemText: {
    color: '#9CA3AF',
    fontSize: 11.5,
    marginBottom: 6
  },
  syncWhenText: {
    color: '#E5E7EB',
    fontSize: 12.5,
    lineHeight: 18,
    marginBottom: 8
  },
  syncActionBox: {
    backgroundColor: 'rgba(16,185,129,0.1)',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.3)'
  },
  syncActionText: {
    color: '#A7F3D0',
    fontSize: 12,
    lineHeight: 17
  }
});

