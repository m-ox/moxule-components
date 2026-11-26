import { useEffect } from "react";
import { Link as RouterLink, Outlet, useLocation } from "react-router-dom";
import { Breadcrumbs, Layout, PageShell, type BreadcrumbItem } from "../../index";
import { AppNavbar } from "./AppNavbar";
import { AppFooter } from "./AppFooter";

export function AppLayout({ breadcrumbs }: { breadcrumbs: readonly BreadcrumbItem[] }) {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView?.();
  }, [pathname, hash]);

  return (
    <PageShell>
      <AppNavbar />
      <Layout margin="lg" contentWidth="md" className="mx-demo-layout">
        <main id="main-content">
          <Breadcrumbs
            items={breadcrumbs}
            className="mx-demo-breadcrumbs"
            renderLink={(item) => <RouterLink to={item.href!}>{item.label}</RouterLink>}
          />
          <Outlet />
        </main>
      </Layout>
      <AppFooter />
    </PageShell>
  );
}
