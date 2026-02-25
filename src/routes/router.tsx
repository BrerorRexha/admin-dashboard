// import React from "react";
import { createRouter, createRootRoute, createRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppLayout } from "../components/layout/AppLayout";

import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import Orders from "../pages/Orders";
import Settings from "../pages/Settings";

const rootRoute = createRootRoute({
  component: () => <Outlet />
});

const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "layout",
  component: () => <AppLayout />
});

const indexRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/dashboard" });
  }
});

const dashboardRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/dashboard",
  component: Dashboard
});

const usersRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/users",
  component: Users
});

const ordersRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/orders",
  component: Orders
});

const settingsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/settings",
  component: Settings
});

const routeTree = rootRoute.addChildren([
  layoutRoute.addChildren([indexRoute, dashboardRoute, usersRoute, ordersRoute, settingsRoute])
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}