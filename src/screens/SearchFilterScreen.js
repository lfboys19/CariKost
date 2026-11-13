import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { Input } from '../components/Input';
import { CardKos } from '../components/CardKos';
import { FilterBadge } from '../components/FilterBadge';
import { Button } from '../components/Button';
import {
  MOCK_KOSTS,
  CITIES,
  KOST_TYPES,
  CURFEW_OPTIONS,
  GUEST_RULES,
  POPULAR_FACILITIES,
} from '../data/mockKost';

const PRICE_TIERS = [
  { id: 'all', label: 'Semua Harga', min: 0, max: 99999999 },
  { id: 'budget', label: '< Rp 1 Jt (Hemat)', min: 0, max: 1000000 },
  { id: 'mid', label: 'Rp 1 - 1.5 Jt (Populer)', min: 1000000, max: 1500000 },
  { id: 'upper_mid', label: 'Rp 1.5 - 2 Jt (AC & KM Dalam)', min: 1500000, max: 2000000 },
  { id: 'exclusive', label: '> Rp 2 Jt (Eksklusif)', min: 2000000, max: 99999999 },
];

export const SearchFilterScreen = ({ navigation }) => {
  const [keyword, setKeyword] = useState('');
  const [selectedCity, setSelectedCity] = useState('Semua Kota');
  const [selectedType, setSelectedType] = useState('Semua Tipe');
  const [selectedPriceTier, setSelectedPriceTier] = useState('all');
  const [selectedCurfew, setSelectedCurfew] = useState('Semua Jam Malam');
  const [selectedGuestRule, setSelectedGuestRule] = useState('Semua Aturan Tamu');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [activeFacilities, setActiveFacilities] = useState([]);
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(false);

  const toggleFacility = (id) => {
    if (activeFacilities.includes(id)) {
      setActiveFacilities(activeFacilities.filter((f) => f !== id));
    } else {
      setActiveFacilities([...activeFacilities, id]);
    }
  };

  const resetAllFilters = () => {
    setKeyword('');
    setSelectedCity('Semua Kota');
    setSelectedType('Semua Tipe');
    setSelectedPriceTier('all');
    setSelectedCurfew('Semua Jam Malam');
    setSelectedGuestRule('Semua Aturan Tamu');
    setOnlyAvailable(false);
    setActiveFacilities([]);
  };

  const filteredResults = useMemo(() => {
    return MOCK_KOSTS.filter((item) => {
      // Keyword
      if (keyword.trim()) {
        const q = keyword.toLowerCase();
        const match =
          item.name.toLowerCase().includes(q) ||
          item.area.toLowerCase().includes(q) ||
          item.address.toLowerCase().includes(q) ||
          item.city.toLowerCase().includes(q);
        if (!match) return false;
      }

      // City
      if (selectedCity !== 'Semua Kota' && item.city !== selectedCity) {
        return false;
      }

      // Gender / Type
      if (selectedType !== 'Semua Tipe' && item.type !== selectedType) {
        return false;
      }

      // Price Tier
      const tier = PRICE_TIERS.find((t) => t.id === selectedPriceTier);
      if (tier && (item.priceMonthly < tier.min || item.priceMonthly > tier.max)) {
        return false;
      }

      // Curfew / Jam Malam
      if (selectedCurfew !== 'Semua Jam Malam') {
        if (selectedCurfew === 'Bebas 24 Jam' && !item.curfew.includes('24 Jam')) return false;
        if (selectedCurfew === 'Maks 23:00 WIB' && !item.curfew.includes('23:00')) return false;
        if (selectedCurfew === 'Maks 22:00 WIB' && !item.curfew.includes('22:00')) return false;
      }

      // Guest Rule / Aturan Tamu
      if (selectedGuestRule !== 'Semua Aturan Tamu') {
        if (!item.guestRule.toLowerCase().includes(selectedGuestRule.toLowerCase())) {
          return false;
        }
      }

      // Availability Status
      if (onlyAvailable) {
        if (item.status !== 'Tersedia' || item.availableRooms <= 0) {
          return false;
        }
      }

      // Facilities
      if (activeFacilities.length > 0) {
        const itemFacIds = item.facilities.map((f) => f.id);
        const hasAll = activeFacilities.every((id) => itemFacIds.includes(id));
        if (!hasAll) return false;
      }

      return true;
    });
  }, [
    keyword,
    selectedCity,
    selectedType,
    selectedPriceTier,
    selectedCurfew,
    selectedGuestRule,
    onlyAvailable,
    activeFacilities,
  ]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          {navigation.canGoBack && navigation.canGoBack() ? (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Kembali ke layar sebelumnya"
            >
              <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
            </TouchableOpacity>
          ) : null}
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Filter Spesifikasi Kost</Text>
            <Text style={styles.subtitle}>
              Sesuaikan lokasi, rentang harga, jam malam, dan aturan tamu yang Anda inginkan
            </Text>
          </View>
        </View>

        {/* Search Keyword */}
        <View style={styles.sectionPadding}>
          <Input
            placeholder="Cari nama kos, jalan, atau nama kampus..."
            value={keyword}
            onChangeText={setKeyword}
            leftIcon="search-outline"
            rightIcon={keyword ? 'close-circle' : null}
            onRightIconPress={() => setKeyword('')}
            accessibilityLabel="Pencarian spesifik kosan"
          />
        </View>

        {/* Filter Accordion Header */}
        <TouchableOpacity
          style={styles.filterToggleHeader}
          onPress={() => setIsFilterCollapsed(!isFilterCollapsed)}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Buka atau tutup panel filter lanjutan"
        >
          <View style={styles.filterToggleLeft}>
            <Ionicons name="funnel-outline" size={18} color={Colors.primary} style={{ marginRight: 6 }} />
            <Text style={styles.filterToggleText}>
              {isFilterCollapsed ? 'Tampilkan Kriteria Filter' : 'Sembunyikan Kriteria Filter'}
            </Text>
          </View>
          <Ionicons
            name={isFilterCollapsed ? 'chevron-down' : 'chevron-up'}
            size={18}
            color={Colors.textSecondary}
          />
        </TouchableOpacity>

        {!isFilterCollapsed && (
          <View style={styles.filterPanel}>
            {/* 1. Kota / Lokasi Kampus */}
            <Text style={styles.filterLabel}>1. Kota / Wilayah Kampus</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalChips}>
              {CITIES.map((c) => (
                <FilterBadge
                  key={c}
                  label={c}
                  active={selectedCity === c}
                  onPress={() => setSelectedCity(c)}
                  size="small"
                />
              ))}
            </ScrollView>

            {/* 2. Tipe Penghuni */}
            <Text style={styles.filterLabel}>2. Tipe Penghuni Kos</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalChips}>
              {KOST_TYPES.map((t) => (
                <FilterBadge
                  key={t}
                  label={t}
                  active={selectedType === t}
                  onPress={() => setSelectedType(t)}
                  size="small"
                />
              ))}
            </ScrollView>

            {/* 3. Rentang Harga */}
            <Text style={styles.filterLabel}>3. Rentang Harga Sewa Bulanan</Text>
            <View style={styles.wrapChips}>
              {PRICE_TIERS.map((tier) => (
                <FilterBadge
                  key={tier.id}
                  label={tier.label}
                  active={selectedPriceTier === tier.id}
                  onPress={() => setSelectedPriceTier(tier.id)}
                  size="small"
                />
              ))}
            </View>

            {/* 4. Jam Malam */}
            <Text style={styles.filterLabel}>4. Fleksibilitas Jam Malam</Text>
            <View style={styles.wrapChips}>
              {CURFEW_OPTIONS.map((curfew) => (
                <FilterBadge
                  key={curfew}
                  label={curfew}
                  icon="time-outline"
                  active={selectedCurfew === curfew}
                  onPress={() => setSelectedCurfew(curfew)}
                  size="small"
                />
              ))}
            </View>

            {/* 5. Aturan Membawa Tamu */}
            <Text style={styles.filterLabel}>5. Aturan Membawa Tamu</Text>
            <View style={styles.wrapChips}>
              {GUEST_RULES.map((rule) => (
                <FilterBadge
                  key={rule}
                  label={rule}
                  icon="people-outline"
                  active={selectedGuestRule === rule}
                  onPress={() => setSelectedGuestRule(rule)}
                  size="small"
                />
              ))}
            </View>

            {/* 6. Fasilitas Wajib */}
            <Text style={styles.filterLabel}>6. Fasilitas Utama Wajib</Text>
            <View style={styles.wrapChips}>
              {POPULAR_FACILITIES.map((fac) => (
                <FilterBadge
                  key={fac.id}
                  label={fac.label}
                  icon={fac.icon}
                  active={activeFacilities.includes(fac.id)}
                  onPress={() => toggleFacility(fac.id)}
                  size="small"
                />
              ))}
            </View>

            {/* 7. Ketersediaan Kamar Toggle */}
            <View style={styles.switchRow}>
              <View style={{ flex: 1, marginRight: 12 }}>
                <Text style={styles.switchTitle}>Hanya Kamar Tersedia</Text>
                <Text style={styles.switchSubtitle}>
                  Sembunyikan kos yang saat ini penuh / waiting list
                </Text>
              </View>
              <Switch
                value={onlyAvailable}
                onValueChange={setOnlyAvailable}
                trackColor={{ false: Colors.border, true: Colors.primaryLight }}
                thumbColor={onlyAvailable ? Colors.primary : '#FFFFFF'}
                accessibilityLabel="Hanya tampilkan kos dengan kamar tersedia"
              />
            </View>

            {/* Reset Button */}
            <Button
              title="Reset Semua Kriteria Filter"
              variant="outline"
              size="small"
              icon="refresh-outline"
              onPress={resetAllFilters}
              style={{ marginTop: 12 }}
            />
          </View>
        )}

        {/* Results Header */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            Ditemukan <Text style={{ color: Colors.primary, fontWeight: '800' }}>{filteredResults.length}</Text> Kosan Sesuai Kriteria
          </Text>
        </View>

        {/* Results List */}
        <View style={styles.resultsContainer}>
          {filteredResults.length > 0 ? (
            filteredResults.map((item) => (
              <CardKos
                key={item.id}
                kost={item}
                onPress={() => navigation.navigate('DetailKost', { kost: item })}
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={48} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>Tidak Ada Kosan yang Cocok</Text>
              <Text style={styles.emptySubtitle}>
                Kriteria spesifikasi filter Anda terlalu ketat. Coba ubah rentang harga atau pilih "Semua Jam Malam".
              </Text>
              <Button
                title="Reset Kriteria Filter"
                variant="primary"
                size="medium"
                onPress={resetAllFilters}
                style={{ marginTop: 12 }}
              />
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 3,
    lineHeight: 18,
  },
  sectionPadding: {
    paddingHorizontal: 20,
    marginTop: 8,
  },
  filterToggleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 8,
  },
  filterToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterToggleText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  filterPanel: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 10,
    marginBottom: 8,
  },
  horizontalChips: {
    marginBottom: 6,
  },
  wrapChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
  },
  switchTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  switchSubtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  resultsHeader: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 12,
  },
  resultsCount: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  resultsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 24,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 10,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 6,
  },
});
