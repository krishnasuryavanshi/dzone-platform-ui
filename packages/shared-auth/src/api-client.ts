import axios, { AxiosHeaders, type AxiosResponse, type AxiosError } from 'axios';
import { useTokenStore, useAuthStore } from '@dzone/shared-store';

/**
 * Shared Axios instance for all API calls.
 * Attaches auth headers automatically and handles 401/403.
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ---------- Request interceptor ----------

apiClient.interceptors.request.use((config) => {
  const token = useTokenStore.getState().accessToken;
  const auth = useAuthStore.getState();

  if (!config.headers) {
    config.headers = new AxiosHeaders();
  }

  if (token) {
    config.headers.setAuthorization(`Bearer ${token}`);
  }

  if (auth.roles?.length) {
    config.headers.set(
      'roleIds',
      auth.roles.map((r) => r.id).join(','),
    );
  }

  if (auth.user) {
    config.headers.set('X-User-Id', auth.user.userId);
    config.headers.set('X-User-Email', auth.user.email);
  }

  return config;
});

// ---------- Response interceptor ----------

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const status = error.response?.status;

    const isAuthPage = window.location.pathname.startsWith('/login')
      || window.location.pathname.startsWith('/set-password')
      || window.location.pathname.startsWith('/forgot-password');

    if ((status === 401 || status === 403) && !isAuthPage) {
      useAuthStore.getState().clearAuth();
      useTokenStore.getState().clearToken();
      const to = `${window.location.pathname}${window.location.search}`;
      window.location.href = `/login?to=${encodeURIComponent(to)}`;
    }

    return Promise.reject(error);
  },
);
