import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, Alert, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SIZES } from '@/src/theme';
import { forgotPassword } from '@/src/core/api/client';
import { Ionicons } from '@expo/vector-icons';

const ESOTERIC_BG = require('@/assets/images/esoteric_bg_indigo.webp');

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleResetPassword = async () => {
    if (!email) {
      setErrorMsg('Lütfen e-posta adresinizi girin.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res: any = await forgotPassword(email);
      setSuccessMsg(
        res?.message ||
          'Eğer bu e-posta kayıtlıysa, şifre yenileme talimatı gönderildi. Lütfen gelen kutunuzu kontrol edin.',
      );
      setEmail('');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Sıfırlama isteği gönderilemedi.');
    }
    setLoading(false);
  };

  return (
    <ImageBackground source={ESOTERIC_BG} style={styles.container} resizeMode="cover" imageStyle={{ opacity: 0.07 }}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={28} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Şifremi Unuttum</Text>
          <Text style={styles.subtitle}>Hesabınıza kayıtlı e-posta adresini girin. Size bir sıfırlama bağlantısı göndereceğiz.</Text>

          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
          {successMsg ? <Text style={styles.successText}>{successMsg}</Text> : null}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>E-Posta</Text>
            <TextInput
              style={styles.input}
              placeholder="E-posta adresiniz"
              placeholderTextColor={COLORS.textMuted}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <TouchableOpacity 
            style={styles.button}
            onPress={handleResetPassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.background} />
            ) : (
              <Text style={styles.buttonText}>ŞİFREYİ SIFIRLA</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderRadius: 20,
  },
  content: {
    flex: 1,
    padding: SIZES.padding,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
    textShadowColor: 'rgba(212, 175, 55, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginBottom: 40,
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: COLORS.text,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    marginTop: 10,
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
  errorText: {
    color: COLORS.error,
    marginBottom: 15,
  },
  successText: {
    color: '#4CD964', // Green for success
    marginBottom: 15,
    lineHeight: 20,
  }
});
