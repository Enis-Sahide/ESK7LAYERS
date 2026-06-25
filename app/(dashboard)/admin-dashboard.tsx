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
  Modal 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import SacredBackground from '@/components/SacredBackground';
import { COLORS, SIZES } from '@/src/theme';
import { apiFetch } from '@/src/core/api/client';
import { useMarketplace } from '@/src/core/content/useContent';

const ROLE_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  free: { label: 'ÜCRETSİZ ÜYELİK', color: COLORS.textMuted, bg: 'rgba(255, 255, 255, 0.05)' },
  apprentice: { label: 'ÇIRAK (SEVİYE 1)', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' },
  journeyman: { label: 'KALFA (SEVİYE 2)', color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.1)' },
  master: { label: 'USTA (SEVİYE 3)', color: COLORS.primary, bg: 'rgba(212, 175, 55, 0.1)' },
  admin: { label: 'YÖNETİCİ', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)' }
};

const MOCK_USER_STORES: Record<string, { id: string; name: string }> = {
  "1dde7856-c331-4277-a43f-fb975808c3c0": { id: "sifa-tasi", name: "Şifa Taşı Dükkanı" }
};

const getUserStore = (profile: any) => {
  if (MOCK_USER_STORES[profile.id]) {
    return MOCK_USER_STORES[profile.id];
  }
  const name = (profile.full_name || '').toLowerCase();
  if (name.includes('enis') || name.includes('enis@')) {
    return { id: "kadim-kokular", name: "Kadim Kokular" };
  }
  if (name.includes('lalezar') || name.includes('lalezar_28')) {
    return { id: "mistik-yol", name: "Mistik Yol" };
  }
  return null;
};

export default function AdminDashboardScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'stores' | 'members'>('stores');
  
  // Stores (vendors) from marketplace content API
  const { vendors: VENDORS, loading: isLoadingVendors } = useMarketplace();
  const [vendors, setVendors] = useState<any[]>([]);

  useEffect(() => {
    if (VENDORS && VENDORS.length > 0) {
      setVendors(VENDORS.map(v => ({ ...v, status: 'approved' })));
    }
  }, [VENDORS]);

  // Profiles (members)
  const [profiles, setProfiles] = useState<any[]>([]);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(true);
  const [profilesError, setProfilesError] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [storeFilter, setStoreFilter] = useState('all');

  // Updating and modal states
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
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

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleToggleStoreStatus = (id: string) => {
    const vendor = vendors.find(v => v.id === id);
    if (!vendor) return;

    const toggleStatus = () => {
      setVendors(vendors.map(v => {
        if (v.id === id) {
          return { ...v, status: v.status === 'approved' ? 'banned' : 'approved' };
        }
        return v;
      }));
    };

    if (vendor.status === 'approved') {
      if (Platform.OS === 'web') {
        const confirmClose = window.confirm(`"${vendor.name}" isimli mağazayı kapatmak istediğinize emin misiniz?`);
        if (confirmClose) toggleStatus();
      } else {
        Alert.alert(
          "Mağazayı Kapat",
          `"${vendor.name}" isimli mağazayı kapatmak istediğinize emin misiniz?`,
          [
            { text: 'İptal', style: 'cancel' },
            { text: 'Kapat', style: 'destructive', onPress: toggleStatus }
          ]
        );
      }
    } else {
      toggleStatus();
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

    const userStore = getUserStore(p);
    const hasStore = !!userStore;
    const matchesStore = 
      storeFilter === 'all' || 
      (storeFilter === 'has_store' && hasStore) || 
      (storeFilter === 'no_store' && !hasStore);

    return matchesSearch && matchesRole && matchesStore;
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
        <TouchableOpacity onPress={fetchProfiles} style={styles.refreshBtn}>
          <Ionicons name="refresh" size={20} color={COLORS.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'stores' && styles.tabActive]}
          onPress={() => setActiveTab('stores')}
        >
          <Ionicons name="storefront-outline" size={16} color={activeTab === 'stores' ? COLORS.primary : COLORS.textMuted} />
          <Text style={[styles.tabText, activeTab === 'stores' && styles.tabTextActive]}>Mağaza Yönetimi</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'members' && styles.tabActive]}
          onPress={() => setActiveTab('members')}
        >
          <Ionicons name="people-outline" size={16} color={activeTab === 'members' ? COLORS.primary : COLORS.textMuted} />
          <Text style={[styles.tabText, activeTab === 'members' && styles.tabTextActive]}>
            Üye Yönetimi {!isLoadingProfiles && `(${profiles.length})`}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Statistics Widgets */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Text style={styles.statTitle}>Toplam Ciro</Text>
              <Ionicons name="cash-outline" size={16} color={COLORS.textMuted} />
            </View>
            <Text style={styles.statValue}>45.000 ₺</Text>
            <Text style={styles.statSub}>Mağazaların toplam cirosu</Text>
          </View>

          <View style={[styles.statCard, { borderColor: 'rgba(212, 175, 55, 0.3)', backgroundColor: 'rgba(212, 175, 55, 0.05)' }]}>
            <View style={styles.statHeader}>
              <Text style={[styles.statTitle, { color: COLORS.primary }]}>Net Gelir (%10)</Text>
              <Ionicons name="shield-outline" size={16} color={COLORS.primary} />
            </View>
            <Text style={styles.statValue}>4.500 ₺</Text>
            <Text style={styles.statSub}>Platform komisyon geliri</Text>
          </View>
        </View>

        {/* Tab Content 1: Stores */}
        {activeTab === 'stores' && (
          <View style={styles.contentSection}>
            <Text style={styles.sectionTitle}>Kayıtlı Mağazalar ({vendors.length})</Text>

            {isLoadingVendors ? (
              <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 30 }} />
            ) : (
              vendors.map(v => (
                <BlurView intensity={20} tint="dark" key={v.id} style={[styles.vendorCard, v.status === 'banned' && styles.cardBanned]}>
                  <View style={styles.vendorHeader}>
                    <View style={styles.avatarCircle}>
                      <Text style={styles.avatarText}>{v.name ? v.name.slice(0, 1) : 'M'}</Text>
                    </View>
                    <View style={styles.vendorInfo}>
                      <Text style={styles.vendorName}>{v.name}</Text>
                      <Text style={styles.vendorId}>ID: {v.id}</Text>
                    </View>
                    <View style={styles.ratingBadge}>
                      <Ionicons name="star" size={12} color="#F59E0B" />
                      <Text style={styles.ratingText}>{v.rating || '5.0'}</Text>
                    </View>
                  </View>

                  <View style={styles.vendorFooter}>
                    {v.status === 'approved' ? (
                      <View style={styles.statusBadgeGreen}>
                        <Ionicons name="checkmark-circle" size={12} color="#10B981" style={{ marginRight: 4 }} />
                        <Text style={styles.statusTextGreen}>Aktif</Text>
                      </View>
                    ) : (
                      <View style={styles.statusBadgeRed}>
                        <Ionicons name="close-circle" size={12} color="#EF4444" style={{ marginRight: 4 }} />
                        <Text style={styles.statusTextRed}>Engellendi</Text>
                      </View>
                    )}

                    <TouchableOpacity 
                      style={[styles.actionBtn, v.status === 'approved' ? styles.actionBtnRed : styles.actionBtnGreen]}
                      onPress={() => handleToggleStoreStatus(v.id)}
                    >
                      <Text style={[styles.actionBtnText, v.status === 'approved' ? styles.actionTextRed : styles.actionTextGreen]}>
                        {v.status === 'approved' ? 'Mağazayı Kapat' : 'Geri Aç'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </BlurView>
              ))
            )}
          </View>
        )}

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
                const userStore = getUserStore(p);

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
                        <Text style={styles.memberId}>ID: {p.id}</Text>
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

                      <View style={styles.metaCol}>
                        <Text style={styles.metaLabel}>Mağaza</Text>
                        <Text style={[styles.metaValue, userStore ? { color: '#3B82F6', fontWeight: 'bold' } : null]}>
                          {userStore ? userStore.name : 'Yok'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.memberActionsRow}>
                      <View style={[styles.roleBadgeContainer, { backgroundColor: roleMeta.bg }]}>
                        <Text style={[styles.roleBadgeText, { color: roleMeta.color }]}>{roleMeta.label}</Text>
                      </View>

                      <TouchableOpacity 
                        style={styles.changeRoleBtn}
                        disabled={updatingUserId === p.id}
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
                    </View>
                  </BlurView>
                );
              })
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

  statsGrid: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 25,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: SIZES.radius,
    padding: 15,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  statSub: {
    fontSize: 9,
    color: COLORS.textMuted,
    marginTop: 4,
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
  }
});
