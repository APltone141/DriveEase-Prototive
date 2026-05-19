import { initNavbar } from '../core/navbar.js';
import { getParam, buildQuery, showToast } from '../core/router.js';
import { CARS_DATA, getCarById, formatPrice, getStartingPrice } from '../data/cars.js';
import {
  rentalDays,
  calcRentalQuote,
  resolveTierSlug,
  DRIVER_FEE_PER_DAY,
} from '../data/pricing.js';

const RULES = [
  'Usia pengemudi minimal 21 tahun.',
  'SIM A yang masih berlaku wajib dibawa.',
  'Dilarang merokok di dalam kabin.',
  'Hewan peliharaan tidak diizinkan tanpa persetujuan tertulis.',
  'Patuhi batas kecepatan dan rambu lalu lintas.',
  'Keterlambatan pengembalian dikenakan biaya Rp 100.000 per jam.',
  'Kerusakan ditanggung sesuai estimasi bengkel resmi.',
];

function getWishlist() {
  try {
    const raw = localStorage.getItem('driveease_wishlist');
    const arr = JSON.parse(raw || '[]');
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function setWishlist(ids) {
  localStorage.setItem('driveease_wishlist', JSON.stringify(ids));
}

function getSimilar(current) {
  const sameType = CARS_DATA.filter(c => c.id !== current.id && c.type === current.type);
  const rest = CARS_DATA.filter(c => c.id !== current.id && !sameType.some(s => s.id === c.id));
  return [...sameType, ...rest].slice(0, 4);
}

function renderSimilar(cars) {
  const el = document.getElementById('similarStrip');
  if (!el) return;
  el.innerHTML = cars
    .map(c => {
      const img = c.images?.[0] || '';
      const p = getStartingPrice(c);
      return `
        <a href="detail.html?id=${encodeURIComponent(c.id)}" class="car-card">
          <div class="car-card__image" style="aspect-ratio:16/9;">
            <img src="${img}" alt="${c.name}" loading="lazy" width="400" height="225" />
          </div>
          <div class="car-card__body" style="padding:var(--sp-3);">
            <div class="car-card__title" style="font-size:var(--text-base);">${c.name}</div>
            <div class="car-card__price" style="font-size:var(--text-lg);">${formatPrice(p)}<span>/hari</span></div>
          </div>
        </a>`;
    })
    .join('');
}

function wireTabs() {
  const buttons = document.querySelectorAll('.tab-nav .tab-btn');
  const panels = {
    desc: document.getElementById('tab-desc'),
    spec: document.getElementById('tab-spec'),
    pkg: document.getElementById('tab-pkg'),
    rules: document.getElementById('tab-rules'),
  };

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.tab;
      buttons.forEach(b => {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
      });
      Object.entries(panels).forEach(([k, panel]) => {
        if (!panel) return;
        panel.classList.toggle('active', k === key);
      });
    });
  });
}

function wireGallery(car) {
  const main = document.getElementById('detailMainImg');
  const thumbsWrap = document.getElementById('detailThumbs');
  if (!main || !thumbsWrap) return;

  const imgs = car.images?.length ? car.images : ['https://via.placeholder.com/800x450'];
  main.src = imgs[0];
  main.alt = car.name;

  thumbsWrap.innerHTML = imgs
    .slice(0, 4)
    .map(
      (src, i) => `
      <button type="button" class="detail-thumb ${i === 0 ? 'is-active' : ''}" data-src="${src}" aria-label="Gambar ${i + 1}">
        <img src="${src}" alt="" loading="lazy" width="76" height="56" />
      </button>`
    )
    .join('');

  thumbsWrap.querySelectorAll('.detail-thumb').forEach(btn => {
    btn.addEventListener('click', () => {
      thumbsWrap.querySelectorAll('.detail-thumb').forEach(t => t.classList.remove('is-active'));
      btn.classList.add('is-active');
      main.src = btn.dataset.src;
    });
  });
}

function renderSpecs(car) {
  const table = document.getElementById('specTable');
  if (!table) return;
  const s = car.specs || {};
  const rows = [
    ['Mesin', s.engine || '—'],
    ['Transmisi', car.transmission || '—'],
    ['BBM', car.fuel || '—'],
    ['Kecepatan maks.', s.maxSpeed || '—'],
    ['Kapasitas', `${car.seats} penumpang`],
    ['Bagasi', s.luggage || '—'],
    ['Bluetooth', s.bluetooth ? 'Ya' : 'Tidak'],
    ['USB', s.usb ? 'Ya' : 'Tidak'],
    ['GPS', s.gps ? 'Ya' : 'Tidak'],
  ];
  table.innerHTML = rows.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join('');
}

function renderPackages(car) {
  const grid = document.getElementById('pkgGrid');
  const select = document.getElementById('sidebarPackage');
  if (!grid || !select) return;

  const pkgs = car.packages || [];
  grid.innerHTML = pkgs
    .map(
      p => `
      <div class="pkg-card ${p.id === 'vip' ? 'pkg-card--vip' : ''}">
        <div class="flex justify-between items-center flex-wrap gap-2">
          <div class="font-display" style="font-weight:700;font-size:var(--text-lg);">${p.name}</div>
          ${p.driverDiscountPercent === 100 ? '<span class="badge badge-primary">Sopir gratis</span>' : ''}
        </div>
        <p class="text-sm text-muted" style="margin:var(--sp-2) 0;">${p.tagline || ''}</p>
        <div class="car-card__price" style="margin:var(--sp-3) 0;">${formatPrice(p.pricePerDay)}<span style="font-size:var(--text-sm);font-weight:400;color:var(--color-text-muted);">/hari</span></div>
        <ul class="text-sm text-muted" style="padding-left:1.1rem;list-style:disc;margin-bottom:var(--sp-4);">
          ${(p.features || []).map(f => `<li>${f}</li>`).join('')}
        </ul>
        <button type="button" class="btn btn-primary btn-sm pkg-pick" data-tier-id="${p.id}" style="width:100%;">Pilih ${p.name}</button>
      </div>`
    )
    .join('');

  select.innerHTML = pkgs
    .map(p => `<option value="${p.id}">${p.name} — ${formatPrice(p.pricePerDay)}/hari</option>`)
    .join('');

  grid.querySelectorAll('.pkg-pick').forEach(btn => {
    btn.addEventListener('click', () => {
      select.value = btn.dataset.tierId;
      select.dispatchEvent(new Event('change'));
    });
  });
}

function syncDriverLabel(car) {
  const pkg = car.packages?.find(p => p.id === document.getElementById('sidebarPackage')?.value);
  const hint = document.getElementById('sidebarDriverHint');
  const label = document.getElementById('sidebarDriverLabel');
  if (!pkg) return;

  if (label) {
    if (pkg.driverDiscountPercent === 100) {
      label.textContent = `Dengan sopir (gratis — diskon 100% paket ${pkg.name})`;
    } else {
      label.textContent = `Dengan sopir (+${formatPrice(DRIVER_FEE_PER_DAY)}/hari)`;
    }
  }
  if (hint) {
    hint.textContent = pkg.driverDiscountPercent === 100
      ? 'Centang untuk sopir profesional tanpa biaya tambahan.'
      : 'Opsional. Biaya sopir dihitung per hari sewa.';
  }
}

function updateEstimate(car) {
  const pick = document.getElementById('sidebarPickup')?.value;
  const drop = document.getElementById('sidebarDrop')?.value;
  const withDriver = document.getElementById('sidebarWithDriver')?.checked;
  const tierId = document.getElementById('sidebarPackage')?.value;

  const days = rentalDays(pick, drop);
  const subEl = document.getElementById('lineSubtotal');
  const insEl = document.getElementById('lineInsurance');
  const drvEl = document.getElementById('lineDriver');
  const totEl = document.getElementById('lineTotal');
  const daysEl = document.getElementById('lineDays');
  const rateEl = document.getElementById('lineRate');

  if (days < 0) {
    showToast('error', 'Tanggal', 'Tanggal drop harus setelah pickup.');
    [subEl, insEl, drvEl, totEl, daysEl, rateEl].forEach(el => { if (el) el.textContent = '—'; });
    return;
  }

  const quote = calcRentalQuote(car, {
    tierId,
    days,
    withDriver,
    insuranceType: 'basic',
    deposit: 0,
  });

  if (daysEl) daysEl.textContent = `${days} hari`;
  if (rateEl) rateEl.textContent = `${formatPrice(quote.perDayRate)}/hari`;
  if (subEl) subEl.textContent = formatPrice(quote.subtotal);
  if (insEl) insEl.textContent = formatPrice(quote.insurance);
  if (drvEl) {
    if (withDriver && quote.driverDiscountPercent === 100 && quote.driverGross > 0) {
      drvEl.innerHTML = `<span style="text-decoration:line-through;color:var(--color-text-muted);margin-right:6px;">${formatPrice(quote.driverGross)}</span> ${formatPrice(0)}`;
    } else {
      drvEl.textContent = formatPrice(quote.driver);
    }
  }
  if (totEl) totEl.textContent = formatPrice(quote.total);

  syncDriverLabel(car);
}

function wireBooking(car) {
  const pickEl = document.getElementById('sidebarPickup');
  const dropEl = document.getElementById('sidebarDrop');
  const pkgEl = document.getElementById('sidebarPackage');
  const drvEl = document.getElementById('sidebarWithDriver');
  const checkout = document.getElementById('btnCheckout');

  const today = new Date();
  const t0 = today.toISOString().split('T')[0];
  const t1 = new Date(today);
  t1.setDate(t1.getDate() + 3);
  const t1s = t1.toISOString().split('T')[0];
  if (pickEl && !pickEl.value) pickEl.value = t0;
  if (dropEl && !dropEl.value) dropEl.value = t1s;

  const urlPkg = getParam('package');
  const resolved = resolveTierSlug(car, urlPkg);
  if (resolved && pkgEl) pkgEl.value = resolved.id;
  else if (pkgEl) {
    const reg = car.packages?.find(p => p.id === 'reguler');
    if (reg) pkgEl.value = reg.id;
  }

  [pickEl, dropEl, pkgEl, drvEl].forEach(el => {
    el?.addEventListener('change', () => updateEstimate(car));
    el?.addEventListener('input', () => updateEstimate(car));
  });

  updateEstimate(car);

  if (checkout) {
    checkout.addEventListener('click', e => {
      e.preventDefault();
      const days = rentalDays(pickEl?.value, dropEl?.value);
      if (days < 0) return;
      const tierId = pkgEl?.value || 'reguler';
      const q = buildQuery({
        id: car.id,
        package: tierId,
        pickup: pickEl?.value,
        drop: dropEl?.value,
        withDriver: drvEl?.checked ? '1' : '0',
      });
      window.location.href = `checkout.html${q}`;
    });
  }

  document.getElementById('btnWishlist')?.addEventListener('click', () => {
    const list = getWishlist();
    const idx = list.indexOf(car.id);
    if (idx >= 0) {
      list.splice(idx, 1);
      setWishlist(list);
      showToast('info', 'Wishlist', 'Mobil dihapus dari wishlist.');
    } else {
      list.push(car.id);
      setWishlist(list);
      showToast('success', 'Wishlist', 'Disimpan ke wishlist.');
    }
  });
}

function renderPage(car) {
  document.title = `${car.name} — DriveEase`;
  document.getElementById('bcCarName').textContent = car.name;

  document.getElementById('sidebarTitle').textContent = car.name;
  document.getElementById('sidebarRating').innerHTML = `<i class="fa-solid fa-star"></i> ${car.rating}`;
  document.getElementById('sidebarReviews').textContent = `(${car.reviewCount} ulasan)`;

  const desc = document.getElementById('detailDescription');
  if (desc) {
    desc.textContent = '';
    const p = document.createElement('p');
    p.textContent = car.description || '';
    desc.appendChild(p);
  }

  const hi = document.getElementById('detailHighlights');
  if (hi) {
    const items = [
      ['fa-snowflake', car.ac ? 'AC' : null],
      ['fa-bluetooth-b', car.specs?.bluetooth ? 'Bluetooth' : null],
      ['fa-users', `${car.seats} Penumpang`],
      ['fa-gear', car.transmission],
    ].filter(([, t]) => t);
    hi.innerHTML = `<div class="flex flex-wrap gap-4" style="justify-content:flex-start;">${items
      .map(
        ([icon, label]) => `
      <span class="badge badge-primary" style="display:inline-flex;align-items:center;gap:6px;padding:8px 12px;">
        <i class="fa-solid ${icon}"></i> ${label}
      </span>`
      )
      .join('')}</div>`;
  }

  const loc = document.getElementById('detailLocationNote');
  if (loc) loc.textContent = `Tersedia di: ${car.location || 'Hubungi kami untuk ketersediaan kota.'}`;

  document.getElementById('rulesList').innerHTML = RULES.map(r => `<li>${r}</li>`).join('');

  wireGallery(car);
  renderSpecs(car);
  renderPackages(car);
  renderSimilar(getSimilar(car));
  wireTabs();
  wireBooking(car);
}

function boot() {
  const id = getParam('id');
  const car = id ? getCarById(id) : null;
  if (!car) {
    window.location.href = 'layanan.html';
    return;
  }
  initNavbar();
  renderPage(car);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
