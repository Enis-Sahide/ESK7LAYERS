import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMarketplace } from '@/src/core/content/useContent';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function VendorProfileScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const { vendors: VENDORS, products: PRODUCTS, loading } = useMarketplace();
  const vendor = VENDORS.find(v => v.id === id);
  const vendorProducts = PRODUCTS.filter(p => p.vendorId === id);

  if (loading) return <View style={styles.container}><Text style={styles.errorText}>Yükleniyor...</Text></View>;
  if (!vendor) return <View style={styles.container}><Text style={styles.errorText}>Mağaza bulunamadı</Text></View>;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} bounces={false}>
        {/* Cover & Header */}
        <View style={styles.coverContainer}>
          <Image source={{ uri: vendor.avatar }} style={styles.coverImage} blurRadius={3} />
          <View style={styles.coverOverlay} />
          
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons color="#FFF" size={24} name="arrow-back" />
          </TouchableOpacity>

          <View style={styles.profileHeader}>
            <Image source={{ uri: vendor.avatar }} style={styles.avatar} />
            <Text style={styles.vendorName}>{vendor.name}</Text>
            <View style={styles.statsRow}>
              <View style={styles.statBadge}>
                <Ionicons name="star" size={14} color="#FFD700" />
                <Text style={styles.statText}>{vendor.rating}</Text>
              </View>
              <View style={styles.statBadge}>
                <Ionicons name="bag" size={14} color="#D4AF37" />
                <Text style={styles.statText}>{vendorProducts.length} Ürün</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.aboutSection}>
          <Text style={styles.aboutText}>{vendor.description}</Text>
        </View>

        {/* Products */}
        <View style={styles.productsSection}>
          <Text style={styles.sectionTitle}>Mağazanın Ürünleri</Text>
          
          <View style={styles.productsGrid}>
            {vendorProducts.map(product => (
              <TouchableOpacity 
                key={product.id} 
                style={styles.productCard}
                onPress={() => router.push(`/store/product/${product.id}`)}
              >
                <View style={styles.productImageContainer}>
                  <Image source={{ uri: product.image }} style={styles.productImage} />
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
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000000' },
  container: { flex: 1, backgroundColor: '#000000' },
  errorText: { color: '#FFF', textAlign: 'center', marginTop: 50 },
  coverContainer: { height: 280, position: 'relative', alignItems: 'center' },
  coverImage: { width: '100%', height: '100%', position: 'absolute' },
  coverOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(11, 12, 16, 0.7)' },
  backBtn: { position: 'absolute', top: 20, left: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', zIndex: 10 },
  profileHeader: { position: 'absolute', bottom: -30, alignItems: 'center', width: '100%' },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 4, borderColor: '#000000', marginBottom: 10 },
  vendorName: { fontSize: 24, fontWeight: 'bold', color: '#FFF', marginBottom: 8 },
  statsRow: { flexDirection: 'row', gap: 10 },
  statBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1C1C1E', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: '#333' },
  statText: { color: '#FFF', marginLeft: 6, fontSize: 12, fontWeight: 'bold' },
  aboutSection: { marginTop: 50, paddingHorizontal: 20, marginBottom: 30 },
  aboutText: { color: '#8E8E93', fontSize: 15, lineHeight: 22, textAlign: 'center' },
  productsSection: { paddingHorizontal: 15 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#D4AF37', marginBottom: 15, marginLeft: 5 },
  productsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  productCard: { width: '48%', backgroundColor: '#1C1C1E', borderRadius: 16, overflow: 'hidden', marginBottom: 15, borderWidth: 1, borderColor: '#333' },
  productImageContainer: { height: 140 },
  productImage: { width: '100%', height: '100%' },
  productInfo: { padding: 12 },
  productName: { color: '#FFF', fontSize: 14, fontWeight: '600', marginBottom: 10, height: 40 },
  productFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productPrice: { color: '#D4AF37', fontSize: 16, fontWeight: 'bold' },
  addToCartBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#D4AF37', alignItems: 'center', justifyContent: 'center' }
});
