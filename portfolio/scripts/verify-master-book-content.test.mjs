import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = resolve(SCRIPT_DIR, "..");
const BOOKS_SOURCE = readFileSync(resolve(PROJECT_DIR, "data/books.ts"), "utf8");
const SILENCE_MANUSCRIPT_SOURCE = readFileSync(
  resolve(PROJECT_DIR, "data/reading/silenceOfTheLambs.vi.ts"),
  "utf8",
);
const MUON_KIEP_2_MANUSCRIPT_SOURCE = readFileSync(
  resolve(PROJECT_DIR, "data/reading/muonKiepNhanSinh2.vi.ts"),
  "utf8",
);
const LOOP_SOURCE = readFileSync(
  resolve(PROJECT_DIR, "components/library/LoopRestorationPage.tsx"),
  "utf8",
);

function bookBlock(slug) {
  const start = BOOKS_SOURCE.indexOf(`slug: "${slug}"`);
  assert.notEqual(start, -1, `Missing book entry: ${slug}`);
  const next = BOOKS_SOURCE.indexOf("\n  {\n    slug:", start + 1);
  return BOOKS_SOURCE.slice(start, next === -1 ? undefined : next);
}

test("keeps the nine-book collection in the restored master order", () => {
  const orderSource = /const MASTER_COLLECTION_ORDER = \[([\s\S]*?)\] as const;/.exec(BOOKS_SOURCE)?.[1];
  assert.ok(orderSource, "Missing the explicit master collection order");
  const order = [...orderSource.matchAll(/"([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(order, [
    "atomic-habits",
    "dac-nhan-tam",
    "thinking-fast-and-slow",
    "48-laws-of-power",
    "silence-of-the-lambs",
    "goodbye-things",
    "muon-kiep-nhan-sinh-1",
    "muon-kiep-nhan-sinh-2",
    "muon-kiep-nhan-sinh-3",
  ]);
});

test("gives every book a distinct authored reading style", () => {
  const expectedThemes = {
    "atomic-habits": "habit-field-guide",
    "dac-nhan-tam": "conversation-atelier",
    "thinking-fast-and-slow": "thinking-dossier",
    "48-laws-of-power": "power-board",
    "silence-of-the-lambs": "silence-casefile",
    "goodbye-things": "breathing-house",
    "muon-kiep-nhan-sinh-1": "layered-time-map",
    "muon-kiep-nhan-sinh-2": "loop-restoration-workshop",
    "muon-kiep-nhan-sinh-3": "future-ethics-lab",
  };
  const themes = Object.entries(expectedThemes).map(([slug, theme]) => {
    const source = bookBlock(slug);
    assert.ok(
      source.includes(`readingTheme: "${theme}"`),
      `Missing ${theme} for ${slug}`,
    );
    return theme;
  });
  assert.equal(new Set(themes).size, themes.length);
});

test("keeps the full Atomic Habits overview from the supplied master", () => {
  const source = bookBlock("atomic-habits");
  [
    "Vì sao mình thường biết điều nên làm nhưng vẫn khó duy trì?",
    "Đừng chỉ tập trung vào đích đến",
    "Bắt đầu nhỏ để có thể đi xa",
    "Thiết kế môi trường thay vì chỉ dựa vào ý chí",
    "Xây dựng thói quen từ bản sắc mình muốn hướng tới",
    "Một lần lỡ nhịp không có nghĩa là thất bại",
    "Mình có thể tiến bộ từng ngày—nhẹ nhàng, thực tế và bền vững hơn.",
  ].forEach((phrase) => assert.ok(source.includes(phrase), `Missing Atomic master copy: ${phrase}`));
  assert.ok(!source.includes("Chúng ta thường nghĩ muốn thay đổi thì phải bắt đầu"));
});

test("keeps the supplied Silence of the Lambs overview", () => {
  const source = bookBlock("silence-of-the-lambs");
  [
    "Một cuộc đấu trí nghẹt thở, nơi đôi khi điều đáng sợ nhất không nằm trong lời nói—mà ẩn sau một khoảng im lặng.",
    "Clarice Starling không phải một người hùng không biết sợ.",
    "Lòng can đảm không phải là hết sợ",
    "Hannibal Lecter nhắc ta rằng trí thông minh, vẻ lịch thiệp và sức hút không đồng nghĩa với lòng tốt hay sự an toàn.",
    "Đằng sau mỗi manh mối là một con người.",
  ].forEach((phrase) => assert.ok(source.includes(phrase), `Missing Silence master copy: ${phrase}`));
  assert.ok(!source.includes("Một cuộc đấu trí căng thẳng giữa ánh sáng và bóng tối"));
});

test("keeps the manuscript's concise representation safeguard", () => {
  assert.ok(SILENCE_MANUSCRIPT_SOURCE.includes(
    "kẻ gây án hư cấu không đại diện cho người chuyển giới",
  ));
  assert.ok(SILENCE_MANUSCRIPT_SOURCE.includes(
    "không nên gắn bạo lực của nhân vật với họ",
  ));
});

test("uses the master Power introduction instead of an added summary", () => {
  const source = bookBlock("48-laws-of-power");
  assert.ok(source.includes('tagline: "19 lăng kính và 48 nước cờ để hiểu quyền lực mà vẫn giữ được mình"'));
  assert.ok(source.includes('vi: "19 lăng kính và 48 nước cờ để hiểu quyền lực mà vẫn giữ được mình"'));
  assert.ok(source.includes('heading: "Bàn cờ quyền lực"'));
  assert.ok(source.includes("Quyền lực không chỉ nằm trong chức danh hay tiền bạc."));
  assert.ok(source.includes("hiểu để nhìn rõ, tự bảo vệ và tạo ảnh hưởng mà không làm người khác nhỏ đi."));
  assert.ok(!source.includes("Một cuốn sách giúp mình nhìn thấy những “nước đi”"));
  assert.ok(!source.includes("Một cách đọc phản biện về quyền lực, không phải cẩm nang thao túng"));
});

test("restores the missing volume-two series title", () => {
  assert.ok(LOOP_SOURCE.includes("Những vòng lặp có thể được viết lại"));
  assert.ok(LOOP_SOURCE.includes("14 góc nhìn từ"));
  assert.ok(LOOP_SOURCE.includes("Muôn Kiếp Nhân Sinh — Tập 2"));
});

test("keeps the volume-two safety handoff for high-risk loops", () => {
  assert.ok(MUON_KIEP_2_MANUSCRIPT_SOURCE.includes(
    "sang chấn, nghiện, bạo lực hoặc nguy cơ an toàn",
  ));
  assert.ok(MUON_KIEP_2_MANUSCRIPT_SOURCE.includes(
    "Hãy tìm hỗ trợ chuyên môn và ưu tiên một kế hoạch an toàn",
  ));
});

test("keeps the supplied volume-three overview", () => {
  const source = bookBlock("muon-kiep-nhan-sinh-3");
  assert.ok(source.includes("Tập cuối khép lại hành trình của Thomas"));
  assert.ok(source.includes("động cơ của những người đứng phía sau"));
  assert.ok(source.includes("cách mình sử dụng dữ liệu, tiền bạc, sự chú ý"));
  assert.ok(!source.includes("Tập cuối khép hành trình của Thomas"));
  assert.ok(!source.includes("cách mình dùng dữ liệu, tiền bạc, sự chú ý"));
});
