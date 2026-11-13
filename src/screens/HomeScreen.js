import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { CardKos } from '../components/CardKos';
import { FilterBadge } from '../components/FilterBadge';
import { LoadingStateView } from '../components/LoadingStateView';
import { ErrorStateView } from '../components/ErrorStateView';
import { TestModeController } from '../components/TestModeController';
import { CITIES, KOST_TYPES, POPULAR_FACILITIES } from '../data/mockKost';
import { useAuth } from '../context/AuthContext';
import { fetchDashboardWidgetsParallel } from '../services/kostService';

/**
 * HOMESCREEN CARIKOST
 * Memenuhi seluruh spesifikasi:
 * 1. React Native + Expo, functional component, useState, useEffect, async/await
 * 2. FlatList untuk menampilkan daftar kost (Nama, Lokasi, Harga, Fasilitas, Status Tersedia/Penuh)
 * 4. Tiga state terpisah: loading, data, error dengan pola try..catch..finally
 * 5. Error handling lengkap (Loading, Success, HTTP 4xx/5xx, Network/Offline, Timeout, Empty State, Retry)
 * 6. Eksekusi paralel multi-widget (Kost + Promo + Notifikasi) menggunakan Promise.allSettled()
 * 7. Dilengkapi TestModeController untuk pengujian langsung di HP fisik via Expo Go
 */
export const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();

  // 4. Tiga state utama dikelola terpisah
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    kosts: [],
    promos: [],
    notifications: [],
  });
  const [error, setError] = useState(null);

  // Widget statuses from Promise.allSettled()
  const [widgetStatus, setWidgetStatus] = useState({
    kosts: 'idle',
    promos: 'idle',
    notifications: 'idle',
    durationMs: 0,
  });

  // 7. Test Mode Simulator: 'normal' | 'offline' | 'http_500' | 'http_404' | 'timeout' | 'empty'
  const [testMode, setTestMode] = useState('normal');

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Semua Kota');
  const [selectedType, setSelectedType] = useState('Semua Tipe');
  const [activeFacilities, setActiveFacilities] = useState([]);

  const toggleFacility = (id) => {
    if (activeFacilities.includes(id)) {
      setActiveFacilities(activeFacilities.filter((f) => f !== id));
    } else {
      setActiveFacilities([...activeFacilities, id]);
    }
  };

  /**
   * 4 & 6. Pola fetchData wajib dengan Promise.allSettled()
   */
  const fetchData = useCallback(async (overrideMode = null) => {
    const currentSimMode = overrideMode || testMode;
    setLoading(true);
    setError(null);

    try {
      // 6. Paralel execution: fetch kosts, promos, notifications concurrently
      const result = await fetchDashboardWidgetsParallel({
        kostMode: currentSimMode,
        promoMode: 'normal',
        notifMode: 'normal',
      });

      setWidgetStatus({
        kosts: result.kosts.status,
        promos: result.promos.status,
        notifications: result.notifications.status,
        durationMs: result.durationMs,
      });

      // Check if kost widget rejected
      if (result.kosts.status === 'rejected') {
        throw result.kosts.error;
      }

      setData({
        kosts: result.kosts.data || [],
        promos: result.promos.data || [],
        notifications: result.notifications.data || [],
      });
    } catch (err) {
      // Tangani error secara komprehensif
      setError(err);
      setData((prev) => ({
        ...prev,
        kosts: [],
      }));
    } finally {
      setLoading(false);
    }
  }, [testMode]);

  // Initial fetch on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle mode change from evaluator toolbar
  const handleSelectTestMode = (mode) => {
    setTestMode(mode);
    fetchData(mode);
  };

  // Filter kosts based on search and filters
  const filteredKosts = useMemo(() => {
    if (!data.kosts || data.kosts.length === 0) return [];

    return data.kosts.filter((item) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name?.toLowerCase().includes(q);
        const matchesArea = item.area?.toLowerCase().includes(q);
        const matchesAddress = item.address?.toLowerCase().includes(q);
        if (!matchesName && !matchesArea && !matchesAddress) return false;
      }

      // City filter
      if (selectedCity !== 'Semua Kota' && item.city !== selectedCity) {
        return false;
      }

      // Type filter
      if (selectedType !== 'Semua Tipe' && item.type !== selectedType) {
        return false;
      }

      // Facility filter
      if (activeFacilities.length > 0) {
        const itemFacIds = (item.facilities || []).map((f) => (typeof f === 'string' ? f : f.id));
        const hasAllFacilities = activeFacilities.every((facId) => itemFacIds.includes(facId));
        if (!hasAllFacilities) return false;
      }

      return true;
    });
  }, [data.kosts, searchQuery, selectedCity, selectedType, activeFacilities]);

  // List Header Component
  const renderHeader = () => {
    return (
      <View>
        {/* User Greeting & Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <View style={styles.userRoleBadge}>
              <Ionicons name="sparkles" size={12} color={Colors.primary} style={{ marginRight: 4 }} />
              <Text style={styles.userRoleText}>
                {user?.role || 'Mahasiswa'} • {user?.campus || 'Pencari Kos'}
              </Text>
            </View>
            <Text style={styles.greetingText}>
              Halo, {user?.name?.split(' ')[0] || 'Kawan'} 👋
            </Text>
            <Text style={styles.subGreeting}>
              Temukan kosan idaman dengan review jujur & transparan
            </Text>
          </View>

          <TouchableOpacity
            style={styles.avatarButton}
            onPress={() => navigation.navigate('ProfileTab')}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Buka profil pengguna"
          >
            <Image
              source={{
                uri:
                  user?.avatar ||
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
              }}
              style={styles.avatarImage}
            />
          </TouchableOpacity>
        </View>

        {/* 7. Evaluator Toolbar: Test all 5 scenarios on phone */}
        <TestModeController currentMode={testMode} onSelectMode={handleSelectTestMode} />

        {/* Parallel Status Indicator Badge */}
        {widgetStatus.durationMs > 0 && (
          <View style={styles.parallelBanner}>
            <Ionicons name="git-compare-outline" size={14} color={Colors.primaryDark} style={{ marginRight: 6 }} />
            <Text style={styles.parallelBannerText}>
              Parallel Fetch (Promise.allSettled): Kost [{widgetStatus.kosts}], Promo [{widgetStatus.promos}], Notif [{widgetStatus.notifications}] ({widgetStatus.durationMs}ms)
            </Text>
          </View>
        )}

        {/* 6. Multi-Widget 1: Notifikasi Pengguna (Fetched in parallel) */}
        {data.notifications && data.notifications.length > 0 && (
          <View style={styles.widgetBox}>
            <View style={styles.widgetHeaderRow}>
              <View style={styles.widgetTitleLeft}>
                <Ionicons name="notifications-outline" size={16} color={Colors.primary} />
                <Text style={styles.widgetTitle}>Info Kampus & Jadwal Survey</Text>
              </View>
              <View style={[styles.settledBadge, { backgroundColor: Colors.successLight }]}>
                <Text style={[styles.settledBadgeText, { color: Colors.successDark }]}>Fulfilled</Text>
              </View>
            </View>
            <View style={styles.notificationCard}>
              <Ionicons name="megaphone" size={18} color="#D97706" style={{ marginRight: 10 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.notifTitle}>{data.notifications[0].title}</Text>
                <Text style={styles.notifMessage}>{data.notifications[0].message}</Text>
              </View>
            </View>
          </View>
        )}

        {/* 6. Multi-Widget 2: Promo Mahasiswa (Fetched in parallel) */}
        {data.promos && data.promos.length > 0 && (
          <View style={styles.widgetBox}>
            <View style={styles.widgetHeaderRow}>
              <View style={styles.widgetTitleLeft}>
                <Ionicons name="pricetag-outline" size={16} color="#D97706" />
                <Text style={styles.widgetTitle}>Promo Khusus Mahasiswa</Text>
              </View>
              <View style={[styles.settledBadge, { backgroundColor: Colors.successLight }]}>
                <Text style={[styles.settledBadgeText, { color: Colors.successDark }]}>Fulfilled</Text>
              </View>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.promosScroll}>
              {data.promos.map((pr) => (
                <View key={pr.id} style={styles.promoCard}>
                  <View style={styles.promoBadge}>
                    <Text style={styles.promoBadgeText}>{pr.badge}</Text>
                  </View>
                  <Text style={styles.promoTitle}>{pr.title}</Text>
                  <Text style={styles.promoDiscount}>{pr.discount}</Text>
                  <Text style={styles.promoDesc}>{pr.description}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Search Bar & Filter shortcut */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color={Colors.textMuted} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Cari daerah, nama kos, atau sekitar kampus..."
              placeholderTextColor={Colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              accessible={true}
              accessibilityRole="search"
              accessibilityLabel="Cari nama kos atau lokasi kampus"
            />
            {searchQuery ? (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Hapus pencarian"
              >
                <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
              </TouchableOpacity>
            ) : null}
          </View>

          <TouchableOpacity
            style={styles.filterIconButton}
            onPress={() => navigation.navigate('SearchFilter')}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Buka filter spesifikasi kosan lengkap"
            accessibilityHint="Ketuk untuk mengatur filter jam malam, aturan tamu, dan harga"
          >
            <Ionicons name="options-outline" size={22} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* City Filter Pills */}
        <View style={styles.filterSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsScroll}>
            {CITIES.map((city) => (
              <FilterBadge
                key={city}
                label={city}
                active={selectedCity === city}
                onPress={() => setSelectedCity(city)}
                size="small"
              />
            ))}
          </ScrollView>
        </View>

        {/* Gender / Kos Type Pills */}
        <View style={[styles.filterSection, { marginTop: 4 }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsScroll}>
            {KOST_TYPES.map((type) => (
              <FilterBadge
                key={type}
                label={type}
                active={selectedType === type}
                onPress={() => setSelectedType(type)}
                size="small"
              />
            ))}
          </ScrollView>
        </View>

        {/* Quick Facility Toggles */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Fasilitas Wajib Pilihan</Text>
          <Text style={styles.sectionSubtitle}>Ketuk untuk menyaring fasilitas prioritas Anda</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.facilityScroll}
        >
          {POPULAR_FACILITIES.map((fac) => (
            <FilterBadge
              key={fac.id}
              label={fac.label}
              icon={fac.icon}
              active={activeFacilities.includes(fac.id)}
              onPress={() => toggleFacility(fac.id)}
              size="medium"
            />
          ))}
        </ScrollView>

        {/* Section Title for FlatList items */}
        <View style={[styles.sectionHeader, { marginTop: 16 }]}>
          <View>
            <Text style={styles.sectionTitle}>Daftar Kosan Terverifikasi</Text>
            <Text style={styles.sectionSubtitle}>
              Menampilkan {filteredKosts.length} kosan dari API
            </Text>
          </View>
          {(selectedCity !== 'Semua Kota' ||
            selectedType !== 'Semua Tipe' ||
            activeFacilities.length > 0 ||
            searchQuery !== '') && (
            <TouchableOpacity
              onPress={() => {
                setSelectedCity('Semua Kota');
                setSelectedType('Semua Tipe');
                setActiveFacilities([]);
                setSearchQuery('');
              }}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Reset semua filter pencarian"
            >
              <Text style={styles.resetFilterText}>Reset Filter</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  // 2. Render each kost in FlatList
  const renderKostItem = ({ item }) => {
    return (
      <CardKos
        kost={item}
        onPress={() => navigation.navigate('DetailKost', { kost: item })}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 2. FlatList implementation */}
      <FlatList
        data={loading ? [] : filteredKosts}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderKostItem}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.flatListContent}
        showsVerticalScrollIndicator={false}
        // 5. Retry Mechanism via pull-to-refresh
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => fetchData()}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        // 5. Error & Empty States Handling
        ListFooterComponent={() => {
          // Loading state
          if (loading) {
            return <LoadingStateView message="Memuat data kost... Mohon tunggu sebentar." />;
          }

          // Error states (HTTP 4xx/5xx, Offline, Timeout, Network Error)
          if (error) {
            return (
              <ErrorStateView
                error={error}
                onRetry={() => {
                  setTestMode('normal');
                  fetchData('normal');
                }}
                retryLabel="Coba Lagi"
              />
            );
          }

          // Empty state: API returned [] or filtered to 0
          if (!loading && filteredKosts.length === 0) {
            return (
              <ErrorStateView
                isEmpty={true}
                emptyMessage="Belum ada kost yang tersedia"
                onRetry={() => {
                  setSelectedCity('Semua Kota');
                  setSelectedType('Semua Tipe');
                  setActiveFacilities([]);
                  setSearchQuery('');
                  setTestMode('normal');
                  fetchData('normal');
                }}
                retryLabel="Muat Ulang Data"
              />
            );
          }

          return null;
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flatListContent: {
    paddingBottom: 28,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  userInfo: {
    flex: 1,
    marginRight: 12,
  },
  userRoleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  userRoleText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  greetingText: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  subGreeting: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  avatarButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  parallelBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    marginHorizontal: 16,
    marginVertical: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  parallelBannerText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primaryDark,
    flex: 1,
  },
  widgetBox: {
    marginHorizontal: 16,
    marginVertical: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  widgetHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  widgetTitleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  widgetTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginLeft: 6,
  },
  settledBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  settledBadgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    padding: 10,
    borderRadius: 8,
  },
  notifTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
  },
  notifMessage: {
    fontSize: 11,
    color: '#78350F',
    marginTop: 2,
  },
  promosScroll: {
    flexDirection: 'row',
  },
  promoCard: {
    width: 200,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  promoBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  promoBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#15803D',
  },
  promoTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  promoDiscount: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.primary,
    marginTop: 2,
  },
  promoDesc: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 8,
    gap: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: Colors.textPrimary,
    padding: 0,
  },
  filterIconButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterSection: {
    marginBottom: 4,
  },
  pillsScroll: {
    paddingHorizontal: 16,
    gap: 6,
  },
  facilityScroll: {
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 6,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  resetFilterText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
});
