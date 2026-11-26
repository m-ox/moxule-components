import "@testing-library/jest-dom";
import source from "../components.css?raw";
import themes from "../theme/themes.css?raw";
import demo from "../demo/styles.css?raw";

// Load the same styles shipped to consumers; Vitest strips CSS imports in jsdom.
const style = document.createElement("style");
style.textContent = [source, themes, demo.replace(/^@import[^\n]*$/gm, "")].join("\n");
document.head.append(style);

// jsdom does not invalidate its computed-style cache when focus changes.
// Refresh it so assertions evaluate :focus and :focus-within rules accurately.
for (const event of ["focusin", "focusout"]) {
  document.addEventListener(event, () => {
    document.documentElement.setAttribute("data-focus-cache", "");
    document.documentElement.removeAttribute("data-focus-cache");
  });
}
