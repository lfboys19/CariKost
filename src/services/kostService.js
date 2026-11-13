/**
 * Kost & Dashboard Async Service
 * Supports:
 * - Real API Fetching using fetch() + AbortController timeout
 * - Parallel execution via Promise.allSettled() for resilient multi-widget dashboard (Kost + Promo + Notifikasi)
 * - All-or-Nothing execution via Promise.all() for crucial booking & room check transaction
 * - Serial / Dependent execution (getUser -> getKost)
 * - Simulation toggles for evaluation on physical phone via Expo Go
 */

import { MOCK_KOSTS } from '../data/mockKost.js';

export const API_BASE = 'https://jsonplaceholder.typicode.com';

// Sample promos for resilient dashboard widget
export const DEFAULT_PROMOS = [
  {
    id: 'promo-1',
    code: 'MABA2026',
    title: 'Diskon Mahasiswa Baru',
    discount: 'Potongan Rp 250.000',
    description: 'Khusus pembayaran sewa minimal 3 bulan pertama.',
    badge: 'Populer 🔥',
    validUntil: '31 Des 2026',
    gradient: ['#059669', '#10B981'],
  },
  {
    id: 'promo-2',
    code: 'BAYARSETAHUN',
    title: 'Gratis 1 Bulan Sewa',
    discount: 'Hemat hingga Rp 1,5 Juta',
    description: 'Untuk pelunasan sewa langsung 1 tahun penuh.',
    badge: 'Super Hemat 💰',
    validUntil: '15 Jan 2027',
    gradient: ['#2563EB', '#3B82F6'],
  },
  {
    id: 'promo-3',
    code: 'FREELISTRIK',
    title: 'Subsidi Token Listrik',
    discount: 'Voucher Rp 100.000',
    description: 'Diberikan setiap awal bulan selama semester pertama.',
    badge: 'Terbatas ⚡',
    validUntil: '28 Feb 2027',
    gradient: ['#D97706', '#F59E0B'],
  },
];

// Sample notifications for resilient dashboard widget
export const DEFAULT_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Survey Kost Bersama Dibuka!',
    message: 'Jadwal survey bareng tim CariKost area Kukusan UI dibuka Sabtu ini.',
    time: '10 menit lalu',
    icon: 'calendar',
    type: 'info',
  },
  {
    id: 'notif-2',
    title: 'Kamar Baru Tersedia di Pogung UGM',
    message: 'Kost Putri Griya Melati menambah 2 kamar kosong ber-AC.',
    time: '1 jam lalu',
    icon: 'home',
    type: 'success',
  },
  {
    id: 'notif-3',
    title: 'Tips Memilih Kos Bebas Banjir',
    message: 'Baca panduan pengecekan saluran air dan drainase sebelum DP.',
    time: '3 jam lalu',
    icon: 'shield-checkmark',
    type: 'warning',
  },
];

/**
 * Standard delay helper for realistic async timing
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 2. FITUR UTAMA: Ambil daftar kost dari API
 * Menggunakan fetch() dengan AbortController timeout & error classification.
 * 
 * @param {object} options
 * @param {string} options.mode - 'normal' | 'offline' | 'http_500' | 'http_404' | 'timeout' | 'empty'
 * @param {number} options.timeoutMs - default 7000ms
 * @returns {Promise<Array>}
 */
export const fetchKostsFromApi = async (options = {}) => {
  const { mode = 'normal', timeoutMs = 7000 } = options;

  // 1. Simulation: Offline state
  if (mode === 'offline') {
    await sleep(400);
    const offlineErr = new TypeError('Network request failed');
    offlineErr.isOffline = true;
    throw offlineErr;
  }

  // 2. Simulation: Timeout state
  if (mode === 'timeout') {
    await sleep(300);
    const timeoutErr = new Error('Waktu permintaan habis. Server terlalu lama merespons.');
    timeoutErr.name = 'TimeoutError';
    timeoutErr.isTimeout = true;
    throw timeoutErr;
  }

  // 3. Simulation: HTTP Error 500
  if (mode === 'http_500') {
    await sleep(600);
    const err = new Error('Gagal mengambil data kost. Terjadi kesalahan pada server. Silakan coba lagi.');
    err.status = 500;
    err.isHttpError = true;
    throw err;
  }

  // 4. Simulation: HTTP Error 404
  if (mode === 'http_404') {
    await sleep(500);
    const err = new Error('Gagal mengambil data kost. Terjadi kesalahan pada server. Silakan coba lagi.');
    err.status = 404;
    err.isHttpError = true;
    throw err;
  }

  // 5. Simulation: Empty State []
  if (mode === 'empty') {
    await sleep(500);
    return [];
  }

  // 6. Normal Flow: Real fetch with AbortController
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const url = `${API_BASE}/posts?_limit=8`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timer);

    // HTTP Error Handling (2xx, 4xx, 5xx)
    if (!response.ok) {
      const httpErr = new Error('Gagal mengambil data kost. Terjadi kesalahan pada server. Silakan coba lagi.');
      httpErr.status = response.status;
      httpErr.isHttpError = true;
      throw httpErr;
    }

    const apiPosts = await response.json();

    // Map fetched API records into complete CariKost models
    const kostList = apiPosts.map((post, idx) => {
      const mockItem = MOCK_KOSTS[idx % MOCK_KOSTS.length];
      return {
        ...mockItem,
        id: `api-kost-${post.id}`,
        apiPostId: post.id,
        // Mandatory fields:
        name: mockItem.name,
        address: mockItem.address,
        area: mockItem.area,
        city: mockItem.city,
        priceMonthly: mockItem.priceMonthly,
        facilities: mockItem.facilities,
        status: mockItem.status, // 'Tersedia' or 'Penuh'
        availableRooms: mockItem.availableRooms,
      };
    });

    return kostList;
  } catch (err) {
    clearTimeout(timer);

    if (err.name === 'AbortError') {
      const timeoutErr = new Error('Waktu permintaan habis. Server terlalu lama merespons.');
      timeoutErr.name = 'TimeoutError';
      timeoutErr.isTimeout = true;
      throw timeoutErr;
    }

    // Check if network failed (offline)
    if (err.message && (err.message.includes('Network request failed') || err.isOffline)) {
      const offlineErr = new Error('Tidak ada koneksi internet. Periksa koneksi Anda dan coba lagi.');
      offlineErr.name = 'OfflineError';
      offlineErr.isOffline = true;
      throw offlineErr;
    }

    throw err;
  }
};

/**
 * Fetch Promo widget data
 * @param {object} options 
 */
export const fetchPromosFromApi = async (options = {}) => {
  const { mode = 'normal' } = options;

  if (mode === 'promo_fail') {
    await sleep(300);
    throw new Error('Server promo sedang dalam perbaikan berkala.');
  }

  await sleep(400);
  return DEFAULT_PROMOS;
};

/**
 * Fetch Notifications widget data
 * @param {object} options 
 */
export const fetchNotificationsFromApi = async (options = {}) => {
  const { mode = 'normal' } = options;

  if (mode === 'notif_fail') {
    await sleep(300);
    throw new Error('Gagal memuat notifikasi terkini.');
  }

  await sleep(350);
  return DEFAULT_NOTIFICATIONS;
};

/**
 * 6. EKSEKUSI PARALEL (Resilient): Dashboard Multi-Widget menggunakan Promise.allSettled()
 * Mengambil daftar kost, promo, dan notifikasi secara bersamaan.
 * Jika salah satu gagal, yang lain tetap tampil!
 * 
 * @param {object} modes
 * @returns {Promise<object>}
 */
export const fetchDashboardWidgetsParallel = async (modes = {}) => {
  const {
    kostMode = 'normal',
    promoMode = 'normal',
    notifMode = 'normal',
  } = modes;

  const startTimestamp = Date.now();

  // Parallel concurrent execution using Promise.allSettled()
  const results = await Promise.allSettled([
    fetchKostsFromApi({ mode: kostMode }),
    fetchPromosFromApi({ mode: promoMode }),
    fetchNotificationsFromApi({ mode: notifMode }),
  ]);

  const durationMs = Date.now() - startTimestamp;

  const [kostResult, promoResult, notifResult] = results;

  return {
    durationMs,
    // Kost list widget
    kosts: {
      status: kostResult.status, // 'fulfilled' | 'rejected'
      data: kostResult.status === 'fulfilled' ? kostResult.value : [],
      error: kostResult.status === 'rejected' ? kostResult.reason : null,
    },
    // Promo widget
    promos: {
      status: promoResult.status,
      data: promoResult.status === 'fulfilled' ? promoResult.value : [],
      error: promoResult.status === 'rejected' ? promoResult.reason : null,
    },
    // Notification widget
    notifications: {
      status: notifResult.status,
      data: notifResult.status === 'fulfilled' ? notifResult.value : [],
      error: notifResult.status === 'rejected' ? notifResult.reason : null,
    },
  };
};

/**
 * 6. EKSEKUSI PARALEL (Fail-Fast / All-or-Nothing): Transaksi Booking Kost via Promise.all()
 * Menjalankan dua proses krusial bersamaan:
 * 1. Cek Ketersediaan Kamar Terkini (Real-time Lock)
 * 2. Pembuatan Order Booking Transaksi
 * 
 * Jika salah satu gagal -> semua dianggap GAGAL dan transaksi dibatalkan!
 * 
 * @param {object} bookingData 
 * @param {boolean} shouldFailRoomCheck 
 * @returns {Promise<object>}
 */
export const executeBookingFailFast = async (bookingData, shouldFailRoomCheck = false) => {
  const checkAvailabilityPromise = async () => {
    await sleep(500);
    if (shouldFailRoomCheck) {
      const err = new Error('Kamar yang dipilih baru saja dipesan oleh pengguna lain (Kamar Penuh).');
      err.code = 'ROOM_UNAVAILABLE';
      throw err;
    }
    return {
      available: true,
      roomId: 'KM-204',
      reservedUntil: new Date(Date.now() + 30 * 60000).toISOString(),
    };
  };

  const createBookingOrderPromise = async () => {
    await sleep(600);
    return {
      bookingId: 'BK-' + Math.floor(100000 + Math.random() * 900000),
      kostName: bookingData.kostName || 'Kost Griya Mahasiswa UI',
      totalAmount: bookingData.totalAmount || 1450000,
      studentName: bookingData.studentName || 'Mahasiswa Demo',
      status: 'MENUNGGU_PEMBAYARAN',
      createdAt: new Date().toISOString(),
    };
  };

  // Promise.all() enforces All-or-Nothing / Fail-Fast
  const [availability, order] = await Promise.all([
    checkAvailabilityPromise(),
    createBookingOrderPromise(),
  ]);

  return {
    success: true,
    availability,
    order,
    message: 'Booking berhasil dikonfirmasi secara serentak.',
  };
};

/**
 * 6. EKSEKUSI BERURUTAN (Serial / Dependent):
 * Menjalankan request yang bergantung pada hasil request sebelumnya.
 * Contoh:
 * const user = await getUser(userId);
 * const kostFavorit = await getKost(user.id);
 * 
 * @param {string|number} userId 
 * @returns {Promise<object>}
 */
export const executeSerialDependentFlow = async (userId = 1) => {
  const timeline = [];

  // Langkah 1: Ambil data User dari server
  const step1Start = Date.now();
  timeline.push({ step: 1, action: 'Meminta profil user dari /users/1...', status: 'loading' });

  const userRes = await fetch(`${API_BASE}/users/${userId}`);
  if (!userRes.ok) {
    throw new Error(`Gagal mengambil data user (HTTP ${userRes.status})`);
  }
  const user = await userRes.json();
  const step1Duration = Date.now() - step1Start;
  timeline.push({
    step: 1,
    action: `User ditemukan: ${user.name} (${user.company?.name || 'Mahasiswa'})`,
    status: 'success',
    durationMs: step1Duration,
  });

  // Langkah 2: Mengambil rekomendasi kost khusus berdasarkan ID user dari langkah 1
  const step2Start = Date.now();
  timeline.push({
    step: 2,
    action: `Meminta kost favorit & rekomendasi berdasarkan userId: ${user.id}...`,
    status: 'loading',
  });

  // Dependent request uses user.id
  const kostRes = await fetch(`${API_BASE}/posts?userId=${user.id}&_limit=3`);
  if (!kostRes.ok) {
    throw new Error(`Gagal mengambil kost favorit user (HTTP ${kostRes.status})`);
  }
  const userPosts = await kostRes.json();
  const step2Duration = Date.now() - step2Start;

  // Enrich with Kost data
  const recommendedKosts = userPosts.map((p, i) => ({
    ...MOCK_KOSTS[i % MOCK_KOSTS.length],
    id: `rec-kost-${p.id}`,
    name: `Kost Favorit Pilihan ${user.name.split(' ')[0]} #${i + 1}`,
  }));

  timeline.push({
    step: 2,
    action: `Berhasil memuat ${recommendedKosts.length} kost rekomendasi untuk ${user.name}`,
    status: 'success',
    durationMs: step2Duration,
  });

  return {
    user,
    recommendedKosts,
    timeline,
    totalDurationMs: step1Duration + step2Duration,
  };
};
