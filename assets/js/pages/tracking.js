import Storage from '../core/storage.js';
import { checkAuth, restoreSession } from '../core/auth.js';
import { initNavbar } from '../core/navbar.js';
import { getParam, showToast } from '../core/router.js';
import { formatPrice } from '../data/cars.js';

const STEPS = [
  { title: 'Pesanan dikonfirmasi', desc: 'Pesanan Anda telah diterima.' },
  { title: 'Pembayaran berhasil', desc: 'Pembayaran terverifikasi.' },
  { title: 'Mobil siap pickup', desc: 'Mobil standby di lokasi.' },
  { title: 'Mobil diambil (pickup)', desc: 'Selamat menikmati perjalanan.' },
  { title: 'Sedang digunakan', desc: 'Periode sewa berjalan.' },
  { title: 'Pengembalian (drop off)', desc: 'Estimasi sesuai jadwal drop.' },
];

function statusLabel(s) {
  const m = { confirmed: 'Menunggu konfirmasi', active: 'Dalam perjalanan', completed: 'Selesai', cancelled: 'Dibatalkan' };
  return m[s] || s;
}

function currentStepIndex(booking) {
  if (booking.status === 'cancelled') return -1;
  if (booking.status === 'completed') return STEPS.length;
  if (booking.status === 'active') return 4;
  if (booking.status === 'confirmed') return 2;
  return 1;
}

function renderTimeline(booking) {
  const wrap = document.getElementById('timeline');
  if (!wrap) return;
  const cur = currentStepIndex(booking);
  if (booking.status === 'cancelled') {
    wrap.innerHTML = `<p class="text-danger font-semibold">Pesanan ini telah dibatalkan.</p>`;
    return;
  }
  wrap.innerHTML = STEPS.map((s, i) => {
    let cls = 'vstep';
    if (i < cur) cls += ' completed';
    else if (i === cur) cls += ' active';
    return `
      <div class="${cls}">
        <div class="vstep__icon">${i < cur ? '<i class="fa-solid fa-check"></i>' : i === cur ? '<i class="fa-solid fa-circle"></i>' : ''}</div>
        <div class="vstep__content">
          <div class="vstep__title">${s.title}</div>
          <div class="vstep__desc">${s.desc}</div>
        </div>
      </div>`;
  }).join('');
}

let mapInstance = null;
let markerLayer = null;
let routeTimer = null;

const ROUTE = [
  [-6.2088, 106.8456],
  [-6.2105, 106.848],
  [-6.212, 106.852],
  [-6.214, 106.856],
];

function initMap(booking) {
  const el = document.getElementById('map');
  if (!el || typeof L === 'undefined') return;

  const lat = booking.carLocation?.lat ?? -6.2088;
  const lng = booking.carLocation?.lng ?? 106.8456;

  if (mapInstance) {
    mapInstance.remove();
    mapInstance = null;
  }
  if (routeTimer) {
    clearInterval(routeTimer);
    routeTimer = null;
  }

  mapInstance = L.map(el).setView([lat, lng], 14);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap',
  }).addTo(mapInstance);

  markerLayer = L.marker([lat, lng]).addTo(mapInstance);
  let i = 0;
  routeTimer = setInterval(() => {
    i = (i + 1) % ROUTE.length;
    const [la, ln] = ROUTE[i];
    markerLayer.setLatLng([la, ln]);
    mapInstance.panTo([la, ln]);
  }, 5000);
}

function renderDetailCard(booking) {
  const el = document.getElementById('detailCardBody');
  if (!el) return;
  const pay = booking.payment?.total != null ? formatPrice(booking.payment.total) : '—';
  const driver = booking.withDriver
    ? `<div><i class="fa-solid fa-user-tie"></i> Sopir: ${booking.driverName || '—'} (${booking.driverPhone || '—'})</div>`
    : '';
  el.innerHTML = `
    <div><strong>${booking.carName || '—'}</strong></div>
    <div>No. polisi: ${booking.plateNumber || '—'}</div>
    <div>Pickup: ${booking.pickupDate} ${booking.pickupTime} — ${booking.city}</div>
    <div>Drop: ${booking.dropDate} ${booking.dropTime}</div>
    <div>Total: ${pay}</div>
    ${driver}
  `;
}

function filterBookings(list, tab) {
  if (tab === 'aktif') return list.filter(b => b.status === 'active');
  if (tab === 'menunggu') return list.filter(b => b.status === 'confirmed');
  if (tab === 'selesai') return list.filter(b => b.status === 'completed');
  if (tab === 'batal') return list.filter(b => b.status === 'cancelled');
  return list;
}

let currentTab = 'aktif';

function fillBookingSelect(list) {
  const sel = document.getElementById('bookingPick');
  if (!sel) return;
  const pref = getParam('booking');
  sel.innerHTML = list.length
    ? list.map(b => `<option value="${b.id}">${b.id} — ${b.carName}</option>`).join('')
    : '<option value="">— Tidak ada pesanan —</option>';
  if (pref && list.some(b => b.id === pref)) sel.value = pref;
  else if (list[0]) sel.value = list[0].id;
}

function displayBooking(id) {
  const b = Storage.getBookingById(id);
  if (!b) return;
  document.getElementById('dispBookingId').textContent = '#' + b.id;
  document.getElementById('dispStatus').textContent = statusLabel(b.status);
  document.getElementById('dispCarTitle').textContent = b.carName || '—';
  document.getElementById('dispCarSub').textContent = `${b.package || ''} · ${b.city || ''}`;
  renderTimeline(b);
  renderDetailCard(b);
  initMap(b);
}

function tabForStatus(status) {
  if (status === 'active') return 'aktif';
  if (status === 'confirmed') return 'menunggu';
  if (status === 'completed') return 'selesai';
  if (status === 'cancelled') return 'batal';
  return 'aktif';
}

function refreshTab() {
  const user = Storage.getCurrentUser();
  if (!user) return;
  const all = Storage.getBookingsByUser(user.id);
  const filtered = filterBookings(all, currentTab);
  fillBookingSelect(filtered);
  const sel = document.getElementById('bookingPick');
  if (filtered.length && sel?.value) displayBooking(sel.value);
  else {
    document.getElementById('timeline').innerHTML = '<p class="text-muted">Tidak ada pesanan di tab ini.</p>';
    document.getElementById('detailCardBody').innerHTML = '';
    if (mapInstance) {
      mapInstance.remove();
      mapInstance = null;
    }
    if (routeTimer) clearInterval(routeTimer);
  }
}

function boot() {
  Storage.seedIfEmpty();
  restoreSession();
  if (!checkAuth()) return;
  initNavbar();

  const prefId = getParam('booking');
  if (prefId) {
    const b = Storage.getBookingById(prefId);
    const u = Storage.getCurrentUser();
    if (b && u && b.userId === u.id) {
      currentTab = tabForStatus(b.status);
      document.querySelectorAll('.track-tab').forEach(t => {
        t.classList.toggle('active', t.dataset.filter === currentTab);
      });
    }
  }

  document.querySelectorAll('.track-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.track-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTab = btn.dataset.filter || 'aktif';
      refreshTab();
    });
  });

  document.getElementById('bookingPick')?.addEventListener('change', e => {
    if (e.target.value) displayBooking(e.target.value);
  });

  document.getElementById('btnInvoice')?.addEventListener('click', () => {
    showToast('info', 'Invoice', 'Unduh invoice tersedia di versi produksi.');
  });

  document.getElementById('btnCancelBooking')?.addEventListener('click', () => {
    const id = document.getElementById('bookingPick')?.value;
    if (!id) return;
    if (!confirm('Batalkan pesanan ini?')) return;
    Storage.updateBookingStatus(id, 'cancelled');
    showToast('success', 'Dibatalkan', 'Status pesanan diperbarui.');
    refreshTab();
  });

  refreshTab();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
