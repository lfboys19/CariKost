import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { CardKos } from '../components/CardKos';
import { FilterBadge } from '../components/FilterBadge';
import { MOCK_KOSTS, CITIES, KOST_TYPES, POPULAR_FACILITIES } from '../data/mockKost';
import { useAuth } from '../context/AuthContext';

export const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();

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

  const filteredKosts = useMemo(() => {
    return MOCK_KOSTS.filter((item) => {
      // Query search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesArea = item.area.toLowerCase().includes(q);
        const matchesAddress = item.address.toLowerCase().includes(q);
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
        const itemFacIds = item.facilities.map((f) => f.id);
        const hasAllFacilities = activeFacilities.every((facId) =>
          itemFacIds.includes(facId)
        );
        if (!hasAllFacilities) return false;
      }

      return true;
    });
  }, [searchQuery, selectedCity, selectedType, activeFacilities]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Top Student Header */}
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
            onPress={() => navigation.navigate('SearchTab')}
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

        {/* Student Educational Banner */}
        <View style={styles.bannerContainer}>
          <View style={styles.bannerBadge}>
            <Ionicons name="shield-checkmark" size={16} color="#059669" />
            <Text style={styles.bannerBadgeText}>Tips Cari Kos Jujur</Text>
          </View>
          <Text style={styles.bannerTitle}>
            Waspada Foto Editan Pemilik Kos!
          </Text>
          <Text style={styles.bannerSubtitle}>
            Gunakan tab "Foto Real Penghuni" di setiap halaman kos untuk melihat kondisi kamar mandi, dapur, & saluran air yang sebenarnya.
          </Text>
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

        {/* Horizontal Section: Featured Kos */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Rekomendasi Terpopuler 🔥</Text>
            <Text style={styles.sectionSubtitle}>Paling diminati mahasiswa baru & lama</Text>
          </View>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalCardScroll}
        >
          {MOCK_KOSTS.slice(0, 3).map((item) => (
            <CardKos
              key={item.id}
              kost={item}
              horizontal={true}
              onPress={() => navigation.navigate('DetailKost', { kost: item })}
            />
          ))}
        </ScrollView>

        {/* Vertical Section: All Filtered Kosts */}
        <View style={[styles.sectionHeader, { marginTop: 12 }]}>
          <View>
            <Text style={styles.sectionTitle}>Daftar Kosan Terverifikasi</Text>
            <Text style={styles.sectionSubtitle}>
              Menampilkan {filteredKosts.length} kosan sesuai filter
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

        <View style={styles.cardsVerticalList}>
          {filteredKosts.length > 0 ? (
            filteredKosts.map((item) => (
              <CardKos
                key={item.id}
                kost={item}
                onPress={() => navigation.navigate('DetailKost', { kost: item })}
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="search" size={48} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>Kosan Tidak Ditemukan</Text>
              <Text style={styles.emptySubtitle}>
                Coba ubah kata kunci atau longgarkan filter kota dan fasilitas untuk menemukan kos yang cocok.
              </Text>
              <TouchableOpacity
                style={styles.emptyResetBtn}
                onPress={() => {
                  setSelectedCity('Semua Kota');
                  setSelectedType('Semua Tipe');
                  setActiveFacilities([]);
                  setSearchQuery('');
                }}
              >
                <Text style={styles.emptyResetText}>Reset Semua Filter</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
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
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 18,
  },
  avatarButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: Colors.primary,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 6,
    marginBottom: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  filterIconButton: {
    width: 48,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  filterSection: {
    marginBottom: 4,
  },
  pillsScroll: {
    paddingHorizontal: 20,
  },
  bannerContainer: {
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 14,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 16,
    padding: 14,
  },
  bannerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  bannerBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065F46',
    marginLeft: 6,
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#064E3B',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 12,
    color: '#047857',
    lineHeight: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 10,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  resetFilterText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  facilityScroll: {
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  horizontalCardScroll: {
    paddingLeft: 20,
    paddingRight: 6,
    marginBottom: 16,
  },
  cardsVerticalList: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 12,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  emptyResetBtn: {
    backgroundColor: Colors.primaryLight,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  emptyResetText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
});
