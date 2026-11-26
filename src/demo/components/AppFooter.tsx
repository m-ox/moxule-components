import { Link as RouterLink } from "react-router-dom";
import { Footer, Link } from "../../index";

export function AppFooter() {
  return (
    <Footer layout="centered" position="natural">
      <Link asChild color="inherit"><RouterLink to="/">Overview</RouterLink></Link>
      <Link asChild color="inherit"><RouterLink to="/#theme-colors">Themes</RouterLink></Link>
      <Link asChild color="inherit"><RouterLink to="/#general-components">Components</RouterLink></Link>
    </Footer>
  );
}
