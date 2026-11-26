import { useLocation, Link as RouterLink } from "react-router-dom";
import { Card, Section, Sitemap } from "../../../../index";
import { appSitemap } from "../../../navigation";

export function AppSitemap() {
  const { pathname } = useLocation();
  return <Section title="App paths" headingLevel="h2" headingProps={{ className: "mx-demo-section-title" }}>
    <Card className="mx-demo-card"><Sitemap items={appSitemap} currentPath={pathname} renderLink={(item) => <RouterLink to={item.href}>{item.label}</RouterLink>} /></Card>
  </Section>;
}
