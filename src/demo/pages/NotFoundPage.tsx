import { Link as RouterLink } from "react-router-dom";
import { Link, Section } from "../../index";

export function NotFoundPage() {
  return (
    <Section title="Page not found" headingLevel="h1" headingProps={{ className: "mx-demo-title" }} description="This page doesn't exist.">
      <Link asChild><RouterLink to="/">Return to Dashboard</RouterLink></Link>
    </Section>
  );
}
