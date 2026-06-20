import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, TextInput, SafeAreaView, ImageBackground, Modal, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { CATEGORIES, VENDORS, PRODUCTS } from '@/src/data/marketplaceData';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const UNDER_MAINTENANCE = true;
import SacredBackground from '@/components/SacredBackground';
import { useProgress } from '@/src/context/ProgressContext';

export default function StoreScreen() {
  const router = useRouter();
  const { isAdmin } = useProgress();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isImeceModalOpen, setIsImeceModalOpen] = useState(false);

  const handleOpenImeceLink = () => {
    Linking.openURL('https://imecesistem.com.tr/davet/TM/BT90000000114');
    setIsImeceModalOpen(false);
  };

  const navigateToImeceHealth = () => {
    setIsImeceModalOpen(false);
    router.push('/(dashboard)/imece-health');
  };

  if (UNDER_MAINTENANCE && !isAdmin) {
    return (
      <SacredBackground>
        
        <BlurView intensity={30} tint="dark" style={styles.maintenanceCard}>
          <View style={styles.iconWrapper}>
            <Ionicons name="lock-closed-outline" size={64} color="#D4AF37" />
          </View>
          
          <Text style={styles.maintenanceTitle}>Mağazamız Tadilatta</Text>
          
          <Text style={styles.maintenanceSubtitle}>
            Sizlere daha mistik ve benzersiz bir alışveriş deneyimi sunabilmek için kapılarımızı kısa bir süreliğine bakıma aldık.
          </Text>
          
          <Text style={styles.maintenanceDesc}>
            Çok yakında yepyeni mistik ürünler ve şifa araçlarıyla buradayız. Anlayışınız için teşekkür ederiz.
          </Text>

          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.replace('/(dashboard)')}
            activeOpacity={0.8}
          >
            <Ionicons name="home-outline" size={20} color="#0F172A" style={{ marginRight: 8 }} />
            <Text style={styles.backButtonText}>Ana Sayfaya Dön</Text>
          </TouchableOpacity>
        </BlurView>
      </SacredBackground>
    );
  }

  const featuredVendors = VENDORS.filter(v => v.isFeatured);
  const filteredProducts = PRODUCTS.filter(p => {
    const matchesCategory = activeCategory ? p.categoryId === activeCategory : true;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.replace('/(dashboard)')} 
            style={styles.headerBackButton}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={28} color="#D4AF37" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Keşfet</Text>
            <Text style={styles.headerSubtitle}>Bütünsel şifa, sağlık ve mistik ürünler...</Text>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Ürün veya mağaza ara..."
            placeholderTextColor="#8E8E93"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Categories */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer} contentContainerStyle={styles.categoriesContent}>
            <TouchableOpacity 
              style={[styles.categoryBtn, activeCategory === null && styles.categoryBtnActive]}
              onPress={() => setActiveCategory(null)}
            >
              <Text style={[styles.categoryText, activeCategory === null && styles.categoryTextActive]}>Tümü</Text>
            </TouchableOpacity>
            {CATEGORIES.map(cat => (
              <TouchableOpacity 
                key={cat.id}
                style={[styles.categoryBtn, activeCategory === cat.id && styles.categoryBtnActive]}
                onPress={() => setActiveCategory(cat.id)}
              >
                <Text style={[styles.categoryText, activeCategory === cat.id && styles.categoryTextActive]}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* İmece Banner */}
          {!activeCategory && !searchQuery && (
            <LinearGradient
              colors={['rgba(16, 185, 129, 0.25)', 'rgba(20, 184, 166, 0.15)', 'rgba(0, 0, 0, 0.6)']}
              style={styles.imeceBannerContainer}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.imeceBannerHeader}>
                <View style={styles.imeceHeartIconWrapper}>
                  <Ionicons name="heart-half-outline" size={32} color="#10B981" />
                </View>
                <View style={styles.imeceBannerTextContainer}>
                  <Text style={styles.imeceBannerTitle}>İmece ile Sağlığı Destekle</Text>
                  <Text style={styles.imeceBannerDesc}>
                    Beden ve zihin dengenizi doğal, temiz ve güvenilir ürünlerle desteklemeye hazır mısınız? İmece sisteminin özel seçkisini inceleyin.
                  </Text>
                </View>
              </View>

              <TouchableOpacity 
                style={styles.imeceBannerButton} 
                onPress={() => setIsImeceModalOpen(true)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#10B981', '#14B8A6']}
                  style={styles.imeceBannerButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.imeceBannerButtonText}>Tercihli Müşteri Ol & Alışverişe Başla</Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          )}

          {/* Featured Stores */}
          {!activeCategory && !searchQuery && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="trending-up" size={20} color="#FFD700" />
                <Text style={styles.sectionTitle}>Öne Çıkan Mağazalar</Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.vendorsScroll}>
                {featuredVendors.map(vendor => (
                  <TouchableOpacity 
                    key={vendor.id} 
                    style={styles.vendorCard}
                    onPress={() => router.push(`/store/vendor/${vendor.id}`)}
                  >
                    <Image source={{ uri: vendor.avatar }} style={styles.vendorImage} />
                    <View style={styles.vendorOverlay}>
                      <Text style={styles.vendorName}>{vendor.name}</Text>
                      <View style={styles.ratingBadge}>
                        <Ionicons name="star" size={12} color="#FFD700" />
                        <Text style={styles.ratingText}>{vendor.rating}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Products */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="bag" size={20} color="#D4AF37" />
              <Text style={styles.sectionTitle}>Tüm Ürünler</Text>
            </View>
            
            <View style={styles.productsGrid}>
              {filteredProducts.map(product => {
                const vendor = VENDORS.find(v => v.id === product.vendorId);
                return (
                  <TouchableOpacity 
                    key={product.id} 
                    style={styles.productCard}
                    onPress={() => router.push(`/store/product/${product.id}`)}
                  >
                    <View style={styles.productImageContainer}>
                      <Image source={{ uri: product.image }} style={styles.productImage} />
                      <View style={styles.productVendorBadge}>
                        <Image source={{ uri: vendor?.avatar }} style={styles.productVendorAvatar} />
                        <Text style={styles.productVendorName} numberOfLines={1}>{vendor?.name}</Text>
                      </View>
                    </View>
                    <View style={styles.productInfo}>
                      <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
                      <View style={styles.productFooter}>
                        <Text style={styles.productPrice}>{product.price} ₺</Text>
                        <View style={styles.addToCartBtn}>
                          <Ionicons name="bag" size={16} color="#000" />
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </View>

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
  safeArea: { flex: 1, backgroundColor: '#0B0C10' },
  container: { flex: 1, backgroundColor: '#0B0C10' },
  header: { padding: 20, paddingTop: 10, flexDirection: 'row', alignItems: 'center' },
  headerBackButton: {
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#D4AF37' },
  headerSubtitle: { fontSize: 14, color: '#8E8E93', marginTop: 4 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1C1C1E', marginHorizontal: 20, borderRadius: 12, paddingHorizontal: 12, marginBottom: 15, borderWidth: 1, borderColor: '#333' },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, height: 44, color: '#FFF' },
  scrollContent: { paddingBottom: 40 },
  categoriesContainer: { marginBottom: 20 },
  categoriesContent: { paddingHorizontal: 20, gap: 10 },
  categoryBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#1C1C1E', borderWidth: 1, borderColor: '#333' },
  categoryBtnActive: { backgroundColor: '#D4AF37', borderColor: '#D4AF37' },
  categoryText: { color: '#FFF', fontSize: 14 },
  categoryTextActive: { color: '#000', fontWeight: 'bold' },
  section: { marginBottom: 30 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15, gap: 8 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
  vendorsScroll: { paddingHorizontal: 20, gap: 15 },
  vendorCard: { width: 200, height: 120, borderRadius: 16, overflow: 'hidden' },
  vendorImage: { width: '100%', height: '100%' },
  vendorOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 12, backgroundColor: 'rgba(0,0,0,0.6)', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  vendorName: { color: '#FFF', fontWeight: 'bold', flex: 1, fontSize: 14 },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10, borderWidth: 1, borderColor: '#FFD700' },
  ratingText: { color: '#FFF', fontSize: 10, marginLeft: 4 },
  productsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 15, justifyContent: 'space-between' },
  productCard: { width: '48%', backgroundColor: '#1C1C1E', borderRadius: 16, overflow: 'hidden', marginBottom: 15, borderWidth: 1, borderColor: '#333' },
  productImageContainer: { height: 140, position: 'relative' },
  productImage: { width: '100%', height: '100%' },
  productVendorBadge: { position: 'absolute', top: 8, left: 8, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 12, maxWidth: '80%' },
  productVendorAvatar: { width: 14, height: 14, borderRadius: 7, marginRight: 4 },
  productVendorName: { color: '#FFF', fontSize: 10 },
  productInfo: { padding: 12 },
  productName: { color: '#FFF', fontSize: 14, fontWeight: '600', marginBottom: 10, height: 40 },
  productFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productPrice: { color: '#D4AF37', fontSize: 16, fontWeight: 'bold' },
  addToCartBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#D4AF37', alignItems: 'center', justifyContent: 'center' },
  maintenanceContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  maintenanceCard: {
    padding: 30,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    overflow: 'hidden',
  },
  iconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.4)',
  },
  maintenanceTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#D4AF37',
    textAlign: 'center',
    marginBottom: 12,
  },
  maintenanceSubtitle: {
    fontSize: 14,
    color: '#E0E0E0',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 15,
  },
  maintenanceDesc: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 25,
    fontStyle: 'italic',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D4AF37',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  backButtonText: {
    color: '#0F172A',
    fontWeight: 'bold',
    fontSize: 15,
  },
  imeceBannerContainer: {
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    marginBottom: 20,
  },
  imeceBannerHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  imeceHeartIconWrapper: {
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
  imeceBannerTextContainer: {
    flex: 1,
  },
  imeceBannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  imeceBannerDesc: {
    fontSize: 13,
    color: '#A0A0B0',
    lineHeight: 18,
  },
  imeceBannerButton: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  imeceBannerButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imeceBannerButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
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
    backgroundColor: '#0F172A',
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
