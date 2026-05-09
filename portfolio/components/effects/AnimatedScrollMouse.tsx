"use client";

import { motion } from "framer-motion";

export function AnimatedScrollMouse() {
  return (
    <motion.div
      className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-none hidden md:flex flex-col items-center gap-2 opacity-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 0.5, y: 0 }}
      transition={{ delay: 1, duration: 1 }}
    >
      <div className="w-[30px] h-[50px] rounded-full border-2 border-foreground/50 flex justify-center pt-2">
        <motion.div
          className="w-1.5 h-3 bg-foreground/50 rounded-full"
          animate={{
            y: [0, 15, 0],
            opacity: [1, 0, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </motion.div>
  );
}
