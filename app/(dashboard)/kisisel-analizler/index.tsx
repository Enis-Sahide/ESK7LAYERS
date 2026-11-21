import SacredBackground from '@/components/SacredBackground';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '@/src/theme';

interface AnalysisTool {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  color: string;
  isAvailable: boolean;
  isWebExclusive?: boolean;
}

const ANALYSIS_TOOLS: AnalysisTool[] = [
  {
    id: 'astroloji',
    title: 'Doğum Haritası',
    description: 'Gezegenlerin doğum anınızdaki konumlarıyla ruhunuzun kozmik planını analiz edin.',
    icon: 'planet-outline',
    route: '/(dashboard)/kisisel-analizler/astroloji',
    color: '#D4AF37',
    isAvailable: true,
  },
  {
    id: 'anlikgokyuzu',
    title: 'Anlık Gökyüzü (Transit)',
    description: '7Layers Kozmik Barometresi, anlık gökyüzü açıları ve kişisel transit sentezinizi inceleyin.',
    icon: 'compass-outline',
    route: '/(dashboard)/kisisel-analizler/anlik-gokyuzu',
    color: '#32ADE6',
    isAvailable: true,
  },
  {
    id: 'gunlukrehber',
    title: '7Layers Günlük Rehber',
    description: 'Kişisel günlük çakra frekansı, en etkili meditasyon gezegen saati, nefes sayacı, mudra, yön ve doğal taş reçeteniz.',
    icon: 'book-outline',
    route: '/(dashboard)/kisisel-analizler/gunluk-rehber',
    color: '#F59E0B',
    isAvailable: true,
  },
  {
    id: 'aydonguleri',
    title: 'Ay Döngüleri & Tutulmalar',
    description: 'Aktif Ay fazını, tutulma koridorlarını ve kişisel evinizdeki kadersel yansımalarını keşfedin.',
    icon: 'moon-outline',
    route: '/(dashboard)/kisisel-analizler/ay-donguleri',
    color: '#E5C158',
    isAvailable: true,
  },
  {
    id: 'gezegensaatleri',
    title: 'Gezegen Saatleri (Keldani)',
    description: 'Bulunduğunuz konuma göre gün doğumu ve gün batımıyla hesaplanan kadim gezegen saatlerini takip edin.',
    icon: 'hourglass-outline',
    route: '/(dashboard)/kisisel-analizler/gezegen-saatleri',
    color: '#F59E0B',
    isAvailable: true,
  },
  {
    id: 'chakraanalysis',
    title: 'Çakra Analizi',
    description: 'Doğum haritanız ve çakra enerjileriniz arasındaki ilişkiyi analiz edin ve blokajları keşfedin.',
    icon: 'scan-circle-outline',
    route: '/(dashboard)/chakra-analysis',
    color: '#FF2D55',
    isAvailable: true,
  },
  {
    id: 'frekansaynasi',
    title: 'Frekans Aynası (Canlı)',
    description: 'Günün gökyüzü transit sınavı karşısında hangi haritanızı çalıştırdığınızı anlık teşhis edin.',
    icon: 'sparkles-outline',
    route: '/(dashboard)/kisisel-analizler/frekans-aynasi',
    color: '#0EA5E9',
    isAvailable: true,
  },
  {
    id: 'humandesign',
    title: 'Human Design (Tasarımınız)',
    description: 'Doğum saati ve konumunuza göre enerji tipinizi, otoritenizi ve stratejinizi keşfedin.',
    icon: 'finger-print-outline',
    route: '/(dashboard)/kisisel-analizler/human-design',
    color: '#34C759',
    isAvailable: true,
  },
  {
    id: 'numeroloji',
    title: 'Numeroloji Analizi',
    description: 'İsim ve doğum tarihinizle Pisagor sayısal titreşimlerinizi ve yaşam yolu döngülerinizi analiz edin.',
    icon: 'infinite-outline',
    route: '/(dashboard)/kisisel-analizler/numeroloji',
    color: '#AF52DE',
    isAvailable: true,
  },
  {
    id: 'sembolkodlari',
    title: 'Üst Benlik Sembol & Kod Analizi',
    description: 'Ruh, Beden ve 3. Harita senteziyle 12 kişisel kodunuzu, karmik borçlarınızı ve günlük Üst Benlik işaretlerinizi çözün.',
    icon: 'key-outline',
    route: '/(dashboard)/kisisel-analizler/sembol-kodlari',
    color: '#F43F5E',
    isAvailable: true,
  },
  {
    id: 'kariyer',
    title: 'Mesleki Yatkınlık & Kariyer',
    description: 'Gezegenlerinizin ve Drakonik ruh haritanızın senteziyle ideal meslek alanlarınızı ve servet rotanızı keşfedin.',
    icon: 'briefcase-outline',
    route: '/(dashboard)/kisisel-analizler/kariyer',
    color: '#EAB308',
    isAvailable: true,
  },
  {
    id: 'kabalistik4alem',
    title: 'Kabalistik 4 Alem',
    description: 'Sefirot Hayat Ağacındaki kadersel sıçrama noktalarınızı ve 4 alem dengenizi bulun.',
    icon: 'git-network-outline',
    route: '/(dashboard)/kisisel-analizler/kabalistik-4-alem',
    color: '#D4AF37',
    isAvailable: true,
  },
  {
    id: 'cosmic-matrix',
    title: '7Layers Kozmik Matris',
    description: 'Astroloji, Kabalistik 4 Alem, Human Design ve Kadim Rune sentezini tek matriste inceleyin.',
    icon: 'layers-outline',
    route: '',
    color: '#F59E0B',
    isAvailable: true,
    isWebExclusive: true,
  },
  {
    id: 'incarnation',
    title: 'Karmik & Enkarnasyon',
    description: 'Önceki enkarnasyon kimliğiniz, karmik borçlarınız, Kraliyet Yıldızları ve Drakonik ruh hafızanız.',
    icon: 'flame-outline',
    route: '',
    color: '#FFD700',
    isAvailable: true,
    isWebExclusive: true,
  },
  {
    id: 'druidtree',
    title: 'Kelt Druid Ağacı Analizi',
    description: '13 kutsal Ogham ağacındaki ruhsal arketipinizi, Ogham harfinizi ve topraklanma ritüelinizi analiz edin.',
    icon: 'leaf-outline',
    route: '/(dashboard)/kisisel-analizler/kelt-druid-agaci',
    color: '#10B981',
    isAvailable: true,
  },
  {
    id: 'rectification',
    title: 'Doğum Saati Keşfi (Beta)',
    description: 'Kadersel yaşam olaylarınız ve mizaç analiziyle bilinmeyen doğum saatinizi tespit edin.',
    icon: 'time-outline',
    route: '/(dashboard)/kisisel-analizler/dogum-saati-belirleme',
    color: '#E0AA3E',
    isAvailable: true,
  },
  {
    id: 'schumann',
    title: 'Schumann Rezonansı',
    description: 'Dünyanın elektromanyetik kalp atışını ve zihinsel frekansınızla olan rezonansını canlı takip edin.',
    icon: 'pulse-outline',
    route: '/(dashboard)/kisisel-analizler/schumann',
    color: '#00E5FF',
    isAvailable: true,
  },
];

export default function AnalysisHubScreen() {
  const router = useRouter();
  const [selectedWebTool, setSelectedWebTool] = useState<AnalysisTool | null>(null);

  const handlePress = (tool: AnalysisTool) => {
    if (!tool.isAvailable) return;
    if (tool.isWebExclusive) {
      setSelectedWebTool(tool);
      return;
    }
    router.push(tool.route as any);
  };

  return (
    <SacredBackground>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={26} color={COLORS.primary} />
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.headerTitle}>Ruhsal Analiz Merkezi</Text>
          <Text style={styles.headerSubtitle}>Astroloji, Kabala, Numeroloji &amp; Human Design</Text>
        </View>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {ANALYSIS_TOOLS.map((tool) => (
          <TouchableOpacity
            key={tool.id}
            style={[styles.toolCard, !tool.isAvailable && { opacity: 0.6 }]}
            onPress={() => handlePress(tool)}
            activeOpacity={0.82}
            disabled={!tool.isAvailable}
          >
            <View style={[styles.iconContainer, { backgroundColor: tool.color + '18', borderColor: tool.color + '55' }]}>
              <Ionicons name={tool.icon} size={24} color={tool.color} />
            </View>
            <View style={styles.cardContent}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                <Text style={[styles.cardTitle, { color: '#FFFFFF', flexShrink: 1 }]}>{tool.title}</Text>
                {tool.isWebExclusive && (
                  <View style={styles.webBadge}>
                    <Ionicons name="desktop-outline" size={10} color="#FDE68A" />
                    <Text style={styles.webBadgeText}>Web</Text>
                  </View>
                )}
              </View>
              <Text style={styles.cardDesc} numberOfLines={2}>
                {tool.description}
              </Text>
            </View>

            {tool.isAvailable && (
              <Ionicons
                name="chevron-forward"
                size={18}
                color={COLORS.textMuted}
                style={{ marginLeft: 8 }}
              />
            )}
          </TouchableOpacity>
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* 7Layers Kozmik Matris & Karmik Enkarnasyon Bilgilendirme Penceresi */}
      <Modal
        visible={!!selectedWebTool}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedWebTool(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconBox}>
              <Ionicons name="desktop-outline" size={28} color="#D4AF37" />
            </View>
            <Text style={styles.modalTitle}>{selectedWebTool?.title}</Text>
            <Text style={styles.modalDesc}>
              Daha detaylı analiz ve tüm katmanları incelemek için lütfen <Text style={{ color: '#FDE68A', fontWeight: '700' }}>7Layers web sitesini</Text> ziyaret edin.
            </Text>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setSelectedWebTool(null)}
              activeOpacity={0.85}
            >
              <Text style={styles.modalCloseBtnText}>Tamam</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SacredBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 58,
    paddingHorizontal: 18,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.2)',
  },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary },
  headerSubtitle: { fontSize: 11.5, color: COLORS.textMuted, marginTop: 3 },
  scrollContent: { padding: 16 },
  toolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(12, 12, 18, 0.8)',
    borderRadius: SIZES.radius,
    padding: 15,
    marginBottom: 11,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 17,
  },
  webBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(212, 175, 55, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.4)',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 8,
  },
  webBadgeText: {
    fontSize: 10,
    color: '#FDE68A',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.82)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#0F111A',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.45)',
    padding: 24,
    alignItems: 'center',
  },
  modalIconBox: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalDesc: {
    fontSize: 13.5,
    color: '#D1D5DB',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  modalCloseBtn: {
    width: '100%',
    backgroundColor: '#D4AF37',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCloseBtnText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
