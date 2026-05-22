"use client";

import { motion } from "framer-motion";
import { Bot, Shield, FileText } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { featuresData } from "@/lib/data";

const featureIcons = [Bot, Shield, FileText];

export default function Features() {
  return (
    <section
      id="features"
      className="border-b-2 border-[#4A6444] bg-[#F5E5B1] py-24 md:py-32"
    >
      <Container>
        <SectionHeading
          title="Built for Real Relationships"
          subtitle="YourTrust combines AI-powered mediation with transparent trust scoring to make informal lending secure, respectful, and stress-free."
        />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {featuresData.map((feature, i) => {
            const Icon = featureIcons[i];
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="group relative border-2 border-[#4A6444] bg-[#F0DFA8] p-8 transition-all duration-200 hover:-translate-y-1 hover:shadow-[8px_8px_0px_#3A5235]"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center border-2 border-[#4A6444] bg-[#4A6444]/5">
                  <Icon className="h-7 w-7 text-[#4A6444]" />
                </div>

                <h3 className="font-sonko-black text-2xl leading-tight tracking-tight text-[#4A6444]">
                  {feature.title}
                </h3>

                <p className="mt-3 font-sonko-light text-sm leading-relaxed text-[#6B7F5A]">
                  {feature.description}
                </p>

                <ul className="mt-6 space-y-2 border-t-2 border-[#4A6444]/20 pt-6">
                  {feature.details.map((detail) => (
                    <li
                      key={detail}
                      className="flex items-start gap-2 font-sonko-medium text-xs uppercase tracking-wider text-[#4A6444]"
                    >
                      <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 bg-[#4A6444]" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
