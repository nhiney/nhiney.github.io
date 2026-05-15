"use client";

import { motion } from "framer-motion";
import {
  BookMarked,
  ExternalLink,
  Globe,
  Heart,
  Library,
  ScanLine,
} from "lucide-react";
import {
  Eyebrow,
  HeadlineDisplay,
  Slide,
  Subhead,
  itemVariants,
} from "./shared";
import { useDeckT } from "./use-deck-t";

export function Slide18Closing({ index }: { index: number }) {
  const T = useDeckT();
  const s = T.s18;
  return (
    <Slide index={index} maxWidth="max-w-5xl">
      <Eyebrow index={17} label={s.eyebrow} />

      <motion.h2
        variants={itemVariants}
        className="text-balance text-xl font-black leading-[1.14] tracking-tight text-foreground sm:text-2xl md:text-3xl"
        style={{ fontFamily: "var(--font-inter), sans-serif" }}
      >
        {s.headline1}{" "}
        <span className="text-muted-foreground/60">{s.headlineInherited}</span>
        <br />
        {s.headline2} <span className="text-primary">{s.headlineBuilt}</span> {s.headline3}
      </motion.h2>

      <motion.p
        variants={itemVariants}
        className="mt-6 text-sm font-medium italic text-muted-foreground sm:text-base"
      >
        {s.closing}
      </motion.p>

      <motion.div
        variants={itemVariants}
        className="mt-8 h-px w-20 bg-border/50"
      />
    </Slide>
  );
}

export function Slide19References({ index }: { index: number }) {
  const T = useDeckT();
  const s = T.s19;
  const GROUP_ICONS = [Library, Globe, BookMarked];
  const items = [
    [
      { name: "VNNIC", url: "vnnic.vn" },
      { name: "Ministry of Information & Communications", url: "mic.gov.vn" },
      { name: "Ministry of Science & Technology", url: "most.gov.vn" },
    ],
    [
      { name: "APNIC IPv6 Statistics", url: "stats.labs.apnic.net/ipv6" },
      { name: "Internet Society · Deploy360", url: "internetsociety.org/deploy360/ipv6" },
      { name: "ITU", url: "itu.int" },
      { name: "IETF · RFC 8200, 4291, 4862", url: "ietf.org" },
    ],
    [
      { name: "Google IPv6 Adoption Statistics", url: "google.com/intl/en/ipv6/statistics.html" },
      { name: "Cisco Annual Internet Report", url: "cisco.com" },
      { name: "Cloudflare Learning Center", url: "cloudflare.com/learning/ipv6" },
      { name: "Statista · IoT forecasts", url: "statista.com" },
    ],
  ];
  const groups = s.groups.map((g, i) => ({ ...g, icon: GROUP_ICONS[i], items: items[i] }));

  return (
    <Slide index={index}>
      <Eyebrow index={18} label={s.eyebrow} />
      <HeadlineDisplay>
        {s.headline1} <span className="text-primary">{s.headline2}</span>
      </HeadlineDisplay>
      <Subhead>{s.subhead}</Subhead>

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {groups.map((g) => (
          <motion.div
            key={g.title}
            variants={itemVariants}
            className="group relative transform-gpu overflow-hidden rounded-2xl border border-border/60 bg-secondary/30 p-6 backdrop-blur-md transition-all duration-300 ease-out hover:z-30 hover:-translate-y-2 hover:scale-[1.06] hover:border-primary/80 hover:bg-secondary/65 hover:shadow-[0_30px_70px_-18px_hsl(var(--primary)/0.6)]"
          >
            <div className="absolute -top-12 -right-12 h-36 w-36 rounded-full bg-primary/10 blur-3xl" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
                <g.icon size={11} /> {g.title}
              </div>
              <ul className="mt-5 space-y-3">
                {g.items.map((it) => (
                  <li key={it.url} className="group/it">
                    <p className="text-sm font-semibold text-foreground">{it.name}</p>
                    <p className="mt-0.5 flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground transition-colors group-hover/it:text-primary">
                      <ExternalLink size={10} /> {it.url}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </Slide>
  );
}

export function Slide20ThankYou({ index }: { index: number }) {
  const T = useDeckT();
  const s = T.s20;
  const contactValues = [
    "nhiyen.engineer@gmail.com",
    "nhi.id.vn",
    "/in/nguyenthiyennhi",
    "@nhiney",
  ];

  return (
    <Slide index={index} maxWidth="max-w-5xl">
      <div className="text-center">
        <motion.div
          variants={itemVariants}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground backdrop-blur-sm"
        >
          <Heart size={11} className="text-primary" /> {s.badge}
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-balance text-3xl font-black tracking-tight text-foreground sm:text-4xl md:text-5xl"
          style={{ fontFamily: "var(--font-inter), sans-serif", lineHeight: 1.1 }}
        >
          {s.title}
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground"
        >
          {s.byline}
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="mx-auto mt-7 h-px w-20 bg-border/50"
        />

        <motion.div
          variants={itemVariants}
          className="mt-7 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {s.contactLabels.map((label, i) => (
            <div
              key={label}
              className="group rounded-xl border border-border/50 bg-secondary/30 p-4 text-left backdrop-blur-md transition-colors hover:border-primary/30 hover:bg-secondary/50"
            >
              <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-muted-foreground/70">
                {label}
              </p>
              <p className="mt-1.5 font-mono text-[11px] font-semibold text-foreground transition-colors group-hover:text-primary">
                {contactValues[i]}
              </p>
            </div>
          ))}
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-8 inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.28em] text-muted-foreground/60"
        >
          <ScanLine size={11} />
          {s.footer}
        </motion.div>
      </div>
    </Slide>
  );
}
