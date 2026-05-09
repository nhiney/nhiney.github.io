"use client";

import { Phone, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/widgets/Icons";
import { CV } from "@/data/cv";

// ─── Internal building blocks ─────────────────────────────────────────────────

function CVSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xs font-black uppercase tracking-[0.25em] text-primary">
        {title}
        <span className="ml-3 inline-block h-px w-12 align-middle bg-gradient-to-r from-primary/60 to-transparent" />
      </h2>
      {children}
    </section>
  );
}

function ProjectBlock({ project }: { project: typeof CV.projects[number] }) {
  return (
    <article className="space-y-3">
      <header className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <h3 className="text-base font-black tracking-tight text-foreground">{project.title}</h3>
          {project.role && (
            <span className="text-sm italic text-muted-foreground">— {project.role}</span>
          )}
        </div>
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground shrink-0">
          {project.period}
        </span>
      </header>

      <p className="text-sm italic leading-relaxed text-muted-foreground">
        <span className="font-semibold not-italic text-foreground/80">Problem: </span>
        {project.problem}
      </p>

      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-foreground/80">Key Contributions</p>
        <ul className="space-y-2 pl-5">
          {project.contributions.map((c, i) => (
            <li
              key={i}
              className="relative text-sm leading-relaxed text-muted-foreground before:absolute before:-left-4 before:top-[0.55em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-primary/60"
            >
              {c}
            </li>
          ))}
        </ul>
      </div>

      <p className="text-sm leading-relaxed">
        <span className="font-semibold uppercase tracking-widest text-[10px] text-foreground/80">Key Tech: </span>
        <span className="text-muted-foreground">{project.tech}</span>
      </p>
    </article>
  );
}

// ─── Main document ────────────────────────────────────────────────────────────

export function CVDocument() {
  return (
    <article className="rounded-3xl border border-border/50 bg-card/40 backdrop-blur-sm p-8 sm:p-12 lg:p-16 space-y-12 glass-card shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)]">

      {/* ── Header ────────────────────────────────────────────────── */}
      <header className="space-y-4 border-b border-border/50 pb-8 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight uppercase">
          {CV.name}
        </h1>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <a href={`tel:${CV.contact.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-1.5 transition-colors hover:text-primary">
            <Phone size={13} /> {CV.contact.phone}
          </a>
          <a href={`mailto:${CV.contact.email}`} className="inline-flex items-center gap-1.5 transition-colors hover:text-primary">
            <Mail size={13} /> {CV.contact.email}
          </a>
          <a href={CV.contact.github.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 transition-colors hover:text-primary">
            <GithubIcon size={13} /> {CV.contact.github.handle}
          </a>
          <a href={CV.contact.linkedin.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 transition-colors hover:text-primary">
            <LinkedinIcon size={13} /> {CV.contact.linkedin.handle}
          </a>
        </div>
      </header>

      {/* ── Summary ───────────────────────────────────────────────── */}
      <CVSection title="Summary">
        <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          {CV.summary.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      </CVSection>

      {/* ── Skills & Tools ────────────────────────────────────────── */}
      <CVSection title="Skills & Tools">
        <dl className="space-y-3 text-sm leading-relaxed">
          {CV.skills.map(({ category, items }) => (
            <div key={category} className="flex flex-col gap-1 sm:flex-row sm:gap-3">
              <dt className="font-bold text-foreground sm:w-44 sm:shrink-0">{category}</dt>
              <dd className="text-muted-foreground">{items}</dd>
            </div>
          ))}
        </dl>
      </CVSection>

      {/* ── Projects ──────────────────────────────────────────────── */}
      <CVSection title="Projects">
        <div className="space-y-10">
          {CV.projects.map((p) => (
            <ProjectBlock key={p.title} project={p} />
          ))}
        </div>
        <p className="mt-6 text-xs italic text-muted-foreground">
          {CV.github_note.replace("github.com/nhiney", "")}{" "}
          <a
            href={CV.contact.github.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary hover:underline"
          >
            github.com/{CV.contact.github.handle}
          </a>
        </p>
      </CVSection>

      {/* ── Education ─────────────────────────────────────────────── */}
      <CVSection title="Education">
        {CV.education.map((edu) => (
          <div key={edu.school} className="space-y-3">
            <header className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <h3 className="text-base font-black tracking-tight text-foreground">{edu.school}</h3>
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground shrink-0">
                {edu.location}
              </span>
            </header>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between text-sm italic text-muted-foreground">
              <span>
                {edu.degree} | <span className="font-semibold not-italic text-foreground/80">GPA: {edu.gpa}</span>
              </span>
              <span className="text-xs font-semibold uppercase tracking-widest not-italic shrink-0">
                Expected: {edu.expected}
              </span>
            </div>
            <ul className="space-y-2 pl-5">
              {edu.notes.map((note, i) => (
                <li
                  key={i}
                  className="relative text-sm leading-relaxed text-muted-foreground before:absolute before:-left-4 before:top-[0.55em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-primary/60"
                >
                  {note}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </CVSection>

      {/* ── Certifications & Honors ───────────────────────────────── */}
      <CVSection title="Certifications & Honors">
        <div className="space-y-8">
          {CV.certifications.map((cert) => (
            <div key={cert.title} className="space-y-3">
              <header className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="text-base font-black tracking-tight text-foreground">{cert.title}</h3>
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground shrink-0">
                  {cert.period}
                </span>
              </header>
              <p className="text-sm italic text-muted-foreground">{cert.source}</p>
              <ul className="space-y-2 pl-5">
                {cert.items.map((item) => (
                  <li
                    key={item.label}
                    className="relative text-sm leading-relaxed text-muted-foreground before:absolute before:-left-4 before:top-[0.55em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-primary/60"
                  >
                    <span className="font-bold text-foreground">{item.label}: </span>
                    <span className="italic">Certificate</span> | {item.description}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Research */}
          <div className="space-y-3">
            <header className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <h3 className="text-base font-black tracking-tight text-foreground">{CV.research.title}</h3>
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground shrink-0">
                {CV.research.period}
              </span>
            </header>
            <p className="text-sm italic text-muted-foreground">{CV.research.source}</p>
            <ul className="space-y-2 pl-5">
              <li className="relative text-sm leading-relaxed text-muted-foreground before:absolute before:-left-4 before:top-[0.55em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-primary/60">
                {CV.research.description}
              </li>
            </ul>
          </div>
        </div>
      </CVSection>
    </article>
  );
}
