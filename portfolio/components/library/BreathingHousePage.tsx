import type { ReactNode } from "react";
import {
  ArrowRight,
  Check,
  CircleDot,
  Compass,
  DoorOpen,
  PackageOpen,
  ReceiptText,
  ShoppingBag,
  SunMedium,
} from "lucide-react";

export const BREATHING_HOUSE_DESIGNS = [
  "morning-table",
  "invisible-receipt",
  "inventory-table",
  "five-doors",
  "shared-home",
  "memory-box",
  "purchase-waitlist",
  "future-fitting-room",
  "paid-receipt",
  "space-exchange",
  "two-valid-rooms",
  "farewell-postcard",
  "enough-compass",
  "seven-day-sunpath",
] as const;

export type BreathingHouseDesign = (typeof BREATHING_HOUSE_DESIGNS)[number];

export interface BreathingHousePageProps {
  design: BreathingHouseDesign;
  heading: string;
  paragraphs: string[];
  visualOnly?: boolean;
  /** Uses the reader's existing inline-markup renderer when supplied. */
  renderInline?: (text: string) => ReactNode;
}

type InlineRenderer = NonNullable<BreathingHousePageProps["renderInline"]>;

interface Entry {
  index: number;
  text: string;
}

const ILLUSTRATION_ROOT = "/books/goodbye-things/illustrations";

const ILLUSTRATIONS = {
  "morning-table": `${ILLUSTRATION_ROOT}/morning-table.webp`,
  "shared-home": `${ILLUSTRATION_ROOT}/shared-home.webp`,
  "memory-box": `${ILLUSTRATION_ROOT}/memory-box.webp`,
  "future-fitting-room": `${ILLUSTRATION_ROOT}/future-fitting-room.webp`,
  "two-valid-rooms": `${ILLUSTRATION_ROOT}/two-valid-rooms.webp`,
  "farewell-postcard": `${ILLUSTRATION_ROOT}/farewell-postcard.webp`,
} as const;

const ILLUSTRATION_ALTS = {
  "morning-table": "Mặt bàn buổi sáng với cốc, chìa khóa, chồng đồ và một vệt nắng chéo.",
  "shared-home": "Mặt bằng một ngôi nhà chung, nơi mỗi khu vực phục vụ một nhu cầu khác nhau.",
  "memory-box": "Hộp ký ức mở với vài tấm ảnh, tấm thiệp và những mẩu ghi chú được chọn lọc.",
  "future-fitting-room": "Phòng thử đồ tượng trưng cho những phiên bản tương lai: đọc sách, tập luyện và nấu ăn.",
  "two-valid-rooms": "Hai căn phòng đều phù hợp: một phòng ít đồ và một phòng nhiều dụng cụ đang được sử dụng tốt.",
  "farewell-postcard": "Tấm bưu thiếp tạm biệt một phiên bản cũ, cạnh bức ảnh nhỏ và nét viết tay.",
} as const;

function defaultInline(text: string): ReactNode {
  return text;
}

function isBullet(text: string) {
  return /^-\s+/.test(text);
}

function isOrdered(text: string) {
  return /^\d+\.\s+/.test(text);
}

function isQuote(text: string) {
  return /^>\s+/.test(text);
}

function isCodeLike(text: string) {
  return /^```/.test(text.trim()) || (
    text.includes("\n")
    && /[│┌┐└┘├┤┬┴┼→←↑↓+]/.test(text)
  );
}

function codeBody(text: string) {
  return text
    .replace(/^```[^\n]*\n?/, "")
    .replace(/\n?```\s*$/, "")
    .trim();
}

function wholeBold(text: string) {
  return text.match(/^\*\*([^*]+)\*\*$/)?.[1] ?? null;
}

function subheading(text: string) {
  return text.match(/^###\s+(.+)$/)?.[1] ?? wholeBold(text);
}

function entriesFor(paragraphs: string[]): Entry[] {
  return paragraphs.map((text, index) => ({ index, text }));
}

function without(entries: Entry[], consumed: Set<number>) {
  return entries.filter((entry) => !consumed.has(entry.index));
}

function ParagraphFlow({
  entries,
  renderInline,
  className = "",
}: {
  entries: Entry[];
  renderInline: InlineRenderer;
  className?: string;
}) {
  const output: ReactNode[] = [];
  let cursor = 0;

  while (cursor < entries.length) {
    const entry = entries[cursor];

    if (isBullet(entry.text)) {
      const run: Entry[] = [];
      while (cursor < entries.length && isBullet(entries[cursor].text)) {
        run.push(entries[cursor]);
        cursor += 1;
      }
      output.push(
        <ul key={`bullets-${entry.index}`} className="breathing-list grid gap-1.5">
          {run.map((item) => (
            <li key={item.index} className="breathing-list-item flex items-start gap-2">
              <CircleDot className="mt-[0.42em] size-2.5 shrink-0 text-[#75805d]" aria-hidden />
              <span>{renderInline(item.text.replace(/^-\s+/, ""))}</span>
            </li>
          ))}
        </ul>,
      );
      continue;
    }

    if (isOrdered(entry.text)) {
      const run: Entry[] = [];
      while (cursor < entries.length && isOrdered(entries[cursor].text)) {
        run.push(entries[cursor]);
        cursor += 1;
      }
      output.push(
        <ol key={`steps-${entry.index}`} className="breathing-steps grid gap-1.5">
          {run.map((item) => {
            const match = item.text.match(/^(\d+)\.\s+([\s\S]+)$/);
            return (
              <li key={item.index} className="breathing-step flex items-start gap-2">
                <span className="breathing-step-number mt-[0.08em] inline-flex size-5 shrink-0 items-center justify-center rounded-full border border-[#9aa17d] font-sans text-[0.64rem] font-semibold text-[#586043]">
                  {match?.[1]}
                </span>
                <span>{renderInline(match?.[2] ?? item.text)}</span>
              </li>
            );
          })}
        </ol>,
      );
      continue;
    }

    if (isQuote(entry.text)) {
      output.push(
        <blockquote key={entry.index} className="breathing-quote border-l-2 border-[#9ba06f] bg-[#efeccf]/70 px-3 py-2 font-serif italic text-[#34392f]">
          {renderInline(entry.text.replace(/^>\s+/, ""))}
        </blockquote>,
      );
      cursor += 1;
      continue;
    }

    if (isCodeLike(entry.text)) {
      output.push(
        <pre key={entry.index} className="breathing-code overflow-hidden whitespace-pre-wrap font-mono text-[1em] leading-[1.6] text-[#3d4438]">
          {codeBody(entry.text)}
        </pre>,
      );
      cursor += 1;
      continue;
    }

    const label = subheading(entry.text);
    if (label) {
      output.push(
        <h4 key={entry.index} className="breathing-subheading font-serif font-semibold leading-snug text-[#536046]">
          {renderInline(label)}
        </h4>,
      );
      cursor += 1;
      continue;
    }

    output.push(
      <p key={entry.index} className="breathing-paragraph text-pretty">
        {renderInline(entry.text)}
      </p>,
    );
    cursor += 1;
  }

  return <div className={`breathing-flow grid content-start gap-2 ${className}`}>{output}</div>;
}

function PageHeading({
  heading,
  series,
  renderInline,
}: {
  heading: string;
  series?: Entry[];
  renderInline: InlineRenderer;
}) {
  const numberedHeading = heading.match(/^(\d{2}) — (.+)$/);
  const roomNumber = numberedHeading?.[1];
  const title = numberedHeading?.[2] ?? heading;
  const headingId = `breathing-heading-${roomNumber ?? "page"}`;

  return (
    <header className="breathing-header relative z-10 mb-3 shrink-0">
      {series?.length ? (
        <div className="breathing-series mb-2 border-l-2 border-[#d5bc73] pl-2.5">
          <p className="breathing-series-title font-serif text-[0.75rem] font-semibold tracking-[0.04em] text-[#4f5b42]">
            {renderInline(series[0].text)}
          </p>
          {series[1] ? (
            <p className="breathing-series-subtitle mt-0.5 font-serif text-[0.75rem] italic text-[#685d4c]">
              {renderInline(series[1].text)}
            </p>
          ) : null}
        </div>
      ) : null}
      {roomNumber ? (
        <div className="breathing-room-number mb-1.5 flex items-center gap-2 font-sans text-[0.75rem] font-semibold tracking-[0.16em] text-[#7c805f]">
          <span>{roomNumber}</span>
          <span className="h-px w-7 bg-[#c2b478]" aria-hidden />
          <span className="sr-only">—</span>
        </div>
      ) : null}
      <h3 id={headingId} className="breathing-heading max-w-[28ch] font-serif text-[clamp(1.02rem,0.82rem+0.75vw,1.38rem)] font-semibold leading-[1.18] tracking-[-0.015em] text-[#293228] text-balance">
        {title}
      </h3>
      <span className="breathing-heading-rule mt-2 block h-px w-14 bg-[#a1a57b]" aria-hidden />
    </header>
  );
}

function Illustration({
  src,
  alt,
  className = "",
  landscape = false,
}: {
  src: string;
  alt: string;
  className?: string;
  landscape?: boolean;
}) {
  return (
    <figure className={`breathing-illustration relative overflow-hidden border border-[#c8c2a8]/80 bg-[#eee9d9] ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        width={landscape ? 960 : 768}
        height={landscape ? 640 : 1152}
        loading="eager"
        decoding="async"
        draggable={false}
        className="h-full w-full object-cover"
      />
    </figure>
  );
}

function MorningTable({
  heading,
  entries,
  renderInline,
}: LayoutProps) {
  const hasSeries = entries[0]?.text.startsWith("**CĂN PHÒNG NHẸ ĐI")
    && entries[1]?.text.startsWith("*14 góc nhìn");
  const series = hasSeries ? entries.slice(0, 2) : undefined;
  const body = hasSeries ? entries.slice(2) : entries;
  const split = Math.min(2, body.length);

  return (
    <>
      <PageHeading heading={heading} series={series} renderInline={renderInline} />
      <div className="breathing-morning-grid grid grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] items-start gap-3">
        <div className="breathing-morning-scene relative">
          <Illustration
            src={ILLUSTRATIONS["morning-table"]}
            alt={ILLUSTRATION_ALTS["morning-table"]}
            className="h-72 rounded-[45%_45%_1.25rem_1.25rem]"
          />
        </div>
        <ParagraphFlow entries={body.slice(0, split)} renderInline={renderInline} className="breathing-morning-story" />
      </div>
      {body.length > split ? (
        <ParagraphFlow entries={body.slice(split)} renderInline={renderInline} className="breathing-morning-question mt-3 grid-cols-2 gap-x-4" />
      ) : null}
    </>
  );
}

function InvisibleReceipt({ heading, entries, renderInline }: LayoutProps) {
  const codeEntry = entries.find((entry) => isCodeLike(entry.text));
  const costHeading = entries.find((entry) => wholeBold(entry.text)?.includes("Chi phí thật"));
  const authoredCostLines = costHeading
    ? entries.filter((entry) => entry.index > costHeading.index && (
      entry.text === "GIÁ MUA" || entry.text.startsWith("+ ")
    ))
    : [];
  const consumed = new Set<number>();
  if (codeEntry) consumed.add(codeEntry.index);
  if (costHeading) consumed.add(costHeading.index);
  authoredCostLines.forEach((entry) => consumed.add(entry.index));
  const remaining = without(entries, consumed);
  const receiptStart = costHeading?.index ?? codeEntry?.index ?? 1;
  const before = remaining.filter((entry) => entry.index < receiptStart);
  const after = remaining.filter((entry) => entry.index > receiptStart);
  const lines = codeEntry
    ? codeBody(codeEntry.text).split("\n").filter((line) => line.trim())
    : authoredCostLines.map((entry) => entry.text);

  return (
    <>
      <PageHeading heading={heading} renderInline={renderInline} />
      <div className="breathing-receipt-layout grid grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] items-start gap-3">
        <div className="breathing-receipt-copy">
          <ParagraphFlow entries={before} renderInline={renderInline} />
          <div className="breathing-invisible-receipt relative mt-3 border-x border-[#c7bda4] bg-[#fffdf5] px-4 py-3 shadow-[0_7px_18px_rgba(75,64,40,0.09)]">
            <ReceiptText className="mb-2 size-5 text-[#737a59]" aria-hidden />
            {costHeading ? (
              <h4 className="mb-2 font-serif font-semibold text-[#4a5540]">
                {renderInline(wholeBold(costHeading.text) ?? costHeading.text)}
              </h4>
            ) : null}
            <div className="breathing-receipt-lines grid gap-1.5 font-mono text-[1em] font-semibold tracking-[0.01em] text-[#3c4237]">
              {lines.map((line, index) => (
                <div key={`${line}-${index}`} className="breathing-receipt-line border-b border-dotted border-[#beb69f] pb-1 last:border-0">
                  {line}
                </div>
              ))}
            </div>
            <span className="absolute -left-1 bottom-0 top-0 border-l border-dashed border-[#aaa287]" aria-hidden />
          </div>
        </div>
        <ParagraphFlow entries={after} renderInline={renderInline} className="breathing-receipt-reflection" />
      </div>
    </>
  );
}

interface ParsedTable {
  consumed: Set<number>;
  rows: string[][];
}

function parseAuthoredInventory(entries: Entry[]): ParsedTable | null {
  const groupHeader = entries.find((entry) => wholeBold(entry.text) === "Nhóm");
  const questionHeader = groupHeader
    ? entries.find((entry) => entry.index === groupHeader.index + 1 && wholeBold(entry.text) === "Câu hỏi")
    : undefined;
  if (!groupHeader || !questionHeader) return null;

  const rows: string[][] = [[
    wholeBold(groupHeader.text) ?? groupHeader.text,
    wholeBold(questionHeader.text) ?? questionHeader.text,
  ]];
  const consumed = new Set([groupHeader.index, questionHeader.index]);
  let cursor = entries.findIndex((entry) => entry.index === questionHeader.index) + 1;
  while (cursor < entries.length) {
    const label = wholeBold(entries[cursor].text);
    const answer = entries[cursor + 1];
    if (!label || !answer || wholeBold(answer.text) || isBullet(answer.text)) break;
    rows.push([label, answer.text]);
    consumed.add(entries[cursor].index);
    consumed.add(answer.index);
    cursor += 2;
  }
  return rows.length > 1 ? { consumed, rows } : null;
}

function parseMarkdownTable(entries: Entry[]): ParsedTable | null {
  const candidates = entries.filter((entry) => entry.text.split("\n").some((line) => /^\s*\|/.test(line)));
  if (!candidates.length) return null;
  const rows = candidates
    .flatMap((entry) => entry.text.split("\n"))
    .filter((line) => /^\s*\|/.test(line))
    .map((line) => line.trim().replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim()))
    .filter((row) => !row.every((cell) => /^:?-{3,}:?$/.test(cell)));
  return rows.length ? { consumed: new Set(candidates.map((entry) => entry.index)), rows } : null;
}

function InventoryTable({ heading, entries, renderInline }: LayoutProps) {
  const table = parseMarkdownTable(entries) ?? parseAuthoredInventory(entries);
  const remaining = table ? without(entries, table.consumed) : entries;
  const intro = remaining.slice(0, Math.min(2, remaining.length));
  const examples = remaining.slice(intro.length);

  return (
    <>
      <PageHeading heading={heading} renderInline={renderInline} />
      <ParagraphFlow entries={intro} renderInline={renderInline} className="breathing-inventory-intro mb-3" />
      {table ? (
        <div className="breathing-inventory-table overflow-visible border border-[#b7b99b] bg-[#fbf8eb]">
          <table className="w-full border-collapse text-left">
            <thead className="bg-[#dde0c8] font-serif text-[#394132]">
              <tr>
                {table.rows[0].map((cell, index) => (
                  <th key={index} scope="col" className="border-r border-[#b7b99b] px-2.5 py-2 font-semibold last:border-r-0">
                    {renderInline(cell)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex} className="border-t border-[#c8c7af] even:bg-[#f1edda]/70">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="border-r border-[#d0ceb9] px-2.5 py-2 align-top last:border-r-0">
                      {renderInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      <ParagraphFlow entries={examples} renderInline={renderInline} className="breathing-inventory-examples mt-3 grid-cols-2 gap-x-4" />
    </>
  );
}

function diagramTokens(entry: Entry | undefined) {
  if (!entry) return [];
  return codeBody(entry.text)
    .split("\n")
    .flatMap((line) => line
      .replace(/[│┌┐└┘├┤┬┴┼─━┏┓┗┛▼▲←→↓↑]/g, " ")
      .trim()
      .split(/\s{2,}/))
    .map((token) => token.trim())
    .filter((token) => token && token !== "+" && /\p{L}/u.test(token));
}

function FiveDoors({ heading, entries, renderInline }: LayoutProps) {
  const diagram = entries.find((entry) => isCodeLike(entry.text));
  const source = entries.find((entry) => wholeBold(entry.text) === "MÓN ĐỒ");
  const sourcePosition = source ? entries.findIndex((entry) => entry.index === source.index) : -1;
  const authoredOptions: Entry[] = [];
  if (sourcePosition >= 0) {
    let cursor = sourcePosition + 1;
    while (cursor < entries.length && isBullet(entries[cursor].text)) {
      authoredOptions.push(entries[cursor]);
      cursor += 1;
    }
  }
  const tokens = diagram
    ? diagramTokens(diagram)
    : source
      ? [wholeBold(source.text) ?? source.text, ...authoredOptions.map((entry) => entry.text.replace(/^-\s+/, ""))]
      : [];
  const consumed = new Set(diagram ? [diagram.index] : []);
  if (source) consumed.add(source.index);
  authoredOptions.forEach((entry) => consumed.add(entry.index));
  const prose = without(entries, consumed);

  return (
    <>
      <PageHeading heading={heading} renderInline={renderInline} />
      <ParagraphFlow entries={prose.slice(0, 1)} renderInline={renderInline} className="breathing-doors-intro mb-3" />
      {tokens.length ? (
        <figure className="breathing-doors-diagram relative border-y border-[#c4c3a4] py-3" aria-label={heading}>
          <div className="breathing-door-source mx-auto mb-3 flex w-fit items-center gap-2 bg-[#e6dfc5] px-3 py-1.5 font-serif font-semibold text-[#3f4938]">
            <PackageOpen className="size-4" aria-hidden />
            <span>{tokens[0]}</span>
          </div>
          <div className="breathing-door-options grid grid-cols-5 gap-1.5">
            {tokens.slice(1).map((token, index) => (
              <div key={`${token}-${index}`} className="breathing-door flex min-h-16 flex-col items-center justify-center gap-1 border border-[#aeb292] bg-[#faf7e9] px-1 py-2 text-center font-serif text-[1em] font-semibold leading-[1.45] text-[#46513d]">
                <DoorOpen className="size-4 text-[#9a7a4d]" aria-hidden />
                <span>{token}</span>
              </div>
            ))}
          </div>
        </figure>
      ) : null}
      <ParagraphFlow entries={prose.slice(1)} renderInline={renderInline} className="breathing-doors-notes mt-3 grid-cols-2 gap-x-4" />
    </>
  );
}

function SharedHome({ heading, entries, renderInline }: LayoutProps) {
  const split = Math.min(2, entries.length);
  return (
    <>
      <PageHeading heading={heading} renderInline={renderInline} />
      <div className="breathing-home-grid grid grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] items-start gap-3">
        <Illustration src={ILLUSTRATIONS["shared-home"]} alt={ILLUSTRATION_ALTS["shared-home"]} className="h-52 rounded-t-[6rem]" />
        <ParagraphFlow entries={entries.slice(0, split)} renderInline={renderInline} className="breathing-home-intro" />
      </div>
      <ParagraphFlow entries={entries.slice(split)} renderInline={renderInline} className="breathing-home-notes mt-3 columns-2 gap-x-5" />
    </>
  );
}

function bulletEntries(entries: Entry[]) {
  return entries.filter((entry) => isBullet(entry.text));
}

function BulletCards({ entries, renderInline, className = "" }: { entries: Entry[]; renderInline: InlineRenderer; className?: string }) {
  return (
    <ul className={`breathing-card-list grid gap-2 ${className}`}>
      {entries.map((entry) => (
        <li key={entry.index} className="breathing-paper-note relative border border-[#c7bea1] bg-[#fffaf0] px-3 py-2 leading-snug shadow-[2px_3px_0_rgba(138,119,78,0.1)]">
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-[#d6b65b]" aria-hidden />
          {renderInline(entry.text.replace(/^-\s+/, ""))}
        </li>
      ))}
    </ul>
  );
}

function MemoryBox({ heading, entries, renderInline }: LayoutProps) {
  const bullets = bulletEntries(entries);
  const bulletIndexes = new Set(bullets.map((entry) => entry.index));
  const prose = without(entries, bulletIndexes);
  const firstBullet = bullets[0]?.index ?? Number.POSITIVE_INFINITY;
  const before = prose.filter((entry) => entry.index < firstBullet);
  const after = prose.filter((entry) => entry.index > firstBullet);
  const opening = before.slice(0, 3);
  const prompt = before.slice(3);

  return (
    <>
      <PageHeading heading={heading} renderInline={renderInline} />
      <div className="breathing-memory-opening grid grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] gap-3">
        <Illustration src={ILLUSTRATIONS["memory-box"]} alt={ILLUSTRATION_ALTS["memory-box"]} className="h-44 rounded-[1rem_1rem_4rem_1rem]" />
        <ParagraphFlow entries={opening} renderInline={renderInline} className="breathing-memory-intro" />
      </div>
      {prompt.length ? (
        <ParagraphFlow entries={prompt} renderInline={renderInline} className="breathing-memory-prompt mt-3" />
      ) : null}
      {bullets.length ? (
        <BulletCards entries={bullets} renderInline={renderInline} className="breathing-memory-notes mt-3 grid-cols-2" />
      ) : null}
      <ParagraphFlow entries={after} renderInline={renderInline} className="breathing-memory-close mt-3 grid-cols-2 gap-x-4" />
    </>
  );
}

function PurchaseWaitlist({ heading, entries, renderInline }: LayoutProps) {
  const questions = bulletEntries(entries);
  const questionIndexes = new Set(questions.map((entry) => entry.index));
  const prose = without(entries, questionIndexes);
  const firstQuestion = questions[0]?.index ?? Number.POSITIVE_INFINITY;
  const lastQuestion = questions.at(-1)?.index ?? Number.NEGATIVE_INFINITY;
  const before = prose.filter((entry) => entry.index < firstQuestion);
  const after = prose.filter((entry) => entry.index > lastQuestion);

  return (
    <>
      <PageHeading heading={heading} renderInline={renderInline} />
      <div className="breathing-waitlist relative border border-[#bdb79d] bg-[#fffdf4] px-4 py-3 shadow-[5px_7px_0_rgba(111,104,75,0.08)]">
        <ShoppingBag className="absolute right-3 top-3 size-5 text-[#7f865f]" aria-hidden />
        <ParagraphFlow entries={before} renderInline={renderInline} className="breathing-waitlist-intro pr-7" />
        {questions.length ? (
          <ul className="breathing-waitlist-questions my-3 grid grid-cols-2 gap-x-4 gap-y-2 border-y border-dashed border-[#c2b99e] py-3">
            {questions.map((entry) => (
              <li key={entry.index} className="flex items-start gap-2 leading-snug">
                <span className="mt-[0.2em] size-3 shrink-0 border border-[#8b936b]" aria-hidden />
                <span>{renderInline(entry.text.replace(/^-\s+/, ""))}</span>
              </li>
            ))}
          </ul>
        ) : null}
        <ParagraphFlow entries={after} renderInline={renderInline} className="breathing-waitlist-close columns-2 gap-x-5" />
        <span className="absolute inset-y-0 left-2 border-l border-dotted border-[#d0c6a8]" aria-hidden />
      </div>
    </>
  );
}

function FutureFittingRoom({ heading, entries, renderInline }: LayoutProps) {
  const bullets = bulletEntries(entries);
  const bulletIndexes = new Set(bullets.map((entry) => entry.index));
  const prose = without(entries, bulletIndexes);
  const topProse = prose.slice(0, 1);
  const rest = prose.slice(1);

  return (
    <>
      <PageHeading heading={heading} renderInline={renderInline} />
      <div className="breathing-fitting-grid grid grid-cols-[minmax(0,0.56fr)_minmax(0,0.44fr)] gap-3">
        <div className="breathing-fitting-copy">
          <ParagraphFlow entries={topProse} renderInline={renderInline} />
          {bullets.length ? <BulletCards entries={bullets} renderInline={renderInline} className="breathing-future-roles mt-3" /> : null}
        </div>
        <Illustration src={ILLUSTRATIONS["future-fitting-room"]} alt={ILLUSTRATION_ALTS["future-fitting-room"]} className="h-64 rounded-t-[6rem]" />
      </div>
      <ParagraphFlow entries={rest} renderInline={renderInline} className="breathing-fitting-reflection mt-3 grid-cols-2 gap-x-4" />
    </>
  );
}

function PaidReceipt({ heading, entries, renderInline }: LayoutProps) {
  return (
    <>
      <PageHeading heading={heading} renderInline={renderInline} />
      <div className="breathing-paid-receipt relative mx-auto w-[94%] border-x border-[#c5baa0] bg-[#fffdf5] px-5 py-4 shadow-[0_8px_22px_rgba(83,69,41,0.1)]">
        <ReceiptText className="breathing-paid-mark absolute right-4 top-4 size-5 text-[#7d835e]" aria-hidden />
        <ParagraphFlow entries={entries} renderInline={renderInline} className="breathing-paid-copy pb-14 pr-6" />
        <span className="breathing-paid-stamp absolute bottom-5 right-5 inline-flex size-12 rotate-[-11deg] items-center justify-center rounded-full border-2 border-[#73805c]/60 text-[#66734f]/75" aria-hidden>
          <Check className="size-6" />
        </span>
        <span className="breathing-paid-edge breathing-paid-edge--left absolute -left-1 bottom-0 top-0 border-l border-dashed border-[#aaa187]" aria-hidden />
        <span className="breathing-paid-edge breathing-paid-edge--right absolute -right-1 bottom-0 top-0 border-r border-dashed border-[#aaa187]" aria-hidden />
      </div>
    </>
  );
}

interface ArrowRow {
  left: string;
  right: string;
}

function parseArrowRows(entries: Entry[]): ArrowRow[] {
  return entries
    .flatMap((entry) => codeBody(entry.text).split("\n"))
    .map((line) => line.trim())
    .filter((line) => line.includes("→"))
    .map((line) => {
      const [left, ...right] = line.split("→");
      return { left: left.trim(), right: right.join("→").trim() };
    })
    .filter((row) => row.left && row.right);
}

function SpaceExchange({ heading, entries, renderInline }: LayoutProps) {
  const diagramEntries = entries.filter((entry) => entry.text.includes("→"));
  const rows = parseArrowRows(diagramEntries);
  const prose = without(entries, new Set(diagramEntries.map((entry) => entry.index)));
  const diagramStart = diagramEntries[0]?.index;
  const splitAt = diagramStart != null ? prose.findIndex((entry) => entry.index > diagramStart) : 1;
  const safeSplit = splitAt >= 0 ? splitAt : prose.length;

  return (
    <>
      <PageHeading heading={heading} renderInline={renderInline} />
      <ParagraphFlow entries={prose.slice(0, safeSplit)} renderInline={renderInline} className="breathing-exchange-intro mb-3" />
      {rows.length ? (
        <dl className="breathing-exchange grid gap-1.5 border-y border-[#b9bea0] py-3">
          {rows.map((row, index) => (
            <div key={`${row.left}-${index}`} className="breathing-exchange-row grid grid-cols-[minmax(0,1fr)_1.5rem_minmax(0,1fr)] items-center gap-2 bg-[#f4f1df]/80 px-3 py-2">
              <dt className="font-sans text-[1em] font-semibold tracking-[0.01em] text-[#4d5545]">{row.left}</dt>
              <ArrowRight className="size-4 text-[#bd9658]" aria-hidden />
              <dd className="font-serif font-semibold text-[#3e4938]">{row.right}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      <ParagraphFlow entries={prose.slice(safeSplit)} renderInline={renderInline} className="breathing-exchange-close mt-3 grid-cols-2 gap-x-4" />
    </>
  );
}

function TwoValidRooms({ heading, entries, renderInline }: LayoutProps) {
  const split = Math.min(3, entries.length);

  return (
    <>
      <PageHeading heading={heading} renderInline={renderInline} />
      <div className="breathing-rooms-grid grid grid-cols-[minmax(0,0.43fr)_minmax(0,0.57fr)] gap-3">
        <Illustration
          src={ILLUSTRATIONS["two-valid-rooms"]}
          alt={ILLUSTRATION_ALTS["two-valid-rooms"]}
          className="h-72 rounded-t-[7rem]"
        />
        <ParagraphFlow entries={entries.slice(0, split)} renderInline={renderInline} className="breathing-rooms-intro" />
      </div>
      <ParagraphFlow entries={entries.slice(split)} renderInline={renderInline} className="breathing-rooms-copy mt-3" />
    </>
  );
}

function FarewellPostcard({ heading, entries, renderInline }: LayoutProps) {
  const steps = entries.filter((entry) => isOrdered(entry.text));
  const stepIndexes = new Set(steps.map((entry) => entry.index));
  const prose = without(entries, stepIndexes);
  const firstStep = steps[0]?.index ?? Number.POSITIVE_INFINITY;
  const before = prose.filter((entry) => entry.index < firstStep);
  const after = prose.filter((entry) => entry.index > firstStep);

  return (
    <>
      <PageHeading heading={heading} renderInline={renderInline} />
      <div className="breathing-postcard relative rotate-[-0.4deg] border border-[#bdb396] bg-[#fffaf0] p-3 shadow-[5px_6px_0_rgba(103,87,55,0.09)]">
        <div className="breathing-postcard-top relative grid grid-cols-[minmax(0,0.46fr)_minmax(0,0.54fr)] gap-3">
          <Illustration src={ILLUSTRATIONS["farewell-postcard"]} alt={ILLUSTRATION_ALTS["farewell-postcard"]} landscape className="h-36 border-[5px] border-white shadow-sm" />
          <ParagraphFlow entries={before} renderInline={renderInline} className="breathing-postcard-intro" />
          <span className="breathing-postcard-divider absolute inset-y-0 left-[46%] border-l border-dashed border-[#c9bea3]" aria-hidden />
        </div>
        {steps.length ? <ParagraphFlow entries={steps} renderInline={renderInline} className="breathing-postcard-steps mt-3 grid-cols-2 gap-x-4 font-[family-name:var(--font-caveat)]" /> : null}
        <ParagraphFlow entries={after} renderInline={renderInline} className="breathing-postcard-close mt-3 columns-2 gap-x-5" />
      </div>
    </>
  );
}

function EnoughCompass({ heading, entries, renderInline }: LayoutProps) {
  const diagram = entries.find((entry) => isCodeLike(entry.text));
  const directionPairs: Array<{ label: string; body: Entry; index: number }> = [];
  const consumed = new Set(diagram ? [diagram.index] : []);
  if (!diagram) {
    entries.forEach((entry, index) => {
      const label = wholeBold(entry.text);
      const body = entries[index + 1];
      if (!label || !body || wholeBold(body.text) || directionPairs.length >= 4) return;
      directionPairs.push({ label, body, index: entry.index });
      consumed.add(entry.index);
      consumed.add(body.index);
    });
  }
  const prose = without(entries, consumed);
  const diagramStart = diagram?.index ?? directionPairs[0]?.index;
  const splitAt = diagramStart != null ? prose.findIndex((entry) => entry.index > diagramStart) : 1;
  const safeSplit = splitAt >= 0 ? splitAt : prose.length;

  return (
    <>
      <PageHeading heading={heading} renderInline={renderInline} />
      <div className="breathing-compass-layout grid grid-cols-[minmax(0,0.54fr)_minmax(0,0.46fr)] items-start gap-3">
        <figure className="breathing-compass-visual relative flex min-h-64 items-center justify-center overflow-hidden rounded-[50%] border border-[#aeb493] bg-[#f3efda] p-4" aria-label={heading}>
          <Compass className="absolute size-48 text-[#88906b]/15" strokeWidth={0.8} aria-hidden />
          {diagram ? (
            <pre className="relative z-10 whitespace-pre-wrap text-center font-mono text-[0.64em] font-semibold leading-[1.48] text-[#424b3d]">
              {codeBody(diagram.text)}
            </pre>
          ) : directionPairs.length ? (
            <div className="breathing-compass-points relative z-10 grid grid-cols-2 gap-2 text-center">
              {directionPairs.map((pair, index) => (
                <div key={pair.index} className={`breathing-compass-point breathing-compass-point--${index + 1} border border-[#b8ba9a] bg-[#fffbee]/90 px-2 py-2 leading-snug`}>
                  <h4 className="font-serif text-[1em] font-semibold tracking-[0.03em] text-[#4e5944]">{renderInline(pair.label)}</h4>
                  <p className="mt-1 text-[1em]">{renderInline(pair.body.text)}</p>
                </div>
              ))}
            </div>
          ) : <Compass className="size-28 text-[#7b8464]" aria-hidden />}
        </figure>
        <div className="breathing-compass-copy">
          <ParagraphFlow entries={prose.slice(0, safeSplit)} renderInline={renderInline} />
          <ParagraphFlow entries={prose.slice(safeSplit)} renderInline={renderInline} className="mt-3" />
        </div>
      </div>
    </>
  );
}

interface LabeledPair {
  label: string;
  body?: Entry;
  labelIndex: number;
}

function labeledPairs(entries: Entry[]) {
  const pairs: LabeledPair[] = [];
  const consumed = new Set<number>();

  entries.forEach((entry, index) => {
    if (consumed.has(entry.index)) return;
    const label = wholeBold(entry.text);
    if (!label) return;
    const next = entries[index + 1];
    const body = next && !subheading(next.text) && !isBullet(next.text) && !isOrdered(next.text)
      ? next
      : undefined;
    pairs.push({ label, body, labelIndex: entry.index });
    consumed.add(entry.index);
    if (body) consumed.add(body.index);
  });

  return { pairs, consumed };
}

function splitSunpathLabel(label: string) {
  const match = label.match(/^(Ngày\s+\d+)\s+—\s+(.+)$/u);
  return match
    ? { day: match[1], title: match[2] }
    : { day: undefined, title: label };
}

function SevenDaySunpath({ heading, entries, renderInline }: LayoutProps) {
  const { pairs, consumed } = labeledPairs(entries);
  const prose = without(entries, consumed);
  const firstPair = pairs[0]?.labelIndex ?? Number.POSITIVE_INFINITY;
  const lastPair = pairs.at(-1)?.body?.index ?? pairs.at(-1)?.labelIndex ?? Number.NEGATIVE_INFINITY;
  const before = prose.filter((entry) => entry.index < firstPair);
  const between = prose.filter((entry) => entry.index >= firstPair && entry.index <= lastPair);
  const after = prose.filter((entry) => entry.index > lastPair);

  return (
    <>
      <PageHeading heading={heading} renderInline={renderInline} />
      <ParagraphFlow entries={before} renderInline={renderInline} className="breathing-sunpath-intro mb-3" />
      {pairs.length ? (
        <div className="breathing-sunpath-wrap relative">
          <span className="breathing-sunpath-line pointer-events-none absolute inset-y-2 left-1/2 w-px -translate-x-1/2 bg-[#d1b867]" aria-hidden />
          <ol className="breathing-sunpath relative grid grid-cols-2 gap-x-4 gap-y-2.5">
            {pairs.map((pair, index) => {
              const label = splitSunpathLabel(pair.label);
              return (
                <li key={pair.labelIndex} className={`breathing-sun-step relative border border-[#bbb99b] bg-[#fbf8e9] px-3 py-2 ${index % 2 ? "translate-y-2" : ""}`}>
                  <label
                    data-page-control
                    className="absolute right-0 top-0 flex size-11 cursor-pointer items-center justify-center"
                  >
                    <input
                      type="checkbox"
                      data-page-control
                      aria-label={`Đánh dấu ${pair.label}`}
                      className="breathing-sun-check size-5 accent-[#75805d]"
                    />
                  </label>
                  <div
                    className="breathing-sun-copy"
                    data-has-detail={pair.body ? "true" : undefined}
                  >
                    <h4 className="pr-10 font-serif font-semibold leading-snug text-[#4c5941]">
                      {label.day ? (
                        <>
                          <span className="breathing-sun-day">{renderInline(label.day)}</span>
                          <span className="breathing-sun-separator" aria-hidden> — </span>
                        </>
                      ) : null}
                      <span className="breathing-sun-title">{renderInline(label.title)}</span>
                    </h4>
                    {pair.body ? (
                      <p className="breathing-sun-detail mt-1 text-pretty leading-snug">
                        {renderInline(pair.body.text)}
                      </p>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
          <SunMedium className="absolute -bottom-5 left-1/2 size-7 -translate-x-1/2 bg-[#f9f5e6] p-1 text-[#c29c4f]" aria-hidden />
        </div>
      ) : null}
      <ParagraphFlow entries={between} renderInline={renderInline} className="breathing-sunpath-between mt-3" />
      <ParagraphFlow entries={after} renderInline={renderInline} className="breathing-sunpath-close mt-5 grid-cols-2 gap-x-4" />
    </>
  );
}

interface LayoutProps {
  heading: string;
  entries: Entry[];
  renderInline: InlineRenderer;
}

function renderLayout(design: BreathingHouseDesign, props: LayoutProps) {
  switch (design) {
    case "morning-table": return <MorningTable {...props} />;
    case "invisible-receipt": return <InvisibleReceipt {...props} />;
    case "inventory-table": return <InventoryTable {...props} />;
    case "five-doors": return <FiveDoors {...props} />;
    case "shared-home": return <SharedHome {...props} />;
    case "memory-box": return <MemoryBox {...props} />;
    case "purchase-waitlist": return <PurchaseWaitlist {...props} />;
    case "future-fitting-room": return <FutureFittingRoom {...props} />;
    case "paid-receipt": return <PaidReceipt {...props} />;
    case "space-exchange": return <SpaceExchange {...props} />;
    case "two-valid-rooms": return <TwoValidRooms {...props} />;
    case "farewell-postcard": return <FarewellPostcard {...props} />;
    case "enough-compass": return <EnoughCompass {...props} />;
    case "seven-day-sunpath": return <SevenDaySunpath {...props} />;
  }
}

/**
 * Static, clone-safe interior for the 14 leaves of the “Ngôi nhà đang thở”
 * edition. Interactions stay in FlipBookReader; this component only emits
 * semantic content and decorative imagery for StPageFlip to clone.
 */
export function BreathingHousePage({
  design,
  heading,
  paragraphs,
  visualOnly = false,
  renderInline = defaultInline,
}: BreathingHousePageProps) {
  return (
    <article
      className={`breathing-page breathing-page--${design} relative h-full w-full overflow-hidden font-sans text-[1.0625rem] leading-[1.68] text-[#30362d]`}
      data-breathing-design={design}
      data-visual-only={visualOnly || undefined}
      aria-labelledby={`breathing-heading-${heading.match(/^(\d{2}) —/)?.[1] ?? "page"}`}
      tabIndex={0}
    >
      {renderLayout(design, {
        heading,
        entries: entriesFor(paragraphs),
        renderInline,
      })}
    </article>
  );
}
