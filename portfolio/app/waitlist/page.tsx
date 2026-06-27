"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, Loader2, Mail } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";
import { identifyUser, trackEvent } from "@/lib/posthog";
import { useLanguage } from "@/context/LanguageContext";

// ─── Mock backend — replace with real API (Supabase / Firebase / etc.) ────────

async function saveEmailToWaitlist(email: string): Promise<void> {
  // ── Supabase example (uncomment & install @supabase/supabase-js) ──
  // const { error } = await supabase.from("waitlist").insert({ email });
  // if (error) throw error;

  // ── Mock: simulate network latency ──
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const existing = JSON.parse(localStorage.getItem("waitlist") ?? "[]") as string[];
  if (existing.includes(email)) return; // idempotent
  localStorage.setItem("waitlist", JSON.stringify([...existing, email]));
}

// ─── Toast component ──────────────────────────────────────────────────────────

function Toast({ message, type }: { message: string; type: "success" | "error" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`fixed bottom-8 left-1/2 z-[100] -translate-x-1/2 flex items-center gap-3 rounded-full border px-6 py-3 shadow-lg text-sm font-bold ${
        type === "success"
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
          : "border-red-500/30 bg-red-500/10 text-red-400"
      }`}
    >
      {type === "success" && <CheckCircle2 size={16} />}
      {message}
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const PERK_KEYS = ["early", "articles"] as const;

export default function WaitlistPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();

    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      showToast(t("pages.waitlist.invalid_email"), "error");
      inputRef.current?.focus();
      return;
    }

    setStatus("loading");
    try {
      await saveEmailToWaitlist(trimmed);

      identifyUser(trimmed, { source: "waitlist_page", joined_at: new Date().toISOString() });
      trackEvent("waitlist_signup", { email: trimmed, source: "waitlist_page" });

      setStatus("done");
      showToast(t("pages.waitlist.success_toast"), "success");
    } catch {
      setStatus("error");
      showToast(t("pages.waitlist.error_toast"), "error");
      setStatus("idle");
    }
  };

  return (
    <>
      <Container className="pb-32">
        <Section className="flex min-h-[90vh] flex-col items-center justify-center text-center">
          {/* Background glow */}
          <div className="absolute left-1/2 top-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[80px]" />

          <FadeIn className="flex flex-col items-center gap-8 max-w-xl w-full">
            {/* Badge */}
            <Badge
              variant="outline"
              className="px-6 py-2 bg-primary/10 border-primary/20 text-primary font-bold tracking-widest uppercase text-[10px]"
            >
              {t("pages.waitlist.hero.badge")}
            </Badge>

            {/* Heading */}
            <div className="space-y-4">
              <Heading variant="hero" as="h1" className="text-5xl md:text-6xl">
                {t("pages.waitlist.hero.title")}
              </Heading>
              <p className="text-base text-muted-foreground leading-relaxed">
                {t("pages.waitlist.hero.description")}
              </p>
            </div>

            {/* Perks */}
            <ul className="space-y-2 self-start text-left">
              {PERK_KEYS.map((key) => (
                <li key={key} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 size={15} className="shrink-0 text-primary" />
                  {t(`pages.waitlist.perk_${key}`)}
                </li>
              ))}
            </ul>

            {/* Form */}
            {status === "done" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 px-10 py-8 w-full"
              >
                <CheckCircle2 size={40} className="text-emerald-400" />
                <p className="text-base font-black text-emerald-400">{t("pages.waitlist.success_title")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("pages.waitlist.success_desc_prefix")} <strong className="text-foreground">{email}</strong> {t("pages.waitlist.success_desc_suffix")}
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Mail
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    ref={inputRef}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("pages.waitlist.form_placeholder")}
                    disabled={status === "loading"}
                    className="w-full rounded-full border border-border/60 bg-card/60 py-4 pl-11 pr-5 text-sm font-medium placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 transition-all"
                    autoComplete="email"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-black uppercase tracking-widest text-white transition-all hover:scale-105 hover:shadow-[0_0_30px_-8px_hsl(var(--primary))] active:scale-95 disabled:opacity-60 disabled:pointer-events-none"
                >
                  {status === "loading" ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      {t("pages.waitlist.form_submit")}
                      <ArrowRight
                        size={15}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Counter (static for now) */}
            <p className="text-[11px] text-muted-foreground/60">
              {t("pages.waitlist.counter_prefix")} <strong className="text-muted-foreground">{t("pages.waitlist.counter_middle")}</strong> {t("pages.waitlist.counter_suffix")}
            </p>
          </FadeIn>
        </Section>
      </Container>

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} />}
      </AnimatePresence>
    </>
  );
}
