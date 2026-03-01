// TODO: Migrate cookie-stepper-form service from dzone-ui

/**
 * Creates a cookie entry for an existing record in a stepper form.
 */
export const createCookieForExistingRecord = (storageKey: string, data: Record<string, any>) => {
  try {
    sessionStorage.setItem(storageKey, JSON.stringify(data));
  } catch {
    // Silently handle storage errors
  }
};

/**
 * Gets form data from a cookie/session storage for a stepper form.
 */
export const getFormDataFromCookie = (storageKey: string): Record<string, any> => {
  try {
    const stored = sessionStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};
