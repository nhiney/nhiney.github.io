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
    <div className="relative pl-16 sm:pl-24 pb-12 last:pb-0">
      {/* Year Indicator */}
      <div className="absolute left-0 top-1 text-[10px] font-black uppercase tracking-widest text-zinc-500 w-12 sm:w-20">
        {year}
      </div>

      {!isLast && (
        <div className="absolute left-[64px] sm:left-[96px] top-6 bottom-0 w-[1px] bg-zinc-800" />
      )}
      
      <div className="absolute left-[61px] sm:left-[93px] top-2 h-2 w-2 rounded-full bg-primary" />

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="space-y-2">
          <Heading variant="subtitle" as="h3">{title}</Heading>
          {organization && (
            <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 italic">
              {organization}
            </div>
          )}
          <Text variant="small" className="max-w-xl">{description}</Text>
        </div>
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
