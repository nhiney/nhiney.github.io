import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const blogDir = path.join(projectRoot, "content/blog");
const uiDirs = [
  path.join(projectRoot, "app/blog"),
  path.join(projectRoot, "components/blog"),
];

const localeVariantRe = /\.(vi|ja|zh|es|fr|de|ko|ru|pt)\.mdx?$/;
const vietnameseDiacriticRe = /[ăâđêôơưÁÀẢÃẠẮẰẲẴẶẤẦẨẪẬÉÈẺẼẸẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌỐỒỔỖỘỚỜỞỠỢÚÙỦŨỤỨỪỬỮỰÝỲỶỸỴáàảãạắằẳẵặấầẩẫậéèẻẽẹếềểễệíìỉĩịóòỏõọốồổỗộớờởỡợúùủũụứừửữựýỳỷỹỵ]/g;
const letterRe = /[A-Za-zÀ-ỹ]/g;
const vietnameseMarkers = new Set([
  "mình",
  "bạn",
  "không",
  "là",
  "và",
  "có",
  "những",
  "một",
  "trong",
  "được",
  "với",
  "khi",
  "vì",
  "đã",
  "này",
  "đó",
  "người",
  "điều",
  "cảm",
  "thấy",
  "trước",
  "sau",
  "nếu",
  "cũng",
  "cho",
  "như",
  "rằng",
]);

const allowedUiPhrases = [
  "Nguyễn Thị Yến Nhi",
];

function stripFrontmatter(source) {
  return source.replace(/^---\n[\s\S]*?\n---\n?/, "");
}

function isLikelyVietnamese(source) {
  const body = stripFrontmatter(source);
  const diacritics = (body.match(vietnameseDiacriticRe) ?? []).length;
  const letters = (body.match(letterRe) ?? []).length;
  const ratio = letters > 0 ? diacritics / letters : 0;
  const markerCount = body
    .toLowerCase()
    .split(/[^\p{L}]+/u)
    .filter((word) => vietnameseMarkers.has(word)).length;

  return (diacritics >= 40 && markerCount >= 15) || (ratio > 0.035 && markerCount >= 8);
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

function stripComments(source) {
  let output = "";
  let inBlock = false;

  for (const rawLine of source.split("\n")) {
    let line = rawLine;
    let cleaned = "";

    for (let i = 0; i < line.length; i += 1) {
      if (inBlock) {
        const end = line.indexOf("*/", i);
        if (end === -1) break;
        i = end + 1;
        inBlock = false;
        continue;
      }

      if (line.startsWith("/*", i)) {
        inBlock = true;
        i += 1;
        continue;
      }

      if (line.startsWith("//", i)) break;
      cleaned += line[i];
    }

    output += `${cleaned}\n`;
  }

  return output;
}

const files = fs.readdirSync(blogDir);
const baseFiles = files
  .filter((file) => /\.mdx?$/.test(file) && !localeVariantRe.test(file))
  .sort();

const missingVi = [];
const vietnameseBase = [];

for (const file of baseFiles) {
  const slug = file.replace(/\.mdx?$/, "");
  const hasVi = files.includes(`${slug}.vi.mdx`) || files.includes(`${slug}.vi.md`);
  if (!hasVi) missingVi.push(file);

  const source = fs.readFileSync(path.join(blogDir, file), "utf8");
  if (isLikelyVietnamese(source)) vietnameseBase.push(file);
}

const hardcodedUi = [];

for (const dir of uiDirs) {
  for (const file of walk(dir).filter((entry) => /\.(tsx?|jsx?)$/.test(entry))) {
    const relative = path.relative(projectRoot, file);
    const source = stripComments(fs.readFileSync(file, "utf8"));
    source.split("\n").forEach((line, index) => {
      const scrubbed = allowedUiPhrases.reduce(
        (value, phrase) => value.replaceAll(phrase, ""),
        line,
      );
      if (vietnameseDiacriticRe.test(scrubbed)) {
        hardcodedUi.push(`${relative}:${index + 1}: ${line.trim()}`);
      }
    });
  }
}

const problems = [];
if (missingVi.length) {
  problems.push(`Missing Vietnamese variants:\n${missingVi.map((file) => `  - ${file}`).join("\n")}`);
}
if (vietnameseBase.length) {
  problems.push(`Base files that still look Vietnamese:\n${vietnameseBase.map((file) => `  - ${file}`).join("\n")}`);
}
if (hardcodedUi.length) {
  problems.push(`Hard-coded Vietnamese UI strings outside dictionaries/content:\n${hardcodedUi.map((line) => `  - ${line}`).join("\n")}`);
}

if (problems.length) {
  console.error(problems.join("\n\n"));
  process.exit(1);
}

console.log(`Blog i18n audit passed: ${baseFiles.length} base posts, ${files.filter((file) => /\.vi\.mdx?$/.test(file)).length} Vietnamese variants.`);
