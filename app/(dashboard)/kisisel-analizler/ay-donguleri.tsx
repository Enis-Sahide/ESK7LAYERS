import SacredBackground from '@/components/SacredBackground';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { COLORS, SIZES } from '@/src/theme';
import { useContent } from '@/src/core/content/useContent';
import { apiFetch } from '@/src/core/config';
import MobileLunationCard, { LunationBackendData } from '@/src/features/astrology/components/MobileLunationCard';

interface MoonPhaseEvent {
  utcDate: string;
  phase: 'new_moon' | 'full_moon' | 'solar_eclipse' | 'lunar_eclipse';
  phaseName: string;
  sign: string;
  signSymbol: string;
  degree: string;
}

export default function MoonCyclesScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'new_moon' | 'full_moon' | 'eclipse'>('all');
  const [isTurkeyTime, setIsTurkeyTime] = useState(true);
  const [nextPhase, setNextPhase] = useState<MoonPhaseEvent | null>(null);
  const [selectedUtcDate, setSelectedUtcDate] = useState<string | null>(null);
  const [lunationDetail, setLunationDetail] = useState<LunationBackendData | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  const { data: moonData } = useContent<MoonPhaseEvent[]>('/api/content/moon-phases');
  const MOON_PHASES_2026 = moonData ?? [];

  // Backend API'den aktif veya seçilen ay fazı detayını çek
  const fetchLunationDetail = async (utcDate?: string) => {
    setIsLoadingDetail(true);
    try {
      const url = utcDate 
        ? `/api/astrology/lunation?eventUtcDate=${encodeURIComponent(utcDate)}`
        : `/api/astrology/lunation`;
      const res = await apiFetch(url);
      if (res.ok) {
        const json = await res.json();
        if (json && json.success) {
          setLunationDetail(json.data);
          setSelectedUtcDate(json.data.event.utcDate);
        }
      }
    } catch (err) {
      console.error('Lunation detail fetch error:', err);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  useEffect(() => {
    fetchLunationDetail();
  }, []);

  const getFormattedData = (utcDateStr: string) => {
    const dateObj = new Date(utcDateStr);
    const timeZone = isTurkeyTime ? 'Europe/Istanbul' : 'UTC';

    const day = dateObj.toLocaleDateString('tr-TR', { timeZone, day: 'numeric' });
    const shortMonth = dateObj.toLocaleDateString('tr-TR', { timeZone, month: 'short' });
    const month = dateObj.toLocaleDateString('tr-TR', { timeZone, month: 'long' });

    const time = dateObj.toLocaleTimeString('tr-TR', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    const dateStr = dateObj.toLocaleDateString('en-CA', { timeZone }).split(',')[0];

    return {
      dayMonth: `${day} ${shortMonth}`,
      fullDate: `${day} ${month} 2026`,
      time,
      dateStr
    };
  };

  useEffect(() => {
    const todayStr = new Date().toLocaleDateString('en-CA', {
      timeZone: isTurkeyTime ? 'Europe/Istanbul' : 'UTC'
    });

    const upcoming = MOON_PHASES_2026.find(item => {
      const data = getFormattedData(item.utcDate);
      return data.dateStr >= todayStr;
    });

    if (upcoming) {
      setNextPhase(upcoming);
    } else {
      setNextPhase(null);
    }
  }, [isTurkeyTime, moonData]);

  const filteredPhases = MOON_PHASES_2026.filter((item) => {
    if (filter === 'all') return true;
    if (filter === 'new_moon') return item.phase === 'new_moon';
    if (filter === 'full_moon') return item.phase === 'full_moon';
    if (filter === 'eclipse') return item.phase === 'solar_eclipse' || item.phase === 'lunar_eclipse';
    return true;
  });

  const getPhaseIcon = (phase: MoonPhaseEvent['phase']) => {
    switch (phase) {
      case 'new_moon':
        return '🌑';
      case 'full_moon':
        return '🌕';
      case 'solar_eclipse':
        return '🌑';
      case 'lunar_eclipse':
        return '🌕';
    }
  };

  const getPhaseColors = (phase: MoonPhaseEvent['phase']) => {
    switch (phase) {
      case 'new_moon':
        return {
          bg: 'rgba(26, 26, 26, 0.4)',
          border: 'rgba(64, 64, 64, 0.3)',
          text: '#D1D5DB'
        };
      case 'full_moon':
        return {
          bg: 'rgba(254, 240, 138, 0.05)',
          border: 'rgba(234, 179, 8, 0.2)',
          text: '#FEF08A'
        };
      case 'solar_eclipse':
        return {
          bg: 'rgba(249, 115, 22, 0.1)',
          border: 'rgba(249, 115, 22, 0.3)',
          text: '#FDBA74'
        };
      case 'lunar_eclipse':
        return {
          bg: 'rgba(239, 68, 68, 0.1)',
          border: 'rgba(239, 68, 68, 0.3)',
          text: '#FCA5A5'
        };
    }
  };

  return (
    <SacredBackground>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={28} color={COLORS.primary} />
        </TouchableOpacity>
        <View style={{ alignItems: 'center', flex: 1, marginRight: 40 }}>
          <Text style={styles.headerTitle}>Yıllık Ay Döngüleri</Text>
          <Text style={styles.headerSubtitle}>2026 Yeni Ay, Dolunay ve Tutulmalar</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Timezone Switcher */}
        <View style={styles.timezoneContainer}>
          <Text style={styles.timezoneLabel}>Zaman Dilimi:</Text>
          <View style={styles.timezoneToggle}>
            <TouchableOpacity
              onPress={() => setIsTurkeyTime(false)}
              style={[styles.timezoneBtn, !isTurkeyTime && styles.timezoneBtnActive]}
            >
              <Text style={[styles.timezoneBtnText, !isTurkeyTime && styles.timezoneBtnTextActive]}>UTC</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsTurkeyTime(true)}
              style={[styles.timezoneBtn, isTurkeyTime && styles.timezoneBtnActive]}
            >
              <Text style={[styles.timezoneBtnText, isTurkeyTime && styles.timezoneBtnTextActive]}>TRT (Türkiye)</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ☀️ 6 Aylık Kadersel Çatı & Güncel Faz MobileLunationCard (Backend'den Çekilir) */}
        {isLoadingDetail && !lunationDetail ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="small" color={COLORS.primary} />
            <Text style={styles.loadingText}>Kozmik ay fazı verileri yükleniyor...</Text>
          </View>
        ) : lunationDetail ? (
          <MobileLunationCard data={lunationDetail} isCompact={false} />
        ) : null}

        {/* Filter Tabs */}
        <View style={styles.filterTabs}>
          {([
            { key: 'all', label: 'Tümü' },
            { key: 'new_moon', label: 'Yeni Ay' },
            { key: 'full_moon', label: 'Dolunay' },
            { key: 'eclipse', label: 'Tutulma' }
          ] as const).map((tab) => {
            const isActive = filter === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setFilter(tab.key)}
                style={[styles.filterBtn, isActive && styles.filterBtnActive]}
              >
                <Text style={[styles.filterBtnText, isActive && styles.filterBtnTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* List of Phases */}
        <View style={styles.listContainer}>
          <Text style={styles.listSectionHint}>
            (Detayını ve 6 aylık çatı etkisini incelemek istediğiniz olaya dokunun)
          </Text>

          {filteredPhases.map((item, idx) => {
            const isSelected = selectedUtcDate === item.utcDate;
            const isNext = nextPhase && item.utcDate === nextPhase.utcDate;
            const data = getFormattedData(item.utcDate);
            const phaseColors = getPhaseColors(item.phase);

            return (
              <TouchableOpacity
                key={idx}
                activeOpacity={0.7}
                onPress={() => fetchLunationDetail(item.utcDate)}
                style={[
                  styles.eventCard,
                  isSelected && styles.eventCardSelected,
                  isNext && !isSelected && styles.eventCardActive
                ]}
              >
                {/* Left: Date & Time */}
                <View>
                  <Text style={[styles.eventDate, (isSelected || isNext) && { color: COLORS.primary, fontWeight: 'bold' }]}>
                    {data.dayMonth}
                  </Text>
                  <Text style={styles.eventTime}>
                    {data.time} ({isTurkeyTime ? 'TRT' : 'UTC'})
                  </Text>
                </View>

                {/* Center: Phase Badge */}
                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor: phaseColors.bg,
                      borderColor: phaseColors.border
                    }
                  ]}
                >
                  <Text style={styles.badgeEmoji}>{getPhaseIcon(item.phase)}</Text>
                  <Text style={[styles.badgeText, { color: phaseColors.text }]}>
                    {item.phaseName}
                  </Text>
                </View>

                {/* Right: Sign Info */}
                <View style={styles.signContainer}>
                  <Text style={styles.signSymbol}>{item.signSymbol}</Text>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.signName}>{item.sign}</Text>
                    <Text style={styles.signDegree}>{item.degree}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 50 }} />
      </ScrollView>
    </SacredBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.2)',
  },
  backBtn: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  scrollContent: {
    padding: 20,
  },
  timezoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  timezoneLabel: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
  timezoneToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 20,
    padding: 2,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  timezoneBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 18,
  },
  timezoneBtnActive: {
    backgroundColor: COLORS.primary,
  },
  timezoneBtnText: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: 'bold',
  },
  timezoneBtnTextActive: {
    color: '#000',
  },
  highlightCard: {
    padding: 16,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    marginBottom: 20,
    overflow: 'hidden',
  },
  highlightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  highlightSub: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  highlightDate: {
    color: COLORS.textMuted,
    fontSize: 10,
  },
  highlightBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  highlightTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  highlightTime: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 4,
  },
  highlightSign: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: SIZES.radius,
    padding: 3,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  filterBtnActive: {
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  filterBtnText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: 'bold',
  },
  filterBtnTextActive: {
    color: COLORS.primary,
  },
  listContainer: {
    gap: 10,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: SIZES.radius,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  eventCardActive: {
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
    borderColor: 'rgba(212, 175, 55, 0.4)',
  },
  eventCardSelected: {
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    borderColor: '#D4AF37',
    borderWidth: 1.5,
  },
  listSectionHint: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.45)',
    textAlign: 'center',
    marginBottom: 6,
    fontStyle: 'italic',
  },
  loadingBox: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(20, 20, 25, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    marginBottom: 16,
  },
  loadingText: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 8,
  },
  eventDate: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '600',
  },
  eventTime: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
  },
  badgeEmoji: {
    fontSize: 12,
    marginRight: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  signContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  signSymbol: {
    color: COLORS.primary,
    fontSize: 18,
  },
  signName: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  signDegree: {
    color: COLORS.textMuted,
    fontSize: 9,
    textAlign: 'right',
    marginTop: 1,
  },
});
