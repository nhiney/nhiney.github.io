import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = resolve(SCRIPT_DIR, "..");
const BOOKS_SOURCE = readFileSync(resolve(PROJECT_DIR, "data/books.ts"), "utf8");
const CSS_SOURCE = readFileSync(resolve(PROJECT_DIR, "app/globals.css"), "utf8");

const manuscriptStart = BOOKS_SOURCE.indexOf("const DAC_NHAN_TAM_PAGES");
const manuscriptEnd = BOOKS_SOURCE.indexOf(
  "const THINKING_FAST_SLOW_PAGES",
  manuscriptStart,
);
const MANUSCRIPT_SOURCE = BOOKS_SOURCE.slice(manuscriptStart, manuscriptEnd);

const bookStart = BOOKS_SOURCE.indexOf('slug: "dac-nhan-tam"');
const bookEnd = BOOKS_SOURCE.indexOf("\n  {\n    slug:", bookStart + 1);
const BOOK_SOURCE = BOOKS_SOURCE.slice(bookStart, bookEnd);

test("keeps the curated Đắc Nhân Tâm edition at fourteen focused chapters", () => {
  const headings = [...MANUSCRIPT_SOURCE.matchAll(/\n    heading: "([^"]+)",/g)].map(
    (match) => match[1],
  );
  assert.equal(headings.length, 14);
});

test("covers all four core human-relations groups without turning them into tactics", () => {
  [
    "giao tiếp mà không tạo phòng vệ",
    "tạo thiện cảm bằng sự quan tâm thật",
    "thuyết phục bằng hợp tác",
    "lãnh đạo mà vẫn giữ thể diện cho người khác",
    "Kỹ năng giao tiếp chỉ thật sự có giá trị",
    "không phải khi một người dùng nó để điều khiển người còn lại",
  ].forEach((phrase) =>
    assert.ok(MANUSCRIPT_SOURCE.includes(phrase), `Missing Đắc Nhân Tâm coverage: ${phrase}`),
  );
});

test("adds concrete co-design and evidence-based persuasion practice", () => {
  [
    "Biến thuyết phục thành đồng thiết kế",
    "Mục tiêu là giảm việc gấp vào cuối tuần.",
    "người bị ảnh hưởng được bổ sung dữ kiện, sửa phương án",
    "Một bản thử nhỏ, hình ảnh trước–sau hoặc ví dụ cụ thể",
    "minh họa làm sự thật rõ hơn, không che phần chi phí hay rủi ro",
  ].forEach((phrase) =>
    assert.ok(MANUSCRIPT_SOURCE.includes(phrase), `Missing ethical persuasion practice: ${phrase}`),
  );
});

test("adds leadership feedback that preserves dignity and a real path to improve", () => {
  [
    "Trao một kỳ vọng người khác có thể bước tới",
    "Ba báo cáo trước bạn kiểm tra số liệu rất chắc.",
    "trao quyền chọn cách sửa",
    "góp ý riêng và công nhận tiến bộ sớm",
    "an toàn, gian lận hoặc gây hại lặp lại",
  ].forEach((phrase) =>
    assert.ok(MANUSCRIPT_SOURCE.includes(phrase), `Missing leadership application: ${phrase}`),
  );
});

test("surfaces the four groups consistently on the outside summary", () => {
  [
    "Giao tiếp mà không tạo phòng vệ",
    "Tạo thiện cảm bằng sự chú ý thật",
    "Thuyết phục bằng hợp tác",
    "Lãnh đạo bằng câu hỏi, kỳ vọng rõ và phản hồi có đường sửa",
    "không biến giao tiếp thành công cụ thao túng",
  ].forEach((phrase) =>
    assert.ok(BOOK_SOURCE.includes(phrase), `Missing Đắc Nhân Tâm summary copy: ${phrase}`),
  );
});

test("uses a distinct conversation-atelier visual language", () => {
  assert.ok(BOOK_SOURCE.includes('readingTheme: "conversation-atelier"'));
  assert.ok(CSS_SOURCE.includes('.flip-page[data-theme="conversation-atelier"]'));
  assert.ok(CSS_SOURCE.includes('data-reader-theme="conversation-atelier"'));
});
