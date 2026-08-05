export type DacIllustrationTone = "before" | "after" | "neutral";

export type DacIllustrationBlock =
  | { kind: "paragraph"; text: string }
  | { kind: "label"; text: string }
  | { kind: "quote"; text: string; tone: DacIllustrationTone }
  | { kind: "bullets"; items: string[] }
  | { kind: "takeaway"; label?: string; text: string };

export interface DacIllustration {
  title: string;
  blocks: DacIllustrationBlock[];
}

export const DAC_ILLUSTRATIONS = {
  deadline: {
    title: "Khi đồng nghiệp liên tục trễ hạn",
    blocks: [
      { kind: "label", text: "Cách dễ khiến người nghe phòng thủ:" },
      { kind: "quote", tone: "before", text: "“Bạn lúc nào cũng thiếu trách nhiệm.”" },
      { kind: "label", text: "Thử nói rõ hơn:" },
      {
        kind: "quote",
        tone: "after",
        text: "“Hai tuần gần đây, phần việc của bạn đều trễ một đến hai ngày nên nhóm phải lùi lịch. Bạn đang gặp trở ngại gì? Mình cần biết để cùng thống nhất một thời hạn khả thi hơn.”",
      },
      {
        kind: "takeaway",
        label: "Điểm khác biệt",
        text: "Câu đầu phán xét con người. Câu sau mô tả sự việc, cho người kia cơ hội giải thích nhưng vẫn giữ trách nhiệm rõ ràng.",
      },
    ],
  },
  "child-recognition": {
    title: "Khi ghi nhận một đứa trẻ",
    blocks: [
      { kind: "paragraph", text: "Thay vì chỉ nói:" },
      { kind: "quote", tone: "before", text: "“Con giỏi quá!”" },
      { kind: "paragraph", text: "Hãy thử cụ thể hơn:" },
      {
        kind: "quote",
        tone: "after",
        text: "“Mẹ thấy con đã tự cất đồ chơi sau khi chơi xong. Nhờ vậy căn phòng gọn hơn và mẹ không phải nhắc. Mẹ rất vui vì con biết giữ lời.”",
      },
      {
        kind: "paragraph",
        text: "Lời ghi nhận cụ thể giúp trẻ hiểu hành động nào đáng được tiếp tục. Nó cũng tránh việc khiến trẻ nghĩ mình chỉ có giá trị khi được người lớn đánh giá là “giỏi”.",
      },
    ],
  },
  "money-disagreement": {
    title: "Khi hai người bất đồng về tiền bạc",
    blocks: [
      { kind: "label", text: "Cách dễ đẩy cuộc trò chuyện thành tranh cãi:" },
      { kind: "quote", tone: "before", text: "“Bạn lúc nào cũng tiêu tiền theo cảm xúc.”" },
      { kind: "label", text: "Một cách mở lời khác:" },
      {
        kind: "quote",
        tone: "after",
        text: "“Mình cũng muốn chuyến đi này thật vui, nhưng mình đang lo tổng chi phí vượt quá khả năng của hai đứa. Điều gì trong chuyến đi quan trọng nhất với bạn? Mình thử giữ phần đó và tìm cách giảm những khoản còn lại nhé?”",
      },
      {
        kind: "takeaway",
        text: "Hai người vẫn có thể chưa đồng ý ngay. Nhưng thay vì chống lại nhau, họ bắt đầu đứng cùng một phía để giải quyết vấn đề.",
      },
    ],
  },
  "friend-resignation": {
    title: "Khi một người bạn muốn nghỉ việc",
    blocks: [
      { kind: "paragraph", text: "Người bạn nói:" },
      { kind: "quote", tone: "neutral", text: "“Mình mệt quá, chắc mình nghỉ việc.”" },
      { kind: "paragraph", text: "Phản ứng quen thuộc có thể là:" },
      { kind: "quote", tone: "before", text: "“Đừng nghỉ. Bây giờ tìm việc khó lắm.”" },
      { kind: "paragraph", text: "Trước khi khuyên, hãy thử hỏi:" },
      {
        kind: "quote",
        tone: "after",
        text: "“Bạn muốn mình chỉ lắng nghe hay cùng bạn cân nhắc các lựa chọn? Điều gì ở công việc hiện tại khiến bạn kiệt sức nhất?”",
      },
      {
        kind: "paragraph",
        text: "Có thể người bạn chưa cần quyết định ngay. Điều họ cần trước tiên là hiểu rõ mình đang mệt vì khối lượng công việc, cách quản lý hay vì công việc không còn phù hợp.",
      },
    ],
  },
  "remember-detail": {
    title: "Nhớ một chi tiết nhỏ",
    blocks: [
      {
        kind: "paragraph",
        text: "Trong lần gặp trước, một đồng nghiệp kể rằng họ đang tập thuyết trình vì thường rất lo khi đứng trước đông người.",
      },
      {
        kind: "paragraph",
        text: "Một tuần sau, thay vì chỉ hỏi “Dạo này sao rồi?”, mình có thể hỏi:",
      },
      {
        kind: "quote",
        tone: "after",
        text: "“Buổi thuyết trình hôm trước của bạn thế nào? Phần mở đầu mà bạn luyện có giúp bạn bớt căng thẳng không?”",
      },
      {
        kind: "paragraph",
        text: "Điều khiến người kia ấm lòng không phải trí nhớ xuất sắc của mình. Đó là cảm giác câu chuyện của họ không biến mất ngay sau khi cuộc trò chuyện kết thúc.",
      },
      { kind: "paragraph", text: "Nếu không nhớ chắc, cứ thành thật:" },
      {
        kind: "quote",
        tone: "neutral",
        text: "“Mình nhớ bạn có một buổi thuyết trình quan trọng, nhưng không chắc là hôm nào.”",
      },
    ],
  },
  "course-sale": {
    title: "Khi bán một khóa học",
    blocks: [
      { kind: "label", text: "Tạo áp lực:" },
      {
        kind: "quote",
        tone: "before",
        text: "“Chỉ còn một suất cuối cùng. Nếu không đóng tiền ngay hôm nay, bạn sẽ bỏ lỡ cơ hội thay đổi cuộc đời.”",
      },
      { kind: "label", text: "Thuyết phục minh bạch:" },
      {
        kind: "quote",
        tone: "after",
        text: "“Khóa học phù hợp với người đã có kiến thức cơ bản và có thể dành khoảng ba giờ mỗi tuần. Đây là học phí, nội dung và chính sách hoàn tiền. Nếu bạn chưa chắc, hãy xem kỹ trước khi quyết định.”",
      },
      {
        kind: "takeaway",
        text: "Cách thứ hai có thể khiến một số người không mua. Nhưng những người đồng ý sẽ biết rõ mình đang chọn gì. Niềm tin lâu dài có giá trị hơn một quyết định được tạo ra bằng sự sợ hãi.",
      },
    ],
  },
  "hesitant-overtime": {
    title: "Khi nhân viên nói “được” nhưng có vẻ do dự",
    blocks: [
      { kind: "paragraph", text: "Người quản lý hỏi:" },
      { kind: "quote", tone: "neutral", text: "“Cuối tuần này em ở lại làm thêm được chứ?”" },
      { kind: "paragraph", text: "Nhân viên im lặng vài giây rồi trả lời:" },
      { kind: "quote", tone: "before", text: "“Dạ… chắc được ạ.”" },
      {
        kind: "paragraph",
        text: "Thay vì xem đó là sự đồng ý rõ ràng, người quản lý có thể nói:",
      },
      {
        kind: "quote",
        tone: "after",
        text: "“Anh thấy em còn do dự. Nếu cuối tuần em có việc riêng, em có thể từ chối mà không bị đánh giá. Em cần thêm thời gian xem lại lịch không?”",
      },
      {
        kind: "takeaway",
        text: "Quyền từ chối chỉ có ý nghĩa khi người kia tin rằng câu trả lời “không” sẽ không khiến họ bị trừng phạt hoặc mất thiện cảm.",
      },
    ],
  },
  "invoice-mistake": {
    title: "Khi một thành viên gửi nhầm hóa đơn",
    blocks: [
      { kind: "label", text: "Phê bình trước cả nhóm:" },
      { kind: "quote", tone: "before", text: "“Lỗi đơn giản thế này mà cũng để xảy ra được à?”" },
      {
        kind: "paragraph",
        text: "Câu nói có thể khiến người mắc lỗi xấu hổ nhưng chưa chắc giúp họ biết cách tránh lặp lại.",
      },
      { kind: "label", text: "Trao đổi riêng:" },
      {
        kind: "quote",
        tone: "after",
        text: "“Hóa đơn sáng nay bị gửi sai số tài khoản nên khách hàng chưa thể thanh toán. Bạn kể lại giúp mình các bước đã làm nhé. Chúng ta xem cần thêm bước kiểm tra nào trước khi gửi.”",
      },
      { kind: "paragraph", text: "Sau khi sửa lỗi, người quản lý có thể ghi nhận sự cải thiện:" },
      {
        kind: "quote",
        tone: "after",
        text: "“Ba hóa đơn tuần này đều chính xác. Bước kiểm tra mới đang phát huy tác dụng.”",
      },
      {
        kind: "takeaway",
        text: "Lãnh đạo tốt không làm lỗi sai biến mất bằng sự sợ hãi. Họ biến nó thành một quy trình tốt hơn.",
      },
    ],
  },
  "safety-boundary": {
    title: "Khi tình huống không còn là vấn đề giao tiếp",
    blocks: [
      {
        kind: "paragraph",
        text: "Một người liên tục gửi tin nhắn xúc phạm dù mình đã yêu cầu họ dừng lại.",
      },
      {
        kind: "paragraph",
        text: "Đây không còn là lúc tìm một câu nói khéo hơn để được tôn trọng. Mình có thể:",
      },
      {
        kind: "bullets",
        items: [
          "Lưu lại tin nhắn.",
          "Nói rõ rằng mình không tiếp tục cuộc trao đổi.",
          "Chặn liên lạc nếu cần.",
          "Báo cho người có trách nhiệm hoặc tìm sự hỗ trợ.",
          "Không gặp riêng nếu cảm thấy không an toàn.",
        ],
      },
      {
        kind: "takeaway",
        text: "Kỹ năng giao tiếp không thay thế biện pháp bảo vệ. Khi ranh giới đã được nói rõ nhưng vẫn liên tục bị vượt qua, việc rời đi có thể phù hợp hơn tiếp tục thuyết phục.",
      },
    ],
  },
  "family-loan": {
    title: "Khi người thân muốn vay một khoản tiền lớn",
    blocks: [
      {
        kind: "paragraph",
        text: "Mình có thể hiểu khó khăn của họ nhưng vẫn không đủ khả năng cho vay.",
      },
      {
        kind: "quote",
        tone: "after",
        text: "“Mình hiểu bạn đang cần tiền gấp, nhưng mình không thể cho vay số tiền này vì nó ảnh hưởng đến khoản dự phòng của gia đình. Nếu bạn muốn, mình có thể cùng bạn xem lại các khoản cần ưu tiên hoặc tìm một phương án khác.”",
      },
      {
        kind: "paragraph",
        text: "Câu trả lời không lạnh lùng, nhưng cũng không hy sinh ranh giới chỉ vì sợ người kia buồn.",
      },
      {
        kind: "takeaway",
        text: "Quan tâm không phải lúc nào cũng đồng nghĩa với đáp ứng đúng điều người khác đang yêu cầu.",
      },
    ],
  },
  "sad-story": {
    title: "Khi một người kể chuyện buồn",
    blocks: [
      { kind: "paragraph", text: "Người kia nói:" },
      { kind: "quote", tone: "neutral", text: "“Dạo này mình thấy chẳng ai thật sự hiểu mình.”" },
      { kind: "paragraph", text: "Thay vì trả lời ngay:" },
      { kind: "quote", tone: "before", text: "“Đừng nghĩ nhiều, mọi chuyện rồi sẽ ổn.”" },
      { kind: "paragraph", text: "Hãy thử:" },
      {
        kind: "quote",
        tone: "after",
        text: "“Nghe như bạn đã phải giữ cảm giác này khá lâu. Chuyện gì khiến bạn thấy cô đơn nhất?”",
      },
      {
        kind: "paragraph",
        text: "Nếu họ im lặng, mình không nhất thiết phải lấp đầy khoảng trống. Có lúc sự hiện diện bình tĩnh mang lại nhiều an toàn hơn một câu động viên thật nhanh.",
      },
      {
        kind: "takeaway",
        text: "Lắng nghe không thể giải quyết mọi vấn đề, nhưng nó có thể giúp người kia cảm thấy mình không phải đối diện với câu chuyện hoàn toàn một mình.",
      },
    ],
  },
} satisfies Record<string, DacIllustration>;

export type DacIllustrationId = keyof typeof DAC_ILLUSTRATIONS;

const DAC_ILLUSTRATION_MARKER = /^\[\[dac-illustration:([a-z-]+)\]\]$/;

export function parseDacIllustrationMarker(block: string): DacIllustrationId | null {
  const id = block.match(DAC_ILLUSTRATION_MARKER)?.[1];
  return id && id in DAC_ILLUSTRATIONS ? id as DacIllustrationId : null;
}

export function dacIllustrationWeight(id: DacIllustrationId): number {
  const illustration = DAC_ILLUSTRATIONS[id];
  const contentWeight = illustration.blocks.reduce((total, block) => {
    if (block.kind === "bullets") {
      return total + block.items.reduce((sum, item) => sum + item.length + 26, 0);
    }
    const rhythm = block.kind === "quote" ? 64 : block.kind === "label" ? 28 : 38;
    return total + block.text.length + rhythm;
  }, 0);

  // The label, title, inset border and richer quote rhythm occupy more height
  // than their raw text length suggests. Cap the estimate because every box is
  // authored to remain one readable leaf.
  return Math.min(880, contentWeight + illustration.title.length + 145);
}
