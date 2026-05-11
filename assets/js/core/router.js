/* ============================================================
   DRIVEEASE — router.js
   Navigation helpers · Toast · Scroll reveal · URL params
   ============================================================ */

/* ── URL / Query params ─────────────────────────────────────── */

function getParam(key, fallback = null) {
  const params = new URLSearchParams(window.location.search);
  return params.has(key) ? params.get(key) : fallback;
}

function buildQuery(params = {}) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== null && v !== undefined && v !== '') q.set(k, v);
  });
  return q.toString() ? `?${q.toString()}` : '';
}

function navigate(path, params = {}) {
  window.location.href = path + buildQuery(params);
}

/* ── Scroll utilities ───────────────────────────────────────── */

function scrollToTop(smooth = true) {
  window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
}

function scrollToElement(el, offset = 80) {
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: 'smooth' });
}

/* ── IntersectionObserver — scroll reveal ───────────────────── */

let _revealObserver = null;

function initScrollReveal() {
  if (_revealObserver) _revealObserver.disconnect();

  _revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          _revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
    .forEach(el => _revealObserver.observe(el));
}

/* ── Navbar scroll-aware behavior ───────────────────────────── */

function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const threshold = 80;

  function update() {
    navbar.classList.toggle('scrolled', window.scrollY > threshold);
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ── Mobile hamburger drawer ────────────────────────────────── */

function initMobileNav() {
  const hamburger = document.querySelector('.hamburger');
  const drawer    = document.querySelector('.nav-drawer');
  const overlay   = document.querySelector('.nav-drawer-overlay');

  if (!hamburger || !drawer) return;

  function open() {
    hamburger.classList.add('open');
    drawer.classList.add('open');
    overlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    hamburger.classList.remove('open');
    drawer.classList.remove('open');
    overlay?.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    hamburger.classList.contains('open') ? close() : open();
  });

  overlay?.addEventListener('click', close);

  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
}

/* ── Active nav link ────────────────────────────────────────── */

function setActiveNavLink() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link[href]').forEach(link => {
    const href = link.getAttribute('href').split('?')[0];
    link.classList.toggle('active', href === page || (page === '' && href === 'index.html'));
  });
}

/* ── Toast notification ─────────────────────────────────────── */

let _toastContainer = null;

function _getToastContainer() {
  if (!_toastContainer) {
    _toastContainer = document.querySelector('.toast-container');
    if (!_toastContainer) {
      _toastContainer = document.createElement('div');
      _toastContainer.className = 'toast-container';
      document.body.appendChild(_toastContainer);
    }
  }
  return _toastContainer;
}

const TOAST_ICONS = {
  success: 'fa-circle-check',
  error:   'fa-circle-xmark',
  warning: 'fa-triangle-exclamation',
  info:    'fa-circle-info',
};

function showToast(type = 'info', title = '', message = '', duration = 3500) {
  const container = _getToastContainer();
  const icon = TOAST_ICONS[type] || TOAST_ICONS.info;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast__icon"><i class="fa-solid ${icon}"></i></span>
    <div class="toast__body">
      ${title    ? `<div class="toast__title">${title}</div>` : ''}
      ${message  ? `<div class="toast__message">${message}</div>` : ''}
    </div>
    <span class="toast__close"><i class="fa-solid fa-xmark"></i></span>
  `;

  const close = () => {
    toast.classList.add('dismissing');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  };

  toast.querySelector('.toast__close').addEventListener('click', close);
  container.appendChild(toast);

  const timer = setTimeout(close, duration);
  toast.addEventListener('mouseenter', () => clearTimeout(timer));
  toast.addEventListener('mouseleave', () => setTimeout(close, 1000));
}

/* ── Stats counter (IntersectionObserver) ───────────────────── */

function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseFloat(el.dataset.counter);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
      const duration = 1800;
      const start = performance.now();

      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = (target * eased).toFixed(decimals);
        el.textContent = prefix + current + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }

      requestAnimationFrame(step);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => obs.observe(el));
}

/* ── Global page init (call on every page) ──────────────────── */

function initPage() {
  initNavbarScroll();
  initMobileNav();
  setActiveNavLink();
  initScrollReveal();
  initCounters();
}

export {
  getParam, buildQuery, navigate,
  scrollToTop, scrollToElement,
  initScrollReveal, initNavbarScroll, initMobileNav,
  setActiveNavLink, initCounters,
  showToast, initPage,
};
