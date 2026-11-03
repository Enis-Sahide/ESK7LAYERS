import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { showAnalysisLockedAlert } from '@/src/hooks/useAnalysisAccess';

interface WebLockedAnalysisCardProps {
  title?: string;
  description?: string;
}

export default function WebLockedAnalysisCard({
  title = 'Kilitli Bölümler & Detaylı Analiz',
  description = 'Mobil uygulamada analizlerin özet katmanları sunulmaktadır. Kilitli kısımları detaylı görmek, tek ödeme ile sınırsız sorgulama yapmak ve özel PDF raporlarına ulaşmak için 7Layers web sitesini ziyaret edin.',
}: WebLockedAnalysisCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => showAnalysisLockedAlert(title)}
      style={styles.card}
    >
      <View style={styles.iconCircle}>
        <Ionicons name="lock-closed" size={22} color="#D4AF37" />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.desc}>{description}</Text>
      <View style={styles.badge}>
        <Ionicons name="globe-outline" size={14} color="#FDE68A" />
        <Text style={styles.badgeText}>Detaylı analiz için 7Layers web sitesini ziyaret edin</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 18,
    marginBottom: 14,
    padding: 18,
    borderRadius: 18,
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.42)',
    alignItems: 'center',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(212, 175, 55, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 15.5,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 6,
  },
  desc: {
    fontSize: 12.5,
    color: '#D1D5DB',
    textAlign: 'center',
    lineHeight: 18.5,
    marginBottom: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.35)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#FDE68A',
  },
});
