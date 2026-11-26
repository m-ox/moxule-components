import { forwardRef, useId, type CSSProperties, type HTMLAttributes, type ReactNode } from "react";
import { Header, type HeaderProps, type HeaderVariant } from "../Typography/Header";
import { Text, type TextProps } from "../Typography/Text";

export interface SectionProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title?: ReactNode;
  description?: ReactNode;
  headingLevel?: HeaderVariant;
  headingProps?: Omit<HeaderProps, "children" | "variant">;
  descriptionProps?: Omit<TextProps, "children">;
  children?: ReactNode;
  sx?: CSSProperties;
  class?: string;
}

export const Section = forwardRef<HTMLElement, SectionProps>(function Section({
  title,
  description,
  headingLevel = "h2",
  headingProps,
  descriptionProps,
  children,
  sx,
  class: classProp,
  className,
  style,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  ...props
}, ref) {
  const generatedId = useId();
  const hasTitle = title != null && title !== false;
  const hasDescription = description != null && description !== false;
  const headingId = headingProps?.id ?? `${generatedId}-title`;
  const descriptionId = descriptionProps?.id ?? `${generatedId}-description`;
  const labelledBy = ariaLabelledBy ?? (ariaLabel ? undefined : hasTitle ? headingId : undefined);
  const describedBy = [hasDescription ? descriptionId : undefined, ariaDescribedBy].filter(Boolean).join(" ") || undefined;

  return (
    <section
      {...props}
      ref={ref}
      className={["mx-section", className, classProp].filter(Boolean).join(" ")}
      aria-label={ariaLabel}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      style={{ ...sx, ...style }}
    >
      {hasTitle ? (
        <Header
          {...headingProps}
          id={headingId}
          variant={headingLevel}
          className={["mx-section-title", headingProps?.className].filter(Boolean).join(" ")}
        >{title}</Header>
      ) : null}
      {hasDescription ? (
        <Text
          {...descriptionProps}
          id={descriptionId}
          className={["mx-section-description", descriptionProps?.className].filter(Boolean).join(" ")}
        >{description}</Text>
      ) : null}
      {children}
    </section>
  );
});
