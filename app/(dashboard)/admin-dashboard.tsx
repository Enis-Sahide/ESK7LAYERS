import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput, 
  ActivityIndicator, 
  Alert, 
  Platform, 
  Modal,
  Switch,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import SacredBackground from '@/components/SacredBackground';
import { COLORS, SIZES } from '@/src/theme';
import { apiFetch } from '@/src/core/api/client';

const ROLE_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  free: { label: 'ÜCRETSİZ ÜYELİK', color: COLORS.textMuted, bg: 'rgba(255, 255, 255, 0.05)' },
  apprentice: { label: 'ÇIRAK (SEVİYE 1)', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' },
  journeyman: { label: 'KALFA (SEVİYE 2)', color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.1)' },
  master: { label: 'USTA (SEVİYE 3)', color: COLORS.primary, bg: 'rgba(212, 175, 55, 0.1)' },
  admin: { label: 'YÖNETİCİ', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)' }
};

const formatDateSafe = (rawDate: any): { dateStr: string; timeStr: string } => {
  if (!rawDate) return { dateStr: '-', timeStr: '-' };
  try {
    const isoStr = typeof rawDate === 'string' ? rawDate.replace(' ', 'T') : rawDate;
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) {
      const s = String(rawDate);
      return { dateStr: s.slice(0, 10), timeStr: s.slice(11, 16) };
    }
    return {
      dateStr: d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
      timeStr: d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    };
  } catch {
    return { dateStr: String(rawDate).slice(0, 10), timeStr: '' };
  }
};

export default function AdminDashboardScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'members' | 'blog' | 'analytics'>('members');

  // Profiles (members)
  const [profiles, setProfiles] = useState<any[]>([]);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(true);
  const [profilesError, setProfilesError] = useState<string | null>(null);

  // Blog states
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isLoadingBlogs, setIsLoadingBlogs] = useState(false);
  const [blogError, setBlogError] = useState<string | null>(null);

  // Analytics states
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);

  const [showBlogModal, setShowBlogModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any>(null);
  const [blogForm, setBlogForm] = useState({
    title: '',
    slug: '',
    content: '',
    category: 'Astroloji',
    imageUrl: '',
    published: true
  });
  const [isSavingBlog, setIsSavingBlog] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Updating, deleting and modal states
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [selectingUser, setSelectingUser] = useState<{ id: string; name: string; currentRole: string } | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);

  const fetchProfiles = async () => {
    setIsLoadingProfiles(true);
    setProfilesError(null);
    try {
      const data = await apiFetch<any[]>('/api/admin/profiles');
      setProfiles(data || []);
    } catch (err: any) {
      console.error("Profiles fetch error:", err);
      setProfilesError(err.message || 'Üyeler yüklenirken hata oluştu.');
    } finally {
      setIsLoadingProfiles(false);
    }
  };

  const fetchBlogs = async () => {
    setIsLoadingBlogs(true);
    setBlogError(null);
    try {
      const data = await apiFetch<any[]>('/api/admin/blog');
      setBlogs(data || []);
    } catch (err: any) {
      console.error("Blogs fetch error:", err);
      setBlogError(err.message || 'Yazılar yüklenirken hata oluştu.');
    } finally {
      setIsLoadingBlogs(false);
    }
  };

  const [excludeAdmin, setExcludeAdmin] = useState(true);
  const [visitLimit, setVisitLimit] = useState(50);

  const fetchAnalytics = async (exclude = excludeAdmin, limit = visitLimit) => {
    setIsLoadingAnalytics(true);
    setAnalyticsError(null);
    try {
      const data = await apiFetch<any>(`/api/admin/analytics?excludeAdmin=${exclude}&limit=${limit}`);
      setAnalytics(data);
    } catch (err: any) {
      console.error("Analytics fetch error:", err);
      setAnalyticsError(err.message || 'Analiz verileri yüklenirken hata oluştu.');
    } finally {
      setIsLoadingAnalytics(false);
    }
  };

  const handleToggleExcludeAdmin = (val: boolean) => {
    setExcludeAdmin(val);
    fetchAnalytics(val, visitLimit);
  };

  const handleChangeLimit = (newLimit: number) => {
    setVisitLimit(newLimit);
    fetchAnalytics(excludeAdmin, newLimit);
  };

  const handleRefresh = () => {
    fetchProfiles();
    fetchBlogs();
    fetchAnalytics(excludeAdmin, visitLimit);
  };

  useEffect(() => {
    fetchProfiles();
    fetchBlogs();
    fetchAnalytics();
  }, []);

  useEffect(() => {
    if (activeTab === 'blog') {
      fetchBlogs();
    } else if (activeTab === 'analytics') {
      fetchAnalytics();
    }
  }, [activeTab]);

  const handleOpenCreateBlog = () => {
    setEditingBlog(null);
    setBlogForm({
      title: '',
      slug: '',
      content: '',
      category: 'Astroloji',
      imageUrl: '',
      published: true
    });
    setShowBlogModal(true);
  };

  const handleOpenEditBlog = (blog: any) => {
    setEditingBlog(blog);
    setBlogForm({
      title: blog.title || '',
      slug: blog.slug || '',
      content: blog.content || '',
      category: blog.category || 'Astroloji',
      imageUrl: blog.imageUrl || '',
      published: blog.published !== undefined ? blog.published : true
    });
    setShowBlogModal(true);
  };

  const handleSaveBlog = async () => {
    if (!blogForm.title || !blogForm.slug || !blogForm.content || !blogForm.category) {
      if (Platform.OS === 'web') window.alert('Lütfen tüm zorunlu alanları doldurun.');
      else Alert.alert('Hata', 'Lütfen tüm zorunlu alanları doldurun.');
      return;
    }
    setIsSavingBlog(true);
    try {
      if (editingBlog) {
        // Update
        const updated = await apiFetch<any>(`/api/admin/blog/${editingBlog.id}`, {
          method: 'PUT',
          body: JSON.stringify(blogForm)
        });
        setBlogs(prev => prev.map(b => b.id === editingBlog.id ? updated : b));
      } else {
        // Create
        const created = await apiFetch<any>('/api/admin/blog', {
          method: 'POST',
          body: JSON.stringify(blogForm)
        });
        setBlogs(prev => [created, ...prev]);
      }
      setShowBlogModal(false);
    } catch (err: any) {
      if (Platform.OS === 'web') window.alert("Hata: " + err.message);
      else Alert.alert("Hata", err.message);
    } finally {
      setIsSavingBlog(false);
    }
  };

  const handleDeleteBlog = async (id: string, title: string) => {
    const executeDelete = async () => {
      try {
        await apiFetch(`/api/admin/blog/${id}`, {
          method: 'DELETE'
        });
        setBlogs(prev => prev.filter(b => b.id !== id));
      } catch (err: any) {
        if (Platform.OS === 'web') window.alert("Hata: " + err.message);
        else Alert.alert("Hata", err.message);
      }
    };

    const confirmMessage = `"${title}" isimli blog yazısını silmek istediğinize emin misiniz?`;
    if (Platform.OS === 'web') {
      const ok = window.confirm(confirmMessage);
      if (ok) executeDelete();
    } else {
      Alert.alert(
        "Yazıyı Sil",
        confirmMessage,
        [
          { text: 'İptal', style: 'cancel' },
          { text: 'Sil', style: 'destructive', onPress: executeDelete }
        ]
      );
    }
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    const executeDelete = async () => {
      setDeletingUserId(userId);
      try {
        await apiFetch(`/api/admin/profiles/${userId}`, {
          method: 'DELETE'
        });
        setProfiles(prev => prev.filter(p => p.id !== userId));
      } catch (err: any) {
        if (Platform.OS === 'web') window.alert("Hata: " + err.message);
        else Alert.alert("Hata", err.message);
      } finally {
        setDeletingUserId(null);
      }
    };

    const confirmMessage = `"${userName}" isimli kullanıcıyı ve tüm platform verilerini kalıcı olarak silmek istediğinize emin misiniz?`;
    if (Platform.OS === 'web') {
      const ok = window.confirm(confirmMessage);
      if (ok) executeDelete();
    } else {
      Alert.alert(
        "Üyeyi Sil",
        confirmMessage,
        [
          { text: 'İptal', style: 'cancel' },
          { text: 'Sil', style: 'destructive', onPress: executeDelete }
        ]
      );
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    const profile = profiles.find(p => p.id === userId);
    const userName = profile?.full_name || 'İsimsiz Üye';
    
    const roleLabels: Record<string, string> = {
      free: 'Ücretsiz Üye',
      apprentice: 'Çırak (Seviye 1)',
      journeyman: 'Kalfa (Seviye 2)',
      master: 'Usta (Seviye 3)',
      admin: 'Yönetici (Admin)'
    };
    const targetRoleLabel = roleLabels[newRole] || newRole;

    const executeUpdate = async () => {
      setUpdatingUserId(userId);
      setShowRoleModal(false);
      setSelectingUser(null);
      try {
        await apiFetch(`/api/admin/profiles/${userId}`, {
          method: 'PATCH',
          body: JSON.stringify({ role: newRole }),
        });
        
        // Update local profiles list state
        setProfiles(prev => prev.map(p => {
          if (p.id === userId) {
            return { ...p, role: newRole };
          }
          return p;
        }));
      } catch (err: any) {
        if (Platform.OS === 'web') {
          window.alert("Rol güncellenirken bir hata oluştu: " + err.message);
        } else {
          Alert.alert("Hata", "Rol güncellenirken bir hata oluştu: " + err.message);
        }
      } finally {
        setUpdatingUserId(null);
      }
    };

    const confirmMessage = `"${userName}" isimli üyenin yetki seviyesini "${targetRoleLabel}" olarak değiştirmek istediğinize emin misiniz?\n\nNot: Bu işlem, üyenin bu seviye için vermesi gereken tüm sınavları otomatik olarak "geçti" olarak işaretleyecektir.`;

    if (Platform.OS === 'web') {
      const ok = window.confirm(confirmMessage);
      if (ok) executeUpdate();
    } else {
      Alert.alert(
        "Seviye Güncelleme",
        confirmMessage,
        [
          { text: 'İptal', style: 'cancel' },
          { text: 'Evet, Değiştir', onPress: executeUpdate }
        ]
      );
    }
  };

  const filteredProfiles = profiles.filter(p => {
    const matchesSearch = 
      (p.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (p.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'all' || p.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <SacredBackground>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(dashboard)')} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Sistem Yöneticisi</Text>
          <Text style={styles.headerSub}>Genel Yönetim ve Yetkilendirme</Text>
        </View>
        <TouchableOpacity onPress={handleRefresh} style={styles.refreshBtn}>
          <Ionicons name="refresh" size={20} color={COLORS.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'members' && styles.tabActive]}
          onPress={() => setActiveTab('members')}
        >
          <Ionicons name="people-outline" size={16} color={activeTab === 'members' ? COLORS.primary : COLORS.textMuted} />
          <Text style={[styles.tabText, activeTab === 'members' && styles.tabTextActive]}>
            Üye {!isLoadingProfiles && `(${profiles.length})`}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'blog' && styles.tabActive]}
          onPress={() => setActiveTab('blog')}
        >
          <Ionicons name="book-outline" size={16} color={activeTab === 'blog' ? COLORS.primary : COLORS.textMuted} />
          <Text style={[styles.tabText, activeTab === 'blog' && styles.tabTextActive]}>
            Blog {!isLoadingBlogs && `(${blogs.length})`}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'analytics' && styles.tabActive]}
          onPress={() => setActiveTab('analytics')}
        >
          <Ionicons name="stats-chart-outline" size={16} color={activeTab === 'analytics' ? COLORS.primary : COLORS.textMuted} />
          <Text style={[styles.tabText, activeTab === 'analytics' && styles.tabTextActive]}>
            Analitik
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Statistics Widgets (2x2 Grid) */}
        <View style={styles.statsGridContainer}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                <Text style={styles.statTitle}>Toplam Üye</Text>
                <Ionicons name="people-outline" size={16} color="#A855F7" />
              </View>
              <Text style={styles.statValue}>
                {isLoadingProfiles ? '...' : profiles.length}
              </Text>
              <Text style={styles.statSub}>Platforma kayıtlı ruhlar</Text>
            </View>

            <View style={[styles.statCard, { borderColor: 'rgba(249, 115, 22, 0.3)', backgroundColor: 'rgba(249, 115, 22, 0.06)' }]}>
              <View style={styles.statHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <View style={styles.liveDot} />
                  <Text style={[styles.statTitle, { color: '#FB923C' }]}>Şu An Aktif</Text>
                </View>
                <Ionicons name="pulse-outline" size={16} color="#FB923C" />
              </View>
              <Text style={[styles.statValue, { color: '#FB923C' }]}>
                {isLoadingAnalytics ? '...' : (analytics?.activeUsers ?? 0)}
              </Text>
              <Text style={styles.statSub}>Son 5 dakikadaki tekil</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={[styles.statCard, { borderColor: 'rgba(16, 185, 129, 0.3)', backgroundColor: 'rgba(16, 185, 129, 0.05)' }]}>
              <View style={styles.statHeader}>
                <Text style={[styles.statTitle, { color: '#34D399' }]}>Bugün Tekil</Text>
                <Ionicons name="eye-outline" size={16} color="#34D399" />
              </View>
              <Text style={[styles.statValue, { color: '#34D399' }]}>
                {isLoadingAnalytics ? '...' : (analytics?.today?.visitors ?? 0)}
              </Text>
              <Text style={styles.statSub}>Bugünkü tekil ziyaret</Text>
            </View>

            <View style={[styles.statCard, { borderColor: 'rgba(212, 175, 55, 0.3)', backgroundColor: 'rgba(212, 175, 55, 0.05)' }]}>
              <View style={styles.statHeader}>
                <Text style={[styles.statTitle, { color: COLORS.primary }]}>Blog Kütüphanesi</Text>
                <Ionicons name="book-outline" size={16} color={COLORS.primary} />
              </View>
              <Text style={styles.statValue}>
                {isLoadingBlogs ? '...' : blogs.length}
              </Text>
              <Text style={styles.statSub}>Rehber ve makaleler</Text>
            </View>
          </View>
        </View>

        {/* Tab Content 2: Members */}
        {activeTab === 'members' && (
          <View style={styles.contentSection}>
            
            {/* Filters bar */}
            <View style={styles.filterBar}>
              <View style={styles.searchInputContainer}>
                <Ionicons name="search" size={16} color={COLORS.textMuted} style={styles.searchIcon} />
                <TextInput 
                  style={styles.searchInput}
                  placeholder="İsim, email veya ID ile ara..."
                  placeholderTextColor={COLORS.textMuted}
                  value={searchTerm}
                  onChangeText={setSearchTerm}
                />
              </View>

              <View style={styles.selectorsRow}>
                <View style={styles.selectWrapper}>
                  <Text style={styles.selectLabel}>Seviye Filtresi</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                    {['all', 'free', 'apprentice', 'journeyman', 'master', 'admin'].map((roleKey) => {
                      const isActive = roleFilter === roleKey;
                      const labels: Record<string, string> = {
                        all: 'Tümü',
                        free: 'Ücretsiz',
                        apprentice: 'Çırak',
                        journeyman: 'Kalfa',
                        master: 'Usta',
                        admin: 'Yönetici'
                      };
                      return (
                        <TouchableOpacity 
                          key={roleKey}
                          style={[styles.filterChip, isActive && styles.filterChipActive]}
                          onPress={() => setRoleFilter(roleKey)}
                        >
                          <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>{labels[roleKey]}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              </View>
            </View>

            {isLoadingProfiles ? (
              <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 30 }} />
            ) : profilesError ? (
              <Text style={styles.errorText}>{profilesError}</Text>
            ) : filteredProfiles.length === 0 ? (
              <Text style={styles.emptyText}>Kriterlere uygun üye bulunamadı.</Text>
            ) : (
              filteredProfiles.map(p => {
                const userRole = p.role || 'free';
                const roleMeta = ROLE_LABELS[userRole] || ROLE_LABELS.free;

                return (
                  <BlurView intensity={20} tint="dark" key={p.id} style={styles.memberCard}>
                    <View style={styles.memberHeader}>
                      <View style={styles.avatarInitials}>
                        <Text style={styles.avatarInitialsText}>
                          {p.full_name ? p.full_name.slice(0, 2).toUpperCase() : 'ÜY'}
                        </Text>
                      </View>
                      <View style={styles.memberInfo}>
                        <Text style={styles.memberName}>{p.full_name || 'İsimsiz Üye'}</Text>
                        <Text style={styles.memberEmail}>{p.email}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                          <Text style={styles.memberId}>ID: {p.id.slice(0, 8)}...</Text>
                          {p.email_verified ? (
                            <View style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16, 185, 129, 0.3)', borderWidth: 1, paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4 }}>
                              <Text style={{ color: '#10B981', fontSize: 9, fontWeight: 'bold' }}>✓ Onaylı</Text>
                            </View>
                          ) : (
                            <View style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', borderColor: 'rgba(245, 158, 11, 0.3)', borderWidth: 1, paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4 }}>
                              <Text style={{ color: '#F59E0B', fontSize: 9, fontWeight: 'bold' }}>⏳ Onay Bekliyor</Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.memberMetaRow}>
                      <View style={styles.metaCol}>
                        <Text style={styles.metaLabel}>Kayıt Tarihi</Text>
                        <Text style={styles.metaValue}>
                          {p.created_at ? new Date(p.created_at).toLocaleDateString('tr-TR', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }) : 'Bilinmiyor'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.memberActionsRow}>
                      <View style={[styles.roleBadgeContainer, { backgroundColor: roleMeta.bg }]}>
                        <Text style={[styles.roleBadgeText, { color: roleMeta.color }]}>{roleMeta.label}</Text>
                      </View>

                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <TouchableOpacity 
                          style={styles.changeRoleBtn}
                          disabled={updatingUserId === p.id || deletingUserId === p.id}
                          onPress={() => {
                            setSelectingUser({ id: p.id, name: p.full_name || 'İsimsiz Üye', currentRole: userRole });
                            setShowRoleModal(true);
                          }}
                        >
                          {updatingUserId === p.id ? (
                            <ActivityIndicator size="small" color={COLORS.primary} />
                          ) : (
                            <>
                              <Text style={styles.changeRoleBtnText}>Seviye Değiştir</Text>
                              <Ionicons name="chevron-down" size={14} color={COLORS.primary} style={{ marginLeft: 4 }} />
                            </>
                          )}
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={{
                            padding: 7,
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            borderWidth: 1,
                            borderColor: 'rgba(239, 68, 68, 0.3)',
                            borderRadius: 10,
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}
                          disabled={deletingUserId === p.id}
                          onPress={() => handleDeleteUser(p.id, p.full_name || p.email)}
                        >
                          {deletingUserId === p.id ? (
                            <ActivityIndicator size="small" color="#EF4444" />
                          ) : (
                            <Ionicons name="trash-outline" size={16} color="#EF4444" />
                          )}
                        </TouchableOpacity>
                      </View>
                    </View>
                  </BlurView>
                );
              })
            )}

          </View>
        )}

        {/* Tab Content 3: Blog */}
        {activeTab === 'blog' && (
          <View style={styles.contentSection}>
            <TouchableOpacity 
              style={styles.blogAddBtn} 
              onPress={handleOpenCreateBlog}
              activeOpacity={0.8}
            >
              <Ionicons name="add-circle" size={20} color="#000" />
              <Text style={styles.blogAddBtnText}>Yeni Yazı Ekle</Text>
            </TouchableOpacity>

            {isLoadingBlogs ? (
              <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 30 }} />
            ) : blogError ? (
              <Text style={styles.errorText}>{blogError}</Text>
            ) : blogs.length === 0 ? (
              <Text style={styles.emptyText}>Kütüphanede henüz yazı bulunmamaktadır.</Text>
            ) : (
              blogs.map(blog => (
                <BlurView intensity={20} tint="dark" key={blog.id} style={styles.blogCard}>
                  <View style={styles.blogCardHeader}>
                    {blog.imageUrl ? (
                      <Image source={{ uri: blog.imageUrl }} style={styles.blogCardImage} />
                    ) : (
                      <View style={styles.blogCardNoImage}>
                        <Ionicons name="book-outline" size={18} color={COLORS.textMuted} />
                      </View>
                    )}
                    <View style={styles.blogCardMeta}>
                      <Text style={styles.blogCardTitle} numberOfLines={1}>{blog.title}</Text>
                      <Text style={styles.blogCardSub}>Kategori: {blog.category} | {blog.published ? 'Yayınlandı' : 'Taslak'}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.blogCardFooter}>
                    <Text style={styles.memberId}>URL: {blog.slug}</Text>
                    <View style={styles.blogCardActions}>
                      <TouchableOpacity 
                        style={styles.blogCardBtn}
                        onPress={() => handleOpenEditBlog(blog)}
                      >
                        <Ionicons name="create-outline" size={16} color="#3B82F6" />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.blogCardBtn}
                        onPress={() => handleDeleteBlog(blog.id, blog.title)}
                      >
                        <Ionicons name="trash-outline" size={16} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </BlurView>
              ))
            )}
          </View>
        )}

        {/* Tab Content 3: Analytics */}
        {activeTab === 'analytics' && (
          <View style={styles.contentSection}>
            {/* Analytics Header Summary Card */}
            <View style={styles.analyticsHeaderCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.analyticsHeaderTitle}>Ziyaretçi Analitiği</Text>
                <Text style={styles.analyticsHeaderSubtitle}>Son 14 günün trafik, sayfa popülaritesi ve coğrafi verileri.</Text>
              </View>
              <TouchableOpacity 
                style={styles.analyticsRefreshBtn}
                onPress={() => fetchAnalytics()}
                disabled={isLoadingAnalytics}
              >
                {isLoadingAnalytics ? (
                  <ActivityIndicator size="small" color={COLORS.primary} />
                ) : (
                  <Ionicons name="refresh" size={16} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            </View>

            {/* Total Counters Overview */}
            {analytics?.total && (
              <View style={styles.analyticsMiniGrid}>
                <View style={styles.analyticsMiniCard}>
                  <Text style={styles.analyticsMiniLabel}>Toplam Sayfa Görüntüleme</Text>
                  <Text style={styles.analyticsMiniValue}>
                    {Number(analytics.total.total_page_views || 0).toLocaleString('tr-TR')}
                  </Text>
                </View>
                <View style={styles.analyticsMiniCard}>
                  <Text style={styles.analyticsMiniLabel}>Toplam Tekil Ziyaretçi</Text>
                  <Text style={[styles.analyticsMiniValue, { color: '#34D399' }]}>
                    {Number(analytics.total.total_unique_visitors || 0).toLocaleString('tr-TR')}
                  </Text>
                </View>
              </View>
            )}

            {isLoadingAnalytics && !analytics ? (
              <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 30 }} />
            ) : analyticsError ? (
              <Text style={styles.errorText}>{analyticsError}</Text>
            ) : (
              <>
                {/* 1. En Çok Ziyaret Edilen Sayfalar */}
                <BlurView intensity={20} tint="dark" style={styles.analyticsSectionCard}>
                  <View style={styles.analyticsCardTitleRow}>
                    <Ionicons name="trending-up" size={18} color={COLORS.primary} />
                    <Text style={styles.analyticsCardTitle}>En Çok Ziyaret Edilen Sayfalar</Text>
                  </View>
                  
                  {(!analytics?.topPages || analytics.topPages.length === 0) ? (
                    <Text style={styles.emptyText}>Henüz sayfa ziyaret verisi bulunmuyor.</Text>
                  ) : (
                    <View style={styles.analyticsList}>
                      {analytics.topPages.map((page: any, idx: number) => {
                        const maxViews = Math.max(...analytics.topPages.map((p: any) => p.views || 1), 1);
                        const percent = Math.min(100, Math.round(((page.views || 0) / maxViews) * 100));
                        return (
                          <View key={page.path || idx} style={styles.analyticsBarItem}>
                            <View style={styles.analyticsBarHeader}>
                              <Text style={styles.analyticsItemPath} numberOfLines={1}>
                                {page.path}
                              </Text>
                              <Text style={styles.analyticsItemHighlight}>{page.views} tık</Text>
                            </View>
                            <View style={styles.progressBarBackground}>
                              <View style={[styles.progressBarFill, { width: `${percent}%`, backgroundColor: COLORS.primary }]} />
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  )}
                </BlurView>

                {/* 2. Ziyaret Edilen Şehirler (Son 14 Gün) */}
                <BlurView intensity={20} tint="dark" style={styles.analyticsSectionCard}>
                  <View style={styles.analyticsCardTitleRow}>
                    <Ionicons name="location-outline" size={18} color="#10B981" />
                    <Text style={styles.analyticsCardTitle}>Ziyaret Edilen Şehirler (Son 14 Gün)</Text>
                  </View>

                  {(!analytics?.topCities || analytics.topCities.length === 0) ? (
                    <Text style={styles.emptyText}>Henüz coğrafi veri bulunmuyor.</Text>
                  ) : (
                    <View style={styles.analyticsList}>
                      {analytics.topCities.map((city: any, idx: number) => {
                        const maxViews = Math.max(...analytics.topCities.map((c: any) => c.visitors || 1), 1);
                        const percent = Math.min(100, Math.round(((city.visitors || 0) / maxViews) * 100));
                        return (
                          <View key={idx} style={styles.analyticsBarItem}>
                            <View style={styles.analyticsBarHeader}>
                              <Text style={styles.analyticsItemPath} numberOfLines={1}>
                                📍 {city.city || 'Bilinmeyen Şehir'}, {city.country || 'TR'}
                              </Text>
                              <Text style={[styles.analyticsItemHighlight, { color: '#10B981' }]}>
                                {city.visitors} tekil
                              </Text>
                            </View>
                            <View style={styles.progressBarBackground}>
                              <View style={[styles.progressBarFill, { width: `${percent}%`, backgroundColor: '#10B981' }]} />
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  )}
                </BlurView>

                {/* 3. Günlük Trafik Akışı (Son 14 Gün) */}
                <BlurView intensity={20} tint="dark" style={styles.analyticsSectionCard}>
                  <View style={styles.analyticsCardTitleRow}>
                    <Ionicons name="calendar-outline" size={18} color="#3B82F6" />
                    <Text style={styles.analyticsCardTitle}>Günlük Trafik Akışı (Son 14 Gün)</Text>
                  </View>

                  {(!analytics?.daily || analytics.daily.length === 0) ? (
                    <Text style={styles.emptyText}>Henüz trafik verisi bulunmuyor.</Text>
                  ) : (
                    <View style={styles.dailyTable}>
                      <View style={styles.dailyTableHeader}>
                        <Text style={[styles.dailyColHeader, { flex: 2 }]}>Tarih</Text>
                        <Text style={[styles.dailyColHeader, { flex: 1.2, textAlign: 'center' }]}>Tekil</Text>
                        <Text style={[styles.dailyColHeader, { flex: 1.2, textAlign: 'right' }]}>Gösterim</Text>
                      </View>
                      {analytics.daily.map((day: any) => {
                        const maxViews = Math.max(...analytics.daily.map((d: any) => d.page_views || 1), 1);
                        const percent = Math.min(100, Math.round(((day.page_views || 0) / maxViews) * 100));
                        return (
                          <View key={day.date} style={styles.dailyTableRow}>
                            <View style={{ flex: 2 }}>
                              <Text style={styles.dailyDateText}>{day.date}</Text>
                              <View style={[styles.progressBarBackground, { height: 3, marginTop: 4 }]}>
                                <View style={[styles.progressBarFill, { width: `${percent}%`, backgroundColor: '#3B82F6', height: 3 }]} />
                              </View>
                            </View>
                            <Text style={[styles.dailyValueText, { flex: 1.2, textAlign: 'center' }]}>
                              {day.unique_visitors}
                            </Text>
                            <Text style={[styles.dailyValueText, { flex: 1.2, textAlign: 'right', color: COLORS.primary, fontWeight: 'bold' }]}>
                              {day.page_views}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  )}
                </BlurView>

                {/* 4. Kayıtlı Üyelerin Son Aktiviteleri */}
                {(() => {
                  const displayedVisits = (analytics?.recentMemberVisits || []).filter((visit: any) => {
                    if (excludeAdmin) {
                      const isRoleAdmin = visit.role === 'admin';
                      const isPathAdmin = visit.path && visit.path.startsWith('/admin');
                      const isNameAdmin = visit.full_name && visit.full_name.toLowerCase().includes('admin');
                      return !isRoleAdmin && !isPathAdmin && !isNameAdmin;
                    }
                    return true;
                  });

                  return (
                    <BlurView intensity={20} tint="dark" style={styles.analyticsSectionCard}>
                      <View style={[styles.analyticsCardTitleRow, { justifyContent: 'space-between' }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
                          <Ionicons name="people-circle-outline" size={18} color="#A855F7" />
                          <Text style={styles.analyticsCardTitle}>Kayıtlı Üyelerin Son Aktiviteleri</Text>
                        </View>
                        <Text style={{ fontSize: 11, color: COLORS.primary, fontWeight: 'bold' }}>
                          ({displayedVisits.length})
                        </Text>
                      </View>

                      {/* 2-Option Segmented Switch */}
                      <View style={styles.memberFilterSegment}>
                        <TouchableOpacity
                          onPress={() => handleToggleExcludeAdmin(true)}
                          style={[
                            styles.segmentBtn,
                            excludeAdmin && styles.segmentBtnActive
                          ]}
                          activeOpacity={0.7}
                        >
                          <Text style={[
                            styles.segmentBtnText,
                            excludeAdmin && styles.segmentBtnTextActive
                          ]}>
                            👥 Sadece Üyeler
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => handleToggleExcludeAdmin(false)}
                          style={[
                            styles.segmentBtn,
                            !excludeAdmin && styles.segmentBtnActive
                          ]}
                          activeOpacity={0.7}
                        >
                          <Text style={[
                            styles.segmentBtnText,
                            !excludeAdmin && styles.segmentBtnTextActive
                          ]}>
                            🛡️ Yöneticiler Dahil
                          </Text>
                        </TouchableOpacity>
                      </View>

                      {/* Limit Selector: 25 / 50 / 100 */}
                      <View style={styles.limitSelectorRow}>
                        <Text style={styles.limitSelectorLabel}>Kayıt Limiti:</Text>
                        <View style={styles.limitButtonsGroup}>
                          {[25, 50, 100].map((l) => (
                            <TouchableOpacity
                              key={l}
                              onPress={() => handleChangeLimit(l)}
                              style={[
                                styles.limitBtn,
                                visitLimit === l && styles.limitBtnActive
                              ]}
                              activeOpacity={0.7}
                            >
                              <Text style={[
                                styles.limitBtnText,
                                visitLimit === l && styles.limitBtnTextActive
                              ]}>
                                {l}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>

                      {displayedVisits.length === 0 ? (
                        <Text style={styles.emptyText}>
                          {excludeAdmin ? 'Yönetici harici kayıtlı üye aktivitesi bulunamadı.' : 'Kayıtlı üye aktivitesi bulunmuyor.'}
                        </Text>
                      ) : (
                        <View style={styles.memberVisitsList}>
                          {displayedVisits.map((visit: any, idx: number) => {
                            const { dateStr, timeStr } = formatDateSafe(visit.created_at);
                            const roleMeta = ROLE_LABELS[visit.role] || ROLE_LABELS.free;

                            return (
                              <View key={idx} style={styles.memberVisitItem}>
                                <View style={styles.memberVisitHeader}>
                                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1, marginRight: 8 }}>
                                    <Text style={styles.memberVisitName} numberOfLines={1}>{visit.full_name || 'İsimsiz Üye'}</Text>
                                    {visit.role && visit.role !== 'free' && (
                                      <View style={[styles.roleMiniBadge, { backgroundColor: roleMeta.bg }]}>
                                        <Text style={[styles.roleMiniBadgeText, { color: roleMeta.color }]}>{roleMeta.label}</Text>
                                      </View>
                                    )}
                                  </View>
                                  <Text style={styles.memberVisitTime}>{dateStr}, {timeStr}</Text>
                                </View>
                                <Text style={styles.memberVisitEmail}>{visit.email}</Text>
                                <View style={styles.memberVisitPathContainer}>
                                  <Ionicons name="compass-outline" size={12} color={COLORS.primary} />
                                  <Text style={styles.memberVisitPath} numberOfLines={1}>{visit.path}</Text>
                                </View>
                              </View>
                            );
                          })}
                        </View>
                      )}
                    </BlurView>
                  );
                })()}
              </>
            )}
          </View>
        )}

      </ScrollView>

      {/* Role Picker Bottom Sheet Modal */}
      <Modal
        visible={showRoleModal}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setShowRoleModal(false);
          setSelectingUser(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => { setShowRoleModal(false); setSelectingUser(null); }} />
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seviye Seçin</Text>
              <Text style={styles.modalSubtitle}>Kullanıcı: {selectingUser?.name}</Text>
            </View>

            <View style={styles.modalOptions}>
              {[
                { role: 'free', label: 'Ücretsiz Üye', desc: 'Sadece ücretsiz içeriklere erişebilir.' },
                { role: 'apprentice', label: 'Çırak (Seviye 1)', desc: 'Giriş seviyesi dersleri ve sınavları açar.' },
                { role: 'journeyman', label: 'Kalfa (Seviye 2)', desc: 'Orta seviye dersleri ve kalfalık sınavını açar.' },
                { role: 'master', label: 'Usta (Seviye 3)', desc: 'Tüm dersleri ve ustalık sınavlarını açar.' },
                { role: 'admin', label: 'Yönetici (Admin)', desc: 'Tam sistem erişimi ve admin paneli yetkisi.' }
              ].map(opt => {
                const isSelected = selectingUser?.currentRole === opt.role;
                return (
                  <TouchableOpacity 
                    key={opt.role} 
                    style={[styles.modalOptionItem, isSelected && styles.modalOptionSelected]}
                    onPress={() => {
                      if (selectingUser) {
                        handleUpdateRole(selectingUser.id, opt.role);
                      }
                    }}
                  >
                    <View style={styles.modalOptionInfo}>
                      <Text style={[styles.modalOptionLabel, isSelected && { color: COLORS.primary }]}>{opt.label}</Text>
                      <Text style={styles.modalOptionDesc}>{opt.desc}</Text>
                    </View>
                    {isSelected && <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />}
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity 
              style={styles.modalCloseBtn}
              onPress={() => {
                setShowRoleModal(false);
                setSelectingUser(null);
              }}
            >
              <Text style={styles.modalCloseText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Blog Create/Edit Modal */}
      <Modal
        visible={showBlogModal}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setShowBlogModal(false);
          setEditingBlog(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => { setShowBlogModal(false); setEditingBlog(null); }} />
          <View style={[styles.modalCard, { maxHeight: '85%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingBlog ? 'Yazıyı Düzenle' : 'Yeni Yazı Ekle'}</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 15, paddingBottom: 20 }}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Başlık *</Text>
                <TextInput 
                  style={styles.formInput}
                  value={blogForm.title}
                  onChangeText={(val) => {
                    const slugVal = val.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
                    setBlogForm({ ...blogForm, title: val, slug: slugVal });
                  }}
                  placeholder="Örn: Diyafram Nefesi..."
                  placeholderTextColor={COLORS.textMuted}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>URL Yolu (Slug) *</Text>
                <TextInput 
                  style={styles.formInput}
                  value={blogForm.slug}
                  onChangeText={(val) => setBlogForm({ ...blogForm, slug: val })}
                  placeholder="diyagram-nefesi"
                  placeholderTextColor={COLORS.textMuted}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Kategori *</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 4 }}>
                  {['Astroloji', 'Nefes', 'Ritüeller', 'Kişisel Gelişim', 'Çakra Dengeleme'].map(cat => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.filterChip,
                        blogForm.category === cat && styles.filterChipActive
                      ]}
                      onPress={() => setBlogForm({ ...blogForm, category: cat })}
                    >
                      <Text style={[styles.filterChipText, blogForm.category === cat && styles.filterChipTextActive]}>{cat}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Görsel URL'si</Text>
                <TextInput 
                  style={styles.formInput}
                  value={blogForm.imageUrl}
                  onChangeText={(val) => setBlogForm({ ...blogForm, imageUrl: val })}
                  placeholder="https://example.com/image.jpg"
                  placeholderTextColor={COLORS.textMuted}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>İçerik *</Text>
                <TextInput 
                  style={[styles.formInput, styles.formTextArea]}
                  value={blogForm.content}
                  onChangeText={(val) => setBlogForm({ ...blogForm, content: val })}
                  placeholder="Yazı içeriği..."
                  placeholderTextColor={COLORS.textMuted}
                  multiline
                  numberOfLines={6}
                />
              </View>

              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Yayınla (Ziyaretçilere Göster)</Text>
                <Switch 
                  value={blogForm.published}
                  onValueChange={(val) => setBlogForm({ ...blogForm, published: val })}
                  trackColor={{ false: '#767577', true: COLORS.primary }}
                  thumbColor={blogForm.published ? '#FFF' : '#f4f3f4'}
                />
              </View>

              <TouchableOpacity 
                style={styles.formSubmitBtn}
                disabled={isSavingBlog}
                onPress={handleSaveBlog}
              >
                {isSavingBlog ? (
                  <ActivityIndicator size="small" color="#000" />
                ) : (
                  <Text style={styles.formSubmitText}>Yazıyı Kaydet</Text>
                )}
              </TouchableOpacity>
            </ScrollView>

            <TouchableOpacity 
              style={[styles.modalCloseBtn, { marginTop: 10, backgroundColor: 'rgba(255,59,48,0.1)' }]}
              onPress={() => {
                setShowBlogModal(false);
                setEditingBlog(null);
              }}
            >
              <Text style={[styles.modalCloseText, { color: '#EF4444' }]}>Kapat / Vazgeç</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    borderBottomColor: 'rgba(212, 175, 55, 0.2)',
  },
  backBtn: { padding: 5 },
  headerTitleContainer: { flex: 1, marginLeft: 15 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary },
  headerSub: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  refreshBtn: { padding: 5 },

  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    gap: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  tabTextActive: {
    color: COLORS.primary,
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 50,
  },

  statsGridContainer: {
    gap: 10,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#22C55E',
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: SIZES.radius,
    padding: 12,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  statTitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  statSub: {
    fontSize: 9,
    color: COLORS.textMuted,
    marginTop: 3,
  },

  contentSection: {
    gap: 15,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },

  vendorCard: {
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    padding: 15,
    marginBottom: 15,
    overflow: 'hidden',
  },
  cardBanned: {
    opacity: 0.6,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  vendorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  vendorInfo: {
    flex: 1,
    marginLeft: 12,
  },
  vendorName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
  },
  vendorId: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  ratingText: {
    color: '#F59E0B',
    fontSize: 11,
    fontWeight: 'bold',
  },
  vendorFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  statusBadgeGreen: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusTextGreen: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: 'bold',
  },
  statusBadgeRed: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusTextRed: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: 'bold',
  },
  actionBtn: {
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  actionBtnRed: {
    borderColor: 'rgba(239, 68, 68, 0.3)',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  actionBtnGreen: {
    borderColor: 'rgba(16, 185, 129, 0.3)',
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  actionTextRed: { color: '#EF4444' },
  actionTextGreen: { color: '#10B981' },

  filterBar: {
    marginBottom: 20,
    gap: 12,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 13,
  },
  selectorsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  selectWrapper: {
    flex: 1,
  },
  selectLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 6,
    fontWeight: '500',
  },
  filterScroll: {
    gap: 8,
    paddingRight: 20,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  filterChipActive: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  filterChipText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: COLORS.primary,
  },

  memberCard: {
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    padding: 15,
    marginBottom: 15,
    overflow: 'hidden',
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarInitials: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitialsText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  memberInfo: {
    flex: 1,
    marginLeft: 12,
  },
  memberName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
  },
  memberEmail: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  memberId: {
    fontSize: 9,
    color: COLORS.textMuted,
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginVertical: 12,
  },
  memberMetaRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 12,
  },
  metaCol: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 12,
    color: '#FFF',
  },
  memberActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    paddingTop: 12,
  },
  roleBadgeContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  roleBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  changeRoleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    backgroundColor: 'rgba(212, 175, 55, 0.05)',
  },
  changeRoleBtnText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#EF4444',
    textAlign: 'center',
    fontSize: 13,
    marginTop: 20,
  },
  emptyText: {
    color: COLORS.textMuted,
    textAlign: 'center',
    fontSize: 13,
    marginTop: 20,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#0A0A0A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.1)',
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  modalHeader: {
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  modalSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  modalOptions: {
    gap: 8,
    marginBottom: 15,
  },
  modalOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  modalOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(212, 175, 55, 0.05)',
  },
  modalOptionInfo: {
    flex: 1,
    marginRight: 10,
  },
  modalOptionLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFF',
  },
  modalOptionDesc: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  modalCloseBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
  },
  modalCloseText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
  },
  blogAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: SIZES.radius,
    marginBottom: 20,
    gap: 8,
  },
  blogAddBtnText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  blogCard: {
    padding: 15,
    borderRadius: SIZES.radius,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 15,
  },
  blogCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  blogCardImage: {
    width: 60,
    height: 45,
    borderRadius: 8,
    resizeMode: 'cover',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  blogCardNoImage: {
    width: 60,
    height: 45,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blogCardMeta: {
    flex: 1,
  },
  blogCardTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 18,
  },
  blogCardSub: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 4,
  },
  blogCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  blogCardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  blogCardBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  formInput: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#FFF',
    fontSize: 13,
  },
  formTextArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  switchLabel: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
  },
  formSubmitBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  formSubmitText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },

  /* Analytics Styles */
  analyticsHeaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: SIZES.radius,
    padding: 14,
    marginBottom: 5,
  },
  analyticsHeaderTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFF',
  },
  analyticsHeaderSubtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  analyticsRefreshBtn: {
    padding: 8,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  analyticsMiniGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  analyticsMiniCard: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 12,
  },
  analyticsMiniLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  analyticsMiniValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 4,
  },
  analyticsSectionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: SIZES.radius,
    padding: 15,
    marginBottom: 15,
    overflow: 'hidden',
  },
  analyticsCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    paddingBottom: 10,
  },
  analyticsCardTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFF',
  },
  analyticsList: {
    gap: 10,
  },
  analyticsBarItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 10,
    padding: 10,
  },
  analyticsBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  analyticsItemPath: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
    flex: 1,
    marginRight: 8,
  },
  analyticsItemHighlight: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  progressBarBackground: {
    height: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  dailyTable: {
    gap: 6,
  },
  dailyTableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    paddingBottom: 8,
  },
  dailyColHeader: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  dailyTableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.03)',
  },
  dailyDateText: {
    fontSize: 11,
    color: '#FFF',
    fontWeight: '500',
  },
  dailyValueText: {
    fontSize: 11,
    color: '#FFF',
  },
  memberVisitsList: {
    gap: 8,
  },
  memberVisitItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 10,
    padding: 10,
  },
  memberVisitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberVisitName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFF',
  },
  memberVisitTime: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  memberVisitEmail: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  memberVisitPathContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  memberVisitPath: {
    fontSize: 11,
    color: COLORS.primary,
    flex: 1,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  memberFilterSegment: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 3,
    marginBottom: 12,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
  },
  segmentBtnActive: {
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.4)',
  },
  segmentBtnText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  segmentBtnTextActive: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  roleMiniBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  roleMiniBadgeText: {
    fontSize: 8,
    fontWeight: 'bold',
  },
  limitSelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  limitSelectorLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  limitButtonsGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  limitBtn: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  limitBtnActive: {
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    borderColor: 'rgba(212, 175, 55, 0.4)',
  },
  limitBtnText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  limitBtnTextActive: {
    color: COLORS.primary,
    fontWeight: 'bold',
  }
});
