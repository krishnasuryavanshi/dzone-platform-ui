import { Navigate, Outlet } from 'react-router';
import { usePermissionsStore } from '@dzone/shared-store';

interface PermissionGuardProps {
  required: string[];
  mode?: 'any' | 'all';
  fallback?: string;
}

/**
 * Route guard that checks permissions before rendering child routes.
 * Wrap routes in React Router config:
 *
 *   <Route element={<PermissionGuard required={['Campaign.VIEW']} />}>
 *     <Route path="campaigns" element={<Campaigns />} />
 *   </Route>
 */
export function PermissionGuard({
  required,
  mode = 'any',
  fallback = '/unauthorized',
}: PermissionGuardProps) {
  const { accesses } = usePermissionsStore();

  const hasPermission =
    mode === 'all'
      ? required.every((p) => accesses[p])
      : required.some((p) => accesses[p]);

  return hasPermission ? <Outlet /> : <Navigate to={fallback} replace />;
}
