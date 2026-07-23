/**
 * Security & Utility Helpers for Thermal Express
 * 
 * Includes:
 * 1. String Sanitization & XSS protection
 * 2. Financial rounding & Precision math (preventing 0.0000000004 floating point errors)
 * 3. Safe LocalStorage setters/getters with QuotaExceededError protection
 */

/**
 * Sanitizes input strings by stripping raw HTML tags, dangerous script vectors,
 * and enforcing maximum length limits.
 */
export function sanitizeString(str: string | undefined | null, maxLength: number = 200): string {
  if (!str) return '';
  
  // Strip HTML tags and script elements
  const cleaned = String(str)
    .replace(/<[^>]*>?/gm, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove inline javascript protocols
    .replace(/onload=/gi, '')
    .replace(/onerror=/gi, '')
    .trim();

  return cleaned.substring(0, maxLength);
}

/**
 * Ensures financial precision by rounding numbers strictly to 2 decimal places.
 * Prevents floating point math bugs like 100.00000000000004
 */
export function roundMoney(val: number): number {
  if (isNaN(val) || !isFinite(val)) return 0;
  const nonNegative = Math.max(0, val);
  return Math.round((nonNegative + Number.EPSILON) * 100) / 100;
}

/**
 * Safely parses JSON strings with fallback default state if data is corrupted.
 */
export function safeJsonParse<T>(jsonString: string | null, fallback: T): T {
  if (!jsonString) return fallback;
  try {
    const parsed = JSON.parse(jsonString);
    return parsed !== null && parsed !== undefined ? parsed : fallback;
  } catch (err) {
    console.warn('Corrupted JSON data in LocalStorage, falling back to clean default state:', err);
    return fallback;
  }
}

/**
 * Safely stores data to LocalStorage, catching QuotaExceededError when browser storage is full.
 */
export function safeLocalStorageSet(key: string, value: unknown): boolean {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
    return true;
  } catch (err: unknown) {
    const error = err as Error;
    if (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
      console.error('LocalStorage Quota Exceeded! Unable to save key:', key, error);
      alert('Browser storage is full! Some settings or sales records could not be saved locally.');
    } else {
      console.error('LocalStorage write failed:', error);
    }
    return false;
  }
}
