"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

import { Heading } from "./Heading";
import { Text } from "./Text";

interface TimelineItemProps {
  year?: string;
  title: string;
  organization?: string;
  description: string;
  isLast?: boolean;
}

function TimelineItem({ year, title, organization, description, isLast }: TimelineItemProps) {
  return (
    <div className="relative pl-8 sm:pl-12 pb-12 last:pb-0 group">
      {!isLast && (
        <div className="absolute left-[3px] top-6 bottom-0 w-[1px] bg-gradient-to-b from-zinc-800 to-transparent" />
      )}
      
      <div className="absolute left-0 top-2.5 h-[7px] w-[7px] rounded-full bg-zinc-800 group-hover:bg-primary transition-colors border border-background shadow-[0_0_10px_rgba(var(--primary),0)] group-hover:shadow-[0_0_10px_rgba(var(--primary),0.5)] z-10" />

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        whileHover={{ x: 5 }}
        className="space-y-4 p-6 rounded-2xl bg-secondary/10 border border-border/30 hover:border-primary/20 hover:bg-secondary/20 transition-all cursor-default"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-1">
            <Heading variant="subtitle" as="h3" className="text-sm font-black uppercase tracking-widest">{title}</Heading>
            {organization && (
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80 italic">
                {organization}
              </div>
            )}
          </div>
          <div className="text-[10px] font-black uppercase tracking-widest text-zinc-600 group-hover:text-zinc-400 transition-colors">
            {year}
          </div>
        </div>
        <Text variant="small" className="text-zinc-400 text-xs leading-relaxed max-w-xl">{description}</Text>
      </motion.div>
    </div>
  );
}

interface TimelineProps {
  items: Omit<TimelineItemProps, "isLast">[];
  className?: string;
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      {items.map((item, index) => (
        <TimelineItem
          key={index}
          {...item}
          isLast={index === items.length - 1}
        />
      ))}
    </div>
  );
}
