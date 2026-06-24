import SacredBackground from '@/components/SacredBackground';
import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ImageBackground, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '@/src/theme';
import { useContent } from '@/src/core/content/useContent';

const ESOTERIC_BG = require('@/assets/images/esoteric_bg_indigo.webp');

export default function DuygusalHastaliklarScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const { data: diseases } = useContent<any[]>('/api/content/emotional-diseases');

  const filteredDiseases = useMemo(() => {
    const all = diseases ?? [];
    let result = [...all];
    if (searchQuery.trim()) {
      result = result.filter(d =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.cause.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    // Alfabetik sırala (Türkçe karakter desteği ile)
    result.sort((a, b) => a.name.localeCompare(b.name, 'tr-TR'));
    return result;
  }, [searchQuery, diseases]);

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SacredBackground>
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={28} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Hastalıkların Duygusal Nedenleri</Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color={COLORS.textMuted} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Hastalık ara... (Örn: Baş ağrısı, Mide)"
              placeholderTextColor={COLORS.textMuted + '80'}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color={COLORS.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <FlatList
          data={filteredDiseases}
          keyExtractor={(item, index) => index.toString()}
          initialNumToRender={15}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={Platform.OS === 'android'}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          ListHeaderComponent={
            <View style={styles.introContainer}>
              <Ionicons name="heart-half-outline" size={40} color="#FF3B30" style={{ marginBottom: 15 }} />
              <Text style={styles.introTitle}>Bedenin Mesajları: Psikozomatik Bağlantı</Text>
              <Text style={[styles.introText, { textAlign: 'left', fontStyle: 'normal' }]}>
                Kadim öğretilere ve modern psikolojiye göre, bedenimiz aslında bilinçaltımızın bir yansımasıdır. Yaşadığımız, ancak ifade edemediğimiz veya çözemediğimiz duygusal tıkanıklıklar zamanla fiziksel bedende "hastalık" olarak tezahür eder.{"\n\n"}
                Bir ağrı veya semptom ortaya çıktığında, bu aslında bedenin bir yardım çağrısıdır. Kadim şifa sanatlarına göre, her organın ve bedensel bölgenin temsil ettiği spesifik duygusal ve zihinsel kalıplar vardır.{"\n\n"}
                Bu kütüphane, fiziksel semptomlarınızın altında yatan olası zihinsel kök inançları bulmanız için tasarlanmıştır. Şifa süreci, semptomu sadece fiziksel olarak bastırmakla değil, onun size ne anlatmaya çalıştığını anlamakla başlar. Mesajı alıp o kök duyguyu sevgiyle serbest bıraktığınızda, bedenin kendi kendini iyileştirme mekanizması devreye girer.
              </Text>
            </View>
          }
          renderItem={({ item: disease }) => (
            <View style={styles.diseaseCard}>
              <Text style={styles.diseaseName}>{disease.name}</Text>
              <View style={styles.diseaseRow}>
                <Ionicons name="alert-circle-outline" size={16} color="#FF9500" style={styles.diseaseIcon} />
                <Text style={styles.diseaseCause}>{disease.cause}</Text>
              </View>
              <View style={styles.diseaseRow}>
                <Ionicons name="heart-circle-outline" size={16} color="#34C759" style={styles.diseaseIcon} />
                <Text style={styles.diseaseAffirmation}>{disease.affirmation}</Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.noResultText}>Sonuç bulunamadı.</Text>
          }
          ListFooterComponent={
            <View style={{ height: 40 }} />
          }
        />
      </SacredBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.2)',
  },
  backBtn: { padding: 5, backgroundColor: 'rgba(212, 175, 55, 0.1)', borderRadius: 12 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: 'rgba(10, 15, 30, 0.9)',
    zIndex: 10,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: SIZES.radius,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    height: 50,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, color: COLORS.text, fontSize: 15 },
  scrollContent: { padding: SIZES.padding },
  introContainer: {
    alignItems: 'center',
    marginBottom: 30,
    padding: 20,
    backgroundColor: 'rgba(212, 175, 55, 0.05)',
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  introTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  introText: {
    color: COLORS.textMuted,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  resultsContainer: { marginTop: 5 },
  diseaseCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: SIZES.radius,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  diseaseName: { color: COLORS.primary, fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  diseaseRow: { flexDirection: 'row', marginBottom: 8, alignItems: 'flex-start' },
  diseaseIcon: { marginTop: 2, marginRight: 8 },
  diseaseCause: { color: COLORS.text, fontSize: 13, lineHeight: 20, flex: 1 },
  diseaseAffirmation: { color: '#34C759', fontSize: 13, lineHeight: 20, fontStyle: 'italic', flex: 1 },
  noResultText: { color: COLORS.textMuted, textAlign: 'center', padding: 20, fontStyle: 'italic' }
});
