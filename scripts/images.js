import { copyFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const outputDir = path.join(__dirname, "out");

// ここに画像を追加する。
// 文字列だけでも、{ name, data } のオブジェクトでもよい。
// data は以下どれでも可:
// - data:image/png;base64,AAA...
// - AAA... (raw base64)
// - /assets/example.png
// - ./assets/example.png
const layerSources = []

function normalizeSource(source, index) {
  if (typeof source === "string") {
    return {
      name: `layer-${String(index + 1).padStart(2, "0")}`,
      data: source,
      extension: "png"
    };
  }

  if (!source || typeof source.data !== "string") {
    throw new TypeError(`layerSources[${index}] must be a string or an object with a data string.`);
  }

  return {
    name: source.name?.trim() || `layer-${String(index + 1).padStart(2, "0")}`,
    data: source.data,
    extension: source.extension?.trim() || "png"
  };
}

function parseBase64Payload(input, fallbackExtension) {
  const trimmed = input.trim();
  const dataUrlMatch = trimmed.match(/^data:(?<mime>[-\w.+/]+);base64,(?<body>[A-Za-z0-9+/=\s]+)$/);

  if (dataUrlMatch?.groups) {
    const mime = dataUrlMatch.groups.mime.toLowerCase();
    const body = dataUrlMatch.groups.body.replace(/\s+/g, "");
    const inferredExtension = mime.split("/")[1] || fallbackExtension;

    return {
      bytes: Buffer.from(body, "base64"),
      extension: inferredExtension
    };
  }

  const rawBase64 = trimmed.replace(/\s+/g, "");
  return {
    bytes: Buffer.from(rawBase64, "base64"),
    extension: fallbackExtension
  };
}

function looksLikeFilePath(input) {
  return /^[./]/.test(input) || /^[A-Za-z]:[\\/]/.test(input) || input.includes("/");
}

function resolveInputPath(input) {
  if (path.isAbsolute(input)) {
    return path.join(projectRoot, input.replace(/^[/\\]+/, ""));
  }

  return path.resolve(projectRoot, input);
}

function assertDecodedImage(bytes, index) {
  if (!bytes.length) {
    throw new Error(`layerSources[${index}] decoded to an empty file.`);
  }
}

async function main() {
  if (layerSources.length === 0) {
    console.log("No images written. Add base64 strings to layerSources and run `node scripts/images.js`.");
    return;
  }

  await mkdir(outputDir, { recursive: true });

  for (const [index, source] of layerSources.entries()) {
    const normalized = normalizeSource(source, index);
    const isPathInput = looksLikeFilePath(normalized.data) && !normalized.data.startsWith("data:");

    if (isPathInput) {
      const sourcePath = resolveInputPath(normalized.data);
      const extension = path.extname(sourcePath).replace(/^\./, "") || normalized.extension;
      const fileName = `${normalized.name}.${extension}`;
      const filePath = path.join(outputDir, fileName);

      await copyFile(sourcePath, filePath);
      console.log(`Copied ${path.relative(process.cwd(), sourcePath)} -> ${path.relative(process.cwd(), filePath)}`);
      continue;
    }

    const { bytes, extension } = parseBase64Payload(normalized.data, normalized.extension);
    assertDecodedImage(bytes, index);

    const fileName = `${normalized.name}.${extension}`;
    const filePath = path.join(outputDir, fileName);

    await writeFile(filePath, bytes);
    console.log(`Wrote ${path.relative(process.cwd(), filePath)}`);
  }
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
