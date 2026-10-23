export const DAILY_SEEN_KEY = "tarot_daily_seen";
export const DAILY_REVEALED_KEY = "bm_tarot_daily_revealed_v1";
export const DAILY_DEVICE_SEED_KEY = "bm_tarot_device_seed_v1";

export function getOrCreateDeviceSeed(): string {
  if (typeof window === "undefined") return "";
  try {
    let seed = window.localStorage.getItem(DAILY_DEVICE_SEED_KEY);
    if (!seed) {
      seed = Math.random().toString(36).slice(2) + Date.now().toString(36);
      window.localStorage.setItem(DAILY_DEVICE_SEED_KEY, seed);
    }
    return seed;
  } catch {
    return "";
  }
}

export function hasDailyDate(key: string, date: string): boolean {
  try {
    return window.localStorage.getItem(key) === date;
  } catch {
    return false;
  }
}

export function storeDailyDate(key: string, date: string): void {
  try {
    window.localStorage.setItem(key, date);
  } catch {
    // Daily draw vẫn hoạt động trong bộ nhớ phiên nếu trình duyệt chặn localStorage.
  }
}
