import { initNavbar } from '../core/navbar.js';
import { initScrollReveal, navigate, showToast } from '../core/router.js';
import { getFeaturedCars, formatPrice, getStartingPrice } from '../data/cars.js';

function formatStatNumber(value, decimals) {
  if (decimals > 0) return Number(value).toFixed(decimals);
  if (value >= 1000) return Number(value).toLocaleString('id-ID');
  return String(Math.round(value));
}

function initStatsCounters() {
  const nodes = document.querySelectorAll('.js-stat-counter');
  if (!nodes.length) return;

  const io = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.target || '0');
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const decimals = el.dataset.decimals !== undefined ? parseInt(el.dataset.decimals, 10) : 0;
        const duration = 1600;
        const t0 = performance.now();

        function tick(now) {
          const p = Math.min((now - t0) / duration, 1);
          const eased = 1 - (1 - p) ** 3;
          const current = target * eased;
          el.textContent = prefix + formatStatNumber(current, decimals) + suffix;
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = prefix + formatStatNumber(target, decimals) + suffix;
        }

        requestAnimationFrame(tick);
        io.unobserve(el);
      });
    },
    { threshold: 0.35, rootMargin: '0px' }
  );

  nodes.forEach(n => io.observe(n));
}

function renderFeaturedCars() {
  const grid = document.getElementById('featuredCarsGrid');
  if (!grid) return;

  const cars = getFeaturedCars().slice(0, 3);
  const frag = document.createDocumentFragment();

  cars.forEach(car => {
    const price = getStartingPrice(car);
    const img = car.images?.[0] || 'https://via.placeholder.com/800x450';
    const badge = car.badge
      ? `<span class="car-card__badge badge badge-primary">${car.badge}</span>`
      : '';

    const wrap = document.createElement('article');
    wrap.className = 'car-card reveal';
    wrap.innerHTML = `
      <div class="car-card__image">
        <img src="${img}" alt="${car.name}" loading="lazy" width="800" height="450" />
        ${badge}
        <div class="car-card__overlay">
          <a href="detail.html?id=${encodeURIComponent(car.id)}" class="btn btn-primary btn-sm">Detail</a>
        </div>
      </div>
      <div class="car-card__body">
        <h3 class="car-card__title">${car.name}</h3>
        <div class="car-card__meta">
          <span class="star-rating"><i class="fa-solid fa-star"></i> ${car.rating}</span>
          <span>(${car.reviewCount} ulasan)</span>
        </div>
        <div class="car-card__meta">${car.type} · ${car.seats} Kursi${car.ac ? ' · AC' : ''}</div>
        <div class="car-card__meta">${car.selfDrive && car.withDriver ? 'Lepas Kunci / Sopir' : car.withDriver ? 'Dengan Sopir' : 'Lepas Kunci'}</div>
        <div class="car-card__price">Mulai ${formatPrice(price)}<span>/hari</span></div>
        <div class="car-card__actions">
          <a href="detail.html?id=${encodeURIComponent(car.id)}" class="btn btn-ghost btn-sm">Detail</a>
          <a href="detail.html?id=${encodeURIComponent(car.id)}" class="btn btn-primary btn-sm">Pesan</a>
        </div>
      </div>
    `;
    frag.appendChild(wrap);
  });

  grid.appendChild(frag);
}

function initSearchWidget() {
  const form = document.getElementById('homeSearchForm');
  const tabs = document.querySelectorAll('#homeSearchWidget .search-tab');
  const modeInput = document.getElementById('searchMode');
  const pickup = document.getElementById('searchPickup');
  const drop = document.getElementById('searchDrop');

  const today = new Date();
  const tStr = today.toISOString().split('T')[0];
  if (pickup && !pickup.value) pickup.value = tStr;
  if (drop && !drop.value) {
    const d = new Date(today);
    d.setDate(d.getDate() + 3);
    drop.value = d.toISOString().split('T')[0];
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      if (modeInput) modeInput.value = tab.dataset.mode || 'withDriver';
    });
  });

  form?.addEventListener('submit', e => {
    e.preventDefault();
    const city = document.getElementById('searchCity')?.value?.trim();
    const pu = pickup?.value;
    const dr = drop?.value;
    const pax = document.getElementById('searchPax')?.value || '2';
    const pickupTime = document.getElementById('searchTime')?.value || '09:00';
    const mode = modeInput?.value || 'withDriver';

    if (!city) {
      showToast('warning', 'Lokasi', 'Pilih atau isi kota pickup.');
      return;
    }
    if (pu && dr && new Date(dr) <= new Date(pu)) {
      showToast('error', 'Tanggal', 'Tanggal drop harus setelah tanggal pickup.');
      return;
    }

    navigate('layanan.html', {
      city,
      pickup: pu,
      drop: dr,
      pax,
      pickupTime,
      mode,
    });
  });
}

function boot() {
  initNavbar();
  renderFeaturedCars();
  initScrollReveal();
  initStatsCounters();
  initSearchWidget();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
