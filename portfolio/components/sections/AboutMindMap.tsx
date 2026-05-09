"use client";

import { motion } from "framer-motion";
import { MIND_MAP_DATA } from "@/lib/constants";

export const AboutMindMap = () => {
  return (
    <div className="relative py-20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid opacity-10 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      
      <div className="relative flex flex-col items-center gap-12 max-w-5xl mx-auto px-4">
        {/* Root Node */}
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          className="relative z-20 w-40 h-40 rounded-full bg-primary flex items-center justify-center shadow-[0_0_50px_rgba(var(--primary),0.3)] blue-glow"
        >
          <span className="text-xl font-black text-primary-foreground uppercase tracking-widest leading-none text-center">
            {MIND_MAP_DATA.root.split(" ").map((s, i) => (
              <span key={i} className="block">{s}</span>
            ))}
          </span>
        </motion.div>

        {/* Branches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full relative z-10">
          {MIND_MAP_DATA.branches.map((branch, branchIdx) => (
            <motion.div
              key={branch.label}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: branchIdx * 0.1 }}
              className="flex flex-col gap-4 p-6 rounded-3xl bg-secondary/20 border border-border/50 hover:bg-secondary/40 transition-all group"
            >
              <div className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-2">
                {branch.label}
              </div>
              <div className="flex flex-col gap-2">
                {branch.items.map((item, itemIdx) => (
                  <motion.div
                    key={item}
                    initial={{ x: -10, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ delay: (branchIdx * 0.1) + (itemIdx * 0.05) }}
                    className="flex items-center gap-3 group/item cursor-default"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover/item:bg-primary transition-colors" />
                    <span className="text-sm font-medium text-foreground/80 group-hover/item:text-foreground transition-colors">
                      {item}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Connection Lines simulation (Visual decoration) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl pointer-events-none opacity-20 hidden lg:block">
        <svg viewBox="0 0 800 400" className="w-full h-full stroke-primary fill-none stroke-[1] stroke-dasharray-[5,5]">
           {/* Lines to branches could be added here for a more literal map look */}
        </svg>
      </div>
    </div>
  );
};
