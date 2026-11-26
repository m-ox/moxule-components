import { appSitemap } from "../navigation";
import { useEffect, useId, useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { Drawer, MenuButton, Sitemap } from "../../index";

export function AppMenu() {
  const [open, setOpen] = useState(false);
  const drawerId = useId();
  const { pathname, hash } = useLocation();
  useEffect(() => { setOpen(false); }, [pathname, hash]);

  return (
    <>
      <MenuButton open={open} onClick={() => setOpen((value) => !value)} aria-controls={drawerId} />
      <Drawer id={drawerId} title="Menu" description="Explore the dashboard." open={open} onOpenChange={setOpen} side="left">
        <Sitemap aria-label="Main navigation" items={appSitemap} currentPath={pathname}
          renderLink={(item) => <RouterLink to={item.href} onClick={() => setOpen(false)}>{item.label}</RouterLink>} />
      </Drawer>
    </>
  );
}
