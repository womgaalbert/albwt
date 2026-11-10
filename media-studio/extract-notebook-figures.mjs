#!/usr/bin/env node
// Extracts the six image/png outputs embedded in the BFRB notebook and writes
// them as plain files so Remotion can show them with staticFile().
//
//   node extract-notebook-figures.mjs [notebook.json] [out-dir]
//
// Defaults: public/assets/bfrb/notebook.json -> public/assets/bfrb/
//
// Output order (documented by the notebook's cells):
//   fig-1 raw sensor channels      fig-2 FFT of a channel
//   fig-3 Random Forest confusion  fig-4 Random Forest multi-class confusion
//   fig-5 XGBoost confusion        fig-6 XGBoost multi-class confusion

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

const notebookPath = process.argv[2] ?? "public/assets/bfrb/notebook.json";
const outDir = process.argv[3] ?? "public/assets/bfrb";

const notebook = JSON.parse(readFileSync(resolve(notebookPath), "utf8"));
const figures = [];
for (const cell of notebook.cells ?? []) {
  for (const output of cell.outputs ?? []) {
    const png = output.data?.["image/png"];
    if (png) figures.push(Buffer.from(png, "base64"));
  }
}

if (figures.length === 0) {
  console.error("No image/png outputs found in the notebook.");
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
figures.forEach((png, i) => {
  const file = resolve(outDir, `fig-${i + 1}.png`);
  writeFileSync(file, png);
  console.log(`wrote ${file} (${png.length} bytes)`);
});
console.log(`extracted ${figures.length} figures`);
