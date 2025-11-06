/**
 * Simulate API delay for mock services
 * @param {number} ms - Delay duration in milliseconds (default: 300ms)
 * @returns {Promise<void>}
 */
export const delay = (ms = 300) =>
  new Promise(resolve => setTimeout(resolve, ms));
