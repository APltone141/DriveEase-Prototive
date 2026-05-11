import Storage from '../core/storage.js';
import { checkAuth, restoreSession } from '../core/auth.js';
import { initNavbar } from '../core/navbar.js';
import { getParam, showToast } from '../core/router.js';
import { getCarById, formatPrice } from '../data/cars.js';

function pkgSlug(name) {
  return (name || '').toLowerCase().replace(/\s+/g, '');
}

function rentalDays(pickStr, dropStr) {
  if (!pickStr || !dropStr) return 1;
  const pick = new Date(pickStr + 'T12:00:00');
  const drop = new Date(dropStr + 'T12:00:00');
  const d = (drop - pick) / 86400000;
  if (d < 0) return -1;
  return Math.max(1, Math.round(d));
}

function getSelectedPkg(car) {
  const sel = document.getElementById('coPackage');
  const name = sel?.value;
  return car.packages?.find(p => p.name === name) || car.packages?.[0];
}

function computeSubtotal(pkg, days) {
  if (!pkg) return 0;
  if (pkg.name === 'Weekend') return pkg.price;
  if (pkg.name === 'Weekly') return Math.round(pkg.price * (days / 7));
  return pkg.price * days;
}

let currentCar = null;
let promoDiscount = 0;
let lastBookingId = null;

function readInsuranceCents() {
  const el = document.querySelector('input[name="coIns"]:checked');
  const comp = el?.value === 'comprehensive';
  return comp ? 75000 : 50000;
}

function readWithDriver() {
  return document.querySelector('input[name="coDriver"]:checked')?.value === '1';
}

function computeTotals() {
  if (!currentCar) return { days: 1, subtotal: 0, insurance: 0, driver: 0, deposit: 0, total: 0 };
  const days = rentalDays(document.getElementById('coPickupD')?.value, document.getElementById('coDropD')?.value);
  const pkg = getSelectedPkg(currentCar);
  const perDayIns = readInsuranceCents();
  const insurance = days > 0 ? perDayIns * days : 0;
  const sub = days < 0 ? 0 : Math.max(0, computeSubtotal(pkg, days) - promoDiscount);
  const driver = days > 0 && readWithDriver() ? 200000 * days : 0;
  const deposit = currentCar.deposit || 0;
  const total = sub + insurance + driver + deposit;
  return { days, subtotal: sub, insurance, driver, deposit, total, pkg };
}

function renderSideSummary() {
  const t = computeTotals();
  const side = document.getElementById('coSideLines');
  const totalEl = document.getElementById('coSideTotal');
  if (!currentCar || !side) return;
  const pkg = t.pkg;
  const linePkg = pkg ? `${currentCar.name} · ${pkg.name}` : currentCar.name;
  side.innerHTML = `
    <div class="order-line"><span>${linePkg}</span><span class="value">${formatPrice(t.subtotal)}</span></div>
    <div class="order-line"><span>Asuransi</span><span class="value">${formatPrice(t.insurance)}</span></div>
    <div class="order-line"><span>Sopir</span><span class="value">${formatPrice(t.driver)}</span></div>
    <div class="order-line"><span>Deposit</span><span class="value">${formatPrice(t.deposit)}</span></div>
  `;
  if (totalEl) totalEl.textContent = formatPrice(t.total);
}

function renderPayStepLines() {
  const el = document.getElementById('coPayLines');
  if (!el) return;
  const t = computeTotals();
  el.innerHTML = `
    <div class="order-line"><span>Subtotal sewa</span><span class="value">${formatPrice(t.subtotal)}</span></div>
    <div class="order-line"><span>Asuransi</span><span class="value">${formatPrice(t.insurance)}</span></div>
    <div class="order-line"><span>Biaya sopir</span><span class="value">${formatPrice(t.driver)}</span></div>
    <div class="order-line"><span>Deposit</span><span class="value">${formatPrice(t.deposit)}</span></div>
    <div class="order-line total"><span>Total</span><span class="value">${formatPrice(t.total)}</span></div>
  `;
}

function setStep(n) {
  document.querySelectorAll('.checkout-step').forEach(s => s.classList.remove('active'));
  document.getElementById(`step${n}`)?.classList.add('active');
  document.querySelectorAll('#checkoutStepper .step').forEach(st => {
    const sn = parseInt(st.dataset.stepI || st.getAttribute('data-step-i'), 10);
    st.classList.toggle('completed', sn < n);
    st.classList.toggle('active', sn === n);
  });
  const aside = document.getElementById('coSidebar');
  if (aside) aside.style.display = n === 4 ? 'none' : '';
  document.getElementById('checkoutLayout')?.classList.toggle('is-finish', n === 4);
  if (n === 3) renderPayStepLines();
}

function wireFilePrev(inputId, imgId) {
  document.getElementById(inputId)?.addEventListener('change', e => {
    const f = e.target.files?.[0];
    const img = document.getElementById(imgId);
    if (!img) return;
    if (!f) {
      img.classList.remove('visible');
      return;
    }
    const r = new FileReader();
    r.onload = () => {
      img.src = r.result;
      img.classList.add('visible');
    };
    r.readAsDataURL(f);
  });
}

function wirePaymentUi() {
  function syncPayUi() {
    const cat = document.querySelector('input[name="payCat"]:checked')?.value;
    document.querySelectorAll('.payment-option').forEach(o => {
      o.classList.toggle('selected', o.dataset.pay === cat);
      const sub = o.querySelector('.payment-option__sub');
      if (sub) sub.style.display = o.dataset.pay === cat ? 'grid' : 'none';
    });
    if (cat === 'transfer') {
      const first = document.querySelector('input[name="paySubBank"]');
      if (first && !document.querySelector('input[name="paySubBank"]:checked')) first.checked = true;
    }
  }
  document.querySelectorAll('input[name="payCat"]').forEach(r => r.addEventListener('change', syncPayUi));
  syncPayUi();
}

function getPaymentMethod() {
  const cat = document.querySelector('input[name="payCat"]:checked')?.value || 'ewallet';
  if (cat === 'transfer') {
    const b = document.querySelector('input[name="paySubBank"]:checked');
    if (b) return b.value;
    const first = document.querySelector('input[name="paySubBank"]');
    if (first) {
      first.checked = true;
      return first.value;
    }
    return 'bca';
  }
  return document.querySelector('input[name="paySub"]:checked')?.value || 'gopay';
}

function generateBookingId() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const r = Math.floor(1000 + Math.random() * 9000);
  return `DRV-${y}${m}${day}-${r}`;
}

function saveBooking(t, user) {
  const id = generateBookingId();
  lastBookingId = id;
  const pkg = t.pkg;
  const booking = {
    id,
    userId:      user.id,
    carId:       currentCar.id,
    carName:     currentCar.name,
    package:     pkg?.name || 'Full Day',
    pickupDate:  document.getElementById('coPickupD').value,
    pickupTime:  document.getElementById('coPickupT').value,
    dropDate:    document.getElementById('coDropD').value,
    dropTime:    document.getElementById('coDropT').value,
    city:        document.getElementById('coCity').value,
    address:     document.getElementById('coAddr').value,
    withDriver:  readWithDriver(),
    insurance:   document.querySelector('input[name="coIns"]:checked')?.value || 'basic',
    renterData: {
      name:  document.getElementById('coName').value,
      email: document.getElementById('coEmail').value,
      phone: document.getElementById('coPhone').value,
      ktp:   document.getElementById('coKtp').value,
      sim:   document.getElementById('coSim').value,
    },
    payment: { method: getPaymentMethod(), status: 'paid', total: t.total },
    status:     'confirmed',
    statusHistory: [
      { status: 'confirmed', time: new Date().toLocaleString('id-ID') },
    ],
    carLocation: { lat: -6.2088, lng: 106.8456 },
    driverName:  'Pak Ahmad',
    driverPhone: '081298765432',
    plateNumber: 'B 1234 CDR',
    notes:       document.getElementById('coNotes')?.value || '',
  };
  Storage.upsertBooking(booking);
  return booking;
}

function handlePay() {
  if (!document.getElementById('coAgree')?.checked) {
    showToast('warning', 'Syarat', 'Centang persetujuan syarat & ketentuan.');
    return;
  }
  const overlay = document.getElementById('payOverlay');
  overlay?.classList.add('open');

  setTimeout(() => {
    const ok = Math.random() < 0.9;
    const user = Storage.getCurrentUser();
    const t = computeTotals();
    if (t.days < 0) {
      overlay.classList.remove('open');
      showToast('error', 'Tanggal', 'Periksa tanggal pickup dan drop.');
      return;
    }
    if (ok) {
      saveBooking(t, user);
      document.getElementById('coBookingId').textContent = '#' + lastBookingId;
      const card = document.getElementById('coSuccessCard');
      if (card) {
        card.innerHTML = `
          <div class="order-line"><span>Mobil</span><span class="value">${currentCar.name}</span></div>
          <div class="order-line"><span>Total</span><span class="value">${formatPrice(t.total)}</span></div>
          <div class="order-line"><span>Status</span><span class="value badge badge-warning">Menunggu konfirmasi operator</span></div>
        `;
      }
      document.getElementById('coToTrack').href = `tracking.html?booking=${encodeURIComponent(lastBookingId)}`;
      overlay.classList.remove('open');
      setStep(4);
      showToast('success', 'Berhasil', 'Pembayaran berhasil diproses.');
    } else {
      overlay.classList.remove('open');
      showToast('error', 'Gagal', 'Pembayaran gagal (simulasi demo). Coba lagi.');
    }
  }, 2000);
}

function boot() {
  Storage.seedIfEmpty();
  restoreSession();
  if (!checkAuth()) return;

  initNavbar();

  const id = getParam('id');
  currentCar = id ? getCarById(id) : null;
  if (!currentCar) {
    window.location.href = 'layanan.html';
    return;
  }

  const img = currentCar.images?.[0] || '';
  document.getElementById('checkoutCarMini').innerHTML = `
    <img src="${img}" alt="" width="120" height="72" />
    <div><strong>${currentCar.name}</strong><br/><span class="text-sm text-muted">${currentCar.type} · ${currentCar.year}</span></div>
  `;

  const pkgSel = document.getElementById('coPackage');
  const slug = (getParam('package') || '').toLowerCase();
  pkgSel.innerHTML = (currentCar.packages || [])
    .map(p => `<option value="${p.name}">${p.name} — ${formatPrice(p.price)}</option>`)
    .join('');
  const match = currentCar.packages?.find(p => pkgSlug(p.name) === slug);
  if (match) pkgSel.value = match.name;

  const today = new Date();
  document.getElementById('coPickupD').value = today.toISOString().split('T')[0];
  const d2 = new Date(today);
  d2.setDate(d2.getDate() + 3);
  document.getElementById('coDropD').value = d2.toISOString().split('T')[0];

  const withDrv = getParam('withDriver') === '1';
  const drvRadio = document.querySelector(`input[name="coDriver"][value="${withDrv ? '1' : '0'}"]`);
  if (drvRadio) drvRadio.checked = true;

  const u = Storage.getCurrentUser();
  if (u) {
    document.getElementById('coName').value = u.name || '';
    document.getElementById('coEmail').value = u.email || '';
    document.getElementById('coPhone').value = u.phone || '';
    document.getElementById('coAddr').value = u.address || '';
  }

  ['coPackage', 'coPickupD', 'coDropD', 'coPickupT', 'coDropT'].forEach(id =>
    document.getElementById(id)?.addEventListener('change', renderSideSummary)
  );
  document.querySelectorAll('input[name="coDriver"]').forEach(r => r.addEventListener('change', renderSideSummary));
  document.querySelectorAll('input[name="coIns"]').forEach(r => r.addEventListener('change', renderSideSummary));

  document.getElementById('btnStep1')?.addEventListener('click', () => {
    const days = rentalDays(document.getElementById('coPickupD').value, document.getElementById('coDropD').value);
    if (days < 0) {
      showToast('error', 'Tanggal', 'Drop harus setelah pickup.');
      return;
    }
    if (!document.getElementById('coAddr').value.trim()) {
      showToast('warning', 'Alamat', 'Isi alamat pickup.');
      return;
    }
    setStep(2);
  });

  document.getElementById('btnBack2')?.addEventListener('click', () => setStep(1));
  document.getElementById('btnStep2')?.addEventListener('click', () => {
    const req = ['coName', 'coEmail', 'coPhone', 'coKtp', 'coSim'];
    for (const rid of req) {
      if (!document.getElementById(rid)?.value?.trim()) {
        showToast('warning', 'Data', 'Lengkapi semua field wajib.');
        return;
      }
    }
    setStep(3);
  });

  document.getElementById('btnBack3')?.addEventListener('click', () => setStep(2));
  document.getElementById('btnPay')?.addEventListener('click', handlePay);

  document.getElementById('coPromoBtn')?.addEventListener('click', () => {
    const c = document.getElementById('coPromo')?.value?.trim().toUpperCase();
    const days = rentalDays(document.getElementById('coPickupD').value, document.getElementById('coDropD').value);
    const pkg = getSelectedPkg(currentCar);
    if (c === 'DRIVE10') {
      const base = computeSubtotal(pkg, days);
      promoDiscount = Math.round(base * 0.1);
      showToast('success', 'Promo', 'Diskon 10% diterapkan.');
    } else if (c) {
      showToast('info', 'Promo', 'Kode tidak dikenali (coba DRIVE10).');
      promoDiscount = 0;
    } else promoDiscount = 0;
    renderSideSummary();
    renderPayStepLines();
  });

  wireFilePrev('coKtpFile', 'coKtpPrev');
  wireFilePrev('coSimFile', 'coSimPrev');
  wirePaymentUi();
  renderSideSummary();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
