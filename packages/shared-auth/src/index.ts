// @dzone/shared-auth
// Shared authentication utilities and providers for the DZone platform.

export { apiClient } from './api-client';
export { login, logout } from './auth-service';
export { AuthGuard } from './auth-guard';
export { PermissionGuard } from './permission-guard';
export { usePermissionCheck, usePermissionChecks } from './use-permission-check';
export { useFieldPermission } from './use-field-permission';
export {
  routePermissions,
  shouldValidatePath,
  isAuthorizedForPath,
} from './route-permissions';
export {
  connectSSE,
  disconnectSSE,
  disconnectAllSSE,
  isSSEConnected,
  type SSEConnectionConfig,
} from './sse-service';
