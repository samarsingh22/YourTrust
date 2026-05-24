"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Container from "@/components/brutalist/Container";
import BrutalistButton from "@/components/brutalist/Button";

export default function CtaSection() {
  return (
    <section className="bg-[#4A6444] py-24 md:py-32">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative border-2 border-[#F5E5B1] bg-[#F5E5B1]/5 px-8 py-16 text-center md:px-16 md:py-24"
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-16 -top-16 h-48 w-48 rotate-12 border border-[#F5E5B1]/10" />
            <div className="absolute -bottom-16 -left-16 h-64 w-64 border border-[#F5E5B1]/10" />
          </div>

          <h2 className="relative font-sonko-black text-3xl leading-tight tracking-tight text-[#F5E5B1] md:text-5xl lg:text-6xl">
            Start Building Trust Today
          </h2>

          <p className="relative mx-auto mt-6 max-w-xl font-sonko-light text-base leading-relaxed text-[#F5E5B1]/80 md:text-lg">
            No lawyers. No courts. Just transparency, AI-powered mediation, and
            trust scores that protect every relationship.
          </p>

          <div className="relative mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/auth/signup">
            <BrutalistButton
              size="lg"
              className="min-w-[200px] border-[#F5E5B1] bg-[#F5E5B1] text-[#4A6444] hover:bg-[#F5E5B1]/90 hover:shadow-[4px_4px_0px_#3A5235]"
            >
              Get Started Free
            </BrutalistButton>
            </Link>
            <Link href="https://github.com/samarsingh22/YourTrust" target="_blank" rel="noopener noreferrer">
            <BrutalistButton
              variant="outline"
              size="lg"
              className="min-w-[200px] border-[#F5E5B1] text-[#F5E5B1] hover:bg-[#F5E5B1]/10"
            >
              View on GitHub
            </BrutalistButton>
            </Link>
          </div>

          <p className="relative mt-8 font-sonko-medium text-[10px] uppercase tracking-[0.15em] text-[#F5E5B1]/50">
            No credit card required • Free during beta
          </p>
        </motion.div>
      </Container>
    </section>
  );
}
