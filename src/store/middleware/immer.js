import { produce } from 'immer';

/**
 * Immer middleware for immutable state updates
 * Allows you to write mutable code that produces immutable updates
 */
export const immer = (config) => (set, get, api) =>
  config(
    (partial, replace) => {
      const nextState =
        typeof partial === 'function'
          ? produce(partial)
          : partial;
      return set(nextState, replace);
    },
    get,
    api
  );
