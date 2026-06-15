import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Dimensions, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/src/core/api/supabase';
import { COLORS, SIZES } from '@/src/theme';

const { width } = Dimensions.get('window');

const AVATARS: Record<string, any> = {
  'pleiades': { uri: 'https://mbqjklupfoqbcfxusigs.supabase.co/storage/v1/object/public/app-assets/images/avatars/pleiades.png' },
  'sirius': { uri: 'https://mbqjklupfoqbcfxusigs.supabase.co/storage/v1/object/public/app-assets/images/avatars/sirius.png' },
  'arcturus': { uri: 'https://mbqjklupfoqbcfxusigs.supabase.co/storage/v1/object/public/app-assets/images/avatars/arcturus.png' },
  'andromeda': { uri: 'https://mbqjklupfoqbcfxusigs.supabase.co/storage/v1/object/public/app-assets/images/avatars/andromeda.png' },
  'lyra': { uri: 'https://mbqjklupfoqbcfxusigs.supabase.co/storage/v1/object/public/app-assets/images/avatars/lyra.png' },
  'orion': { uri: 'https://mbqjklupfoqbcfxusigs.supabase.co/storage/v1/object/public/app-assets/images/avatars/orion.png' },
  'mintaka': { uri: 'https://mbqjklupfoqbcfxusigs.supabase.co/storage/v1/object/public/app-assets/images/avatars/mintaka.png' },
  'orion_pleiades': { uri: 'https://mbqjklupfoqbcfxusigs.supabase.co/storage/v1/object/public/app-assets/images/avatars/orion_pleiades.png' },
  'blue_avians': { uri: 'https://mbqjklupfoqbcfxusigs.supabase.co/storage/v1/object/public/app-assets/images/avatars/sirius.png' },
  'sirius_pleiades': { uri: 'https://mbqjklupfoqbcfxusigs.supabase.co/storage/v1/object/public/app-assets/images/avatars/pleiades.png' },
  'lyra_arcturus': { uri: 'https://mbqjklupfoqbcfxusigs.supabase.co/storage/v1/object/public/app-assets/images/avatars/arcturus.png' },
  'atlantis': { uri: 'https://mbqjklupfoqbcfxusigs.supabase.co/storage/v1/object/public/app-assets/images/avatars/mintaka.png' },
  'indigo': { uri: 'https://mbqjklupfoqbcfxusigs.supabase.co/storage/v1/object/public/app-assets/images/avatars/pleiades.png' },
};

const RACES = [
  { id: 'pleiades', name: 'Pleiades (Ülker)', desc: 'Şifacılar, sevgi ve ışık elçileri.' },
  { id: 'sirius', name: 'Sirius', desc: 'Kadim bilgelik, büyü ve spiritüel rehberler.' },
  { id: 'arcturus', name: 'Arcturus', desc: 'İleri teknoloji, kutsal geometri, zihinsel şifa.' },
  { id: 'andromeda', name: 'Andromeda', desc: 'Özgürlük savaşçıları, galaktik gezginler.' },
  { id: 'lyra', name: 'Lyra (Lir)', desc: 'Galaksinin ataları, cesur savaşçılar.' },
  { id: 'orion', name: 'Orion', desc: 'Bilgi, zihinsel güç ve çatışma çözücü bilgeler.' },
  { id: 'mintaka', name: 'Mintaka', desc: 'Su elementi, derin empati ve barış elçileri.' },
  { id: 'blue_avians', name: 'Mavi Kuşsullar', desc: '6. Boyut varlıkları, adalet ve kozmik denge.' },
  { id: 'sirius_pleiades', name: 'Sirius - Pleiades Melezi', desc: 'Bilgelik ve sonsuz sevginin birleşimi.' },
  { id: 'lyra_arcturus', name: 'Lyra - Arcturus Melezi', desc: 'Kadim cesaret ve yüksek teknolojinin sentezi.' },
  { id: 'orion_pleiades', name: 'Orion - Pleiades Melezi', desc: 'Keskin bir zeka ve koşulsuz sevginin nadir birleşimi.' },
  { id: 'atlantis', name: 'Lemurya / Atlantis Tohumu', desc: 'Kadim Dünya bilgeliği ile kozmik enerjinin melezleri.' },
  { id: 'indigo', name: 'İndigo / Kristal Enerji', desc: 'Dünyanın titreşimini yükseltmek için gelmiş yeni çağ melezleri.' }
];

export default function RaceSelectionScreen() {
  const router = useRouter();
  const [selectedRace, setSelectedRace] = useState(RACES[0]);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await supabase.auth.updateUser({
      data: { race: selectedRace.id }
    });
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
          source={AVATARS[item.id] || AVATARS['pleiades']} 
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
