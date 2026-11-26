import { Link as RouterLink } from "react-router-dom";
import { Breadcrumbs, Image, Layout, Link, ThemeToggle, Toolbar, type BreadcrumbItem } from "../../index";
import { useDemoPreferences } from "../DemoProvider";
import logoUrl from "../favicon.ico";
import { AppMenu } from "./AppMenu";

export function AppNavbar({ breadcrumbs }: { breadcrumbs: readonly BreadcrumbItem[] }) {
  const { setMode } = useDemoPreferences();
  return (
    <div className="mx-demo-app-header">
      <Toolbar
        position="static"
        left={
          <Link asChild color="inherit" className="mx-demo-brand">
            <RouterLink to="/">
              <Image src={logoUrl} alt="Moxules logo" width={26} height={26} className="mx-demo-logo" />
              <strong className="mx-demo-brand-name">Moxules</strong>
            </RouterLink>
          </Link>
        }
        right={<div className="mx-demo-navbar-actions"><ThemeToggle onModeChange={setMode} /><AppMenu /></div>}
      />
      <Layout margin="sm" contentWidth="md" className="mx-demo-breadcrumbs-layout">
        <Breadcrumbs items={breadcrumbs} renderLink={(item) => <RouterLink to={item.href!}>{item.label}</RouterLink>} />
      </Layout>
    </div>
  );
}
