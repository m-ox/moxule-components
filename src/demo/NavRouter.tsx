import { matchRoutes, Navigate, useLocation, useRoutes, type RouteObject } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import { DashboardPage } from "./pages/Dashboard/DashboardPage";
import { BlogComponentsPage } from "./pages/BlogComponents/BlogComponentsPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import type { BreadcrumbItem } from "../index";

function DashboardRedirect() {
  const { search, hash, state } = useLocation();
  return <Navigate to={{ pathname: "/", search, hash }} state={state} replace />;
}

// Breadcrumb labels belong to routes, alongside their page components.
const pages = [
  {
    path: "/",
    handle: { breadcrumb: "Dashboard" },
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "blog-components", element: <BlogComponentsPage />, handle: { breadcrumb: "Blog Components" } }
    ]
  },
  { path: "dashboard", element: <DashboardRedirect /> },
  { path: "*", element: <NotFoundPage />, handle: { breadcrumb: "Page not found" } }
] satisfies RouteObject[];

export function NavRouter() {
  const location = useLocation();
  const breadcrumbs: BreadcrumbItem[] = (matchRoutes(pages, location) ?? []).flatMap(({ route, pathname }) =>
    route.handle?.breadcrumb ? [{ label: route.handle.breadcrumb, href: pathname }] : []
  );

  return useRoutes([{ element: <AppLayout breadcrumbs={breadcrumbs} />, children: pages }]);
}
