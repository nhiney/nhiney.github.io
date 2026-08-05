"use client";

import { useState, type ReactNode } from "react";
import styles from "./SilenceDesignPreview.module.css";

type OptionId = 1 | 2 | 3;
type PreviewMode = "light" | "dark";

const OPTIONS: Array<{ id: OptionId; name: string; note: string }> = [
  { id: 1, name: "Sổ chứng cứ", note: "Trục dọc · số lớn · nhịp đọc rõ" },
  { id: 2, name: "Khung phim", note: "Bố cục ngang · tương phản điện ảnh" },
  { id: 3, name: "Bản đồ điều tra", note: "La bàn chữ · đối chiếu hai phía" },
];

const LEDGER_ROWS = [
  ["Điều đã biết", "Ghi lại sự kiện, hành vi và dữ kiện đã được xác nhận."],
  ["Điều đang đoán", "Nhận diện giả thuyết đang hình thành, chưa biến nó thành sự thật."],
  ["Điều còn thiếu", "Xác định khoảng trống thông tin trước khi đi đến kết luận."],
  ["Bước kiểm tra", "Đặt một câu hỏi có thể kiểm chứng ở lần trao đổi tiếp theo."],
] as const;

const COURAGE_STEPS = [
  ["Nỗi sợ", "báo hiệu nguy hiểm"],
  ["Sự nhạy cảm", "giúp nhìn thấy chi tiết"],
  ["Kỷ luật", "giữ mình không phản ứng vội"],
  ["Mục tiêu", "nhắc mình vì sao phải bước tiếp"],
  ["Hành động", "thực hiện bước nhỏ và rõ ràng"],
] as const;

const HELP_ROWS = [
  ["Hỏi người kia đang cần gì", "Tự quyết định thay họ"],
  ["Nói rõ mình có thể giúp đến đâu", "Hứa nhiều hơn khả năng"],
  ["Chia sẻ trách nhiệm", "Ôm toàn bộ vấn đề"],
  ["Vẫn giữ sức khỏe và ranh giới", "Kiệt sức rồi oán trách"],
] as const;

const EVIDENCE_STEPS = [
  ["Nhìn thấy", "Ghi nhận sự thật thuần túy, không thêm ý nghĩa."],
  ["Đặt giả thuyết", "Nêu vài khả năng có thể xảy ra, chưa chọn vội."],
  ["Kiểm tra", "Tìm thêm dữ liệu và đối chiếu với điều còn thiếu."],
  ["Sửa lại", "Cập nhật cách hiểu khi bằng chứng thay đổi."],
] as const;

const SAFE_PATH = [
  ["Đặt ranh giới rõ ràng", "Cho người kia quyền nói, im lặng và chưa sẵn sàng."],
  ["Giữ bí mật", "Không biến điều riêng tư thành lợi thế trong tranh cãi."],
  ["Cho họ lựa chọn", "Hỏi điều họ cần thay vì quyết định thay."],
] as const;

const RISK_PATH = [
  ["Thử ranh giới liên tục", "Đẩy người kia đi xa hơn mức họ từng chấp nhận."],
  ["Dùng thông tin làm lợi thế", "Nhắc lại điều dễ tổn thương để gây áp lực."],
  ["Khiến họ phụ thuộc", "Làm yếu những kết nối giúp họ giữ quyền lựa chọn."],
] as const;

function PageMeta({ section, label }: { section: string; label: string }) {
  return (
    <div className={styles.pageMeta}>
      <span>{section}</span>
      <span>{label}</span>
    </div>
  );
}

function Folio({ children }: { children: ReactNode }) {
  return <span className={styles.folio}>{children}</span>;
}

function OptionOne() {
  return (
    <div className={styles.spread} aria-label="Phương án 1 — Sổ chứng cứ">
      <article className={styles.page}>
        <PageMeta section="Hồ sơ 04" label="Phương pháp đọc" />
        <div className={styles.pageIntro}>
          <p className={styles.kicker}>Sổ tay bằng chứng</p>
          <h2 className={styles.pageTitle}>Tách điều nhìn thấy khỏi điều mình đoán</h2>
          <p className={styles.deck}>Một chi tiết có thể là manh mối, nhưng hiếm khi đủ để kết luận toàn bộ con người.</p>
        </div>

        <ol className={styles.ledger}>
          {LEDGER_ROWS.map(([label, detail], index) => (
            <li key={label}>
              <span className={styles.ledgerNumber}>{String(index + 1).padStart(2, "0")}</span>
              <div className={styles.ledgerCopy}>
                <h3>{label}</h3>
                <p>{detail}</p>
              </div>
            </li>
          ))}
        </ol>
        <Folio>14</Folio>
      </article>

      <article className={styles.page}>
        <PageMeta section="Hồ sơ 02" label="Tâm lý và động lực" />
        <div className={styles.pageIntro}>
          <p className={styles.kicker}>Bên trong lòng can đảm</p>
          <h2 className={styles.pageTitle}>Năm chuyển động trước khi mình bước tiếp</h2>
          <p className={styles.deck}>Can đảm không phải là hết sợ. Đó là giữ đủ tỉnh táo để lựa chọn hành động.</p>
        </div>

        <ol className={styles.spine}>
          {COURAGE_STEPS.map(([label, detail], index) => (
            <li key={label}>
              <span className={styles.spineNumber}>{String(index + 1).padStart(2, "0")}</span>
              <span className={styles.spineRail} aria-hidden><i /></span>
              <div>
                <h3>{label}</h3>
                <p>{detail}</p>
              </div>
            </li>
          ))}
        </ol>
        <Folio>15</Folio>
      </article>
    </div>
  );
}

function OptionTwo() {
  return (
    <div className={`${styles.spread} ${styles.cinematic}`} aria-label="Phương án 2 — Khung phim">
      <article className={styles.page}>
        <PageMeta section="Hồ sơ 11" label="Giới hạn và chăm sóc" />
        <div className={styles.pageIntroCompact}>
          <span className={styles.chapterCode}>P1—07</span>
          <h2 className={styles.pageTitle}>Giới hạn không phải là lạnh lùng</h2>
          <p className={styles.deck}>Phân biệt giữa quan tâm lành mạnh và xu hướng muốn “cứu” người khác.</p>
        </div>

        <div className={styles.comparison} role="table" aria-label="Phân biệt hai cách giúp đỡ">
          <section role="rowgroup">
            <h3>Quan tâm lành mạnh</h3>
            {HELP_ROWS.map(([healthy]) => <p key={healthy} role="cell">{healthy}</p>)}
          </section>
          <section role="rowgroup">
            <h3>Cố làm người cứu hộ</h3>
            {HELP_ROWS.map(([, rescuer]) => <p key={rescuer} role="cell">{rescuer}</p>)}
          </section>
        </div>

        <blockquote className={styles.pullQuote}>Sự giúp đỡ bền nhất là biết mình có thể làm gì và dừng ở đâu.</blockquote>
        <Folio>34</Folio>
      </article>

      <article className={styles.page}>
        <PageMeta section="Hồ sơ 04" label="Tư duy điều tra" />
        <div className={styles.filmHeading}>
          <span aria-hidden>04</span>
          <div>
            <p className={styles.kicker}>Bốn bước giữ mình tỉnh táo</p>
            <h2 className={styles.pageTitle}>Đừng để một câu chuyện tròn trịa thay bằng chứng</h2>
          </div>
        </div>

        <ol className={styles.filmSteps}>
          {EVIDENCE_STEPS.map(([label, detail], index) => (
            <li key={label}>
              <span className={styles.filmNumber}>{String(index + 1).padStart(2, "0")}</span>
              <h3>{label}</h3>
              <p>{detail}</p>
              <span className={`${styles.filmTrack} ${styles[`filmTrack${index + 1}`]}`} aria-hidden><i /></span>
            </li>
          ))}
        </ol>
        <Folio>35</Folio>
      </article>
    </div>
  );
}

function OptionThree() {
  return (
    <div className={`${styles.spread} ${styles.cartographic}`} aria-label="Phương án 3 — Bản đồ điều tra">
      <article className={styles.page}>
        <PageMeta section="Hồ sơ 07" label="Đọc căn phòng" />
        <div className={styles.pageIntro}>
          <p className={styles.kicker}>La bàn quyền lực</p>
          <h2 className={styles.pageTitle}>Bản đồ quyền lực trong một căn phòng</h2>
          <p className={styles.deck}>Nhìn thấy cấu trúc không phải để nghi ngờ tất cả, mà để biết cuộc trò chuyện đang lệch ở đâu.</p>
        </div>

        <div className={styles.compass} aria-label="Bốn nguồn quyền lực quanh mình">
          <div className={styles.compassTop}><strong>Địa vị</strong><span>Ai có quyền chốt?</span></div>
          <div className={styles.compassLeft}><strong>Người hỗ trợ</strong><span>Ai giúp tiếng nói được nghe?</span></div>
          <div className={styles.compassCenter}><em>Mình</em></div>
          <div className={styles.compassRight}><strong>Thông tin</strong><span>Ai biết điều người khác đang cần?</span></div>
          <div className={styles.compassBottom}><strong>Quyền rời đi</strong><span>Ai có thể dừng cuộc trao đổi?</span></div>
        </div>

        <p className={styles.marginNote}>Quyền lực và hậu quả càng nằm xa nhau, nhu cầu làm rõ trách nhiệm càng lớn.</p>
        <Folio>42</Folio>
      </article>

      <article className={styles.page}>
        <PageMeta section="Hồ sơ 06" label="Thấu hiểu và kiểm soát" />
        <div className={styles.pageIntro}>
          <p className={styles.kicker}>Hai con đường trước mặt</p>
          <h2 className={styles.pageTitle}>Nhìn thấy điểm yếu không đồng nghĩa với thấu hiểu</h2>
          <p className={styles.deck}>Khả năng nhìn thấu một người chỉ có giá trị khi quyền lựa chọn của họ vẫn được giữ lại.</p>
        </div>

        <div className={styles.paths}>
          <section>
            <h3>Giữ an toàn</h3>
            {SAFE_PATH.map(([label, detail]) => (
              <div key={label}>
                <strong>{label}</strong>
                <p>{detail}</p>
              </div>
            ))}
          </section>
          <section className={styles.riskPath}>
            <h3>Khai thác</h3>
            {RISK_PATH.map(([label, detail]) => (
              <div key={label}>
                <strong>{label}</strong>
                <p>{detail}</p>
              </div>
            ))}
          </section>
        </div>

        <blockquote className={styles.axisQuote}>Thấu hiểu thật sự không khiến người khác cảm thấy bị lột trần.</blockquote>
        <Folio>43</Folio>
      </article>
    </div>
  );
}

export function SilenceDesignPreview() {
  const [selected, setSelected] = useState<OptionId>(1);
  const [mode, setMode] = useState<PreviewMode>("dark");
  const active = OPTIONS.find((option) => option.id === selected) ?? OPTIONS[0];

  return (
    <div className={styles.lab} data-preview-mode={mode}>
      <header className={styles.labHeader}>
        <div>
          <p className={styles.labEyebrow}>Sự Im Lặng Của Bầy Cừu · Design preview</p>
          <h1>Ba cách kể cùng một nội dung</h1>
          <p>Chuyển phương án và chế độ màu để so sánh trực tiếp trước khi áp dụng vào toàn bộ cuốn sách.</p>
        </div>

        <div className={styles.modeSwitch} aria-label="Chọn chế độ màu">
          <button type="button" aria-pressed={mode === "light"} onClick={() => setMode("light")}>Sáng</button>
          <button type="button" aria-pressed={mode === "dark"} onClick={() => setMode("dark")}>Tối</button>
        </div>
      </header>

      <nav className={styles.optionTabs} role="tablist" aria-label="Ba phương án thiết kế">
        {OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={selected === option.id}
            aria-controls="silence-design-panel"
            onClick={() => setSelected(option.id)}
          >
            <span>{String(option.id).padStart(2, "0")}</span>
            <strong>{option.name}</strong>
            <small>{option.note}</small>
          </button>
        ))}
      </nav>

      <section
        id="silence-design-panel"
        className={styles.stage}
        role="tabpanel"
        aria-label={`Phương án ${active.id}: ${active.name}`}
      >
        {selected === 1 ? <OptionOne /> : null}
        {selected === 2 ? <OptionTwo /> : null}
        {selected === 3 ? <OptionThree /> : null}
      </section>

      <p className={styles.selectionHint}>Sau khi xem, bạn chỉ cần nhắn: “chọn phương án {selected}”.</p>
    </div>
  );
}
