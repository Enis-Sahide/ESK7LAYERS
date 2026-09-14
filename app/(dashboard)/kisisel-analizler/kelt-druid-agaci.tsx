import SacredBackground from '@/components/SacredBackground';
import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Share, 
  Modal, 
  Platform,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '@/src/theme';
import { 
  DRUID_TREES, 
  getDruidTreeAnalysis, 
  DruidTree, 
  DruidTreeAnalysis 
} from '@/src/features/astrology/engine/DruidTreeEngine';

const { width } = Dimensions.get('window');

const MONTH_NAMES = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

export default function KeltDruidAgaciScreen() {
  const router = useRouter();

  // Form State'leri (Varsayılan 1 Ocak)
  const [userName, setUserName] = useState('');
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [analyzedData, setAnalyzedData] = useState<DruidTreeAnalysis | null>(null);
  const [analyzedName, setAnalyzedName] = useState('');

  // Seçici Modalları
  const [showDayModal, setShowDayModal] = useState(false);
  const [showMonthModal, setShowMonthModal] = useState(false);

  // Ansiklopedi State'i
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModalTree, setSelectedModalTree] = useState<DruidTree | null>(null);

  // Ayın gün sayısı
  const daysInMonth = useMemo(() => {
    if (selectedMonth === 2) return 29;
    if ([4, 6, 9, 11].includes(selectedMonth)) return 30;
    return 31;
  }, [selectedMonth]);

  const handleCalculate = () => {
    const analysis = getDruidTreeAnalysis(selectedDay, selectedMonth);
    setAnalyzedData(analysis);
    setAnalyzedName(userName.trim());
  };

  const currentTree: DruidTree | null = analyzedData ? analyzedData.tree : null;

  const handleShare = async () => {
    if (!currentTree) return;
    try {
      const message = `🌲 Kelt Druid Ağacı Analizim: ${currentTree.name} (${currentTree.oghamSymbol} ${currentTree.oghamName})\n` +
        `✨ Ruhsal Karakter: ${currentTree.archetype}\n` +
        `🪐 Yönetici Güç: ${currentTree.rulingPlanets} | Element: ${currentTree.element}\n` +
        `📜 Druid Bilgeliği: "${currentTree.druidicProverb}"\n\n` +
        `Sen de kendi kutsal Kelt ağacını keşfet: 7layers.org/analysis/druid-tree`;

      await Share.share({ message });
    } catch (error) {
      console.error('Paylaşım hatası:', error);
    }
  };

  const filteredTrees = useMemo(() => {
    if (!searchTerm.trim()) return DRUID_TREES;
    const q = searchTerm.toLowerCase();
    return DRUID_TREES.filter(t => 
      t.name.toLowerCase().includes(q) ||
      t.archetype.toLowerCase().includes(q) ||
      t.oghamName.toLowerCase().includes(q) ||
      t.periods.some(p => p.label.toLowerCase().includes(q))
    );
  }, [searchTerm]);

  return (
    <SacredBackground>
      <View style={styles.container}>
        {/* Üst Bar */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text || '#FFF'} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Kelt Druid Ağacı Analizi</Text>
            <Text style={styles.headerSubtitle}>13 Kutsal Ogham Ağacı Bilgeliği</Text>
          </View>
        </View>

        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Tanıtım Kartı */}
          <View style={styles.heroCard}>
            <View style={styles.heroBadge}>
              <Ionicons name="leaf-outline" size={16} color="#10B981" />
              <Text style={styles.heroBadgeText}>13 Kutsal Kelt Ağacı & Ogham Rehberi</Text>
            </View>
            <Text style={styles.heroDesc}>
              Antik Kelt rahiplerine göre her ruh, doğduğu günün 13 Ay döngüsündeki kutsal ağacın ve Ogham harfinin frekansıyla mühürlenir. Doğum gününüzü seçerek ağaç toteminizin ışığını ve orman topraklanması (Shinrin-Yoku) ritüelinizi analiz edin.
            </Text>
          </View>

          {/* Hesaplama Formu */}
          <View style={styles.formCard}>
            <Text style={styles.formSectionTitle}>Doğum Tarihi Seçimi</Text>

            {/* İsim Girişi */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Adınız (Opsiyonel)</Text>
              <TextInput
                style={styles.textInput}
                value={userName}
                onChangeText={setUserName}
                placeholder="Örn. Ali"
                placeholderTextColor="#6B7280"
              />
            </View>

            {/* Gün ve Ay Seçiciler */}
            <View style={styles.datePickerRow}>
              <View style={styles.dateCol}>
                <Text style={styles.inputLabel}>Doğum Günü</Text>
                <TouchableOpacity 
                  style={styles.selectorButton}
                  onPress={() => setShowDayModal(true)}
                >
                  <Text style={styles.selectorButtonText}>{selectedDay}</Text>
                  <Ionicons name="chevron-down" size={16} color="#10B981" />
                </TouchableOpacity>
              </View>

              <View style={styles.dateCol}>
                <Text style={styles.inputLabel}>Doğum Ayı</Text>
                <TouchableOpacity 
                  style={styles.selectorButton}
                  onPress={() => setShowMonthModal(true)}
                >
                  <Text style={styles.selectorButtonText}>{MONTH_NAMES[selectedMonth - 1]}</Text>
                  <Ionicons name="chevron-down" size={16} color="#10B981" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Hesapla Butonu */}
            <TouchableOpacity 
              style={styles.calculateButton}
              onPress={handleCalculate}
              activeOpacity={0.8}
            >
              <Ionicons name="sparkles" size={18} color="#FEF08A" />
              <Text style={styles.calculateButtonText}>Kelt Druid Ağacımı Analiz Et</Text>
            </TouchableOpacity>
          </View>

          {/* Analiz Sonucu */}
          {currentTree && (
            <View style={styles.resultContainer}>
              {/* Ana Ağaç Totem Kartı */}
              <View style={styles.treeCard}>
                <View style={styles.treeHeader}>
                  <View style={styles.oghamBadge}>
                    <Text style={styles.oghamSymbol}>{currentTree.oghamSymbol}</Text>
                  </View>
                  <View style={styles.treeTitleContainer}>
                    <Text style={styles.oghamNameText}>
                      Ogham: {currentTree.oghamName}
                    </Text>
                    <Text style={styles.treeName}>
                      {analyzedName ? `${analyzedName} İçin: ` : ''}{currentTree.name}
                    </Text>
                    <Text style={styles.botanicalName}>{currentTree.botanicalName}</Text>
                  </View>
                </View>

                {/* 3'lü Özet Rozetleri */}
                <View style={styles.metricsGrid}>
                  <View style={styles.metricBox}>
                    <Text style={styles.metricLabel}>Ruhsal Karakter</Text>
                    <Text style={styles.metricValue}>{currentTree.archetype}</Text>
                  </View>
                  <View style={styles.metricBox}>
                    <Text style={[styles.metricLabel, { color: '#F59E0B' }]}>Yönetici Güç</Text>
                    <Text style={styles.metricValue}>{currentTree.rulingPlanets}</Text>
                  </View>
                  <View style={styles.metricBox}>
                    <Text style={[styles.metricLabel, { color: '#14B8A6' }]}>Element</Text>
                    <Text style={styles.metricValue}>{currentTree.element}</Text>
                  </View>
                </View>

                {/* Hüküm Sürdüğü Tarihler */}
                <View style={styles.periodsBox}>
                  <Text style={styles.periodsTitle}>Kutsal Döngü Tarihi:</Text>
                  <Text style={styles.periodsValue}>{currentTree.periods[0]?.label}</Text>
                </View>

                {/* Atasözü */}
                <View style={styles.proverbBox}>
                  <Text style={styles.proverbText}>"{currentTree.druidicProverb}"</Text>
                </View>

                {/* Paylaş Butonu */}
                <TouchableOpacity 
                  style={styles.shareButton} 
                  onPress={handleShare}
                  activeOpacity={0.8}
                >
                  <Ionicons name="share-social-outline" size={18} color="#10B981" />
                  <Text style={styles.shareButtonText}>Analiz Özeti Paylaş</Text>
                </TouchableOpacity>
              </View>

              {/* Mitolojik Öz */}
              <View style={styles.sectionCard}>
                <View style={styles.sectionTitleRow}>
                  <Ionicons name="book-outline" size={18} color="#10B981" />
                  <Text style={styles.sectionTitle}>Mitolojik Köken & Ruhsal Öz</Text>
                </View>
                <Text style={styles.bodyText}>{currentTree.spiritualEssence}</Text>
              </View>

              {/* Işık ve Gölge */}
              <View style={styles.dualGrid}>
                {/* Işık Potansiyelleri */}
                <View style={[styles.traitCard, { borderColor: 'rgba(16, 185, 129, 0.3)' }]}>
                  <View style={styles.sectionTitleRow}>
                    <Ionicons name="sunny-outline" size={16} color="#10B981" />
                    <Text style={[styles.traitTitle, { color: '#6EE7B7' }]}>Işık Erdemleri</Text>
                  </View>
                  {currentTree.lightTraits.map((t, idx) => (
                    <View key={idx} style={styles.traitRow}>
                      <Text style={[styles.bullet, { color: '#10B981' }]}>✦</Text>
                      <Text style={styles.traitText}>{t}</Text>
                    </View>
                  ))}
                </View>

                {/* Gölge Sınavı */}
                <View style={[styles.traitCard, { borderColor: 'rgba(245, 158, 11, 0.3)' }]}>
                  <View style={styles.sectionTitleRow}>
                    <Ionicons name="shield-outline" size={16} color="#F59E0B" />
                    <Text style={[styles.traitTitle, { color: '#FCD34D' }]}>Gölge Sınavı</Text>
                  </View>
                  {currentTree.shadowTraits.map((t, idx) => (
                    <View key={idx} style={styles.traitRow}>
                      <Text style={[styles.bullet, { color: '#F59E0B' }]}>❖</Text>
                      <Text style={styles.traitText}>{t}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Doğa ve Topraklanma Ritüeli */}
              <View style={styles.sectionCard}>
                <View style={styles.sectionTitleRow}>
                  <Ionicons name="leaf-outline" size={18} color="#10B981" />
                  <Text style={styles.sectionTitle}>Kadim Kelt Doğayla Rezonans Ritüeli</Text>
                </View>

                <View style={styles.ritualItem}>
                  <Text style={styles.ritualHeader}>🌲 Orman Banyosu & Topraklanma (Shinrin-Yoku):</Text>
                  <Text style={styles.bodyText}>{currentTree.natureRitual.grounding}</Text>
                </View>

                <View style={styles.ritualItem}>
                  <Text style={[styles.ritualHeader, { color: '#F59E0B' }]}>💨 Ortam Buhuru & Doğal Koku (Difüzör):</Text>
                  <Text style={styles.bodyText}>{currentTree.natureRitual.ambientAroma}</Text>
                </View>

                <View style={styles.ritualItem}>
                  <Text style={[styles.ritualHeader, { color: '#14B8A6' }]}>✨ Ruhsal Dengeleyici Günlük Alışkanlık:</Text>
                  <Text style={styles.bodyText}>{currentTree.natureRitual.soulPractice}</Text>
                </View>
              </View>

              {/* Ruhsal Ağaç Uyumu */}
              <View style={styles.sectionCard}>
                <View style={styles.sectionTitleRow}>
                  <Ionicons name="heart-outline" size={18} color="#EC4899" />
                  <Text style={[styles.sectionTitle, { color: '#F472B6' }]}>Ruhsal Ağaç Uyumu (İlişkiler)</Text>
                </View>
                <View style={styles.relationshipRow}>
                  <Text style={styles.relLabel}>Rezonanstaki Uyumlu Ağaçlar:</Text>
                  <Text style={styles.relValues}>{currentTree.relationships.resonantTrees.join(', ')}</Text>
                </View>
                <View style={[styles.relationshipRow, { marginTop: 8 }]}>
                  <Text style={[styles.relLabel, { color: '#F59E0B' }]}>Geliştiren Zıt Ağaçlar (Katalizör):</Text>
                  <Text style={styles.relValues}>{currentTree.relationships.catalystTrees.join(', ')}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Ansiklopedi Başlığı ve Arama */}
          <View style={styles.encyclopediaHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="library-outline" size={20} color="#10B981" />
              <Text style={styles.encyclopediaTitle}>13 Kutsal Kelt Ağacı Ansiklopedisi</Text>
            </View>
            <TextInput
              style={styles.searchInput}
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholder="Ağaç veya tarih ara..."
              placeholderTextColor="#6B7280"
            />
          </View>

          {/* Ansiklopedi Kartları Listesi */}
          <View style={styles.treesGrid}>
            {filteredTrees.map((tree) => (
              <TouchableOpacity
                key={tree.id}
                style={styles.treeMiniCard}
                onPress={() => setSelectedModalTree(tree)}
                activeOpacity={0.7}
              >
                <View style={styles.miniCardHeader}>
                  <View style={styles.miniOgham}>
                    <Text style={styles.miniOghamText}>{tree.oghamSymbol}</Text>
                  </View>
                  <View style={styles.miniInfo}>
                    <Text style={styles.miniTitle}>{tree.name}</Text>
                    <Text style={styles.miniSub}>{tree.oghamName} • {tree.rulingPlanets}</Text>
                  </View>
                </View>
                <Text style={styles.miniArchetype} numberOfLines={2}>{tree.archetype}</Text>
                <Text style={styles.miniPeriod}>{tree.periods[0]?.label}</Text>
                <View style={styles.miniFooter}>
                  <Text style={styles.miniActionText}>Detayları İncele</Text>
                  <Ionicons name="arrow-forward" size={14} color="#10B981" />
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Sorumluluk Reddi */}
          <View style={styles.disclaimerCard}>
            <View style={styles.disclaimerHeader}>
              <Ionicons name="alert-circle-outline" size={16} color="#F59E0B" />
              <Text style={styles.disclaimerTitle}>Keltik Botanik ve Ritüel Sorumluluk Reddi</Text>
            </View>
            <Text style={styles.disclaimerText}>
              Bu analizde sunulan Kelt Druid ağaç arketipleri, Ogham sembolleri, Shinrin-Yoku (orman topraklanması) ve ortam buhuru önerileri sembolizm ve rezonans odaklıdır. Kesinlikle tıbbi teşhis, tedavi veya dahili tüketim niteliği taşımaz. Uçucu yağları yalnızca mekan buhuru olarak kullanınız.
            </Text>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>

        {/* Gün Seçici Modalı */}
        <Modal visible={showDayModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.pickerModalContent}>
              <View style={styles.pickerModalHeader}>
                <Text style={styles.pickerModalTitle}>Doğum Günü Seçin</Text>
                <TouchableOpacity onPress={() => setShowDayModal(false)}>
                  <Ionicons name="close" size={22} color="#FFF" />
                </TouchableOpacity>
              </View>
              <ScrollView style={{ maxHeight: 300 }}>
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
                  <TouchableOpacity
                    key={d}
                    style={[styles.pickerItem, selectedDay === d && styles.pickerItemActive]}
                    onPress={() => {
                      setSelectedDay(d);
                      setShowDayModal(false);
                    }}
                  >
                    <Text style={[styles.pickerItemText, selectedDay === d && styles.pickerItemTextActive]}>
                      {d}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Ay Seçici Modalı */}
        <Modal visible={showMonthModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.pickerModalContent}>
              <View style={styles.pickerModalHeader}>
                <Text style={styles.pickerModalTitle}>Doğum Ayı Seçin</Text>
                <TouchableOpacity onPress={() => setShowMonthModal(false)}>
                  <Ionicons name="close" size={22} color="#FFF" />
                </TouchableOpacity>
              </View>
              <ScrollView style={{ maxHeight: 300 }}>
                {MONTH_NAMES.map((m, idx) => (
                  <TouchableOpacity
                    key={idx + 1}
                    style={[styles.pickerItem, selectedMonth === idx + 1 && styles.pickerItemActive]}
                    onPress={() => {
                      const newMonth = idx + 1;
                      setSelectedMonth(newMonth);
                      const maxForNew = newMonth === 2 ? 29 : [4, 6, 9, 11].includes(newMonth) ? 30 : 31;
                      if (selectedDay > maxForNew) setSelectedDay(maxForNew);
                      setShowMonthModal(false);
                    }}
                  >
                    <Text style={[styles.pickerItemText, selectedMonth === idx + 1 && styles.pickerItemTextActive]}>
                      {m}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Ansiklopedi Detay Modalı */}
        <Modal visible={!!selectedModalTree} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.treeDetailModalContent}>
              {selectedModalTree && (
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={styles.detailModalHeader}>
                    <View style={styles.oghamBadge}>
                      <Text style={styles.oghamSymbol}>{selectedModalTree.oghamSymbol}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.oghamNameText}>Ogham: {selectedModalTree.oghamName}</Text>
                      <Text style={styles.detailModalTitle}>{selectedModalTree.name}</Text>
                      <Text style={styles.botanicalName}>{selectedModalTree.botanicalName}</Text>
                    </View>
                    <TouchableOpacity onPress={() => setSelectedModalTree(null)} style={styles.modalCloseBtn}>
                      <Ionicons name="close" size={22} color="#FFF" />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.modalArchetype}>{selectedModalTree.archetype}</Text>
                  <Text style={styles.detailPeriod}>{selectedModalTree.periods[0]?.label}</Text>

                  <View style={styles.proverbBox}>
                    <Text style={styles.proverbText}>"{selectedModalTree.druidicProverb}"</Text>
                  </View>

                  <Text style={styles.detailSectionTitle}>Mitolojik Ruhsal Öz</Text>
                  <Text style={styles.bodyText}>{selectedModalTree.spiritualEssence}</Text>

                  <Text style={[styles.detailSectionTitle, { marginTop: 14, color: '#6EE7B7' }]}>Işık Erdemleri</Text>
                  {selectedModalTree.lightTraits.map((t, idx) => (
                    <Text key={idx} style={styles.bulletItem}>✦ {t}</Text>
                  ))}

                  <Text style={[styles.detailSectionTitle, { marginTop: 14, color: '#FCD34D' }]}>Gölge Sınavı</Text>
                  {selectedModalTree.shadowTraits.map((t, idx) => (
                    <Text key={idx} style={styles.bulletItem}>❖ {t}</Text>
                  ))}

                  <TouchableOpacity
                    style={styles.applyTreeButton}
                    onPress={() => {
                      const firstPeriod = selectedModalTree.periods[0];
                      const analysis = getDruidTreeAnalysis(firstPeriod.startDay, firstPeriod.startMonth);
                      setSelectedDay(firstPeriod.startDay);
                      setSelectedMonth(firstPeriod.startMonth);
                      setAnalyzedData(analysis);
                      setSelectedModalTree(null);
                    }}
                  >
                    <Ionicons name="sparkles" size={16} color="#FEF08A" />
                    <Text style={styles.applyTreeButtonText}>Bu Ağacın Tam Analizini Gör</Text>
                  </TouchableOpacity>
                </ScrollView>
              )}
            </View>
          </View>
        </Modal>
      </View>
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
    paddingTop: Platform.OS === 'ios' ? 54 : 32,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#10B981',
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  heroBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10B981',
    textTransform: 'uppercase',
  },
  heroDesc: {
    fontSize: 13,
    color: '#D1D5DB',
    lineHeight: 20,
  },
  formCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 24,
    padding: 18,
    marginBottom: 20,
  },
  formSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 14,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 6,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  textInput: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#FFF',
    fontSize: 14,
  },
  datePickerRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  dateCol: {
    flex: 1,
  },
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  selectorButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  calculateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#059669',
    borderRadius: 16,
    paddingVertical: 15,
    shadowColor: '#10B981',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  calculateButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  resultContainer: {
    marginBottom: 24,
  },
  treeCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.35)',
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
  },
  treeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  oghamBadge: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  oghamSymbol: {
    fontSize: 30,
    color: '#34D399',
  },
  treeTitleContainer: {
    flex: 1,
  },
  oghamNameText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#34D399',
    textTransform: 'uppercase',
  },
  treeName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFF',
    marginVertical: 2,
  },
  botanicalName: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  metricBox: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    padding: 10,
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#10B981',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
  },
  periodsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  periodsTitle: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  periodsValue: {
    fontSize: 12,
    color: '#6EE7B7',
    fontWeight: '700',
  },
  proverbBox: {
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
    paddingLeft: 12,
    marginVertical: 12,
  },
  proverbText: {
    fontSize: 13,
    color: '#FEF08A',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
    borderRadius: 14,
    paddingVertical: 12,
    marginTop: 6,
  },
  shareButtonText: {
    color: '#6EE7B7',
    fontSize: 13,
    fontWeight: '700',
  },
  sectionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10B981',
    textTransform: 'uppercase',
  },
  bodyText: {
    fontSize: 13,
    color: '#D1D5DB',
    lineHeight: 21,
  },
  dualGrid: {
    flexDirection: 'column',
    gap: 12,
    marginBottom: 14,
  },
  traitCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
  },
  traitTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  traitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 6,
  },
  bullet: {
    fontSize: 12,
    marginTop: 2,
  },
  traitText: {
    fontSize: 12,
    color: '#D1D5DB',
    flex: 1,
    lineHeight: 18,
  },
  ritualItem: {
    marginTop: 10,
  },
  ritualHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6EE7B7',
    marginBottom: 3,
  },
  relationshipRow: {
    marginTop: 4,
  },
  relLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10B981',
    marginBottom: 2,
  },
  relValues: {
    fontSize: 13,
    color: '#D1D5DB',
  },
  encyclopediaHeader: {
    marginTop: 10,
    marginBottom: 14,
  },
  encyclopediaTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  searchInput: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#FFF',
    fontSize: 13,
    marginTop: 10,
  },
  treesGrid: {
    gap: 12,
  },
  treeMiniCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 18,
    padding: 14,
  },
  miniCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  miniOgham: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniOghamText: {
    fontSize: 18,
    color: '#34D399',
  },
  miniInfo: {
    flex: 1,
  },
  miniTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },
  miniSub: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  miniArchetype: {
    fontSize: 12,
    color: '#6EE7B7',
    fontWeight: '600',
    marginTop: 8,
  },
  miniPeriod: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 4,
  },
  miniFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    paddingTop: 8,
    marginTop: 10,
  },
  miniActionText: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '600',
  },
  disclaimerCard: {
    backgroundColor: 'rgba(245, 158, 11, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
    borderRadius: 16,
    padding: 14,
    marginTop: 20,
  },
  disclaimerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  disclaimerTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F59E0B',
    textTransform: 'uppercase',
  },
  disclaimerText: {
    fontSize: 11,
    color: '#D1D5DB',
    lineHeight: 17,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    padding: 20,
  },
  pickerModalContent: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    padding: 18,
    maxHeight: 400,
  },
  pickerModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: 10,
  },
  pickerModalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  pickerItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 4,
  },
  pickerItemActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
  },
  pickerItemText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  pickerItemTextActive: {
    color: '#34D399',
    fontWeight: '700',
  },
  treeDetailModalContent: {
    backgroundColor: '#0B131B',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
    padding: 20,
    maxHeight: '85%',
  },
  detailModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  detailModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalArchetype: {
    fontSize: 13,
    color: '#34D399',
    fontWeight: '700',
    marginBottom: 4,
  },
  detailPeriod: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 10,
  },
  detailSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10B981',
    textTransform: 'uppercase',
    marginTop: 10,
    marginBottom: 4,
  },
  bulletItem: {
    fontSize: 12,
    color: '#D1D5DB',
    marginVertical: 2,
    lineHeight: 18,
  },
  applyTreeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#059669',
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 18,
  },
  applyTreeButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
