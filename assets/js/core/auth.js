/* ============================================================
   DRIVEEASE — auth.js
   Register · Login · Logout · Auth guard · Validation
   ============================================================ */

import Storage from './storage.js';
import { showToast } from './router.js';

/* ── Helpers ────────────────────────────────────────────────── */

function hashPassword(plain) {
  return btoa(plain);
}

function verifyPassword(plain, hashed) {
  return btoa(plain) === hashed;
}

function generateId() {
  return 'usr_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

/* ── Validation ─────────────────────────────────────────────── */

const Validators = {
  email(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  },
  password(value) {
    // min 8 chars, at least 1 uppercase, 1 digit
    return /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(value);
  },
  phone(value) {
    return /^(\+62|62|0)8[1-9][0-9]{7,10}$/.test(value.replace(/\s/g, ''));
  },
  name(value) {
    return value.trim().length >= 3;
  },
};

function getFieldError(field, value, extra = {}) {
  switch (field) {
    case 'name':
      return Validators.name(value) ? null : 'Nama minimal 3 karakter.';
    case 'email':
      return Validators.email(value) ? null : 'Format email tidak valid.';
    case 'phone':
      return Validators.phone(value) ? null : 'Format nomor HP tidak valid (+62/08xx).';
    case 'password':
      return Validators.password(value)
        ? null
        : 'Password min. 8 karakter, 1 huruf besar, 1 angka.';
    case 'confirmPassword':
      return value === extra.password ? null : 'Konfirmasi password tidak cocok.';
    default:
      return null;
  }
}

/* ── DOM helpers ─────────────────────────────────────────────── */

function markError(inputEl, message) {
  inputEl.classList.add('error');
  const wrapper = inputEl.closest('.form-group');
  if (!wrapper) return;
  let errEl = wrapper.querySelector('.form-error');
  if (!errEl) {
    errEl = document.createElement('span');
    errEl.className = 'form-error';
    wrapper.appendChild(errEl);
  }
  errEl.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${message}`;
  inputEl.addEventListener('input', () => clearError(inputEl), { once: true });
}

function clearError(inputEl) {
  inputEl.classList.remove('error');
  const wrapper = inputEl.closest('.form-group');
  if (!wrapper) return;
  wrapper.querySelector('.form-error')?.remove();
}

/* ── Register ────────────────────────────────────────────────── */

function register({ name, email, phone, password, confirmPassword, agreeTerms }) {
  const errors = [];

  const nameErr = getFieldError('name', name);
  const emailErr = getFieldError('email', email);
  const phoneErr = getFieldError('phone', phone);
  const passErr  = getFieldError('password', password);
  const confErr  = getFieldError('confirmPassword', confirmPassword, { password });

  if (nameErr)  errors.push({ field: 'name',            message: nameErr });
  if (emailErr) errors.push({ field: 'email',           message: emailErr });
  if (phoneErr) errors.push({ field: 'phone',           message: phoneErr });
  if (passErr)  errors.push({ field: 'password',        message: passErr });
  if (confErr)  errors.push({ field: 'confirmPassword', message: confErr });
  if (!agreeTerms) errors.push({ field: 'agreeTerms', message: 'Anda harus menyetujui syarat & ketentuan.' });

  if (errors.length > 0) return { success: false, errors };

  if (Storage.getUserByEmail(email)) {
    return { success: false, errors: [{ field: 'email', message: 'Email sudah terdaftar.' }] };
  }

  const newUser = {
    id:            generateId(),
    name:          name.trim(),
    email:         email.trim().toLowerCase(),
    phone:         phone.trim(),
    password:      hashPassword(password),
    avatar:        `https://i.pravatar.cc/150?u=${email}`,
    theme:         'light',
    accentColor:   'blue',
    address:       '',
    birthdate:     '',
    gender:        '',
    emailVerified: false,
    createdAt:     new Date().toISOString().split('T')[0],
  };

  Storage.upsertUser(newUser);
  Storage.setCurrentUser(newUser.id);

  return { success: true, user: newUser };
}

/* ── Login ───────────────────────────────────────────────────── */

function login({ email, password, remember }) {
  const emailErr = getFieldError('email', email);
  if (emailErr) return { success: false, errors: [{ field: 'email', message: emailErr }] };

  const user = Storage.getUserByEmail(email);
  if (!user) {
    return { success: false, errors: [{ field: 'email', message: 'Email tidak terdaftar.' }] };
  }

  if (!verifyPassword(password, user.password)) {
    return { success: false, errors: [{ field: 'password', message: 'Password salah.' }] };
  }

  Storage.setCurrentUser(user.id);

  if (remember) {
    localStorage.setItem('driveease_remember', user.id);
  } else {
    localStorage.removeItem('driveease_remember');
  }

  return { success: true, user };
}

/* ── Logout ──────────────────────────────────────────────────── */

function logout() {
  Storage.clearSession();
  localStorage.removeItem('driveease_remember');
  window.location.href = 'login.html';
}

/* ── Auth guard ──────────────────────────────────────────────── */

const PROTECTED_PAGES = ['checkout.html', 'tracking.html', 'profil.html'];

function checkAuth() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  const isProtected = PROTECTED_PAGES.some(p => page.includes(p));

  if (isProtected && !Storage.isLoggedIn()) {
    window.location.href = `login.html?returnUrl=${encodeURIComponent(page)}`;
    return false;
  }
  return true;
}

/* ── Auto-restore remembered session ────────────────────────── */

function restoreSession() {
  if (Storage.isLoggedIn()) return;
  const remembered = localStorage.getItem('driveease_remember');
  if (remembered && Storage.getUserById(remembered)) {
    Storage.setCurrentUser(remembered);
  }
}

/* ── Update profile ──────────────────────────────────────────── */

function updateProfile(fields) {
  const current = Storage.getCurrentUser();
  if (!current) return { success: false, message: 'Tidak ada sesi aktif.' };

  const updated = { ...current, ...fields };
  Storage.upsertUser(updated);
  return { success: true, user: updated };
}

/* ── Change password ─────────────────────────────────────────── */

function changePassword({ currentPassword, newPassword, confirmNew }) {
  const current = Storage.getCurrentUser();
  if (!current) return { success: false, message: 'Tidak ada sesi aktif.' };

  if (!verifyPassword(currentPassword, current.password)) {
    return { success: false, field: 'currentPassword', message: 'Password saat ini salah.' };
  }

  const passErr = getFieldError('password', newPassword);
  if (passErr) return { success: false, field: 'newPassword', message: passErr };

  if (newPassword !== confirmNew) {
    return { success: false, field: 'confirmNew', message: 'Konfirmasi password tidak cocok.' };
  }

  Storage.upsertUser({ ...current, password: hashPassword(newPassword) });
  return { success: true };
}

/* ── Delete account ──────────────────────────────────────────── */

function deleteAccount() {
  const current = Storage.getCurrentUser();
  if (!current) return;
  Storage.deleteUser(current.id);
  Storage.clearSession();
  window.location.href = 'index.html';
}

/* ── Init: wire login/register form if present ───────────────── */

function initLoginPage() {
  restoreSession();

  if (Storage.isLoggedIn()) {
    const returnUrl = new URLSearchParams(window.location.search).get('returnUrl');
    window.location.href = returnUrl || 'index.html';
    return;
  }

  const loginForm    = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const tabLogin     = document.getElementById('tabLogin');
  const tabRegister  = document.getElementById('tabRegister');

  function switchTab(active) {
    const isLogin = active === 'login';
    loginForm?.classList.toggle('hidden', !isLogin);
    registerForm?.classList.toggle('hidden', isLogin);
    tabLogin?.classList.toggle('active', isLogin);
    tabRegister?.classList.toggle('active', !isLogin);
  }

  tabLogin?.addEventListener('click',    () => switchTab('login'));
  tabRegister?.addEventListener('click', () => switchTab('register'));

  /* Login submit */
  loginForm?.addEventListener('submit', e => {
    e.preventDefault();
    const email    = loginForm.querySelector('[name="email"]');
    const password = loginForm.querySelector('[name="password"]');
    const remember = loginForm.querySelector('[name="remember"]')?.checked || false;

    const result = login({ email: email.value, password: password.value, remember });

    if (!result.success) {
      result.errors.forEach(err => {
        const el = loginForm.querySelector(`[name="${err.field}"]`);
        if (el) markError(el, err.message);
      });
      showToast('error', 'Login Gagal', result.errors[0].message);
      return;
    }

    showToast('success', 'Selamat Datang!', `Halo, ${result.user.name}!`);
    const returnUrl = new URLSearchParams(window.location.search).get('returnUrl');
    setTimeout(() => { window.location.href = returnUrl || 'index.html'; }, 800);
  });

  /* Register submit */
  registerForm?.addEventListener('submit', e => {
    e.preventDefault();
    const f = registerForm;
    const result = register({
      name:            f.querySelector('[name="name"]').value,
      email:           f.querySelector('[name="email"]').value,
      phone:           f.querySelector('[name="phone"]').value,
      password:        f.querySelector('[name="password"]').value,
      confirmPassword: f.querySelector('[name="confirmPassword"]').value,
      agreeTerms:      f.querySelector('[name="agreeTerms"]')?.checked || false,
    });

    if (!result.success) {
      result.errors.forEach(err => {
        const el = f.querySelector(`[name="${err.field}"]`);
        if (el) markError(el, err.message);
      });
      showToast('error', 'Pendaftaran Gagal', result.errors[0].message);
      return;
    }

    showToast('success', 'Akun Dibuat!', 'Selamat bergabung di DriveEase.');
    setTimeout(() => { window.location.href = 'index.html'; }, 800);
  });

  /* Password show/hide toggles */
  document.querySelectorAll('[data-toggle-password]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.togglePassword);
      if (!target) return;
      const isText = target.type === 'text';
      target.type = isText ? 'password' : 'text';
      btn.querySelector('i')?.classList.toggle('fa-eye', isText);
      btn.querySelector('i')?.classList.toggle('fa-eye-slash', !isText);
    });
  });
}

export {
  register, login, logout,
  checkAuth, restoreSession,
  updateProfile, changePassword, deleteAccount,
  markError, clearError, getFieldError, Validators,
  initLoginPage,
};
