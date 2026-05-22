"use client";

import { motion } from "framer-motion";
import { TrendingUp, Calendar, Users, Gauge } from "lucide-react";
import Container from "@/components/brutalist/Container";
import SectionHeading from "@/components/brutalist/SectionHeading";
import TrustGauge from "@/components/graphics/TrustGauge";
import { whyTrustData } from "@/lib/data";

const icons = [Gauge, TrendingUp, Calendar, Users];

export default function WhyTrust() {
  return (
    <section
      id="about"
      className="border-b-2 border-[#4A6444] bg-[#F5E5B1] py-24 md:py-32"
    >
      <Container>
        <SectionHeading
          title={whyTrustData.title}
          subtitle={whyTrustData.description}
        />

        <div className="flex flex-col items-center gap-16 lg:flex-row lg:gap-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-shrink-0"
          >
            <TrustGauge score={72} size={220} />
          </motion.div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {whyTrustData.mechanics.map((item, i) => {
              const Icon = icons[i];
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="border-2 border-[#4A6444] bg-[#F0DFA8] p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#3A5235]"
                >
                  <Icon className="mb-3 h-6 w-6 text-[#4A6444]" />
                  <h4 className="font-sonko-bold text-sm uppercase tracking-wider text-[#4A6444]">
                    {item.title}
                  </h4>
                  <p className="mt-2 font-sonko-light text-xs leading-relaxed text-[#6B7F5A]">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
