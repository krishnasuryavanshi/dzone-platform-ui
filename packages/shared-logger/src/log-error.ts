/**
 * Standalone logError for quick error logging without a Logger instance.
 * Mirrors the old codebase's `logError` import pattern.
 */
export const logError = (data: unknown) => {
  if (import.meta.env?.DEV) {
    console.error(data);
  }
};
