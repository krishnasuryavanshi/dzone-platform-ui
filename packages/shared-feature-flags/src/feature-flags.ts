import { create } from 'zustand';

interface FeatureFlagsState {
  flags: Record<string, boolean>;
  setFlags: (flags: Record<string, boolean>) => void;
  isEnabled: (flag: string) => boolean;
}

export const useFeatureFlags = create<FeatureFlagsState>((set, get) => ({
  flags: {},
  setFlags: (flags) => set({ flags: { ...get().flags, ...flags } }),
  isEnabled: (flag) => get().flags[flag] ?? false,
}));

/**
 * Initialize feature flags from VITE_FF_* environment variables.
 * Call once at app startup.
 */
export function initFeatureFlags(): void {
  const envFlags: Record<string, boolean> = {};
  for (const [key, value] of Object.entries(import.meta.env)) {
    if (key.startsWith('VITE_FF_')) {
      envFlags[key.replace('VITE_FF_', '').toLowerCase()] = value === 'true';
    }
  }
  useFeatureFlags.getState().setFlags(envFlags);
}

/**
 * Optionally fetch remote flags from backend on app init.
 */
export async function fetchRemoteFlags(apiUrl: string): Promise<void> {
  try {
    const res = await fetch(`${apiUrl}/api/common-service/api/feature-flags`);
    if (res.ok) {
      const data = await res.json();
      useFeatureFlags.getState().setFlags(data);
    }
  } catch {
    // Silent — feature flags should never break the app
  }
}
