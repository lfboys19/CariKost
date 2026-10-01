import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows } from '../theme/colors';
import { formatRupiah } from '../utils/validation';
import { GenderBadge, AvailabilityBadge } from './FilterBadge';
import { useBookmark } from '../context/BookmarkContext';

export const CardKos = ({ kost, onPress, horizontal = false }) => {
  const { isBookmarked, toggleBookmark } = useBookmark();
  const bookmarked = isBookmarked(kost.id);

  const handleBookmarkPress = (e) => {
    e.stopPropagation && e.stopPropagation();
    toggleBookmark(kost);
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        horizontal && styles.cardHorizontal,
        pressed && styles.cardPressed,
      ]}
      onPress={onPress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`Kos ${kost.name}, tipe ${kost.type}, harga ${formatRupiah(
        kost.priceMonthly
      )} per bulan, rating ${kost.ratingOverall}, lokasi ${kost.area}`}
      accessibilityHint="Ketuk dua kali untuk melihat detail lengkap kost, ulasan jujur, dan galeri foto kondisi nyata"
    >
      {/* Thumbnail with overlay badges */}
      <View style={[styles.imageContainer, horizontal && styles.imageContainerHorizontal]}>
        <Image
          source={{ uri: kost.thumbnail }}
          style={styles.image}
          resizeMode="cover"
          accessible={true}
          accessibilityRole="image"
          accessibilityLabel={`Foto tampilan depan kos ${kost.name}`}
        />

        {/* Top badges */}
        <View style={styles.topBadgesRow}>
          <GenderBadge type={kost.type} />
          <TouchableOpacity
            style={[styles.bookmarkButton, bookmarked && styles.bookmarkButtonActive]}
            onPress={handleBookmarkPress}
            activeOpacity={0.7}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={bookmarked ? `Hapus ${kost.name} dari favorit` : `Simpan ${kost.name} ke favorit`}
            accessibilityHint="Ketuk untuk menyimpan atau menghapus dari daftar tersimpan"
          >
            <Ionicons
              name={bookmarked ? 'heart' : 'heart-outline'}
              size={18}
              color={bookmarked ? Colors.danger : Colors.textPrimary}
            />
          </TouchableOpacity>
        </View>

        {/* Availability Badge */}
        <View style={styles.bottomImageBadge}>
          <AvailabilityBadge
            status={kost.status}
            availableRooms={kost.availableRooms}
          />
        </View>
      </View>

      {/* Card Content */}
      <View style={[styles.content, horizontal && styles.contentHorizontal]}>
        {/* Rating and Reviews */}
        <View style={styles.ratingRow}>
          <View style={styles.ratingChip}>
            <Ionicons name="star" size={13} color={Colors.secondary} />
            <Text style={styles.ratingNumber}>{kost.ratingOverall.toFixed(1)}</Text>
          </View>
          <Text style={styles.reviewCount}>({kost.totalReviews} ulasan jujur)</Text>
          <Text style={styles.dotSeparator}>•</Text>
          <Text style={styles.curfewText} numberOfLines={1}>{kost.curfew}</Text>
        </View>

        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {kost.name}
        </Text>

        {/* Area location */}
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color={Colors.textSecondary} />
          <Text style={styles.locationText} numberOfLines={1}>
            {kost.area}
          </Text>
        </View>

        {/* Featured Pro Tag */}
        {kost.pros && kost.pros.length > 0 && (
          <View style={styles.highlightPro}>
            <Ionicons name="checkmark-circle" size={12} color={Colors.successDark} style={{ marginRight: 4 }} />
            <Text style={styles.highlightProText} numberOfLines={1}>
              {kost.pros[0]}
            </Text>
          </View>
        )}

        {/* Footer: Price */}
        <View style={styles.priceRow}>
          <View>
            <Text style={styles.priceLabel}>Mulai dari</Text>
            <Text style={styles.priceText}>
              {formatRupiah(kost.priceMonthly)}
              <Text style={styles.pricePeriod}> / bln</Text>
            </Text>
          </View>

          <View style={styles.detailArrow}>
            <Ionicons name="arrow-forward" size={16} color={Colors.primary} />
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.medium,
  },
  cardHorizontal: {
    width: 280,
    marginRight: 14,
    marginBottom: 8,
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  imageContainer: {
    position: 'relative',
    height: 180,
    width: '100%',
    backgroundColor: Colors.surface,
  },
  imageContainerHorizontal: {
    height: 140,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  topBadgesRow: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookmarkButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.small,
  },
  bookmarkButtonActive: {
    backgroundColor: '#FFFFFF',
  },
  bottomImageBadge: {
    position: 'absolute',
    bottom: 8,
    left: 10,
  },
  content: {
    padding: 14,
  },
  contentHorizontal: {
    padding: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  ratingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 6,
  },
  ratingNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
    marginLeft: 3,
  },
  reviewCount: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  dotSeparator: {
    marginHorizontal: 6,
    color: Colors.textMuted,
  },
  curfewText: {
    fontSize: 11,
    color: Colors.textSecondary,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 22,
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 4,
    flex: 1,
  },
  highlightPro: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.successLight,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 10,
  },
  highlightProText: {
    fontSize: 11,
    color: Colors.successDark,
    fontWeight: '600',
    flex: 1,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 10,
  },
  priceLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primary,
  },
  pricePeriod: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  detailArrow: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
