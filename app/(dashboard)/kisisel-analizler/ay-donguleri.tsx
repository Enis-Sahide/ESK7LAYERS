import SacredBackground from '@/components/SacredBackground';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { COLORS, SIZES } from '@/src/theme';

const ESOTERIC_BG = require('@/assets/images/esoteric_bg_indigo.webp');

interface MoonPhaseEvent {
  utcDate: string;
  phase: 'new_moon' | 'full_moon' | 'solar_eclipse' | 'lunar_eclipse';
  phaseName: string;
  sign: string;
  signSymbol: string;
  degree: string;
}

const MOON_PHASES_2026: MoonPhaseEvent[] = [
  { utcDate: '2026-01-03T10:03:26.043Z', phase: 'full_moon', phaseName: 'Dolunay', sign: 'Yengeç', signSymbol: '♋', degree: '13°' },
  { utcDate: '2026-01-18T19:52:39.367Z', phase: 'new_moon', phaseName: 'Yeni Ay', sign: 'Oğlak', signSymbol: '♑', degree: '28°' },
  { utcDate: '2026-02-01T22:09:49.657Z', phase: 'full_moon', phaseName: 'Dolunay', sign: 'Aslan', signSymbol: '♌', degree: '13°' },
  { utcDate: '2026-02-17T12:01:47.328Z', phase: 'solar_eclipse', phaseName: 'Güneş Tutulması', sign: 'Kova', signSymbol: '♒', degree: '28°' },
  { utcDate: '2026-03-03T11:38:32.022Z', phase: 'lunar_eclipse', phaseName: 'Ay Tutulması', sign: 'Başak', signSymbol: '♍', degree: '12°' },
  { utcDate: '2026-03-19T01:24:05.931Z', phase: 'new_moon', phaseName: 'Yeni Ay', sign: 'Balık', signSymbol: '♓', degree: '28°' },
  { utcDate: '2026-04-02T02:12:36.809Z', phase: 'full_moon', phaseName: 'Dolunay', sign: 'Terazi', signSymbol: '♎', degree: '12°' },
  { utcDate: '2026-04-17T11:52:21.628Z', phase: 'new_moon', phaseName: 'Yeni Ay', sign: 'Koç', signSymbol: '♈', degree: '27°' },
  { utcDate: '2026-05-01T17:23:47.564Z', phase: 'full_moon', phaseName: 'Dolunay', sign: 'Akrep', signSymbol: '♏', degree: '11°' },
  { utcDate: '2026-05-16T20:01:32.344Z', phase: 'new_moon', phaseName: 'Yeni Ay', sign: 'Boğa', signSymbol: '♉', degree: '25°' },
  { utcDate: '2026-05-31T08:45:48.291Z', phase: 'full_moon', phaseName: 'Dolunay', sign: 'Yay', signSymbol: '♐', degree: '9°' },
  { utcDate: '2026-06-15T02:54:39.007Z', phase: 'new_moon', phaseName: 'Yeni Ay', sign: 'İkizler', signSymbol: '♊', degree: '24°' },
  { utcDate: '2026-06-29T23:57:17.744Z', phase: 'full_moon', phaseName: 'Dolunay', sign: 'Oğlak', signSymbol: '♑', degree: '8°' },
  { utcDate: '2026-07-14T09:44:04.307Z', phase: 'new_moon', phaseName: 'Yeni Ay', sign: 'Yengeç', signSymbol: '♋', degree: '21°' },
  { utcDate: '2026-07-29T14:36:19.011Z', phase: 'full_moon', phaseName: 'Dolunay', sign: 'Kova', signSymbol: '♒', degree: '6°' },
  { utcDate: '2026-08-12T17:37:11.343Z', phase: 'solar_eclipse', phaseName: 'Güneş Tutulması', sign: 'Aslan', signSymbol: '♌', degree: '20°' },
  { utcDate: '2026-08-28T04:19:06.085Z', phase: 'lunar_eclipse', phaseName: 'Ay Tutulması', sign: 'Balık', signSymbol: '♓', degree: '4°' },
  { utcDate: '2026-09-11T03:27:28.467Z', phase: 'new_moon', phaseName: 'Yeni Ay', sign: 'Başak', signSymbol: '♍', degree: '18°' },
  { utcDate: '2026-09-26T16:49:32.233Z', phase: 'full_moon', phaseName: 'Dolunay', sign: 'Koç', signSymbol: '♈', degree: '3°' },
  { utcDate: '2026-10-10T15:50:36.724Z', phase: 'new_moon', phaseName: 'Yeni Ay', sign: 'Terazi', signSymbol: '♎', degree: '17°' },
  { utcDate: '2026-10-26T04:12:15.538Z', phase: 'full_moon', phaseName: 'Dolunay', sign: 'Boğa', signSymbol: '♉', degree: '2°' },
  { utcDate: '2026-11-09T07:02:42.392Z', phase: 'new_moon', phaseName: 'Yeni Ay', sign: 'Akrep', signSymbol: '♏', degree: '16°' },
  { utcDate: '2026-11-24T14:54:04.191Z', phase: 'full_moon', phaseName: 'Dolunay', sign: 'İkizler', signSymbol: '♊', degree: '2°' },
  { utcDate: '2026-12-09T00:52:31.284Z', phase: 'new_moon', phaseName: 'Yeni Ay', sign: 'Yay', signSymbol: '♐', degree: '16°' },
  { utcDate: '2026-12-24T01:28:45.040Z', phase: 'full_moon', phaseName: 'Dolunay', sign: 'Yengeç', signSymbol: '♋', degree: '2°' }
];

export default function MoonCyclesScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'new_moon' | 'full_moon' | 'eclipse'>('all');
  const [isTurkeyTime, setIsTurkeyTime] = useState(true);
  const [nextPhase, setNextPhase] = useState<MoonPhaseEvent | null>(null);

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
  }, [isTurkeyTime]);

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

  const nextPhaseData = nextPhase ? getFormattedData(nextPhase.utcDate) : null;

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

        {/* Sıradaki Ay Fazı Highlight Card */}
        {nextPhase && nextPhaseData && (
          <BlurView intensity={40} tint="dark" style={styles.highlightCard}>
            <View style={styles.highlightHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="sparkles" size={14} color={COLORS.primary} style={{ marginRight: 5 }} />
                <Text style={styles.highlightSub}>SIRADAKI AY FAZI</Text>
              </View>
              <Text style={styles.highlightDate}>{nextPhaseData.fullDate}</Text>
            </View>
            <View style={styles.highlightBody}>
              <View>
                <Text style={styles.highlightTitle}>
                  {getPhaseIcon(nextPhase.phase)}  {nextPhase.phaseName}
                </Text>
                <Text style={styles.highlightTime}>
                  Saat: {nextPhaseData.time} ({isTurkeyTime ? 'TRT' : 'UTC'})
                </Text>
              </View>
              <Text style={styles.highlightSign}>
                {nextPhase.signSymbol} {nextPhase.sign} ({nextPhase.degree})
              </Text>
            </View>
          </BlurView>
        )}

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
          {filteredPhases.map((item, idx) => {
            const isNext = nextPhase && item.utcDate === nextPhase.utcDate;
            const data = getFormattedData(item.utcDate);
            const phaseColors = getPhaseColors(item.phase);

            return (
              <View
                key={idx}
                style={[
                  styles.eventCard,
                  isNext && styles.eventCardActive
                ]}
              >
                {/* Left: Date & Time */}
                <View>
                  <Text style={[styles.eventDate, isNext && { color: COLORS.primary, fontWeight: 'bold' }]}>
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
              </View>
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
