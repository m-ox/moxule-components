import { DemoProvider } from "./DemoProvider";
import { NavRouter } from "./NavRouter";
import { NudgeProvider } from "../index";

export function App() {
  return <DemoProvider><NudgeProvider><NavRouter /></NudgeProvider></DemoProvider>;
}
