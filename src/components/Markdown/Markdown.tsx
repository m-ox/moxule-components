import type { CSSProperties, HTMLAttributes } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Image } from "../Image/Image";
import { Link } from "../Link/Link";

export interface MarkdownProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  children: string;
  sx?: CSSProperties;
  class?: string;
}

export function Markdown({ children, sx, class: classProp, className, style, ...props }: MarkdownProps) {
  return (
    <div {...props} className={["mx-markdown", className, classProp].filter(Boolean).join(" ")} style={{ ...sx, ...style }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        skipHtml
        components={{
          a: ({ node, children: content, ...linkProps }) => <Link {...linkProps} color={undefined}>{content}</Link>,
          img: ({ node, ...imageProps }) => <Image {...imageProps} alt={imageProps.alt ?? ""} loading="lazy" />
        }}
      >{children}</ReactMarkdown>
    </div>
  );
}
