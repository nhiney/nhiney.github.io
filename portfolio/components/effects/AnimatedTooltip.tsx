"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

export interface TooltipItem {
  id: number;
  name: string;
  role: string;
  bg: string;
  letter: string;
  href?: string;
}

export const AnimatedTooltip = ({ items }: { items: TooltipItem[] }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const springConfig = { stiffness: 100, damping: 5 };
  const x = useMotionValue(0);
  const rotate = useSpring(useTransform(x, [-100, 100], [-45, 45]), springConfig);
  const translateX = useSpring(useTransform(x, [-100, 100], [-50, 50]), springConfig);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const halfWidth = event.currentTarget.offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth);
  };

  return (
    <>
      {items.map((item) => {
        const circle = (
          <div
            onMouseMove={handleMouseMove}
            className={cn(
              "relative h-14 w-14 rounded-full border-2 border-white/20",
              "flex items-center justify-center font-black text-sm",
              "transition duration-500 group-hover:z-30 group-hover:scale-105 select-none",
              item.bg,
            )}
          >
            {item.letter}
          </div>
        );

        return (
          <div
            key={item.id}
            className="group relative -mr-4"
            onMouseEnter={() => setHoveredIndex(item.id)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <AnimatePresence mode="popLayout">
              {hoveredIndex === item.id && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.6 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { type: "spring", stiffness: 260, damping: 10 },
                  }}
                  exit={{ opacity: 0, y: 20, scale: 0.6 }}
                  style={{ translateX, rotate, whiteSpace: "nowrap" }}
                  className="absolute -left-1/2 -top-16 z-50 flex translate-x-1/2 flex-col items-center justify-center rounded-md bg-black px-4 py-2 text-xs shadow-xl"
                >
                  <div className="absolute inset-x-10 -bottom-px z-30 h-px w-[20%] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
                  <div className="absolute -bottom-px left-10 z-30 h-px w-[40%] bg-gradient-to-r from-transparent via-sky-500 to-transparent" />
                  <div className="relative z-30 text-sm font-bold text-white">{item.name}</div>
                  <div className="text-[10px] text-white/70">{item.role}</div>
                </motion.div>
              )}
            </AnimatePresence>

            {item.href ? (
              <Link href={item.href} target="_blank" rel="noopener noreferrer">
                {circle}
              </Link>
            ) : (
              circle
            )}
          </div>
        );
      })}
    </>
  );
};
