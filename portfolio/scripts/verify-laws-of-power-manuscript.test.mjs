import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = resolve(SCRIPT_DIR, "..");

const PART_ONE_SOURCE = readFileSync(
  resolve(PROJECT_DIR, "data/reading/lawsOfPowerPartOne.vi.ts"),
  "utf8",
);
const CARDS_SOURCE = readFileSync(
  resolve(PROJECT_DIR, "data/reading/lawsOfPowerCards.vi.ts"),
  "utf8",
);
const PRACTICE_SOURCE = readFileSync(
  resolve(PROJECT_DIR, "data/reading/lawsOfPowerPractice.vi.ts"),
  "utf8",
);

const LENS_TITLES = [
  "Mở bàn: đây là bản đồ, không phải mệnh lệnh",
  "Nước cờ đầu tiên: đọc lại Luật 1",
  "Khéo léo mà không tự xóa mình",
  "Khi cuốn sách trở thành một tấm khiên",
  "La bàn quyền lực",
  "Danh tiếng và năng lực thật",
  "Không phải căn phòng nào cũng là bàn cờ",
  "Đọc 48 nguyên tắc mà không bị chúng nuốt chửng",
  "Có năng lực đôi khi vẫn chưa đủ",
  "Im lặng: khoảng nghĩ hay một đòn ép?",
  "Được cần đến mà không khiến người khác mắc kẹt",
  "Không phải bất đồng nào cũng cần một người thua",
  "Đi hết một quyết định trong đầu trước khi bước",
  "Đám đông thường chạm vào phần cô đơn trong mình",
  "Mềm dẻo không có nghĩa là không có xương sống",
  "Điều thật sự mang ra khỏi 48 luật",
  "Phía sau nhu cầu kiểm soát có thể là một nỗi sợ",
  "Quyền lực khó nhất là không để nó sửa lại mình",
  "Một trang giấy cho lúc mình thấy lép vế",
];

const CARD_TITLES = [
  "Đừng vô tình làm lu mờ người đang nắm quyền",
  "Đừng trao niềm tin chỉ dựa trên sự thân thiết",
  "Không cần công bố mọi ý định quá sớm",
  "Nói vừa đủ để lời nói còn trọng lượng",
  "Danh tiếng là tài sản được xây bằng hành vi lặp lại",
  "Nếu không được nhìn thấy, giá trị dễ bị bỏ qua",
  "Biết tận dụng nguồn lực, nhưng đừng đánh cắp công lao",
  "Tạo giá trị để người khác chủ động tìm đến",
  "Kết quả có sức thuyết phục hơn tranh cãi dài",
  "Giữ khoảng cách với những vòng xoáy phá hoại",
  "Trở nên có giá trị, không tạo ra con tin",
  "Một hành động chân thành có thể hạ bớt phòng thủ",
  "Khi nhờ giúp đỡ, hãy nói rõ lợi ích chung",
  "Quan sát kỹ trước khi đặt niềm tin",
  "Giải quyết tận gốc mối đe dọa, không nuôi xung đột âm ỉ",
  "Khoảng cách có thể làm giá trị trở nên rõ hơn",
  "Một chút khó đoán có thể ngăn người khác xem thường",
  "Đừng tự cô lập trong pháo đài của mình",
  "Biết mình đang làm việc với ai",
  "Đừng trao toàn bộ quyền lựa chọn cho một phe",
  "Đừng để nhu cầu chứng minh mình thông minh làm lộ hết bài",
  "Khi đang yếu, lùi một bước có thể tạo thêm thời gian",
  "Tập trung nguồn lực vào nơi tạo khác biệt lớn nhất",
  "Hiểu cách vận hành của căn phòng",
  "Chủ động định hình con người mình muốn trở thành",
  "Giữ tay sạch không có nghĩa né trách nhiệm",
  "Con người rất cần một điều để tin",
  "Khi đã đủ căn cứ, hãy hành động dứt khoát",
  "Lập kế hoạch đến cả đoạn kết",
  "Để kết quả trông gọn gàng, nhưng đừng che giấu công sức",
  "Cách thiết kế lựa chọn có thể định hướng quyết định",
  "Khát vọng thường mạnh hơn sự thật khô khan",
  "Hiểu điều thật sự thúc đẩy một người",
  "Cách mình tự đối xử dạy người khác cách đối xử với mình",
  "Đúng việc nhưng sai thời điểm vẫn có thể thất bại",
  "Đừng để thứ không thể có tiếp tục kiểm soát mình",
  "Hình ảnh mạnh giúp thông điệp được ghi nhớ",
  "Giữ suy nghĩ riêng nhưng hiểu bối cảnh chung",
  "Người mất bình tĩnh thường để lộ nhiều hơn",
  "Món miễn phí thường vẫn có một cái giá",
  "Đừng sống mãi dưới cái bóng của người đi trước",
  "Tìm đúng nguồn tạo ra sự hỗn loạn",
  "Muốn ảnh hưởng, hãy hiểu cả lý trí lẫn cảm xúc",
  "Chiếc gương khiến hành vi trở nên nhìn thấy được",
  "Thay đổi quá nhiều cùng lúc dễ tạo phản kháng",
  "Đừng tạo cảm giác mình hoàn hảo đến mức không thể gần",
  "Thắng rồi vẫn phải biết dừng",
  "Giữ hình dạng linh hoạt",
];

test("restores the supplied 19-angle Power Board narrative in order", () => {
  assert.ok(PART_ONE_SOURCE.includes("19 góc nhìn để nhận ra cuộc chơi mà không đánh mất mình"));
  assert.ok(PART_ONE_SOURCE.includes("CÁCH ĐỌC BA LỚP"));

  const titles = [...PART_ONE_SOURCE.matchAll(/heading: "Lăng kính \d+ — ([^"]+)"/g)].map(
    (match) => match[1],
  );
  assert.deepEqual(titles, LENS_TITLES);
});

test("keeps all 48 supplied principles, with their recognisable wording and order", () => {
  assert.ok(CARDS_SOURCE.includes("48 thẻ nước đi — Nhìn rõ quyền lực mà không đánh mất mình"));

  const cards = [...CARDS_SOURCE.matchAll(/### Nước cờ (\d+) — ([^`]+)`/g)].map((match) => ({
    number: Number(match[1]),
    title: match[2],
  }));

  assert.equal(cards.length, 48);
  assert.deepEqual(
    cards.map(({ number }) => number),
    Array.from({ length: 48 }, (_, index) => index + 1),
  );
  assert.deepEqual(
    cards.map(({ title }) => title),
    CARD_TITLES,
  );
});

test("preserves the eight distinct Power Board rounds and their visual markers", () => {
  for (let round = 1; round <= 8; round += 1) {
    assert.ok(CARDS_SOURCE.includes(`[[power-round:${round}|`), `Missing Power round ${round}`);
  }

  [
    "[[power-value-dependency-diagram]]",
    "[[power-caution-spectrum-diagram]]",
    "[[power-position-mindmap]]",
    "[[power-plan-stop-diagram]]",
    "[[power-decision-console-diagram]]",
    "[[power-six-images-diagram]]",
    "[[power-change-flow-diagram]]",
    "[[power-victory-stop-diagram]]",
    "[[power-core-flex-mindmap]]",
  ].forEach((marker) => assert.ok(CARDS_SOURCE.includes(marker), `Missing Power visual: ${marker}`));
});

test("keeps the seven-day practice and the ethical closing", () => {
  const days = [...PRACTICE_SOURCE.matchAll(/### Ngày (\d+) —/g)].map((match) => Number(match[1]));
  assert.deepEqual(days, [1, 2, 3, 4, 5, 6, 7]);
  assert.ok(PRACTICE_SOURCE.includes("Tỉnh táo để không bị thao túng."));
  assert.ok(PRACTICE_SOURCE.includes("Tử tế để không biến mình thành điều từng phải đề phòng."));
});
