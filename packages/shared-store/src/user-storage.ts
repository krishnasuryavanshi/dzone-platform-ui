import type { StateStorage } from 'zustand/middleware';

/**
 * Creates a localStorage adapter that prefixes keys with userId
 * so different users on the same browser never read each other's cached state.
 */
export const createUserStorage = (userId: string): StateStorage => ({
  getItem: (name) => localStorage.getItem(`dzone:${userId}:${name}`),
  setItem: (name, value) => localStorage.setItem(`dzone:${userId}:${name}`, value),
  removeItem: (name) => localStorage.removeItem(`dzone:${userId}:${name}`),
});

/**
 * Clear all persisted data for a specific user on logout.
 */
export const clearUserStorage = (userId: string) => {
  const keys = Object.keys(localStorage).filter((k) => k.startsWith(`dzone:${userId}:`));
  keys.forEach((k) => localStorage.removeItem(k));
};
