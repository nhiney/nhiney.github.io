"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Navbar } from "@/components/layout/Navbar";
import s from "./planner.module.css";
import { SEP, parseMeal, searchFoods, type Item } from "./foods";

type Tag = "thesis" | "code" | "learn" | "life";
type Slot = { id: string; start: string; end: string; label: string; note: string; tag: Tag; after?: { label: string; note: string; tag: Tag } };
type Cup = { time: string; ml: number; note: string };
type Milestone = { from: string; to: string; title: string; note: string };
// Every personal string (labels, dates, categories) lives in the encrypted vault, never in this file.
type Data = {
  start: string; defense: string; event: string; phases: [string, string]; tags: Record<Tag, string>; planFields: [string, string][];
  kcal: string; slots: Slot[]; water: Cup[]; milestones: Milestone[];
};
type Expense = { n: string; a: number; k: string };
type Eat = { n: string; q: string; k: number; m: number };
// t = text, d = done, at = "HH:MM" when the line starts with a time, hi = marked important with "!".
type Todo = { t: string; d: boolean; at?: string; hi?: boolean };
// food / todo are optional: days saved before those tabs existed have none.
type Day = { done: Record<string, boolean>; water: Record<string, boolean>; exp: Expense[]; plan: Record<string, string>; food?: Eat[]; todo?: Todo[] };
type Vault = { v: number; iter: number; salt: string; iv: string; data: string };

const PASS_KEY = "lich24h:pass";
const DAYS_KEY = "lich24h:days";
const KINDS = ["Thiết yếu", "Muốn", "Học tập", "Tiết kiệm"];
const MEALS = ["Sáng", "Trưa", "Phụ", "Tối"];
const TABS = [
  ["plan", "Lịch"],
  ["todo", "Việc"],
  ["water", "Nước"],
  ["food", "Ăn uống"],
  ["money", "Chi tiêu"],
  ["tomorrow", "Ngày mai"],
  ["stats", "Thống kê"],
] as const;
type TabId = (typeof TABS)[number][0];

// ---------- helpers ----------
const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");
const vnd = (n: number) => n.toLocaleString("vi-VN") + " ₫";
const ymd = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const parseDate = (x: string) => { const [y, m, d] = x.split("-").map(Number); return new Date(y, m - 1, d); };
const addDays = (x: string, n: number) => { const d = parseDate(x); d.setDate(d.getDate() + n); return ymd(d); };
const diffDays = (a: string, b: string) => Math.round((parseDate(b).getTime() - parseDate(a).getTime()) / 864e5);
const toMin = (t: string) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
const span = (a: number, b: number) => (b - a + 1440) % 1440;
const inSlot = (sl: Slot, min: number) => { const a = toMin(sl.start), b = toMin(sl.end); return a < b ? min >= a && min < b : min >= a || min < b; };
const fmtDur = (m: number) => { const h = Math.floor(m / 60), r = m % 60; return h && r ? `${h} giờ ${r} phút` : h ? `${h} giờ` : `${r} phút`; };
const shortDur = (m: number) => { const h = Math.floor(m / 60), r = m % 60; return h && r ? `${h}g${String(r).padStart(2, "0")}` : h ? `${h} giờ` : `${r} phút`; };
const emptyDay = (): Day => ({ done: {}, water: {}, exp: [], plan: {} });
const WEEKDAYS = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
const dayLabel = (x: string) => { const d = parseDate(x); return `${WEEKDAYS[d.getDay()]}, ${d.getDate()}/${d.getMonth() + 1}`; };

// "35" -> 35.000, "35k" -> 35.000, "1,5tr" -> 1.500.000, "35.000" -> 35.000
function parseAmount(raw: string) {
  let x = raw.trim().toLowerCase().replace(/\s/g, "");
  if (!x) return 0;
  let m = 1;
  if (/(k|nghìn|ngàn)$/.test(x)) { m = 1e3; x = x.replace(/(k|nghìn|ngàn)$/, ""); }
  else if (/(tr|triệu)$/.test(x)) { m = 1e6; x = x.replace(/(tr|triệu)$/, ""); }
  let n = m > 1 ? Number(x.replace(",", ".")) : Number(x.replace(/[.,]/g, ""));
  if (!isFinite(n) || n <= 0) return 0;
  n *= m;
  if (m === 1 && n < 1000) n *= 1000;
  return Math.round(n);
}

function store(key: string, value?: string | null) {
  try {
    if (value === undefined) return localStorage.getItem(key);
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch { /* storage blocked: the page still works for this visit */ }
  return null;
}

const fromB64 = (x: string) => Uint8Array.from(atob(x), (c) => c.charCodeAt(0));
async function openVault(v: Vault, pass: string): Promise<Data> {
  const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(pass), "PBKDF2", false, ["deriveKey"]);
  const key = await crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: fromB64(v.salt), iterations: v.iter, hash: "SHA-256" },
    base, { name: "AES-GCM", length: 256 }, false, ["decrypt"],
  );
  const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: fromB64(v.iv) }, key, fromB64(v.data));
  return JSON.parse(new TextDecoder().decode(plain));
}

function slotsFor(data: Data, date: string): Slot[] {
  const after = date > data.defense;
  return data.slots.map((sl) => (after && sl.after ? { ...sl, ...sl.after } : sl));
}

// ---------- icons ----------
const Icon = ({ d, size = 18 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);
const I = {
  todo: "M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",
  clock: "M12 7v5l3 2M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0-18z", flag: "M5 21V4M5 4h12l-2.5 4.5L17 13H5",
  edit: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z", history: "M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5M12 8v4l3 2",
  trash: "M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3", list: "M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01",
  spark: "M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z", down: "M6 9l6 6 6-6",
  left: "M15 18l-6-6 6-6", right: "M9 18l6-6-6-6", check: "M5 12.5l4.5 4.5L19 7.5", x: "M6 6l12 12M18 6L6 18", plus: "M12 5v14M5 12h14",
  lock: "M6 11V8a6 6 0 0 1 12 0v3M5 11h14v10H5z",
  plan: "M3 6h18v15H3zM3 10h18M8 3v4M16 3v4", water: "M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z",
  money: "M3 6h18v13H3zM3 10h18M16 15h2", food: "M7 3v18M4 3v5a3 3 0 0 0 6 0V3M17 21V3c-2.5 0-4 2.5-4 6.5S14.5 14 17 14", tomorrow: "M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01", stats: "M4 20V10M10 20V4M16 20v-7M22 20H2",
};

// ---------- root ----------
export function Planner({ vault, fontClass }: { vault: Vault; fontClass: string }) {
  const [data, setData] = useState<Data | null>(null);
  const [checking, setChecking] = useState(true);
  const [mounted, setMounted] = useState(false);
  // Follow the site theme (the Navbar's toggle flips the "dark" class on <html>), so this page and the rest of the site always match.
  const [dark, setDark] = useState(() => typeof document !== "undefined" && document.documentElement.classList.contains("dark"));
  useEffect(() => {
    const html = document.documentElement;
    const sync = () => setDark(html.classList.contains("dark"));
    const mo = new MutationObserver(sync);
    mo.observe(html, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);

  useEffect(() => {
    setMounted(true);
    const saved = store(PASS_KEY);
    if (!saved) { setChecking(false); return; }
    openVault(vault, saved).then(setData).catch(() => store(PASS_KEY, null)).finally(() => setChecking(false));
  }, [vault]);

  // Portal to <body>: the layout's <main> is its own stacking context, so the site navbar would otherwise sit on top.
  if (!mounted) return null;
  return createPortal(
    <div className={cx(s.root, dark && s.dark, fontClass, "ph-no-capture")}>
      {/* The site's own header, same as the home page; the wrapper keeps it from sticking so the date bar below can. */}
      <div className={s.siteNav}><Navbar /></div>
      {data ? (
        <App data={data} onLock={() => { store(PASS_KEY, null); setData(null); }} />
      ) : (
        <Lock vault={vault} checking={checking} onOpen={setData} />
      )}
    </div>,
    document.body,
  );
}

function Lock({ vault, checking, onOpen }: { vault: Vault; checking: boolean; onOpen: (d: Data) => void }) {
  const [pass, setPass] = useState("");
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!pass) return;
    setBusy(true); setError("");
    try {
      const d = await openVault(vault, pass.trim());
      if (remember) store(PASS_KEY, pass.trim());
      onOpen(d);
    } catch {
      setError("Mật khẩu chưa đúng. Kiểm tra lại chữ thường và dấu gạch ngang.");
    } finally { setBusy(false); }
  }

  return (
    <div className={s.lockWrap}>
      <form className={s.lockCard} onSubmit={submit}>
        <span className={s.lockIcon}><Icon d={I.lock} size={22} /></span>
        <h1 className={s.lockTitle}>Trang riêng tư</h1>
        <p className={s.lockText}>Nhập mật khẩu để mở. Nội dung được mã hóa, chỉ giải mã trên máy của bạn.</p>
        <label className={s.field}>
          <span>Mật khẩu</span>
          <input className={s.input} type="password" autoComplete="current-password" autoFocus value={pass}
            onChange={(e) => setPass(e.target.value)} disabled={checking || busy} aria-invalid={!!error} />
        </label>
        <label className={s.remember}>
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
          Ghi nhớ trên thiết bị này
        </label>
        {error && <p className={s.error} role="alert">{error}</p>}
        <button className={cx(s.btn, s.btnPrimary, s.block)} disabled={checking || busy || !pass}>
          {checking ? "Đang kiểm tra…" : busy ? "Đang mở…" : "Mở khóa"}
        </button>
      </form>
    </div>
  );
}

// ---------- app ----------
function App({ data, onLock }: { data: Data; onLock: () => void }) {
  const [days, setDays] = useState<Record<string, Day>>(() => {
    try { return JSON.parse(store(DAYS_KEY) || "{}"); } catch { return {}; }
  });
  const [now, setNow] = useState(() => new Date());
  const today = ymd(now);
  // Before the plan's first day, open on that day instead of an empty "today".
  const [cur, setCur] = useState(() => { const t = ymd(new Date()); return t < data.start ? data.start : t; });
  const [tab, setTab] = useState<TabId>("plan");

  useEffect(() => { const t = setInterval(() => setNow(new Date()), 30000); return () => clearInterval(t); }, []);
  useEffect(() => { store(DAYS_KEY, JSON.stringify(days)); }, [days]);

  const v = days[cur] ?? emptyDay();
  const update = (fn: (d: Day) => Day) => setDays((p) => ({ ...p, [cur]: fn(p[cur] ?? emptyDay()) }));
  const toggleSlot = (id: string, on: boolean) => update((d) => ({ ...d, done: { ...d.done, [id]: on } }));
  const toggleCup = (i: number, on: boolean) => update((d) => ({ ...d, water: { ...d.water, [i]: on } }));

  const isToday = cur === today;
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const slots = slotsFor(data, cur);
  const score = (date: string) => {
    const d = days[date], sl = slotsFor(data, date), tot = sl.length + data.water.length;
    if (!d) return { n: 0, tot };
    return { n: sl.filter((x) => d.done[x.id]).length + data.water.filter((_, i) => d.water[i]).length, tot };
  };
  const sc = score(cur);
  const curIdx = isToday ? slots.findIndex((x) => inSlot(x, nowMin)) : -1;
  const todoLeft = (v.todo ?? []).filter((x) => !x.d).length;

  return (
    <>
      <header className={s.top}>
        <div className={s.topIn}>
          <div className={s.dateNav}>
            <button className={s.iconBtn} onClick={() => setCur(addDays(cur, -1))} aria-label="Ngày trước"><Icon d={I.left} /></button>
            <div className={s.dateText}>
              <strong>{isToday ? "Hôm nay · " : ""}{dayLabel(cur)}</strong>
              <span>
                {cur < data.start
                  ? `Bắt đầu từ ${dayLabel(data.start)}`
                  : `Ngày ${diffDays(data.start, cur) + 1} · ${cur <= data.defense ? data.phases[0] : data.phases[1]}`}
              </span>
            </div>
            <button className={s.iconBtn} onClick={() => setCur(addDays(cur, 1))} aria-label="Ngày sau"><Icon d={I.right} /></button>
            {!isToday && <button className={s.btn} onClick={() => setCur(today)}>Hôm nay</button>}
          </div>
          <div className={s.topRight}>
            <span className={s.pill}><b>{sc.n}</b>/{sc.tot}<span className={s.hideSm}>&nbsp;mục xong</span></span>
            <button className={s.iconBtn} onClick={onLock} aria-label="Khóa trang" title="Khóa trang"><Icon d={I.lock} /></button>
          </div>
        </div>
      </header>

      <main className={s.wrap}>
        <div className={s.layout}>
          <aside className={s.left}>
            <section className={s.card}>
              <Dial slots={slots} tags={data.tags} done={v.done} nowMin={isToday ? nowMin : null} score={sc} />
              {curIdx >= 0 && (() => {
                const c = slots[curIdx], nx = slots[(curIdx + 1) % slots.length], on = !!v.done[c.id];
                return (
                  <div className={s.nowBox}>
                    <button className={cx(s.btn, s.block, on ? undefined : s.btnPrimary)} onClick={() => toggleSlot(c.id, !on)}>
                      {on ? "Bỏ đánh dấu" : <><Icon d={I.check} size={16} />Xong: {c.label}</>}
                    </button>
                    <p className={s.next}>Tiếp theo <b>{nx.start}</b> · {nx.label}</p>
                  </div>
                );
              })()}
            </section>
            <Countdown data={data} date={cur} />
          </aside>

          <section className={s.right}>
            <nav className={s.tabs} role="tablist" aria-label="Mục">
              {TABS.map(([id, label]) => (
                <button key={id} role="tab" aria-selected={tab === id} className={cx(s.tab, tab === id && s.tabOn)} onClick={() => {
                  setTab(id);
                  // Phones stack the dial above the panel: jump to the panel so the tap shows its content.
                  if (window.innerWidth <= 960) requestAnimationFrame(() => document.getElementById("planner-panel")?.scrollIntoView({ block: "start" }));
                }}>
                  <Icon d={I[id]} size={18} /><span>{label}</span>
                  {id === "todo" && todoLeft > 0 && <b className={s.badge} aria-label={`${todoLeft} việc chưa xong`}>{todoLeft}</b>}
                </button>
              ))}
            </nav>
            <div role="tabpanel" id="planner-panel" className={s.panel}>
              {tab === "plan" && <PlanTab data={data} days={days} cur={cur} slots={slots} v={v} curIdx={curIdx} toggle={toggleSlot} />}
              {tab === "todo" && <TodoTab key={cur} cur={cur} days={days} v={v} isToday={isToday} nowMin={nowMin} update={update} />}
              {tab === "water" && <WaterTab data={data} v={v} isToday={isToday} nowMin={nowMin} toggle={toggleCup} />}
              {tab === "food" && <FoodTab data={data} days={days} v={v} update={update} />}
              {tab === "money" && <MoneyTab days={days} cur={cur} v={v} update={update} />}
              {tab === "tomorrow" && <TomorrowTab fields={data.planFields} cur={cur} v={v} update={update} />}
              {tab === "stats" && <StatsTab days={days} start={data.start} goal={kcalGoals(data.kcal).total} today={today} cur={cur} score={score} onPick={setCur} />}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

// ---------- 24h dial ----------
const C = 150, R = 116, W = 24;
const ang = (m: number) => (m / 1440) * 360 - 90;
const pt = (r: number, deg: number) => { const a = (deg * Math.PI) / 180; return [C + r * Math.cos(a), C + r * Math.sin(a)]; };
function arc(a0: number, a1: number, r: number) {
  const [x0, y0] = pt(r, a0), [x1, y1] = pt(r, a1);
  return `M${x0.toFixed(2)} ${y0.toFixed(2)}A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
}

function Dial({ slots, tags, done, nowMin, score }: {
  slots: Slot[]; tags: Record<Tag, string>; done: Record<string, boolean>; nowMin: number | null; score: { n: number; tot: number };
}) {
  const cur = nowMin === null ? null : slots.find((x) => inSlot(x, nowMin)) ?? null;
  const left = cur && nowMin !== null ? span(nowMin, toMin(cur.end)) : 0;
  const hh = nowMin === null ? "" : `${String(Math.floor(nowMin / 60)).padStart(2, "0")}:${String(nowMin % 60).padStart(2, "0")}`;
  return (
    <div className={s.dial}>
      <div className={s.dialBox}>
      <svg viewBox="0 0 300 300" role="img" aria-label="Vòng 24 giờ, màu theo nhóm việc; phần đậm là việc đã xong">
        <circle cx={C} cy={C} r={R} className={s.dialTrack} strokeWidth={W} />
        {Array.from({ length: 24 }, (_, h) => {
          const [x0, y0] = pt(R - W / 2 - 4, ang(h * 60)), [x1, y1] = pt(R - W / 2 - (h % 6 ? 8 : 12), ang(h * 60));
          return <line key={h} x1={x0} y1={y0} x2={x1} y2={y1} className={s.tick} />;
        })}
        {[0, 6, 12, 18].map((h) => { const [x, y] = pt(R - W / 2 - 24, ang(h * 60)); return <text key={h} x={x} y={y} className={s.hour}>{h}h</text>; })}
        {slots.map((sl) => {
          const m0 = toMin(sl.start); let m1 = toMin(sl.end); if (m1 <= m0) m1 += 1440;
          const isCur = cur?.id === sl.id;
          return <path key={sl.id} d={arc(ang(m0) + 0.7, ang(m1) - 0.7, R)} strokeWidth={isCur ? W + 8 : W}
            className={cx(s.seg, s[sl.tag], done[sl.id] ? s.segDone : s.segTodo, isCur && s.segCur)} />;
        })}
        {nowMin !== null && (() => { const [x, y] = pt(R, ang(nowMin)); return <circle cx={x} cy={y} r={7} className={s.nowDot} />; })()}
      </svg>
      <div className={s.dialCenter}>
        {cur ? (
          <>
            <span className={s.dialTime}>{hh}</span>
            <span className={s.dialLabel}>{cur.label}</span>
            <span className={s.dialLeft}>còn {fmtDur(left)}</span>
          </>
        ) : (
          <>
            <span className={s.dialTime}>{score.tot ? Math.round((score.n / score.tot) * 100) : 0}%</span>
            <span className={s.dialLabel}>{score.n}/{score.tot} mục đã xong</span>
          </>
        )}
      </div>
      </div>
      <div className={s.legend}>
        {(Object.keys(tags) as Tag[]).map((t) => <span key={t}><i className={cx(s.dot, s[t])} />{tags[t]}</span>)}
      </div>
    </div>
  );
}

function Countdown({ data, date }: { data: Data; date: string }) {
  const left = diffDays(date, data.defense);
  if (left < 0) return null;
  const mi = data.milestones.findIndex((m) => date >= m.from && date <= m.to);
  const m = data.milestones[mi];
  const day = parseDate(data.defense);
  return (
    <section className={cx(s.card, s.countdown)}>
      <div className={s.cdTop}>
        <span className={s.cdNum}>{left === 0 ? "Hôm nay" : left}</span>
        <span className={s.cdUnit}>{left === 0 ? data.event : `ngày nữa đến ${data.event} ${day.getDate()}/${day.getMonth() + 1}`}</span>
      </div>
      <div className={s.steps} aria-hidden="true">
        {data.milestones.map((x, k) => <i key={k} className={cx(k === mi && s.stepCur, date > x.to && s.stepPast)} />)}
      </div>
      {m ? <p className={s.cdMs}><b>{m.title}</b>{m.note}</p> : <p className={s.cdMs}>Bám theo lịch bên cạnh.</p>}
    </section>
  );
}

// ---------- tabs ----------
function Head({ title, note }: { title: string; note?: ReactNode }) {
  return <div className={s.head}><h2>{title}</h2>{note && <span>{note}</span>}</div>;
}

function PlanTab({ data, days, cur, slots, v, curIdx, toggle }: {
  data: Data; days: Record<string, Day>; cur: string; slots: Slot[]; v: Day; curIdx: number; toggle: (id: string, on: boolean) => void;
}) {
  const yp = days[addDays(cur, -1)]?.plan ?? {};
  const top3 = [yp.m1, yp.m2, yp.m3].filter(Boolean);
  return (
    <>
      <Head title="Lịch trong ngày" note={`Ăn ${data.kcal}`} />
      {top3.length > 0 && <p className={s.top3}><b>3 việc chính hôm nay:</b> {top3.join(" · ")}</p>}
      <ol className={s.list}>
        {slots.map((sl, i) => {
          const on = !!v.done[sl.id], isNow = i === curIdx;
          return (
            <li key={sl.id} className={cx(s.row, on && s.rowDone, isNow && s.rowNow)}>
              <label className={s.rowLabel}>
                <span className={s.rowTime}><b>{sl.start}</b><span>{sl.end}</span></span>
                <span className={s.rowBody}>
                  <span className={s.rowTitle}>{sl.label}{isNow && <em className={s.nowChip}>Đang diễn ra</em>}</span>
                  <span className={s.rowNote}>{sl.note}</span>
                  <span className={s.rowMeta}><span className={cx(s.tagPill, s[sl.tag])}>{data.tags[sl.tag]}</span> {shortDur(span(toMin(sl.start), toMin(sl.end)))}</span>
                </span>
                <input type="checkbox" className={s.vh} checked={on} onChange={(e) => toggle(sl.id, e.target.checked)} />
                <span className={s.check} aria-hidden="true"><Icon d={I.check} size={14} /></span>
              </label>
            </li>
          );
        })}
      </ol>
    </>
  );
}

// One task per line. Optional leading bullet / "[ ]" / "[x]", then "!" for important, then a time ("9:00", "14h30", "9h").
function parseTodo(line: string): Todo | null {
  let x = line.replace(/^\s*(?:[-*•+]|\d+[.)])\s+/, "").trim();
  let d = false, hi = false, at: string | undefined;
  const box = x.match(/^\[([ xX]?)\]\s*/);
  if (box) { d = /x/i.test(box[1]); x = x.slice(box[0].length); }
  const bang = () => { const m = x.match(/^!+\s*/); if (m) { hi = true; x = x.slice(m[0].length); } };
  bang();
  const tm = x.match(/^(\d{1,2})[:h](\d{2})?(?:\s+|$)/i);
  if (tm && +tm[1] < 24 && +(tm[2] ?? 0) < 60) { at = `${tm[1].padStart(2, "0")}:${tm[2] ?? "00"}`; x = x.slice(tm[0].length); }
  bang();
  x = x.trim();
  if (!x) return null;
  const todo: Todo = { t: x, d };
  if (at) todo.at = at;
  if (hi) todo.hi = true;
  return todo;
}
const parseTodos = (text: string) => text.split("\n").map(parseTodo).filter((x): x is Todo => !!x);
const todoLine = (x: Todo) => `${x.d ? "[x] " : ""}${x.hi ? "! " : ""}${x.at ? x.at + " " : ""}${x.t}`;
const sameTask = (a: Todo, b: Todo) => a.t.toLowerCase() === b.t.toLowerCase();

function TodoRow({ x, late, onToggle, onRemove }: { x: Todo; late?: boolean; onToggle?: (on: boolean) => void; onRemove?: () => void }) {
  const body = (
    <>
      <span className={s.todoMain}>
        <span className={s.todoText}>{x.t}</span>
        {(x.at || x.hi) && (
          <span className={s.todoMeta}>
            {x.at && <span className={cx(s.chip, late && s.chipLate)}><Icon d={I.clock} size={12} />{x.at}{late && " · trễ"}</span>}
            {x.hi && <span className={cx(s.chip, s.chipHi)}><Icon d={I.flag} size={12} />Quan trọng</span>}
          </span>
        )}
      </span>
    </>
  );
  return (
    <li className={cx(s.todo, x.d && s.todoDone, x.hi && !x.d && s.todoHi, !onToggle && s.todoPreview)}>
      {onToggle ? (
        <label className={s.todoLabel}>
          <input type="checkbox" className={s.vh} checked={x.d} onChange={(e) => onToggle(e.target.checked)} />
          <span className={s.box} aria-hidden="true"><Icon d={I.check} size={13} /></span>
          {body}
        </label>
      ) : (
        <span className={s.todoLabel}><span className={s.box} aria-hidden="true" />{body}</span>
      )}
      {onRemove && <button className={s.todoDel} aria-label={`Xóa ${x.t}`} title="Xóa" onClick={onRemove}><Icon d={I.trash} size={15} /></button>}
    </li>
  );
}

function Ring({ pct }: { pct: number }) {
  const r = 26, c = 2 * Math.PI * r;
  return (
    <div className={s.ring} role="img" aria-label={`Hoàn thành ${pct}%`}>
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <defs><linearGradient id="todoRing" x1="0" y1="0" x2="1" y2="1"><stop offset="0" className={s.ringA} /><stop offset="1" className={s.ringB} /></linearGradient></defs>
        <circle cx="32" cy="32" r={r} className={s.ringTrack} />
        <circle cx="32" cy="32" r={r} className={s.ringFill} strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} />
      </svg>
      <b>{pct}<small>%</small></b>
    </div>
  );
}

function TodoTab({ cur, days, v, isToday, nowMin, update }: {
  cur: string; days: Record<string, Day>; v: Day; isToday: boolean; nowMin: number; update: (fn: (d: Day) => Day) => void;
}) {
  const list = v.todo ?? [];
  const [editing, setEditing] = useState(list.length === 0);
  const [draft, setDraft] = useState(() => list.map(todoLine).join("\n"));
  const [quick, setQuick] = useState("");
  const [showDone, setShowDone] = useState(true);
  const drafted = parseTodos(draft);

  // Yesterday's unfinished tasks and its "3 việc chính" plan, minus anything already on today's list.
  const prev = days[addDays(cur, -1)];
  const have = editing ? drafted : list;
  const carry = [
    ...[prev?.plan?.m1, prev?.plan?.m2, prev?.plan?.m3].map((t) => (t ? parseTodo(t) : null)),
    ...(prev?.todo ?? []).filter((x) => !x.d),
  ].filter((x, i, a): x is Todo => !!x && a.findIndex((y) => !!y && sameTask(x, y)) === i && !have.some((y) => sameTask(x, y)));

  const setList = (fn: (l: Todo[]) => Todo[]) => update((d) => ({ ...d, todo: fn(d.todo ?? []) }));
  const toggle = (i: number, on: boolean) => setList((l) => l.map((x, j) => (j === i ? { ...x, d: on } : x)));
  const remove = (i: number) => setList((l) => l.filter((_, j) => j !== i));
  const late = (x: Todo) => isToday && !x.d && !!x.at && toMin(x.at) < nowMin;

  function generate() {
    setList(() => drafted);
    if (drafted.length) setEditing(false);
  }
  function startEdit() { setDraft(list.map(todoLine).join("\n")); setEditing(true); }
  function addCarry() {
    if (editing) setDraft((t) => [t.trimEnd(), ...carry.map((x) => todoLine({ ...x, d: false }))].filter(Boolean).join("\n"));
    else setList((l) => [...l, ...carry.map((x) => ({ ...x, d: false }))]);
  }
  function addQuick(e: FormEvent) {
    e.preventDefault();
    const x = parseTodo(quick);
    if (!x) return;
    setList((l) => [...l, x]);
    setQuick("");
  }

  const carryBox = carry.length > 0 && (
    <div className={s.carry}>
      <span className={s.carryIcon}><Icon d={I.history} size={18} /></span>
      <span className={s.carryText}>
        <b>Còn {carry.length} việc từ hôm qua</b>
        <small>{carry.slice(0, 3).map((x) => x.t).join(" · ")}{carry.length > 3 ? " …" : ""}</small>
      </span>
      <button type="button" className={cx(s.btn, s.btnSm)} onClick={addCarry}><Icon d={I.plus} size={15} />Chép sang</button>
    </div>
  );

  if (editing) {
    return (
      <>
        <Head title="Việc cần làm" note={dayLabel(cur)} />
        {carryBox}
        <div className={s.compose}>
          <div className={s.composeIn}>
            <textarea className={s.textarea} value={draft} autoFocus={list.length > 0} aria-label="Danh sách việc, mỗi dòng một việc"
              placeholder={"Mỗi dòng một việc, ví dụ:\n9:00 Họp nhóm\n! Nộp báo cáo chương 2\nĐi chợ mua rau\n20h Gọi điện cho mẹ"}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); generate(); } }} />
            <div className={s.tips}>
              <span><Icon d={I.list} size={14} />Mỗi dòng một việc</span>
              <span><Icon d={I.clock} size={14} /><kbd>9:00</kbd> <kbd>14h30</kbd> ở đầu dòng để ghi giờ</span>
              <span><Icon d={I.flag} size={14} /><kbd>!</kbd> ở đầu dòng là quan trọng</span>
            </div>
          </div>
          <div className={s.preview} aria-live="polite">
            <div className={s.previewHead}>Xem trước<span>{drafted.length} việc</span></div>
            {drafted.length ? (
              <ul className={s.todoList}>{drafted.map((x, i) => <TodoRow key={i} x={x} />)}</ul>
            ) : (
              <p className={s.previewEmpty}>Gõ việc bên cạnh, danh sách sẽ hiện ở đây.</p>
            )}
          </div>
        </div>
        <div className={s.todoActions}>
          <span className={s.kbdHint}><kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>Enter</kbd> để tạo nhanh</span>
          {list.length > 0 && <button type="button" className={s.btn} onClick={() => setEditing(false)}>Hủy</button>}
          <button type="button" className={cx(s.btn, s.btnPrimary)} disabled={!drafted.length && !list.length} onClick={generate}>
            <Icon d={I.check} size={16} />{drafted.length ? `Tạo danh sách · ${drafted.length} việc` : list.length ? "Xóa danh sách" : "Tạo danh sách"}
          </button>
        </div>
      </>
    );
  }

  const doneN = list.filter((x) => x.d).length;
  const leftN = list.length - doneN;
  const pct = list.length ? Math.round((doneN / list.length) * 100) : 0;
  const hiLeft = list.filter((x) => x.hi && !x.d).length;
  const lateN = list.filter(late).length;
  const rows = list.map((x, i) => ({ x, i }));
  const todo = rows.filter((r) => !r.x.d), done = rows.filter((r) => r.x.d);
  const row = ({ x, i }: { x: Todo; i: number }) => <TodoRow key={i} x={x} late={late(x)} onToggle={(on) => toggle(i, on)} onRemove={() => remove(i)} />;

  return (
    <>
      <Head title="Việc cần làm" note={dayLabel(cur)} />
      <div className={s.todoSum}>
        <Ring pct={pct} />
        <div className={s.todoSumText}>
          <strong>{leftN === 0 ? "Hoàn thành tất cả!" : `${doneN}/${list.length} việc đã xong`}</strong>
          <span>
            {leftN === 0 ? "Hôm nay bạn làm rất tốt." : <>Còn {leftN} việc{hiLeft > 0 && <> · <em className={s.sumHi}>{hiLeft} quan trọng</em></>}{lateN > 0 && <> · <em className={s.sumLate}>{lateN} trễ giờ</em></>}</>}
          </span>
        </div>
        <button type="button" className={cx(s.btn, s.btnSm)} onClick={startEdit}><Icon d={I.edit} size={15} /><span className={s.hideXs}>Sửa danh sách</span></button>
      </div>
      {carryBox}

      {todo.length > 0 && <ul className={s.todoList}>{todo.map(row)}</ul>}
      {leftN === 0 && (
        <div className={s.allDone}><Icon d={I.spark} size={20} />Xong hết việc hôm nay. Nghỉ ngơi thôi!</div>
      )}

      <form className={s.todoQuick} onSubmit={addQuick} autoComplete="off">
        <span className={s.quickIcon}><Icon d={I.plus} size={16} /></span>
        <input className={s.quickInput} placeholder="Thêm việc… (Enter để lưu)" aria-label="Thêm việc" value={quick} onChange={(e) => setQuick(e.target.value)} />
        {quick.trim() && <button className={cx(s.btn, s.btnPrimary, s.btnSm)}>Thêm</button>}
      </form>

      {done.length > 0 && (
        <>
          <button type="button" className={s.doneHead} aria-expanded={showDone} onClick={() => setShowDone(!showDone)}>
            <Icon d={showDone ? I.down : I.right} size={14} />Đã xong<span>{done.length}</span>
          </button>
          {showDone && <ul className={s.todoList}>{done.map(row)}</ul>}
        </>
      )}
    </>
  );
}

function WaterTab({ data, v, isToday, nowMin, toggle }: { data: Data; v: Day; isToday: boolean; nowMin: number; toggle: (i: number, on: boolean) => void }) {
  const total = data.water.reduce((a, c) => a + c.ml, 0);
  const drunk = data.water.reduce((a, c, i) => a + (v.water[i] ? c.ml : 0), 0);
  const next = data.water.findIndex((_, i) => !v.water[i]);
  return (
    <>
      <Head title="Uống nước" note={`Ly cuối ${data.water[data.water.length - 1]?.time}, sau đó ngừng`} />
      <div className={s.waterTop}>
        <div className={s.big}>{drunk.toLocaleString("vi-VN")}<small> / {total.toLocaleString("vi-VN")} ml</small></div>
        <div className={s.bar}><i style={{ width: `${Math.round((drunk / total) * 100)}%` }} /></div>
        <button className={cx(s.btn, s.btnPrimary, s.block)} disabled={next < 0} onClick={() => toggle(next, true)}>
          {next < 0 ? "Đã đủ nước hôm nay" : <><Icon d={I.plus} size={16} />Uống ly {data.water[next].time} · {data.water[next].ml} ml</>}
        </button>
      </div>
      <div className={s.cups}>
        {data.water.map((c, i) => {
          const on = !!v.water[i], due = isToday && !on && toMin(c.time) <= nowMin;
          return (
            <button key={i} className={cx(s.cup, on && s.cupOn, due && s.cupDue)} aria-pressed={on} onClick={() => toggle(i, !on)}>
              <b>{c.time}</b><span>{c.ml} ml</span><em>{on ? "Đã uống" : due ? "Đến giờ" : c.note}</em>
            </button>
          );
        })}
      </div>
    </>
  );
}

function MoneyTab({ days, cur, v, update }: { days: Record<string, Day>; cur: string; v: Day; update: (fn: (d: Day) => Day) => void }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [kind, setKind] = useState(KINDS[0]);
  const [hint, setHint] = useState("");
  const parsed = parseAmount(amount);

  function add(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    if (!parsed) { setHint("Số tiền chưa đúng. Ví dụ: 35, 35k, 1,5tr"); return; }
    update((d) => ({ ...d, exp: [...d.exp, { n: name.trim(), a: parsed, k: kind }] }));
    setName(""); setAmount(""); setHint("");
  }

  const total = v.exp.reduce((a, x) => a + x.a, 0);
  const by = KINDS.map((k) => [k, v.exp.filter((x) => x.k === k).reduce((a, x) => a + x.a, 0)] as const).filter(([, n]) => n > 0);
  const sumDays = (n: number) => Array.from({ length: n }, (_, i) => days[addDays(cur, -i)]?.exp ?? []).flat().reduce((a, x) => a + x.a, 0);

  return (
    <>
      <Head title="Chi tiêu" note={dayLabel(cur)} />
      <form className={s.expForm} onSubmit={add} autoComplete="off">
        <input className={s.input} placeholder="Khoản chi, vd: cơm trưa" aria-label="Khoản chi" value={name} onChange={(e) => setName(e.target.value)} />
        <div className={s.amt}>
          <input className={s.input} inputMode="decimal" placeholder="35" aria-label="Số tiền" value={amount} onChange={(e) => { setAmount(e.target.value); setHint(""); }} />
          <span>₫</span>
        </div>
        <div className={s.segCtl} role="radiogroup" aria-label="Nhóm chi tiêu">
          {KINDS.map((k) => (
            <button type="button" key={k} role="radio" aria-checked={kind === k} className={cx(kind === k && s.segOn)} onClick={() => setKind(k)}>{k}</button>
          ))}
        </div>
        <button className={cx(s.btn, s.btnPrimary)} disabled={!name.trim() || !amount}><Icon d={I.plus} size={16} />Thêm</button>
      </form>
      <p className={s.hint}>{hint || (parsed ? `= ${vnd(parsed)}` : "Gõ tắt: 35 = 35.000 ₫ · 1,5tr = 1.500.000 ₫")}</p>

      <div className={s.moneyGrid}>
        <div>
          {v.exp.length === 0 ? (
            <p className={s.empty}>Chưa có khoản nào. Ghi ngay khi vừa trả tiền để khỏi quên.</p>
          ) : (
            <ul className={s.expList}>
              {v.exp.map((x, i) => (
                <li key={i}>
                  <span className={s.expName}>{x.n}<small>{x.k}</small></span>
                  <b>{vnd(x.a)}</b>
                  <button className={s.del} aria-label={`Xóa ${x.n}`} onClick={() => update((d) => ({ ...d, exp: d.exp.filter((_, j) => j !== i) }))}><Icon d={I.x} size={14} /></button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className={s.sums}>
          <div className={s.sumRow}><span>Hôm nay</span><b>{vnd(total)}</b></div>
          {by.map(([k, n]) => (
            <div key={k} className={cx(s.kind, s[`k${KINDS.indexOf(k)}`])}><span>{k}</span><div className={s.bar}><i style={{ width: `${Math.round((n / total) * 100)}%` }} /></div><b>{vnd(n)}</b></div>
          ))}
          <div className={s.sumRow}><span>7 ngày</span><b>{vnd(sumDays(7))}</b></div>
          <div className={s.sumRow}><span>30 ngày</span><b>{vnd(sumDays(30))}</b></div>
        </div>
      </div>
    </>
  );
}

// Targets come from the vault's kcal line, shaped like "~2.000 kcal · sáng 500 · trưa 700 · phụ 200 · tối 600".
function kcalGoals(line: string) {
  const num = (x?: string) => Number((x ?? "").replace(/\./g, "")) || 0;
  const meals = MEALS.map((m) => num(line.match(new RegExp(`${m}\\s+([\\d.]+)`, "i"))?.[1]));
  return { total: num(line.match(/([\d.]+)\s*kcal/)?.[1]) || meals.reduce((a, b) => a + b, 0), meals };
}
const eaten = (d?: Day) => (d?.food ?? []).reduce((a, x) => a + x.k, 0);
const mealNow = () => { const h = new Date().getHours(); return h < 10 ? 0 : h < 14 ? 1 : h < 17 ? 2 : 3; };

function FoodTab({ data, days, v, update }: { data: Data; days: Record<string, Day>; v: Day; update: (fn: (d: Day) => Day) => void }) {
  const [name, setName] = useState("");
  const [kcal, setKcal] = useState("");
  const [meal, setMeal] = useState(mealNow);
  const [hint, setHint] = useState("");
  const goals = kcalGoals(data.kcal);
  const items = parseMeal(name);
  const auto = items.reduce((a, x) => a + x.k, 0);
  const manual = Number(kcal.replace(/\D/g, ""));
  const unknown = items.filter((x) => !x.ok);
  const last = items[items.length - 1];
  const matches = last && !last.exact ? searchFoods(last.text.split(/\s+/).filter((w) => !last.pre.split(" ").includes(w)).join(" ")) : [];
  const list = v.food ?? [];
  // Distinct foods from the latest days, for one-tap re-adding.
  const recent = Object.keys(days).sort().reverse().flatMap((d) => [...(days[d].food ?? [])].reverse())
    .filter((x, i, a) => a.findIndex((y) => y.n === x.n && y.q === x.q) === i).slice(0, 8);

  const push = (...e: Eat[]) => update((d) => ({ ...d, food: [...(d.food ?? []), ...e] }));
  const qtyLabel = (x: Item) => !x.food ? "" : x.grams ? `${x.grams.toLocaleString("vi-VN")} g` : x.qty === 1 ? x.food.u : `${x.qty.toLocaleString("vi-VN", { maximumFractionDigits: 2 })} × ${x.food.u}`;
  // Swap the last typed food for a picked suggestion, keeping its quantity ("2 trung" -> "2 Trứng gà luộc").
  const pick = (n: string) => { const parts = name.split(SEP); parts[parts.length - 1] = `${last?.pre ? last.pre + " " : ""}${n}`; setName(parts.join("")); setHint(""); };

  function add(e: FormEvent) {
    e.preventDefault();
    if (!items.length) return;
    // A typed calorie number logs the whole line as one entry (for dishes the list does not know).
    if (manual) push({ n: name.trim(), q: "", k: manual, m: meal });
    else if (unknown.length) { setHint(`Chưa nhận ra: ${unknown.map((x) => `“${x.text}”`).join(", ")}. Chọn gợi ý hoặc nhập calo.`); return; }
    else push(...items.map((x) => ({ n: x.food!.n, q: qtyLabel(x), k: x.k, m: meal })));
    setName(""); setKcal(""); setHint("");
  }

  const total = eaten(v);
  const left = goals.total - total;
  return (
    <>
      <Head title="Ăn uống" note={`Mục tiêu ${goals.total.toLocaleString("vi-VN")} kcal`} />
      <form className={s.foodForm} onSubmit={add} autoComplete="off">
        <input className={s.input} placeholder="Gõ bữa ăn, vd: 2 trứng, 1 chén cơm, rau luộc" aria-label="Bữa ăn" value={name} onChange={(e) => { setName(e.target.value); setHint(""); }} />
        <div className={cx(s.amt, s.amtWide)}>
          <input className={s.input} inputMode="numeric" placeholder={auto ? String(auto) : "tự tính"} aria-label="Calo (để trống thì tự tính)" value={kcal} onChange={(e) => { setKcal(e.target.value); setHint(""); }} />
          <span>kcal</span>
        </div>
        <div className={s.segCtl} role="radiogroup" aria-label="Bữa">
          {MEALS.map((m, i) => (
            <button type="button" key={m} role="radio" aria-checked={meal === i} className={cx(meal === i && s.segOn)} onClick={() => setMeal(i)}>{m}</button>
          ))}
        </div>
        <button className={cx(s.btn, s.btnPrimary)} disabled={!items.length}><Icon d={I.plus} size={16} />Thêm{manual || auto ? ` ${(manual || auto).toLocaleString("vi-VN")} kcal` : ""}</button>
      </form>
      {items.length > 0 && !manual && (
        <ul className={s.parsed} aria-live="polite">
          {items.map((x, i) => (
            <li key={i} className={x.ok ? undefined : s.parsedMiss}>
              <span>{x.ok && x.food ? <>{x.exact ? "" : "≈ "}{x.food.n}<small>{qtyLabel(x)}</small></> : <>“{x.text}”<small>{x.food === undefined ? "chưa nhận ra" : "món này không tính theo gram"}</small></>}</span>
              <b>{x.ok ? `${x.k} kcal` : "?"}</b>
            </li>
          ))}
        </ul>
      )}
      {matches.length > 0 && (
        <div className={s.chips} aria-label="Gợi ý món">
          {matches.map((f) => <button type="button" key={f.n} onClick={() => pick(f.n)}>{f.n}<small>{f.u} · {f.k}</small></button>)}
        </div>
      )}
      <p className={s.hint}>
        {hint || (manual ? "Sẽ ghi cả dòng thành 1 món với số calo bạn nhập." : items.length ? "≈ là món gần đúng nhất. Sai món thì bấm gợi ý bên dưới, hoặc nhập calo." : "Gõ tự nhiên, không dấu cũng được: 2 trung, 1 chen com, 150g uc ga, tra sua. Calo là ước tính trung bình.")}
      </p>
      {recent.length > 0 && (
        <div className={s.chips} aria-label="Thêm nhanh món gần đây">
          {recent.map((x) => <button type="button" key={x.n + x.q} onClick={() => push({ ...x, m: meal })}><Icon d={I.plus} size={12} />{x.n}<small>{x.k}</small></button>)}
        </div>
      )}

      <div className={s.moneyGrid}>
        <div>
          {list.length === 0 ? (
            <p className={s.empty}>Chưa ghi món nào. Ghi ngay sau mỗi bữa, kể cả đồ uống.</p>
          ) : (
            <ul className={s.expList}>
              {list.map((x, i) => (
                <li key={i}>
                  <span className={s.expName}>{x.n}<small>{MEALS[x.m]}{x.q ? ` · ${x.q}` : ""}</small></span>
                  <b>{x.k} kcal</b>
                  <button className={s.del} aria-label={`Xóa ${x.n}`} onClick={() => update((d) => ({ ...d, food: (d.food ?? []).filter((_, j) => j !== i) }))}><Icon d={I.x} size={14} /></button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className={s.sums}>
          <div className={s.sumRow}><span>Đã nạp</span><b>{total.toLocaleString("vi-VN")} kcal</b></div>
          <div className={cx(s.bar, left < 0 && s.barOver)}><i style={{ width: `${Math.min(100, Math.round((total / (goals.total || 1)) * 100))}%` }} /></div>
          <div className={s.sumRow}><span>{left >= 0 ? "Còn được ăn" : "Vượt mục tiêu"}</span><b className={left < 0 ? s.over : undefined}>{Math.abs(left).toLocaleString("vi-VN")} kcal</b></div>
          {MEALS.map((m, i) => {
            const n = list.filter((x) => x.m === i).reduce((a, x) => a + x.k, 0), g = goals.meals[i];
            return (
              <div key={m} className={cx(s.kind, s[`k${i}`])}>
                <span>{m}</span>
                <div className={cx(s.bar, g > 0 && n > g && s.barOver)}><i style={{ width: `${g ? Math.min(100, Math.round((n / g) * 100)) : 0}%` }} /></div>
                <b className={g > 0 && n > g ? s.over : undefined}>{n}{g ? `/${g}` : ""}</b>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

function TomorrowTab({ fields, cur, v, update }: { fields: [string, string][]; cur: string; v: Day; update: (fn: (d: Day) => Day) => void }) {
  return (
    <>
      <Head title={`Plan cho ${dayLabel(addDays(cur, 1))}`} note="3 việc đầu sẽ hiện ở tab Lịch ngày mai" />
      <div className={s.planForm}>
        {fields.map(([k, label]) => (
          <label key={k} className={s.field}>
            <span>{label}</span>
            <input className={s.input} value={v.plan[k] ?? ""} onChange={(e) => update((d) => ({ ...d, plan: { ...d.plan, [k]: e.target.value } }))} />
          </label>
        ))}
      </div>
    </>
  );
}

function StatsTab({ days, start, goal, today, cur, score, onPick }: {
  days: Record<string, Day>; start: string; goal: number; today: string; cur: string; score: (d: string) => { n: number; tot: number }; onPick: (d: string) => void;
}) {
  const range = Array.from({ length: 14 }, (_, i) => addDays(today, i - 13)).filter((d) => d >= start);
  if (range.length === 0) {
    return (
      <>
        <Head title="Thống kê" />
        <p className={s.empty}>Thống kê bắt đầu từ {dayLabel(start)}. Tick các mục mỗi ngày, biểu đồ sẽ hiện ở đây.</p>
      </>
    );
  }
  const pct = range.map((d) => { const x = score(d); return x.tot ? x.n / x.tot : 0; });
  const spend = range.map((d) => (days[d]?.exp ?? []).reduce((a, x) => a + x.a, 0));
  const maxSpend = Math.max(...spend, 1);
  const kcal = range.map((d) => eaten(days[d]));
  const maxKcal = Math.max(...kcal, goal, 1);
  const avg = Math.round((pct.reduce((a, b) => a + b, 0) / range.length) * 100);
  return (
    <>
      <Head title={`${range.length} ngày gần nhất`} note={`Hoàn thành trung bình ${avg}%`} />
      <h3 className={s.chartTitle}>Mức hoàn thành</h3>
      <div className={s.chart}>
        {range.map((d, i) => (
          <button key={d} className={cx(s.col, d === cur && s.colSel, d === today && s.colToday)} onClick={() => onPick(d)} aria-label={`${dayLabel(d)}: ${Math.round(pct[i] * 100)}%`}>
            <i style={{ height: `${Math.max(3, pct[i] * 100)}%` }} /><span>{parseDate(d).getDate()}</span>
          </button>
        ))}
      </div>
      <h3 className={s.chartTitle}>Chi tiêu mỗi ngày <span>cao nhất {vnd(maxSpend === 1 ? 0 : maxSpend)}</span></h3>
      <div className={s.chart}>
        {range.map((d, i) => (
          <button key={d} className={cx(s.col, s.colSpend, d === cur && s.colSel)} onClick={() => onPick(d)} aria-label={`${dayLabel(d)}: ${vnd(spend[i])}`}>
            <i style={{ height: `${Math.max(3, (spend[i] / maxSpend) * 100)}%` }} /><span>{parseDate(d).getDate()}</span>
          </button>
        ))}
      </div>
      <h3 className={s.chartTitle}>Calo nạp mỗi ngày <span>mục tiêu {goal.toLocaleString("vi-VN")} kcal</span></h3>
      <div className={s.chart}>
        {range.map((d, i) => (
          <button key={d} className={cx(s.col, s.colKcal, goal > 0 && kcal[i] > goal && s.colOver, d === cur && s.colSel)} onClick={() => onPick(d)} aria-label={`${dayLabel(d)}: ${kcal[i]} kcal`}>
            <i style={{ height: `${Math.max(3, (kcal[i] / maxKcal) * 100)}%` }} /><span>{parseDate(d).getDate()}</span>
          </button>
        ))}
      </div>
    </>
  );
}
