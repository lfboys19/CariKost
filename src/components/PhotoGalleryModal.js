import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

const { width, height } = Dimensions.get('window');

export const PhotoGalleryModal = ({ visible, onClose, gallery = [], kostName }) => {
  const [filterType, setFilterType] = useState('all'); // 'all' | 'real_resident' | 'official'
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredPhotos = gallery.filter((photo) => {
    if (filterType === 'all') return true;
    return photo.type === filterType;
  });

  const activePhoto = filteredPhotos[selectedIndex] || filteredPhotos[0];

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.container}>
        {/* Top bar */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Tutup galeri foto"
            accessibilityHint="Ketuk untuk menutup tampilan foto"
          >
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              Galeri Kondisi Nyata
            </Text>
            <Text style={styles.headerSubtitle} numberOfLines={1}>
              {kostName}
            </Text>
          </View>

          <View style={{ width: 40 }} />
        </View>

        {/* Filter Pills */}
        <View style={styles.filterBar}>
          <TouchableOpacity
            style={[styles.filterPill, filterType === 'all' && styles.filterPillActive]}
            onPress={() => {
              setFilterType('all');
              setSelectedIndex(0);
            }}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Tampilkan semua foto"
          >
            <Text
              style={[
                styles.filterPillText,
                filterType === 'all' && styles.filterPillTextActive,
              ]}
            >
              Semua ({gallery.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterPill,
              filterType === 'real_resident' && styles.filterPillActive,
            ]}
            onPress={() => {
              setFilterType('real_resident');
              setSelectedIndex(0);
            }}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Tampilkan hanya foto asli dari penghuni kos"
          >
            <Ionicons
              name="camera"
              size={13}
              color={filterType === 'real_resident' ? '#FFFFFF' : Colors.primary}
              style={{ marginRight: 4 }}
            />
            <Text
              style={[
                styles.filterPillText,
                filterType === 'real_resident' && styles.filterPillTextActive,
              ]}
            >
              Kondisi Asli Penghuni 📸
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterPill,
              filterType === 'official' && styles.filterPillActive,
            ]}
            onPress={() => {
              setFilterType('official');
              setSelectedIndex(0);
            }}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Tampilkan foto resmi pemilik kos"
          >
            <Text
              style={[
                styles.filterPillText,
                filterType === 'official' && styles.filterPillTextActive,
              ]}
            >
              Foto Pemilik
            </Text>
          </TouchableOpacity>
        </View>

        {/* Main Display Area */}
        <View style={styles.viewerContainer}>
          {activePhoto ? (
            <View style={styles.mainImageWrapper}>
              <Image
                source={{ uri: activePhoto.url }}
                style={styles.mainImage}
                resizeMode="contain"
                accessible={true}
                accessibilityRole="image"
                accessibilityLabel={activePhoto.caption}
              />

              {/* Photo Type Badge */}
              <View
                style={[
                  styles.photoBadge,
                  activePhoto.type === 'real_resident'
                    ? styles.residentBadge
                    : styles.officialBadge,
                ]}
              >
                <Text style={styles.photoBadgeText}>
                  {activePhoto.badge || (activePhoto.type === 'real_resident' ? 'Foto Real Penghuni' : 'Foto Pemilik')}
                </Text>
              </View>

              {/* Caption */}
              <View style={styles.captionBox}>
                <Text style={styles.captionText}>{activePhoto.caption}</Text>
                <Text style={styles.counterText}>
                  {(selectedIndex + 1)} / {filteredPhotos.length}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Tidak ada foto untuk kategori ini</Text>
            </View>
          )}
        </View>

        {/* Thumbnail Selector Strip */}
        <View style={styles.thumbnailsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbnailsScroll}
          >
            {filteredPhotos.map((item, index) => (
              <TouchableOpacity
                key={item.id || index}
                onPress={() => setSelectedIndex(index)}
                style={[
                  styles.thumbItem,
                  selectedIndex === index && styles.thumbItemActive,
                ]}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={`Pilih foto ${index + 1}: ${item.caption}`}
              >
                <Image source={{ uri: item.url }} style={styles.thumbImage} />
                {item.type === 'real_resident' && (
                  <View style={styles.thumbResidentDot} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
  },
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#0F172A',
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#1E293B',
    marginRight: 8,
  },
  filterPillActive: {
    backgroundColor: Colors.primary,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  viewerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainImageWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mainImage: {
    width: width,
    height: height * 0.55,
  },
  photoBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  residentBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.9)',
  },
  officialBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.9)',
  },
  photoBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  captionBox: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  captionText: {
    flex: 1,
    fontSize: 13,
    color: '#F1F5F9',
    marginRight: 10,
  },
  counterText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  emptyContainer: {
    padding: 20,
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 14,
  },
  thumbnailsContainer: {
    height: 80,
    backgroundColor: '#0F172A',
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    paddingVertical: 10,
  },
  thumbnailsScroll: {
    paddingHorizontal: 16,
  },
  thumbItem: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  thumbItemActive: {
    borderColor: Colors.primary,
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  thumbResidentDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
});
