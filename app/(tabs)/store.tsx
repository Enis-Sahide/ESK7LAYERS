import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, TextInput, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { CATEGORIES, VENDORS, PRODUCTS } from '@/src/data/marketplaceData';
import { Ionicons } from '@expo/vector-icons';

export default function StoreScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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
          <View>
            <Text style={styles.headerTitle}>Keşfet & Mağaza</Text>
            <Text style={styles.headerSubtitle}>Mistik yolculuğunuz için ürünler...</Text>
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
              onClick={() => setActiveCategory(null)}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0B0C10' },
  container: { flex: 1, backgroundColor: '#0B0C10' },
  header: { padding: 20, paddingTop: 10 },
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
  addToCartBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#D4AF37', alignItems: 'center', justifyContent: 'center' }
});
