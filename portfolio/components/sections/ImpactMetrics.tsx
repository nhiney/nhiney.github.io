"use client";

import { motion } from "framer-motion";
import { Briefcase, Code, Users, Zap } from "lucide-react";
import { IMPACT_METRICS } from "@/lib/constants";
import { useLanguage } from "@/context/LanguageContext";

const iconMap = {
  Briefcase: Briefcase,
  Code: Code,
  Users: Users,
  Zap: Zap,
};

export const ImpactMetrics = () => {
  const { t } = useLanguage();

  const labelMap: Record<string, string> = {
    "Repositories": "analytics.repo",
    "Contributions": "analytics.contrib",
    "Coding Hours": "analytics.hours",
    "Main Tech": "analytics.tech",
  };
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
      {IMPACT_METRICS.map((metric, idx) => {
        const Icon = iconMap[metric.icon as keyof typeof iconMap] || Zap;
        return (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="relative group p-6 rounded-2xl bg-secondary/30 border border-border/50 hover:border-primary/50 transition-all overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
            
            <div className="relative flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                <Icon size={24} />
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-black text-foreground tracking-tighter">
                  {metric.value}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                  {t(labelMap[metric.label] || metric.label)}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
