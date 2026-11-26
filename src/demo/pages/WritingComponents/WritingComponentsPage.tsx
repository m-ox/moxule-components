import { Link as RouterLink } from "react-router-dom";
import { Link, Section } from "../../../index";
import { MarkdownEditorExample } from "./sections/MarkdownEditorExample";
import { TitleInputExample } from "./sections/TitleInputExample";

export function WritingComponentsPage() {
  return (
    <Section
      title="Writing Components"
      description="A home for writing features and component previews."
      headingLevel="h1"
      headingProps={{ className: "mx-demo-title" }}
      className="mx-demo-stack"
    >
      <TitleInputExample />
      <MarkdownEditorExample />
      <Link asChild><RouterLink to="/">Back to Dashboard</RouterLink></Link>
    </Section>
  );
}
