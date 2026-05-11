# 🚗 BLUEPRINT — Rental Car Website Prototype
**Project:** DriveEase — Car Rental Platform (Prototype)
**Stack:** HTML5 + CSS3 + Vanilla JS (No Framework)
**Storage:** LocalStorage (semua data dummy + user state)
**Design System:** Modern-Minimalist | Blue & White / Dark Mode
**Versi Blueprint:** 1.0 — Ridd × Claude Mentor X

---

## 📁 STRUKTUR FILE & SUBDOMAIN

```
/project-root
│
├── index.html              → Beranda (/)
├── login.html              → Login/Register (/login)
├── layanan.html            → Paket & Layanan (/layanan)
├── detail.html             → Detail Paket (/detail?id=...)
├── checkout.html           → Pemesanan/Checkout (/checkout)
├── tracking.html           → Status & Tracking (/tracking)
├── profil.html             → Profil User (/profil)
│
├── assets/
│   ├── css/
│   │   ├── global.css          → Reset, CSS Variables, Typography
│   │   ├── components.css      → Reusable components (cards, buttons, modal)
│   │   └── animations.css      → Keyframes & transition library
│   │
│   ├── js/
│   │   ├── core/
│   │   │   ├── auth.js             → Auth logic (register/login/logout)
│   │   │   ├── storage.js          → LocalStorage abstraction layer
│   │   │   ├── router.js           → Page navigation helper
│   │   │   └── theme.js            → Dark mode + color theme switcher
│   │   │
│   │   ├── data/
│   │   │   ├── cars.js             → Dummy data: semua produk mobil
│   │   │   ├── bookings.js         → Dummy data: history pemesanan
│   │   │   └── user.js             → Dummy user profile data
│   │   │
│   │   └── pages/
│   │       ├── home.js             → Logic: search bar, hero animation
│   │       ├── layanan.js          → Logic: filter, sort, card render
│   │       ├── detail.js           → Logic: load detail by ID
│   │       ├── checkout.js         → Logic: form pemesanan & simulasi payment
│   │       ├── tracking.js         → Logic: Google Maps + status timeline
│   │       └── profil.js           → Logic: edit profil, history, settings
│   │
│   └── img/                    → (gunakan URL gambar online/CDN)
│
└── README.md
```

---

## 🎨 DESIGN SYSTEM

### Color Palette (CSS Variables)

```css
:root {
  /* Primary */
  --color-primary: #1A6BF5;
  --color-primary-dark: #1250C2;
  --color-primary-light: #4D8EFF;
  --color-primary-subtle: #EBF1FF;

  /* Neutral */
  --color-bg: #FFFFFF;
  --color-surface: #F4F7FE;
  --color-surface-2: #E8EEF9;
  --color-border: #D1DCF0;
  --color-text: #0D1B3E;
  --color-text-muted: #6B7A9E;

  /* Accent / Status */
  --color-success: #22C55E;
  --color-warning: #F59E0B;
  --color-danger: #EF4444;
  --color-info: #06B6D4;

  /* Dark Mode Override */
  [data-theme="dark"] {
    --color-bg: #0A0F1E;
    --color-surface: #111827;
    --color-surface-2: #1C2438;
    --color-border: #2A3556;
    --color-text: #E8EDF8;
    --color-text-muted: #8896B3;
  }

  /* Theme Accents (User Customizable) */
  --theme-red:    #EF4444;
  --theme-orange: #F97316;
  --theme-blue:   #1A6BF5;  /* default */
}
```

### Typography

```
Display Font : "Outfit" (Google Fonts) — Hero titles, brand
Body Font    : "DM Sans" (Google Fonts) — Body, UI, labels
Mono Font    : "JetBrains Mono" — Kode referensi, ID pemesanan
```

### Spacing Scale
```
4px / 8px / 12px / 16px / 24px / 32px / 48px / 64px / 96px
```

### Border Radius
```
Pill: 9999px | Large: 16px | Medium: 12px | Small: 8px | XS: 4px
```

### Shadow Library
```css
--shadow-sm:  0 1px 3px rgba(26,107,245,0.08);
--shadow-md:  0 4px 16px rgba(26,107,245,0.12);
--shadow-lg:  0 8px 32px rgba(26,107,245,0.18);
--shadow-card: 0 2px 8px rgba(13,27,62,0.06), 0 8px 24px rgba(13,27,62,0.08);
```

---

## 🔐 PAGE 1 — LOGIN & REGISTER (`login.html`)

### Layout
- Split-screen: kiri = form, kanan = visual branding + tagline
- Animasi: form slide-in dari kiri, ilustrasi fade-in dari kanan

### Komponen
```
[Logo + Brand Name]
[Tab Toggle: Login | Register]

== LOGIN FORM ==
- Email input (dengan validasi format)
- Password input (toggle show/hide)
- [Remember Me] checkbox
- Tombol "Masuk"
- Link "Lupa Password?" (modal placeholder)
- Divider "atau"
- Tombol SSO Placeholder (Google icon, disabled state)

== REGISTER FORM ==
- Nama Lengkap
- Email
- No. HP (format ID: +62)
- Password
- Confirm Password
- [Setuju dengan syarat & ketentuan] checkbox
- Tombol "Daftar"
```

### Logic (auth.js)
```javascript
// LocalStorage schema
{
  "users": [
    {
      "id": "usr_001",
      "name": "Budi Santoso",
      "email": "budi@email.com",
      "phone": "081234567890",
      "password": "hashed_sim", // simulasi hash sederhana base64
      "avatar": "https://i.pravatar.cc/150?img=3",
      "theme": "light",
      "accentColor": "blue",
      "createdAt": "2025-01-15"
    }
  ],
  "currentUser": "usr_001",
  "authToken": "token_xyz"
}
```

### Validasi
- Email: regex format valid
- Password: min 8 karakter, 1 huruf besar, 1 angka
- Konfirmasi password: harus identik
- Toast notification: error/success feedback

### Animasi
- Form card: `translateY(20px) → 0` dengan `opacity 0 → 1`, duration 400ms
- Input focus: border glow `box-shadow` transisi 200ms
- Button hover: `translateY(-2px)` + shadow intensify
- Error shake: `keyframes shake` pada input invalid

---

## 🏠 PAGE 2 — BERANDA (`index.html`)

### Section Layout (Top to Bottom)

```
1. NAVBAR (sticky)
2. HERO SECTION (search bar utama)
3. STATS BAR (social proof)
4. HOW IT WORKS (alur pemesanan)
5. FEATURED CARS (preview 3 cards)
6. LAYANAN/SERVICE SECTION
7. PAYMENT METHODS
8. TESTIMONIALS
9. CTA BANNER
10. FOOTER
```

### 1. NAVBAR (sticky + scroll-aware)
```
[Logo "DriveEase"] [Beranda] [Layanan] [Tracking] [Profil] [Login/Register]
                                                          ↑ jika sudah login: Avatar + nama
Mobile: hamburger menu dengan drawer animasi slide-from-right
```
- Scroll behavior: background `transparent → white/dark` saat scroll > 80px
- Active link: underline animasi dari kiri ke kanan
- Badge notifikasi pada icon profil (jika ada pesanan aktif)

### 2. HERO SECTION
```
Background: Gradient mesh biru + gambar mobil mewah (online CDN)
Headline: "Kendarai Perjalananmu, Tanpa Batas."
Subheadline: "Sewa mobil terbaik dengan harga transparan & layanan 24 jam."

[SEARCH WIDGET — "card floating di atas hero"]
┌────────────────────────────────────────────────────────┐
│  Tab: [Dengan Sopir] [Tanpa Sopir] [Lepas Kunci]       │
│  ────────────────────────────────────────────────────  │
│  [📍 Kota/Lokasi Pickup] [📅 Tgl Pickup] [📅 Tgl Drop] │
│  [⏰ Jam Pickup]         [👤 Jumlah Penumpang]          │
│  ────────────────────────────────────────────────────  │
│           [🔍 Cari Mobil Tersedia]                     │
└────────────────────────────────────────────────────────┘
```

**Search Widget Logic:**
- Input lokasi: datalist dengan 10 kota dummy (Jakarta, Surabaya, Bali, dll)
- Date picker: input type="date", validasi drop > pickup
- Query params: `layanan.html?city=Jakarta&pickup=2025-06-01&drop=2025-06-05&pax=2`
- Animasi: widget float-up dengan slight shadow pulse

### 3. STATS BAR
```
[🚗 500+ Armada] [🌟 4.9/5 Rating] [🏙️ 25 Kota] [🧾 50.000+ Pesanan]
```
Counter animation: angka hitung naik saat section masuk viewport (IntersectionObserver)

### 4. HOW IT WORKS — Alur Pemesanan
```
FLOW STEPS (horizontal stepper dengan connector line):

STEP 1     STEP 2       STEP 3      STEP 4      STEP 5
🔍 Cari → 📋 Pilih  → 💳 Bayar → 🚗 Pickup → ✅ Selesai
Mobil      Paket       Online     Di Lokasi    Drop Off

Expand setiap step: deskripsi singkat 2-3 baris
```

**PAYMENT FLOW DETAIL (modal/accordion):**
```
📱 Transfer Bank → BCA, Mandiri, BNI (Virtual Account)
💳 Kartu Kredit/Debit → Visa, Mastercard
🏪 Gerai → Alfamart, Indomaret
💚 E-Wallet → GoPay, OVO, DANA, ShopeePay
🔄 Cicilan → 3/6/12 bulan (simulasi)
```

### 5. FEATURED CARS (3 kartu preview)
- Ambil 3 data dari `cars.js` (flag: `featured: true`)
- Card layout: gambar, nama mobil, rating, harga/hari, tombol [Detail] [Pesan]
- Hover: card lift + overlay CTA

### 6. SERVICE SECTION
```
[🚙 Self Drive]  [👨‍✈️ With Driver]  [✈️ Airport Transfer]
[🏢 Corporate]   [📸 Photoshoot]   [🏖️ Wisata Paket]
```

### 7. FOOTER
```
Kolom 1: Logo + deskripsi singkat + sosmed icons
Kolom 2: Navigasi (Beranda, Layanan, Tracking, Profil)
Kolom 3: Kontak (dummy: email, phone, alamat)
Kolom 4: Download App (placeholder button)
Bottom bar: © 2025 DriveEase | Privacy Policy | Terms
```

### Animasi Beranda
- Hero text: staggered `fadeInUp` per kata/frasa
- Section scroll reveal: `IntersectionObserver` → `fadeInUp` tiap elemen
- Stats counter: angka naik saat masuk viewport
- Card hover: `translateY(-6px)` + shadow intensify
- CTA button: shimmer/glimmer effect looping

---

## 🚙 PAGE 3 — PAKET/LAYANAN (`layanan.html`)

### Layout
```
[NAVBAR]
[FILTER & SORT BAR — sticky]
[PRODUCT GRID]
[PAGINATION / LOAD MORE]
[FOOTER]
```

### Filter Bar
```
[Jenis: Semua | SUV | MPV | Sedan | City Car | Minibus]
[Brand: Semua | Toyota | Honda | Mitsubishi | Suzuki | Daihatsu]
[Kapasitas: Semua | 4 | 6 | 7 | 8+ penumpang]
[Harga: Rp 150k - Rp 1.5jt /hari — range slider]
[Driver: Semua | Lepas Kunci | Dengan Sopir]
[Sortir: Populer | Harga ↑ | Harga ↓ | Rating]
```

### Product Card
```
┌──────────────────────────┐
│  [gambar mobil — 16:9]   │
│  🏷️ "Terlaris" badge      │
├──────────────────────────┤
│  Toyota Innova Zenix      │
│  ⭐ 4.8  (243 ulasan)    │
│  MPV · 7 Kursi · AC      │
│  Lepas Kunci / Sopir     │
├──────────────────────────┤
│  Mulai Rp 450.000/hari   │
│  [Detail]    [Pesan →]   │
└──────────────────────────┘
```

### Dummy Data Schema (cars.js)
```javascript
const CARS_DATA = [
  {
    id: "car_001",
    name: "Toyota Innova Zenix",
    brand: "Toyota",
    type: "MPV",
    year: 2024,
    seats: 7,
    transmission: "Automatic",
    fuel: "Hybrid",
    ac: true,
    withDriver: true,
    selfDrive: true,
    pricePerDay: 450000,
    priceWithDriver: 600000,
    deposit: 1000000,
    rating: 4.8,
    reviewCount: 243,
    featured: true,
    badge: "Terlaris",
    images: [
      "https://images.unsplash.com/...innova",  // Unsplash CDN
      "https://images.unsplash.com/...interior"
    ],
    specs: {
      engine: "2.0L Hybrid",
      maxSpeed: "180 km/h",
      luggage: "3 koper besar",
      bluetooth: true,
      usb: true,
      gps: false
    },
    packages: [
      { name: "Harian", duration: "12 jam", price: 450000 },
      { name: "Full Day", duration: "24 jam", price: 550000 },
      { name: "Weekend", duration: "3 hari", price: 1200000 },
      { name: "Weekly", duration: "7 hari", price: 2500000 }
    ],
    location: "Jakarta, Surabaya, Bali",
    available: true
  },
  // ... 11 mobil lainnya (total 12 produk)
]
```

**12 Produk dummy yang direkomendasikan:**
1. Toyota Innova Zenix (MPV, 7 kursi)
2. Honda CR-V (SUV, 5 kursi)
3. Toyota Avanza (MPV, 7 kursi, budget)
4. Mitsubishi Pajero Sport (SUV Premium, 7 kursi)
5. Toyota Fortuner (SUV, 7 kursi)
6. Suzuki Ertiga (MPV, 7 kursi)
7. Daihatsu Xenia (MPV, 7 kursi, budget)
8. Honda Brio (City Car, 4 kursi)
9. Toyota Alphard (Luxury MPV, 7 kursi)
10. Mitsubishi Xpander (MPV, 7 kursi)
11. Toyota Hiace (Minibus, 15 kursi)
12. Toyota Land Cruiser (SUV Premium, 8 kursi)

### Animasi Layanan
- Filter change: kartu fade-out → re-render fade-in (200ms)
- Card masuk viewport: staggered `fadeInUp` per baris
- Price range slider: warna track update real-time

---

## 📋 PAGE 4 — DETAIL PAKET (`detail.html?id=car_001`)

### Layout
```
[NAVBAR]
[BREADCRUMB: Beranda > Layanan > Toyota Innova Zenix]

[GALLERY — 1 hero + 4 thumbnail]   │  [INFO SIDEBAR]
                                    │  Nama Mobil
[TABS: Deskripsi | Spesifikasi |    │  ⭐ Rating | Ulasan
       Paket | Peraturan]           │  Harga mulai Rp...
                                    │  [Pilih Paket dropdown]
[ULASAN SECTION]                    │  [Tanggal Pickup]
                                    │  [Tanggal Drop]
[MOBIL SERUPA — horizontal scroll]  │  [Subtotal estimasi]
                                    │  [🛒 Pesan Sekarang]
[FOOTER]                            │  [❤️ Simpan Wishlist]
```

### Gallery Logic
- Thumbnail click → gambar utama berganti dengan animasi cross-fade
- Hover thumbnail: scale 1.05 + border highlight

### Tabs Content

**Tab: Deskripsi**
```
Paragraf deskripsi mobil (2-3 paragraf)
Feature highlights: ikon + label (AC, Bluetooth, 7 Penumpang, dll)
Catatan ketersediaan kota
```

**Tab: Spesifikasi**
```
Tabel 2 kolom:
| Mesin       | 2.0L Hybrid TNGA      |
| Transmisi   | CVT Automatic         |
| BBM         | Pertalite/Pertamax    |
| Konsumsi    | ~15 km/liter          |
| Kapasitas   | 7 Penumpang           |
| Bagasi      | 3 koper besar         |
| Dimensi     | 4.735 x 1.835 x 1.690 |
| Fitur       | Bluetooth, USB x2,    |
|             | Lane Departure, BSM   |
```

**Tab: Paket Sewa**
```
Card per paket:
┌────────────────────────────┐
│  🕐 HARIAN (12 jam)        │
│  Rp 450.000                │
│  ✓ Bensin tidak termasuk   │
│  ✓ Max 150 km              │
│  ✓ Asuransi dasar          │
│  [Pilih Paket Ini]         │
└────────────────────────────┘
(4 kartu paket: Harian, Full Day, Weekend, Weekly)
```

**Tab: Peraturan**
```
List peraturan:
- Usia pengemudi min 21 tahun
- SIM A valid
- Dilarang merokok dalam mobil
- Hewan peliharaan tidak diizinkan
- Batas kecepatan sesuai rambu
- Keterlambatan kena: Rp 100k/jam
- Kerusakan: sesuai estimasi bengkel
```

### Sidebar Booking Calculator
```javascript
// Real-time kalkulasi
const days = (dropDate - pickupDate) / 86400000;
const subtotal = selectedPackagePrice * days;
const insuranceFee = 50000 * days;
const driverFee = withDriver ? 200000 * days : 0;
const total = subtotal + insuranceFee + driverFee;
```

### Animasi Detail
- Gallery hero: cross-fade pada thumbnail switch
- Tab content: slide-in dari kanan
- Price update: angka flip/countup animation
- Sidebar sticky saat scroll (position sticky)

---

## 🛒 PAGE 5 — CHECKOUT/PEMESANAN (`checkout.html`)

### Layout (Multi-Step Form)
```
[NAVBAR]
[PROGRESS BAR: ①Paket → ②Detail → ③Pembayaran → ④Konfirmasi]

[FORM AREA]                    [ORDER SUMMARY SIDEBAR]
                               [Sticky card ringkasan pesanan]

[FOOTER]
```

### Step 1 — Pilih Paket & Jadwal
```
Ringkasan mobil terpilih (readonly, dari params)
[Pilih Paket: dropdown/radio cards]
  ○ Harian 12 jam — Rp 450.000/hari
  ● Full Day 24 jam — Rp 550.000/hari  ← selected
  ○ Weekend 3 hari — Rp 1.200.000
  ○ Weekly 7 hari — Rp 2.500.000

[Tanggal Pickup]  [Jam Pickup]
[Tanggal Drop]    [Jam Drop]
[Pilih Kota Pickup: dropdown]
[Alamat Lengkap Pickup]
[Catatan Tambahan: textarea]

[Opsi Driver: ○ Lepas Kunci  ● Dengan Sopir (+Rp 200k/hari)]
```

### Step 2 — Data Pemesan
```
[Nama Lengkap]          (auto-fill dari profil jika login)
[Email]                 (auto-fill)
[No. HP]               (auto-fill)
[No. KTP]
[Unggah Foto KTP]       (file input, preview thumbnail)
[No. SIM]
[Upload Foto SIM]       (file input, preview thumbnail)

[Pengemudi berbeda dari pemesan? ○ Ya  ● Tidak]
  → Jika Ya: form data pengemudi muncul (nama, SIM, dll)

[Asuransi Tambahan: ○ Dasar (gratis)  ● Komprehensif (+Rp 75k/hari)]
```

### Step 3 — Pembayaran
```
ORDER SUMMARY (expandable accordion):
- Toyota Innova Zenix Full Day x 3 hari: Rp 1.650.000
- Asuransi Komprehensif: Rp 225.000
- Biaya Sopir: Rp 600.000
- Deposit (refundable): Rp 1.000.000
─────────────────────────────────────────
TOTAL: Rp 3.475.000

[PILIH METODE PEMBAYARAN]
● Transfer Bank
  ○ BCA  ○ Mandiri  ○ BNI  ○ BRI
● Kartu Kredit/Debit
  ○ Visa  ○ Mastercard
● E-Wallet
  ○ GoPay  ○ OVO  ○ DANA  ○ ShopeePay
● Bayar di Gerai
  ○ Alfamart  ○ Indomaret
● Cicilan (0%)
  ○ 3 bulan  ○ 6 bulan  ○ 12 bulan

[Kode Promo: input + tombol APPLY]
[✓ Saya setuju dengan syarat & ketentuan]
[💳 BAYAR SEKARANG — Rp 3.475.000]
```

**Simulasi Pembayaran:**
- Klik "Bayar" → Loading screen 2 detik (animasi pemrosesan)
- Random result: 90% berhasil / 10% gagal (untuk demo)
- Berhasil → redirect ke Step 4 (konfirmasi)

### Step 4 — Konfirmasi
```
[✅ Animasi checkmark sukses]

BOOKING CONFIRMED!
No. Pesanan: #DRV-20250601-7842

[Detail Pesanan Card]
Mobil: Toyota Innova Zenix
Pickup: 1 Juni 2025, 09:00 — Jl. Sudirman, Jakarta
Drop: 4 Juni 2025, 09:00
Total Dibayar: Rp 3.475.000
Status: MENUNGGU KONFIRMASI OPERATOR

[Tombol: Lihat Tracking] [Kembali ke Beranda]
```

### LocalStorage Booking Schema
```javascript
{
  "bookings": [
    {
      "id": "DRV-20250601-7842",
      "userId": "usr_001",
      "carId": "car_001",
      "carName": "Toyota Innova Zenix",
      "package": "Full Day",
      "pickupDate": "2025-06-01",
      "pickupTime": "09:00",
      "dropDate": "2025-06-04",
      "dropTime": "09:00",
      "city": "Jakarta",
      "address": "Jl. Sudirman No.1",
      "withDriver": true,
      "insurance": "comprehensive",
      "renterData": { "name": "Budi", "ktp": "...", "sim": "..." },
      "payment": { "method": "gopay", "status": "paid", "total": 3475000 },
      "status": "confirmed",  // confirmed | active | completed | cancelled
      "statusHistory": [
        { "status": "confirmed", "time": "2025-06-01 08:00" },
        { "status": "active", "time": "2025-06-01 09:30" }
      ],
      "carLocation": { "lat": -6.2088, "lng": 106.8456 }
    }
  ]
}
```

### Animasi Checkout
- Progress bar: transisi smooth antar step
- Step transition: slide ke kiri/kanan sesuai arah navigasi
- Payment processing: spinner + loading teks berganti
- Success: confetti-like animation + checkmark stroke animation

---

## 📍 PAGE 6 — STATUS & TRACKING (`tracking.html`)

### Layout
```
[NAVBAR]
[PAGE HEADER: "Status Pemesanan Saya"]

[TABS: Aktif | Menunggu | Selesai | Dibatalkan]

[BOOKING CARD — selected]
│  No. Pesanan: #DRV-20250601-7842
│  Toyota Innova Zenix • 3 Hari
│  Status: 🟡 Dalam Perjalanan (hari ke-2/3)

[STATUS TIMELINE — vertical stepper]   │  [MAPS SECTION]
                                        │
[DETAIL PEMESANAN CARD]                 │

[FOOTER]
```

### Status Timeline (Vertical Stepper)
```
✅  Pesanan Dikonfirmasi
    Sab, 1 Jun 2025 • 08:00
    "Pesanan Anda telah diterima dan dikonfirmasi."

✅  Pembayaran Berhasil
    Sab, 1 Jun 2025 • 08:05

✅  Mobil Siap Pickup
    Sab, 1 Jun 2025 • 08:30
    "Mobil sudah standby di lokasi pickup."

✅  Mobil Diambil (Pickup)
    Sab, 1 Jun 2025 • 09:30
    "Selamat menikmati perjalanan!"

🔵  Sedang Digunakan          ← CURRENT STATUS (blink indicator)
    "Hari ke-2 dari 3 hari sewa"
    Sisa: 1 hari 14 jam

⬜  Pengembalian (Drop Off)
    Est: Sel, 4 Jun 2025 • 09:00

⬜  Selesai
```

### Google Maps Integration
```html
<!-- Google Maps Embed Free API -->
<iframe
  src="https://www.google.com/maps/embed/v1/place?key=FREE_EMBED_KEY
       &q=-6.2088,106.8456&zoom=15"
  allowfullscreen>
</iframe>
```
**Alternatif Free (tanpa API key):**
- Leaflet.js + OpenStreetMap tiles
- Marker: posisi dummy bergerak setiap 30 detik (simulasi via setInterval)

```javascript
// Simulasi pergerakan mobil (dummy)
const dummyRoute = [
  { lat: -6.2088, lng: 106.8456 },
  { lat: -6.2100, lng: 106.8500 },
  { lat: -6.2120, lng: 106.8550 },
  // ...
];
let routeIndex = 0;
setInterval(() => {
  marker.setLatLng(dummyRoute[routeIndex++ % dummyRoute.length]);
  map.panTo(marker.getLatLng());
}, 5000);
```

### Detail Card
```
┌──────────────────────────────────────────┐
│  🚗 Toyota Innova Zenix 2024             │
│  No. Plat: B 1234 CDR (dummy)            │
│                                          │
│  📅 Mulai     : 1 Jun 2025              │
│  📅 Berakhir  : 4 Jun 2025              │
│  📆 Total     : 3 Hari                  │
│  ⏳ Sisa      : 1 Hari 14 Jam           │
│                                          │
│  👨‍✈️ Sopir      : Pak Ahmad (0812xxx)   │
│  📞 Hubungi   : [Telepon] [WhatsApp]    │
│                                          │
│  💰 Total Bayar: Rp 3.475.000           │
│  ✅ Lunas                               │
│                                          │
│  [📄 Lihat Invoice]  [❌ Batalkan]      │
└──────────────────────────────────────────┘
```

### Animasi Tracking
- Timeline: step-by-step reveal saat halaman load (stagger 150ms)
- Current status: pulse ring animation (CSS keyframes)
- Map marker: smooth bounce on position update
- Progress bar waktu sewa: countdown animation

---

## 👤 PAGE 7 — PROFIL (`profil.html`)

### Layout (Sidebar + Content)
```
[NAVBAR]

┌─────────────────┬─────────────────────────────────────┐
│  SIDEBAR        │  CONTENT AREA                       │
│  ─────────────  │  ─────────────────────────────────  │
│  [Avatar]       │  (berubah sesuai menu yang dipilih) │
│  Nama User      │                                     │
│  ⭐ Member Std  │                                     │
│  ─────────────  │                                     │
│  👤 Data Saya   │                                     │
│  📋 Riwayat     │                                     │
│  💳 Pembayaran  │                                     │
│  ⚙️ Pengaturan  │                                     │
│  🚪 Keluar      │                                     │
└─────────────────┴─────────────────────────────────────┘
```

### Menu: Data Saya
```
[Avatar upload area — klik untuk ganti, preview real-time]
[Nama Lengkap]    → editable input
[Email]           → editable + verifikasi badge
[No. HP]          → editable
[Alamat]          → textarea
[Tgl Lahir]       → date input
[Jenis Kelamin]   → select

[Tombol Simpan Perubahan]
```

### Menu: Riwayat Pemesanan
```
Filter tabs: [Semua] [Aktif] [Selesai] [Dibatalkan]

Per kartu riwayat:
┌──────────────────────────────────────┐
│  #DRV-20250601-7842                  │
│  Toyota Innova Zenix — 3 Hari        │
│  1 Jun — 4 Jun 2025                  │
│  Rp 3.475.000  •  ✅ Selesai         │
│  [Lihat Detail] [Pesan Lagi]         │
└──────────────────────────────────────┘
```

### Menu: Metode Pembayaran
```
Kartu tersimpan (dummy):
[💳 Visa ••••4242]  [Hapus]
[🏦 BCA VA •••7890] [Hapus]
[Tambah Metode Baru +]
```

### Menu: Pengaturan
```
━━━━━━━━━━━━━━━━━━━
TAMPILAN

[🌙 Mode Gelap]        [Toggle Switch]
[🎨 Warna Tema]
  ● Biru (default)
  ○ Merah
  ○ Oranye

━━━━━━━━━━━━━━━━━━━
NOTIFIKASI

[🔔 Status Pemesanan]  [Toggle: ON]
[📧 Email Newsletter]  [Toggle: OFF]
[📱 WhatsApp Update]   [Toggle: ON]

━━━━━━━━━━━━━━━━━━━
AKUN

[Ganti Password]
[Verifikasi Email]     [badge: Belum Terverifikasi]
[Hapus Akun]           [merah, perlu konfirmasi modal]
```

### Theme Switcher Logic (theme.js)
```javascript
// Dark mode
document.documentElement.setAttribute('data-theme', 'dark');
localStorage.setItem('theme', 'dark');

// Color accent
const themes = { blue: '#1A6BF5', red: '#EF4444', orange: '#F97316' };
document.documentElement.style.setProperty('--color-primary', themes[color]);
localStorage.setItem('accentColor', color);

// Apply on load (setiap halaman)
const savedTheme = localStorage.getItem('theme') || 'light';
const savedColor = localStorage.getItem('accentColor') || 'blue';
```

### Animasi Profil
- Avatar hover: circle grow + kamera icon muncul
- Sidebar active item: background slide dari kiri
- Toggle switch: smooth slide + color transisi
- Data saved: toast "Perubahan disimpan!" slide dari atas

---

## 🔄 STATE & DATA FLOW

### LocalStorage Keys
```
"driveease_users"       → Array user terdaftar
"driveease_currentUser" → ID user aktif
"driveease_bookings"    → Array semua pemesanan
"driveease_theme"       → 'light' | 'dark'
"driveease_accentColor" → 'blue' | 'red' | 'orange'
"driveease_wishlist"    → Array car ID yang disimpan
"driveease_searchCache" → Last search params
```

### Inter-Page Data Passing
```
Home → Layanan    : URL params (?city=Jakarta&pickup=...&drop=...)
Layanan → Detail  : URL params (?id=car_001)
Detail → Checkout : URL params (?id=car_001&package=fullday)
Checkout → Tracking: Redirect setelah booking berhasil
Navbar → Login    : Redirect jika belum auth + returnUrl param
```

### Auth Guard (setiap halaman)
```javascript
// Di awal setiap page JS
function checkAuth(requiredPages = ['checkout', 'tracking', 'profil']) {
  const currentPage = window.location.pathname.split('/').pop();
  const isProtected = requiredPages.some(p => currentPage.includes(p));
  const currentUser = JSON.parse(localStorage.getItem('driveease_currentUser'));
  if (isProtected && !currentUser) {
    window.location.href = `login.html?returnUrl=${currentPage}`;
  }
}
```

---

## 🎞️ ANIMASI GLOBAL (animations.css)

```css
/* Keyframes Library */

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInLeft {
  from { opacity: 0; transform: translateX(-24px); }
  to   { opacity: 1; transform: translateX(0); }
}

@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes pulse-ring {
  0%   { transform: scale(1); opacity: 1; }
  100% { transform: scale(1.8); opacity: 0; }
}

@keyframes countUp { /* handled by JS */ }

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-6px); }
  40%, 80% { transform: translateX(6px); }
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes strokeCheck {
  to { stroke-dashoffset: 0; }
}

/* Utility Classes */
.animate-fade-in-up    { animation: fadeInUp 400ms ease forwards; }
.animate-fade-in-left  { animation: fadeInLeft 400ms ease forwards; }
.animate-shimmer       { animation: shimmer 2s infinite linear; }
.animate-pulse-ring    { animation: pulse-ring 1.5s ease-out infinite; }

/* Scroll Reveal (via IntersectionObserver + class toggle) */
.reveal { opacity: 0; transform: translateY(30px); transition: all 500ms ease; }
.reveal.visible { opacity: 1; transform: translateY(0); }

/* Stagger delays */
.stagger-1 { transition-delay: 100ms; }
.stagger-2 { transition-delay: 200ms; }
.stagger-3 { transition-delay: 300ms; }
.stagger-4 { transition-delay: 400ms; }
```

---

## 🧩 KOMPONEN REUSABLE (components.css)

```
Komponen yang harus dibuat sekali dan dipakai ulang:

1. [button]       → .btn-primary | .btn-secondary | .btn-ghost | .btn-danger
2. [input]        → .input-field (dengan state: focus, error, disabled)
3. [card]         → .card-base | .card-hover | .card-glass
4. [badge]        → .badge-success | .badge-warning | .badge-info
5. [modal]        → .modal-overlay + .modal-content (dengan animasi)
6. [toast]        → .toast-container (top-right, auto-dismiss 3s)
7. [skeleton]     → .skeleton-loader (shimmer placeholder)
8. [dropdown]     → .dropdown-menu (animasi slideDown)
9. [stepper]      → .step-progress (horizontal + vertical)
10. [toggle]      → .toggle-switch (dark mode, notifikasi)
11. [range-slider]→ .range-custom (filter harga)
12. [tabs]        → .tab-nav + .tab-content (dengan indicator slide)
```

---

## 📦 DEPENDENCIES (CDN Links)

```html
<!-- Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono&display=swap" rel="stylesheet">

<!-- Icons -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
<!-- ATAU: Lucide Icons -->
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>

<!-- Maps (Leaflet — free, no API key) -->
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

<!-- Swiper (Gallery & Horizontal Scroll) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css">
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>

<!-- Flatpickr (Date Picker yang cantik) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
<script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
```

---

## 🖼️ ASSET ONLINE (Image Sources)

```
Foto mobil:       https://images.unsplash.com/search/photos/toyota-innova
                  → Query: "car interior", "toyota suv", "honda crv"
Hero background:  https://images.unsplash.com/photos/... (road/city scene)
Avatars:          https://i.pravatar.cc/150?img=[1-70]
Car placeholder:  https://via.placeholder.com/400x250
Logo/Icons:       Font Awesome 6 atau Lucide Icons
Map tiles:        OpenStreetMap (via Leaflet)
```

---

## ✅ DEVELOPMENT CHECKLIST

### Phase 1 — Foundation (Hari 1)
- [ ] Setup struktur folder
- [ ] Buat global.css (variables, reset, typography)
- [ ] Buat components.css (semua komponen)
- [ ] Buat animations.css
- [ ] Buat storage.js (abstraksi LocalStorage)
- [ ] Buat auth.js
- [ ] Buat theme.js
- [ ] Buat cars.js (12 dummy produk)
- [ ] Buat Navbar component (HTML snippet, reused di semua page)

### Phase 2 — Core Pages (Hari 2-3)
- [ ] login.html + login.js
- [ ] index.html (Beranda) + home.js
- [ ] layanan.html + layanan.js
- [ ] detail.html + detail.js

### Phase 3 — Transaction & Profile (Hari 4)
- [ ] checkout.html + checkout.js
- [ ] tracking.html + tracking.js (Leaflet map)
- [ ] profil.html + profil.js

### Phase 4 — Polish & Connect (Hari 5)
- [ ] Inter-page linking (semua tombol menuju halaman yang benar)
- [ ] Auth guard di semua page yang perlu login
- [ ] Dark mode global + color theme
- [ ] Scroll reveal semua section
- [ ] Responsive mobile (breakpoint: 768px)
- [ ] Testing full flow (register → cari → pesan → tracking)

---

## 🤖 PROMPT TEMPLATE UNTUK AI AGENT

Gunakan format berikut saat mendelegasikan ke AI Agent per halaman:

```
Saya sedang membangun prototype website rental mobil "DriveEase".
Saya butuh kamu membuat [NAMA FILE].

DESIGN SYSTEM:
- Font: Outfit (display) + DM Sans (body)
- Primary color: #1A6BF5 (blue)
- Style: Modern-minimalis, clean, UX-friendly
- Animasi: fadeInUp, hover lift cards, smooth transitions
- CSS Variables dari global.css (terlampir)

HALAMAN: [Deskripsi sesuai blueprint section di atas]
DEPENDENCIES CDN: [Paste dari bagian Dependencies]
DATA: [Paste dari dummy data yang relevan]
KONEKSI: File ini terhubung ke [daftar halaman lain via link/params]

REQUIREMENTS:
1. [Requirement spesifik dari blueprint section]
2. Semua data pakai localStorage / dummy
3. Responsive mobile (min-width: 768px)
4. Sertakan inline comments pada logic penting
5. Ikuti naming convention: driveease_[key] untuk localStorage
```

---

*Blueprint v1.0 | DriveEase Prototype | Ridd × Claude Mentor X*
*Last updated: 2025*
