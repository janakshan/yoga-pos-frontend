import { devtools } from 'zustand/middleware';

/**
 * Create a devtools middleware configuration
 * @param {string} name - The name displayed in Redux DevTools
 * @returns {Function} Devtools middleware
 */
export const createDevtools = (name) => {
  return devtools((set, get, api) => api, {
    name,
    enabled: import.meta.env.DEV, // Only enable in development
  });
};

/**
 * Log middleware for debugging state changes
 */
export const logger = (config) => (set, get, api) =>
  config(
    (...args) => {
      if (import.meta.env.DEV) {
        console.log('  applying', args);
      }
      set(...args);
      if (import.meta.env.DEV) {
        console.log('  new state', get());
      }
    },
    get,
    api
  );
