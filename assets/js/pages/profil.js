import Storage from '../core/storage.js';
import { checkAuth, restoreSession, updateProfile, changePassword, deleteAccount } from '../core/auth.js';
import { initNavbar } from '../core/navbar.js';
import { showToast } from '../core/router.js';
import { formatPrice } from '../data/cars.js';

const HASH_MAP = {
  '':         'data',
  data:       'data',
  riwayat:    'riwayat',
  pembayaran: 'bayar',
  bayar:      'bayar',
  pengaturan: 'settings',
  settings:   'settings',
};

function showSection(sec) {
  document.querySelectorAll('.profil-section').forEach(s => s.classList.remove('active'));
  document.getElementById(`sec-${sec}`)?.classList.add('active');
  document.querySelectorAll('.profil-tab').forEach(b => {
    if (!b.dataset.sec) return;
    b.classList.toggle('active', b.dataset.sec === sec);
  });
  if (sec === 'riwayat') renderHistory(currentHist);
}

let currentHist = 'all';

function statusHistFilter(b) {
  if (currentHist === 'all') return true;
  return b.status === currentHist;
}

function renderHistory() {
  const wrap = document.getElementById('histList');
  if (!wrap) return;
  const user = Storage.getCurrentUser();
  if (!user) return;
  const list = Storage.getBookingsByUser(user.id).filter(statusHistFilter);
  if (!list.length) {
    wrap.innerHTML = '<p class="text-muted">Belum ada riwayat.</p>';
    return;
  }
  wrap.innerHTML = list
    .map(
      b => `
    <div class="hist-card">
      <div class="font-mono font-bold text-primary">${b.id}</div>
      <div class="font-semibold">${b.carName} — ${b.package || ''}</div>
      <div class="text-sm text-muted">${b.pickupDate} — ${b.dropDate}</div>
      <div class="text-sm" style="margin-top:var(--sp-2);">${formatPrice(b.payment?.total || 0)} · <span class="badge badge-info">${b.status}</span></div>
      <div class="flex gap-2" style="margin-top:var(--sp-3);">
        <a href="tracking.html?booking=${encodeURIComponent(b.id)}" class="btn btn-ghost btn-sm">Detail</a>
        <a href="layanan.html" class="btn btn-primary btn-sm">Pesan lagi</a>
      </div>
    </div>`
    )
    .join('');
}

function loadUserToForm() {
  const u = Storage.getCurrentUser();
  if (!u) return;
  document.getElementById('sideName').textContent = u.name;
  document.getElementById('sideAvatar').src = u.avatar || `https://i.pravatar.cc/150?u=${encodeURIComponent(u.email)}`;
  document.getElementById('pfName').value = u.name || '';
  document.getElementById('pfEmail').value = u.email || '';
  document.getElementById('pfPhone').value = u.phone || '';
  document.getElementById('pfAddr').value = u.address || '';
  document.getElementById('pfBirth').value = u.birthdate || '';
  document.getElementById('pfGender').value = u.gender || '';

  document.getElementById('notifOrder').checked = u.notifOrder !== false;
  document.getElementById('notifEmail').checked = !!u.notifEmail;
  document.getElementById('notifWa').checked = u.notifWa !== false;

  const accent = u.accentColor || Storage.getAccent() || 'blue';
  const r = document.querySelector(`input[name="accentPick"][value="${accent}"]`);
  if (r) r.checked = true;

  document.getElementById('profilDarkToggle').checked = Storage.getTheme() === 'dark';
}

function saveNotifs() {
  const u = Storage.getCurrentUser();
  if (!u) return;
  Storage.upsertUser({
    ...u,
    notifOrder:  document.getElementById('notifOrder')?.checked,
    notifEmail:  document.getElementById('notifEmail')?.checked,
    notifWa:     document.getElementById('notifWa')?.checked,
  });
}

function boot() {
  Storage.seedIfEmpty();
  restoreSession();
  if (!checkAuth()) return;
  initNavbar();
  loadUserToForm();
  renderHistory();

  const hashSec = HASH_MAP[(location.hash || '').replace('#', '')] || 'data';
  showSection(hashSec);

  const HASH_OUT = { data: '', riwayat: 'riwayat', bayar: 'pembayaran', settings: 'pengaturan' };
  document.querySelectorAll('.profil-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!btn.dataset.sec) return;
      showSection(btn.dataset.sec);
      const h = HASH_OUT[btn.dataset.sec] || '';
      history.replaceState(null, '', h ? `profil.html#${h}` : 'profil.html');
    });
  });

  window.addEventListener('hashchange', () => {
    const sec = HASH_MAP[(location.hash || '').replace('#', '')] || 'data';
    showSection(sec);
  });

  document.querySelectorAll('#sec-riwayat .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#sec-riwayat .tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentHist = btn.dataset.hist || 'all';
      renderHistory();
    });
  });

  document.getElementById('formProfile')?.addEventListener('submit', e => {
    e.preventDefault();
    const r = updateProfile({
      name:      document.getElementById('pfName').value.trim(),
      email:     document.getElementById('pfEmail').value.trim(),
      phone:     document.getElementById('pfPhone').value.trim(),
      address:   document.getElementById('pfAddr').value.trim(),
      birthdate: document.getElementById('pfBirth').value,
      gender:    document.getElementById('pfGender').value,
    });
    if (r.success) {
      loadUserToForm();
      showToast('success', 'Tersimpan', 'Profil diperbarui.');
    } else showToast('error', 'Gagal', r.message || 'Coba lagi.');
  });

  ['notifOrder', 'notifEmail', 'notifWa'].forEach(id => {
    document.getElementById(id)?.addEventListener('change', saveNotifs);
  });

  document.getElementById('btnChangePw')?.addEventListener('click', () => {
    const res = changePassword({
      currentPassword: document.getElementById('pfCurPw').value,
      newPassword:     document.getElementById('pfNewPw').value,
      confirmNew:      document.getElementById('pfNewPw2').value,
    });
    if (res.success) {
      showToast('success', 'Password', 'Password berhasil diganti.');
      document.getElementById('pfCurPw').value = '';
      document.getElementById('pfNewPw').value = '';
      document.getElementById('pfNewPw2').value = '';
    } else {
      showToast('error', 'Password', res.message || 'Periksa input Anda.');
    }
  });

  document.getElementById('btnAvatarPick')?.addEventListener('click', () => document.getElementById('avatarInput')?.click());
  document.getElementById('avatarInput')?.addEventListener('change', e => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    document.getElementById('sideAvatar').src = url;
    const reader = new FileReader();
    reader.onload = () => {
      const u = Storage.getCurrentUser();
      if (!u || reader.result.length > 120000) return;
      Storage.upsertUser({ ...u, avatar: reader.result });
      showToast('success', 'Foto', 'Avatar diperbarui.');
    };
    reader.readAsDataURL(f);
  });

  const delModal = document.getElementById('delModal');
  const openDel = () => delModal?.classList.add('open');
  const closeDel = () => delModal?.classList.remove('open');
  document.getElementById('btnOpenDelete')?.addEventListener('click', openDel);
  document.getElementById('delModalClose')?.addEventListener('click', closeDel);
  document.getElementById('delModalCancel')?.addEventListener('click', closeDel);
  delModal?.addEventListener('click', e => { if (e.target === delModal) closeDel(); });
  document.getElementById('delModalOk')?.addEventListener('click', () => {
    closeDel();
    deleteAccount();
  });

  document.getElementById('btnAddPay')?.addEventListener('click', () => {
    showToast('info', 'Metode', 'Penambahan metode tersedia di versi produksi.');
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
