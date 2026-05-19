/* ============================================================
   DRIVEEASE — tiers.js
   Definisi tier fasilitas / premium (fitur & pengali harga)
   ============================================================ */

export const TIER_CATALOG = [
  {
    id: 'hemat',
    name: 'Hemat',
    multiplier: 1.0,
    driverDiscountPercent: 0,
    tagline: 'Mobil + asuransi dasar, hemat untuk perjalanan singkat',
    features: [
      'Mobil dalam kondisi prima',
      'Asuransi dasar termasuk',
      'Bensin tidak termasuk',
      'Dukungan hotline 24 jam',
    ],
  },
  {
    id: 'reguler',
    name: 'Reguler',
    multiplier: 1.15,
    driverDiscountPercent: 0,
    tagline: 'Kenyamanan standar dengan tambahan kecil di perjalanan',
    features: [
      'Semua fasilitas Hemat',
      'Snack ringan & air mineral',
      'Pembersihan interior standar',
      'Prioritas penjadwalan pickup',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    multiplier: 1.3,
    driverDiscountPercent: 0,
    tagline: 'Perjalanan lebih nyaman dengan fasilitas tambahan',
    features: [
      'Semua fasilitas Reguler',
      'Bantal leher & selimut ringan',
      'Voucher BBM setengah tangki',
      'Snack premium',
      'Armada prioritas',
    ],
  },
  {
    id: 'vip',
    name: 'VIP',
    multiplier: 1.5,
    driverDiscountPercent: 100,
    tagline: 'Pengalaman sewa paling lengkap',
    features: [
      'Semua fasilitas Premium',
      'Bensin full tank',
      'Snack & minuman premium di mobil',
      'Perlengkapan tidur lengkap',
      'Diskon sopir 100% (gratis jika dipilih)',
      'Layanan concierge prioritas',
    ],
  },
];

export const DRIVER_FEE_PER_DAY = 200000;
export const INSURANCE_BASIC_PER_DAY = 50000;
export const INSURANCE_COMPREHENSIVE_PER_DAY = 75000;

export const LEGACY_PACKAGE_SLUG = {
  harian:   'hemat',
  fullday:  'reguler',
  fullday24: 'reguler',
  weekend:  'premium',
  weekly:   'vip',
};
