"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./MuonKiep2DesignPreview.module.css";

type OptionId = 1 | 2 | 3;
type PreviewMode = "light" | "dark";

const OPTIONS: Array<{ id: OptionId; name: string; note: string }> = [
  { id: 1, name: "Vòng mở và gợn sóng", note: "Tổng quan · ảnh hưởng lan truyền" },
  { id: 2, name: "Khe ngắt và khung cửi", note: "Vòng lặp · văn hóa chung" },
  { id: 3, name: "Vết nứt và ngưỡng cửa", note: "Phục hồi · ranh giới an toàn" },
];

const OVERVIEW_POINTS = [
  "Tập 2 tiếp tục hành trình của Thomas qua nước Mỹ hiện đại, Assyria, Hy Lạp, Ba Tư, Ấn Độ và những trải nghiệm được sách mô tả như hành trình của linh hồn.",
  "Từ nhân quả cá nhân, cuốn sách mở rộng đến “cộng nghiệp”: nhiều lựa chọn nhỏ lặp lại có thể tạo nên văn hóa, hệ thống và hậu quả chung của cả cộng đồng.",
  "Những câu chuyện về chiến tranh và chinh phục đặt ra một câu hỏi gần gũi: khi nào khát vọng phát triển biến thành nhu cầu chứng minh mình bằng cách kiểm soát người khác?",
  "Chuyển hóa không phải phủ nhận tổn thương hay tự kết tội. Nó bắt đầu bằng việc nhìn ra vòng lặp, gọi đúng điều đã xảy ra và sửa phần mình có thể sửa.",
  "Thiền, lòng biết ơn và tha thứ có thể nâng đỡ tinh thần, nhưng không thay thế chăm sóc y khoa, trị liệu, pháp luật, ranh giới an toàn hay thay đổi xã hội cần thiết.",
] as const;

const LOOP_STEPS = [
  "Tác nhân",
  "Cảm giác trong cơ thể",
  "Câu chuyện bật lên trong đầu",
  "Phản ứng quen thuộc",
  "Hậu quả",
] as const;

const REPAIR_STEPS = [
  "Gọi đúng điều đã xảy ra",
  "Tạo lại sự an toàn",
  "Tìm người hỗ trợ phù hợp",
  "Xử lý cảm xúc theo nhịp của mình",
  "Chọn điều muốn mang theo",
] as const;

const FORGIVENESS_POINTS = [
  "Không quay lại mối quan hệ cũ.",
  "Giữ khoảng cách cần thiết.",
  "Yêu cầu người gây hại chịu trách nhiệm.",
  "Lưu lại bằng chứng.",
  "Tìm sự bảo vệ từ pháp luật hoặc cộng đồng.",
  "Chưa sẵn sàng nói chuyện trực tiếp.",
] as const;

function Folio({ children }: { children: ReactNode }) {
  return <span className={styles.folio}>{children}</span>;
}

function Leaf({
  children,
  className = "",
  folio,
  label,
}: {
  children: ReactNode;
  className?: string;
  folio: string;
  label: string;
}) {
  return (
    <article className={`${styles.leaf} ${className}`} aria-label={label}>
      <div className={styles.leafScroll}>{children}</div>
      <Folio>{folio}</Folio>
    </article>
  );
}

function PageHeading({ number, title }: { number?: string; title: string }) {
  return (
    <header className={styles.pageHeading}>
      {number ? <span>{number}</span> : null}
      <h2>{title}</h2>
    </header>
  );
}

function OptionOne() {
  return (
    <div className={`${styles.spread} ${styles.optionOne}`} aria-label="Phương án 1 — Vòng mở và gợn sóng">
      <Leaf folio="Tổng quan" label="Tổng quan Muôn Kiếp Nhân Sinh — Tập 2" className={styles.overviewLeaf}>
        <header className={styles.overviewHeading}>
          <p>Nguyên Phong</p>
          <h2>Muôn Kiếp Nhân Sinh — Tập 2</h2>
          <blockquote>Một vòng lặp không kết thúc khi mình hiểu vì sao nó tồn tại. Nó bắt đầu thay đổi khi mình lựa chọn hành động khác đi.</blockquote>
        </header>

        <ol className={styles.overviewRing}>
          {OVERVIEW_POINTS.map((point, index) => (
            <li key={point}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{point}</p>
            </li>
          ))}
        </ol>
      </Leaf>

      <Leaf folio="01" label="Một cánh bướm không tạo ra tất cả, nhưng nó vẫn tạo ra chuyển động" className={styles.rippleLeaf}>
        <PageHeading number="01" title="Một cánh bướm không tạo ra tất cả, nhưng nó vẫn tạo ra chuyển động" />
        <div className={styles.proseLead}>
          <p>Tập 2 mở rộng câu chuyện từ lựa chọn cá nhân đến những ảnh hưởng lan qua gia đình, cộng đồng và xã hội. Hình ảnh “cánh bướm rung động” gợi rằng một tác động nhỏ có thể đi xa hơn điều mình nhìn thấy.</p>
          <p>Ngoài đời, điều ấy có thể bắt đầu rất bình thường:</p>
          <p>Một người chia sẻ thông tin chưa kiểm chứng. Ba người khác tin và kể lại. Tin đồn nhanh chóng trở thành “điều ai cũng biết”, còn người bị nhắc đến phải sống với hậu quả của một câu chuyện không đúng.</p>
        </div>

        <ol className={styles.rippleSequence} aria-label="Chuỗi tác động của một hành động nhỏ">
          <li>Một hành động nhỏ</li>
          <li>Người khác phản ứng</li>
          <li>Hành vi được lặp lại</li>
          <li>Trở thành điều bình thường</li>
          <li>Tạo ra môi trường chung</li>
        </ol>

        <blockquote className={styles.pageHighlight}>Mình không thể kiểm soát toàn bộ chuỗi tác động. Nhưng trước khi nói, chia sẻ hoặc hành động, có thể hỏi: điều này đang nuôi thêm sự thật, lòng tin và an toàn—hay chỉ làm nỗi sợ lan nhanh hơn?</blockquote>
      </Leaf>
    </div>
  );
}

function OptionTwo() {
  return (
    <div className={`${styles.spread} ${styles.optionTwo}`} aria-label="Phương án 2 — Khe ngắt và khung cửi">
      <Leaf folio="02" label="Vòng lặp thường bắt đầu trước khi mình kịp nhận ra" className={styles.loopLeaf}>
        <PageHeading number="02" title="Vòng lặp thường bắt đầu trước khi mình kịp nhận ra" />
        <div className={styles.proseLead}>
          <p>Có những phản ứng diễn ra nhanh đến mức mình tưởng đó là tính cách: bị góp ý thì phòng thủ, cảm thấy bị bỏ rơi thì nhắn liên tục, căng thẳng thì mua sắm hoặc làm việc đến kiệt sức.</p>
          <p>Hãy tách một vòng lặp thành năm điểm:</p>
        </div>

        <ol className={styles.loopDiagram} aria-label="Năm điểm của một vòng lặp">
          {LOOP_STEPS.map((step, index) => (
            <li key={step}>
              <span>{index + 1}</span>
              <strong>{step}</strong>
            </li>
          ))}
          <li className={styles.breakPoint}><strong>Điểm ngắt</strong></li>
        </ol>

        <div className={styles.proseTail}>
          <p>Ví dụ, người yêu trả lời tin nhắn chậm. Ngực mình căng lên, đầu lập tức nghĩ “họ không còn quan tâm”, rồi mình gửi thêm nhiều tin trách móc. Cuộc trò chuyện sau đó trở nên nặng nề, càng củng cố nỗi sợ ban đầu.</p>
          <p>Điểm ngắt có thể rất nhỏ: đặt điện thoại xuống hai phút, gọi tên cảm giác hoặc hỏi lại thay vì kết luận.</p>
        </div>
        <blockquote className={styles.pageHighlight}>Hiểu vòng lặp không phải để trách mình. Nó giúp mình nhận ra khoảnh khắc vẫn còn quyền lựa chọn.</blockquote>
      </Leaf>

      <Leaf folio="03" label="Khi một phản ứng cá nhân trở thành văn hóa chung" className={styles.weaveLeaf}>
        <PageHeading number="03" title="Khi một phản ứng cá nhân trở thành văn hóa chung" />
        <div className={styles.proseLead}>
          <p>Cuốn sách sử dụng khái niệm “cộng nghiệp” để nói về hậu quả được tạo nên từ lựa chọn của nhiều người. Đây là cách diễn giải tâm linh; không nên dùng nó như lời giải thích duy nhất cho thiên tai, chiến tranh hay bệnh dịch.</p>
          <p>Phần gần gũi hơn có thể quan sát trong một tổ chức:</p>
          <p>Một nhân viên giấu sai sót vì sợ bị phạt. Quản lý không hỏi nguyên nhân mà chỉ tìm người chịu trách nhiệm. Những người khác nhìn thấy và cũng bắt đầu che giấu vấn đề. Cuối cùng, im lặng trở thành văn hóa của cả nhóm.</p>
        </div>

        <div className={styles.weaveFormula} aria-label="Công thức hình thành môi trường chung">
          <span>Nỗi sợ cá nhân</span>
          <i>+</i>
          <span>Cơ chế thưởng phạt</span>
          <i>+</i>
          <span>Hành vi được lặp lại</span>
          <i>=</i>
          <strong>Môi trường chung</strong>
        </div>

        <blockquote className={styles.pageHighlight}>Thay đổi cá nhân quan trọng, nhưng chưa đủ nếu hệ thống vẫn thưởng cho hành vi gây hại. Cần cả người dám nói thật lẫn một cơ chế khiến việc nói thật trở nên an toàn.</blockquote>
      </Leaf>
    </div>
  );
}

function OptionThree() {
  return (
    <div className={`${styles.spread} ${styles.optionThree}`} aria-label="Phương án 3 — Vết nứt và ngưỡng cửa">
      <Leaf folio="10" label="Chữa lành không bắt đầu bằng việc giả vờ mình đã ổn" className={styles.repairLeaf}>
        <PageHeading number="10" title="Chữa lành không bắt đầu bằng việc giả vờ mình đã ổn" />
        <div className={styles.proseLead}>
          <p>Ngôn ngữ chữa lành đôi khi khiến một người thấy có lỗi vì vẫn giận, sợ hoặc đau. Họ nghĩ mình phải nhanh chóng biết ơn, tha thứ và tìm ra bài học đẹp.</p>
          <p>Nhưng cảm xúc khó không phải dấu hiệu thất bại. Nó thường đang báo rằng một điều quan trọng đã bị tổn thương.</p>
        </div>

        <ol className={styles.repairSteps} aria-label="Con đường phục hồi">
          {REPAIR_STEPS.map((step, index) => (
            <li key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{step}</strong>
            </li>
          ))}
        </ol>

        <div className={styles.proseTail}>
          <p>Ví dụ, sau một môi trường làm việc gây kiệt sức, bước đầu chưa chắc là “biết ơn trải nghiệm”. Có thể chỉ là nghỉ ngơi, gặp chuyên gia, ghi lại sự việc và tìm nơi làm việc an toàn hơn.</p>
        </div>
        <blockquote className={styles.pageHighlight}>Chữa lành thật không buộc mình phải kể lại một câu chuyện đẹp trước khi vết thương được chăm sóc.</blockquote>
      </Leaf>

      <Leaf folio="11" label="Tha thứ có thể tháo nút thắt, nhưng không xóa ranh giới" className={styles.gateLeaf}>
        <PageHeading number="11" title="Tha thứ có thể tháo nút thắt, nhưng không xóa ranh giới" />
        <div className={styles.proseLead}>
          <p>Trong thế giới quan của sách, tha thứ và lòng từ bi giúp con người chuyển hóa những mối nợ cũ. Nhưng ngoài đời, tha thứ là một quá trình rất riêng và không thể bị ép buộc.</p>
          <p>Có thể tha thứ mà vẫn:</p>
        </div>

        <ul className={styles.boundaryList}>
          {FORGIVENESS_POINTS.map((point) => <li key={point}>{point}</li>)}
        </ul>

        <div className={styles.proseTail}>
          <p>Tha thứ không đồng nghĩa nói rằng điều đã xảy ra là không nghiêm trọng. Nó cũng không trao cho người gây tổn thương quyền tiếp tục bước vào đời mình.</p>
          <p className={styles.safetyLine}>Trong trường hợp bạo lực, lạm dụng hoặc đe dọa, ưu tiên đầu tiên là an toàn—not một hình ảnh đẹp về sự bao dung.</p>
        </div>
        <blockquote className={styles.pageHighlight}>Có những nút thắt được tháo bằng đối thoại. Có nút chỉ được tháo khi mình ngừng để sợi dây ấy tiếp tục siết mình.</blockquote>
      </Leaf>
    </div>
  );
}

export function MuonKiep2DesignPreview() {
  const [selected, setSelected] = useState<OptionId>(1);
  const [mode, setMode] = useState<PreviewMode>("light");
  const stageRef = useRef<HTMLElement>(null);
  const active = OPTIONS.find((option) => option.id === selected) ?? OPTIONS[0];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select")) return;
      event.preventDefault();
      setSelected((current) => {
        if (event.key === "ArrowRight") return (current === 3 ? 1 : current + 1) as OptionId;
        return (current === 1 ? 3 : current - 1) as OptionId;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    stageRef.current?.scrollTo({ left: 0, behavior: "auto" });
  }, [selected]);

  return (
    <main className={styles.lab} data-preview-mode={mode}>
      <header className={styles.labHeader}>
        <div>
          <p className={styles.eyebrow}>Muôn Kiếp Nhân Sinh — Tập 2 · Bản demo thiết kế</p>
          <h1>Ba nhịp kể của “Xưởng phục hồi những vòng lặp”</h1>
          <p>Chuyển phương án để so sánh bố cục, độ thoáng và cách hình tượng dẫn mắt. Nội dung trong các trang được giữ nguyên từ bản thảo.</p>
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
            aria-controls="muon-kiep-2-design-panel"
            onClick={() => setSelected(option.id)}
          >
            <span>{String(option.id).padStart(2, "0")}</span>
            <strong>{option.name}</strong>
            <small>{option.note}</small>
          </button>
        ))}
      </nav>

      <section
        id="muon-kiep-2-design-panel"
        ref={stageRef}
        className={styles.stage}
        role="tabpanel"
        aria-label={`Phương án ${active.id}: ${active.name}`}
      >
        {selected === 1 ? <OptionOne /> : null}
        {selected === 2 ? <OptionTwo /> : null}
        {selected === 3 ? <OptionThree /> : null}
      </section>

      <footer className={styles.previewFooter}>
        <p><span className={styles.desktopHint}>Dùng phím ← → để đổi phương án.</span><span className={styles.mobileHint}>Vuốt ngang để xem trang kế tiếp.</span></p>
        <strong>Sau khi xem, bạn chỉ cần nhắn: “chọn phương án {selected}”.</strong>
      </footer>
    </main>
  );
}
