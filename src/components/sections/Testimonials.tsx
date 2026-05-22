"use client";

import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { testimonialsData } from "@/lib/data";

function TestimonialCard({
  name,
  role,
  quote,
  initials,
}: {
  name: string;
  role: string;
  quote: string;
  initials: string;
}) {
  return (
    <div className="w-[350px] flex-shrink-0 border-2 border-[#4A6444] bg-[#F0DFA8] p-8 transition-all duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0px_#3A5235]">
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center border-2 border-[#4A6444] bg-[#4A6444]">
          <span className="font-sonko-black text-lg text-[#F5E5B1]">
            {initials}
          </span>
        </div>
        <div>
          <p className="font-sonko-bold text-sm text-[#4A6444]">{name}</p>
          <p className="font-sonko-medium text-[10px] uppercase tracking-[0.15em] text-[#6B7F5A]">
            {role}
          </p>
        </div>
      </div>

      <p className="font-sonko-light text-sm leading-relaxed text-[#6B7F5A]">
        &ldquo;{quote}&rdquo;
      </p>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="border-b-2 border-[#4A6444] bg-[#F5E5B1] py-24 md:py-32"
    >
      <Container>
        <SectionHeading
          title="Trusted by Real People"
          subtitle="Hear from users who transformed their informal lending experience with YourTrust."
        />
      </Container>

      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
        <div className="marquee-track flex w-max gap-6 px-6 md:px-16 lg:px-20">
          {[...testimonialsData, ...testimonialsData].map((t, i) => (
            <TestimonialCard key={`${t.name}-${i}`} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
}
