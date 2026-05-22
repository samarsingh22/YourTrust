"use client";

import { cn } from "@/lib/utils";
import FadeUp from "@/components/animations/FadeUp";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
  centered?: boolean;
}

export default function SectionHeading({
  title,
  subtitle,
  className,
  centered = true,
}: SectionHeadingProps) {
  return (
    <FadeUp>
      <div className={cn(centered && "text-center", "mb-16 md:mb-20", className)}>
        <h2 className="font-sonko-black text-4xl leading-tight tracking-tight md:text-5xl lg:text-6xl text-[#4A6444]">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#6B7F5A] md:text-lg" style={centered ? { marginLeft: "auto", marginRight: "auto" } : undefined}>
            {subtitle}
          </p>
        )}
        <div
          className={cn(
            "mt-6 h-1.5 w-16 bg-[#4A6444]",
            centered && "mx-auto"
          )}
        />
      </div>
    </FadeUp>
  );
}
