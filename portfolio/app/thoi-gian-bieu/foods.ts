// Generic calorie estimates for common Vietnamese foods (not personal data).
// k = kcal per unit u; g = grams in that unit, set only when typing "120g" should scale by weight.
export type Food = { n: string; u: string; k: number; g?: number };

export const FOODS: Food[] = [
  // Tinh bột
  { n: "Cơm trắng", u: "1 chén (150 g)", k: 200, g: 150 },
  { n: "Cơm gạo lứt", u: "1 chén (150 g)", k: 165, g: 150 },
  { n: "Bánh mì nguyên cám", u: "1 lát (30 g)", k: 75, g: 30 },
  { n: "Bánh mì trắng", u: "1 ổ (80 g)", k: 210, g: 80 },
  { n: "Khoai lang luộc", u: "1 củ (150 g)", k: 130, g: 150 },
  { n: "Khoai tây luộc", u: "100 g", k: 85, g: 100 },
  { n: "Bắp luộc", u: "1 trái", k: 150 },
  { n: "Yến mạch", u: "40 g", k: 150, g: 40 },
  { n: "Bún tươi", u: "100 g", k: 110, g: 100 },
  { n: "Xôi", u: "1 gói (200 g)", k: 400, g: 200 },
  // Đạm
  { n: "Trứng gà luộc", u: "1 quả", k: 75 },
  { n: "Trứng chiên", u: "1 quả", k: 110 },
  { n: "Ức gà áp chảo", u: "100 g", k: 165, g: 100 },
  { n: "Đùi gà", u: "100 g", k: 210, g: 100 },
  { n: "Thịt heo nạc", u: "100 g", k: 145, g: 100 },
  { n: "Thịt ba chỉ", u: "100 g", k: 520, g: 100 },
  { n: "Sườn heo", u: "100 g", k: 280, g: 100 },
  { n: "Thịt bò nạc", u: "100 g", k: 150, g: 100 },
  { n: "Cá hồi", u: "100 g", k: 210, g: 100 },
  { n: "Cá basa", u: "100 g", k: 120, g: 100 },
  { n: "Cá thu", u: "100 g", k: 180, g: 100 },
  { n: "Tôm", u: "100 g", k: 100, g: 100 },
  { n: "Đậu hũ", u: "100 g", k: 76, g: 100 },
  { n: "Đậu hũ chiên", u: "100 g", k: 270, g: 100 },
  { n: "Whey protein", u: "1 muỗng (30 g)", k: 120, g: 30 },
  // Rau, trái cây
  { n: "Rau luộc", u: "1 dĩa (150 g)", k: 40, g: 150 },
  { n: "Salad trộn dầu giấm", u: "1 dĩa", k: 120 },
  { n: "Canh rau", u: "1 chén", k: 30 },
  { n: "Dưa leo", u: "1 trái", k: 20 },
  { n: "Cà chua", u: "1 trái", k: 22 },
  { n: "Chuối", u: "1 trái", k: 105 },
  { n: "Táo", u: "1 trái", k: 95 },
  { n: "Cam", u: "1 trái", k: 60 },
  { n: "Xoài", u: "1 trái", k: 200 },
  { n: "Ổi", u: "1 trái", k: 70 },
  { n: "Thanh long", u: "1/2 trái", k: 60 },
  { n: "Dưa hấu", u: "1 miếng (200 g)", k: 60, g: 200 },
  { n: "Bơ", u: "1/2 trái", k: 160 },
  // Món ăn
  { n: "Phở bò", u: "1 tô", k: 450 },
  { n: "Phở gà", u: "1 tô", k: 400 },
  { n: "Bún bò Huế", u: "1 tô", k: 550 },
  { n: "Bún chả", u: "1 phần", k: 600 },
  { n: "Bún riêu", u: "1 tô", k: 450 },
  { n: "Hủ tiếu", u: "1 tô", k: 400 },
  { n: "Miến gà", u: "1 tô", k: 350 },
  { n: "Mì gói", u: "1 gói", k: 350 },
  { n: "Cháo gà", u: "1 tô", k: 300 },
  { n: "Cơm tấm sườn", u: "1 dĩa", k: 650 },
  { n: "Cơm gà", u: "1 dĩa", k: 600 },
  { n: "Cơm chiên", u: "1 dĩa", k: 650 },
  { n: "Bánh mì thịt", u: "1 ổ", k: 450 },
  { n: "Bánh cuốn", u: "1 dĩa", k: 350 },
  { n: "Bánh xèo", u: "1 cái", k: 300 },
  { n: "Gỏi cuốn", u: "1 cuốn", k: 70 },
  { n: "Chả giò", u: "1 cuốn", k: 100 },
  // Sữa, hạt, đồ uống
  { n: "Sữa tươi không đường", u: "1 hộp 180 ml", k: 115 },
  { n: "Sữa tươi có đường", u: "1 hộp 180 ml", k: 140 },
  { n: "Sữa chua không đường", u: "1 hũ", k: 60 },
  { n: "Sữa chua có đường", u: "1 hũ", k: 100 },
  { n: "Sữa đậu nành", u: "1 ly 250 ml", k: 130 },
  { n: "Hạnh nhân", u: "1 nắm (30 g)", k: 170, g: 30 },
  { n: "Hạt điều", u: "1 nắm (30 g)", k: 165, g: 30 },
  { n: "Cà phê đen không đường", u: "1 ly", k: 5 },
  { n: "Cà phê sữa đá", u: "1 ly", k: 150 },
  { n: "Bạc xỉu", u: "1 ly", k: 200 },
  { n: "Trà sữa trân châu", u: "1 ly 500 ml", k: 450 },
  { n: "Nước ngọt", u: "1 lon", k: 140 },
  { n: "Bia", u: "1 lon", k: 150 },
  { n: "Nước mía", u: "1 ly", k: 180 },
  { n: "Sinh tố bơ", u: "1 ly", k: 350 },
  { n: "Dầu ăn", u: "1 muỗng canh", k: 120 },
  { n: "Bánh snack", u: "1 gói", k: 150 },
  { n: "Bánh quy", u: "1 cái", k: 50 },
];

// Lowercase without Vietnamese diacritics, so "com trang" finds "Cơm trắng".
export const fold = (x: string) => x.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[đĐ]/g, "d").toLowerCase().trim();

export const findFood = (name: string) => { const f = fold(name); return f ? FOODS.find((x) => fold(x.n) === f) : undefined; };

// "" -> 1 serving; "1,5" | "0.5" -> servings; "120g" -> grams / unit grams (only when the food has g). 0 = invalid.
export function parseQty(raw: string, food?: Food) {
  const x = raw.trim().toLowerCase().replace(",", ".");
  if (!x) return 1;
  const gm = x.match(/^(\d+(?:\.\d+)?)\s*g$/);
  if (gm) return food?.g ? Number(gm[1]) / food.g : 0;
  const n = Number(x);
  return isFinite(n) && n > 0 ? n : 0;
}
