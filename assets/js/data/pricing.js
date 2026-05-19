/* ============================================================
   DRIVEEASE — pricing.js
   Hitung sewa per hari berdasarkan tier fasilitas
   ============================================================ */

import {
  TIER_CATALOG,
  DRIVER_FEE_PER_DAY,
  INSURANCE_BASIC_PER_DAY,
  INSURANCE_COMPREHENSIVE_PER_DAY,
  LEGACY_PACKAGE_SLUG,
} from './tiers.js';

function roundPrice(n) {
  return Math.round(n / 5000) * 5000;
}

export function getCarPackages(car) {
  const base = car?.pricePerDay || car?.priceWithDriver || 400000;
  return TIER_CATALOG.map(t => ({
    id: t.id,
    name: t.name,
    pricePerDay: roundPrice(base * t.multiplier),
    driverDiscountPercent: t.driverDiscountPercent,
    tagline: t.tagline,
    features: [...t.features],
  }));
}

export function getTierById(car, tierId) {
  const pkgs = getCarPackages(car);
  return pkgs.find(p => p.id === tierId) || pkgs.find(p => p.name === tierId) || pkgs[0];
}

export function getTierByName(car, name) {
  const pkgs = getCarPackages(car);
  return pkgs.find(p => p.name === name) || pkgs[0];
}

export function resolveTierSlug(car, slug) {
  if (!slug) return null;
  const s = slug.toLowerCase().replace(/\s+/g, '');
  const legacyId = LEGACY_PACKAGE_SLUG[s];
  const pkgs = getCarPackages(car);
  if (legacyId) return pkgs.find(p => p.id === legacyId) || null;
  return pkgs.find(p => p.id === s || p.name.toLowerCase().replace(/\s+/g, '') === s) || null;
}

export function rentalDays(pickStr, dropStr) {
  if (!pickStr || !dropStr) return 1;
  const pick = new Date(pickStr + 'T12:00:00');
  const drop = new Date(dropStr + 'T12:00:00');
  const diff = (drop - pick) / 86400000;
  if (diff < 0) return -1;
  return Math.max(1, Math.round(diff));
}

export function calcDriverFee(days, withDriver, driverDiscountPercent = 0) {
  if (!withDriver || days < 1) return 0;
  const gross = DRIVER_FEE_PER_DAY * days;
  const discount = Math.min(100, Math.max(0, driverDiscountPercent || 0));
  return Math.round(gross * (1 - discount / 100));
}

export function calcInsuranceFee(days, insuranceType = 'basic') {
  if (days < 1) return 0;
  const perDay = insuranceType === 'comprehensive'
    ? INSURANCE_COMPREHENSIVE_PER_DAY
    : INSURANCE_BASIC_PER_DAY;
  return perDay * days;
}

/**
 * @param {object} car
 * @param {{ tierId?: string, tierName?: string, days: number, withDriver?: boolean, insuranceType?: string, promoDiscount?: number, deposit?: number }} opts
 */
export function calcRentalQuote(car, opts) {
  const days = opts.days ?? 1;
  const pkg = opts.tierName
    ? getTierByName(car, opts.tierName)
  : getTierById(car, opts.tierId || 'reguler');

  if (days < 0) {
    return {
      days,
      pkg,
      subtotal: 0,
      insurance: 0,
      driver: 0,
      driverGross: 0,
      driverDiscountPercent: pkg?.driverDiscountPercent || 0,
      deposit: 0,
      total: 0,
      perDayRate: pkg?.pricePerDay || 0,
    };
  }

  const subtotal = (pkg?.pricePerDay || 0) * days;
  const insurance = calcInsuranceFee(days, opts.insuranceType || 'basic');
  const driverGross = opts.withDriver ? DRIVER_FEE_PER_DAY * days : 0;
  const driver = calcDriverFee(days, opts.withDriver, pkg?.driverDiscountPercent);
  const deposit = opts.deposit != null ? opts.deposit : (car?.deposit || 0);
  const promo = opts.promoDiscount || 0;
  const total = Math.max(0, subtotal - promo) + insurance + driver + deposit;

  return {
    days,
    pkg,
    subtotal,
    insurance,
    driver,
    driverGross,
    driverDiscountPercent: pkg?.driverDiscountPercent || 0,
    deposit,
    promoDiscount: promo,
    total,
    perDayRate: pkg?.pricePerDay || 0,
  };
}

export function getLowestTierPrice(car) {
  const pkgs = getCarPackages(car);
  return Math.min(...pkgs.map(p => p.pricePerDay));
}

export { DRIVER_FEE_PER_DAY } from './tiers.js';
