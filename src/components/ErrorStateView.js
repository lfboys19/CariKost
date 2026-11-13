import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

/**
 * 5. ERROR HANDLING VIEW
 * Handles all mandated states:
 * - Offline State: "Tidak ada koneksi internet. Periksa koneksi Anda dan coba lagi." + Coba Lagi
 * - Timeout State: "Waktu permintaan habis. Server terlalu lama merespons." + Coba Lagi
 * - HTTP Error State: "Gagal mengambil data kost. Terjadi kesalahan pada server. Silakan coba lagi." + Coba Lagi
 * - Network Error State: clear non-blank screen + Coba Lagi
 * - Empty State: "Belum ada kost yang tersedia"
 */
export const ErrorStateView = ({
  error,
  isEmpty = false,
  emptyMessage = 'Belum ada kost yang tersedia',
  onRetry,
  retryLabel = 'Coba Lagi',
}) => {
  // Determine error classification
  const isOffline = error?.isOffline || error?.name === 'OfflineError' || error?.message?.includes('Tidak ada koneksi internet');
  const isTimeout = error?.isTimeout || error?.name === 'TimeoutError' || error?.message?.includes('Waktu permintaan habis');
  const isHttpError = error?.isHttpError || error?.status;

  let title = 'Terjadi Kesalahan';
  let message = 'Gagal memuat data kost. Silakan coba lagi.';
  let iconName = 'alert-circle-outline';
  let badgeLabel = 'Error';
  let badgeColor = Colors.danger;
  let badgeBg = Colors.dangerLight;

  if (isEmpty) {
    title = 'Data Kosong';
    message = emptyMessage;
    iconName = 'folder-open-outline';
    badgeLabel = 'Kosong';
    badgeColor = Colors.secondary;
    badgeBg = Colors.secondaryLight;
  } else if (isOffline) {
    title = 'Koneksi Terputus';
    message = 'Tidak ada koneksi internet. Periksa koneksi Anda dan coba lagi.';
    iconName = 'cloud-offline-outline';
    badgeLabel = 'Offline';
    badgeColor = Colors.danger;
    badgeBg = Colors.dangerLight;
  } else if (isTimeout) {
    title = 'Permintaan Timeout';
    message = 'Waktu permintaan habis. Server terlalu lama merespons.';
    iconName = 'timer-outline';
    badgeLabel = 'Timeout';
    badgeColor = Colors.warning;
    badgeBg = Colors.warningLight;
  } else if (isHttpError) {
    title = error?.status === 404 ? 'Data Tidak Ditemukan' : 'Kesalahan Server';
    message = 'Gagal mengambil data kost. Terjadi kesalahan pada server. Silakan coba lagi.';
    iconName = 'server-outline';
    badgeLabel = `HTTP ${error?.status || 500}`;
    badgeColor = Colors.danger;
    badgeBg = Colors.dangerLight;
  } else if (error?.message) {
    message = error.message;
  }

  return (
    <View style={styles.container} accessible={true} accessibilityRole="alert">
      <View style={styles.card}>
        {/* Status Badge */}
        <View style={[styles.badge, { backgroundColor: badgeBg }]}>
          <Text style={[styles.badgeText, { color: badgeColor }]}>{badgeLabel}</Text>
        </View>

        {/* Icon Circle */}
        <View style={[styles.iconCircle, { backgroundColor: badgeBg }]}>
          <Ionicons name={iconName} size={42} color={badgeColor} />
        </View>

        {/* Title & Message */}
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>

        {/* Action / Retry Button */}
        {onRetry && (
          <TouchableOpacity
            style={styles.retryButton}
            onPress={onRetry}
            activeOpacity={0.8}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={retryLabel}
            accessibilityHint="Ketuk untuk melakukan request ulang ke server"
          >
            <Ionicons name="refresh" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.retryButtonText}>{retryLabel}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    width: '100%',
    maxWidth: 360,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 16,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 22,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    minWidth: 160,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
