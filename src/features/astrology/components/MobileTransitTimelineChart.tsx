import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Modal, 
  Dimensions, 
  TextInput 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export interface TransitTimelineItem {
  id: string;
  transitPlanet: string;
  natalPlanet: string;
  type: 'Kavuşum' | 'Karşıt' | 'Kare' | 'Üçgen' | 'Sekstil' | 'İngress';
  isHarmonious: boolean;
  startDate: string;
  startTime?: string;
  peakDate: string;
  peakTime?: string;
  endDate: string;
  endTime?: string;
  minOrb: number;
  category: 'Kadersel' | 'Kişisel';
  title: string;
  summary: string;
  details: string;
  advice: string;
  chakraLayer: string;
  durationDays: number;
  status: 'ACTIVE' | 'UPCOMING' | 'COMPLETED';
  phase: 'YAKLASAN' | 'ZIRVE' | 'UZAKLASAN';
  isStartedInPast: boolean;
  isPeakInPast: boolean;
}

interface MobileTransitTimelineChartProps {
  items: TransitTimelineItem[];
  startDateStr: string;
  endDateStr: string;
  range: string;
  onRangeChange?: (newRange: '1m' | '3m' | '6m' | '1y') => void;
  isLoading?: boolean;
  isPremium?: boolean;
  onRequirePremium?: () => void;
  isMundane?: boolean;
  userTimezone?: string;
  tzOffsetHours?: number;
}

const PLANET_SYMBOLS: Record<string, string> = {
  'Güneş': '☉', 'Ay': '☽', 'Merkür': '☿', 'Venüs': '♀', 'Mars': '♂', 
  'Jüpiter': '♃', 'Satürn': '♄', 'Uranüs': '♅', 'Neptün': '♆', 'Plüton': '♇',
  'Yükselen (ASC)': 'ASC', 'Tepe Noktası (MC)': 'MC', 'Kuzey Ay Düğümü': '☊',
  'Kiron': '⚷'
};

const ASPECT_SYMBOLS: Record<string, string> = {
  'Kavuşum': '☌',
  'Sekstil': '⚹',
  'Kare': '□',
  'Üçgen': '△',
  'Karşıt': '☍'
};

const ZODIAC_SYMBOLS: Record<string, string> = {
  'Koç': '♈', 'Boğa': '♉', 'İkizler': '♊', 'Yengeç': '♋',
  'Aslan': '♌', 'Başak': '♍', 'Terazi': '♎', 'Akrep': '♏',
  'Yay': '♐', 'Oğlak': '♑', 'Kova': '♒', 'Balık': '♓',
  'Koç Burcu': '♈', 'Boğa Burcu': '♉', 'İkizler Burcu': '♊', 'Yengeç Burcu': '♋',
  'Aslan Burcu': '♌', 'Başak Burcu': '♍', 'Terazi Burcu': '♎', 'Akrep Burcu': '♏',
  'Yay Burcu': '♐', 'Oğlak Burcu': '♑', 'Kova Burcu': '♒', 'Balık Burcu': '♓'
};

export default function MobileTransitTimelineChart({
  items,
  startDateStr,
  endDateStr,
  range,
  onRangeChange,
  isLoading = false,
  isPremium = false,
  onRequirePremium,
  isMundane = false,
  userTimezone = 'Europe/Istanbul',
  tzOffsetHours = 3
}: MobileTransitTimelineChartProps) {
  const [selectedItem, setSelectedItem] = useState<TransitTimelineItem | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'KADERSEL' | 'KISISEL'>('ALL');
  const [aspectFilter, setAspectFilter] = useState<'ALL' | 'HARMONIOUS' | 'CHALLENGING'>('ALL');
  const [eventTypeFilter, setEventTypeFilter] = useState<'ALL' | 'INGRESS' | 'ASPECTS'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const rangeStart = useMemo(() => new Date(startDateStr).getTime(), [startDateStr]);
  const rangeEnd = useMemo(() => new Date(endDateStr).getTime(), [endDateStr]);
  const totalRangeMs = Math.max(1, rangeEnd - rangeStart);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (eventTypeFilter === 'INGRESS' && item.type !== 'İngress') return false;
      if (eventTypeFilter === 'ASPECTS' && item.type === 'İngress') return false;

      if (categoryFilter === 'KADERSEL' && item.category !== 'Kadersel') return false;
      if (categoryFilter === 'KISISEL' && item.category !== 'Kişisel') return false;

      if (item.type !== 'İngress') {
        if (aspectFilter === 'HARMONIOUS' && !item.isHarmonious) return false;
        if (aspectFilter === 'CHALLENGING' && (item.isHarmonious || item.type === 'Kavuşum')) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchSummary = item.summary.toLowerCase().includes(q);
        const matchChakra = item.chakraLayer.toLowerCase().includes(q);
        if (!matchTitle && !matchSummary && !matchChakra) return false;
      }

      return true;
    });
  }, [items, eventTypeFilter, categoryFilter, aspectFilter, searchQuery]);

  return (
    <View style={styles.container}>
      
      {/* 1. Range Selector with Locks */}
      <View style={styles.filterSection}>
        <View style={styles.rangeRow}>
          <Text style={styles.filterLabel}>Zaman Aralığı:</Text>
          <View style={styles.rangeButtonGroup}>
            {[
              { id: '1m', label: '1 Ay', isLocked: false },
              { id: '3m', label: '3 Ay', isLocked: !isPremium },
              { id: '6m', label: '6 Ay', isLocked: !isPremium },
              { id: '1y', label: '1 Yıl', isLocked: !isPremium },
            ].map(r => (
              <TouchableOpacity
                key={r.id}
                onPress={() => {
                  if (r.isLocked) {
                    onRequirePremium?.();
                  } else {
                    onRangeChange?.(r.id as any);
                  }
                }}
                style={[
                  styles.rangeBtn,
                  range === r.id && styles.rangeBtnActive,
                  r.isLocked && styles.rangeBtnLocked
                ]}
              >
                <Text style={[styles.rangeBtnText, range === r.id && styles.rangeBtnTextActive]}>
                  {r.label}
                </Text>
                {r.isLocked && (
                  <Ionicons name="lock-closed" size={10} color="#D4AF37" style={{ marginLeft: 3 }} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 2. Category & Filter Tabs */}
        <View style={styles.categoryRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            <TouchableOpacity
              onPress={() => setCategoryFilter('ALL')}
              style={[styles.pillBtn, categoryFilter === 'ALL' && styles.pillBtnActive]}
            >
              <Text style={[styles.pillText, categoryFilter === 'ALL' && styles.pillTextActive]}>Tümü</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setEventTypeFilter(eventTypeFilter === 'INGRESS' ? 'ALL' : 'INGRESS')}
              style={[styles.pillBtn, eventTypeFilter === 'INGRESS' && styles.pillBtnActiveCyan]}
            >
              <Text style={[styles.pillText, eventTypeFilter === 'INGRESS' && { color: '#22D3EE', fontWeight: 'bold' }]}>
                ⚡ Burç Geçişleri
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setCategoryFilter('KADERSEL')}
              style={[styles.pillBtn, categoryFilter === 'KADERSEL' && styles.pillBtnActivePurple]}
            >
              <Text style={[styles.pillText, categoryFilter === 'KADERSEL' && { color: '#C084FC', fontWeight: 'bold' }]}>
                {isMundane ? 'Büyük Döngüler (Jüpiter, Satürn...)' : 'Kadersel (Plüton/Satürn...)'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setCategoryFilter('KISISEL')}
              style={[styles.pillBtn, categoryFilter === 'KISISEL' && styles.pillBtnActiveAmber]}
            >
              <Text style={[styles.pillText, categoryFilter === 'KISISEL' && { color: '#FCD34D', fontWeight: 'bold' }]}>
                {isMundane ? 'Hızlı Gezegenler (Mars, Venüs...)' : 'Kişisel (Mars/Güneş...)'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setAspectFilter(aspectFilter === 'HARMONIOUS' ? 'ALL' : 'HARMONIOUS')}
              style={[styles.pillBtn, aspectFilter === 'HARMONIOUS' && styles.pillBtnActiveGreen]}
            >
              <Text style={[styles.pillText, aspectFilter === 'HARMONIOUS' && { color: '#34D399', fontWeight: 'bold' }]}>
                🟢 Destekler
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setAspectFilter(aspectFilter === 'CHALLENGING' ? 'ALL' : 'CHALLENGING')}
              style={[styles.pillBtn, aspectFilter === 'CHALLENGING' && styles.pillBtnActiveRed]}
            >
              <Text style={[styles.pillText, aspectFilter === 'CHALLENGING' && { color: '#F87171', fontWeight: 'bold' }]}>
                🔴 Sınavlar
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* 3. Search Box */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={14} color="#9CA3AF" style={{ marginRight: 6 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Gezegen veya çakra ara..."
            placeholderTextColor="rgba(156,163,175,0.6)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Timeline List (Mobile Gantt Cards) */}
      <View style={styles.timelineList}>
        <View style={styles.listHeader}>
          <Text style={styles.listHeaderTitle}>Kozmik Zaman Çizelgesi ({filteredItems.length} Olay)</Text>
          <Text style={styles.listHeaderSubtitle}>Çubuklar etki sürecini, parlak nokta zirve/merkez anını simgeler</Text>
          <View style={styles.tzHeaderBadge}>
            <Ionicons name="location-sharp" size={11} color="#D4AF37" />
            <Text style={styles.tzHeaderBadgeText}>
              Saatler: <Text style={{ color: '#FFF', fontWeight: 'bold' }}>{userTimezone}</Text> (UTC{tzOffsetHours >= 0 ? `+${tzOffsetHours}` : tzOffsetHours})
            </Text>
          </View>
        </View>

        {filteredItems.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="planet-outline" size={32} color="#6B7280" />
            <Text style={styles.emptyText}>Seçilen kriterlere uygun aktif bir transit bulunamadı.</Text>
          </View>
        ) : (
          filteredItems.map(item => {
            // Colors
            let gradColors: [string, string, ...string[]] = ['rgba(16, 185, 129, 0.8)', 'rgba(5, 150, 105, 0.9)'];
            let badgeBg = 'rgba(16, 185, 129, 0.15)';
            let badgeColor = '#34D399';

            if (item.type === 'İngress') {
              gradColors = ['rgba(8, 145, 178, 0.95)', 'rgba(79, 70, 229, 0.9)', 'rgba(147, 51, 234, 0.95)'];
              badgeBg = 'rgba(6, 182, 212, 0.15)';
              badgeColor = '#22D3EE';
            } else if (item.type === 'Kavuşum') {
              gradColors = ['rgba(245, 158, 11, 0.8)', 'rgba(217, 119, 6, 0.9)'];
              badgeBg = 'rgba(245, 158, 11, 0.15)';
              badgeColor = '#FBBF24';
            } else if (!item.isHarmonious) {
              gradColors = ['rgba(225, 29, 72, 0.8)', 'rgba(190, 18, 60, 0.9)'];
              badgeBg = 'rgba(225, 29, 72, 0.15)';
              badgeColor = '#FB7185';
            }

            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => setSelectedItem(item)}
                style={styles.timelineCard}
                activeOpacity={0.85}
              >
                {/* Card Top Row: Planets & Badges */}
                <View style={styles.cardTopRow}>
                  <View style={styles.planetsBadge}>
                    <Text style={styles.transitSymbol}>{PLANET_SYMBOLS[item.transitPlanet] || '•'}</Text>
                    <Text style={styles.transitName}>
                      {isMundane || item.type === 'İngress' ? item.transitPlanet : `T.${item.transitPlanet}`}
                    </Text>
                    <Text style={[styles.aspectSymbol, item.type === 'İngress' && { color: '#22D3EE', fontSize: 11 }]}>
                      {item.type === 'İngress' ? '➔' : (ASPECT_SYMBOLS[item.type] || item.type)}
                    </Text>
                    <Text style={[styles.natalName, item.type === 'İngress' && { color: '#E0F2FE', fontWeight: 'bold' }]}>
                      {item.type === 'İngress' ? item.natalPlanet.replace(' Burcu', '') : (isMundane ? item.natalPlanet : `N.${item.natalPlanet}`)}
                    </Text>
                    <Text style={[styles.natalSymbol, item.type === 'İngress' && { color: '#22D3EE' }]}>
                      {item.type === 'İngress'
                        ? (ZODIAC_SYMBOLS[item.natalPlanet] || '♒')
                        : (PLANET_SYMBOLS[item.natalPlanet] || '•')}
                    </Text>
                  </View>

                  {/* Phase or Status Badge */}
                  <View style={[styles.phaseBadge, { backgroundColor: badgeBg }]}>
                    <Text style={[styles.phaseBadgeText, { color: badgeColor }]}>
                      {item.type === 'İngress' ? (
                        <>
                          {item.phase === 'YAKLASAN' && '📈 Merkeze Yaklaşıyor'}
                          {item.phase === 'ZIRVE' && '⚡ Burç Seyrinde'}
                          {item.phase === 'UZAKLASAN' && '📉 Çıkışa Yakın'}
                        </>
                      ) : (
                        <>
                          {item.phase === 'YAKLASAN' && '📈 Tırmanıyor'}
                          {item.phase === 'ZIRVE' && '⚡ Tam Zirvede'}
                          {item.phase === 'UZAKLASAN' && '📉 Çözülüyor'}
                        </>
                      )}
                    </Text>
                  </View>
                </View>

                {/* Card Middle: Visual Gantt Bar Track */}
                <View style={styles.barContainer}>
                  <LinearGradient
                    colors={gradColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.ganttBar}
                  >
                    <View style={styles.barContent}>
                      <Text style={styles.barTypeText}>
                        {item.isStartedInPast ? '◀ ' : ''}
                        {item.type === 'İngress' 
                          ? `⚡ ${item.natalPlanet.replace(' Burcu', '')} (${item.durationDays} gün)` 
                          : `${item.type} (${item.durationDays} gün)`}
                      </Text>
                      <View style={styles.peakIndicator}>
                        <Ionicons name="sparkles" size={10} color="#FFF" />
                        <Text style={styles.peakText}>
                          {item.type === 'İngress' ? 'Merkez: ' : 'Zirve: '}
                          {item.peakDate.slice(5)}{item.peakTime ? ` • ${item.peakTime}` : ''}
                        </Text>
                      </View>
                    </View>
                  </LinearGradient>
                </View>

                {/* Card Bottom Row: Dates */}
                <View style={styles.cardBottomRow}>
                  <Text style={styles.dateLabelText}>
                    {item.isStartedInPast ? 'Başladı: ' : 'Başlangıç: '}
                    <Text style={{ color: '#E5E7EB', fontWeight: 'bold' }}>{item.startDate}</Text>
                    {item.startTime ? <Text style={{ color: '#9CA3AF', fontSize: 10 }}> ({item.startTime})</Text> : null}
                  </Text>
                  <Text style={styles.dateLabelText}>
                    Bitiş: <Text style={{ color: '#E5E7EB', fontWeight: 'bold' }}>{item.endDate}</Text>
                    {item.endTime ? <Text style={{ color: '#9CA3AF', fontSize: 10 }}> ({item.endTime})</Text> : null}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </View>

      {/* Interactive Detail Modal */}
      {selectedItem && (
        <Modal
          visible={true}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setSelectedItem(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <View style={[
                      styles.categoryPill,
                      selectedItem.type === 'İngress' && { backgroundColor: 'rgba(6, 182, 212, 0.15)', borderWidth: 1, borderColor: 'rgba(6, 182, 212, 0.3)' }
                    ]}>
                      <Text style={[
                        styles.categoryPillText,
                        selectedItem.type === 'İngress' && { color: '#22D3EE' }
                      ]}>
                        {selectedItem.type === 'İngress' ? 'Burç Seyri (İngress)' : `${selectedItem.category} • ${selectedItem.type}`}
                      </Text>
                    </View>
                    <Text style={styles.minOrbText}>
                      {selectedItem.type === 'İngress' ? 'Etki: Burç Seyri' : `Min Orb: ${selectedItem.minOrb}°`}
                    </Text>
                  </View>
                  <Text style={styles.modalMainTitle}>
                    {selectedItem.type === 'İngress'
                      ? `${selectedItem.transitPlanet} ${selectedItem.natalPlanet.replace(' Burcu', '')} Burcunda ${ZODIAC_SYMBOLS[selectedItem.natalPlanet] || ''}`
                      : selectedItem.title}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setSelectedItem(null)} style={styles.closeBtn}>
                  <Ionicons name="close" size={22} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                {/* 3 Dates Box */}
                <View style={styles.modalDatesBox}>
                  <View style={styles.dateBoxCol}>
                    <Text style={styles.dateBoxSub}>BAŞLANGIÇ</Text>
                    <Text style={styles.dateBoxVal}>
                      {selectedItem.startDate}
                      {selectedItem.startTime ? (
                        <Text style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 'normal' }}>{'\n'}({selectedItem.startTime})</Text>
                      ) : null}
                    </Text>
                    {selectedItem.isStartedInPast ? (
                      <Text style={styles.dateBoxBadge}>Geçmişte başladı</Text>
                    ) : selectedItem.startDate === new Date().toISOString().split('T')[0] ? (
                      <Text style={[styles.dateBoxBadge, { color: '#34D399' }]}>
                        Bugün {selectedItem.startTime ? `${selectedItem.startTime}'te ` : ''}başladı
                      </Text>
                    ) : (
                      <Text style={[styles.dateBoxBadge, { color: '#38BDF8' }]}>Başlaması bekleniyor</Text>
                    )}
                  </View>
                  <View style={[styles.dateBoxCol, styles.dateBoxColBorder]}>
                    <Text style={[styles.dateBoxSub, { color: selectedItem.type === 'İngress' ? '#22D3EE' : '#D4AF37' }]}>
                      ⚡ {selectedItem.type === 'İngress' ? 'MERKEZ (15°)' : 'ZİRVE (0°)'}
                    </Text>
                    <Text style={[styles.dateBoxVal, { color: selectedItem.type === 'İngress' ? '#38BDF8' : '#D4AF37', fontWeight: 'bold' }]}>
                      {selectedItem.peakDate}
                      {selectedItem.peakTime ? (
                        <Text style={{ fontSize: 11, color: selectedItem.type === 'İngress' ? '#BAE6FD' : '#FCD34D', fontWeight: 'bold' }}>{'\n'}• {selectedItem.peakTime}</Text>
                      ) : null}
                    </Text>
                    <Text style={[styles.dateBoxBadge, { color: selectedItem.isPeakInPast ? '#38BDF8' : '#34D399' }]}>
                      {selectedItem.isPeakInPast 
                        ? (selectedItem.type === 'İngress' ? 'Merkez geride kaldı' : 'Zirvesi tamamlandı') 
                        : (selectedItem.type === 'İngress' ? 'Merkez bekleniyor' : 'Zirve bekleniyor')}
                    </Text>
                  </View>
                  <View style={styles.dateBoxCol}>
                    <Text style={styles.dateBoxSub}>BİTİŞ</Text>
                    <Text style={styles.dateBoxVal}>
                      {selectedItem.endDate}
                      {selectedItem.endTime ? (
                        <Text style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 'normal' }}>{'\n'}({selectedItem.endTime})</Text>
                      ) : null}
                    </Text>
                    <Text style={styles.dateBoxBadge}>Toplam {selectedItem.durationDays} gün</Text>
                  </View>
                </View>

                {/* Timezone Note in Modal */}
                <View style={styles.tzModalBadge}>
                  <Ionicons name="location-sharp" size={11} color="#D4AF37" />
                  <Text style={styles.tzModalBadgeText}>
                    Tüm saatler cihazınızın yerel konumuna ({userTimezone} • UTC{tzOffsetHours >= 0 ? `+${tzOffsetHours}` : tzOffsetHours}) göredir.
                  </Text>
                </View>

                {/* 1. Temel Özet (Herkese Açık) */}
                <View style={styles.summaryCard}>
                  <Text style={styles.summaryTitle}>DÖNEMİN TEMEL ÖZETİ</Text>
                  <Text style={styles.summaryContent}>{selectedItem.summary}</Text>
                </View>

                {/* 2. 7Layers Çakra & Derin Dinamikler (Premium veya Kilitli) */}
                {isPremium ? (
                  <View style={{ gap: 12 }}>
                    {/* 7Layers Chakra Card */}
                    <View style={styles.chakraCard}>
                      <Ionicons name="layers" size={20} color="#C084FC" style={{ marginTop: 2, marginRight: 8 }} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.chakraTitle}>7Layers İnisiyasyon & Katman Etkisi</Text>
                        <Text style={styles.chakraText}>{selectedItem.chakraLayer}</Text>
                      </View>
                    </View>

                    {/* Deep Interpretation */}
                    <View style={styles.deepCard}>
                      <Text style={styles.deepTitle}>KADİRSEL & PSİKOLOJİK DİNAMİK</Text>
                      <Text style={styles.deepContent}>{selectedItem.details}</Text>
                    </View>

                    {/* Advice */}
                    {selectedItem.advice && (
                      <View style={styles.adviceCard}>
                        <Text style={styles.adviceTitle}>REHBERLİK & TAVSİYE</Text>
                        <Text style={styles.adviceContent}>{selectedItem.advice}</Text>
                      </View>
                    )}
                  </View>
                ) : (
                  /* Kilitli Freemium Kartı */
                  <View style={styles.lockBox}>
                    <View style={styles.lockBlurSim}>
                      <View style={{ height: 16, width: '60%', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 4, marginBottom: 8 }} />
                      <View style={{ height: 12, width: '90%', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 4, marginBottom: 6 }} />
                      <View style={{ height: 12, width: '75%', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 4 }} />
                    </View>

                    <View style={styles.lockOverlay}>
                      <View style={styles.lockIconCircle}>
                        <Ionicons name="lock-closed" size={22} color="#D4AF37" />
                      </View>
                      <Text style={styles.lockTitle}>7Layers İnisiyasyon & Derin Rehberlik Kilitli</Text>
                      <Text style={styles.lockDesc}>
                        Bu kadersel transitin Çakra/Sefirot katman etkisi, derin psikolojik dinamikleri ve eylem adımları Çıraklık (Apprentice) ve üzeri seviyelere özeldir.
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedItem(null);
                          onRequirePremium?.();
                        }}
                        style={styles.upgradeBtn}
                      >
                        <LinearGradient
                          colors={['#D4AF37', '#0EA5E9']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={styles.upgradeBtnGrad}
                        >
                          <Text style={styles.upgradeBtnText}>Seviyeni Yükselt & Kilidi Aç</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                <TouchableOpacity
                  onPress={() => setSelectedItem(null)}
                  style={styles.modalCloseFooterBtn}
                >
                  <Text style={styles.modalCloseFooterBtnText}>KAPAT</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
  
  filterSection: {
    backgroundColor: 'rgba(20, 20, 25, 0.75)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 14,
    marginBottom: 16
  },
  rangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#9CA3AF'
  },
  rangeButtonGroup: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    padding: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  rangeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 9
  },
  rangeBtnActive: {
    backgroundColor: '#D4AF37'
  },
  rangeBtnLocked: {
    opacity: 0.8
  },
  rangeBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF'
  },
  rangeBtnTextActive: {
    color: '#000',
    fontWeight: 'bold'
  },

  categoryRow: {
    marginBottom: 10
  },
  pillBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  pillBtnActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'rgba(255, 255, 255, 0.4)'
  },
  pillBtnActivePurple: {
    backgroundColor: 'rgba(147, 51, 234, 0.2)',
    borderColor: 'rgba(147, 51, 234, 0.4)'
  },
  pillBtnActiveAmber: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderColor: 'rgba(245, 158, 11, 0.4)'
  },
  pillBtnActiveGreen: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: 'rgba(16, 185, 129, 0.4)'
  },
  pillBtnActiveRed: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderColor: 'rgba(239, 68, 68, 0.4)'
  },
  pillBtnActiveCyan: {
    backgroundColor: 'rgba(6, 182, 212, 0.2)',
    borderColor: 'rgba(6, 182, 212, 0.4)'
  },
  pillText: {
    fontSize: 11,
    color: '#9CA3AF'
  },
  pillTextActive: {
    color: '#FFF',
    fontWeight: 'bold'
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    height: 36
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: '#FFF',
    paddingVertical: 0
  },

  timelineList: {
    width: '100%'
  },
  listHeader: {
    marginBottom: 12
  },
  listHeaderTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 2
  },
  listHeaderSubtitle: {
    fontSize: 11,
    color: '#9CA3AF'
  },
  tzHeaderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start'
  },
  tzHeaderBadgeText: {
    fontSize: 10,
    color: '#D4AF37'
  },
  tzModalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    marginBottom: 12
  },
  tzModalBadgeText: {
    fontSize: 10,
    color: '#9CA3AF',
    textAlign: 'center'
  },
  emptyCard: {
    padding: 30,
    alignItems: 'center',
    backgroundColor: 'rgba(10, 10, 15, 0.6)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)'
  },
  emptyText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 8,
    textAlign: 'center'
  },

  timelineCard: {
    backgroundColor: 'rgba(20, 20, 25, 0.85)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    marginBottom: 10
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  planetsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  transitSymbol: {
    fontSize: 14,
    color: '#0EA5E9',
    fontWeight: 'bold'
  },
  transitName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFF'
  },
  aspectSymbol: {
    fontSize: 13,
    color: '#D4AF37',
    fontWeight: '900',
    marginHorizontal: 2
  },
  natalName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D1D5DB'
  },
  natalSymbol: {
    fontSize: 14,
    color: '#D4AF37',
    fontWeight: 'bold'
  },
  phaseBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8
  },
  phaseBadgeText: {
    fontSize: 10,
    fontWeight: 'bold'
  },

  barContainer: {
    width: '100%',
    height: 28,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8
  },
  ganttBar: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 8
  },
  barContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  barTypeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFF'
  },
  peakIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 3
  },
  peakText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#FFF'
  },

  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  dateLabelText: {
    fontSize: 10,
    color: '#9CA3AF'
  },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end'
  },
  modalCard: {
    backgroundColor: '#0F0F14',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    maxHeight: '88%',
    padding: 20
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    paddingBottom: 14,
    marginBottom: 14
  },
  categoryPill: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6
  },
  categoryPillText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#E5E7EB'
  },
  minOrbText: {
    fontSize: 10,
    color: '#9CA3AF'
  },
  modalMainTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF'
  },
  closeBtn: {
    padding: 4
  },

  modalDatesBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    paddingVertical: 10,
    marginBottom: 14
  },
  dateBoxCol: {
    flex: 1,
    alignItems: 'center'
  },
  dateBoxColBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)'
  },
  dateBoxSub: {
    fontSize: 9,
    color: '#9CA3AF',
    fontWeight: 'bold',
    marginBottom: 2
  },
  dateBoxVal: {
    fontSize: 11,
    color: '#FFF',
    fontWeight: '600'
  },
  dateBoxBadge: {
    fontSize: 8,
    color: '#9CA3AF',
    marginTop: 2
  },

  summaryCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    padding: 12,
    marginBottom: 14
  },
  summaryTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 4
  },
  summaryContent: {
    fontSize: 12,
    color: '#E5E7EB',
    lineHeight: 18
  },

  chakraCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(147, 51, 234, 0.12)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(147, 51, 234, 0.3)',
    padding: 12
  },
  chakraTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#C084FC',
    marginBottom: 2
  },
  chakraText: {
    fontSize: 11,
    color: '#F3E8FF',
    lineHeight: 16
  },

  deepCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)'
  },
  deepTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#9CA3AF',
    marginBottom: 4
  },
  deepContent: {
    fontSize: 11,
    color: '#D1D5DB',
    lineHeight: 17
  },

  adviceCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)'
  },
  adviceTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#34D399',
    marginBottom: 4
  },
  adviceContent: {
    fontSize: 11,
    color: '#D1FAE5',
    lineHeight: 17
  },

  /* Lock Box */
  lockBox: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.25)',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 16,
    alignItems: 'center',
    marginBottom: 10
  },
  lockBlurSim: {
    opacity: 0.15,
    width: '100%',
    marginBottom: 12
  },
  lockOverlay: {
    alignItems: 'center'
  },
  lockIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  lockTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
    textAlign: 'center'
  },
  lockDesc: {
    fontSize: 10,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 15,
    marginBottom: 12,
    paddingHorizontal: 10
  },
  upgradeBtn: {
    borderRadius: 10,
    overflow: 'hidden',
    width: '100%'
  },
  upgradeBtnGrad: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  upgradeBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#000'
  },

  modalCloseFooterBtn: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 14
  },
  modalCloseFooterBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFF'
  }
});
