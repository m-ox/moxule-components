import { Link as RouterLink } from "react-router-dom";
import { Link, Section } from "../../../index";

export function BlogComponentsPage() {
  return (
    <Section
      title="Blog Components"
      description="A home for blog features and component previews."
      headingLevel="h1"
      headingProps={{ className: "mx-demo-title" }}
      className="mx-demo-stack"
    >
      <Link asChild><RouterLink to="/">Back to Dashboard</RouterLink></Link>
    </Section>
  );
}
