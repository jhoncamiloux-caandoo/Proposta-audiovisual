"use client";

import { motion } from "framer-motion";

type RevealTextProps = {
  text: string;
  className?: string;
};

export function RevealText({ text, className }: RevealTextProps) {
  const words = text.split(" ");

  return (
    <span className={className}>
      {words.map((word, index) => (
        <motion.span
          aria-hidden="true"
          className="inline-block overflow-hidden pr-2"
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.08 * index,
            ease: [0.22, 1, 0.36, 1],
          }}
          key={`${word}-${index}`}
        >
          {word}
        </motion.span>
      ))}
      <span className="sr-only">{text}</span>
    </span>
  );
}
