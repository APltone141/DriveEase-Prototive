/* ============================================================
   DRIVEEASE — storage.js
   LocalStorage abstraction layer
   ============================================================ */

const KEYS = {
  USERS:        'driveease_users',
  CURRENT_USER: 'driveease_currentUser',
  BOOKINGS:     'driveease_bookings',
  THEME:        'driveease_theme',
  ACCENT:       'driveease_accentColor',
  WISHLIST:     'driveease_wishlist',
  SEARCH_CACHE: 'driveease_searchCache',
};

const Storage = (() => {

  function get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  }

  function set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn('[DriveEase Storage] set failed:', key, e);
      return false;
    }
  }

  function remove(key) {
    localStorage.removeItem(key);
  }

  function clear() {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
  }

  /* ── Users ─────────────────────────────────────────────── */

  function getUsers() {
    return get(KEYS.USERS, []);
  }

  function saveUsers(users) {
    return set(KEYS.USERS, users);
  }

  function getUserById(id) {
    return getUsers().find(u => u.id === id) || null;
  }

  function getUserByEmail(email) {
    return getUsers().find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  function upsertUser(user) {
    const users = getUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx >= 0) {
      users[idx] = { ...users[idx], ...user };
    } else {
      users.push(user);
    }
    return saveUsers(users);
  }

  function deleteUser(id) {
    const users = getUsers().filter(u => u.id !== id);
    saveUsers(users);
  }

  /* ── Session ────────────────────────────────────────────── */

  function getCurrentUser() {
    const id = get(KEYS.CURRENT_USER);
    if (!id) return null;
    return getUserById(id);
  }

  function setCurrentUser(userId) {
    return set(KEYS.CURRENT_USER, userId);
  }

  function clearSession() {
    remove(KEYS.CURRENT_USER);
  }

  function isLoggedIn() {
    return getCurrentUser() !== null;
  }

  /* ── Bookings ───────────────────────────────────────────── */

  function getBookings() {
    return get(KEYS.BOOKINGS, []);
  }

  function saveBookings(bookings) {
    return set(KEYS.BOOKINGS, bookings);
  }

  function getBookingById(id) {
    return getBookings().find(b => b.id === id) || null;
  }

  function getBookingsByUser(userId) {
    return getBookings().filter(b => b.userId === userId);
  }

  function upsertBooking(booking) {
    const bookings = getBookings();
    const idx = bookings.findIndex(b => b.id === booking.id);
    if (idx >= 0) {
      bookings[idx] = { ...bookings[idx], ...booking };
    } else {
      bookings.push(booking);
    }
    return saveBookings(bookings);
  }

  function updateBookingStatus(id, status) {
    const bookings = getBookings();
    const idx = bookings.findIndex(b => b.id === id);
    if (idx < 0) return false;
    bookings[idx].status = status;
    bookings[idx].statusHistory = bookings[idx].statusHistory || [];
    bookings[idx].statusHistory.push({
      status,
      time: new Date().toLocaleString('id-ID'),
    });
    return saveBookings(bookings);
  }

  /* ── Wishlist ───────────────────────────────────────────── */

  function getWishlist() {
    return get(KEYS.WISHLIST, []);
  }

  function addToWishlist(carId) {
    const list = getWishlist();
    if (!list.includes(carId)) {
      list.push(carId);
      set(KEYS.WISHLIST, list);
    }
  }

  function removeFromWishlist(carId) {
    const list = getWishlist().filter(id => id !== carId);
    set(KEYS.WISHLIST, list);
  }

  function toggleWishlist(carId) {
    const list = getWishlist();
    if (list.includes(carId)) {
      removeFromWishlist(carId);
      return false;
    } else {
      addToWishlist(carId);
      return true;
    }
  }

  function isWishlisted(carId) {
    return getWishlist().includes(carId);
  }

  /* ── Preferences ────────────────────────────────────────── */

  function getTheme() {
    return get(KEYS.THEME, 'light');
  }

  function setTheme(value) {
    return set(KEYS.THEME, value);
  }

  function getAccent() {
    return get(KEYS.ACCENT, 'blue');
  }

  function setAccent(value) {
    return set(KEYS.ACCENT, value);
  }

  /* ── Search cache ───────────────────────────────────────── */

  function getSearchCache() {
    return get(KEYS.SEARCH_CACHE, {});
  }

  function setSearchCache(params) {
    return set(KEYS.SEARCH_CACHE, params);
  }

  /* ── Seed default data if first visit ───────────────────── */

  function seedIfEmpty() {
    if (getUsers().length === 0) {
      upsertUser({
        id:          'usr_001',
        name:        'Budi Santoso',
        email:       'budi@email.com',
        phone:       '081234567890',
        password:    btoa('Password1'),
        avatar:      'https://i.pravatar.cc/150?img=3',
        theme:       'light',
        accentColor: 'blue',
        address:     'Jl. Sudirman No.1, Jakarta',
        birthdate:   '1995-04-20',
        gender:      'male',
        emailVerified: true,
        createdAt:   '2025-01-15',
      });
    }

    if (getBookings().length === 0) {
      upsertBooking({
        id:          'DRV-20250601-7842',
        userId:      'usr_001',
        carId:       'car_001',
        carName:     'Toyota Innova Zenix',
        package:     'Reguler',
        pickupDate:  '2025-06-01',
        pickupTime:  '09:00',
        dropDate:    '2025-06-04',
        dropTime:    '09:00',
        city:        'Jakarta',
        address:     'Jl. Sudirman No.1',
        withDriver:  true,
        insurance:   'comprehensive',
        renterData:  { name: 'Budi Santoso', ktp: '3171234567890001', sim: 'SIM-A-123' },
        payment:     { method: 'gopay', status: 'paid', total: 3475000 },
        status:      'active',
        statusHistory: [
          { status: 'confirmed', time: '1 Jun 2025, 08:00' },
          { status: 'active',    time: '1 Jun 2025, 09:30' },
        ],
        carLocation: { lat: -6.2088, lng: 106.8456 },
        driverName:  'Pak Ahmad',
        driverPhone: '081298765432',
        plateNumber: 'B 1234 CDR',
      });
    }
  }

  return {
    KEYS,
    get, set, remove, clear,
    getUsers, saveUsers, getUserById, getUserByEmail, upsertUser, deleteUser,
    getCurrentUser, setCurrentUser, clearSession, isLoggedIn,
    getBookings, saveBookings, getBookingById, getBookingsByUser,
    upsertBooking, updateBookingStatus,
    getWishlist, addToWishlist, removeFromWishlist, toggleWishlist, isWishlisted,
    getTheme, setTheme, getAccent, setAccent,
    getSearchCache, setSearchCache,
    seedIfEmpty,
  };
})();

export default Storage;
