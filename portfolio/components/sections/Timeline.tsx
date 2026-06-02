"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";

interface TimelineItemProps {
  year?: string;
  title: string;
  organization?: string;
  description: string;
  isLast?: boolean;
}

function TimelineItem({ year, title, organization, description, isLast, index = 0 }: TimelineItemProps & { index?: number }) {
  return (
    <div className="relative pl-8 sm:pl-12 pb-12 last:pb-0 group">
      {!isLast && (
        <motion.div
          className="absolute left-[3px] top-6 bottom-0 w-[1px] bg-gradient-to-b from-zinc-800 dark:from-primary/40 to-transparent"
          initial={{ scaleY: 0, originY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
        />
      )}

      {/* Dot — pulses on hover */}
      <motion.div
        className="absolute left-0 top-2.5 h-[7px] w-[7px] rounded-full bg-zinc-800 dark:bg-secondary border border-background z-10"
        whileInView={{ scale: [0, 1.3, 1] }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.12 }}
        whileHover={{ scale: 1.6, backgroundColor: "hsl(var(--primary))" }}
      />

      <motion.div
        initial={{ opacity: 0, x: 24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ x: 6 }}
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
          <div className="text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-muted-foreground/50 group-hover:text-zinc-400 dark:group-hover:text-muted-foreground transition-colors">
            {year}
          </div>
        </div>
        <Text variant="small" className="text-zinc-400 dark:text-muted-foreground text-xs leading-relaxed max-w-xl">{description}</Text>
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
          index={index}
          isLast={index === items.length - 1}
        />
      ))}
    </div>
  );
}
