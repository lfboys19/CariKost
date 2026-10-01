/**
 * Form and input validation helpers for CariKostan
 */

export const validateEmail = (email) => {
  if (!email || !email.trim()) {
    return 'Email tidak boleh kosong';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Format email tidak valid (contoh: mhs@kampus.ac.id)';
  }
  return null;
};

export const checkPasswordStrength = (password) => {
  if (!password) {
    return {
      score: 0,
      label: 'Kosong',
      color: '#94A3B8',
      isValid: false,
      message: 'Password wajib diisi minimal 6 karakter',
    };
  }

  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 8) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (password.length < 6) {
    return {
      score: 1,
      label: 'Terlalu Pendek',
      color: '#EF4444',
      isValid: false,
      message: 'Minimal 6 karakter',
    };
  }

  if (score <= 2) {
    return {
      score: 2,
      label: 'Lemah',
      color: '#F97316',
      isValid: true,
      message: 'Kombinasikan huruf besar, angka, atau simbol',
    };
  } else if (score <= 3) {
    return {
      score: 3,
      label: 'Cukup Kuat',
      color: '#EAB308',
      isValid: true,
      message: 'Kombinasi sandi sudah cukup baik',
    };
  } else {
    return {
      score: 4,
      label: 'Sangat Kuat',
      color: '#10B981',
      isValid: true,
      message: 'Sandi aman dan terenkripsi',
    };
  }
};

export const validatePhone = (phone) => {
  if (!phone || !phone.trim()) {
    return 'Nomor telepon/WhatsApp wajib diisi';
  }
  const cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.length < 9 || cleaned.length > 14) {
    return 'Nomor HP tidak valid (9 - 14 digit)';
  }
  return null;
};

export const formatRupiah = (amount) => {
  if (amount === undefined || amount === null) return 'Rp 0';
  return 'Rp ' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const cleanWhatsAppNumber = (phone) => {
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1);
  } else if (!cleaned.startsWith('62')) {
    cleaned = '62' + cleaned;
  }
  return cleaned;
};
