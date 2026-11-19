import React from 'react';
import { Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { showAnalysisLockedAlert } from '@/src/hooks/useAnalysisAccess';

interface WebLockedAnalysisCardProps {
  title?: string;
  description?: string;
}

export default function WebLockedAnalysisCard({
  title = 'Kapsamlı Analiz & Detaylı Görünüm',
}: WebLockedAnalysisCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => showAnalysisLockedAlert(title)}
      style={styles.badge}
    >
      <Ionicons name={Platform.OS === 'ios' ? 'lock-closed-outline' : 'globe-outline'} size={15} color="#FDE68A" />
      <Text style={styles.badgeText}>
        {Platform.OS === 'ios'
          ? 'Kapsamlı analiz görünümü ileri seviye üyelik kapsamındadır'
          : 'Daha detaylı analiz için 7Layers web sitesini ziyaret edin'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  badge: {
    marginTop: 4,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.45)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FDE68A',
    textAlign: 'center',
  },
});
