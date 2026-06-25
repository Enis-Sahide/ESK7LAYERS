import SacredBackground from '@/components/SacredBackground';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getMe, updateProfile, changePassword, logout as apiLogout } from '@/src/core/api/client';
import { COLORS, SIZES } from '@/src/theme';
import { useProgress } from '@/src/context/ProgressContext';

const ROLE_LABELS: Record<string, { label: string; badgeStyle: any; textStyle: any }> = {
  free: {
    label: 'ÜCRETSİZ ÜYELİK',
    badgeStyle: { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' },
    textStyle: { color: '#A0A0B0' }
  },
  apprentice: {
    label: 'Çıraklık (Seviye 1)',
    badgeStyle: { backgroundColor: 'rgba(217,119,6,0.1)', borderColor: 'rgba(217,119,6,0.5)' },
    textStyle: { color: '#F59E0B' }
  },
  journeyman: {
    label: 'Kalfalık (Seviye 2)',
    badgeStyle: { backgroundColor: 'rgba(59,130,246,0.1)', borderColor: 'rgba(59,130,246,0.5)' },
    textStyle: { color: '#3B82F6' }
  },
  master: {
    label: 'Ustalık (Seviye 3)',
    badgeStyle: { backgroundColor: 'rgba(212,175,55,0.1)', borderColor: 'rgba(212,175,55,0.5)' },
    textStyle: { color: COLORS.primary }
  },
  admin: {
    label: 'Yönetici (Admin)',
    badgeStyle: { backgroundColor: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.5)' },
    textStyle: { color: '#EF4444' }
  }
};

export default function ProfileScreen() {
  const router = useRouter();
  const { role, refresh: refreshProgress } = useProgress();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  // Password change states
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);
  const [showPwdSection, setShowPwdSection] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const me: any = await getMe();
      setFullName(me?.user?.fullName || '');
      setEmail(me?.user?.email || '');
    } catch (error: any) {
      Alert.alert('Hata', 'Profil bilgileri alınamadı.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert('Uyarı', 'Lütfen adınızı giriniz.');
      return;
    }

    setSaving(true);
    try {
      await updateProfile({ fullName: fullName.trim() });
      await refreshProgress();
      Alert.alert('Başarılı', 'Profiliniz başarıyla güncellendi.');
    } catch (error: any) {
      Alert.alert('Hata', error.message || 'Güncelleme başarısız.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Hata', 'Şifreler uyuşmuyor.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Hata', 'Şifre en az 6 karakter olmalıdır.');
      return;
    }

    setPwdLoading(true);
    try {
      await changePassword(password.trim());
      Alert.alert('Başarılı', 'Şifreniz başarıyla güncellendi!');
      setPassword('');
      setConfirmPassword('');
      setShowPwdSection(false);
    } catch (error: any) {
      Alert.alert('Hata', error.message || 'Şifre güncellenirken bir hata oluştu.');
    } finally {
      setPwdLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await apiLogout();
      router.replace('/(auth)/login');
    } catch (err: any) {
      console.error('Çıkış hatası:', err);
    }
  };

  const roleMeta = ROLE_LABELS[role] || ROLE_LABELS.free;

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SacredBackground>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Back Button */}
        <TouchableOpacity 
          onPress={() => router.canGoBack() ? router.back() : router.replace('/(dashboard)')} 
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={16} color={COLORS.textMuted} />
        </TouchableOpacity>

        {/* Header Profile Icon & Title */}
        <View style={styles.avatarHeader}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-outline" size={32} color={COLORS.primary} />
          </View>
          <Text style={styles.headerTitle}>Profil Ayarları</Text>
          <Text style={styles.headerSubtitle}>Kişisel bilgilerinizi güncelleyin</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Ad Soyad */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>AD SOYAD</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={16} color={COLORS.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Adınız Soyadınız"
                placeholderTextColor={COLORS.textMuted}
              />
            </View>
          </View>

          {/* E-Posta */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-POSTA</Text>
            <View style={[styles.inputWrapper, styles.disabledInputWrapper]}>
              <Ionicons name="mail-outline" size={16} color="rgba(160, 160, 176, 0.5)" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={email}
                editable={false}
              />
            </View>
            <Text style={styles.hintText}>E-posta adresiniz güvenlik sebebiyle değiştirilemez.</Text>
          </View>

          {/* VIP Seviyeniz Card */}
          <View style={styles.vipCard}>
            <View style={styles.vipLeft}>
              <Ionicons name="ribbon-outline" size={20} color={COLORS.primary} style={{ marginRight: 12 }} />
              <View>
                <Text style={styles.vipTitle}>VIP Seviyeniz</Text>
                <Text style={styles.vipSubtitle}>Kazanılan İnisiyasyon Seviyesi</Text>
              </View>
            </View>
            <View style={[styles.vipBadge, roleMeta.badgeStyle]}>
              <Text style={[styles.vipBadgeText, roleMeta.textStyle]}>{roleMeta.label}</Text>
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity 
            style={styles.saveBtn} 
            onPress={handleSave} 
            disabled={saving}
            activeOpacity={0.8}
          >
            {saving ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.saveBtnText}>Değişiklikleri Kaydet</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Change Password Section */}
        <View style={styles.passwordSection}>
          <TouchableOpacity 
            style={styles.pwdToggleHeader} 
            onPress={() => setShowPwdSection(!showPwdSection)}
            activeOpacity={0.7}
          >
            <Text style={styles.pwdToggleText}>ŞİFRE DEĞİŞTİR</Text>
            <Text style={styles.pwdToggleArrow}>{showPwdSection ? '▲' : '▼'}</Text>
          </TouchableOpacity>

          {showPwdSection && (
            <View style={styles.pwdForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>YENİ ŞİFRE</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={16} color={COLORS.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Yeni Şifreniz"
                    placeholderTextColor={COLORS.textMuted}
                    secureTextEntry
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>ŞİFRE TEKRAR</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={16} color={COLORS.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Yeni Şifreniz (Tekrar)"
                    placeholderTextColor={COLORS.textMuted}
                    secureTextEntry
                  />
                </View>
              </View>

              <TouchableOpacity 
                style={styles.pwdUpdateBtn} 
                onPress={handleUpdatePassword} 
                disabled={pwdLoading}
                activeOpacity={0.8}
              >
                {pwdLoading ? (
                  <ActivityIndicator color={COLORS.primary} />
                ) : (
                  <Text style={styles.pwdUpdateBtnText}>Şifreyi Güncelle</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.divider} />

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={16} color="#FF453A" style={{ marginRight: 8 }} />
          <Text style={styles.logoutBtnText}>Çıkış Yap</Text>
        </TouchableOpacity>

        <View style={{ height: 60 }} />
      </ScrollView>
    </SacredBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  scrollContent: { padding: 24, paddingTop: 60 },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0A0A0A',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#A0A0B0',
  },
  formContainer: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#A0A0B0',
    letterSpacing: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A0A0A',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 52,
  },
  disabledInputWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    height: '100%',
  },
  disabledInput: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  hintText: {
    fontSize: 10,
    color: 'rgba(160, 160, 176, 0.65)',
    fontStyle: 'italic',
    paddingLeft: 4,
  },
  vipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginTop: 10,
  },
  vipLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vipTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#A0A0B0',
    marginBottom: 2,
  },
  vipSubtitle: {
    fontSize: 10,
    color: 'rgba(160, 160, 176, 0.7)',
  },
  vipBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  vipBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveBtnText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 24,
  },
  passwordSection: {
    gap: 16,
  },
  pwdToggleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pwdToggleText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary,
    letterSpacing: 1,
  },
  pwdToggleArrow: {
    fontSize: 10,
    color: COLORS.primary,
  },
  pwdForm: {
    gap: 16,
    marginTop: 8,
  },
  pwdUpdateBtn: {
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.5)',
    backgroundColor: 'rgba(212, 175, 55, 0.05)',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  pwdUpdateBtnText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  logoutBtn: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgba(255, 69, 58, 0.3)',
    backgroundColor: 'rgba(255, 69, 58, 0.05)',
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutBtnText: {
    color: '#FF453A',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
