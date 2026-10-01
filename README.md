# 🏡 CariKostan - Aplikasi Pencari Kos Mahasiswa Berbasis Ulasan Jujur & Kondisi Nyata

**CariKostan** adalah aplikasi mobile React Native (Expo Go) yang dirancang khusus untuk memecahkan keresahan mahasiswa dalam mencari tempat tinggal/kos. Aplikasi ini mengedepankan **transparansi harga**, **ulasan jujur 4 kategori**, dan **galeri foto kondisi nyata penghuni** tanpa rekayasa pemilik kos.

---

## 🚀 Panduan Menjalankan Aplikasi (Plug-and-Play di Expo Go)

Proyek ini telah dikonfigurasi dan diverifikasi penuh (`21/21 checks passed` di Expo Doctor & lolos kompilasi bundle Metro Android/iOS).

### 1. Prasyarat
- Pasang aplikasi **Expo Go** dari Google Play Store (Android) atau App Store (iOS) pada smartphone Anda.
- Pastikan smartphone dan komputer terhubung pada jaringan Wi-Fi yang sama (atau gunakan mode tunnel).

### 2. Jalankan Server Dev Expo
Buka terminal di direktori proyek:
```bash
npx expo start
```
*(Atau `npx expo start -c` untuk membersihkan cache).*

### 3. Hubungkan ke Smartphone
- **Android**: Buka aplikasi **Expo Go** di smartphone, lalu pilih **Scan QR Code** dan arahkan kamera ke QR code di terminal atau browser.
- **iOS**: Buka aplikasi Kamera bawaan iPhone, scan QR code, lalu ketuk banner notifikasi untuk membuka di **Expo Go**.
- **Web Browser (Opsional)**: Tekan huruf `w` pada terminal untuk membuka pratinjau browser.

---

## 🔑 Akun Uji Coba Cepat (Demo Login)
Pada halaman login, terdapat tombol khusus:
👉 **"Masuk Sebagai Mahasiswa Demo (1-Tap)"**  
Tombol ini memungkinkan Anda langsung mengevaluasi seluruh fitur aplikasi tanpa harus mengetik manual.

Untuk mendaftar akun baru secara manual:
- Buka tautan **"Daftar di sini"** di bawah form login.
- Tersedia validasi format email, nomor WhatsApp, serta indikator kekuatan kata sandi dinamis (*Dynamic Password Strength Meter*).

---

## 📁 Struktur Folder Proyek Modular

```
CariKost/
├── App.js                         # Root App Provider (SafeArea, Auth, Bookmark, Navigator)
├── app.json                       # Konfigurasi Expo & Plugin SecureStore
├── package.json                   # Dependensi Expo SDK 57 kompatibel
├── src/
│   ├── theme/
│   │   └── colors.js              # Desain token, tema warna ramah mahasiswa, bayangan
│   ├── utils/
│   │   ├── storage.js             # Enkripsi & Secure Storage (expo-secure-store + cross-platform fallback)
│   │   └── validation.js          # Helper validasi email, password strength, format rupiah, WhatsApp cleaner
│   ├── data/
│   │   └── mockKost.js            # Mock data realistis kos mahasiswa (UI Depok, UGM, ITB, Trisakti, UNAIR)
│   ├── context/
│   │   ├── AuthContext.js         # Global Auth state (login, register, logout, token session)
│   │   └── BookmarkContext.js     # Saved posts state management dengan persistensi storage
│   ├── components/
│   │   ├── Button.js              # Tombol modular (primary, outline, danger, loading, aksesibilitas)
│   │   ├── Input.js               # Kolom teks modular (ikon, toggle password, pesan validasi)
│   │   ├── CardKos.js             # Kartu kos interaktif (rating jujur, bookmark toggle, badge, harga)
│   │   ├── RatingStars.js         # Bintang rating interaktif & progress bar rincian 4 kategori
│   │   ├── FilterBadge.js         # Pill filter aktif/inaktif, gender badge, availability tag, pros/cons
│   │   ├── Header.js              # Navigasi header modular ramah aksesibilitas
│   │   ├── PhotoGalleryModal.js   # Modal galeri foto: Foto Resmi vs Kondisi Nyata Penghuni 📸
│   │   └── AddReviewModal.js      # Modal form menulis ulasan jujur spesifik per kategori
│   ├── screens/
│   │   ├── LoginScreen.js         # Halaman login dengan validasi & demo 1-tap
│   │   ├── RegisterScreen.js      # Halaman register dengan password strength meter & role selector
│   │   ├── HomeScreen.js          # Beranda: filter cepat, tips mahasiswa, kos terpopuler & terverifikasi
│   │   ├── SearchFilterScreen.js  # Filter spesifikasi (lokasi, jam malam, tamu, fasilitas, ketersediaan)
│   │   ├── DetailKostScreen.js    # Detail kos komprehensif (11 fitur lengkap)
│   │   ├── SavedScreen.js         # Halaman kos tersimpan (favorit) & filter pencarian
│   │   └── ProfileScreen.js       # Profil mahasiswa, status SecureStore, dan logout
│   └── navigation/
│       └── AppNavigator.js        # Navigasi terproteksi (Auth Stack + Main Bottom Tabs + Detail Stack)
```

---

## 🌟 Implementasi 11 Fitur Utama

1. **Honest Review & Rating**:  
   Skor ulasan dipecah ke dalam 4 kategori penting mahasiswa: **Air & Saluran**, **Wi-Fi & Sinyal**, **Keamanan**, dan **Kebersihan**. Pengguna dapat menambahkan review jujur langsung melalui modal form.
2. **Custom Spec Filter**:  
   Filter jam malam (*Bebas 24 Jam, Kunci Mandiri, Maks 22.00/23.00*), aturan membawa tamu (*Boleh Menginap, Hanya di Ruang Tamu, Lawan Jenis Dilarang Masuk Kamar*), rentang harga, dan tipe kos (*Putri, Putra, Campur*).
3. **Pros & Cons Tagging**:  
   Badge visual berlabel hijau untuk poin plus (*"Wi-Fi 100 Mbps", "Air Jetpump Jernih"*) dan merah/amber untuk catatan minus (*"Akses Gang Sempit", "Listrik Token Mandiri"*).
4. **Real-Condition Photo Gallery**:  
   Tombol *"Lihat Galeri Foto Kondisi Nyata Penghuni 📸"* membuka viewer khusus untuk membandingkan foto promosi pemilik vs foto asli penghuni.
5. **Transparansi Harga & Kalkulator**:  
   Rincian harga sewa, listrik, air, iuran sampah, parkir, dan uang jaminan/deposit. Dilengkapi kalkulator estimasi total pembayaran bulan pertama.
6. **Bookmark / Saved Posts**:  
   Fitur simpan kos dengan ikon hati yang tersimpan secara persisten menggunakan `SecureStorage`.
7. **Tombol Kontak**:  
   - Tombol **"Chat WhatsApp"** langsung membuka aplikasi WhatsApp via `Linking API` lengkap dengan pesan pembuka otomatis menyebutkan nama kos.  
   - Tombol **"Telepon"** untuk panggilan seluler langsung ke pengelola kos.
8. **Status Ketersediaan Kamar**:  
   Indikator visual dinamis: *"Tersedia (Sisa 2 Kamar)"*, *"Sisa 1 Kamar!"*, atau *"Kamar Penuh"*.
9. **Filter Fasilitas Utama**:  
   Toggle instan untuk fasilitas esensial: AC, Kamar Mandi Dalam, Wi-Fi Cepat, Dapur Bersama, Parkir Mobil/Motor, Water Heater, dan Mesin Cuci.
10. **Rekomendasi Tempat Terdekat**:  
    Jarak dan estimasi waktu tempuh jalan kaki/motor ke kampus utama, laundry kiloan, warmindo/kuliner, minimarket 24 jam, dan transportasi umum (KRL/Halte).
11. **Share Link**:  
    Tombol bagikan ringkasan info kos melalui `Share.share()` ke WhatsApp, Telegram, atau media sosial.

---

## 🛡️ Keamanan & Aksesibilitas

- **Keamanan Kredensial**: Menggunakan `expo-secure-store` untuk mengenkripsi token sesi dan data sensitif pengguna.
- **Proteksi Rute Navigasi**: Halaman utama tidak dapat diakses tanpa token autentikasi valid.
- **Aksesibilitas Lengkap**: Setiap elemen interaktif telah dilengkapi dengan properti `accessible`, `accessibilityRole`, `accessibilityLabel`, dan `accessibilityHint`.
