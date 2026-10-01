import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { CardKos } from '../components/CardKos';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useBookmark } from '../context/BookmarkContext';

export const SavedScreen = ({ navigation }) => {
  const { bookmarks, clearBookmarks } = useBookmark();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBookmarks = bookmarks.filter((kost) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      kost.name.toLowerCase().includes(q) ||
      kost.area.toLowerCase().includes(q) ||
      kost.city.toLowerCase().includes(q)
    );
  });

  const handleClearAll = () => {
    if (bookmarks.length === 0) return;
    Alert.alert(
      'Hapus Semua Favorit?',
      'Apakah Anda yakin ingin menghapus seluruh daftar kos yang disimpan?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Ya, Hapus Semua',
          style: 'destructive',
          onPress: () => clearBookmarks(),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Kos Tersimpan</Text>
          <Text style={styles.subtitle}>
            {bookmarks.length} kosan dalam daftar pantauan Anda
          </Text>
        </View>

        {bookmarks.length > 0 && (
          <TouchableOpacity
            style={styles.clearBtn}
            onPress={handleClearAll}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Hapus semua kos tersimpan"
          >
            <Ionicons name="trash-outline" size={18} color={Colors.danger} />
            <Text style={styles.clearBtnText}>Kosongkan</Text>
          </TouchableOpacity>
        )}
      </View>

      {bookmarks.length > 0 && (
        <View style={styles.searchSection}>
          <Input
            placeholder="Cari dalam kos tersimpan..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftIcon="search-outline"
            rightIcon={searchQuery ? 'close-circle' : null}
            onRightIconPress={() => setSearchQuery('')}
            accessibilityLabel="Cari di daftar tersimpan"
          />
        </View>
      )}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredBookmarks.length > 0 ? (
          filteredBookmarks.map((item) => (
            <CardKos
              key={item.id}
              kost={item}
              onPress={() => navigation.navigate('DetailKost', { kost: item })}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="heart-dislike-outline" size={42} color={Colors.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>
              {searchQuery ? 'Tidak Ada Hasil yang Cocok' : 'Belum Ada Kos Tersimpan'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery
                ? 'Coba gunakan kata kunci pencarian yang lain.'
                : 'Tekan ikon hati pada kartu kos untuk menyimpannya ke daftar favorit agar mudah dibandingkan nanti.'}
            </Text>
            {!searchQuery && (
              <Button
                title="Mulai Jelajahi Kosan"
                icon="compass-outline"
                variant="primary"
                onPress={() => navigation.navigate('HomeTab')}
                style={{ marginTop: 8 }}
              />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dangerLight,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  clearBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.dangerDark,
    marginLeft: 4,
  },
  searchSection: {
    paddingHorizontal: 20,
    marginTop: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 20,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
});
