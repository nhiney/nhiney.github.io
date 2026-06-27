"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, X, Code2, ExternalLink, Mail, Plus } from "lucide-react";
import { GithubIcon, LinkedinIcon, MailIcon } from "@/components/widgets/Icons";
import projectsData from "@/data/projects.json";
import { SITE_CONFIG } from "@/lib/constants";

// ─── Types (loose — the JSON drives the shape) ───────────────────────────────
interface Project {
  slug: string; title: string; description: string; problem?: string; role?: string;
  impact?: string; technologies: string[]; github?: string | null; demo?: string | null;
  image: string; year: string; category: string;
}

const PROJECTS = projectsData as Project[];
const LINKS = SITE_CONFIG?.links ?? ({} as Record<string, string>);
const EMAIL = LINKS.email ?? "hello@example.com";

// Tech stack — drives the scrolling marquee (the user's own chips, extended).
const MARQUEE = [
  "Flutter", "Laravel", "Python", "Firebase", "Oracle DB", "PL/SQL",
  "Node.js", "REST APIs", "RBAC", "Dart", "C#", "Git",
];

// FAQ — editable copy; written to fit a software-engineer portfolio.
const FAQS: { q: string; a: string }[] = [
  {
    q: "What kind of work do you take on?",
    a: "Backend & full-stack builds — APIs, data models, auth/RBAC — plus Flutter apps end to end. I like products where solid engineering and good design actually meet.",
  },
  {
    q: "Are you available for freelance or full-time?",
    a: "Yes — open to freelance, collaborations and full-time roles. The fastest way to start is a short note about what you're building.",
  },
  {
    q: "What does working together look like?",
    a: "Understand the problem, map the data and flows, ship a thin slice early, then iterate with you. You see progress every week, not only at the end.",
  },
  {
    q: "Which tech do you reach for?",
    a: "Laravel/PHP, Oracle & PL/SQL, Node and Firebase on the backend; Flutter/Dart on the front. I pick the stack that fits the problem, not the trend.",
  },
  {
    q: "How do we get started?",
    a: "Send a message with a sentence or two about the project and your timeline. I'll reply with next steps and a rough plan.",
  },
];

// What I Do — short service blurbs drawn from the user's real skill set.
const SERVICES: { title: string; desc: string }[] = [
  { title: "Product & Design", desc: "User research, Figma wireframes, requirement analysis and user stories — turning fuzzy problems into clear, buildable flows." },
  { title: "Build & Ship", desc: "Flutter & Dart apps, .NET and Python services, Firebase and SQL — from prototype to validated, real-device release." },
  { title: "AI & Workflow", desc: "Prompt engineering and AI workflow design with Claude, ChatGPT and Cursor to speed up docs, prototyping and delivery." },
];

// Per-project emoji sticker (fallback when an image 404s).
function projEmoji(p: Project) {
  const s = `${p.slug} ${p.category} ${p.title}`.toLowerCase();
  if (s.includes("medical") || s.includes("clinic")) return "🏥";
  if (s.includes("database") || s.includes("security")) return "🔐";
  if (s.includes("sport") || s.includes("field")) return "⚽";
  if (s.includes("english") || s.includes("learn")) return "📚";
  return "🚀";
}

// Graceful image with emoji fallback if the asset 404s.
function SafeImg({ src, alt, fallback }: { src: string; alt: string; fallback: string }) {
  const [broken, setBroken] = useState(false);
  if (broken) return <span style={{ fontSize: "2.4rem" }}>{fallback}</span>;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading="lazy" onError={() => setBroken(true)} />;
}

// Reveal-on-scroll wrapper — the Framer "fade + rise" feel.
function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

export function VibrantHome() {
  const [selected, setSelected] = useState<Project | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSelected(null); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [selected]);

  return (
    <>
      <style>{CSS}</style>

      <div className="vb-root">
        {/* ─── HERO ─────────────────────────────────────────────────────── */}
        <section className="vb-section vb-hero">
          <div className="vb-hero-copy">
            <motion.span
              className="vb-eyebrow"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            >
              <span className="vb-eyebrow-dot" /> Available for work · 2026
            </motion.span>

            <motion.h1
              className="vb-h1"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.06 }}
            >
              Software<br />Engineer<span className="vb-h1-accent">.</span>
            </motion.h1>

            <motion.p
              className="vb-lead"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}
            >
              Backend, Flutter &amp; a soft spot for good design.
            </motion.p>

            <motion.div
              className="vb-hero-cta"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            >
              <a className="vb-btn vb-btn--primary" href={`mailto:${EMAIL}`}>
                Let&apos;s Talk <ArrowUpRight size={17} />
              </a>
              <a className="vb-btn vb-btn--ghost" href="#work">Selected work</a>
            </motion.div>

            <motion.div
              className="vb-socials"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.42 }}
            >
              {LINKS.github && <a className="vb-social" href={LINKS.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"><GithubIcon size={18} /></a>}
              {LINKS.linkedin && <a className="vb-social" href={LINKS.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><LinkedinIcon size={18} /></a>}
              <a className="vb-social" href={`mailto:${EMAIL}`} aria-label="Email"><MailIcon size={18} /></a>
            </motion.div>
          </div>

          {/* showcase — a tilted stack of project thumbnails */}
          <motion.div
            className="vb-hero-show"
            initial={{ opacity: 0, scale: 0.95, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 60, damping: 16, delay: 0.2 }}
          >
            {PROJECTS.slice(0, 3).map((p, i) => (
              <button
                key={p.slug}
                className={`vb-show-card vb-show-${i}`}
                onClick={() => setSelected(p)}
                aria-label={`Open ${p.title}`}
              >
                <SafeImg src={p.image} alt={p.title} fallback={projEmoji(p)} />
                <span className="vb-show-tag">{p.category}</span>
              </button>
            ))}
          </motion.div>
        </section>

        {/* ─── TECH MARQUEE ─────────────────────────────────────────────── */}
        <div className="vb-marquee" aria-hidden>
          <div className="vb-marquee-track">
            {[...MARQUEE, ...MARQUEE].map((t, i) => (
              <span className="vb-marquee-item" key={i}>{t} <b>✦</b></span>
            ))}
          </div>
        </div>

        {/* ─── 01 · SELECTED WORK ───────────────────────────────────────── */}
        <section className="vb-section" id="work">
          <Reveal>
            <div className="vb-sechead">
              <span className="vb-secnum">01</span>
              <h2 className="vb-h2">Selected Work</h2>
            </div>
            <p className="vb-sub">Pick a project — click to open the story inside.</p>
          </Reveal>

          <div className="vb-work-grid">
            {PROJECTS.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 2) * 0.08}>
                <button className="vb-work" onClick={() => setSelected(p)}>
                  <div className="vb-work-thumb">
                    <SafeImg src={p.image} alt={p.title} fallback={projEmoji(p)} />
                  </div>
                  <div className="vb-work-meta">
                    <div>
                      <h3 className="vb-work-title">{p.title}</h3>
                      <p className="vb-work-role">{p.role ?? p.category} · {p.year}</p>
                    </div>
                    <span className="vb-work-arrow"><ArrowUpRight size={18} /></span>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ─── 02 · ABOUT ───────────────────────────────────────────────── */}
        <section className="vb-section" id="about">
          <Reveal>
            <div className="vb-sechead">
              <span className="vb-secnum">02</span>
              <h2 className="vb-h2">About Me</h2>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="vb-about-id">
              <span className="vb-avatar">YN</span>
              <div>
                <p className="vb-about-name">Nguyễn Thị Yến Nhi</p>
                <p className="vb-about-role">Software Engineer · Product</p>
              </div>
            </div>

            <p className="vb-statement">
              A third-year IT student with a product mindset —{" "}
              <span className="vb-hl">I find user pain points, turn them into clear requirements, and guide technical teams to ship real solutions.</span>
            </p>

            <p className="vb-about-text">
              I&apos;ve led mobile app development end to end — from user research and Figma wireframes to sprint
              coordination and real-device testing. Google Project Management certified, with a soft spot for clean,
              human products.
            </p>

            <a className="vb-btn vb-btn--primary" href={`mailto:${EMAIL}`}>
              Let&apos;s Talk <ArrowUpRight size={17} />
            </a>
          </Reveal>
        </section>

        {/* ─── 03 · WHAT I DO ───────────────────────────────────────────── */}
        <section className="vb-section" id="services">
          <Reveal>
            <div className="vb-sechead">
              <span className="vb-secnum">03</span>
              <h2 className="vb-h2">What I Do</h2>
            </div>
          </Reveal>

          <div className="vb-svc-grid">
            {SERVICES.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.06}>
                <div className="vb-svc">
                  <span className="vb-svc-num">0{i + 1}</span>
                  <h3 className="vb-svc-title">{s.title}</h3>
                  <p className="vb-svc-desc">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ─── 04 · FAQ ─────────────────────────────────────────────────── */}
        <section className="vb-section" id="faq">
          <div className="vb-faq-wrap">
            <Reveal>
              <div className="vb-sechead vb-sechead--stack">
                <span className="vb-secnum">04</span>
                <h2 className="vb-h2">Frequently Asked Questions</h2>
              </div>
            </Reveal>

          <div className="vb-faq">
            {FAQS.map((f, i) => {
              const open = openFaq === i;
              return (
                <Reveal key={i} delay={i * 0.04}>
                  <div className="vb-faq-item">
                    <button className="vb-faq-q" onClick={() => setOpenFaq(open ? null : i)} aria-expanded={open}>
                      {f.q}
                      <Plus size={20} className="vb-faq-icon" style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }} />
                    </button>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          style={{ overflow: "hidden" }}
                        >
                          <p className="vb-faq-a">{f.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Reveal>
              );
            })}
          </div>
          </div>
        </section>

        {/* ─── CONTACT CTA ──────────────────────────────────────────────── */}
        <section className="vb-section">
          <Reveal>
            <div className="vb-cta">
              <h2 className="vb-h2 vb-cta-title">Let&apos;s build something delightful</h2>
              <p className="vb-cta-sub">Open to collaborations, freelance &amp; full-time roles.</p>
              <a className="vb-btn vb-btn--dark" href={`mailto:${EMAIL}`}>
                <Mail size={18} /> Say hello
              </a>
            </div>
          </Reveal>
        </section>
      </div>

      {/* ─── PROJECT MODAL ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="vb-backdrop"
            onClick={() => setSelected(null)}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              className="vb-modal"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, y: 24, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.94, y: 14, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
            >
              <button className="vb-close" onClick={() => setSelected(null)} aria-label="Close"><X size={18} /></button>
              <div className="vb-modal-hero">
                <span className="vb-modal-emoji">{projEmoji(selected)}</span>
                <p className="vb-modal-cat">{selected.category} · {selected.year}</p>
                <h3 className="vb-modal-title">{selected.title}</h3>
              </div>
              <div className="vb-modal-body">
                <p className="vb-modal-text" style={{ marginBottom: "1.2rem" }}>{selected.description}</p>
                {selected.problem && (
                  <div className="vb-modal-row">
                    <p className="vb-modal-label">The problem</p>
                    <p className="vb-modal-text">{selected.problem}</p>
                  </div>
                )}
                {selected.role && (
                  <div className="vb-modal-row">
                    <p className="vb-modal-label">My role</p>
                    <p className="vb-modal-text">{selected.role}</p>
                  </div>
                )}
                {selected.impact && (
                  <div className="vb-modal-row">
                    <p className="vb-modal-label">Impact</p>
                    <p className="vb-modal-text">{selected.impact}</p>
                  </div>
                )}
                <div className="vb-modal-row">
                  <p className="vb-modal-label">Built with</p>
                  <div className="vb-tech">
                    {selected.technologies.map((t) => <span key={t}>{t}</span>)}
                  </div>
                </div>
                <div className="vb-modal-links">
                  {selected.github && (
                    <a className="vb-btn vb-btn--ghost" href={selected.github} target="_blank" rel="noopener noreferrer">
                      <Code2 size={16} /> Code
                    </a>
                  )}
                  {selected.demo && (
                    <a className="vb-btn vb-btn--primary" href={selected.demo} target="_blank" rel="noopener noreferrer">
                      <ExternalLink size={16} /> Live demo
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Scoped styles (vb- prefix → never leaks into the rest of the site) ──────
const CSS = `
.vb-root{
  /* Dark Veles palette — near-black canvas, neon-lime accent. */
  --bg:#0B0B0C; --card:#151518; --card2:#1C1C21;
  --line:rgba(255,255,255,.09); --line2:rgba(255,255,255,.16);
  --ink:#F3F3F4; --body:#B4B4BC; --muted:#7C7C86;
  --lime:#D2F500; --lime-ink:#0B0B0C;
  position:relative; overflow:hidden;
  background:var(--bg); color:var(--body);
  font-family:var(--font-plus-jakarta), ui-sans-serif, system-ui, -apple-system, sans-serif;
  padding-bottom:3rem;
}
.vb-root *{ box-sizing:border-box; }
.vb-section{ max-width:1140px; margin:0 auto; padding:4.5rem 1.25rem; position:relative; }

/* headings + shared bits */
.vb-h1{ font-weight:800; color:var(--ink); font-size:clamp(3rem,9vw,6.4rem); line-height:.96; letter-spacing:-.035em; margin:1.1rem 0 1.2rem; }
.vb-h1-accent{ color:var(--lime); }
.vb-h2{ font-weight:800; color:var(--ink); font-size:clamp(1.8rem,4.4vw,2.8rem); line-height:1.05; letter-spacing:-.025em; margin:0; }
.vb-sub{ color:var(--muted); font-weight:500; margin:.5rem 0 0; }
.vb-sechead{ display:flex; align-items:baseline; gap:1rem; }
.vb-secnum{ font-size:.82rem; font-weight:700; letter-spacing:.12em; color:var(--lime); }
.vb-eyebrow{ display:inline-flex; align-items:center; gap:.55rem; font-weight:600; letter-spacing:.04em; font-size:.78rem; color:var(--body); border:1px solid var(--line2); padding:.45rem .9rem; border-radius:999px; }
.vb-eyebrow-dot{ width:8px; height:8px; border-radius:50%; background:var(--lime); box-shadow:0 0 10px var(--lime); }

/* buttons */
.vb-btn{ display:inline-flex; align-items:center; gap:.5rem; font-weight:700; font-size:.95rem; padding:.82rem 1.35rem; border-radius:999px; border:none; cursor:pointer; text-decoration:none; transition:transform .22s ease, background .22s, color .22s; }
.vb-btn--primary{ background:var(--lime); color:var(--lime-ink); }
.vb-btn--primary:hover{ transform:translateY(-2px); }
.vb-btn--ghost{ background:transparent; color:var(--ink); border:1px solid var(--line2); }
.vb-btn--ghost:hover{ border-color:var(--ink); }
.vb-btn--dark{ background:var(--lime-ink); color:var(--lime); }
.vb-btn--dark:hover{ transform:translateY(-2px); }

/* hero */
.vb-hero{ display:grid; grid-template-columns:1.1fr .9fr; gap:2.5rem; align-items:center; padding-top:3.5rem; }
.vb-hero-copy{ max-width:34rem; }
.vb-lead{ font-size:1.12rem; line-height:1.6; color:var(--body); max-width:40ch; }
.vb-hero-cta{ display:flex; gap:.8rem; margin-top:1.7rem; flex-wrap:wrap; }
.vb-socials{ display:flex; gap:.6rem; margin-top:1.6rem; }
.vb-social{ width:44px; height:44px; border:1px solid var(--line2); border-radius:50%; display:inline-flex; align-items:center; justify-content:center; color:var(--body); transition:color .22s, border-color .22s, transform .22s; }
.vb-social:hover{ color:var(--lime); border-color:var(--lime); transform:translateY(-2px); }

.vb-hero-show{ position:relative; height:420px; }
.vb-show-card{ position:absolute; width:60%; aspect-ratio:9/16; border-radius:20px; overflow:hidden; border:1px solid var(--line); background:var(--card2); cursor:pointer; padding:0; box-shadow:0 30px 60px rgba(0,0,0,.55); transition:transform .35s ease; }
.vb-show-card img{ width:100%; height:100%; object-fit:cover; display:block; }
.vb-show-card .vb-show-tag{ position:absolute; left:.6rem; bottom:.6rem; font-size:.6rem; font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:var(--lime-ink); background:var(--lime); padding:.25rem .55rem; border-radius:999px; }
.vb-show-0{ left:0; top:30px; transform:rotate(-6deg); z-index:1; }
.vb-show-1{ left:22%; top:0; transform:rotate(2deg); z-index:3; }
.vb-show-2{ right:0; top:46px; transform:rotate(7deg); z-index:2; }
.vb-show-card:hover{ transform:translateY(-10px) rotate(0deg); z-index:5; }

/* marquee */
.vb-marquee{ border-top:1px solid var(--line); border-bottom:1px solid var(--line); overflow:hidden; padding:1.3rem 0; }
.vb-marquee-track{ display:flex; gap:2.6rem; width:max-content; animation:vb-scroll 26s linear infinite; }
.vb-marquee-item{ display:inline-flex; align-items:center; gap:.7rem; font-weight:700; font-size:1.05rem; color:var(--muted); white-space:nowrap; }
.vb-marquee-item b{ color:var(--lime); font-size:.7rem; }
@keyframes vb-scroll{ from{ transform:translateX(0); } to{ transform:translateX(-50%); } }

/* selected work */
.vb-work-grid{ display:grid; grid-template-columns:repeat(2,1fr); gap:1.6rem; margin-top:2.4rem; }
.vb-work{ display:block; width:100%; text-align:left; padding:0; cursor:pointer; border:1px solid var(--line); background:var(--card); border-radius:22px; overflow:hidden; transition:border-color .25s, transform .25s; }
.vb-work:hover{ border-color:var(--line2); transform:translateY(-4px); }
.vb-work-thumb{ aspect-ratio:16/11; overflow:hidden; background:var(--card2); display:flex; align-items:center; justify-content:center; }
.vb-work-thumb img{ width:100%; height:100%; object-fit:cover; display:block; transition:transform .6s ease; }
.vb-work:hover .vb-work-thumb img{ transform:scale(1.05); }
.vb-work-meta{ display:flex; align-items:center; justify-content:space-between; gap:1rem; padding:1.1rem 1.3rem 1.3rem; }
.vb-work-title{ font-weight:700; font-size:1.18rem; color:var(--ink); margin:0; }
.vb-work-role{ font-size:.84rem; color:var(--muted); margin:.25rem 0 0; }
.vb-work-arrow{ flex-shrink:0; width:44px; height:44px; border-radius:50%; border:1px solid var(--line2); display:flex; align-items:center; justify-content:center; color:var(--ink); transition:.25s; }
.vb-work:hover .vb-work-arrow{ background:var(--lime); color:var(--lime-ink); border-color:var(--lime); }

/* certificates */
.vb-cert-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:1.4rem; margin-top:2.4rem; }
.vb-cert{ background:var(--card); border:1px solid var(--line); border-radius:18px; padding:.8rem .8rem 1rem; transition:border-color .25s, transform .25s; }
.vb-cert:hover{ border-color:var(--line2); transform:translateY(-4px); }
.vb-cert-img{ border-radius:12px; overflow:hidden; aspect-ratio:1.6/1; background:var(--card2); display:flex; align-items:center; justify-content:center; }
.vb-cert-img img{ width:100%; height:100%; object-fit:cover; display:block; }
.vb-cert-cat{ display:inline-block; margin-top:.7rem; font-size:.64rem; font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:var(--lime); border:1px solid var(--line2); padding:.26rem .6rem; border-radius:999px; }
.vb-cert-title{ font-weight:700; color:var(--ink); font-size:1rem; line-height:1.25; margin:.6rem 0 .2rem; }
.vb-cert-issuer{ font-size:.82rem; color:var(--muted); margin:0; }
.vb-cert-foot{ display:flex; justify-content:space-between; align-items:center; margin-top:.9rem; font-size:.74rem; font-weight:600; color:var(--muted); }
.vb-cert-foot a{ color:var(--lime); text-decoration:none; display:inline-flex; align-items:center; gap:2px; }

/* about */
.vb-about-id{ display:flex; align-items:center; gap:.85rem; margin:2.2rem 0 1.7rem; }
.vb-avatar{ width:48px; height:48px; border-radius:50%; background:var(--lime); color:var(--lime-ink); font-weight:800; font-size:.95rem; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.vb-about-name{ font-weight:700; color:var(--ink); margin:0; }
.vb-about-role{ font-size:.85rem; color:var(--muted); margin:.15rem 0 0; }
.vb-statement{ font-weight:600; color:var(--ink); font-size:clamp(1.5rem,3.4vw,2.45rem); line-height:1.34; letter-spacing:-.015em; margin:0 0 1.5rem; max-width:30ch; }
.vb-hl{ color:var(--lime); }
.vb-about-text{ color:var(--body); font-size:1.05rem; line-height:1.7; max-width:62ch; margin:0 0 1.7rem; }

/* services */
.vb-svc-grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:1.4rem; margin-top:2.4rem; }
.vb-svc{ background:var(--card); border:1px solid var(--line); border-radius:20px; padding:1.6rem; min-height:226px; display:flex; flex-direction:column; transition:border-color .25s, transform .25s; }
.vb-svc:hover{ border-color:var(--line2); transform:translateY(-4px); }
.vb-svc-num{ width:42px; height:42px; border-radius:50%; background:var(--lime); color:var(--lime-ink); font-weight:800; font-size:.88rem; display:flex; align-items:center; justify-content:center; }
.vb-svc-title{ color:var(--lime); font-weight:700; font-size:1.32rem; margin:auto 0 .55rem; letter-spacing:-.01em; }
.vb-svc-desc{ color:var(--body); font-size:.94rem; line-height:1.6; margin:0; }

/* faq */
.vb-faq-wrap{ display:grid; grid-template-columns:.85fr 1.15fr; gap:2.5rem; align-items:start; margin-top:1rem; }
.vb-sechead--stack{ flex-direction:column; align-items:flex-start; gap:.35rem; }
.vb-faq{ margin-top:0; border-top:1px solid var(--line); }
.vb-faq-item{ border-bottom:1px solid var(--line); }
.vb-faq-q{ width:100%; display:flex; align-items:center; justify-content:space-between; gap:1rem; padding:1.5rem 0; background:none; border:none; cursor:pointer; color:var(--ink); font-weight:700; font-size:1.12rem; text-align:left; }
.vb-faq-icon{ color:var(--lime); flex-shrink:0; transition:transform .3s ease; }
.vb-faq-a{ color:var(--body); line-height:1.65; margin:0; padding:0 0 1.5rem; max-width:68ch; }

/* contact cta */
.vb-cta{ position:relative; text-align:center; border-radius:30px; padding:3.6rem 2rem; background:var(--lime); color:var(--lime-ink); overflow:hidden; }
.vb-cta-title{ color:var(--lime-ink) !important; }
.vb-cta-sub{ color:rgba(11,11,12,.7); font-weight:600; margin:.7rem 0 1.6rem; }
.vb-cta .vb-btn--dark{ display:inline-flex; }

/* modal */
.vb-backdrop{ position:fixed; inset:0; z-index:120; background:rgba(0,0,0,.72); backdrop-filter:blur(6px); display:flex; align-items:center; justify-content:center; padding:1.25rem; }
.vb-modal{ position:relative; width:min(620px,100%); max-height:88vh; overflow:auto; border-radius:24px; background:var(--card); border:1px solid var(--line); box-shadow:0 40px 90px rgba(0,0,0,.6); }
.vb-modal-hero{ padding:2rem 1.8rem 1.5rem; border-bottom:1px solid var(--line); background:var(--card2); }
.vb-modal-emoji{ font-size:2.6rem; }
.vb-modal-cat{ font-size:.7rem; font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:var(--lime); margin:.6rem 0 .3rem; }
.vb-modal-title{ font-weight:800; color:var(--ink); font-size:1.5rem; margin:0; }
.vb-modal-body{ padding:1.5rem 1.8rem 2rem; }
.vb-modal-row{ margin-bottom:1.1rem; }
.vb-modal-label{ font-size:.7rem; font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:var(--lime); margin:0; }
.vb-modal-text{ color:var(--body); line-height:1.6; margin:.25rem 0 0; }
.vb-tech{ display:flex; flex-wrap:wrap; gap:.5rem; margin-top:.5rem; }
.vb-tech span{ font-size:.78rem; font-weight:600; color:var(--ink); background:var(--card2); border:1px solid var(--line); padding:.35rem .7rem; border-radius:999px; }
.vb-modal-links{ display:flex; gap:.7rem; margin-top:1.4rem; flex-wrap:wrap; }
.vb-close{ position:absolute; top:1rem; right:1rem; width:38px; height:38px; border-radius:50%; border:1px solid var(--line); cursor:pointer; background:var(--card2); color:var(--ink); display:flex; align-items:center; justify-content:center; z-index:2; }

@media (max-width:880px){
  .vb-hero{ grid-template-columns:1fr; }
  .vb-hero-copy{ order:1; }
  .vb-hero-show{ order:2; height:340px; margin-top:1rem; }
  .vb-work-grid{ grid-template-columns:1fr; }
  .vb-svc-grid{ grid-template-columns:1fr; }
  .vb-svc{ min-height:0; }
  .vb-faq-wrap{ grid-template-columns:1fr; gap:1.2rem; }
  .vb-statement{ max-width:none; }
}
@media (max-width:560px){
  .vb-hero-show{ display:none; }
}
@media (prefers-reduced-motion: reduce){
  .vb-marquee-track{ animation:none; }
}
`;
