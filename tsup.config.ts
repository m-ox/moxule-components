import { defineConfig } from "tsup";

export default defineConfig({
  // Bundle the ESM-only renderer so both published ESM and CommonJS builds work.
  noExternal: ["react-markdown", "remark-gfm"],
  onSuccess: "node scripts/generate-third-party-notices.mjs"
});
