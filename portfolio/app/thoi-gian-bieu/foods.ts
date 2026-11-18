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
  { n: "Trứng luộc", u: "1 quả", k: 75 },
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
  { n: "Sữa chua", u: "1 hũ (có đường)", k: 100 },
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

  // Tinh bột (thêm)
  { n: "Cháo trắng", u: "1 tô", k: 150 },
  { n: "Bánh phở", u: "100 g", k: 110, g: 100 },
  { n: "Mì trứng luộc", u: "100 g", k: 140, g: 100 },
  { n: "Mì Ý luộc", u: "100 g", k: 158, g: 100 },
  { n: "Nui luộc", u: "100 g", k: 155, g: 100 },
  { n: "Miến luộc", u: "100 g", k: 90, g: 100 },
  { n: "Bánh tráng", u: "1 cái (10 g)", k: 35, g: 10 },
  { n: "Bánh mì sandwich", u: "1 lát (30 g)", k: 80, g: 30 },
  { n: "Bánh mì que", u: "1 cái", k: 110 },
  { n: "Bánh bao nhân thịt", u: "1 cái", k: 300 },
  { n: "Bánh bao chay", u: "1 cái", k: 200 },
  { n: "Bánh giò", u: "1 cái", k: 350 },
  { n: "Bánh chưng", u: "1 miếng (150 g)", k: 345, g: 150 },
  { n: "Bánh tét", u: "1 khoanh (100 g)", k: 230, g: 100 },
  { n: "Khoai môn luộc", u: "100 g", k: 112, g: 100 },
  { n: "Sắn (khoai mì) luộc", u: "100 g", k: 160, g: 100 },
  { n: "Cơm nắm", u: "1 cái", k: 200 },
  { n: "Granola", u: "40 g", k: 190, g: 40 },

  // Đạm (thêm)
  { n: "Trứng vịt luộc", u: "1 quả", k: 130 },
  { n: "Trứng vịt lộn", u: "1 quả", k: 180 },
  { n: "Trứng cút", u: "1 quả", k: 15 },
  { n: "Ức gà luộc", u: "100 g", k: 155, g: 100 },
  { n: "Gà luộc (có da)", u: "100 g", k: 200, g: 100 },
  { n: "Cánh gà chiên", u: "1 cái", k: 160 },
  { n: "Gà rán", u: "1 miếng", k: 300 },
  { n: "Chân gà", u: "100 g", k: 215, g: 100 },
  { n: "Thịt heo luộc", u: "100 g", k: 190, g: 100 },
  { n: "Thịt kho trứng", u: "1 phần", k: 450 },
  { n: "Sườn ram", u: "1 phần", k: 350 },
  { n: "Chả lụa (giò lụa)", u: "100 g", k: 140, g: 100 },
  { n: "Chả cá chiên", u: "100 g", k: 200, g: 100 },
  { n: "Lạp xưởng", u: "1 cây", k: 200 },
  { n: "Xúc xích", u: "1 cây", k: 100 },
  { n: "Pate", u: "30 g", k: 100, g: 30 },
  { n: "Thịt bò xào rau", u: "1 dĩa", k: 300 },
  { n: "Bò bít tết", u: "150 g", k: 350, g: 150 },
  { n: "Bò lúc lắc", u: "1 dĩa", k: 400 },
  { n: "Cá kho", u: "1 phần", k: 250 },
  { n: "Cá chiên", u: "100 g", k: 230, g: 100 },
  { n: "Cá hấp", u: "100 g", k: 120, g: 100 },
  { n: "Cá ngừ hộp ngâm nước", u: "100 g", k: 116, g: 100 },
  { n: "Mực hấp", u: "100 g", k: 90, g: 100 },
  { n: "Mực xào", u: "1 dĩa", k: 250 },
  { n: "Tôm rim", u: "1 phần", k: 200 },
  { n: "Cua hấp", u: "100 g", k: 100, g: 100 },
  { n: "Nghêu hấp", u: "1 dĩa (200 g)", k: 150, g: 200 },
  { n: "Ốc luộc", u: "1 dĩa", k: 150 },
  { n: "Đậu hũ sốt cà", u: "1 phần", k: 200 },
  { n: "Đậu hũ non", u: "100 g", k: 55, g: 100 },

  // Rau, canh (thêm)
  { n: "Rau muống xào tỏi", u: "1 dĩa", k: 150 },
  { n: "Cải xào", u: "1 dĩa", k: 120 },
  { n: "Giá xào", u: "1 dĩa", k: 100 },
  { n: "Bông cải xanh luộc", u: "100 g", k: 35, g: 100 },
  { n: "Su su luộc", u: "100 g", k: 20, g: 100 },
  { n: "Đậu bắp luộc", u: "100 g", k: 30, g: 100 },
  { n: "Bí đỏ luộc", u: "100 g", k: 30, g: 100 },
  { n: "Cà rốt", u: "1 củ", k: 25 },
  { n: "Canh chua", u: "1 tô", k: 120 },
  { n: "Canh bí thịt bằm", u: "1 chén", k: 80 },
  { n: "Canh khổ qua nhồi thịt", u: "1 chén", k: 120 },
  { n: "Canh rong biển", u: "1 chén", k: 40 },
  { n: "Súp cua", u: "1 chén", k: 150 },
  { n: "Dưa cải chua", u: "1 chén", k: 20 },
  { n: "Kim chi", u: "1 chén", k: 30 },

  // Trái cây (thêm)
  { n: "Nho", u: "100 g", k: 70, g: 100 },
  { n: "Dứa (thơm)", u: "100 g", k: 50, g: 100 },
  { n: "Đu đủ", u: "1 miếng (200 g)", k: 85, g: 200 },
  { n: "Mít", u: "100 g", k: 95, g: 100 },
  { n: "Sầu riêng", u: "100 g", k: 150, g: 100 },
  { n: "Chôm chôm", u: "100 g", k: 82, g: 100 },
  { n: "Nhãn", u: "100 g", k: 60, g: 100 },
  { n: "Vải", u: "100 g", k: 66, g: 100 },
  { n: "Măng cụt", u: "1 trái", k: 25 },
  { n: "Lê", u: "1 trái", k: 100 },
  { n: "Kiwi", u: "1 trái", k: 45 },
  { n: "Dâu tây", u: "100 g", k: 32, g: 100 },
  { n: "Bưởi", u: "100 g", k: 38, g: 100 },
  { n: "Quýt", u: "1 trái", k: 45 },
  { n: "Mận", u: "1 trái", k: 30 },
  { n: "Hồng xiêm (sapoche)", u: "1 trái", k: 125 },
  { n: "Cùi dừa", u: "100 g", k: 350, g: 100 },

  // Món nước, món phần (thêm)
  { n: "Bún thịt nướng", u: "1 tô", k: 550 },
  { n: "Bún bò Nam Bộ", u: "1 tô", k: 550 },
  { n: "Bún mắm", u: "1 tô", k: 550 },
  { n: "Bún cá", u: "1 tô", k: 400 },
  { n: "Bún mọc", u: "1 tô", k: 400 },
  { n: "Bún đậu mắm tôm", u: "1 phần", k: 650 },
  { n: "Mì Quảng", u: "1 tô", k: 550 },
  { n: "Cao lầu", u: "1 tô", k: 500 },
  { n: "Bánh canh cua", u: "1 tô", k: 500 },
  { n: "Bánh canh giò heo", u: "1 tô", k: 600 },
  { n: "Bánh đa cua", u: "1 tô", k: 450 },
  { n: "Hủ tiếu Nam Vang", u: "1 tô", k: 450 },
  { n: "Hủ tiếu xào", u: "1 dĩa", k: 550 },
  { n: "Mì vịt tiềm", u: "1 tô", k: 650 },
  { n: "Mì xào giòn", u: "1 dĩa", k: 650 },
  { n: "Mì xào bò", u: "1 dĩa", k: 600 },
  { n: "Phở xào", u: "1 dĩa", k: 550 },
  { n: "Phở cuốn", u: "1 cuốn", k: 80 },
  { n: "Cháo lòng", u: "1 tô", k: 400 },
  { n: "Cháo vịt", u: "1 tô", k: 400 },
  { n: "Cháo sườn", u: "1 tô", k: 300 },
  { n: "Lẩu", u: "1 phần", k: 600 },
  { n: "Cơm sườn bì chả", u: "1 dĩa", k: 750 },
  { n: "Cơm gà xối mỡ", u: "1 dĩa", k: 750 },
  { n: "Cơm rang dưa bò", u: "1 dĩa", k: 700 },
  { n: "Cơm bò lúc lắc", u: "1 dĩa", k: 700 },
  { n: "Cơm văn phòng", u: "1 phần (cơm, món mặn, rau)", k: 650 },
  { n: "Cơm chay", u: "1 phần", k: 500 },
  { n: "Cơm trộn Hàn Quốc", u: "1 tô", k: 600 },
  { n: "Kimbap", u: "1 cuộn", k: 450 },
  { n: "Sushi", u: "1 miếng", k: 50 },
  { n: "Bánh mì ốp la", u: "1 ổ", k: 400 },
  { n: "Bánh mì chảo", u: "1 phần", k: 650 },
  { n: "Nem nướng", u: "1 xiên", k: 120 },
  { n: "Nem chua", u: "1 cái", k: 40 },
  { n: "Bò bía", u: "1 cuốn", k: 80 },
  { n: "Bánh khọt", u: "1 cái", k: 60 },
  { n: "Bánh bèo", u: "1 chén", k: 45 },
  { n: "Bánh bột lọc", u: "1 cái", k: 45 },
  { n: "Bánh ít", u: "1 cái", k: 150 },
  { n: "Hamburger", u: "1 cái", k: 500 },
  { n: "Pizza", u: "1 miếng", k: 280 },
  { n: "Khoai tây chiên", u: "1 phần vừa", k: 320 },

  // Ăn vặt, tráng miệng (thêm)
  { n: "Bánh tráng trộn", u: "1 bịch", k: 350 },
  { n: "Bánh tráng nướng", u: "1 cái", k: 250 },
  { n: "Bột chiên", u: "1 dĩa", k: 500 },
  { n: "Bắp xào", u: "1 ly", k: 250 },
  { n: "Bánh flan", u: "1 cái", k: 120 },
  { n: "Chè đậu đen", u: "1 ly", k: 250 },
  { n: "Chè Thái", u: "1 ly", k: 350 },
  { n: "Chè ba màu", u: "1 ly", k: 300 },
  { n: "Tàu hũ nước đường", u: "1 chén", k: 200 },
  { n: "Bánh bông lan", u: "1 miếng (50 g)", k: 150, g: 50 },
  { n: "Bánh su kem", u: "1 cái", k: 100 },
  { n: "Bánh bò", u: "1 cái", k: 120 },
  { n: "Bánh da lợn", u: "1 miếng", k: 150 },
  { n: "Bánh chuối nướng", u: "1 miếng", k: 250 },
  { n: "Bánh pía", u: "1 cái", k: 350 },
  { n: "Bánh trung thu", u: "1 cái (150 g)", k: 650, g: 150 },
  { n: "Kem que", u: "1 cây", k: 150 },
  { n: "Kem ốc quế", u: "1 cây", k: 200 },
  { n: "Socola", u: "1 thanh (40 g)", k: 210, g: 40 },
  { n: "Bánh gạo", u: "1 cái", k: 30 },
  { n: "Kẹo", u: "1 viên", k: 20 },
  { n: "Bỏng ngô", u: "1 hộp vừa", k: 400 },
  { n: "Đậu phộng", u: "1 nắm (30 g)", k: 170, g: 30 },
  { n: "Hạt hướng dương", u: "30 g", k: 175, g: 30 },
  { n: "Óc chó", u: "1 nắm (30 g)", k: 195, g: 30 },
  { n: "Hạt chia", u: "1 muỗng (12 g)", k: 60, g: 12 },
  { n: "Bơ đậu phộng", u: "1 muỗng canh", k: 95 },
  { n: "Mật ong", u: "1 muỗng canh", k: 64 },
  { n: "Đường", u: "1 muỗng cà phê", k: 16 },
  { n: "Mayonnaise", u: "1 muỗng canh", k: 95 },

  // Sữa, đồ uống (thêm)
  { n: "Sữa tách béo", u: "1 hộp 180 ml", k: 65 },
  { n: "Sữa đặc", u: "1 muỗng canh", k: 60 },
  { n: "Sữa yến mạch", u: "1 ly 250 ml", k: 120 },
  { n: "Sữa hạt", u: "1 hộp 180 ml", k: 100 },
  { n: "Sữa đậu nành không đường", u: "1 ly 250 ml", k: 80 },
  { n: "Sữa chua uống", u: "1 chai", k: 70 },
  { n: "Yakult", u: "1 chai", k: 50 },
  { n: "Milo", u: "1 hộp 180 ml", k: 135 },
  { n: "Phô mai", u: "1 miếng (15 g)", k: 50, g: 15 },
  { n: "Trà đá", u: "1 ly", k: 0 },
  { n: "Trà đường", u: "1 ly", k: 80 },
  { n: "Trà chanh", u: "1 ly", k: 100 },
  { n: "Trà đào", u: "1 ly", k: 200 },
  { n: "Trà sữa không topping", u: "1 ly 500 ml", k: 300 },
  { n: "Trà xanh đóng chai", u: "1 chai", k: 100 },
  { n: "Nước cam vắt", u: "1 ly 250 ml", k: 110 },
  { n: "Nước ép táo", u: "1 ly 250 ml", k: 115 },
  { n: "Nước dừa", u: "1 trái", k: 60 },
  { n: "Sinh tố xoài", u: "1 ly", k: 250 },
  { n: "Sinh tố dâu", u: "1 ly", k: 200 },
  { n: "Cacao sữa", u: "1 ly", k: 200 },
  { n: "Matcha latte", u: "1 ly", k: 250 },
  { n: "Latte", u: "1 ly 350 ml", k: 190 },
  { n: "Cappuccino", u: "1 ly", k: 130 },
  { n: "Cà phê muối", u: "1 ly", k: 250 },
  { n: "Nước tăng lực", u: "1 lon", k: 110 },
  { n: "Rượu vang", u: "1 ly 150 ml", k: 125 },
  { n: "Soju", u: "1 chai", k: 540 },

  // Món hay gõ tắt (thêm)
  { n: "Bánh mì trứng", u: "1 ổ", k: 350 },
  { n: "Bánh mì chả", u: "1 ổ", k: 380 },
  { n: "Bánh mì xíu mại", u: "1 ổ", k: 450 },
  { n: "Bánh mì gà", u: "1 ổ", k: 400 },
  { n: "Xôi gà", u: "1 gói", k: 500 },
  { n: "Xôi mặn", u: "1 gói", k: 550 },
  { n: "Xôi xéo", u: "1 gói", k: 450 },
  { n: "Xôi đậu xanh", u: "1 gói", k: 400 },
  { n: "Cơm sườn", u: "1 dĩa", k: 600 },
  { n: "Cơm thịt kho", u: "1 dĩa", k: 650 },
  { n: "Cơm cá kho", u: "1 dĩa", k: 550 },
  { n: "Cơm chiên dương châu", u: "1 dĩa", k: 650 },
  { n: "Cơm bò xào", u: "1 dĩa", k: 600 },
  { n: "Cơm ức gà", u: "1 phần", k: 450 },
  { n: "Cháo cá", u: "1 tô", k: 300 },
  { n: "Cháo thịt bằm", u: "1 tô", k: 280 },
  { n: "Bún gà", u: "1 tô", k: 400 },
  { n: "Bún xào", u: "1 dĩa", k: 500 },
  { n: "Bánh ướt", u: "1 dĩa", k: 300 },
  { n: "Mì trộn", u: "1 phần", k: 500 },
  { n: "Mì cay", u: "1 tô", k: 600 },
  { n: "Mì gói trứng", u: "1 gói + 1 trứng", k: 450 },
  { n: "Bò kho", u: "1 tô", k: 450 },
  { n: "Gà nướng", u: "100 g", k: 220, g: 100 },
  { n: "Thịt nướng", u: "100 g", k: 250, g: 100 },
  { n: "Salad ức gà", u: "1 phần", k: 300 },
];

// Lowercase without Vietnamese diacritics, so "com trang" finds "Cơm trắng".
export const fold = (x: string) => x.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[đĐ]/g, "d").toLowerCase().trim();

export const findFood = (name: string) => { const f = fold(name); return f ? FOODS.find((x) => fold(x.n) === f) : undefined; };

// Every typed word must appear (any order); names starting with the query come first.
export function searchFoods(q: string, limit = 8) {
  const f = fold(q), words = f.split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  let hit = FOODS.filter((x) => { const n = fold(x.n); return words.every((w) => n.includes(w)); });
  if (!hit.length) hit = FOODS.filter((x) => toks(x.n).includes(words[0])); // nothing has every word: offer the first word's foods
  return hit.sort((a, b) => Number(fold(b.n).startsWith(f)) - Number(fold(a.n).startsWith(f))).slice(0, limit);
}

// ---------- free-text meal parser ----------
// "2 trứng, 1 chén cơm, 150g ức gà và rau luộc" -> one item per food, each matched to the closest FOODS entry.
const toks = (x: string) => fold(x).replace(/[()]/g, " ").split(/\s+/).filter(Boolean);
const accents = (x: string) => x.toLowerCase().replace(/[()]/g, " ").split(/\s+/).filter(Boolean);
const FOOD_TOKS = FOODS.map((f) => toks(f.n));
const FOOD_ACC = FOODS.map((f) => accents(f.n));
// Unit words that also start a food name ("hủ tiếu") are never stripped as units.
const LEADS = new Set(FOOD_TOKS.map((x) => x[0]));
const UNITS = new Set("chen bat to dia ly coc qua trai cai mieng cuon goi lat hop lon chai phan muong thia nam cu cay xien bich hu khoanh con suat".split(" "));
const WORD_NUM: Record<string, number> = { nua: 0.5, mot: 1, hai: 2 };
export const SEP = /(\s*(?:[,;+\n]|\s(?:và|với|va|voi)\s)\s*)/i;

// ok = calories could be computed (false: unknown food, or grams on a food without a gram size).
export type Item = { text: string; pre: string; food?: Food; exact: boolean; ok: boolean; qty: number; grams: number; k: number };

function match(q: string[], qa: string[]) {
  let best = -1, score = 0, exact = false;
  FOOD_TOKS.forEach((nt, i) => {
    const mq = q.filter((w) => nt.includes(w)).length;
    if (mq * 2 < q.length) return; // "bánh gì đó" shares only "bánh": too weak to guess
    const mn = nt.filter((w) => q.includes(w)).length;
    // Cover what was typed first, then prefer the tighter name; exact accents break "bơ" / "bò" ties.
    const sc = (mq / q.length) * 2 + mn / nt.length + qa.filter((w) => FOOD_ACC[i].includes(w)).length * 0.01;
    if (sc > score) { score = sc; best = i; exact = mq === q.length && mn === nt.length; }
  });
  return best < 0 ? undefined : { food: FOODS[best], exact };
}

const isUnit = (w?: string) => !!w && UNITS.has(w) && !LEADS.has(w);

export function parseItem(text: string): Item {
  const raw = text.trim().split(/\s+/).filter(Boolean), t = raw.map((w) => fold(w));
  let qty = 1, grams = 0, ml = false;
  const drop = new Set<number>();
  const ni = t.findIndex((w) => /^\d+([.,]\d+)?(g|gr|gram|ml)?$/.test(w) || /^\d+\/\d+$/.test(w) || w in WORD_NUM);
  if (ni >= 0) {
    const w = t[ni], m = w.match(/^(\d+(?:[.,]\d+)?)(g|gr|gram|ml)?$/);
    let unit = m?.[2] ?? "";
    const n = w in WORD_NUM ? WORD_NUM[w] : /\//.test(w) ? Number(w.split("/")[0]) / Number(w.split("/")[1]) : Number(m![1].replace(",", "."));
    drop.add(ni);
    if (!unit && /^(g|gr|gram|ml)$/.test(t[ni + 1] ?? "")) { unit = t[ni + 1]; drop.add(ni + 1); }
    if (unit === "ml") ml = true; else if (unit) grams = n; else qty = n;
    if (isUnit(t[ni + 1]) && !drop.has(ni + 1)) drop.add(ni + 1);
  }
  if (isUnit(t[0]) && t.length > 1) drop.add(0);
  const pre = raw.filter((_, i) => drop.has(i)).join(" ");
  const q = t.filter((_, i) => !drop.has(i)), qa = raw.filter((_, i) => !drop.has(i)).map((w) => w.toLowerCase());
  const hit = q.length ? match(q, qa) : undefined;
  const food = hit?.food;
  // ml on a drink just names the cup size; grams only scale foods that define grams per unit.
  const k = !food || !(qty > 0) ? 0 : grams ? (food.g ? (food.k * grams) / food.g : 0) : ml ? food.k : food.k * qty;
  const ok = !!food && qty > 0 && !(grams && !food.g);
  return { text: text.trim(), pre, food, exact: !!hit?.exact, ok, qty: ml ? 1 : qty, grams, k: Math.round(k) };
}

export const parseMeal = (text: string) => text.split(SEP).filter((x, i) => i % 2 === 0 && x.trim()).map(parseItem);
