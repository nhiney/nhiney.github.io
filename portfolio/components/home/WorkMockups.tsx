"use client";

import { BellRing, Check, Mic, MessageCircle, RefreshCw, Search, Star } from "lucide-react";

import styles from "./home.module.css";

// Decorative device scenes, one per featured project. Built from plain DOM so
// they stay crisp at any size and cost nothing to load. A pointer over the
// stage tilts the device in 3D.

function tiltMove(e: React.PointerEvent<HTMLDivElement>) {
  if (e.pointerType === "touch") return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - 0.5;
  const y = (e.clientY - r.top) / r.height - 0.5;
  el.style.setProperty("--ry", `${x * 26}deg`);
  el.style.setProperty("--rx", `${-y * 18}deg`);
}

function tiltLeave(e: React.PointerEvent<HTMLDivElement>) {
  e.currentTarget.style.removeProperty("--ry");
  e.currentTarget.style.removeProperty("--rx");
}

function Stage({ children }: { children: React.ReactNode }) {
  return (
    <div
      onPointerMove={tiltMove}
      onPointerLeave={tiltLeave}
      className={`${styles.mockStage} h-full p-6`}
      aria-hidden="true"
    >
      <div className={`${styles.mock} relative`}>{children}</div>
    </div>
  );
}

function BookingPhone() {
  const days = [
    ["Mon", "12"], ["Tue", "13"], ["Wed", "14"], ["Thu", "15"], ["Fri", "16"],
  ];
  return (
    <Stage>
      <div className={styles.phone}>
        <div className={styles.screen}>
          <div className="mx-auto mt-2 h-[18px] w-[74px] rounded-full bg-[#0d0d14]" />
          <div className="px-4 pt-3">
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#8a8aa0]">Cardiology</p>
            <p className="mt-0.5 text-[15px] font-semibold tracking-tight">Book a visit</p>
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-[#f0f0f6] px-3 py-2 text-[10px] text-[#8a8aa0]">
              <Search className="h-3 w-3" /> Hospital, specialty…
            </div>
            <div className="mt-3 grid grid-cols-5 gap-1.5">
              {days.map(([d, n], i) => (
                <div
                  key={d}
                  className="rounded-xl py-1.5 text-center"
                  style={i === 2 ? { background: "var(--accent)", color: "#fff" } : { background: "#f0f0f6" }}
                >
                  <div className="text-[8px] opacity-70">{d}</div>
                  <div className="text-[12px] font-semibold">{n}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 space-y-2">
              {[["09:00", "Dr. Lan · Heart Institute", true], ["10:30", "Dr. Minh · City Hospital", false], ["14:00", "Dr. Hoa · Cho Ray", false]].map(
                ([time, who, active]) => (
                  <div
                    key={time as string}
                    className="flex items-center justify-between rounded-xl px-3 py-2"
                    style={{ background: active ? "color-mix(in srgb, var(--accent) 12%, white)" : "#f6f6fa" }}
                  >
                    <div>
                      <div className="text-[11px] font-semibold">{time as string}</div>
                      <div className="text-[9px] text-[#8a8aa0]">{who as string}</div>
                    </div>
                    {active ? (
                      <span className="grid h-5 w-5 place-items-center rounded-full text-white" style={{ background: "var(--accent)" }}>
                        <Check className="h-3 w-3" />
                      </span>
                    ) : (
                      <span className="h-5 w-5 rounded-full border border-[#dcdce6]" />
                    )}
                  </div>
                ),
              )}
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-4 flex justify-center">
            <span className={styles.mic}>
              <Mic className="h-5 w-5" />
            </span>
          </div>
        </div>
      </div>
      <span className={styles.floatChip} style={{ left: "clamp(-70px, -8vw, -12px)", top: 22 }}>
        <BellRing className="h-3.5 w-3.5" style={{ color: "var(--accent)" }} /> No double-booking
      </span>
      <span className={styles.floatChip} style={{ right: "clamp(-64px, -8vw, -12px)", bottom: 96, animationDelay: "1.4s" }}>
        <Mic className="h-3.5 w-3.5" style={{ color: "var(--accent)" }} /> “Book 9 AM tomorrow”
      </span>
    </Stage>
  );
}

function ShopBrowser() {
  const shoes = [
    "linear-gradient(135deg,#ffd29a,#ff8a5c)",
    "linear-gradient(135deg,#c7d2fe,#818cf8)",
    "linear-gradient(135deg,#bbf7d0,#34d399)",
    "linear-gradient(135deg,#fecdd3,#fb7185)",
    "linear-gradient(135deg,#e9d5ff,#a855f7)",
    "linear-gradient(135deg,#fde68a,#f59e0b)",
  ];
  return (
    <Stage>
      <div className={styles.browser}>
        <div className={styles.chrome}>
          <i /><i /><i />
          <span className="ml-3 h-[16px] flex-1 rounded-md bg-white text-[9px] leading-[16px] text-[#9a9ab0] px-2">shoeshop.vn/catalog</span>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-semibold tracking-tight">New arrivals</p>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#ecfdf5] px-2 py-0.5 text-[9px] font-semibold text-[#047857]">
              <RefreshCw className="h-2.5 w-2.5" /> Stock synced
            </span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2.5">
            {shoes.map((bg, i) => (
              <div key={i} className="rounded-lg bg-[#f6f6fa] p-1.5">
                <div className="aspect-[4/3] rounded-md" style={{ background: bg }} />
                <div className="mt-1.5 h-1.5 w-3/4 rounded bg-[#e4e4ee]" />
                <div className="mt-1 flex items-center justify-between">
                  <div className="h-1.5 w-1/3 rounded bg-[#d4d4e2]" />
                  <span className="text-[8px] font-semibold text-[#8a8aa0]">{12 - i * 2} left</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div
        className={styles.floatChip}
        style={{ right: "clamp(-36px, -4vw, -6px)", bottom: -26, maxWidth: 190, alignItems: "flex-start", flexDirection: "column", gap: 4 }}
      >
        <span className="inline-flex items-center gap-1.5">
          <MessageCircle className="h-3.5 w-3.5" style={{ color: "var(--accent)" }} /> Shop assistant
        </span>
        <span className="font-normal text-[#55556a]">Size 38 is back in stock — want me to hold a pair?</span>
      </div>
    </Stage>
  );
}

function VocabWindow() {
  return (
    <Stage>
      <div className={styles.browser} style={{ width: "min(400px, 100%)" }}>
        <div className={styles.chrome}>
          <i /><i /><i />
          <span className="ml-3 text-[10px] font-medium text-[#77778c]">Vocabulary — 512 words</span>
        </div>
        <div className="grid grid-cols-[110px_1fr]">
          <div className="space-y-1 border-r border-[#ececf3] bg-[#fafafd] p-3">
            {["serendipity", "resilient", "meticulous", "ephemeral", "candid", "pragmatic"].map((w, i) => (
              <div
                key={w}
                className="rounded-md px-2 py-1 text-[10px]"
                style={i === 0 ? { background: "color-mix(in srgb, var(--accent) 14%, white)", fontWeight: 600 } : { color: "#6b6b80" }}
              >
                {w}
              </div>
            ))}
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[18px] font-semibold tracking-tight">serendipity</p>
                <p className="text-[10px] text-[#8a8aa0]">/ˌser.ənˈdɪp.ə.ti/ · noun</p>
              </div>
              <Star className="h-4 w-4" style={{ color: "var(--accent)", fill: "var(--accent)" }} />
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-[#44445a]">
              The fact of finding interesting or valuable things by chance.
            </p>
            <div className="mt-3 rounded-lg bg-[#f6f6fa] p-2.5 text-[10px] italic leading-relaxed text-[#6b6b80]">
              “Meeting her there was pure serendipity.”
            </div>
            <div className="mt-3 flex gap-1.5">
              {["Edit", "Delete", "Fetch API"].map((b, i) => (
                <span
                  key={b}
                  className="rounded-md px-2 py-1 text-[9px] font-semibold"
                  style={i === 2 ? { background: "var(--accent)", color: "#fff" } : { background: "#efeff5", color: "#55556a" }}
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <span className={styles.floatChip} style={{ left: "clamp(-40px, -3vw, -6px)", top: -18 }}>
        <Star className="h-3.5 w-3.5" style={{ color: "var(--accent)" }} /> 9.5 / 10
      </span>
    </Stage>
  );
}

export const WORK_MOCKUPS = [BookingPhone, ShopBrowser, VocabWindow];
