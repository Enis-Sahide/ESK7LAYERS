import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Modal, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import SacredBackground from '@/components/SacredBackground';
import { COLORS } from '@/src/theme';

export default function ExploreScreen() {
  const router = useRouter();
  const [isImeceModalOpen, setIsImeceModalOpen] = useState(false);

  const handleOpenImeceLink = () => {
    Linking.openURL('https://imecesistem.com.tr/davet/TM/BT90000000114');
    setIsImeceModalOpen(false);
  };

  const navigateToImeceHealth = () => {
    setIsImeceModalOpen(false);
    router.push('/(dashboard)/imece-health');
  };

  const modules = [
    {
      title: 'Mistik Mağaza',
      subtitle: 'Şifalı Ürünler',
      icon: 'bag-handle-outline',
      color: '#D4AF37',
      gradient: ['rgba(212, 175, 55, 0.15)', 'rgba(0, 0, 0, 0.4)'],
      route: '/(tabs)/store'
    },
    {
      title: 'Meditasyon',
      subtitle: 'Zihinsel Huzur',
      icon: 'leaf-outline',
      color: '#8A2BE2',
      gradient: ['rgba(138, 43, 226, 0.15)', 'rgba(0, 0, 0, 0.4)'],
      route: '/(dashboard)/meditation'
    },
    {
      title: 'Nefes Egzersizleri',
      subtitle: 'Yaşam Enerjisi',
      icon: 'wind',
      color: '#00BFFF',
      gradient: ['rgba(0, 191, 255, 0.15)', 'rgba(0, 0, 0, 0.4)'],
      route: '/(dashboard)/breathwork'
    },
    {
      title: 'Kadim Dersler',
      subtitle: 'Mistik Bilgiler',
      icon: 'book-outline',
      color: '#FF7F50',
      gradient: ['rgba(255, 127, 80, 0.15)', 'rgba(0, 0, 0, 0.4)'],
      route: '/(dashboard)/kadim-dersler'
    },
    {
      title: 'Kişisel Analizler',
      subtitle: 'Astroloji & Çakra',
      icon: 'compass-outline',
      color: '#FF69B4',
      gradient: ['rgba(255, 105, 180, 0.15)', 'rgba(0, 0, 0, 0.4)'],
      route: '/(dashboard)/kisisel-analizler'
    },
    {
      title: 'Seviye Sınavları',
      subtitle: 'Çıraklıktan Üstadlığa',
      icon: 'ribbon-outline',
      color: '#4169E1',
      gradient: ['rgba(65, 105, 225, 0.15)', 'rgba(0, 0, 0, 0.4)'],
      route: '/(dashboard)/tests'
    }
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <SacredBackground>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Keşfet</Text>
            <Text style={styles.headerSubtitle}>Bütünsel şifa ve kadim bilgilerin dünyasını keşfedin...</Text>
          </View>

          {/* İmece Banner */}
          <LinearGradient
            colors={['rgba(16, 185, 129, 0.25)', 'rgba(20, 184, 166, 0.15)', 'rgba(0, 0, 0, 0.6)']}
            style={styles.bannerContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.bannerHeader}>
              <View style={styles.heartIconWrapper}>
                <Ionicons name="heart-half-outline" size={32} color="#10B981" />
              </View>
              <View style={styles.bannerTextContainer}>
                <Text style={styles.bannerTitle}>İmece ile Sağlığı Destekle</Text>
                <Text style={styles.bannerDesc}>
                  Beden ve zihin dengenizi doğal, temiz ve güvenilir ürünlerle desteklemeye hazır mısınız? İmece sisteminin özel seçkisini inceleyin.
                </Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.bannerButton} 
              onPress={() => setIsImeceModalOpen(true)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#10B981', '#14B8A6']}
                style={styles.bannerButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.bannerButtonText}>Tercihli Müşteri Ol & Alışverişe Başla</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>

          {/* Grid Modules Title */}
          <View style={styles.sectionHeader}>
            <Ionicons name="apps-outline" size={20} color="#D4AF37" />
            <Text style={styles.sectionTitle}>Mistik Modüller</Text>
          </View>

          {/* Grid Modules */}
          <View style={styles.gridContainer}>
            {modules.map((mod, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.gridCard}
                onPress={() => router.push(mod.route as any)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={mod.gradient as [string, string, ...string[]]}
                  style={styles.cardGradient}
                >
                  <View style={[styles.cardIconWrapper, { backgroundColor: `${mod.color}15`, borderColor: `${mod.color}30` }]}>
                    <Ionicons name={mod.icon as any} size={24} color={mod.color} />
                  </View>
                  <Text style={styles.cardTitle}>{mod.title}</Text>
                  <Text style={styles.cardSubtitle}>{mod.subtitle}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>

        </ScrollView>
      </SacredBackground>

      {/* İmece Modal */}
      <Modal
        visible={isImeceModalOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsImeceModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFillObject} />
          
          <View style={styles.modalCard}>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setIsImeceModalOpen(false)}
            >
              <Ionicons name="close" size={24} color="#8E8E93" />
            </TouchableOpacity>

            <View style={styles.modalIconWrapper}>
              <Ionicons name="heart-half-outline" size={40} color="#10B981" />
            </View>

            <Text style={styles.modalTitle}>İmece ile Sağlığını Destekle</Text>
            <Text style={styles.modalSubtitle}>
              Beden ve zihin dengenizi doğal, temiz ve güvenilir ürünlerle desteklemeye hazır mısınız?
            </Text>

            <View style={styles.bulletList}>
              <View style={styles.bulletItem}>
                <Text style={styles.bulletEmoji}>🌿</Text>
                <View style={styles.bulletTextContainer}>
                  <Text style={styles.bulletTitle}>Doğal & Güvenilir İçerikler</Text>
                  <Text style={styles.bulletDesc}>Katkısız, temiz ve doğanın gücünü yansıtan formüller.</Text>
                </View>
              </View>

              <View style={styles.bulletItem}>
                <Text style={styles.bulletEmoji}>🤝</Text>
                <View style={styles.bulletTextContainer}>
                  <Text style={styles.bulletTitle}>İmece Paylaşım Ruhu</Text>
                  <Text style={styles.bulletDesc}>Sağlığınızı desteklerken toplumsal yardımlaşmaya katkı sağlayın.</Text>
                </View>
              </View>

              <View style={styles.bulletItem}>
                <Text style={styles.bulletEmoji}>🎯</Text>
                <View style={styles.bulletTextContainer}>
                  <Text style={styles.bulletTitle}>Bütünsel Şifa Yaklaşımı</Text>
                  <Text style={styles.bulletDesc}>Yaşam kalitenizi artırmaya yönelik özel ürün seçkisi.</Text>
                </View>
              </View>
            </View>

            <Text style={styles.modalLinkNotice}>
              Aşağıdaki buton sizi güvenli bir şekilde İmece Sistem tercihli müşteri sayfasına yönlendirir.
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.primaryAction} 
                onPress={handleOpenImeceLink}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#10B981', '#14B8A6']}
                  style={styles.actionGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Ionicons name="heart" size={16} color="#FFF" style={{ marginRight: 6 }} />
                  <Text style={styles.primaryActionText}>Tercihli Müşteri Ol & Alışverişe Başla</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.secondaryAction} 
                onPress={navigateToImeceHealth}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryActionText}>Sağlık Teknolojisini & Ürünleri İncele</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.cancelAction} 
                onPress={() => setIsImeceModalOpen(false)}
              >
                <Text style={styles.cancelActionText}>Daha Sonra</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    padding: 20,
    paddingTop: 30,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 6,
  },
  bannerContainer: {
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    marginBottom: 30,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
  },
  bannerHeader: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  heartIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  bannerDesc: {
    fontSize: 13,
    color: '#A0A0B0',
    lineHeight: 18,
  },
  bannerButton: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  bannerButtonGradient: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },
  gridCard: {
    width: '48%',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  cardGradient: {
    padding: 16,
    alignItems: 'center',
    minHeight: 140,
    justifyContent: 'center',
  },
  cardIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 11,
    color: '#8E8E93',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#000000',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    padding: 24,
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 4,
  },
  modalIconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#A0A0B0',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  bulletList: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 16,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  bulletEmoji: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  bulletTextContainer: {
    flex: 1,
  },
  bulletTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  bulletDesc: {
    fontSize: 11,
    color: '#8E8E93',
    lineHeight: 15,
  },
  modalLinkNotice: {
    fontSize: 11,
    color: 'rgba(160, 160, 176, 0.6)',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  modalActions: {
    width: '100%',
    gap: 10,
  },
  primaryAction: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionGradient: {
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  secondaryAction: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryActionText: {
    color: '#34D399',
    fontWeight: 'bold',
    fontSize: 14,
  },
  cancelAction: {
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelActionText: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '600',
  },
});
