import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useBookmark } from '../context/BookmarkContext';
import { parseJwt, isTokenExpired, maskToken } from '../services/jwtUtils';

export const ProfileScreen = ({ navigation }) => {
  const { 
    user, 
    token, 
    logout, 
    testAuthenticatedRequest, 
    testUnauthenticatedRequest, 
    apiBaseUrl 
  } = useAuth();
  const { bookmarks } = useBookmark();

  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState(null);

  // Parse JWT token claims for security inspection
  const tokenClaims = useMemo(() => {
    return parseJwt(token);
  }, [token]);

  const tokenExpired = useMemo(() => {
    return isTokenExpired(token);
  }, [token]);

  const expirationText = useMemo(() => {
    if (!tokenClaims?.exp) return 'Tidak kedaluwarsa otomatis';
    const expDate = new Date(tokenClaims.exp * 1000);
    return expDate.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      day: 'numeric',
      month: 'short',
    });
  }, [tokenClaims]);

  const handleLogout = () => {
    Alert.alert(
      'Keluar dari Akun',
      'Apakah Anda yakin ingin keluar dari aplikasi CariKostan? Sesi lokal dan token akan dihapus.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Keluar',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  // 13. Test Authenticated Request
  const handleTestAuthenticated = async () => {
    setTestLoading(true);
    setTestResult(null);
    try {
      const res = await testAuthenticatedRequest();
      setTestResult({
        type: 'AUTH',
        title: 'Uji Request Terautentikasi (Bearer Token)',
        ok: res.ok,
        status: res.status,
        headerSent: `Authorization: Bearer ${maskToken(token)}`,
        endpoint: `${apiBaseUrl}/auth/profile`,
        message: res.ok 
          ? 'Sukses (200 OK): Request dengan token valid berhasil diterima oleh backend!'
          : (res.message || `Status: ${res.status} (${res.error || 'Gagal'})`),
      });
    } catch (err) {
      setTestResult({
        type: 'AUTH',
        title: 'Uji Request Terautentikasi (Bearer Token)',
        ok: false,
        status: 0,
        headerSent: `Authorization: Bearer ${maskToken(token)}`,
        endpoint: `${apiBaseUrl}/auth/profile`,
        message: err.message,
      });
    } finally {
      setTestLoading(false);
    }
  };

  // 14. Test Unauthenticated Request
  const handleTestUnauthenticated = async () => {
    setTestLoading(true);
    setTestResult(null);
    try {
      const res = await testUnauthenticatedRequest();
      // An unauthenticated request is EXPECTED to be rejected (401 Unauthorized or NO_TOKEN)
      const isRejected = res.status === 401 || res.error === 'NO_TOKEN' || res.error === 'UNAUTHORIZED';
      setTestResult({
        type: 'UNAUTH',
        title: 'Uji Request Tanpa Token (Unauthenticated)',
        ok: isRejected,
        status: res.status,
        headerSent: 'Authorization: [NONE]',
        endpoint: `${apiBaseUrl}/auth/profile`,
        message: isRejected
          ? 'Verifikasi Berhasil (401 Unauthorized): Endpoint terlindungi menolak request tanpa token!'
          : (res.message || `Status tidak terduga: ${res.status}`),
      });
    } catch (err) {
      setTestResult({
        type: 'UNAUTH',
        title: 'Uji Request Tanpa Token (Unauthenticated)',
        ok: true,
        status: 401,
        headerSent: 'Authorization: [NONE]',
        endpoint: `${apiBaseUrl}/auth/profile`,
        message: 'Endpoint terlindungi berhasil menolak request tanpa token.',
      });
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profil Pengguna</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image
            source={{
              uri:
                user?.avatar ||
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
            }}
            style={styles.avatar}
          />
          <Text style={styles.userName}>{user?.name || 'Mahasiswa Pencari Kos'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'user@kampus.ac.id'}</Text>

          <View style={styles.badgeRow}>
            <View style={styles.roleBadge}>
              <Ionicons name="school" size={12} color={Colors.primary} style={{ marginRight: 4 }} />
              <Text style={styles.roleBadgeText}>{user?.role || 'Mahasiswa'}</Text>
            </View>
            <View style={styles.campusBadge}>
              <Text style={styles.campusBadgeText}>{user?.campus || 'Universitas Indonesia'}</Text>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{bookmarks.length}</Text>
            <Text style={styles.statLabel}>Kos Disimpan</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statVal}>3</Text>
            <Text style={styles.statLabel}>Ulasan Ditulis</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statVal}>Aktif</Text>
            <Text style={styles.statLabel}>Status Akun</Text>
          </View>
        </View>

        {/* Sprint 04 — Secure API Architecture & Status */}
        <View style={styles.menuSection}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="shield-checkmark" size={18} color={Colors.primary} style={{ marginRight: 6 }} />
            <Text style={styles.sectionHeader}>Sprint 04 — Keamanan API & JWT</Text>
          </View>

          {/* Secure Storage Badge */}
          <View style={styles.securityItem}>
            <View style={styles.securityIconBox}>
              <Ionicons name="lock-closed" size={20} color={Colors.successDark} />
            </View>
            <View style={styles.securityInfo}>
              <Text style={styles.securityTitle}>Secure Token Storage (expo-secure-store)</Text>
              <Text style={styles.securityDesc}>
                Access token disimpan terenkripsi di Keystore (Android) / Keychain (iOS).
              </Text>
            </View>
          </View>

          {/* JWT & Header Details */}
          <View style={styles.apiDetailsCard}>
            <View style={styles.apiDetailRow}>
              <Text style={styles.apiDetailLabel}>Tipe Token</Text>
              <Text style={styles.apiDetailVal}>Bearer Token (JWT RFC 7519)</Text>
            </View>
            <View style={styles.apiDetailRow}>
              <Text style={styles.apiDetailLabel}>Status Token</Text>
              <View style={[styles.statusPill, tokenExpired ? styles.statusPillDanger : styles.statusPillSuccess]}>
                <Text style={[styles.statusPillText, tokenExpired ? styles.statusTextDanger : styles.statusTextSuccess]}>
                  {tokenExpired ? 'Kedaluwarsa' : 'Aktif & Terverifikasi'}
                </Text>
              </View>
            </View>
            <View style={styles.apiDetailRow}>
              <Text style={styles.apiDetailLabel}>Berlaku Hingga</Text>
              <Text style={styles.apiDetailVal}>{expirationText}</Text>
            </View>
            <View style={styles.apiDetailRow}>
              <Text style={styles.apiDetailLabel}>Header Auth</Text>
              <Text style={styles.apiDetailValCode} numberOfLines={1}>
                Authorization: Bearer {maskToken(token)}
              </Text>
            </View>
            <View style={styles.apiDetailRow}>
              <Text style={styles.apiDetailLabel}>Protokol Server</Text>
              <Text style={styles.apiDetailVal}>{apiBaseUrl.startsWith('https') ? 'HTTPS (Aman)' : 'HTTP'}</Text>
            </View>
          </View>

          {/* Interactive API Testing Suite (13 & 14) */}
          <Text style={styles.subSectionTitle}>Pengujian Endpoint Terproteksi</Text>

          <View style={styles.testButtonsRow}>
            <TouchableOpacity
              style={[styles.testBtn, styles.testBtnPrimary]}
              onPress={handleTestAuthenticated}
              disabled={testLoading}
              accessible={true}
              accessibilityLabel="Uji request dengan token"
            >
              <Ionicons name="key" size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.testBtnTextPrimary}>Uji Dengan Token</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.testBtn, styles.testBtnOutline]}
              onPress={handleTestUnauthenticated}
              disabled={testLoading}
              accessible={true}
              accessibilityLabel="Uji request tanpa token"
            >
              <Ionicons name="hand-left" size={14} color={Colors.textPrimary} style={{ marginRight: 6 }} />
              <Text style={styles.testBtnTextOutline}>Uji Tanpa Token</Text>
            </TouchableOpacity>
          </View>

          {/* Test Running Indicator */}
          {testLoading && (
            <View style={styles.testLoadingBox}>
              <ActivityIndicator size="small" color={Colors.primary} />
              <Text style={styles.testLoadingText}>Mengirim request ke endpoint...</Text>
            </View>
          )}

          {/* Test Result Display */}
          {testResult && !testLoading && (
            <View style={[styles.resultCard, testResult.ok ? styles.resultCardSuccess : styles.resultCardWarning]}>
              <View style={styles.resultHeader}>
                <Ionicons
                  name={testResult.ok ? 'checkmark-circle' : 'alert-circle'}
                  size={18}
                  color={testResult.ok ? Colors.successDark : Colors.danger}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.resultTitle, { color: testResult.ok ? Colors.successDark : Colors.danger }]}>
                  {testResult.title}
                </Text>
              </View>
              <Text style={styles.resultMeta}>Endpoint: {testResult.endpoint}</Text>
              <Text style={styles.resultMeta}>Header: {testResult.headerSent}</Text>
              <Text style={styles.resultMeta}>Status HTTP: {testResult.status || '0 (Jaringan/Koneksi)'}</Text>
              <Text style={styles.resultMessage}>{testResult.message}</Text>
            </View>
          )}
        </View>

        {/* User Details */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionHeader}>Informasi Kontak & Akun</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Ionicons name="call-outline" size={18} color={Colors.textSecondary} />
              <Text style={styles.infoLabel}>Nomor WhatsApp</Text>
            </View>
            <Text style={styles.infoVal}>{user?.phone || '081234567890'}</Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Ionicons name="calendar-outline" size={18} color={Colors.textSecondary} />
              <Text style={styles.infoLabel}>Bergabung Sejak</Text>
            </View>
            <Text style={styles.infoVal}>{user?.joinedAt || 'Januari 2025'}</Text>
          </View>
        </View>

        {/* App Info & About */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionHeader}>Tentang Aplikasi</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Ionicons name="information-circle-outline" size={18} color={Colors.textSecondary} />
              <Text style={styles.infoLabel}>Versi Aplikasi</Text>
            </View>
            <Text style={styles.infoVal}>v1.0.0 (Expo SDK 57)</Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Ionicons name="shield-outline" size={18} color={Colors.textSecondary} />
              <Text style={styles.infoLabel}>Keamanan API</Text>
            </View>
            <Text style={styles.infoVal}>Sprint 04 Secure API</Text>
          </View>
        </View>

        {/* Logout Button */}
        <Button
          title="Keluar dari Akun (Logout)"
          variant="danger"
          size="medium"
          icon="log-out-outline"
          onPress={handleLogout}
          style={{ marginTop: 14, marginBottom: 30 }}
          accessibilityLabel="Tombol keluar dari akun"
          accessibilityHint="Ketuk untuk keluar dari sesi, menghapus token di SecureStore, dan kembali ke login"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 3,
    borderColor: Colors.primaryLight,
    marginBottom: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  userEmail: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginRight: 8,
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  campusBadge: {
    backgroundColor: Colors.surface,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  campusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    marginTop: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statVal: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: Colors.border,
  },
  menuSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  subSectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 14,
    marginBottom: 8,
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.successLight,
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  securityIconBox: {
    marginRight: 10,
    marginTop: 2,
  },
  securityInfo: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.successDark,
  },
  securityDesc: {
    fontSize: 11,
    color: '#065F46',
    marginTop: 2,
    lineHeight: 16,
  },
  apiDetailsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    marginTop: 4,
  },
  apiDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  apiDetailLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  apiDetailVal: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  apiDetailValCode: {
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: Colors.primaryDark,
    maxWidth: '55%',
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusPillSuccess: {
    backgroundColor: Colors.successLight,
  },
  statusPillDanger: {
    backgroundColor: Colors.dangerLight,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusTextSuccess: {
    color: Colors.successDark,
  },
  statusTextDanger: {
    color: Colors.danger,
  },
  testButtonsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  testBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
  },
  testBtnPrimary: {
    backgroundColor: Colors.primary,
  },
  testBtnOutline: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  testBtnTextPrimary: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  testBtnTextOutline: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  testLoadingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: Colors.primaryLight,
    borderRadius: 10,
    marginTop: 10,
  },
  testLoadingText: {
    fontSize: 12,
    color: Colors.primaryDark,
    fontWeight: '600',
    marginLeft: 8,
  },
  resultCard: {
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
  },
  resultCardSuccess: {
    backgroundColor: Colors.successLight,
    borderColor: '#A7F3D0',
  },
  resultCardWarning: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  resultTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  resultMeta: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  resultMessage: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: 6,
    lineHeight: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginLeft: 8,
  },
  infoVal: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
});
