// The curated shelf — the books the user has actually read. This is the single
// source of truth for the /books galaxy (NOT the blog). Each book shows a real
// cover photo from /public/books; books without a photo fall back to a clean
// designed cover painted from the palette. A book may link to a blog review via
// `blogSlug` (then reading mode shows the full write-up); books without one show
// just the cover + author.
//
// To add a book: drop a cover at /public/books/<slug>.jpg and add an entry here.
// To swap a cover: replace that file (same path).

export interface BookMeta {
  /** Author printed on the cover / shown in captions. */
  author: string;
  /** Palette for the designed fallback cover + the 3D spine & back. */
  hue: number;
  saturation: number;
  lightness: number;
  /** Foil colour for stamped title/rules on the designed cover & spine. */
  foil: string;
  /** Relative size multiplier (~0.9–1.15). */
  scale?: number;
  /** Real cover image served from /public (overrides the designed front cover). */
  cover?: string;
  /** Optional real back-cover image (maps onto the book's back face). */
  coverBack?: string;
  /** Optional real spine image (maps onto the book's spine face). */
  coverSpine?: string;
  /** Optional short cover note painted on generated 3D detail covers. */
  coverBlurb?: string;
}

/** A few takeaways, localized. `en` is required; other locales fall back to it.
 * Shown as the "note" on the detail view and as the opening flipbook leaf. */
export type BookKeyPoints = { en: string[] } & Partial<Record<"vi", string[]>>;

export type LocalizedBookText = { en: string } & Partial<Record<"vi", string>>;

export interface BookReadingPage {
  heading: string;
  paragraphs: string[];
}

export interface LibraryBook extends BookMeta {
  /** Unique id (also the cover filename). */
  slug: string;
  /** Display title (Vietnamese). */
  title: string;
  /** English title (shown when the site language is English). */
  titleEn?: string;
  /** Blog post slug carrying the full review, if one exists. */
  blogSlug?: string;
  /** Key ideas surfaced before opening the book (the "ý chính" note). The
   * flipbook reader seeds its leaves from the review when present, falling back
   * to these points when a book has no written review yet. */
  keyPoints?: BookKeyPoints;
  /** Short, punchy note shown on the outside/detail cover sheet. */
  coverNote?: LocalizedBookText;
  /** Curated short-form pages for the flipbook, preferred over blog excerpts.
   * A Vietnamese-only deck is intentional: English then falls back to the
   * linked English review, or to the English key points when no review exists. */
  readingPages?: Partial<Record<"en" | "vi", BookReadingPage[]>>;
}

// A critical reading of power: the tactics are treated as material to examine,
// not instructions to manipulate people or erase one's own contribution.
const LAWS_OF_POWER_PAGES: BookReadingPage[] = [
  {
    heading: "Lăng kính 1 — Bản đồ, không phải la bàn",
    paragraphs: [
      "*48 Nguyên Tắc Chủ Chốt Của Quyền Lực* mô tả những cách con người giành, giữ và mất ảnh hưởng. Điểm hữu ích của cuốn sách là làm lộ ra các trò chơi vốn thường diễn ra trong im lặng: cạnh tranh vị thế, kiểm soát thông tin, tạo liên minh và bảo vệ hình ảnh.",
      "Nhưng một bản đồ cho biết địa hình không tự quyết định con đường nên đi. Nếu xem mọi nguyên tắc là mệnh lệnh, người đọc rất dễ biến đồng nghiệp, bạn bè và người thân thành quân cờ.",
      "Cách đọc phù hợp hơn là tách hai câu hỏi: ==chiến thuật này vận hành thế nào, và mình có chấp nhận cái giá đạo đức của nó không?=="
    ]
  },
  {
    heading: "Lăng kính 2 — Đọc lại Luật 1",
    paragraphs: [
      "Ở Luật 1, Robert Greene dùng câu chuyện Nicolas Fouquet và Louis XIV để minh họa nguy cơ làm người ở vị trí cao cảm thấy bị lu mờ. Đó là cách tác giả dựng lập luận, không phải bằng chứng rằng một bữa tiệc là nguyên nhân chắc chắn khiến Fouquet bị bắt.",
      "Một kết cục lịch sử không nên bị thu gọn vào một cảnh kể duy nhất. Phần có thể mang về hiện tại là lời nhắc phải đọc bối cảnh, hiểu sự bất an trong hệ thống phân cấp và chọn cách trình bày năng lực phù hợp.",
      "Điều cần tránh là biến bài học ấy thành lời khuyên phải tự làm mình nhỏ đi hoặc luôn chiều lòng người có quyền."
    ]
  },
  {
    heading: "Lăng kính 3 — Khéo léo mà không tự xóa mình",
    paragraphs: [
      "Trong công việc, sự khéo léo có thể rất cụ thể: ghi nhận đúng người đóng góp, kết nối đề xuất mới với mục tiêu chung, nêu bất đồng bằng dữ liệu và chọn thời điểm để phản biện.",
      "Ranh giới đạo đức cũng cần rõ: tôn trọng vai trò không phải tâng bốc; giữ thể diện cho người khác không phải che giấu sự thật; chia sẻ công lao không có nghĩa từ bỏ quyền được ghi nhận.",
      "Một phép thử hữu ích: sau cách ứng xử này, ==cả nhóm hiểu vấn đề rõ hơn hay chỉ một người cảm thấy quyền lực hơn?=="
    ]
  },
  {
    heading: "Lăng kính 4 — Dùng cuốn sách để tự vệ",
    paragraphs: [
      "Một số nguyên tắc đề cao việc che giấu ý định, tạo sự phụ thuộc hoặc triệt hạ đối thủ. Áp dụng máy móc những ý ấy có thể làm xói mòn lòng tin và hợp thức hóa tổn hại.",
      "Giá trị khác của chúng là giúp nhận diện dấu hiệu nguy hiểm: người giữ thông tin để thao túng quyết định, cô lập thành viên khỏi nguồn hỗ trợ, nhận công lao của người khác hoặc khiến ai đó sợ rời đi.",
      "Hiểu một chiến thuật không buộc mình phải sử dụng nó. ==Khả năng nhìn thấy trò chơi cũng là khả năng từ chối tham gia và bảo vệ người đang ở thế yếu.=="
    ]
  },
  {
    heading: "Lăng kính 5 — Ba bộ lọc trước khi hành động",
    paragraphs: [
      "Trước một chiến thuật quyền lực, có thể đặt ba câu hỏi: nó có dựa trên sự thật không; nó có tôn trọng quyền lựa chọn của người khác không; và cái giá dài hạn sẽ rơi vào ai?",
      "Quyền lực không chỉ dùng để thắng. Nó còn có thể mở đường cho người ít tiếng nói, bảo vệ ranh giới, phân bổ công lao công bằng và tạo điều kiện để người khác làm tốt hơn.",
      "Cuốn sách đáng đọc nhất khi nó làm tăng sự tỉnh táo mà không bào mòn lòng trắc ẩn. ==Ảnh hưởng bền vững không chỉ nằm ở điều mình có thể khiến người khác làm, mà còn ở cách mình chọn không lạm dụng khả năng ấy.=="
    ]
  }
];

// Vietnamese reflection on communication as respect rather than a catalogue of
// techniques. English reading mode uses the linked English review.
const DAC_NHAN_TAM_PAGES: BookReadingPage[] = [
  {
    heading: "Lăng kính — kỹ năng phải đi cùng ý định",
    paragraphs: [
      "Trong *Đắc Nhân Tâm*, Dale Carnegie đặt nhiều gợi ý giao tiếp quanh việc bớt chỉ trích, biết ghi nhận và nhìn sự việc từ phía người khác. Còn cách đọc mình chọn cho trang này là: ==học ảnh hưởng để tôn trọng con người hơn==, không phải để khiến ai cũng thích mình.",
      "Điểm phân biệt nằm ở ý định. Một câu nói mềm vẫn có thể là thao túng nếu mục tiêu chỉ là dẫn bạn đến câu trả lời mình muốn; một cuộc trò chuyện vụng về vẫn có thể tử tế nếu mình thật sự nghe và chừa chỗ cho bạn không đồng ý.",
      "Vì vậy, trước mọi “kỹ thuật”, mình giữ một câu hỏi: *mình đang muốn hiểu người này, hay chỉ muốn điều khiển kết quả?*"
    ]
  },
  {
    heading: "Trước khi nói — đổi phán xét lấy tò mò",
    paragraphs: [
      "Carnegie khuyên tránh mở đầu bằng chỉ trích, vì khi thấy bị kết tội, người nghe dễ chuyển sang bảo vệ mình. Thay vì gắn nhãn *“bạn vô trách nhiệm”*, mình có thể chỉ vào việc cụ thể: *“phần này đang trễ; mình cùng xem lại cách chia việc nhé”*.",
      "Rồi mình nghe thêm một nhịp: hỏi điều bạn đang vướng, nhắc lại ý mình vừa hiểu và để bạn nói hết trước khi phản hồi. Sự quan tâm nằm ở chất lượng chú ý, không nằm ở số câu hỏi.",
      "Lắng nghe không đồng nghĩa với đồng ý. Mình vẫn có thể nói rõ sự thật và ranh giới; điều thay đổi là bạn không phải bị làm nhỏ đi để vấn đề được nhìn thấy."
    ]
  },
  {
    heading: "Khi ghi nhận — cụ thể hơn lời khen chung chung",
    paragraphs: [
      "Một trọng tâm của Carnegie là sự ghi nhận chân thành. Lời khen có trọng lượng khi nó gọi đúng điều mình đã quan sát: *“cách bạn giải thích làm phần khó dễ hiểu hơn”* rõ hơn nhiều so với *“bạn giỏi quá”*.",
      "Ghi nhận cụ thể cũng giúp người nghe thấy nỗ lực nào đáng tiếp tục. Nó không cần phóng đại, càng không cần xuất hiện như phần mở đầu bắt buộc trước một lời nhờ vả.",
      "Giới hạn mình muốn giữ: lời khen không phải đồng tiền đổi lấy thiện chí. Nếu mình chỉ khen để bạn dễ thuận theo, kỹ năng đã rời khỏi sự chân thành mà cuốn sách nhấn mạnh."
    ]
  },
  {
    heading: "Khi bất đồng — rõ việc, giữ người",
    paragraphs: [
      "Những gợi ý như tránh câu *“bạn sai rồi”*, nhận lỗi của mình sớm và bắt đầu từ điểm chung giúp cuộc trao đổi bớt thành cuộc đấu thắng–thua. Mục tiêu không phải làm ý kiến khác biến mất, mà tạo đủ an toàn để cả hai còn kiểm tra được điều gì đúng.",
      "Khi góp ý, mình có thể nói riêng, mô tả phần cần sửa và mở một lối đi cụ thể. Giữ thể diện ở đây không phải che lỗi; đó là không biến một lỗi thành phán quyết về giá trị của bạn.",
      "Sự mềm mỏng cũng có giới hạn. Với hành vi gây hại hoặc ranh giới bị vượt qua, nói rõ và dứt khoát vẫn cần thiết; tử tế không buộc mình phải làm vừa lòng tất cả."
    ]
  },
  {
    heading: "Thử ngay — nghe thêm một câu",
    paragraphs: [
      "Bài thực hành mình rút từ cuốn sách rất nhỏ: trong cuộc trò chuyện tiếp theo, trước khi đưa lời khuyên, hãy hỏi thêm một câu như *“ý bạn là… đúng không?”* hoặc *“điều bạn đang cần nhất là gì?”*.",
      "Sau đó tự kiểm tra ba điểm: mình có nghe câu trả lời thật không; lời ghi nhận có cụ thể không; và người kia có quyền không đồng ý không. Ba điểm này giữ kỹ năng giao tiếp ở phía tôn trọng thay vì thao túng.",
      "Điều mình muốn mang theo từ Dale Carnegie không phải một bộ câu nói thuộc lòng, mà là thói quen bớt đặt cái tôi ở trung tâm để nhìn thấy người đối diện rõ hơn."
    ]
  }
];

// Vietnamese decision-checking reflection. System 1 and System 2 stay
// attributed to the book as a model, not literal parts of the brain.
const THINKING_FAST_SLOW_PAGES: BookReadingPage[] = [
  {
    heading: "Bản đồ — hai nhịp nghĩ trong cùng một quyết định",
    paragraphs: [
      "Trong *Tư Duy Nhanh Và Chậm*, Daniel Kahneman gọi cách nghĩ nhanh, tự động và trực giác là Hệ thống 1; cách nghĩ chậm, cần chú ý và kiểm tra là Hệ thống 2. Đây là ngôn ngữ để quan sát cách tâm trí vận hành trong lựa chọn hằng ngày.",
      "Hệ thống 1 giúp mình nhận ra và phản ứng nhanh; vấn đề xuất hiện khi câu trả lời đến dễ đến mức mình quên kiểm tra. Hệ thống 2 có thể rà lại, nhưng sự chú ý của nó có hạn, nhất là lúc mình mệt hoặc đang ôm nhiều việc.",
      "Vì vậy, bài học không phải trực giác luôn sai và phân tích luôn đúng. Mình chỉ cần nhận ra quyết định nào đáng được chậm lại."
    ]
  },
  {
    heading: "Cảnh báo 1 — cảm giác đúng chưa phải bằng chứng",
    paragraphs: [
      "Kahneman cho thấy phán đoán dễ bị kéo bởi mỏ neo, điều vừa hiện lên trong trí nhớ và khuôn mẫu quen thuộc. Giá đầu tiên có thể neo cách mình định giá; tin được nhắc nhiều có thể làm một rủi ro trông phổ biến; một mô tả hợp khuôn dễ khiến mình quên tỷ lệ nền.",
      "Trước một nhận định quan trọng, mình thử tách ba câu hỏi: bằng chứng trực tiếp là gì, dữ liệu chung nói gì, và thông tin đầu tiên đã kéo mình theo hướng nào.",
      "Câu hỏi không xóa thiên kiến ngay lập tức. Nó chỉ tạo khoảng cách giữa *“nghe có vẻ đúng”* và *“đã đủ căn cứ để tin”*."
    ]
  },
  {
    heading: "Cảnh báo 2 — kế hoạch thường đẹp hơn đời thật",
    paragraphs: [
      "Cuốn sách nhắc rằng mình dễ quá tự tin vào dự đoán và kể kết quả như thể chúng hoàn toàn đến từ kỹ năng, dù thời điểm, bối cảnh và may rủi cũng có phần. Vì thế, một kế hoạch trơn tru trên giấy chưa phải bằng chứng nó sẽ diễn ra đúng như vậy.",
      "Kahneman đề nghị dùng góc nhìn bên ngoài: xem những việc tương tự thường mất bao lâu, hay vướng ở đâu, rồi thêm phần đệm thay vì chỉ tin lần này sẽ khác.",
      "Dữ liệu cũ không quyết định chắc chắn trường hợp của mình. Nó giúp hiệu chỉnh mức tự tin, để hy vọng vẫn còn nhưng không phải gánh cả kế hoạch."
    ]
  },
  {
    heading: "Cảnh báo 3 — mất, được và chiếc khung",
    paragraphs: [
      "Theo Kahneman, mất một khoản thường gây đau mạnh hơn niềm vui từ khoản được tương đương. Khuynh hướng né mất mát có thể khiến mình giữ một lựa chọn chỉ vì tiếc công, tiếc tiền hoặc sợ rời vùng an toàn.",
      "Cách diễn đạt cũng đổi cảm giác: cùng một tỷ lệ, nói theo phần thành công có thể tạo phản ứng khác với nói theo phần thất bại. Khi quyết định quan trọng, mình nên nhìn cả hai cách đóng khung trước khi chọn.",
      "Sở hữu còn làm mình dễ định giá điều đang có cao hơn. Điều đó không có nghĩa mọi gắn bó đều vô lý; câu kiểm tra hữu ích là: *nếu hôm nay chưa sở hữu nó, mình có chủ động chọn lại không?*"
    ]
  },
  {
    heading: "Hai cái tôi — phút đang sống và câu chuyện còn lại",
    paragraphs: [
      "Kahneman phân biệt cái tôi trải nghiệm, sống qua từng khoảnh khắc, với cái tôi ghi nhớ, kể lại câu chuyện sau đó. Một trải nghiệm có thể mệt khi đang diễn ra nhưng được nhớ bằng vài đoạn nổi bật; một quãng dài cũng có thể bị phần kết nhuộm màu.",
      "Góc nhìn này nhắc mình đừng chỉ tối ưu ký ức đẹp mà bỏ quên chất lượng những phút đang sống. Ngược lại, chạy theo cảm giác tức thời mà không nhìn câu chuyện dài hạn cũng chưa đủ.",
      "Không cái tôi nào nên độc quyền quyết định. Câu hỏi cân bằng là: *việc này đang đối xử thế nào với mình hôm nay, và mình muốn nhớ nó ra sao về sau?*"
    ]
  },
  {
    heading: "Phiếu dừng 60 giây — dành cho việc đáng chậm",
    paragraphs: [
      "Không phải lựa chọn nào cũng cần một cuộc phân tích dài. Với quyết định có hậu quả lớn, mình có thể dừng một phút và hỏi: bằng chứng hay chỉ cảm giác; mỏ neo hoặc cách đóng khung nào đang có mặt; dữ liệu nền và góc nhìn bên ngoài nói gì; mình đang chọn vì giá trị hay chỉ vì sợ mất.",
      "Nếu đang mệt hoặc quá tải, hoãn quyết định khi có thể cũng là cách cho Hệ thống 2 một cơ hội làm việc. Đây là bước kiểm tra, không phải lời hứa rằng mình sẽ trở nên hoàn toàn khách quan.",
      "Điều mình giữ lại từ Kahneman là một vốn từ để nhận ra giới hạn của phán đoán. Cuốn sách không bảo mình nghi ngờ mọi trực giác; nó giúp mình biết lúc nào nên để trực giác được kiểm tra."
    ]
  }
];

// Vietnamese identity-and-systems reflection. English reading mode uses the
// linked English review instead of this localized deck.
const ATOMIC_HABITS_PAGES: BookReadingPage[] = [
  {
    heading: "La bàn — mình muốn trở thành ai?",
    paragraphs: [
      "Trong *Atomic Habits*, James Clear mô tả thay đổi qua ba tầng: kết quả mình muốn, quy trình mình lặp lại và căn tính mình đang xây. Ghi chú của mình đặt trọng tâm ở tầng cuối: mỗi hành động nhỏ góp thêm bằng chứng cho kiểu người mình muốn trở thành.",
      "Đọc hai trang chưa biến mình thành người đọc nhiều; nó chỉ là một phiếu nhỏ cho hướng đó. Giá trị nằm ở việc phiếu ấy có thể được bỏ tiếp vào ngày mai, thay vì ép mình chứng minh một danh tính hoàn hảo ngay hôm nay.",
      "Căn tính nên là la bàn, không phải nhãn cứng. Một lần bỏ lỡ không chứng minh mình lười hay thất bại; nó chỉ cho biết hệ thống cần được nhìn lại."
    ]
  },
  {
    heading: "Bản đồ ba tầng — nối đích đến với hôm nay",
    paragraphs: [
      "==Kết quả== trả lời mình muốn đạt gì. Nó cho hướng đi, nhưng thường ở quá xa để tự tạo hành động cho một buổi tối cụ thể.",
      "==Quy trình== trả lời hôm nay mình làm gì và trong điều kiện nào: sau khi đánh răng thì đọc hai trang, sau khi mở laptop thì viết ba dòng kế hoạch. Đây là chỗ mục tiêu được đổi thành nhịp sống.",
      "==Căn tính== trả lời hành động ấy đang nuôi con người nào. Ba tầng cần đi cùng nhau: chỉ nhìn kết quả dễ nôn nóng; chỉ nói về căn tính mà không có quy trình thì vẫn là một ý định đẹp."
    ]
  },
  {
    heading: "Cơ chế — nhìn cả đường đi của một thói quen",
    paragraphs: [
      "Clear mô tả một vòng lặp gồm tín hiệu, ham muốn, phản ứng và phần thưởng. Điện thoại sáng là tín hiệu; tò mò kéo mình lại; mở máy là phản ứng; cảm giác bớt chán là phần thưởng. Nhìn đủ vòng lặp giúp mình tìm đúng chỗ để can thiệp.",
      "Từ đó, cuốn sách gợi bốn hướng cho thói quen tốt: làm nó rõ ràng, hấp dẫn, dễ thực hiện và có cảm giác thỏa mãn. Với thói quen xấu, mình đi theo chiều ngược lại.",
      "Khung này dùng để thiết kế hành vi, không phải để kết tội ý chí. Nếu một cách bố trí không giúp mình lặp lại, mình đổi thiết kế trước khi vội gắn nhãn xấu cho bản thân."
    ]
  },
  {
    heading: "Thiết kế — giảm ma sát trước khi tăng quyết tâm",
    paragraphs: [
      "Muốn đọc, mình có thể để sách ở nơi dễ thấy; muốn bớt lướt, mình có thể tắt thông báo và đặt điện thoại xa bàn. Môi trường không quyết định thay mình, nhưng nó khiến lựa chọn tốt bớt phải thắng một cuộc giằng co mỗi lần xuất hiện.",
      "Bước khởi động cũng nên nhỏ, chỉ khoảng hai phút: mở sách và đọc một đoạn, viết ba dòng, mang giày ra cửa. Mục tiêu lúc đầu là trở thành người bắt đầu đều, chưa phải hoàn thành phiên bản lớn nhất của thói quen.",
      "Thiết kế tốt không bảo đảm ngày nào cũng trơn tru. James Clear vẫn dành chỗ cho lúc lệch nhịp: bỏ lỡ một lần thì quay lại ở cơ hội kế tiếp, thay vì biến một sự cố thành mùa bỏ cuộc."
    ]
  },
  {
    heading: "Thử nghiệm bảy ngày — một lời hứa đủ nhỏ",
    paragraphs: [
      "Có thể bắt đầu bằng một thử nghiệm ngắn: chọn một hướng căn tính, một bước khởi động khoảng hai phút và một tín hiệu đã có sẵn. Ví dụ: sau khi đánh răng buổi tối, mở sách và đọc một đoạn.",
      "Trong bảy ngày, chỉ đánh dấu việc đã làm và ghi lại chỗ gây vướng. Nếu bỏ lỡ, quay lại ở lần kế tiếp; đừng tăng khối lượng chỉ để bù và cũng đừng dùng chuỗi ngày như thước đo giá trị bản thân.",
      "Thành công của thử nghiệm không phải là đổi đời sau một tuần. Nó là tìm được một thiết kế đủ rõ, đủ dễ và đủ thật để mình có thể tiếp tục bỏ phiếu cho con người mình muốn trở thành."
    ]
  }
];

// Vietnamese minimalism experiment with explicit limits for different homes,
// work, health, finances, and shared belongings.
const GOODBYE_THINGS_PAGES: BookReadingPage[] = [
  {
    heading: "Điểm xuất phát — một lời kể, không phải công thức",
    paragraphs: [
      "*Goodbye, Things* đi từ sự thay đổi trong đời sống của Fumio Sasaki. Với mình, chính góc nhìn cá nhân làm câu chuyện có sức thuyết phục, nhưng cũng nhắc rằng trải nghiệm của một người không thể trở thành tiêu chuẩn cho mọi nhà.",
      "Gợi ý cốt lõi rất sáng rõ: đồ đạc không chỉ chiếm diện tích; chúng còn cần thời gian chọn, cất, tìm và chăm sóc. Bớt đi có thể trả lại sự chú ý cho điều quan trọng hơn.",
      "Nên đọc tối giản như một lời mời thử nghiệm: ==giữ những gì phục vụ đời sống, thay vì chạy theo một con số thật ít.=="
    ]
  },
  {
    heading: "Bài kiểm kê — bắt đầu từ một vùng nhỏ",
    paragraphs: [
      "Chọn một ngăn kéo, mặt bàn hoặc túi thường dùng. Chia đồ thành ba nhóm: dùng đều; ít dùng nhưng có giá trị rõ ràng; và không còn phục vụ nhu cầu hiện tại.",
      "Với từng món, hỏi ba điều: lần gần nhất mình dùng là khi nào; giữ nó cần bao nhiêu chỗ và công sức bảo quản; nếu chưa sở hữu, hôm nay mình có chủ động mang nó về không?",
      "Không cần quyết định bằng cảm giác xấu hổ vì từng mua sai. ==Mục tiêu của kiểm kê là nhìn rõ hiện tại, không phải trừng phạt phiên bản cũ của mình.=="
    ]
  },
  {
    heading: "Thử nghiệm — ưu tiên bước có thể đảo ngược",
    paragraphs: [
      "Với món còn phân vân, có thể đặt vào một hộp tạm trong thời hạn đã chọn thay vì bỏ ngay. Nếu thực sự cần, lấy lại; nếu không nhớ đến, lúc ấy mới cân nhắc bán, tặng hoặc xử lý phù hợp.",
      "Với việc mua mới, thử trì hoãn vài ngày đối với món không thiết yếu và ghi lại nhu cầu mình mong món đồ sẽ giải quyết. Đôi khi thứ cần là sửa đồ cũ, mượn tạm hoặc sắp lại thứ đang có.",
      "Một thử nghiệm tốt cho mình thêm dữ liệu và giảm nguy cơ hối tiếc. ==Tối giản không cần bắt đầu bằng một quyết định cực đoan.=="
    ]
  },
  {
    heading: "Biên áp dụng — mỗi đời sống có một chữ đủ khác nhau",
    paragraphs: [
      "Gia đình đông người, công việc đặc thù, việc chăm sóc trẻ nhỏ, tình trạng sức khỏe hay nhu cầu dùng đồ trợ năng đều làm lượng đồ cần thiết khác nhau. Dụng cụ y tế, đồ hỗ trợ, tài liệu nghề nghiệp và vật dụng dự phòng không nên bị loại chỉ để căn phòng trông trống hơn.",
      "Nếu một món khó hoặc tốn kém để mua lại, giữ nó có thể là lựa chọn hợp lý. Đồ dùng chung cũng cần được quyết định cùng người liên quan, không tự ý dọn thay họ.",
      "Kỷ vật có thể được giữ nguyên, giới hạn trong một khu vực hoặc lưu theo cách khác. ==Tối giản chỉ có ích khi tôn trọng hoàn cảnh và quyền lựa chọn của người sống trong không gian ấy.=="
    ]
  },
  {
    heading: "Điểm dừng — khi không gian quay lại phục vụ mình",
    paragraphs: [
      "Không cần đếm đồ để biết mình đã đủ. Những dấu hiệu thiết thực hơn là dễ tìm thứ cần dùng, ít tốn công bảo quản, có khoảng trống cho sinh hoạt và không thường xuyên tiếc những gì đã bỏ.",
      "Nếu việc dọn dẹp tạo thêm lo âu, thúc đẩy mua lại liên tục hoặc biến thành tiêu chuẩn để phán xét người khác, công cụ đã bắt đầu lấn át mục đích.",
      "Điểm đến không phải một căn phòng giống ảnh mẫu. Đó là đời sống trong đó ==mình bớt phục vụ đồ đạc, chăm tốt hơn cho thứ còn lại và có thêm chỗ cho con người, trải nghiệm cùng sự nghỉ ngơi.=="
    ]
  }
];

// Vietnamese reflection that keeps the book's spiritual narrative separate
// from present-day ethical takeaways and claims requiring evidence.
const MUON_KIEP_1_PAGES: BookReadingPage[] = [
  {
    heading: "Mở sách — đọc trên hai tầng",
    paragraphs: [
      "Cuốn sách thuật lại các cuộc trò chuyện với Thomas cùng những hồi tưởng được diễn giải là tiền kiếp ở Atlantis. Đây là ==mạch kể và góc nhìn tâm linh của tác giả==; bản tóm tắt này không xem chúng là chứng cứ lịch sử hay khoa học.",
      "Cách mình chọn đọc là tách hai tầng: một bên là câu chuyện về luân hồi, nhân quả; bên kia là những câu hỏi rất hiện tại về quyền lực, lòng tham, trách nhiệm và tình thương. Không cần vội tin hoặc bác bỏ toàn bộ mới có thể suy ngẫm cùng sách."
    ]
  },
  {
    heading: "Tầng câu chuyện — quyền lực để lại gì?",
    paragraphs: [
      "Trong mạch kể của sách, qua các đời sống Thomas được cho là đã trải qua, sự suy tàn của những nền văn minh được nối với lòng tham, chiến tranh và việc lạm dụng tri thức.",
      "Phần mình giữ lại là: quyền lực và năng lực càng lớn thì trách nhiệm càng lớn. Điều này có thể soi vào việc gần hơn như cách một người lãnh đạo, sử dụng dữ liệu, tiền bạc hoặc ảnh hưởng của mình.",
      "Còn Atlantis và các ký ức tiền kiếp không nên được kể lại như lịch sử đã kiểm chứng. Giá trị của chúng ở đây nằm trong vai trò ẩn dụ và lời cảnh báo đạo đức."
    ]
  },
  {
    heading: "Tầng hiện tại — trách nhiệm, không phán xét",
    paragraphs: [
      "Theo thế giới quan của sách, mỗi suy nghĩ và hành động đều gieo một “nhân”, rồi kết quả có thể trở lại trong đời này hoặc một đời khác.",
      "Ở mức có thể quan sát, mình thấy lời nói ảnh hưởng đến người nghe, lựa chọn lặp lại thành thói quen, còn thói quen góp phần tạo nên quan hệ và hướng sống. Nhìn hậu quả như vậy giúp mình sửa việc thuộc phần mình.",
      "Nhưng không nên dùng “nhân quả” để kết luận người gặp bệnh tật, nghèo khó hay bạo lực là đáng chịu. Mình thường không biết đủ hoàn cảnh của họ; trách nhiệm cá nhân không xóa trách nhiệm của cộng đồng và hệ thống."
    ]
  },
  {
    heading: "Nơi hiểu biết dừng lại",
    paragraphs: [
      "Sách đặt khoa học cạnh tâm linh, đồng thời dùng hồi tưởng, luân hồi và sự tiến hóa của linh hồn để giải thích hành trình của Thomas.",
      "Điều mình giữ lại là sự khiêm tốn trước điều chưa biết: không chế giễu trải nghiệm tinh thần của người khác, nhưng cũng không gọi một diễn giải là sự thật chỉ vì nó đem lại cảm giác có ý nghĩa.",
      "Tiền kiếp, ký ức hồi quy và cơ chế nhân quả qua nhiều đời vẫn là các khẳng định cần bằng chứng nếu muốn xem là tri thức khoa học. Người đọc có thể giữ chúng như niềm tin hoặc câu hỏi."
    ]
  },
  {
    heading: "Sau khi gấp Tập 1",
    paragraphs: [
      "Ba câu hỏi đáng mang theo: *Việc mình làm đang tác động đến ai? Quyền lực nhỏ mình có đang được dùng tử tế không? Có điều gì cần sửa ngay thay vì chờ một “quả” xa xôi?*",
      "Mình giữ lại lời mời sống có trách nhiệm hơn trong hiện tại: nhận lỗi sớm, giữ lời, bớt làm đau và cân nhắc hậu quả trước khi hành động.",
      "Mình vẫn để mở toàn bộ bản đồ siêu hình phía sau câu chuyện. Không chắc về luân hồi không ngăn mình chọn tử tế; tin vào luân hồi cũng không cho mình quyền phán xét số phận người khác."
    ]
  }
];

// Vietnamese reflection on repeated patterns, responsibility, care, and
// boundaries without presenting karma or spiritual healing as established fact.
const MUON_KIEP_2_PAGES: BookReadingPage[] = [
  {
    heading: "Vòng lặp 1 — điều gì đang tái diễn?",
    paragraphs: [
      "Tập 2 tiếp tục hành trình của Thomas và cho rằng những đau khổ lặp lại là bài học nghiệp lực chưa được hoàn tất.",
      "Trong đời sống hiện tại, có những kiểu phản ứng thật sự dễ tái diễn: né tránh đối thoại, nóng giận rồi hối hận, hoặc làm việc đến kiệt sức để tìm sự công nhận. Gọi tên vòng lặp có thể giúp mình thử một lựa chọn khác.",
      "Việc một linh hồn trở lại để học bài học cũ thuộc thế giới quan của sách. Mình có thể dùng hình ảnh “bài học chưa xong” như ẩn dụ mà không cần coi đó là kết luận đã được chứng minh."
    ]
  },
  {
    heading: "Vòng lặp 2 — từ cá nhân đến cộng đồng",
    paragraphs: [
      "Sách gọi lựa chọn của nhiều người kết lại thành hệ quả chung cho một cộng đồng hoặc dân tộc là “cộng nghiệp”.",
      "Ở mức có thể quan sát, hành vi tập thể thật sự để lại hậu quả: thói quen tiêu dùng, cách lan truyền thông tin, chính sách và sự im lặng trước điều sai đều góp phần tạo môi trường sống chung.",
      "Nhưng mình không thể nhìn một thiên tai, chiến tranh hay dịch bệnh rồi suy ra đó là sự “trả nghiệp” của nạn nhân. Cách giải thích ấy thiếu căn cứ, dễ đổ lỗi và che khuất những nguyên nhân xã hội, tự nhiên cần được xử lý."
    ]
  },
  {
    heading: "Vòng lặp 3 — đau khổ và chữa lành",
    paragraphs: [
      "Sách liên hệ việc chuyển hóa tâm trí, lòng biết ơn và tình thương với quá trình chữa lành tinh thần.",
      "Mình giữ lại ý rằng chăm sóc tinh thần, quan hệ an toàn và lối sống phù hợp có thể là một phần của quá trình hồi phục. Nỗi đau cũng có thể khiến mình nhìn lại, nhưng nó không tự động cao quý hay luôn đem đến bài học.",
      "Điều không nên suy diễn là bệnh tật chứng minh một người nghĩ sai, sống sai hay mang “nghiệp nặng”. Thực hành tinh thần không thay thế chẩn đoán, thuốc men, trị liệu hoặc hỗ trợ chuyên môn khi những điều ấy cần thiết."
    ]
  },
  {
    heading: "Vòng lặp 4 — tha thứ nhưng vẫn có ranh giới",
    paragraphs: [
      "Trong thế giới quan của sách, lòng từ bi, biết ơn và tha thứ giúp con người chuyển hóa những món nợ cũ.",
      "Phần mình giữ lại là: buông bớt oán giận có thể giúp một số người không bị quá khứ chi phối. Nhưng tha thứ không đồng nghĩa quên chuyện đã xảy ra, hòa giải bằng mọi giá hay mở cửa cho tổn thương tiếp diễn.",
      "Không có một nhịp tha thứ đúng cho tất cả. Khi có bạo lực hoặc lạm dụng, ưu tiên hợp lý là an toàn, khoảng cách và sự hỗ trợ; “nợ nghiệp” vẫn là cách giải thích thuộc niềm tin của sách."
    ]
  },
  {
    heading: "Một bản đồ chuyển hóa đủ gần",
    paragraphs: [
      "Thay vì đoán một kiếp trước, có thể vẽ một vòng lặp hiện tại: ==tác nhân → phản ứng quen thuộc → hậu quả → lựa chọn mới==. Đây không phải bằng chứng về nghiệp; nó chỉ là cách lấy lại phần chủ động mình đang có.",
      "Thử hỏi: *Điều gì kích hoạt mình? Mình thường phản ứng ra sao? Ai chịu tác động? Lần tới có thể dừng ở đâu để chọn khác?* Một thay đổi nhỏ nhưng lặp lại đáng tin hơn một lời hứa rất lớn.",
      "Từ Tập 2, mình giữ tinh thần nhận trách nhiệm mà không tự kết tội; còn luân hồi, cộng nghiệp siêu hình và sự tiến hóa của linh hồn vẫn được đặt đúng chỗ: ==niềm tin và câu hỏi mở==."
    ]
  }
];

// Vietnamese question-led reflection on technology and responsibility; the
// book's claims about karma, souls, and consciousness remain explicitly open.
const MUON_KIEP_3_PAGES: BookReadingPage[] = [
  {
    heading: "Câu hỏi 1 — công nghệ làm con người tốt hơn?",
    paragraphs: [
      "Sách đặt câu hỏi: máy móc, trí tuệ nhân tạo và bộ não con người khác nhau ở đâu; năng lực kỹ thuật sẽ đưa nhân loại về phía nào nếu đạo đức không theo kịp?",
      "Mình giữ lại lời nhắc rằng một công cụ mạnh không tự quyết định mục đích sử dụng. Trách nhiệm nằm ở những con người và tổ chức thiết kế, triển khai, giám sát công cụ, cùng khung pháp lý điều chỉnh nó.",
      "Ý thức là gì, máy có thể có ý thức không, và “linh hồn” liên hệ với trí tuệ ra sao vẫn là các câu hỏi triết học hoặc khoa học chưa thể chốt bằng một phép so sánh."
    ]
  },
  {
    heading: "Câu hỏi 2 — lòng tham đang mặc chiếc áo nào?",
    paragraphs: [
      "Sách cho rằng lòng tham, niềm tin mù quáng và việc thiếu nền tảng đạo đức có thể đẩy cá nhân lẫn xã hội vào biến động.",
      "Điều mình giữ lại là nhìn không chỉ vào mong muốn, mà cả cái giá của nó: ai hưởng lợi, ai chịu thiệt, điều gì bị khai thác và mình đang tự hợp thức hóa điều gì.",
      "Tuy vậy, tham vọng không mặc nhiên là lòng tham; tăng trưởng cũng không tự động tốt hoặc xấu. Lịch sử có nhiều nguyên nhân đan xen, nên không thể giải thích mọi khủng hoảng chỉ bằng suy thoái tâm thức hay nghiệp."
    ]
  },
  {
    heading: "Câu hỏi 3 — cho đi có thể thay đổi điều gì?",
    paragraphs: [
      "Trong câu chuyện, Thomas dần hướng đến phụng sự và tình thương như một con đường chuyển hóa những “hạt giống” đã gieo trong các đời sống được thuật lại.",
      "Mình giữ lại ý rằng cho đi thời gian, năng lực hoặc sự chú ý có thể tạo giá trị ngay trong hiện tại, nhất là khi có sự đồng thuận và không biến sự cho đi thành món nợ tinh thần buộc người nhận phải đáp trả.",
      "Còn việc cho đi có hóa giải nghiệp hay giải thoát linh hồn hay không thuộc hệ tư tưởng của sách. Không cần khẳng định cơ chế ấy mới có thể sống rộng lượng, và rộng lượng cũng không đòi hỏi tự làm mình kiệt quệ."
    ]
  },
  {
    heading: "Câu hỏi 4 — tự do của mình nằm ở đâu?",
    paragraphs: [
      "Theo sách, tự do ý chí cho phép mỗi người chọn những “hạt giống” cho tương lai, kể cả tương lai qua nhiều kiếp sống.",
      "Trong phạm vi mình có thể kiểm soát, mình vẫn chọn cách phản hồi, xin giúp đỡ, sửa sai và đặt giới hạn. Nhìn ra phần chủ động giúp hành động cụ thể hơn.",
      "Nhưng không phải ai cũng có cùng lựa chọn; nghèo đói, bệnh tật, sang chấn, phân biệt đối xử và môi trường sống đều giới hạn tự do. Quan hệ nhân quả qua kiếp sau là niềm tin, không phải lý do để quy hết hoàn cảnh cho cá nhân."
    ]
  },
  {
    heading: "Câu hỏi 5 — khép chuyện, không khép suy nghĩ",
    paragraphs: [
      "Sách khép lại hành trình tiền kiếp của Thomas bằng những suy tư về tình thương, sự thức tỉnh và vị trí của con người trong một vũ trụ rộng lớn.",
      "Mình không giữ một lời giải chắc chắn, mà giữ ba câu hỏi: *Mong muốn này đang nuôi điều gì? Ai sẽ chịu hậu quả từ lựa chọn của mình? Mình đang dựa vào bằng chứng, niềm tin hay nỗi sợ?*",
      "Luân hồi, ý thức vũ trụ và mục đích của linh hồn vẫn là câu hỏi mở. Có thể tôn trọng chúng mà không biến chúng thành sự thật bắt buộc; phần thiết thực nhất vẫn là sống có trách nhiệm với người và thế giới đang ở trước mặt."
    ]
  }
];

// Vietnamese, spoiler-light fiction reflection focused on narrative tension,
// Clarice's agency, ethical distance, and the limits of reading people.
const SILENCE_OF_THE_LAMBS_PAGES: BookReadingPage[] = [
  {
    heading: "Cánh cửa vào truyện — căng thẳng đến từ con người",
    paragraphs: [
      "*Sự Im Lặng Của Bầy Cừu* đặt Clarice Starling, một học viên FBI, vào một cuộc điều tra, nơi những cuộc trò chuyện với Hannibal Lecter cũng căng như việc lần theo dấu vết. Đây là tiền đề của truyện; chưa cần biết kết cục, người đọc vẫn cảm nhận được sức ép.",
      "Tiểu thuyết không chỉ hỏi ai đã gây án. Nó liên tục hỏi ai đang quan sát ai, ai nắm thông tin và một câu hỏi có thể đẩy người đối diện lùi xa đến đâu.",
      "Vì vậy, phần hấp dẫn nhất không nằm riêng ở cú sốc mà ở ==cuộc đấu giữa chú ý, ngôn ngữ và ranh giới==."
    ]
  },
  {
    heading: "Chân dung Clarice — năng lực không xóa được nỗi sợ",
    paragraphs: [
      "Clarice không được xây như một người hùng bất khả xâm phạm. Năng lực của cô hiện ra qua kỷ luật, khả năng quan sát và việc tiếp tục làm nhiệm vụ khi chịu áp lực.",
      "Cô còn phải hoạt động trong những căn phòng nơi tuổi tác, vị trí và giới tính ảnh hưởng đến cách cô được nhìn nhận. Lớp xung đột ấy khiến cuộc điều tra đồng thời là hành trình giữ tiếng nói của một người chưa có nhiều quyền lực.",
      "Điểm đáng nhớ không phải hình ảnh không biết sợ, mà là ==khả năng hành động mà không để nỗi sợ thay mình quyết định==."
    ]
  },
  {
    heading: "Những cuộc đối thoại — thông minh chưa chắc tử tế",
    paragraphs: [
      "Các cảnh giữa Clarice và Lecter vận hành như những ván đấu ngôn ngữ. Thông tin được trao có điều kiện; câu hỏi vừa để tìm hiểu vừa có thể trở thành đòn bẩy để khai thác điểm yếu.",
      "Lecter quan sát người khác rất sắc bén, nhưng khả năng nhìn thấu không đồng nghĩa với sự quan tâm. Tiểu thuyết nhờ đó tạo ra một phân biệt quan trọng: trí tuệ có thể gây ấn tượng, còn đạo đức mới quyết định nó được dùng để nâng đỡ hay làm tổn thương.",
      "Khi đọc, hãy để ý ==ai đặt câu hỏi, ai đặt điều kiện và ai đang phải trả giá cho cuộc trao đổi==."
    ]
  },
  {
    heading: "Nhịp kể — điều tác giả chưa cho biết",
    paragraphs: [
      "Thomas Harris tạo căng thẳng bằng chi tiết điều tra, không gian khép kín, những đoạn đối thoại ngắn và sự thay đổi điểm nhìn. Người đọc được đưa đến gần nguy hiểm nhưng luôn thiếu một phần thông tin cần thiết.",
      "Khoảng thiếu ấy khiến một vật nhỏ, một lựa chọn từ ngữ hay một lần đổi nhịp đều có trọng lượng. Hồi hộp đến từ việc phải ghép dấu hiệu trong khi thời gian của câu chuyện vẫn tiến lên.",
      "Đây vẫn là kỹ thuật của tiểu thuyết, không phải cẩm nang đọc vị người thật. ==Chú ý đến chi tiết giúp đọc truyện sâu hơn, nhưng không trao cho mình quyền chẩn đoán người khác.=="
    ]
  },
  {
    heading: "Sau lớp trinh thám — đọc bóng tối mà không tôn sùng nó",
    paragraphs: [
      "Một phản diện có thể cuốn hút về mặt văn chương mà không đáng ngưỡng mộ về mặt đạo đức. Sự lịch thiệp hay sắc bén không xóa đi tổn hại do nhân vật gây ra.",
      "Cách đọc có trách nhiệm là không biến bạo lực thành màn trình diễn duy nhất. Cần giữ trong tầm nhìn cả nỗi sợ, quyền tự quyết và nỗ lực của những người đang đối diện với bạo lực ấy.",
      "Cuốn tiểu thuyết vì thế để lại một câu hỏi lớn hơn vụ án: ==một người có thể nhìn thẳng vào bóng tối mà vẫn giữ được ranh giới, sự tỉnh táo và lòng trắc ẩn hay không?=="
    ]
  }
];

export const LIBRARY_BOOKS: LibraryBook[] = [
  {
    slug: "dac-nhan-tam",
    title: "Đắc Nhân Tâm",
    titleEn: "How to Win Friends and Influence People",
    author: "Dale Carnegie",
    cover: "/books/dac-nhan-tam.webp",
    coverBack: "/books/dac-nhan-tam-back.webp",
    blogSlug: "dac-nhan-tam-review",
    hue: 222, // navy spine to match the VN First News cover
    saturation: 40,
    lightness: 20,
    foil: "#C9A24B",
    scale: 1.06,
    keyPoints: {
      en: [
        "Listen long enough to understand the person, not only to prepare a reply.",
        "Make appreciation specific and sincere instead of using praise as leverage.",
        "Address the problem clearly without reducing the other person's dignity.",
        "Tact becomes manipulation when the other person loses the right to disagree.",
        "Use communication skills to make a relationship clearer and kinder, not to win it.",
      ],
      vi: [
        "Lắng nghe đủ lâu để hiểu người đối diện, không chỉ để chuẩn bị câu trả lời.",
        "Ghi nhận cụ thể và chân thành, thay vì dùng lời khen như một đòn bẩy.",
        "Nói rõ vấn đề nhưng không làm nhỏ đi phẩm giá của người nghe.",
        "Sự khéo léo trượt thành thao túng khi người kia không còn quyền bất đồng.",
        "Dùng kỹ năng giao tiếp để mối quan hệ rõ ràng và tử tế hơn, không phải để thắng.",
      ],
    },
    readingPages: { vi: DAC_NHAN_TAM_PAGES },
  },
  {
    slug: "atomic-habits",
    title: "Atomic Habits",
    titleEn: "Atomic Habits",
    author: "James Clear",
    blogSlug: "atomic-habits",
    cover: "/books/atomic-habits.webp",
    hue: 36,
    saturation: 28,
    lightness: 60,
    foil: "#6B4E2E",
    scale: 1.04,
    keyPoints: {
      en: [
        "The book separates outcomes, daily systems, and the identity those actions support.",
        "A small repeatable action can be more useful than a dramatic plan that is hard to start.",
        "Cues, friction, and environment can make a habit easier or harder to repeat.",
        "An identity-based habit is evidence about who you are becoming, not a verdict on your worth.",
        "Missing once does not define you; the useful question is how gently you return.",
      ],
      vi: [
        "Cuốn sách tách kết quả, hệ thống hằng ngày và căn tính mà hành động đang bồi đắp.",
        "Một hành động nhỏ có thể lặp lại hữu ích hơn kế hoạch lớn nhưng khó bắt đầu.",
        "Tín hiệu, ma sát và môi trường có thể làm một thói quen dễ hoặc khó lặp lại.",
        "Thói quen dựa trên căn tính là bằng chứng về hướng mình đi, không phải phán quyết về giá trị bản thân.",
        "Một lần lỡ nhịp không định nghĩa mình; câu hỏi hữu ích là mình quay lại thế nào.",
      ],
    },
    readingPages: { vi: ATOMIC_HABITS_PAGES },
  },
  {
    slug: "silence-of-the-lambs",
    title: "Sự Im Lặng Của Bầy Cừu",
    titleEn: "The Silence of the Lambs",
    author: "Thomas Harris",
    cover: "/books/silence-of-the-lambs.jpg",
    hue: 210, // pale/white spine to match the VN cover
    saturation: 8,
    lightness: 86,
    foil: "#3A3A3A",
    scale: 1.0,
    keyPoints: {
      en: [
        "The crime story keeps Clarice Starling's attention, pressure, and resolve at its center.",
        "Courage in the novel can coexist with fear, vulnerability, and being underestimated.",
        "Intelligence and politeness are not evidence of conscience or safety.",
        "Clarice needs information without surrendering her boundaries to the person offering it.",
        "The novel's darkness is worth reading critically, without turning harm into spectacle.",
      ],
      vi: [
        "Câu chuyện điều tra luôn giữ sự quan sát, áp lực và quyết tâm của Clarice Starling ở trung tâm.",
        "Lòng can đảm trong truyện vẫn có thể đi cùng nỗi sợ, sự mong manh và cảm giác bị xem nhẹ.",
        "Trí thông minh cùng vẻ lịch thiệp không phải bằng chứng của lương tri hay sự an toàn.",
        "Clarice cần thông tin nhưng vẫn phải giữ ranh giới với người đang cung cấp nó.",
        "Bóng tối của cuốn tiểu thuyết cần được đọc tỉnh táo, không biến tổn thương thành màn trình diễn.",
      ],
    },
    // Vietnamese reflection; English intentionally falls back to English key points.
    readingPages: { vi: SILENCE_OF_THE_LAMBS_PAGES },
  },
  {
    slug: "48-laws-of-power",
    title: "48 Nguyên Tắc Chủ Chốt Của Quyền Lực",
    titleEn: "The 48 Laws of Power",
    author: "Robert Greene",
    cover: "/books/48-laws-of-power.jpg",
    coverBack: "/books/48-laws-of-power-back.jpg",
    hue: 0, // near-black spine to match the VN cover
    saturation: 30,
    lightness: 12,
    foil: "#CFCFCF",
    scale: 1.12,
    coverNote: {
      en: "A critical reading of power, not a manual for manipulation: notice status and insecurity while keeping credit honest, boundaries clear, and disagreement possible.",
      vi: "Một cách đọc phản biện về quyền lực, không phải cẩm nang thao túng: nhìn ra địa vị và bất an, nhưng vẫn ghi nhận công bằng, giữ ranh giới và chừa chỗ cho bất đồng.",
    },
    keyPoints: {
      en: [
        "The book describes power strategies; description is not the same as ethical endorsement.",
        "Status anxiety can shape a room, but it does not require hiding your ability or flattering authority.",
        "Share credit accurately and avoid public humiliation without erasing your own contribution.",
        "Reject tactics that depend on deception, coercion, engineered dependence, or silencing harm.",
        "Before using a tactic, ask whether it respects the other person's dignity, right to know, and real freedom to choose.",
      ],
      vi: [
        "Cuốn sách mô tả các chiến lược quyền lực; mô tả không đồng nghĩa với tán thành về đạo đức.",
        "Sự bất an về địa vị có thể chi phối một căn phòng, nhưng không buộc mình phải giấu năng lực hay tâng bốc người có quyền.",
        "Ghi nhận công bằng và tránh làm người khác bẽ mặt, nhưng không xóa phần đóng góp của chính mình.",
        "Không dùng chiến thuật dựa trên lừa dối, ép buộc, tạo lệ thuộc hoặc buộc người khác im lặng trước điều sai.",
        "Trước một chiến thuật, hãy hỏi nó có tôn trọng phẩm giá, quyền được biết và quyền lựa chọn thật sự của người kia hay không.",
      ],
    },
    // Vietnamese critical reflection; English intentionally uses the English key points.
    readingPages: { vi: LAWS_OF_POWER_PAGES },
  },
  {
    slug: "thinking-fast-and-slow",
    title: "Tư Duy Nhanh Và Chậm",
    titleEn: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    cover: "/books/thinking-fast-and-slow.webp",
    hue: 40,
    saturation: 12,
    lightness: 66,
    foil: "#4A463E",
    scale: 1.08,
    keyPoints: {
      en: [
        "The book uses System 1 and System 2 as a model for fast and effortful thinking.",
        "First impressions, familiar stories, and initial numbers can steer judgment before we notice.",
        "For an important decision, ask what evidence is present and what information is still missing.",
        "Framing and fear of loss can change a choice even when the underlying facts stay the same.",
        "Slower thinking is not automatically correct; it is a chance to check, compare, and revise.",
      ],
      vi: [
        "Cuốn sách dùng Hệ thống 1 và Hệ thống 2 như một mô hình cho lối nghĩ nhanh và lối nghĩ cần nhiều nỗ lực.",
        "Ấn tượng đầu, câu chuyện quen và con số xuất hiện trước có thể chi phối phán đoán khi mình chưa nhận ra.",
        "Với quyết định quan trọng, hãy hỏi bằng chứng nào đang có và thông tin nào còn thiếu.",
        "Cách đóng khung và nỗi sợ mất mát có thể làm thay đổi lựa chọn dù dữ kiện nền vẫn vậy.",
        "Nghĩ chậm không tự động đúng; nó chỉ tạo cơ hội để kiểm tra, so sánh và sửa lại.",
      ],
    },
    readingPages: { vi: THINKING_FAST_SLOW_PAGES },
  },
  {
    slug: "goodbye-things",
    title: "Lối Sống Tối Giản Của Người Nhật",
    titleEn: "Goodbye, Things",
    author: "Fumio Sasaki",
    cover: "/books/goodbye-things.webp",
    coverBack: "/books/goodbye-things-back.webp",
    hue: 150,
    saturation: 10,
    lightness: 80,
    foil: "#6A8A82",
    scale: 0.96,
    keyPoints: {
      en: [
        "The book presents minimalism as a tool, not a moral score or a contest to own the least.",
        "Every object asks for space, care, and attention, so keeping something can be an active choice.",
        "A useful question is whether an item serves the life you live now, not only the money already spent.",
        "Starting with one drawer is enough to test whether less friction actually helps you.",
        "Needs differ across families, work, hobbies, health, and finances; minimalism should adapt to real life.",
      ],
      vi: [
        "Cuốn sách xem tối giản là một công cụ, không phải thước đo đạo đức hay cuộc thi sở hữu ít nhất.",
        "Mỗi món đồ cần chỗ, công sức bảo quản và sự chú ý; giữ lại cũng nên là một lựa chọn có ý thức.",
        "Một câu hỏi hữu ích là món đồ có phục vụ đời sống hiện tại không, thay vì chỉ nhìn số tiền đã lỡ chi.",
        "Dọn một ngăn kéo đã đủ để thử xem ít ma sát hơn có thật sự hợp với mình hay không.",
        "Nhu cầu khác nhau theo gia đình, công việc, sở thích, sức khỏe và tài chính; tối giản cần đi cùng đời sống thật.",
      ],
    },
    // Vietnamese reflection; English intentionally falls back to English key points.
    readingPages: { vi: GOODBYE_THINGS_PAGES },
  },
  {
    slug: "muon-kiep-nhan-sinh-1",
    title: "Muôn Kiếp Nhân Sinh - Tập 1",
    titleEn: "Many Lives, Many Times - Vol. 1",
    author: "Nguyên Phong",
    cover: "/books/muon-kiep-nhan-sinh-1.webp",
    coverBack: "/books/muon-kiep-nhan-sinh-1-back.jpg",
    hue: 220, // dark navy (broken-watch cover)
    saturation: 30,
    lightness: 12,
    foil: "#D8DCE4",
    scale: 1.0,
    keyPoints: {
      en: [
        "The book presents reincarnation and karma as the worldview through which Thomas's story is told.",
        "Read as a moral lens, cause and effect invites attention to what our choices leave behind today.",
        "Atlantis, past lives, and the soul belong to the book's spiritual narrative, not established fact here.",
        "The reflection I keep is responsibility without using karma to blame people for suffering.",
        "Belief can remain open while kindness, repair, and accountability are practiced in the present.",
      ],
      vi: [
        "Cuốn sách dùng luân hồi và nhân quả làm thế giới quan để kể hành trình của Thomas.",
        "Nếu đọc như một lăng kính đạo đức, nhân quả gợi mình chú ý đến điều lựa chọn hôm nay để lại.",
        "Atlantis, tiền kiếp và linh hồn thuộc về câu chuyện tâm linh của sách; trang này không trình bày chúng như sự thật đã được kiểm chứng.",
        "Điều mình giữ là trách nhiệm, nhưng không dùng nhân quả để đổ lỗi cho người đang chịu khổ.",
        "Niềm tin có thể để ngỏ, còn sống tử tế, sửa sai và chịu trách nhiệm có thể bắt đầu trong hiện tại.",
      ],
    },
    // Vietnamese reflection; English intentionally falls back to attributed key points.
    readingPages: { vi: MUON_KIEP_1_PAGES },
  },
  {
    slug: "muon-kiep-nhan-sinh-2",
    title: "Muôn Kiếp Nhân Sinh - Tập 2",
    titleEn: "Many Lives, Many Times - Vol. 2",
    author: "Nguyên Phong",
    cover: "/books/muon-kiep-nhan-sinh-2.jpg",
    coverBack: "/books/muon-kiep-nhan-sinh-2-back.jpg",
    hue: 210, // ocean blue
    saturation: 42,
    lightness: 30,
    foil: "#EAF1FB",
    scale: 1.0,
    keyPoints: {
      en: [
        "The book expands its spiritual worldview from individual karma to shared patterns and responsibility.",
        "I can read 'karma' as a prompt to notice repeated choices without treating it as proof or punishment.",
        "Responsibility is not self-blame, and illness or suffering should not be turned into a moral verdict.",
        "Forgiveness may release resentment while boundaries still protect against repeated harm.",
        "Spiritual reflection can support care, but it does not replace medical, legal, or practical help.",
      ],
      vi: [
        "Cuốn sách mở rộng thế giới quan tâm linh từ nghiệp cá nhân sang những khuôn mẫu và trách nhiệm chung.",
        "Mình có thể đọc “nghiệp” như lời nhắc nhìn vào lựa chọn lặp lại, không xem đó là bằng chứng hay hình phạt.",
        "Nhận trách nhiệm không phải tự kết tội; bệnh tật và đau khổ cũng không nên bị biến thành phán quyết đạo đức.",
        "Tha thứ có thể giúp buông oán giận, trong khi ranh giới vẫn bảo vệ mình khỏi tổn thương lặp lại.",
        "Chiêm nghiệm tinh thần có thể nâng đỡ, nhưng không thay thế hỗ trợ y khoa, pháp lý hay thực tế.",
      ],
    },
    // Vietnamese reflection; English intentionally falls back to attributed key points.
    readingPages: { vi: MUON_KIEP_2_PAGES },
  },
  {
    slug: "muon-kiep-nhan-sinh-3",
    title: "Muôn Kiếp Nhân Sinh - Tập 3",
    titleEn: "Many Lives, Many Times - Vol. 3",
    author: "Nguyên Phong",
    cover: "/books/muon-kiep-nhan-sinh-3.webp",
    coverBack: "/books/muon-kiep-nhan-sinh-3-back.jpg",
    hue: 205, // deep door-blue
    saturation: 48,
    lightness: 22,
    foil: "#CFE6F5",
    scale: 1.0,
    keyPoints: {
      en: [
        "The book connects its spiritual worldview to questions about technology, free will, and humanity's future.",
        "I read its warning as a prompt to ask who benefits from a powerful tool and who carries the risk.",
        "Claims about souls, karma, and consciousness remain beliefs within the book, not settled conclusions here.",
        "AI can support decisions, but people still own the purposes, safeguards, and consequences around its use.",
        "A grounded takeaway is to pair capability with accountability, care, and room to correct harm.",
      ],
      vi: [
        "Cuốn sách nối thế giới quan tâm linh với các câu hỏi về công nghệ, tự do ý chí và tương lai con người.",
        "Mình đọc lời cảnh báo ấy như lời nhắc hỏi ai hưởng lợi từ một công cụ mạnh và ai phải gánh rủi ro.",
        "Các khẳng định về linh hồn, nhân quả và tâm thức vẫn là niềm tin trong sách, không phải kết luận đã được xác lập ở đây.",
        "AI có thể hỗ trợ quyết định, nhưng con người vẫn chịu trách nhiệm về mục đích, biện pháp bảo vệ và hệ quả khi sử dụng.",
        "Điều thực tế mình giữ là đặt trách nhiệm, sự quan tâm và khả năng sửa sai đi cùng năng lực.",
      ],
    },
    // Vietnamese reflection; English intentionally falls back to attributed key points.
    readingPages: { vi: MUON_KIEP_3_PAGES },
  },
];
