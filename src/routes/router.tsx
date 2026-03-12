import { createRouter, createRootRoute, createRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppLayout } from "../components/layout/AppLayout";

import Dashboard      from "../pages/Dashboard";
import Products       from "../pages/Products";
import Orders         from "../pages/Orders";
import Categories     from "../pages/Categories";
import Specifications from "../pages/Specifications";
import SpecValues     from "../pages/SpecValues";
import Users          from "../pages/Users";
import UserRoles      from "../pages/UserRoles";
import Settings       from "../pages/Settings";

const rootRoute   = createRootRoute({ component: () => <Outlet /> });
const layoutRoute = createRoute({ getParentRoute: () => rootRoute, id: "layout", component: () => <AppLayout /> });

const indexRoute          = createRoute({ getParentRoute: () => layoutRoute, path: "/",              beforeLoad: () => { throw redirect({ to: "/dashboard" }); } });
const dashboardRoute      = createRoute({ getParentRoute: () => layoutRoute, path: "/dashboard",     component: Dashboard });
const productsRoute       = createRoute({ getParentRoute: () => layoutRoute, path: "/products",      component: Products });
const ordersRoute         = createRoute({ getParentRoute: () => layoutRoute, path: "/orders",        component: Orders });
const categoriesRoute     = createRoute({ getParentRoute: () => layoutRoute, path: "/categories",    component: Categories });
const specificationsRoute = createRoute({ getParentRoute: () => layoutRoute, path: "/specifications", component: Specifications });
const specValuesRoute     = createRoute({ getParentRoute: () => layoutRoute, path: "/spec-values",   component: SpecValues });
const usersRoute          = createRoute({ getParentRoute: () => layoutRoute, path: "/users",         component: Users });
const userRolesRoute      = createRoute({ getParentRoute: () => layoutRoute, path: "/user-roles",    component: UserRoles });
const settingsRoute       = createRoute({ getParentRoute: () => layoutRoute, path: "/settings",      component: Settings });

const routeTree = rootRoute.addChildren([
  layoutRoute.addChildren([
    indexRoute, dashboardRoute, productsRoute, ordersRoute,
    categoriesRoute, specificationsRoute, specValuesRoute,
    usersRoute, userRolesRoute, settingsRoute,
  ]),
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register { router: typeof router; }
}
