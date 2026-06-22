// The curated shelf — the books the user has actually read. This is the single
// source of truth for the /library galaxy (NOT the blog). Each book shows a real
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
  /** Curated short-form pages for the flipbook, preferred over blog excerpts. */
  readingPages?: Partial<Record<"en" | "vi", BookReadingPage[]>>;
}

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
        "Don't criticize, condemn, or complain — it only puts people on the defensive.",
        "Give honest, sincere appreciation; everyone hungers to feel important.",
        "Talk in terms of the other person's interests, and let them do the talking.",
        "Remember a person's name — to them it's the sweetest sound in any language.",
        "To win an argument, avoid it; let the other person save face.",
      ],
      vi: [
        "Đừng chỉ trích, oán trách hay than phiền — điều đó chỉ khiến người ta phòng thủ.",
        "Hãy khen ngợi thật lòng; ai cũng khao khát cảm giác được coi trọng.",
        "Nói về điều người kia quan tâm, và để họ được nói nhiều hơn.",
        "Nhớ tên một người — với họ đó là âm thanh ngọt ngào nhất.",
        "Muốn thắng tranh cãi thì hãy tránh nó, và giữ thể diện cho đối phương.",
      ],
    },
  },
  {
    slug: "atomic-habits",
    title: "Atomic Habits",
    titleEn: "Atomic Habits",
    author: "James Clear",
    cover: "/books/atomic-habits.webp",
    hue: 36,
    saturation: 28,
    lightness: 60,
    foil: "#6B4E2E",
    scale: 1.04,
    keyPoints: {
      en: [
        "Tiny 1% improvements compound into remarkable results over time.",
        "You don't rise to your goals; you fall to the level of your systems.",
        "Build identity-based habits: become the type of person who does it.",
        "Make it obvious, attractive, easy, and satisfying.",
        "Environment design beats willpower — shape the space, not the urge.",
      ],
      vi: [
        "Những tiến bộ 1% nhỏ bé tích lũy thành kết quả đáng kinh ngạc theo thời gian.",
        "Bạn không vươn tới mục tiêu, bạn rơi xuống mức của hệ thống mình tạo ra.",
        "Xây thói quen dựa trên bản sắc: trở thành kiểu người làm điều đó.",
        "Làm cho nó rõ ràng, hấp dẫn, dễ dàng và thỏa mãn.",
        "Thiết kế môi trường mạnh hơn ý chí — hãy sửa không gian, đừng ép ham muốn.",
      ],
    },
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
        "A young FBI trainee bargains with one monster to catch another.",
        "Clarice Starling's quiet courage is the real engine of the story.",
        "Hannibal Lecter is terrifying because he is brilliant and polite.",
        "We confront our fears the way Clarice confronts the screaming lambs.",
        "Evil here is intimate, psychological — never cartoonish.",
      ],
      vi: [
        "Một nữ tập sự FBI mặc cả với một con quái vật để truy bắt con quái vật khác.",
        "Lòng can đảm thầm lặng của Clarice Starling mới là động cơ thật của câu chuyện.",
        "Hannibal Lecter đáng sợ vì hắn vừa thông tuệ vừa lịch thiệp.",
        "Ta đối diện nỗi sợ như cách Clarice đối diện tiếng kêu của bầy cừu.",
        "Cái ác ở đây riêng tư, thuộc về tâm lý — không hề cường điệu.",
      ],
    },
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
      en: "Law #1: Never outshine the master. Talent is powerful, but flashing it in front of someone above you can turn admiration into fear. Let them feel like the sun, and use your brilliance to make their power look stronger.",
      vi: "Quy luật #1: Đừng bao giờ chơi trội quan thầy. Tỏa sáng rực rỡ đôi khi lại là một \"tội ác\". Khi bạn làm lu mờ người đang cầm quyền, bạn vô tình thắp lên ngọn lửa ghen tị có thể thiêu rụi chính mình.",
    },
    keyPoints: {
      en: [
        "Make people above you feel secure, respected, and irreplaceable.",
        "Give credit upward before showing your own strength.",
        "Use your talent to make the leader look better, not smaller.",
        "Never embarrass a powerful person in public.",
        "Reveal ambition only at the right time, to the right audience.",
      ],
      vi: [
        "Làm cho người ở trên cảm thấy an toàn, được tôn trọng và không thể thay thế.",
        "Ghi nhận công lao của cấp trên trước khi thể hiện năng lực của mình.",
        "Dùng tài năng để làm họ nổi bật hơn, không phải nhỏ bé đi.",
        "Đừng bao giờ khiến người có quyền lực mất mặt trước người khác.",
        "Giữ tham vọng trong tầm kiểm soát, chỉ bộc lộ đúng lúc và đúng người.",
      ],
    },
    readingPages: {
      en: [
        {
          heading: "The Hidden Trap Behind Talent",
          paragraphs: [
            "Being excellent is not the danger. Displaying excellence without reading the room is. People above you often need to feel safe, respected, and still in control. When your intelligence or results make them feel replaceable, admiration can quietly become suspicion.",
            "The art is not to shrink yourself forever. It is to make your strength serve the larger stage. Let the person in power feel that your work confirms their judgment, not that it exposes their weakness.",
          ],
        },
        {
          heading: "Fouquet's Fatal Performance",
          paragraphs: [
            "Nicolas Fouquet, finance minister to Louis XIV, hosted a spectacular party to prove his loyalty and brilliance. The estate, the food, the art, and the guests all announced one thing: Fouquet was extraordinary.",
            "But to the king, the message landed differently. A servant had outshone the monarch. Soon after, Fouquet was arrested and spent the rest of his life in prison. His talent did not destroy him; his failure to protect the king's ego did.",
          ],
        },
        {
          heading: "How To Practice It Today",
          paragraphs: [
            "In a meeting, do not make your manager look slow so you can look sharp. Frame your idea as an extension of their direction. Give them credit for the opening, then add your contribution with precision.",
            "Ask for advice even when you already see the answer. Share enough brilliance to be trusted, but not so much vanity that you become a threat. The quiet strategist helps power feel stronger, then rises with it.",
          ],
        },
      ],
      vi: [
        {
          heading: "Cái Bẫy Nguy Hiểm Của Tài Năng",
          paragraphs: [
            "Bạn tài năng, thông minh và muốn chứng minh giá trị của mình. Nhưng trong môi trường có quyền lực, tài năng phô diễn sai cách có thể trở thành tín hiệu nguy hiểm. Người ở vị trí cao hơn thường muốn cảm thấy an toàn, tài giỏi và không thể bị thay thế.",
            "Vì vậy, vấn đề không phải là che giấu năng lực mãi mãi. Vấn đề là dùng năng lực thật tinh tế: làm cho người đứng trên cảm thấy quyền lực của họ được củng cố nhờ bạn, chứ không phải bị bạn làm lu mờ.",
          ],
        },
        {
          heading: "Bài Học Từ Nicolas Fouquet",
          paragraphs: [
            "Nicolas Fouquet, Bộ trưởng Tài chính dưới thời vua Louis XIV, từng tổ chức một bữa tiệc xa hoa tại lâu đài riêng để chứng minh lòng trung thành và tài năng của mình. Mọi thứ trong đêm đó đều rực rỡ: kiến trúc, nghệ thuật, ẩm thực và sự ngưỡng mộ của giới quý tộc.",
            "Nhưng với nhà vua, đó không còn là lòng trung thành. Đó là một bề tôi đang tỏa sáng hơn cả quân vương. Ngay sau buổi tiệc, Fouquet bị bắt và sau đó sống phần đời còn lại trong tù. Ông không thất bại vì kém tài, mà vì đã chạm vào lòng tự tôn của người nắm quyền.",
          ],
        },
        {
          heading: "Ứng Dụng Trong Công Việc",
          paragraphs: [
            "Khi dự án thành công, hãy khéo léo ghi nhận định hướng của cấp trên trước khi nói về phần mình đóng góp. Khi có ý tưởng tốt, đừng trình bày như thể mọi người còn lại đều sai; hãy biến nó thành bước tiếp theo từ mục tiêu mà lãnh đạo đã đặt ra.",
            "Đôi khi, việc xin lời khuyên cũng là một cách giữ cân bằng quyền lực. Bạn vẫn thể hiện được năng lực, nhưng đồng thời cho người ở trên cảm giác họ được tôn trọng. Người khôn ngoan không nhất thiết phải đứng dưới ánh đèn mạnh nhất; họ biết điều khiển ánh sáng để cùng đi lên.",
          ],
        },
      ],
    },
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
        "Two systems run the mind: fast intuitive System 1, slow deliberate System 2.",
        "Most of the time we let the lazy fast brain decide — and it loves shortcuts.",
        "Biases like anchoring and availability quietly distort our judgments.",
        "We fear losses far more than we value equivalent gains.",
        "The remembering self, not the experiencing self, writes our life's story.",
      ],
      vi: [
        "Trí óc vận hành bằng hai hệ: Hệ 1 nhanh và trực giác, Hệ 2 chậm và lý trí.",
        "Phần lớn thời gian ta để bộ não nhanh lười biếng quyết định — và nó thích đi đường tắt.",
        "Các thiên kiến như mỏ neo và tính sẵn có âm thầm làm méo mó phán đoán.",
        "Ta sợ mất mát hơn nhiều so với niềm vui từ một khoản lợi tương đương.",
        "Cái tôi ghi nhớ, chứ không phải cái tôi trải nghiệm, viết nên câu chuyện đời ta.",
      ],
    },
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
        "We don't need most of what we own — and owning less frees the mind.",
        "Minimalism isn't a goal; it's a tool for noticing what truly matters.",
        "Every object asks for a little attention; fewer things, more presence.",
        "Let go of the things you keep 'just in case' and for who you used to be.",
        "Less stuff makes room for gratitude, time, and the people you love.",
      ],
      vi: [
        "Ta không cần phần lớn những thứ mình sở hữu — và sở hữu ít đi giúp tâm trí nhẹ nhõm.",
        "Tối giản không phải đích đến; nó là công cụ để nhận ra điều thật sự quan trọng.",
        "Mỗi món đồ đều đòi một chút chú tâm; ít đồ hơn, hiện diện nhiều hơn.",
        "Hãy buông những thứ giữ lại 'phòng khi cần' và để níu con người cũ của mình.",
        "Ít đồ đạc lại nhường chỗ cho lòng biết ơn, thời gian và những người ta thương.",
      ],
    },
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
        "Through Thomas's many lives, the law of cause and effect is never broken.",
        "Every thought and deed plants a seed we will one day harvest.",
        "Ancient Atlantis fell not from disaster but from misused power and greed.",
        "The soul keeps returning to learn the lessons it once refused.",
        "What we do to others, we are ultimately doing to ourselves.",
      ],
      vi: [
        "Qua muôn kiếp của Thomas, luật nhân quả chưa bao giờ sai chạy.",
        "Mỗi ý nghĩ và hành động đều gieo một hạt giống mà ngày nào đó ta sẽ gặt.",
        "Atlantis xưa sụp đổ không vì thiên tai mà vì quyền lực bị lạm dụng và lòng tham.",
        "Linh hồn cứ trở lại để học cho xong bài học nó từng chối bỏ.",
        "Điều ta làm với người khác, rốt cuộc là đang làm với chính mình.",
      ],
    },
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
        "Collective karma binds whole nations, not just individuals.",
        "An age of upheaval is also an age to awaken and choose differently.",
        "Healing the body begins with healing the mind and the heart.",
        "Compassion and gratitude are the fastest way to settle old debts.",
        "We are never punished for our actions, but by them.",
      ],
      vi: [
        "Cộng nghiệp ràng buộc cả một dân tộc, không chỉ riêng từng cá nhân.",
        "Thời đại biến động cũng là thời để thức tỉnh và lựa chọn khác đi.",
        "Chữa lành thân thể bắt đầu từ việc chữa lành tâm trí và trái tim.",
        "Lòng từ bi và biết ơn là cách nhanh nhất để trả những món nợ xưa.",
        "Ta không bị trừng phạt vì hành động của mình, mà bởi chính chúng.",
      ],
    },
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
        "Free will is the door: we are always choosing the seeds of our next life.",
        "Knowing the law of karma turns fear into responsibility.",
        "Service to others is the surest path to lighten one's own burden.",
        "The purpose of every life is for the soul to learn, grow, and love.",
        "Peace comes when we stop resisting the lessons life keeps offering.",
      ],
      vi: [
        "Tự do ý chí là cánh cửa: ta luôn đang gieo hạt cho kiếp sống kế tiếp.",
        "Hiểu luật nhân quả biến nỗi sợ thành trách nhiệm.",
        "Phụng sự người khác là con đường chắc chắn nhất để nhẹ gánh cho chính mình.",
        "Mục đích của mỗi kiếp là để linh hồn học hỏi, trưởng thành và yêu thương.",
        "Bình an đến khi ta thôi chống lại những bài học mà cuộc đời cứ trao.",
      ],
    },
  },
];
