import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { Button } from './Button';
import { Input } from './Input';
import { RatingStars } from './RatingStars';
import { useAuth } from '../context/AuthContext';

export const AddReviewModal = ({ visible, onClose, onSubmit, kostName }) => {
  const { user } = useAuth();

  const [ratings, setRatings] = useState({
    air: 5,
    wifi: 5,
    keamanan: 5,
    kebersihan: 5,
  });
  const [roomType, setRoomType] = useState('Kamar Mandi Dalam (Lantai 2)');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateOverall = () => {
    const sum = ratings.air + ratings.wifi + ratings.keamanan + ratings.kebersihan;
    return (sum / 4).toFixed(1);
  };

  const handleRatingChange = (category, value) => {
    setRatings((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const handleSubmit = () => {
    if (!comment.trim()) {
      setError('Ulasan teks wajib diisi agar bermanfaat bagi calon penghuni lain.');
      return;
    }
    if (comment.trim().length < 15) {
      setError('Ulasan minimal 15 karakter.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    const newReview = {
      id: 'rev_' + Date.now(),
      userName: user ? user.name : 'Mahasiswa Pengulas',
      userRole: user ? `${user.role} (${user.campus || 'Penghuni'})` : 'Penghuni Aktif',
      userAvatar:
        user?.avatar ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      date: 'Baru saja',
      roomType: roomType.trim() || 'Kamar Standar',
      ratingOverall: parseFloat(calculateOverall()),
      ratings: { ...ratings },
      comment: comment.trim(),
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onSubmit(newReview);
      setComment('');
      onClose();
      Alert.alert(
        'Ulasan Berhasil Terbit! 🎉',
        'Terima kasih atas ulasan jujur Anda. Review Anda sangat membantu mahasiswa lain dalam memilih kos yang tepat.'
      );
    }, 600);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Tulis Ulasan Jujur</Text>
              <Text style={styles.headerSubtitle} numberOfLines={1}>
                {kostName}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={onClose}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Batal dan tutup formulir ulasan"
            >
              <Ionicons name="close" size={22} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Overall Score preview */}
            <View style={styles.overallPreview}>
              <Text style={styles.overallPreviewLabel}>Nilai Rata-rata Ulasan Anda:</Text>
              <View style={styles.scoreRow}>
                <Ionicons name="star" size={26} color={Colors.secondary} />
                <Text style={styles.scoreBig}>{calculateOverall()}</Text>
                <Text style={styles.scoreMax}> / 5.0</Text>
              </View>
            </View>

            {/* Category breakdown ratings */}
            <Text style={styles.sectionTitle}>Penilaian Per Kategori Spesifik</Text>
            
            {/* Air */}
            <View style={styles.rateRow}>
              <View style={styles.rateLabelCol}>
                <Ionicons name="water-outline" size={18} color={Colors.primary} style={{ marginRight: 6 }} />
                <View>
                  <Text style={styles.rateLabel}>Air & Saluran</Text>
                  <Text style={styles.rateSub}>Debit, bau, & kejernihan</Text>
                </View>
              </View>
              <RatingStars
                rating={ratings.air}
                interactive={true}
                size={22}
                onRate={(val) => handleRatingChange('air', val)}
              />
            </View>

            {/* Wi-Fi */}
            <View style={styles.rateRow}>
              <View style={styles.rateLabelCol}>
                <Ionicons name="wifi-outline" size={18} color={Colors.primary} style={{ marginRight: 6 }} />
                <View>
                  <Text style={styles.rateLabel}>Wi-Fi & Sinyal HP</Text>
                  <Text style={styles.rateSub}>Kecepatan & kestabilan</Text>
                </View>
              </View>
              <RatingStars
                rating={ratings.wifi}
                interactive={true}
                size={22}
                onRate={(val) => handleRatingChange('wifi', val)}
              />
            </View>

            {/* Keamanan */}
            <View style={styles.rateRow}>
              <View style={styles.rateLabelCol}>
                <Ionicons name="shield-checkmark-outline" size={18} color={Colors.primary} style={{ marginRight: 6 }} />
                <View>
                  <Text style={styles.rateLabel}>Keamanan</Text>
                  <Text style={styles.rateSub}>Kunci gerbang, CCTV, parkiran</Text>
                </View>
              </View>
              <RatingStars
                rating={ratings.keamanan}
                interactive={true}
                size={22}
                onRate={(val) => handleRatingChange('keamanan', val)}
              />
            </View>

            {/* Kebersihan */}
            <View style={styles.rateRow}>
              <View style={styles.rateLabelCol}>
                <Ionicons name="sparkles-outline" size={18} color={Colors.primary} style={{ marginRight: 6 }} />
                <View>
                  <Text style={styles.rateLabel}>Kebersihan</Text>
                  <Text style={styles.rateSub}>Kamar mandi & area bersama</Text>
                </View>
              </View>
              <RatingStars
                rating={ratings.kebersihan}
                interactive={true}
                size={22}
                onRate={(val) => handleRatingChange('kebersihan', val)}
              />
            </View>

            {/* Room Type */}
            <Input
              label="Tipe Kamar / Nomor Kamar yang Dihuni"
              value={roomType}
              onChangeText={setRoomType}
              placeholder="Contoh: Kamar Mandi Dalam Lt. 2"
              leftIcon="bed-outline"
              containerStyle={{ marginTop: 12 }}
            />

            {/* Text review */}
            <Input
              label="Ceritakan Pengalaman Nyata Anda"
              value={comment}
              onChangeText={(txt) => {
                setComment(txt);
                if (error) setError('');
              }}
              placeholder="Sampaikan poin plus dan minus apa adanya (suasana kos, keramahan ibu kos, suara bising, dll)..."
              multiline={true}
              numberOfLines={4}
              error={error}
              containerStyle={{ marginTop: 4 }}
            />

            {/* Submit Button */}
            <Button
              title="Kirim Ulasan Jujur"
              onPress={handleSubmit}
              loading={isSubmitting}
              icon="send-outline"
              style={{ marginTop: 8, marginBottom: 24 }}
            />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
    maxWidth: 240,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  overallPreview: {
    backgroundColor: Colors.secondaryLight,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  overallPreviewLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 4,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreBig: {
    fontSize: 28,
    fontWeight: '800',
    color: '#92400E',
    marginLeft: 6,
  },
  scoreMax: {
    fontSize: 16,
    color: '#B45309',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  rateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  rateLabelCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rateLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  rateSub: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
});
