"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, MessageSquare, ArrowRight, Mail, User } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Heading } from "./Heading";
import { Text } from "./Text";

export const QuestionSection = () => {
  const { t } = useLanguage();
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setStatus("success");
    
    // Auto-reset after a few seconds
    setTimeout(() => setStatus("idle"), 5000);
  };

  return (
    <section id="contact" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-[0.03] [mask-image:radial-gradient(white,transparent_70%)]" />

      {/* 🐙 Hula Octocat */}
      <motion.div
        className="absolute bottom-10 right-10 md:bottom-20 md:right-32 w-24 h-24 md:w-40 md:h-40 opacity-30 md:opacity-50 hover:opacity-100 transition-opacity z-0 pointer-events-auto cursor-default"
        animate={{
          y: [0, -10, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        whileHover={{ scale: 1.1, rotate: [0, 5, -5, 0], transition: { duration: 0.3 } }}
      >
        <Image
          src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNWM5Yzk1ZjkxMzM1YTVkNDRhZThmMTkxNWI1NzRhMDk5M2Y2ZDJkMCZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PXM/1k4UqEwLg32bHchFBB/giphy.gif"
          alt="Hula Octocat"
          fill
          className="object-contain"
          unoptimized
        />
      </motion.div>
      
      <div className="container relative z-10 max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Content side */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Heading variant="section">{t("question.section")}</Heading>
              <Heading variant="title" className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-spectrum">
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card p-8 md:p-10 rounded-[2.5rem] border border-border/50 bg-secondary/10 relative overflow-hidden"
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
                          placeholder="John Doe"
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
                          placeholder="john@example.com"
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
                    <Text className="text-zinc-400 max-w-xs mx-auto">
                      {t("question.success_desc")}
                    </Text>
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
            
            {/* Background elements */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-50 pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl opacity-30 pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
};
