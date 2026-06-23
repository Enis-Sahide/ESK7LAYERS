import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Dimensions, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { updateProfile } from '@/src/core/api/client';
import { useContent } from '@/src/core/content/useContent';
import { COLORS, SIZES } from '@/src/theme';

const { width } = Dimensions.get('window');

// RACES içeriği (avatar URL dahil) DB'den gelir (/api/content/races)

export default function RaceSelectionScreen() {
  const router = useRouter();
  const { data: racesData } = useContent<any[]>('/api/content/races');
  const RACES = racesData ?? [];
  const [selectedRace, setSelectedRace] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedRace && RACES.length > 0) setSelectedRace(RACES[0]);
  }, [racesData]);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await updateProfile({ race: selectedRace.id });
    } catch (e) {
      console.error('Race kaydedilemedi:', e);
    }
    setLoading(false);
    router.replace('/(dashboard)');
  };

  const renderRaceItem = ({ item }: { item: typeof RACES[0] }) => {
    const isSelected = selectedRace.id === item.id;
    return (
      <TouchableOpacity 
        style={[styles.raceCard, isSelected && styles.raceCardSelected]} 
        onPress={() => setSelectedRace(item)}
      >
        <Image
          source={{ uri: item.avatar }}
          style={styles.cardImage}
        />
        <View style={[styles.cardOverlay, isSelected && styles.cardOverlaySelected]}>
          <Text style={[styles.cardTitle, isSelected && styles.cardTitleSelected]}>
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (!selectedRace) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator color={COLORS.primary} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kozmik Kökenini Seç</Text>
      <Text style={styles.subtitle}>İçindeki sese kulak ver ve ait olduğun yıldız tohumunu hisset.</Text>

      <View style={styles.listContainer}>
        <FlatList
          data={RACES}
          keyExtractor={(item) => item.id}
          renderItem={renderRaceItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          snapToInterval={width * 0.65 + 20}
          decelerationRate="fast"
        />
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.selectedName}>{selectedRace.name}</Text>
        <Text style={styles.selectedDesc}>{selectedRace.desc}</Text>

        <TouchableOpacity 
          style={styles.confirmButton} 
          onPress={handleConfirm}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.background} />
          ) : (
            <Text style={styles.confirmText}>Bu Irk İle İnisiyasyona Başla</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 80,
  },
  title: {
    color: COLORS.primary,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 30,
    marginBottom: 40,
  },
  listContainer: {
    height: 380,
  },
  raceCard: {
    width: width * 0.65,
    height: 350,
    marginHorizontal: 10,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    opacity: 0.6,
  },
  raceCardSelected: {
    borderColor: COLORS.primary,
    opacity: 1,
    transform: [{ scale: 1.05 }],
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(10, 15, 30, 0.8)',
    padding: 15,
  },
  cardOverlaySelected: {
    backgroundColor: 'rgba(212, 175, 55, 0.9)',
  },
  cardTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cardTitleSelected: {
    color: COLORS.background,
  },
  detailsContainer: {
    flex: 1,
    padding: SIZES.padding,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 50,
  },
  selectedName: {
    color: COLORS.primary,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  selectedDesc: {
    color: COLORS.text,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  confirmButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
  },
  confirmText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  }
});
