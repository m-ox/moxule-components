import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactElement, type ReactNode } from "react";
import { Link } from "../Link/Link";

export interface BreadcrumbItem {
  label: ReactNode;
  href?: string;
}

export interface BreadcrumbsProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  items: readonly BreadcrumbItem[];
  separator?: ReactNode;
  renderLink?: (item: BreadcrumbItem, index: number) => ReactElement;
  sx?: CSSProperties;
  class?: string;
}

const lightningSeparator = (
  <svg className="mx-breadcrumbs-bolt" viewBox="0 0 24 16" fill="currentColor" aria-hidden="true" focusable="false">
    <path d="M14 2 3 9h8l-1 5L22 6h-9l1-4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(function Breadcrumbs({
  items,
  separator = lightningSeparator,
  renderLink,
  sx,
  class: classProp,
  className,
  style,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...props
}, ref) {
  if (items.length === 0) return null;

  return (
    <nav
      {...props}
      ref={ref}
      aria-label={ariaLabel ?? (ariaLabelledBy ? undefined : "Breadcrumb")}
      aria-labelledby={ariaLabelledBy}
      className={["mx-breadcrumbs", className, classProp].filter(Boolean).join(" ")}
      style={{ ...sx, ...style }}
    >
      <ol className="mx-breadcrumbs-list">
        {items.map((item, index) => {
          const current = index === items.length - 1;
          return (
            <li key={index} className="mx-breadcrumbs-item">
              {index > 0 ? <span className="mx-breadcrumbs-separator" aria-hidden="true">{separator}</span> : null}
              {current ? <span className="mx-breadcrumbs-step" aria-current="page">{item.label}</span>
                : item.href ? renderLink
                  ? <Link asChild className="mx-breadcrumbs-step">{renderLink(item, index)}</Link>
                  : <Link href={item.href} className="mx-breadcrumbs-step">{item.label}</Link>
                : <span className="mx-breadcrumbs-step">{item.label}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});
