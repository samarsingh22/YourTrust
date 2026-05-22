"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface TextRevealProps {
  children: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
}

export default function TextReveal({
  children,
  className,
  as: Tag = "p",
  delay = 0,
}: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const words = children.split(" ");

  return (
    <div ref={ref} className={className}>
      <Tag className="inline">
        {words.map((word, i) => (
          <Word key={i} progress={scrollYProgress} index={i} delay={delay}>
            {word}
          </Word>
        ))}
      </Tag>
    </div>
  );
}

function Word({
  children,
  progress,
  index,
  delay,
}: {
  children: string;
  progress: any;
  index: number;
  delay: number;
}) {
  const start = delay + index * 0.02;
  const opacity = useTransform(progress, [start, start + 0.08], [0.15, 1]);

  return (
    <span className="inline-block">
      <motion.span style={{ opacity }} className="inline">
        {children}
        {index > 0 && index % 5 === 0 ? <br /> : " "}
      </motion.span>
    </span>
  );
}
