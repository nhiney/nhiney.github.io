"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, X, Code2, ExternalLink, Mail, ChevronRight, Briefcase, Award } from "lucide-react";
import { GithubIcon, LinkedinIcon, MailIcon } from "@/components/widgets/Icons";
import projectsData from "@/data/projects.json";
import { SITE_CONFIG } from "@/lib/constants";
import { useLanguage } from "@/context/LanguageContext";
import { dictionaries } from "@/lib/i18n/dictionaries";

interface Project {
  slug: string; title: string; description: string; problem?: string; role?: string;
  impact?: string; technologies: string[]; github?: string | null; demo?: string | null;
  image: string; year: string; category: string;
}

const PROJECTS = projectsData as Project[];
const LINKS = SITE_CONFIG?.links ?? ({} as Record<string, string>);
const EMAIL = LINKS.email ?? "hello@example.com";

const SERVICES = [
  { title: "Product Strategy", desc: "Translating ambiguous business requirements into clear, actionable roadmaps and user stories." },
  { title: "Full-Stack Dev", desc: "Building scalable backend architectures and intuitive frontends using modern frameworks." },
  { title: "Mobile Apps", desc: "Crafting fluid, cross-platform mobile experiences with Flutter and Dart." },
];

function SafeImg({ src, alt, fallback }: { src: string; alt: string; fallback: string }) {
  const [broken, setBroken] = useState(false);
  if (broken) return <div className="glass-fallback"><span>{fallback}</span></div>;
  return <img src={src} alt={alt} loading="lazy" onError={() => setBroken(true)} className="glass-img-el" />;
}

// Staggered reveal variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring" as const, stiffness: 80, damping: 20 } }
};

function MagneticButton({ children, className, href, onClick }: any) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.15, y: middleY * 0.15 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });
  const Component = href ? 'a' : 'button';

  return (
    <Component
      ref={ref as any} href={href} onClick={onClick} className={className}
      onMouseMove={handleMouse} onMouseLeave={reset}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: "transform 0.1s ease-out"
      }}
    >
      {children}
    </Component>
  );
}

export function DarkVelesHome() {
  const [selected, setSelected] = useState<Project | null>(null);
  const { language } = useLanguage();
  const portfolioCopy = (dictionaries[language as keyof typeof dictionaries] as any)?.pages?.portfolio || (dictionaries.en as any).pages.portfolio;
  const expItems = portfolioCopy.experience?.items || [];
  const certItems = portfolioCopy.certifications?.items || [];

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSelected(null); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [selected]);

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <style>{CSS}</style>

      <div className="glass-root">
        {/* Ambient Background Glows */}
        <div className="ambient-glow glow-1"></div>
        <div className="ambient-glow glow-2"></div>
        <div className="ambient-glow glow-3"></div>

        {/* HERO SECTION */}
        <section className="glass-section hero-section">
          <motion.div 
            className="hero-content"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={itemVariants} className="hero-badge">
              <span className="pulse-dot"></span> Available for new projects
            </motion.div>

            <motion.h1 variants={itemVariants} className="hero-title">
              Engineering <span className="text-gradient">elegance</span><br/>
              into digital products.
            </motion.h1>

            <motion.p variants={itemVariants} className="hero-subtitle">
              I am {SITE_CONFIG.fullName}, a Business Analyst & Backend Engineer. 
              I craft scalable systems and intuitive interfaces that seamlessly bridge business goals with user needs.
            </motion.p>

            <motion.div variants={itemVariants} className="hero-actions">
              <MagneticButton className="btn-glass primary" href="#work">
                Explore Work <ArrowUpRight size={18} />
              </MagneticButton>
              <div className="social-row">
                {LINKS.github && <MagneticButton className="btn-icon" href={LINKS.github} target="_blank"><GithubIcon size={20} /></MagneticButton>}
                {LINKS.linkedin && <MagneticButton className="btn-icon" href={LINKS.linkedin} target="_blank"><LinkedinIcon size={20} /></MagneticButton>}
                <MagneticButton className="btn-icon" href={`mailto:${EMAIL}`}><MailIcon size={20} /></MagneticButton>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* SELECTED WORKS */}
        <section className="glass-section" id="work">
          <div className="section-head">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} className="section-title"
            >
              Selected Works
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} transition={{ delay: 0.1 }} className="section-sub"
            >
              A curated collection of my recent technical challenges and solutions.
            </motion.p>
          </div>

          <div className="projects-grid">
            {PROJECTS.map((p, i) => (
              <motion.div 
                key={p.slug}
                initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ type: "spring" as const, stiffness: 60, damping: 20, delay: i * 0.1 }}
                className="project-card"
                onClick={() => setSelected(p)}
              >
                <div className="project-img-wrapper">
                  <SafeImg src={p.image} alt={p.title} fallback="✨" />
                  <div className="project-overlay">
                    <span className="view-btn">View Case Study</span>
                  </div>
                </div>
                <div className="project-content">
                  <div className="project-meta">
                    <span className="project-tag">{p.category}</span>
                    <span className="project-year">{p.year}</span>
                  </div>
                  <h3 className="project-title">{p.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* EXPERTISE / SERVICES */}
        <section className="glass-section">
          <div className="expertise-container">
            <motion.div 
              className="expertise-text"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring" as const, stiffness: 60 }}
            >
              <h2 className="section-title">My Expertise</h2>
              <p className="expertise-desc">
                With a dual perspective in business analysis and software engineering, 
                I don&apos;t just write code — I architect solutions that drive real value. 
                From database design to fluid UI animations, every layer is meticulously crafted.
              </p>
            </motion.div>

            <div className="services-grid">
              {SERVICES.map((s, i) => (
                <motion.div 
                  key={s.title}
                  className="service-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, type: "spring" as const, stiffness: 70 }}
                >
                  <div className="service-icon"><ChevronRight size={24} /></div>
                  <h3 className="service-title">{s.title}</h3>
                  <p className="service-desc">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* EXPERIENCE */}
        <section className="glass-section" id="experience">
          <div className="section-head text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} className="section-title"
            >
              {portfolioCopy.experience?.heading || "Experience"}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} transition={{ delay: 0.1 }} className="section-sub mx-auto"
            >
              {portfolioCopy.experience?.desc || "My professional journey"}
            </motion.p>
          </div>

          <div className="experience-grid mt-12">
            {expItems.map((item: any, i: number) => (
              <motion.div 
                key={i}
                className="exp-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 70 }}
              >
                <div className="exp-icon"><Briefcase size={22} /></div>
                <div className="exp-content">
                  <div className="exp-meta">
                    <span className="exp-period">{item.period}</span>
                    <span className="exp-dot">•</span>
                    <span className="exp-org">{item.org}</span>
                  </div>
                  <h3 className="exp-title">{item.title}</h3>
                  <p className="exp-desc">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CERTIFICATIONS */}
        <section className="glass-section" id="certifications">
          <div className="section-head text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} className="section-title"
            >
              {portfolioCopy.certifications?.heading || "Certifications"}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} transition={{ delay: 0.1 }} className="section-sub mx-auto"
            >
              {portfolioCopy.certifications?.desc || "Continuous learning and achievements"}
            </motion.p>
          </div>

          <div className="cert-grid mt-12">
            {certItems.map((item: any, i: number) => (
              <motion.div 
                key={i}
                className="cert-card"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 60 }}
              >
                <div className="cert-icon-wrapper">{item.emoji}</div>
                <h3 className="cert-title">{item.title}</h3>
                <div className="cert-meta">
                  <span className="cert-issuer">{item.issuer}</span>
                  <span className="cert-date">{item.date}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="glass-section cta-section">
          <motion.div 
            className="cta-glass-box"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring" as const, stiffness: 50, damping: 20 }}
          >
            <h2 className="cta-title">Ready to build something amazing?</h2>
            <p className="cta-desc">Let&apos;s collaborate to turn your vision into a robust digital reality.</p>
            <MagneticButton className="btn-glass primary" href={`mailto:${EMAIL}`}>
              <Mail size={18} /> Start a Conversation
            </MagneticButton>
          </motion.div>
        </section>

      </div>

      {/* MODAL */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="glass-modal-overlay"
            onClick={() => setSelected(null)}
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }} 
            animate={{ opacity: 1, backdropFilter: "blur(12px)" }} 
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          >
            <motion.div
              className="glass-modal"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: "spring" as const, stiffness: 300, damping: 25 }}
            >
              <button className="modal-close" onClick={() => setSelected(null)}>
                <X size={20} />
              </button>
              
              <div className="modal-img">
                <SafeImg src={selected.image} alt={selected.title} fallback="✨" />
              </div>

              <div className="modal-content">
                <div className="modal-meta">
                  <span className="modal-tag">{selected.category}</span>
                  <span className="modal-year">{selected.year}</span>
                </div>
                <h3 className="modal-title">{selected.title}</h3>
                <p className="modal-desc">{selected.description}</p>

                <div className="modal-blocks">
                  {selected.problem && (
                    <div className="m-block">
                      <h4>The Challenge</h4>
                      <p>{selected.problem}</p>
                    </div>
                  )}
                  {selected.impact && (
                    <div className="m-block">
                      <h4>Impact & Results</h4>
                      <p>{selected.impact}</p>
                    </div>
                  )}
                </div>

                <div className="m-block">
                  <h4>Tech Stack</h4>
                  <div className="tech-tags">
                    {selected.technologies.map(t => <span key={t}>{t}</span>)}
                  </div>
                </div>

                <div className="modal-actions">
                  {selected.github && (
                    <MagneticButton className="btn-glass outline" href={selected.github} target="_blank">
                      <Code2 size={18} /> Source Code
                    </MagneticButton>
                  )}
                  {selected.demo && (
                    <MagneticButton className="btn-glass primary" href={selected.demo} target="_blank">
                      <ExternalLink size={18} /> Live Project
                    </MagneticButton>
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

const CSS = `
:root {
  --g-bg: #f8fbfb;
  --g-surface: rgba(255, 255, 255, 0.7);
  --g-surface-hover: rgba(255, 255, 255, 0.92);
  --g-border: rgba(15, 38, 42, 0.07);
  --g-border-highlight: rgba(13, 139, 160, 0.18);
  --g-text: #16252a;
  --g-text-muted: #5c6f73;
  --g-primary: #0d8ba0;
  --g-primary-text: #ffffff;
  --g-glow-1: rgba(13, 139, 160, 0.10);
  --g-glow-2: rgba(65, 198, 214, 0.08);
  --g-glow-3: rgba(15, 38, 42, 0.05);
}

.dark, :root.dark {
  --g-bg: #0b0c0e;
  --g-surface: rgba(28, 32, 38, 0.5);
  --g-surface-hover: rgba(36, 41, 48, 0.8);
  --g-border: rgba(255, 255, 255, 0.06);
  --g-border-highlight: rgba(65, 198, 214, 0.22);
  --g-text: #eaecee;
  --g-text-muted: #9aa4a7;
  --g-primary: #41c6d6;
  --g-primary-text: #08222a;
  --g-glow-1: rgba(65, 198, 214, 0.08);
  --g-glow-2: rgba(13, 139, 160, 0.06);
  --g-glow-3: rgba(148, 163, 184, 0.04);
}

.glass-root {
  background-color: var(--g-bg);
  color: var(--g-text);
  font-family: 'Outfit', sans-serif;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  transition: background-color 0.5s ease;
}

/* Ambient Glows */
.ambient-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  z-index: 0;
  pointer-events: none;
  animation: float-glow 20s ease-in-out infinite alternate;
}

.glow-1 {
  top: -10%; left: -10%; width: 60vw; height: 60vw;
  background: var(--g-glow-1);
}
.glow-2 {
  bottom: 20%; right: -10%; width: 50vw; height: 50vw;
  background: var(--g-glow-2);
  animation-delay: -5s;
}
.glow-3 {
  top: 40%; left: 30%; width: 40vw; height: 40vw;
  background: var(--g-glow-3);
  animation-delay: -10s;
}

@keyframes float-glow {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(5%, 5%) scale(1.1); }
  100% { transform: translate(-5%, -5%) scale(0.9); }
}

.glass-section {
  position: relative;
  z-index: 10;
  max-width: 1200px;
  margin: 0 auto;
  padding: 8rem 2rem;
}

/* Typography */
.text-gradient {
  background: linear-gradient(135deg, #0d8ba0, #2bb6cb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.dark .text-gradient {
  background: linear-gradient(135deg, #41c6d6, #7adfe9);
  -webkit-background-clip: text;
  background-clip: text;
}

.section-title {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  margin: 0 0 1rem;
}

.section-sub {
  font-size: 1.15rem;
  color: var(--g-text-muted);
  font-weight: 400;
}

/* Buttons */
.btn-glass {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 1rem 2rem;
  border-radius: 100px;
  font-weight: 500;
  font-size: 1.05rem;
  text-decoration: none;
  backdrop-filter: blur(10px);
  border: 1px solid var(--g-border-highlight);
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-glass.primary {
  background: var(--g-primary);
  color: var(--g-primary-text);
  border-color: transparent;
}
.btn-glass.primary:hover {
  transform: scale(1.02);
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.btn-glass.outline {
  background: var(--g-surface);
  color: var(--g-text);
}
.btn-glass.outline:hover {
  background: var(--g-surface-hover);
}

.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 54px; height: 54px;
  border-radius: 50%;
  background: var(--g-surface);
  border: 1px solid var(--g-border);
  color: var(--g-text);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}
.btn-icon:hover {
  background: var(--g-surface-hover);
  border-color: var(--g-border-highlight);
  color: var(--g-text);
}

/* Hero */
.hero-section {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 90vh;
  text-align: center;
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 800px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 100px;
  background: var(--g-surface);
  border: 1px solid var(--g-border);
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--g-text);
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
}

.pulse-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 10px #10b981;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
  100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}

.hero-title {
  font-size: clamp(3.5rem, 8vw, 5.5rem);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.04em;
  margin: 0 0 1.5rem;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: var(--g-text-muted);
  line-height: 1.6;
  max-width: 600px;
  margin: 0 0 3rem;
}

.hero-actions {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
}

.social-row {
  display: flex;
  gap: 1rem;
}

/* Projects Grid */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
}

.project-card {
  background: var(--g-surface);
  border: 1px solid var(--g-border);
  border-radius: 24px;
  padding: 1rem;
  backdrop-filter: blur(12px);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
}

.project-card:hover {
  background: var(--g-surface-hover);
  border-color: var(--g-border-highlight);
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.05);
}

.project-img-wrapper {
  width: 100%;
  aspect-ratio: 4/3;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  background: var(--g-border);
}

.glass-img-el {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.project-card:hover .glass-img-el {
  transform: scale(1.05);
}

.project-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.project-card:hover .project-overlay {
  opacity: 1;
}

.view-btn {
  background: rgba(255,255,255,0.9);
  color: #000;
  padding: 0.8rem 1.5rem;
  border-radius: 100px;
  font-weight: 600;
  font-size: 0.9rem;
  transform: translateY(20px);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.project-card:hover .view-btn {
  transform: translateY(0);
}

.project-content {
  padding: 1.5rem 0.5rem 0.5rem;
}

.project-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.project-tag, .project-year {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--g-text-muted);
}

.project-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

/* Expertise */
.expertise-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;
}

.expertise-desc {
  font-size: 1.25rem;
  line-height: 1.7;
  color: var(--g-text-muted);
  margin-top: 1.5rem;
}

.services-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.service-card {
  background: var(--g-surface);
  border: 1px solid var(--g-border);
  padding: 2rem;
  border-radius: 24px;
  backdrop-filter: blur(12px);
  transition: all 0.3s ease;
}

.service-card:hover {
  background: var(--g-surface-hover);
  border-color: var(--g-border-highlight);
  transform: translateX(10px);
}

.service-icon {
  width: 48px; height: 48px;
  border-radius: 12px;
  background: var(--g-primary);
  color: var(--g-primary-text);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.service-title {
  font-size: 1.35rem;
  font-weight: 600;
  margin: 0 0 0.75rem;
}

.service-desc {
  color: var(--g-text-muted);
  line-height: 1.6;
  margin: 0;
}

/* Experience */
.experience-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.exp-card {
  background: var(--g-surface);
  border: 1px solid var(--g-border);
  border-radius: 24px;
  padding: 2rem;
  backdrop-filter: blur(12px);
  display: flex;
  gap: 1.5rem;
  transition: all 0.3s ease;
}

.exp-card:hover {
  background: var(--g-surface-hover);
  border-color: var(--g-border-highlight);
  transform: translateX(10px);
}

.exp-icon {
  width: 54px; height: 54px;
  border-radius: 16px;
  background: var(--g-primary);
  color: var(--g-primary-text);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.exp-content {
  flex: 1;
}

.exp-meta {
  display: flex; align-items: center; gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.exp-period {
  font-size: 0.85rem; font-weight: 700; color: var(--g-primary);
  text-transform: uppercase; letter-spacing: 0.05em;
}

.exp-dot {
  color: var(--g-border-highlight);
}

.exp-org {
  font-size: 0.85rem; font-weight: 600; color: var(--g-text-muted);
  text-transform: uppercase; letter-spacing: 0.05em;
}

.exp-title {
  font-size: 1.35rem; font-weight: 600; margin: 0 0 0.75rem; color: var(--g-text);
}

.exp-desc {
  font-size: 1.05rem; line-height: 1.6; color: var(--g-text-muted); margin: 0;
}

/* Certifications */
.cert-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
}

.cert-card {
  background: var(--g-surface);
  border: 1px solid var(--g-border);
  border-radius: 24px;
  padding: 2rem;
  backdrop-filter: blur(12px);
  transition: all 0.3s ease;
  text-align: center;
  display: flex; flex-direction: column; align-items: center;
}

.cert-card:hover {
  background: var(--g-surface-hover);
  border-color: var(--g-border-highlight);
  transform: translateY(-5px);
}

.cert-icon-wrapper {
  width: 64px; height: 64px;
  border-radius: 20px;
  background: var(--g-bg);
  border: 1px solid var(--g-border);
  font-size: 2rem;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 1.5rem;
}

.cert-title {
  font-size: 1.15rem; font-weight: 600; margin: 0 0 1rem; color: var(--g-text);
  line-height: 1.4;
}

.cert-meta {
  margin-top: auto;
  display: flex; flex-direction: column; gap: 0.4rem;
}

.cert-issuer {
  font-size: 0.85rem; font-weight: 600; color: var(--g-text-muted);
  text-transform: uppercase; letter-spacing: 0.05em;
}

.cert-date {
  font-size: 0.8rem; font-weight: 500; color: var(--g-primary);
  background: var(--g-primary-text);
  border: 1px solid var(--g-border);
  padding: 0.3rem 0.8rem;
  border-radius: 100px;
  display: inline-block;
}

.dark .cert-date {
  background: rgba(255,255,255,0.05);
  color: #fff;
}

/* CTA */
.cta-glass-box {
  background: var(--g-surface);
  border: 1px solid var(--g-border);
  border-radius: 32px;
  padding: 6rem 2rem;
  text-align: center;
  backdrop-filter: blur(20px);
  box-shadow: 0 30px 60px rgba(0,0,0,0.05);
}

.cta-title {
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: 700;
  margin: 0 0 1rem;
  letter-spacing: -0.03em;
}

.cta-desc {
  font-size: 1.25rem;
  color: var(--g-text-muted);
  margin: 0 auto 3rem;
  max-width: 500px;
}

/* Modal */
.glass-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.glass-modal {
  background: var(--g-bg);
  border: 1px solid var(--g-border-highlight);
  border-radius: 28px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 40px 80px rgba(0,0,0,0.2);
}

.modal-close {
  position: absolute;
  top: 1.5rem; right: 1.5rem;
  width: 44px; height: 44px;
  border-radius: 50%;
  background: var(--g-surface);
  border: 1px solid var(--g-border);
  color: var(--g-text);
  display: flex; align-items: center; justify-content: center;
  z-index: 10;
  backdrop-filter: blur(10px);
  cursor: pointer;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: var(--g-primary);
  color: var(--g-primary-text);
}

.modal-img {
  width: 100%; height: 400px;
  background: var(--g-border);
}

.modal-img img {
  width: 100%; height: 100%; object-fit: cover;
}

.modal-content {
  padding: 3rem;
}

.modal-meta {
  display: flex; gap: 1rem; margin-bottom: 1rem;
}
.modal-tag, .modal-year {
  font-size: 0.85rem; font-weight: 600; text-transform: uppercase; color: var(--g-text-muted);
}

.modal-title {
  font-size: 2.5rem; font-weight: 700; margin: 0 0 1.5rem; letter-spacing: -0.03em;
}

.modal-desc {
  font-size: 1.15rem; color: var(--g-text-muted); line-height: 1.7; margin-bottom: 3rem;
}

.modal-blocks {
  display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 3rem;
}

.m-block h4 {
  font-size: 0.9rem; text-transform: uppercase; color: var(--g-text); margin: 0 0 0.75rem; letter-spacing: 0.05em;
}
.m-block p {
  color: var(--g-text-muted); line-height: 1.6; margin: 0;
}

.tech-tags {
  display: flex; flex-wrap: wrap; gap: 0.5rem;
}
.tech-tags span {
  padding: 0.5rem 1rem; border-radius: 100px; background: var(--g-surface);
  border: 1px solid var(--g-border); font-size: 0.85rem; font-weight: 500;
}

.modal-actions {
  display: flex; gap: 1rem; margin-top: 3rem; padding-top: 2rem; border-top: 1px solid var(--g-border);
}

@media (max-width: 900px) {
  .expertise-container { grid-template-columns: 1fr; gap: 3rem; }
  .modal-blocks { grid-template-columns: 1fr; }
  .hero-title { font-size: 3.5rem; }
}

@media (max-width: 600px) {
  .glass-section { padding: 4rem 1.5rem; }
  .projects-grid { grid-template-columns: 1fr; }
  .modal-img { height: 250px; }
  .modal-content { padding: 2rem; }
  .modal-actions { flex-direction: column; }
  .hero-actions { flex-direction: column; width: 100%; }
  .hero-actions > * { width: 100%; }
  .social-row { justify-content: center; }
}
`
