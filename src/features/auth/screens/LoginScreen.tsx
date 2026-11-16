import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, ImageBackground, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { COLORS, SIZES } from '@/src/theme';
import { login as apiLogin, loginWithGoogle } from '@/src/core/api/client';

const ESOTERIC_BG = require('@/assets/images/esoteric_bg_indigo.webp');
const GOLD_LOGO = require('@/assets/images/gold-logo.png');

function GoogleIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24">
      <Path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <Path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <Path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <Path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </Svg>
  );
}

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMsg('Lütfen e-posta ve şifrenizi girin.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      await apiLogin(email, password);
      router.replace('/(dashboard)');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Giriş başarısız. Bilgilerinizi kontrol edin.');
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setErrorMsg('');
    try {
      const ok = await loginWithGoogle();
      if (ok) {
        router.replace('/(dashboard)');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Google ile giriş yapılamadı.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <ImageBackground source={ESOTERIC_BG} style={styles.container} resizeMode="cover" imageStyle={{ opacity: 0.07 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Image source={GOLD_LOGO} style={styles.logo} resizeMode="contain" />
          <Text style={styles.title}>7LAYERS</Text>
          <Text style={styles.realmSubtitle}>ANCIENT KNOWLEDGE REALM</Text>
          <Text style={styles.subtitle}>Gizemli yolculuğa hoş geldin.</Text>

          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleLogin}
            disabled={loading || googleLoading}
            activeOpacity={0.85}
          >
            {googleLoading ? (
              <ActivityIndicator color="#1F2937" />
            ) : (
              <>
                <GoogleIcon />
                <Text style={styles.googleButtonText}>Google ile Giriş Yap</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>VEYA E-POSTA İLE</Text>
            <View style={styles.dividerLine} />
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
              placeholder="Şifren"
              placeholderTextColor={COLORS.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TouchableOpacity onPress={() => router.push('/forgot-password')} style={{ alignSelf: 'flex-end', marginTop: 8 }}>
              <Text style={{ color: COLORS.primary, fontSize: 13, fontWeight: '600' }}>Şifremi Unuttum?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={loading || googleLoading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.background} />
            ) : (
              <Text style={styles.buttonText}>GİRİŞ YAP</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Henüz inisiye olmadın mı?</Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text style={styles.footerLink}> Kayıt Ol</Text>
            </TouchableOpacity>
          </View>
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
  content: {
    flexGrow: 1,
    padding: SIZES.padding,
    justifyContent: 'center',
  },
  logo: {
    width: 72,
    height: 72,
    alignSelf: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 6,
    textShadowColor: 'rgba(212, 175, 55, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  realmSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 3,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: 24,
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: SIZES.radius,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  googleButtonText: {
    color: '#1F2937',
    fontSize: 15,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
  },
  dividerText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '600',
    marginHorizontal: 12,
    letterSpacing: 1,
  },
  inputContainer: {
    marginBottom: 18,
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
    marginTop: 8,
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
    marginTop: 26,
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
  },
});
