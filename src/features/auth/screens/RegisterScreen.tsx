import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView, ImageBackground, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { COLORS, SIZES } from '@/src/theme';
import { register as apiRegister, verifyEmail, resendVerificationCode, loginWithGoogle } from '@/src/core/api/client';

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

export default function RegisterScreen() {
  const router = useRouter();

  // Step: 'form' | 'otp'
  const [step, setStep] = useState<'form' | 'otp'>('form');

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // OTP State
  const [otpCode, setOtpCode] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [infoMsg, setInfoMsg] = useState('');

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer: any;
    if (step === 'otp' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setErrorMsg('Lütfen zorunlu alanları doldurun.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setInfoMsg('');

    try {
      const res = await apiRegister(email, password, name);
      if (res?.requiresVerification) {
        setStep('otp');
        setCountdown(60);
        setCanResend(false);
        setInfoMsg(res.message || 'E-posta adresinize 6 haneli doğrulama kodu gönderildi.');
      } else {
        // Doğrudan giriş yapıldıysa
        router.replace('/(dashboard)');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Kayıt sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setGoogleLoading(true);
    setErrorMsg('');
    setInfoMsg('');
    try {
      const ok = await loginWithGoogle();
      if (ok) {
        router.replace('/(dashboard)');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Google ile hızlı kayıt yapılamadı.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.trim().length !== 6) {
      setErrorMsg('Lütfen 6 haneli doğrulama kodunu giriniz.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      await verifyEmail(email, otpCode.trim());
      router.replace('/(dashboard)');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Doğrulama kodu geçersiz veya süresi dolmuş.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend || resendLoading) return;
    setResendLoading(true);
    setErrorMsg('');
    try {
      await resendVerificationCode(email);
      setCountdown(60);
      setCanResend(false);
      setInfoMsg('Yeni doğrulama kodu gönderildi.');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Kod tekrar gönderilirken bir hata oluştu.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <ImageBackground source={ESOTERIC_BG} style={styles.container} resizeMode="cover" imageStyle={{ opacity: 0.07 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

          {/* Branding Header */}
          <View style={styles.brandHeader}>
            <Image source={GOLD_LOGO} style={styles.logo} resizeMode="contain" />
            <Text style={styles.brandSub}>ANCIENT KNOWLEDGE REALM</Text>
            <Text style={styles.title}>{step === 'form' ? 'İnisiyasyon' : 'E-Posta Doğrulama'}</Text>
            <Text style={styles.subtitle}>
              {step === 'form'
                ? 'Evrensel yolculuğuna başlamak için kayıt ol.'
                : `${email} adresine gönderilen 6 haneli mühür kodunu giriniz.`}
            </Text>
          </View>

          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
          {infoMsg ? <Text style={styles.infoText}>{infoMsg}</Text> : null}

          {step === 'form' ? (
            <>
              {Platform.OS !== 'ios' && (
                <>
                  <TouchableOpacity
                    style={styles.googleButton}
                    onPress={handleGoogleRegister}
                    disabled={loading || googleLoading}
                    activeOpacity={0.85}
                  >
                    {googleLoading ? (
                      <ActivityIndicator color="#1F2937" />
                    ) : (
                      <>
                        <GoogleIcon />
                        <Text style={styles.googleButtonText}>Google ile Hızlı Kayıt Ol</Text>
                      </>
                    )}
                  </TouchableOpacity>

                  <View style={styles.dividerRow}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>VEYA E-POSTA İLE</Text>
                    <View style={styles.dividerLine} />
                  </View>
                </>
              )}

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Ad Soyad</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Adınız ve soyadınız"
                  placeholderTextColor={COLORS.textMuted}
                  value={name}
                  onChangeText={setName}
                />
              </View>

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

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Şifre</Text>
                <TextInput
                  style={styles.input}
                  placeholder="En az 6 karakter"
                  placeholderTextColor={COLORS.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={handleRegister}
                disabled={loading || googleLoading}
              >
                {loading ? (
                  <ActivityIndicator color={COLORS.background} />
                ) : (
                  <Text style={styles.buttonText}>KAYIT OL</Text>
                )}
              </TouchableOpacity>

              <View style={styles.footer}>
                <Text style={styles.footerText}>Zaten inisiye oldun mu?</Text>
                <TouchableOpacity onPress={() => router.push('/login')}>
                  <Text style={styles.footerLink}> Giriş Yap</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              {/* OTP Input Form */}
              <View style={styles.otpContainer}>
                <Text style={styles.otpLabel}>6 Haneli Doğrulama Kodu</Text>
                <TextInput
                  style={styles.otpInput}
                  placeholder="000000"
                  placeholderTextColor="rgba(212, 175, 55, 0.3)"
                  value={otpCode}
                  onChangeText={(val) => setOtpCode(val.replace(/[^0-9]/g, '').slice(0, 6))}
                  keyboardType="number-pad"
                  maxLength={6}
                  autoFocus
                />
                <Text style={styles.otpHalpText}>Kod e-postanıza ulaşmadıysa spam/gereksiz klasörünü kontrol edin.</Text>
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={handleVerifyOtp}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={COLORS.background} />
                ) : (
                  <Text style={styles.buttonText}>ONAYLA & BAŞLA</Text>
                )}
              </TouchableOpacity>

              {/* Resend & Back Buttons */}
              <View style={styles.otpActionsRow}>
                {canResend ? (
                  <TouchableOpacity onPress={handleResendCode} disabled={resendLoading}>
                    <Text style={styles.resendLink}>
                      {resendLoading ? 'Gönderiliyor...' : 'Yeni Kod Gönder'}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.countdownText}>Yeni kod için bekleyin: {countdown} sn</Text>
                )}

                <TouchableOpacity onPress={() => { setStep('form'); setErrorMsg(''); setInfoMsg(''); }}>
                  <Text style={styles.backLink}>Bilgileri Değiştir</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          <View style={{ height: 40 }} />
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
    paddingTop: 50,
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 68,
    height: 68,
    alignSelf: 'center',
    marginBottom: 12,
  },
  brandSub: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 3,
    color: COLORS.primary,
    opacity: 0.8,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(212, 175, 55, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 15,
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
  otpContainer: {
    marginTop: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  otpLabel: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  otpInput: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    color: COLORS.primary,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 10,
    borderWidth: 2,
    borderColor: 'rgba(212, 175, 55, 0.4)',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  otpHalpText: {
    color: COLORS.textMuted,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 16,
  },
  otpActionsRow: {
    marginTop: 25,
    alignItems: 'center',
    gap: 14,
  },
  countdownText: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  resendLink: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  backLink: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 13,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    marginTop: 16,
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
    letterSpacing: 1,
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
    color: '#EF4444',
    textAlign: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 13,
  },
  infoText: {
    color: '#10B981',
    textAlign: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.2)',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 13,
  },
});
