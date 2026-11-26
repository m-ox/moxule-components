import type { SitemapItem } from "../components/Sitemap/Sitemap";

export const appSubpages = [
  { href: "/fonts", label: "Fonts" },
  { href: "/themes", label: "Themes" },
  { href: "/components", label: "Components" },
  { href: "/writing-components", label: "Writing Components" },
  { href: "/preferences", label: "Preferences" }
] as const;

export const appPages = [{ href: "/", label: "Dashboard" }, ...appSubpages] as const;
export const appSitemap: readonly SitemapItem[] = [{ ...appPages[0], children: appSubpages }];
