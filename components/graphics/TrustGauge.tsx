"use client";

import { motion } from "framer-motion";

interface TrustGaugeProps {
  score?: number;
  size?: number;
}

export default function TrustGauge({ score = 72, size = 200 }: TrustGaugeProps) {
  const radius = 85;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.max(0, Math.min(100, score));
  const offset = circumference - (clampedScore / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 80) return "#4A6444";
    if (s >= 60) return "#ca8a04";
    if (s >= 40) return "#ea580c";
    return "#dc2626";
  };

  const color = getColor(clampedScore);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#4A6444"
          strokeWidth="10"
          className="opacity-20"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="font-sonko-black text-4xl tracking-tight text-[#4A6444]"
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          {clampedScore}
        </motion.span>
        <span className="mt-1 font-sonko-medium text-xs uppercase tracking-widest text-[#6B7F5A]">
          Trust Score
        </span>
      </div>
    </div>
  );
}
