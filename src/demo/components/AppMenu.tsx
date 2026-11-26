import { useEffect, useId, useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { Drawer, Link, MenuButton } from "../../index";

export function AppMenu() {
  const [open, setOpen] = useState(false);
  const drawerId = useId();
  const { pathname, hash } = useLocation();
  useEffect(() => { setOpen(false); }, [pathname, hash]);

  return (
    <>
      <MenuButton open={open} onClick={() => setOpen((value) => !value)} aria-controls={drawerId} />
      <Drawer id={drawerId} title="Menu" description="Explore the dashboard." open={open} onOpenChange={setOpen} side="left">
        <nav aria-label="Main navigation" className="mx-demo-drawer-links">
          <Link asChild onClick={() => setOpen(false)}><RouterLink to="/">Dashboard</RouterLink></Link>
          <Link asChild onClick={() => setOpen(false)}><RouterLink to="/#font-styles">Fonts</RouterLink></Link>
          <Link asChild onClick={() => setOpen(false)}><RouterLink to="/#theme-colors">Themes</RouterLink></Link>
          <Link asChild onClick={() => setOpen(false)}><RouterLink to="/#general-components">Components</RouterLink></Link>
        </nav>
      </Drawer>
    </>
  );
}
