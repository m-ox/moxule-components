import { readFile, readdir, mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const visited = new Set();
const notices = [];

async function visit(name, parent) {
  const resolver = createRequire(join(parent, "package.json"));
  let directory;
  let metadata;
  for (const location of resolver.resolve.paths(name) ?? []) {
    try {
      const candidate = join(location, name);
      metadata = JSON.parse(await readFile(join(candidate, "package.json"), "utf8"));
      directory = candidate;
      break;
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }
  if (!directory) throw new Error(`Cannot locate bundled dependency ${name}`);
  if (visited.has(directory)) return;
  visited.add(directory);
  const files = (await readdir(directory, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && /^(licen[cs]e|copying|notice)(?:$|[._-])/i.test(entry.name));
  if (!files.length) throw new Error(`Missing license notice for ${metadata.name}`);
  const texts = await Promise.all(files.map((entry) => readFile(join(directory, entry.name), "utf8")));
  notices.push({ name: `${metadata.name}@${metadata.version}`, text: texts.join("\n\n") });
  for (const dependency of Object.keys(metadata.dependencies ?? {})) await visit(dependency, directory);
}

// These ESM-only packages and their dependency trees are bundled into both formats.
await visit("react-markdown", root);
await visit("remark-gfm", root);
await mkdir(join(root, "dist"), { recursive: true });
const text = "Third-party notices for the bundled Markdown renderer.\n\n" + notices
  .sort((a, b) => a.name.localeCompare(b.name))
  .map((notice) => `${notice.name}\n${"=".repeat(notice.name.length)}\n\n${notice.text}`)
  .join("\n\n");
await writeFile(join(root, "dist", "THIRD_PARTY_NOTICES.txt"), text);
