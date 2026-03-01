# CLAUDE.md — DZone Platform

## Overview

Single Vite SPA monolith in a pnpm + Turborepo monorepo. Migrating from Next.js (`dzone-ui`) to React 19 + Vite 7.

**CRITICAL**: NO microfrontends. NO Module Federation. Single `apps/web/` app + `packages/` shared libs. That's it.

## Essential Commands

```bash
# Development
pnpm dev                  # Start Vite dev server (apps/web)
pnpm dev --filter web     # Start only the web app

# Build & Typecheck
pnpm build                # Build all packages + app
pnpm typecheck            # TypeScript check across all packages
pnpm typecheck --filter web  # TypeScript check web app only
pnpm lint                 # ESLint across all packages

# Testing
pnpm test                 # Run Vitest unit tests
pnpm test:e2e             # Run Playwright E2E tests

# Package Management
pnpm install              # Install all dependencies
pnpm add <pkg> --filter <workspace>  # Add dependency to specific package
```

## Monorepo Structure

```
dzone-platform/
├── apps/
│   └── web/                    # Single Vite SPA
│       ├── src/
│       │   ├── modules/        # Feature modules (lazy-loaded)
│       │   │   ├── admin/      # Organizations, UMS (Users, Roles)
│       │   │   ├── profile/    # User profile
│       │   │   ├── jobs/       # Job management
│       │   │   ├── dashboard/  # Reporting dashboard
│       │   │   └── ...
│       │   ├── layout/         # AppLayout, NavigationMenu, Header
│       │   ├── auth/           # Login, ForgotPassword, SetPassword
│       │   ├── router/         # createBrowserRouter, guards
│       │   ├── assets/         # Static assets
│       │   └── App.tsx         # Root: ConfigProvider + QueryClient + Router
│       ├── public/
│       └── e2e/                # Playwright tests
├── packages/
│   ├── shared-ui/              # 64 components, table, charts
│   ├── shared-lib/             # Enums, types, constants, utils, hooks
│   ├── shared-store/           # Zustand stores (auth, token, permissions, tenant, theme)
│   ├── shared-auth/            # apiClient (axios), auth-service, guards, SSE
│   ├── shared-i18n/            # i18next config + locales
│   ├── shared-styles/          # CSS variables, Ant Design theme tokens
│   ├── shared-logger/          # Batched HTTP logging
│   └── shared-feature-flags/   # Feature flag store
├── docs/
│   ├── storybook/
│   └── migration-plan.md       # Full migration plan & progress
├── turbo.json
├── pnpm-workspace.yaml
└── tsconfig.base.json
```

## Target Stack

Vite 7 | React 19 | TypeScript 5.9 | React Router 7 | TanStack Query 5 | Zustand 5 + Immer | Ant Design 5/6 | Vitest 4 | Playwright | ESLint 10 | Zod 4 | pnpm + Turborepo | Storybook 8

## Architecture Principles

### State Management
- **Server state**: TanStack Query (caching, refetching, optimistic updates)
- **UI state**: Zustand + Immer (never React Context)
- **Persistence**: User-scoped localStorage (`dzone:<userId>:<store>`)

### API Layer
- **No BFF** — `apiClient` (axios) calls backend services directly
- Axios interceptors handle auth tokens, request IDs, duration logging
- Full request/response logging via `shared-logger`

### RBAC (5-layer)
1. Permission store (loaded at login)
2. Navigation menu filtering
3. Route guards (`PermissionGuard`)
4. Component-level visibility
5. Field-level ABAC

### Routing
- `createBrowserRouter` with `React.lazy` code splitting
- `AuthGuard` wraps all authenticated routes
- `PermissionGuard` per route for module-level access

### React 19 Patterns
- Minimize `useEffect` — prefer `useActionState`, `useOptimistic`, `useTransition`, `use()`
- No `import React` needed for JSX
- TanStack Query replaces `useEffect` + `useState` for data fetching

## Component Patterns

- **Max 15-20 lines TSX** per component — split if larger
- **No raw HTML elements** — use Ant Design: `Flex`, `Space`, `Typography.Text`, `Typography.Title`
- **Ant Design first** — use built-in props/variants before writing custom CSS
- **Zustand stores** — never React Context, never prop drilling for shared state
- **Permission format**: `Module.ACTION` or `Module.ACTION.fieldName`

## Migration Workflow

When migrating a feature from `dzone-ui`:

1. **Trace full data flow** in old codebase: Component → Frontend Service → BackendResources enum → Next.js API Route → Route's internal service → Actual backend URL
2. **Build new direct service** using `apiClient` with the actual backend path
3. **Build component/hook** — TanStack Query for data, Zustand for UI state
4. **Verify** — compare API request shape, run `pnpm typecheck`

See `docs/migration-plan.md` for full phase details and progress.

## Styling

- Ant Design CSS-in-JS uses `:where()` (0 specificity) — plain CSS overrides work without `!important`
- Form inputs: 48px height via theme token `Input.controlHeight: 48`
- Form items: `.form-control-item` class for inset box-shadow styling
- Global scroll containment: `html, body, #root { height: 100%; overflow: hidden }`
- Content area: `overflow-y: auto` on content only

## Testing

- **Unit**: Vitest 4 — togglable via env vars
- **E2E**: Playwright — togglable via env vars
- Run `pnpm typecheck` after every migration step
