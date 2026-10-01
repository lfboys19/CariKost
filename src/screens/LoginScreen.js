import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useAuth } from '../context/AuthContext';
import { validateEmail } from '../utils/validation';

export const LoginScreen = ({ navigation }) => {
  const { login, demoLogin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const handleLogin = async () => {
    // Validate email
    const emailErr = validateEmail(email);
    if (emailErr) {
      setEmailError(emailErr);
      return;
    }
    setEmailError('');

    // Validate password
    if (!password) {
      setPasswordError('Kata sandi wajib diisi');
      return;
    }
    if (password.length < 6) {
      setPasswordError('Kata sandi minimal 6 karakter');
      return;
    }
    setPasswordError('');

    setIsLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      Alert.alert('Gagal Masuk', 'Terjadi kesalahan saat masuk. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsDemoLoading(true);
    try {
      await demoLogin();
    } catch (e) {
      Alert.alert('Gagal Masuk Demo', 'Silakan coba lagi.');
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo & Header */}
          <View style={styles.headerBox}>
            <View style={styles.iconCircle}>
              <Ionicons name="home" size={36} color={Colors.primary} />
            </View>
            <Text style={styles.appName}>CariKostan</Text>
            <Text style={styles.tagline}>
              Solusi Cari Kos Mahasiswa dengan Ulasan Jujur & Kondisi Nyata
            </Text>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            <Text style={styles.formTitle}>Masuk ke Akun Anda</Text>

            <Input
              label="Alamat Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (emailError) setEmailError('');
              }}
              placeholder="nama@kampus.ac.id"
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="mail-outline"
              error={emailError}
              accessibilityLabel="Input alamat email"
              accessibilityHint="Masukkan alamat email terdaftar Anda"
            />

            <Input
              label="Kata Sandi"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (passwordError) setPasswordError('');
              }}
              placeholder="Minimal 6 karakter"
              secureTextEntry={true}
              leftIcon="lock-closed-outline"
              error={passwordError}
              accessibilityLabel="Input kata sandi"
              accessibilityHint="Masukkan kata sandi akun Anda"
            />

            <Button
              title="Masuk Sekarang"
              onPress={handleLogin}
              loading={isLoading}
              size="large"
              icon="log-in-outline"
              style={{ marginTop: 8 }}
              accessibilityLabel="Tombol Masuk Sekarang"
              accessibilityHint="Ketuk untuk masuk ke dalam aplikasi"
            />

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ATAU DEMO CEPAT</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* 1-Tap Demo Button */}
            <Button
              title="Masuk Sebagai Mahasiswa Demo (1-Tap)"
              variant="outline"
              size="medium"
              icon="sparkles"
              onPress={handleDemoLogin}
              loading={isDemoLoading}
              accessibilityLabel="Tombol Masuk Akun Demo"
              accessibilityHint="Ketuk untuk langsung mencoba aplikasi dengan akun mahasiswa demo"
            />
          </View>

          {/* Footer to Register */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Belum punya akun CariKostan? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Register')}
              accessible={true}
              accessibilityRole="link"
              accessibilityLabel="Daftar akun baru"
              accessibilityHint="Buka formulir pendaftaran akun baru"
            >
              <Text style={styles.registerLink}>Daftar di sini</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    justifyContent: 'center',
    minHeight: '100%',
  },
  headerBox: {
    alignItems: 'center',
    marginBottom: 28,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
    maxWidth: 280,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 18,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    marginHorizontal: 10,
    letterSpacing: 0.5,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  registerLink: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
});
