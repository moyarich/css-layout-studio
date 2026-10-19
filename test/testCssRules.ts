import fs from "node:fs";
import path from "node:path";

import { getCssRules } from "../src/editor/declarations";

function main() {
  const inputFile = process.argv[2] ?? "test/css-v1.css";

  const cssPath = path.resolve(inputFile);

  if (!fs.existsSync(cssPath)) {
    throw new Error(`CSS file not found: ${cssPath}`);
  }

  const css = fs.readFileSync(cssPath, "utf8");

  const rules = getCssRules(css);

  console.dir(rules, {
    depth: null,
    colors: true,
  });
}

main();
