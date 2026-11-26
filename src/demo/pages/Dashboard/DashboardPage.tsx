import { Section } from "../../../index";
import { FontStylePreview } from "./sections/FontStylePreview";
import { ThemeColorPreview } from "./sections/ThemeColorPreview";
import { GeneralComponents } from "./sections/GeneralComponents";
import { WritingFeatures } from "./sections/WritingFeatures";
import { AppSitemap } from "./sections/AppSitemap";

export function DashboardPage() {
  return (
    <Section
      title="Dashboard"
      description="Explore the component library. Choose a font and theme, then try the controls below."
      headingLevel="h1"
      headingProps={{ className: "mx-demo-title" }}
      className="mx-demo-stack"
    >
      <FontStylePreview />
      <ThemeColorPreview />
      <GeneralComponents />
      <WritingFeatures />
      <AppSitemap />
    </Section>
  );
}
