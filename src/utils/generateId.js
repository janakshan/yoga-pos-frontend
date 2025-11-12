/**
 * Generate unique IDs
 * Utility for generating unique identifiers with optional prefixes
 */

/**
 * Generate a unique ID with optional prefix
 * @param {string} [prefix=''] - Optional prefix for the ID
 * @returns {string} Unique identifier
 */
export function generateId(prefix = '') {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 11);
  const id = `${timestamp}_${randomPart}`;
  return prefix ? `${prefix}_${id}` : id;
}

/**
 * Generate a UUID v4
 * @returns {string} UUID v4 string
 */
export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Generate a short ID (8 characters)
 * @param {string} [prefix=''] - Optional prefix for the ID
 * @returns {string} Short unique identifier
 */
export function generateShortId(prefix = '') {
  const id = Math.random().toString(36).substring(2, 10);
  return prefix ? `${prefix}_${id}` : id;
}

export default generateId;
