import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = resolve(SCRIPT_DIR, "..");
const BOOKS_SOURCE = readFileSync(resolve(PROJECT_DIR, "data/books.ts"), "utf8");
const READER_SOURCE = readFileSync(
  resolve(PROJECT_DIR, "components/library/FlipBookReader.tsx"),
  "utf8",
);
const PAGES_SOURCE = readFileSync(resolve(PROJECT_DIR, "lib/library/pages.ts"), "utf8");
const TYPES_SOURCE = readFileSync(resolve(PROJECT_DIR, "lib/library/types.ts"), "utf8");

const manuscript = /const THINKING_FAST_SLOW_PAGES: BookReadingPage\[] = \[([\s\S]*?)\n\];/.exec(BOOKS_SOURCE)?.[1];
assert.ok(manuscript, "Missing Thinking, Fast and Slow manuscript");

const headings = [...manuscript.matchAll(/^\s{4}heading: "([^"]+)",$/gm)].map((match) => match[1]);

test("keeps all 14 Thinking dossier headings in authored order", () => {
  assert.deepEqual(headings, [
    "Trong đầu mình có hai nhịp nghĩ",
    "Cảm giác đúng chưa phải là bằng chứng",
    "Kế hoạch thường đẹp hơn đời thật",
    "Mất, được và chiếc khung quanh lựa chọn",
    "Người đang sống và người kể lại",
    "Phiếu dừng 60 giây",
    "Đừng vội kể một nguyên nhân",
    "Câu chuyện quá tròn thường che phần còn thiếu",
    "Bộ não rất giỏi trả lời nhầm câu hỏi",
    "Kinh nghiệm lâu năm chưa chắc tạo ra trực giác đúng",
    "Mình không nhìn được và mất bằng cùng một đôi mắt",
    "Biết tên thiên kiến chưa đủ để tránh nó",
    "Khiêm tốn trước bất định không có nghĩa là đứng yên",
    "Nghĩ cùng nhau: thêm quy trình, bớt tranh thắng",
  ]);
});

test("keeps a distinctive example and application signature in every dossier", () => {
  [
    "17 × 24 = ?",
    "căn hộ từng được chào giá 5 tỷ",
    "sửa căn phòng trong ba tuần",
    "90% khả năng thành công",
    "cái tôi đang trải nghiệm",
    "Mình thật sự đang quyết định điều gì?",
    "sự hồi quy về mức trung bình",
    "WYSIATI",
    "thinking-question-substitution-table",
    "ĐÈN XANH CHO TRỰC GIÁC",
    "Nhận thêm một triệu đồng",
    "lan can cho quyết định",
    "thinking-decision-speed-matrix",
    "NGHI THỨC RA QUYẾT ĐỊNH NHÓM",
  ].forEach((signature) => {
    assert.ok(manuscript.includes(signature), `Missing Thinking manuscript signature: ${signature}`);
  });
});

test("keeps the authored tables, semantic memory visual, and complete decision matrix", () => {
  [
    "Mình đã biết",
    "Mình chưa biết",
    "Điều gì có thể làm mình đổi ý?",
    "Ứng viên có phù hợp với công việc không?",
    "Dự án có khả thi không?",
    "Khoản đầu tư này có rủi ro cao không?",
    "Người này có đáng tin không?",
    "Cuộn phim",
    "Ghi lại từng khoảnh khắc mình đã sống.",
    "Album ảnh",
    "Chỉ giữ vài khoảnh khắc nổi bật để kể lại.",
    "Quyết nhanh và học nhanh",
    "Chọn màu áo",
    "Kiểm tra ngắn trước khi chốt",
    "Mua thiết bị khó hoàn trả",
    "Thử nhỏ và giới hạn rủi ro",
    "Thử chiến dịch nhỏ",
    "Chậm lại và kiểm tra sâu",
    "Ký hợp đồng dài hạn",
  ].forEach((copy) => {
    assert.ok(READER_SOURCE.includes(copy), `Missing Thinking visual copy: ${copy}`);
  });
  assert.ok(manuscript.includes("[[thinking-film-album-comparison]]"));
  assert.ok(PAGES_SOURCE.includes('"[[thinking-film-album-comparison]]": 1'));
});

test("keeps the cautious editorial endnote and the dossier theme", () => {
  assert.ok(manuscript.includes("GHI CHÚ BIÊN TẬP VÀ ĐỐI CHIẾU"));
  assert.ok(manuscript.includes("người đọc nên quay lại nguyên tác và nguồn nghiên cứu gốc"));
  assert.ok(manuscript.includes("không phải trích dẫn nguyên văn, kết luận chẩn đoán hay lời khuyên chuyên môn"));

  const bookStart = BOOKS_SOURCE.indexOf('slug: "thinking-fast-and-slow"');
  const bookEnd = BOOKS_SOURCE.indexOf("\n  {\n    slug:", bookStart + 1);
  const book = BOOKS_SOURCE.slice(bookStart, bookEnd);
  assert.ok(book.includes('readingTheme: "thinking-dossier"'));
  assert.ok(book.includes("readingPages: { vi: THINKING_FAST_SLOW_PAGES }"));
});

test("preserves physical folios while exposing logical dossier progress", () => {
  assert.ok(TYPES_SOURCE.includes("authoredSection?:"));
  assert.ok(PAGES_SOURCE.includes('readingTheme === "thinking-dossier"'));
  assert.ok(PAGES_SOURCE.includes("index: authoredPageIndex + 1"));
  assert.ok(READER_SOURCE.includes('data-authored-section={page.authoredSection?.index}'));
  assert.ok(READER_SOURCE.includes('className="leaf-thinking-section-label"'));
  assert.ok(READER_SOURCE.includes("Hồ sơ {String(section.index).padStart(2, \"0\")}/{section.total}"));
  assert.ok(READER_SOURCE.includes("<span className=\"leaf-folio\">{folio}</span>"));
});
