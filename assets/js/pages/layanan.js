import { initNavbar } from '../core/navbar.js';
import { getParam, initScrollReveal } from '../core/router.js';
import { filterCars, sortCars, formatPrice, getStartingPrice } from '../data/cars.js';

const PAGE_SIZE = 6;
let filteredSorted = [];
let visibleCount = PAGE_SIZE;

function syncPriceRangeInputs() {
  const minEl = document.getElementById('priceMin');
  const maxEl = document.getElementById('priceMax');
  if (!minEl || !maxEl) return;
  let lo = parseInt(minEl.value, 10);
  let hi = parseInt(maxEl.value, 10);
  const step = 50000;
  if (lo > hi - step) {
    lo = hi - step;
    minEl.value = String(lo);
  }
  if (hi < lo + step) {
    hi = lo + step;
    maxEl.value = String(hi);
  }
  maxEl.min = String(lo + step);
  minEl.max = String(hi - step);
}

function updatePriceRangeFill() {
  const minEl = document.getElementById('priceMin');
  const maxEl = document.getElementById('priceMax');
  const fill = document.getElementById('priceRangeFill');
  const label = document.getElementById('priceRangeLabel');
  if (!minEl || !maxEl || !fill) return;
  syncPriceRangeInputs();
  const lo = parseInt(minEl.value, 10);
  const hi = parseInt(maxEl.value, 10);
  const minAbs = 150000;
  const maxAbs = 1500000;
  const left = ((lo - minAbs) / (maxAbs - minAbs)) * 100;
  const width = ((hi - lo) / (maxAbs - minAbs)) * 100;
  fill.style.left = `${left}%`;
  fill.style.width = `${width}%`;
  if (label) {
    label.textContent = `${formatPrice(lo)} — ${formatPrice(hi)}`;
  }
}

function readFilters() {
  const type = document.getElementById('fType')?.value || 'Semua';
  const brand = document.getElementById('fBrand')?.value || 'Semua';
  const seats = document.getElementById('fSeats')?.value || 'Semua';
  const driver = document.getElementById('fDriver')?.value || 'Semua';
  const sort = document.getElementById('fSort')?.value || 'Populer';
  const minPrice = parseInt(document.getElementById('priceMin')?.value || '150000', 10);
  const maxPrice = parseInt(document.getElementById('priceMax')?.value || '1500000', 10);
  return { type, brand, seats, driver, sort, minPrice, maxPrice };
}

function renderCard(car) {
  const price = getStartingPrice(car);
  const img = car.images?.[0] || 'https://via.placeholder.com/800x450';
  const badge = car.badge
    ? `<span class="car-card__badge badge badge-primary">${car.badge}</span>`
    : '';
  const driverLabel = car.selfDrive && car.withDriver
    ? 'Lepas Kunci / Sopir'
    : car.withDriver
      ? 'Dengan Sopir'
      : 'Lepas Kunci';

  return `
    <article class="car-card reveal">
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
        <div class="car-card__meta">${driverLabel}</div>
        <div class="car-card__price">Mulai ${formatPrice(price)}<span>/hari</span></div>
        <div class="car-card__actions">
          <a href="detail.html?id=${encodeURIComponent(car.id)}" class="btn btn-ghost btn-sm">Detail</a>
          <a href="detail.html?id=${encodeURIComponent(car.id)}" class="btn btn-primary btn-sm">Pesan</a>
        </div>
      </div>
    </article>
  `;
}

function renderGrid() {
  const grid = document.getElementById('productGrid');
  const countEl = document.getElementById('resultCount');
  const loadMore = document.getElementById('loadMoreBtn');
  if (!grid) return;

  grid.classList.add('is-updating');
  window.requestAnimationFrame(() => {
    const slice = filteredSorted.slice(0, visibleCount);
    if (slice.length === 0) {
      grid.innerHTML = '<p class="text-muted" style="grid-column:1/-1;text-align:center;padding:var(--sp-12);">Tidak ada mobil yang cocok dengan filter. Sesuaikan filter Anda.</p>';
    } else {
      grid.innerHTML = slice.map(renderCard).join('');
    }
    if (countEl) {
      countEl.textContent = `Menampilkan ${slice.length} dari ${filteredSorted.length} mobil`;
    }
    if (loadMore) {
      loadMore.classList.toggle('hidden', visibleCount >= filteredSorted.length);
    }
    grid.classList.remove('is-updating');
    initScrollReveal();
  });
}

function applyFilters() {
  const { type, brand, seats, driver, sort, minPrice, maxPrice } = readFilters();
  let list = filterCars({ type, brand, seats, driver, minPrice, maxPrice });
  list = sortCars(list, sort);
  filteredSorted = list;
  visibleCount = PAGE_SIZE;
  renderGrid();
}

function cacheSearchFromUrl() {
  const city = getParam('city');
  const pickup = getParam('pickup');
  const drop = getParam('drop');
  const pax = getParam('pax');
  const mode = getParam('mode');
  const pickupTime = getParam('pickupTime');
  if (city || pickup || drop) {
    try {
      localStorage.setItem(
        'driveease_searchCache',
        JSON.stringify({ city, pickup, drop, pax, mode, pickupTime })
      );
    } catch (_) { /* ignore */ }
  }
}

function showSearchContext() {
  const line = document.getElementById('searchContextLine');
  if (!line) return;
  const city = getParam('city');
  const pickup = getParam('pickup');
  const drop = getParam('drop');
  const pax = getParam('pax');
  if (!city && !pickup) {
    line.classList.add('hidden');
    return;
  }
  line.classList.remove('hidden');
  const parts = [];
  if (city) parts.push(`<strong>${city}</strong>`);
  if (pickup && drop) parts.push(`Pickup <strong>${pickup}</strong> → Drop <strong>${drop}</strong>`);
  if (pax) parts.push(`<strong>${pax}</strong> penumpang`);
  line.innerHTML = parts.join(' · ');
}

function applyModeFromUrl() {
  const mode = getParam('mode');
  const driver = document.getElementById('fDriver');
  if (!driver || !mode) return;
  if (mode === 'withDriver') driver.value = 'Dengan Sopir';
  else if (mode === 'selfDrive' || mode === 'lepasKunci') driver.value = 'Lepas Kunci';
}

function wireFilters() {
  ['fType', 'fBrand', 'fSeats', 'fDriver', 'fSort'].forEach(id => {
    document.getElementById(id)?.addEventListener('change', applyFilters);
  });
  const minEl = document.getElementById('priceMin');
  const maxEl = document.getElementById('priceMax');
  const onRange = () => {
    updatePriceRangeFill();
    applyFilters();
  };
  minEl?.addEventListener('input', onRange);
  maxEl?.addEventListener('input', onRange);
}

function boot() {
  initNavbar();
  cacheSearchFromUrl();
  showSearchContext();
  applyModeFromUrl();
  updatePriceRangeFill();
  wireFilters();
  applyFilters();
  document.getElementById('loadMoreBtn')?.addEventListener('click', () => {
    visibleCount += PAGE_SIZE;
    renderGrid();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
