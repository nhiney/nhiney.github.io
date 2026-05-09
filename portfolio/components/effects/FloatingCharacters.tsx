"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function FloatingCharacters() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {/* 💻 Laptop Icon */}
      <motion.div
        className="absolute top-1/4 left-4 md:left-20 text-5xl md:text-7xl filter grayscale hover:grayscale-0 transition-all cursor-default pointer-events-auto"
        animate={{
          y: [0, -20, 0],
          rotate: [-5, 5, -5],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        whileHover={{ scale: 1.2, transition: { duration: 0.2 } }}
      >
        💻
      </motion.div>

      {/* ⚡️ Lightning Icon */}
      <motion.div
        className="absolute top-1/3 right-4 md:right-20 text-5xl md:text-7xl filter grayscale hover:grayscale-0 transition-all cursor-default pointer-events-auto"
        animate={{
          y: [0, 20, 0],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        whileHover={{ scale: 1.2, transition: { duration: 0.2 } }}
      >
        ⚡️
      </motion.div>

      {/* 🚀 Rocket Icon */}
      <motion.div
        className="absolute bottom-32 left-1/4 text-4xl md:text-6xl filter grayscale hover:grayscale-0 transition-all cursor-default pointer-events-auto"
        animate={{
          y: [0, -30, 0],
          x: [0, 15, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        whileHover={{ scale: 1.2, transition: { duration: 0.2 } }}
      >
        🚀
      </motion.div>

      {/* 🧽 SpongeBob GIF */}
      <motion.div
        className="absolute bottom-20 right-[15%] w-32 h-32 md:w-48 md:h-48 opacity-80 hover:opacity-100 cursor-default pointer-events-auto"
        animate={{
          y: [0, -15, 0],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        whileHover={{ scale: 1.1, rotate: [-2, 2, -2], transition: { duration: 0.2 } }}
      >
        <Image
          src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNWM5Yzk1ZjkxMzM1YTVkNDRhZThmMTkxNWI1NzRhMDk5M2Y2ZDJkMCZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PXM/13HgwGsXF0aiGY/giphy.gif"
          alt="Mocking SpongeBob"
          fill
          className="object-contain drop-shadow-2xl"
          unoptimized
        />
      </motion.div>
    </div>
  );
}
