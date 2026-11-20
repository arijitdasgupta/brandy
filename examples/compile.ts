// Sample compile check for brandy. Run with: bun run check
import * as sass from "sass";
import { writeFileSync } from "fs";

const entry = new URL("./sample.scss", import.meta.url).pathname;
const out = new URL("./sample.css", import.meta.url).pathname;

const result = sass.compile(entry, { style: "expanded" });
// Sass strips optional quotes in attribute selectors ([data-theme="dark"] -> [data-theme=dark]),
// so compare without quotes.
const css = result.css.replaceAll('"', "");

const expectations = [
  ":root",
  "@media (prefers-color-scheme: dark)",
  "[data-theme=dark]",
  "[data-theme=light]",
  "--color-background: #ffffff",
  "--color-background: #2a2a2a",
  "header.header .header-inner",
  "main",
  ".post",
  ".post-list",
  ".tag",
  ".lightbox-overlay",
];

const missing = expectations.filter((e) => !css.includes(e.replaceAll('"', "")));
if (missing.length > 0) {
  console.error("FAIL — missing in compiled CSS:");
  for (const m of missing) console.error("  " + m);
  process.exit(1);
}

writeFileSync(out, result.css);
console.log(`OK — ${out} written (${result.css.length} bytes), ${expectations.length}/${expectations.length} checks passed`);
