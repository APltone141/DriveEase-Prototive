/* ============================================================
   DRIVEEASE — theme.js
   Dark Mode · Color Accent Switcher · Persistent via Storage
   ============================================================ */

import Storage from './storage.js';

const ACCENT_COLORS = {
  blue:   { primary: '#1A6BF5', dark: '#1250C2', light: '#4D8EFF', subtle: '#EBF1FF' },
  red:    { primary: '#EF4444', dark: '#DC2626', light: '#F87171', subtle: '#FEF2F2' },
  orange: { primary: '#F97316', dark: '#EA580C', light: '#FB923C', subtle: '#FFF7ED' },
};

/* ── Apply theme to DOM ────────────────────────────────────── */

function applyTheme(mode) {
  document.documentElement.setAttribute('data-theme', mode);
  Storage.setTheme(mode);
  _updateThemeToggleUI(mode);
}

function applyAccent(accent) {
  const colors = ACCENT_COLORS[accent] || ACCENT_COLORS.blue;
  const root = document.documentElement;

  root.setAttribute('data-accent', accent);
  root.style.setProperty('--color-primary',        colors.primary);
  root.style.setProperty('--color-primary-dark',   colors.dark);
  root.style.setProperty('--color-primary-light',  colors.light);
  root.style.setProperty('--color-primary-subtle', colors.subtle);

  Storage.setAccent(accent);
  _updateAccentUI(accent);
}

/* ── Toggle dark/light ─────────────────────────────────────── */

function toggleTheme() {
  const current = Storage.getTheme();
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  const user = Storage.getCurrentUser();
  if (user) Storage.upsertUser({ ...user, theme: next });
}

function isDark() {
  return Storage.getTheme() === 'dark';
}

/* ── Init: load saved preferences ─────────────────────────── */

function initTheme() {
  const savedTheme  = Storage.getTheme();
  const savedAccent = Storage.getAccent();

  applyTheme(savedTheme);
  applyAccent(savedAccent);
}

/* ── Sync user object preferences ─────────────────────────── */

function syncFromUser(user) {
  if (!user) return;
  if (user.theme)       applyTheme(user.theme);
  if (user.accentColor) applyAccent(user.accentColor);
}

/* ── Update toggle switch visuals ─────────────────────────── */

function _updateThemeToggleUI(mode) {
  document.querySelectorAll('[data-theme-toggle]').forEach(el => {
    if (el.tagName === 'INPUT' && el.type === 'checkbox') {
      el.checked = mode === 'dark';
    }
    const icon = el.closest('.toggle-switch')?.querySelector('.toggle-icon');
    if (icon) {
      icon.className = `toggle-icon fa-solid ${mode === 'dark' ? 'fa-moon' : 'fa-sun'}`;
    }
  });

  /* Navbar theme icon (if present) */
  const navThemeBtn = document.querySelector('[data-navbar-theme]');
  if (navThemeBtn) {
    navThemeBtn.innerHTML = mode === 'dark'
      ? '<i class="fa-solid fa-sun"></i>'
      : '<i class="fa-solid fa-moon"></i>';
    navThemeBtn.title = mode === 'dark' ? 'Mode Terang' : 'Mode Gelap';
  }
}

function _updateAccentUI(accent) {
  document.querySelectorAll('[data-accent-option]').forEach(el => {
    el.classList.toggle('selected', el.dataset.accentOption === accent);
    const radio = el.querySelector('input[type="radio"]');
    if (radio) radio.checked = (el.dataset.accentOption === accent);
  });
}

/* ── Wire settings page controls ──────────────────────────── */

function initThemeControls() {
  /* Dark mode toggle */
  document.querySelectorAll('[data-theme-toggle]').forEach(el => {
    el.addEventListener('change', () => toggleTheme());
  });

  /* Accent pickers */
  document.querySelectorAll('[data-accent-option]').forEach(el => {
    el.addEventListener('click', () => {
      const accent = el.dataset.accentOption;
      applyAccent(accent);

      /* Persist to current user profile */
      const user = Storage.getCurrentUser();
      if (user) Storage.upsertUser({ ...user, accentColor: accent });
    });
  });

  /* Navbar theme button */
  document.querySelector('[data-navbar-theme]')?.addEventListener('click', toggleTheme);
}

export {
  initTheme,
  initThemeControls,
  applyTheme,
  applyAccent,
  toggleTheme,
  isDark,
  syncFromUser,
  ACCENT_COLORS,
};
