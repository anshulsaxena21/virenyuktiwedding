import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { inflateRawSync } from "node:zlib";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const partsDir = path.join(root, "scripts", "asset-parts");
const partFiles = fs.readdirSync(partsDir).filter((name) => name.endsWith(".b64")).sort();
if (!partFiles.length) throw new Error("Figma asset bundle parts are missing.");
const archive = Buffer.from(partFiles.map((name) => fs.readFileSync(path.join(partsDir, name), "utf8").trim()).join(""), "base64");
let cursor = 0;
let extracted = 0;

while (cursor + 30 <= archive.length && archive.readUInt32LE(cursor) === 0x04034b50) {
  const method = archive.readUInt16LE(cursor + 8);
  const compressedSize = archive.readUInt32LE(cursor + 18);
  const nameLength = archive.readUInt16LE(cursor + 26);
  const extraLength = archive.readUInt16LE(cursor + 28);
  const nameStart = cursor + 30;
  const name = archive.toString("utf8", nameStart, nameStart + nameLength);
  const dataStart = nameStart + nameLength + extraLength;
  const dataEnd = dataStart + compressedSize;
  const compressed = archive.subarray(dataStart, dataEnd);
  const content = method === 0 ? compressed : method === 8 ? inflateRawSync(compressed) : null;
  if (!content) throw new Error(`Unsupported ZIP compression method ${method} for ${name}`);
  if (!name.startsWith("/") && !name.split("/").includes("..")) {
    const destination = path.join(root, "src", "assets", name);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, content);
    extracted += 1;
  }
  cursor = dataEnd;
}
if (!extracted) throw new Error("No Figma assets were extracted.");
console.log(`Prepared ${extracted} supplied Figma image and vector assets.`);
