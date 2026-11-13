import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  Share,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows } from '../theme/colors';
import { formatRupiah, cleanWhatsAppNumber } from '../utils/validation';
import {
  GenderBadge,
  AvailabilityBadge,
  ProConTag,
} from '../components/FilterBadge';
import { RatingBreakdownBar } from '../components/RatingStars';
import { Button } from '../components/Button';
import { PhotoGalleryModal } from '../components/PhotoGalleryModal';
import { AddReviewModal } from '../components/AddReviewModal';
import { useBookmark } from '../context/BookmarkContext';
import { executeBookingFailFast } from '../services/kostService';

const { width } = Dimensions.get('window');

export const DetailKostScreen = ({ route, navigation }) => {
  const { kost } = route.params;

  const { isBookmarked, toggleBookmark } = useBookmark();
  const bookmarked = isBookmarked(kost.id);

  // Modals state
  const [isGalleryVisible, setIsGalleryVisible] = useState(false);
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [isBookingLoading, setIsBookingLoading] = useState(false);

  const handleBookingFailFast = async () => {
    setIsBookingLoading(true);
    try {
      const isRoomFull = kost.status === 'Penuh' || kost.availableRooms <= 0;
      const res = await executeBookingFailFast(
        {
          kostName: kost.name,
          totalAmount: kost.priceMonthly,
          studentName: 'Mahasiswa Pencari Kos',
        },
        isRoomFull
      );

      Alert.alert(
        'Booking Berhasil Terkonfirmasi! 🎉',
        `Nomor Pesanan: ${res.order.bookingId}\nStatus Kamar: ${res.availability.roomId} Terkunci.\n\nKedua proses verifikasi berhasil diselesaikan bersamaan via Promise.all().`
      );
    } catch (err) {
      Alert.alert(
        'Booking Dibatalkan (Fail-Fast) ⚠️',
        `Transaksi gagal: ${err.message}\n\nPromise.all() membatalkan seluruh transaksi secara serentak karena salah satu proses verifikasi kamar tidak terpenuhi.`
      );
    } finally {
      setIsBookingLoading(false);
    }
  };

  // Local reviews state to allow adding immediate honest reviews
  const [reviewsList, setReviewsList] = useState(kost.reviews || []);

  // WhatsApp and Calling
  const handleOpenWhatsApp = async () => {
    const phone = cleanWhatsAppNumber(kost.ownerWhatsapp || kost.ownerPhone);
    const message = encodeURIComponent(
      `Halo ${kost.ownerRole || 'Bapak/Ibu'} ${kost.ownerName},\n\nSaya tertarik dengan ${kost.name} (Tipe ${kost.type}) yang saya lihat di aplikasi CariKostan.\n\nApakah saat ini masih ada kamar yang tersedia untuk disurvei / dibooking? Terima kasih!`
    );
    const url = `https://wa.me/${phone}?text=${message}`;

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        await Linking.openURL(`tel:${kost.ownerPhone}`);
      }
    } catch (e) {
      Alert.alert('Kontak Pemilik', `Hubungi ${kost.ownerName} di nomor: ${kost.ownerPhone}`);
    }
  };

  const handleCallOwner = async () => {
    const url = `tel:${kost.ownerPhone}`;
    try {
      await Linking.openURL(url);
    } catch (e) {
      Alert.alert('Kontak Pemilik', `Nomor telepon: ${kost.ownerPhone}`);
    }
  };

  // Share Kost
  const handleShare = async () => {
    try {
      const shareText = `🏡 ${kost.name} (${kost.type})\n` +
        `📍 Lokasi: ${kost.area}\n` +
        `💰 Harga: ${formatRupiah(kost.priceMonthly)} / bulan\n` +
        `⭐ Rating Jujur Penghuni: ${kost.ratingOverall} / 5.0\n` +
        `🕒 Jam Malam: ${kost.curfew}\n` +
        `✨ Keunggulan: ${kost.pros[0] || 'Lingkungan nyaman'}\n\n` +
        `Lihat ulasan lengkap dan foto kondisi nyata kamar di aplikasi CariKostan!`;

      await Share.share({
        message: shareText,
        title: `Rekomendasi Kos: ${kost.name}`,
      });
    } catch (error) {
      console.warn('Share error:', error);
    }
  };

  const handleAddReview = (newReview) => {
    setReviewsList([newReview, ...reviewsList]);
  };

  // Calculate estimated first month total
  const estimatedFirstMonth =
    kost.priceBreakdown.rent +
    (kost.priceBreakdown.deposit?.amount || 0) +
    (kost.priceBreakdown.maintenance?.cost || 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Sticky Bottom Actions Bar */}
      <View style={styles.stickyBottomBar}>
        <View style={styles.priceContainer}>
          <Text style={styles.bottomPriceLabel}>Total Sewa Bulanan</Text>
          <Text style={styles.bottomPriceValue}>
            {formatRupiah(kost.priceMonthly)}
            <Text style={styles.bottomPricePeriod}> / bln</Text>
          </Text>
        </View>

        <View style={styles.bottomButtonsRow}>
          <TouchableOpacity
            style={styles.callButton}
            onPress={handleCallOwner}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Telepon pemilik kos"
            accessibilityHint="Hubungi langsung via panggilan telepon biasa"
          >
            <Ionicons name="call" size={20} color={Colors.primary} />
          </TouchableOpacity>

          <Button
            title="Chat WhatsApp"
            icon="logo-whatsapp"
            variant="success"
            size="medium"
            onPress={handleOpenWhatsApp}
            style={styles.whatsappButton}
            accessibilityLabel="Kirim pesan WhatsApp ke pemilik kos"
            accessibilityHint="Membuka aplikasi WhatsApp dengan pesan pembuka otomatis"
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Hero Photo Carousel & Top Overlay */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: kost.thumbnail }}
            style={styles.heroImage}
            resizeMode="cover"
            accessible={true}
            accessibilityRole="image"
            accessibilityLabel={`Foto utama ${kost.name}`}
          />

          {/* Navigation overlay controls */}
          <View style={styles.navOverlay}>
            <TouchableOpacity
              style={styles.circleBtn}
              onPress={() => navigation.goBack()}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Kembali ke halaman sebelumnya"
            >
              <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
            </TouchableOpacity>

            <View style={styles.navRightGroup}>
              <TouchableOpacity
                style={[styles.circleBtn, { marginRight: 8 }]}
                onPress={handleShare}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Bagikan info kosan ini ke teman atau keluarga"
              >
                <Ionicons name="share-social-outline" size={20} color={Colors.textPrimary} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.circleBtn}
                onPress={() => toggleBookmark(kost)}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={bookmarked ? 'Hapus dari daftar simpan' : 'Simpan kos ke favorit'}
              >
                <Ionicons
                  name={bookmarked ? 'heart' : 'heart-outline'}
                  size={22}
                  color={bookmarked ? Colors.danger : Colors.textPrimary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Real Condition Photo Gallery Button */}
          <TouchableOpacity
            style={styles.realPhotoBannerBtn}
            onPress={() => setIsGalleryVisible(true)}
            activeOpacity={0.85}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Buka galeri foto kondisi asli dari penghuni kos"
            accessibilityHint="Ketuk untuk melihat foto asli kamar mandi, kamar, dan dapur dari mahasiswa"
          >
            <Ionicons name="camera" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.realPhotoBannerText}>
              Lihat Galeri Foto Kondisi Nyata ({kost.gallery?.length || 0} Foto Real) 📸
            </Text>
          </TouchableOpacity>
        </View>

        {/* Main Info Card */}
        <View style={styles.mainInfoCard}>
          <View style={styles.badgeRow}>
            <GenderBadge type={kost.type} />
            <View style={{ width: 8 }} />
            <AvailabilityBadge status={kost.status} availableRooms={kost.availableRooms} />
          </View>

          <Text style={styles.kostTitle}>{kost.name}</Text>

          <View style={styles.locationRow}>
            <Ionicons name="location-sharp" size={16} color={Colors.primary} style={{ marginRight: 4 }} />
            <Text style={styles.locationText}>{kost.address}</Text>
          </View>

          {/* Quick Rating Summary */}
          <View style={styles.quickRatingBar}>
            <View style={styles.ratingNumberBox}>
              <Ionicons name="star" size={20} color={Colors.secondary} />
              <Text style={styles.ratingOverallBig}>{kost.ratingOverall.toFixed(1)}</Text>
              <Text style={styles.ratingMaxText}>/ 5.0</Text>
            </View>

            <View style={styles.ratingSummaryRight}>
              <Text style={styles.ratingVerifiedText}>Skor Ulasan Jujur Mahasiswa</Text>
              <Text style={styles.ratingBasedOnText}>
                Berdasarkan {reviewsList.length} review terverifikasi penghuni asli
              </Text>
            </View>
          </View>
        </View>

        {/* 1. Honest Review & Detailed Category Breakdown */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>1. Honest Review & Rating Spesifik</Text>
              <Text style={styles.sectionSubtitle}>Transparansi penilaian berdasarkan kondisi nyata</Text>
            </View>
          </View>

          <View style={styles.breakdownBox}>
            <RatingBreakdownBar
              label="Air & Saluran"
              score={kost.ratings.air}
              icon="water-outline"
            />
            <RatingBreakdownBar
              label="Wi-Fi & Sinyal"
              score={kost.ratings.wifi}
              icon="wifi-outline"
            />
            <RatingBreakdownBar
              label="Keamanan"
              score={kost.ratings.keamanan}
              icon="shield-checkmark-outline"
            />
            <RatingBreakdownBar
              label="Kebersihan"
              score={kost.ratings.kebersihan}
              icon="sparkles-outline"
            />
          </View>
        </View>

        {/* 2. Pros & Cons Tagging */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>2. Poin Plus & Minus (Pros & Cons)</Text>
          <Text style={styles.sectionSubtitle}>
            Ketahui kelebihan dan kekurangan sebelum memutuskan survei
          </Text>

          {/* Pros */}
          <Text style={styles.subGroupTitle}>Keunggulan Kos (Pros):</Text>
          {kost.pros.map((pro, index) => (
            <ProConTag key={'pro_' + index} text={pro} type="pro" />
          ))}

          {/* Cons */}
          <Text style={[styles.subGroupTitle, { marginTop: 12 }]}>
            Catatan & Kekurangan (Cons):
          </Text>
          {kost.cons.map((con, index) => (
            <ProConTag key={'con_' + index} text={con} type="con" />
          ))}
        </View>

        {/* 3. Transparansi Harga & Kalkulator Biaya */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>3. Transparansi Biaya & Estimasi</Text>
              <Text style={styles.sectionSubtitle}>
                Semua rincian biaya tanpa biaya tersembunyi
              </Text>
            </View>
            <View style={styles.noHiddenBadge}>
              <Ionicons name="checkmark-done" size={14} color={Colors.primary} />
              <Text style={styles.noHiddenText}>Transparan</Text>
            </View>
          </View>

          <View style={styles.priceDetailList}>
            {/* Sewa Pokok */}
            <View style={styles.priceDetailItem}>
              <Text style={styles.priceDetailLabel}>Harga Sewa Kamar Bulanan</Text>
              <Text style={styles.priceDetailVal}>{formatRupiah(kost.priceBreakdown.rent)}</Text>
            </View>

            {/* Listrik */}
            <View style={styles.priceDetailItem}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={styles.priceDetailLabel}>Biaya Listrik</Text>
                <Text style={styles.priceDetailSub}>{kost.priceBreakdown.electricity.note}</Text>
              </View>
              <Text style={[styles.priceDetailVal, { fontSize: 13 }]}>
                {kost.priceBreakdown.electricity.included ? 'Gratis' : kost.priceBreakdown.electricity.estimatedCost}
              </Text>
            </View>

            {/* Air */}
            <View style={styles.priceDetailItem}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={styles.priceDetailLabel}>Biaya Air & Sanitasi</Text>
                <Text style={styles.priceDetailSub}>{kost.priceBreakdown.water.note}</Text>
              </View>
              <Text style={styles.priceDetailVal}>
                {kost.priceBreakdown.water.included ? 'Gratis' : kost.priceBreakdown.water.estimatedCost}
              </Text>
            </View>

            {/* Iuran Sampah/Kebersihan */}
            <View style={styles.priceDetailItem}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={styles.priceDetailLabel}>Iuran Kebersihan Lingkungan</Text>
                <Text style={styles.priceDetailSub}>{kost.priceBreakdown.maintenance.note}</Text>
              </View>
              <Text style={styles.priceDetailVal}>
                {kost.priceBreakdown.maintenance.cost > 0
                  ? formatRupiah(kost.priceBreakdown.maintenance.cost)
                  : 'Gratis'}
              </Text>
            </View>

            {/* Parkir */}
            <View style={styles.priceDetailItem}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={styles.priceDetailLabel}>Parkir Motor / Mobil</Text>
                <Text style={styles.priceDetailSub}>
                  Motor: {kost.priceBreakdown.parking.motor} | Mobil: {kost.priceBreakdown.parking.car}
                </Text>
              </View>
            </View>

            {/* Deposit Awal */}
            <View style={styles.priceDetailItem}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={styles.priceDetailLabel}>Uang Jaminan / Deposit Awal</Text>
                <Text style={styles.priceDetailSub}>
                  {kost.priceBreakdown.deposit.note} (Refundable saat checkout)
                </Text>
              </View>
              <Text style={styles.priceDetailVal}>
                {formatRupiah(kost.priceBreakdown.deposit.amount)}
              </Text>
            </View>
          </View>

          {/* First Month Total Calculator Box */}
          <View style={styles.calculatorBox}>
            <View style={styles.calcHeader}>
              <Ionicons name="calculator-outline" size={18} color={Colors.primary} style={{ marginRight: 6 }} />
              <Text style={styles.calcTitle}>Estimasi Pembayaran Bulan Pertama:</Text>
            </View>
            <Text style={styles.calcTotalBig}>{formatRupiah(estimatedFirstMonth)}</Text>
            <Text style={styles.calcNote}>
              *Termasuk sewa bulan ke-1 ({formatRupiah(kost.priceBreakdown.rent)}) + deposit jaminan (
              {formatRupiah(kost.priceBreakdown.deposit.amount)}) + iuran kebersihan.
            </Text>

            {/* Promise.all Transaction Booking Action */}
            <TouchableOpacity
              style={[
                styles.calcBookingBtn,
                kost.status === 'Penuh' && styles.calcBookingBtnDisabled,
              ]}
              onPress={handleBookingFailFast}
              disabled={isBookingLoading}
              activeOpacity={0.8}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Booking kamar dengan verifikasi Promise.all"
            >
              <Ionicons
                name={kost.status === 'Penuh' ? 'lock-closed' : 'flash'}
                size={16}
                color="#FFFFFF"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.calcBookingBtnText}>
                {isBookingLoading
                  ? 'Memproses Verifikasi Kamar & Booking...'
                  : kost.status === 'Penuh'
                  ? 'Kamar Penuh (Uji Fail-Fast)'
                  : 'Ajukan Booking Sekarang (Promise.all)'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 4. Spesifikasi Kamar & Aturan Kost */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>4. Spesifikasi Kamar & Peraturan</Text>
          <Text style={styles.sectionSubtitle}>Pahami aturan kos sebelum memesan</Text>

          <View style={styles.specGrid}>
            <View style={styles.specItem}>
              <Ionicons name="resize-outline" size={18} color={Colors.primary} />
              <View style={styles.specItemContent}>
                <Text style={styles.specItemLabel}>Ukuran Kamar</Text>
                <Text style={styles.specItemVal}>{kost.roomSize}</Text>
              </View>
            </View>

            <View style={styles.specItem}>
              <Ionicons name="business-outline" size={18} color={Colors.primary} />
              <View style={styles.specItemContent}>
                <Text style={styles.specItemLabel}>Posisi Lantai</Text>
                <Text style={styles.specItemVal}>{kost.floor}</Text>
              </View>
            </View>

            <View style={styles.specItem}>
              <Ionicons name="sunny-outline" size={18} color={Colors.primary} />
              <View style={styles.specItemContent}>
                <Text style={styles.specItemLabel}>Ventilasi Udara</Text>
                <Text style={styles.specItemVal}>{kost.windowFacing}</Text>
              </View>
            </View>
          </View>

          {/* Rules Accordion-like boxes */}
          <View style={styles.ruleBox}>
            <View style={styles.ruleHeader}>
              <Ionicons name="time" size={16} color={Colors.primary} style={{ marginRight: 6 }} />
              <Text style={styles.ruleTitle}>Jam Malam: {kost.curfew}</Text>
            </View>
            <Text style={styles.ruleDesc}>{kost.curfewNote}</Text>
          </View>

          <View style={styles.ruleBox}>
            <View style={styles.ruleHeader}>
              <Ionicons name="people" size={16} color={Colors.primary} style={{ marginRight: 6 }} />
              <Text style={styles.ruleTitle}>Aturan Tamu: {kost.guestRule}</Text>
            </View>
            <Text style={styles.ruleDesc}>{kost.guestRuleNote}</Text>
          </View>
        </View>

        {/* 5. Fasilitas Lengkap */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>5. Fasilitas Kamar & Bersama</Text>
          <Text style={styles.sectionSubtitle}>Fasilitas yang disediakan dan siap digunakan</Text>

          <View style={styles.facilityGrid}>
            {kost.facilities.map((fac) => (
              <View key={fac.id} style={styles.facCard}>
                <View style={styles.facIconCircle}>
                  <Ionicons name={fac.icon} size={20} color={Colors.primary} />
                </View>
                <Text style={styles.facName}>{fac.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 6. Rekomendasi Tempat Terdekat */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>6. Rekomendasi Tempat Terdekat</Text>
          <Text style={styles.sectionSubtitle}>
            Akses fasilitas penunjang kehidupan sehari-hari mahasiswa
          </Text>

          <View style={styles.nearbyList}>
            {kost.nearbyPlaces.map((place) => (
              <View key={place.id} style={styles.nearbyItem}>
                <View style={styles.nearbyIconCircle}>
                  <Ionicons name={place.icon} size={18} color={Colors.primary} />
                </View>
                <View style={styles.nearbyCenter}>
                  <Text style={styles.nearbyName}>{place.name}</Text>
                  <Text style={styles.nearbyCategory}>{place.category}</Text>
                </View>
                <View style={styles.nearbyRight}>
                  <Text style={styles.nearbyDistance}>{place.distance}</Text>
                  <Text style={styles.nearbyWalkTime}>{place.walkTime}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 7. Ulasan Lengkap Penghuni */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>7. Ulasan Komunitas Penghuni</Text>
              <Text style={styles.sectionSubtitle}>
                {reviewsList.length} Ulasan Terverifikasi
              </Text>
            </View>
            <Button
              title="Tulis Review"
              variant="outline"
              size="small"
              icon="create-outline"
              onPress={() => setIsReviewModalVisible(true)}
              accessibilityLabel="Tulis ulasan jujur untuk kos ini"
            />
          </View>

          {reviewsList.map((rev) => (
            <View key={rev.id} style={styles.reviewCard}>
              <View style={styles.reviewUserRow}>
                <Image source={{ uri: rev.userAvatar }} style={styles.reviewAvatar} />
                <View style={styles.reviewUserMeta}>
                  <Text style={styles.reviewUserName}>{rev.userName}</Text>
                  <Text style={styles.reviewUserRole}>{rev.userRole}</Text>
                </View>
                <View style={styles.reviewScorePill}>
                  <Ionicons name="star" size={12} color={Colors.secondary} />
                  <Text style={styles.reviewScorePillText}>{rev.ratingOverall.toFixed(1)}</Text>
                </View>
              </View>

              <View style={styles.reviewSubMeta}>
                <Text style={styles.reviewRoomType}>{rev.roomType}</Text>
                <Text style={styles.reviewDate}>{rev.date}</Text>
              </View>

              <Text style={styles.reviewComment}>{rev.comment}</Text>
            </View>
          ))}
        </View>

        {/* Padding for sticky bottom bar */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Real-Condition Photo Gallery Modal */}
      <PhotoGalleryModal
        visible={isGalleryVisible}
        onClose={() => setIsGalleryVisible(false)}
        gallery={kost.gallery}
        kostName={kost.name}
      />

      {/* Add Review Modal */}
      <AddReviewModal
        visible={isReviewModalVisible}
        onClose={() => setIsReviewModalVisible(false)}
        onSubmit={handleAddReview}
        kostName={kost.name}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  heroContainer: {
    width: '100%',
    height: 280,
    position: 'relative',
    backgroundColor: Colors.surface,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  navOverlay: {
    position: 'absolute',
    top: 14,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.small,
  },
  navRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  realPhotoBannerBtn: {
    position: 'absolute',
    bottom: 16,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(5, 150, 105, 0.95)',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.medium,
  },
  realPhotoBannerText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  mainInfoCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  kostTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    lineHeight: 28,
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  locationText: {
    fontSize: 13,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
  quickRatingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  ratingNumberBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
    borderRightWidth: 1,
    borderRightColor: '#FCD34D',
  },
  ratingOverallBig: {
    fontSize: 20,
    fontWeight: '800',
    color: '#92400E',
    marginLeft: 5,
  },
  ratingMaxText: {
    fontSize: 13,
    color: '#B45309',
    fontWeight: '600',
  },
  ratingSummaryRight: {
    flex: 1,
    paddingLeft: 12,
  },
  ratingVerifiedText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
  },
  ratingBasedOnText: {
    fontSize: 11,
    color: '#B45309',
    marginTop: 1,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  breakdownBox: {
    backgroundColor: Colors.background,
    borderRadius: 14,
    padding: 14,
    marginTop: 8,
  },
  subGroupTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 10,
    marginBottom: 6,
  },
  noHiddenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  noHiddenText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primaryDark,
    marginLeft: 3,
  },
  priceDetailList: {
    marginTop: 8,
  },
  priceDetailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface,
  },
  priceDetailLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  priceDetailSub: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
    lineHeight: 16,
  },
  priceDetailVal: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  calculatorBox: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 14,
    padding: 14,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  calcHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  calcTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  calcTotalBig: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  calcNote: {
    fontSize: 11,
    color: '#065F46',
    marginTop: 4,
    lineHeight: 16,
  },
  calcBookingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 12,
  },
  calcBookingBtnDisabled: {
    backgroundColor: '#94A3B8',
  },
  calcBookingBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  specGrid: {
    flexDirection: 'row',
    marginTop: 12,
    marginBottom: 12,
  },
  specItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 10,
    borderRadius: 10,
    marginRight: 6,
  },
  specItemContent: {
    marginLeft: 6,
  },
  specItemLabel: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  specItemVal: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 1,
  },
  ruleBox: {
    backgroundColor: Colors.surface,
    padding: 12,
    borderRadius: 10,
    marginTop: 8,
  },
  ruleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ruleTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  ruleDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
  },
  facilityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  facCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
    marginRight: '2%',
  },
  facIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  facName: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  nearbyList: {
    marginTop: 10,
  },
  nearbyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface,
  },
  nearbyIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  nearbyCenter: {
    flex: 1,
  },
  nearbyName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  nearbyCategory: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 1,
  },
  nearbyRight: {
    alignItems: 'flex-end',
  },
  nearbyDistance: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  nearbyWalkTime: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  reviewCard: {
    backgroundColor: Colors.surface,
    padding: 14,
    borderRadius: 12,
    marginTop: 10,
  },
  reviewUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 10,
  },
  reviewUserMeta: {
    flex: 1,
  },
  reviewUserName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  reviewUserRole: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  reviewScorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  reviewScorePillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
    marginLeft: 3,
  },
  reviewSubMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    marginBottom: 6,
  },
  reviewRoomType: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primary,
  },
  reviewDate: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  reviewComment: {
    fontSize: 12,
    color: Colors.textPrimary,
    lineHeight: 18,
  },
  stickyBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 76,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 100,
    ...Shadows.large,
  },
  priceContainer: {
    justifyContent: 'center',
  },
  bottomPriceLabel: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  bottomPriceValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primary,
  },
  bottomPricePeriod: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  bottomButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  whatsappButton: {
    paddingHorizontal: 16,
    minHeight: 44,
  },
});
