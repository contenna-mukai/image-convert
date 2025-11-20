// scripts/convert-to-webp.js
import fs from "fs";
import path from "path";
import sharp from "sharp";

const inputDir = path.resolve("images");
const outputDir = path.resolve("dist");

async function convertToWebp(inputPath, outputPath) {
  await sharp(inputPath).webp({ quality: 80 }).toFile(outputPath);
  console.log(`✅ ${inputPath} → ${outputPath}`);
}

function ensureDirExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function walkDir(currentDir, baseDir) {
  const entries = fs.readdirSync(currentDir, { withFileTypes: true });

  for (const entry of entries) {
    const inputPath = path.join(currentDir, entry.name);
    const relativePath = path.relative(baseDir, inputPath);
    const outputPath = path.join(outputDir, relativePath);

    if (entry.isDirectory()) {
      ensureDirExists(outputPath);
      walkDir(inputPath, baseDir);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (ext === ".png" || ext === ".jpg" || ext === ".jpeg") {
        const webpPath = outputPath.replace(/\.(png|jpg|jpeg)$/i, ".webp");
        convertToWebp(inputPath, webpPath);
      }
    }
  }
}

// 実行開始
ensureDirExists(outputDir);
walkDir(inputDir, inputDir);
