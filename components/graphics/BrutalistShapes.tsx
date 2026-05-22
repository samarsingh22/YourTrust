"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function BrutalistShapes() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, -150]);
  const y2 = useTransform(scrollY, [0, 1000], [0, 100]);
  const y3 = useTransform(scrollY, [0, 1000], [0, -80]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        style={{ y: y1 }}
        className="absolute -right-24 -top-24 h-96 w-96 rounded-none border-4 border-[#4A6444]/20 bg-[#4A6444]/5"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute -bottom-32 -left-32 h-[500px] w-[500px] rotate-12 rounded-none border-2 border-[#4A6444]/15 bg-[#4A6444]/5"
      />
      <motion.div
        style={{ y: y3 }}
        className="absolute left-1/4 top-1/3 h-8 w-8 bg-[#4A6444]/10"
      />
      <motion.div
        style={{ y: y1 }}
        className="absolute right-1/3 top-2/3 h-4 w-16 bg-[#4A6444]/10"
      />
      <div className="absolute right-[15%] top-[20%] h-px w-32 rotate-45 bg-[#4A6444]/10" />
      <div className="absolute left-[10%] top-[60%] h-px w-48 -rotate-12 bg-[#4A6444]/10" />
      <div className="absolute left-[60%] top-[10%] h-48 w-48 rounded-none border border-[#4A6444]/10" />
    </div>
  );
}
