import { appSitemap } from "../navigation";
import { useEffect, useId, useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { Drawer, MenuButton, Sitemap, Tooltip } from "../../index";

export function AppMenu() {
  const [open, setOpen] = useState(false);
  const drawerId = useId();
  const { pathname, hash } = useLocation();
  useEffect(() => { setOpen(false); }, [pathname, hash]);
  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.repeat || event.isComposing || event.altKey || event.shiftKey || (!event.ctrlKey && !event.metaKey) || event.key.toLowerCase() !== "k") return;
      if (event.target instanceof HTMLElement && event.target.closest('input, textarea, select, [role="textbox"], [contenteditable]:not([contenteditable="false"])')) return;
      const modal = document.querySelector("dialog[open]");
      if (modal && modal.id !== drawerId) return;
      event.preventDefault();
      setOpen((value) => !value);
    };
    document.addEventListener("keydown", shortcut);
    return () => document.removeEventListener("keydown", shortcut);
  }, [drawerId]);

  return (
    <>
      <Tooltip content="Open the app menu. Ctrl/⌘ + K." side="bottom" disabled={open}>
        <MenuButton open={open} onClick={() => setOpen((value) => !value)} aria-controls={drawerId} aria-keyshortcuts="Control+k Meta+k" />
      </Tooltip>
      <Drawer id={drawerId} title="Menu" description="Explore the dashboard." open={open} onOpenChange={setOpen} side="left">
        <Sitemap aria-label="Main navigation" items={appSitemap} currentPath={pathname}
          renderLink={(item) => <RouterLink to={item.href} onClick={() => setOpen(false)}>{item.label}</RouterLink>} />
      </Drawer>
    </>
  );
}
