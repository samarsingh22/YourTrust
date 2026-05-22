import Header from "@/components/layout/Header";
import Hero from "@/components/sections/Hero";
// import Stats from "@/components/sections/Stats";
import Features from "@/components/sections/Features";
import HowItWorks from "@/components/sections/HowItWorks";
import Testimonials from "@/components/sections/Testimonials";
import WhyTrust from "@/components/sections/WhyTrust";
import CtaSection from "@/components/sections/CtaSection";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        {/* <Stats /> */}
        <Features />
        <HowItWorks />
        <Testimonials />
        <WhyTrust />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
