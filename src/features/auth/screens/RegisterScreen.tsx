import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SIZES } from '@/src/theme';
import { register as apiRegister, verifyEmail, resendVerificationCode } from '@/src/core/api/client';

const ESOTERIC_BG = require('@/assets/images/esoteric_bg_indigo.webp');

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
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          {/* Branding Header */}
          <View style={styles.brandHeader}>
            <Text style={styles.brandSub}>ANCIENT KNOWLEDGE SCHOOL</Text>
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
                disabled={loading}
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
  }
});
