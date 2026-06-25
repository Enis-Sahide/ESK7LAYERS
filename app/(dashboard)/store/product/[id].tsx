import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMarketplace } from '@/src/core/content/useContent';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);

  const { vendors: VENDORS, products: PRODUCTS, loading } = useMarketplace();
  const product = PRODUCTS.find(p => p.id === id);
  const vendor = product ? VENDORS.find(v => v.id === product.vendorId) : null;

  if (loading) return <View style={styles.container}><Text style={styles.errorText}>Yükleniyor...</Text></View>;
  if (!product) return <View style={styles.container}><Text style={styles.errorText}>Ürün bulunamadı</Text></View>;

  const handleAddToCart = () => {
    Alert.alert(
      "Sepete Eklendi 🛍️",
      `${product.name} (x${quantity}) başarıyla sepetinize eklendi!`,
      [{ text: "Tamam" }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Fixed Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons color="#FFF" size={24} name="arrow-back" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ürün Detayı</Text>
        <TouchableOpacity style={styles.cartIconBtn}>
          <Ionicons color="#FFF" size={24} name="bag" />
          <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>0</Text></View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} bounces={false}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.productImage} />
        </View>

        <View style={styles.detailsContainer}>
          {/* Vendor Tag */}
          {vendor && (
            <TouchableOpacity 
              style={styles.vendorTag}
              onPress={() => router.push(`/store/vendor/${vendor.id}`)}
            >
              <Image source={{ uri: vendor.avatar }} style={styles.vendorAvatar} />
              <Text style={styles.vendorName}>{vendor.name}</Text>
            </TouchableOpacity>
          )}

          {/* Title & Price */}
          <Text style={styles.productTitle}>{product.name}</Text>
          <Text style={styles.productPrice}>{product.price} ₺</Text>

          {/* Trust Badges */}
          <View style={styles.badgesRow}>
            <View style={styles.badge}>
              <Ionicons name="shield-checkmark" size={16} color="#34C759" />
              <Text style={styles.badgeText}>Güvenli Ödeme</Text>
            </View>
            <View style={styles.badge}>
              <Ionicons name="car" size={16} color="#32ADE6" />
              <Text style={styles.badgeText}>Hızlı Kargo</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ürün Açıklaması</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          {/* Additional Info */}
          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={20} color="#D4AF37" />
            <Text style={styles.infoText}>
              Bu ürün %100 orijinaldir ve sipariş sonrası özenle paketlenip tarafınıza kargolanacaktır.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.quantitySelector}>
          <TouchableOpacity 
            style={styles.qtyBtn} 
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Text style={styles.qtyBtnText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.qtyText}>{quantity}</Text>
          <TouchableOpacity 
            style={styles.qtyBtn} 
            onPress={() => setQuantity(Math.min(product.stock, quantity + 1))}
          >
            <Text style={styles.qtyBtnText}>+</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.addToCartMainBtn} onPress={handleAddToCart}>
          <Text style={styles.addToCartText}>Sepete Ekle</Text>
          <Text style={styles.totalPriceText}>{(product.price * quantity).toFixed(2)} ₺</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000000' },
  container: { flex: 1, backgroundColor: '#000000' },
  errorText: { color: '#FFF', textAlign: 'center', marginTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#1C1C1E' },
  backBtn: { padding: 5 },
  headerTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  cartIconBtn: { position: 'relative', padding: 5 },
  cartBadge: { position: 'absolute', top: 0, right: 0, backgroundColor: '#FF3B30', width: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  cartBadgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  imageContainer: { width: '100%', height: width, backgroundColor: '#1C1C1E' },
  productImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  detailsContainer: { padding: 20 },
  vendorTag: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', backgroundColor: '#1C1C1E', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginBottom: 15, borderWidth: 1, borderColor: '#333' },
  vendorAvatar: { width: 20, height: 20, borderRadius: 10, marginRight: 8 },
  vendorName: { color: '#8E8E93', fontSize: 13, fontWeight: 'bold' },
  productTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFF', marginBottom: 10 },
  productPrice: { fontSize: 28, fontWeight: 'bold', color: '#D4AF37', marginBottom: 20 },
  badgesRow: { flexDirection: 'row', gap: 15, marginBottom: 30, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#1C1C1E' },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  badgeText: { color: '#8E8E93', fontSize: 13 },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF', marginBottom: 10 },
  description: { color: '#8E8E93', fontSize: 15, lineHeight: 24 },
  infoBox: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#D4AF3715', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#D4AF3730' },
  infoText: { color: '#D4AF37', fontSize: 13, marginLeft: 10, flex: 1, lineHeight: 20 },
  bottomBar: { flexDirection: 'row', padding: 15, paddingBottom: 25, backgroundColor: '#1C1C1E', borderTopWidth: 1, borderTopColor: '#333', alignItems: 'center', justifyContent: 'space-between' },
  quantitySelector: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#000000', borderRadius: 12, borderWidth: 1, borderColor: '#333' },
  qtyBtn: { width: 40, height: 44, alignItems: 'center', justifyContent: 'center' },
  qtyBtnText: { color: '#D4AF37', fontSize: 20, fontWeight: 'bold' },
  qtyText: { color: '#FFF', fontSize: 16, fontWeight: 'bold', width: 30, textAlign: 'center' },
  addToCartMainBtn: { flex: 1, marginLeft: 15, backgroundColor: '#D4AF37', height: 48, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 15 },
  addToCartText: { color: '#000', fontWeight: 'bold', fontSize: 16, marginRight: 10 },
  totalPriceText: { color: '#000', fontWeight: '900', fontSize: 16 }
});
