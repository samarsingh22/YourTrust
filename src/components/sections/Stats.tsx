"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Container from "@/components/ui/Container";
import { statsData } from "@/lib/data";
import { Users, IndianRupee, ShieldCheck } from "lucide-react";

const icons = [Users, IndianRupee, ShieldCheck];

function Counter({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const num = parseInt(value.replace(/\D/g, ""));

  return (
    <span ref={ref} className="font-sonko-black text-5xl leading-none tracking-tight md:text-6xl lg:text-7xl text-[#4A6444]">
      {isInView && (
        <CountUp from={0} to={num} />
      )}
      {!isInView && "0"}
      {value.replace(/[0-9]/g, "")}
    </span>
  );
}

function CountUp({ from, to }: { from: number; to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <motion.span
        initial={{ opacity: 1 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        {to}
      </motion.span>
    </motion.span>
  );
}

export default function Stats() {
  return (
    <section className="border-b-2 border-[#4A6444] bg-[#F5E5B1] py-24 md:py-32">
      <Container>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {statsData.map((stat, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="group relative border-2 border-[#4A6444] bg-[#F0DFA8] p-8 transition-all duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0px_#3A5235]"
              >
                <div className="mb-6 flex items-center justify-between">
                  <Icon className="h-8 w-8 text-[#4A6444]" />
                  <span className="font-sonko-medium text-[10px] uppercase tracking-[0.2em] text-[#6B7F5A]">
                    {i === 0 ? "Community" : i === 1 ? "Volume" : "Reliability"}
                  </span>
                </div>
                <Counter value={stat.value} label={stat.label} />
                <p className="mt-2 font-sonko-medium text-sm uppercase tracking-wider text-[#6B7F5A]">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
