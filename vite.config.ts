import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

function themeStyles(): Plugin {
  const run = promisify(execFile);
  const generator = fileURLToPath(new URL("./scripts/generate-theme-css.mjs", import.meta.url));
  const sources = new Set([
    "./src/theme/theme.ts",
    "./src/theme/cssVariables.ts",
    "./src/system/fonts.ts"
  ].map((path) => fileURLToPath(new URL(path, import.meta.url))));
  const generate = async () => { await run(process.execPath, [generator]); };

  return {
    name: "moxule-theme-styles",
    buildStart: generate,
    async handleHotUpdate({ file }) {
      // Vite reloads the generated stylesheet after the palette changes.
      if (sources.has(file)) await generate();
    }
  };
}

export default defineConfig({
  plugins: [themeStyles(), react()]
});
