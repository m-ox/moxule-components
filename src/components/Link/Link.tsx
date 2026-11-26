import {
  Children,
  Fragment,
  cloneElement,
  forwardRef,
  isValidElement,
  useMemo,
  version,
  type AnchorHTMLAttributes,
  type CSSProperties,
  type MutableRefObject,
  type ReactElement,
  type ReactNode,
  type Ref
} from "react";
import { useTheme } from "../../theme/ThemeProvider";
import type { ThemeName } from "../../theme/theme";

interface LinkBaseProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "color"> {
  color?: ThemeName | "inherit";
  sx?: CSSProperties;
  class?: string;
}

export type LinkProps = LinkBaseProps & (
  | { asChild?: false; children: ReactNode }
  | { asChild: true; children: ReactElement }
);

type ChildProps = Record<string, unknown> & {
  className?: string | ((state: unknown) => string | undefined);
  style?: CSSProperties | ((state: unknown) => CSSProperties | undefined);
  ref?: Ref<HTMLAnchorElement>;
};

const supportsRefCleanup = Number.parseInt(version, 10) >= 19;

function setRef(ref: Ref<HTMLAnchorElement> | undefined, node: HTMLAnchorElement | null) {
  if (typeof ref === "function") return ref(node) as unknown;
  if (ref) (ref as MutableRefObject<HTMLAnchorElement | null>).current = node;
}

function composeRefs(...refs: Array<Ref<HTMLAnchorElement> | undefined>) {
  return (node: HTMLAnchorElement | null) => {
    const cleanups = refs.map((ref) => setRef(ref, node));
    if (supportsRefCleanup && cleanups.some((cleanup) => typeof cleanup === "function")) {
      return () => cleanups.forEach((cleanup, index) => {
        if (typeof cleanup === "function") cleanup();
        else setRef(refs[index], null);
      });
    }
  };
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link({
  asChild = false,
  children,
  color,
  sx,
  class: classProp,
  className,
  style,
  ...props
}, ref) {
  const { mode } = useTheme();
  const child = asChild && isValidElement(children) ? children as ReactElement<ChildProps> : undefined;
  // React 19 stores refs in props; React 18 exposes them on the element instead.
  const childRef = child
    ? supportsRefCleanup ? child.props.ref : (child as unknown as { ref?: Ref<HTMLAnchorElement> }).ref
    : undefined;
  const composedRef = useMemo(() => composeRefs(ref, childRef), [ref, childRef]);
  const classes = ["mx-link", className, classProp].filter(Boolean).join(" ");
  const linkStyle = { ...sx, ...style };
  const linkProps = {
    ...props,
    "data-mx-color": color,
    "data-mx-color-mode": color && color !== "inherit" ? mode : undefined
  };

  if (!asChild) {
    return <a {...linkProps} ref={ref} className={classes} style={linkStyle}>{children}</a>;
  }

  Children.only(children);
  if (!child || child.type === Fragment || (typeof child.type === "string" && child.type !== "a")) {
    throw new Error("Link asChild requires one anchor or a component that forwards props and its ref to an anchor.");
  }

  const merged: ChildProps = { ...linkProps, ...child.props, ref: composedRef };
  for (const key of Object.keys(child.props)) {
    const parentHandler = (props as Record<string, unknown>)[key];
    const childHandler = child.props[key];
    if (/^on[A-Z]/.test(key) && typeof parentHandler === "function") {
      merged[key] = typeof childHandler === "function"
        ? (...args: unknown[]) => {
            childHandler(...args);
            if (!(args[0] as { defaultPrevented?: boolean } | undefined)?.defaultPrevented) {
              parentHandler(...args);
            }
          }
        : parentHandler;
    }
  }

  const childClassName = child.props.className;
  merged.className = typeof childClassName === "function"
    ? (state) => [classes, childClassName(state)].filter(Boolean).join(" ")
    : [classes, childClassName].filter(Boolean).join(" ");
  const childStyle = child.props.style;
  merged.style = typeof childStyle === "function"
    ? (state) => ({ ...linkStyle, ...childStyle(state) })
    : { ...linkStyle, ...childStyle };

  return cloneElement(child, merged);
});
