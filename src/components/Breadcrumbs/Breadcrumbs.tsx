import { forwardRef, useEffect, useRef, useState, type CSSProperties, type HTMLAttributes, type ReactElement, type ReactNode } from "react";
import { Link } from "../Link/Link";
import { breadcrumbConnectors } from "./connectors";

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

export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(function Breadcrumbs({
  items,
  separator,
  renderLink,
  sx,
  class: classProp,
  className,
  style,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...props
}, ref) {
  const list = useRef<HTMLOListElement>(null);
  const rail = useRef<SVGSVGElement>(null);
  const [path, setPath] = useState("");
  const connected = separator === undefined && items.length > 1;

  useEffect(() => {
    if (!connected) { setPath(""); return; }
    let active = true;
    const steps = Array.from(list.current?.querySelectorAll<HTMLElement>(".mx-breadcrumbs-step") ?? []);
    const measure = () => {
      if (!active || !rail.current) return;
      const bounds = rail.current.getBoundingClientRect();
      if (!bounds.width) return;
      setPath(breadcrumbConnectors(steps.map((step) => {
        const box = step.getBoundingClientRect();
        const font = Number.parseFloat(getComputedStyle(step).fontSize) || 14.4;
        return {
          x: box.left - bounds.left + font * 0.325,
          top: box.top - bounds.top + font * 0.425,
          rail: box.top - bounds.top - font * 0.2,
          slant: font * 0.35
        };
      })));
    };
    measure();
    const observer = typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(measure);
    if (list.current) observer?.observe(list.current);
    for (const step of steps) observer?.observe(step);
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    return () => { active = false; observer?.disconnect(); window.removeEventListener("resize", measure); };
  }, [connected, items]);

  if (items.length === 0) return null;

  return (
    <nav
      {...props}
      ref={ref}
      aria-label={ariaLabel ?? (ariaLabelledBy ? undefined : "Breadcrumb")}
      aria-labelledby={ariaLabelledBy}
      data-mx-layout={separator === undefined ? "connected" : "separated"}
      data-mx-connected={connected || undefined}
      className={["mx-breadcrumbs", className, classProp].filter(Boolean).join(" ")}
      style={{ ...sx, ...style }}
    >
      {connected ? <svg ref={rail} className="mx-breadcrumbs-connectors" aria-hidden="true" focusable="false"><path d={path} vectorEffect="non-scaling-stroke" /></svg> : null}
      <ol ref={list} className="mx-breadcrumbs-list">
        {items.map((item, index) => {
          const current = index === items.length - 1;
          return (
            <li key={index} className="mx-breadcrumbs-item">
              {index > 0 && separator != null ? <span className="mx-breadcrumbs-separator" aria-hidden="true">{separator}</span> : null}
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
