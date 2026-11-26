import { Button, Card, Header, Section, Text, type FontStyleName } from "../../../../index";
import { useDemoPreferences } from "../../../DemoProvider";

const fontStyles: readonly FontStyleName[] = ["clear", "playful", "stark", "bizarre"];

export function FontStylePreview() {
  const { fontStyle, setFontStyle } = useDemoPreferences();
  return (
    <Section
      id="font-styles"
      title="Font Style Preview"
      description="Quick QA snapshot for display font styles. Body text remains Gudea by default."
      headingLevel="h2"
      headingProps={{ className: "mx-demo-section-title" }}
      descriptionProps={{ variant: "sm", className: "mx-demo-description" }}
    >
      <div className="mx-demo-preview-grid">
        {fontStyles.map((font) => (
          <Card key={font} className="mx-demo-card">
            <Header variant="h3" className="mx-demo-font" data-demo-font={font}>{font}</Header>
            <Text variant="sm" className="mx-demo-card-copy">The quick brown fox jumps over the lazy dog.</Text>
            <Button size="sm" variant={fontStyle === font ? "primary" : "secondary"} className="mx-demo-spaced" onClick={() => setFontStyle(font)}>
              {fontStyle === font ? "Selected" : `Use ${font}`}
            </Button>
          </Card>
        ))}
      </div>
    </Section>
  );
}
