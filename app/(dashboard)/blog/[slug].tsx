import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions, ActivityIndicator, Share } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import SacredBackground from '@/components/SacredBackground';
import { COLORS, SIZES } from '@/src/theme';
import { useContent } from '@/src/core/content/useContent';
import { API_BASE_URL } from '@/src/core/config';

const { width } = Dimensions.get('window');

const parseMobileInline = (text: string) => {
  if (!text) return null;
  const parts = text.split('**');
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      return (
        <Text key={index} style={{ fontWeight: 'bold', color: '#FFFFFF' }}>
          {part}
        </Text>
      );
    }
    return (
      <Text key={index} style={{ color: 'rgba(255,255,255,0.85)' }}>
        {part}
      </Text>
    );
  });
};

const renderMobileContent = (content: string) => {
  if (!content) return null;
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeLines: string[] = [];
  let codeIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <View key={`code-${codeIndex}`} style={styles.codeBlock}>
            <Text style={styles.codeText}>{codeLines.join('\n')}</Text>
          </View>
        );
        codeLines = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
        codeIndex = i;
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    if (!trimmed) {
      elements.push(<View key={`space-${i}`} style={{ height: 8 }} />);
      continue;
    }

    if (trimmed === '---') {
      elements.push(<View key={`hr-${i}`} style={styles.hr} />);
      continue;
    }

    if (trimmed.startsWith('> ')) {
      elements.push(
        <View key={`quote-${i}`} style={styles.quoteBlock}>
          <Text style={styles.quoteText}>{trimmed.replace(/^>\s*/, '')}</Text>
        </View>
      );
      continue;
    }

    if (trimmed.startsWith('#### ')) {
      elements.push(
        <Text key={`h4-${i}`} style={styles.h4Text}>
          {trimmed.replace('#### ', '')}
        </Text>
      );
      continue;
    }

    if (trimmed.startsWith('### ')) {
      elements.push(
        <Text key={`h3-${i}`} style={styles.h3Text}>
          {trimmed.replace('### ', '')}
        </Text>
      );
      continue;
    }

    if (trimmed.startsWith('## ')) {
      elements.push(
        <Text key={`h2-${i}`} style={styles.h2Text}>
          {trimmed.replace('## ', '')}
        </Text>
      );
      continue;
    }

    if (trimmed.startsWith('# ')) {
      elements.push(
        <Text key={`h1-${i}`} style={styles.h1Text}>
          {trimmed.replace('# ', '')}
        </Text>
      );
      continue;
    }

    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (numMatch) {
      elements.push(
        <View key={`num-${i}`} style={styles.listItem}>
          <View style={styles.numBadge}>
            <Text style={styles.numBadgeText}>{numMatch[1]}</Text>
          </View>
          <Text style={styles.listItemText}>{parseMobileInline(numMatch[2])}</Text>
        </View>
      );
      continue;
    }

    const listMatch = trimmed.match(/^[\*\-]\s+(.*)$/);
    if (listMatch) {
      elements.push(
        <View key={`li-${i}`} style={styles.listItem}>
          <Text style={styles.bulletIcon}>✦</Text>
          <Text style={styles.listItemText}>{parseMobileInline(listMatch[1])}</Text>
        </View>
      );
      continue;
    }

    elements.push(
      <Text key={`p-${i}`} style={styles.bodyText}>
        {parseMobileInline(line)}
      </Text>
    );
  }

  if (inCodeBlock && codeLines.length > 0) {
    elements.push(
      <View key={`code-${codeIndex}`} style={styles.codeBlock}>
        <Text style={styles.codeText}>{codeLines.join('\n')}</Text>
      </View>
    );
  }

  return elements;
};

export default function BlogDetailScreen() {
  const router = useRouter();
  const { slug } = useLocalSearchParams();

  // Fetch article details from API
  const { data: post, loading, error } = useContent<any>(slug ? `/api/content/blog/${slug}` : null);

  const handleShare = async () => {
    if (!post) return;
    try {
      await Share.share({
        message: `${post.title}\n\nhttps://www.7layers.tr/blog/${post.slug}`,
      });
    } catch (e) {
      console.error('Paylaşım hatası:', e);
    }
  };

  return (
    <SacredBackground>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>Geri Dön</Text>

        {post && !loading && (
          <TouchableOpacity onPress={handleShare} style={styles.shareBtn}>
            <Ionicons name="share-social-outline" size={22} color={COLORS.text} />
          </TouchableOpacity>
        )}
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
              <Text style={styles.errorBtnText}>Geri Dön</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Cover Image banner */}
            <View style={styles.imageWrapper}>
              {post.imageUrl ? (
                <Image 
                  source={post.imageUrl.startsWith('/') ? { uri: API_BASE_URL + post.imageUrl } : { uri: post.imageUrl }} 
                  style={styles.coverImage} 
                />
              ) : (
                <View style={styles.placeholderImage}>
                  <Ionicons name="book" size={48} color="rgba(255, 149, 0, 0.2)" />
                  <Text style={styles.placeholderImageText}>7Layers Blog</Text>
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
              {renderMobileContent(post.content)}
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
  shareBtn: {
    marginLeft: 'auto',
    padding: 4,
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
    marginBottom: 12,
  },
  h1Text: {
    color: '#FF9500',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    lineHeight: 28,
  },
  h2Text: {
    color: '#FF9500',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 18,
    marginBottom: 8,
    lineHeight: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    paddingBottom: 4,
  },
  h3Text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 6,
    lineHeight: 22,
    borderLeftWidth: 3,
    borderLeftColor: '#FF9500',
    paddingLeft: 8,
  },
  h4Text: {
    color: '#FFB84D',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 14,
    marginBottom: 4,
    lineHeight: 20,
  },
  quoteBlock: {
    backgroundColor: 'rgba(255, 149, 0, 0.08)',
    borderLeftWidth: 3,
    borderLeftColor: '#FF9500',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    marginVertical: 12,
  },
  quoteText: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 13,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  codeBlock: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 149, 0, 0.25)',
    borderRadius: 12,
    padding: 12,
    marginVertical: 14,
  },
  codeText: {
    fontFamily: 'monospace',
    color: '#FFB84D',
    fontSize: 11,
    lineHeight: 18,
  },
  hr: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginVertical: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingLeft: 4,
  },
  bulletIcon: {
    color: '#FF9500',
    fontSize: 10,
    marginTop: 4,
    marginRight: 8,
  },
  numBadge: {
    backgroundColor: 'rgba(255, 149, 0, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 149, 0, 0.3)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginRight: 8,
    marginTop: 1,
  },
  numBadgeText: {
    color: '#FF9500',
    fontSize: 10,
    fontWeight: 'bold',
  },
  listItemText: {
    flex: 1,
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    lineHeight: 20,
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
