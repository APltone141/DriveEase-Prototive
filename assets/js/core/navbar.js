/* ============================================================
   DRIVEEASE — navbar.js
   Wires dynamic auth state, dropdown, drawer, booking badge
   Import and call initNavbar() in every page script.
   ============================================================ */

import Storage from './storage.js';
import { logout } from './auth.js';
import { initThemeControls } from './theme.js';
import { initNavbarScroll, initMobileNav, setActiveNavLink } from './router.js';

function initNavbar() {
  initNavbarScroll();
  setActiveNavLink();
  initThemeControls();
  _wireDrawer();
  _updateAuthState();
  _wireDropdown();
}

/* ── Auth state ──────────────────────────────────────────── */

function _updateAuthState() {
  const user = Storage.getCurrentUser();

  const navGuest  = document.getElementById('navGuest');
  const navUser   = document.getElementById('navUser');
  const drawerGuest  = document.getElementById('drawerGuestActions');
  const drawerLogout = document.getElementById('drawerLogoutBtn');
  const drawerStrip  = document.getElementById('drawerUserStrip');

  if (user) {
    navGuest?.classList.add('hidden');
    navUser?.classList.remove('hidden');

    /* Populate avatar + name */
    ['navAvatar', 'drawerAvatar'].forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.src = user.avatar || `https://i.pravatar.cc/150?u=${user.email}`; el.alt = user.name; }
    });

    const nameEl = document.getElementById('navUserName');
    if (nameEl) nameEl.textContent = user.name.split(' ')[0];

    const drawerName  = document.getElementById('drawerName');
    const drawerEmail = document.getElementById('drawerEmail');
    if (drawerName)  drawerName.textContent  = user.name;
    if (drawerEmail) drawerEmail.textContent = user.email;

    drawerStrip?.classList.remove('hidden');
    drawerGuest?.classList.add('hidden');
    drawerLogout?.classList.remove('hidden');

    /* Active booking badge */
    const activeBookings = Storage.getBookingsByUser(user.id)
      .filter(b => b.status === 'active' || b.status === 'confirmed');

    const badgeEl = document.getElementById('navBookingBadge');
    const countEl = document.getElementById('navBadgeCount');
    if (badgeEl && activeBookings.length > 0) {
      badgeEl.style.display = 'flex';
      if (countEl) countEl.textContent = activeBookings.length;
    }
  } else {
    navGuest?.classList.remove('hidden');
    navUser?.classList.add('hidden');
    drawerStrip?.classList.add('hidden');
    drawerGuest?.classList.remove('hidden');
    drawerLogout?.classList.add('hidden');
  }

  /* Logout buttons */
  document.getElementById('navLogoutBtn')?.addEventListener('click', logout);
  document.getElementById('drawerLogoutBtn')?.addEventListener('click', logout);
}

/* ── Dropdown ────────────────────────────────────────────── */

function _wireDropdown() {
  const btn  = document.getElementById('navAvatarBtn');
  const menu = document.getElementById('navDropdownMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', e => {
    e.stopPropagation();
    const open = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });

  document.addEventListener('click', () => {
    menu.classList.remove('open');
    btn.setAttribute('aria-expanded', false);
  });

  menu.addEventListener('click', e => e.stopPropagation());
}

/* ── Mobile drawer ───────────────────────────────────────── */

function _wireDrawer() {
  const hamburger = document.getElementById('hamburger');
  const drawer    = document.getElementById('navDrawer');
  const overlay   = document.getElementById('navOverlay');
  if (!hamburger || !drawer) return;

  function open() {
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    drawer.removeAttribute('hidden');
    drawer.classList.add('open');
    overlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    drawer.classList.remove('open');
    overlay?.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { if (!drawer.classList.contains('open')) drawer.setAttribute('hidden', ''); }, 400);
  }

  hamburger.addEventListener('click', () => {
    hamburger.classList.contains('open') ? close() : open();
  });

  overlay?.addEventListener('click', close);
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
}

export { initNavbar };
