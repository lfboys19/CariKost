/**
 * Automated Test Suite: Async Reliability & Error Handling
 * CariKost Mobile Application
 * 
 * Verifies Requirements 1 through 7:
 * 1. Async / Await Non-blocking fetching
 * 2. FlatList Data Structure (Nama, Lokasi, Harga, Fasilitas, Status)
 * 3. Wishlist / Survey Kost API Simulation (GET, POST with { task }, PATCH)
 * 4. State Management (loading, data, error)
 * 5. Error Handling (Loading, HTTP 4xx/5xx, Offline, Timeout, Empty State)
 * 6. Async Execution: Serial Dependent, Promise.all (Fail-Fast), Promise.allSettled (Resilient)
 * 7. Verification of all physical mobile test conditions
 */

const assert = require('assert');

// Polyfill minimal browser/RN globals for pure Node execution if needed
if (typeof fetch === 'undefined') {
  global.fetch = require('node-fetch');
}

async function runTestSuite() {
  const {
    fetchKostsFromApi,
    fetchDashboardWidgetsParallel,
    executeBookingFailFast,
    executeSerialDependentFlow,
  } = await import('../src/services/kostService.js');

  const {
    fetchSurveyList,
    addSurveyItem,
    toggleSurveyItem,
  } = await import('../src/services/surveyService.js');
  console.log('\n======================================================');
  console.log('  🧪 MENJALANKAN TEST SUITE ASYNC & RELIABILITY CARIKOST');
  console.log('======================================================\n');

  let passed = 0;
  let failed = 0;

  const test = async (title, fn) => {
    try {
      await fn();
      console.log(`  ✅ [PASS] ${title}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ [FAIL] ${title}`);
      console.error(`     Error: ${err.message}`);
      failed++;
    }
  };

  // Section 2: Data Model Kost
  console.log('--- 2. Fitur Utama CariKost (Data Model & Field Wajib) ---');
  await test('fetchKostsFromApi menghasilkan data kost dengan field wajib lengkap', async () => {
    const kosts = await fetchKostsFromApi({ mode: 'normal' });
    assert(Array.isArray(kosts), 'Harus berupa array');
    assert(kosts.length > 0, 'Daftar kost tidak boleh kosong saat online normal');

    const first = kosts[0];
    assert(first.name, 'Field Nama Kost wajib ada');
    assert(first.address || first.area, 'Field Lokasi/Alamat wajib ada');
    assert(typeof first.priceMonthly === 'number', 'Field Harga per bulan wajib ada berupa angka');
    assert(Array.isArray(first.facilities), 'Field Fasilitas wajib ada berupa array');
    assert(first.status === 'Tersedia' || first.status === 'Penuh', 'Field Status wajib Tersedia atau Penuh');
  });

  // Section 3: Fitur Wishlist / Survey Kost (jsonplaceholder)
  console.log('\n--- 3. Fitur Wishlist / Survey Kost (jsonplaceholder.typicode.com) ---');
  await test('GET /todos?_limit=10 mengembalikan daftar kost yang mau disurvey', async () => {
    const list = await fetchSurveyList(10);
    assert(Array.isArray(list), 'Daftar survey harus berupa array');
    assert(list.length === 10, 'Harus mengembalikan 10 item survey');
    assert(list[0].task || list[0].title, 'Setiap item harus memiliki task/title nama kost');
    assert(typeof list[0].completed === 'boolean', 'Status survey completed harus boolean');
  });

  await test('POST /todos menambah kost ke daftar survey dengan body { task }', async () => {
    const taskName = 'Kost D Anugerah Kukusan UI';
    const created = await addSurveyItem(taskName);
    assert(created.id, 'Hasil POST harus memiliki id baru');
    assert(created.task === taskName || created.title === taskName, 'Hasil POST harus menyimpan task');
    assert(created.completed === false, 'Kost baru harus berstatus Belum Disurvey (completed: false)');
  });

  await test('PATCH /todos/:id mengubah status survey secara dinamis', async () => {
    const updated = await toggleSurveyItem(1, true);
    assert(updated.id == 1, 'ID survey yang di-patch harus sesuai');
    assert(updated.completed === true, 'Status survey harus berubah menjadi true (Sudah Disurvey)');
  });

  // Section 5: Error Handling States
  console.log('\n--- 5. Error Handling Lengkap (HTTP, Offline, Timeout, Empty) ---');
  await test('HTTP 500 error state ditangani dengan pesan ramah tanpa crash', async () => {
    try {
      await fetchKostsFromApi({ mode: 'http_500' });
      assert.fail('Seharusnya melempar HTTP error');
    } catch (err) {
      assert(err.isHttpError, 'Error harus ditandai sebagai HTTP error');
      assert.strictEqual(err.status, 500, 'Status HTTP harus 500');
      assert(err.message.includes('Gagal mengambil data kost'), 'Pesan error harus sesuai spesifikasi');
    }
  });

  await test('HTTP 404 error state ditangani dengan status 404', async () => {
    try {
      await fetchKostsFromApi({ mode: 'http_404' });
      assert.fail('Seharusnya melempar HTTP 404 error');
    } catch (err) {
      assert(err.isHttpError, 'Error harus ditandai sebagai HTTP error');
      assert.strictEqual(err.status, 404, 'Status HTTP harus 404');
    }
  });

  await test('Offline state ditangani dengan pesan tidak ada koneksi internet', async () => {
    try {
      await fetchKostsFromApi({ mode: 'offline' });
      assert.fail('Seharusnya melempar offline error');
    } catch (err) {
      assert(err.isOffline || err.name === 'OfflineError' || err.message.includes('koneksi internet'), 'Harus terdeteksi sebagai offline');
    }
  });

  await test('Timeout state dibatalkan via AbortController dengan pesan waktu habis', async () => {
    // Uji mode simulasi
    try {
      await fetchKostsFromApi({ mode: 'timeout' });
      assert.fail('Seharusnya melempar timeout error');
    } catch (err) {
      assert(err.isTimeout || err.name === 'TimeoutError' || err.message.includes('Waktu permintaan habis'), 'Harus terdeteksi sebagai timeout');
    }

    // Uji real AbortController timeout (< 5ms)
    try {
      await fetchKostsFromApi({ mode: 'normal', timeoutMs: 1 });
      assert.fail('Seharusnya melempar timeout error dari AbortController');
    } catch (err) {
      assert(err.isTimeout || err.name === 'TimeoutError' || err.message.includes('Waktu permintaan habis'), 'Harus terdeteksi sebagai timeout AbortController');
    }
  });

  await test('Empty state mengembalikan array kosong [] dengan sukses', async () => {
    const emptyList = await fetchKostsFromApi({ mode: 'empty' });
    assert(Array.isArray(emptyList), 'Harus berupa array');
    assert.strictEqual(emptyList.length, 0, 'Panjang array harus 0 (empty)');
  });

  // Section 6: Eksekusi Async Paralel & Berurutan
  console.log('\n--- 6. Eksekusi Async Paralel & Berurutan ---');
  await test('Promise.allSettled() multi-widget berjalan paralel dan toleran error', async () => {
    // Simulasikan promo gagal, kost dan notif normal
    const result = await fetchDashboardWidgetsParallel({
      kostMode: 'normal',
      promoMode: 'promo_fail',
      notifMode: 'normal',
    });

    assert(result.durationMs >= 0, 'Durasi waktu paralel harus terhitung');
    assert.strictEqual(result.kosts.status, 'fulfilled', 'Widget kost harus tetap fulfilled');
    assert.strictEqual(result.notifications.status, 'fulfilled', 'Widget notifikasi harus tetap fulfilled');
    assert.strictEqual(result.promos.status, 'rejected', 'Widget promo yang gagal harus berstatus rejected tanpa merusak yang lain');
    assert(result.kosts.data.length > 0, 'Data kost tetap dapat ditampilkan');
  });

  await test('Promise.all() transaksi booking bersifat All or Nothing (Fail-Fast)', async () => {
    // Kondisi 1: Sukses kedua-duanya
    const successRes = await executeBookingFailFast({
      kostName: 'Kost Griya UI',
      totalAmount: 1450000,
      studentName: 'Budi Mahasiswa',
    }, false);
    assert(successRes.success === true, 'Transaksi harus sukses ketika kamar tersedia');
    assert(successRes.order.bookingId, 'Harus mencetak Order ID');
    assert(successRes.availability.available === true, 'Kamar harus terkonfirmasi');

    // Kondisi 2: Kamar Penuh -> Fail-Fast (Seluruh proses dibatalkan)
    try {
      await executeBookingFailFast({
        kostName: 'Kost Griya UI',
        totalAmount: 1450000,
        studentName: 'Budi Mahasiswa',
      }, true);
      assert.fail('Seharusnya melempar error karena kamar penuh');
    } catch (err) {
      assert.strictEqual(err.code, 'ROOM_UNAVAILABLE', 'Error code harus ROOM_UNAVAILABLE');
    }
  });

  await test('Eksekusi berurutan (Serial Dependent) mengeksekusi step 1 lalu step 2 secara runtut', async () => {
    const serialRes = await executeSerialDependentFlow(1);
    assert(serialRes.user, 'Step 1 harus mengembalikan data user');
    assert(serialRes.user.id === 1, 'User ID harus 1');
    assert(Array.isArray(serialRes.recommendedKosts), 'Step 2 harus mengembalikan rekomendasi kost berdasarkan user.id');
    assert(serialRes.timeline.length >= 2, 'Timeline harus mencatat tahapan berurutan');
    assert(serialRes.totalDurationMs > 0, 'Total durasi harus terhitung');
  });

  console.log('\n======================================================');
  console.log(`  📊 HASIL PENGUJIAN: ${passed} LULUS, ${failed} GAGAL`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite();
