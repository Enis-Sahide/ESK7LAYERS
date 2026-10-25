import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

export interface LunationBackendData {
  event: {
    utcDate: string;
    phase: 'new_moon' | 'full_moon' | 'solar_eclipse' | 'lunar_eclipse';
    phaseName: string;
    sign: string;
    signSymbol: string;
    degree: string;
  };
  statusText: string;
  durationInfo: {
    totalDuration: string;
    peakWindow: string;
    description: string;
    nature: string;
  };
  daysDiff: number;
  isExactOrActive: boolean;
  activeSolarEclipse: {
    event: {
      utcDate: string;
      phase: string;
      phaseName: string;
      sign: string;
      signSymbol: string;
      degree: string;
    };
    daysDiff: number;
    monthsRemaining: number;
    statusText: string;
    isActive: boolean;
  } | null;
  signInterpretation: {
    title: string;
    collective: string;
    ritual: string;
  } | null;
  personal: {
    houseNumber: number;
    title: string;
    portalName: string;
    portalMeaning: string;
    shadowState: string;
    elevatedState: string;
    spiritualAdvice: string;
    personalImpact?: string;
    advice?: string;
  } | null;
}

interface MobileLunationCardProps {
  data: LunationBackendData;
  isCompact?: boolean;
}

export default function MobileLunationCard({
  data,
  isCompact = false,
}: MobileLunationCardProps) {
  const [isSolarOpen, setIsSolarOpen] = useState(false);
  const [isLunarOpen, setIsLunarOpen] = useState(false);

  if (!data || !data.event) return null;

  const { event, statusText, durationInfo, activeSolarEclipse, signInterpretation, personal } = data;

  const isSolar = event.phase === 'solar_eclipse';
  const isLunar = event.phase === 'lunar_eclipse';
  const isFullMoon = event.phase === 'full_moon';

  // Şemsiye başlığı: eğer mevcut kart güneş tutulmasının kendisi değilse göster
  const showSolarUmbrella = activeSolarEclipse && !isSolar;

  const formattedDate = new Date(event.utcDate).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const getPhaseColors = () => {
    if (isSolar) return { bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.4)', text: '#FBBF24', icon: 'sunny' as const };
    if (isLunar) return { bg: 'rgba(168, 85, 247, 0.15)', border: 'rgba(168, 85, 247, 0.4)', text: '#C084FC', icon: 'moon' as const };
    if (isFullMoon) return { bg: 'rgba(212, 175, 55, 0.15)', border: 'rgba(212, 175, 55, 0.4)', text: '#D4AF37', icon: 'moon' as const };
    return { bg: 'rgba(50, 215, 75, 0.15)', border: 'rgba(50, 215, 75, 0.4)', text: '#32D74B', icon: 'moon-outline' as const };
  };

  const phaseColors = getPhaseColors();

  const phaseTagLabel = isSolar
    ? '☀️ 6 Aylık Kadersel Ana Çatı'
    : isLunar
      ? '🌑 1 - 3 Aylık Kadersel Aydınlanma'
      : isFullMoon
        ? '🌕 14 Günlük Aktif Dolunay Hasat Fazı'
        : '🌑 14 Günlük Aktif Yeni Ay Tohum Fazı';

  return (
    <View style={styles.cardContainer}>
      <BlurView intensity={35} tint="dark" style={styles.blurWrapper}>
        <LinearGradient
          colors={['rgba(255,255,255,0.04)', 'rgba(0,0,0,0.85)']}
          style={styles.gradientContainer}
        >
          {/* ☀️ 6 Aylık Kadersel Güneş Tutulması Çatısı (Umbrella - Tıklanabilir Açılır Kapsül) */}
          {showSolarUmbrella && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setIsSolarOpen(!isSolarOpen)}
              style={styles.umbrellaBanner}
            >
              <View style={styles.umbrellaHeaderRow}>
                <View style={styles.umbrellaIconWrapper}>
                  <Ionicons name="sunny" size={18} color="#FBBF24" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.umbrellaBadge}>AKTİF KADERSEL ÇATI (6 AYLIK SÜREÇ)</Text>
                  <Text style={styles.umbrellaTitle}>
                    {activeSolarEclipse.event.sign} Güneş Tutulması ({activeSolarEclipse.event.signSymbol} {activeSolarEclipse.event.degree})
                  </Text>
                </View>
                <Ionicons
                  name={isSolarOpen ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color="#FBBF24"
                />
              </View>

              {isSolarOpen && (
                <View style={[styles.umbrellaStatusBadge, { marginTop: 8 }]}>
                  <Ionicons name="time-outline" size={12} color="#FBBF24" style={{ marginRight: 4 }} />
                  <Text style={styles.umbrellaStatusText}>{activeSolarEclipse.statusText}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}

          {/* 🌙 Güncel Faz Ana Başlık (Tıklanabilir Açılır Kapsül) */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setIsLunarOpen(!isLunarOpen)}
            style={[
              styles.headerSection,
              !isLunarOpen && { borderBottomWidth: 0, paddingBottom: 0, marginBottom: 0 }
            ]}
          >
            <View style={styles.headerTopRow}>
              <View style={[styles.phaseIconBox, { backgroundColor: phaseColors.bg, borderColor: phaseColors.border }]}>
                <Ionicons name={phaseColors.icon} size={24} color={phaseColors.text} />
              </View>

              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={styles.tagRow}>
                  <View style={[styles.phaseBadge, { backgroundColor: phaseColors.bg, borderColor: phaseColors.border }]}>
                    <Text style={[styles.phaseBadgeText, { color: phaseColors.text }]}>{event.phaseName}</Text>
                  </View>
                  <Text style={styles.phaseTagSub}>{phaseTagLabel}</Text>
                </View>

                <Text style={styles.mainTitle}>
                  {event.sign} {event.phaseName} <Text style={styles.signDegreeText}>({event.signSymbol} {event.degree})</Text>
                </Text>
                <Text style={styles.dateText}>
                  <Ionicons name="calendar-outline" size={11} color="rgba(255,255,255,0.5)" /> {formattedDate}
                </Text>
              </View>

              <Ionicons
                name={isLunarOpen ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={phaseColors.text}
                style={{ marginLeft: 6, alignSelf: 'center' }}
              />
            </View>

            {/* Süre Rozetleri & Durum - Sadece açıkken */}
            {isLunarOpen && (
              <>
                <View style={styles.durationRow}>
                  <View style={styles.durationPill}>
                    <Ionicons name="time-outline" size={13} color="#D4AF37" style={{ marginRight: 4 }} />
                    <Text style={styles.durationText}>
                      Etki: <Text style={{ color: '#FFF', fontWeight: 'bold' }}>{durationInfo.totalDuration}</Text>
                    </Text>
                  </View>
                  <Text style={styles.peakText}>Pik: {durationInfo.peakWindow}</Text>
                </View>

                {statusText ? (
                  <Text style={styles.statusLiveText}>● {statusText}</Text>
                ) : null}
              </>
            )}
          </TouchableOpacity>

          {/* Açılır Gövde Bölümü (Kolektif + Kişisel Portal + Ritüel) */}
          {isLunarOpen && (
            <>
              {/* Kolektif Gökyüzü Teması */}
              {signInterpretation && (
                <View style={styles.collectiveSection}>
                  <View style={styles.sectionHeaderRow}>
                    <Ionicons name="sparkles" size={14} color="#D4AF37" style={{ marginRight: 6 }} />
                    <Text style={styles.collectiveSectionTitle}>
                      Kolektif Gökyüzü: {signInterpretation.title}
                    </Text>
                  </View>
                  <Text style={styles.collectiveBodyText}>{signInterpretation.collective}</Text>
                  {durationInfo.description ? (
                    <Text style={styles.durationDescText}>{durationInfo.description}</Text>
                  ) : null}
                </View>
              )}

              {/* 🏛️ Kişisel Harita Ezoterik İnisiyasyon Portalı (Varsa) */}
              {personal && (
                <View style={styles.personalPortalBox}>
                  <View style={styles.portalHeaderRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.portalOverline}>KİŞİSEL DOĞUM HARİTASI PORTALI</Text>
                      <Text style={styles.portalNameText}>{personal.portalName || personal.title}</Text>
                    </View>
                    <View style={styles.houseBadge}>
                      <Text style={styles.houseBadgeText}>{personal.houseNumber}. Evinizde</Text>
                    </View>
                  </View>

                  {personal.portalMeaning ? (
                    <Text style={styles.portalMeaningText}>{personal.portalMeaning}</Text>
                  ) : null}

                  {/* İki Katmanlı Bilinç Matrisi */}
                  <View style={styles.consciousnessGrid}>
                    {/* ⚠️ Alt Bilinç / Gölge Hali */}
                    <View style={styles.shadowCard}>
                      <View style={styles.stateTitleRow}>
                        <Ionicons name="warning-outline" size={14} color="#F87171" style={{ marginRight: 5 }} />
                        <Text style={styles.shadowTitle}>Alt Bilinç / Gölge Hali</Text>
                      </View>
                      <Text style={styles.shadowBody}>
                        {personal.shadowState || personal.personalImpact}
                      </Text>
                      <Text style={styles.shadowSub}>Ego, korku ve sınav seviyesinde günlük yaşam deneyimi</Text>
                    </View>

                    {/* ✨ Üst Bilinç / Ruhsal Boyut */}
                    <View style={styles.elevatedCard}>
                      <View style={styles.stateTitleRow}>
                        <Ionicons name="sparkles" size={14} color="#D4AF37" style={{ marginRight: 5 }} />
                        <Text style={styles.elevatedTitle}>Üst Bilinç / Ruhsal Boyut</Text>
                      </View>
                      <Text style={styles.elevatedBody}>
                        {personal.elevatedState || personal.personalImpact}
                      </Text>
                      <Text style={styles.elevatedSub}>7 çakra dengede ve arınmış bilinçle açılan inisiyasyon</Text>
                    </View>
                  </View>

                  {/* 🌿 Çakra & Manevi Denge Reçetesi */}
                  <View style={styles.spiritualAdviceBox}>
                    <Ionicons name="leaf-outline" size={16} color="#34D399" style={{ marginRight: 8, marginTop: 2 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.spiritualAdviceTitle}>Çakra & Manevi Denge Reçetesi:</Text>
                      <Text style={styles.spiritualAdviceText}>
                        {personal.spiritualAdvice || personal.advice}
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Ritüel & Manevi Arınma Tavsiyesi */}
              {signInterpretation?.ritual && (
                <View style={styles.ritualBox}>
                  <Ionicons name="flame-outline" size={18} color="#FBBF24" style={{ marginRight: 8, marginTop: 2 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.ritualTitle}>Bu Dönemin Manevi Arınma & Ritüel Tavsiyesi:</Text>
                    <Text style={styles.ritualText}>{signInterpretation.ritual}</Text>
                  </View>
                </View>
              )}
            </>
          )}
        </LinearGradient>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.25)',
    marginVertical: 12,
    backgroundColor: 'rgba(10, 10, 15, 0.95)',
  },
  blurWrapper: {
    overflow: 'hidden',
  },
  gradientContainer: {
    padding: 16,
  },
  // ☀️ 6 Aylık Şemsiye Çatısı
  umbrellaBanner: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.35)',
    padding: 12,
    marginBottom: 16,
  },
  umbrellaHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  umbrellaIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  umbrellaBadge: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FBBF24',
    letterSpacing: 0.5,
  },
  umbrellaTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 1,
  },
  umbrellaStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  umbrellaStatusText: {
    fontSize: 11,
    color: '#FDE68A',
    fontWeight: '500',
  },
  // Ana Başlık Bölümü
  headerSection: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    paddingBottom: 14,
    marginBottom: 14,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  phaseIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 4,
  },
  phaseBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
  },
  phaseBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  phaseTagSub: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  signDegreeText: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#D4AF37',
  },
  dateText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 2,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  durationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  durationText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  peakText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  statusLiveText: {
    fontSize: 11,
    color: '#34D399',
    fontWeight: '600',
    marginTop: 6,
  },
  // Kolektif Gökyüzü Bölümü
  collectiveSection: {
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  collectiveSectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#D4AF37',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  collectiveBodyText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 19,
  },
  durationDescText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.55)',
    fontStyle: 'italic',
    lineHeight: 16,
    marginTop: 6,
  },
  // 🏛️ Kişisel İnisiyasyon Portalı
  personalPortalBox: {
    backgroundColor: 'rgba(212, 175, 55, 0.03)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.35)',
    padding: 14,
    marginBottom: 14,
  },
  portalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    paddingBottom: 8,
    marginBottom: 8,
  },
  portalOverline: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#D4AF37',
    letterSpacing: 1,
  },
  portalNameText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 2,
  },
  houseBadge: {
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.4)',
  },
  houseBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  portalMeaningText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    fontStyle: 'italic',
    lineHeight: 16,
    marginBottom: 10,
  },
  consciousnessGrid: {
    gap: 10,
    marginBottom: 10,
  },
  shadowCard: {
    backgroundColor: 'rgba(127, 29, 29, 0.15)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.35)',
    padding: 12,
  },
  elevatedCard: {
    backgroundColor: 'rgba(120, 53, 15, 0.2)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.45)',
    padding: 12,
  },
  stateTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  shadowTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FCA5A5',
    textTransform: 'uppercase',
  },
  shadowBody: {
    fontSize: 12,
    color: '#FEE2E2',
    lineHeight: 17,
  },
  shadowSub: {
    fontSize: 9,
    color: 'rgba(252, 165, 165, 0.6)',
    fontStyle: 'italic',
    marginTop: 4,
  },
  elevatedTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FDE68A',
    textTransform: 'uppercase',
  },
  elevatedBody: {
    fontSize: 12,
    color: '#FEF3C7',
    lineHeight: 17,
  },
  elevatedSub: {
    fontSize: 9,
    color: 'rgba(253, 230, 138, 0.6)',
    fontStyle: 'italic',
    marginTop: 4,
  },
  spiritualAdviceBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(6, 78, 59, 0.2)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.35)',
    padding: 10,
  },
  spiritualAdviceTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#6EE7B7',
    marginBottom: 2,
  },
  spiritualAdviceText: {
    fontSize: 11,
    color: '#D1FAE5',
    lineHeight: 16,
  },
  // Ritüel Kutusu
  ritualBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 12,
    marginBottom: 8,
  },
  ritualTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  ritualText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.75)',
    lineHeight: 17,
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  expandButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D4AF37',
  },
});
