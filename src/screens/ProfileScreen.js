import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useBookmark } from '../context/BookmarkContext';

export const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const { bookmarks } = useBookmark();

  const handleLogout = () => {
    Alert.alert(
      'Keluar dari Akun',
      'Apakah Anda yakin ingin keluar dari aplikasi CariKostan?',
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

        {/* Security & SecureStorage Status */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionHeader}>Keamanan & Penyimpanan Kredensial</Text>
          <View style={styles.securityItem}>
            <View style={styles.securityIconBox}>
              <Ionicons name="shield-checkmark" size={22} color={Colors.successDark} />
            </View>
            <View style={styles.securityInfo}>
              <Text style={styles.securityTitle}>Enkripsi Hardware (SecureStore)</Text>
              <Text style={styles.securityDesc}>
                Token sesi & kredensial akun tersimpan aman di Keystore/Keychain perangkat via expo-secure-store.
              </Text>
            </View>
          </View>
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
              <Ionicons name="heart-outline" size={18} color={Colors.textSecondary} />
              <Text style={styles.infoLabel}>Misi CariKostan</Text>
            </View>
            <Text style={styles.infoVal}>Ulasan Jujur Mahasiswa</Text>
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
          accessibilityHint="Ketuk untuk keluar dari sesi dan kembali ke halaman login"
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
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.successLight,
    padding: 12,
    borderRadius: 12,
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
