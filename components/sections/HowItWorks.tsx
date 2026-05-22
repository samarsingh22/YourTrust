"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import Container from "@/components/brutalist/Container";
import SectionHeading from "@/components/brutalist/SectionHeading";
import DashboardMockup from "@/components/graphics/DashboardMockup";
import { howItWorksData } from "@/lib/data";

function StepCard({
  step,
  title,
  subtitle,
  description,
  details,
  index,
  progress,
}: {
  step: number;
  title: string;
  subtitle: string;
  description: string;
  details: string[];
  index: number;
  progress: any;
}) {
  const start = index / 3;
  const end = (index + 1) / 3;
  const opacity = useTransform(progress, [start, start + 0.05, end - 0.05, end], [0.3, 1, 1, 0.3]);
  const x = useTransform(progress, [start, end], [60, 0]);
  const scale = useTransform(progress, [start, start + 0.1], [0.95, 1]);

  return (
    <motion.div
      style={{ opacity, x, scale }}
      className="flex min-h-[70vh] flex-col items-center justify-center gap-10 md:flex-row md:gap-16"
    >
      <div className="flex-1">
        <span className="mb-4 inline-block font-sonko-black text-[100px] leading-none text-[#4A6444]/10 md:text-[140px]">
          {String(step).padStart(2, "0")}
        </span>
        <h3 className="font-sonko-black text-3xl leading-tight tracking-tight text-[#4A6444] md:text-4xl">
          {title}
        </h3>
        <p className="mt-2 font-sonko-medium text-sm uppercase tracking-widest text-[#6B7F5A]">
          {subtitle}
        </p>
        <p className="mt-4 font-sonko-light text-base leading-relaxed text-[#6B7F5A]">
          {description}
        </p>
        <ul className="mt-6 space-y-2">
          {details.map((d) => (
            <li
              key={d}
              className="flex items-center gap-3 font-sonko-medium text-xs uppercase tracking-wider text-[#4A6444]"
            >
              <span className="h-1.5 w-1.5 flex-shrink-0 bg-[#4A6444]" />
              {d}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1">
        <DashboardMockup />
      </div>
    </motion.div>
  );
}

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const progress = scrollYProgress;

  return (
    <section
      id="how-it-works"
      className="border-b-2 border-[#4A6444] bg-[#F5E5B1] py-24 md:py-32"
    >
      <Container>
        <SectionHeading
          title="How It Works"
          subtitle="Three simple steps to transform informal lending into a secure, transparent experience."
        />

        <div ref={ref} className="relative mt-20">
          <div className="absolute left-0 top-0 h-full w-1 border border-[#4A6444]/30 md:left-1/2 md:-translate-x-1/2">
            <motion.div
              style={{ height }}
              className="w-full bg-[#4A6444]"
            />
          </div>

          <div className="relative space-y-32 md:space-y-0">
            {howItWorksData.map((step, i) => (
              <StepCard
                key={step.step}
                {...step}
                index={i}
                progress={progress}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
