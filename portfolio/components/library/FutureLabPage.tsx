import type { ReactNode } from "react";
import {
  ArrowDown,
  ArrowRight,
  BookOpenText,
  Bot,
  CircleDot,
  Compass,
  Cpu,
  DoorOpen,
  FastForward,
  Gauge,
  Gift,
  GitFork,
  HandHeart,
  Handshake,
  Heart,
  RefreshCcw,
  Route,
  ScrollText,
  SearchCheck,
  ShieldCheck,
  SlidersHorizontal,
  Square,
  Tag,
  Target,
  ToggleRight,
  UserRound,
  UsersRound,
  Waves,
} from "lucide-react";
import type { FutureLabPageDesign } from "@/data/books";
import styles from "./FutureLabPage.module.css";

interface FutureLabPageProps {
  design: FutureLabPageDesign;
  heading: string;
  paragraphs: string[];
  visualOnly?: boolean;
  renderInline?: (text: string) => ReactNode;
}

type InlineRenderer = NonNullable<FutureLabPageProps["renderInline"]>;

function defaultInline(text: string): ReactNode {
  return text;
}

function tableCells(row: string) {
  return row
    .split("|")
    .slice(1, -1)
    .map((cell) => cell.trim());
}

function isTableRow(value: string) {
  return value.startsWith("|") && value.endsWith("|");
}

function isTableRule(value: string) {
  return /^\|(?:\s*:?-+:?\s*\|)+$/.test(value);
}

function isWholeBold(value: string) {
  return value.match(/^\*\*([^*]+)\*\*:?$/)?.[1] ?? null;
}

function codeBody(value: string) {
  return value
    .replace(/^```[^\n]*\n?/, "")
    .replace(/\n?```\s*$/, "")
    .trim();
}

function ContentBlocks({
  entries,
  renderInline,
  tone = "body",
}: {
  entries: string[];
  renderInline: InlineRenderer;
  tone?: "lead" | "body" | "closing";
}) {
  const blocks: ReactNode[] = [];
  let cursor = 0;

  while (cursor < entries.length) {
    const value = entries[cursor]?.trim();

    if (!value || /^\[\[[^\]]+\]\]$/.test(value)) {
      cursor += 1;
      continue;
    }

    if (value.startsWith("```")) {
      const lines = codeBody(value).split("\n").filter((line) => line.trim());
      blocks.push(
        <div className={styles.dataReadout} key={`readout-${cursor}`}>
          <span className={styles.readoutLabel}>GHI CHÚ</span>
          {lines.map((line, index) => (
            <span key={`${line}-${index}`}>{line.trim()}</span>
          ))}
        </div>,
      );
      cursor += 1;
      continue;
    }

    if (isTableRow(value)) {
      const start = cursor;
      const rows: string[][] = [];
      while (cursor < entries.length && isTableRow(entries[cursor].trim())) {
        if (!isTableRule(entries[cursor].trim())) rows.push(tableCells(entries[cursor].trim()));
        cursor += 1;
      }
      const [header, ...body] = rows;
      if (header) {
        blocks.push(
          <div className={styles.tableWrap} key={`table-${start}`}>
            <table>
              <thead>
                <tr>
                  {header.map((cell, index) => <th key={`${cell}-${index}`}>{renderInline(cell)}</th>)}
                </tr>
              </thead>
              <tbody>
                {body.map((row, rowIndex) => (
                  <tr key={`row-${rowIndex}`}>
                    {row.map((cell, cellIndex) => (
                      <td key={`${cell}-${cellIndex}`}>{renderInline(cell)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>,
        );
      }
      continue;
    }

    if (value.startsWith("- ") || /^\d+\.\s/.test(value)) {
      const ordered = /^\d+\.\s/.test(value);
      const start = cursor;
      const items: string[] = [];
      while (cursor < entries.length) {
        const candidate = entries[cursor].trim();
        const matches = ordered ? /^\d+\.\s/.test(candidate) : candidate.startsWith("- ");
        if (!matches) break;
        items.push(candidate.replace(ordered ? /^\d+\.\s/ : /^-\s+/, ""));
        cursor += 1;
      }
      const itemNodes = items.map((item, index) => (
        <li key={`${item}-${index}`}>
          <span className={styles.listMarker} aria-hidden>{ordered ? String(index + 1).padStart(2, "0") : ""}</span>
          <span>{renderInline(item)}</span>
        </li>
      ));
      blocks.push(
        ordered
          ? <ol className={styles.orderedList} key={`list-${start}`}>{itemNodes}</ol>
          : <ul className={styles.bulletList} key={`list-${start}`}>{itemNodes}</ul>,
      );
      continue;
    }

    if (value.startsWith("> ")) {
      blocks.push(
        <blockquote key={`quote-${cursor}`}>{renderInline(value.slice(2))}</blockquote>,
      );
      cursor += 1;
      continue;
    }

    const subheading = isWholeBold(value);
    if (subheading) {
      blocks.push(<h3 className={styles.subheading} key={`subheading-${cursor}`}>{renderInline(subheading)}</h3>);
      cursor += 1;
      continue;
    }

    blocks.push(<p key={`paragraph-${cursor}`}>{renderInline(value)}</p>);
    cursor += 1;
  }

  return <div className={styles.prose} data-tone={tone}>{blocks}</div>;
}

const FIGURE_LABELS: Record<FutureLabPageDesign, string> = {
  "amplification-chain": "Mô hình khuếch đại từ mục tiêu của con người đến hệ quả thật",
  "two-sided-price": "Chiếc nhãn giá hai mặt: lợi ích nhìn thấy và chi phí ẩn",
  "gift-without-debt": "Món quà được trao tự nguyện, không kiểm soát và không tạo món nợ",
  "unequal-choice-rooms": "Hai căn phòng lựa chọn có độ rộng khác nhau",
  "three-drawers": "Ba ngăn riêng cho câu chuyện, niềm tin và điều kiểm chứng được",
  "six-safety-switches": "Bảng điều khiển sáu chốt an toàn",
  "speed-and-compass": "Đồng hồ tốc độ đặt cạnh la bàn định hướng",
  "recurring-pattern": "Các thời đại chồng lớp lên cùng một vòng lặp của con người",
  "three-questions": "Ba câu hỏi tách biệt về năng lực, trải nghiệm và trách nhiệm",
  "paths-can-part": "Hai con đường có thể gặp nhau và vẫn có quyền tách ra",
  "four-point-compass": "La bàn bốn hướng: ý định, quyền lực, hệ quả và sửa chữa",
  "human-machine-collaboration": "Con người và máy cùng làm việc mà không biến thành cuộc đua",
  "default-switch-chain": "Chuỗi mặc định dẫn đến hành vi, điều bình thường và tương lai",
  "personal-constitution": "Hiến pháp cá nhân gồm tám câu hỏi đạo đức có thể đánh dấu",
};

// These seven dedicated illustration leaves need a denser composition on the
// phone-sized book leaf. The opt-in attribute keeps their desktop treatment,
// and every prose leaf, on the regular editorial rhythm.
const MOBILE_COMPACT_VISUALS = new Set<FutureLabPageDesign>([
  "two-sided-price",
  "three-drawers",
  "six-safety-switches",
  "paths-can-part",
  "four-point-compass",
  "human-machine-collaboration",
  "personal-constitution",
]);

const ARROW = <ArrowRight className={styles.arrow} aria-hidden />;

function AmplificationChain() {
  const nodes = [
    { label: "Mục tiêu", note: "của con người", Icon: Target },
    { label: "Công nghệ", note: "công cụ", Icon: Cpu },
    { label: "Khuếch đại", note: "quy mô + tốc độ", Icon: FastForward },
    { label: "Hệ quả", note: "đời sống thật", Icon: Waves },
  ];
  return (
    <div className={styles.amplificationFlow}>
      {nodes.map(({ label, note, Icon }, index) => (
        <div className={styles.flowItem} key={label}>
          <div className={styles.flowNode}>
            <Icon aria-hidden />
            <strong>{label}</strong>
            <small>{note}</small>
          </div>
          {index < nodes.length - 1 ? ARROW : null}
        </div>
      ))}
    </div>
  );
}

function TwoSidedPrice() {
  return (
    <div className={styles.priceTag}>
      <span className={styles.tagHole} aria-hidden><CircleDot /></span>
      <section>
        <span className={styles.panelEyebrow}>MẶT TRƯỚC</span>
        <Tag aria-hidden />
        <strong>Tăng trưởng</strong>
        <small>tiện lợi · lợi nhuận</small>
      </section>
      <section>
        <span className={styles.panelEyebrow}>MẶT SAU</span>
        <SearchCheck aria-hidden />
        <strong>Chi phí ẩn</strong>
        <ul>
          <li>Ai mất thời gian?</li>
          <li>Ai chịu rủi ro?</li>
          <li>Điều gì đang bị khai thác?</li>
          <li>Giới hạn nên nằm ở đâu?</li>
        </ul>
      </section>
    </div>
  );
}

function GiftWithoutDebt() {
  return (
    <div className={styles.giftDiagram}>
      <div className={styles.giftTransfer}>
        <HandHeart aria-hidden />
        <ArrowRight aria-hidden />
        <span><Gift aria-hidden /><small>Món quà</small></span>
        <ArrowRight aria-hidden />
        <HandHeart className={styles.receivingHand} aria-hidden />
      </div>
      <div className={styles.giftRules}>
        <span>Tự nguyện</span>
        <span>Không kiểm soát</span>
        <span>Có quyền từ chối</span>
      </div>
    </div>
  );
}

function UnequalChoiceRooms() {
  return (
    <div className={styles.choiceRooms}>
      <section className={styles.wideRoom}>
        <DoorOpen aria-hidden />
        <strong>Khoảng mở rộng</strong>
        <span>Nhiều nguồn lực</span>
        <span>Nhiều lối ra</span>
      </section>
      <section className={styles.narrowRoom}>
        <DoorOpen aria-hidden />
        <strong>Khoảng mở hẹp</strong>
        <span>Ít nguồn lực</span>
        <span>Ít lối ra</span>
      </section>
      <small>Hoàn cảnh + nguồn lực + quyền lực → phạm vi lựa chọn thực tế → hành động và trách nhiệm</small>
    </div>
  );
}

function ThreeDrawers() {
  const drawers = [
    { number: "01", label: "Sách đang kể gì?", note: "Câu chuyện, hình ảnh, trải nghiệm và ẩn dụ", Icon: BookOpenText },
    { number: "02", label: "Mình chọn tin gì?", note: "Niềm tin, cảm nhận và cách lý giải cá nhân", Icon: Heart },
    { number: "03", label: "Điều gì có thể kiểm tra?", note: "Dữ liệu, bằng chứng và khả năng phản biện", Icon: SearchCheck },
  ];
  return (
    <div className={styles.drawerCabinet}>
      {drawers.map(({ number, label, note, Icon }) => (
        <div className={styles.drawer} key={number}>
          <span>{number}</span>
          <Icon aria-hidden />
          <strong>{label}</strong>
          <small>{note}</small>
          <i aria-hidden />
        </div>
      ))}
    </div>
  );
}

function SixSafetySwitches({ questions }: { questions: string[] }) {
  const fallbackQuestions = [
    "Mục đích sử dụng có rõ ràng không?",
    "Dữ liệu đến từ đâu?",
    "Người bị ảnh hưởng có đồng thuận không?",
    "Những sai sót nào có thể xảy ra?",
    "Có người kiểm tra và nơi khiếu nại không?",
    "Ai đứng tên chịu trách nhiệm sửa?",
  ];
  const labels = questions.length === 6 ? questions : fallbackQuestions;
  return (
    <div className={styles.safetyConsole}>
      <div className={styles.consoleHeader}>
        <ShieldCheck aria-hidden />
        <span>6 CHỐT AN TOÀN</span>
        <SlidersHorizontal aria-hidden />
      </div>
      <div className={styles.switchGrid}>
        {labels.map((label, index) => (
          <div className={styles.switchRow} key={label}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{label}</strong>
            <CircleDot aria-hidden />
          </div>
        ))}
      </div>
    </div>
  );
}

function SpeedAndCompass() {
  return (
    <div className={styles.navigationBench}>
      <section>
        <Gauge aria-hidden />
        <span className={styles.instrumentNeedle} aria-hidden />
        <strong>Tốc độ</strong>
        <small>Đi nhanh đến đâu?</small>
      </section>
      <div className={styles.notEqual} aria-hidden>≠</div>
      <section>
        <Compass aria-hidden />
        <strong>Hướng đi</strong>
        <small>Đi về phía nào?</small>
      </section>
      <div className={styles.riskScale}>
        <span>Dễ đảo ngược + tác động nhỏ → Có thể thử nhanh, theo dõi rồi điều chỉnh.</span>
        <span>Khó đảo ngược hoặc tác động lớn → Cần đi chậm, kiểm tra độc lập và cho phép kháng nghị.</span>
      </div>
    </div>
  );
}

function RecurringPattern() {
  const steps = ["Sợ hãi", "Muốn kiểm soát", "Hợp lý hóa việc gây tổn thương", "Hệ quả quay lại với cộng đồng"];
  return (
    <div className={styles.patternStudy}>
      <div className={styles.eraLayers} aria-hidden>
        <span>QUÁ KHỨ</span><span>HIỆN TẠI</span><span>TƯƠNG LAI</span>
      </div>
      <div className={styles.patternLoop}>
        <RefreshCcw aria-hidden />
        {steps.map((step, index) => (
          <div key={step} data-step={index}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{step}</strong>
            {index < steps.length - 1 ? <ArrowDown aria-hidden /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function ThreeQuestions() {
  return (
    <div className={styles.questionCircles}>
      <section data-circle="capability">
        <Cpu aria-hidden />
        <strong>Năng lực</strong>
        <small>Máy làm được gì?</small>
      </section>
      <section data-circle="experience">
        <Bot aria-hidden />
        <strong>Trải nghiệm</strong>
        <small>Nó có đời sống chủ quan hay không?</small>
      </section>
      <section data-circle="responsibility">
        <UsersRound aria-hidden />
        <strong>Trách nhiệm</strong>
        <small>Ai thiết kế, triển khai và chịu hậu quả?</small>
      </section>
    </div>
  );
}

function PathsCanPart() {
  return (
    <div className={styles.pathsDiagram}>
      <div className={styles.sharedPath}>
        <Route aria-hidden />
        <span>Gặp nhau</span>
        <ArrowDown aria-hidden />
        <span>Trân trọng</span>
      </div>
      <GitFork aria-hidden />
      <div className={styles.pathExits}>
        <span><Heart aria-hidden />Cùng sửa và đi tiếp</span>
        <span><DoorOpen aria-hidden />Đặt giới hạn và rời đi</span>
      </div>
      <small>Ý nghĩa không xóa quyền lựa chọn</small>
    </div>
  );
}

function FourPointCompass() {
  return (
    <div className={styles.ethicsCompass}>
      <div className={styles.compassCenter}>
        <Compass aria-hidden />
        <span>QUYẾT ĐỊNH</span>
      </div>
      <span data-direction="north"><small>01</small><strong>Ý định</strong><em>Mình thật sự muốn điều gì?</em></span>
      <span data-direction="east"><small>03</small><strong>Hệ quả</strong><em>Ai được lợi và ai phải chịu thiệt?</em></span>
      <span data-direction="south"><small>04</small><strong>Sửa chữa</strong><em>Nếu lựa chọn này gây tổn thương, mình sẽ làm gì?</em></span>
      <span data-direction="west"><small>02</small><strong>Quyền lực</strong><em>Ai có tiếng nói và ai đang bị bỏ ngoài cuộc?</em></span>
    </div>
  );
}

function HumanMachineCollaboration() {
  return (
    <div className={styles.collaborationDiagram}>
      <section>
        <Bot aria-hidden />
        <strong>Máy hỗ trợ</strong>
        <ul><li>Tìm kiếm</li><li>Tổng hợp</li><li>Gợi ý</li><li>Tự động hóa</li></ul>
      </section>
      <span className={styles.handshake}><Handshake aria-hidden /><small>Cộng tác</small></span>
      <section>
        <UserRound aria-hidden />
        <strong>Người chịu trách nhiệm</strong>
        <ul><li>Chọn mục đích</li><li>Hiểu hoàn cảnh</li><li>Quan tâm đến người bị ảnh hưởng</li><li>Nhận lỗi và sửa sai</li></ul>
      </section>
    </div>
  );
}

function DefaultSwitchChain() {
  const nodes = [
    { label: "Mặc định", Icon: ToggleRight },
    { label: "Hành vi được lặp lại", Icon: RefreshCcw },
    { label: "Điều được xem là bình thường", Icon: UsersRound },
    { label: "Tương lai của cộng đồng", Icon: Compass },
  ];
  return (
    <div className={styles.defaultChain}>
      {nodes.map(({ label, Icon }, index) => (
        <div className={styles.chainItem} key={label}>
          <span><Icon aria-hidden /><strong>{label}</strong></span>
          {index < nodes.length - 1 ? <ArrowRight aria-hidden /> : null}
        </div>
      ))}
    </div>
  );
}

function PersonalConstitution({ questions }: { questions?: string[] }) {
  const fallbackChecks = [
    "Mục đích là gì?",
    "Ai hưởng lợi?",
    "Ai gánh rủi ro?",
    "Có đồng thuận?",
    "Dữ kiện hay nỗi sợ?",
    "Phản hồi ở đâu?",
    "Ai sửa sai?",
    "Nếu là chính mình?",
  ];
  const checks = questions?.length === 8 ? questions : fallbackChecks;
  return (
    <div className={styles.constitutionCard}>
      <header>
        <ScrollText aria-hidden />
        <div><strong>HIẾN PHÁP NHỎ</strong><small>BỘ 8 CÂU HỎI TỰ KIỂM TRA</small></div>
      </header>
      <ol>
        {checks.map((check, index) => (
          <li key={check}><Square aria-hidden /><span><small>{String(index + 1).padStart(2, "0")}</small>{check}</span></li>
        ))}
      </ol>
    </div>
  );
}

function Schematic({ design, paragraphs }: { design: FutureLabPageDesign; paragraphs: string[] }) {
  let content: ReactNode;

  switch (design) {
    case "amplification-chain": content = <AmplificationChain />; break;
    case "two-sided-price": content = <TwoSidedPrice />; break;
    case "gift-without-debt": content = <GiftWithoutDebt />; break;
    case "unequal-choice-rooms": content = <UnequalChoiceRooms />; break;
    case "three-drawers": content = <ThreeDrawers />; break;
    case "six-safety-switches": content = (
      <SixSafetySwitches
        questions={paragraphs.flatMap((paragraph) => {
          const match = paragraph.match(/^\d+\.\s+(.+)$/);
          return match ? [match[1]] : [];
        })}
      />
    ); break;
    case "speed-and-compass": content = <SpeedAndCompass />; break;
    case "recurring-pattern": content = <RecurringPattern />; break;
    case "three-questions": content = <ThreeQuestions />; break;
    case "paths-can-part": content = <PathsCanPart />; break;
    case "four-point-compass": content = <FourPointCompass />; break;
    case "human-machine-collaboration": content = <HumanMachineCollaboration />; break;
    case "default-switch-chain": content = <DefaultSwitchChain />; break;
    case "personal-constitution": content = (
      <PersonalConstitution
        questions={paragraphs.flatMap((paragraph) => {
          const match = paragraph.match(/^\d+\.\s+(.+)$/);
          return match ? [match[1]] : [];
        })}
      />
    ); break;
  }

  return (
    <figure className={styles.schematic} data-schematic={design} aria-label={FIGURE_LABELS[design]}>
      <figcaption><span>MINH HỌA</span>{FIGURE_LABELS[design]}</figcaption>
      {content}
    </figure>
  );
}

function PageHeading({ heading }: { heading: string }) {
  const match = heading.match(/^(\d{1,2})\s+[—-]\s+(.+)$/);
  const number = match?.[1]?.padStart(2, "0") ?? "";
  const title = match?.[2] ?? heading;

  return (
    <header className={styles.header}>
      <div className={styles.pageCode}>
        <span>TRANG</span>
        <strong>{number}</strong>
      </div>
      <h2>{title}</h2>
    </header>
  );
}

const PAGE_COMPOSITIONS: Record<
  FutureLabPageDesign,
  { figureAfter: number; integratedBlocks: readonly number[] }
> = {
  "amplification-chain": { figureAfter: 1, integratedBlocks: [7] },
  "two-sided-price": { figureAfter: 2, integratedBlocks: [3, 4, 5, 6, 7, 8, 9] },
  "gift-without-debt": { figureAfter: 3, integratedBlocks: [3] },
  "unequal-choice-rooms": { figureAfter: 1, integratedBlocks: [2] },
  "three-drawers": { figureAfter: 1, integratedBlocks: [1, 2, 3, 4, 5, 6] },
  "six-safety-switches": { figureAfter: 2, integratedBlocks: [2, 3, 4, 5, 6, 7, 8] },
  "speed-and-compass": { figureAfter: 1, integratedBlocks: [2, 3, 4] },
  "recurring-pattern": { figureAfter: 1, integratedBlocks: [1] },
  "three-questions": { figureAfter: 2, integratedBlocks: [2, 3, 4, 5] },
  "paths-can-part": { figureAfter: 2, integratedBlocks: [] },
  "four-point-compass": { figureAfter: 2, integratedBlocks: [2, 3, 4, 5] },
  "human-machine-collaboration": { figureAfter: 2, integratedBlocks: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
  "default-switch-chain": { figureAfter: 1, integratedBlocks: [1] },
  "personal-constitution": { figureAfter: 1, integratedBlocks: [1, 2, 3, 4, 5, 6, 7, 8] },
};

/** Static, clone-safe interior for the “Phòng thí nghiệm của tương lai”
 * edition. Long prose is paginated by the reader; this component can therefore
 * render a full composition without owning an inner scroll surface. */
export function FutureLabPage({
  design,
  heading,
  paragraphs,
  visualOnly = false,
  renderInline = defaultInline,
}: FutureLabPageProps) {
  const composition = PAGE_COMPOSITIONS[design];
  const integrated = new Set(composition.integratedBlocks);
  const displayParagraphs = paragraphs.filter((_, index) => !integrated.has(index));
  const figureAfter = Math.min(composition.figureAfter, displayParagraphs.length);
  const beforeFigure = displayParagraphs.slice(0, figureAfter);
  const afterFigure = displayParagraphs.slice(figureAfter);

  return (
    <article
      className={`future-lab-page ${styles.page}`}
      data-future-lab-design={design}
      data-visual-only={visualOnly || undefined}
      data-compact-visual={(visualOnly && MOBILE_COMPACT_VISUALS.has(design)) || undefined}
      data-page-control
      aria-label={heading}
      lang="vi"
      tabIndex={0}
    >
      <span className={styles.circuitTrace} aria-hidden />
      <PageHeading heading={heading} />
      <div className={styles.content} data-composition={design}>
        {!visualOnly && beforeFigure.length ? <ContentBlocks entries={beforeFigure} renderInline={renderInline} tone="lead" /> : null}
        <Schematic design={design} paragraphs={paragraphs} />
        {!visualOnly && afterFigure.length ? <ContentBlocks entries={afterFigure} renderInline={renderInline} tone="closing" /> : null}
      </div>
    </article>
  );
}
