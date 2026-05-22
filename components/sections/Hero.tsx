"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Container from "@/components/brutalist/Container";
import BrutalistButton from "@/components/brutalist/Button";
import BrutalistShapes from "@/components/graphics/BrutalistShapes";
import { Sparkles } from "lucide-react";
import { siteConfig } from "@/lib/data";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden border-b-2 border-[#4A6444] bg-[#F5E5B1]">
      <BrutalistShapes />

      <Container className="relative z-10 flex min-h-screen flex-col items-center justify-center py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 inline-block border-2 border-[#4A6444] px-4 py-1.5"
        >
          <span className="font-sonko-medium text-xs uppercase tracking-[0.2em] text-[#4A6444]">
            <Sparkles className="inline-block h-3 w-3 mr-1.5 -mt-0.5" /> Powered by AI for smarter lending
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-5xl font-sonko-black text-5xl leading-[1.05] tracking-tight text-[#4A6444] md:text-7xl lg:text-8xl"
        >
          {siteConfig.tagline.split(" ").map((word, i) => (
            <span key={i} className="inline-block">
              {word}
              {i === 0 && <br />}
              {i < siteConfig.tagline.split(" ").length - 1 && "\u00A0"}
            </span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-6 max-w-2xl font-sonko-light text-lg leading-relaxed text-[#6B7F5A] md:text-xl"
        >
          {siteConfig.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <Link href="/auth/signup">
            <BrutalistButton size="lg" className="min-w-[180px]">
              Get Started Free
            </BrutalistButton>
          </Link>
          <a href="#features">
            <BrutalistButton variant="outline" size="lg" className="min-w-[180px]">
              Learn More
            </BrutalistButton>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-16 flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-[#6B7F5A]"
        >
          <span className="h-px w-8 bg-[#4A6444]/30" />
          Trusted by early adopters
          <span className="h-px w-8 bg-[#4A6444]/30" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="mt-3 flex items-center gap-8 font-sonko-medium text-sm text-[#4A6444]"
        >
          <span>10K+ Users</span>
          <span className="h-4 w-px bg-[#4A6444]/30" />
          <span>₹2M+ Managed</span>
          <span className="h-4 w-px bg-[#4A6444]/30" />
          <span>99% Trust Rate</span>
        </motion.div>
      </Container>
    </section>
  );
}
