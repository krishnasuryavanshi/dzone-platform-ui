import { create } from 'zustand';

const STORAGE_KEY = 'dzone-token';

/** Try to restore a previously saved token from either storage. */
const getStoredToken = (): string | null =>
  localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);

interface TokenState {
  accessToken: string | null;

  /** Save token. If `remember` is true, uses localStorage (survives browser close).
   *  Otherwise, uses sessionStorage (survives refresh, cleared on browser close). */
  setToken: (token: string, remember?: boolean) => void;
  clearToken: () => void;
}

export const useTokenStore = create<TokenState>((set) => ({
  accessToken: getStoredToken(),

  setToken: (token, remember = false) => {
    // Clear both first to avoid stale entries
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);

    if (remember) {
      localStorage.setItem(STORAGE_KEY, token);
    } else {
      sessionStorage.setItem(STORAGE_KEY, token);
    }
    set({ accessToken: token });
  },

  clearToken: () => {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    set({ accessToken: null });
  },
}));
