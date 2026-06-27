"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Send, CheckCircle2, MessageSquare, ArrowRight, Mail, User, Bell, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { SITE_CONFIG } from "@/lib/constants";

type ContactTab = "contact" | "waitlist";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  },
  exit: {
    opacity: 0,
    transition: { staggerChildren: 0.05, staggerDirection: -1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
};

const labelClass =
  "flex items-center gap-1.5 pl-1 text-[10px] font-bold uppercase tracking-widest text-primary";

const fieldClass =
  "w-full rounded-[14px] border border-border/70 bg-background/70 px-4 py-3.5 text-sm text-foreground transition-all duration-200 placeholder:text-muted-foreground/55 focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/10";

const primaryButtonClass =
  "group flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-4 text-xs font-bold uppercase tracking-widest text-primary-foreground transition-all duration-200 hover:bg-primary/90 active:scale-[0.98]";

export const QuestionSection = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<ContactTab>("contact");

  // Contact form state
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // Waitlist state
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistStatus, setWaitlistStatus] = useState<"idle" | "sending" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedMessage = message.trim();

    setStatus("sending");
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      const { identifyUser, trackEvent } = await import("@/lib/posthog");
      identifyUser(trimmedEmail, { name: trimmedName, source: "homepage_contact_form" });
      trackEvent("contact_form_submit", {
        source: "homepage_contact_form",
        email: trimmedEmail,
        name: trimmedName,
        message_length: trimmedMessage.length,
      });
    } catch {}

    setStatus("success");
    setTimeout(() => {
      setStatus("idle");
      setName("");
      setEmail("");
      setMessage("");
    }, 4000);
  };

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = waitlistEmail.trim().toLowerCase();

    setWaitlistStatus("sending");

    const existing = typeof window !== "undefined" ? localStorage.getItem("waitlist_email") : null;
    if (!existing) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      localStorage.setItem("waitlist_email", trimmedEmail);
      try {
        const { identifyUser, trackEvent } = await import("@/lib/posthog");
        identifyUser(trimmedEmail, { source: "homepage_waitlist_tab" });
        trackEvent("waitlist_signup", { email: trimmedEmail, source: "homepage_waitlist_tab" });
      } catch {}
    } else {
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    setWaitlistStatus("success");
    setTimeout(() => {
      setWaitlistStatus("idle");
      setWaitlistEmail("");
    }, 4000);
  };

  return (
    <section id="contact" className="relative scroll-mt-20 overflow-hidden bg-background py-16 sm:scroll-mt-24 sm:py-24 lg:py-32">
      {/* Refined subtle grid background for professional look */}
      <div className="absolute inset-0 bg-grid opacity-55 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <Container className="relative z-10 max-w-[1150px]">
        <div className="grid grid-cols-1 items-center gap-10 md:gap-14 lg:grid-cols-[1fr_500px] lg:gap-24">
          
          {/* Left Content Side */}
          <div className="flex flex-col justify-center space-y-6 sm:space-y-8 lg:space-y-10">
            <div className="space-y-4 sm:space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2"
              >
                <span className="h-px w-6 bg-primary"></span>
                <h4 className="text-xs font-bold uppercase tracking-[0.25em] text-foreground">
                  {t("question.section")}
                </h4>
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl font-black leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-[4rem]"
              >
                <span className="relative inline-block text-primary">
                  Happy to
                  {/* Subtle underline accent */}
                  <span className="absolute bottom-1 left-0 -z-10 h-[0.15em] w-full rounded-full bg-primary/15"></span>
                </span>
                <br />
                connect with you
              </motion.h2>
            </div>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="max-w-md text-base font-medium leading-relaxed text-muted-foreground sm:text-lg"
            >
              {t("question.description")}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="pt-2"
            >
              <div className="inline-flex items-center gap-5 rounded-2xl border border-border/60 bg-card/70 p-2 pr-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/65">
                    {t("question.response_label")}
                  </p>
                  <p className="text-sm font-semibold text-foreground/85">
                    {t("question.response_time")}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Form Side */}
          <div className="relative w-full">
            
            {/* Minimal Tab Switcher */}
            <div className="mb-5 flex justify-center lg:justify-end">
              <div className="inline-flex rounded-full border border-border/60 bg-secondary/60 p-1 backdrop-blur-md">
                <button
                  onClick={() => setActiveTab("contact")}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-widest transition-all duration-300",
                    activeTab === "contact"
                      ? "bg-card text-primary shadow-[0_2px_10px_hsl(var(--foreground)/0.06)]"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <MessageSquare size={13} />
                  Contact
                </button>
                <button
                  onClick={() => setActiveTab("waitlist")}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-widest transition-all duration-300",
                    activeTab === "waitlist"
                      ? "bg-card text-primary shadow-[0_2px_10px_hsl(var(--foreground)/0.06)]"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Bell size={13} />
                  Waitlist
                </button>
              </div>
            </div>

            {/* Form Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 20 }}
              className="relative overflow-hidden rounded-3xl border border-border/60 bg-card p-6 shadow-[0_10px_50px_-12px_hsl(var(--foreground)/0.12)] dark:shadow-[0_10px_50px_-12px_hsl(0_0%_0%/0.5)] sm:p-8 lg:rounded-[2rem] lg:p-10"
            >
              <AnimatePresence mode="wait">
                {/* ── Contact tab ── */}
                {activeTab === "contact" && (
                  <motion.div key="contact-tab" variants={containerVariants} initial="hidden" animate="show" exit="exit">
                    {status !== "success" ? (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <motion.div variants={itemVariants} className="space-y-2">
                            <label className={labelClass}>
                              <User size={12} strokeWidth={2.5} />
                              {t("question.name_label")}
                            </label>
                            <input
                              required
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder={SITE_CONFIG.name}
                              className={fieldClass}
                            />
                          </motion.div>
                          <motion.div variants={itemVariants} className="space-y-2">
                            <label className={labelClass}>
                              <Mail size={12} strokeWidth={2.5} />
                              {t("question.email_label")}
                            </label>
                            <input
                              required
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder={SITE_CONFIG.links.email}
                              className={fieldClass}
                            />
                          </motion.div>
                        </div>

                        <motion.div variants={itemVariants} className="space-y-2">
                          <label className={labelClass}>
                            <MessageSquare size={12} strokeWidth={2.5} />
                            {t("question.msg_label")}
                          </label>
                          <textarea
                            required
                            rows={4}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder={t("question.msg_placeholder")}
                            className={cn(fieldClass, "resize-none py-4")}
                          />
                        </motion.div>

                        <motion.button
                          variants={itemVariants}
                          disabled={status === "sending"}
                          type="submit"
                          className={cn(
                            primaryButtonClass,
                            status === "sending" ? "cursor-not-allowed opacity-80" : "hover:shadow-[0_8px_20px_hsl(var(--primary)/0.25)]"
                          )}
                        >
                          {status === "sending" ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              {t("question.btn_sending")}
                            </>
                          ) : (
                            <>
                              {t("question.btn_send")}
                              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                            </>
                          )}
                        </motion.button>
                      </form>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="py-12 flex flex-col items-center text-center space-y-5"
                      >
                        <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <CheckCircle2 size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-foreground">
                          {t("question.success_title")}
                        </h3>
                        <p className="mx-auto max-w-xs text-sm text-muted-foreground">
                          {t("question.success_desc")}
                        </p>
                        <button
                          onClick={() => setStatus("idle")}
                          className="pt-4 text-[10px] font-bold uppercase tracking-widest text-primary hover:underline"
                        >
                          {t("question.send_another")}
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* ── Waitlist tab ── */}
                {activeTab === "waitlist" && (
                  <motion.div key="waitlist-tab" variants={containerVariants} initial="hidden" animate="show" exit="exit">
                    {waitlistStatus !== "success" ? (
                      <div className="space-y-7">
                        <motion.div variants={itemVariants} className="space-y-2">
                          <h3 className="text-2xl font-bold tracking-tight text-foreground">
                            {t("pages.waitlist.hero.title")}
                          </h3>
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            {t("pages.waitlist.hero.description")}
                          </p>
                        </motion.div>

                        <motion.div variants={itemVariants} className="space-y-4">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
                            {t("pages.waitlist.perks_label")}
                          </p>
                          <ul className="space-y-3">
                            {[t("pages.waitlist.perk_early"), t("pages.waitlist.perk_articles")]
                              .filter(Boolean)
                              .map((perk) => (
                                <li key={perk} className="flex items-center gap-3 text-sm text-foreground/80">
                                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <CheckCircle2 size={12} strokeWidth={3} />
                                  </div>
                                  {perk}
                                </li>
                              ))}
                          </ul>
                        </motion.div>

                        <motion.form variants={itemVariants} onSubmit={handleWaitlistSubmit} className="space-y-6 pt-2">
                          <div className="space-y-2">
                            <label className={labelClass}>
                              <Mail size={12} strokeWidth={2.5} />
                              {t("question.email_label")}
                            </label>
                            <input
                              required
                              type="email"
                              value={waitlistEmail}
                              onChange={(e) => setWaitlistEmail(e.target.value)}
                              placeholder={t("pages.waitlist.form_placeholder")}
                              className={fieldClass}
                            />
                          </div>

                          <button
                            disabled={waitlistStatus === "sending"}
                            type="submit"
                            className={cn(
                              primaryButtonClass,
                              waitlistStatus === "sending" ? "cursor-not-allowed opacity-80" : "hover:shadow-[0_8px_20px_hsl(var(--primary)/0.25)]"
                            )}
                          >
                            {waitlistStatus === "sending" ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                {t("question.btn_sending")}
                              </>
                            ) : (
                              <>
                                <Send size={15} className="mr-1" />
                                {t("pages.waitlist.form_submit")}
                                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                              </>
                            )}
                          </button>
                        </motion.form>
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="py-12 flex flex-col items-center text-center space-y-5"
                      >
                        <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <CheckCircle2 size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-foreground">
                          {t("pages.waitlist.success_title")}
                        </h3>
                        <p className="mx-auto max-w-xs text-sm text-muted-foreground">
                          {t("pages.waitlist.success_desc_prefix")} <strong className="font-semibold text-foreground">{waitlistEmail}</strong> {t("pages.waitlist.success_desc_suffix")}
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
};
