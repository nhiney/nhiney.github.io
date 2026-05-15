"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, MessageSquare, ArrowRight, Mail, User, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { SITE_CONFIG } from "@/lib/constants";

type ContactTab = "contact" | "waitlist";

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
    setStatus("sending");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setStatus("success");
    setTimeout(() => setStatus("idle"), 5000);
  };

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setWaitlistStatus("sending");

    const existing = typeof window !== "undefined" ? localStorage.getItem("waitlist_email") : null;
    if (!existing) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      localStorage.setItem("waitlist_email", waitlistEmail);
      try {
        const { identifyUser, trackEvent } = await import("@/lib/posthog");
        identifyUser(waitlistEmail);
        trackEvent("waitlist_signup", { source: "homepage_contact_tab" });
      } catch {}
    }

    setWaitlistStatus("success");
  };

  return (
    <section id="contact" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-[0.03] [mask-image:radial-gradient(white,transparent_70%)]" />

<div className="container relative z-10 max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Content side */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Heading variant="section" className="text-sm">{t("question.section")}</Heading>
              <Heading variant="title" className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter text-spectrum">
                {t("question.title").replace("{challenge}", t("question.challenge"))}
              </Heading>
            </div>

            <Text variant="large" className="text-zinc-400 max-w-md">
              {t("question.description")}
            </Text>

            <div className="space-y-6 pt-4">
              <div className="flex items-center gap-4 group cursor-default">
                <div className="h-12 w-12 rounded-2xl bg-secondary/30 flex items-center justify-center border border-border/50 group-hover:border-primary/50 transition-colors">
                  <MessageSquare className="text-primary" size={20} />
                </div>
                <div>
                  <div className="text-xs font-black uppercase tracking-widest text-zinc-500">{t("question.response_label")}</div>
                  <div className="text-sm font-bold text-zinc-300">{t("question.response_time")}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Form side */}
          <div className="relative">
            {/* Tab switcher */}
            <div className="flex gap-1 p-1 bg-secondary/20 rounded-2xl border border-border/50 mb-6 w-fit">
              <button
                onClick={() => setActiveTab("contact")}
                className={cn(
                  "flex items-center gap-2 px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all",
                  activeTab === "contact"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <MessageSquare size={12} />
                Contact
              </button>
              <button
                onClick={() => setActiveTab("waitlist")}
                className={cn(
                  "flex items-center gap-2 px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all",
                  activeTab === "waitlist"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Bell size={12} />
                Waitlist
              </button>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card p-8 md:p-10 rounded-[2.5rem] border border-border/50 bg-secondary/10 relative overflow-hidden"
            >
              <AnimatePresence mode="wait">

                {/* ── Contact tab ── */}
                {activeTab === "contact" && (
                  <motion.div
                    key="contact-tab"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <AnimatePresence mode="wait">
                      {status !== "success" ? (
                        <motion.form
                          key="contact-form"
                          onSubmit={handleSubmit}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="space-y-6"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <div className="flex items-center gap-3 text-primary mb-2">
                                <User size={14} />
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-70">{t("question.name_label")}</label>
                              </div>
                              <input
                                required
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={SITE_CONFIG.name}
                                className="w-full bg-background/50 border border-border/50 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-primary/50 transition-all placeholder:text-zinc-700"
                              />
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-3 text-primary mb-2">
                                <Mail size={14} />
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-70">{t("question.email_label")}</label>
                              </div>
                              <input
                                required
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={SITE_CONFIG.links.email}
                                className="w-full bg-background/50 border border-border/50 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-primary/50 transition-all placeholder:text-zinc-700"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-3 text-primary mb-2">
                              <MessageSquare size={14} />
                              <label className="text-[10px] font-black uppercase tracking-widest opacity-70">{t("question.msg_label")}</label>
                            </div>
                            <textarea
                              required
                              rows={4}
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              placeholder={t("question.msg_placeholder")}
                              className="w-full bg-background/50 border border-border/50 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-primary/50 transition-all placeholder:text-zinc-700 resize-none"
                            />
                          </div>

                          <button
                            disabled={status === "sending"}
                            type="submit"
                            className={cn(
                              "w-full group relative flex items-center justify-center gap-3 rounded-2xl bg-primary px-8 py-5 text-sm font-black uppercase tracking-widest text-primary-foreground transition-all active:scale-95 overflow-hidden",
                              status === "sending" ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.02] blue-glow"
                            )}
                          >
                            <span className="relative z-10 flex items-center gap-2">
                              {status === "sending" ? t("question.btn_sending") : t("question.btn_send")}
                              {status !== "sending" && <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />}
                            </span>
                          </button>
                        </motion.form>
                      ) : (
                        <motion.div
                          key="success-message"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="py-12 flex flex-col items-center text-center space-y-6"
                        >
                          <div className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4 animate-bounce">
                            <CheckCircle2 size={40} />
                          </div>
                          <Heading variant="title" className="text-2xl">{t("question.success_title")}</Heading>
                          <Text className="text-zinc-400 max-w-xs mx-auto">{t("question.success_desc")}</Text>
                          <button
                            onClick={() => setStatus("idle")}
                            className="text-xs font-black uppercase tracking-widest text-primary hover:underline pt-4"
                          >
                            {t("question.send_another")}
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                {/* ── Waitlist tab ── */}
                {activeTab === "waitlist" && (
                  <motion.div
                    key="waitlist-tab"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <AnimatePresence mode="wait">
                      {waitlistStatus !== "success" ? (
                        <motion.div
                          key="waitlist-form"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="space-y-6"
                        >
                          <div className="space-y-2">
                            <h3 className="text-lg font-black tracking-tight">{t("pages.waitlist.hero.title")}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {t("pages.waitlist.hero.description")}
                            </p>
                          </div>

                          <div className="space-y-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                              {t("pages.waitlist.perks_label")}
                            </p>
                            <ul className="space-y-2">
                              {[t("pages.waitlist.perk_early"), t("pages.waitlist.perk_articles")]
                                .filter(Boolean)
                                .map((perk) => (
                                  <li key={perk} className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0" />
                                    {perk}
                                  </li>
                                ))}
                            </ul>
                          </div>

                          <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-3 text-primary mb-2">
                                <Mail size={14} />
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-70">{t("question.email_label")}</label>
                              </div>
                              <input
                                required
                                type="email"
                                value={waitlistEmail}
                                onChange={(e) => setWaitlistEmail(e.target.value)}
                                placeholder={t("pages.waitlist.form_placeholder")}
                                className="w-full bg-background/50 border border-border/50 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-primary/50 transition-all placeholder:text-zinc-700"
                              />
                            </div>

                            <button
                              disabled={waitlistStatus === "sending"}
                              type="submit"
                              className={cn(
                                "w-full group flex items-center justify-center gap-3 rounded-2xl bg-primary px-8 py-5 text-sm font-black uppercase tracking-widest text-primary-foreground transition-all active:scale-95",
                                waitlistStatus === "sending" ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.02] blue-glow"
                              )}
                            >
                              <Send size={16} />
                              {waitlistStatus === "sending" ? t("question.btn_sending") : t("pages.waitlist.form_submit")}
                              {waitlistStatus !== "sending" && (
                                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                              )}
                            </button>
                          </form>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="waitlist-success"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="py-12 flex flex-col items-center text-center space-y-6"
                        >
                          <div className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4 animate-bounce">
                            <CheckCircle2 size={40} />
                          </div>
                          <Heading variant="title" className="text-2xl">{t("pages.waitlist.success_title")}</Heading>
                          <Text className="text-zinc-400 max-w-xs mx-auto">
                            {t("pages.waitlist.success_desc_prefix")} {waitlistEmail} {t("pages.waitlist.success_desc_suffix")}
                          </Text>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

              </AnimatePresence>
            </motion.div>

            {/* Glow bg elements */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-50 pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl opacity-30 pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
};
