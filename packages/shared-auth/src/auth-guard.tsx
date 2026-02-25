import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuthStore } from '@dzone/shared-store';

/**
 * Route guard that redirects unauthenticated users to login.
 * Preserves the intended destination in `?to=` query param.
 */
export function AuthGuard() {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    const to = `${location.pathname}${location.search}`;
    return <Navigate to={`/login?to=${encodeURIComponent(to)}`} replace />;
  }

  return <Outlet />;
}
