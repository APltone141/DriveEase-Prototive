/* ============================================================
   DRIVEEASE — cars.js
   Dummy product data — 9 mobil
   ============================================================ */

import { getCarPackages, getLowestTierPrice } from './pricing.js';

const CARS_DATA = [
  {
    id:              'car_001',
    name:            'Toyota Innova Zenix',
    brand:           'Toyota',
    type:            'MPV',
    year:            2024,
    seats:           7,
    transmission:    'Automatic',
    fuel:            'Hybrid',
    ac:              true,
    withDriver:      true,
    selfDrive:       true,
    pricePerDay:     450000,
    priceWithDriver: 650000,
    deposit:         1000000,
    rating:          4.8,
    reviewCount:     243,
    featured:        true,
    badge:           'Terlaris',
    images: [
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
    ],
    specs: {
      engine:    '2.0L Hybrid TNGA',
      maxSpeed:  '180 km/h',
      luggage:   '3 koper besar',
      bluetooth: true,
      usb:       true,
      gps:       false,
    },
    location:    'Jakarta, Surabaya, Bali',
    available:   true,
    description: 'Toyota Innova Zenix generasi terbaru hadir dengan platform TNGA dan mesin hybrid yang efisien. Kabin luas berteknologi tinggi menjadikannya pilihan sempurna untuk perjalanan keluarga maupun bisnis.',
  },

  {
    id:              'car_002',
    name:            'Honda CR-V',
    brand:           'Honda',
    type:            'SUV',
    year:            2023,
    seats:           5,
    transmission:    'Automatic',
    fuel:            'Petrol',
    ac:              true,
    withDriver:      true,
    selfDrive:       true,
    pricePerDay:     500000,
    priceWithDriver: 700000,
    deposit:         1500000,
    rating:          4.7,
    reviewCount:     187,
    featured:        true,
    badge:           'Pilihan Utama',
    images: [
      'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&q=80',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80',
    ],
    specs: {
      engine:    '1.5L VTEC Turbo',
      maxSpeed:  '190 km/h',
      luggage:   '2 koper besar',
      bluetooth: true,
      usb:       true,
      gps:       true,
    },
    location:    'Jakarta, Bandung, Bali',
    available:   true,
    description: 'Honda CR-V Turbo menawarkan perpaduan sempurna antara performa dan kenyamanan. Dilengkapi Honda Sensing dan kabin premium untuk pengalaman berkendara terbaik.',
  },

  {
    id:              'car_003',
    name:            'Toyota Avanza',
    brand:           'Toyota',
    type:            'MPV',
    year:            2023,
    seats:           7,
    transmission:    'Automatic',
    fuel:            'Petrol',
    ac:              true,
    withDriver:      true,
    selfDrive:       true,
    pricePerDay:     250000,
    priceWithDriver: 400000,
    deposit:         500000,
    rating:          4.5,
    reviewCount:     412,
    featured:        false,
    badge:           'Hemat',
    images: [
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&q=80',
      'https://images.unsplash.com/photo-1485291571150-772bcfc10da5?w=800&q=80',
    ],
    specs: {
      engine:    '1.5L Dual VVT-i',
      maxSpeed:  '160 km/h',
      luggage:   '2 koper sedang',
      bluetooth: true,
      usb:       true,
      gps:       false,
    },
    location:    'Jakarta, Surabaya, Yogyakarta, Medan',
    available:   true,
    description: 'Toyota Avanza adalah pilihan ekonomis terpercaya untuk perjalanan keluarga. Kapasitas 7 penumpang dengan konsumsi BBM yang efisien menjadikannya favorit di seluruh Indonesia.',
  },

  {
    id:              'car_004',
    name:            'Mitsubishi Pajero Sport',
    brand:           'Mitsubishi',
    type:            'SUV',
    year:            2024,
    seats:           7,
    transmission:    'Automatic',
    fuel:            'Diesel',
    ac:              true,
    withDriver:      true,
    selfDrive:       true,
    pricePerDay:     750000,
    priceWithDriver: 1000000,
    deposit:         2000000,
    rating:          4.9,
    reviewCount:     98,
    featured:        true,
    badge:           'Premium',
    images: [
      'https://www.carscoops.com/wp-content/uploads/2024/05/2024-Mitsubishi-Pajero-Sport-GSR-Australia-1s.jpg',
      'https://images.unsplash.com/photo-1471444928139-48c5bf5173f8?w=800&q=80',
    ],
    specs: {
      engine:    '2.4L MIVEC Diesel Turbo',
      maxSpeed:  '195 km/h',
      luggage:   '3 koper besar',
      bluetooth: true,
      usb:       true,
      gps:       true,
    },
    location:    'Jakarta, Bali, Lombok',
    available:   true,
    description: 'Mitsubishi Pajero Sport hadir sebagai SUV premium dengan kemampuan off-road yang tangguh. Teknologi Super Select 4WD dan interior mewah membuatnya ideal untuk petualangan maupun acara formal.',
  },

  {
    id:              'car_005',
    name:            'Toyota Fortuner',
    brand:           'Toyota',
    type:            'SUV',
    year:            2023,
    seats:           7,
    transmission:    'Automatic',
    fuel:            'Diesel',
    ac:              true,
    withDriver:      true,
    selfDrive:       true,
    pricePerDay:     650000,
    priceWithDriver: 850000,
    deposit:         1500000,
    rating:          4.8,
    reviewCount:     156,
    featured:        false,
    badge:           null,
    images: [
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80',
      'https://images.unsplash.com/photo-1546614042-7df3c24c9e5d?w=800&q=80',
    ],
    specs: {
      engine:    '2.4L 2GD-FTV Diesel',
      maxSpeed:  '185 km/h',
      luggage:   '3 koper besar',
      bluetooth: true,
      usb:       true,
      gps:       true,
    },
    location:    'Jakarta, Surabaya, Makassar',
    available:   true,
    description: 'Toyota Fortuner tetap menjadi ikon SUV tangguh dengan kombinasi daya angkut besar, kenyamanan tinggi, dan kemampuan segala medan. Pilihan terpercaya untuk perjalanan jauh.',
  },

  {
    id:              'car_006',
    name:            'Suzuki Ertiga',
    brand:           'Suzuki',
    type:            'MPV',
    year:            2023,
    seats:           7,
    transmission:    'Automatic',
    fuel:            'Petrol',
    ac:              true,
    withDriver:      true,
    selfDrive:       true,
    pricePerDay:     280000,
    priceWithDriver: 430000,
    deposit:         600000,
    rating:          4.6,
    reviewCount:     224,
    featured:        false,
    badge:           null,
    images: [
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80',
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80',
    ],
    specs: {
      engine:    '1.5L K15B Smart Hybrid',
      maxSpeed:  '165 km/h',
      luggage:   '2 koper sedang',
      bluetooth: true,
      usb:       true,
      gps:       false,
    },
    location:    'Jakarta, Bandung, Semarang',
    available:   true,
    description: 'Suzuki Ertiga Smart Hybrid menggabungkan efisiensi bahan bakar terbaik di kelasnya dengan kenyamanan kabin luas. Cocok untuk perjalanan keluarga dengan budget yang lebih hemat.',
  },

  {
    id:              'car_007',
    name:            'Honda Brio',
    brand:           'Honda',
    type:            'City Car',
    year:            2023,
    seats:           4,
    transmission:    'Automatic',
    fuel:            'Petrol',
    ac:              true,
    withDriver:      false,
    selfDrive:       true,
    pricePerDay:     180000,
    priceWithDriver: null,
    deposit:         400000,
    rating:          4.4,
    reviewCount:     318,
    featured:        false,
    badge:           'Terlaris',
    images: [
      'https://asset.honda-indonesia.com/variants/images/z3IlBtUoQMWNV5YTY13qjt1mt9D8uBUbmRrYVTI5.png',
      'https://asset.honda-indonesia.com/variants/images/mWtZtMRT42Cf6o4KdCBTDAtLyLDurQvqg8pkWC4g.png',
    ],
    specs: {
      engine:    '1.2L i-VTEC',
      maxSpeed:  '150 km/h',
      luggage:   '1 koper besar',
      bluetooth: true,
      usb:       true,
      gps:       false,
    },
    location:    'Jakarta, Bandung, Yogyakarta, Surabaya',
    available:   true,
    description: 'Honda Brio adalah city car lincah yang sempurna untuk mobilitas perkotaan. Dimensi kompak memudahkan parkir di kota padat, sementara konsumsi BBM yang sangat irit menghemat pengeluaran.',
  },

  {
    id:              'car_008',
    name:            'Toyota Alphard',
    brand:           'Toyota',
    type:            'Luxury MPV',
    year:            2024,
    seats:           7,
    transmission:    'Automatic',
    fuel:            'Hybrid',
    ac:              true,
    withDriver:      true,
    selfDrive:       false,
    pricePerDay:     1500000,
    priceWithDriver: 1500000,
    deposit:         3000000,
    rating:          5.0,
    reviewCount:     64,
    featured:        false,
    badge:           'Luxury',
    images: [
      'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&q=80',
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&q=80',
    ],
    specs: {
      engine:    '2.5L Hybrid E-Four',
      maxSpeed:  '180 km/h',
      luggage:   '4 koper besar',
      bluetooth: true,
      usb:       true,
      gps:       true,
    },
    location:    'Jakarta, Bali',
    available:   true,
    description: 'Toyota Alphard Executive Lounge adalah puncak kemewahan kendaraan MPV. Captain seat premium, sunroof panoramic, dan sistem entertainment canggih untuk pengalaman perjalanan VVIP yang tak terlupakan.',
  },

  {
    id:              'car_009',
    name:            'Mitsubishi Xpander',
    brand:           'Mitsubishi',
    type:            'MPV',
    year:            2024,
    seats:           7,
    transmission:    'Automatic',
    fuel:            'Petrol',
    ac:              true,
    withDriver:      true,
    selfDrive:       true,
    pricePerDay:     350000,
    priceWithDriver: 500000,
    deposit:         800000,
    rating:          4.7,
    reviewCount:     193,
    featured:        false,
    badge:           'Baru',
    images: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80',
      'https://images.unsplash.com/photo-1617654112329-7c1b9ef20b15?w=800&q=80',
    ],
    specs: {
      engine:    '1.5L MIVEC',
      maxSpeed:  '170 km/h',
      luggage:   '2 koper besar',
      bluetooth: true,
      usb:       true,
      gps:       false,
    },
    location:    'Jakarta, Surabaya, Palembang',
    available:   true,
    description: 'Mitsubishi Xpander Cross hadir dengan desain cross-over yang agresif dan kabin fleksibel. Sistem suspensi yang handal memberikan kenyamanan optimal di berbagai kondisi jalan.',
  },
];

/* ── Helper functions ────────────────────────────────────────── */

function enrichCar(car) {
  if (!car) return null;
  return { ...car, packages: getCarPackages(car) };
}

function getCarById(id) {
  return enrichCar(CARS_DATA.find(c => c.id === id) || null);
}

function getFeaturedCars() {
  return CARS_DATA.filter(c => c.featured);
}

function filterCars({ type, brand, seats, minPrice, maxPrice, driver, query } = {}) {
  return CARS_DATA.filter(car => {
    if (type   && type   !== 'Semua' && car.type  !== type)   return false;
    if (brand  && brand  !== 'Semua' && car.brand !== brand)  return false;
    if (seats  && seats  !== 'Semua') {
      const n = parseInt(seats);
      if (n === 8) { if (car.seats < 8) return false; }
      else         { if (car.seats !== n) return false; }
    }
    if (minPrice != null) {
      const price = car.pricePerDay || car.priceWithDriver || 0;
      if (price < minPrice) return false;
    }
    if (maxPrice != null) {
      const price = car.pricePerDay || car.priceWithDriver || 0;
      if (price > maxPrice) return false;
    }
    if (driver && driver !== 'Semua') {
      if (driver === 'Lepas Kunci' && !car.selfDrive)  return false;
      if (driver === 'Dengan Sopir' && !car.withDriver) return false;
    }
    if (query) {
      const q = query.toLowerCase();
      if (!car.name.toLowerCase().includes(q) && !car.brand.toLowerCase().includes(q)) return false;
    }
    return true;
  });
}

function sortCars(cars, method = 'Populer') {
  const arr = [...cars];
  switch (method) {
    case 'Harga ↑':
      return arr.sort((a, b) => (a.pricePerDay || a.priceWithDriver || 0) - (b.pricePerDay || b.priceWithDriver || 0));
    case 'Harga ↓':
      return arr.sort((a, b) => (b.pricePerDay || b.priceWithDriver || 0) - (a.pricePerDay || a.priceWithDriver || 0));
    case 'Rating':
      return arr.sort((a, b) => b.rating - a.rating);
    default: // Populer
      return arr.sort((a, b) => b.reviewCount - a.reviewCount);
  }
}

function formatPrice(amount) {
  if (!amount) return '-';
  return 'Rp ' + amount.toLocaleString('id-ID');
}

function getStartingPrice(car) {
  if (!car) return 0;
  return getLowestTierPrice(car);
}

export {
  CARS_DATA,
  getCarById,
  getFeaturedCars,
  filterCars,
  sortCars,
  formatPrice,
  getStartingPrice,
};
