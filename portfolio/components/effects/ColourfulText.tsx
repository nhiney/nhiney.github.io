"use client";

import * as React from "react";
import { motion } from "framer-motion";

export function ColourfulText({ text }: { text: string }) {
  const tokens = React.useMemo(() => {
    let charIndex = 0;

    return text.split(/(\s+)/).map((part, tokenIndex) => {
      if (/^\s+$/.test(part)) {
        return { type: "space" as const, part, tokenIndex };
      }

      const chars = part.split("").map((char) => ({
        char,
        charIndex: charIndex++,
      }));

      return { type: "word" as const, chars, tokenIndex };
    });
  }, [text]);

  return (
    <>
      {tokens.map((token) =>
        token.type === "space" ? (
          <React.Fragment key={`space-${token.tokenIndex}`}>{token.part}</React.Fragment>
        ) : (
          <span key={`word-${token.tokenIndex}`} className="inline-block whitespace-nowrap">
            {token.chars.map(({ char, charIndex }) => (
              <motion.span
                key={`${char}-${charIndex}`}
                initial={{ y: 0 }}
                animate={{
                  y: [0, -3, 0],
                  scale: [1, 1.01, 1],
                  opacity: [1, 0.9, 1],
                }}
                transition={{ duration: 0.5, delay: charIndex * 0.035 }}
                className="inline-block whitespace-pre font-sans"
                style={{
                  color: `hsl(var(${
                    ["--site-accent", "--site-accent-2", "--site-accent-3"][charIndex % 3]
                  }, var(--primary)))`,
                }}
              >
                {char}
              </motion.span>
            ))}
          </span>
        ),
      )}
    </>
  );
}
