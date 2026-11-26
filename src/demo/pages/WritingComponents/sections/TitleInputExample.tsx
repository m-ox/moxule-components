import { Card, Section, TextInput } from "../../../../index";

export function TitleInputExample() {
  return (
    <Section title="Text Input" headingLevel="h2" headingProps={{ className: "mx-demo-section-title" }}>
      <Card className="mx-demo-card">
        <TextInput label="Title" name="titleExample" defaultValue="A little story" placeholder="Give your story a title"
          description="A standalone title example. This field isn't saved with the Markdown below." />
      </Card>
    </Section>
  );
}
