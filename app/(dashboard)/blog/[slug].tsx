import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import SacredBackground from '@/components/SacredBackground';
import { COLORS, SIZES } from '@/src/theme';
import { useContent } from '@/src/core/content/useContent';

const { width } = Dimensions.get('window');

export default function BlogDetailScreen() {
  const router = useRouter();
  const { slug } = useLocalSearchParams();

  // Fetch article details from API
  const { data: post, loading, error } = useContent<any>(slug ? `/api/content/blog/${slug}` : null);

  return (
    <SacredBackground>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>Geri Dön</Text>
      </View>

      <View style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF9500" />
            <Text style={styles.loadingText}>Yazı yükleniyor...</Text>
          </View>
        ) : error || !post ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={48} color="rgba(255, 59, 48, 0.7)" style={{ marginBottom: 12 }} />
            <Text style={styles.errorTitle}>Yazı Bulunamadı</Text>
            <Text style={styles.errorSubtitle}>Ulaşmaya çalıştığınız içerik mevcut değil veya kaldırılmış olabilir.</Text>
            <TouchableOpacity style={styles.errorBtn} onPress={() => router.back()}>
              <Text style={styles.errorBtnText}>Kütüphaneye Dön</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Cover Image banner */}
            <View style={styles.imageWrapper}>
              {post.imageUrl ? (
                <Image source={{ uri: post.imageUrl }} style={styles.coverImage} />
              ) : (
                <View style={styles.placeholderImage}>
                  <Ionicons name="book" size={48} color="rgba(255, 149, 0, 0.2)" />
                  <Text style={styles.placeholderImageText}>7Layers Bilgelik Kütüphanesi</Text>
                </View>
              )}
              <View style={styles.imageOverlay} />
            </View>

            {/* Post Metadata Card */}
            <View style={styles.metaContainer}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{post.category}</Text>
              </View>
              <Text style={styles.postTitle}>{post.title}</Text>
              
              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Ionicons name="calendar-outline" size={14} color="#FF9500" style={{ marginRight: 6 }} />
                  <Text style={styles.metaText}>
                    {new Date(post.createdAt).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="person-outline" size={14} color="#FF9500" style={{ marginRight: 6 }} />
                  <Text style={styles.metaText}>7Layers Rehberi</Text>
                </View>
              </View>
            </View>

            {/* Content text */}
            <View style={styles.bodyContainer}>
              <Text style={styles.bodyText}>{post.content}</Text>
            </View>
          </ScrollView>
        )}
      </View>
    </SacredBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  backBtn: {
    marginRight: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  imageWrapper: {
    height: 220,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  placeholderImageText: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  metaContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 149, 0, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF9500',
    marginBottom: 10,
  },
  categoryBadgeText: {
    color: '#FF9500',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  postTitle: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: 'bold',
    lineHeight: 30,
    marginBottom: 15,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 15,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  bodyContainer: {
    padding: 20,
  },
  bodyText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    lineHeight: 24,
    textAlign: 'justify',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  errorSubtitle: {
    color: COLORS.textMuted,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  errorBtn: {
    backgroundColor: '#FF9500',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  errorBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  }
});
