# DZone UI — Migration to Vite + React Monorepo SPA

## Context

The current Next.js 14 + Refine application needs to be migrated to a modern Vite + React single-page application within a pnpm monorepo. The goals are: drop the Next.js/Refine framework coupling, call backend APIs directly (eliminating 169 BFF routes), upgrade to the latest dependency versions, add TanStack Query for data fetching, use route-based code splitting for performance, and use Zustand exclusively for all state management (no React Context API anywhere).

---

## Migration Workflow (Per Feature)

Every feature migration follows this autonomous process — no user intervention needed.

### Step 1: Trace Full Data Flow in Old Codebase

For each feature, read the COMPLETE request/response chain:

**Request flow:**
```
Browser Component → what it calls, what data it sends
  ↓
Frontend Service → nextBackendRequest({ resource, method, params, data })
  ↓
BackendResources enum → maps resource name to /api/ route path
  ↓
Next.js API Route handler → what headers injected, what transforms happen
  ↓
Route's internal service → which ApiHost, which ApiResources, what data mapping
  ↓
Actual backend microservice URL that gets called (e.g., API_URL/api/campaign-service/api/campaigns)
```

**Response flow:**
```
Backend microservice response (raw shape)
  ↓
API Route's service → any remapping, error normalization, data extraction
  ↓
API Route handler → response wrapping, status codes
  ↓
Frontend service → post-processing, error handling, notification
  ↓
Component → what state it sets, how it renders the data
```

### Step 2: Build New Direct Service

- Extract the **actual backend URL** from the API route's internal service
- Extract the **exact headers** (auth, roleIds, userId) from `back-end-manager.ts` interceptors
- Extract any **data transformation** that happened in the BFF layer
- Write the new service using `apiClient.get/post()` with the direct backend path
- Ensure the same request shape (params, body, headers) reaches the same backend endpoint

### Step 3: Build Component/Hook

- Replace `useEffect` + `useState` fetch pattern → TanStack Query `useQuery`/`useMutation`
- Replace React Context → Zustand store
- Replace Refine hooks (`useList`, `useOne`, etc.) → custom query hooks
- Keep the exact same UI behavior, components, and user experience

### Step 4: Verify Correctness

- Compare old vs new: API request shape (same URL, same headers, same body)
- Compare old vs new: response handling (same data transformation)
- Run `pnpm typecheck` after each feature
- Run `pnpm test:unit` if tests exist for the feature

### Agent Strategy

- **Explore agent**: traces old data flow, reads all files in the chain
- **General-purpose agent**: writes new code based on findings
- **Bash agent**: runs typecheck/build after each feature

---

## Target Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Build | Vite | 7.3 |
| Framework | React | 19.2 |
| Language | TypeScript | 5.9 |
| Routing | React Router | 7.13 |
| Data Fetching | TanStack Query | 5.90 |
| State Mgmt | Zustand + Immer | 5.0 |
| UI Library | Ant Design | 6.3 |
| Unit Testing | Vitest + RTL + MSW | 4.0 / 16.3 / 2.x |
| E2E Testing | Playwright | 1.51+ |
| Linting | ESLint (flat config) | 10.0 |
| Validation | Zod | 4.3 |
| i18n | i18next + react-i18next | 25.8 / 16.5 |
| Monorepo | pnpm + Turborepo | latest |
| Docs | Storybook | 8.x |
| Feature Flags | Custom + env-based | — |

---

## Monorepo Structure

```
dzone-platform/
├── turbo.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── eslint.config.mjs
├── .env.example
│
├── packages/
│   ├── shared-ui/          # Ant Design 6 wrappers, charts, table, form
│   ├── shared-lib/         # Hooks, utils, types, enums, constants
│   ├── shared-store/       # Global Zustand stores (auth, token, tenant, permissions)
│   ├── shared-auth/        # Auth service, API client, route guards, RBAC
│   ├── shared-i18n/        # i18next config + locale files
│   ├── shared-styles/      # CSS variables, global styles, Ant Design theme
│   ├── shared-logger/      # Centralized logging service
│   └── shared-feature-flags/ # Feature flag system
│
├── apps/
│   └── web/                         # Single Vite + React SPA
│       └── src/
│           ├── app.tsx              # Root: providers, ConfigProvider, RouterProvider
│           ├── router.tsx           # React Router config with lazy routes
│           ├── query-client.ts      # TanStack Query client
│           ├── layout/              # Shell: sider, header, content area
│           ├── auth/                # Login, forgot-password, set-password pages
│           └── modules/             # Feature modules (lazy-loaded per route)
│               ├── campaign-management/  # Campaigns, line-items, leads
│               ├── analytics/            # Reports, dashboards, external reports
│               ├── ums/                  # Users, roles
│               ├── integrations-hub/     # Integrations, templates
│               ├── dzent/               # AI chat
│               ├── lead-validation/     # Lead validation settings
│               ├── dashboard/           # Main reporting dashboard
│               ├── jobs/                # Background jobs
│               ├── admin/               # Organizations / system admin
│               ├── audience/            # Search DB + pixels
│               └── profile/             # User profile
│
└── docs/
    └── storybook/           # Storybook for shared-ui
```

### Route-Based Code Splitting

Each module is lazy-loaded via `React.lazy()` so only the active route's code is downloaded:

```ts
// apps/web/src/router.tsx
import { lazy } from 'react';

const CampaignManagement = lazy(() => import('./modules/campaign-management'));
const Analytics = lazy(() => import('./modules/analytics'));
const Ums = lazy(() => import('./modules/ums'));
// ... all modules

// Routes use <Suspense> with a loading fallback automatically
```

---

## 1. React 19 Patterns — Minimize useEffect

### Rule: Avoid useEffect for Data Fetching, Derived State, and Side Effects

React 19 provides built-in primitives that replace most `useEffect` patterns. **`useEffect` should only be used for truly external synchronization** (DOM APIs, third-party libraries, WebSocket listeners). Never for:
- Fetching data (use TanStack Query)
- Computing derived state (compute during render or use `useMemo`)
- Responding to user actions (use event handlers, `useActionState`, `useTransition`)

### React 19 Features to Adopt

#### `use()` Hook — Unwrap Promises & Zustand Stores

```tsx
import { use } from 'react';

// Read from a Zustand store (replaces useContext pattern)
// Since we use Zustand, `use()` is mainly useful for promise unwrapping

// Unwrap a promise in render (with Suspense boundary)
const UserProfile = ({ userPromise }: { userPromise: Promise<User> }) => {
  const user = use(userPromise); // suspends until resolved
  return <Text>{user.name}</Text>;
};
```

#### `useActionState` — Form Submissions Without useEffect

Replaces the `useState` + `useEffect` + `onSubmit` pattern for forms:

```tsx
import { useActionState } from 'react';
import { createCampaign } from '../services';

const CreateCampaignForm = () => {
  const [state, submitAction, isPending] = useActionState(
    async (_prevState: ActionState, formData: FormData) => {
      try {
        const payload = Object.fromEntries(formData);
        await createCampaign(payload);
        return { success: true, error: null };
      } catch (err) {
        return { success: false, error: 'Failed to create campaign' };
      }
    },
    { success: false, error: null },
  );

  return (
    <Form action={submitAction}>
      <FormItem name="name" label="Campaign Name">
        <Input />
      </FormItem>
      <Button type="primary" htmlType="submit" loading={isPending}>
        Create
      </Button>
      {state.error && <Text type="danger">{state.error}</Text>}
    </Form>
  );
};
```

#### `useOptimistic` — Instant UI Feedback

For actions where the UI should update immediately before server confirmation:

```tsx
import { useOptimistic } from 'react';

const CampaignStatus = ({ campaign }: { campaign: Campaign }) => {
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(campaign.status);

  const handleToggle = async () => {
    const newStatus = optimisticStatus === 'active' ? 'paused' : 'active';
    setOptimisticStatus(newStatus); // UI updates instantly
    await updateCampaignStatus(campaign.id, newStatus); // server call
  };

  return (
    <Switch checked={optimisticStatus === 'active'} onChange={handleToggle} />
  );
};
```

#### `useFormStatus` — Nested Form Loading States

```tsx
import { useFormStatus } from 'react-dom';

// Reusable submit button that knows if its parent form is submitting
const SubmitButton = ({ children }: { children: React.ReactNode }) => {
  const { pending } = useFormStatus();
  return (
    <Button type="primary" htmlType="submit" loading={pending}>
      {children}
    </Button>
  );
};
```

#### `useTransition` — Non-Blocking UI Updates

For heavy state transitions (filtering large tables, tab switching):

```tsx
import { useTransition } from 'react';

const CampaignFilters = () => {
  const [isPending, startTransition] = useTransition();
  const { setFilters } = useCampaignStore();

  const handleFilterChange = (value: string) => {
    startTransition(() => {
      setFilters({ search: value }); // won't block typing
    });
  };

  return (
    <Input.Search
      onChange={(e) => handleFilterChange(e.target.value)}
      loading={isPending}
    />
  );
};
```

#### `ref` as Prop — No More `forwardRef`

React 19 passes `ref` as a regular prop. Remove all `forwardRef` wrappers:

```tsx
// BEFORE (React 18)
const DzInput = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return <Input ref={ref} {...props} />;
});

// AFTER (React 19) — ref is just a prop
const DzInput = ({ ref, ...props }: InputProps & { ref?: React.Ref<HTMLInputElement> }) => {
  return <Input ref={ref} {...props} />;
};
```

### useEffect Migration Map

| Current Pattern | React 19 Replacement |
|---|---|
| `useEffect` + `fetch` for data loading | TanStack Query `useQuery` |
| `useEffect` to compute derived state | Compute during render / `useMemo` |
| `useEffect` + `setState` on form submit | `useActionState` |
| `useEffect` for optimistic updates | `useOptimistic` |
| `useEffect` to sync with URL params | React Router `useSearchParams` + event handlers |
| `useEffect` to listen to store changes | Zustand selectors (auto-reactive) |
| `useEffect` for debounced input | `useTransition` + event handler |
| `useEffect` + `setLoading` on actions | `useTransition` or `useMutation.isPending` |

### Acceptable useEffect Uses (Keep These)

- WebSocket/EventSource connections
- `window.addEventListener` for postMessage, resize, scroll
- Third-party library initialization (amCharts, etc.)
- `IntersectionObserver`, `MutationObserver`
- Cleanup timers/intervals

### Custom Hooks to Build (packages/shared-lib)

```ts
// packages/shared-lib/src/hooks/use-debounced-value.ts
// Replaces useEffect-based debounce patterns
import { useDeferredValue } from 'react';

export const useDebouncedValue = <T>(value: T): T => {
  return useDeferredValue(value);
};
```

```ts
// packages/shared-lib/src/hooks/use-document-title.ts
// React 19 supports <title> in component render, but for SPA route titles:
export const useDocumentTitle = (title: string) => {
  document.title = title ? `${title} | DZone` : 'DZone';
};
// Call in component body (not in useEffect) — it's a synchronous side effect during render
```

---

## 2. TanStack Query + Zustand Integration

TanStack Query replaces both Refine's data provider and the manual `useEffect` + `useState` fetch patterns.

### Principle: Server State vs UI State

| Concern | Tool | Why |
|---|---|---|
| **Server state** (API data, lists, details) | TanStack Query | Caching, refetching, stale handling, deduplication |
| **UI state** (filters, modals, selections, form drafts) | Zustand | Synchronous, no async overhead, cross-component sharing |
| **Derived state** (computed from server + UI) | Zustand selectors or compute in render | No useEffect |

### Pattern: Query + Store Working Together

```ts
// apps/web/src/modules/campaign-management/hooks/use-campaign-list.ts
import { useQuery } from '@tanstack/react-query';
import { useCampaignStore } from '../store';
import { fetchCampaigns } from '../services';

export const useCampaignList = () => {
  // UI state from Zustand (filters, page, sort)
  const { page, pageSize, filters, sortField, sortOrder } = useCampaignStore();

  // Server state from TanStack Query (driven by Zustand values)
  const query = useQuery({
    queryKey: ['campaigns', page, pageSize, filters, sortField, sortOrder],
    queryFn: ({ signal }) => fetchCampaigns({ page, pageSize, filters, sortField, sortOrder, signal }),
    placeholderData: keepPreviousData,
  });

  return query;
};

// Store: only UI concerns
// apps/web/src/modules/campaign-management/store.ts
export const useCampaignStore = create<CampaignUIState>()(
  immer((set) => ({
    page: 1,
    pageSize: 10,
    filters: {},
    sortField: 'createdAt',
    sortOrder: 'desc' as const,
    selectedRowKeys: [],
    setPage: (page) => set({ page }),
    setFilters: (filters) => set({ filters, page: 1 }), // reset to page 1 on filter change
    setSort: (field, order) => set({ sortField: field, sortOrder: order }),
    setSelectedRows: (keys) => set({ selectedRowKeys: keys }),
  })),
);
```

### Pattern: Mutation + Store Update

```ts
// Mutation invalidates query cache; store handles optimistic UI state
export const useUpdateCampaignStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateCampaignStatus,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['campaigns'] }); // refetch list
    },
  });
};
```

### When to Use Which

| Scenario | Use |
|---|---|
| Fetch list/detail from API | `useQuery` |
| Create/update/delete via API | `useMutation` + `invalidateQueries` |
| Table page, sort, filters | Zustand store |
| Modal open/close state | Zustand store |
| Selected rows/items | Zustand store |
| Form draft before submit | Zustand store |
| Cross-module shared data (auth, tenant) | Zustand store in `shared-store` |

### QueryClient Setup

```ts
// apps/web/src/query-client.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,   // 5 min
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

### Replacing Refine Hooks

| Refine Hook | TanStack Query Replacement |
|---|---|
| `useList` | `useQuery` with list queryFn |
| `useOne` | `useQuery` with getById queryFn |
| `useCreate` | `useMutation` |
| `useUpdate` | `useMutation` + `invalidateQueries` |
| `useDelete` | `useMutation` + `invalidateQueries` |
| `useCustom` | `useQuery` / `useMutation` directly |
| `useTable` (Refine+Antd) | Custom hook: `useQuery` + Ant Design Table pagination |

### Pagination Hook Pattern

```ts
// packages/shared-lib/src/hooks/use-paginated-query.ts
export const usePaginatedQuery = <T>(key: string, fetchFn: FetchFn<T>, initialPage = 1, pageSize = 10) => {
  const [page, setPage] = useState(initialPage);
  const query = useQuery({
    queryKey: [key, page, pageSize],
    queryFn: () => fetchFn(page, pageSize),
    placeholderData: keepPreviousData,
  });
  return { ...query, page, setPage, pageSize };
};
```

---

## 3. RBAC / ABAC Implementation

### Current System (Migrating From)

- Backend returns `modules[]` with `module.name` + `module.access[]` on login
- NextAuth JWT flattens into `permissions`: `{ "Campaign.VIEW": true, ... }`
- `should-validate-path.ts` has 42 route-to-permission mappings
- `usePermissionCheck` hook checks `Module.ACTION` or `Module.ACTION.fieldName`
- `HasPermission` wrapper component renders children conditionally
- `useRestrictedAccess` hook for role-based restrictions
- Field-level permissions fetched via POST `/permissions/permissions` with roleIds

### Permission Format

```
Module-level:  "Campaign.VIEW"        → accesses["Campaign.VIEW"] = true
Field-level:   "Campaign.VIEW.budget" → attributes["Campaign"]["budget"].includes("VIEW")
Custom action:  "Line Item.VIEW VALIDATION SETTINGS"
```

### New System — 5-Layer Permission Architecture

**Layer 1: Permissions Store** — Zustand store with module + field permissions

```ts
// packages/shared-store/src/permissions-store.ts
interface PermissionsState {
  accesses: Record<string, boolean>;              // {"Campaign.VIEW": true, ...}
  attributes: Record<string, Record<string, string[]>>; // {"Campaign": {"budget": ["VIEW", "EDIT"]}}
  modules: ModuleAccess[];                        // Raw module access list from backend

  setAccesses: (perms: Record<string, boolean>) => void;
  setAttributes: (fieldData: FieldPermission[]) => void;
  setModules: (modules: ModuleAccess[]) => void;
  clearPermissions: () => void;
}
```

**Layer 2: Sidebar/Menu Filtering** — only show menu items user can access

```ts
// packages/shared-auth/src/use-allowed-menu-items.ts
import { usePermissionsStore } from '@dzone/shared-store';

interface MenuItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  permissions?: string[];  // Required permissions (ANY match = visible)
  children?: MenuItem[];
}

export const useAllowedMenuItems = (menuConfig: MenuItem[]): MenuItem[] => {
  const { accesses } = usePermissionsStore();

  return menuConfig
    .filter((item) => {
      if (!item.permissions?.length) return true; // no restriction
      return item.permissions.some((perm) => accesses[perm]);
    })
    .map((item) => ({
      ...item,
      children: item.children ? useAllowedMenuItems(item.children) : undefined,
    }))
    .filter((item) => !item.children || item.children.length > 0); // hide empty parents
};
```

```ts
// apps/web/src/layout/sidebar.tsx — menu config with permissions
const menuConfig: MenuItem[] = [
  { key: 'dashboard', label: 'Dashboard', path: '/dashboard',
    permissions: ['Dashboard.VIEW'] },
  { key: 'campaigns', label: 'Campaign Management', path: '/campaign-management',
    permissions: ['Campaign.VIEW', 'Line Item.VIEW', 'Lead.VIEW'],
    children: [
      { key: 'campaigns-list', label: 'Campaigns', path: '/campaign-management/campaigns',
        permissions: ['Campaign.VIEW'] },
      { key: 'leads', label: 'Leads', path: '/campaign-management/leads',
        permissions: ['Lead.VIEW'] },
    ],
  },
  { key: 'ums', label: 'User Management', path: '/ums',
    permissions: ['Users.VIEW', 'Roles and Permissions.VIEW'] },
  { key: 'analytics', label: 'Analytics', path: '/analytics',
    permissions: ['Analytics.VIEW'] },
  // ... all modules
];

const Sidebar = () => {
  const allowedItems = useAllowedMenuItems(menuConfig);
  return <Menu items={allowedItems} />;
};
```

**Layer 3: Route Guards** — page-level access control (replaces Next.js middleware)

```ts
// packages/shared-auth/src/permission-guard.tsx
import { Navigate, Outlet } from 'react-router';
import { usePermissionsStore } from '@dzone/shared-store';

interface Props {
  required: string[];
  mode?: 'any' | 'all';
  redirectTo?: string;
}

export const PermissionGuard = ({ required, mode = 'any', redirectTo = '/unauthorized' }: Props) => {
  const { accesses } = usePermissionsStore();
  const has = mode === 'all'
    ? required.every((p) => accesses[p])
    : required.some((p) => accesses[p]);
  return has ? <Outlet /> : <Navigate to={redirectTo} replace />;
};
```

```ts
// apps/web/src/router.tsx — full route-to-permission mapping
const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  { path: '/unauthorized', element: <Unauthorized /> },
  {
    element: <AuthenticatedLayout />,  // requires login
    children: [
      // Each route wrapped with PermissionGuard
      { element: <PermissionGuard required={['Dashboard.VIEW']} />,
        children: [{ path: '/dashboard', lazy: () => import('./modules/dashboard') }] },
      { element: <PermissionGuard required={['Campaign.VIEW']} />,
        children: [
          { path: '/campaign-management/campaigns', lazy: () => import('./modules/campaign-management/campaigns') },
          { element: <PermissionGuard required={['Campaign.CREATE']} />,
            children: [{ path: '/campaign-management/campaigns/create', lazy: () => import('./modules/campaign-management/create') }] },
          { element: <PermissionGuard required={['Campaign.EDIT']} />,
            children: [{ path: '/campaign-management/campaigns/:id/edit', lazy: () => import('./modules/campaign-management/edit') }] },
        ] },
      { element: <PermissionGuard required={['Users.VIEW', 'Roles and Permissions.VIEW']} />,
        children: [{ path: '/ums/*', lazy: () => import('./modules/ums') }] },
      { element: <PermissionGuard required={['Analytics.VIEW']} />,
        children: [{ path: '/analytics/*', lazy: () => import('./modules/analytics') }] },
      // ... all module routes
    ],
  },
]);
```

**Layer 4: Component-Level** — `usePermissionCheck` hook + `HasPermission` wrapper

```ts
// packages/shared-auth/src/use-permission-check.ts
export const usePermissionCheck = (
  permission: string | string[],
  checkAll = false,
): boolean => {
  const { accesses, attributes } = usePermissionsStore();
  const perms = Array.isArray(permission) ? permission : [permission];

  const check = (perm: string): boolean => {
    const parts = perm.split('.');
    const [moduleName = '', action = '', field = ''] = parts;

    if (field) {
      // Field-level: attributes["Campaign"]["budget"].includes("VIEW")
      return !!attributes[moduleName]?.[field]?.includes(action);
    }
    // Module-level: accesses["Campaign.VIEW"]
    return !!accesses[`${moduleName}.${action}`];
  };

  return checkAll ? perms.every(check) : perms.some(check);
};
```

```tsx
// packages/shared-auth/src/has-permission.tsx — wrapper component
interface HasPermissionProps {
  permissions: string | string[];
  all?: boolean;           // require ALL permissions (default: ANY)
  fallback?: React.ReactNode;  // show instead when denied (default: null)
  children: React.ReactNode;
}

export const HasPermission = ({ permissions, all = false, fallback = null, children }: HasPermissionProps) => {
  const allowed = usePermissionCheck(permissions, all);
  return allowed ? <>{children}</> : <>{fallback}</>;
};

// Usage in page sections:
// Hide "Create Campaign" button if no Campaign.CREATE permission
<HasPermission permissions="Campaign.CREATE">
  <Button type="primary" onClick={goToCreate}>New Campaign</Button>
</HasPermission>

// Show a disabled state instead of hiding
<HasPermission permissions="Campaign.EDIT" fallback={<Button disabled>Edit</Button>}>
  <Button onClick={goToEdit}>Edit</Button>
</HasPermission>

// Hide entire table columns
const columns = [
  { title: 'Name', dataIndex: 'name' },
  canViewBudget && { title: 'Budget', dataIndex: 'budget' },  // field-level
  canEdit && { title: 'Actions', render: (_, record) => <EditButton id={record.id} /> },
].filter(Boolean);
```

**Layer 5: Field-Level (ABAC)** — attribute-based checks for individual fields

```ts
// packages/shared-auth/src/use-field-permission.ts
export const useFieldPermission = (moduleName: string, fieldName: string, action = 'VIEW'): boolean => {
  const { attributes } = usePermissionsStore();
  return !!attributes[moduleName]?.[fieldName]?.includes(action);
};

// Usage: hide specific form fields or table columns
const canViewBudget = useFieldPermission('Campaign', 'budget', 'VIEW');
const canEditBudget = useFieldPermission('Campaign', 'budget', 'EDIT');
```

### Permission Initialization Flow

```ts
// apps/web/src/auth/use-init-permissions.ts
// Called once after login — populates the permissions store

export const useInitPermissions = () => {
  const { user, roles } = useAuthStore();

  // Step 1: Flatten module access into accesses map (from login response)
  useEffect(() => {
    if (!user?.modules) return;
    const accesses: Record<string, boolean> = {};
    user.modules.forEach((mod) => {
      const accessList = Array.isArray(mod.module.access) ? mod.module.access : [mod.module.access].filter(Boolean);
      accessList.forEach((action) => { accesses[`${mod.module.name}.${action}`] = true; });
    });
    usePermissionsStore.getState().setAccesses(accesses);
    usePermissionsStore.getState().setModules(user.modules);
  }, [user?.modules]);

  // Step 2: Fetch field-level permissions from RBAC service
  const { data: fieldPerms } = useQuery({
    queryKey: ['field-permissions', roles],
    queryFn: () => apiClient.post('/api/rbac-service/api/permissions/permissions', { roleIds: roles.map(r => r.id) }),
    enabled: !!roles?.length,
  });

  useEffect(() => {
    if (fieldPerms?.data) {
      usePermissionsStore.getState().setAttributes(fieldPerms.data);
    }
  }, [fieldPerms]);
};
```

### Role-Based Restricted Access

For UI elements restricted by role (not permission), migrated from current `useRestrictedAccess`:

```ts
// packages/shared-auth/src/use-restricted-access.ts
export const useRestrictedAccess = (restrictedRoles: string[]): boolean => {
  const { roles } = useAuthStore();
  const userRoleNames = roles.map((r) => r.name);
  return restrictedRoles.some((role) => userRoleNames.includes(role));
};

// Usage: hide executive dashboard for certain roles
const isRestricted = useRestrictedAccess(['Supplier', 'Agency']);
```

---

## 4. Storybook for shared-ui

### Setup

```
docs/storybook/
├── .storybook/
│   ├── main.ts          # Vite-based Storybook config
│   ├── preview.tsx       # Global decorators (AntD ConfigProvider, i18n, theme)
│   └── manager.ts        # Sidebar config
├── package.json
└── src/
    └── (stories auto-discovered from packages/shared-ui)
```

### Config

```ts
// docs/storybook/.storybook/main.ts
export default {
  stories: ['../../../packages/shared-ui/src/**/*.stories.@(ts|tsx)'],
  framework: '@storybook/react-vite',
  addons: ['@storybook/addon-essentials', '@storybook/addon-a11y', '@storybook/addon-themes'],
};
```

### Story Pattern

```ts
// packages/shared-ui/src/components/button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { DzButton } from './button';

const meta: Meta<typeof DzButton> = {
  title: 'Components/Button',
  component: DzButton,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof DzButton>;
export const Primary: Story = { args: { type: 'primary', children: 'Click me' } };
export const Danger: Story = { args: { type: 'primary', danger: true, children: 'Delete' } };
```

### Storybook Addons

- `@storybook/addon-essentials` — docs, controls, actions, viewport
- `@storybook/addon-a11y` — accessibility checks
- `@storybook/addon-themes` — light/dark theme toggle

### Turborepo Script

```json
// turbo.json
{ "storybook": { "cache": false, "persistent": true } }
```
```bash
pnpm turbo storybook --filter=@dzone/storybook
```

---

## 5. Theming — Light & Dark Mode

### Ant Design 6 Token-Based Theming

```ts
// packages/shared-styles/src/antd-theme.ts
import { theme, type ThemeConfig } from 'antd';

export const lightTheme: ThemeConfig = {
  token: {
    colorPrimary: '#235aed',
    colorError: '#ff4d4f',
    colorSuccess: '#00a200',
    colorInfo: '#1890ff',
    colorBgContainer: '#ffffff',
    colorBgLayout: '#f8f9fa',
    colorText: '#262626',
    colorTextSecondary: '#595959',
    colorBorder: '#d9d9d9',
    borderRadius: 6,
    fontSize: 14,
    fontFamily: 'inherit',
  },
  components: {
    Button: { controlHeight: 28 },
    Input: { controlHeight: 40 },
    // ... map all current --dzone-* variables
  },
};

export const darkTheme: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: '#4d7ef7',
    colorBgContainer: '#1f1f1f',
    colorBgLayout: '#141414',
    colorText: '#e8e8e8',
    colorTextSecondary: '#8c8c8c',
    colorBorder: '#434343',
    // ... dark variants
  },
};
```

### Theme Store

```ts
// packages/shared-store/src/theme-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  mode: 'light' | 'dark';
  toggle: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'light',
      toggle: () => set((s) => ({ mode: s.mode === 'light' ? 'dark' : 'light' })),
    }),
    { name: 'dzone-theme' },
  ),
);
```

### App Root Integration

```tsx
// apps/web/src/app.tsx
import { ConfigProvider, App as AntdApp } from 'antd';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router';
import { useThemeStore } from '@dzone/shared-store';
import { lightTheme, darkTheme } from '@dzone/shared-styles';
import { queryClient } from './query-client';
import { router } from './router';

export default function App() {
  const { mode } = useThemeStore();
  return (
    <ConfigProvider theme={mode === 'light' ? lightTheme : darkTheme}>
      <AntdApp>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </AntdApp>
    </ConfigProvider>
  );
}
```

### CSS Variables Sync

CSS variables in `shared-styles/variables.css` remain for non-AntD elements. The host app sets `data-theme="light|dark"` on `<html>` and CSS handles it:

```css
:root { --dzone-color-bg-container: #ffffff; }
[data-theme="dark"] { --dzone-color-bg-container: #1f1f1f; }
```

---

## 6. Charts & Dashboards

### Current Chart Components (migrate to shared-ui)

| Component | Library | Location |
|---|---|---|
| DzBarChart | Recharts | `src/components/charts/bar/` |
| DzLineChart | Recharts | `src/components/charts/line/` |
| DzPieChart | Recharts | `src/components/charts/pie/` |
| DzFunnelChart | Recharts | `src/components/charts/funnel/` |
| DzLegend | Custom | `src/components/charts/dz-legend.tsx` |
| DzTooltip | Custom | `src/components/charts/dz-tooltip.tsx` |
| AmCharts (map, sankey, treemap, etc.) | amCharts 5 | `src/components/amcharts/` |

### Migration Plan

1. All chart components move to `packages/shared-ui/src/charts/`
2. Keep Recharts 2.14+ and amCharts 5 as peer dependencies
3. Charts must support dark mode via theme tokens (Recharts uses `stroke`, `fill` props — read from CSS variables or Zustand theme store)
4. Dashboard module (`modules/dashboard`) consumes chart components from `@dzone/shared-ui`
5. Filter contexts in dashboard (`src/app/(dashboard)/dashboard/contexts/`) convert to Zustand stores

### Dark Mode for Charts

```ts
// packages/shared-ui/src/charts/use-chart-theme.ts
import { useThemeStore } from '@dzone/shared-store';

export const useChartTheme = () => {
  const { mode } = useThemeStore();
  return {
    textColor: mode === 'dark' ? '#e8e8e8' : '#262626',
    gridColor: mode === 'dark' ? '#434343' : '#e8e8e8',
    bgColor: mode === 'dark' ? '#1f1f1f' : '#ffffff',
  };
};
```

---

## 7. Auth Mechanism & Environment Variables

### Auth Flow (Replacing NextAuth)

**Login:**
1. User submits credentials on `/login`
2. `authService.login()` → POST `VITE_API_URL/api/rbac-service/api/auth/login`
3. Backend returns `{ user, accessToken, roles, modules, tenantCode, type, ... }`
4. `useAuthStore.setAuth(data)` stores user + permissions (persisted to localStorage, except token)
5. `useTokenStore.setToken(data.accessToken)` stores token in memory only
6. Redirect to requested page

**Every API Call:**
- `apiClient` (axios instance in `shared-auth`) interceptor attaches `Authorization: Bearer <token>`, `roleIds`, `X-User-Id`, `X-User-Email` headers automatically

**401/403 Response:**
- Interceptor clears auth stores, redirects to `/login?to=<currentPath>`

**Token Refresh:**
- Implement a refresh endpoint if backend supports it, or re-login on expiry
- Token expiry check via decoded JWT `exp` claim

### Shared API Client — Axios with Full Logging

The API client uses axios interceptors for 3 concerns: **auth headers**, **request/response logging**, and **error handling**.

```ts
// packages/shared-auth/src/api-client.ts
import axios, { type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios';
import { useTokenStore, useAuthStore } from '@dzone/shared-store';
import { createLogger } from '@dzone/shared-logger';

const logger = createLogger('api-client');

// Unique request ID for correlating request → response logs
let requestCounter = 0;
const generateRequestId = () => `req_${++requestCounter}_${Date.now()}`;

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30_000, // 30s default timeout
});

// ─── Request Interceptor: Auth Headers + Logging ───

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Attach auth headers
    const token = useTokenStore.getState().accessToken;
    const auth = useAuthStore.getState();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    if (auth.roles?.length) config.headers['roleIds'] = auth.roles.map(r => r.id).join(',');
    if (auth.user) {
      config.headers['X-User-Id'] = auth.user.userId;
      config.headers['X-User-Email'] = auth.user.email;
    }

    // Tag request with ID and start time for duration tracking
    const requestId = generateRequestId();
    config.headers['X-Request-Id'] = requestId;
    (config as any).__meta = { requestId, startTime: performance.now() };

    // Log outgoing request
    logger.info(`→ ${config.method?.toUpperCase()} ${config.url}`, {
      requestId,
      method: config.method?.toUpperCase(),
      url: config.url,
      params: config.params,
      // Log body shape (keys only) — never log sensitive field values
      bodyKeys: config.data ? Object.keys(config.data) : undefined,
    });

    return config;
  },
  (error: AxiosError) => {
    logger.error('Request setup failed', {
      message: error.message,
      url: error.config?.url,
    });
    return Promise.reject(error);
  },
);

// ─── Response Interceptor: Logging + Error Handling ───

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const meta = (response.config as any).__meta;
    const duration = meta ? Math.round(performance.now() - meta.startTime) : null;

    // Log successful response
    logger.info(`← ${response.status} ${response.config.url}`, {
      requestId: meta?.requestId,
      status: response.status,
      url: response.config.url,
      duration: duration ? `${duration}ms` : undefined,
      dataSize: JSON.stringify(response.data)?.length,
    });

    return response;
  },
  (error: AxiosError) => {
    const meta = (error.config as any)?.__meta;
    const duration = meta ? Math.round(performance.now() - meta.startTime) : null;
    const status = error.response?.status;
    const url = error.config?.url;

    // Log error with full details
    logger.error(`← ${status || 'NETWORK_ERROR'} ${url}`, {
      requestId: meta?.requestId,
      status,
      url,
      method: error.config?.method?.toUpperCase(),
      duration: duration ? `${duration}ms` : undefined,
      errorMessage: error.message,
      responseData: error.response?.data,
      code: error.code, // ECONNABORTED (timeout), ERR_NETWORK, etc.
    });

    // Handle auth errors — redirect to login
    if (status === 401 || status === 403) {
      useAuthStore.getState().clearAuth();
      useTokenStore.getState().clearToken();
      window.location.href = `/login?to=${encodeURIComponent(window.location.pathname)}`;
    }

    return Promise.reject(error);
  },
);
```

### Axios Best Practices

| Practice | Implementation |
|---|---|
| **Request IDs** | Every request tagged with `X-Request-Id` for log correlation |
| **Duration tracking** | `performance.now()` diff between request and response interceptors |
| **Body logging** | Log only keys (`Object.keys(data)`) — never log passwords, tokens, PII |
| **Error details** | Log status, URL, method, duration, error code, response body |
| **Timeout** | 30s default, override per-request: `apiClient.get(url, { timeout: 60_000 })` |
| **Cancellation** | Use `AbortController` with TanStack Query's `signal` for cancelled navigations |

### Cancellation Pattern with TanStack Query

```ts
// TanStack Query automatically passes AbortSignal — forward it to axios
export const fetchCampaigns = async (page: number, size: number, signal?: AbortSignal) => {
  const { data } = await apiClient.get('/api/campaign-service/api/campaigns', {
    params: { page, size },
    signal, // axios respects AbortSignal
  });
  return data;
};

// In query hook — signal is auto-provided
export const useCampaigns = (page: number, size: number) =>
  useQuery({
    queryKey: ['campaigns', page, size],
    queryFn: ({ signal }) => fetchCampaigns(page, size, signal),
  });
```

### Environment Variables

All `NEXT_PUBLIC_*` and server-only env vars replaced with `VITE_*` prefix:

| Current | New | Scope |
|---|---|---|
| `API_URL` | `VITE_API_URL` | Build-time |
| `NEXT_PUBLIC_APP_ENV` | `VITE_APP_ENV` | Build-time |
| `NEXT_PUBLIC_SECRET` | `VITE_CRYPTO_KEY` | Build-time |
| `NEXTAUTH_SECRET` | _(removed — no NextAuth)_ | — |
| `GA_TRACKING_ID` | `VITE_GA_TRACKING_ID` | Build-time |
| `CLARITY_TRACKING_ID` | `VITE_CLARITY_TRACKING_ID` | Build-time |

**Server-side secrets** (MADTECH_EMBED_*, ELASTIC_APM_*, LOGGER_URL):
- These CANNOT live in a Vite SPA
- Create dedicated backend endpoints to handle operations requiring secrets
- e.g., embed token generation stays server-side via the existing backend analytics service

---

## 8. Logger System

### Package: `packages/shared-logger/`

Migrates current `/src/services/logger/` into a standalone package.

```ts
// packages/shared-logger/src/index.ts
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  app: string;       // which module
  userId?: string;
  metadata?: Record<string, unknown>;
}

const LOG_ENDPOINT = import.meta.env.VITE_LOGGER_URL;

class Logger {
  private app: string;
  private buffer: LogEntry[] = [];
  private flushInterval: number;

  constructor(app: string) {
    this.app = app;
    this.flushInterval = window.setInterval(() => this.flush(), 10_000);
  }

  private enqueue(level: LogLevel, message: string, metadata?: Record<string, unknown>) {
    const { user } = useAuthStore.getState();
    this.buffer.push({
      level, message, timestamp: new Date().toISOString(),
      app: this.app, userId: user?.userId, metadata,
    });
    if (this.buffer.length >= 20) this.flush();
  }

  private async flush() {
    if (!this.buffer.length || !LOG_ENDPOINT) return;
    const batch = [...this.buffer];
    this.buffer = [];
    try {
      await fetch(LOG_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(batch),
      });
    } catch {
      // silent fail — logging should never break the app
    }
  }

  debug = (msg: string, meta?: Record<string, unknown>) => this.enqueue('debug', msg, meta);
  info = (msg: string, meta?: Record<string, unknown>) => this.enqueue('info', msg, meta);
  warn = (msg: string, meta?: Record<string, unknown>) => this.enqueue('warn', msg, meta);
  error = (msg: string, meta?: Record<string, unknown>) => this.enqueue('error', msg, meta);

  // Also log to console in development
  logError = (error: unknown) => {
    const msg = error instanceof Error ? error.message : String(error);
    if (import.meta.env.DEV) console.error(error);
    this.enqueue('error', msg);
  };

  destroy() { clearInterval(this.flushInterval); this.flush(); }
}

export const createLogger = (app: string) => new Logger(app);
```

### Usage in Each Module

```ts
// apps/web/src/modules/campaign-management/logger.ts
import { createLogger } from '@dzone/shared-logger';
export const logger = createLogger('campaign-management');
```

---

## 9. Feature Flagging

### Package: `packages/shared-feature-flags/`

A lightweight system using env vars + remote config.

```ts
// packages/shared-feature-flags/src/index.ts
import { create } from 'zustand';

interface FeatureFlagsState {
  flags: Record<string, boolean>;
  setFlags: (flags: Record<string, boolean>) => void;
  isEnabled: (flag: string) => boolean;
}

export const useFeatureFlags = create<FeatureFlagsState>((set, get) => ({
  flags: {},
  setFlags: (flags) => set({ flags }),
  isEnabled: (flag) => get().flags[flag] ?? false,
}));

// Initialize from env vars (build-time defaults)
export const initFeatureFlags = () => {
  const envFlags: Record<string, boolean> = {};
  // All VITE_FF_* env vars become flags
  for (const [key, value] of Object.entries(import.meta.env)) {
    if (key.startsWith('VITE_FF_')) {
      envFlags[key.replace('VITE_FF_', '').toLowerCase()] = value === 'true';
    }
  }
  useFeatureFlags.getState().setFlags(envFlags);
};

// Optional: fetch remote flags from backend on app init
export const fetchRemoteFlags = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/common-service/api/feature-flags`);
    const data = await res.json();
    useFeatureFlags.getState().setFlags({
      ...useFeatureFlags.getState().flags,
      ...data,
    });
  } catch { /* silent */ }
};
```

### Usage

```tsx
import { useFeatureFlags } from '@dzone/shared-feature-flags';

const MyComponent = () => {
  const { isEnabled } = useFeatureFlags();
  return isEnabled('new_dashboard') ? <NewDashboard /> : <LegacyDashboard />;
};
```

### Current Flags to Migrate

| Current Env Var | New Flag |
|---|---|
| `NEXT_PUBLIC_USE_DZ_HTTP` | `VITE_FF_USE_DZ_HTTP` |
| `NEXT_PUBLIC_LOGOUT_ON_403` | `VITE_FF_LOGOUT_ON_403` |

---

## 10. Stores & Data Persistence

### State Management Rule: Zustand Only — No React Context

All state management uses Zustand stores exclusively. **React Context API (`createContext`, `useContext`, Context Providers) must NOT be used anywhere** — not even for small, localized state. This includes:

- All current React Contexts (e.g., campaign context, dashboard filter contexts) → convert to Zustand stores
- Theme, auth, tenant, permissions → Zustand stores in `shared-store`
- Module-level transient state → local Zustand stores within each module
- Even single-component shared state → use a small Zustand store instead of Context

### Global Stores (in `shared-store`)

| Store | Persisted? | Storage | What |
|---|---|---|---|
| `auth-store` | Yes (partial) | localStorage | User, roles, modules, permissions. **Token NOT persisted** (memory only) |
| `token-store` | No | Memory | Access token — cleared on tab close for security |
| `permissions-store` | Yes | localStorage | Flattened permission map `{ "Campaign.VIEW": true }` |
| `tenant-store` | Yes | localStorage | Selected tenant, tenant list |
| `theme-store` | Yes | localStorage | Light/dark mode preference |
| `feature-flags` | No | Memory | Feature flags (re-fetched on app load) |

### Module-Level Stores (in each module — NOT persisted)

These are transient UI state, cleared when navigating away:

| Module | Stores |
|---|---|
| campaign-management | campaign-context (convert from React Context to Zustand) |
| ums | 7 role stores (dependancy, edit, modules, old-selected, permissions, selected-actions, selected-permissions) |
| dzent | dzent-store (chat history, active conversation) |
| lead-validation | validation-settings-store |
| jobs | jobs-store |
| integrations-hub | template-store |
| analytics | analytics-store |
| audience | segmentation-store |

### Persistence Pattern — User-Scoped Keys

All persisted data MUST be namespaced by `userId` so different users on the same browser never read each other's cached state. On logout, only that user's keys are cleared.

```ts
// packages/shared-store/src/user-storage.ts
import { StateStorage } from 'zustand/middleware';

// Creates a storage adapter that prefixes keys with userId
export const createUserStorage = (userId: string): StateStorage => ({
  getItem: (name) => localStorage.getItem(`dzone:${userId}:${name}`),
  setItem: (name, value) => localStorage.setItem(`dzone:${userId}:${name}`, value),
  removeItem: (name) => localStorage.removeItem(`dzone:${userId}:${name}`),
});

// Clear all persisted data for a specific user on logout
export const clearUserStorage = (userId: string) => {
  const keys = Object.keys(localStorage).filter(k => k.startsWith(`dzone:${userId}:`));
  keys.forEach(k => localStorage.removeItem(k));
};
```

```ts
// Usage in stores — auth-store bootstraps first (no user-scoping needed for auth itself)
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({ /* ... */ }),
    {
      name: 'dzone-auth',  // global key — holds current user identity
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user, roles: state.roles, permissions: state.permissions,
        tenantCode: state.tenantCode, moduleAccessList: state.moduleAccessList,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

// All OTHER stores use user-scoped storage
// After login, init stores with: initUserStores(userId)
export const initUserStores = (userId: string) => {
  const storage = createUserStorage(userId);
  // Re-hydrate permissions, tenant, theme stores with user-scoped keys
  usePermissionsStore.persist.setOptions({ storage: createJSONStorage(() => storage) });
  usePermissionsStore.persist.rehydrate();
  useTenantStore.persist.setOptions({ storage: createJSONStorage(() => storage) });
  useTenantStore.persist.rehydrate();
  useThemeStore.persist.setOptions({ storage: createJSONStorage(() => storage) });
  useThemeStore.persist.rehydrate();
};
```

**localStorage key format:** `dzone:<userId>:<storeName>`
Example: `dzone:usr_abc123:permissions`, `dzone:usr_abc123:tenant`, `dzone:usr_abc123:theme`

On logout: `clearUserStorage(userId)` removes all that user's persisted data.
```

### TanStack Query Cache Persistence (Optional)

```ts
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

const persister = createSyncStoragePersister({ storage: window.sessionStorage });
persistQueryClient({ queryClient, persister, maxAge: 1000 * 60 * 15 }); // 15 min
```

---

## 11. API Layer Migration (Removing BFF)

### Current: 3 layers

Frontend service → `nextBackendRequest()` → Next.js API route → `apiRequest()` → Backend microservice

### New: 2 layers

Frontend service → `apiClient` (with interceptors) → Backend microservice

### Service Rewrite Pattern

Each of the 169 BFF routes maps to a direct backend call. The `BackendResources` enum maps to a Next.js API route, and each route's internal service reveals the actual backend `ApiHost` + `ApiResources` path.

**Example — Campaigns:**
```ts
// BEFORE (2 files involved):
// Frontend: nextBackendRequest({ resource: BackendResources.Campaigns })
//   → hits /api/campaign-management/campaigns
// BFF route service: apiRequest({ apiHost: ApiHost.CampaignService, resource: ApiResources.Campaigns })
//   → hits API_URL/api/campaign-service/api/campaigns

// AFTER (1 file):
import { apiClient } from '@dzone/shared-auth';

export const fetchCampaigns = async (page: number, size: number) => {
  const { data } = await apiClient.get('/api/campaign-service/api/campaigns', {
    params: { page, size },
  });
  return data;
};
```

### Backend Service Base Paths

All services route through `VITE_API_URL` as gateway:

| Service | Path |
|---|---|
| Campaign | `/api/campaign-service/api` |
| RBAC | `/api/rbac-service/api` |
| File | `/api/file-service/api` |
| Reporting | `/api/reporting-service/api` |
| Lead Orchestration | `/api/lead-orchestration-service/api` |
| Campaign Delivery | `/api/campaign-delivery-service/api` |
| Organization | `/api/organization-service/api` |
| AI Copilot | `/api/ai-copilot/api` |
| Job Monitoring | `/api/job-monitoring/api` |
| Audience | `/api/audience-service/api` |
| Analytics | `/api/analytics-service/api` |
| Common | `/api/common-service/api` |
| Platform | `/api/platform-service/api` |
| Transformation | `/api/transformation-service/api` |

---

## 12. Testing Strategy

### Unit Testing — Vitest + RTL

| Current | New |
|---|---|
| Jest 29 | Vitest 4.0 |
| `jest.fn()` | `vi.fn()` |
| `jest.mock()` | `vi.mock()` |
| nock | msw (Mock Service Worker) 2.x |
| RTL 14 | RTL 16.3 |
| `next/jest` config | Vitest native config |

### Config per Package

```ts
// vitest.config.ts (each package + apps/web)
import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test-setup.ts',
  },
});
```

### Workspace Config (Root)

```ts
// vitest.workspace.ts
import { defineWorkspace } from 'vitest/config';
export default defineWorkspace(['packages/*/vitest.config.ts', 'apps/web/vitest.config.ts']);
```

### Unit Test Coverage Targets

| Scope | Target |
|---|---|
| Shared packages (`shared-lib`, `shared-auth`, `shared-store`) | 80%+ |
| UI components (`shared-ui`) | 70%+ (component render + interaction) |
| Module hooks & services | 80%+ |
| Module UI components | 60%+ |

### E2E Testing — Playwright

| Layer | Technology | Version |
|---|---|---|
| E2E Framework | Playwright | 1.51+ |
| Assertions | Playwright built-in `expect` | — |
| Reporting | Playwright HTML reporter | — |

### Playwright Setup

```
apps/web/
├── e2e/
│   ├── playwright.config.ts
│   ├── fixtures/              # Custom fixtures (authenticated page, etc.)
│   ├── auth/
│   │   ├── login.spec.ts
│   │   └── forgot-password.spec.ts
│   ├── campaign-management/
│   │   ├── campaigns-list.spec.ts
│   │   └── create-campaign.spec.ts
│   ├── ums/
│   │   ├── users-list.spec.ts
│   │   └── roles.spec.ts
│   └── ...                    # One folder per module
```

### Playwright Config

```ts
// apps/web/e2e/playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  timeout: 30_000,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  ],
  webServer: process.env.E2E_BASE_URL ? undefined : {
    command: 'pnpm --filter @dzone/web dev',
    port: 5173,
    reuseExistingServer: true,
  },
});
```

### Authenticated Test Fixture

```ts
// apps/web/e2e/fixtures/authenticated.ts
import { test as base, expect } from '@playwright/test';

export const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    // Login once, reuse session
    await page.goto('/login');
    await page.fill('[name="email"]', process.env.E2E_USER_EMAIL!);
    await page.fill('[name="password"]', process.env.E2E_USER_PASSWORD!);
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
    await use(page);
  },
});

export { expect };
```

### Toggle: Enable/Disable Tests

Both unit tests and E2E tests can be disabled via environment variables and Turborepo config, giving full control in local dev and CI.

**Environment Variables:**

```bash
# .env (or CI pipeline vars)
SKIP_UNIT_TESTS=true       # Disable unit tests
SKIP_E2E_TESTS=true        # Disable E2E tests
```

**Turborepo Config:**

```json
// turbo.json
{
  "tasks": {
    "test:unit": {
      "env": ["SKIP_UNIT_TESTS"],
      "inputs": ["src/**", "vitest.config.ts"],
      "outputs": ["coverage/**"]
    },
    "test:e2e": {
      "env": ["SKIP_E2E_TESTS", "E2E_BASE_URL", "E2E_USER_EMAIL", "E2E_USER_PASSWORD"],
      "dependsOn": ["build"],
      "cache": false
    }
  }
}
```

**Package Scripts (apps/web/package.json):**

```json
{
  "scripts": {
    "test:unit": "node -e \"if(process.env.SKIP_UNIT_TESTS==='true'){console.log('Unit tests skipped');process.exit(0)}\" || vitest run",
    "test:unit:watch": "vitest",
    "test:unit:coverage": "vitest run --coverage",
    "test:e2e": "node -e \"if(process.env.SKIP_E2E_TESTS==='true'){console.log('E2E tests skipped');process.exit(0)}\" || playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed",
    "test": "pnpm test:unit && pnpm test:e2e"
  }
}
```

**Root Package Scripts:**

```json
{
  "scripts": {
    "test": "turbo test:unit test:e2e",
    "test:unit": "turbo test:unit",
    "test:e2e": "turbo test:e2e",
    "test:unit:skip": "SKIP_UNIT_TESTS=true turbo test:unit",
    "test:e2e:skip": "SKIP_E2E_TESTS=true turbo test:e2e"
  }
}
```

**Usage:**

```bash
# Run everything
pnpm test

# Run only unit tests
pnpm test:unit

# Run only E2E
pnpm test:e2e

# Skip unit tests
SKIP_UNIT_TESTS=true pnpm test
# or shorthand:
pnpm test:unit:skip

# Skip E2E tests
SKIP_E2E_TESTS=true pnpm test
# or shorthand:
pnpm test:e2e:skip

# Skip all tests (both)
SKIP_UNIT_TESTS=true SKIP_E2E_TESTS=true pnpm test

# E2E against deployed environment
E2E_BASE_URL=https://staging.dzone.com pnpm test:e2e
```

**CI Pipeline Example:**

```yaml
# .github/workflows/ci.yml
jobs:
  unit-tests:
    if: ${{ vars.SKIP_UNIT_TESTS != 'true' }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install --frozen-lockfile
      - run: pnpm test:unit

  e2e-tests:
    if: ${{ vars.SKIP_E2E_TESTS != 'true' }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install --frozen-lockfile
      - run: pnpm --filter @dzone/web build
      - run: npx playwright install --with-deps chromium
      - run: pnpm test:e2e
        env:
          E2E_BASE_URL: http://localhost:4173
          E2E_USER_EMAIL: ${{ secrets.E2E_USER_EMAIL }}
          E2E_USER_PASSWORD: ${{ secrets.E2E_USER_PASSWORD }}
```

---

## 13. Migration Phases

### Phase 0: Foundation (Weeks 1-2)
- Init monorepo: `pnpm-workspace.yaml`, `turbo.json`, `tsconfig.base.json`, ESLint 10 flat config
- Create all package scaffolds with `package.json` files
- Scaffold `apps/web/` with Vite 7 + React 19 + TypeScript 5.9

### Phase 1: Shared Packages (Weeks 2-4)
- `shared-logger` — logging service (no deps, build first)
- `shared-styles` — CSS variables, Ant Design 6 light + dark themes
- `shared-lib` — enums, types, constants, utils, hooks (remove Refine/NextAuth imports)
- `shared-store` — auth-store (new), permissions-store, token-store, tenant-store, theme-store
- `shared-auth` — auth-service, api-client with interceptors + logging, route guards, permission hooks
- `shared-i18n` — i18next config + locales
- `shared-feature-flags` — flag system
- `shared-ui` — all 142 uicomponents migrated to Ant Design 6, charts, tables, forms
  - **Each component gets a `.stories.tsx` file** written alongside it (autodocs, variants, props)
  - Stories are co-located: `packages/shared-ui/src/components/button.tsx` → `button.stories.tsx`

### Phase 2: App Shell (Weeks 4-6)
- React Router 7 config with lazy routes
- Auth pages (login, forgot-password, set-password)
- Layout (sider, header, content area)
- TanStack Query provider
- Storybook config (`docs/storybook/` — main.ts, preview.tsx with theme/i18n decorators)

### Phase 3: Pilot Module (Week 6)
- `modules/profile` — smallest module, validates the full pipeline (routing, auth, API calls, permissions)

### Phase 4: Simple Modules (Weeks 7-9)
- `modules/jobs`, `modules/admin`, `modules/lead-validation`, `modules/dashboard`, `modules/dzent`

### Phase 5: Complex Modules (Weeks 9-12)
- `modules/ums`, `modules/analytics`, `modules/integrations-hub`, `modules/audience`, `modules/campaign-management`

### Phase 6: Polish (Weeks 12-13)
- Remove old Next.js app
- Performance optimization, bundle analysis
- E2E testing (Playwright specs for critical flows)
- CI/CD pipelines (GitHub Actions: build, typecheck, lint, unit, e2e)
- Storybook polish (verify all stories render, dark mode toggle, a11y addon checks)
- Dockerfile + nginx config for Vite SPA
- Dark mode QA across all components + charts
- Accessibility audit

---

## 14. Verification

1. **Each shared package**: `pnpm turbo build --filter=@dzone/shared-*` — all compile without errors
2. **App shell**: Login flow works, sidebar renders, theme toggle works
3. **Lazy routes**: Each module loads on navigation, Vite chunks split per route
4. **Auth**: Login → navigate → refresh page → still authenticated. 401 → redirects to login.
5. **Permissions**: Unauthorized route → shows /unauthorized. Hidden actions for unpermitted users.
6. **Dark mode**: Toggle theme → all components + charts update
7. **Storybook**: `pnpm turbo storybook` → all shared-ui components render with docs
8. **Tests**: `pnpm turbo test` — all Vitest suites pass
9. **Types**: `pnpm turbo typecheck` — no TS errors across workspace
10. **Lint**: `pnpm turbo lint` — no ESLint errors

---

## 15. Error Handling & Boundaries

### Error Boundary Component

```tsx
// packages/shared-ui/src/error-boundary.tsx
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { createLogger } from '@dzone/shared-logger';
import { Result, Button } from 'antd';

const logger = createLogger('error-boundary');

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; error?: Error; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    logger.error('Uncaught error', { message: error.message, stack: error.stack, componentStack: info.componentStack });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <Result
          status="error"
          title="Something went wrong"
          subTitle={this.state.error?.message}
          extra={<Button type="primary" onClick={() => window.location.reload()}>Reload Page</Button>}
        />
      );
    }
    return this.props.children;
  }
}
```

### Layout

- Global `ErrorBoundary` wraps the entire `<RouterProvider>`
- Per-module `ErrorBoundary` wraps each lazy route via React Router `errorElement`
- 404 route: `{ path: '*', element: <NotFound /> }` at the end of router config

```ts
// apps/web/src/router.tsx
{ path: '/unauthorized', element: <Unauthorized /> },
{ path: '*', element: <NotFound /> },  // 404 catch-all
```

---

## 16. Notification / Toast System

```ts
// packages/shared-ui/src/notification.ts
import { notification } from 'antd';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface ShowNotificationProps {
  message: string;
  messageHeader?: string;
  type?: NotificationType;
  placement?: 'bottom' | 'top' | 'topRight';
  duration?: number;
}

export const showNotification = ({
  message,
  messageHeader,
  type = 'error',
  placement = 'bottom',
  duration = 5,
}: ShowNotificationProps) => {
  notification[type]({
    message: messageHeader || (type === 'success' ? 'Success' : 'Error'),
    description: message,
    placement,
    duration,
  });
};
```

Integrated with axios error interceptor — API errors auto-show notifications.

---

## 17. File Upload & Download

### Current System (70+ files)

- Upload: drag-drop, progress tracking, metadata validation, FTP support
- Download: token-based file downloads, CSV templates

### Migration Pattern

```ts
// packages/shared-lib/src/hooks/use-file-upload.ts
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@dzone/shared-auth';

export const useFileUpload = (uploadUrl: string) => {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await apiClient.post(uploadUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (event) => {
          // progress tracking handled by Ant Design Upload component
        },
      });
      return data;
    },
  });
};

// File download utility
// packages/shared-lib/src/utils/file-download.ts
export const downloadFile = async (url: string, filename: string) => {
  const { data } = await apiClient.get(url, { responseType: 'blob' });
  const blobUrl = URL.createObjectURL(data);
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(blobUrl);
};
```

---

## 18. SSE (Server-Sent Events) & Polling

### SSE Service

Current: `src/services/sse-service.ts` — full SSE with auto-reconnection, token management, connection pooling.

```ts
// packages/shared-lib/src/services/sse-service.ts
import { useTokenStore } from '@dzone/shared-store';
import { createLogger } from '@dzone/shared-logger';

const logger = createLogger('sse');

interface SSEConnection { id: string; source: EventSource; }

class SSEService {
  private connections = new Map<string, SSEConnection>();

  connect<T>(url: string, onData: (data: T) => void, onError?: () => void): string {
    const token = useTokenStore.getState().accessToken;
    const fullUrl = `${import.meta.env.VITE_API_URL}${url}?token=${token}`;
    const source = new EventSource(fullUrl);
    const id = crypto.randomUUID();

    source.onmessage = (event) => {
      try { onData(JSON.parse(event.data)); }
      catch { logger.error('SSE parse error', { url }); }
    };

    source.onerror = () => {
      logger.warn('SSE connection error, reconnecting...', { url });
      source.close();
      onError?.();
      // Auto-reconnect after 10s
      setTimeout(() => this.connect(url, onData, onError), 10_000);
    };

    this.connections.set(id, { id, source });
    return id;
  }

  disconnect(id: string) {
    this.connections.get(id)?.source.close();
    this.connections.delete(id);
  }

  disconnectAll() {
    this.connections.forEach((conn) => conn.source.close());
    this.connections.clear();
  }
}

export const sseService = new SSEService();
```

### Polling Hook

```ts
// packages/shared-lib/src/hooks/use-polling.ts
// Use TanStack Query's refetchInterval for polling — no custom hook needed
export const usePollingQuery = <T>(key: string, fetchFn: () => Promise<T>, intervalMs: number, enabled = true) =>
  useQuery({
    queryKey: [key, 'polling'],
    queryFn: fetchFn,
    refetchInterval: enabled ? intervalMs : false,
  });

// Usage: poll lead upload status every 30s
const { data: uploadStatus } = usePollingQuery('lead-upload-status', () => fetchUploadStatus(id), 30_000);
```

---

## 19. Analytics & Tracking (GA + Clarity)

```tsx
// apps/web/src/analytics/google-analytics.ts
export const initGA = (trackingId: string) => {
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', trackingId);
};

// apps/web/src/analytics/clarity.ts
export const initClarity = (trackingId: string) => {
  // Inline script injection for Microsoft Clarity
  (function(c,l,a,r,i,t,y){ /* clarity snippet */ })(window, document, 'clarity', 'script', trackingId);
};

// Called in app.tsx on mount
if (import.meta.env.VITE_GA_TRACKING_ID) initGA(import.meta.env.VITE_GA_TRACKING_ID);
if (import.meta.env.VITE_CLARITY_TRACKING_ID) initClarity(import.meta.env.VITE_CLARITY_TRACKING_ID);
```

---

## 20. Encryption Utility

Current: `src/lib/utils/encryption.ts` uses `Cryptr` with `NEXT_PUBLIC_SECRET`.

```ts
// packages/shared-lib/src/utils/encryption.ts
// Replace Cryptr with Web Crypto API or keep cryptr as dependency
import Cryptr from 'cryptr';

const cryptr = new Cryptr(import.meta.env.VITE_CRYPTO_KEY);

export const encrypt = (text: string): string => cryptr.encrypt(text);
export const decrypt = (text: string): string => cryptr.decrypt(text);
```

---

## 21. Image & Static Asset Handling

Next.js `Image` component → standard `<img>` or Ant Design `Image`:

```tsx
// Replace next/image imports:
// BEFORE: import Image from 'next/image';
// AFTER:  import { Image } from 'antd'; (for preview support)
//         or <img> for simple static images

// Static assets in apps/web/public/ served at root path
// SVG icons: keep in packages/shared-ui/src/icons/
```

Vite handles static assets via `import`:
```ts
import logo from '@/assets/logo.svg'; // resolved by Vite
```

---

## 22. Date/Time Handling

```ts
// packages/shared-lib/src/utils/date.ts
// Keep dayjs — already lightweight, tree-shakeable
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

export { dayjs };
```

---

## 23. SCSS to CSS Migration

Current: 132 `.module.css` + `.module.scss` files, `global.scss`.

### Strategy

- **`.module.css` files**: Keep as-is — Vite supports CSS Modules natively
- **`.module.scss` files**: Convert to `.module.css` (most only use nesting, which CSS nesting now supports)
- **`global.scss`**: Convert to `global.css` — remove any Sass features (variables → CSS variables, mixins → utility classes)
- **`variables.css`**: Migrate to `packages/shared-styles/src/variables.css`
- Vite plugin: `vite-plugin-sass` only if SCSS features are still needed (unlikely)

---

## 24. Dockerfile & CI/CD

### Dockerfile for Vite SPA

```dockerfile
# Build stage
FROM node:22-alpine AS builder
RUN corepack enable pnpm
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/ ./packages/
COPY apps/web/ ./apps/web/
RUN pnpm install --frozen-lockfile
ARG VITE_API_URL
ARG VITE_APP_ENV=production
RUN pnpm --filter @dzone/web build

# Serve stage — static files via nginx
FROM nginx:1.27-alpine
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Nginx Config (SPA routing)

```nginx
# apps/web/nginx.conf
server {
  listen 80;
  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;  # SPA fallback
  }

  location /assets/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }

  gzip on;
  gzip_types text/css application/javascript application/json image/svg+xml;
}
```

### CI/CD Pipeline Updates

```yaml
# .github/workflows/ci.yml — update for Vite
- name: Build
  run: pnpm --filter @dzone/web build
  env:
    VITE_API_URL: ${{ vars.API_URL }}
    VITE_APP_ENV: ${{ vars.APP_ENV }}
```

---

## 25. Unsaved Changes Warning

Current: `src/contexts/unsaved-data-warning.tsx` (React Context → must convert to Zustand).

```ts
// packages/shared-lib/src/hooks/use-unsaved-changes.ts
import { create } from 'zustand';

interface UnsavedChangesState {
  isDirty: boolean;
  setDirty: (dirty: boolean) => void;
}

export const useUnsavedChangesStore = create<UnsavedChangesState>((set) => ({
  isDirty: false,
  setDirty: (dirty) => set({ isDirty: dirty }),
}));

// Browser beforeunload warning
export const useUnsavedChangesWarning = () => {
  const { isDirty } = useUnsavedChangesStore();

  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);
};

// React Router navigation blocking
// Use react-router's useBlocker() hook:
import { useBlocker } from 'react-router';

export const useNavigationBlock = () => {
  const { isDirty } = useUnsavedChangesStore();
  useBlocker(isDirty); // blocks navigation when form is dirty
};
```

---

## Key Files to Reference During Implementation

| Purpose | Current File |
|---|---|
| NextAuth config (auth logic to replicate) | `src/app/api/auth/[...nextauth]/options.ts` |
| Backend request handler (header injection) | `src/services/back-end-manager.ts` |
| All backend resource paths | `src/lib/enums/backend-resources.enum.ts` |
| All API resource paths | `src/lib/enums/api-resources.enum.ts` |
| Route-permission mapping | `src/lib/utils/auth/should-validate-path.ts` |
| Navigation config (sidebar) | `src/config/resources.tsx` |
| Permission check hook | `src/lib/hooks/use-permission-check.ts` |
| HasPermission component | `src/components/auth/has-permission.tsx` |
| Restricted access hook | `src/lib/hooks/use-restricted-access.ts` |
| Permission enums | `src/lib/enums/permissions/*.enum.ts` |
| Allowed resources hook | `src/lib/hooks/use-allowed-resources.ts` |
| API hosts | `src/lib/constants/api-hosts.ts` |
| CSS variables | `src/variables.css` |
| Logger | `src/services/logger/` |
| SSE service | `src/services/sse-service.ts` |
| Polling hook | `src/lib/hooks/use-polling.tsx` |
| Notification service | `src/services/notification.tsx` |
| Encryption utility | `src/lib/utils/encryption.ts` |
| File upload service | `src/services/file-upload/uploads.ts` |
| File download service | `src/services/file-download/file-download.ts` |
| React Contexts (to convert) | `src/contexts/color-mode.tsx`, `src/contexts/unsaved-data-warning.tsx` |
| Dockerfile | `Dockerfile` |
| CI/CD workflow | `.github/workflows/ci-cd.yaml` |
