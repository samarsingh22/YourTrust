"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

interface StickyScrollProps {
  children: ReactNode;
  className?: string;
}

export default function StickyScroll({ children, className }: StickyScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export function ScrollProgress({
  progress,
  className,
}: {
  progress: MotionValue<number>;
  className?: string;
}) {
  const scaleX = useTransform(progress, [0, 1], [0, 1]);

  return (
    <motion.div
      style={{ scaleX }}
      className={`origin-left h-1 bg-[#4A6444] ${className ?? ""}`}
    />
  );
}
