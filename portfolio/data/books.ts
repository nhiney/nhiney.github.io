import { LAWS_OF_POWER_PAGES } from "./reading/lawsOfPower.vi";
import { SILENCE_OF_THE_LAMBS_PAGES } from "./reading/silenceOfTheLambs.vi";
import { GOODBYE_THINGS_PAGES } from "./reading/goodbyeThings.vi";
import { MUON_KIEP_NHAN_SINH_1_PAGES } from "./reading/muonKiepNhanSinh1.vi";
import { MUON_KIEP_NHAN_SINH_2_PAGES } from "./reading/muonKiepNhanSinh2.vi";
import { MUON_KIEP_NHAN_SINH_3_PAGES } from "./reading/muonKiepNhanSinh3.vi";

// The curated shelf — the books the user has actually read. This is the single
// source of truth for the /books galaxy (NOT the blog). Each book shows a real
// published cover from /public/books/rendered; books without one fall back to a
// clean designed cover painted from the palette. A book may link to a blog review via
// `blogSlug` (then reading mode shows the full write-up); books without one show
// just the cover + author.
//
// To add a book: normalize its cover into /public/books/rendered, record the
// source in rendered/SOURCES.md, then add its path and aspect ratio here.

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
  /** Width / height of the published front cover, used by the 3D book mesh. */
  coverAspect?: number;
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
  /** Optional authored layout for a book-specific editorial page. */
  design?: GoodbyeThingsPageDesign;
  /** Optional authored layout for the “Bản đồ nhiều lớp thời gian” edition. */
  timeMapDesign?: LayeredTimeMapPageDesign;
  /** Optional authored layout for the “Xưởng phục hồi những vòng lặp” edition. */
  loopDesign?: LoopRestorationPageDesign;
  /** Optional authored layout for the “Phòng thí nghiệm của tương lai” edition. */
  futureLabDesign?: FutureLabPageDesign;
}

export type BookReadingLayout = "sectioned" | "continuous";
export type GoodbyeThingsPageDesign =
  | "morning-table"
  | "invisible-receipt"
  | "inventory-table"
  | "five-doors"
  | "shared-home"
  | "memory-box"
  | "purchase-waitlist"
  | "future-fitting-room"
  | "paid-receipt"
  | "space-exchange"
  | "two-valid-rooms"
  | "farewell-postcard"
  | "enough-compass"
  | "seven-day-sunpath";
export type LayeredTimeMapPageDesign =
  | "two-lenses"
  | "thomas-desk"
  | "karma-flow"
  | "responsibility-balance"
  | "ripple"
  | "atlantis-map"
  | "transparent-power"
  | "love-control"
  | "knowledge-core"
  | "money-hands"
  | "four-seasons"
  | "evidence-layers"
  | "today-compass"
  | "reflection-notes";
export type LoopRestorationPageDesign =
  | "ripple-butterfly"
  | "loop-break"
  | "culture-weave"
  | "responsibility-rings"
  | "fear-wall"
  | "achievement-mountain"
  | "love-control-knot"
  | "sound-memory-wave"
  | "threshold-today"
  | "repair-stages"
  | "forgiveness-gate"
  | "storm-checks"
  | "accountable-repair"
  | "seven-day-thread";
export type FutureLabPageDesign =
  | "amplification-chain"
  | "two-sided-price"
  | "gift-without-debt"
  | "unequal-choice-rooms"
  | "three-drawers"
  | "six-safety-switches"
  | "speed-and-compass"
  | "recurring-pattern"
  | "three-questions"
  | "paths-can-part"
  | "four-point-compass"
  | "human-machine-collaboration"
  | "default-switch-chain"
  | "personal-constitution";
export type BookReadingTheme =
  | "conversation-atelier"
  | "habit-field-guide"
  | "thinking-dossier"
  | "power-board"
  | "silence-casefile"
  | "breathing-house"
  | "layered-time-map"
  | "loop-restoration-workshop"
  | "future-ethics-lab";

export interface BookOutsideSummary {
  /** Optional italic lead shown between the author and the section heading. */
  tagline?: string;
  heading: string;
  introduction: string[];
  /** Optional label separating the introduction from the key lessons. */
  lessonsHeading?: string;
  /** Show lesson markers as an ordered sequence instead of editorial bullets. */
  numbered?: boolean;
  lessons: Array<{
    heading: string;
    paragraph?: string;
  }>;
  conclusion: string[];
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
  /** Optional long-form summary shown on the outside/detail sheet in place of
   * the short cover note and key-point list. */
  outsideSummary?: Partial<Record<"en" | "vi", BookOutsideSummary>>;
  /** Curated short-form pages for the flipbook, preferred over blog excerpts.
   * A Vietnamese-only deck is intentional: English then falls back to the
   * linked English review, or to the English key points when no review exists. */
  readingPages?: Partial<Record<"en" | "vi", BookReadingPage[]>>;
  /** Optional authored-flow mode. Continuous layout may begin the next section
   * in the remaining space on a leaf instead of forcing a hard page break. */
  readingLayout?: BookReadingLayout;
  /** Optional denser print rhythm for long sectioned books. */
  readingDensity?: "compact";
  /** Optional visual language applied to every interior leaf of this book. */
  readingTheme?: BookReadingTheme;
}

// The Vietnamese critical-reading manuscript is split into focused data files
// so its 19 lenses, 48 moves and seven-day practice remain auditable.

const DAC_NHAN_TAM_PAGES: BookReadingPage[] = [
  {
    heading: "Lăng kính — kỹ năng phải đi cùng ý định",
    paragraphs: [
      "Trong *Đắc Nhân Tâm*, Dale Carnegie đưa ra nhiều nguyên tắc giúp mình giao tiếp tốt hơn: bớt chỉ trích, biết lắng nghe, ghi nhận chân thành và nhìn sự việc từ góc của người khác.",
      "Mạch chính của cuốn sách đi qua bốn vùng rất thực tế: **giao tiếp mà không tạo phòng vệ, tạo thiện cảm bằng sự quan tâm thật, thuyết phục bằng hợp tác và lãnh đạo mà vẫn giữ thể diện cho người khác**. Mười bốn trang sau kết nối bốn vùng ấy với những tình huống mình có thể gặp ngay trong gia đình và nơi làm việc.",
      "Nhưng cùng một cách nói có thể tạo ra hai kết quả rất khác nhau.",
      "Một lời khen có thể khiến ai đó cảm thấy được trân trọng. Nó cũng có thể trở thành bước mở đầu cho một lời nhờ vả. Một câu hỏi có thể xuất phát từ tò mò thật sự, nhưng cũng có thể được dùng để dẫn người nghe đến câu trả lời mình muốn.",
      "==Điểm khác biệt không chỉ nằm ở câu chữ, mà còn ở ý định phía sau.==",
      "Trước một cuộc trò chuyện quan trọng, hãy nhìn qua bốn lăng kính:",
      "- **Ý định:** Mình muốn hiểu hay chỉ muốn thắng?",
      "- **Sự chú ý:** Mình đang nghe người này hay chuẩn bị câu trả lời?",
      "- **Phẩm giá:** Mình đang nói về vấn đề hay phán xét con người?",
      "- **Quyền lựa chọn:** Người kia có thật sự được nói không?",
      "Một câu hỏi nhỏ có thể giúp mình nhận ra rất nhiều:",
      "> Nếu người này không đồng ý, mình còn giữ được sự tôn trọng dành cho họ không?",
      "==Kỹ năng giao tiếp chỉ thật sự có giá trị khi nó giúp hai người nhìn thấy nhau rõ hơn, không phải khi một người dùng nó để điều khiển người còn lại.==",
      "[[kind-conversation-mindmap]]",
    ]
  },
  {
    heading: "Trước khi nói — đổi phán xét lấy tò mò",
    paragraphs: [
      "Khi thấy một phần việc bị trễ, phản ứng đầu tiên của mình có thể là:",
      "> [before] “Bạn lúc nào cũng thiếu trách nhiệm.”",
      "Câu nói này không chỉ nhắc đến công việc. Nó gắn một chiếc nhãn lên cả con người, khiến người nghe dễ chuyển sang bảo vệ bản thân.",
      "Thay vào đó, hãy tách điều mình nhìn thấy khỏi điều mình đang suy diễn:",
      "> [after] “Phần việc này đang chậm hai ngày nên lịch chung cũng bị lùi. Bạn đang gặp vướng mắc gì?”",
      "Cách nói này vẫn rõ vấn đề nhưng mở ra cơ hội để mình biết thêm thông tin. Có thể người kia đã quên, cũng có thể họ đang chờ dữ liệu hoặc chưa hiểu yêu cầu.",
      "Sau khi nghe, mình vẫn có thể nói rõ điều cần thiết:",
      "> [next] “Mình cần bản hoàn chỉnh trước 3 giờ chiều mai. Nếu thời gian đó không khả thi, bạn báo mình sớm để cả hai tìm cách xử lý.”",
      "Tò mò không có nghĩa là bỏ qua trách nhiệm. Nó chỉ giúp mình hiểu trước khi kết luận.",
      "### Trước khi góp ý, thử đi qua ba bước",
      "1. **Nói điều mình quan sát được:** Chuyện gì đã xảy ra?",
      "2. **Hỏi thêm một câu:** Người kia đang gặp điều gì?",
      "3. **Nói rõ nhu cầu:** Việc gì cần thay đổi và vào lúc nào?",
      "==Rõ ràng và tử tế không đối lập nhau. Mình có thể giữ cả hai trong cùng một câu nói.==",
      "[[dac-illustration:deadline]]",
    ]
  },
  {
    heading: "Khi ghi nhận — cụ thể hơn lời khen chung chung",
    paragraphs: [
      "“Bạn giỏi quá” nghe vui, nhưng người nghe có thể không biết mình đang đánh giá cao điều gì.",
      "Một lời ghi nhận có trọng lượng thường gồm ba phần:",
      "[[recognition-formula]]",
      "Ví dụ:",
      "> “Bạn đã tóm tắt ba phương án trước cuộc họp, nhờ vậy cả nhóm quyết định nhanh hơn. Mình rất trân trọng sự chuẩn bị đó.”",
      "Hoặc trong gia đình:",
      "> “Hôm nay bạn chủ động rửa bát khi thấy mình đang bận. Việc đó giúp mình nhẹ đi rất nhiều.”",
      "Sự cụ thể cho người nghe biết hành động nào có ý nghĩa và đáng được tiếp tục.",
      "Tuy nhiên, lời khen sẽ mất đi sự chân thành nếu vừa nói xong mình lập tức thêm:",
      "> [before] “Nhân tiện, bạn làm giúp mình việc này nhé.”",
      "Đừng biến sự ghi nhận thành khoản tiền đặt cọc để đổi lấy thiện chí. Nếu có lời nhờ, hãy nói nó thành một lời nhờ riêng và cho người kia quyền từ chối.",
      "### Thử viết một lời ghi nhận",
      "- **Điều mình thấy:** ........................................",
      "- **Ảnh hưởng của nó:** ........................................",
      "- **Điều mình trân trọng:** ........................................",
      "==Không cần phóng đại. Một lời ghi nhận đúng và thật thường chạm đến người nghe hơn một lời khen thật lớn nhưng mơ hồ.==",
      "[[dac-illustration:child-recognition]]",
    ]
  },
  {
    heading: "Khi bất đồng — rõ việc, giữ người",
    paragraphs: [
      "Bất đồng dễ biến thành một cuộc đấu xem ai đúng hơn. Khi ấy, mình không còn nghe để hiểu mà chỉ tìm lỗ hổng trong lời của người kia.",
      "Thay vì bắt đầu bằng “bạn sai rồi”, hãy thử tìm phần cả hai đang cùng quan tâm:",
      "> “Mình nghĩ cả hai đều muốn dự án hoàn thành đúng hạn. Chỗ mình đang nhìn khác là cách phân chia thời gian.”",
      "Sau đó, mô tả điểm khác biệt và mời người kia nói rõ hơn:",
      "> “Mình lo phương án này không đủ thời gian kiểm tra. Bạn đang dựa vào dữ liệu nào để thấy nó khả thi?”",
      "Nếu nhận ra mình sai, hãy thừa nhận sớm:",
      "> “Chỗ này mình đã hiểu thiếu thông tin. Mình xin sửa lại.”",
      "Một lời nhận sai rõ ràng thường giúp cuộc trò chuyện đi tiếp nhanh hơn nhiều so với việc cố bảo vệ hình ảnh của mình.",
      "### Bốn bước khi bất đồng",
      "1. Tìm mục tiêu chung.",
      "2. Nói rõ điểm mình nhìn khác.",
      "3. Hỏi cách người kia đang suy nghĩ.",
      "4. Nêu quan điểm hoặc ranh giới của mình.",
      "==Giữ thể diện cho người khác không có nghĩa là che giấu vấn đề. Nó có nghĩa là không biến một ý kiến sai hay một lỗi làm việc thành phán quyết về giá trị của họ.==",
      "[[dac-illustration:money-disagreement]]",
    ]
  },
  {
    heading: "Thử ngay — nghe thêm một câu",
    paragraphs: [
      "Trong một cuộc trò chuyện, mình thường muốn giúp thật nhanh. Người kia vừa kể khó khăn, mình đã đưa lời khuyên hoặc kể lại một trải nghiệm tương tự của bản thân.",
      "Nhưng đôi khi điều họ cần trước tiên chỉ là được kể hết.",
      "Lần tới, trước khi khuyên, hãy nghe thêm một câu bằng cách hỏi:",
      "- “Điều gì trong chuyện này làm bạn mệt nhất?”",
      "- “Sau đó chuyện gì xảy ra?”",
      "- “Bạn đã thử những cách nào rồi?”",
      "- “Bạn muốn mình lắng nghe hay cùng bạn tìm giải pháp?”",
      "Câu hỏi cuối đặc biệt hữu ích. Nó giúp mình biết người kia đang cần sự đồng hành hay một góc nhìn mới.",
      "Khi họ trả lời, thử nhắc lại điều mình hiểu:",
      "> “Có phải bạn không chỉ mệt vì công việc nhiều, mà còn vì cảm thấy nỗ lực của mình không được nhìn thấy?”",
      "Nếu hiểu chưa đúng, họ có thể sửa lại. Nếu hiểu đúng, họ sẽ biết mình thật sự đang theo dõi câu chuyện.",
      "### Bài tập hai phút",
      "- Không ngắt lời trong hai phút.",
      "- Hỏi thêm một câu mở.",
      "- Nhắc lại điều mình đã hiểu.",
      "- Không vội biến câu chuyện thành trải nghiệm của mình.",
      "==Lắng nghe không phải chờ im lặng để tới lượt nói. Đó là tạm đặt cái tôi sang một bên để người trước mặt có đủ chỗ xuất hiện.==",
      "[[dac-illustration:friend-resignation]]",
    ]
  },
  {
    heading: "Nhớ một người — chú ý thay vì biểu diễn",
    paragraphs: [
      "Gọi đúng tên, nhớ sở thích hoặc hỏi lại một câu chuyện cũ có thể khiến một người cảm thấy mình đã thật sự chú ý đến họ.",
      "Ví dụ:",
      "> “Tuần trước bạn nói mẹ đang phẫu thuật. Bây giờ bác ổn hơn chưa?”",
      "Giá trị không nằm ở việc mình có trí nhớ gây ấn tượng. Nó nằm ở việc điều quan trọng với người kia vẫn được mình quan tâm sau khi cuộc trò chuyện kết thúc.",
      "Nếu không chắc, hỏi lại chân thành vẫn tốt hơn giả vờ:",
      "> “Mình nhớ bạn từng kể về chuyện này, nhưng không chắc mình nhớ đúng. Bạn nhắc lại giúp mình nhé?”",
      "### Ba điều đáng nhớ sau một cuộc gặp",
      "- Tên và cách phát âm đúng.",
      "- Một điều họ thật sự quan tâm.",
      "- Một việc mình đã hứa sẽ phản hồi.",
      "Không cần ghi lại những thông tin riêng tư chỉ để tỏ ra thân thiết. Sự chú ý cũng cần đi cùng tôn trọng.",
      "Và nhớ tên không thể bù cho việc liên tục ngắt lời, thất hứa hoặc phớt lờ ranh giới của người khác.",
      "==Con người không cần được mình gây ấn tượng nhiều bằng việc được mình hiện diện cùng. Đôi khi một cuộc trò chuyện đáng nhớ chỉ cần mình cất điện thoại, gọi đúng tên và hỏi lại điều từng quan trọng với họ.==",
      "[[dac-illustration:remember-detail]]",
    ]
  },
  {
    heading: "Khi muốn thuyết phục — làm lựa chọn sáng rõ hơn",
    paragraphs: [
      "Nhìn sự việc từ góc của người khác giúp lời đề nghị trở nên rõ ràng hơn. Nhưng sự thấu hiểu không nên trở thành công cụ tìm đúng điểm yếu để ép họ đồng ý.",
      "[[ethical-persuasion-table]]",
      "Ví dụ, thay vì:",
      "> [before] “Mọi người đều làm cuối tuần, bạn đừng làm khó cả nhóm.”",
      "Hãy nói:",
      "> [after] “Nhóm đang cần thêm người hỗ trợ sáng thứ Bảy. Công việc khoảng ba giờ và sẽ được nghỉ bù vào thứ Hai. Bạn có thể từ chối nếu lịch cá nhân không phù hợp.”",
      "Một lời đề nghị tử tế cần có lợi ích, chi phí, giới hạn và quyền từ chối.",
      "### Biến thuyết phục thành đồng thiết kế",
      "Giả sử mình muốn cả nhóm dành một buổi chiều mỗi tuần để xử lý công việc tồn đọng. Thay vì mang đến một kế hoạch đã khóa sẵn rồi tìm cách khiến mọi người gật đầu, mình có thể nói: “Mục tiêu là giảm việc gấp vào cuối tuần. Điều gì khiến phương án chiều thứ Sáu khó thực hiện, và nhóm muốn thử cách nào trong hai tuần?”",
      "Khi người bị ảnh hưởng được bổ sung dữ kiện, sửa phương án và nhìn thấy dấu vết ý kiến của mình trong quyết định cuối, sự hợp tác không còn đến từ áp lực. Ý tưởng cũng thường tốt hơn vì đã đi qua nhiều kinh nghiệm thật.",
      "Đừng chỉ kể lợi ích bằng lời. Một bản thử nhỏ, hình ảnh trước–sau hoặc ví dụ cụ thể có thể giúp tác động trở nên dễ hình dung hơn — miễn là minh họa làm sự thật rõ hơn, không che phần chi phí hay rủi ro.",
      "==Thuyết phục tốt không làm mọi lựa chọn khác biến mất. Nó giúp người nghe nhìn rõ lựa chọn trước mặt và đưa ra quyết định mà họ có thể chịu trách nhiệm.==",
      "[[dac-illustration:course-sale]]",
    ]
  },
  {
    heading: "Sáu điều nhỏ khiến một người cảm thấy được nhìn thấy",
    paragraphs: [
      "Nhiều nguyên tắc trong *Đắc Nhân Tâm* quay về những hành động rất nhỏ. Chúng không cần được thực hiện như một màn trình diễn hoàn hảo.",
      "**1. Quan tâm thật**",
      "Hỏi về điều người kia đang quan tâm, không chỉ hỏi để chờ cơ hội kể về mình.",
      "**2. Chào đón họ bằng sự ấm áp**",
      "Một nụ cười tự nhiên, ánh mắt thân thiện hoặc lời chào đúng lúc đều có thể khiến khoảng cách nhỏ lại.",
      "**3. Gọi đúng tên**",
      "Nếu chưa biết cách phát âm, hãy hỏi. Sự cẩn thận thường đáng quý hơn việc cố đoán.",
      "**4. Để họ nói hết ý**",
      "Đừng hoàn thành câu thay họ hoặc vội đưa lời khuyên khi câu chuyện còn chưa rõ.",
      "**5. Nói về điều có ý nghĩa với họ**",
      "Khi trình bày một đề nghị, hãy giải thích nó liên quan thế nào đến nhu cầu và mục tiêu của người nghe.",
      "**6. Ghi nhận điều cụ thể**",
      "Cho họ biết hành động nào đã tạo ra ảnh hưởng tốt, thay vì chỉ nói “bạn tuyệt vời”.",
      "Những điều này chỉ có ý nghĩa khi chúng thật. Nhớ tên nhưng quên ranh giới, hỏi chuyện nhưng không nghe câu trả lời hay khen ngợi chỉ để nhờ vả đều khiến sự tử tế trở nên rỗng.",
      "Trước một cuộc gặp, hãy hỏi:",
      "> Người này đang mang điều gì vào căn phòng, và mình đã dành đủ chỗ để nhìn thấy chưa?",
    ]
  },
  {
    heading: "Đồng thuận không nhất thiết phải bắt đầu bằng tranh thắng",
    paragraphs: [
      "Một cái gật đầu chưa chắc đã là đồng thuận. Người ta có thể nói “được” vì hiểu và thật sự muốn hợp tác. Họ cũng có thể đồng ý vì sợ làm người khác thất vọng, sợ mất cơ hội hoặc chưa thấy mình được phép từ chối.",
      "### Đèn tín hiệu của sự đồng thuận",
      "[[consent-traffic-light-table]]",
      "Ba câu hỏi giúp kiểm tra:",
      "- “Bạn còn điều gì chưa thoải mái với phương án này không?”",
      "- “Bạn cần thêm thông tin hay thời gian suy nghĩ không?”",
      "- “Nếu không phù hợp, bạn có thể nói thẳng với mình.”",
      "Mục tiêu không phải khiến người kia nói “vâng” thật nhanh. Mục tiêu là để cả hai hiểu mình đang đồng ý với điều gì, có trách nhiệm nào và giới hạn ra sao.",
      "==Một sự đồng thuận có giá trị là khi người tham gia vẫn được giữ tiếng nói của mình.==",
      "[[dac-illustration:hesitant-overtime]]",
    ]
  },
  {
    heading: "Lãnh đạo mà không làm người khác nhỏ đi",
    paragraphs: [
      "Một lời góp ý có thể giúp người khác tiến bộ. Nó cũng có thể khiến họ chỉ học được cách che giấu lỗi.",
      "Một cuộc trao đổi tốt cần **rõ việc, giữ người và mở lối**.",
      "Thay vì:",
      "> [before] “Bạn lúc nào cũng cẩu thả.”",
      "Hãy thử:",
      "> [after] “Bản báo cáo này còn thiếu ba số liệu nên nhóm chưa thể gửi đi. Trước đây mình cũng từng bỏ sót khi làm quá nhanh. Bạn đang gặp vướng ở bước nào? Chúng ta cần hoàn thiện trước 4 giờ chiều.”",
      "Cách nói này gồm năm phần:",
      "1. Mô tả việc đã xảy ra.",
      "2. Nêu ảnh hưởng cụ thể.",
      "3. Thừa nhận góc nhìn hoặc sai sót của mình khi phù hợp.",
      "4. Hỏi người kia đang gặp điều gì.",
      "5. Thống nhất bước tiếp theo và sự hỗ trợ cần thiết.",
      "### Trao một kỳ vọng người khác có thể bước tới",
      "Một lời góp ý tốt không chỉ nói điều gì chưa đạt; nó còn chỉ ra vì sao người nghe có khả năng sửa. Ví dụ: “Ba báo cáo trước bạn kiểm tra số liệu rất chắc. Lần này còn thiếu ba ô đối chiếu. Bạn muốn tự rà lại theo bảng kiểm hay cần mình xem cùng mười phút đầu?”",
      "Câu nói ấy dùng bằng chứng thật để nhắc lại năng lực, đặt tiêu chuẩn rõ và trao quyền chọn cách sửa. Nó khác với gắn một nhãn đẹp để buộc người kia phải chứng minh mình xứng đáng.",
      "Khi lỗi có thể sửa, góp ý riêng và công nhận tiến bộ sớm thường hữu ích hơn làm người khác xấu hổ trước nhóm. Nhưng nếu vấn đề liên quan an toàn, gian lận hoặc gây hại lặp lại, lãnh đạo vẫn phải dùng quy trình rõ và chịu trách nhiệm cho quyết định.",
      "Giữ thể diện không có nghĩa là nói mơ hồ. Một người quản lý vẫn cần nêu rõ tiêu chuẩn, phân chia nguồn lực công bằng và đưa ra quyết định khi có vấn đề.",
      "Lời khen cũng không thể bù cho một hệ thống khiến mọi người kiệt sức. Lãnh đạo tử tế không chỉ nói dễ nghe. Họ tạo điều kiện để người khác hiểu việc mình làm, có cơ hội sửa sai và đủ an toàn để báo vấn đề trước khi nó trở nên nghiêm trọng.",
      "[[dac-illustration:invoice-mistake]]",
    ]
  },
  {
    heading: "Có những lúc tử tế không phải là tiếp tục mỉm cười",
    paragraphs: [
      "*Đắc Nhân Tâm* được viết trong một bối cảnh khác. Những nguyên tắc về sự thân thiện rất đáng học, nhưng không phải tình huống nào cũng nên được giải quyết bằng việc nói khéo hơn.",
      "Khi gặp quấy rối, đe dọa, gian lận, bạo lực hoặc ranh giới liên tục bị xâm phạm, ưu tiên của mình không phải tạo thiện cảm. Đó là bảo vệ sự an toàn và phẩm giá.",
      "Khi ấy, mình có thể:",
      "- Nói “không” rõ ràng nếu việc đó an toàn.",
      "- Rời khỏi cuộc trò chuyện.",
      "- Lưu lại thông tin hoặc bằng chứng cần thiết.",
      "- Tìm người hỗ trợ đáng tin cậy.",
      "- Sử dụng kênh chính thức phù hợp.",
      "- Không gặp riêng nếu cảm thấy không an toàn.",
      "Trước một cuộc trao đổi khó, hãy tự hỏi:",
      "- Đây là vấn đề giao tiếp hay vấn đề an toàn?",
      "- Có sự chênh lệch quyền lực đáng kể không?",
      "- Người kia đã từng phớt lờ ranh giới của mình chưa?",
      "- Mình cần ai ở bên hoặc biết về chuyện này?",
      "==Tử tế không có nghĩa là chịu đựng mọi thứ trong im lặng. Đôi khi điều tử tế nhất với chính mình là dừng cuộc trò chuyện và tìm sự hỗ trợ phù hợp.==",
      "[[dac-illustration:safety-boundary]]",
    ]
  },
  {
    heading: "Nhu cầu được yêu mến đôi khi kéo mình xa sự chân thành",
    paragraphs: [
      "Khi quá cần một cuộc trò chuyện kết thúc êm đẹp, mình có thể cười dù đang khó chịu, nói “không sao” khi thật ra có vấn đề hoặc nhận lời vì sợ người khác thất vọng.",
      "Nhưng một mối quan hệ chỉ yên khi một người liên tục thu nhỏ mình thì chưa thật sự bình yên. Khoảng cách giữa điều mình cảm thấy và điều mình dám nói sẽ ngày càng lớn.",
      "Sự tử tế không đồng nghĩa với luôn đồng ý.",
      "Mình có thể nói mềm nhưng vẫn nói thật:",
      "- “Mình hiểu việc này quan trọng, nhưng hiện tại mình không thể nhận thêm.”",
      "- “Mình cần thời gian suy nghĩ trước khi trả lời.”",
      "- “Mình nghe quan điểm của bạn, nhưng mình đang nhìn khác.”",
      "- “Mình không thoải mái với cách nói vừa rồi.”",
      "- “Nếu chuyện này tiếp tục, mình sẽ dừng cuộc trao đổi.”",
      "Người khác thất vọng không tự động có nghĩa là mình đã làm sai. Đôi khi họ chỉ đang gặp một giới hạn không giống điều họ mong muốn.",
      "==Giá trị bền nhất từ *Đắc Nhân Tâm* không phải khiến tất cả mọi người đều thích mình. Đó là học cách quan tâm người khác mà không bỏ rơi chính mình.==",
      "[[dac-illustration:family-loan]]",
    ]
  },
  {
    heading: "Được lắng nghe có thể khiến một người bớt cô đơn",
    paragraphs: [
      "Có những lúc người ngồi trước mặt mình không cần một bài học, một câu động viên thật lớn hay một danh sách giải pháp. Họ chỉ cần được kể câu chuyện mà không bị sửa ngay lập tức.",
      "Một khoảng lắng nghe tử tế có thể bắt đầu rất đơn giản:",
      "- Đặt điện thoại xuống.",
      "- Không vội kể câu chuyện tương tự của mình.",
      "- Hỏi: “Điều gì đang nặng nhất với bạn?”",
      "- Để một khoảng im lặng mà không lập tức lấp đầy.",
      "- Nhắc lại điều mình hiểu để họ có thể sửa.",
      "- Hỏi họ muốn được lắng nghe hay cần cùng tìm cách giải quyết.",
      "Lắng nghe không có nghĩa là mình phải đồng ý với mọi điều hoặc chịu trách nhiệm giải quyết toàn bộ cuộc đời của người kia. Mình vẫn có thể nói:",
      "> “Mình rất muốn ở đây với bạn, nhưng chuyện này vượt quá khả năng của mình. Mình nghĩ chúng ta nên tìm thêm một người có thể hỗ trợ tốt hơn.”",
      "==Trước đây, mình có thể nghĩ giao tiếp giỏi là luôn có câu trả lời đúng. Nhưng đôi khi giá trị của cuộc trò chuyện chỉ nằm ở việc người kia không còn phải mang câu chuyện một mình.==",
      "[[dac-illustration:sad-story]]",
    ]
  },
  {
    heading: "Bảy ngày — thực hành sự quan tâm có thật",
    paragraphs: [
      "Không cần áp dụng toàn bộ nguyên tắc cùng lúc. Trong bảy ngày, mỗi ngày hãy thử một hành động nhỏ.",
      "[[seven-day-care-table]]",
      "Cuối mỗi ngày, ghi lại một cuộc trò chuyện:",
      "- Mình đã tò mò ở khoảnh khắc nào?",
      "- Khi nào cái tôi muốn xuất hiện hoặc giành phần đúng?",
      "- Người kia có đủ không gian để nói khác mình không?",
      "- Lần sau mình muốn làm điều gì tốt hơn?",
      "Đừng dùng bài tập này để chấm điểm mình là người giao tiếp tốt hay kém. Hãy xem nó như một cách nhận ra những phản xạ vẫn thường diễn ra quá nhanh.",
      "Nếu chỉ giữ lại một điều sau cuốn sách, có lẽ đó là:",
      "> ==Giao tiếp giỏi không phải khiến căn phòng xoay quanh mình, mà giúp những người trong phòng được nhìn thấy rõ hơn.==",
    ]
  }
];

// Vietnamese decision-checking reflection. System 1 and System 2 stay
// attributed to the book as a model, not literal parts of the brain.
const THINKING_FAST_SLOW_PAGES: BookReadingPage[] = [
  {
    heading: "Trong đầu mình có hai nhịp nghĩ",
    paragraphs: [
      "[[thinking-dossier-series]]",
      "Daniel Kahneman dùng **Hệ thống 1** và **Hệ thống 2** như một cách gọi dễ nhớ cho hai nhịp suy nghĩ quen thuộc.",
      "Hệ thống 1 hoạt động nhanh và gần như tự động. Nó giúp mình nhận ra gương mặt quen, hiểu một câu nói đơn giản hay né một chiếc xe đang lao tới. Hệ thống 2 chậm hơn, cần tập trung hơn và thường xuất hiện khi mình tính toán, so sánh hoặc kiểm tra một nhận định.",
      "**THỬ NGAY**",
      "- `2 + 2 = ?` — câu trả lời gần như tự xuất hiện.",
      "- `17 × 24 = ?` — mình phải dừng lại và thật sự suy nghĩ.",
      "Nhịp nhanh không xấu; nhờ nó mà mình không phải phân tích mọi việc từ đầu. ==Vấn đề chỉ xuất hiện khi một quyết định khó lại mang đến cảm giác quá dễ.==",
      "**DẤU HIỆU NÊN CHẬM LẠI**",
      "Quyết định có hậu quả lớn, khó sửa, liên quan nhiều tiền hoặc khiến mình lập tức nghĩ: *“Chắc chắn là vậy.”*",
    ],
  },
  {
    heading: "Cảm giác đúng chưa phải là bằng chứng",
    paragraphs: [
      "Buổi đầu xem nhà, môi giới nói căn hộ từng được chào giá 5 tỷ. Sau đó họ đưa mức 4,2 tỷ và mình lập tức cảm thấy “khá hời”. Có thể mức giá hợp lý thật, nhưng cũng có thể con số đầu tiên đã âm thầm trở thành một **mỏ neo**.",
      "Tâm trí còn dễ bị kéo theo những điều vừa xuất hiện. Sau khi nghe một câu chuyện mất tiền vì đầu tư, mình có thể cảm thấy mọi khoản đầu tư đều quá nguy hiểm. Gặp một ứng viên nói chuyện tự tin, mình dễ xem sự tự tin ấy như bằng chứng cho năng lực.",
      "**BA DẤU VẾT CẦN KIỂM TRA**",
      "1. Bằng chứng trực tiếp mình đang có là gì?",
      "2. Những trường hợp tương tự thường có kết quả thế nào?",
      "3. Con số hoặc câu chuyện nào xuất hiện đầu tiên và đang kéo suy nghĩ của mình?",
      "==Câu hỏi này không khiến thiên kiến biến mất, nhưng nó tạo khoảng cách giữa *“nghe có vẻ đúng”* và *“đã đủ căn cứ để tin”*.==",
    ],
  },
  {
    heading: "Kế hoạch thường đẹp hơn đời thật",
    paragraphs: [
      "Mình dự tính sửa căn phòng trong ba tuần: đặt vật liệu, thi công, lắp nội thất rồi dọn vào. Trên giấy, mọi thứ nối nhau rất đẹp. Nhưng đời thật còn có hàng giao trễ, thợ bận, phát sinh kỹ thuật và hàng loạt việc mình chưa nghĩ tới.",
      "Đó là lúc **góc nhìn bên ngoài** trở nên hữu ích. Thay vì chỉ hỏi kế hoạch của mình hợp lý đến đâu, hãy nhìn những việc tương tự trước đây đã thật sự mất bao lâu.",
      "**BÀI KIỂM TRA TRƯỚC KHI CHỐT KẾ HOẠCH**",
      "- Tìm vài trường hợp gần giống nhất.",
      "- Xem thời gian và chi phí thực tế của họ.",
      "- Lấy mức phổ biến làm điểm bắt đầu.",
      "- Sau đó mới điều chỉnh cho hoàn cảnh riêng.",
      "- Thêm khoảng đệm cho những việc chưa nhìn thấy.",
      "==Hy vọng vẫn cần thiết để bắt đầu. Nhưng một kế hoạch tốt không chỉ chứa điều mình mong sẽ xảy ra; nó còn dành chỗ cho đời thật bước vào.==",
    ],
  },
  {
    heading: "Mất, được và chiếc khung quanh lựa chọn",
    paragraphs: [
      "Hai câu sau mô tả cùng một kết quả:",
      "- “Phương án này có 90% khả năng thành công.”",
      "- “Phương án này có 10% khả năng thất bại.”",
      "Con số không đổi, nhưng cảm giác có thể khác hẳn. Đó là sức mạnh của **cách đóng khung**.",
      "Mình cũng thường cảm thấy mất một thứ đang có đau hơn niềm vui khi nhận được một thứ tương đương. Vì vậy, ta dễ giữ một gói dịch vụ không còn dùng, tiếp tục một dự án không còn hiệu quả hoặc ngại thay đổi chỉ vì đã bỏ quá nhiều công sức.",
      "**THỬ ĐẢO CHIỀU**",
      "- Viết lựa chọn dưới cả khung “được” và “mất”.",
      "- Nếu chưa sở hữu món này, hôm nay mình có mua nó không?",
      "- Nếu chưa đầu tư vào dự án này, hôm nay mình có bắt đầu không?",
      "- Mình đang chọn vì tương lai hay vì tiếc phần đã bỏ ra?",
      "==Đôi khi mình không bảo vệ một lựa chọn tốt. Mình chỉ đang bảo vệ cảm giác không muốn thừa nhận một mất mát.==",
    ],
  },
  {
    heading: "Người đang sống và người kể lại",
    paragraphs: [
      "Một chuyến đi có thể rất vui trong bốn ngày, nhưng kết thúc bằng một trận cãi nhau. Khi nhớ lại, mình dễ để đoạn kết phủ màu lên toàn bộ trải nghiệm.",
      "Kahneman gợi ra hai góc nhìn: **cái tôi đang trải nghiệm** sống qua từng khoảnh khắc, còn **cái tôi ghi nhớ** kể lại câu chuyện sau đó. Trí nhớ không lưu mọi phút với trọng lượng ngang nhau; những đoạn cao trào và phần kết thường nổi bật hơn.",
      "[[thinking-film-album-comparison]]",
      "Vì vậy, khi đánh giá công việc, mối quan hệ hay một chuyến đi, mình có thể hỏi hai câu:",
      "1. Trong lúc sống với điều này, phần lớn thời gian mình cảm thấy thế nào?",
      "2. Sau khi kết thúc, mình muốn nhớ câu chuyện ấy ra sao?",
      "==Một ký ức đẹp chưa chắc đại diện cho cả hành trình; một đoạn kết tệ cũng chưa chắc xóa sạch những ngày từng rất vui.==",
    ],
  },
  {
    heading: "Phiếu dừng 60 giây",
    paragraphs: [
      "Không phải lựa chọn nào cũng cần phân tích dài. Nhưng với việc có hậu quả lớn, một phút kiểm tra có thể cứu mình khỏi nhiều tháng sửa sai.",
      "**PHIẾU DỪNG**",
      "- Mình thật sự đang quyết định điều gì?",
      "- Nếu sai, hậu quả lớn nhất là gì?",
      "- Có con số đầu tiên nào đang neo suy nghĩ của mình?",
      "- Những trường hợp tương tự thường kết thúc ra sao?",
      "- Thông tin quan trọng nào còn thiếu?",
      "- Nếu diễn đạt lựa chọn theo chiều ngược lại, mình có đổi ý không?",
      "- Quyết định này dễ hay khó quay lại?",
      "- Mình đang tỉnh táo hay đang mệt, vội, giận hoặc quá hào hứng?",
      "==Phiếu này không đảm bảo mình luôn đúng. Nó chỉ giúp Hệ thống 2 có cơ hội bước vào căn phòng trước khi Hệ thống 1 chốt cửa.==",
    ],
  },
  {
    heading: "Đừng vội kể một nguyên nhân",
    paragraphs: [
      "Một nhân viên thường bán được hai hợp đồng mỗi tuần, nhưng tuần này bất ngờ bán được năm. Tuần sau, kết quả trở lại mức bình thường. Nếu chỉ nhìn hai tuần, mình rất dễ kể rằng người ấy sa sút vì được khen quá sớm.",
      "Thật ra, những kết quả đặc biệt tốt hoặc đặc biệt xấu thường có xu hướng trở lại gần mức bình thường hơn. Đây là **sự hồi quy về mức trung bình**.",
      "Điều này không có nghĩa mọi thay đổi đều do ngẫu nhiên. Nó chỉ nhắc mình đừng dựng quan hệ nhân quả từ quá ít dữ liệu.",
      "**TRƯỚC KHI KẾT LUẬN**",
      "- Mình đang nhìn một lần hay một chuỗi dài?",
      "- Kết quả này có bất thường so với mức thường ngày không?",
      "- Có nhóm hoặc thời điểm nào để so sánh không?",
      "- Lời giải thích của mình đã được kiểm tra hay chỉ nghe rất hợp lý?",
      "==Một câu chuyện hấp dẫn vẫn cần cơ hội được chứng minh.==",
    ],
  },
  {
    heading: "Câu chuyện quá tròn thường che phần còn thiếu",
    paragraphs: [
      "Tâm trí rất giỏi nối những gì đang có thành một câu chuyện mạch lạc. Một ứng viên nói chuyện thông minh, có hồ sơ đẹp và đến từ công ty nổi tiếng — thế là mình cảm thấy đã hiểu rõ năng lực của họ.",
      "Nhưng điều đang có mặt không phải toàn bộ sự thật. Có thể mình chưa xem sản phẩm thực tế, chưa kiểm tra cách họ xử lý sai sót hoặc chưa nghe nhận xét từ người từng làm việc cùng.",
      "Kahneman gọi xu hướng này là **WYSIATI**: tâm trí thường xây câu chuyện từ những gì đang hiện diện và ít chú ý đến phần vắng mặt.",
      "**BA Ô TRỐNG CẦN ĐIỀN**",
      "[[thinking-knowledge-gaps-table]]",
      "==Câu chuyện càng trơn tru, mình càng nên hỏi: *“Mảnh ghép nào chưa có mặt ở đây?”*==",
    ],
  },
  {
    heading: "Bộ não rất giỏi trả lời nhầm câu hỏi",
    paragraphs: [
      "Có những câu hỏi khó khiến tâm trí âm thầm đổi sang một câu dễ hơn rồi trả lời rất tự tin.",
      "[[thinking-question-substitution-table]]",
      "Cảm xúc vẫn là một phần quan trọng của quyết định. Nhưng trước việc lớn, mình nên viết lại câu hỏi gốc và xác định loại bằng chứng thật sự có thể trả lời nó.",
      "**CÂU NHẮC NHỎ**",
      "*“Mình đang trả lời câu hỏi được đặt ra, hay chỉ đang trả lời câu dễ nhất?”*",
    ],
  },
  {
    heading: "Kinh nghiệm lâu năm chưa chắc tạo ra trực giác đúng",
    paragraphs: [
      "Trực giác chuyên môn có thể rất giá trị khi một người làm việc trong môi trường có quy luật tương đối ổn định, gặp nhiều tình huống lặp lại và nhận phản hồi đủ nhanh để học từ đúng lẫn sai.",
      "Nhưng trong lĩnh vực quá nhiễu, kết quả đến quá muộn hoặc hiếm khi lặp lại, số năm kinh nghiệm có thể làm sự tự tin tăng nhanh hơn độ chính xác.",
      "**ĐÈN XANH CHO TRỰC GIÁC**",
      "- Các tình huống có thật sự tương đồng không?",
      "- Quy luật của môi trường có tương đối ổn định không?",
      "- Phản hồi có đến đủ nhanh và rõ không?",
      "- Người ra quyết định có theo dõi những lần mình sai không?",
      "==Nếu phần lớn câu trả lời là “không”, trực giác vẫn đáng lắng nghe — nhưng nên được xem như một giả thuyết cần kiểm tra, không phải phán quyết cuối cùng.==",
    ],
  },
  {
    heading: "Mình không nhìn được và mất bằng cùng một đôi mắt",
    paragraphs: [
      "Nhận thêm một triệu đồng và mất đi một triệu đồng không tạo ra hai cảm xúc đối xứng. Thông thường, mất mát để lại sức nặng lớn hơn một khoản được tương đương.",
      "Điều đó giải thích vì sao mình có thể từ chối một cơ hội hợp lý chỉ để giữ cảm giác an toàn, hoặc tiếp tục ôm một lựa chọn kém hiệu quả vì không muốn “chốt lỗ”.",
      "**BÀI KIỂM TRA HAI KHUNG**",
      "1. Nếu gọi đây là một khoản được, mình nhìn nó thế nào?",
      "2. Nếu gọi đây là một khoản mất, mình phản ứng ra sao?",
      "3. Xác suất thật sự của từng kết quả là bao nhiêu?",
      "4. Nếu chưa mắc kẹt trong quyết định cũ, hôm nay mình có chọn như vậy không?",
      "==Cảm xúc trước mất mát là thật. Nhưng cảm xúc mạnh không tự động biến lựa chọn giữ nguyên thành lựa chọn tốt nhất.==",
    ],
  },
  {
    heading: "Biết tên thiên kiến chưa đủ để tránh nó",
    paragraphs: [
      "Đọc về sai lầm tư duy có một cái bẫy khá tinh vi: mình bắt đầu nhìn thấy thiên kiến ở khắp mọi người, trừ chính mình.",
      "Biết thuật ngữ giúp mình gọi tên vấn đề, nhưng kiến thức đơn thuần không bảo đảm mình sẽ khách quan hơn. Thậm chí, mình có thể dùng chính những khái niệm ấy để bảo vệ kết luận mình đã thích sẵn.",
      "Thứ hữu ích hơn là tạo **lan can cho quyết định**:",
      "- Chọn tiêu chí trước khi xem phương án.",
      "- Tự ước lượng trước khi nghe con số của người khác.",
      "- Ghi dự đoán và lý do trước khi biết kết quả.",
      "- Nhờ người khác tìm bằng chứng phản bác.",
      "- Xem lại những lần mình sai, không chỉ những lần mình đúng.",
      "==Thiên kiến không chỉ là lỗi của một cá nhân. Nhiều khi, nó là dấu hiệu cho thấy quy trình đang đặt con người vào một tình huống quá dễ đoán sai.==",
    ],
  },
  {
    heading: "Khiêm tốn trước bất định không có nghĩa là đứng yên",
    paragraphs: [
      "Nếu chờ đủ mọi dữ liệu mới quyết định, có lẽ mình sẽ chẳng bắt đầu được gì. Trưởng thành không phải là loại bỏ hoàn toàn sai số; đó là biết quyết định nào có thể đi nhanh và quyết định nào xứng đáng được chậm lại.",
      "**MA TRẬN TỐC ĐỘ QUYẾT ĐỊNH**",
      "- Dễ quay lại, hậu quả thấp: quyết nhanh và học từ kết quả.",
      "- Dễ quay lại, hậu quả cao: thử ở quy mô nhỏ, giới hạn rủi ro.",
      "- Khó quay lại, hậu quả thấp: kiểm tra ngắn trước khi chốt.",
      "- Khó quay lại, hậu quả cao: dùng góc nhìn bên ngoài, xin ý kiến độc lập và dành thêm thời gian.",
      "==Mục tiêu không phải lúc nào cũng nghĩ thật chậm. Mục tiêu là dành sự chú ý cho đúng nơi.==",
      "[[thinking-decision-speed-matrix]]",
    ],
  },
  {
    heading: "Nghĩ cùng nhau: thêm quy trình, bớt tranh thắng",
    paragraphs: [
      "Trong một cuộc họp, ý kiến được nói đầu tiên dễ trở thành mỏ neo. Nếu người nói có vị trí cao, cả phòng càng dễ điều chỉnh suy nghĩ theo họ trước khi tự mình đánh giá vấn đề.",
      "Một nhóm tốt không cần mọi người suy nghĩ giống nhau. Nhóm cần một quy trình giúp những góc nhìn khác nhau được xuất hiện đủ sớm.",
      "**NGHI THỨC RA QUYẾT ĐỊNH NHÓM**",
      "1. Thống nhất tiêu chí trước khi xem các phương án.",
      "2. Mỗi người viết nhận định độc lập trước khi thảo luận.",
      "3. Chia sẻ các ước lượng cùng lúc để giảm hiệu ứng mỏ neo.",
      "4. Xem dữ liệu từ những trường hợp tương tự.",
      "5. Chỉ định một người tìm bằng chứng phản bác.",
      "6. Giả sử sáu tháng sau kế hoạch thất bại và hỏi: *“Điều gì có thể đã xảy ra?”*",
      "7. Ghi lại quyết định, lý do và thời điểm sẽ xem xét lại.",
      "Điều quan trọng nhất không phải là danh sách tên gọi của các thiên kiến. Đó là thái độ: **tự tin vừa đủ để quyết định, nhưng khiêm tốn đủ để cập nhật khi bằng chứng thay đổi.**",
      "**GHI CHÚ BIÊN TẬP VÀ ĐỐI CHIẾU**",
      "Các khái niệm cốt lõi trong 14 hồ sơ được diễn giải theo hướng phổ thông từ nội dung tác phẩm, đồng thời tham khảo phần giới thiệu chính thức của Penguin Random House, thông tin Nobel về công trình của Daniel Kahneman và các nghiên cứu nền tảng về hiệu ứng đóng khung, cái tôi trải nghiệm — cái tôi ghi nhớ, cùng điều kiện hình thành trực giác chuyên môn. Khi dùng cho một quyết định quan trọng, người đọc nên quay lại nguyên tác và nguồn nghiên cứu gốc.",
      "Các tình huống đời thường, câu hỏi thực hành và ma trận tốc độ quyết định là minh họa biên tập để giúp người đọc ứng dụng; chúng không phải trích dẫn nguyên văn, kết luận chẩn đoán hay lời khuyên chuyên môn.",
    ],
  },
];

// Vietnamese identity-and-systems guide. English reading mode continues to use
// the English key-point deck.
const ATOMIC_HABITS_PAGES: BookReadingPage[] = [
  {
    heading: "La bàn — mình muốn trở thành ai?",
    paragraphs: [
      "Khi muốn thay đổi, chúng ta thường bắt đầu bằng một kết quả: đọc 12 cuốn sách, giảm 5 kg, tiết kiệm nhiều tiền hơn hoặc làm việc hiệu quả hơn.",
      "Những mục tiêu này giúp mình biết nơi muốn đến, nhưng chưa chắc giúp mình duy trì hành động mỗi ngày. Khi sự hào hứng ban đầu qua đi, mình rất dễ quay lại nếp sống cũ.",
      "Trong *Atomic Habits*, James Clear gợi ý nhìn sự thay đổi qua ba tầng:",
      "- **Kết quả:** Mình muốn đạt được điều gì?",
      "- **Quy trình:** Mình sẽ làm gì đều đặn để tiến gần đến điều đó?",
      "- **Bản sắc:** Mình muốn trở thành người như thế nào?",
      "Tầng sâu nhất là ==bản sắc==. Thay vì chỉ đặt mục tiêu “đọc xong một cuốn sách”, mình có thể bắt đầu xây dựng hình ảnh của một người dành thời gian đọc và học hỏi mỗi ngày.",
      "Mỗi lần đọc vài trang là một bằng chứng nhỏ cho hướng mình đang đi. Một lần chưa thể thay đổi hoàn toàn con người mình, nhưng khi những hành động ấy được lặp lại, mình sẽ ngày càng tin rằng: ==“Đây là điều mình thường làm. Đây là kiểu người mình đang trở thành.”==",
      "==Bản sắc nên là chiếc la bàn, không phải chiếc nhãn để phán xét bản thân.== Nếu lỡ bỏ một ngày, điều đó không có nghĩa mình lười biếng hay thất bại. Mình chỉ cần nhìn lại cách đang làm và tìm một bước đủ nhỏ để quay lại.",
    ]
  },
  {
    heading: "Bản đồ ba tầng — nối mục tiêu với hôm nay",
    paragraphs: [
      "### 1. Kết quả — mình muốn đạt được điều gì?",
      "Kết quả là đích đến mình mong muốn: đọc 12 cuốn sách, chạy được 5 km hoặc tiết kiệm 30 triệu đồng.",
      "Đích đến rất cần thiết vì nó cho mình phương hướng. Nhưng nếu chỉ nhìn vào kết quả, mình có thể thấy mục tiêu quá xa và nhanh chóng mất kiên nhẫn.",
      "### 2. Quy trình — hôm nay mình sẽ làm gì?",
      "Quy trình là những hành động cụ thể được lặp lại mỗi ngày. Đây là nơi mục tiêu được biến thành một phần của cuộc sống.",
      "Ví dụ, thay vì chỉ nói “mình sẽ đọc sách nhiều hơn”, hãy thử:",
      "> Sau khi đánh răng buổi tối, mình sẽ ngồi vào chiếc ghế cạnh giường và đọc hai trang sách.",
      "Hành động này có thời điểm, địa điểm và điểm bắt đầu rõ ràng. Hai trang nghe có vẻ ít, nhưng ==nó giúp mình vượt qua phần khó nhất: bắt đầu.==",
      "### 3. Bản sắc — mình muốn trở thành ai?",
      "Bản sắc là cách mình nhìn nhận về chính mình.",
      "- Không chỉ “mình muốn đọc 12 cuốn sách”, mà là “mình muốn trở thành người duy trì việc đọc”.",
      "- Không chỉ “mình muốn giảm cân”, mà là “mình muốn trở thành người biết chăm sóc cơ thể”.",
      "- Không chỉ “mình muốn tiết kiệm”, mà là “mình muốn trở thành người sử dụng tiền có chủ đích”.",
      "Ba tầng đều cần thiết. ==Kết quả cho mình hướng đi, quy trình giúp mình hành động, còn bản sắc giúp mình duy trì hành động ấy lâu dài.==",
      "[[identity-change-diagram]]",
    ]
  },
  {
    heading: "Một ví dụ thực tế — tiết kiệm mà không chờ cuối tháng",
    paragraphs: [
      "Giả sử mình muốn tạo một khoản dự phòng nhưng tháng nào cũng định chờ đến cuối tháng mới chuyển phần tiền còn lại. Kết quả là ý định tốt phải cạnh tranh với hàng chục khoản chi nhỏ đã xảy ra trước đó.",
      "**Nếu chỉ tập trung vào kết quả:**",
      "> Năm nay mình phải tiết kiệm được một khoản thật lớn.",
      "Đích đến giúp mình biết điều quan trọng, nhưng con số lớn dễ tạo cảm giác xa và khiến một tháng chưa đạt kế hoạch trông giống thất bại.",
      "**Nếu chuyển sang hệ thống:**",
      "> Sau ngày nhận thu nhập, mình sẽ chuyển tự động một khoản phù hợp sang tài khoản riêng, rồi xem lại mức đó mỗi tháng.",
      "Hệ thống giảm số lần mình phải nhớ và quyết định lại. Số tiền cần phù hợp với chi phí thiết yếu; mục tiêu là tạo nhịp bền, không ép hiện tại thiếu an toàn để có một bảng theo dõi đẹp.",
      "**Nếu kết nối với bản sắc:**",
      "> Mình đang tập trở thành người sử dụng tiền có chủ đích.",
      "Mỗi lần thực hiện đúng kế hoạch là một bằng chứng nhỏ cho hướng ấy. Nếu hoàn cảnh thay đổi, mình có thể điều chỉnh số tiền mà không biến việc điều chỉnh thành phán quyết về giá trị bản thân.",
      "### Thử áp dụng ngay",
      "Hãy chọn một điều mình muốn thay đổi và điền vào ba dòng sau:",
      "- **Kết quả mình muốn:** ................................................",
      "- **Bản sắc mình muốn xây:** ................................................",
      "- **Hành động nhỏ mình có thể làm ngay hôm nay:** ................................................",
      "Đừng cố chứng minh rằng mình đã trở thành một con người hoàn toàn mới. ==Hãy bắt đầu bằng một hành động nhỏ mà con người ấy sẽ làm hôm nay.==",
    ]
  },
  {
    heading: "Một thói quen bắt đầu như thế nào?",
    paragraphs: [
      "Bạn vừa ngồi xuống làm việc thì điện thoại sáng màn hình. Chưa kịp suy nghĩ, tay bạn đã mở thông báo. Từ một tin nhắn, bạn xem thêm vài video và đến khi ngẩng lên thì mười phút đã trôi qua.",
      "Điều này không hẳn xảy ra vì bạn thiếu quyết tâm. Não chỉ đang đi theo ==một vòng lặp quen thuộc gồm bốn bước:==",
      "**1. Tín hiệu — điều khiến mình chú ý**",
      "Đó có thể là tiếng chuông điện thoại, quyển sách đặt trên bàn hoặc cảm giác mệt mỏi sau một ngày dài.",
      "**2. Mong muốn — cảm giác mình đang tìm kiếm**",
      "Mình không thật sự muốn “lướt điện thoại”. Điều mình muốn có thể là cảm giác được giải trí, bớt buồn chán hoặc tạm quên áp lực.",
      "**3. Hành động — việc mình thực sự làm**",
      "Mình mở điện thoại, ăn một món gì đó, đọc sách hoặc mang giày ra ngoài đi bộ.",
      "**4. Phần thưởng — điều mình nhận lại ngay sau đó**",
      "Đó có thể là cảm giác vui, nhẹ nhõm, thỏa mãn hoặc đơn giản là hết tò mò.",
      "==Khi một hành động mang lại cảm giác dễ chịu, não sẽ ghi nhớ và có xu hướng lặp lại nó khi tín hiệu cũ xuất hiện.==",
      "[[habit-loop-diagram]]",
    ]
  },
  {
    heading: "Nhìn một thói quen từ đầu đến cuối",
    paragraphs: [
      "Hãy thử nhìn thói quen kiểm tra điện thoại:",
      "- **Tín hiệu:** Điện thoại sáng màn hình.",
      "- **Mong muốn:** Mình muốn biết có chuyện gì mới.",
      "- **Hành động:** Mình cầm điện thoại và mở thông báo.",
      "- **Phần thưởng:** Sự tò mò được giải tỏa.",
      "Nếu vòng lặp này diễn ra đủ nhiều lần, chỉ cần nhìn thấy điện thoại là mình đã muốn cầm lên, ngay cả khi không có thông báo nào.",
      "Một thói quen tốt cũng hình thành theo cách tương tự:",
      "- **Tín hiệu:** Quyển sách được đặt trên gối.",
      "- **Mong muốn:** Mình muốn thư giãn trước khi ngủ.",
      "- **Hành động:** Mình đọc hai trang.",
      "- **Phần thưởng:** Mình thấy nhẹ nhàng và vui vì đã giữ lời với bản thân.",
      "Từ vòng lặp này, James Clear xây dựng **Bốn nguyên tắc thay đổi hành vi** để thiết kế một thói quen tốt:",
      "- Làm cho nó **dễ nhìn thấy**.",
      "- Làm cho nó **trở nên hấp dẫn**.",
      "- Làm cho nó **dễ bắt đầu**.",
      "- Làm cho nó **mang lại cảm giác dễ chịu**.",
      "Bốn nguyên tắc sẽ rõ hơn khi cùng được đặt vào một tình huống đời thường:",
      "[[four-laws-practice-board]]",
      "Ở bước **hấp dẫn**, mình có thể chỉ nghe chương trình yêu thích trong lúc đi bộ. Ở bước **dễ chịu**, một dấu hoàn thành, một tách trà sau khi đọc hoặc tin nhắn “đã xong” cho người đồng hành tạo phản hồi ngay mà không phá ngược mục tiêu.",
      "Muốn hạn chế một thói quen xấu, mình có thể đảo chiều cả bốn đòn bẩy: làm tín hiệu khó thấy, hành vi kém hấp dẫn, tăng ma sát khi thực hiện và khiến hệ quả trở nên rõ ràng hơn. Ví dụ, để điện thoại ngoài phòng, đăng xuất khỏi ứng dụng và xem lại thời gian sử dụng thật vào cuối ngày.",
      "==Khung này không dùng để trách bản thân.== Nó giúp mình đặt một câu hỏi hữu ích hơn:",
      "> Thói quen này đang bắt đầu từ đâu, và mình có thể thay đổi điều gì trong vòng lặp?",
    ]
  },
  {
    heading: "Thiết kế môi trường — để lựa chọn tốt trở nên dễ hơn",
    paragraphs: [
      "Chúng ta thường nghĩ mình cần quyết tâm mạnh hơn. Nhưng nhiều khi, điều mình cần chỉ là sắp xếp lại không gian xung quanh.",
      "Muốn đọc sách nhưng sách nằm sâu trong tủ, còn điện thoại luôn ở cạnh tay, mình sẽ dễ chọn điện thoại hơn. Không phải vì mình không thích đọc, mà vì điện thoại đang là lựa chọn thuận tiện nhất.",
      "Hãy để môi trường nhắc mình làm điều tốt:",
      "- **Muốn đọc sách:** Đặt sách trên gối hoặc cạnh tách cà phê.",
      "- **Muốn uống nhiều nước:** Chuẩn bị sẵn một chai nước trên bàn.",
      "- **Muốn tập thể dục:** Để quần áo và giày tập ở nơi dễ nhìn thấy.",
      "- **Muốn ăn lành mạnh:** Rửa sẵn trái cây và đặt ở phía trước tủ lạnh.",
      "- **Muốn dùng điện thoại ít hơn:** Tắt thông báo và sạc điện thoại ngoài phòng ngủ.",
      "- **Muốn tiết kiệm:** Cài chuyển tiền tự động ngay sau ngày nhận lương.",
      "==Một cách sắp xếp tốt không thể khiến mọi ngày đều hoàn hảo. Nhưng nó giúp mình bớt phải đấu tranh với chính mình mỗi lần cần lựa chọn.==",
      "Hãy nhìn quanh căn phòng và tự hỏi:",
      "> Việc gì đang quá dễ thực hiện? Việc gì mình muốn làm nhưng lại đang quá bất tiện?",
      "==Đôi khi, thay đổi vị trí của một món đồ cũng có thể thay đổi cách một ngày diễn ra.==",
    ]
  },
  {
    heading: "Bắt đầu trong hai phút",
    paragraphs: [
      "Một thói quen thường thất bại vì bước đầu tiên quá lớn.",
      "“Mỗi ngày đọc 30 phút” nghe có vẻ đơn giản, nhưng vào một ngày mệt mỏi, 30 phút lại trở thành lý do để mình trì hoãn.",
      "Quy tắc hai phút gợi ý thu nhỏ thói quen đến mức mình có thể bắt đầu gần như ngay lập tức:",
      "- “Đọc sách mỗi tối” trở thành **đọc một trang**.",
      "- “Chạy bộ mỗi sáng” trở thành **mang giày và bước ra ngoài**.",
      "- “Viết nhật ký” trở thành **viết một câu**.",
      "- “Dọn phòng” trở thành **cất một món đồ về đúng chỗ**.",
      "- “Học tiếng Anh” trở thành **ôn một từ mới**.",
      "==Mục tiêu ban đầu không phải là làm thật nhiều. Mục tiêu là tập cho mình xuất hiện và bắt đầu đều đặn.== Khi việc bắt đầu đã tự nhiên hơn, mình có thể tăng dần thời gian và mức độ.",
      "### Cho hành động dài hạn một phản hồi ngay",
      "Kết quả của việc đọc, vận động hay tiết kiệm thường đến chậm. Vì vậy, sau khi hoàn thành phiên bản hai phút, hãy tạo một tín hiệu nhỏ cho thấy mình vừa tiến thêm một bước:",
      "- Đọc một trang → đánh dấu vào lịch.",
      "- Đi bộ năm phút → ghi một từ mô tả mức năng lượng.",
      "- Chuyển tiền tiết kiệm → tô thêm một ô trên thanh tiến độ.",
      "Phản hồi nên củng cố hành vi, không phá ngược mục tiêu. Đừng dùng mua sắm bốc đồng để thưởng cho việc tiết kiệm hoặc dùng xấu hổ để ép mình tiếp tục.",
      "### Thử thiết kế một thói quen",
      "- **Thói quen mình muốn xây dựng:** ........................................",
      "- **Tín hiệu nhắc mình bắt đầu:** ........................................",
      "- **Phiên bản có thể làm trong hai phút:** ........................................",
      "- **Điều mình sẽ chuẩn bị từ trước:** ........................................",
      "- **Cách mình ghi nhận sau khi hoàn thành:** ........................................",
    ]
  },
  {
    heading: "Thử nghiệm bảy ngày — đừng hứa cả đời, chỉ cần thử một tuần",
    paragraphs: [
      "“Duy trì thói quen này mãi mãi” nghe khá áp lực. Nhưng thử trong bảy ngày thì nhẹ nhàng hơn nhiều.",
      "Bảy ngày chưa đủ để thay đổi hoàn toàn một con người, nhưng đủ để mình nhận ra: thời điểm nào dễ thực hiện, điều gì hay cản trở và cách sắp xếp nào phù hợp với cuộc sống của mình.",
      "### Bước 1: Chọn một hướng mình muốn đi",
      "Đừng bắt đầu bằng quá nhiều thói quen. Hãy chọn một điều đang thật sự có ý nghĩa với mình.",
      "Ví dụ:",
      "> Mình muốn trở thành người dành thời gian đọc và học hỏi mỗi ngày.",
      "### Bước 2: Thu nhỏ hành động",
      "Hành động nên đơn giản đến mức mình vẫn có thể làm vào một ngày bận rộn.",
      "> Sau khi đánh răng buổi tối, mình sẽ đọc hai trang sách.",
      "### Bước 3: Chuẩn bị từ trước",
      "Đặt sách trên gối, để điện thoại ngoài tầm tay và đánh dấu trang cần đọc. Khi đến giờ, mình không cần tìm sách hay quyết định đọc gì nữa.",
      "### Bước 4: Ghi lại thật nhanh",
      "Sau khi đọc xong, chỉ cần đánh một dấu ✓ vào lịch. Nếu gặp trở ngại, ghi thêm một câu ngắn.",
      "==Mục tiêu của bảy ngày không phải tạo ra một chuỗi hoàn hảo. Mục tiêu là tìm được cách thực hiện đủ rõ ràng, đủ nhẹ nhàng và phù hợp để mình muốn tiếp tục.==",
    ]
  },
  {
    heading: "Một tuần thực tế sẽ trông như thế nào?",
    paragraphs: [
      "Hãy thử nhìn vào một tuần xây dựng thói quen đọc sách:",
      "[[seven-day-reading-table]]",
      "**Ký hiệu:**",
      "- **✓** Hoàn thành thói quen.",
      "- **•** Thực hiện phiên bản nhỏ nhất.",
      "- **—** Bỏ lỡ và ghi lại lý do.",
      "==Ngày thứ tư không làm hỏng cả thử nghiệm.== Ngược lại, nó giúp mình phát hiện một điều quan trọng: khi quyển sách không xuất hiện trước mắt, mình rất dễ quên.",
      "Vì vậy, thay vì trách bản thân thiếu kỷ luật, mình thay đổi cách sắp xếp: đặt sách lên gối từ buổi sáng. Một điều chỉnh nhỏ đã giúp việc đọc dễ quay lại hơn vào ngày hôm sau.",
      "==Đó mới là giá trị của thử nghiệm: không phải chứng minh mình hoàn hảo, mà là hiểu cách nào thật sự phù hợp với mình.==",
    ]
  },
  {
    heading: "Theo dõi để học, không phải để chấm điểm bản thân",
    paragraphs: [
      "Kết quả lớn thường xuất hiện khá chậm. Mình có thể đi bộ nhiều tuần mà cân nặng chưa thay đổi, đọc mỗi tối nhưng chưa cảm thấy mình hiểu biết hơn, hoặc tiết kiệm từng khoản nhỏ mà số tiền vẫn còn xa mục tiêu.",
      "Trong lúc chờ kết quả, một dấu ✓ nhắc mình rằng: hôm nay mình đã xuất hiện.",
      "==Tuy nhiên, bảng theo dõi nên giống một tấm bản đồ, không phải một phiên tòa.== Nó cho mình biết điều gì đang diễn ra để có thể điều chỉnh, chứ không quyết định mình là người thành công hay thất bại.",
      "### Hãy theo dõi điều mình có thể làm hôm nay",
      "- Muốn khỏe hơn → theo dõi **số buổi đi bộ sau bữa tối**.",
      "- Muốn đọc nhiều hơn → theo dõi **số ngày mình mở sách**.",
      "- Muốn học tốt hơn → theo dõi **số lần ngồi vào bàn học đúng giờ**.",
      "- Muốn ngủ sớm → theo dõi **số tối để điện thoại ngoài phòng**.",
      "- Muốn tiết kiệm → theo dõi **số lần chuyển tiền vào khoản tiết kiệm**.",
      "Cân nặng, điểm số hay số tiền trong tài khoản đều quan trọng, nhưng chúng thay đổi chậm và còn chịu ảnh hưởng bởi nhiều yếu tố. ==Hành động hằng ngày mới là phần mình có thể chủ động.==",
      "### Giữ việc theo dõi thật nhẹ",
      "- Chỉ theo dõi từ **một đến ba thói quen quan trọng**.",
      "- Đánh dấu ngay sau khi hoàn thành.",
      "- Việc ghi chép chỉ nên mất vài giây.",
      "- Nếu bảng theo dõi khiến mình mệt hơn cả thói quen, hãy làm nó đơn giản lại.",
      "Một tờ lịch và cây bút đôi khi đã đủ. Mình không cần một hệ thống thật đẹp mới có thể bắt đầu.",
    ]
  },
  {
    heading: "Nhìn lại để đi tiếp",
    paragraphs: [
      "Sau bảy ngày, đừng chỉ đếm xem mình có bao nhiêu dấu ✓. Hãy dành vài phút trả lời ba câu hỏi:",
      "### 1. Điều gì đã giúp mình bắt đầu dễ dàng?",
      "Có thể là quyển sách được đặt trên gối, đôi giày để sẵn cạnh cửa hoặc chai nước có màu nổi bật nằm ngay trên bàn.",
      "### 2. Điều gì thường khiến mình bỏ lỡ?",
      "Có thể hành động đang quá lớn, thời điểm chưa phù hợp hoặc tín hiệu chưa đủ rõ ràng.",
      "### 3. Mình sẽ thay đổi một điều gì trong tuần tới?",
      "Chỉ chọn một điều chỉnh nhỏ:",
      "- Chuyển thời gian đọc từ buổi tối sang sau bữa sáng.",
      "- Giảm mười phút tập luyện xuống còn năm phút.",
      "- Để điện thoại xa bàn làm việc.",
      "- Chuẩn bị quần áo tập từ tối hôm trước.",
      "- Đặt chai nước ở nơi mình chắc chắn sẽ nhìn thấy.",
      "==Đừng thay đổi cả hệ thống cùng lúc.== Nếu sửa quá nhiều thứ, mình sẽ không biết điều gì thật sự mang lại hiệu quả.",
      "### Phiếu thử nghiệm tuần tới",
      "- **Thói quen mình muốn duy trì:** ........................................",
      "- **Tín hiệu bắt đầu:** ........................................",
      "- **Phiên bản nhỏ nhất:** ........................................",
      "- **Điều mình sẽ chuẩn bị trước:** ........................................",
      "- **Cách mình đánh dấu:** ........................................",
      "- **Một trở ngại mình dự đoán:** ........................................",
      "- **Cách mình sẽ xử lý:** ........................................",
      "==Hãy nhớ: bảng theo dõi không phải thứ mình cần sống để làm cho đẹp. Nó chỉ là công cụ giúp mình hiểu bản thân, điều chỉnh cách làm và quay lại nhanh hơn khi lỡ nhịp.==",
      "[[review-loop-diagram]]",
    ]
  },
  {
    heading: "Khoảng lặng — tiến bộ không phải lúc nào cũng nhìn thấy",
    paragraphs: [
      "Bạn đã đi bộ mười ngày nhưng cơ thể vẫn chưa khác. Bạn học tiếng Anh mỗi tối nhưng vẫn nói vấp. Bạn tiết kiệm từng khoản nhỏ mà số tiền trong tài khoản vẫn còn xa mục tiêu.",
      "Đây là lúc nhiều người bắt đầu nghĩ: *Có lẽ cách này không hiệu quả.*",
      "Nhưng kết quả thường xuất hiện chậm hơn hành động. Trong khoảng thời gian chưa nhìn thấy thay đổi lớn, những điều nhỏ hơn vẫn đang diễn ra: mình bắt đầu nhanh hơn, bớt phải đấu tranh với bản thân và biết cách xử lý những ngày thiếu năng lượng.",
      "Hãy để ý những tín hiệu gần hơn:",
      "- Mình có bắt đầu dễ hơn tuần trước không?",
      "- Khi bận, mình có nhớ làm phiên bản nhỏ nhất không?",
      "- Sau một ngày bỏ lỡ, mình có quay lại nhanh hơn không?",
      "- Mình đã nhận ra điều gì thường khiến mình chệch nhịp?",
      "==Đó chưa phải đích đến, nhưng là dấu hiệu cho thấy cách làm đang dần bén rễ.==",
      "Kiên nhẫn không có nghĩa là ngồi yên và hy vọng. Mình vẫn cần nhìn lại cách làm, xin phản hồi và điều chỉnh khi cần. Chỉ là mình không vội kết luận bản thân thất bại khi phần thưởng chưa kịp xuất hiện.",
      "> Khi kết quả còn im lặng, hãy nhìn xem hệ thống của mình có đang tốt lên không.",
      "[[silent-progress-diagram]]",
    ]
  },
  {
    heading: "Đừng bắt trí nhớ phải nhắc mình mọi thứ",
    paragraphs: [
      "“Mình sẽ đọc nhiều hơn”, “mai mình sẽ tập” hay “từ tuần sau mình sẽ uống đủ nước” đều là những ý định tốt. Vấn đề là khi ngày mới bắt đầu, chúng phải cạnh tranh với hàng chục việc đã quen thuộc.",
      "Thay vì chờ trí nhớ lên tiếng đúng lúc, hãy cho thói quen một điểm hẹn rõ ràng. Có hai công thức khác nhau và có thể dùng cùng nhau:",
      "- **Ý định thực hiện:** Vào **[thời gian]**, tại **[địa điểm]**, mình sẽ **[hành động nhỏ]**.",
      "- **Xếp chồng thói quen:** Sau khi **[thói quen hiện tại]**, mình sẽ **[thói quen mới]**.",
      "Ví dụ:",
      "- Sau khi đánh răng buổi tối, mình sẽ đọc hai trang trên giường.",
      "- Sau khi đặt cốc cà phê xuống, mình sẽ viết ba việc quan trọng trong ngày.",
      "- Sau khi ăn tối, mình sẽ mang giày và đi bộ quanh nhà năm phút.",
      "- Sau khi ngồi vào bàn làm việc, mình sẽ để điện thoại vào ngăn kéo.",
      "Môi trường cũng có thể nhắc mình thay cho trí nhớ:",
      "- Đặt chai nước ngay cạnh máy tính.",
      "- Để sách trên gối.",
      "- Chuẩn bị quần áo tập từ tối hôm trước.",
      "- Để sổ chi tiêu cạnh chiếc ví mình vẫn mang theo.",
      "==Một lời nhắc tốt không cần ồn ào. Nó chỉ cần xuất hiện đúng nơi, đúng lúc.==",
      "### Viết điểm hẹn cho thói quen của bạn",
      "> Vào ........................, tại ........................, mình sẽ ........................",
      "> Sau khi ........................, mình sẽ ........................",
      "Câu càng cụ thể, khoảnh khắc bắt đầu càng ít mơ hồ.",
    ]
  },
  {
    heading: "Mình không thèm hành vi, mình thèm cảm giác phía sau nó",
    paragraphs: [
      "Có lúc mình mở điện thoại không phải vì thật sự muốn xem thêm một video. Mình chỉ đang mệt, chán hoặc muốn trì hoãn một việc khó.",
      "==Hành vi giống như cánh cửa. Cảm giác phía sau mới là nơi mình muốn đến.==",
      "- Lướt mạng có thể là cách tìm sự giải trí.",
      "- Ăn vặt có thể là cách tìm cảm giác dễ chịu.",
      "- Mua sắm có thể mang lại chút hào hứng.",
      "- Trì hoãn có thể giúp mình tạm tránh cảm giác khó khăn.",
      "- Kiểm tra tin nhắn liên tục có thể xuất phát từ mong muốn được kết nối.",
      "Nếu chỉ giật điện thoại khỏi tay mà không tìm một cách nghỉ ngơi khác, khoảng trống vẫn còn đó. Sớm hay muộn, thói quen cũ rất dễ quay lại.",
      "Trước khi hành động theo quán tính, hãy dừng lại vài giây và hỏi:",
      "> Lúc này mình đang muốn cảm thấy điều gì?",
      "Nếu cần nghỉ, mình có thể đứng dậy đi lại hoặc nhắm mắt một phút. Nếu thấy cô đơn, mình có thể nhắn cho một người bạn. Nếu đang né một việc khó, mình có thể thu nhỏ nó thành bước đầu tiên kéo dài hai phút.",
      "==Không phải lần nào mình cũng chọn được cách tốt hơn. Nhưng chỉ cần nhận ra nhu cầu phía sau, mình đã có thêm một lựa chọn.==",
    ]
  },
  {
    heading: "Chuẩn bị rất nhiều vẫn có thể là một cách chưa bắt đầu",
    paragraphs: [
      "Có những buổi mình dành gần một giờ để chọn ứng dụng ghi chú, sắp xếp bàn làm việc và xem video hướng dẫn. Mọi thứ trông rất có ích, nhưng đến cuối buổi mình vẫn chưa viết được câu nào.",
      "Chuẩn bị tạo cảm giác an toàn vì mình đang bận mà chưa phải đối diện với khả năng làm chưa tốt. Nó cần thiết, nhưng cũng có thể trở thành một kiểu trì hoãn khó nhận ra.",
      "Hãy phân biệt:",
      "[[preparation-action-table]]",
      "Một cách đơn giản để thoát khỏi vòng chuẩn bị:",
      "> Sau mười phút chuẩn bị, hãy làm ít nhất hai phút của việc thật.",
      "==Chuẩn bị tốt là khi nó làm bước tiếp theo dễ hơn.== Nếu mình cứ chỉnh sửa hệ thống nhưng vẫn chưa hành động, đã đến lúc dừng sắp xếp và bắt đầu bằng một phiên bản chưa hoàn hảo.",
      "Với thói quen xấu, mình có thể làm ngược lại: đăng xuất khỏi ứng dụng, để đồ ăn vặt ở nơi khó lấy hoặc cất điều khiển tivi xa ghế ngồi. Chỉ một bước bất tiện cũng đủ tạo ra khoảng dừng để mình lựa chọn lại.",
    ]
  },
  {
    heading: "Đường dài cần nhiều hơn cảm hứng",
    paragraphs: [
      "Cảm hứng thường rất mạnh vào ngày đầu và nhỏ dần theo thời gian. Vì vậy, một thói quen bền không thể phụ thuộc vào việc ngày nào mình cũng thấy hào hứng.",
      "Thử thách quá dễ khiến mình chán. Quá khó khiến mình muốn tránh. Mức phù hợp thường nằm ở giữa: đủ quen để mình có thể bắt đầu, nhưng vẫn có một chút thử thách để thấy mình đang tiến lên.",
      "Ví dụ với thói quen đọc:",
      "- Nếu hai trang vẫn còn khó, hãy bắt đầu bằng một trang.",
      "- Nếu hai trang đã quá dễ trong nhiều tuần, có thể tăng lên năm trang.",
      "- Nếu cuốn sách khiến mình chán đến mức liên tục né tránh, mình được phép chọn một cuốn khác.",
      "==Duy trì không có nghĩa là giữ nguyên mọi thứ mãi mãi.== Thói quen cũng cần được điều chỉnh theo khả năng và hoàn cảnh hiện tại.",
      "Một vài lý do nhỏ giúp mình muốn quay lại:",
      "- Nhìn thấy tiến bộ trên lịch.",
      "- Chọn hoạt động mình thật sự thích.",
      "- Làm cùng một người bạn.",
      "- Ghi nhận cảm giác dễ chịu sau khi hoàn thành.",
      "- Nhớ lại vì sao điều này quan trọng với mình.",
      "Thỉnh thoảng, hãy tự hỏi:",
      "> Thói quen này vẫn đang đưa mình đến cuộc sống mình muốn chứ?",
      "==Nếu câu trả lời là không, thay đổi hoặc dừng lại cũng có thể là một quyết định đúng.==",
    ]
  },
  {
    heading: "Bản sắc có thể nâng mình lên, cũng có thể giữ mình lại",
    paragraphs: [
      "“Mình là người kỷ luật” có thể giúp mình giữ lời với bản thân. Nhưng nếu biến câu nói ấy thành một chiếc huy hiệu phải bảo vệ, chỉ một ngày bỏ lỡ cũng khiến mình cảm thấy toàn bộ con người đã bị phủ nhận.",
      "Những chiếc nhãn tiêu cực cũng dễ trở thành chiếc lồng:",
      "- “Mình vốn lười.”",
      "- “Mình không có năng khiếu viết.”",
      "- “Mình dở toán.”",
      "- “Mình không phải người thích vận động.”",
      "==Một trải nghiệm cũ không nhất thiết phải trở thành kết luận cho cả tương lai.==",
      "Thay vì nói “mình là người luôn giữ kỷ luật”, hãy thử:",
      "> Mình đang tập cách giữ những lời hứa nhỏ với bản thân.",
      "Thay vì “mình không thể viết”, hãy thử:",
      "> Mình chưa viết thường xuyên và vẫn đang học cách diễn đạt.",
      "Bản sắc tốt nên cho mình một hướng đi, không biến mỗi hành động thành một phiên tòa. Mình có thể yêu việc viết nhưng vẫn có ngày không viết nổi. Mình có thể quan tâm sức khỏe nhưng vẫn cần nghỉ khi cơ thể mệt.",
      "Một cách nhìn nhẹ nhàng hơn là:",
      "> Đây là kiểu người mình đang tập trở thành.",
      "Chữ **đang tập** chừa chỗ cho sai, cho đổi và cho những phần của bản thân mình chưa kịp hiểu hết.",
    ]
  },
  {
    heading: "Không phải thói quen nào đổ vỡ cũng là lỗi của một cá nhân",
    paragraphs: [
      "Môi trường không chỉ là chiếc bàn, căn phòng hay vị trí của điện thoại. Nó còn là giờ làm việc, tiền bạc, sức khỏe, trách nhiệm chăm sóc gia đình và sự hỗ trợ mình đang có.",
      "Có người không duy trì được thói quen vì thiếu quyết tâm. Nhưng cũng có người đang sống trong một lịch trình lấy gần hết năng lượng chỉ để hoàn thành những việc thiết yếu.",
      "Trong hoàn cảnh đó, lời khuyên “hãy cố thêm một chút” có thể đúng nhưng chưa đủ.",
      "==Hãy chuẩn bị ba phiên bản cho cùng một thói quen:==",
      "**Ngày nhiều năng lượng**",
      "- Tập đủ 30 phút.",
      "- Viết một trang.",
      "- Nấu một bữa đầy đủ.",
      "**Ngày năng lượng vừa phải**",
      "- Đi bộ năm phút.",
      "- Viết ba câu.",
      "- Chuẩn bị một món đơn giản.",
      "**Ngày quá tải**",
      "- Duỗi người một phút hoặc nghỉ ngơi.",
      "- Ghi lại một ý để quay lại sau.",
      "- Ăn thứ có sẵn và xin hỗ trợ nếu cần.",
      "Phiên bản nhỏ không thay thế hoàn toàn mục tiêu chính. Nó giúp mình giữ một cánh cửa để quay lại mà không phải bắt đầu từ con số không.",
      "==Và có những ngày, tiến bộ không phải làm thêm. Tiến bộ là nhận ra mình cần nghỉ, cần thay đổi kỳ vọng hoặc cần được giúp đỡ.==",
      "[[energy-levels-diagram]]",
    ]
  },
  {
    heading: "Quay lại — kỹ năng quan trọng hơn một chuỗi hoàn hảo",
    paragraphs: [
      "Một ngày bỏ lỡ thường ít nguy hiểm hơn câu chuyện mình kể sau đó:",
      "> Mình lại thất bại rồi. Thôi để tuần sau bắt đầu lại.",
      "Mình không cần chờ thứ Hai, đầu tháng hay một phiên bản có động lực hơn của chính mình. Cơ hội gần nhất đã đủ để quay lại.",
      "### Cách quay lại sau một lần lỡ nhịp",
      "**1. Dừng câu chuyện tự trách**",
      "Gọi đúng điều đã xảy ra: *Hôm nay mình bỏ lỡ một lần.* Đừng biến một sự kiện thành kết luận về con người mình.",
      "**2. Làm phiên bản nhỏ nhất ở cơ hội tiếp theo**",
      "Không tập đủ buổi thì đi bộ năm phút. Không viết được một trang thì ghi ba câu. Không đọc được một chương thì mở sách và đọc một đoạn.",
      "**3. Gỡ một trở ngại**",
      "Đặt lại sách lên gối, chuẩn bị giày từ tối hôm trước hoặc chuyển thời gian thực hiện sang lúc phù hợp hơn.",
      "**4. Đừng trừng phạt bản thân bằng cách làm gấp đôi**",
      "Quay lại nhịp bình thường thường hữu ích hơn cố bù thật nhiều rồi kiệt sức.",
      "**5. Ghi nhận lần quay lại**",
      "Dấu quan trọng nhất trên bảng theo dõi đôi khi không phải chuỗi dài nhất, mà là dấu xuất hiện ngay sau một khoảng trống.",
      "==Thói quen bền không được chứng minh bằng việc chưa từng gián đoạn. Nó được chứng minh bằng số lần mình biết đường trở về mà không dùng sự xấu hổ làm nhiên liệu.==",
      "### Ghi chú biên tập",
      "Khung mục tiêu–hệ thống–bản sắc, vòng lặp tín hiệu–mong muốn–hành động–phần thưởng và bốn nguyên tắc thay đổi hành vi được đối chiếu với [phần tóm tắt chính thức của James Clear](https://jamesclear.com/atomic-habits-summary). Các tình huống đời thường, bảng thử nghiệm bảy ngày và ba mức năng lượng là phần biên tập để người đọc dễ áp dụng; chúng không phải lời hứa rằng một công thức sẽ phù hợp với mọi hoàn cảnh.",
    ]
  }
];

const MASTER_COLLECTION_ORDER = [
  "atomic-habits",
  "dac-nhan-tam",
  "thinking-fast-and-slow",
  "48-laws-of-power",
  "silence-of-the-lambs",
  "goodbye-things",
  "muon-kiep-nhan-sinh-1",
  "muon-kiep-nhan-sinh-2",
  "muon-kiep-nhan-sinh-3",
] as const;

const MASTER_COLLECTION_INDEX = new Map<string, number>(
  MASTER_COLLECTION_ORDER.map((slug, index) => [slug, index]),
);

export const LIBRARY_BOOKS: LibraryBook[] = ([
  {
    slug: "dac-nhan-tam",
    title: "Đắc Nhân Tâm",
    titleEn: "How to Win Friends and Influence People",
    author: "Dale Carnegie",
    cover: "/books/rendered/dac-nhan-tam.webp",
    coverAspect: 1352 / 2004,
    coverBack: "/books/dac-nhan-tam-back.webp",
    blogSlug: "dac-nhan-tam-review",
    hue: 222, // navy spine to match the VN First News cover
    saturation: 40,
    lightness: 20,
    foil: "#C9A24B",
    scale: 1.06,
    readingDensity: "compact",
    readingTheme: "conversation-atelier",
    outsideSummary: {
      vi: {
        tagline: "Người khác hiếm khi mở lòng vì mình nói hay; họ mở lòng khi cảm thấy được lắng nghe, tôn trọng và vẫn có quyền giữ tiếng nói riêng.",
        heading: "Nghệ thuật tạo ảnh hưởng mà không làm ai nhỏ đi",
        introduction: [
          "*Đắc Nhân Tâm* không dạy mình cách nói khéo để chiến thắng người khác. Cuốn sách bắt đầu từ một nhu cầu rất người: ai cũng muốn được lắng nghe, được giữ thể diện và được nhìn nhận như một người có ý nghĩa.",
          "Giá trị bền vững của sách không nằm ở vài mẹo tạo thiện cảm. Nó nằm ở cách mình góp ý mà không phủ định con người, thuyết phục mà không lấy mất quyền lựa chọn, đồng thời nhận ra lúc sự khéo léo đang trượt thành lấy lòng hoặc thao túng.",
        ],
        lessonsHeading: "Năm điều có thể mang vào một cuộc trò chuyện thật",
        numbered: true,
        lessons: [
          {
            heading: "Giao tiếp mà không tạo phòng vệ",
            paragraph: "Khi một phần việc đến trễ, câu “Bạn lúc nào cũng thiếu trách nhiệm” dễ đẩy người nghe vào thế tự vệ. Mình có thể nói điều quan sát được, ảnh hưởng đang xảy ra và hỏi trở ngại nằm ở đâu. Vấn đề vẫn rõ, nhưng người kia còn đường để sửa.",
          },
          {
            heading: "Tạo thiện cảm bằng sự chú ý thật",
            paragraph: "Thay vì vội khuyên khi một người bạn muốn nghỉ việc, hãy hỏi: “Điều gì đang làm bạn kiệt sức nhất?”. Lắng nghe không buộc mình đồng ý; nó giúp mình hiểu đủ trước khi phản hồi và cho người kia cảm giác họ không bị xem như một vấn đề.",
          },
          {
            heading: "Thuyết phục bằng hợp tác",
            paragraph: "Một quy trình mới dù hợp lý vẫn dễ bị phản đối nếu chỉ được đưa xuống như mệnh lệnh. Hãy thống nhất mục tiêu, hỏi nơi đang vướng và thử ở quy mô nhỏ. Khi người bị ảnh hưởng được tham gia, sự hợp tác bền hơn một cái gật đầu vì áp lực.",
          },
          {
            heading: "Lãnh đạo bằng kỳ vọng rõ và một con đường sửa",
            paragraph: "Phản hồi tốt đi vào hành vi, tác động và bước tiếp theo, thay vì làm người nhận mất mặt trước tập thể. Người dẫn dắt cũng cần thừa nhận phần mình giao việc chưa rõ hoặc hỗ trợ chưa đủ. Tôn trọng không có nghĩa né một cuộc trò chuyện khó.",
          },
          {
            heading: "Giữ ranh giới giữa ảnh hưởng và thao túng",
            paragraph: "Một lời khen chân thành giúp người khác nhìn thấy giá trị họ đã tạo ra; một lời khen có điều kiện chỉ mở đường cho món nợ phải trả. Trước khi nói, hãy hỏi: người kia có đủ thông tin, có thể nói “không” và vẫn được tôn trọng hay không?",
          },
        ],
        conclusion: [
          "Sức ảnh hưởng bền không được đo bằng số lần mình khiến người khác đồng ý. Nó được nhìn thấy ở mức độ an toàn khi họ nói thật, đặt câu hỏi và cùng mình sửa điều chưa tốt.",
          "Khi cuộc trò chuyện không còn là cuộc đấu hơn thua, sự tin tưởng sẽ trở thành nền tảng tự nhiên cho hợp tác—không phải phần thưởng của một kỹ thuật giao tiếp hoàn hảo.",
        ],
      },
    },
    keyPoints: {
      en: [
        "Listen long enough to understand the person, not only to prepare a reply.",
        "Make appreciation specific and sincere instead of using praise as leverage.",
        "Address the problem clearly without reducing the other person's dignity.",
        "Tact becomes manipulation when the other person loses the right to disagree.",
        "Use communication skills to make a relationship clearer and kinder, not to win it.",
      ],
      vi: [
        "Giao tiếp mà không tạo phòng vệ: bớt phán xét, ghi nhận chân thành và nói rõ việc cần thay đổi.",
        "Tạo thiện cảm bằng sự chú ý thật: lắng nghe, gọi đúng tên và nói về điều có ý nghĩa với người trước mặt.",
        "Thuyết phục bằng hợp tác: tìm điểm chung, tôn trọng bất đồng và để người bị ảnh hưởng tham gia hoàn thiện phương án.",
        "Lãnh đạo bằng câu hỏi, kỳ vọng rõ và phản hồi có đường sửa, thay vì ra lệnh hoặc làm người khác mất thể diện.",
        "Dùng sự khéo léo để xây dựng tin tưởng và hợp tác, không biến giao tiếp thành công cụ thao túng.",
      ],
    },
    readingPages: { vi: DAC_NHAN_TAM_PAGES },
  },
  {
    slug: "atomic-habits",
    title: "Atomic Habits",
    titleEn: "Atomic Habits",
    author: "James Clear",
    cover: "/books/rendered/atomic-habits.webp",
    coverAspect: 1200 / 1698,
    hue: 36,
    saturation: 28,
    lightness: 60,
    foil: "#6B4E2E",
    scale: 1.04,
    readingLayout: "continuous",
    readingTheme: "habit-field-guide",
    outsideSummary: {
      vi: {
        tagline: "Thay đổi bền không cần một ngày hoàn hảo; nó cần một hệ thống đủ nhẹ để mình còn muốn quay lại vào ngày mai.",
        heading: "Từ ý định tốt đến một hệ thống có thể sống cùng",
        introduction: [
          "Vì sao mình thường biết điều nên làm nhưng vẫn khó duy trì? Vì sao những kế hoạch đầy quyết tâm lại dễ bị bỏ dở chỉ sau vài ngày?",
          "*Atomic Habits* giúp mình nhìn thói quen như một hệ thống có thể thiết kế. Những hành động nhỏ, khi được lặp lại trong môi trường phù hợp, vừa tích lũy thành kết quả vừa tạo bằng chứng cho kiểu người mình đang trở thành.",
          "Đây không phải cuộc thi tối ưu mọi phút trong ngày. Giá trị của sách là làm điều quan trọng dễ bắt đầu, dễ lặp lại và dễ quay về hơn trong cả những ngày bận rộn hoặc thiếu năng lượng.",
        ],
        lessonsHeading: "Năm đòn bẩy để một thói quen có cơ hội bén rễ",
        numbered: true,
        lessons: [
          {
            heading: "Đừng chỉ tập trung vào đích đến",
            paragraph: "“Đọc 12 cuốn sách” là một đích đến; “sau bữa sáng, đọc hai trang trước khi mở điện thoại” mới là hệ thống có thể thực hiện hôm nay. Khi kết quả còn xa, hãy kiểm tra lịch, không gian và bước bắt đầu thay vì chỉ tăng áp lực lên mục tiêu.",
          },
          {
            heading: "Bắt đầu nhỏ để có thể đi xa",
            paragraph: "Nếu 30 phút đọc vẫn quá lớn, hãy mở sách và đọc một trang; nếu một buổi tập quá nặng, chỉ cần mang giày và đi năm phút. Phiên bản nhỏ không phải đích cuối. Nó là cánh cửa đủ nhẹ để mình xuất hiện trước khi nâng độ khó.",
          },
          {
            heading: "Thiết kế môi trường thay vì chỉ dựa vào ý chí",
            paragraph: "Để sách ở nơi mắt thường chạm tới giúp việc đọc dễ bắt đầu; đưa điện thoại ra khỏi phòng làm tăng ma sát cho thói quen lướt vô thức. Môi trường không quyết định thay mình, nhưng nó làm một lựa chọn trở nên tự nhiên hoặc tốn sức hơn.",
          },
          {
            heading: "Xây dựng thói quen từ bản sắc mình muốn hướng tới",
            paragraph: "Đi bộ năm phút không chỉ đóng góp vào sức khỏe; nó còn là một lá phiếu cho hình ảnh người biết chăm sóc cơ thể. Bản sắc nên là chiếc la bàn, không phải bản án. Một ngày bỏ lỡ không chứng minh mình lười hoặc kém giá trị.",
          },
          {
            heading: "Một lần lỡ nhịp không có nghĩa là thất bại",
            paragraph: "Bảng theo dõi nên là dữ liệu để học, không phải bảng điểm về giá trị bản thân. Nếu lỡ một ngày, hãy quay lại bằng phiên bản nhỏ nhất ở cơ hội kế tiếp, gỡ một trở ngại và tiếp tục nhịp bình thường thay vì làm gấp đôi để tự phạt.",
          },
        ],
        conclusion: [
          "Giá trị lớn nhất của *Atomic Habits* không nằm ở việc thúc ép mình thay đổi toàn bộ cuộc sống ngay lập tức. Khi biết thiết kế hành động nhỏ, môi trường phù hợp và một hệ thống có thể duy trì, mình không còn phải chờ cảm hứng mới bắt đầu. Mình có thể tiến bộ từng ngày—nhẹ nhàng, thực tế và bền vững hơn.",
          "Hãy chọn một thói quen thật sự phục vụ cuộc sống mình muốn, làm nó đủ rõ và đủ nhỏ cho hoàn cảnh hiện tại. Tiến bộ có lúc là làm thêm một chút; cũng có lúc là biết nghỉ, điều chỉnh kỳ vọng và giữ cánh cửa để ngày mai quay lại.",
        ],
      },
    },
    keyPoints: {
      en: [
        "The book separates outcomes, daily systems, and the identity those actions support.",
        "A small repeatable action can be more useful than a dramatic plan that is hard to start.",
        "Cues, friction, and environment can make a habit easier or harder to repeat.",
        "An identity-based habit is evidence about who you are becoming, not a verdict on your worth.",
        "Missing once does not define you; the useful question is how gently you return.",
      ],
      vi: [
        "Đừng chỉ tập trung vào đích đến.",
        "Bắt đầu nhỏ để có thể đi xa.",
        "Thiết kế môi trường thay vì chỉ dựa vào ý chí.",
        "Xây dựng thói quen từ bản sắc mình muốn hướng tới.",
        "Một lần lỡ nhịp không có nghĩa là thất bại.",
      ],
    },
    readingPages: { vi: ATOMIC_HABITS_PAGES },
  },
  {
    slug: "silence-of-the-lambs",
    title: "Sự Im Lặng Của Bầy Cừu",
    titleEn: "The Silence of the Lambs",
    author: "Thomas Harris",
    cover: "/books/rendered/silence-of-the-lambs.webp",
    coverAspect: 881 / 1414,
    hue: 210, // pale/white spine to match the VN cover
    saturation: 8,
    lightness: 86,
    foil: "#3A3A3A",
    scale: 1.0,
    outsideSummary: {
      vi: {
        tagline: "Một cuộc đấu trí nghẹt thở, nơi đôi khi điều đáng sợ nhất không nằm trong lời nói—mà ẩn sau một khoảng im lặng.",
        heading: "Đọc bóng tối bằng một cái nhìn còn nhân tính",
        introduction: [
          "*Sự Im Lặng Của Bầy Cừu* theo chân Clarice Starling, một học viên trẻ bước vào cuộc điều tra nơi thông tin, trực giác và ranh giới tâm lý đều có thể quyết định bước tiếp theo. Cô vừa tìm manh mối, vừa phải giữ tiếng nói trước những người nhiều địa vị hoặc sức ảnh hưởng hơn.",
          "Sức cuốn hút của tiểu thuyết không chỉ nằm ở bí ẩn. Phía sau cuộc đấu trí là những câu hỏi rất gần: làm sao phân biệt quan sát với suy diễn, sức hút với sự an toàn, thấu hiểu với khai thác và sự tò mò với việc biến nỗi đau thành nội dung.",
        ],
        lessonsHeading: "Năm hồ sơ có thể mang về đời sống",
        numbered: true,
        lessons: [
          {
            heading: "Lòng can đảm có thể được chuẩn bị",
            paragraph: "Clarice không mạnh vì cô không biết sợ. Ngoài đời, trước một buổi phỏng vấn hoặc cuộc trò chuyện khó, mình có thể chuẩn bị câu mở đầu, ba điều cần nói và giới hạn khiến mình sẽ xin dừng. Một giọng còn run nhưng nói rõ vẫn là can đảm.",
          },
          {
            heading: "Tách dữ kiện khỏi câu chuyện mình tự kể",
            paragraph: "Nếu mình gửi một tin dài và chỉ nhận lại chữ “Ừ”, dữ kiện mới chỉ là người kia trả lời bằng một từ; kết luận rằng họ đang giận vẫn là suy đoán. Hãy ghi ba dòng: điều đã biết, điều đang đoán và thông tin còn thiếu trước khi phản ứng.",
          },
          {
            heading: "Sức hút không phải bằng chứng của sự an toàn",
            paragraph: "Một người thông minh và lịch thiệp vẫn có thể không tôn trọng ranh giới. Hãy quan sát phản ứng khi họ nghe lời từ chối. Người an toàn sẽ dừng lại; người muốn kiểm soát thường khiến mình thấy có lỗi vì đã giữ giới hạn.",
          },
          {
            heading: "Thông tin luôn đi cùng quyền lực và một cái giá",
            paragraph: "Nếu ai đó chỉ tiết lộ thông tin công việc khi mình kể bí mật của người khác, hãy hỏi điều ấy có thật sự cần thiết và cái giá có làm tổn thương ai không. Mình có thể yêu cầu phần liên quan được nói thẳng hoặc tìm một nguồn kiểm chứng khác.",
          },
          {
            heading: "Giữ con người ở trung tâm, không biến tổn thương thành cảnh tượng",
            paragraph: "Truyện tội phạm dễ khiến hung thủ thành tâm điểm còn nạn nhân chỉ còn là manh mối. Khi chia sẻ, hãy kiểm tra nguồn và lược chi tiết xâm phạm đời tư. Bạo lực của nhân vật hư cấu không đại diện hay giải thích cho người chuyển giới ngoài đời.",
          },
        ],
        conclusion: [
          "Điều ở lại sau nhịp truyện căng thẳng không chỉ là câu hỏi ai đã gây án. Đó còn là cách Clarice bảo vệ sự tỉnh táo, mục tiêu và phần người của mình trong những căn phòng luôn thử thách chúng.",
          "Đọc về bóng tối không buộc mình phải trở nên lạnh lùng. Nó có thể giúp mình nhận diện nguy hiểm rõ hơn, giữ ranh giới chắc hơn và vẫn nhớ rằng phía sau mỗi hồ sơ là một con người.",
        ],
      },
    },
    keyPoints: {
      en: [
        "The crime story keeps Clarice Starling's attention, pressure, and resolve at its center.",
        "Courage in the novel can coexist with fear, vulnerability, and being underestimated.",
        "Intelligence and politeness are not evidence of conscience or safety.",
        "Clarice needs information without surrendering her boundaries to the person offering it.",
        "The novel's darkness is worth reading critically, without turning harm into spectacle.",
      ],
      vi: [
        "Clarice Starling không phải một người hùng không biết sợ. Sức mạnh của cô nằm ở khả năng quan sát, kiên trì và tiếp tục bước tới dù đang bị xem nhẹ.",
        "Lòng can đảm không phải là hết sợ, mà là vẫn giữ được sự tỉnh táo khi nỗi sợ đang ở rất gần.",
        "Hannibal Lecter nhắc ta rằng trí thông minh, vẻ lịch thiệp và sức hút không đồng nghĩa với lòng tốt hay sự an toàn.",
        "Trong một cuộc đấu trí, thông tin luôn có cái giá của nó. Clarice phải biết lắng nghe nhưng không để người khác bước qua ranh giới của mình.",
        "Đằng sau mỗi manh mối là một con người. Cuốn sách không chỉ kể về việc truy tìm hung thủ, mà còn đặt ra câu hỏi: ta có còn nhìn thấy nạn nhân khi mọi ánh mắt đều bị bóng tối thu hút?",
      ],
    },
    // Vietnamese reflection; English intentionally falls back to English key points.
    readingDensity: "compact",
    readingTheme: "silence-casefile",
    readingPages: { vi: SILENCE_OF_THE_LAMBS_PAGES },
  },
  {
    slug: "48-laws-of-power",
    title: "48 Nguyên Tắc Chủ Chốt Của Quyền Lực",
    titleEn: "The 48 Laws of Power",
    author: "Robert Greene",
    cover: "/books/rendered/48-laws-of-power.webp",
    coverAspect: 814 / 1200,
    coverBack: "/books/rendered/48-laws-of-power-back.webp",
    hue: 0, // near-black spine to match the VN cover
    saturation: 30,
    lightness: 12,
    foil: "#CFCFCF",
    scale: 1.12,
    readingTheme: "power-board",
    coverNote: {
      en: "A critical reading of power, not a manual for manipulation: notice status and insecurity while keeping credit honest, boundaries clear, and disagreement possible.",
      vi: "19 lăng kính và 48 nước cờ để hiểu quyền lực mà vẫn giữ được mình",
    },
    outsideSummary: {
      vi: {
        tagline: "19 lăng kính và 48 nước cờ để hiểu quyền lực mà vẫn giữ được mình",
        heading: "Bàn cờ quyền lực",
        introduction: [
          "Quyền lực không chỉ nằm trong chức danh hay tiền bạc. Nó xuất hiện khi một người có quyền quyết định, giữ thông tin, phân chia cơ hội, định nghĩa điều gì được xem là “đúng” hoặc khiến người khác khó nói lời từ chối.",
          "*48 Nguyên Tắc Chủ Chốt Của Quyền Lực* mô tả rất sắc những cơ chế ấy. Tuy nhiên, mô tả một chiến thuật không có nghĩa mình phải sử dụng nó. Cuốn sổ này chọn một cách đọc khác: hiểu để nhìn rõ, tự bảo vệ và tạo ảnh hưởng mà không làm người khác nhỏ đi.",
        ],
        lessonsHeading: "Năm lăng kính để đọc quyền lực tỉnh táo",
        numbered: true,
        lessons: [
          {
            heading: "Nhìn cấu trúc trước khi đoán động cơ",
            paragraph: "Khi thấy lép vế trong cuộc họp, hãy hỏi: ai có quyền chốt, ai giữ thông tin, ai chịu hậu quả nếu sai và tiếng nói nào chưa xuất hiện? Nhìn đúng cấu trúc giúp mình biết nên hỏi thêm dữ liệu, làm rõ quyền hạn hay tìm hỗ trợ.",
          },
          {
            heading: "Khéo léo không có nghĩa là tự xóa mình",
            paragraph: "Mình có thể góp ý riêng, mang dữ liệu và đề xuất thử nghiệm thay vì làm cấp trên mất mặt giữa cuộc họp. Nhưng bản tổng kết vẫn cần ghi đúng người nghiên cứu, phát triển và thực hiện. Tinh tế không có nghĩa làm đóng góp biến mất.",
          },
          {
            heading: "Xây ảnh hưởng bằng uy tín có thể kiểm chứng",
            paragraph: "Sự chú ý có thể mở cửa, nhưng danh tiếng bền được tạo từ việc giữ lời, báo sớm rủi ro, chia sẻ công lao và nhận trách nhiệm khi sai. Một bản cập nhật ngắn, rõ kết quả và trở ngại thường có giá trị hơn màn thể hiện ồn ào.",
          },
          {
            heading: "Xem chiến thuật nguy hiểm như tín hiệu để tự bảo vệ",
            paragraph: "Giữ thông tin để tạo phụ thuộc, dựng thời hạn giả hoặc biến bất đồng thành phép thử lòng trung thành là những dấu hiệu cần chú ý. Bước tỉnh táo là yêu cầu tài liệu, xin thời gian kiểm tra và mở rộng nguồn hỗ trợ—không phải tìm cách lừa lại.",
          },
          {
            heading: "Đánh giá một nước đi bằng điều còn lại sau chiến thắng",
            paragraph: "Một chiến thuật có thể giúp mình thắng tranh luận nhưng làm mất lòng tin và quyền lựa chọn của người khác. Hãy hỏi: nếu nước đi này được công khai và mọi người đều làm giống mình, môi trường còn là nơi mình muốn ở không?",
          },
        ],
        conclusion: [
          "Đọc cuốn sách này không buộc mình phải lạnh lùng hay nghi ngờ mọi quan hệ. Giá trị lớn nhất là giúp mình bớt ngây thơ trước địa vị, thông tin và những áp lực thường không được gọi tên.",
          "Tỉnh táo để không bị điều khiển; có nguyên tắc để không trở thành điều mình từng phải đề phòng. Quyền lực đáng giữ là quyền lực vẫn chừa chỗ cho sự thật, phản biện và phẩm giá của người khác.",
        ],
      },
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
        "Quyền lực không chỉ nằm trong chức danh hay tiền bạc. Nó xuất hiện khi một người có quyền quyết định, giữ thông tin, phân chia cơ hội, định nghĩa điều gì được xem là “đúng” hoặc khiến người khác khó nói lời từ chối.",
        "*48 Nguyên Tắc Chủ Chốt Của Quyền Lực* mô tả rất sắc những cơ chế ấy. Tuy nhiên, mô tả một chiến thuật không có nghĩa mình phải sử dụng nó. Cuốn sổ này chọn một cách đọc khác: hiểu để nhìn rõ, tự bảo vệ và tạo ảnh hưởng mà không làm người khác nhỏ đi.",
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
    cover: "/books/rendered/thinking-fast-and-slow.webp",
    coverAspect: 532 / 808,
    coverBack: "/books/rendered/thinking-fast-and-slow-back.webp",
    hue: 40,
    saturation: 12,
    lightness: 66,
    foil: "#4A463E",
    scale: 1.08,
    readingTheme: "thinking-dossier",
    outsideSummary: {
      vi: {
        tagline: "Không phải mọi câu trả lời đến nhanh đều sai; điều đáng học là nhận ra quyết định nào xứng đáng được chậm lại.",
        heading: "Phòng điều tra những phán đoán rất tự tin",
        introduction: [
          "Phần lớn thời gian, mình không phân tích mọi thứ từ đầu. Não thường dựa vào kinh nghiệm, cảm xúc và những lối tắt quen thuộc để đưa ra câu trả lời thật nhanh. Điều này giúp cuộc sống nhẹ hơn, nhưng đôi khi cũng khiến mình tự tin vào một phán đoán chưa đủ căn cứ.",
          "*Tư Duy Nhanh Và Chậm* không biến trực giác thành kẻ thù và cũng không xem suy nghĩ chậm là bảo đảm đúng. Cuốn sách giúp mình nhận ra lúc cảm giác “rõ ràng quá rồi” đang đi trước dữ kiện, nhất là với lựa chọn nhiều tiền, khó sửa hoặc ảnh hưởng đến người khác.",
        ],
        lessonsHeading: "Năm dấu hiệu cho biết mình nên kiểm tra thêm một nhịp",
        numbered: true,
        lessons: [
          {
            heading: "Hai nhịp suy nghĩ cùng điều khiển một ngày",
            paragraph: "Phép tính 2 + 2 gần như tự bật ra, còn 17 × 24 buộc mình dừng lại. Trong đời sống, thích cách một ứng viên nói chuyện không tự động trả lời họ có phù hợp công việc hay không. Hãy viết lại câu hỏi thật sự trước khi chọn bằng chứng.",
          },
          {
            heading: "Câu chuyện tròn trịa có thể che mảnh ghép vắng mặt",
            paragraph: "Một hồ sơ đẹp và phong thái tự tin dễ tạo cảm giác mình đã hiểu rõ một người. Nhưng có thể mình chưa xem sản phẩm thật hoặc cách họ xử lý sai sót. Câu chuyện càng mượt, mình càng nên hỏi: thông tin quan trọng nào chưa có mặt?",
          },
          {
            heading: "Con số đầu tiên có thể trở thành một chiếc mỏ neo",
            paragraph: "Khi căn hộ được giới thiệu từng có giá 5 tỷ, mức 4,2 tỷ dễ tạo cảm giác hời trước khi xem giá thị trường. Hãy tự ước lượng trước, rồi so với những trường hợp tương tự thay vì chỉ điều chỉnh quanh mốc đầu tiên.",
          },
          {
            heading: "Mất mát và cách đóng khung làm cảm xúc đổi hướng",
            paragraph: "“90% khả năng thành công” và “10% khả năng thất bại” mô tả cùng một xác suất nhưng có thể tạo hai phản ứng khác nhau. Hãy viết lựa chọn dưới cả khung được và mất, rồi hỏi: nếu hôm nay chưa sở hữu nó, mình có còn chọn như vậy không?",
          },
          {
            heading: "Nghĩ chậm là tạo một điểm dừng, không phải bảo đảm đúng",
            paragraph: "Với việc dễ quay lại và ít hậu quả, mình có thể quyết nhanh rồi học. Với hợp đồng dài hạn hoặc quyết định khó sửa, hãy dùng dữ liệu nền, ý kiến độc lập và một khoảng chờ. Mục tiêu là chú ý đúng nơi, không phân tích mọi việc đến kiệt sức.",
          },
        ],
        conclusion: [
          "Cuốn sách không dạy mình ngừng tin vào trực giác. Nó giúp mình biết khi nào trực giác đáng tin, và khi nào một quyết định quan trọng cần được kiểm tra kỹ hơn.",
          "Mình không cần trở thành người không bao giờ thiên kiến. Chỉ cần tạo đủ khoảng dừng để bằng chứng mới bước vào, và giữ đủ khiêm tốn để cập nhật khi câu chuyện ban đầu không còn đứng vững.",
        ],
      },
    },
    keyPoints: {
      en: [
        "The book uses System 1 and System 2 as a model for fast and effortful thinking.",
        "First impressions, familiar stories, and initial numbers can steer judgment before we notice.",
        "For an important decision, ask what evidence is present and what information is still missing.",
        "Framing and fear of loss can change a choice even when the underlying facts stay the same.",
        "Slower thinking is not automatically correct; it is a chance to check, compare, and revise.",
      ],
      vi: [
        "Có thể hình dung tư duy qua hai chế độ: một bên nhanh, tự động và giàu trực giác; một bên chậm hơn, cần tập trung và biết kiểm tra.",
        "Ấn tượng đầu tiên, câu chuyện dễ nhớ hoặc thông tin xuất hiện gần đây có thể khiến mình tưởng đó là toàn bộ sự thật.",
        "Một con số được nhắc đến trước có thể trở thành “mỏ neo”, âm thầm kéo dự đoán và lựa chọn của mình về phía nó.",
        "Con người thường cảm nhận mất mát mạnh hơn một lợi ích tương đương, nên dễ giữ nguyên lựa chọn cũ hoặc phản ứng quá mức khi sợ mất.",
        "Nghĩ chậm không bảo đảm mình luôn đúng. Nó chỉ tạo ra một khoảng dừng để kiểm tra bằng chứng, xem thêm góc nhìn và cân nhắc điều mình có thể đã bỏ sót.",
      ],
    },
    readingPages: { vi: THINKING_FAST_SLOW_PAGES },
  },
  {
    slug: "goodbye-things",
    title: "Lối Sống Tối Giản Của Người Nhật",
    titleEn: "Goodbye, Things",
    author: "Fumio Sasaki",
    cover: "/books/rendered/goodbye-things.webp",
    coverAspect: 584 / 955,
    coverBack: "/books/rendered/goodbye-things-back.webp",
    hue: 150,
    saturation: 10,
    lightness: 80,
    foil: "#6A8A82",
    scale: 0.96,
    readingDensity: "compact",
    readingTheme: "breathing-house",
    coverNote: {
      en: "Minimalism does not ask how much more I can discard. It asks: what truly deserves a place in my life?",
      vi: "Tối giản không hỏi mình có thể vứt thêm bao nhiêu. Nó hỏi: điều gì thật sự xứng đáng chiếm một chỗ trong cuộc sống của mình?",
    },
    outsideSummary: {
      vi: {
        tagline: "Không phải cuộc thi sở hữu ít nhất, mà là hành trình trả lại chỗ cho điều mình thật sự muốn sống cùng.",
        heading: "Một ngôi nhà nhẹ hơn, một đời sống rõ hơn",
        introduction: [
          "Trong *Lối Sống Tối Giản Của Người Nhật*, Fumio Sasaki kể từ trải nghiệm của một người từng sống giữa đồ đạc, bất an và thói quen so sánh. Khi căn phòng nhẹ đi, điều ông nhận lại không chỉ là diện tích mà còn là thời gian, sự tập trung và cảm giác biết đủ.",
          "Tối giản ở đây nên được xem như một công cụ, không phải tiêu chuẩn đạo đức. Nhu cầu còn tùy gia đình, công việc, sức khỏe và tài chính. Câu hỏi hữu ích không phải “Mình còn bao nhiêu món?”, mà là “Những thứ ở đây có phục vụ đời sống thật không?”.",
        ],
        lessonsHeading: "Năm cách để không gian phục vụ lại mình",
        numbered: true,
        lessons: [
          {
            heading: "Nhìn cả hóa đơn vô hình của một món đồ",
            paragraph: "Giá mua chỉ là chi phí đầu tiên; một món đồ còn cần chỗ cất, thời gian lau dọn và sự chú ý mỗi khi mình tìm hoặc di chuyển nó. Hãy hỏi: mình đang dùng món này trong nhịp sống hiện tại hay chỉ trong một cuộc sống từng tưởng tượng?",
          },
          {
            heading: "Bắt đầu từ nơi đang tạo nhiều ma sát nhất",
            paragraph: "Không cần dọn cả căn nhà trong một ngày. Hãy chọn một ngăn kéo thường gây bất tiện, đặt 15 phút và chia đồ thành ba nhóm: đang phục vụ, chưa rõ và đã hoàn thành vai trò. Thành công là lần mở tiếp theo mình tìm được thứ cần dùng ngay.",
          },
          {
            heading: "Phân biệt ký ức, tiếc tiền và phiên bản tương lai",
            paragraph: "Một chiếc áo đắt có thể được giữ vì tiếc tiền; dụng cụ tập có thể đại diện cho con người mình muốn trở thành. Không cần ép bỏ ngay. Hãy thử hỏi: nếu hôm nay chưa sở hữu, mình có mua lại không, và giá trị nào mình thật sự muốn giữ?",
          },
          {
            heading: "Nhìn dòng đồ đi vào trước khi tiếp tục dọn ra",
            paragraph: "Nếu đồ mới vào nhanh hơn đồ cũ rời đi, khoảng trống chỉ tồn tại tạm thời. Trước món không thiết yếu, hãy tạo một khoảng chờ, đo nơi định đặt và xem ở nhà đã có thứ làm được phần lớn công việc ấy chưa. Đôi khi mượn hoặc thuê phù hợp hơn mua.",
          },
          {
            heading: "Định nghĩa chữ “đủ” theo đời sống thật của từng người",
            paragraph: "Gia đình có trẻ nhỏ, người cao tuổi hoặc công việc chuyên môn sẽ cần lượng đồ khác người sống một mình. Đừng tự ý dọn đồ của người khác hay bỏ vật dụng thiết yếu. Chữ “đủ” cần dựa trên công dụng và khả năng chăm sóc, không phải con số đẹp.",
          },
        ],
        conclusion: [
          "Đích đến của tối giản không phải căn phòng trống. Đó là không gian nơi nghỉ ngơi, làm việc, trò chuyện và chăm sóc nhau có thể diễn ra dễ dàng hơn.",
          "Một mặt bàn dễ dùng hơn, một món mua sắm được cân nhắc kỹ hơn hoặc một hộp ký ức vừa đủ cũng đã là cách trả lại sự chú ý cho đời sống mình đang thật sự có.",
        ],
      },
    },
    keyPoints: {
      en: [
        "The book presents minimalism as a tool, not a moral score or a contest to own the least.",
        "Every object asks for space, care, and attention, so keeping something can be an active choice.",
        "A useful question is whether an item serves the life you live now, not only the money already spent.",
        "Starting with one drawer is enough to test whether less friction actually helps you.",
        "Needs differ across families, work, hobbies, health, and finances; minimalism should adapt to real life.",
      ],
      vi: [
        "Tối giản không phải sống trong một căn phòng trống. Đó là giữ lại những gì mình thật sự cần, sử dụng và trân trọng.",
        "Một món đồ không chỉ tốn tiền mua. Nó còn cần chỗ cất, thời gian dọn dẹp, công sức bảo quản và một phần sự chú ý của mình.",
        "Mình thường giữ đồ vì tiếc tiền, sợ quên kỷ niệm hoặc hy vọng “một ngày nào đó” sẽ dùng. Nhưng buông một món đồ không có nghĩa là xóa đi ký ức hay phủ nhận con người trước đây.",
        "Không cần dọn sạch cả căn nhà trong một ngày. Hãy bắt đầu bằng một ngăn kéo, một nhóm đồ trùng công dụng hoặc những thứ mình đã lâu không còn nhớ tới.",
        "Đích đến của tối giản không phải sở hữu ít nhất. Đó là có thêm không gian để thở, thời gian để sống và sự tự do để thôi so sánh mình với người khác.",
      ],
    },
    // Vietnamese reflection; English intentionally falls back to English key points.
    readingPages: { vi: GOODBYE_THINGS_PAGES },
  },
  {
    slug: "muon-kiep-nhan-sinh-1",
    title: "Muôn Kiếp Nhân Sinh — Tập 1",
    titleEn: "Many Lives, Many Times - Vol. 1",
    author: "Nguyên Phong",
    cover: "/books/rendered/muon-kiep-nhan-sinh-1.webp",
    coverAspect: 1352 / 2004,
    coverBack: "/books/muon-kiep-nhan-sinh-1-back.jpg",
    hue: 220, // dark navy (broken-watch cover)
    saturation: 30,
    lightness: 12,
    foil: "#D8DCE4",
    scale: 1.0,
    readingDensity: "compact",
    readingTheme: "layered-time-map",
    outsideSummary: {
      vi: {
        tagline: "Không cần biết mình đã sống bao nhiêu đời để hiểu rằng mỗi lựa chọn hôm nay đều đang để lại một điều gì đó.",
        heading: "Dấu vết của mỗi lựa chọn",
        introduction: [
          "*Muôn Kiếp Nhân Sinh — Tập 1* mở ra qua những cuộc trò chuyện với Thomas và các trải nghiệm được ông nhìn nhận như ký ức tiền kiếp. Từ Atlantis, Ai Cập cổ đại đến nước Mỹ hiện đại, câu chuyện luôn trở về cách con người sử dụng tri thức, tiền bạc và quyền lực.",
          "Luân hồi, nhân quả, linh hồn và những nền văn minh cổ thuộc thế giới quan tâm linh của tác phẩm, không phải kết luận lịch sử hay khoa học đã được kiểm chứng. Mình vẫn có thể đọc mở lòng, đồng thời đưa câu hỏi của sách trở về lựa chọn và trách nhiệm trong hiện tại.",
        ],
        lessonsHeading: "Năm điều có thể mang về đời sống hôm nay",
        numbered: true,
        lessons: [
          {
            heading: "Đọc câu chuyện như một tấm gương, không như bằng chứng",
            paragraph: "Một chi tiết về Atlantis hay tiền kiếp có thể gợi tò mò, nhưng giá trị gần nhất nằm ở câu hỏi nó đánh thức: nếu quyền lực từng khiến con người kiêu ngạo, mình đang sử dụng vị trí và hiểu biết của mình để nâng đỡ hay kiểm soát người khác?",
          },
          {
            heading: "Nhân quả gần nhất nằm trong điều mình có thể quan sát",
            paragraph: "Không cần chờ lời giải thích siêu hình để thấy lựa chọn tạo ra hệ quả. Thất hứa nhiều lần làm niềm tin giảm; nhận lỗi và sửa sai cho quan hệ cơ hội hồi phục. Hãy nhìn một quyết định qua ba bước: việc mình làm, ảnh hưởng và phần có thể sửa.",
          },
          {
            heading: "Quyền lực là nơi phẩm chất được nhìn thấy rõ hơn",
            paragraph: "Tiền bạc, địa vị và tri thức không tự quyết định một người tốt hay xấu, nhưng chúng mở rộng phạm vi ảnh hưởng. Một trưởng nhóm có thể giữ công lao để củng cố vị trí, hoặc ghi nhận đúng đóng góp và giúp đồng đội trưởng thành.",
          },
          {
            heading: "Trách nhiệm không bao giờ đồng nghĩa với đổ lỗi nạn nhân",
            paragraph: "Không nên dùng nhân quả để kết luận một người đáng chịu bệnh tật, nghèo khó, bạo lực hoặc mất mát. Bài học an toàn hơn là chịu trách nhiệm cho phần thuộc về mình, đồng thời nhìn thấy hoàn cảnh, bất công và trách nhiệm của người gây hại.",
          },
          {
            heading: "Giữ niềm tin rộng mở, giữ hành động thật cụ thể",
            paragraph: "Mình không cần giải quyết mọi câu hỏi về linh hồn mới có thể sống tử tế hơn. Cuối ngày, hãy ghi một lựa chọn đáng giữ, một ảnh hưởng chưa lường hết và một việc nhỏ có thể sửa ngày mai. Suy ngẫm chỉ có giá trị khi đi vào hành động.",
          },
        ],
        conclusion: [
          "Tập 1 hấp dẫn bởi tầm nhìn trải qua nhiều thời đại, nhưng điểm chạm gần nhất vẫn là đời sống đang diễn ra. Mình không kiểm soát mọi hoàn cảnh, song có thể thành thật hơn với động cơ và ảnh hưởng của lựa chọn mình tạo ra.",
          "Điều đáng giữ không phải nỗi sợ về một hình phạt vô hình, mà là mong muốn sống tỉnh thức, biết sửa sai và để lại nhiều điều tốt lành hơn từ hôm nay.",
        ],
      },
    },
    keyPoints: {
      en: [
        "The book presents reincarnation and karma as the worldview through which Thomas's story is told.",
        "Read as a moral lens, cause and effect invites attention to what our choices leave behind today.",
        "Atlantis, past lives, and the soul belong to the book's spiritual narrative, not established fact here.",
        "The reflection I keep is responsibility without using karma to blame people for suffering.",
        "Belief can remain open while kindness, repair, and accountability are practiced in the present.",
      ],
      vi: [
        "Cuốn sách kể lại những cuộc trò chuyện với Thomas và các trải nghiệm được ông nhìn nhận như ký ức tiền kiếp, mở ra hành trình từ Atlantis, Ai Cập cổ đại đến nước Mỹ hiện đại.",
        "Luân hồi và nhân quả là lăng kính tâm linh xuyên suốt tác phẩm. Người đọc có thể suy ngẫm từ lăng kính ấy, nhưng không nên xem mọi chi tiết như lịch sử hay khoa học đã được kiểm chứng.",
        "Những câu chuyện về quyền lực, tiền bạc và tri thức đều trở về một câu hỏi rất hiện tại: mình đang dùng khả năng của mình để nâng đỡ hay kiểm soát người khác?",
        "Nhân quả không chỉ được hình dung qua nhiều kiếp. Trong đời sống này, một suy nghĩ được nuôi lâu có thể thành hành động, hành động lặp lại thành thói quen và thói quen dần tạo nên con người mình.",
        "Bài học đáng giữ nhất không phải là phán xét số phận của ai. Đó là sống tử tế hơn, sửa điều mình làm sai và chịu trách nhiệm với phần ảnh hưởng thuộc về mình.",
      ],
    },
    // Vietnamese reflection; English intentionally falls back to attributed key points.
    readingPages: { vi: MUON_KIEP_NHAN_SINH_1_PAGES },
  },
  {
    slug: "muon-kiep-nhan-sinh-2",
    title: "Muôn Kiếp Nhân Sinh — Tập 2",
    titleEn: "Many Lives, Many Times - Vol. 2",
    author: "Nguyên Phong",
    cover: "/books/rendered/muon-kiep-nhan-sinh-2.webp",
    coverAspect: 1352 / 2004,
    coverBack: "/books/rendered/muon-kiep-nhan-sinh-2-back.webp",
    hue: 210, // ocean blue
    saturation: 42,
    lightness: 30,
    foil: "#EAF1FB",
    scale: 1.0,
    outsideSummary: {
      vi: {
        tagline: "Một vòng lặp không kết thúc khi mình hiểu vì sao nó tồn tại. Nó bắt đầu thay đổi khi mình lựa chọn hành động khác đi.",
        heading: "Xưởng sửa những vòng lặp",
        introduction: [
          "*Muôn Kiếp Nhân Sinh — Tập 2* đưa hành trình của Thomas qua nước Mỹ hiện đại, Assyria, Hy Lạp, Ba Tư và Ấn Độ, đồng thời mở rộng câu chuyện từ lựa chọn cá nhân đến những khuôn mẫu được cộng đồng lặp lại.",
          "Luân hồi, nhân quả và “cộng nghiệp” là lăng kính tâm linh của tác phẩm, không phải cơ chế khoa học đã được chứng minh. Mình có thể dùng chúng để suy ngẫm về hành vi, văn hóa và hệ thống, nhưng không để chúng thay thế y khoa, pháp luật hoặc trách nhiệm xã hội.",
        ],
        lessonsHeading: "Năm bước để nhìn và thay đổi một vòng lặp",
        numbered: true,
        lessons: [
          {
            heading: "Gọi tên vòng lặp trước khi cố thoát khỏi nó",
            paragraph: "Khi cảm thấy bị xem nhẹ, mình có thể công kích; đối phương phòng thủ và cuộc trò chuyện đổ vỡ, càng củng cố cảm giác ban đầu. Viết ra tác nhân, phản ứng và hậu quả giúp mình tìm điểm ngắt nhỏ nhất cho lần tiếp theo.",
          },
          {
            heading: "Vấn đề chung cần được nhìn ở cả con người lẫn hệ thống",
            paragraph: "Nhiều lựa chọn cá nhân có thể thành văn hóa, nhưng trách nhiệm không vì thế được chia đều. Nếu tổ chức đặt chỉ tiêu khiến nhân viên phải che giấu sai sót, người thiết kế và duy trì cơ chế ấy có trách nhiệm lớn hơn người ít quyền lựa chọn.",
          },
          {
            heading: "Chịu trách nhiệm mà không biến mình thành bị cáo",
            paragraph: "Tự nhận phần sai khác với ôm mọi lỗi về mình. Mình có thể xin lỗi vì lời nói gây tổn thương, nhưng không nhận trách nhiệm cho bạo lực của người khác. Người bị xâm hại, mắc bệnh hoặc chịu bất công không phải nguyên nhân đạo đức của việc ấy.",
          },
          {
            heading: "Tha thứ không yêu cầu mình từ bỏ ranh giới",
            paragraph: "Tha thứ, nếu phù hợp, có thể làm nhẹ sức nặng oán giận; nó không đồng nghĩa với quên đi hoặc quay lại nơi nguy hiểm. Một lựa chọn lành mạnh vẫn có thể là giữ khoảng cách, lưu bằng chứng, nhờ người đáng tin hoặc tìm hỗ trợ pháp lý.",
          },
          {
            heading: "Thực hành tinh thần nên đi cùng trợ giúp thực tế",
            paragraph: "Thiền và lòng biết ơn có thể giúp mình bình tâm, nhưng không thay thế bác sĩ, trị liệu, hỗ trợ pháp lý hay kế hoạch an toàn. Khi vòng lặp liên quan sang chấn, nghiện, bạo lực hoặc nguy cơ tự hại, tìm chuyên môn là trách nhiệm.",
          },
        ],
        conclusion: [
          "Tập 2 nhắc rằng hiểu biết chưa tự tạo ra chuyển hóa. Thay đổi cần một phản ứng mới, một ranh giới rõ hơn hoặc một cơ chế công bằng hơn được duy trì đủ lâu.",
          "Mình có thể bắt đầu rất nhỏ: gọi đúng điều đã xảy ra, sửa phần thuộc trách nhiệm của mình và tìm sự hỗ trợ cho phần không thể giải quyết một mình.",
        ],
      },
    },
    keyPoints: {
      en: [
        "The book expands its spiritual worldview from individual karma to shared patterns and responsibility.",
        "I can read 'karma' as a prompt to notice repeated choices without treating it as proof or punishment.",
        "Responsibility is not self-blame, and illness or suffering should not be turned into a moral verdict.",
        "Forgiveness may release resentment while boundaries still protect against repeated harm.",
        "Spiritual reflection can support care, but it does not replace medical, legal, or practical help.",
      ],
      vi: [
        "Tập 2 tiếp tục hành trình của Thomas qua nước Mỹ hiện đại, Assyria, Hy Lạp, Ba Tư, Ấn Độ và những trải nghiệm được sách mô tả như hành trình của linh hồn.",
        "Từ nhân quả cá nhân, cuốn sách mở rộng đến “cộng nghiệp”: nhiều lựa chọn nhỏ lặp lại có thể tạo nên văn hóa, hệ thống và hậu quả chung của cả cộng đồng.",
        "Những câu chuyện về chiến tranh và chinh phục đặt ra một câu hỏi gần gũi: khi nào khát vọng phát triển biến thành nhu cầu chứng minh mình bằng cách kiểm soát người khác?",
        "Chuyển hóa không phải phủ nhận tổn thương hay tự kết tội. Nó bắt đầu bằng việc nhìn ra vòng lặp, gọi đúng điều đã xảy ra và sửa phần mình có thể sửa.",
        "Thiền, lòng biết ơn và tha thứ có thể nâng đỡ tinh thần, nhưng không thay thế chăm sóc y khoa, trị liệu, pháp luật, ranh giới an toàn hay thay đổi xã hội cần thiết.",
      ],
    },
    readingDensity: "compact",
    readingTheme: "loop-restoration-workshop",
    // Vietnamese reflection; English intentionally falls back to attributed key points.
    readingPages: { vi: MUON_KIEP_NHAN_SINH_2_PAGES },
  },
  {
    slug: "muon-kiep-nhan-sinh-3",
    title: "Muôn Kiếp Nhân Sinh – Tập 3",
    titleEn: "Many Lives, Many Times - Vol. 3",
    author: "Nguyên Phong",
    cover: "/books/rendered/muon-kiep-nhan-sinh-3.webp",
    coverAspect: 1352 / 2004,
    coverBack: "/books/rendered/muon-kiep-nhan-sinh-3-back.webp",
    hue: 205, // deep door-blue
    saturation: 48,
    lightness: 22,
    foil: "#CFE6F5",
    scale: 1.0,
    outsideSummary: {
      vi: {
        tagline: "Máy móc có thể ngày càng thông minh. Nhưng nó không thể thay con người quyết định điều gì xứng đáng để theo đuổi.",
        heading: "La bàn cho một tương lai có AI",
        introduction: [
          "*Muôn Kiếp Nhân Sinh — Tập 3* khép hành trình của Thomas nhưng mở ra vùng suy ngẫm mới về trí tuệ nhân tạo, ý chí tự do và tương lai. Khi công nghệ giúp mình hành động nhanh hơn ở quy mô lớn hơn, ai sẽ chọn mục tiêu và bảo vệ người chịu rủi ro?",
          "Những luận bàn về linh hồn, luân hồi, nhân quả và ý thức vẫn thuộc thế giới quan tâm linh của tác phẩm, không phải kết luận khoa học về AI. Quyết định công nghệ trong đời thực cần dựa trên bằng chứng, quyền con người và cơ chế giám sát có thể kiểm tra.",
        ],
        lessonsHeading: "Năm nguyên tắc để công nghệ phục vụ con người",
        numbered: true,
        lessons: [
          {
            heading: "AI khuếch đại mục tiêu, dữ liệu và động cơ phía sau",
            paragraph: "Nếu hệ thống tuyển dụng học từ dữ liệu từng ưu ái một nhóm ứng viên, nó có thể lặp bất công ở quy mô lớn hơn. Trước khi dùng công cụ, hãy hỏi: nó đang tối ưu điều gì, học từ dữ liệu nào và giá trị nào đã bị bỏ ra ngoài?",
          },
          {
            heading: "Trách nhiệm phải có tên người và tên tổ chức",
            paragraph: "Không thể giải thích một quyết định gây hại bằng câu “thuật toán chọn như vậy”. Người thiết kế, đơn vị triển khai và lãnh đạo phê duyệt phải chịu phần tương xứng với quyền lực. Người bị ảnh hưởng cũng cần biết lý do và có nơi khiếu nại.",
          },
          {
            heading: "Rủi ro công nghệ không được phân bổ đồng đều",
            paragraph: "Một sai số có thể chỉ gây bất tiện cho nhóm này nhưng làm nhóm khác mất việc hoặc bị từ chối dịch vụ. Vì vậy, tổ chức cần kiểm tra tác động trên những nhóm liên quan và mời chính người dễ chịu ảnh hưởng tham gia thiết kế biện pháp bảo vệ.",
          },
          {
            heading: "Phán đoán con người phải là điểm kiểm soát thật sự",
            paragraph: "Trong y tế, giáo dục hay tín dụng, “có người tham gia” là chưa đủ nếu họ chỉ bấm chấp nhận gợi ý của máy. Người phụ trách cần đủ thông tin, thời gian và quyền hạn để đặt câu hỏi, từ chối kết quả tự động và chịu trách nhiệm cuối cùng.",
          },
          {
            heading: "Tách suy tưởng tâm linh khỏi kết luận kỹ thuật",
            paragraph: "Câu hỏi về ý thức có thể làm thảo luận AI sâu hơn, nhưng không chứng minh một mô hình có cảm xúc hay đạo đức. Hãy phân biệt rõ đâu là niềm tin, giả thuyết và kết luận có bằng chứng để không trao cho máy thẩm quyền mà nó không sở hữu.",
          },
        ],
        conclusion: [
          "Tương lai không chỉ phụ thuộc AI mạnh đến đâu, mà còn vào cách con người đặt giới hạn, công khai sai sót và sửa tổn hại. Tốc độ phát triển càng lớn, trách nhiệm của người thiết kế và vận hành càng không thể mơ hồ.",
          "Một chiếc la bàn tốt không chống lại tiến bộ. Nó giúp tiến bộ đi đúng hướng: tăng năng lực nhưng vẫn giữ phẩm giá, quyền lựa chọn và cơ hội được lên tiếng của con người ở trung tâm.",
        ],
      },
    },
    keyPoints: {
      en: [
        "The book connects its spiritual worldview to questions about technology, free will, and humanity's future.",
        "I read its warning as a prompt to ask who benefits from a powerful tool and who carries the risk.",
        "Claims about souls, karma, and consciousness remain beliefs within the book, not settled conclusions here.",
        "AI can support decisions, but people still own the purposes, safeguards, and consequences around its use.",
        "A grounded takeaway is to pair capability with accountability, care, and room to correct harm.",
      ],
      vi: [
        "Tập cuối khép lại hành trình của Thomas, đồng thời mở ra một câu hỏi lớn hơn: khi có thêm quyền lực và công nghệ, con người sẽ dùng chúng để trở thành ai?",
        "AI không tự tốt hay xấu. Nó có thể khuếch đại rất nhanh mục tiêu, dữ liệu và động cơ của những người đứng phía sau.",
        "Luân hồi, linh hồn và nhân quả thuộc thế giới quan tâm linh của tác phẩm. Mình có thể suy ngẫm từ đó mà không cần biến niềm tin thành kết luận khoa học.",
        "Tự do của mỗi người luôn đi cùng hoàn cảnh và giới hạn. Vì vậy, người có nhiều quyền lực và lựa chọn hơn cũng cần chịu trách nhiệm lớn hơn.",
        "Tương lai không chỉ được tạo nên bởi những phát minh lớn, mà còn từ cách mình sử dụng dữ liệu, tiền bạc, sự chú ý và quyền quyết định mỗi ngày.",
      ],
    },
    readingDensity: "compact",
    readingTheme: "future-ethics-lab",
    // Vietnamese reflection; English intentionally falls back to attributed key points.
    readingPages: { vi: MUON_KIEP_NHAN_SINH_3_PAGES },
  },
] satisfies LibraryBook[]).sort(
  (left, right) =>
    (MASTER_COLLECTION_INDEX.get(left.slug) ?? Number.MAX_SAFE_INTEGER)
    - (MASTER_COLLECTION_INDEX.get(right.slug) ?? Number.MAX_SAFE_INTEGER),
);
