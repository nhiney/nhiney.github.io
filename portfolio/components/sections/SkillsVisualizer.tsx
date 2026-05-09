"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { SKILLS } from "@/lib/constants";
import { CheckCircle2 } from "lucide-react";

export const SkillsVisualizer = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {SKILLS.map((category, idx) => (
        <motion.div
          key={category.category}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="relative group p-8 rounded-[2.5rem] bg-secondary/20 border border-border/50 hover:bg-secondary/30 transition-all"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-primary/80 group-hover:text-primary transition-colors">
              {category.category}
            </h3>
            <div className="p-2 rounded-full bg-primary/10 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              <CheckCircle2 size={16} />
            </div>
          </div>

          {/* Chips Cluster */}
          <div className="flex flex-wrap gap-3">
            {category.items.map((skill, skillIdx) => (
              <motion.div
                key={skill}
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: (idx * 0.1) + (skillIdx * 0.05) }}
                whileHover={{ scale: 1.1, rotate: 2 }}
                className="cursor-default"
              >
                <Badge 
                  variant="secondary" 
                  className="py-2.5 px-5 bg-background/50 border-border/50 text-foreground font-bold rounded-full group-hover:border-primary/20 transition-colors shadow-sm"
                >
                  {skill}
                </Badge>
              </motion.div>
            ))}
          </div>

          {/* Bottom Accent */}
          <div className="absolute bottom-4 right-8 text-[8px] font-black uppercase tracking-widest text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity">
             Category Stack 0{idx + 1}
          </div>
        </motion.div>
      ))}
    </div>
  );
};
