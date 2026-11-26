import { Link as RouterLink } from "react-router-dom";
import { Image, Link, ThemeToggle, Toolbar } from "../../index";
import { useDemoPreferences } from "../DemoProvider";
import logoUrl from "../favicon.ico";
import { AppMenu } from "./AppMenu";

export function AppNavbar() {
  const { setMode } = useDemoPreferences();
  return (
    <Toolbar
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
  );
}
