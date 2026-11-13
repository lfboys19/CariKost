import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import {
  fetchDashboardWidgetsParallel,
  executeBookingFailFast,
  executeSerialDependentFlow,
} from '../services/kostService';

/**
 * 6. ASYNC LAB — EKSEKUSI ASYNC PARALEL & BERURUTAN
 * Memberikan pembuktian interaktif terhadap:
 * 1. Paralel Toleran Error via Promise.allSettled() (Dashboard Multi-Widget)
 * 2. Paralel Fail-Fast via Promise.all() (Booking & Cek Ketersediaan Kamar)
 * 3. Berurutan / Serial Dependent (getUser -> getKost(user.id))
 */
export const AsyncLabScreen = () => {
  const [activeTab, setActiveTab] = useState('allSettled'); // 'allSettled' | 'promiseAll' | 'serial'

  // 1. State Promise.allSettled
  const [settledLoading, setSettledLoading] = useState(false);
  const [simulatePromoFail, setSimulatePromoFail] = useState(false);
  const [settledResult, setSettledResult] = useState(null);

  // 2. State Promise.all
  const [allLoading, setAllLoading] = useState(false);
  const [simulateRoomTaken, setSimulateRoomTaken] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  const [bookingError, setBookingError] = useState(null);

  // 3. State Serial Dependent
  const [serialLoading, setSerialLoading] = useState(false);
  const [serialResult, setSerialResult] = useState(null);

  // Handler: Run Promise.allSettled()
  const runParallelSettled = async () => {
    setSettledLoading(true);
    setSettledResult(null);
    try {
      const res = await fetchDashboardWidgetsParallel({
        kostMode: 'normal',
        promoMode: simulatePromoFail ? 'promo_fail' : 'normal',
        notifMode: 'normal',
      });
      setSettledResult(res);
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setSettledLoading(false);
    }
  };

  // Handler: Run Promise.all()
  const runFailFastBooking = async () => {
    setAllLoading(true);
    setBookingResult(null);
    setBookingError(null);
    try {
      const res = await executeBookingFailFast(
        { kostName: 'Kost Griya Mahasiswa UI', totalAmount: 1450000, studentName: 'Mahasiswa Demo' },
        simulateRoomTaken
      );
      setBookingResult(res);
    } catch (err) {
      setBookingError(err);
      Alert.alert(
        'Transaksi Gagal (All-or-Nothing)',
        `Promise.all() membatalkan seluruh proses karena salah satu syarat gagal:\n\n${err.message}`
      );
    } finally {
      setAllLoading(false);
    }
  };

  // Handler: Run Serial Dependent Flow
  const runSerialFlow = async () => {
    setSerialLoading(true);
    setSerialResult(null);
    try {
      const res = await executeSerialDependentFlow(1);
      setSerialResult(res);
    } catch (err) {
      Alert.alert('Error Serial Flow', err.message);
    } finally {
      setSerialLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.badge}>
            <Ionicons name="git-network-outline" size={14} color={Colors.primary} />
            <Text style={styles.badgeText}>Sprint Evaluasi Async</Text>
          </View>
          <Text style={styles.title}>Laboratorium Async</Text>
          <Text style={styles.subtitle}>
            Pengujian Eksekusi Paralel (Promise.all & allSettled) vs Berurutan (Serial)
          </Text>
        </View>

        {/* Tab Selection */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'allSettled' && styles.tabButtonActive]}
            onPress={() => setActiveTab('allSettled')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'allSettled' && styles.tabButtonTextActive]}>
              Promise.allSettled
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'promiseAll' && styles.tabButtonActive]}
            onPress={() => setActiveTab('promiseAll')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'promiseAll' && styles.tabButtonTextActive]}>
              Promise.all
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'serial' && styles.tabButtonActive]}
            onPress={() => setActiveTab('serial')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'serial' && styles.tabButtonTextActive]}>
              Serial Flow
            </Text>
          </TouchableOpacity>
        </View>

        {/* 1. SECTION: Promise.allSettled() */}
        {activeTab === 'allSettled' && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconCircle, { backgroundColor: Colors.successLight }]}>
                <Ionicons name="layers-outline" size={20} color={Colors.successDark} />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.cardTitle}>Promise.allSettled() — Resilient</Text>
                <Text style={styles.cardSub}>
                  Dashboard multi-widget (Kost + Promo + Notifikasi). Toleran error.
                </Text>
              </View>
            </View>

            <Text style={styles.explanationText}>
              Ketika mengambil 3 widget secara bersamaan, jika salah satu widget gagal (misal server promo down),
              widget lainnya tetap dapat ditampilkan tanpa menggagalkan seluruh dashboard.
            </Text>

            {/* Simulation toggle */}
            <TouchableOpacity
              style={[styles.toggleBox, simulatePromoFail && styles.toggleBoxActive]}
              onPress={() => setSimulatePromoFail(!simulatePromoFail)}
            >
              <Ionicons
                name={simulatePromoFail ? 'checkbox' : 'square-outline'}
                size={20}
                color={simulatePromoFail ? Colors.danger : Colors.textSecondary}
              />
              <Text style={styles.toggleBoxText}>
                Simulasikan Server Promo Gagal (Rejected)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={runParallelSettled}
              disabled={settledLoading}
            >
              {settledLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Ionicons name="play" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.actionBtnText}>Jalankan Fetch Paralel 3 Widget</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Results display */}
            {settledResult && (
              <View style={styles.resultsContainer}>
                <Text style={styles.resultSummary}>
                  Selesai dalam {settledResult.durationMs} ms (Paralel bersamaan)
                </Text>

                {/* Kost Widget */}
                <View style={styles.widgetResultRow}>
                  <Text style={styles.widgetName}>1. Daftar Kost</Text>
                  <View style={[styles.statusChip, { backgroundColor: Colors.successLight }]}>
                    <Text style={[styles.statusChipText, { color: Colors.successDark }]}>
                      {settledResult.kosts.status.toUpperCase()} ({settledResult.kosts.data.length} item)
                    </Text>
                  </View>
                </View>

                {/* Promo Widget */}
                <View style={styles.widgetResultRow}>
                  <Text style={styles.widgetName}>2. Promo Mahasiswa</Text>
                  <View
                    style={[
                      styles.statusChip,
                      {
                        backgroundColor:
                          settledResult.promos.status === 'fulfilled'
                            ? Colors.successLight
                            : Colors.dangerLight,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusChipText,
                        {
                          color:
                            settledResult.promos.status === 'fulfilled'
                              ? Colors.successDark
                              : Colors.dangerDark,
                        },
                      ]}
                    >
                      {settledResult.promos.status.toUpperCase()}{' '}
                      {settledResult.promos.status === 'fulfilled'
                        ? `(${settledResult.promos.data.length} promo)`
                        : '(Error ditoleransi)'}
                    </Text>
                  </View>
                </View>

                {/* Notif Widget */}
                <View style={styles.widgetResultRow}>
                  <Text style={styles.widgetName}>3. Notifikasi Pengguna</Text>
                  <View style={[styles.statusChip, { backgroundColor: Colors.successLight }]}>
                    <Text style={[styles.statusChipText, { color: Colors.successDark }]}>
                      {settledResult.notifications.status.toUpperCase()} ({settledResult.notifications.data.length} pesan)
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        )}

        {/* 2. SECTION: Promise.all() */}
        {activeTab === 'promiseAll' && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconCircle, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="flash-outline" size={20} color="#D97706" />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.cardTitle}>Promise.all() — Fail-Fast</Text>
                <Text style={styles.cardSub}>
                  Booking Kost & Ketersediaan Kamar. Sifat: All or Nothing.
                </Text>
              </View>
            </View>

            <Text style={styles.explanationText}>
              Untuk transaksi finansial & booking kamar, kedua proses (cek ketersediaan + cetak order)
              wajib sukses 100%. Jika ketersediaan kamar gagal, seluruh proses dibatalkan seketika.
            </Text>

            {/* Simulation toggle */}
            <TouchableOpacity
              style={[styles.toggleBox, simulateRoomTaken && styles.toggleBoxActive]}
              onPress={() => setSimulateRoomTaken(!simulateRoomTaken)}
            >
              <Ionicons
                name={simulateRoomTaken ? 'checkbox' : 'square-outline'}
                size={20}
                color={simulateRoomTaken ? Colors.danger : Colors.textSecondary}
              />
              <Text style={styles.toggleBoxText}>
                Simulasikan Kamar Penuh / Sudah Dipesan Orang Lain
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: '#D97706' }]}
              onPress={runFailFastBooking}
              disabled={allLoading}
            >
              {allLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Ionicons name="card-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.actionBtnText}>Proses Transaksi Booking (Promise.all)</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Success display */}
            {bookingResult && (
              <View style={[styles.resultsContainer, { backgroundColor: Colors.successLight }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                  <Ionicons name="checkmark-circle" size={18} color={Colors.successDark} />
                  <Text style={[styles.resultSummary, { color: Colors.successDark, marginLeft: 6 }]}>
                    Booking Berhasil Dikonfirmasi!
                  </Text>
                </View>
                <Text style={styles.detailCodeText}>Order ID: {bookingResult.order.bookingId}</Text>
                <Text style={styles.detailCodeText}>Kamar: {bookingResult.availability.roomId} (Terkunci)</Text>
                <Text style={styles.detailCodeText}>Status: {bookingResult.order.status}</Text>
              </View>
            )}

            {/* Error display */}
            {bookingError && (
              <View style={[styles.resultsContainer, { backgroundColor: Colors.dangerLight }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                  <Ionicons name="close-circle" size={18} color={Colors.dangerDark} />
                  <Text style={[styles.resultSummary, { color: Colors.dangerDark, marginLeft: 6 }]}>
                    Transaksi Dibatalkan (Fail-Fast Aktif)
                  </Text>
                </View>
                <Text style={[styles.detailCodeText, { color: Colors.dangerDark }]}>
                  Alasan: {bookingError.message}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* 3. SECTION: Serial / Dependent Flow */}
        {activeTab === 'serial' && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconCircle, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="swap-vertical-outline" size={20} color="#2563EB" />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.cardTitle}>Berurutan (Serial / Dependent)</Text>
                <Text style={styles.cardSub}>
                  Data ke-2 membutuhkan ID dari data ke-1 (getUser {'->'} getKost(user.id)).
                </Text>
              </View>
            </View>

            <Text style={styles.explanationText}>
              Pola dependency: Request profil user dijalankan terlebih dahulu, setelah ID didapatkan,
              request rekomendasi kost baru dieksekusi secara berurutan.
            </Text>

            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: '#2563EB' }]}
              onPress={runSerialFlow}
              disabled={serialLoading}
            >
              {serialLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Ionicons name="play" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.actionBtnText}>Jalankan Flow Berurutan</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Results display */}
            {serialResult && (
              <View style={styles.resultsContainer}>
                <Text style={styles.resultSummary}>
                  Total Waktu Serial: {serialResult.totalDurationMs} ms
                </Text>
                {serialResult.timeline.map((step, idx) => (
                  <View key={idx} style={styles.timelineRow}>
                    <View style={styles.timelineNumber}>
                      <Text style={styles.timelineNumberText}>{step.step}</Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: 8 }}>
                      <Text style={styles.timelineActionText}>{step.action}</Text>
                      {step.durationMs && (
                        <Text style={styles.timelineDurationText}>Durasi: {step.durationMs} ms</Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
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
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 16,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primaryDark,
    marginLeft: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 10,
    padding: 3,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  tabButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tabButtonTextActive: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  cardSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  explanationText: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 14,
  },
  toggleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 14,
  },
  toggleBoxActive: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  toggleBoxText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginLeft: 8,
    flex: 1,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  resultsContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginTop: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  resultSummary: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  widgetResultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  widgetName: {
    fontSize: 12,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  statusChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  detailCodeText: {
    fontSize: 12,
    color: Colors.textPrimary,
    fontWeight: '500',
    marginTop: 2,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  timelineNumber: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineNumberText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  timelineActionText: {
    fontSize: 12,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  timelineDurationText: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 1,
  },
});
