import { Link as RouterLink } from "react-router-dom";
import { Card, Link, Section } from "../../../index";
import { MarkdownEditorExample } from "./sections/MarkdownEditorExample";
import { TitleInputExample } from "./sections/TitleInputExample";

export function WritingComponentsPage() {
  return (
    <Section
      title="Writing Components"
      description="A quiet place to put an idea into words."
      headingLevel="h1"
      headingProps={{ className: "mx-demo-title" }}
      className="mx-demo-stack"
    >
      <Card className="mx-demo-writing-workspace">
        <TitleInputExample />
        <MarkdownEditorExample />
      </Card>
      <Link asChild><RouterLink to="/">Back to Dashboard</RouterLink></Link>
    </Section>
  );
}
