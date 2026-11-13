import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors } from '../theme/colors';

/**
 * 5. ERROR HANDLING — Loading State
 * Tampilkan <ActivityIndicator /> + teks "Memuat data kost... Mohon tunggu sebentar."
 */
export const LoadingStateView = ({ message = 'Memuat data kost... Mohon tunggu sebentar.' }) => {
  return (
    <View style={styles.container} accessible={true} accessibilityRole="progressbar">
      <View style={styles.spinnerCard}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.messageText}>{message}</Text>
        <Text style={styles.subText}>Sinkronisasi server & status ketersediaan</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 48,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinnerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
    maxWidth: 340,
  },
  messageText: {
    marginTop: 16,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 22,
  },
  subText: {
    marginTop: 6,
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
