import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = resolve(SCRIPT_DIR, "..");

function readOverviewStats() {
  const program = `
    import { registerHooks } from "node:module";
    registerHooks({ resolve(specifier, context, nextResolve) {
      try { return nextResolve(specifier, context); }
      catch (error) {
        if (specifier.startsWith(".") && !/\\.(?:[cm]?[jt]sx?|json)$/i.test(specifier)) {
          return nextResolve(specifier + ".ts", context);
        }
        throw error;
      }
    }});
    const { LIBRARY_BOOKS } = await import("./data/books.ts?verify-overview-quality");
    console.log(JSON.stringify(LIBRARY_BOOKS.map((book) => {
      const summary = book.outsideSummary?.vi;
      return {
        slug: book.slug,
        tagline: summary?.tagline ?? "",
        heading: summary?.heading ?? "",
        lessonsHeading: summary?.lessonsHeading ?? "",
        numbered: summary?.numbered ?? false,
        introduction: summary?.introduction ?? [],
        lessons: summary?.lessons ?? [],
        conclusion: summary?.conclusion ?? [],
        totalLength: summary ? JSON.stringify(summary).length : 0,
      };
    })));
  `;
  const result = spawnSync(process.execPath, [
    "--no-warnings",
    "--experimental-strip-types",
    "--input-type=module",
    "-e",
    program,
  ], { cwd: PROJECT_DIR, encoding: "utf8" });

  assert.equal(result.status, 0, result.stderr || result.error?.message);
  return JSON.parse(result.stdout.trim());
}

test("gives all nine books a substantial, authored Vietnamese overview", () => {
  const books = readOverviewStats();
  assert.equal(books.length, 9);

  books.forEach((book) => {
    assert.ok(book.tagline.length >= 60, `${book.slug}: tagline is too short`);
    assert.ok(book.tagline.length <= 160, `${book.slug}: tagline may crowd the opening`);
    assert.ok(book.heading.length >= 12, `${book.slug}: heading is too generic`);
    assert.ok(book.heading.length <= 72, `${book.slug}: heading may wrap excessively`);
    assert.notEqual(book.heading, "Ý chính", `${book.slug}: heading must carry its own voice`);
    assert.notEqual(book.heading, "Giá trị cốt lõi", `${book.slug}: heading must carry its own voice`);
    assert.ok(book.lessonsHeading.length >= 20, `${book.slug}: missing lesson framing`);
    assert.ok(book.lessonsHeading.length <= 72, `${book.slug}: lesson framing may wrap excessively`);
    assert.equal(book.numbered, true, `${book.slug}: overview journey must stay ordered`);
    assert.ok(book.introduction.length >= 2, `${book.slug}: needs a real opening`);
    assert.equal(book.lessons.length, 5, `${book.slug}: expected five focused values`);
    assert.ok(book.conclusion.length >= 2, `${book.slug}: needs a considered ending`);
    assert.ok(book.totalLength >= 2_500, `${book.slug}: overview remains too thin`);
  });
});

test("keeps every overview lesson useful without shrinking the cover typography", () => {
  const books = readOverviewStats();

  books.forEach((book) => {
    book.lessons.forEach((lesson, index) => {
      assert.ok(
        lesson.heading.length >= 20,
        `${book.slug} lesson ${index + 1}: heading is too vague`,
      );
      assert.ok(
        lesson.paragraph?.length >= 120,
        `${book.slug} lesson ${index + 1}: needs an example or application`,
      );
      assert.ok(
        lesson.paragraph.length <= 240,
        `${book.slug} lesson ${index + 1}: should fit one readable overview slide`,
      );
    });
  });
});

test("preserves the critical-reading boundaries on sensitive books", () => {
  const books = readOverviewStats();
  const bySlug = Object.fromEntries(books.map((book) => [book.slug, book]));
  const text = (slug) => JSON.stringify(bySlug[slug]);

  assert.match(text("48-laws-of-power"), /không làm người khác nhỏ đi|quyền lựa chọn/);
  assert.match(text("silence-of-the-lambs"), /không đại diện.*người chuyển giới/);
  assert.match(text("goodbye-things"), /không phải tiêu chuẩn đạo đức|Đừng tự ý dọn đồ/);
  assert.match(text("muon-kiep-nhan-sinh-1"), /không phải kết luận lịch sử hay khoa học/);
  assert.match(text("muon-kiep-nhan-sinh-2"), /không thay thế bác sĩ|không thay thế.*pháp luật/);
  assert.match(text("muon-kiep-nhan-sinh-3"), /tên người và tên tổ chức|trách nhiệm/);
});
