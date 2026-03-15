# Admin Dashboard

A fully client-side admin dashboard built as a portfolio/job-application demo.

> **Note:** This is a frontend-only project. All data is in-memory mock data — there is no backend or database. All CRUD operations work within the session and reset on page refresh (except theme and profile, which persist to `localStorage`).

## Tech Stack

- **React 19 + TypeScript** — Vite
- **TanStack Router** — file-based client-side routing
- **TanStack Query** — data fetching and cache management
- **TanStack Form** — form state and validation
- **material-react-table v3** — feature-rich data tables with pagination and search
- **MUI v7** — component library with custom olive/moss green theme
- **Recharts** — area and bar charts on the dashboard

## Features

- **Dashboard** — revenue chart, orders-by-status chart, stat cards, recent orders list
- **Products** — CRUD with image upload (up to 4), category assignment, spec value selection, stock/price validation
- **Orders** — inline status editing, status filter
- **Categories** — hierarchical parent/child categories with auto-generated slugs
- **Specifications & Spec Values** — category-scoped specifications and their selectable values
- **Users** — user management with role assignment
- **User Roles** — granular permission management with grouped checkboxes
- **Settings** — profile photo upload, name/email editing, light/dark mode toggle
- **Permission-based navigation** — sidebar items filtered by the logged-in user's role

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).
