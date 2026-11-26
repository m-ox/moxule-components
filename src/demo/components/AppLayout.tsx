import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Layout, PageShell, type BreadcrumbItem } from "../../index";
import { AppNavbar } from "./AppNavbar";
import { AppFooter } from "./AppFooter";

export function AppLayout({ breadcrumbs }: { breadcrumbs: readonly BreadcrumbItem[] }) {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView?.();
  }, [pathname, hash]);

  return (
    <PageShell>
      <AppNavbar breadcrumbs={breadcrumbs} />
      <Layout margin="lg" contentWidth="md" className="mx-demo-layout">
        <main id="main-content">
          <Outlet />
        </main>
      </Layout>
      <AppFooter />
    </PageShell>
  );
}
