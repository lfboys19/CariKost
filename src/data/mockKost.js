/**
 * Mock data for CariKostan mobile application
 * Rich, realistic data with student-focused honesty metrics
 */

export const MOCK_KOSTS = [
  {
    id: 'kost-1',
    name: 'Kost Griya Mahasiswa UI Melati',
    slug: 'griya-mahasiswa-ui-melati',
    type: 'Putri',
    city: 'Depok',
    area: 'Kukusan Teknik (Kutek), Depok',
    address: 'Jl. Juragan Sinda No. 45, Kukusan, Beji, Kota Depok, Jawa Barat 16425',
    thumbnail: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    status: 'Tersedia',
    availableRooms: 2,
    totalRooms: 14,
    priceMonthly: 1450000,
    roomSize: '3 x 3.5 meter',
    floor: 'Lantai 2',
    windowFacing: 'Jendela luar (menghadap taman)',

    // Honest Rating Breakdown
    ratingOverall: 4.8,
    totalReviews: 24,
    ratings: {
      air: 4.9,
      wifi: 4.7,
      keamanan: 5.0,
      kebersihan: 4.6,
    },

    // Custom Spec Filters
    curfew: 'Bebas 24 Jam',
    curfewNote: 'Masing-masing penghuni dipinjami kunci gerbang fisik & kartu akses pintar.',
    guestRule: 'Lawan Jenis Dilarang Masuk Kamar',
    guestRuleNote: 'Tamu lawan jenis hanya boleh di gazebo/ruang tamu depan sampai jam 21.00 WIB. Teman wanita boleh menginap max 2 malam (lapor pengelola).',

    // Pros & Cons
    pros: [
      'Wi-Fi Fiber Optic 100 Mbps (Lancar untuk Zoom & Gaming)',
      'Air Jetpump sangat jernih, deras, dan tidak berbau besi',
      'Hanya 4 menit jalan kaki ke Pintu Kutek UI',
      'CCTV 24 Jam di 8 titik dan penjaga kos tinggal di lokasi',
      'Dapur bersama luas dilengkapi kompor gas, kulkas, & microwave',
    ],
    cons: [
      'Akses gang masuk agak sempit, mobil harus bergantian lewat',
      'Listrik menggunakan sistem token mandiri tiap kamar (900 VA)',
      'Parkir mobil terbatas hanya muat 2 mobil (harus konfirmasi)',
    ],

    // Real-Condition Photo Gallery (Official vs Real Resident)
    gallery: [
      {
        id: 'g1',
        url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
        caption: 'Foto Kamar Utama (Kondisi Kosong)',
        type: 'official',
        badge: 'Foto Pemilik',
      },
      {
        id: 'g2',
        url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
        caption: 'Kondisi Kamar Asli Saat Dihuni Mahasiswi UI Smst 4',
        type: 'real_resident',
        badge: 'Foto Asli Penghuni 📸',
      },
      {
        id: 'g3',
        url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
        caption: 'Kamar Mandi Dalam Nyata (Kloset Duduk & Shower)',
        type: 'real_resident',
        badge: 'Foto Asli Penghuni 📸',
      },
      {
        id: 'g4',
        url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
        caption: 'Dapur Bersama & Tempat Kulkas Bersama di Lantai 1',
        type: 'real_resident',
        badge: 'Kondisi Asli Dapur',
      },
      {
        id: 'g5',
        url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
        caption: 'Area Parkir Motor Beratap & Berpagar Gembok',
        type: 'real_resident',
        badge: 'Area Parkiran Real',
      },
    ],

    // Transparency Price Breakdown
    priceBreakdown: {
      rent: 1450000,
      electricity: {
        included: false,
        estimatedCost: 'Rp 80.000 - Rp 150.000 / bln',
        note: 'Token PLN 900VA masing-masing kamar, bayar sesuai pemakaian laptop & AC.',
      },
      water: {
        included: true,
        estimatedCost: 'Gratis',
        note: 'Air sumur bor jernih sudah termasuk dalam harga sewa bulanan.',
      },
      maintenance: {
        cost: 25000,
        note: 'Iuran kebersihan lingkungan & sampah per bulan.',
      },
      parking: {
        motor: 'Gratis (Termasuk)',
        car: 'Rp 150.000 / bln (Slot terbatas)',
      },
      deposit: {
        amount: 300000,
        refundable: true,
        note: 'Dikembalikan penuh saat check-out jika tidak ada kerusakan fasilitas kamar.',
      },
    },

    // Facilities
    facilities: [
      { id: 'ac', name: 'AC Dingin 1/2 PK', icon: 'snow-outline' },
      { id: 'bathroom_inside', name: 'Kamar Mandi Dalam', icon: 'water-outline' },
      { id: 'wifi', name: 'Wi-Fi 100 Mbps', icon: 'wifi-outline' },
      { id: 'furnished', name: 'Kasur Springbed + Lemari + Meja Belajar', icon: 'bed-outline' },
      { id: 'parking_motor', name: 'Parkir Motor Luas & Beratap', icon: 'bicycle-outline' },
      { id: 'kitchen', name: 'Dapur Bersama + Gas Gratis', icon: 'restaurant-outline' },
      { id: 'laundry_machine', name: 'Mesin Cuci Bersama', icon: 'shirt-outline' },
      { id: 'cctv', name: 'CCTV 24 Jam & Security', icon: 'shield-checkmark-outline' },
    ],

    // Nearby Places
    nearbyPlaces: [
      {
        id: 'n1',
        name: 'Pintu Masuk Kutek Kampus UI',
        category: 'Kampus',
        distance: '280 m',
        walkTime: '3 menit jalan kaki',
        icon: 'school-outline',
      },
      {
        id: 'n2',
        name: 'CleanWash Laundry Express & Kiloan',
        category: 'Laundry',
        distance: '80 m',
        walkTime: '1 menit jalan kaki',
        icon: 'shirt-outline',
      },
      {
        id: 'n3',
        name: 'Warmindo Putra Kuningan & Warteg Barokah',
        category: 'Kuliner',
        distance: '110 m',
        walkTime: '2 menit jalan kaki',
        icon: 'fast-food-outline',
      },
      {
        id: 'n4',
        name: 'Indomaret Kutek 24 Jam',
        category: 'Minimarket',
        distance: '150 m',
        walkTime: '2 menit jalan kaki',
        icon: 'cart-outline',
      },
      {
        id: 'n5',
        name: 'Stasiun KRL Pondok Cina',
        category: 'Transportasi',
        distance: '1.2 km',
        walkTime: '5 menit ojek motor',
        icon: 'train-outline',
      },
      {
        id: 'n6',
        name: 'Apotek K-24 Margonda',
        category: 'Kesehatan',
        distance: '500 m',
        walkTime: '6 menit jalan kaki',
        icon: 'medkit-outline',
      },
    ],

    // Contact
    ownerName: 'Ibu Hj. Siti Nurhasanah',
    ownerRole: 'Pemilik Kost Langsung',
    ownerPhone: '081289123456',
    ownerWhatsapp: '6281289123456',

    // Reviews
    reviews: [
      {
        id: 'r1',
        userName: 'Aulia Rahmawati',
        userRole: 'Mahasiswi FEB UI (Penghuni 1.5 Tahun)',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
        date: '12 September 2025',
        roomType: 'Kamar Lt. 2 No. 08',
        ratingOverall: 5.0,
        ratings: { air: 5.0, wifi: 5.0, keamanan: 5.0, kebersihan: 5.0 },
        comment: 'Kosan ternyaman selama kuliah di UI! Ibu kos ramah banget suka ngasih takjil/buah. Airnya bening gak bau sama sekali. Wi-fi kencang pas ngerjain skripsi.',
      },
      {
        id: 'r2',
        userName: 'Dinda Permata',
        userRole: 'Mahasiswi Fasilkom UI (Penghuni 8 Bulan)',
        userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80',
        date: '28 Agustus 2025',
        roomType: 'Kamar Lt. 1 No. 03',
        ratingOverall: 4.6,
        ratings: { air: 5.0, wifi: 4.5, keamanan: 5.0, kebersihan: 4.2 },
        comment: 'Nilai plus: bener-bener deket Kutek jalan kaki 3 menit sampai. Nilai minus: kalau bawa mobil pas masuk gang harus sabar kalau papasan motor.',
      },
    ],
  },
  {
    id: 'kost-2',
    name: 'Kost Paviliun Pogung Asri UGM',
    slug: 'kost-paviliun-pogung-asri-ugm',
    type: 'Putra',
    city: 'Yogyakarta',
    area: 'Pogung Dalangan, Sleman (Dekat UGM)',
    address: 'Jl. Pogung Dalangan No. 18B, Sinduadi, Mlati, Sleman, D.I. Yogyakarta 55284',
    thumbnail: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
    status: 'Tersedia',
    availableRooms: 1,
    totalRooms: 12,
    priceMonthly: 1200000,
    roomSize: '3.5 x 4 meter',
    floor: 'Lantai 1',
    windowFacing: 'Jendela menghadap halaman dalam',

    ratingOverall: 4.7,
    totalReviews: 18,
    ratings: {
      air: 4.8,
      wifi: 4.9,
      keamanan: 4.6,
      kebersihan: 4.5,
    },

    curfew: 'Bebas 24 Jam',
    curfewNote: 'Gerbang utama menggunakan Smart Lock PIN elektrik, bebas jam malam mandiri.',
    guestRule: 'Boleh Menginap (Konfirmasi)',
    guestRuleNote: 'Teman sesama pria boleh menginap max 2 malam gratis dengan izin bapak kos.',

    pros: [
      'Akses Smart Lock 24 Jam bebas jam malam untuk anak organisasi/lab',
      'Wi-Fi Indihome 150 Mbps dedicated router tiap lantai',
      'Kamar mandi dalam dengan shower air hangat (Water Heater)',
      'Hanya 5 menit sepedaan ke Fakultas Teknik & MIPA UGM',
    ],
    cons: [
      'Daerah Pogung rawan genangan kecil pas hujan sangat lebat',
      'Sinyal XL di kamar pojok belakang kadang 1-2 bar',
      'Parkir mobil tidak tersedia, khusus motor dan sepeda',
    ],

    gallery: [
      {
        id: 'pg1',
        url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
        caption: 'Kamar Tipe Standar Springbed 120x200',
        type: 'official',
        badge: 'Foto Pemilik',
      },
      {
        id: 'pg2',
        url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
        caption: 'Kondisi Real Kamar Mahasiswa UGM Saat Belajar',
        type: 'real_resident',
        badge: 'Foto Asli Penghuni 📸',
      },
      {
        id: 'pg3',
        url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
        caption: 'Kamar Mandi Dalam Water Heater Nyata',
        type: 'real_resident',
        badge: 'Foto Asli Penghuni 📸',
      },
      {
        id: 'pg4',
        url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
        caption: 'Area Parkir Motor & Akses Pintu Smart Key',
        type: 'real_resident',
        badge: 'Kondisi Pintu Smart',
      },
    ],

    priceBreakdown: {
      rent: 1200000,
      electricity: {
        included: false,
        estimatedCost: 'Rp 60.000 - Rp 120.000 / bln',
        note: 'Token listrik mandiri per kamar (1300 VA).',
      },
      water: {
        included: true,
        estimatedCost: 'Gratis',
        note: 'Air sumur artesis jernih segar Yogyakarta, gratis.',
      },
      maintenance: {
        cost: 20000,
        note: 'Iuran sampah mingguan RT.',
      },
      parking: {
        motor: 'Gratis (Termasuk)',
        car: 'Tidak menerima parkir mobil',
      },
      deposit: {
        amount: 250000,
        refundable: true,
        note: 'Uang jaminan kunci cerdas & fasilitas kamar.',
      },
    },

    facilities: [
      { id: 'ac', name: 'AC Sharp 1/2 PK', icon: 'snow-outline' },
      { id: 'bathroom_inside', name: 'Kamar Mandi Dalam', icon: 'water-outline' },
      { id: 'water_heater', name: 'Water Heater Ariston', icon: 'flame-outline' },
      { id: 'wifi', name: 'Wi-Fi Dedicated 150 Mbps', icon: 'wifi-outline' },
      { id: 'furnished', name: 'Kasur + Meja Belajar + Lemari Jati', icon: 'bed-outline' },
      { id: 'parking_motor', name: 'Parkir Motor Aman Smart Lock', icon: 'bicycle-outline' },
      { id: 'kitchen', name: 'Dapur Bersama + Dispenser Galon', icon: 'restaurant-outline' },
    ],

    nearbyPlaces: [
      {
        id: 'pn1',
        name: 'Fakultas Teknik & MIPA UGM',
        category: 'Kampus',
        distance: '850 m',
        walkTime: '10 menit jalan / 3 mnt motor',
        icon: 'school-outline',
      },
      {
        id: 'pn2',
        name: 'Kopi Klotok & Cafe Pogung 24 Jam',
        category: 'Kuliner',
        distance: '90 m',
        walkTime: '1 menit jalan kaki',
        icon: 'fast-food-outline',
      },
      {
        id: 'pn3',
        name: 'Superindo Kaliurang',
        category: 'Minimarket',
        distance: '600 m',
        walkTime: '3 menit berkendara',
        icon: 'cart-outline',
      },
      {
        id: 'pn4',
        name: 'RSUP Dr. Sardjito',
        category: 'Kesehatan',
        distance: '1.4 km',
        walkTime: '5 menit berkendara',
        icon: 'medkit-outline',
      },
    ],

    ownerName: 'Pak Bambang Susilo',
    ownerRole: 'Pemilik Kos',
    ownerPhone: '081328001122',
    ownerWhatsapp: '6281328001122',

    reviews: [
      {
        id: 'pr1',
        userName: 'Rian Pratama',
        userRole: 'Mahasiswa Teknik Elektro UGM',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
        date: '10 September 2025',
        roomType: 'Kamar No. 05',
        ratingOverall: 4.8,
        ratings: { air: 5.0, wifi: 5.0, keamanan: 4.8, kebersihan: 4.5 },
        comment: 'Sangat direkomendasikan buat mahasiswa yang sering lembur tugas di kampus. Smart door lock bikin gak perlu bangunin bapak kos kalau pulang malam.',
      },
    ],
  },
  {
    id: 'kost-3',
    name: 'Kost Residence Dago Atas ITB',
    slug: 'kost-residence-dago-atas-itb',
    type: 'Campur',
    city: 'Bandung',
    area: 'Coblong / Dago, Bandung (Dekat Kampus ITB Ganesha)',
    address: 'Jl. Tubagus Ismail Raya No. 27, Sekeloa, Coblong, Kota Bandung 40134',
    thumbnail: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    status: 'Tersedia',
    availableRooms: 3,
    totalRooms: 18,
    priceMonthly: 1950000,
    roomSize: '3.5 x 4.5 meter',
    floor: 'Lantai 3',
    windowFacing: 'Jendela balkon pemandangan kota Bandung',

    ratingOverall: 4.9,
    totalReviews: 32,
    ratings: {
      air: 4.9,
      wifi: 4.9,
      keamanan: 5.0,
      kebersihan: 4.8,
    },

    curfew: 'Bebas 24 Jam',
    curfewNote: 'Kartu akses RFID pintu lobby utama, penjaga satpam 24/7.',
    guestRule: 'Hanya di Ruang Tamu',
    guestRuleNote: 'Ruang tamu coworking space bersama di lantai 1 & rooftop lantai 4 sampai jam 23.00.',

    pros: [
      'View estetik pegunungan Bandung & Rooftop Coworking Space',
      'Air panas water heater 24 jam dengan tekanan sangat kencang',
      'Parkir mobil luas di basement (bisa muat 8 mobil)',
      'Sudah termasuk pembersihan kamar 1x seminggu (Cleaning Service)',
    ],
    cons: [
      'Harga relatif premium dibanding kosan sekitar Dago bawah',
      'Jalan Tubagus Ismail cukup padat saat jam berangkat dan pulang kantor',
    ],

    gallery: [
      {
        id: 'dg1',
        url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
        caption: 'Kamar Modern Minimalis dengan Balkon',
        type: 'official',
        badge: 'Foto Pemilik',
      },
      {
        id: 'dg2',
        url: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80',
        caption: 'Kondisi Real Kamar Mandi & Westafel Marmer',
        type: 'real_resident',
        badge: 'Foto Asli Penghuni 📸',
      },
      {
        id: 'dg3',
        url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
        caption: 'Rooftop Coworking Space Tempat Nugas Anak ITB/Unpad',
        type: 'real_resident',
        badge: 'Area Nugas Nyata',
      },
    ],

    priceBreakdown: {
      rent: 1950000,
      electricity: {
        included: true,
        estimatedCost: 'Sudah Termasuk (Limit wajar)',
        note: 'Bebas biaya listrik untuk laptop, kulkas mini, dan AC harian.',
      },
      water: {
        included: true,
        estimatedCost: 'Gratis',
        note: 'Air pegunungan segar Bandung sudah termasuk.',
      },
      maintenance: {
        cost: 0,
        note: 'Gratis, sudah termasuk cleaning service kamar & sampah.',
      },
      parking: {
        motor: 'Gratis',
        car: 'Rp 200.000 / bln di Basement',
      },
      deposit: {
        amount: 500000,
        refundable: true,
        note: 'Deposit kunci kartu RFID & inventaris kamar.',
      },
    },

    facilities: [
      { id: 'ac', name: 'AC Inverter Daikin', icon: 'snow-outline' },
      { id: 'bathroom_inside', name: 'Kamar Mandi Dalam Mewah', icon: 'water-outline' },
      { id: 'water_heater', name: 'Water Heater Central', icon: 'flame-outline' },
      { id: 'wifi', name: 'Wi-Fi Biznet 200 Mbps', icon: 'wifi-outline' },
      { id: 'parking_car', name: 'Basement Parkir Mobil & Motor', icon: 'car-outline' },
      { id: 'kitchen', name: 'Dapur Modern & Kulkas Besar', icon: 'restaurant-outline' },
      { id: 'laundry_machine', name: 'Mesin Cuci Otomatis & Jemuran Luas', icon: 'shirt-outline' },
    ],

    nearbyPlaces: [
      {
        id: 'dn1',
        name: 'Gerbang ITB Ganesha',
        category: 'Kampus',
        distance: '950 m',
        walkTime: '12 menit jalan / 4 mnt motor',
        icon: 'school-outline',
      },
      {
        id: 'dn2',
        name: 'Jl. Dago & Cafe Hits Dago',
        category: 'Kuliner',
        distance: '400 m',
        walkTime: '5 menit jalan kaki',
        icon: 'fast-food-outline',
      },
      {
        id: 'dn3',
        name: 'RS Borromeus Bandung',
        category: 'Kesehatan',
        distance: '1.1 km',
        walkTime: '4 menit ojek motor',
        icon: 'medkit-outline',
      },
    ],

    ownerName: 'Ko Hendra Wijaya',
    ownerRole: 'Building Manager',
    ownerPhone: '081122334455',
    ownerWhatsapp: '6281122334455',

    reviews: [
      {
        id: 'dr1',
        userName: 'Kevin Aditya',
        userRole: 'Mahasiswa STEI ITB',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
        date: '15 Agustus 2025',
        roomType: 'Kamar Lt. 3 No. 302',
        ratingOverall: 5.0,
        ratings: { air: 5.0, wifi: 5.0, keamanan: 5.0, kebersihan: 5.0 },
        comment: 'Fasilitas bener-bener setara apartemen tapi suasana kekeluargaan khas kosan. Wi-fi kenceng bgt jarang gangguan. Rooftopnya the best buat refresh otak!',
      },
    ],
  },
  {
    id: 'kost-4',
    name: 'Kost Mahasiswa Kyai Tapa Trisakti',
    slug: 'kost-mahasiswa-kyai-tapa-trisakti',
    type: 'Campur',
    city: 'Jakarta',
    area: 'Grogol, Jakarta Barat (Dekat Trisakti & Untar)',
    address: 'Jl. Tawakal VI No. 12, Tomang, Grogol Petamburan, Jakarta Barat 11440',
    thumbnail: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
    status: 'Penuh',
    availableRooms: 0,
    totalRooms: 16,
    priceMonthly: 1750000,
    roomSize: '3 x 3 meter',
    floor: 'Lantai 1 & 2',
    windowFacing: 'Jendela lorong berteralis',

    ratingOverall: 4.4,
    totalReviews: 14,
    ratings: {
      air: 4.2,
      wifi: 4.5,
      keamanan: 4.8,
      kebersihan: 4.2,
    },

    curfew: 'Maks 23:00 WIB',
    curfewNote: 'Gerbang utama digembok jam 23.00, pulang lewat jam malam wajib hubungi sekuriti.',
    guestRule: 'Hanya di Ruang Tamu',
    guestRuleNote: 'Tamu dilarang masuk lorong kamar demi privasi bersama.',

    pros: [
      'Jalan kaki 5 menit ke Kampus Trisakti & Kampus 1 UNTAR',
      'Dekat banget Halte Transjakarta Grogol 1 & Mall Ciputra',
      'Keamanan satpam shift malam',
    ],
    cons: [
      'Saat ini kamar terisi penuh (Waiting List)',
      'Air PAM Jakarta saat jam sibuk pagi kadang debitnya agak turun',
      'Jam malam gerbang ditutup jam 23.00',
    ],

    gallery: [
      {
        id: 'tg1',
        url: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
        caption: 'Kondisi Kamar Full Furnished Grogol',
        type: 'official',
        badge: 'Foto Pemilik',
      },
      {
        id: 'tg2',
        url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
        caption: 'Kamar Mandi Dalam Bersih Standar Mahasiswa',
        type: 'real_resident',
        badge: 'Foto Asli Penghuni 📸',
      },
    ],

    priceBreakdown: {
      rent: 1750000,
      electricity: {
        included: false,
        estimatedCost: 'Rp 100.000 - Rp 180.000 / bln',
        note: 'Token PLN per kamar.',
      },
      water: {
        included: true,
        estimatedCost: 'Gratis',
        note: 'Air PAM sudah termasuk sewa bulanan.',
      },
      maintenance: {
        cost: 30000,
        note: 'Iuran sampah pemkot Jakarta Barat.',
      },
      parking: {
        motor: 'Gratis',
        car: 'Tidak ada parkir mobil',
      },
      deposit: {
        amount: 300000,
        refundable: true,
        note: 'Jaminan kerusakan kamar.',
      },
    },

    facilities: [
      { id: 'ac', name: 'AC 1/2 PK', icon: 'snow-outline' },
      { id: 'bathroom_inside', name: 'Kamar Mandi Dalam', icon: 'water-outline' },
      { id: 'wifi', name: 'Wi-Fi 50 Mbps', icon: 'wifi-outline' },
      { id: 'furnished', name: 'Kasur + Lemari + Meja', icon: 'bed-outline' },
      { id: 'parking_motor', name: 'Parkir Motor Khusus Penghuni', icon: 'bicycle-outline' },
    ],

    nearbyPlaces: [
      {
        id: 'tn1',
        name: 'Kampus A Universitas Trisakti',
        category: 'Kampus',
        distance: '350 m',
        walkTime: '4 menit jalan kaki',
        icon: 'school-outline',
      },
      {
        id: 'tn2',
        name: 'Mall Ciputra (Citraland) & Grogol',
        category: 'Minimarket',
        distance: '450 m',
        walkTime: '5 menit jalan kaki',
        icon: 'cart-outline',
      },
      {
        id: 'tn3',
        name: 'Halte Busway TransJakarta Grogol',
        category: 'Transportasi',
        distance: '400 m',
        walkTime: '5 menit jalan kaki',
        icon: 'bus-outline',
      },
    ],

    ownerName: 'Ibu Linda Susanti',
    ownerRole: 'Pemilik Kost',
    ownerPhone: '081798765432',
    ownerWhatsapp: '6281798765432',

    reviews: [
      {
        id: 'tr1',
        userName: 'Budi Santoso',
        userRole: 'Alumni Mahasiswa Trisakti',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
        date: '20 Juli 2025',
        roomType: 'Kamar No. 10',
        ratingOverall: 4.4,
        ratings: { air: 4.0, wifi: 4.5, keamanan: 4.8, kebersihan: 4.2 },
        comment: 'Lokasinya strategis parah buat anak Trisakti dan Untar. Sayang kamarnya cepet banget penuh, harus booking dari jauh-jauh hari.',
      },
    ],
  },
  {
    id: 'kost-5',
    name: 'Kost Muslimah Mulyorejo Kampus C UNAIR',
    slug: 'kost-muslimah-mulyorejo-kampus-c-unair',
    type: 'Putri',
    city: 'Surabaya',
    area: 'Mulyorejo, Surabaya Timur (Dekat Kampus C UNAIR & ITS)',
    address: 'Jl. Mulyorejo Baru No. 8, Mulyorejo, Kota Surabaya, Jawa Timur 60115',
    thumbnail: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
    status: 'Tersedia',
    availableRooms: 4,
    totalRooms: 10,
    priceMonthly: 850000,
    roomSize: '3 x 3 meter',
    floor: 'Lantai 1',
    windowFacing: 'Jendela ventilasi atas',

    ratingOverall: 4.6,
    totalReviews: 11,
    ratings: {
      air: 4.7,
      wifi: 4.4,
      keamanan: 4.8,
      kebersihan: 4.6,
    },

    curfew: 'Maks 22:00 WIB',
    curfewNote: 'Jam malam ketat pukul 22.00 demi kenyamanan dan ketertiban bersama.',
    guestRule: 'Lawan Jenis Dilarang Masuk Kamar',
    guestRuleNote: 'Tamu pria hanya di teras luar, wajib busana sopan.',

    pros: [
      'Harga sangat terjangkau untuk mahasiswa (di bawah 1 juta/bulan)',
      'Lingkungan sangat aman, tenang, dan kondusif untuk belajar',
      'Sudah termasuk listrik & air tanpa tambahan biaya',
      'Hanya 7 menit ke Kampus C UNAIR',
    ],
    cons: [
      'Kamar tipe non-AC (hanya kipas angin)',
      'Kamar mandi luar (bersih 1 kamar mandi untuk 2 kamar)',
      'Jam malam ketat jam 22.00',
    ],

    gallery: [
      {
        id: 'ug1',
        url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
        caption: 'Kamar Sederhana Rapi dengan Meja Belajar',
        type: 'official',
        badge: 'Foto Kamar',
      },
      {
        id: 'ug2',
        url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
        caption: 'Kondisi Kamar Mandi Luar Bersih & Terawat',
        type: 'real_resident',
        badge: 'Foto Asli Penghuni 📸',
      },
    ],

    priceBreakdown: {
      rent: 850000,
      electricity: {
        included: true,
        estimatedCost: 'Gratis',
        note: 'Termasuk listrik untuk kipas angin, laptop, dan charger HP.',
      },
      water: {
        included: true,
        estimatedCost: 'Gratis',
        note: 'Air PDAM Surabaya lancar.',
      },
      maintenance: {
        cost: 0,
        note: 'Semua biaya kebersihan ditanggung ibu kos.',
      },
      parking: {
        motor: 'Gratis (Garasi tertutup)',
        car: 'Tidak ada slot mobil',
      },
      deposit: {
        amount: 200000,
        refundable: true,
        note: 'Deposit kunci.',
      },
    },

    facilities: [
      { id: 'wifi', name: 'Wi-Fi 30 Mbps', icon: 'wifi-outline' },
      { id: 'furnished', name: 'Kasur + Lemari + Meja Belajar', icon: 'bed-outline' },
      { id: 'parking_motor', name: 'Garasi Motor Tertutup & Kunci Ganda', icon: 'bicycle-outline' },
      { id: 'kitchen', name: 'Dapur Bersama Sederhana', icon: 'restaurant-outline' },
    ],

    nearbyPlaces: [
      {
        id: 'un1',
        name: 'Kampus C UNAIR Surabaya',
        category: 'Kampus',
        distance: '900 m',
        walkTime: '10 menit jalan / 3 mnt motor',
        icon: 'school-outline',
      },
      {
        id: 'un2',
        name: 'Pusat Kuliner Mulyorejo & Bebek Palupi',
        category: 'Kuliner',
        distance: '200 m',
        walkTime: '2 menit jalan kaki',
        icon: 'fast-food-outline',
      },
      {
        id: 'un3',
        name: 'RS Khusus Infeksi UNAIR',
        category: 'Kesehatan',
        distance: '1.0 km',
        walkTime: '4 menit motor',
        icon: 'medkit-outline',
      },
    ],

    ownerName: 'Ibu Hj. Farida',
    ownerRole: 'Ibu Kost',
    ownerPhone: '085712345678',
    ownerWhatsapp: '6285712345678',

    reviews: [
      {
        id: 'ur1',
        userName: 'Annisa Nurul',
        userRole: 'Mahasiswi Farmasi UNAIR',
        userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
        date: '02 September 2025',
        roomType: 'Kamar No. 02',
        ratingOverall: 4.7,
        ratings: { air: 5.0, wifi: 4.2, keamanan: 5.0, kebersihan: 4.8 },
        comment: 'Sangat cocok untuk mahasiswi yang nyari kos murah meriah tapi aman dan bersih banget. Ibu kos keibuan sekali.',
      },
    ],
  },
];

export const CITIES = ['Semua Kota', 'Depok', 'Yogyakarta', 'Bandung', 'Jakarta', 'Surabaya'];

export const KOST_TYPES = ['Semua Tipe', 'Putri', 'Putra', 'Campur'];

export const CURFEW_OPTIONS = [
  'Semua Jam Malam',
  'Bebas 24 Jam',
  'Maks 23:00 WIB',
  'Maks 22:00 WIB',
];

export const GUEST_RULES = [
  'Semua Aturan Tamu',
  'Boleh Menginap (Konfirmasi)',
  'Hanya di Ruang Tamu',
  'Lawan Jenis Dilarang Masuk Kamar',
];

export const POPULAR_FACILITIES = [
  { id: 'ac', label: 'AC', icon: 'snow-outline' },
  { id: 'bathroom_inside', label: 'KM Dalam', icon: 'water-outline' },
  { id: 'wifi', label: 'Wi-Fi Cepat', icon: 'wifi-outline' },
  { id: 'parking_motor', label: 'Parkir Motor', icon: 'bicycle-outline' },
  { id: 'parking_car', label: 'Parkir Mobil', icon: 'car-outline' },
  { id: 'kitchen', label: 'Dapur', icon: 'restaurant-outline' },
  { id: 'water_heater', label: 'Water Heater', icon: 'flame-outline' },
  { id: 'laundry_machine', label: 'Mesin Cuci', icon: 'shirt-outline' },
];
