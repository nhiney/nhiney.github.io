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
  },
  {
    heading: "Lăng kính 6 — Danh tiếng và năng lực thật",
    paragraphs: [
      "Cuốn sách dành nhiều sự chú ý cho hình ảnh, danh tiếng và cách người khác diễn giải hành động của mình. Điều đó có cơ sở thực tế: khi thông tin không đầy đủ, con người thường dựa vào dấu hiệu dễ thấy để quyết định nên tin ai.",
      "Nhưng chăm sóc danh tiếng khác với dựng một phiên bản giả. Cách bền hơn là làm rõ cam kết, nói trước giới hạn, lưu lại đóng góp và để hành vi lặp lại tạo thành bằng chứng theo thời gian.",
      "Một hình ảnh có thể mở cửa; chỉ năng lực và cách đối xử với người khác mới quyết định cánh cửa ấy còn mở bao lâu. ==Uy tín tốt là khoảng cách giữa điều mình nói và điều mình làm ngày càng nhỏ.=="
    ]
  },
  {
    heading: "Lăng kính 7 — Không phải căn phòng nào cũng là bàn cờ",
    paragraphs: [
      "Khi đọc liên tục về chiến lược, mình có thể bắt đầu nhìn mọi im lặng như âm mưu và mọi quan hệ như cuộc mặc cả. Lăng kính ấy hữu ích trong môi trường cạnh tranh, nhưng trở nên méo mó nếu mang nguyên vẹn vào tình bạn, gia đình hoặc một nhóm đang cần sự tin cậy.",
      "Có những tình huống cần tính toán vị thế; cũng có những lúc điều mạnh nhất là hỏi thẳng, chia sẻ điều mình chưa biết và cho người khác cơ hội sửa một hiểu lầm.",
      "Trưởng thành về quyền lực không chỉ là biết chơi. Đó còn là ==nhận ra lúc nào trò chơi không tồn tại, hoặc lúc nào mình có thể cùng người khác thay đổi luật chơi==."
    ]
  },
  {
    heading: "Cách mình đọc 48 nguyên tắc mà không nuốt trọn chúng",
    paragraphs: [
      "Có một điều mình phải tự nhắc suốt lúc đọc: một câu chuyện hay chưa chắc là một bằng chứng đủ. Greene kể lịch sử rất cuốn, mỗi nguyên tắc đều có người thắng, kẻ thua và một khoảnh khắc khiến mọi thứ như được giải thích gọn ghẽ.",
      "Nhưng đời thật hiếm khi gọn như vậy. Một người thành công sau khi dùng một chiến thuật không có nghĩa chiến thuật đó luôn đúng; cùng một cách làm đặt vào một căn phòng khác có thể tạo kết quả hoàn toàn khác.",
      "Vì thế mình không đọc 48 điều như 48 mệnh lệnh. Mình đọc chúng như 48 khả năng để soi: *nó đúng trong điều kiện nào, ai được lợi, ai trả giá, và mình có muốn trở thành người dùng nó hay không?*"
    ]
  },
  {
    heading: "Có năng lực thôi đôi khi vẫn chưa đủ",
    paragraphs: [
      "Nhiều nguyên tắc làm mình nghĩ đến một sự thật hơi khó chịu: năng lực và cách năng lực được nhìn thấy là hai chuyện khác nhau. Mình có thể làm tốt nhưng trình bày vụng, có thể nói đúng nhưng chạm vào sự bất an của người có quyền, và rồi kết quả không đi theo điều mình tưởng là công bằng.",
      "Điều mình giữ lại không phải là học cách diễn. Nó là biết nói rõ mình đã làm gì, ghi nhận đúng người, giữ lời đủ lâu để danh tiếng có dữ kiện đứng phía sau. Mình không muốn tạo vẻ bí ẩn bằng cách giấu công sức, càng không muốn trông giỏi hơn nhờ phần việc của người khác.",
      "Hình ảnh có thể giúp một cánh cửa mở sớm hơn. Nhưng nếu bên trong không có năng lực và cách đối xử tử tế, cánh cửa đó sớm muộn cũng đóng. ==Uy tín mình muốn có là khoảng cách giữa điều mình nói và điều mình làm ngày càng nhỏ.=="
    ]
  },
  {
    heading: "Im lặng có thể là khôn ngoan, cũng có thể là thao túng",
    paragraphs: [
      "Có những đoạn Greene khuyên nói ít, giấu ý định và quan sát nhiều hơn. Mình hiểu sức mạnh của việc không kể mọi kế hoạch khi chúng còn non, của việc biết giữ dữ liệu nhạy cảm, và của một khoảng im lặng trước khi phản hồi lúc đang nóng.",
      "Nhưng mình cũng thấy ranh giới ở đây rất mỏng. Không nói vì mình cần thời gian suy nghĩ khác hoàn toàn với không nói để người kia không có đủ thông tin mà lựa chọn. Một bên là thận trọng; bên kia là lấy sự mù mờ làm lợi thế.",
      "Mình muốn giữ câu hỏi này: *thông tin mình đang giấu có làm người khác mất quyền tự bảo vệ hoặc quyền đồng ý thật sự không?* Nếu có, sự khôn ngoan đã trượt sang thao túng rồi."
    ]
  },
  {
    heading: "Mình muốn được cần đến, nhưng không muốn ai bị mắc kẹt",
    paragraphs: [
      "Cuốn sách nhắc rất nhiều đến việc trở nên khó thay thế. Mình hiểu cảm giác đó: ai cũng muốn năng lực của mình có giá trị, muốn khi mình có mặt thì công việc tốt hơn một chút.",
      "Nhưng mình không muốn biến giá trị thành chiếc khóa giữ người khác ở lại. Với mình, được cần vì mình làm tốt khác với được cần vì mình cố tình giữ thông tin, cô lập một người hoặc khiến cả hệ thống không thể chạy nếu thiếu mình.",
      "Một mối quan hệ lành mạnh vẫn có sự nương tựa, nhưng không ai phải sợ mất tất cả nếu rời đi. ==Giá trị bền không nằm ở việc người khác không thể sống thiếu mình; nó nằm ở điều tốt mình tạo ra ngay cả khi họ vẫn có quyền lựa chọn.=="
    ]
  },
  {
    heading: "Không phải bất đồng nào cũng cần một người thua",
    paragraphs: [
      "Những phần nói về đối thủ là nơi mình dè chừng nhất. Có nguyên tắc rất sắc trong việc nhìn nguồn gốc xung đột, nhưng cũng có lời khuyên đẩy mọi bất đồng thành cuộc chiến phải thắng đến cùng.",
      "Mình nghĩ đến những cuộc tranh luận mà sau cùng chẳng ai còn nhớ vấn đề ban đầu là gì, chỉ nhớ cảm giác bị xúc phạm. Thắng một câu nói nhưng làm hỏng cả mối quan hệ đôi khi là một kiểu thua rất đắt.",
      "Điều mình rút ra là trước khi đối đầu, phải biết mình muốn bảo vệ gì, khi nào có thể dừng và hậu quả sẽ còn ở lại với ai. Có những việc cần dứt khoát. Nhưng làm nhục hay trả đũa hiếm khi là dấu hiệu của một người thật sự mạnh."
    ]
  },
  {
    heading: "Đi hết một quyết định trong đầu trước khi bước",
    paragraphs: [
      "Mình hay bị hấp dẫn bởi bước đầu của một kế hoạch: ý tưởng mới, cảm giác bắt đầu, viễn cảnh mọi thứ chạy đúng. Cuốn sách kéo mình đi xa hơn một chút, đến câu hỏi khó chịu hơn: *nếu việc này thành công, chuyện gì xảy ra tiếp theo?*",
      "Tập trung, chọn thời điểm và nghĩ tới điểm kết thúc là những ý mình thấy thật sự hữu ích. Chúng nhắc mình viết rõ điều muốn đạt, cái giá chấp nhận được và dấu hiệu phải dừng, thay vì lao đi chỉ vì đã lỡ bước đầu tiên.",
      "Táo bạo không phải nhắm mắt rồi nhảy. Với mình, nó là nhìn đủ rủi ro mà vẫn quyết định bước — và cũng đủ bình tĩnh để chưa bước khi dữ kiện chưa tới."
    ]
  },
  {
    heading: "Đám đông thường chạm vào phần cô đơn trong mình",
    paragraphs: [
      "Có những lúc mình tin một điều nhanh hơn chỉ vì xung quanh ai cũng đang tin. Không hẳn vì mình thiếu suy nghĩ, mà vì cảm giác được thuộc về một nhóm rất dễ chịu — nhất là khi nhóm đó cho mình một câu trả lời đơn giản và một người để cùng phản đối.",
      "Cuốn sách nhìn khá rõ sức mạnh của cảm xúc, hình ảnh và lời hứa đối với đám đông. Phần này khiến mình không chỉ để ý người đang nói, mà để ý cả phần nào trong mình đang muốn được trấn an, được công nhận hoặc được đứng về một phía.",
      "Ảnh hưởng tử tế không dùng nỗi sợ và sự cô đơn để khóa suy nghĩ của người khác. Nếu một nhóm chỉ cho phép mình thuộc về khi mình ngừng đặt câu hỏi, cái giá của sự thuộc về đó có lẽ quá cao."
    ]
  },
  {
    heading: "Mềm dẻo không có nghĩa là không có xương sống",
    paragraphs: [
      "Mình từng nghĩ nhất quán nghĩa là phải giữ nguyên cách làm. Nhưng có lúc bám vào một phiên bản cũ của mình chỉ vì sợ bị gọi là thay đổi còn nguy hiểm hơn việc thừa nhận: cách này không còn phù hợp nữa.",
      "Greene đề cao khả năng biến đổi, biết dừng sau chiến thắng và không để mình trở nên quá dễ đoán. Mình thích ý linh hoạt đó, miễn là thứ thay đổi là phương pháp chứ không phải mọi giá trị mình từng nói là quan trọng.",
      "Mình muốn có vài điều đủ vững để không bán rẻ, và đủ nhiều cách để bảo vệ chúng. ==Mềm dẻo không phải không có xương sống; nó là không bắt xương sống phải mang một hình dạng duy nhất.=="
    ]
  },
  {
    heading: "Điều mình thật sự mang ra khỏi 48 luật",
    paragraphs: [
      "Sau rất nhiều câu chuyện và chiến thuật, mình chỉ muốn mang theo bốn câu hỏi: ai đang kiểm soát hình ảnh, ai giữ thông tin, ai đang bị làm cho phụ thuộc, và cảm xúc nào khiến cả căn phòng bớt tỉnh táo?",
      "Nhìn ra trò chơi không có nghĩa mình phải chơi giống họ. Mình vẫn có thể hỏi cho rõ, ghi lại quyết định, mời thêm tiếng nói, chia nhỏ quyền lực hoặc rời khỏi nơi cứ bắt mình đánh đổi phẩm giá để tồn tại.",
      "Có lẽ giá trị lớn nhất của cuốn sách với mình không phải là trở nên cao tay hơn. Nó là bớt ngây thơ mà không cần trở nên cay nghiệt — nhìn thấy quyền lực, nhưng không để quyền lực quyết định toàn bộ cách mình nhìn con người."
    ]
  },
  {
    heading: "Phía sau nhu cầu kiểm soát thường là một nỗi sợ",
    paragraphs: [
      "Đọc nhiều về quyền lực, mình bắt đầu tự hỏi vì sao con người cần kiểm soát nhau đến vậy. Có khi phía sau tham vọng không chỉ là muốn nhiều hơn, mà là sợ bị xem thường, sợ mất chỗ đứng, sợ một ngày mình không còn quan trọng.",
      "Nhìn thấy nỗi sợ không làm hành vi gây hại trở nên đúng. Nhưng nó giúp mình hiểu quyền lực không phải lúc nào cũng đi ra từ sự tự tin; đôi khi nó là một lớp áo rất cứng khoác lên phần bên trong đang bất an.",
      "Điều đó cũng quay lại với mình. Mỗi khi muốn nắm hết thông tin, thắng cho bằng được hoặc khiến người khác phản ứng theo ý mình, có lẽ mình nên hỏi: *mình đang bảo vệ điều gì, và có cách nào bảo vệ nó mà không phải làm ai nhỏ đi không?*"
    ]
  },
  {
    heading: "Quyền lực khó nhất là không để mình bị quyền lực đổi thành người khác",
    paragraphs: [
      "Khi chưa có quyền, mình rất dễ nghĩ rằng nếu một ngày được quyết định, mình chắc chắn sẽ công bằng hơn những người trước. Nhưng quyền lực không chỉ bộc lộ tính cách; nó còn âm thầm sửa lại cách một người giải thích hành vi của chính mình.",
      "Mình có thể gọi kiểm soát là trách nhiệm, gọi im lặng của người khác là đồng thuận, gọi đặc quyền là phần thưởng xứng đáng. Càng ít người dám phản biện, câu chuyện mình kể về bản thân càng dễ trở nên đẹp một cách nguy hiểm.",
      "Vì vậy, điều mình muốn chuẩn bị trước không chỉ là cách có thêm ảnh hưởng. Nó là những người được quyền nói thật với mình, những quyết định phải giải thích được và một nguyên tắc mình vẫn giữ ngay cả khi chẳng ai đủ sức bắt mình giữ."
    ]
  },
  {
    heading: "Một trang giấy cho những lúc mình thấy lép vế",
    paragraphs: [
      "Sau một tình huống khiến mình khó chịu, có thể ghi bốn dòng: ai có quyền quyết định, ai nắm thông tin, ai chịu rủi ro và tiếng nói nào đang vắng mặt. Bản ghi này giúp tách cấu trúc thật khỏi cảm giác bị đe dọa nhất thời.",
      "Tiếp theo, chọn một hành động ít gây hại nhưng tăng độ rõ: hỏi tiêu chí quyết định, xác nhận thỏa thuận bằng văn bản, mời thêm góc nhìn hoặc nói rõ ranh giới mình không muốn vượt qua.",
      "Đây là cách mình muốn khép cuốn sách: không ngây thơ trước quyền lực, cũng không để quyền lực trở thành ngôn ngữ duy nhất. ==Tỉnh táo để tự bảo vệ; tử tế để không biến mình thành điều mình từng phải đề phòng.=="
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
  },
  {
    heading: "Nhớ một người — chú ý thay vì biểu diễn",
    paragraphs: [
      "Nhớ tên, sở thích hoặc điều một người từng kể có thể khiến họ cảm thấy được nhìn thấy. Nhưng giá trị không nằm ở trí nhớ như một màn trình diễn; nó nằm ở việc thông tin ấy được dùng để tiếp nối sự quan tâm, không phải để tạo cảm giác thân thiết giả.",
      "Nếu không nhớ, hỏi lại một cách thành thật vẫn tốt hơn giả vờ. Một câu *“mình nhớ bạn từng nói về việc này, nhưng không chắc mình nhớ đúng”* vừa thể hiện chú ý vừa chừa chỗ để người kia sửa.",
      "Sự quan tâm đáng tin thường rất bình thường: gọi đúng tên, không ngắt lời, giữ điều đã hứa và nhớ hỏi lại chuyện quan trọng. ==Con người không cần được gây ấn tượng nhiều bằng được hiện diện cùng.=="
    ]
  },
  {
    heading: "Khi muốn thuyết phục — trả lại quyền lựa chọn",
    paragraphs: [
      "Nhìn từ góc của người khác giúp một đề nghị rõ hơn: họ đang cần gì, sợ mất gì và phải bỏ ra điều gì để đồng ý. Tuy vậy, thấu hiểu không nên trở thành công cụ tìm đúng điểm yếu để ép một cái gật đầu.",
      "Một lời đề nghị tử tế nêu đủ lợi ích, chi phí, giới hạn và cho phép câu trả lời là *không*. Nếu quyết định chỉ xuất hiện vì người kia thiếu thông tin, thấy tội lỗi hoặc sợ quan hệ rạn nứt, đó chưa phải đồng thuận thật sự.",
      "Mình có thể muốn một kết quả mà vẫn tôn trọng quyền tự quyết của người đối diện. ==Thuyết phục tốt làm lựa chọn sáng rõ hơn; thao túng làm những lựa chọn khác khó được nhìn thấy.=="
    ]
  },
  {
    heading: "Sáu điều nhỏ khiến một người cảm thấy được nhìn thấy",
    paragraphs: [
      "Phần đầu của sách có sáu gợi ý rất quen: quan tâm thật, mỉm cười, nhớ tên, biết nghe, nói về điều người kia quan tâm và giúp họ cảm thấy mình có giá trị. Đọc liền một lượt, mình thấy chúng đều quay về cùng một việc: bớt để cái tôi chiếm hết căn phòng.",
      "Nhưng mình cũng nghĩ những điều nhỏ này chỉ có ý nghĩa khi chúng thật. Nhớ tên một người mà quên ranh giới của họ, hỏi chuyện rồi không nghe câu trả lời, hay làm họ thấy quan trọng chỉ để lát nữa nhờ vả — tất cả vẫn là một cuộc trao đổi được bọc bằng vẻ tử tế.",
      "Trước một cuộc gặp, có lẽ mình không cần học thêm câu nói hay. Mình chỉ cần tự hỏi: *người này đang mang điều gì vào căn phòng, và mình đã đủ yên để nhìn thấy chưa?*"
    ]
  },
  {
    heading: "Đồng thuận không nhất thiết phải bắt đầu bằng tranh thắng",
    paragraphs: [
      "Mười hai nguyên tắc về thuyết phục nghe khá nhiều, nhưng điều ở lại với mình lại rất đơn giản: đừng biến cuộc trò chuyện thành nơi chỉ có một người được quyền đúng. Nhận sai sớm, bắt đầu mềm hơn, để người kia nói hết và thử nhìn vấn đề từ chỗ họ đang đứng.",
      "Sách còn nói về cách làm ý tưởng sinh động, chạm vào một động cơ đẹp hoặc tạo cảm giác cùng xây lời giải. Những cách đó có thể hữu ích, nhưng mình không muốn dùng một phần trình bày hay để che một đề nghị thiếu công bằng.",
      "Đồng thuận mà mình muốn không phải cái gật đầu vì người kia mệt quá nên thôi. Nó là lúc cả hai hiểu mình đang chọn gì, được góp phần vào lời giải và vẫn còn quyền nói: *mình chưa đồng ý*."
    ]
  },
  {
    heading: "Lãnh đạo mà không làm người khác nhỏ đi",
    paragraphs: [
      "Phần lãnh đạo khiến mình nghĩ nhiều về cách một lời góp ý có thể sửa được việc nhưng làm hỏng một con người. Carnegie gợi ý bắt đầu bằng ghi nhận, hỏi thay vì ra lệnh, thừa nhận lỗi của mình và giữ thể diện cho người đang cần sửa.",
      "Mình thích sự mềm đó, nhưng mềm không có nghĩa mơ hồ. Một người quản lý vẫn cần nói rõ kỳ vọng, đưa phản hồi đúng lúc, chia nguồn lực công bằng và dám quyết định khi có vấn đề. Lời khen không thể bù cho một hệ thống khiến người khác kiệt sức.",
      "Người lãnh đạo mình muốn học theo không chỉ làm mọi người vui vẻ làm việc. Họ tạo một nơi người khác hiểu việc mình làm, có điều kiện làm tốt và đủ an toàn để nói: *ở đây đang có chuyện không ổn*."
    ]
  },
  {
    heading: "Có những lúc tử tế không phải là tiếp tục mỉm cười",
    paragraphs: [
      "Có lúc đọc mình phải dừng lại và nhớ rằng cuốn sách ra đời trong một bối cảnh rất khác. Không phải lời khuyên nào về mỉm cười, nhường lời hay làm người khác thoải mái cũng nên được mang nguyên vẹn vào nơi có chênh lệch quyền lực lớn.",
      "Một người đang bị quấy rối hay đối xử bất công không có nghĩa vụ phải khéo hơn để xứng đáng được tôn trọng. Có những lúc điều đúng không phải là tạo thiện cảm, mà là lưu lại bằng chứng, nói *không*, tìm người hỗ trợ và dùng một kênh chính thức.",
      "Điều bền nhất mình giữ từ *Đắc Nhân Tâm* vẫn là nhìn con người trước khi nhìn kỹ thuật. Nhưng sự tử tế thật phải làm sự thật rõ hơn và phẩm giá được giữ hơn — kể cả khi điều đó khiến cuộc trò chuyện không còn dễ chịu."
    ]
  },
  {
    heading: "Nhu cầu được thích đôi khi làm mình rời xa sự chân thành",
    paragraphs: [
      "Có lẽ điều khiến mình dễ biến những nguyên tắc giao tiếp thành công thức nhất là nỗi sợ không được yêu mến. Khi quá cần một cuộc trò chuyện kết thúc êm, mình có thể nuốt điều cần nói, cười lúc không muốn cười và gọi đó là khéo léo.",
      "Nhưng một mối quan hệ chỉ yên vì một người luôn tự thu nhỏ thì chưa thật sự yên. Sự dễ chịu ấy được trả bằng khoảng cách ngày càng lớn giữa điều mình cảm thấy và điều mình dám nói ra.",
      "Mình muốn học cách quan tâm người khác mà không bỏ rơi chính mình. Có thể nói mềm, nhưng vẫn nói thật. Có thể lắng nghe rất sâu, nhưng vẫn giữ quyền bước ra khi ranh giới liên tục bị vượt qua."
    ]
  },
  {
    heading: "Được lắng nghe có thể làm một người bớt cô đơn hơn mình tưởng",
    paragraphs: [
      "Sau tất cả nguyên tắc, điều làm mình xúc động nhất vẫn là một việc rất nhỏ: có người ngồi trước mặt và không vội sửa mình. Họ không chờ tới lượt kể chuyện của họ, không biến nỗi buồn của mình thành một bài học, chỉ ở đó đủ lâu.",
      "Mình từng nghĩ giao tiếp giỏi phải có câu trả lời đúng. Cuốn sách làm mình nghĩ khác: đôi khi giá trị của cuộc trò chuyện nằm ở việc người kia không còn phải mang câu chuyện một mình.",
      "Nếu mình có thể bớt ngắt lời một chút, hỏi thật hơn một câu và để một khoảng im lặng không bị lấp vội, có lẽ đó đã là một cách tạo ảnh hưởng rất đẹp — ảnh hưởng khiến người khác trở về gần với chính họ hơn."
    ]
  },
  {
    heading: "Bảy ngày — thực hành sự quan tâm có thật",
    paragraphs: [
      "Thay vì cố áp dụng mọi nguyên tắc cùng lúc, mình có thể chọn một thực hành trong bảy ngày: không ngắt lời, ghi nhận một đóng góp cụ thể hoặc hỏi trước khi đưa lời khuyên.",
      "Cuối mỗi ngày, ghi lại một cuộc trò chuyện: mình đã tò mò ở điểm nào, cái tôi xuất hiện lúc nào, và người kia có đủ không gian để nói khác mình không. Không cần chấm điểm bản thân; mục tiêu là nhìn thấy thói quen.",
      "Nếu chỉ giữ một điều sau cuốn sách, mình muốn đó là điều này: ==giao tiếp giỏi không phải khiến căn phòng xoay quanh mình, mà giúp những người trong phòng được nhìn thấy rõ hơn==."
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
  },
  {
    heading: "Trở về mức trung bình — đừng vội kể một nguyên nhân",
    paragraphs: [
      "Một kết quả đặc biệt tốt hoặc đặc biệt xấu thường có xu hướng bớt cực đoan ở lần đo tiếp theo. Kahneman dùng hiện tượng hồi quy về mức trung bình để cho thấy mình dễ gán sự thay đổi tự nhiên ấy cho lời khen, hình phạt hoặc một biện pháp vừa áp dụng.",
      "Ví dụ, sau một ngày làm việc tệ bất thường, ngày kế tiếp có thể khá hơn ngay cả khi mình không tìm ra bí quyết nào. Ngược lại, thành tích xuất sắc một lần chưa đủ chứng minh phương pháp mới luôn hiệu quả.",
      "Trước khi kể câu chuyện nhân quả, mình nên hỏi: đây là xu hướng qua nhiều lần quan sát hay chỉ là hai điểm dữ liệu đứng cạnh nhau? ==Một lời giải thích hấp dẫn vẫn cần cơ hội được kiểm tra.=="
    ]
  },
  {
    heading: "Một câu chuyện trơn tru dễ làm mình quên phần còn thiếu",
    paragraphs: [
      "Mình rất thích những câu chuyện mạch lạc. Chúng cho cảm giác mọi thứ đã vào đúng chỗ, nguyên nhân nối với kết quả, một người tốt ở điểm này thì chắc cũng đáng tin ở điểm khác. Chính cảm giác dễ chịu đó lại là thứ Kahneman bảo mình nên dè chừng.",
      "Tâm trí nối những gì đang có thành một bức tranh, rồi dễ quên rằng ngoài khung vẫn còn dữ liệu. Một ấn tượng tốt có thể nhuộm màu toàn bộ đánh giá; một điều được lặp nhiều lần có thể nghe quen đến mức trông giống sự thật.",
      "Mình giữ lại từ *WYSIATI* một câu hỏi rất nhỏ: *điều gì chưa có mặt trong câu chuyện này?* Không phải để nghi ngờ tất cả, mà để một câu chuyện hay không được quyền đóng cửa quá sớm."
    ]
  },
  {
    heading: "Bộ não mình rất giỏi trả lời nhầm câu hỏi",
    paragraphs: [
      "Có một ý trong sách làm mình vừa buồn cười vừa thấy bị bắt quả tang: khi câu hỏi thật quá khó, bộ não lặng lẽ đổi sang một câu dễ hơn rồi trả lời rất tự tin.",
      "Mình tưởng mình đang đánh giá một rủi ro, nhưng thật ra chỉ đang nhớ xem có câu chuyện đáng sợ nào hiện lên nhanh không. Mình tưởng mình đang nhìn năng lực một người, nhưng đôi khi chỉ đang phản ứng với việc họ giống hình mẫu “người giỏi” trong đầu tới đâu.",
      "Với chuyện quan trọng, mình muốn viết câu hỏi gốc ra, xem những trường hợp tương tự thường thế nào và tự ước lượng trước khi nghe con số đầu tiên. Chậm thêm một nhịp đôi khi chỉ để chắc rằng mình đang trả lời đúng câu hỏi."
    ]
  },
  {
    heading: "Kinh nghiệm lâu năm chưa chắc đã biến thành trực giác đúng",
    paragraphs: [
      "Kahneman không bảo mình vứt trực giác đi. Ông khiến mình hỏi trực giác đó đã được nuôi trong môi trường nào. Nếu một công việc có quy luật đủ ổn định, được lặp nhiều và trả phản hồi rõ, cảm giác nghề nghiệp có thể chứa rất nhiều năm học thật.",
      "Nhưng có những lĩnh vực quá nhiễu, kết quả đến quá muộn hoặc hiếm khi lặp. Ở đó, làm lâu có thể tăng sự tự tin nhanh hơn tăng độ chính xác. Số năm kinh nghiệm nghe rất nặng, nhưng tự nó chưa trả lời mình đã học đúng từ những năm đó chưa.",
      "Trước một câu *“tôi làm nghề này lâu rồi, tôi biết”*, mình muốn hỏi thêm: đã có bao nhiêu lần kiểm tra, phản hồi có rõ không, và khi sai thì có được biết mình sai ở đâu không?"
    ]
  },
  {
    heading: "Mình không nhìn được và mất bằng cùng một đôi mắt",
    paragraphs: [
      "Phần lý thuyết triển vọng làm mình hiểu vì sao hai lựa chọn có cùng kết quả cuối vẫn có thể tạo cảm giác rất khác. Mình không chỉ nhìn mình sẽ có bao nhiêu; mình nhìn mình đang được thêm hay bị lấy đi so với một điểm đã coi là của mình.",
      "Phần mất thường đau hơn phần được tương đương, còn một khả năng rất nhỏ đôi khi được mình phóng lớn chỉ vì nó đáng sợ hoặc quá hấp dẫn. Chỉ cần đổi cách đóng khung, cùng một dữ kiện đã có thể kéo cảm xúc sang hướng khác.",
      "Điều mình muốn tập là nhìn cả hai khung: nếu gọi đây là được thì sao, nếu gọi là mất thì sao, xác suất thật là bao nhiêu, và mình có còn chọn như vậy nếu không bị mắc vào một quyết định riêng lẻ?"
    ]
  },
  {
    heading: "Hiểu thiên kiến không làm mình tự động bớt thiên kiến",
    paragraphs: [
      "Có một sự kiêu ngạo rất tinh vi khi đọc sách về sai lầm tư duy: mình bắt đầu nhìn thiên kiến ở khắp mọi người, trừ bản thân. Mình gọi tên được hiệu ứng, giải thích được vì sao người khác suy nghĩ sai, rồi tưởng vốn từ mới đã làm mình khách quan hơn.",
      "Nhưng biết tên một cái bẫy không có nghĩa mình không còn rơi vào nó. Thậm chí, mình có thể dùng chính kiến thức đó để bảo vệ kết luận đã thích sẵn, chỉ là lần này nghe thông minh hơn.",
      "Điều mình muốn giữ không phải khả năng chẩn đoán người khác. Nó là thói quen quay câu hỏi lại: *bằng chứng nào sẽ khiến mình đổi ý, và nếu không có bằng chứng nào đủ sức làm điều đó, mình đang suy nghĩ hay chỉ đang bảo vệ bản thân?*"
    ]
  },
  {
    heading: "Khiêm tốn trước bất định không có nghĩa là đứng yên",
    paragraphs: [
      "Đọc Kahneman lâu, mình có thể rơi vào một nỗi sợ khác: nếu phán đoán có quá nhiều lỗ hổng, liệu mình còn dám quyết định gì không? Nhưng đời sống không chờ tới lúc dữ liệu hoàn hảo mới bắt đầu chạy.",
      "Có lẽ trưởng thành không phải loại bỏ hết sai số. Nó là biết mình đang không chắc ở đâu, quyết định nào có thể đảo ngược, hậu quả nào cần thêm lớp bảo vệ và lúc nào phải cập nhật thay vì cố giữ thể diện.",
      "Mình vẫn phải chọn, vẫn có thể sai. Chỉ là thay vì xem thay đổi ý kiến như một thất bại, mình muốn xem nó như bằng chứng rằng thông tin mới đã thật sự được phép bước vào."
    ]
  },
  {
    heading: "Nghĩ cùng nhau — thêm quy trình, bớt tranh thắng",
    paragraphs: [
      "Trong quyết định nhóm, người nói đầu tiên hoặc người có vị trí cao dễ trở thành mỏ neo cho cả căn phòng. Một cách giảm ảnh hưởng ấy là để mỗi người ghi nhận định độc lập trước khi thảo luận.",
      "Nhóm cũng có thể thống nhất tiêu chí trước khi xem phương án, tách dữ kiện khỏi diễn giải và chỉ định một người tìm bằng chứng phản bác. Những bước này không loại bỏ thiên kiến; chúng làm thiên kiến dễ nhìn thấy và dễ sửa hơn.",
      "Điều quan trọng nhất mình học được không phải danh sách tên gọi, mà là thái độ: ==tự tin vừa đủ để quyết định, khiêm tốn đủ để cập nhật khi bằng chứng đổi khác==."
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
  },
  {
    heading: "Phản hồi — đo để học, không đo để tự phán xét",
    paragraphs: [
      "Theo dõi một thói quen khiến tiến bộ trở nên nhìn thấy được, nhất là khi kết quả lớn còn ở xa. Một dấu tick có thể nhắc rằng mình đã xuất hiện, nhưng nó chỉ hữu ích khi phục vụ việc học chứ không biến thành bảng điểm về giá trị bản thân.",
      "Nên đo thứ gần với hành vi mình kiểm soát: số lần ngồi vào bàn, số buổi vận động hoặc số tối tắt màn hình đúng giờ. Con số kết quả như cân nặng, lượt xem hay doanh thu còn chịu nhiều yếu tố khác.",
      "Nếu việc ghi chép nặng hơn chính thói quen, hãy giản lược. ==Hệ thống theo dõi tốt giúp mình quay lại hành động; nó không bắt mình sống để giữ cho biểu đồ đẹp.=="
    ]
  },
  {
    heading: "Khoảng lặng — tiến bộ không phải lúc nào cũng nhìn thấy",
    paragraphs: [
      "Những hành động nhỏ thường có độ trễ. Vài buổi học chưa tạo cảm giác giỏi hơn; vài lần tập chưa làm cơ thể đổi khác. Khoảng cách giữa nỗ lực và kết quả là nơi mình dễ bỏ cuộc nhất.",
      "Trong đoạn ấy, có thể tìm tín hiệu gần hơn: bắt đầu bớt khó, thời gian hồi phục ngắn hơn, hoặc mình ít phải thương lượng với bản thân hơn. Chúng chưa phải đích đến, nhưng là dấu hiệu hệ thống đang bén rễ.",
      "Kiên nhẫn ở đây không phải chờ thụ động. Mình vẫn xem lại cách làm, xin phản hồi và đổi chiến lược khi cần; chỉ là không kết luận thất bại quá sớm vì phần thưởng chưa kịp xuất hiện."
    ]
  },
  {
    heading: "Luật đầu tiên — đừng bắt ý chí phải nhớ mọi thứ",
    paragraphs: [
      "Mình từng viết rất nhiều lời hứa kiểu *từ mai sẽ chăm hơn*. Vấn đề là sáng mai tới, cuộc sống vẫn y như cũ và lời hứa phải tự tìm đường chen vào giữa hàng chục việc đã quen.",
      "James Clear khiến mình cụ thể hơn: khi nào, ở đâu, sau việc gì thì mình sẽ bắt đầu? Muốn đọc thì để sách ở chỗ nhìn thấy; muốn nhớ uống nước thì đặt bình cạnh bàn; muốn thêm một thói quen mới thì móc nó vào một việc mình đã làm đều.",
      "Điều mình thích là cách này bớt đổ mọi lỗi cho ý chí. Môi trường không sống thay mình, nhưng nó có thể thôi bắt mình phải nhớ và phải thắng chính mình từ đầu, ngày nào cũng vậy."
    ]
  },
  {
    heading: "Mình không thèm hành vi, mình thèm cảm giác phía sau nó",
    paragraphs: [
      "Có lúc mình mở điện thoại không phải vì thật sự muốn xem thêm một video. Mình chỉ muốn bớt chán, bớt căng hoặc trì hoãn vài phút trước một việc khó. Hành vi là cái cửa; cảm giác phía sau mới là nơi mình muốn tới.",
      "Phần *làm nó hấp dẫn* giúp mình nhìn thói quen theo hướng đó. Mình có thể ghép việc cần làm với điều mình thích, hoặc ở gần những người xem hành vi ấy là bình thường. Nhưng quan trọng hơn, mình cần hiểu nhu cầu nào đang đứng sau thói quen cũ.",
      "Nếu chỉ giật cái điện thoại khỏi tay mà không tìm cách nghỉ, kết nối hay trấn an mình theo một cách khác, khoảng trống vẫn còn đó. Thay đổi bền không chỉ cắt một hành vi; nó còn học cách chăm nhu cầu bên dưới tử tế hơn."
    ]
  },
  {
    heading: "Chuẩn bị rất nhiều vẫn có thể là một cách chưa bắt đầu",
    paragraphs: [
      "Mình rất dễ có cảm giác tiến bộ khi đang sắp xếp: chọn ứng dụng, tạo bảng theo dõi, xem thêm một video hướng dẫn. Tất cả đều có vẻ liên quan, nhưng chưa việc nào thật sự là lần luyện tập đầu tiên.",
      "Luật hai phút kéo mình về một bước nhỏ tới mức khó viện cớ: mở tài liệu, viết một câu, mang giày ra cửa. Hai phút không phải đích đến. Nó chỉ làm cái cửa đủ nhẹ để mình thôi đứng ngoài chuẩn bị mãi.",
      "Với thói quen xấu, mình làm ngược lại: thêm khoảng cách, thêm một bước xác nhận, để quyết định khó xuất hiện tự động. Có lẽ kỷ luật không phải lúc nào cũng là cố mạnh hơn; đôi khi là sắp căn phòng để phần yếu nhất của mình bớt phải chiến đấu."
    ]
  },
  {
    heading: "Đường dài không chỉ cần động lực, nó cần một lý do để quay lại",
    paragraphs: [
      "Nhiều thói quen tốt bắt mình trả công trước và nhận kết quả rất lâu sau. Vì thế mình hiểu tại sao một dấu tick, một phần nhỏ hoàn tất hay cảm giác được nhìn thấy tiến bộ lại quan trọng: nó cho hôm nay một lý do để muốn quay lại ngày mai.",
      "Nhưng rồi sự mới mẻ cũng hết. Lúc đó thử thách cần vừa đủ khó để mình còn chú ý, vừa đủ gần để mình không liên tục thất bại. Người duy trì lâu không phải người lúc nào cũng hứng; họ học được cách đi qua cả những ngày rất chán.",
      "Mình cũng không muốn thói quen biến thành nhà tù mới. Thứ từng giúp mình có thể đến lúc không còn phù hợp. Vì vậy, ngoài chuyện lặp lại, mình muốn giữ quyền hỏi: *thói quen này còn đưa mình tới nơi mình muốn sống không?*"
    ]
  },
  {
    heading: "Căn tính có thể nâng mình lên, cũng có thể nhốt mình lại",
    paragraphs: [
      "Ý tưởng bỏ phiếu cho căn tính là phần mình thích nhất, nhưng cũng là phần mình muốn giữ nhẹ tay nhất. Khi câu *mình là người kỷ luật* trở thành một chiếc huy hiệu, chỉ một ngày lệch nhịp cũng dễ làm mình thấy như toàn bộ con người đã bị chứng minh là giả.",
      "Căn tính tốt nên cho mình một hướng đi, không biến mỗi hành động thành phiên tòa. Mình có thể là người yêu việc viết và vẫn có những ngày không viết nổi; có thể quan tâm sức khỏe và vẫn cần một buổi nằm yên không hoàn thành gì.",
      "Mình muốn dùng căn tính như một lời mời quay về: *đây là kiểu người mình đang tập trở thành*. Có chữ *đang tập*, mọi thứ bớt cứng. Nó chừa chỗ cho sai, cho đổi và cho một phiên bản mình chưa kịp biết tới."
    ]
  },
  {
    heading: "Không phải thói quen nào hỏng cũng là lỗi của một cá nhân",
    paragraphs: [
      "Sách rất mạnh ở việc trao lại cảm giác chủ động, nhưng mình cũng muốn nhớ rằng môi trường không chỉ là chiếc bàn hay vị trí cái điện thoại. Nó còn là giờ làm, tiền bạc, sức khỏe, trách nhiệm chăm sóc và những điều một người không thể tự sắp xếp lại trong một buổi tối.",
      "Có người không duy trì được thói quen không phải vì thiếu quyết tâm, mà vì họ đang sống trong một hệ thống lấy gần hết năng lượng chỉ để tồn tại. Lúc đó, lời khuyên tối ưu tín hiệu có thể đúng nhưng vẫn chưa đủ.",
      "Điều này không làm những bước nhỏ mất giá trị. Nó chỉ khiến mình bớt phán xét hơn — với người khác và với chính mình. Có những ngày tiến bộ là làm thêm một chút; cũng có ngày tiến bộ là nhận ra mình cần được giúp."
    ]
  },
  {
    heading: "Quay lại — kỹ năng quan trọng hơn chuỗi hoàn hảo",
    paragraphs: [
      "Một ngày bỏ lỡ thường ít nguy hiểm hơn câu chuyện mình kể sau đó: *mình lại thất bại rồi, thôi để tuần sau*. Vì thế, hệ thống nên có sẵn một phiên bản quay lại thật nhỏ.",
      "Nếu không thể tập đủ buổi, mình đi bộ năm phút; nếu không thể viết một trang, mình ghi ba câu. Phiên bản nhỏ không thay thế hoàn toàn mục tiêu chính, nhưng giữ cánh cửa hành động khỏi đóng lại.",
      "Thói quen bền không được chứng minh bằng việc chưa từng đứt quãng. ==Nó được chứng minh bằng số lần mình biết cách trở về mà không dùng xấu hổ làm nhiên liệu.=="
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
  },
  {
    heading: "Kỷ vật — giữ ký ức mà không giữ mọi thứ",
    paragraphs: [
      "Một món đồ có thể không còn công dụng nhưng vẫn gắn với một người, một giai đoạn hoặc phiên bản cũ của mình. Khi ấy, câu hỏi *“có dùng không?”* là chưa đủ; mình còn cần hỏi ký ức nào đang được món đồ đại diện.",
      "Có thể chọn một vài vật tiêu biểu, chụp lại những món cồng kềnh hoặc viết câu chuyện của chúng trước khi cho đi. Nhưng giữ nguyên cũng là lựa chọn hợp lệ nếu món đồ đem lại kết nối và không tạo gánh nặng quá lớn.",
      "Tối giản không đòi mình lạnh lùng với quá khứ. ==Mục tiêu là chủ động chọn cách mang ký ức theo, thay vì để cảm giác tội lỗi quyết định thay mình.=="
    ]
  },
  {
    heading: "Trước khi dọn — nhìn lại nhịp mua vào",
    paragraphs: [
      "Nếu đồ mới tiếp tục đi vào nhanh hơn đồ cũ rời đi, một đợt dọn lớn chỉ tạo khoảng trống tạm thời. Vì vậy, nửa còn lại của tối giản là hiểu điều gì kích hoạt việc mua: buồn chán, khuyến mãi, so sánh hay mong một món đồ sẽ tạo ra phiên bản mới của mình.",
      "Trước một món không thiết yếu, mình có thể ghi nó vào danh sách chờ, kiểm tra thứ tương tự đang có và hình dung nơi cất cụ thể. Khoảng dừng ngắn giúp phân biệt nhu cầu bền với hứng thú vừa được quảng cáo đánh thức.",
      "Không mua cũng không phải thành tích đạo đức. Điều đáng quan tâm là ==dòng đồ đi vào có phù hợp với không gian, ngân sách và đời sống mình thực sự muốn chăm sóc hay không==."
    ]
  },
  {
    heading: "Mình đã từng mong một món đồ làm mình thành người khác",
    paragraphs: [
      "Có những món mình không mua vì thật sự cần. Mình mua vì thích phiên bản của mình khi tưởng tượng đang dùng nó: chăm đọc hơn, gọn gàng hơn, có gu hơn, sống có vẻ ổn hơn.",
      "Rồi món đồ mới cũng thành quen. Cảm giác đổi đời biến mất nhanh hơn cái hộp đựng nó, và mình lại nhìn sang thứ tiếp theo. So sánh làm chữ *đủ* cứ lùi ra xa; căn phòng đầy dần bằng những phiên bản mình đã định trở thành nhưng chưa sống tới.",
      "Sasaki khiến mình không chỉ hỏi *món nào nên bỏ*. Mình muốn hỏi sâu hơn: *mình đang mong món này chứng minh điều gì về mình?* Có khi thứ cần buông không phải món đồ, mà là lời hứa mình đã bắt nó gánh thay."
    ]
  },
  {
    heading: "Buông một món đồ không cần biến thành một cuộc xử án",
    paragraphs: [
      "Mình từng giữ một món chỉ vì đã lỡ mua đắt, như thể cất nó thêm vài năm sẽ làm số tiền quay lại. Cuốn sách nhắc mình rằng giá đã trả thuộc về quá khứ; câu hỏi của hôm nay là món đó còn phục vụ đời sống hiện tại không.",
      "Mình có thể bắt đầu từ đồ trùng, đồ lâu không dùng, chụp lại kỷ vật hoặc để món phân vân vào một hộp tạm. Không cần cầm từng thứ lên rồi kết tội phiên bản cũ đã mua nó. Dọn nhà không phải buổi xét xử những lựa chọn trước đây.",
      "Và buông cũng cần có trách nhiệm. Bán, tặng, sửa hay tái chế tốt hơn việc chỉ đẩy một món khỏi tầm mắt rồi chuyển gánh nặng sang căn nhà khác hoặc ra môi trường."
    ]
  },
  {
    heading: "Khoảng trống đáng giá khi nó trả lại cho mình một đời sống",
    paragraphs: [
      "Điều làm mình thích tối giản không phải ảnh một căn phòng trắng không có gì. Nó là ý nghĩ mình sẽ bớt mất thời gian tìm, chọn, dọn và chăm những thứ vốn không còn giúp mình sống tốt hơn.",
      "Sasaki kể rằng ít đồ đem lại cho ông cảm giác tự do và biết ơn rõ hơn. Mình không nghĩ kết quả đó được bảo đảm cho tất cả, nhưng mình tin khoảng trống có thể giảm tiếng ồn — nếu nó thật sự được trả lại cho nghỉ ngơi, con người và những việc mình quan tâm.",
      "Nên có lẽ mình không cần đếm còn bao nhiêu món. Mình chỉ cần hỏi: buổi sáng có nhẹ hơn không, thứ còn lại có được chăm tốt hơn không, và căn phòng này đã trở lại thành nơi sống hay vẫn chỉ là một dự án để mình chứng minh điều gì đó?"
    ]
  },
  {
    heading: "Ít đồ cũng có thể trở thành một kiểu khoe khác",
    paragraphs: [
      "Mình cũng dè chừng lúc tối giản biến thành một căn tính mới để khoe: ít đồ hơn, căn phòng đẹp hơn, kiểm soát bản thân tốt hơn. Khi đó mình vẫn đang để đồ vật định nghĩa mình, chỉ là đổi từ phía *có nhiều* sang phía *có ít*.",
      "Sống với rất ít đôi khi cần cửa hàng ở gần, dịch vụ thuê, chỗ lưu trữ số, thu nhập ổn định và khả năng mua lại khi cần. Nếu quên phần hạ tầng đó, mình rất dễ lấy một lựa chọn có điều kiện thuận lợi làm chuẩn đạo đức cho tất cả mọi người.",
      "Điều mình muốn học từ Sasaki không phải số áo hay số cái bát ông giữ. Nó là sự chủ ý. Một căn nhà nhiều dụng cụ vẫn có thể rất vừa nếu chúng phục vụ công việc, chăm sóc và niềm vui thật — chứ không giữ mình mắc kẹt trong một đời sống tưởng tượng."
    ]
  },
  {
    heading: "Có những món mình giữ vì chưa sẵn sàng tạm biệt một phiên bản cũ",
    paragraphs: [
      "Đồ đạc đôi khi không nặng vì kích thước. Nó nặng vì một người đã tặng, một quãng đời đã đi qua hoặc một lời hứa mình từng viết cho tương lai. Bỏ món đồ lúc đó nghe giống thừa nhận rằng có điều sẽ không quay lại nữa.",
      "Mình nghĩ việc dọn dẹp cần chừa chỗ cho tiếc nuối. Không phải mọi món đều phải được quyết trong một buổi chiều tràn động lực. Có thứ mình có thể chụp lại, viết lại câu chuyện của nó, cất riêng một thời gian hoặc đơn giản là giữ thêm chút nữa.",
      "Buông đúng lúc không phải phủ nhận ý nghĩa cũ. Nó là cảm ơn món đồ vì phần đời đã mang, rồi thừa nhận ký ức có thể ở lại ngay cả khi vật chứa của nó không còn nằm trong phòng."
    ]
  },
  {
    heading: "Biết đủ là một lựa chọn phải thực hiện lại nhiều lần",
    paragraphs: [
      "Mình từng nghĩ chữ *đủ* là một cảm giác sẽ tự đến khi có đúng số tiền, đúng căn phòng hay đúng phiên bản bản thân. Nhưng mọi thứ xung quanh được thiết kế để cái đích đó dịch thêm một chút ngay khi mình vừa tới.",
      "Vì vậy, biết đủ không phải ngừng mong muốn. Nó là đủ tỉnh để phân biệt điều mình thật sự muốn với điều mình vừa được dạy phải muốn. Có những ước mơ làm đời rộng ra; cũng có những ham muốn chỉ làm mình chạy mà không biết đang đuổi theo ai.",
      "Mình muốn chữ *đủ* trở thành một quyết định có thể gọi tên: đủ đồ để sống, đủ khoảng trống để thở, đủ tham vọng để đi tiếp và đủ dịu dàng để không coi đời hiện tại chỉ là phòng chờ của một đời khác."
    ]
  },
  {
    heading: "Nhịp duy trì — một căn nhà vẫn đang sống",
    paragraphs: [
      "Không gian sẽ lại thay đổi vì công việc, mùa mới, sở thích và những người sống trong đó đều thay đổi. Một hệ thống tốt không giữ căn nhà bất động; nó giúp đồ có chỗ trở về và giúp mình nhận ra khi một khu vực bắt đầu gây ma sát.",
      "Có thể dành mười phút mỗi tuần cho một bề mặt thường dùng, và một lần mỗi mùa để xem lại đồ ít chạm tới. Nhịp nhỏ khiến việc chăm nhà bớt phụ thuộc vào những ngày có thật nhiều năng lượng.",
      "Cuốn sách hữu ích nhất khi nó không tạo thêm một dự án phải hoàn hảo. ==Ít hơn chỉ đáng giá nếu phần khoảng trống ấy được trả lại cho một đời sống dễ thở hơn.=="
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
    heading: "Trục suy ngẫm — ba câu hỏi mang theo",
    paragraphs: [
      "Ba câu hỏi đáng mang theo: *Việc mình làm đang tác động đến ai? Quyền lực nhỏ mình có đang được dùng tử tế không? Có điều gì cần sửa ngay thay vì chờ một “quả” xa xôi?*",
      "Mình giữ lại lời mời sống có trách nhiệm hơn trong hiện tại: nhận lỗi sớm, giữ lời, bớt làm đau và cân nhắc hậu quả trước khi hành động.",
      "Mình vẫn để mở toàn bộ bản đồ siêu hình phía sau câu chuyện. Không chắc về luân hồi không ngăn mình chọn tử tế; tin vào luân hồi cũng không cho mình quyền phán xét số phận người khác."
    ]
  },
  {
    heading: "Tự do trong những lựa chọn rất nhỏ",
    paragraphs: [
      "Nhân quả trong sách trải rộng qua nhiều đời, nhưng phần mình có thể quan sát luôn bắt đầu từ một khoảnh khắc gần: cách trả lời khi đang giận, việc giữ lời khi không ai kiểm tra, hoặc quyết định dừng trước một hành động có thể làm người khác đau.",
      "Không phải lựa chọn nào cũng tạo kết quả ngay, và kết quả cũng không chỉ do một cá nhân kiểm soát. Dù vậy, nhìn vào phần thuộc trách nhiệm của mình giúp đạo đức bớt là một ý tưởng xa xôi.",
      "Mình không cần biết toàn bộ tương lai mới chọn bước tiếp theo. ==Một hành động nhỏ không giải quyết mọi thứ, nhưng nó xác định điều mình đang góp vào thế giới hôm nay.=="
    ]
  },
  {
    heading: "Giữa tin và không tin — giữ cuộc đối thoại mở",
    paragraphs: [
      "Một người có thể đọc các câu chuyện tiền kiếp như sự thật tâm linh, người khác xem chúng là ẩn dụ, còn người khác nữa muốn có bằng chứng trước khi tin. Ba vị trí ấy không nhất thiết loại bỏ khả năng trò chuyện.",
      "Cuộc đối thoại tốt phân biệt rõ trải nghiệm cá nhân, niềm tin và khẳng định có thể kiểm chứng. Mình có thể hỏi điều một niềm tin giúp ai đó sống ra sao mà không phải giả vờ đồng ý với mọi kết luận của họ.",
      "Sự cởi mở không có nghĩa chấp nhận mọi tuyên bố; hoài nghi cũng không buộc mình chế giễu điều đem lại ý nghĩa cho người khác. ==Tôn trọng con người và kiểm tra một khẳng định là hai việc có thể cùng tồn tại.=="
    ]
  },
  {
    heading: "Mình chọn bước vào câu chuyện của Thomas như thế nào",
    paragraphs: [
      "Tập 1 mở ra từ những cuộc trò chuyện với Thomas, một doanh nhân ở Mỹ, rồi đi vào các trải nghiệm được kể như ký ức tiền kiếp. Có lúc mình bị cuốn theo câu chuyện; có lúc mình dừng lại vì biết niềm tin của mình chưa đi xa đến vậy.",
      "Hành trình từ Atlantis, Ai Cập cổ đại tới nước Mỹ hiện đại làm cuốn sách giống một chiếc gương lớn đặt nhiều đời sống cạnh nhau. Mỗi bối cảnh lại quay về những câu hỏi rất cũ: con người làm gì khi có quyền lực, lòng tham bắt đầu ở đâu, và một lựa chọn để lại điều gì.",
      "Mình không đọc những phần ấy như một cuốn sử. Mình cũng không muốn vì chưa tin hết mà đóng sách lại. Mình chọn ở giữa: để câu chuyện đặt câu hỏi, còn sự thật của từng khẳng định vẫn được quyền chờ bằng chứng."
    ]
  },
  {
    heading: "Điều làm mình sợ không phải là thiếu tri thức",
    paragraphs: [
      "Trong câu chuyện của sách, Atlantis có rất nhiều tri thức nhưng vẫn suy tàn khi năng lực đi nhanh hơn đạo đức. Những phần về Ai Cập lại đưa mình qua quyền lực, tôn giáo và địa vị, nơi con người có thể dùng điều thiêng liêng để nâng đỡ nhau hoặc để giữ người khác ở dưới.",
      "Mình không xem đó là lịch sử đã được xác minh. Nhưng hình ảnh một nền văn minh rất giỏi mà không đủ trưởng thành vẫn khiến mình thấy gần. Công nghệ mới hơn không tự làm con người tử tế hơn; quyền lực lớn hơn chỉ làm động cơ bên trong mình vang to hơn.",
      "Điều mình muốn giữ là bốn câu hỏi: ai đang nắm tri thức, ai hưởng lợi, ai gánh rủi ro, và có gì ngăn người mạnh nhất dùng năng lực chung cho lòng tham riêng?"
    ]
  },
  {
    heading: "Nhân quả mình có thể nhìn thấy ngay trong một đời",
    paragraphs: [
      "Sách kéo nhân quả qua nhiều kiếp. Còn phần mình nhìn thấy rõ nhất lại rất gần: một ý nghĩ được nuôi lâu thành động cơ, động cơ đi vào hành động, hành động lặp lại thành tính cách, rồi tính cách quay lại chọn hộ mình trong lần sau.",
      "Có những lời mình nói vài phút nhưng ở lại trong người khác rất lâu. Có cách phản ứng mình tập đủ nhiều đến mức tưởng đó là bản chất. Nhìn nhân quả như vậy làm mình bớt chờ một sự trừng phạt xa xôi và chú ý hơn tới điều đang được tạo ngay hôm nay.",
      "Nhưng mình không muốn dùng nhân quả để đoán lý do ai đó đau khổ. Một ý niệm giúp mình tự soi không cho mình quyền phán xét số phận người khác. ==Trách nhiệm nên quay mũi nhọn về phía mình trước khi chĩa sang bất kỳ ai.=="
    ]
  },
  {
    heading: "Tiền bạc không đứng ngoài những câu hỏi tâm linh",
    paragraphs: [
      "Việc Thomas là một doanh nhân khiến những câu hỏi trong sách không thể ở mãi trên mây. Chúng phải quay về tiền, quyền quyết định và cách một người dùng nguồn lực khi không còn ai buộc họ phải chọn điều tử tế.",
      "Mình nghĩ nhiều về những kết quả nhìn rất đẹp trên bảng số nhưng phần chi phí lại bị đẩy sang người ít tiếng nói hơn hoặc một tương lai mình chưa phải sống. Thành công như vậy có thể hợp lệ trên giấy, nhưng câu hỏi về trách nhiệm vẫn chưa biến mất.",
      "Mình không cần tin hết vào luân hồi để thực hành phần này. Chỉ cần tập nhìn xa hơn lợi ích trước mắt, nói rõ xung đột lợi ích, nhận phần hậu quả thuộc về mình và dùng năng lực để bớt làm đau thay vì khuếch đại nó."
    ]
  },
  {
    heading: "Mình từng muốn nhân quả là một phép tính thật rõ",
    paragraphs: [
      "Có một phần trong mình thích ý nghĩ rằng mọi điều tốt rồi sẽ được trả lại và mọi tổn thương cuối cùng đều có lời giải. Nó làm thế giới bớt ngẫu nhiên, khiến những ngày khó khăn có vẻ đang nằm trong một trật tự mình chưa nhìn thấy.",
      "Nhưng nếu bám quá chặt vào mong muốn công bằng đó, mình có thể vô tình nhìn người đang đau rồi tìm lý do họ phải chịu. Một niềm tin từng dùng để an ủi mình bỗng trở thành cách đẩy trách nhiệm khỏi người gây hại và khỏi hệ thống có thể thay đổi.",
      "Mình vẫn muốn tin điều tử tế có sức lan dài. Chỉ là mình không muốn chờ vũ trụ cân sổ thay cho phần việc của con người: bảo vệ người yếu hơn, sửa điều sai và tạo công bằng bằng những quyết định có thật."
    ]
  },
  {
    heading: "Không chắc về một đời sau làm đời này quý hơn với mình",
    paragraphs: [
      "Cuốn sách mở ra nhiều kiếp sống, còn mình khép lại với cảm giác đời hiện tại bỗng đáng giữ hơn. Vì mình không biết chắc có bao nhiêu lần được gặp lại một người, một buổi sáng hay chính phiên bản mình đang là.",
      "Sự không chắc ấy không làm mình bi quan. Nó khiến lời xin lỗi bớt nên để sau, lòng biết ơn bớt nên cất trong đầu, và những điều mình thật sự quan tâm bớt bị hoãn bởi một ngày hoàn hảo chưa biết khi nào tới.",
      "Nếu có nhiều đời, sống tử tế hôm nay vẫn không thừa. Nếu chỉ có đời này, nó càng không thừa. Có lẽ đó là điểm mình có thể đứng vững, dù phần còn lại của bản đồ tâm linh vẫn để mở."
    ]
  },
  {
    heading: "Trang ghi chú — đưa câu chuyện về hiện tại",
    paragraphs: [
      "Sau mỗi phần gây ấn tượng, mình có thể chia trang giấy làm ba cột: *sách kể gì*, *mình đang tin điều gì*, và *việc nào có thể làm ngay*. Cách ghi này giữ ranh giới giữa nội dung, diễn giải và hành động.",
      "Một ý về nhân quả có thể trở thành lời xin lỗi còn thiếu; một cảnh về quyền lực có thể dẫn đến việc chia lại công lao; một suy tư về tình thương có thể thành cuộc gọi hỏi thăm cụ thể.",
      "Nếu câu chuyện chỉ khiến mình say mê một thế giới xa xôi mà không đối xử tốt hơn với đời sống trước mặt, phần quan trọng nhất có lẽ vẫn chưa được đọc."
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
  },
  {
    heading: "Sửa chữa — trách nhiệm cần một hình dạng",
    paragraphs: [
      "Nhận ra một vòng lặp mới chỉ là bước đầu. Nếu hành động của mình đã gây tổn thương, chuyển hóa cần đi qua việc gọi đúng điều đã xảy ra, lắng nghe tác động và sửa phần có thể sửa.",
      "Một lời xin lỗi có trọng lượng không đòi người kia phải tha thứ ngay. Nó nói rõ trách nhiệm, tránh biện minh và đi kèm thay đổi có thể quan sát. Với tổn hại lớn, sự hỗ trợ chuyên môn hoặc quy trình chính thức có thể cần thiết.",
      "Không phải mọi hậu quả đều biến mất sau khi mình hiểu bài học. ==Trách nhiệm trưởng thành là chịu ở lại với công việc sửa chữa, kể cả khi hình ảnh tốt đẹp về bản thân bị lung lay.=="
    ]
  },
  {
    heading: "Từ bi — không đi vòng qua cảm xúc khó",
    paragraphs: [
      "Ngôn ngữ chữa lành đôi khi khiến mình vội tìm ý nghĩa, lòng biết ơn hoặc sự tha thứ khi nỗi đau còn chưa được gọi tên. Điều đó có thể biến tinh thần tích cực thành một cách né tránh cảm xúc thật.",
      "Từ bi cũng có thể bắt đầu bằng việc thừa nhận: chuyện này đã làm mình giận, sợ hoặc kiệt sức. Cảm xúc không tự quyết định hành động, nhưng nó cung cấp thông tin về điều cần được bảo vệ và chăm sóc.",
      "Không phải lúc nào cũng cần biến đau khổ thành bài học đẹp. Có lúc điều tử tế nhất là nghỉ, tìm người hỗ trợ và để quá trình hồi phục diễn ra theo nhịp của chính mình."
    ]
  },
  {
    heading: "Tập 2 làm chiếc vòng quanh mình rộng ra",
    paragraphs: [
      "Nếu Tập 1 khiến mình nhìn vào lựa chọn cá nhân, Tập 2 kéo chiếc vòng rộng hơn: gia đình, cộng đồng, những tầng năng lượng theo thế giới quan của sách, rồi cả tương lai của hành tinh.",
      "Có những phần mình tiếp nhận như một niềm tin tâm linh, không phải mô hình vật lý đã được chứng minh. Nhưng câu hỏi nằm dưới chúng lại rất thật: một ý nghĩ hay hành động của mình dừng ở đâu, và liệu có điều gì thật sự chỉ thuộc về riêng mình không?",
      "Mình cố đọc trên hai đường. Đường nói về bản chất vũ trụ vẫn cần bằng chứng. Đường nói về trách nhiệm liên đới thì có thể kiểm tra ngay, trong cách lựa chọn của một người cộng lại thành môi trường sống của rất nhiều người."
    ]
  },
  {
    heading: "Không ai tạo ra tất cả, nhưng điều đó không có nghĩa không ai chịu trách nhiệm",
    paragraphs: [
      "Khái niệm cộng nghiệp trong sách làm mình nghĩ đến những vấn đề không có một thủ phạm duy nhất. Một tin sai được chia thêm một lần, một thói quen tiêu dùng lặp lại, một sự im lặng trước điều sai — từng việc rất nhỏ, nhưng khi đủ nhiều người làm thì nó thành môi trường chung.",
      "Điều đó không có nghĩa lỗi được chia đều. Người có nhiều quyền quyết định, biết nhiều hơn và hưởng lợi nhiều hơn không thể trốn sau câu *“ai cũng có phần”*. Trách nhiệm chung vẫn cần được đặt đúng trọng lượng.",
      "Mình giữ lại một cách nhìn vừa khiêm tốn vừa không phủi tay: mình không tạo ra toàn bộ vấn đề, nhưng mình vẫn phải hỏi phần nào đang được mình tiếp tục nuôi."
    ]
  },
  {
    heading: "Nỗi sợ có thể đánh thức mình, nhưng không nên nghĩ thay mình",
    paragraphs: [
      "Tập 2 có nhiều đoạn mang cảm giác cảnh tỉnh về những biến cố của nhân loại. Đọc những đoạn đó, mình thấy vừa muốn sống cẩn thận hơn, vừa sợ bản thân tin quá nhanh chỉ vì câu chuyện làm mình bất an.",
      "Nỗi sợ có thể kéo sự chú ý trở lại, nhưng nó cũng rất giỏi lấp những chỗ chưa có bằng chứng. Một hiện tượng phức tạp hiếm khi chỉ có một nguyên nhân đẹp và gọn như điều mình muốn tin.",
      "Điều mình chọn là không dùng bất định làm lý do đứng yên: kiểm tra dữ kiện, thừa nhận phần chưa biết, giảm tổn hại có thể thấy trước và bảo vệ người dễ bị ảnh hưởng. Cẩn trọng không cần phải chờ đến lúc mình chắc chắn tuyệt đối."
    ]
  },
  {
    heading: "Thiện ý đẹp, nhưng thiện ý một mình chưa đủ",
    paragraphs: [
      "Mình thích lời kêu gọi chữa lành trong sách, nhưng cũng tự hỏi chữa lành sẽ trông như thế nào khi rời khỏi trang giấy. Có thể là chăm sóc tinh thần, bớt bạo lực trong quan hệ, dùng tài nguyên có trách nhiệm và tham gia vào những quyết định ảnh hưởng đến cộng đồng.",
      "Thiền, cầu nguyện hay lòng biết ơn có thể nâng đỡ một người. Nhưng nếu vấn đề nằm ở chính sách, tiền bạc hoặc một cấu trúc gây hại, mình không thể chỉ gửi năng lượng tốt rồi coi phần việc đã xong.",
      "Mình không nghĩ thay đổi bên trong và thay đổi hệ thống phải loại trừ nhau. Một bên giúp mình bớt lặp lại điều gây hại; bên kia sửa căn phòng đang liên tục thưởng cho chính điều đó."
    ]
  },
  {
    heading: "Chữa lành không phải lúc nào cũng trông thật sáng",
    paragraphs: [
      "Có những ngày mình nghĩ chữa lành phải là bình an, biết ơn và đã hiểu hết bài học. Nhưng đôi khi nó chỉ là đủ thành thật để nói mình vẫn giận, vẫn sợ, vẫn chưa thể tha thứ và chưa biết bao giờ mới thấy nhẹ.",
      "Mình không muốn dùng ngôn ngữ tâm linh để thúc một người đi nhanh hơn vết thương của họ. Tha thứ khi chưa an toàn, tìm ý nghĩa khi còn đang choáng hoặc cố tỏ ra tích cực có thể chỉ là một cách khác để nỗi đau bị bỏ lại một mình.",
      "Với mình, chữa lành sâu hơn khi nó chừa chỗ cho sự thật không đẹp. Có khi bước đầu không phải buông bỏ, mà là gọi đúng điều đã xảy ra và tin rằng cảm xúc của mình không cần phải dễ chịu mới xứng đáng được chăm sóc."
    ]
  },
  {
    heading: "Hy vọng không phải ngồi chờ một chu kỳ tự đổi hướng",
    paragraphs: [
      "Những chu kỳ lớn trong sách dễ làm một cá nhân thấy mình quá nhỏ. Nếu mọi thứ đã đi qua nhiều kiếp, nhiều cộng đồng và những lực mình không nhìn thấy, một lựa chọn hôm nay liệu có đáng kể gì không?",
      "Mình nghĩ hy vọng không nằm ở việc chắc rằng mình sẽ thấy kết quả. Nó nằm ở việc vẫn chọn không góp thêm điều mình biết là gây hại, vẫn sửa một vòng lặp trong tầm tay và vẫn kết nối với người khác để phần nhỏ ấy không còn đứng một mình.",
      "Mình không cứu được cả thế giới bằng một hành động tốt. Nhưng thế giới cũng không phải một vật ở đâu xa; nó đang được làm nên từ những căn phòng, mối quan hệ và quyết định mà mỗi ngày mình có mặt trong đó."
    ]
  },
  {
    heading: "Bản kiểm tra một vòng lặp",
    paragraphs: [
      "Chọn một tình huống thường lặp lại và ghi lại trong một tuần: điều xảy ra ngay trước đó, cảm giác trong cơ thể, suy nghĩ bật lên, phản ứng của mình và điều xảy ra sau cùng.",
      "Sau vài lần, khoanh một điểm ngắt nhỏ: rời màn hình hai phút, hỏi lại thay vì đoán, hoặc nhắn cho người có thể giúp. Nếu vòng lặp liên quan đến sang chấn, nghiện, bạo lực hay nguy cơ an toàn, đừng tự xử lý một mình.",
      "Bài thực hành này không chứng minh hay bác bỏ nghiệp. Nó chỉ đưa thông điệp về chuyển hóa về nơi mình có thể bắt đầu: ==một khuôn mẫu nhìn rõ hơn và một lựa chọn mới đủ nhỏ để thử==."
    ]
  }
];

// Vietnamese question-led reflection on technology and responsibility; the
// book's claims about karma, souls, and consciousness remain explicitly open.
const MUON_KIEP_3_PAGES: BookReadingPage[] = [
  {
    heading: "Công nghệ mạnh hơn có làm mình tốt hơn không?",
    paragraphs: [
      "Có một câu hỏi đi theo mình suốt Tập 3: nếu máy móc ngày càng làm được nhiều hơn, con người có tự nhiên trở nên tốt hơn không? Hay mình chỉ đang trao thêm sức mạnh cho những động cơ vốn đã có sẵn?",
      "Mình giữ lại lời nhắc rằng một công cụ mạnh không tự quyết định mục đích sử dụng. Trách nhiệm nằm ở những con người và tổ chức thiết kế, triển khai, giám sát công cụ, cùng khung pháp lý điều chỉnh nó.",
      "Còn ý thức là gì, máy có thể có ý thức không, và linh hồn liên hệ với trí tuệ ra sao — mình không nghĩ một phép so sánh đẹp đã đủ để chốt những câu hỏi lớn như vậy."
    ]
  },
  {
    heading: "Lòng tham đôi khi mặc chiếc áo rất hợp lý",
    paragraphs: [
      "Sách nói nhiều về lòng tham, nhưng điều khiến mình nghĩ lâu là lòng tham hiếm khi tự giới thiệu bằng đúng tên của nó. Nó có thể mặc áo tham vọng, tăng trưởng, trách nhiệm hoặc câu *ai cũng đang làm vậy*.",
      "Điều mình giữ lại là nhìn không chỉ vào mong muốn, mà cả cái giá của nó: ai hưởng lợi, ai chịu thiệt, điều gì bị khai thác và mình đang tự hợp thức hóa điều gì.",
      "Mình cũng không muốn gọi mọi tham vọng là xấu. Tăng trưởng không tự tốt hay xấu; điều quan trọng là nó đang phục vụ ai và để cái giá lại cho ai. Một cuộc khủng hoảng phức tạp cũng không nên bị thu gọn thành một lời giải thích duy nhất về nghiệp hay tâm thức."
    ]
  },
  {
    heading: "Cho đi không nên tạo thêm một món nợ",
    paragraphs: [
      "Trong câu chuyện, Thomas dần đi về phía phụng sự và tình thương. Đọc tới đó, mình nghĩ về những lần cho đi rất nhỏ: một ít thời gian, một phần năng lực, hay chỉ là sự chú ý trọn vẹn cho một người đang cần được nghe.",
      "Mình giữ lại ý rằng cho đi thời gian, năng lực hoặc sự chú ý có thể tạo giá trị ngay trong hiện tại, nhất là khi có sự đồng thuận và không biến sự cho đi thành món nợ tinh thần buộc người nhận phải đáp trả.",
      "Việc cho đi có hóa giải nghiệp hay không vẫn thuộc niềm tin của sách. Mình không cần chắc về điều đó mới có thể sống rộng lượng hơn. Và mình cũng muốn nhớ: rộng lượng không đòi mình phải cạn kiệt để chứng minh lòng tốt."
    ]
  },
  {
    heading: "Tự do của mình có thật, nhưng không phải vô hạn",
    paragraphs: [
      "Theo sách, tự do ý chí cho phép mỗi người chọn những hạt giống cho tương lai. Mình thích phần chủ động trong ý này: dù không chọn được mọi hoàn cảnh, mình vẫn còn một khoảng để chọn cách đáp lại.",
      "Trong phạm vi mình có thể kiểm soát, mình vẫn chọn cách phản hồi, xin giúp đỡ, sửa sai và đặt giới hạn. Nhìn ra phần chủ động giúp hành động cụ thể hơn.",
      "Nhưng khoảng tự do của mỗi người không giống nhau. Nghèo đói, bệnh tật, sang chấn và phân biệt đối xử đều làm cánh cửa hẹp đi. Mình không muốn dùng tự do ý chí hay nhân quả để quy toàn bộ hoàn cảnh về một cá nhân vốn đã phải gánh quá nhiều."
    ]
  },
  {
    heading: "Mình khép câu chuyện mà không khép câu hỏi",
    paragraphs: [
      "Sách dần khép hành trình của Thomas bằng tình thương, sự thức tỉnh và vị trí rất nhỏ của con người trong một vũ trụ rộng. Mình không bước ra với một lời giải chắc chắn như lúc đầu từng mong.",
      "Mình không giữ một lời giải chắc chắn, mà giữ ba câu hỏi: *Mong muốn này đang nuôi điều gì? Ai sẽ chịu hậu quả từ lựa chọn của mình? Mình đang dựa vào bằng chứng, niềm tin hay nỗi sợ?*",
      "Luân hồi, ý thức vũ trụ và mục đích của linh hồn vẫn để ngỏ với mình. Có lẽ mình không cần ép mọi câu hỏi phải đóng lại. Phần thiết thực nhất vẫn là sống có trách nhiệm với người và thế giới đang ở ngay trước mặt."
    ]
  },
  {
    heading: "Một công cụ mạnh cần nhiều hơn thiện ý",
    paragraphs: [
      "Mình không tin một công cụ mạnh sẽ an toàn chỉ vì người tạo ra nó nói mình có ý tốt. Hệ thống càng ảnh hưởng tới nhiều người càng cần mục đích rõ, giới hạn sử dụng, cách kiểm tra sai lệch và một nơi thật sự để người bị tác động lên tiếng.",
      "Câu hỏi thực tế là: dữ liệu đến từ đâu, ai có quyền từ chối, lỗi sẽ gây hại cho ai và ai chịu trách nhiệm sửa. Tốc độ triển khai không nên nhanh hơn khả năng nhìn thấy và phản hồi tổn hại.",
      "Câu *công nghệ phục vụ con người* nghe rất đẹp nhưng vẫn còn quá nhẹ. Với mình, sự phục vụ đó phải nhìn thấy được bằng quyền lựa chọn, biện pháp bảo vệ và một cái tên cụ thể đứng ra chịu trách nhiệm khi điều xấu xảy ra."
    ]
  },
  {
    heading: "Nhanh hơn chưa chắc đã gần hơn với một đời sống tốt",
    paragraphs: [
      "Mình rất dễ gọi một thứ là tiến bộ khi nó nhanh hơn, làm được nhiều hơn hoặc dự đoán chính xác hơn. Nhưng những con số ấy chưa tự trả lời đời sống có công bằng, an toàn và đáng sống hơn không.",
      "Khi đánh giá một đổi mới, mình có thể nhìn thêm thời gian nó trả lại hoặc lấy đi, nhóm người được trao thêm quyền và nhóm phải gánh chi phí vô hình. Không có một thước đo duy nhất, nhưng bỏ qua những câu hỏi ấy cũng là một lựa chọn giá trị.",
      "Mình muốn giữ khả năng nói *không nên*, *chưa nên* hoặc *chỉ nên trong những điều kiện này*. Đó không phải sợ tiến bộ. Đó là từ chối để chữ tiến bộ tự đi mà không cần một hướng tới."
    ]
  },
  {
    heading: "Tập cuối không chỉ khép chuyện, nó nối lại những điều còn dang dở",
    paragraphs: [
      "Tập 3 đưa Thomas qua những đời sống được kể ở Hy Lạp, La Mã, nước Pháp thời trung cổ rồi trở về nước Mỹ hiện đại. Mình đọc các đoạn ấy không chỉ để biết nhân vật từng là ai, mà để nhìn xem điều gì cứ quay lại dù bối cảnh đã thay đổi.",
      "Những cuộc gặp được nối bằng nhân duyên, những lựa chọn cũ tìm đường trở lại trong hình dạng mới. Đó là cách cuốn sách khép mạch chuyện tâm linh ấy; còn việc các đời sống được kể có thật hay không, mình vẫn để ở vị trí một niềm tin chưa được xác nhận độc lập.",
      "Điều làm mình chú ý nhất là khoảnh khắc một người thôi hỏi *tại sao chuyện này lại xảy đến với tôi* và bắt đầu hỏi *mình sẽ làm gì khác khi đã nhìn ra khuôn mẫu này*."
    ]
  },
  {
    heading: "Một cỗ máy trả lời rất hay vẫn để lại câu hỏi về ý thức",
    paragraphs: [
      "Là người làm việc gần công nghệ, mình dừng lâu ở những phần nói về AI, bộ não và ý thức. Một hệ thống có thể xử lý dữ liệu rất nhanh, tạo câu trả lời rất giống con người, nhưng điều đó vẫn chưa tự trả lời bên trong nó có một trải nghiệm hay không.",
      "Mình muốn tách ba chuyện ra: làm được một tác vụ thông minh, có trải nghiệm chủ quan và có trách nhiệm đạo đức. Chúng nghe gần nhau trong một cuộc trò chuyện, nhưng không phải cùng một câu hỏi.",
      "Sách đi xa hơn tới linh hồn; phần đó mình để mở. Điều mình chắc hơn là không nên nhân cách hóa máy để con người trốn trách nhiệm. Dữ liệu đưa vào, mục tiêu chọn, quyền trao và tổn hại gây ra vẫn có tên của những người và tổ chức đứng phía sau."
    ]
  },
  {
    heading: "Mình tin vào ý nghĩa của một cuộc gặp, nhưng không muốn biến nó thành sợi dây trói",
    paragraphs: [
      "Bộ sách nhìn những cuộc gặp quan trọng như nhân duyên được nối qua nhiều đời. Mình hiểu vì sao ý nghĩ đó đẹp: nó khiến một người bước vào đời mình không còn hoàn toàn tình cờ, và cách mình đối xử với họ bỗng có sức nặng lâu hơn một khoảnh khắc.",
      "Nhưng mình không muốn chữ *duyên* hay chữ *nợ* giữ ai ở lại trong một mối quan hệ đang làm họ đau. Không có ý nghĩa tâm linh nào nên đứng cao hơn sự đồng thuận, an toàn và quyền được rời đi.",
      "Điều mình muốn làm với một cuộc gặp là nói thật hơn, sửa phần mình đã làm đau, biết ơn điều đã nhận và tôn trọng tự do của người kia. Nếu có một mối dây từ quá khứ, có lẽ cách đẹp nhất để đáp lại nó vẫn là sống tử tế trong hiện tại."
    ]
  },
  {
    heading: "Đi hết ba tập, điều còn lại với mình rất đơn giản",
    paragraphs: [
      "Tập 1 nói nhiều về nhân quả và quyền lực. Tập 2 mở chiếc vòng sang nghiệp chung và việc chữa lành. Tập 3 đem tất cả tới công nghệ, ý thức và tương lai. Đi một vòng rất xa, mình lại trở về một câu hỏi gần: *mình sẽ dùng phần năng lực đang có như thế nào?*",
      "Tri thức, tiền bạc hay một công cụ mạnh không tự chọn điều tốt. Nếu bên trong vẫn là sợ hãi, tham lam và nhu cầu kiểm soát, sức mạnh mới chỉ làm những điều đó đi xa hơn.",
      "Mình có thể chưa tin trọn bản đồ luân hồi của sách. Nhưng mình tin điều này: trưởng thành không nằm ở việc mình biết bao nhiêu điều lớn lao, mà ở cách người khác được đối xử khi quyền lựa chọn đang nằm trong tay mình."
    ]
  },
  {
    heading: "Điều làm con người khác biệt có lẽ không nằm ở việc thắng máy",
    paragraphs: [
      "Khi nói về AI, mình rất dễ mắc vào cuộc thi: con người còn làm gì tốt hơn, máy đã thay được tới đâu, và kỹ năng nào sắp mất giá. Càng nghĩ theo hướng đó, mình càng thấy con người như một phiên bản chậm hơn của công cụ mình tạo ra.",
      "Nhưng có lẽ giá trị của mình không cần được chứng minh bằng việc tính nhanh hơn hay nhớ nhiều hơn. Nó còn nằm trong khả năng chịu trách nhiệm, chăm sóc một người cụ thể, sống cùng mâu thuẫn và quyết định điều gì không nên làm dù hoàn toàn có thể làm.",
      "Mình không biết máy có thể đi xa tới đâu. Điều mình quan tâm hơn là trong lúc làm nó thông minh hơn, mình có đang tập cho con người sâu sắc, trung thực và có trách nhiệm hơn không."
    ]
  },
  {
    heading: "Tương lai không chỉ là thứ sẽ xảy đến với mình",
    paragraphs: [
      "Cuốn sách nói nhiều về tương lai nhân loại, nghe lớn đến mức đôi khi mình tưởng đó là câu chuyện của chính phủ, tập đoàn hoặc những người giỏi hơn. Nhưng nhiều công nghệ bước vào đời sống bằng những quyết định rất nhỏ: một nút mình bấm, dữ liệu mình đồng ý chia sẻ, một điều tiện lợi mình ngừng đặt câu hỏi.",
      "Mình không kiểm soát toàn bộ hướng đi, nhưng mình vẫn góp phần bình thường hóa một cách sử dụng. Sự bất lực tuyệt đối đôi khi chỉ là câu chuyện dễ chịu để mình không phải nhìn phần trách nhiệm nhỏ và bất tiện của bản thân.",
      "Tương lai vừa là điều sẽ đến, vừa là thứ đang được xây. Mình muốn nhớ rằng mỗi lần hỏi thêm *ai được lợi, ai gánh rủi ro, ai có quyền từ chối*, mình đã đặt một viên gạch khác vào con đường đó."
    ]
  },
  {
    heading: "Câu hỏi 8 — nguyên tắc mình muốn mang theo",
    paragraphs: [
      "Sau ba tập, mình có thể viết một nguyên tắc ngắn cho chính mình: không dùng niềm tin để phán xét nỗi đau; không dùng công nghệ để trốn trách nhiệm; không gọi một ý định tốt là đủ khi hậu quả đang gây hại.",
      "Nguyên tắc ấy cần được kiểm tra trong quyết định thật: sản phẩm mình làm, dữ liệu mình chia sẻ, cách mình đối xử với người ít quyền lực hơn và khả năng nhận lỗi khi biết thêm điều mới.",
      "Mình khép bộ sách với niềm tin còn để ngỏ, nhưng trách nhiệm thì không. ==Tương lai có thể bất định; cách mình góp phần tạo ra nó vẫn là câu hỏi của hiện tại.=="
    ]
  }
];

// Vietnamese, spoiler-light fiction reflection focused on narrative tension,
// Clarice's agency, ethical distance, and the limits of reading people.
const SILENCE_OF_THE_LAMBS_PAGES: BookReadingPage[] = [
  {
    heading: "Cánh cửa vào truyện làm mình thấy ngột ngạt rất sớm",
    paragraphs: [
      "*Sự Im Lặng Của Bầy Cừu* đưa Clarice Starling, một học viên FBI, vào cuộc điều tra nơi một cuộc trò chuyện cũng có thể căng như lúc lần theo dấu vết. Mình chưa cần biết kết cục đã cảm thấy căn phòng quanh cô quá chật.",
      "Tiểu thuyết không chỉ hỏi ai đã gây án. Nó liên tục hỏi ai đang quan sát ai, ai nắm thông tin và một câu hỏi có thể đẩy người đối diện lùi xa đến đâu.",
      "Với mình, phần hấp dẫn nhất không nằm riêng ở những cú sốc. Nó nằm trong cuộc đấu rất im giữa chú ý, ngôn ngữ và ranh giới — nơi một câu hỏi có thể vừa mở khóa manh mối vừa đẩy người khác lùi thêm một bước."
    ]
  },
  {
    heading: "Mình thích Clarice vì cô không cần hết sợ mới bước tiếp",
    paragraphs: [
      "Clarice không phải kiểu người hùng bước vào phòng và làm nỗi sợ biến mất. Mình nhìn thấy năng lực của cô trong kỷ luật, sự quan sát và việc vẫn làm điều cần làm khi áp lực chưa hề nhẹ đi.",
      "Cô còn phải hoạt động trong những căn phòng nơi tuổi tác, vị trí và giới tính ảnh hưởng đến cách cô được nhìn nhận. Lớp xung đột ấy khiến cuộc điều tra đồng thời là hành trình giữ tiếng nói của một người chưa có nhiều quyền lực.",
      "Điều mình nhớ không phải một người không biết sợ. Nó là một người vẫn run nhưng không trao quyền quyết định cho nỗi sợ. Kiểu can đảm đó gần với đời thật hơn nhiều."
    ]
  },
  {
    heading: "Thông minh làm mình ấn tượng, nhưng không làm mình yên tâm",
    paragraphs: [
      "Những cảnh giữa Clarice và Lecter giống các ván đấu bằng lời. Mình đọc chậm hơn ở đó, vì mỗi câu hỏi vừa có thể tìm ra một điều thật vừa có thể lách vào đúng phần yếu nhất của người nghe.",
      "Lecter quan sát người khác rất sắc bén, nhưng khả năng nhìn thấu không đồng nghĩa với sự quan tâm. Tiểu thuyết nhờ đó tạo ra một phân biệt quan trọng: trí tuệ có thể gây ấn tượng, còn đạo đức mới quyết định nó được dùng để nâng đỡ hay làm tổn thương.",
      "Mình tự nhắc không nhầm khả năng nhìn thấu với sự quan tâm. Có người hiểu rất rõ nỗi đau của người khác chỉ để biết nên ấn vào đâu. Vì vậy, mình luôn để ý ai đang đặt câu hỏi, ai đặt điều kiện và ai phải trả giá cho cuộc trao đổi."
    ]
  },
  {
    heading: "Điều chưa được kể mới là thứ làm mình lật trang",
    paragraphs: [
      "Thomas Harris không cần liên tục đẩy một cảnh gây sốc ra trước mặt. Ông cho mình một chi tiết điều tra, một căn phòng kín, vài câu đối thoại ngắn — rồi giữ lại đúng mảnh thông tin mình đang cần nhất.",
      "Khoảng thiếu ấy khiến một vật nhỏ, một lựa chọn từ ngữ hay một lần đổi nhịp đều có trọng lượng. Hồi hộp đến từ việc phải ghép dấu hiệu trong khi thời gian của câu chuyện vẫn tiến lên.",
      "Mình cũng muốn để kỹ thuật đó ở lại trong tiểu thuyết. Chú ý đến chi tiết có thể giúp mình đọc sâu hơn, nhưng không cho mình quyền lấy một dấu hiệu nhỏ rồi chẩn đoán toàn bộ con người ngoài đời."
    ]
  },
  {
    heading: "Một phản diện cuốn hút vẫn là một người gây tổn hại",
    paragraphs: [
      "Có lúc mình phải tự tách hai điều: một nhân vật được viết rất cuốn, và một con người đáng ngưỡng mộ. Lecter có thể lịch thiệp, sắc bén, hấp dẫn trên trang giấy; không điều nào trong đó xóa phần tổn hại hắn gây ra.",
      "Cách đọc có trách nhiệm là không biến bạo lực thành màn trình diễn duy nhất. Cần giữ trong tầm nhìn cả nỗi sợ, quyền tự quyết và nỗ lực của những người đang đối diện với bạo lực ấy.",
      "Câu hỏi ở lại với mình lớn hơn vụ án: liệu một người có thể nhìn thẳng vào bóng tối mà không học cách tôn sùng nó, vẫn giữ ranh giới, sự tỉnh táo và một phần lòng trắc ẩn của mình hay không?"
    ]
  },
  {
    heading: "Mình nhìn thấy một chi tiết, rồi rất dễ tưởng đã thấy cả con người",
    paragraphs: [
      "Clarice phải đọc dấu vết, giọng nói và cả những điều người khác né tránh. Đọc theo cô, mình cũng bị cuốn vào trò ghép nghĩa và đôi khi quên rằng mọi quan sát đều đi qua kinh nghiệm lẫn nỗi sợ của người đang nhìn.",
      "Một chi tiết có thể là manh mối trong cấu trúc truyện; ngoài đời, nó hiếm khi đủ để kết luận toàn bộ con người. Sự tự tin rằng mình đã “nhìn thấu” ai đó có thể khiến mình chỉ còn tìm bằng chứng cho ấn tượng ban đầu.",
      "Mình nghĩ đồng cảm bắt đầu bằng chú ý nhưng phải đi cùng khiêm tốn. Nhìn kỹ không có nghĩa mình sở hữu sự thật về ai đó. Nhiều khi điều tốt nhất nó cho mình chỉ là một câu hỏi bớt vội vàng hơn."
    ]
  },
  {
    heading: "Có những căn phòng bắt mình tốn quá nhiều sức chỉ để được nghe",
    paragraphs: [
      "Sức ép quanh Clarice không chỉ đến từ vụ án. Cô còn bước vào những căn phòng nơi tuổi tác, chức danh và giới tính đã quyết định ai đáng tin trước cả khi bằng chứng kịp được đặt lên bàn.",
      "Điều này làm các cảnh điều tra có thêm một tầng: để hoàn thành công việc, cô vừa cần quan sát đối tượng vừa cần quan sát chính căn phòng đang đánh giá mình. Năng lực vì thế bao gồm cả việc giữ bình tĩnh trước ánh nhìn làm mình nhỏ lại.",
      "Đọc tới đó, mình nghĩ đến một câu hỏi rất gần: một tổ chức đang bỏ lỡ bao nhiêu điều khi người trẻ hơn hoặc ít quyền lực hơn phải dùng gần hết sức chỉ để được lắng nghe?"
    ]
  },
  {
    heading: "Mình bị giữ lại không chỉ bởi vụ án",
    paragraphs: [
      "Mình bước vào sách vì một vụ án, nhưng thứ giữ mình ở lại là cảm giác Clarice luôn phải giải hai bài toán cùng lúc. Ngoài kia có một mối nguy đang chạy cùng thời gian; trước mặt cô lại là một người bị giam nhưng vẫn có thể điều khiển nhịp của cả căn phòng.",
      "Thomas Harris cho người đọc vừa đủ thông tin để lo, nhưng hiếm khi đủ để thấy an toàn. Một chi tiết pháp y, một lần đổi điểm nhìn, một khoảng trống chưa được nối — mọi thứ làm chiếc đồng hồ trong đầu mình chạy nhanh hơn.",
      "Năng lực của Clarice vì thế không nằm ở một khoảnh khắc thật ngầu. Nó nằm trong việc chuẩn bị, nhìn kỹ, sửa giả thuyết và tiếp tục làm khi cả hệ thống lẫn người đối diện đều khiến cô nghi ngờ vị trí của mình."
    ]
  },
  {
    heading: "Mỗi manh mối đều có một cái giá",
    paragraphs: [
      "Những cuộc nói chuyện giữa Clarice và Lecter làm mình căng hơn nhiều cảnh hành động. Clarice cần thông tin, còn Lecter muốn được bước vào những vùng riêng tư cô không định mở. Mỗi manh mối đều có một cái giá, và chính Lecter muốn là người đặt giá.",
      "Hắn đọc giọng nói, quần áo, xuất thân và những khoảng ngập ngừng, khiến Clarice có cảm giác mình tới để quan sát nhưng lại bị nhìn xuyên qua trước. Sự nguy hiểm nằm ở chỗ một cuộc trao đổi chuyên môn cứ từ từ biến thành sự xâm phạm tâm lý.",
      "Mình không muốn học cách thao túng từ những đoạn này. Điều mình học là nhận ra điều kiện ẩn của một cuộc thương lượng: người kia thật sự muốn gì, mình cần gì đến mức nào, và có ranh giới nào dù rất cần kết quả mình vẫn không nên đem ra đổi."
    ]
  },
  {
    heading: "Có những tiếng kêu mình cứu được, có những tiếng kêu phải học cách sống cùng",
    paragraphs: [
      "Hình ảnh những con cừu làm động cơ của Clarice vừa đẹp vừa buồn. Cô không chỉ muốn hoàn thành một vụ án; đâu đó còn có mong muốn cứu được một sinh mạng để tiếng kêu cũ trong mình chịu im đi.",
      "Chính điều khiến cô bền bỉ cũng là nơi Lecter có thể chạm vào. Khi ai đó nhìn thấy vết thương mình đang cố giấu, ranh giới giữa được thấu hiểu và bị khai thác trở nên rất mỏng.",
      "Cuốn sách không hứa rằng cứu được một người sẽ chữa lành tất cả. Mình thích sự không dễ dàng đó. Có lẽ can đảm không phải làm quá khứ im hẳn; nó là vẫn chọn cứu điều có thể cứu, dù bên trong mình còn những tiếng kêu chưa biết khi nào mới yên."
    ]
  },
  {
    heading: "Mình không muốn chỉ nhớ kẻ gây án",
    paragraphs: [
      "Đọc truyện tội phạm, mình sợ nhất lúc kẻ gây án được viết quá cuốn còn nạn nhân chỉ còn là một chi tiết để cốt truyện chạy tiếp. Cuốn sách có những đoạn cố trả lại tên, quan hệ và đời sống cho người đã bị biến thành một hồ sơ.",
      "Nhưng mình cũng không thể bỏ qua tranh luận quanh cách tác phẩm nối bạo lực với giới và căn tính. Dù văn bản cố phân biệt hung thủ với người chuyển giới, hình tượng ấy vẫn có thể nuôi một liên tưởng gây hại trong một nền văn hóa vốn đã thiếu đại diện đúng và đủ.",
      "Mình muốn giữ cả hai khi đọc: công nhận cách Clarice được xây dựng mạnh mẽ, và vẫn chất vấn phần di sản làm người khác bị nhìn sai. Yêu một tác phẩm không có nghĩa phải bảo vệ nó khỏi mọi câu hỏi."
    ]
  },
  {
    heading: "Được nhìn thấu không giống với được thấu hiểu",
    paragraphs: [
      "Lecter có thể nhìn ra những điều Clarice chưa nói, nhưng cảm giác đó không hề giống được một người tử tế hiểu mình. Một bên làm vết thương được đặt trong an toàn; bên kia biến nó thành chiếc tay cầm để người khác điều khiển.",
      "Điều này làm mình nghĩ đến những người rất giỏi đọc cảm xúc nhưng không dùng khả năng ấy để chăm sóc. Sự tinh tế tự nó chưa mang đạo đức. Biết ai đó đang yếu ở đâu chỉ cho mình thêm quyền lựa chọn sẽ dịu dàng hay tàn nhẫn.",
      "Mình muốn nhớ rằng thấu hiểu thật không làm một người thấy bị lột trần. Nó cho họ quyền kể theo nhịp của mình, quyền giữ lại phần chưa sẵn sàng và cảm giác câu chuyện của họ sẽ không bị dùng ngược lại."
    ]
  },
  {
    heading: "Có lẽ bóng tối đáng sợ nhất là lúc nó trông rất có trật tự",
    paragraphs: [
      "Điều khiến Lecter ám ảnh không chỉ là bạo lực, mà là sự bình tĩnh, ngôn ngữ chính xác và vẻ lịch thiệp bao quanh nó. Mình thường muốn cái xấu phải ồn ào, vụng về và dễ nhận ra; như vậy việc tránh xa sẽ đơn giản hơn.",
      "Nhưng tổn hại có thể đi cùng trí tuệ, địa vị và cách cư xử hoàn hảo. Một người nói rất hay về đạo đức vẫn có thể làm đau người khác; một hệ thống rất ngăn nắp vẫn có thể được xây trên sự im lặng của người yếu hơn.",
      "Cuốn sách làm mình dè chừng vẻ ngoài của sự kiểm soát. Bình tĩnh không tự động là an toàn, thông minh không tự động là tốt, và cảm giác bị thu hút không phải lúc nào cũng là tín hiệu mình nên bước gần hơn."
    ]
  },
  {
    heading: "Sau trang cuối — điều gì còn ở lại?",
    paragraphs: [
      "Khi đọc xong một câu chuyện nặng, mình thường không muốn chỉ nhớ hung thủ hay những cảnh gây sốc. Có thể quay lại ba đường dây: Clarice đã bảo vệ điều gì, quyền lực đã đổi hướng các cuộc đối thoại ra sao và tác giả tạo căng thẳng bằng phần thông tin nào bị giữ lại.",
      "Nếu một đoạn khiến mình khó chịu, cảm giác ấy cũng đáng được ghi nhận thay vì ép thành lời khen văn chương. Đọc phản biện cho phép vừa công nhận kỹ thuật kể chuyện vừa đặt câu hỏi về cách bạo lực và nạn nhân được thể hiện.",
      "Phần mình muốn giữ là hình ảnh của sự can đảm có ranh giới: không cần trở nên giống bóng tối để đối diện nó, và không cần hết sợ mới có thể tiếp tục bước đi."
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
