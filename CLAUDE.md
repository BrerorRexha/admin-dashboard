# Admin Dashboard — Claude Context

## Project overview
A fully client-side admin dashboard built with React 19 + TypeScript. All data is in-memory mock data (no backend). Used as a portfolio/job-application demo.

## Tech stack
- **React 19 + TypeScript** (Vite)
- **TanStack Router** (`@tanstack/react-router`) — file-based route tree, redirect `/` → `/dashboard`
- **TanStack Form** (`@tanstack/react-form` v1.28.5) — `useForm`, `form.Field`, `useStore(form.store, selector)`
- **TanStack Query** (`@tanstack/react-query`) — all data fetching, mutations, cache invalidation
- **material-react-table** v3 — `useMaterialReactTable`, `MaterialReactTable`, `MRT_ColumnDef`
- **MUI v7** — `createTheme`, `buildTheme(mode)` factory, all MUI components
- **Recharts** — `AreaChart`, `BarChart`, `ResponsiveContainer`

## Key architecture decisions
- **No real API** — all services operate on in-memory arrays in `src/data/mockData.ts`
- **Auth context** (`src/app/auth.tsx`) — holds `me` state, persists to `localStorage` under key `admin_me`; `can(permission)` checks against `mockRoles`
- **Theme context** (`src/context/ThemeContext.tsx`) — `AppThemeProvider` wraps MUI `ThemeProvider`; persists to `localStorage`
- **Olive/moss green palette** — `brand` color scale in `src/theme/theme.ts`, primary `brand[500] = "#6b7c35"`
- **Sidebar-only layout** — permanent 240px `Drawer`, no top AppBar; nav items filtered by `can(permission)`

## Sections / routes
| Route | Page | Permission |
|---|---|---|
| `/dashboard` | Dashboard.tsx | `analytics.read` |
| `/products` | Products.tsx | `products.read` |
| `/orders` | Orders.tsx | `orders.read` |
| `/categories` | Categories.tsx | `categories.read` |
| `/specifications` | Specifications.tsx | `specifications.read` |
| `/spec-values` | SpecValues.tsx | `specifications.read` |
| `/users` | Users.tsx | `users.read` |
| `/user-roles` | UserRoles.tsx | `roles.read` |
| `/settings` | Settings.tsx | — |

## TanStack Form v1 — important API notes
- **Do NOT use `useForm<T>({})`** — the generic has 12 type params; always let TypeScript infer from `defaultValues`
- Use `useStore(form.store, (s) => s.values.fieldName)` for reactive value watching (not `form.useStore`)
- Import: `import { useForm, useStore } from "@tanstack/react-form"`

## Services pattern
Each service (e.g. `productsService.ts`) maintains a `let store: T[] = [...mockData]` array and exposes async CRUD functions with a `delay()` helper simulating network latency. All `fetch*` functions sort by `createdAt` descending before paginating so the newest entry appears first.

## Profile picture
Stored at `public/profile.jpg`. The logged-in user (`mockMe`) uses `avatar: "/profile.jpg"`.

## Dev server
```
node_modules/.bin/vite.cmd   (port 5173)
```
Launch config: `.claude/launch.json` uses `cmd /c node_modules\\.bin\\vite.cmd`.
