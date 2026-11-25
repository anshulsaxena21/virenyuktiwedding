import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const archive = path.join(root, "WhatsApp-UI-Screens-Community-react-css.zip");
if (!fs.existsSync(archive)) throw new Error("The supplied Figma asset ZIP is missing from the repository.");

const temp = fs.mkdtempSync(path.join(os.tmpdir(), "viren-yukti-"));
try {
  execFileSync("unzip", ["-q", archive, "-d", temp]);
  const imagesIn = path.join(temp, "assets", "images");
  const vectorsIn = path.join(temp, "assets", "vectors");
  const imagesOut = path.join(root, "src", "assets", "images");
  const vectorsOut = path.join(root, "src", "assets", "vectors");
  const componentsOut = path.join(root, "src", "components");
  fs.mkdirSync(imagesOut, { recursive: true });
  fs.mkdirSync(vectorsOut, { recursive: true });
  fs.mkdirSync(componentsOut, { recursive: true });

  for (const name of fs.readdirSync(imagesIn)) fs.copyFileSync(path.join(imagesIn, name), path.join(imagesOut, name));
  for (const name of fs.readdirSync(vectorsIn)) fs.copyFileSync(path.join(vectorsIn, name), path.join(vectorsOut, name));

  let jsx = fs.readFileSync(path.join(temp, "code", "FigmaExport.jsx"), "utf8");
  jsx = jsx.replace('import React from "react";', 'import React, { useEffect, useState } from "react";');
  const start = 'export default function FigmaExport() {\n  return (\n    <main className="figma-1119-3">';
  const wrappedStart = 'const DESIGN_WIDTH = 1440;\nconst DESIGN_HEIGHT = 9531.1904296875;\n\nexport default function FigmaExport() {\n  const getScale = () => typeof window === "undefined" ? 1 : Math.min(window.innerWidth / DESIGN_WIDTH, 1);\n  const [scale, setScale] = useState(getScale);\n  useEffect(() => {\n    const updateScale = () => setScale(getScale());\n    window.addEventListener("resize", updateScale, { passive: true });\n    return () => window.removeEventListener("resize", updateScale);\n  }, []);\n  return (\n    <div className="figma-stage" style={{ height: `${DESIGN_HEIGHT * scale}px` }}>\n      <main className="figma-1119-3" style={{ transform: `translateX(-50%) scale(${scale})` }}>';
  if (!jsx.includes(start)) throw new Error("Could not locate the original Figma component entry point.");
  jsx = jsx.replace(start, wrappedStart);
  if (!/<\/main>\s*\);\s*}\s*$/.test(jsx)) throw new Error("Could not locate the original Figma component closing tag.");
  jsx = jsx.replace(/<\/main>\s*\);\s*}\s*$/, '</main>\n    </div>\n  );\n}\n');
  fs.writeFileSync(path.join(componentsOut, "FigmaExport.jsx"), jsx);

  let css = fs.readFileSync(path.join(temp, "code", "FigmaExport.css"), "utf8");
  css = css.replace(/url\(["']?\.\.\/assets\/images\/([^"')]+)["']?\)/g, (whole, sourceName) => {
    const match = sourceName.match(/^(\d+)-(.*)$/);
    if (!match) throw new Error(`Unexpected image path in Figma CSS: ${sourceName}`);
    const padded = `${String(Number(match[1])).padStart(3, "0")}-${match[2]}`;
    if (!fs.existsSync(path.join(imagesOut, padded))) throw new Error(`Missing supplied image asset: ${padded}`);
    return `url("../assets/images/${padded}")`;
  });
  const rootRule = '.figma-1119-3 {\n  position: relative;\n  width: 100%;\n  min-height: 100vh;';
  const stageRule = '.figma-stage {\n  position: relative;\n  width: 100%;\n  overflow: hidden;\n}\n\n.figma-1119-3 {\n  position: absolute;\n  left: 50%;\n  top: 0;\n  width: 1440px;\n  height: 9531.1904296875px;\n  transform-origin: top center;';
  if (!css.includes(rootRule)) throw new Error("Could not locate the Figma artboard root CSS rule.");
  css = css.replace(rootRule, stageRule);
  // Keep Figma text nodes above overlapping image-fill rectangles and decorative artwork.
  // The Figma export names each node class using its numeric node ID (e.g. 1119:20 -> figma-1119-20).
  const layerJsonPath = path.join(root, "layer-descriptions virenyuktiwedding.json");
  if (!fs.existsSync(layerJsonPath)) throw new Error("Figma layer-description JSON is missing.");
  const designLayers = JSON.parse(fs.readFileSync(layerJsonPath, "utf8"));
  const textLayerRules = designLayers
    .filter(layer => layer.type === "TEXT" && layer.text)
    .map(layer => {
      const className = `.figma-${layer.id.replace(/:/g, "-")}`;
      return `${className} { z-index: 9999 !important; background-color: transparent !important; }\n`;
    }).join("");
  css += "\\n/* Figma text-over-image stacking correction */\\n" + textLayerRules;
  fs.writeFileSync(path.join(componentsOut, "FigmaExport.css"), css);

  const manifest = {
    images: fs.readdirSync(imagesOut).sort(),
    vectors: fs.readdirSync(vectorsOut).sort()
  };
  fs.writeFileSync(path.join(root, "src", "assets", "asset-manifest.json"), JSON.stringify(manifest, null, 2) + "\n");

  const design = path.join(root, "design");
  fs.mkdirSync(design, { recursive: true });
  for (const [source, destination] of [
    ["layer-descriptions virenyuktiwedding.csv", "layer-descriptions.csv"],
    ["layer-descriptions virenyuktiwedding.json", "layer-descriptions.json"],
    ["figma-tokens virenyuktiwedding.css", "figma-tokens.css"]
  ]) {
    const from = path.join(root, source);
    if (fs.existsSync(from)) fs.copyFileSync(from, path.join(design, destination));
  }
  fs.mkdirSync(path.join(root, "public"), { recursive: true });
  fs.writeFileSync(path.join(root, "public", ".nojekyll"), "");
  console.log(`Prepared original Figma composition, ${manifest.images.length} images and ${manifest.vectors.length} SVG assets.`);
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
