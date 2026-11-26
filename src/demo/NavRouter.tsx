import { appSubpages } from "./navigation";
import { ComponentsPage } from "./pages/Components/ComponentsPage";
import { ThemesPage } from "./pages/Themes/ThemesPage";
import { FontsPage } from "./pages/Fonts/FontsPage";
import { matchRoutes, Navigate, useLocation, useRoutes, type RouteObject } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import { DashboardPage } from "./pages/Dashboard/DashboardPage";
import { WritingComponentsPage } from "./pages/WritingComponents/WritingComponentsPage";
import { PreferencesPage } from "./pages/Preferences/PreferencesPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import type { BreadcrumbItem } from "../index";

function DashboardRedirect() {
  const { search, hash, state } = useLocation();
  return <Navigate to={{ pathname: "/", search, hash }} state={state} replace />;
}

function WritingRedirect() {
  const { search, hash, state } = useLocation();
  return <Navigate to={{ pathname: "/writing-components", search, hash }} state={state} replace />;
}

// Breadcrumb labels belong to routes, alongside their page components.
const pages = [
  {
    path: "/",
    handle: { breadcrumb: "Dashboard" },
    children: [
      { index: true, element: <DashboardPage /> },
      ...appSubpages.map((page) => ({
        path: page.href.slice(1),
        element: ({ "/fonts": <FontsPage />, "/themes": <ThemesPage />, "/components": <ComponentsPage />, "/writing-components": <WritingComponentsPage />, "/preferences": <PreferencesPage /> })[page.href],
        handle: { breadcrumb: page.label }
      }))
    ]
  },
  { path: "dashboard", element: <DashboardRedirect /> },
  { path: "blog-components", element: <WritingRedirect /> },
  { path: "*", element: <NotFoundPage />, handle: { breadcrumb: "Page not found" } }
] satisfies RouteObject[];

export function NavRouter() {
  const location = useLocation();
  const breadcrumbs: BreadcrumbItem[] = (matchRoutes(pages, location) ?? []).flatMap(({ route, pathname }) =>
    route.handle?.breadcrumb ? [{ label: route.handle.breadcrumb, href: pathname }] : []
  );

  return useRoutes([{ element: <AppLayout breadcrumbs={breadcrumbs} />, children: pages }]);
}
