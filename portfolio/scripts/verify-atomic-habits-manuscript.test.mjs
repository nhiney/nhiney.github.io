import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = resolve(SCRIPT_DIR, "..");
const BOOKS_SOURCE = readFileSync(resolve(PROJECT_DIR, "data/books.ts"), "utf8");
const PAGES_SOURCE = readFileSync(resolve(PROJECT_DIR, "lib/library/pages.ts"), "utf8");
const READER_SOURCE = readFileSync(
  resolve(PROJECT_DIR, "components/library/FlipBookReader.tsx"),
  "utf8",
);
const CSS_SOURCE = readFileSync(resolve(PROJECT_DIR, "app/globals.css"), "utf8");

const manuscriptStart = BOOKS_SOURCE.indexOf("const ATOMIC_HABITS_PAGES");
const manuscriptEnd = BOOKS_SOURCE.indexOf("const MASTER_COLLECTION_ORDER", manuscriptStart);
const MANUSCRIPT_SOURCE = BOOKS_SOURCE.slice(manuscriptStart, manuscriptEnd);

const bookStart = BOOKS_SOURCE.indexOf('slug: "atomic-habits"');
const bookEnd = BOOKS_SOURCE.indexOf("\n  {\n    slug:", bookStart + 1);
const BOOK_SOURCE = BOOKS_SOURCE.slice(bookStart, bookEnd);

test("keeps the Atomic Habits field guide at nineteen focused sections", () => {
  const headings = [...MANUSCRIPT_SOURCE.matchAll(/\n    heading: "([^"]+)",/g)].map(
    (match) => match[1],
  );
  assert.equal(headings.length, 19);
  assert.equal(headings[0], "La bàn — mình muốn trở thành ai?");
  assert.equal(headings.at(-1), "Quay lại — kỹ năng quan trọng hơn một chuỗi hoàn hảo");
});

test("covers the official habit framework and the practical recovery layer", () => {
  [
    "Kết quả",
    "Quy trình",
    "Bản sắc",
    "Tín hiệu",
    "Mong muốn",
    "Hành động",
    "Phần thưởng",
    "Bốn nguyên tắc thay đổi hành vi",
    "Thiết kế môi trường",
    "Bắt đầu trong hai phút",
    "Theo dõi để học",
    "kỹ năng quan trọng hơn một chuỗi hoàn hảo",
  ].forEach((phrase) =>
    assert.ok(MANUSCRIPT_SOURCE.includes(phrase), `Missing Atomic Habits coverage: ${phrase}`),
  );
});

test("separates implementation intentions from habit stacking", () => {
  assert.ok(MANUSCRIPT_SOURCE.includes("**Ý định thực hiện:**"));
  assert.ok(MANUSCRIPT_SOURCE.includes("**Xếp chồng thói quen:**"));
  assert.ok(MANUSCRIPT_SOURCE.includes("Vào **[thời gian]**, tại **[địa điểm]**"));
  assert.ok(MANUSCRIPT_SOURCE.includes("Sau khi **[thói quen hiện tại]**"));
  assert.ok(
    !MANUSCRIPT_SOURCE.includes(
      "Sau khi **[việc mình vẫn làm]**, tại **[địa điểm]**, mình sẽ **[hành động nhỏ]**",
    ),
  );
});

test("adds concrete examples for all four laws without shame-based advice", () => {
  [
    "[[four-laws-practice-board]]",
    "chỉ nghe chương trình yêu thích trong lúc đi bộ",
    "một dấu hoàn thành",
    "tăng ma sát khi thực hiện",
    "khiến hệ quả trở nên rõ ràng hơn",
    "Đừng dùng mua sắm bốc đồng",
  ].forEach((phrase) =>
    assert.ok(MANUSCRIPT_SOURCE.includes(phrase), `Missing four-laws application: ${phrase}`),
  );
});

test("uses a varied money example and retains the editorial provenance note", () => {
  [
    "tiết kiệm mà không chờ cuối tháng",
    "chuyển tự động một khoản phù hợp",
    "Bản sắc mình muốn xây",
    "phần tóm tắt chính thức của James Clear",
    "phần biên tập để người đọc dễ áp dụng",
  ].forEach((phrase) =>
    assert.ok(MANUSCRIPT_SOURCE.includes(phrase), `Missing editorial addition: ${phrase}`),
  );
});

test("wires Atomic Habits to its own readable visual language", () => {
  assert.ok(BOOK_SOURCE.includes('readingTheme: "habit-field-guide"'));
  assert.ok(PAGES_SOURCE.includes('"[[four-laws-practice-board]]"'));
  assert.ok(PAGES_SOURCE.includes("theme: readingTheme"));
  assert.ok(READER_SOURCE.includes("function FourLawsPracticeBoard"));
  assert.ok(READER_SOURCE.includes('readerTheme === "habit-field-guide"'));
  assert.ok(CSS_SOURCE.includes('.flip-page[data-theme="habit-field-guide"]'));
  assert.ok(CSS_SOURCE.includes(".leaf-habit-laws"));
});
