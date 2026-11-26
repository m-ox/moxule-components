import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactElement, type ReactNode } from "react";
import { Link } from "../Link/Link";

export interface SitemapItem {
  label: ReactNode;
  href: string;
  children?: readonly SitemapItem[];
}

export interface SitemapProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  items: readonly SitemapItem[];
  currentPath?: string;
  renderLink?: (item: SitemapItem) => ReactElement;
  sx?: CSSProperties;
  class?: string;
}

export const Sitemap = forwardRef<HTMLElement, SitemapProps>(function Sitemap({ items, currentPath, renderLink, sx, class: classProp, className, style, "aria-label": label, "aria-labelledby": labelledBy, ...props }, ref) {
  if (!items.length) return null;
  const normalized = (path: string) => path.split(/[?#]/)[0].replace(/\/$/, "") || "/";
  const list = (entries: readonly SitemapItem[]) => <ul className="mx-sitemap-list">
    {entries.map((item) => <li key={item.href} className="mx-sitemap-item">
      {renderLink
        ? <Link asChild className="mx-breadcrumbs-step" aria-current={currentPath && normalized(item.href) === normalized(currentPath) ? "page" : undefined}>{renderLink(item)}</Link>
        : <Link href={item.href} className="mx-breadcrumbs-step" aria-current={currentPath && normalized(item.href) === normalized(currentPath) ? "page" : undefined}>{item.label}</Link>}
      {item.children?.length ? list(item.children) : null}
    </li>)}
  </ul>;
  return <nav {...props} ref={ref} aria-label={label ?? (labelledBy ? undefined : "Sitemap")} aria-labelledby={labelledBy}
    className={["mx-sitemap", className, classProp].filter(Boolean).join(" ")} style={{ ...sx, ...style }}>{list(items)}</nav>;
});
