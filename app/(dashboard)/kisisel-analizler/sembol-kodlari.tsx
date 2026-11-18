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
  PersonalSymbolCodeItem
} from '@/src/features/numerology/SymbolCodeEngine';

export default function SymbolCodesMobileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ name?: string; day?: string; month?: string; year?: string }>();

  const [fullName, setFullName] = useState(params.name || 'Bahadır');
  const [day, setDay] = useState(params.day || '17');
  const [month, setMonth] = useState(params.month || '03');
  const [year, setYear] = useState(params.year || '1995');
  const [birthHour, setBirthHour] = useState('');
  const [birthMinute, setBirthMinute] = useState('');

  const [result, setResult] = useState<SymbolCodeAnalysisResult | null>(null);
  const [activeMapStage, setActiveMapStage] = useState<'stage1_body' | 'stage2_upper'>('stage1_body');
  const [selectedStage1Id, setSelectedStage1Id] = useState<string>('body-karmic-soul');
  const [selectedStage2Id, setSelectedStage2Id] = useState<string>('soul-urge');
  const [showAllExpanded, setShowAllExpanded] = useState<boolean>(false);

  const runAnalysis = (n: string, d: string, m: string, y: string, bh?: string, bm?: string) => {
    const cleanName = (n || 'Bahadır').trim();
    const formattedDate = `${y || '1995'}-${String(m || '03').padStart(2, '0')}-${String(d || '17').padStart(2, '0')}`;
    const timeStr = bh && bh.trim() !== '' ? `${bh.trim()}:${(bm || '00').trim()}` : undefined;
    const computed = analyzePersonalSymbolCodes(cleanName, formattedDate, timeStr);
    setResult(computed);
    if (timeStr) {
      setSelectedStage1Id('birth-time-portal');
    }
  };

  useEffect(() => {
    runAnalysis(fullName, day, month, year, birthHour, birthMinute);
  }, []);

  const handleCalculate = () => {
    Keyboard.dismiss();
    runAnalysis(fullName, day, month, year, birthHour, birthMinute);
  };

  const stage1BodyCodes = result
    ? [
        result.codes.find((c) => c.id === 'body-karmic-soul'),
        result.codes.find((c) => c.id === 'body-field-code'),
        result.codes.find((c) => c.id === 'karmic-debt'),
        result.codes.find((c) => c.id === 'birth-code'),
        result.codes.find((c) => c.id === 'life-path'),
        result.codes.find((c) => c.id === 'planet-ruler'),
        result.codes.find((c) => c.id === 'birth-time-portal')
      ].filter((c): c is PersonalSymbolCodeItem => Boolean(c))
    : [];

  const stage2UpperCodes = result
    ? [
        result.codes.find((c) => c.id === 'soul-urge'),
        result.codes.find((c) => c.id === 'aura-protection'),
        result.codes.find((c) => c.id === 'bridge-code'),
        result.codes.find((c) => c.id === 'chaldean-compound'),
        result.codes.find((c) => c.id === 'maturity-code'),
        result.codes.find((c) => c.id === 'upper-planet-ruler'),
        result.codes.find((c) => c.id === 'outer-persona'),
        result.codes.find((c) => c.id === 'hidden-passion'),
        result.codes.find((c) => c.id === 'subconscious-self')
      ].filter((c): c is PersonalSymbolCodeItem => Boolean(c))
    : [];

  const renderDetailCard = (codeItem: PersonalSymbolCodeItem) => (
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
        <Text style={styles.summaryBoxHeading}>Bu Kod Sizin İçin Ne Anlama Geliyor?</Text>
        <Text style={styles.summaryBoxText}>{codeItem.summary}</Text>
      </View>

      {codeItem.sections.map((sec, sIdx) => (
        <View key={sIdx} style={styles.deepSectionBox}>
          <Text style={[styles.deepSectionHeading, { color: codeItem.color }]}>
            {sec.heading}
          </Text>
          <Text style={styles.deepSectionContent}>{sec.content}</Text>
        </View>
      ))}

      <View style={styles.triggerBox}>
        <Text style={styles.triggerTitle}>
          🏛️ KADİM KAYNAK SEMBOL & KUTSAL GEOMETRİ KARŞILIĞI
        </Text>
        <Text style={styles.triggerMeta}>
          <Text style={{ color: '#D4AF37', fontWeight: '700' }}>Kadim Sembol: </Text>
          {codeItem.higherSelfTrigger.totemSymbol}
        </Text>
        <Text style={styles.triggerMeta}>
          <Text style={{ color: '#D4AF37', fontWeight: '700' }}>Kutsal Geometri: </Text>
          {codeItem.higherSelfTrigger.geometricSymbol}
        </Text>
      </View>
    </View>
  );

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
            1. Harita (Beden) ➡️ 3. Harita (Üst Bilinç)
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
            <Text style={styles.badgePillText}>1. HARİTA ➡️ 3. HARİTA KOD DÖNÜŞÜMÜ</Text>
          </View>

          <Text style={styles.inputLabel}>Nüfus Cüzdanındaki Tam Adınız (İsim Katmanı)</Text>
          <TextInput
            style={styles.textInput}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Örn: Ahmet Yılmaz"
            placeholderTextColor="rgba(255,255,255,0.35)"
          />

          <Text style={[styles.inputLabel, { marginTop: 12 }]}>Doğum Tarihiniz (Beden Katmanı)</Text>
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
            {/* HARİTA AŞAMASI SEÇİCİ */}
            <View style={[styles.sectionCard, { borderColor: 'rgba(212,175,55,0.45)' }]}>
              <Text style={[styles.sectionPill, { color: COLORS.primary }]}>
                HANGİ HARİTAYI ÇALIŞTIRIYORSUNUZ? • AKTİF KOD SEÇİCİ
              </Text>
              <Text style={styles.sectionHeading}>
                Çalıştırdığınız Haritaya Göre Aldığınız Mesajlar Değişir
              </Text>

              <TouchableOpacity
                style={[
                  styles.stageBtn,
                  activeMapStage === 'stage1_body' && styles.stageBtnActiveSky
                ]}
                onPress={() => setActiveMapStage('stage1_body')}
                activeOpacity={0.85}
              >
                <Text style={[styles.stageBtnBadge, { color: '#38BDF8' }]}>
                  1. AŞAMA • VARSAYILAN AKTİF HARİTA {activeMapStage === 'stage1_body' ? ' (AÇIK ●)' : ''}
                </Text>
                <Text style={styles.stageBtnTitle}>
                  1. Harita — Beden Haritası Kodlarınız
                </Text>
                <Text style={styles.stageBtnDesc}>
                  3. Haritanızı çalıştırmadığınız sürece saatlerde ve sembollerde mesaj olarak alacağınız 5 Çekirdek Beden Kodu (Ruh: {result.summaryMetrics.embeddedRuhKodu}, Alan: {result.summaryMetrics.birthMatrixFieldCode}, Karmik: {result.summaryMetrics.primaryKarmicCode}, Doğum: {result.summaryMetrics.lifePathCode}, Gezegen: {result.summaryMetrics.lifePathPlanetName}).
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.stageBtn,
                  activeMapStage === 'stage2_upper' && styles.stageBtnActiveGold
                ]}
                onPress={() => setActiveMapStage('stage2_upper')}
                activeOpacity={0.85}
              >
                <Text style={[styles.stageBtnBadge, { color: COLORS.primary }]}>
                  2. AŞAMA • ÜST HARİTA AKTİVASYONU {activeMapStage === 'stage2_upper' ? ' (AÇIK ●)' : ''}
                </Text>
                <Text style={styles.stageBtnTitle}>
                  3. Harita — Üst Haritayı Çalıştırınca Değişen Yeni Kodlarınız
                </Text>
                <Text style={styles.stageBtnDesc}>
                  Beden Haritasındaki Alan Koruma ({result.summaryMetrics.birthMatrixFieldCode}) ve Karmik Kilit ({result.summaryMetrics.primaryKarmicCode}) sınavlarını aşıp 3. Haritanızı çalıştırmaya başladığınızda devreye giren yeni kodlarınız.
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowAllExpanded((p) => !p)}
                style={[
                  styles.expandAllBanner,
                  showAllExpanded && { borderColor: '#10B981', backgroundColor: 'rgba(16,185,129,0.15)' }
                ]}
              >
                <Ionicons
                  name={showAllExpanded ? 'contract-outline' : 'book-outline'}
                  size={16}
                  color={showAllExpanded ? '#6EE7B7' : COLORS.primary}
                />
                <Text style={styles.expandAllBannerText}>
                  {showAllExpanded
                    ? 'Tek Kart Görünümüne Dön'
                    : 'Bu Aşamadaki Tüm Kodların Açıklamasını Aç'}
                </Text>
              </TouchableOpacity>
            </View>

            {activeMapStage === 'stage1_body' ? (
              <>
                {/* 1. HARİTA (BEDEN HARİTASI) KODLARI */}
                <View style={[styles.sectionCard, { borderColor: 'rgba(56,189,248,0.4)' }]}>
                  <Text style={[styles.sectionPill, { color: '#38BDF8' }]}>
                    1. HARİTA (BEDEN HARİTASI) • 3. HARİTAYI ÇALIŞTIRMADIĞINIZ SÜRECE AKTİF OLAN KODLAR
                  </Text>
                  <Text style={styles.sectionHeading}>
                    1. Harita — Beden Haritası Çekirdek Kodlarınız
                  </Text>
                  <Text style={styles.sectionSub}>
                    3. Haritanızı (Üst Bilinç Haritanızı) kalıcı olarak çalıştırmaya başlamadığınız sürece, günlük hayatta Üst Benliğinizden mesaj olarak alacağınız kodlar yalnızca bu 1. Harita kodlarıdır:
                  </Text>

                  <View style={styles.codesGrid}>
                    {stage1BodyCodes.map((item) => {
                      const isSelected = selectedStage1Id === item.id && !showAllExpanded;
                      return (
                        <TouchableOpacity
                          key={item.id}
                          style={[
                            styles.codeGridItem,
                            isSelected && {
                              borderColor: '#38BDF8',
                              backgroundColor: 'rgba(56,189,248,0.14)'
                            }
                          ]}
                          onPress={() => {
                            setSelectedStage1Id(item.id);
                            setShowAllExpanded(false);
                          }}
                          activeOpacity={0.82}
                        >
                          <Text style={[styles.codeShortTitle, { color: '#38BDF8' }]} numberOfLines={1}>
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

                  {(showAllExpanded
                    ? stage1BodyCodes
                    : [stage1BodyCodes.find((c) => c.id === selectedStage1Id) || stage1BodyCodes[0]].filter(Boolean)
                  ).map((item) => renderDetailCard(item!))}
                </View>

                {/* 1. HARİTA EŞZAMANLILIK MESAJLARI */}
                <View style={styles.sectionCard}>
                  <Text style={[styles.sectionPill, { color: '#38BDF8' }]}>
                    1. HARİTA AKTİFKEN • TAKİP EDECEĞİNİZ 3 ÇEKİRDEK SAAT & MESAJ KODU
                  </Text>
                  <Text style={styles.sectionHeading}>
                    Beden Haritası Aşamasında Üst Benlikten Gelen Mesajlar
                  </Text>
                  <Text style={styles.sectionSub}>
                    3. Haritayı çalıştırmadığınız sürece yalnızca bu 3 çekirdek Beden kodunuzu gördüğünüzde mesaj olarak almalısınız:
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
                        Eşleşen Sembol:{' '}
                        <Text style={{ color: '#FFF', fontWeight: '700' }}>{sig.symbolArchetype}</Text>
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
            ) : (
              <>
                {/* 1. HARİTA -> 3. HARİTA KOD DÖNÜŞÜM TABLOSU */}
                <View style={[styles.sectionCard, { borderColor: 'rgba(212,175,55,0.45)' }]}>
                  <Text style={[styles.sectionPill, { color: COLORS.primary }]}>
                    1. HARİTA ➡️ 3. HARİTA KOD DÖNÜŞÜM ANAHTARI
                  </Text>
                  <Text style={styles.sectionHeading}>
                    3. Haritayı Çalıştırdığınızda Kodlarınız Nasıl Değişir?
                  </Text>
                  <Text style={styles.sectionSub}>
                    Beden Haritasındaki sınavlarınızı tamamladığınızda eski Beden kodlarınız yerini aşağıdaki 3. Harita (Üst Harita) kodlarına bırakır:
                  </Text>

                  {result.mapTransitionTable.map((row, rIdx) => (
                    <View key={rIdx} style={styles.transitionRowCard}>
                      <Text style={styles.transitionSlotTitle}>{row.category}</Text>
                      <Text style={styles.transitionOldText}>
                        <Text style={{ color: '#38BDF8', fontWeight: '800' }}>1. Harita (Eski): </Text>
                        {row.bodyMapCode} — {row.bodyMapMeaning}
                      </Text>
                      <Text style={styles.transitionNewText}>
                        <Text style={{ color: COLORS.primary, fontWeight: '800' }}>3. Harita (Yeni): </Text>
                        {row.upperMapCode} — {row.upperMapMeaning}
                      </Text>
                      <Text style={styles.transitionHowText}>
                        <Text style={{ color: '#34D399', fontWeight: '700' }}>Geçiş Şartı: </Text>
                        {row.unlockCondition}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* 3. HARİTA (ÜST HARİTA) KOD KARTLARI */}
                <View style={[styles.sectionCard, { borderColor: 'rgba(212,175,55,0.4)' }]}>
                  <Text style={[styles.sectionPill, { color: '#D4AF37' }]}>
                    3. HARİTA (ÜST HARİTA) • YENİ AKTİFLEŞEN KODLARINIZ ({result.fullName})
                  </Text>
                  <Text style={styles.sectionHeading}>
                    3. Haritayı Çalıştırdığınızda Devreye Giren Üst Bilinç Kodlarınız
                  </Text>

                  <View style={styles.codesGrid}>
                    {stage2UpperCodes.map((item) => {
                      const isSelected = selectedStage2Id === item.id && !showAllExpanded;
                      return (
                        <TouchableOpacity
                          key={item.id}
                          style={[
                            styles.codeGridItem,
                            isSelected && {
                              borderColor: COLORS.primary,
                              backgroundColor: 'rgba(212,175,55,0.14)'
                            }
                          ]}
                          onPress={() => {
                            setSelectedStage2Id(item.id);
                            setShowAllExpanded(false);
                          }}
                          activeOpacity={0.82}
                        >
                          <Text style={[styles.codeShortTitle, { color: '#D4AF37' }]} numberOfLines={1}>
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

                  {(showAllExpanded
                    ? stage2UpperCodes
                    : [stage2UpperCodes.find((c) => c.id === selectedStage2Id) || stage2UpperCodes[0]].filter(Boolean)
                  ).map((item) => renderDetailCard(item!))}
                </View>

                {/* 3. HARİTA EŞZAMANLILIK MESAJLARI */}
                <View style={styles.sectionCard}>
                  <Text style={[styles.sectionPill, { color: COLORS.primary }]}>
                    3. HARİTA AKTİFKEN • YENİ SAAT & SEMBOL REHBERLİĞİ
                  </Text>
                  <Text style={styles.sectionHeading}>
                    3. Haritayı Çalıştırdığınızda Üst Benliğinizin Kullandığı Yeni Kodlar
                  </Text>

                  {result.upperMapSynchronicitySignals.map((sig, idx) => (
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
                        Eşleşen Sembol:{' '}
                        <Text style={{ color: '#FFF', fontWeight: '700' }}>{sig.symbolArchetype}</Text>
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
    marginBottom: 14
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
  stageBtn: {
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 14,
    padding: 13,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.12)',
    marginBottom: 10
  },
  stageBtnActiveSky: {
    borderColor: '#38BDF8',
    backgroundColor: 'rgba(56,189,248,0.14)'
  },
  stageBtnActiveGold: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(212,175,55,0.14)'
  },
  stageBtnBadge: {
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 3
  },
  stageBtnTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4
  },
  stageBtnDesc: {
    color: '#D1D5DB',
    fontSize: 12,
    lineHeight: 17
  },
  transitionRowCard: {
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 10
  },
  transitionSlotTitle: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 4
  },
  transitionOldText: {
    color: '#E5E7EB',
    fontSize: 12,
    marginBottom: 2
  },
  transitionNewText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    marginBottom: 4
  },
  transitionHowText: {
    color: '#D1D5DB',
    fontSize: 11.5,
    lineHeight: 17
  },
  expandAllBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.35)',
    backgroundColor: 'rgba(212,175,55,0.1)',
    marginTop: 4
  },
  expandAllBannerText: {
    color: '#FDE68A',
    fontSize: 12,
    fontWeight: '800'
  },
  sectionCard: {
    backgroundColor: 'rgba(12,14,22,0.95)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.28)',
    marginBottom: 18
  },
  sectionPill: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 4
  },
  sectionHeading: {
    color: '#FFFFFF',
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
  codesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 10
  },
  codeGridItem: {
    width: '48.5%',
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)'
  },
  codeShortTitle: {
    fontSize: 10,
    fontWeight: '800'
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
    backgroundColor: 'rgba(255,255,255,0.04)',
    padding: 10,
    borderRadius: 10,
    marginBottom: 8
  },
  syncActionBox: {
    backgroundColor: 'rgba(16,185,129,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.3)',
    borderRadius: 10,
    padding: 10
  },
  syncActionText: {
    color: '#A7F3D0',
    fontSize: 12,
    lineHeight: 18
  }
});
