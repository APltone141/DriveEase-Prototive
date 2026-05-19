# readme.md — DriveEase Rental Car Prototype
> Technical Specification & Developer Reference  
> Version: 1.0 · Status: Prototype · Last Updated: 2026

---

## DAFTAR ISI

1. [Project Overview](#1-project-overview)
2. [File & Folder Structure](#2-file--folder-structure)
3. [Design System](#3-design-system)
   - 3.1 Color Palette
   - 3.2 Typography
   - 3.3 Spacing Scale
   - 3.4 Border Radius & Shadows
   - 3.5 Z-Index Scale
   - 3.6 Breakpoints & Responsivitas
4. [CSS Architecture](#4-css-architecture)
   - 4.1 global.css
   - 4.2 themes.css
   - 4.3 components.css
   - 4.4 animations.css
5. [Halaman & Fitur](#5-halaman--fitur)
   - 5.1 index.html — Beranda
   - 5.2 layanan.html — Daftar Produk
   - 5.3 detail.html — Detail Kendaraan
   - 5.4 checkout.html — Pemesanan
   - 5.5 tracking.html — Tracking Pesanan
   - 5.6 profil.html — Profil Pengguna
   - 5.7 login.html — Autentikasi
6. [JavaScript Modules](#6-javascript-modules)
   - 6.1 core/storage.js
   - 6.2 core/auth.js
   - 6.3 core/router.js
   - 6.4 core/navbar.js
   - 6.5 core/theme.js
   - 6.6 data/cars.js
   - 6.7 pages/home.js
   - 6.8 pages/layanan.js
   - 6.9 pages/detail.js
   - 6.10 pages/checkout.js
   - 6.11 pages/tracking.js
   - 6.12 pages/profil.js
7. [Komponen UI](#7-komponen-ui)
8. [Animasi & Transisi](#8-animasi--transisi)
9. [Data Model](#9-data-model)
10. [User Flows](#10-user-flows)
11. [Third-Party Dependencies](#11-third-party-dependencies)
12. [Area Pengembangan Lanjutan](#12-area-pengembangan-lanjutan)

---

## 1. Project Overview

**DriveEase** adalah prototype aplikasi web rental mobil full-client-side berbasis HTML/CSS/JavaScript vanilla (ES Modules). Seluruh state dan data disimpan di `localStorage` tanpa backend server. Cocok sebagai referensi UI/UX, bahan ajar, atau fondasi sebelum integrasi backend nyata.

### Karakteristik Teknis Utama
- **Stack**: Pure HTML5 · Vanilla CSS · Vanilla JS ES Modules (no bundler)
- **Rendering**: Client-side, static files — dapat dijalankan langsung via browser
- **Persistensi**: `localStorage` sebagai pseudo-database
- **Auth**: Session simulasi via localStorage (password di-hash dengan `btoa`)
- **Map**: Leaflet.js (OpenStreetMap tiles)
- **Icons**: Font Awesome 6.5
- **Fonts**: Google Fonts (Outfit · DM Sans · JetBrains Mono)
- **Routing**: Hard navigation (tiap halaman = file `.html` terpisah)

---

## 2. File & Folder Structure

```
driveease/
│
├── index.html                  # Beranda
├── layanan.html                # Daftar & filter produk
├── detail.html                 # Detail kendaraan + booking widget
├── checkout.html               # Checkout 4-step
├── tracking.html               # Tracking pesanan + peta
├── profil.html                 # Profil pengguna
├── login.html                  # Login & Register
│
├── assets/
│   ├── css/
│   │   ├── global.css          # Reset, CSS Variables, Typography, Layout utils
│   │   ├── themes.css          # Dark mode, Color accent themes, overrides
│   │   ├── components.css      # Semua komponen UI reusable
│   │   └── animations.css      # Keyframes, utility classes, scroll reveal
│   │
│   └── js/
│       ├── core/
│       │   ├── storage.js      # localStorage abstraction layer
│       │   ├── auth.js         # Register, login, logout, validasi
│       │   ├── router.js       # URL params, toast, scroll reveal, counter
│       │   ├── navbar.js       # Init navbar, auth state, dropdown, drawer
│       │   └── theme.js        # Dark mode toggle, accent color switcher
│       │
│       ├── data/
│       │   └── cars.js         # Dataset 9 kendaraan + helper functions
│       │   └── pricing.js      # perhitung sewa per hari berdasarkan Tier fasility
|       |   └── tiers.js        # Kalkulasi har Tier
|       |   
|       |   
│       └── pages/
│           ├── home.js         # Script beranda
│           ├── layanan.js      # Script filter & grid produk
│           ├── detail.js       # Script halaman detail
│           ├── checkout.js     # Script checkout multi-step
│           ├── tracking.js     # Script tracking & peta
│           └── profil.js       # Script profil pengguna
│
└── components/
    └── navbar.html             # Snippet navbar
```

---

## 3. Design System

### 3.1 Color Palette

Semua warna didefinisikan sebagai CSS Custom Properties di `:root` dalam `global.css`.

#### Light Mode (Default)
| Token | Nilai | Penggunaan |
|---|---|---|
| `--color-primary` | `#1A6BF5` | CTA, link aktif, focus ring |
| `--color-primary-dark` | `#1250C2` | Hover primary |
| `--color-primary-light` | `#4D8EFF` | Gradients, icon tint |
| `--color-primary-subtle` | `#EBF1FF` | Background chip/badge, input focus bg |
| `--color-bg` | `#FFFFFF` | Latar halaman utama |
| `--color-surface` | `#F4F7FE` | Section alt, sidebar, footer bg |
| `--color-surface-2` | `#E8EEF9` | Input bg, skeleton, toggle track |
| `--color-border` | `#D1DCF0` | Semua border elemen |
| `--color-text` | `#0D1B3E` | Teks utama |
| `--color-text-muted` | `#6B7A9E` | Teks sekunder, placeholder, label |
| `--color-success` | `#22C55E` | Status selesai, checkmark |
| `--color-warning` | `#F59E0B` | Status menunggu, badge warning |
| `--color-danger` | `#EF4444` | Error, tombol hapus, badge danger |
| `--color-info` | `#06B6D4` | Badge info, toast info |

#### Dark Mode — `[data-theme="dark"]`
| Token | Nilai |
|---|---|
| `--color-bg` | `#0A0F1E` |
| `--color-surface` | `#111827` |
| `--color-surface-2` | `#1C2438` |
| `--color-border` | `#2A3556` |
| `--color-text` | `#E8EDF8` |
| `--color-text-muted` | `#8896B3` |

#### Accent Color Themes — `[data-accent]`
Tiga pilihan accent yang bisa di-switch runtime via `theme.js`:

| Accent | Primary | Dark | Light | Subtle |
|---|---|---|---|---|
| `blue` (default) | `#1A6BF5` | `#1250C2` | `#4D8EFF` | `#EBF1FF` |
| `red` | `#EF4444` | `#DC2626` | `#F87171` | `#FEF2F2` |
| `orange` | `#F97316` | `#EA580C` | `#FB923C` | `#FFF7ED` |

### 3.2 Typography

| Token | Font Family | Penggunaan |
|---|---|---|
| `--font-display` | `Outfit` (400–800) | Heading, brand, harga, label besar |
| `--font-body` | `DM Sans` (400–600) | Semua body text, form, tombol |
| `--font-mono` | `JetBrains Mono` (400–500) | Kode booking, KTP, no. polisi |

#### Font Size Scale
| Token | Nilai | Px |
|---|---|---|
| `--text-xs` | `0.75rem` | 12px |
| `--text-sm` | `0.875rem` | 14px |
| `--text-base` | `1rem` | 16px |
| `--text-lg` | `1.125rem` | 18px |
| `--text-xl` | `1.25rem` | 20px |
| `--text-2xl` | `1.5rem` | 24px |
| `--text-3xl` | `1.875rem` | 30px |
| `--text-4xl` | `2.25rem` | 36px |
| `--text-5xl` | `3rem` | 48px |
| `--text-6xl` | `3.75rem` | 60px |

Heading `h1` default = `--text-5xl`, turun responsif: `--text-4xl` (≤1024px), `--text-3xl` (≤768px), `--text-2xl` (≤480px).

### 3.3 Spacing Scale

| Token | Nilai |
|---|---|
| `--sp-1` | 4px |
| `--sp-2` | 8px |
| `--sp-3` | 12px |
| `--sp-4` | 16px |
| `--sp-6` | 24px |
| `--sp-8` | 32px |
| `--sp-12` | 48px |
| `--sp-16` | 64px |
| `--sp-24` | 96px (turun ke 64px di ≤768px) |

### 3.4 Border Radius & Shadows

| Token | Nilai | Penggunaan |
|---|---|---|
| `--radius-pill` | `9999px` | Badge, toggle, search tab |
| `--radius-lg` | `16px` | Card utama, modal, galeri |
| `--radius-md` | `12px` | Dropdown, modal content |
| `--radius-sm` | `8px` | Tombol, input, nav link |
| `--radius-xs` | `4px` | Badge kecil, error span |

| Token Shadow | Nilai |
|---|---|
| `--shadow-sm` | `0 1px 3px rgba(26,107,245,0.08)` |
| `--shadow-md` | `0 4px 16px rgba(26,107,245,0.12)` |
| `--shadow-lg` | `0 8px 32px rgba(26,107,245,0.18)` |
| `--shadow-card` | `0 2px 8px rgba(13,27,62,0.06), 0 8px 24px rgba(13,27,62,0.08)` |

### 3.5 Z-Index Scale

| Token | Nilai | Penggunaan |
|---|---|---|
| `--z-dropdown` | `100` | Dropdown menu |
| `--z-sticky` | `200` | Navbar, filter bar |
| `--z-modal` | `300` | Modal overlay |
| `--z-toast` | `400` | Toast notification |

### 3.6 Breakpoints & Responsivitas

| Breakpoint | Max-width | Perubahan Utama |
|---|---|---|
| Desktop | > 1024px | Grid penuh, navbar lengkap |
| Tablet | ≤ 1024px | `.grid-4` → 2 kolom |
| Mobile | ≤ 768px | Grid → 1 kolom, hamburger menu aktif |
| Mobile XS | ≤ 480px | h1 turun ke `--text-2xl` |

Transisi kecepatan:
- `--transition-fast`: 150ms ease
- `--transition-base`: 250ms ease
- `--transition-slow`: 400ms ease

---

## 4. CSS Architecture

### 4.1 `global.css`

**Fungsi**: Foundation layer — tidak boleh diubah tanpa pertimbangan cascade.

**Konten:**
- `@import` Google Fonts (Outfit, DM Sans, JetBrains Mono)
- Definisi semua `:root` CSS Custom Properties
- Override dark mode via `[data-theme="dark"]`
- CSS Reset modern (`box-sizing`, `margin: 0`, `img display:block`, dll.)
- Typography base (`h1–h6`, `p`, `a`, `code`)
- Layout utilities: `.container` (max 1200px), `.container-sm` (768px), `.container-lg` (1400px), `.section` (padding-block: 96px), `.section-sm`
- Flex helpers: `.flex`, `.flex-col`, `.items-center`, `.justify-between`, dll.
- Grid helpers: `.grid-2`, `.grid-3`, `.grid-4` — semua collapse ke 1 kolom di ≤768px
- Text utilities: `.text-center`, `.text-primary`, `.text-muted`, `.font-display`, `.font-mono`, `.font-bold`, dll.
- Spacing utilities: `.mt-2` sampai `.mt-8`, `.mb-2` sampai `.mb-8`
- Display utilities: `.hidden`, `.sr-only`
- Scrollbar styling, `::selection`, `:focus-visible`
- Responsive breakpoints (1024px, 768px, 480px)

### 4.2 `themes.css`

**Fungsi**: Tema visual — dark mode, color accent, dan overrides library third-party.

**Konten:**
- Transition smooth untuk body, navbar, card, modal, input, dropdown saat theme switch
- `.navbar` styling: transparan by default, `background: rgba(255,255,255,0.92)` + `backdrop-filter: blur(12px)` saat class `.scrolled` aktif (ditambahkan via JS)
- `.hero-gradient`: radial gradient berlapis di atas warna bg
- `.section-alt`: warna surface untuk section bergantian
- `.gradient-text`: gradient clip teks untuk headline hero
- `.stats-bar`: background primary color, teks putih
- Dark mode override untuk: navbar, card-glass, input-field, dropdown, modal, skeleton, scrollbar, divider
- Accent override (blue/red/orange) untuk btn-primary shadow
- **Flatpickr override**: kalender date picker di-theme ulang agar cocok dark/light
- **Leaflet override**: pada dark mode, tile peta di-invert (`filter: invert(1) hue-rotate(180deg)`)
- **Swiper override**: pagination bullet dan navigasi arrow mengikuti `--color-primary`

### 4.3 `components.css`

**Fungsi**: Library komponen UI reusable. Memerlukan `global.css` sebagai dependensi.

#### Komponen yang Tersedia:

**1. Buttons (`.btn`)**
- Base: `display:inline-flex`, `gap`, `padding`, `font-weight:600`, `border-radius`, `transition` (bg, border, color, shadow, transform)
- Hover: `translateY(-2px)`; Active: `translateY(0)`
- Variants: `.btn-primary` (blue shadow), `.btn-secondary` (subtle bg), `.btn-ghost` (outline), `.btn-danger` (red shadow)
- Sizes: `.btn-sm` (padding kecil, text-sm), `.btn-lg` (padding besar, text-lg, radius-md)
- Special: `.btn-shimmer` — shimmer gradient animation via `::after` pseudo-element

**2. Input Fields (`.input-field`)**
- Padding, border 1.5px, background surface, transition border+shadow+bg
- Focus: border primary + `box-shadow 0 0 0 3px rgba(26,107,245,0.15)`
- Error state: border danger + shake animation
- Disabled: opacity 0.6, cursor not-allowed
- `.input-wrapper`: container untuk icon prefix/suffix — `.input-icon` (kiri), `.input-action` (kanan)
- `.has-icon` menambah `padding-left: 2.75rem`, `.has-action` menambah `padding-right: 2.75rem`
- Form group: `.form-group` (flex-col + gap-2), `.form-label`, `.form-hint`, `.form-error`
- Select: custom arrow via background-image SVG inline
- Textarea: `resize:vertical`, min-height 100px

**3. Cards**
- `.card-base`: bg, border, radius-lg, overflow-hidden, transition shadow+transform+border
- `.card-hover`: cursor pointer, hover translateY(-6px) + shadow-lg + border primary
- `.card-glass`: rgba bg + `backdrop-filter: blur(16px)` + border semi-transparan
- `.car-card`: image 16:9 aspect-ratio, hover image scale(1.05), overlay gradient from-bottom, body section (title, meta, price, actions)

**4. Badges (`.badge`)**
- `display:inline-flex`, padding pill, font-size xs, font-weight 600
- Variants: `.badge-success`, `.badge-warning`, `.badge-danger`, `.badge-info`, `.badge-primary`
- Dark mode override: background lebih transparan, warna lebih terang

**5. Modal**
- `.modal-overlay`: `position:fixed inset:0`, backdrop blur 4px, flex center, z-index modal, default `opacity:0 visibility:hidden`
- `.open` class: `opacity:1 visibility:visible`
- `.modal-content`: bg, border, radius-lg, max-width 520px, max-height 90vh, overflow-y auto, `transform: translateY(20px) scale(0.96)` → `translateY(0) scale(1)` saat open
- `.modal-sm` (360px), `.modal-lg` (720px)
- Sections: `.modal-header`, `.modal-body`, `.modal-footer`

**6. Toast Notifications**
- `.toast-container`: `position:fixed top right`, flex-col, z-index toast, pointer-events none
- `.toast`: min-width 280px, border-left 4px berwarna sesuai type, animation `slideDown`
- Types: `.toast-success`, `.toast-warning`, `.toast-error`, `.toast-info`
- `.dismissing` class → animation `fadeOutRight`
- Auto-dismiss setelah durasi (default 3500ms); pause saat hover; close button

**7. Skeleton Loader**
- `.skeleton-loader`: shimmer gradient animation
- Variants: `.skeleton-text`, `.skeleton-title`, `.skeleton-rect`, `.skeleton-circle`

**8. Dropdown Menu**
- `.dropdown` (position:relative), `.dropdown-menu` (position:absolute, top calc(100%+8px), min-width 200px)
- Default: `opacity:0 visibility:hidden transform:translateY(-8px)`; `.open`: visible + `translateY(0)`
- `.dropdown-item`: flex, gap, padding, hover bg surface + color primary
- `.dropdown-item.danger`: hover bg red-tint + color danger
- `.dropdown-divider`: 1px border

**9. Step Progress**
- **Horizontal** (`.stepper-horizontal`): flex, counter-reset step, connector line via `::after` pseudo-element (width 100% dari left 50%), transition warna connector saat `.completed`
- `.step__dot` (36px circle): default grey; `.active` → bg+border primary; `.completed` → bg+border success
- `.step__label`: text-xs; active/completed warna berbeda
- **Vertical** (`.stepper-vertical`): flex-col, connector line via `::before` (left 16px, dari top 36px ke bawah)
- `.vstep.active .vstep__icon`: pulse-ring animation; `.vstep.completed .vstep__icon`: checkmark

**10. Toggle Switch**
- Input hidden, `.toggle-track` (44×24px pill), `.toggle-thumb` (18×18px circle)
- Transition thumb `translateX(20px)` saat checked
- Color track ikut `--color-primary`

**11. Range Slider** (Price Filter)
- `.range-custom`: dual input[type=range] bertumpuk di atas `.range-fill` bar
- `.range-fill`: absolute, height 6px, bg primary, width dikontrol JS
- Thumb styling: 20px circle, hover scale(1.15) + ring shadow

**12. Tabs**
- `.tab-nav` + `.tab-btn` (underline via `::after` width 0→100% saat active)
- `.tab-content`: `display:none`; `.active`: `display:block` + fadeInUp animation
- **Pill variant** (`.tab-nav.tab-pills`): bg surface, border-none, active btn punya bg putih + shadow

**13. Navbar**
- Fixed, z-index sticky, transparent default → scrolled style via `.scrolled` class
- `.navbar__brand`: flex icon + text, `Drive<span>Ease</span>` (span berwarna primary)
- `.nav-link`: relative, `::after` underline animasi
- Hamburger (`.hamburger`): 3 span lines, `.open` state: X transform
- Mobile drawer (`.nav-drawer`): `right:-100%` → `right:0` saat `.open`, width min(320px, 85vw)
- Overlay backdrop untuk drawer

**14. Footer**
- Grid 4 kolom: brand + desc + social + 3 link columns
- Responsive: 2 kolom (≤768px), 1 kolom (≤480px)
- Social buttons, footer links, bottom copyright + legal links

**15. Search Widget** (Hero)
- Card putih, shadow-lg, max-width 760px
- Tabs mode (dengan sopir / tanpa sopir / lepas kunci)
- Grid 3 kolom field → 1 kolom di mobile

**16. Order Summary** (Checkout sidebar)
- `position:sticky top:100px`
- `.order-line` (flex space-between, text-sm)
- `.order-line.total`: font-weight 700, border-top, value berwarna primary besar

**17. Payment Method Selector**
- `.payment-option`: border card, `.selected` → border primary + box-shadow subtle
- Accordion: sub-options tampil/sembunyi via JS
- `.payment-sub-option`: mini card dengan radio, berwarna primary saat checked

**18. Success Screen**
- `.success-screen`: text-center, padding besar
- `.success-checkmark`: 80px circle bg success-tint, icon check
- `.booking-id`: font-mono, bg primary-subtle, inline-block

### 4.4 `animations.css`

**Fungsi**: Library keyframe dan utility class animasi.

#### Keyframes yang Tersedia:
| Nama | Efek |
|---|---|
| `fadeInUp` | opacity 0→1 + translateY(24px→0) |
| `fadeInDown` | opacity 0→1 + translateY(-24px→0) |
| `fadeInLeft` | opacity 0→1 + translateX(-24px→0) |
| `fadeInRight` | opacity 0→1 + translateX(24px→0) |
| `fadeIn` | opacity 0→1 |
| `fadeOut` | opacity 1→0 |
| `shimmer` | background-position sweep (skeleton/shimmer btn) |
| `pulse-ring` | scale(1→1.8) + opacity 1→0 (active step marker) |
| `pulse-soft` | opacity 1→0.5→1 (processing text) |
| `shake` | translateX zig-zag (form error) |
| `slideDown` | opacity + translateY(-10→0) (toast in) |
| `slideUp` | opacity + translateY(10→0) |
| `slideInRight` / `slideInLeft` | translateX masuk dari kanan/kiri |
| `scaleIn` | opacity + scale(0.88→1) |
| `strokeCheck` | stroke-dashoffset → 0 (SVG checkmark) |
| `spin` | rotate 0→360deg (spinner) |
| `bounce` | translateY(0→-8px→0) dengan easing cubic-bezier |
| `float` | translateY(0→-12px→0) melayang |
| `progressFill` | width 0% → var(--target-width) |
| `confetti-fall` | translateY(-20→120vh) + rotate(720deg) |
| `countBlink` | opacity blink sebelum counter mulai |
| `cardEnter` | scale(0.94)+translateY(12→0) (filter grid refresh) |
| `priceFlip` | rotateX(90→0deg) (price update di sidebar) |
| `menuSlide` | scaleX(0→1) (active nav indicator) |

#### Utility Classes Animasi:
```
.animate-fade-in, .animate-fade-in-up, .animate-fade-in-down
.animate-fade-in-left, .animate-fade-in-right
.animate-scale-in, .animate-slide-down, .animate-slide-up
.animate-shimmer, .animate-pulse-ring, .animate-pulse-soft
.animate-spin, .animate-bounce, .animate-float, .animate-shake
```

#### Stagger Delays:
`.stagger-1` (100ms) sampai `.stagger-8` (800ms)

#### Duration Overrides:
`.duration-150`, `.duration-300`, `.duration-500`, `.duration-700`, `.duration-1000`

#### Scroll Reveal System:
Diaktifkan oleh `IntersectionObserver` di `router.js`:
- `.reveal`: opacity 0 + translateY(30px) → visible
- `.reveal-left`: translateX(-30px) → visible
- `.reveal-right`: translateX(30px) → visible
- `.reveal-scale`: scale(0.92) → visible
- Transition: 500ms ease
- `.reveal-group > *:nth-child(1..6)`: stagger delay 50ms–550ms

#### Komponen-Spesifik:
- `.spinner` / `.spinner-sm` / `.spinner-lg`: border-top spinning
- `.processing-text`: pulse-soft untuk loading text pembayaran
- `.checkmark-circle` + `.checkmark-check`: SVG stroke animation berurutan
- `.hero-word`: word-by-word fade-in hero
- `.card-enter`: filter refresh animation
- `.vstep`: reveal dari kiri untuk timeline step
- `.confetti-piece`: confetti particle fixed positioning
- `.btn-shimmer`: gradient sweep CTA button
- `.stat-number.counting`: blink sebelum angka naik
- **Prefers Reduced Motion**: semua animasi di-disable dengan `animation-duration: 0.01ms !important`

---

## 5. Halaman & Fitur

### 5.1 `index.html` — Beranda

**Script**: `assets/js/pages/home.js`

#### Fitur Utama:
- **Hero Section** dengan parallax-style background (CSS + `mix-blend-mode: overlay`)
- **Search Widget** (#homeSearchWidget): form pencarian dengan 3 tab mode (Dengan Sopir / Tanpa Sopir / Lepas Kunci), field kota (dengan `<datalist>` 10 kota), tanggal pickup/drop, jam, jumlah penumpang → submit redirect ke `layanan.html` dengan query params
- **Stats Bar**: 4 angka animated counter (500+ Armada, 4.9 Rating, 25+ Kota, 50.000+ Pesanan) menggunakan `IntersectionObserver`
- **How It Works**: 5-step grid card (Cari → Pilih → Bayar → Pickup → Selesai)
- **Featured Cars Grid**: 3 kartu kendaraan unggulan dari `getFeaturedCars()` — dinamis dari `cars.js`

#### Flow Script `home.js`:
```
boot()
  → initNavbar()
  → renderFeaturedCars()      // inject 3 car-card ke #featuredCarsGrid
  → initScrollReveal()        // observe semua .reveal elements
  → initStatsCounters()       // observe .js-stat-counter, animasi angka
  → initSearchWidget()        // wire tabs + form submit → navigate()
```

#### Stats Counter Detail:
- `IntersectionObserver` threshold 0.35 — trigger saat elemen 35% masuk viewport
- Easing: `1 - (1-p)^3` (ease-out cubic)
- Duration: 1600ms
- Support `data-target`, `data-suffix`, `data-prefix`, `data-decimals`

#### Search Widget Detail:
- Tab click → set `data-mode` ke hidden input `#searchMode`
- Tanggal default: hari ini (pickup) dan +3 hari (drop)
- Validasi: kota harus diisi; drop harus setelah pickup → `showToast` jika gagal
- Submit: `navigate('layanan.html', { city, pickup, drop, pax, pickupTime, mode })`

---

### 5.2 `layanan.html` — Daftar Produk

**Script**: `assets/js/pages/layanan.js`

#### Fitur Utama:
- **Filter Bar** (sticky, `top:72px`): Jenis, Brand, Kapasitas, Driver mode, Price Range (dual slider)
- **Product Grid**: responsive auto-fill 280px, lazy reveal via `.reveal` class
- **Sort**: Populer / Harga ↑ / Harga ↓ / Rating
- **Load More**: pagination client-side (PAGE_SIZE = 6)
- **Search Context Line**: tampilkan konteks dari search widget beranda (kota, tanggal, penumpang)
- **URL Params Support**: `city`, `pickup`, `drop`, `pax`, `mode`, `pickupTime` — disimpan ke `localStorage` sebagai search cache

#### Flow Filter:
```
applyFilters()
  → readFilters()         // baca semua nilai filter dari DOM
  → filterCars(params)    // dari cars.js, multi-criteria filter
  → sortCars(list, method)
  → renderGrid()          // inject HTML card ke #productGrid
  → initScrollReveal()    // reinit observer untuk card baru
```

#### Dual Range Slider Mekanisme:
- Dua `<input type="range">` bertumpuk (absolute positioning)
- Event `input` → `syncPriceRangeInputs()`: pastikan min tidak melewati max (gap min 50.000)
- `updatePriceRangeFill()`: kalkulasi `left%` dan `width%` dari `.range-fill` div
- Range: 150.000 – 1.500.000 (step 50.000)

#### Car Card HTML (dinamis):
Setiap card berisi: gambar lazy-load, badge (opsional), overlay hover dengan tombol Detail, title, rating star, meta (type + seats + AC), driver label, harga mulai, aksi (Detail + Pesan).

---

### 5.3 `detail.html` — Detail Kendaraan

**Script**: `assets/js/pages/detail.js`

#### Fitur Utama:
- **Breadcrumb**: Beranda > Layanan > [Nama Mobil]
- **Gallery**: main image 16:9 + thumbnail strip (max 4) — klik thumbnail → swap main image
- **Tab Panel** (4 tab): Deskripsi | Spesifikasi | Paket | Peraturan
- **Spec Table**: engine, transmisi, bahan bakar, kecepatan maks, kapasitas, bagasi, bluetooth, USB, GPS
- **Package Cards**: grid paket dengan tombol "Pilih paket ini" → update select di sidebar
- **Sticky Booking Sidebar** (`position:sticky top:96px`): select paket, tanggal pickup/drop, opsi sopir checkbox, estimasi harga real-time, tombol checkout, tombol wishlist
- **Similar Cars Strip**: horizontal scroll, mobil sejenis (max 4)
- **Reviews Placeholder**: area placeholder untuk ulasan

#### Price Estimation (Sidebar):
```
updateEstimate(car)
  → rentalDays(pickup, drop)        // kalkulasi jumlah hari
  → selectedPackagePrice(car)       // ambil harga dari paket yang dipilih
  → subtotal = pkgPrice × days
  → insurance = 50.000 × days
  → driver = withDriver ? 200.000 × days : 0
  → total = subtotal + insurance + driver
  → render ke #lineSubtotal, #lineInsurance, #lineDriver, #lineTotal
```

Event trigger: change/input pada `#sidebarPackage`, `#sidebarPickup`, `#sidebarDrop`, `#sidebarWithDriver`.

#### Wishlist Mekanisme:
- Data disimpan ke `localStorage` key `driveease_wishlist` (array car ID)
- Toggle: cek apakah car.id ada di array → splice atau push
- Toast feedback: "Disimpan ke wishlist" / "Mobil dihapus dari wishlist"

#### Checkout Navigation:
```
#btnCheckout click
  → rentalDays() validasi
  → buildQuery({ id, package, pickup, drop, withDriver })
  → window.location.href = 'checkout.html' + query
```

---

### 5.4 `checkout.html` — Pemesanan 4-Step

**Script**: `assets/js/pages/checkout.js`

#### Fitur Utama (Protected Page — harus login):
- **4-Step Wizard**: Paket → Data → Bayar → Selesai
- **Stepper indicator**: horizontal step dots dengan connector line, state completed/active/pending
- **Order Summary Sidebar** (sticky, hilang di step 4)
- **Promo Code**: kode `DRIVE10` → diskon 10% dari subtotal
- **File Preview**: upload foto KTP + SIM → preview image langsung di bawah input
- **Payment Method**: E-Wallet (GoPay/OVO/DANA) + Transfer Bank (BCA/Mandiri) dengan accordion sub-option
- **Payment Processing Overlay**: loading spinner fullscreen 2 detik simulasi (90% success rate)
- **Success Screen**: booking ID, ringkasan, link ke tracking

#### State Variables:
- `currentCar`: objek kendaraan dari `getCarById()`
- `promoDiscount`: nominal diskon (default 0)
- `lastBookingId`: ID booking yang baru dibuat

#### Step Transitions:
```
setStep(n)
  → show/hide .checkout-step sections
  → update .step dots (completed/active)
  → hide sidebar saat step 4
  → toggle .is-finish pada layout grid
  → jika step 3: renderPayStepLines()
```

#### Kalkulasi Total:
```
computeTotals()
  → days = rentalDays(pickupDate, dropDate)
  → pkg = getSelectedPkg(car)
  → subtotal = computeSubtotal(pkg, days) - promoDiscount
  → insurance = perDayIns × days  // basic: 50k, comprehensive: 75k
  → driver = withDriver ? 200.000 × days : 0
  → total = subtotal + insurance + driver + deposit
```

Package pricing logic:
- `Weekend` package: harga flat (bukan × days)
- `Weekly` package: `price × (days / 7)` — prorated
- Lainnya: `price × days`

#### Booking Save Flow:
```
handlePay()
  → validasi agreeTerms checkbox
  → tampilkan #payOverlay (spinner)
  → setTimeout 2000ms → random success (90%)
  → jika success:
    → saveBooking() → Storage.upsertBooking()
    → update #coBookingId, #coSuccessCard
    → set href #coToTrack dengan booking ID
    → setStep(4)
  → jika gagal: showToast error
```

#### Booking Object yang Disimpan:
```js
{
  id, userId, carId, carName, package,
  pickupDate, pickupTime, dropDate, dropTime,
  city, address, withDriver, insurance,
  renterData: { name, email, phone, ktp, sim },
  payment: { method, status: 'paid', total },
  status: 'confirmed',
  statusHistory: [{ status, time }],
  carLocation: { lat, lng },
  driverName, driverPhone, plateNumber, notes
}
```

---

### 5.5 `tracking.html` — Tracking Pesanan

**Script**: `assets/js/pages/tracking.js`

#### Fitur Utama (Protected Page):
- **Tab Filter**: Aktif / Menunggu / Selesai / Dibatalkan
- **Booking Selector**: `<select>` dropdown pilih pesanan per tab
- **Status Display**: ID pesanan (monospace), badge status, nama kendaraan
- **Timeline Vertical**: 6 langkah perjalanan pesanan dengan state completed/active/pending
- **Leaflet Map**: peta interaktif OSM, marker posisi kendaraan
- **Simulated Route**: marker bergerak otomatis mengikuti array ROUTE (4 titik, interval 5 detik)
- **Detail Card**: informasi lengkap pesanan (no. polisi, pickup, drop, total, driver)
- **Invoice Button**: placeholder (tersedia di versi produksi)
- **Cancel Button**: ubah status pesanan ke `cancelled` via `Storage.updateBookingStatus()`

#### Timeline Steps (6 step):
1. Pesanan dikonfirmasi
2. Pembayaran berhasil
3. Mobil siap pickup
4. Mobil diambil (pickup)
5. Sedang digunakan
6. Pengembalian (drop off)

#### Step Index Logic:
```js
currentStepIndex(booking)
  → status 'cancelled': return -1
  → status 'completed': return STEPS.length (semua hijau)
  → status 'active': return 4
  → status 'confirmed': return 2
  → default: return 1
```

#### Map Lifecycle:
```
initMap(booking)
  → destroy mapInstance lama + clearInterval routeTimer
  → L.map('#map').setView([lat, lng], 14)
  → L.tileLayer OpenStreetMap
  → L.marker di posisi awal
  → setInterval 5s: markerLayer.setLatLng(ROUTE[i])
                     mapInstance.panTo(...)
```

---

### 5.6 `profil.html` — Profil Pengguna

**Script**: `assets/js/pages/profil.js`

#### Fitur Utama (Protected Page):
- **Sidebar navigasi**: 4 section + tombol hapus akun
- **Section: Data Saya**: form edit profil (nama, email, telepon, tanggal lahir, gender, alamat) + upload/preview avatar
- **Section: Riwayat**: daftar booking dengan tab filter (Semua/Aktif/Selesai/Dibatalkan), link ke tracking dan "Pesan lagi"
- **Section: Pembayaran**: daftar metode pembayaran dummy (Visa, BCA VA) + tambah metode (placeholder)
- **Section: Pengaturan**: toggle dark mode, pemilih accent color (blue/red/orange), toggle notifikasi (3 jenis), form ganti password
- **Hapus Akun**: modal konfirmasi → `deleteAccount()` → redirect beranda

#### Avatar Upload:
```
#avatarInput change
  → FileReader.readAsDataURL(file)
  → preview langsung via URL.createObjectURL()
  → jika ukuran ≤ 120KB: simpan base64 ke Storage.upsertUser()
```

#### Hash Navigation:
URL hash (`#data`, `#riwayat`, `#pembayaran`, `#pengaturan`) → `showSection()` saat load dan `hashchange` event. Click tab → `history.replaceState()` untuk sinkronisasi URL.

---

### 5.7 `login.html` — Autentikasi

**Script**: `auth.js` (initLoginPage)

#### Fitur Utama:
- Split-screen layout: form kiri, brand panel kanan dengan background foto + overlay gradient
- **Tab**: Masuk / Daftar
- **Login Form**: email, password (dengan toggle show/hide), "Ingat Saya" checkbox, "Lupa Password" (modal placeholder)
- **Register Form**: nama, email, telepon, password (show/hide), konfirmasi password (show/hide), checkbox syarat & ketentuan
- **Google SSO button**: disabled, placeholder untuk produksi
- **Auto-redirect**: jika sudah login → redirect ke `returnUrl` dari query param atau `index.html`
- **Remember Me**: simpan user ID ke `localStorage` key `driveease_remember`, auto-restore sesi

#### Hash Navigation:
`login.html#register` → auto-click tab register saat load.

---

## 6. JavaScript Modules

### 6.1 `core/storage.js`

Singleton IIFE `Storage` — abstraksi `localStorage`.

**Keys yang Digunakan:**
| Key | Tipe Data | Isi |
|---|---|---|
| `driveease_users` | `Array<User>` | Semua data pengguna |
| `driveease_currentUser` | `string` | ID user yang sedang login |
| `driveease_bookings` | `Array<Booking>` | Semua data pemesanan |
| `driveease_theme` | `'light'` \| `'dark'` | Preferensi tema |
| `driveease_accentColor` | `'blue'` \| `'red'` \| `'orange'` | Preferensi accent |
| `driveease_wishlist` | `Array<string>` | Array car ID yang di-wishlist |
| `driveease_searchCache` | `Object` | Cache parameter pencarian terakhir |

**Method Utama:**
```
// Generic
get(key, fallback)    // JSON.parse dengan try-catch
set(key, value)       // JSON.stringify
remove(key)
clear()               // hapus semua keys

// Users
getUsers() / saveUsers(users)
getUserById(id) / getUserByEmail(email)
upsertUser(user)      // update jika id sama, insert jika baru
deleteUser(id)

// Session
getCurrentUser()      // lookup user berdasarkan stored ID
setCurrentUser(userId)
clearSession()        // remove currentUser key
isLoggedIn()          // return boolean

// Bookings
getBookings() / saveBookings(bookings)
getBookingById(id)
getBookingsByUser(userId)
upsertBooking(booking)
updateBookingStatus(id, status)
  → juga append ke statusHistory array

// Wishlist
getWishlist() / addToWishlist(carId) / removeFromWishlist(carId)
toggleWishlist(carId) → return boolean (true = added)
isWishlisted(carId)

// Preferences
getTheme() / setTheme(value)
getAccent() / setAccent(value)

// Seed
seedIfEmpty()  // insert 1 dummy user (budi@email.com / Password1) dan 1 dummy booking
```

### 6.2 `core/auth.js`

**Validators:**
- `email`: regex `^[^\s@]+@[^\s@]+\.[^\s@]+$`
- `password`: min 8 char, 1 uppercase, 1 digit — regex `^(?=.*[A-Z])(?=.*\d).{8,}$`
- `phone`: format Indonesia `^(\+62|62|0)8[1-9][0-9]{7,10}$` (whitespace di-strip)
- `name`: min 3 karakter

**Password Hashing**: `btoa(plain)` — Base64 encoding sederhana (bukan kriptografi nyata, hanya prototype).

**register(fields):**
1. Validasi semua field → kumpulkan errors
2. Cek email duplikat via `Storage.getUserByEmail()`
3. Buat user object dengan `generateId()` (`'usr_' + Date.now().toString(36) + random`)
4. `Storage.upsertUser()` + `Storage.setCurrentUser()`
5. Return `{ success, user }` atau `{ success: false, errors }`

**login(fields):**
1. Validasi format email
2. `getUserByEmail()` → jika tidak ada: error
3. `verifyPassword(plain, hashed)` → `btoa(plain) === hashed`
4. `Storage.setCurrentUser()`
5. Handle remember: simpan/hapus `driveease_remember`

**checkAuth():**
- Daftar protected pages: `['checkout.html', 'tracking.html', 'profil.html']`
- Jika tidak login: redirect ke `login.html?returnUrl=...`

**DOM Helpers:**
- `markError(inputEl, message)`: tambah class `error` + insert `.form-error` span
- `clearError(inputEl)`: hapus error saat user mulai mengetik (event `input`, `{ once: true }`)

**initLoginPage():**
```
→ seedIfEmpty()
→ restoreSession()   // cek localStorage remember
→ jika sudah login: redirect
→ wire tab toggle (Masuk/Daftar)
→ wire loginForm submit → login() → showToast → redirect
→ wire registerForm submit → register() → showToast → redirect
→ wire password toggle buttons [data-toggle-password]
```

### 6.3 `core/router.js`

**URL Utilities:**
- `getParam(key, fallback)`: baca dari `URLSearchParams`
- `buildQuery(params)`: build query string, skip null/undefined/empty
- `navigate(path, params)`: `window.location.href = path + buildQuery(params)`

**Scroll Utilities:**
- `scrollToTop(smooth)`: `window.scrollTo()`
- `scrollToElement(el, offset=80)`: kalkulasi top dengan offset sticky navbar

**Scroll Reveal — `initScrollReveal()`:**
- `IntersectionObserver` threshold 0.12, rootMargin `-40px bottom`
- Observe semua `.reveal`, `.reveal-left`, `.reveal-right`, `.reveal-scale`
- Saat intersecting: tambah `.visible` → CSS transition aktif → `unobserve()`
- `_revealObserver.disconnect()` + reinit untuk fresh re-observe

**Navbar Scroll — `initNavbarScroll()`:**
- `scroll` event listener (passive:true), threshold 80px
- Toggle `.scrolled` class pada `.navbar`

**Toast — `showToast(type, title, message, duration)`:**
- Auto-create `.toast-container` jika belum ada di DOM
- Types: `success | error | warning | info`
- Icon: FA solid (circle-check / circle-xmark / triangle-exclamation / circle-info)
- Auto-dismiss: `setTimeout(close, duration)`; hover → `clearTimeout`; hover leave → close setelah 1 detik
- Close: tambah `.dismissing` → `fadeOutRight` animation → `remove()`

**Stats Counter — `initCounters()`:**
- Observe `[data-counter]` elemen
- Support: `data-counter` (target), `data-suffix`, `data-prefix`, `data-decimals`
- Easing: `1 - (1-progress)^3`
- Duration: 1800ms via `requestAnimationFrame`

**initPage():** memanggil semua init sekaligus: navbar scroll, mobile nav, active link, scroll reveal, counters.

### 6.4 `core/navbar.js`

`initNavbar()` dipanggil di setiap page:
```
→ initNavbarScroll()        // dari router.js
→ setActiveNavLink()        // match URL dengan nav-link href
→ initThemeControls()       // dari theme.js
→ _wireDrawer()
→ _updateAuthState()
→ _wireDropdown()
```

**`_updateAuthState()`:**
- Ambil `Storage.getCurrentUser()`
- Toggle `hidden` class pada `#navGuest` / `#navUser`
- Isi avatar src, nama pengguna (first name only), email di drawer
- Hitung booking aktif → tampilkan badge dengan count jika > 0
- Wire logout button (navLogoutBtn + drawerLogoutBtn) → `logout()`

**`_wireDropdown()`:**
- Click avatar button → toggle `.open` pada `#navDropdownMenu`
- Click di luar → close dropdown (document click listener)
- `e.stopPropagation()` pada menu itu sendiri

**`_wireDrawer()`:**
- Hamburger click → open/close
- Overlay click → close
- Semua `<a>` di dalam drawer → close on click
- `body.style.overflow = 'hidden'` saat open

### 6.5 `core/theme.js`

**`initTheme()`:** dipanggil saat halaman load — baca `Storage.getTheme()` + `Storage.getAccent()` → apply keduanya.

**`applyTheme(mode)`:**
- `document.documentElement.setAttribute('data-theme', mode)`
- `Storage.setTheme(mode)`
- `_updateThemeToggleUI(mode)`: update semua `[data-theme-toggle]` checkbox + icon

**`applyAccent(accent)`:**
- Lookup warna dari `ACCENT_COLORS` object
- Set 4 CSS custom properties via `documentElement.style.setProperty()`
- `document.documentElement.setAttribute('data-accent', accent)`
- `_updateAccentUI(accent)`: update `.selected` class pada `[data-accent-option]`

**`toggleTheme()`:** flip light ↔ dark, persist ke user profile jika login.

**`initThemeControls()`:** wire semua `[data-theme-toggle]`, `[data-accent-option]`, `[data-navbar-theme]` di DOM.

**Anti-FOUC Script** (inline di setiap halaman, sebelum CSS):
```js
(function () {
  const theme  = localStorage.getItem('driveease_theme')  || 'light';
  const accent = localStorage.getItem('driveease_accentColor') || 'blue';
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.setAttribute('data-accent', accent);
  // set CSS custom properties langsung
})();
```
Script ini dijalankan synchronous sebelum parsing CSS sehingga tidak ada flash of unstyled content.

### 6.6 `data/cars.js`

**Dataset:** 9 kendaraan tetap (no API).

#### Struktur Objek Car:
```js
{
  id, name, brand, type, year, seats, transmission, fuel,
  ac, withDriver, selfDrive,
  pricePerDay,      // null jika hanya tersedia dengan sopir
  priceWithDriver,  // null jika tidak ada driver option
  deposit,
  rating, reviewCount,
  featured, badge,
  images: [],      // array URL Unsplash
  specs: {
    engine, maxSpeed, luggage, bluetooth, usb, gps
  },
  packages: [
    { name, duration, price }  // Harian, Full Day, Weekend, Weekly
  ],
  location,        // string "Kota1, Kota2, ..."
  available,
  description
}
```

#### Helper Functions:
- `getCarById(id)`: find by id
- `getFeaturedCars()`: filter `featured === true`
- `filterCars({ type, brand, seats, minPrice, maxPrice, driver, query })`: multi-criteria filter
  - seats `8+`: filter `car.seats >= 8`; lainnya exact match
  - price: cek `pricePerDay || priceWithDriver`
  - driver: `'Lepas Kunci'` → `selfDrive === true`; `'Dengan Sopir'` → `withDriver === true`
  - query: search name + brand case-insensitive
- `sortCars(cars, method)`: spread + sort berdasarkan harga naik/turun, rating, atau review count (Populer)
- `formatPrice(amount)`: `'Rp ' + amount.toLocaleString('id-ID')`
- `getStartingPrice(car)`: return `pricePerDay || priceWithDriver || 0`

#### Dataset Summary:
| ID | Nama | Tipe | Harga/Hari | Featured |
|---|---|---|---|---|
| car_001 | Toyota Innova Zenix | MPV | 450k | ✓ |
| car_002 | Honda CR-V | SUV | 500k | ✓ |
| car_003 | Toyota Avanza | MPV | 250k | ✗ |
| car_004 | Mitsubishi Pajero Sport | SUV | 750k | ✓ |
| car_005 | Toyota Fortuner | SUV | 650k | ✗ |
| car_006 | Suzuki Ertiga | MPV | 280k | ✗ |
| car_007 | Honda Brio | City Car | 180k | ✗ |
| car_008 | Toyota Alphard | Luxury MPV | null (sopir 1500k) | ✗ |
| car_009 | Mitsubishi Xpander | MPV | 350k | ✗ |

---

## 7. Komponen UI

### Navbar — Anatomy
```
.navbar
  └─ .container
       ├─ .navbar__brand (icon + "Drive<span>Ease</span>")
       ├─ .navbar__links (ul > li > .nav-link × N)
       └─ .navbar__actions
            ├─ [data-navbar-theme] (dark toggle button)
            ├─ #navAuthArea
            │    ├─ #navGuest (masuk + daftar btn)
            │    └─ #navUser (hidden → ditampilkan JS)
            │         ├─ #navBookingBadge (bell icon + count)
            │         └─ .dropdown#navAvatarDropdown
            │              ├─ #navAvatarBtn (avatar img + nama)
            │              └─ .dropdown-menu#navDropdownMenu
            └─ .hamburger#hamburger (mobile)
```

### Car Card — Anatomy
```
.car-card
  ├─ .car-card__image (aspect-ratio 16:9)
  │    ├─ img (lazy-load)
  │    ├─ .car-card__badge (opsional)
  │    └─ .car-card__overlay (hover, gradient dark from-bottom)
  └─ .car-card__body
       ├─ .car-card__title
       ├─ .car-card__meta (rating + ulasan)
       ├─ .car-card__meta (type + seats + AC)
       ├─ .car-card__meta (driver option)
       ├─ .car-card__price (harga + "/hari")
       └─ .car-card__actions (ghost + primary btn)
```

### Checkout Stepper — States
```
Step dot states:
  default: bg surface-2, border border-color, color muted
  .active:    bg primary, border primary, color white
  .completed: bg success,  border success,  color white

Connector line (.step:not(:last-child)::after):
  default:    bg border
  .completed: bg primary
```

---

## 8. Animasi & Transisi

### Page Load Sequence
Setiap halaman memiliki elemen dengan class `.reveal` dan `.stagger-N` yang aktif via IntersectionObserver. Urutan tipikal beranda:
1. Hero text + search widget: `fadeInUp` (reveal + stagger-1)
2. Stats bar items: stagger-1 sampai stagger-3
3. How It Works cards: stagger-1 sampai stagger-4
4. Featured car cards: stagger otomatis via `.reveal-group`

### Navbar Scroll Behavior
- 0–80px scroll: `background: transparent; border: transparent`
- >80px scroll: `background: rgba(255,255,255,0.92); backdrop-filter: blur(12px); box-shadow: shadow-sm`
- Dark mode: `rgba(10,15,30,0.92)`
- Transition: 350ms ease pada background, box-shadow, border-color, padding

### Card Hover Chain
```
.car-card:hover
  → card: translateY(-6px) + shadow-lg + border primary-light
  → img: scale(1.05)
  → overlay: opacity 1 (gradient + button terlihat)
```

### Toast Lifecycle
```
appear: slideDown 300ms
on close: fadeOutRight 250ms → remove()
hover: clearTimeout (pause dismiss timer)
mouseleave: schedule close setelah 1000ms
```

### Checkout Payment Overlay
```
click Bayar → #payOverlay display:flex (fadeIn)
              spinner fa-spin
              2000ms setTimeout
              → success: confetti + setStep(4) + fadeOut overlay
              → fail: showToast error + fadeOut overlay
```

### Leaflet Map Dark Mode
```css
[data-theme="dark"] .leaflet-tile {
  filter: invert(1) hue-rotate(180deg) brightness(0.85) contrast(0.9);
}
```

### Reduced Motion
Semua animasi di-disable jika `@media (prefers-reduced-motion: reduce)` aktif:
- `animation-duration: 0.01ms !important`
- `animation-iteration-count: 1 !important`
- `transition-duration: 0.01ms !important`
- `.reveal` elements: `opacity:1; transform:none` langsung

---

## 9. Data Model

### User Object
```typescript
{
  id: string;               // 'usr_' + timestamp36 + random4
  name: string;
  email: string;            // lowercase
  phone: string;
  password: string;         // btoa(plain)
  avatar: string;           // URL atau base64
  theme: 'light' | 'dark';
  accentColor: 'blue' | 'red' | 'orange';
  address: string;
  birthdate: string;        // 'YYYY-MM-DD'
  gender: 'male' | 'female' | '';
  emailVerified: boolean;
  createdAt: string;        // 'YYYY-MM-DD'
  notifOrder?: boolean;
  notifEmail?: boolean;
  notifWa?: boolean;
}
```

### Booking Object
```typescript
{
  id: string;               // 'DRV-YYYYMMDD-XXXX'
  userId: string;
  carId: string;
  carName: string;
  package: string;          // 'Harian' | 'Full Day' | 'Weekend' | 'Weekly'
  pickupDate: string;       // 'YYYY-MM-DD'
  pickupTime: string;       // 'HH:MM'
  dropDate: string;
  dropTime: string;
  city: string;
  address: string;
  withDriver: boolean;
  insurance: 'basic' | 'comprehensive';
  renterData: {
    name: string;
    email: string;
    phone: string;
    ktp: string;
    sim: string;
  };
  payment: {
    method: string;         // 'gopay' | 'ovo' | 'dana' | 'bca' | 'mandiri'
    status: 'paid' | 'pending';
    total: number;
  };
  status: 'confirmed' | 'active' | 'completed' | 'cancelled';
  statusHistory: Array<{ status: string; time: string; }>;
  carLocation: { lat: number; lng: number; };
  driverName: string;
  driverPhone: string;
  plateNumber: string;
  notes?: string;
}
```

### Car Object (dari cars.js)
```typescript
{
  id: string;
  name: string;
  brand: string;
  type: 'SUV' | 'MPV' | 'City Car' | 'Luxury MPV';
  year: number;
  seats: number;
  transmission: 'Automatic' | 'Manual';
  fuel: 'Petrol' | 'Diesel' | 'Hybrid';
  ac: boolean;
  withDriver: boolean;
  selfDrive: boolean;
  pricePerDay: number | null;
  priceWithDriver: number | null;
  deposit: number;
  rating: number;
  reviewCount: number;
  featured: boolean;
  badge: string | null;
  images: string[];
  specs: { engine, maxSpeed, luggage, bluetooth, usb, gps };
  packages: Array<{ name, duration, price }>;
  location: string;
  available: boolean;
  description: string;
}
```

---

## 10. User Flows

### Flow A — Guest → Booking

```
index.html
  → isi search widget (kota + tanggal)
  → submit → layanan.html?city=...&pickup=...
  
layanan.html
  → filter / browse / klik "Pesan"
  → detail.html?id=car_001
  
detail.html
  → pilih paket, tanggal, opsi sopir
  → klik "Pesan sekarang"
  → belum login → redirect ke login.html?returnUrl=checkout.html?...
  
login.html
  → login/register
  → redirect kembali ke checkout.html?id=...
  
checkout.html
  → Step 1: konfirmasi paket & jadwal
  → Step 2: isi data pemesan + upload KTP/SIM
  → Step 3: pilih pembayaran + apply promo (DRIVE10)
  → klik "Bayar sekarang" → overlay 2s → Step 4: sukses
  
tracking.html
  → lihat status & peta real-time (simulasi)
```

### Flow B — Profil & Pengaturan

```
profil.html
  → Tab "Data Saya": edit profil → simpan
  → Tab "Riwayat": filter booking → klik detail / pesan lagi
  → Tab "Pengaturan": toggle dark, pilih accent, notif, ganti password
  → Ganti avatar: upload foto → preview → simpan (jika < 120KB)
  → Hapus Akun: modal konfirmasi → delete + logout
```

### Flow C — Tema & Preferensi

```
Toggle dark mode (navbar / profil)
  → applyTheme(mode) → data-theme attr → CSS vars switch otomatis
  → persist ke localStorage + user object

Pilih accent color
  → applyAccent(accent) → set 4 CSS custom properties inline
  → data-accent attr untuk fallback CSS
  → persist ke localStorage + user object
```

---

## 11. Third-Party Dependencies

| Library | Versi | CDN | Penggunaan |
|---|---|---|---|
| Font Awesome | 6.5.0 | cdnjs | Icons seluruh UI |
| Leaflet.js | 1.9.4 | unpkg | Peta tracking |
| Google Fonts | — | fonts.googleapis.com | Outfit, DM Sans, JetBrains Mono |

**Catatan**: Flatpickr dan Swiper disebutkan di `themes.css` untuk override styling, namun tidak ada `<script>` import-nya di HTML — ini area yang belum diimplementasi sebagai dependency aktif.

---

## 12. Area Pengembangan Lanjutan

Berikut fitur dan perbaikan yang masih terbuka untuk dikembangkan lebih lanjut:

### 12.1 Backend & Persistensi
- [ ] **Migrasi ke REST API / GraphQL** — ganti `Storage.*` dengan `fetch()` ke endpoint nyata
- [ ] **Database nyata** (PostgreSQL / MongoDB) — pengguna, booking, armada
- [ ] **Password hashing proper** — ganti `btoa()` dengan bcrypt / Argon2 di server
- [ ] **JWT / Session auth** — ganti localStorage session dengan HTTP-only cookie + token
- [ ] **Email verification** — field `emailVerified` sudah ada, tinggal implementasi flow

### 12.2 Fitur Belum Diimplementasi
- [ ] **Reset password** — modal sudah ada, logika belum
- [ ] **Google SSO** — tombol sudah ada, disabled
- [ ] **Invoice download** — tombol placeholder di tracking.html
- [ ] **Tambah metode pembayaran** — UI tersedia, logic belum
- [ ] **Ulasan pengguna** — placeholder sudah ada di detail.html
- [ ] **Notifikasi** — toggle ada di profil, tidak ada push/email logic
- [ ] **WhatsApp integration** — disebutkan di notif settings
- [ ] **Real payment gateway** — Midtrans / Xendit integration

### 12.3 Data & Content
- [ ] **CMS atau admin panel** untuk kelola armada (cars.js masih hardcoded)
- [ ] **Real-time availability** — `available: true` semua, belum ada booking conflict check
- [ ] **Gambar kendaraan nyata** — saat ini Unsplash placeholder
- [ ] **Lebih banyak kota** — datalist beranda dan filter kota bisa diperkaya
- [ ] **Multi-kota filter** — filter layanan.html hanya text, belum dikaitkan ke data kota
- [ ] **Search by query teks** — `filterCars()` sudah support `query` param, tapi UI belum ada search bar di layanan.html

### 12.4 UX & Interaksi
- [ ] **Flatpickr integration** — themes.css sudah siapkan override, tinggal import dan init
- [ ] **Swiper/Glide carousel** — themes.css sudah siapkan override untuk galeri detail
- [ ] **Date range validation** — tidak bisa pilih tanggal lampau
- [ ] **Konfirmasi real-time sopir** — withDriver toggle di sidebar tidak cek ketersediaan
- [ ] **Map geolocation** — "Gunakan lokasi saya" untuk pickup
- [ ] **Promo code management** — saat ini hanya hardcode `DRIVE10`
- [ ] **Multi-language support** — saat ini bahasa Indonesia saja
- [ ] **Infinite scroll** sebagai alternatif "Muat lebih banyak"
- [ ] **Skeleton loading** — class `.skeleton-loader` sudah ada di components.css, belum dipakai di halaman

### 12.5 Performa & Kode
- [ ] **ES Module bundler** (Vite / Rollup) — code splitting, tree shaking, minifikasi
- [ ] **Image optimization** — saat ini URL Unsplash langsung, bisa gunakan CDN image transform
- [ ] **Service Worker / PWA** — offline support, manifest
- [ ] **Lazy-loaded route scripts** — saat ini semua page script satu file per halaman
- [ ] **Component extraction** — navbar di-copy paste ke tiap halaman HTML, bisa refactor ke custom element atau server-side include
- [ ] **Form state persistence** — kalau user navigate back, form checkout reset
- [ ] **localStorage quota handling** — jika penuh, `set()` return false tapi tidak ada fallback

### 12.6 Aksesibilitas & SEO
- [ ] **`aria-live` region** untuk toast (sudah ada di layanan.html, belum konsisten)
- [ ] **Focus management** saat modal buka/tutup
- [ ] **Skip link** untuk keyboard navigation
- [ ] **Open Graph / meta tags** untuk sharing
- [ ] **Structured data** (JSON-LD) untuk product listing
- [ ] **Sitemap** dan robots.txt

### 12.7 Testing
- [ ] **Unit tests** untuk `storage.js`, `auth.js`, `cars.js` helper functions
- [ ] **E2E tests** (Playwright / Cypress) untuk user flows
- [ ] **Visual regression** untuk komponen UI
- [ ] **Cross-browser testing** — saat ini menggunakan CSS modern (`:has()`, `backdrop-filter`) yang perlu prefix/fallback di browser lama

---

*Dokumen ini adalah referensi teknis lengkap untuk DriveEase Prototype. Semua section berdasarkan source code aktual.*
