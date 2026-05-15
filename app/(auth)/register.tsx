import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView, Switch, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SIZES } from '@/src/theme';
import { supabase } from '@/src/services/supabase';

const ESOTERIC_BG = require('@/assets/images/backgrounds/esoteric_bg.png');

export default function RegisterScreen() {
  const router = useRouter();
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthDate, setBirthDate] = useState(''); // Örn: 15/08/1990
  const [birthPlace, setBirthPlace] = useState(''); // Örn: İstanbul
  
  // Doğum Saati State
  const [birthTime, setBirthTime] = useState(''); // Örn: 14:30
  const [isTimeUnknown, setIsTimeUnknown] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Sadece sayı girişine izin veren ve DD/MM/YYYY formatına sokan fonksiyon
  const handleDateChange = (text: string) => {
    let cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length > 8) cleaned = cleaned.substring(0, 8);
    let formatted = cleaned;
    if (cleaned.length > 2) {
      formatted = cleaned.substring(0, 2) + '/' + cleaned.substring(2);
    }
    if (cleaned.length > 4) {
      formatted = formatted.substring(0, 5) + '/' + cleaned.substring(4);
    }
    setBirthDate(formatted);
  };

  // Sadece sayı girişine izin veren ve HH:MM formatına sokan fonksiyon
  const handleTimeChange = (text: string) => {
    let cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length > 4) cleaned = cleaned.substring(0, 4);
    let formatted = cleaned;
    if (cleaned.length > 2) {
      formatted = cleaned.substring(0, 2) + ':' + cleaned.substring(2);
    }
    setBirthTime(formatted);
  };
  const handleRegister = async () => {
    if (!name || !email || !password || !birthDate || !birthPlace) {
      setErrorMsg('Lütfen zorunlu alanları doldurun.');
      return;
    }

    if (!isTimeUnknown && !birthTime) {
      setErrorMsg('Lütfen doğum saatinizi girin veya bilinmiyor olarak işaretleyin.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    
    // Supabase Auth ile Kullanıcı Oluşturma
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          birth_date: birthDate,
          birth_place: birthPlace,
          birth_time: isTimeUnknown ? 'Bilinmiyor' : birthTime,
        }
      }
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      // Başarılı kayıt, garanti olması için doğrudan Irk Keşfi ekranına yönlendir
      router.replace('/(onboarding)/race-reveal');
    }
  };

  return (
    <ImageBackground source={ESOTERIC_BG} style={styles.container} resizeMode="cover">
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>İnisiyasyon</Text>
        <Text style={styles.subtitle}>Evrensel yolculuğuna başlamak için kayıt ol.</Text>

        {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Ad Soyad</Text>
          <TextInput
            style={styles.input}
            placeholder="Adın ve Soyadın"
            placeholderTextColor={COLORS.textMuted}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>E-Posta</Text>
          <TextInput
            style={styles.input}
            placeholder="E-posta adresin"
            placeholderTextColor={COLORS.textMuted}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Şifre</Text>
          <TextInput
            style={styles.input}
            placeholder="Güçlü bir şifre belirle"
            placeholderTextColor={COLORS.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {/* Astroloji Bilgileri */}
        <Text style={styles.sectionTitle}>Astroloji Bilgileri</Text>
        
        <View style={styles.row}>
          <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.label}>Doğum Tarihi</Text>
            <TextInput
              style={styles.input}
              placeholder="GG/AA/YYYY"
              placeholderTextColor={COLORS.textMuted}
              value={birthDate}
              onChangeText={handleDateChange}
              keyboardType="number-pad"
            />
          </View>

          <View style={[styles.inputContainer, { flex: 1 }]}>
            <Text style={styles.label}>Doğum Yeri</Text>
            <TextInput
              style={styles.input}
              placeholder="Şehir / İlçe"
              placeholderTextColor={COLORS.textMuted}
              value={birthPlace}
              onChangeText={setBirthPlace}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Doğum Saati</Text>
          <View style={styles.timeRow}>
            <TextInput
              style={[styles.input, { flex: 1, marginRight: 15, opacity: isTimeUnknown ? 0.5 : 1 }]}
              placeholder="SS:DD"
              placeholderTextColor={COLORS.textMuted}
              value={birthTime}
              onChangeText={handleTimeChange}
              editable={!isTimeUnknown}
              keyboardType="number-pad"
            />
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Bilinmiyor</Text>
              <Switch
                value={isTimeUnknown}
                onValueChange={(val) => {
                  setIsTimeUnknown(val);
                  if(val) setBirthTime(''); // Bilinmiyor seçilirse saati temizle
                }}
                trackColor={{ false: COLORS.surface, true: COLORS.primaryDark }}
                thumbColor={isTimeUnknown ? COLORS.primary : '#f4f3f4'}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.button}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.background} />
          ) : (
            <Text style={styles.buttonText}>KAYDI TAMAMLA</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Zaten inisiye oldun mu?</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.footerLink}> Giriş Yap</Text>
          </TouchableOpacity>
        </View>
        
        <View style={{height: 40}} /> 
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SIZES.padding,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(212, 175, 55, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    color: COLORS.primaryDark,
    marginTop: 10,
    marginBottom: 15,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.2)',
    paddingBottom: 5,
  },
  inputContainer: {
    marginBottom: 18,
  },
  label: {
    color: COLORS.text,
    marginBottom: 6,
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: 14,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    color: COLORS.textMuted,
    marginRight: 8,
    fontSize: 14,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  footerText: {
    color: COLORS.textMuted,
  },
  footerLink: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  errorText: {
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: 15,
  }
});
