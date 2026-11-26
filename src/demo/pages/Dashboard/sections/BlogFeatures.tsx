import { useNavigate } from "react-router-dom";
import { Button, Card, Header, Section } from "../../../../index";

export function BlogFeatures() {
  const navigate = useNavigate();
  return (
    <Section id="blog-features" aria-label="Blog features">
      <Card className="mx-demo-blog-cta">
        <Header variant="h2" className="mx-demo-blog-cta-copy">
          Want to see blog features? Check out the blog components!
        </Header>
        <Button onClick={() => navigate("/blog-components")}>View blog components</Button>
      </Card>
    </Section>
  );
}
