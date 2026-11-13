import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

/**
 * 7. PENGUJIAN EVALUASI EXPO GO (HP Fisik)
 * Toolbar interaktif untuk menguji 5 kondisi evaluasi:
 * 1. Online Normal (live API)
 * 2. Offline (Koneksi terputus)
 * 3. HTTP Error 500 / 404 (Server/Client error)
 * 4. Timeout (AbortController > 5s)
 * 5. Data Kosong ([])
 */
export const TestModeController = ({ currentMode, onSelectMode }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const testModes = [
    { id: 'normal', label: 'Online Normal', icon: 'globe-outline', color: Colors.primary },
    { id: 'offline', label: 'Offline / Putus', icon: 'cloud-offline-outline', color: Colors.danger },
    { id: 'http_500', label: 'Error 500', icon: 'server-outline', color: '#DC2626' },
    { id: 'http_404', label: 'Error 404', icon: 'alert-circle-outline', color: '#D97706' },
    { id: 'timeout', label: 'Timeout > 5s', icon: 'timer-outline', color: Colors.warning },
    { id: 'empty', label: 'Data Kosong', icon: 'folder-open-outline', color: Colors.textSecondary },
  ];

  return (
    <View style={styles.container}>
      {/* Collapsible header */}
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Toggle panel pengujian evaluasi Expo Go"
      >
        <View style={styles.headerLeft}>
          <View style={styles.badgePulse}>
            <Ionicons name="flask" size={14} color="#FFFFFF" />
          </View>
          <Text style={styles.headerTitle}>Mode Uji Evaluasi (Expo Go)</Text>
          <View style={[styles.activePill, { backgroundColor: currentMode === 'normal' ? Colors.successLight : Colors.warningLight }]}>
            <Text style={[styles.activePillText, { color: currentMode === 'normal' ? Colors.successDark : Colors.warning }]}>
              {currentMode.toUpperCase()}
            </Text>
          </View>
        </View>
        <Ionicons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={Colors.textSecondary}
        />
      </TouchableOpacity>

      {/* Expanded test button row */}
      {isExpanded && (
        <View style={styles.body}>
          <Text style={styles.instructionText}>
            Pilih kondisi di bawah untuk menguji respons aplikasi secara langsung di HP fisik:
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
            {testModes.map((item) => {
              const isActive = currentMode === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.chip,
                    isActive && { backgroundColor: item.color, borderColor: item.color },
                  ]}
                  onPress={() => {
                    onSelectMode(item.id);
                  }}
                  activeOpacity={0.8}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={`Uji kondisi ${item.label}`}
                >
                  <Ionicons
                    name={item.icon}
                    size={14}
                    color={isActive ? '#FFFFFF' : item.color}
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    style={[
                      styles.chipText,
                      isActive && { color: '#FFFFFF', fontWeight: '700' },
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#F8FAFC',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  badgePulse: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginRight: 8,
  },
  activePill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  activePillText: {
    fontSize: 10,
    fontWeight: '800',
  },
  body: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: '#FFFFFF',
  },
  instructionText: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  chipsScroll: {
    flexDirection: 'row',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
});
