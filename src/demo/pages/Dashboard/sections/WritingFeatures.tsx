import { useNavigate } from "react-router-dom";
import { Button, Card, Header, Section } from "../../../../index";

export function WritingFeatures() {
  const navigate = useNavigate();
  return (
    <Section id="writing-features" aria-label="Writing features">
      <Card className="mx-demo-writing-cta">
        <Header variant="h2" className="mx-demo-writing-cta-copy">
          Want to see writing features? Check out the writing components!
        </Header>
        <Button onClick={() => navigate("/writing-components")}>View writing components</Button>
      </Card>
    </Section>
  );
}
