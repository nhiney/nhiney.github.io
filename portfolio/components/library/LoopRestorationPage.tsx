import type { ReactNode } from "react";
import type { LoopRestorationPageDesign } from "@/data/books";
import styles from "./LoopRestorationPage.module.css";

type Props = {
  design: LoopRestorationPageDesign;
  heading: string;
  paragraphs: string[];
  continuation?: boolean;
  figureAfter?: number;
  showNotes?: boolean;
  renderInline: (text: string) => ReactNode;
};

const ASSET_ROOT = "/books/muon-kiep-nhan-sinh-2";

const DESIGN_ASSETS: Record<LoopRestorationPageDesign, string | null> = {
  "ripple-butterfly": `${ASSET_ROOT}/design-preview/option-1-thread-ripple.png`,
  "loop-break": null,
  "culture-weave": `${ASSET_ROOT}/design-preview/option-2-loop-weave.png`,
  "responsibility-rings": `${ASSET_ROOT}/workshop/responsibility-rings.png`,
  "fear-wall": `${ASSET_ROOT}/workshop/fear-wall.png`,
  "achievement-mountain": `${ASSET_ROOT}/workshop/achievement-mountain.png`,
  "love-control-knot": `${ASSET_ROOT}/workshop/love-control-knot.png`,
  "sound-memory-wave": `${ASSET_ROOT}/workshop/sound-memory-wave.png`,
  "threshold-today": `${ASSET_ROOT}/workshop/threshold-today.png`,
  "repair-stages": null,
  "forgiveness-gate": `${ASSET_ROOT}/design-preview/option-3-crack-gates.png`,
  "storm-checks": `${ASSET_ROOT}/workshop/storm-checks.png`,
  "accountable-repair": `${ASSET_ROOT}/workshop/accountable-repair.png`,
  "seven-day-thread": `${ASSET_ROOT}/workshop/seven-day-thread.png`,
};

const THREAD_DESIGNS = new Set<LoopRestorationPageDesign>([
  "ripple-butterfly",
  "loop-break",
  "culture-weave",
  "responsibility-rings",
  "love-control-knot",
  "sound-memory-wave",
  "seven-day-thread",
]);

function isTableRow(value: string) {
  return value.startsWith("|") && value.endsWith("|");
}

function isTableRule(value: string) {
  return /^\|(?:\s*:?-+:?\s*\|)+$/.test(value);
}

function tableCells(value: string) {
  return value.slice(1, -1).split("|").map((cell) => cell.trim());
}

function ProcessBlock({ source, design }: { source: string; design: LoopRestorationPageDesign }) {
  const body = source
    .replace(/^```text\n?/, "")
    .replace(/\n?```$/, "");
  const lines = body.split("\n");
  const hasArrow = lines.some((line) => line.trim() === "↓");

  if (hasArrow) {
    const groups = body
      .split(/\n\s*\n/)
      .map((group) => group
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line && line !== "↓"))
      .filter((group) => group.length > 0);

    return (
      <div className={styles.process} data-process-design={design}>
        {groups.map((steps, groupIndex) => (
          <ol
            className={styles.orderedList}
            key={`process-group-${groupIndex}`}
            aria-label={groups.length > 1 ? `Trình tự ${groupIndex + 1}` : "Trình tự các bước"}
            style={{ width: "100%" }}
          >
            {steps.map((step, stepIndex) => (
              <li key={`${step}-${stepIndex}`}>{step}</li>
            ))}
          </ol>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.process} data-process-design={design}>
      {lines.map((line, index) => {
        if (!line.trim()) return <span className={styles.processGap} key={index} aria-hidden />;
        const arrow = line.trim() === "↓";
        return (
          <span className={arrow ? styles.processArrow : styles.processLine} key={index}>
            {line.trim()}
          </span>
        );
      })}
    </div>
  );
}

function ContentBlocks({
  paragraphs,
  design,
  renderInline,
  onAfter,
}: {
  paragraphs: string[];
  design: LoopRestorationPageDesign;
  renderInline: (text: string) => ReactNode;
  onAfter: (index: number) => ReactNode;
}) {
  const blocks: ReactNode[] = [];

  for (let index = 0; index < paragraphs.length;) {
    const paragraph = paragraphs[index];

    if (paragraph.startsWith("```")) {
      blocks.push(<ProcessBlock key={`process-${index}`} source={paragraph} design={design} />);
      blocks.push(onAfter(index));
      index += 1;
      continue;
    }

    if (isTableRow(paragraph)) {
      const rows: string[][] = [];
      const start = index;
      while (index < paragraphs.length && isTableRow(paragraphs[index])) {
        if (!isTableRule(paragraphs[index])) rows.push(tableCells(paragraphs[index]));
        index += 1;
      }
      const [head, ...body] = rows;
      blocks.push(
        <div className={styles.tableWrap} key={`table-${start}`}>
          <table>
            <thead>
              <tr>{head.map((cell, cellIndex) => <th key={cellIndex}>{renderInline(cell)}</th>)}</tr>
            </thead>
            <tbody>
              {body.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => <td key={cellIndex}>{renderInline(cell)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      blocks.push(onAfter(index - 1));
      continue;
    }

    if (paragraph.startsWith("- ") || /^\d+\.\s/.test(paragraph)) {
      const ordered = /^\d+\.\s/.test(paragraph);
      const start = index;
      const items: string[] = [];
      while (
        index < paragraphs.length
        && (ordered ? /^\d+\.\s/.test(paragraphs[index]) : paragraphs[index].startsWith("- "))
      ) {
        items.push(paragraphs[index].replace(ordered ? /^\d+\.\s/ : /^-\s/, ""));
        index += 1;
      }
      const listItems = items.map((item, itemIndex) => (
        <li key={itemIndex}>{renderInline(item)}</li>
      ));
      if (ordered) {
        const firstNumber = Number(paragraph.match(/^(\d+)\./)?.[1] ?? 1);
        blocks.push(
          <ol className={styles.orderedList} key={`list-${start}`} start={firstNumber}>
            {listItems}
          </ol>
        );
      } else {
        blocks.push(
          <ul className={styles.bulletList} key={`list-${start}`}>
            {listItems}
          </ul>
        );
      }
      blocks.push(onAfter(index - 1));
      continue;
    }

    if (paragraph.startsWith("> ")) {
      blocks.push(<blockquote key={`quote-${index}`}>{renderInline(paragraph.slice(2))}</blockquote>);
    } else if (/^\*\*[^*]+\*\*:?$/.test(paragraph)) {
      blocks.push(<h3 className={styles.sectionLabel} key={`label-${index}`}>{renderInline(paragraph)}</h3>);
    } else {
      blocks.push(<p key={`paragraph-${index}`}>{renderInline(paragraph)}</p>);
    }
    blocks.push(onAfter(index));
    index += 1;
  }

  return blocks;
}

export function LoopRestorationPage({
  design,
  heading,
  paragraphs,
  continuation = false,
  figureAfter,
  showNotes = false,
  renderInline,
}: Props) {
  const headingMatch = heading.match(/^(\d{2})\s+—\s+(.+)$/);
  const number = headingMatch?.[1] ?? "";
  const title = headingMatch?.[2] ?? heading;
  const visualFamily = THREAD_DESIGNS.has(design) ? "thread" : "repair";
  const renderFigure = (index: number) => {
    const asset = DESIGN_ASSETS[design];
    if (index !== figureAfter || !asset) return null;
    return (
      <figure className={styles.figure} data-figure-design={design} key={`figure-${design}`}>
        {/* Generated editorial artwork; the prose already carries its meaning. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset} alt="" aria-hidden="true" />
      </figure>
    );
  };

  return (
    <article
      className={`loop-restoration-page ${styles.page}`}
      data-design={design}
      data-visual-family={visualFamily}
      data-continuation={continuation || undefined}
    >
      <header className={styles.header}>
        <span className={styles.number} aria-hidden>{number}</span>
        <div>
          <p className={styles.runningHead}>
            {design === "ripple-butterfly" && !continuation
              ? "Những vòng lặp có thể được viết lại"
              : `Xưởng phục hồi những vòng lặp${continuation ? " · tiếp" : ""}`}
          </p>
          {design === "ripple-butterfly" && !continuation ? (
            <p className={styles.seriesSubtitle}>
              14 góc nhìn từ <em>Muôn Kiếp Nhân Sinh — Tập 2</em>
            </p>
          ) : null}
          <h2>{title}</h2>
        </div>
      </header>

      <div className={styles.body}>
        {figureAfter === -1 ? renderFigure(-1) : null}
        <ContentBlocks
          paragraphs={paragraphs}
          design={design}
          renderInline={renderInline}
          onAfter={renderFigure}
        />

        {showNotes ? (
          <textarea
            className={styles.notes}
            data-page-control
            data-note-storage-key="muon-kiep-nhan-sinh-2:seven-day-loop"
            aria-label="Ghi chú vòng lặp trong bảy ngày"
            rows={5}
            maxLength={220}
          />
        ) : null}
      </div>
    </article>
  );
}
