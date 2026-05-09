"use client";

import { motion } from "framer-motion";
import { Folder, Code2, Clock, Zap } from "lucide-react";
import { GithubIcon } from "./Icons";
import { useLanguage } from "@/context/LanguageContext";
import { IMPACT_METRICS } from "@/lib/constants";

export const GithubStats = () => {
  const { t } = useLanguage();
  const stats = [
    { label: t("analytics.total_repos"), value: "8+", icon: Folder, color: "text-blue-400" },
    { label: t("analytics.contrib"), value: "186+", icon: Zap, color: "text-yellow-400" },
    { label: t("analytics.hours"), value: "442+", icon: Clock, color: "text-green-400" },
    { label: t("analytics.main_stack"), value: "3 languages", icon: Code2, color: "text-purple-400" },
  ];

  const languages = [
    { name: "Dart (Flutter)", percentage: 45, color: "bg-blue-500" },
    { name: "C# (.NET)", percentage: 30, color: "bg-purple-500" },
    { name: "PHP (Laravel)", percentage: 15, color: "bg-red-500" },
    { name: "Python", percentage: 10, color: "bg-yellow-500" },
  ];

  return (
    <div className="w-full space-y-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 rounded-3xl bg-secondary/20 border border-border/50 hover:bg-secondary/40 hover:border-primary/30 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-background/50 ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <GithubIcon size={16} className="text-muted-foreground opacity-30 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-black tracking-tighter text-foreground luminous-pulse">
                {stat.value}
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">
                {stat.label}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Language Distribution Dashboard */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        className="p-8 md:p-12 rounded-[2.5rem] bg-secondary/10 border border-border/50 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-grid opacity-5" />
        
        <div className="relative z-10 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black uppercase tracking-widest text-primary italic">{t("analytics.tech_intel")}</h3>
            <span className="text-[10px] items-center gap-2 flex font-bold uppercase tracking-widest text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              {t("analytics.activity_analysis")}
            </span>
          </div>

          <div className="space-y-6">
            {languages.map((lang, idx) => (
              <div key={lang.name} className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                  <span className="text-foreground">{lang.name}</span>
                  <span className="text-primary">{lang.percentage}%</span>
                </div>
                <div className="h-2 w-full bg-background rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${lang.percentage}%` }}
                    transition={{ duration: 1, delay: 0.5 + (idx * 0.1) }}
                    className={`h-full ${lang.color} rounded-full blue-glow`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-border/50">
            <div className="space-y-2 relative group-hover:blue-glow p-4 rounded-2xl transition-all">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">{t("analytics.active_patterns")}</div>
              <p className="text-sm text-zinc-400 font-medium italic">{t("analytics.pattern_desc")}</p>
            </div>
            <div className="space-y-2 relative group-hover:blue-glow p-4 rounded-2xl transition-all">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">{t("analytics.commit_freq")}</div>
              <p className="text-sm text-zinc-400 font-medium font-mono uppercase tracking-ticker italic luminous-pulse">{t("analytics.peak_commits")}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
