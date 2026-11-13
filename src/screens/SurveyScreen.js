import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { fetchSurveyList, addSurveyItem, toggleSurveyItem } from '../services/surveyService';
import { LoadingStateView } from '../components/LoadingStateView';
import { ErrorStateView } from '../components/ErrorStateView';

/**
 * 3. FITUR WISHLIST / DAFTAR SURVEY KOST (pengganti Todo List)
 * Menggunakan simulasi API https://jsonplaceholder.typicode.com
 * 
 * - GET /todos?_limit=10 di dalam useEffect()
 * - Form input + tombol Tambah -> POST /todos dengan body: JSON.stringify({ task })
 * - Tombol centang / toggle -> PATCH /todos/:id
 * - Tombol Refresh / Muat Ulang untuk re-fetch
 * - State terpisah: loading, data, error dengan pola async/await try..catch..finally
 */
export const SurveyScreen = ({ navigation }) => {
  // 4. Tiga state utama dikelola terpisah
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  // Form input state
  const [inputTask, setInputTask] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  // 4. Pola fetchData wajib
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const surveyItems = await fetchSurveyList(10);
      setData(surveyItems);
    } catch (err) {
      setError(err);
      // Requirement 5: Error pada Wishlist tampilkan Alert dengan pesan yang mudah dipahami
      Alert.alert(
        'Gagal Memuat Survey',
        err.message || 'Terjadi kesalahan saat mengambil daftar survey dari server. Silakan coba lagi.'
      );
    } finally {
      setLoading(false);
    }
  };

  // 3. GET /todos?_limit=10 saat aplikasi pertama dibuka
  useEffect(() => {
    fetchData();
  }, []);

  // 3. Form input + tombol Tambah -> POST /todos
  const handleAddTask = async () => {
    const trimmed = inputTask.trim();
    if (!trimmed) {
      Alert.alert('Perhatian', 'Silakan ketik nama kost yang ingin dijadwalkan untuk survey.');
      return;
    }

    setIsAdding(true);
    try {
      const newItem = await addSurveyItem(trimmed);
      setData((prev) => [newItem, ...prev]);
      setInputTask('');
      Alert.alert('Berhasil', `"${newItem.task}" berhasil ditambahkan ke daftar survey!`);
    } catch (err) {
      Alert.alert(
        'Gagal Menambah Kost Survey',
        err.message || 'Terjadi kesalahan saat mengirim data ke server backend.'
      );
    } finally {
      setIsAdding(false);
    }
  };

  // 3. Tombol centang / toggle -> PATCH /todos/:id
  const handleToggleStatus = async (item) => {
    const nextCompleted = !item.completed;
    setUpdatingId(item.id);

    try {
      await toggleSurveyItem(item.id, nextCompleted);
      // Update data state secara reaktif
      setData((prev) =>
        prev.map((it) => (it.id === item.id ? { ...it, completed: nextCompleted } : it))
      );
    } catch (err) {
      Alert.alert(
        'Gagal Mengubah Status Survey',
        err.message || 'Tidak dapat memperbarui status survey ke server.'
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Hitung metrik survey
  const totalSurvey = data.length;
  const sudahSurvey = data.filter((item) => item.completed).length;
  const belumSurvey = totalSurvey - sudahSurvey;

  const renderSurveyItem = ({ item }) => {
    const isCompleted = Boolean(item.completed);
    const isThisUpdating = updatingId === item.id;

    return (
      <View style={[styles.itemCard, isCompleted && styles.itemCardCompleted]}>
        <View style={styles.itemHeader}>
          {/* Status Badge */}
          <View
            style={[
              styles.statusBadge,
              isCompleted ? styles.statusBadgeDone : styles.statusBadgePending,
            ]}
          >
            <Ionicons
              name={isCompleted ? 'checkmark-circle' : 'time-outline'}
              size={12}
              color={isCompleted ? Colors.successDark : '#B45309'}
              style={{ marginRight: 4 }}
            />
            <Text
              style={[
                styles.statusBadgeText,
                isCompleted ? styles.statusTextDone : styles.statusTextPending,
              ]}
            >
              {isCompleted ? 'Sudah Disurvey' : 'Belum Disurvey'}
            </Text>
          </View>

          {item.createdAt && (
            <Text style={styles.itemDate}>{item.createdAt}</Text>
          )}
        </View>

        {/* Task / Kost Name */}
        <Text
          style={[styles.itemTitle, isCompleted && styles.itemTitleCompleted]}
          numberOfLines={2}
        >
          {item.task || item.title}
        </Text>

        {/* Action Toggle Button */}
        <View style={styles.itemFooter}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              isCompleted ? styles.toggleButtonDone : styles.toggleButtonPending,
            ]}
            onPress={() => handleToggleStatus(item)}
            disabled={isThisUpdating}
            activeOpacity={0.7}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`Ubah status ${item.task || item.title} menjadi ${
              isCompleted ? 'Belum Disurvey' : 'Sudah Disurvey'
            }`}
          >
            {isThisUpdating ? (
              <ActivityIndicator size="small" color={isCompleted ? Colors.textSecondary : '#FFFFFF'} />
            ) : (
              <>
                <Ionicons
                  name={isCompleted ? 'refresh-outline' : 'checkmark-done'}
                  size={16}
                  color={isCompleted ? Colors.textSecondary : '#FFFFFF'}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[
                    styles.toggleButtonText,
                    isCompleted && styles.toggleButtonTextDone,
                  ]}
                >
                  {isCompleted ? 'Tandai Belum Disurvey' : 'Tandai Sudah Disurvey'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Top Header */}
        <View style={styles.topHeader}>
          <View>
            <Text style={styles.screenTitle}>Daftar Survey Kost</Text>
            <Text style={styles.screenSubtitle}>Wishlist & Rencana Kunjungan Lapangan</Text>
          </View>
          {/* 3. Tombol Refresh / Muat Ulang */}
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={fetchData}
            activeOpacity={0.7}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Muat ulang daftar survey dari server"
          >
            <Ionicons name="refresh" size={18} color={Colors.primary} />
            <Text style={styles.refreshButtonText}>Muat Ulang</Text>
          </TouchableOpacity>
        </View>

        {/* Backend notice */}
        <View style={styles.apiNoticeCard}>
          <Ionicons name="cloud-done-outline" size={16} color={Colors.info} style={{ marginRight: 8 }} />
          <Text style={styles.apiNoticeText}>
            Backend: <Text style={{ fontWeight: '700' }}>jsonplaceholder.typicode.com</Text> (Simulasi API GET, POST, & PATCH).
          </Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{totalSurvey}</Text>
            <Text style={styles.statLabel}>Total Kost</Text>
          </View>
          <View style={[styles.statBox, { borderLeftWidth: 1, borderRightWidth: 1, borderColor: Colors.border }]}>
            <Text style={[styles.statNumber, { color: '#B45309' }]}>{belumSurvey}</Text>
            <Text style={styles.statLabel}>Belum Disurvey</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: Colors.successDark }]}>{sudahSurvey}</Text>
            <Text style={styles.statLabel}>Sudah Disurvey</Text>
          </View>
        </View>

        {/* 3. Form Input + Tombol Tambah */}
        <View style={styles.formContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Tulis nama kost atau lokasi survey baru..."
            placeholderTextColor={Colors.textMuted}
            value={inputTask}
            onChangeText={setInputTask}
            returnKeyType="done"
            onSubmitEditing={handleAddTask}
          />
          <TouchableOpacity
            style={[styles.addButton, (!inputTask.trim() || isAdding) && styles.addButtonDisabled]}
            onPress={handleAddTask}
            disabled={!inputTask.trim() || isAdding}
            activeOpacity={0.8}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Tambah kost ke daftar survey"
          >
            {isAdding ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="add" size={20} color="#FFFFFF" />
                <Text style={styles.addButtonText}>Tambah</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Main Content: Loading, Error, or List */}
        {loading && data.length === 0 ? (
          <LoadingStateView message="Memuat daftar survey kost... Mohon tunggu sebentar." />
        ) : error && data.length === 0 ? (
          <ErrorStateView error={error} onRetry={fetchData} />
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderSurveyItem}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={fetchData}
                colors={[Colors.primary]}
                tintColor={Colors.primary}
              />
            }
            ListEmptyComponent={
              <ErrorStateView
                isEmpty={true}
                emptyMessage="Belum ada kost dalam daftar survey. Ketik nama kost di atas lalu tekan Tambah."
                onRetry={fetchData}
                retryLabel="Muat Contoh Survey"
              />
            }
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  screenSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  refreshButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primaryDark,
    marginLeft: 4,
  },
  apiNoticeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  apiNoticeText: {
    fontSize: 11,
    color: '#1E40AF',
    flex: 1,
    lineHeight: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 10,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  formContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  addButtonDisabled: {
    backgroundColor: Colors.textMuted,
    opacity: 0.7,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 2,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 4,
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  itemCardCompleted: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    opacity: 0.9,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgePending: {
    backgroundColor: '#FEF3C7',
  },
  statusBadgeDone: {
    backgroundColor: Colors.successLight,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  statusTextPending: {
    color: '#92400E',
  },
  statusTextDone: {
    color: Colors.successDark,
  },
  itemDate: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 20,
    marginBottom: 12,
  },
  itemTitleCompleted: {
    textDecorationLine: 'line-through',
    color: Colors.textSecondary,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  toggleButtonPending: {
    backgroundColor: Colors.primary,
  },
  toggleButtonDone: {
    backgroundColor: '#E2E8F0',
  },
  toggleButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  toggleButtonTextDone: {
    color: Colors.textSecondary,
  },
});
