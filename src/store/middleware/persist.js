import { persist } from 'zustand/middleware';

/**
 * Create a persist middleware configuration
 * @param {string} name - The name of the storage key
 * @param {Array<string>} whitelist - Array of state keys to persist
 * @returns {Function} Persist middleware
 */
export const createPersist = (name, whitelist = []) => {
  return persist(
    (set, get, api) => api,
    {
      name,
      partialize: (state) => {
        if (whitelist.length === 0) return state;

        return Object.keys(state).reduce((acc, key) => {
          if (whitelist.includes(key)) {
            acc[key] = state[key];
          }
          return acc;
        }, {});
      },
    }
  );
};

/**
 * Session storage persist middleware
 */
export const createSessionPersist = (name, whitelist = []) => {
  return persist(
    (set, get, api) => api,
    {
      name,
      storage: {
        getItem: (name) => {
          const str = sessionStorage.getItem(name);
          return str ? JSON.parse(str) : null;
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => sessionStorage.removeItem(name),
      },
      partialize: (state) => {
        if (whitelist.length === 0) return state;

        return Object.keys(state).reduce((acc, key) => {
          if (whitelist.includes(key)) {
            acc[key] = state[key];
          }
          return acc;
        }, {});
      },
    }
  );
};
