import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import SacredBackground from '@/components/SacredBackground';
import { COLORS, SIZES } from '@/src/theme';
import { useContent } from '@/src/core/content/useContent';

const { width } = Dimensions.get('window');
const CATEGORIES = ['Tümü', 'Astroloji', 'Nefes', 'Ritüeller', 'Kişisel Gelişim', 'Çakra Dengeleme'];

export default function BlogListScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('Tümü');

  // Fetch published blog posts from API
  const { data: blogData, loading } = useContent<any[]>('/api/content/blog');
  const posts = blogData ?? [];

  // Filter posts
  const filteredPosts = posts.filter(post => {
    return selectedCategory === 'Tümü' || post.category === selectedCategory;
  });

  const renderPostCard = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => router.push({
        pathname: '/(dashboard)/blog/[slug]',
        params: { slug: item.slug }
      })}
    >
      {/* Cover Image */}
      <View style={styles.cardImageContainer}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons name="book-outline" size={32} color="rgba(255, 149, 0, 0.3)" />
            <Text style={styles.placeholderImageText}>7Layers Kütüphanesi</Text>
          </View>
        )}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>{item.category}</Text>
        </View>
      </View>

      {/* Info */}
      <View style={styles.cardBody}>
        <View style={styles.dateContainer}>
          <Ionicons name="calendar-outline" size={12} color={COLORS.textMuted} style={{ marginRight: 4 }} />
          <Text style={styles.cardDate}>
            {new Date(item.createdAt).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </Text>
        </View>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.cardExcerpt} numberOfLines={2}>{item.content}</Text>
        
        <View style={styles.cardFooter}>
          <Text style={styles.readMoreText}>Yazıyı Oku</Text>
          <Ionicons name="arrow-forward" size={14} color="#FF9500" />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SacredBackground>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Bilgi Kütüphanesi</Text>
      </View>

      <View style={styles.container}>
        {/* Categories Bar */}
        <View style={styles.categoriesContainer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={CATEGORIES}
            keyExtractor={item => item}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.categoryPill,
                  selectedCategory === item && styles.categoryPillActive
                ]}
                onPress={() => setSelectedCategory(item)}
              >
                <Text 
                  style={[
                    styles.categoryText,
                    selectedCategory === item && styles.categoryTextActive
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Content Listing */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <Ionicons name="sync" size={32} color="#FF9500" className="animate-spin" />
            <Text style={styles.loadingText}>Kütüphane yükleniyor...</Text>
          </View>
        ) : filteredPosts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="alert-circle-outline" size={48} color={COLORS.textMuted} style={{ marginBottom: 12 }} />
            <Text style={styles.emptyTitle}>Yazı Bulunmamaktadır</Text>
            <Text style={styles.emptySubtitle}>Seçilen kategoride henüz yayınlanmış yazı bulunmuyor.</Text>
          </View>
        ) : (
          <FlatList
            data={filteredPosts}
            keyExtractor={item => item.id}
            renderItem={renderPostCard}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF9500',
  },
  container: {
    flex: 1,
  },
  categoriesContainer: {
    height: 60,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  categoryPill: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryPillActive: {
    backgroundColor: 'rgba(255, 149, 0, 0.15)',
    borderColor: '#FF9500',
  },
  categoryText: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#FF9500',
    fontWeight: 'bold',
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
    gap: 20,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: SIZES.radius * 1.5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
  },
  cardImageContainer: {
    height: 160,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    position: 'relative',
  },
  cardImage: {
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
    fontSize: 10,
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  categoryBadgeText: {
    color: '#FF9500',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  cardBody: {
    padding: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardDate: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  cardTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 22,
  },
  cardExcerpt: {
    color: COLORS.textMuted,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  readMoreText: {
    color: '#FF9500',
    fontSize: 12,
    fontWeight: 'bold',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    textAlign: 'center',
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  emptySubtitle: {
    color: COLORS.textMuted,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  }
});
