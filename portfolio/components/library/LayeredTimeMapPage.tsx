import { useId, type ReactNode } from "react";
import {
  ArrowDown,
  ArrowRight,
  BookOpenText,
  BrainCircuit,
  BriefcaseBusiness,
  Check,
  CircleHelp,
  Coins,
  Compass,
  FileText,
  HandCoins,
  HeartHandshake,
  Laptop,
  Layers3,
  Leaf,
  Map,
  MessageCircle,
  RefreshCcw,
  Scale,
  ShieldCheck,
  Snowflake,
  Sprout,
  Sun,
  Triangle,
  Users,
  Waves,
} from "lucide-react";
import type { LayeredTimeMapPageDesign } from "@/data/books";
import styles from "./LayeredTimeMapPage.module.css";

interface LayeredTimeMapPageProps {
  design: LayeredTimeMapPageDesign;
  heading: string;
  paragraphs: string[];
  visualOnly?: boolean;
  renderInline?: (text: string) => ReactNode;
}

type InlineRenderer = NonNullable<LayeredTimeMapPageProps["renderInline"]>;
type LayerKind = "story" | "reflection" | "today";

const PAPER_TONE: Record<LayeredTimeMapPageDesign, "night" | "mist" | "cream"> = {
  "two-lenses": "night",
  "thomas-desk": "cream",
  "karma-flow": "mist",
  "responsibility-balance": "cream",
  ripple: "night",
  "atlantis-map": "mist",
  "transparent-power": "cream",
  "love-control": "night",
  "knowledge-core": "mist",
  "money-hands": "cream",
  "four-seasons": "night",
  "evidence-layers": "mist",
  "today-compass": "cream",
  "reflection-notes": "night",
};

const LAYER_LABELS: Record<LayerKind, string> = {
  story: "Câu chuyện",
  reflection: "Suy ngẫm",
  today: "Hôm nay",
};

function defaultInline(text: string): ReactNode {
  return text;
}

function stripQuote(text: string) {
  return text.replace(/^>\s+/, "");
}

function stripBullet(text: string) {
  return text.replace(/^-\s+/, "");
}

function wholeBold(text: string) {
  return text.match(/^\*\*([^*]+)\*\*$/)?.[1] ?? null;
}

function codeBody(text: string) {
  return text
    .replace(/^```[^\n]*\n?/, "")
    .replace(/\n?```\s*$/, "")
    .trim();
}

function tableCells(row: string) {
  return row
    .split("|")
    .slice(1, -1)
    .map((cell) => cell.trim());
}

function LayerLabel({ kind }: { kind: LayerKind }) {
  return (
    <span className={styles.layerLabel} data-layer={kind}>
      <span aria-hidden />
      {LAYER_LABELS[kind]}
    </span>
  );
}

function Legend() {
  return (
    <aside className={styles.legend} aria-label="Chú giải ba lớp nội dung">
      <LayerLabel kind="story" />
      <LayerLabel kind="reflection" />
      <LayerLabel kind="today" />
    </aside>
  );
}

function Quote({ text, renderInline }: { text: string; renderInline: InlineRenderer }) {
  return (
    <blockquote className={styles.quote}>
      {renderInline(stripQuote(text))}
    </blockquote>
  );
}

function ParagraphFlow({
  entries,
  renderInline,
  className = "",
  listTone = "affirming",
}: {
  entries: string[];
  renderInline: InlineRenderer;
  className?: string;
  listTone?: "affirming" | "caution";
}) {
  const output: ReactNode[] = [];
  let cursor = 0;

  while (cursor < entries.length) {
    const entry = entries[cursor];
    if (!entry || entry === "[[time-map-legend]]") {
      cursor += 1;
      continue;
    }

    if (entry.startsWith("- ")) {
      const items: string[] = [];
      while (cursor < entries.length && entries[cursor].startsWith("- ")) {
        items.push(stripBullet(entries[cursor]));
        cursor += 1;
      }
      output.push(
        <ul key={`list-${cursor}`} className={styles.list} data-tone={listTone}>
          {items.map((item) => {
            const ListIcon = listTone === "caution" ? Triangle : Check;
            return (
              <li key={item}>
                <ListIcon aria-hidden />
                <span>{renderInline(item)}</span>
              </li>
            );
          })}
        </ul>,
      );
      continue;
    }

    if (entry.startsWith("> ")) {
      output.push(<Quote key={`quote-${cursor}`} text={entry} renderInline={renderInline} />);
      cursor += 1;
      continue;
    }

    const bold = wholeBold(entry);
    if (bold) {
      output.push(
        <h4 key={`subhead-${cursor}`} className={styles.subheading}>
          {renderInline(bold)}
        </h4>,
      );
      cursor += 1;
      continue;
    }

    if (entry.startsWith("```")) {
      output.push(
        <pre key={`code-${cursor}`} className={styles.codeFallback}>
          {codeBody(entry)}
        </pre>,
      );
      cursor += 1;
      continue;
    }

    output.push(
      <p key={`paragraph-${cursor}`} className={styles.paragraph}>
        {renderInline(entry)}
      </p>,
    );
    cursor += 1;
  }

  return <div className={`${styles.flow} ${className}`}>{output}</div>;
}

function PageHeading({ heading }: { heading: string }) {
  const match = heading.match(/^(\d{2})\s+—\s+(.+)$/);
  return (
    <header className={styles.header}>
      <span className={styles.pageNumber}>{match?.[1] ?? ""}</span>
      <h3>{match?.[2] ?? heading}</h3>
    </header>
  );
}

function TwoLenses({ paragraphs, renderInline }: LayoutProps) {
  const layers = codeBody(paragraphs[3]).split(/\n{2,}/).map((block) => block.split("\n"));
  return (
    <>
      <div className={styles.seriesMark}>
        <span>Bản đồ những điều mình để lại</span>
        <small>14 lát cắt từ <em>Muôn Kiếp Nhân Sinh — Tập 1</em></small>
      </div>
      <Legend />
      <ParagraphFlow entries={paragraphs.slice(1, 3)} renderInline={renderInline} />
      <div className={styles.lensGrid} aria-label="Hai lớp đọc">
        {layers.map((layer, index) => (
          <section key={layer[0]} className={styles.translucentSheet}>
            <LayerLabel kind={index === 0 ? "story" : "reflection"} />
            {index === 0 ? <BookOpenText aria-hidden /> : <Layers3 aria-hidden />}
            <h4>{layer[0]}</h4>
            <p>{layer.slice(1).join(" ")}</p>
          </section>
        ))}
      </div>
      <ParagraphFlow entries={paragraphs.slice(4)} renderInline={renderInline} />
    </>
  );
}

function ThomasDesk({ paragraphs, renderInline }: LayoutProps) {
  return (
    <>
      <LayerLabel kind="story" />
      <ParagraphFlow entries={paragraphs.slice(0, 2)} renderInline={renderInline} />
      <figure className={styles.deskMap} aria-label="Bàn làm việc của Thomas và câu hỏi đạo đức">
        <BriefcaseBusiness aria-hidden />
        <span className={styles.deskLine} aria-hidden />
        <Laptop aria-hidden />
        <FileText aria-hidden />
        <div className={styles.questionOrbit}>
          <CircleHelp aria-hidden />
          <span>Ai hưởng lợi?</span>
          <span>Ai trả giá?</span>
        </div>
      </figure>
      <LayerLabel kind="today" />
      <ParagraphFlow entries={paragraphs.slice(2)} renderInline={renderInline} />
    </>
  );
}

function KarmaFlow({ paragraphs, renderInline }: LayoutProps) {
  const steps = codeBody(paragraphs[1])
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && line !== "↓");
  return (
    <>
      <ParagraphFlow entries={[paragraphs[0]]} renderInline={renderInline} />
      <LayerLabel kind="reflection" />
      <ol className={styles.verticalFlow}>
        {steps.map((step, index) => (
          <li key={step}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{step}</strong>
            {index < steps.length - 1 ? <ArrowDown aria-hidden /> : <RefreshCcw aria-hidden />}
          </li>
        ))}
      </ol>
      <LayerLabel kind="today" />
      <ParagraphFlow entries={paragraphs.slice(2)} renderInline={renderInline} />
    </>
  );
}

function ResponsibilityBalance({ paragraphs, renderInline }: LayoutProps) {
  const rows = paragraphs.slice(3, 8).map(tableCells);
  return (
    <>
      <ParagraphFlow entries={paragraphs.slice(0, 3)} renderInline={renderInline} />
      <div className={styles.balanceHeading}>
        <Scale aria-hidden />
        <LayerLabel kind="today" />
      </div>
      <div className={styles.balanceTable} role="table" aria-label="Có trách nhiệm và phán xét">
        <div className={styles.balanceHeader} role="row">
          <strong role="columnheader">{rows[0][0]}</strong>
          <strong role="columnheader">{rows[0][1]}</strong>
        </div>
        {rows.slice(1).map(([care, judgment]) => (
          <div key={care} className={styles.balanceRow} role="row">
            <span role="cell"><ShieldCheck aria-hidden />{care}</span>
            <span role="cell">{judgment}</span>
          </div>
        ))}
      </div>
      <ParagraphFlow entries={paragraphs.slice(8)} renderInline={renderInline} />
    </>
  );
}

function Ripple({ paragraphs, renderInline }: LayoutProps) {
  const rippleSteps = codeBody(paragraphs[6])
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && line !== "↓");
  return (
    <>
      <ParagraphFlow entries={paragraphs.slice(0, 3)} renderInline={renderInline} />
      <div className={styles.responsePair}>
        {paragraphs.slice(3, 5).map((line, index) => (
          <blockquote key={line} data-tone={index === 0 ? "closing" : "opening"}>
            <MessageCircle aria-hidden />
            {renderInline(stripBullet(line))}
          </blockquote>
        ))}
      </div>
      <ParagraphFlow entries={[paragraphs[5]]} renderInline={renderInline} />
      <figure className={styles.rippleMap} aria-label="Gợn sóng của một lời nói">
        <Waves aria-hidden />
        {rippleSteps.map((step) => (
          <div key={step}>
            <span>{step}</span>
          </div>
        ))}
      </figure>
      <ParagraphFlow entries={paragraphs.slice(7)} renderInline={renderInline} />
    </>
  );
}

function AtlantisMap({ paragraphs, renderInline }: LayoutProps) {
  return (
    <>
      <LayerLabel kind="story" />
      <ParagraphFlow entries={paragraphs.slice(0, 2)} renderInline={renderInline} />
      <figure className={styles.atlantisFigure}>
        <figcaption>Hình tượng trong câu chuyện · Không phải bằng chứng lịch sử</figcaption>
        <div>
          <section>
            <BrainCircuit aria-hidden />
            <strong>Tri thức</strong>
            <span>Mình có thể làm gì?</span>
          </section>
          <Map aria-hidden />
          <section>
            <HeartHandshake aria-hidden />
            <strong>Lương tri</strong>
            <span>Mình có nên làm?</span>
          </section>
        </div>
      </figure>
      <LayerLabel kind="reflection" />
      <ParagraphFlow entries={paragraphs.slice(2)} renderInline={renderInline} />
    </>
  );
}

function TransparentPower({ paragraphs, renderInline }: LayoutProps) {
  const warnings = paragraphs.slice(3, 8).map(stripBullet);
  return (
    <>
      <LayerLabel kind="story" />
      <ParagraphFlow entries={paragraphs.slice(0, 3)} renderInline={renderInline} />
      <div className={styles.powerPyramid} aria-label="Quyền lực và câu hỏi phản biện">
        <Triangle aria-hidden />
        {[...warnings].reverse().map((warning) => (
          <div key={warning}>
            <span>{warning}</span>
          </div>
        ))}
      </div>
      <LayerLabel kind="reflection" />
      <ParagraphFlow entries={paragraphs.slice(8)} renderInline={renderInline} />
    </>
  );
}

const LOVE_CONTROL_ROWS = [
  ["hỏi người kia cần gì", "quyết định thay họ"],
  ["cho phép bất đồng", "dùng tội lỗi ép đồng ý"],
  ["tôn trọng ranh giới", "xem ranh giới là từ chối tình cảm"],
  ["cùng chịu trách nhiệm", "bắt một người gánh tất cả"],
] as const;

function LoveControl({ paragraphs, renderInline }: LayoutProps) {
  return (
    <>
      <ParagraphFlow
        entries={paragraphs.slice(0, 6)}
        renderInline={renderInline}
        listTone="caution"
      />
      <div className={styles.parallelFlows} role="table" aria-label="Yêu thương và kiểm soát">
        <div role="row" className={styles.parallelHeader}>
          <strong role="columnheader"><HeartHandshake aria-hidden />Yêu thương</strong>
          <strong role="columnheader"><Triangle aria-hidden />Kiểm soát</strong>
        </div>
        {LOVE_CONTROL_ROWS.map(([love, control]) => (
          <div role="row" key={love} className={styles.parallelRow}>
            <span role="cell">{love}</span>
            <span role="cell">{control}</span>
          </div>
        ))}
      </div>
      <ParagraphFlow entries={paragraphs.slice(7)} renderInline={renderInline} />
    </>
  );
}

function KnowledgeCore({ paragraphs, renderInline }: LayoutProps) {
  const questions = codeBody(paragraphs[4]).split("\n").filter(Boolean);
  return (
    <>
      <ParagraphFlow entries={paragraphs.slice(0, 4)} renderInline={renderInline} />
      <div className={styles.knowledgeOrbit} aria-label="Bốn câu hỏi kiểm tra tri thức và trách nhiệm">
        <div className={styles.knowledgeCore}>
          <BrainCircuit aria-hidden />
          <span>Tri thức</span>
        </div>
        {questions.map((question, index) => (
          <div key={question} data-position={index}>
            <span>{question}</span>
          </div>
        ))}
      </div>
      <ParagraphFlow entries={paragraphs.slice(5)} renderInline={renderInline} />
    </>
  );
}

function MoneyHands({ paragraphs, renderInline }: LayoutProps) {
  return (
    <>
      <ParagraphFlow entries={paragraphs.slice(0, 3)} renderInline={renderInline} />
      <figure className={styles.moneyPath} aria-label="Một đồng tiền đi qua nhiều bàn tay">
        <span><Coins aria-hidden /><small>Nguồn lực</small></span>
        <ArrowRight aria-hidden />
        <span><HandCoins aria-hidden /><small>Quyết định</small></span>
        <ArrowRight aria-hidden />
        <span><Users aria-hidden /><small>Ảnh hưởng</small></span>
      </figure>
      <LayerLabel kind="today" />
      <ParagraphFlow entries={paragraphs.slice(3)} renderInline={renderInline} />
    </>
  );
}

function FourSeasons({ paragraphs, renderInline }: LayoutProps) {
  const seasons = [
    { label: "Thành", Icon: Sprout },
    { label: "Trụ", Icon: Sun },
    { label: "Hoại", Icon: Leaf },
    { label: "Diệt", Icon: Snowflake },
  ];
  return (
    <>
      <ParagraphFlow entries={paragraphs.slice(0, 2)} renderInline={renderInline} />
      <figure className={styles.seasonWheel} aria-label="Chu kỳ thành, trụ, hoại, diệt như bốn mùa">
        <RefreshCcw className={styles.seasonCenter} aria-hidden />
        {seasons.map(({ label, Icon }, index) => (
          <div key={label} data-season={index}>
            <Icon aria-hidden />
            <strong>{label}</strong>
          </div>
        ))}
      </figure>
      <ParagraphFlow entries={paragraphs.slice(2)} renderInline={renderInline} />
    </>
  );
}

function EvidenceLayers({ paragraphs, renderInline }: LayoutProps) {
  const rows = paragraphs.slice(2, 6).map(tableCells);
  const layerIcons = [BookOpenText, Layers3, ShieldCheck];
  return (
    <>
      <ParagraphFlow entries={paragraphs.slice(0, 2)} renderInline={renderInline} />
      <div className={styles.evidenceStack} aria-label="Ba lớp câu chuyện, diễn giải và bằng chứng">
        {rows.slice(1).map(([label, example], index) => {
          const Icon = layerIcons[index];
          return (
            <section key={label}>
              <Icon aria-hidden />
              <div>
                <h4>{renderInline(label)}</h4>
                <p>{example}</p>
              </div>
            </section>
          );
        })}
      </div>
      <ParagraphFlow entries={paragraphs.slice(6)} renderInline={renderInline} />
    </>
  );
}

function TodayCompass({ paragraphs, renderInline }: LayoutProps) {
  const actions = paragraphs.slice(3, 9).map(stripBullet);
  return (
    <>
      <ParagraphFlow entries={paragraphs.slice(0, 3)} renderInline={renderInline} />
      <LayerLabel kind="today" />
      <div className={styles.todayCompass} aria-label="La bàn chỉ về những hành động hôm nay">
        <div className={styles.compassCore}>
          <Compass aria-hidden />
          <strong>Hôm nay</strong>
        </div>
        {actions.map((action, index) => (
          <span key={action} data-action={index}>{action}</span>
        ))}
      </div>
      <ParagraphFlow entries={paragraphs.slice(9)} renderInline={renderInline} />
    </>
  );
}

function ReflectionNotes({ paragraphs, renderInline }: LayoutProps) {
  const rows = paragraphs.slice(1, 6).map(tableCells);
  const headings = rows[0];
  const examples = rows.slice(1);
  const noteDeckName = `reflection-note-example-${useId().replace(/:/g, "")}`;
  return (
    <>
      <ParagraphFlow entries={[paragraphs[0]]} renderInline={renderInline} />
      <div className={styles.notesTable} role="table" aria-label="Trang ghi chép ba cột">
        <div role="row" className={styles.notesHeader}>
          {headings.map((heading, index) => (
            <strong role="columnheader" key={heading}>
              <LayerLabel kind={(["story", "reflection", "today"] as LayerKind[])[index]} />
              {heading}
            </strong>
          ))}
        </div>
        {examples.map((row) => (
          <div role="row" className={styles.notesRow} key={row[0]}>
            {row.map((cell) => <span role="cell" key={cell}>{cell}</span>)}
          </div>
        ))}
      </div>
      <fieldset className={styles.mobileNotesDeck} data-page-control>
        <legend>Đọc từng lát cắt mẫu</legend>
        <div className={styles.notePicker}>
          {examples.map((row, index) => (
            <label key={row[0]} data-page-control>
              <input
                type="radio"
                name={noteDeckName}
                value={index}
                defaultChecked={index === 0}
                data-page-control
              />
              <span>{String(index + 1).padStart(2, "0")}</span>
            </label>
          ))}
        </div>
        <div className={styles.notePanels}>
          {examples.map((row, rowIndex) => (
            <section
              key={row[0]}
              className={styles.notePanel}
              data-note-panel={rowIndex}
              aria-label={`Lát cắt mẫu ${rowIndex + 1}`}
            >
              {row.map((cell, columnIndex) => (
                <div key={cell}>
                  <strong>{headings[columnIndex]}</strong>
                  <p>{cell}</p>
                </div>
              ))}
            </section>
          ))}
        </div>
      </fieldset>
      <fieldset className={styles.writeGrid} data-page-control>
        <legend>Ghi lại lát cắt của riêng bạn</legend>
        {headings.map((heading, index) => (
          <label key={heading}>
            <span>{heading}</span>
            <textarea
              data-page-control
              data-note-storage-key={`muon-kiep-nhan-sinh-1:reflection-note:${index}`}
              rows={3}
              maxLength={180}
              aria-label={`${heading} — ghi chép của bạn`}
              placeholder="Viết tại đây…"
            />
          </label>
        ))}
      </fieldset>
      <ParagraphFlow entries={paragraphs.slice(6)} renderInline={renderInline} />
    </>
  );
}

interface LayoutProps {
  paragraphs: string[];
  renderInline: InlineRenderer;
}

function renderLayout(design: LayeredTimeMapPageDesign, props: LayoutProps) {
  switch (design) {
    case "two-lenses": return <TwoLenses {...props} />;
    case "thomas-desk": return <ThomasDesk {...props} />;
    case "karma-flow": return <KarmaFlow {...props} />;
    case "responsibility-balance": return <ResponsibilityBalance {...props} />;
    case "ripple": return <Ripple {...props} />;
    case "atlantis-map": return <AtlantisMap {...props} />;
    case "transparent-power": return <TransparentPower {...props} />;
    case "love-control": return <LoveControl {...props} />;
    case "knowledge-core": return <KnowledgeCore {...props} />;
    case "money-hands": return <MoneyHands {...props} />;
    case "four-seasons": return <FourSeasons {...props} />;
    case "evidence-layers": return <EvidenceLayers {...props} />;
    case "today-compass": return <TodayCompass {...props} />;
    case "reflection-notes": return <ReflectionNotes {...props} />;
  }
}

/** Static, clone-safe interior for the fourteen leaves in the “Bản đồ nhiều
 * lớp thời gian” edition. Native writing fields remain usable after StPageFlip
 * clones the markup; navigation stays owned by the reader. */
export function LayeredTimeMapPage({
  design,
  heading,
  paragraphs,
  visualOnly = false,
  renderInline = defaultInline,
}: LayeredTimeMapPageProps) {
  return (
    <article
      className={`time-map-page ${styles.page} ${styles[PAPER_TONE[design]]}`}
      data-time-map-design={design}
      data-visual-only={visualOnly || undefined}
      aria-label={heading}
      tabIndex={0}
    >
      <span className={styles.foldLines} aria-hidden />
      <PageHeading heading={heading} />
      <div className={styles.content}>
        {renderLayout(design, { paragraphs, renderInline })}
      </div>
    </article>
  );
}
