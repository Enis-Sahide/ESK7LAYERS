import SacredBackground from '@/components/SacredBackground';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ImageBackground, Image, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { getMe, updateProfile, changePassword } from '@/src/core/api/client';
import { COLORS, SIZES } from '@/src/theme';

const ESOTERIC_BG = require('@/assets/images/esoteric_bg_indigo.webp');


export default function ProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');

  const [editMode, setEditMode] = useState({
    name: false,
    password: false
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const me: any = await getMe();
      setFullName(me?.user?.fullName || '');
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
      if (password.trim().length > 0 && password.trim().length < 6) {
        Alert.alert('Uyarı', 'Şifre en az 6 karakter olmalıdır.');
        setSaving(false);
        return;
      }

      await updateProfile({ fullName: fullName.trim() });
      if (password.trim().length >= 6) {
        await changePassword(password.trim());
      }

      Alert.alert(
        'Başarılı', 
        'Bilgileriniz evrenin kayıtlarına işlendi.',
        [{ text: 'Tamam', onPress: () => router.replace('/(dashboard)') }]
      );
    } catch (error: any) {
      Alert.alert('Hata', error.message || 'Güncelleme başarısız.');
    } finally {
      setSaving(false);
    }
  };

  const renderField = (
    label: string, 
    value: string, 
    fieldKey: 'name' | 'password', 
    setValue: (val: string) => void, 
    placeholder: string, 
    secureTextEntry: boolean = false
  ) => {
    const isEditing = editMode[fieldKey];

    return (
      <View style={styles.fieldContainer}>
        <View style={styles.fieldHeader}>
          <Text style={styles.label}>{label}</Text>
          <TouchableOpacity 
            onPress={() => setEditMode(prev => ({ ...prev, [fieldKey]: !isEditing }))}
            style={styles.editBtn}
          >
            <Ionicons name={isEditing ? "checkmark-circle" : "pencil"} size={16} color={isEditing ? "#34C759" : COLORS.primary} />
            <Text style={[styles.editBtnText, isEditing && { color: "#34C759" }]}>
              {isEditing ? "Tamam" : "Düzenle"}
            </Text>
          </TouchableOpacity>
        </View>

        {isEditing ? (
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={setValue}
            placeholder={placeholder}
            placeholderTextColor={COLORS.textMuted}
            secureTextEntry={secureTextEntry}
            autoFocus
          />
        ) : (
          <View style={styles.valueBox}>
            <Text style={styles.valueText}>
              {secureTextEntry ? (value ? '••••••••' : '••••••••') : (value || 'Belirtilmemiş')}
            </Text>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SacredBackground>

      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={28} color={COLORS.primary} />
        </TouchableOpacity>
        <View style={{alignItems: 'center'}}>
          <Text style={styles.headerTitle}>Profil ve Ayarlar</Text>
          <Text style={styles.headerSubtitle}>Kişisel Bilgilerini Güncelle</Text>
        </View>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <BlurView intensity={30} tint="dark" style={styles.card}>
          {renderField('İsminiz', fullName, 'name', setFullName, 'Adınız Soyadınız')}
          {renderField('Şifreniz', password, 'password', setPassword, 'Yeni şifrenizi girin', true)}
        </BlurView>

        <View style={{ alignItems: 'center', marginBottom: 30 }}>
          <Image 
            source={require('@/assets/images/indir.webp')} 
            style={{ width: 120, height: 120, borderRadius: 60, borderWidth: 2, borderColor: COLORS.primary }} 
          />
        </View>

        <TouchableOpacity 
          style={styles.saveBtn} 
          onPress={handleSave} 
          disabled={saving}
          activeOpacity={0.8}
        >
          {saving ? (
            <ActivityIndicator color="#000" />
          ) : (
            <>
              <Ionicons name="save-outline" size={20} color="#000" style={{ marginRight: 8 }} />
              <Text style={styles.saveBtnText}>Tüm Değişiklikleri Kaydet</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={{height: 100}} />
      </ScrollView>
    </SacredBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.2)',
  },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary },
  headerSubtitle: { fontSize: 12, color: COLORS.textMuted, marginTop: 4 },
  scrollContent: { padding: 20 },
  card: {
    padding: 20,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    marginBottom: 25,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  editBtnText: {
    color: COLORS.primary,
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    padding: 15,
    color: COLORS.text,
    fontSize: 16,
  },
  valueBox: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    padding: 15,
  },
  valueText: {
    color: COLORS.text,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: 'bold',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  racesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  raceCard: {
    width: '31%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  raceCardSelected: {
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    borderColor: COLORS.primary,
  },
  avatarImg: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: 8,
  },
  avatarImgSelected: {
    borderColor: COLORS.primary,
  },
  raceName: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  raceNameSelected: {
    color: COLORS.primary,
  },
  checkBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: COLORS.primary,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    padding: 18,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveBtnText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
