import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { showAnalysisLockedAlert } from '@/src/hooks/useAnalysisAccess';

interface WebLockedAnalysisCardProps {
  title?: string;
  description?: string;
}

export default function WebLockedAnalysisCard({
  title = 'Kapsamlı Analiz & Detaylı Görünüm',
  description = 'Mobil uygulamada analizlerin ekran boyutuna uyarlanmış özet katmanları sunulmaktadır. Daha detaylı analiz ve tüm katmanları incelemek için 7Layers web sitesini ziyaret edin.',
}: WebLockedAnalysisCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => showAnalysisLockedAlert(title)}
      style={styles.card}
    >
      <View style={styles.headerRow}>
        <View style={styles.iconCircle}>
          <Ionicons name="desktop-outline" size={20} color="#D4AF37" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.desc}>{description}</Text>
        </View>
      </View>
      <View style={styles.badge}>
        <Ionicons name="globe-outline" size={14} color="#FDE68A" />
        <Text style={styles.badgeText}>Daha detaylı analiz için 7Layers web sitesini ziyaret edin</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 4,
    marginBottom: 16,
    padding: 15,
    borderRadius: 16,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.45)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 10,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(212, 175, 55, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  title: {
    fontSize: 14.5,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  desc: {
    fontSize: 12,
    color: '#D1D5DB',
    lineHeight: 17.5,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.35)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#FDE68A',
  },
});
