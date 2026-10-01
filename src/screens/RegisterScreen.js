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
import {
  validateEmail,
  checkPasswordStrength,
  validatePhone,
} from '../utils/validation';

export const RegisterScreen = ({ navigation }) => {
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [campus, setCampus] = useState('');
  const [role, setRole] = useState('Mahasiswa'); // 'Mahasiswa' | 'Pekerja'
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Errors
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const passwordStrength = checkPasswordStrength(password);

  const handleRegister = async () => {
    const newErrors = {};

    if (!name || name.trim().length < 3) {
      newErrors.name = 'Nama lengkap minimal 3 karakter';
    }

    const emailErr = validateEmail(email);
    if (emailErr) newErrors.email = emailErr;

    const phoneErr = validatePhone(phone);
    if (phoneErr) newErrors.phone = phoneErr;

    if (!password) {
      newErrors.password = 'Kata sandi wajib diisi';
    } else if (password.length < 6) {
      newErrors.password = 'Kata sandi minimal 6 karakter';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi kata sandi tidak cocok';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      await register({
        name,
        email,
        phone,
        role,
        campus: role === 'Mahasiswa' ? campus || 'Universitas Indonesia' : 'Pekerja Profesional',
      });
      Alert.alert(
        'Pendaftaran Berhasil! 🎉',
        'Selamat datang di CariKostan! Anda sekarang dapat mencari kos dan membaca ulasan jujur.'
      );
    } catch (e) {
      Alert.alert('Gagal Mendaftar', 'Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
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
          {/* Header */}
          <View style={styles.topNav}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Kembali ke halaman masuk"
            >
              <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.navTitle}>Buat Akun Baru</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.card}>
            <Text style={styles.formTitle}>Data Diri Mahasiswa / Pencari Kos</Text>
            <Text style={styles.formSubtitle}>
              Bergabung untuk mendapatkan rekomendasi kos terpercaya & ulasan jujur.
            </Text>

            {/* Role Selector */}
            <Text style={styles.fieldLabel}>Status Pencari Kos</Text>
            <View style={styles.roleContainer}>
              <TouchableOpacity
                style={[styles.roleOption, role === 'Mahasiswa' && styles.roleOptionActive]}
                onPress={() => setRole('Mahasiswa')}
                accessible={true}
                accessibilityRole="radio"
                accessibilityState={{ selected: role === 'Mahasiswa' }}
                accessibilityLabel="Pilih status Mahasiswa"
              >
                <Ionicons
                  name="school-outline"
                  size={18}
                  color={role === 'Mahasiswa' ? '#FFFFFF' : Colors.textSecondary}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[
                    styles.roleText,
                    role === 'Mahasiswa' && styles.roleTextActive,
                  ]}
                >
                  Mahasiswa
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.roleOption, role === 'Pekerja' && styles.roleOptionActive]}
                onPress={() => setRole('Pekerja')}
                accessible={true}
                accessibilityRole="radio"
                accessibilityState={{ selected: role === 'Pekerja' }}
                accessibilityLabel="Pilih status Pekerja atau Umum"
              >
                <Ionicons
                  name="briefcase-outline"
                  size={18}
                  color={role === 'Pekerja' ? '#FFFFFF' : Colors.textSecondary}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[
                    styles.roleText,
                    role === 'Pekerja' && styles.roleTextActive,
                  ]}
                >
                  Pekerja / Umum
                </Text>
              </TouchableOpacity>
            </View>

            {/* Nama Lengkap */}
            <Input
              label="Nama Lengkap"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (errors.name) setErrors({ ...errors, name: null });
              }}
              placeholder="Contoh: Rifqi Pratama"
              autoCapitalize="words"
              leftIcon="person-outline"
              error={errors.name}
            />

            {/* Email */}
            <Input
              label="Alamat Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors({ ...errors, email: null });
              }}
              placeholder="rifqi@kampus.ac.id"
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="mail-outline"
              error={errors.email}
            />

            {/* Phone */}
            <Input
              label="Nomor WhatsApp / HP Aktif"
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                if (errors.phone) setErrors({ ...errors, phone: null });
              }}
              placeholder="081234567890"
              keyboardType="phone-pad"
              leftIcon="call-outline"
              error={errors.phone}
              helperText="Digunakan untuk mempermudah komunikasi dengan pemilik kos"
            />

            {/* Campus / Instansi (if Mahasiswa) */}
            {role === 'Mahasiswa' && (
              <Input
                label="Asal Universitas / Kampus"
                value={campus}
                onChangeText={setCampus}
                placeholder="Contoh: Universitas Indonesia (UI)"
                leftIcon="school-outline"
              />
            )}

            {/* Kata Sandi */}
            <Input
              label="Kata Sandi"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors({ ...errors, password: null });
              }}
              placeholder="Minimal 6 karakter"
              secureTextEntry={true}
              leftIcon="lock-closed-outline"
              error={errors.password}
            />

            {/* Dynamic Password Strength Indicator */}
            {password.length > 0 && (
              <View style={styles.strengthContainer}>
                <View style={styles.strengthHeader}>
                  <Text style={styles.strengthLabel}>Kekuatan Kata Sandi:</Text>
                  <Text style={[styles.strengthValue, { color: passwordStrength.color }]}>
                    {passwordStrength.label}
                  </Text>
                </View>
                <View style={styles.strengthTrack}>
                  <View
                    style={[
                      styles.strengthBar,
                      {
                        width: `${(passwordStrength.score / 4) * 100}%`,
                        backgroundColor: passwordStrength.color,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.strengthMessage}>{passwordStrength.message}</Text>
              </View>
            )}

            {/* Konfirmasi Kata Sandi */}
            <Input
              label="Konfirmasi Kata Sandi"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
              }}
              placeholder="Ulangi kata sandi"
              secureTextEntry={true}
              leftIcon="shield-checkmark-outline"
              error={errors.confirmPassword}
            />

            {/* Submit Button */}
            <Button
              title="Daftar Akun CariKostan"
              onPress={handleRegister}
              loading={isLoading}
              size="large"
              icon="checkmark-circle-outline"
              style={{ marginTop: 12 }}
            />
          </View>

          {/* Footer to Login */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Sudah memiliki akun? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              accessible={true}
              accessibilityRole="link"
              accessibilityLabel="Masuk ke akun yang sudah ada"
            >
              <Text style={styles.loginLink}>Masuk di sini</Text>
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
    paddingVertical: 16,
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
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
  },
  formSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: 18,
    lineHeight: 18,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  roleContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  roleOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 8,
  },
  roleOptionActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  roleText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  roleTextActive: {
    color: '#FFFFFF',
  },
  strengthContainer: {
    marginTop: -8,
    marginBottom: 14,
    backgroundColor: Colors.surface,
    padding: 10,
    borderRadius: 10,
  },
  strengthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  strengthLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  strengthValue: {
    fontSize: 12,
    fontWeight: '700',
  },
  strengthTrack: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  strengthBar: {
    height: '100%',
    borderRadius: 3,
  },
  strengthMessage: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 24,
  },
  footerText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
});
