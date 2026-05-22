"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Container from "@/components/brutalist/Container";
import BrutalistButton from "@/components/brutalist/Button";
import { navLinks } from "@/lib/data";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b-2 border-[#4A6444] bg-[#F5E5B1]/95 backdrop-blur-sm"
          : "bg-transparent"
      }`}
    >
      <Container as="div" className="flex items-center justify-between py-4">
        <a href="#" className="flex items-center gap-2">
          <div className="h-7 w-7 border-2 border-[#4A6444] bg-[#4A6444]" />
          <span className="font-sonko-black text-lg tracking-tight text-[#4A6444]">
            YourTrust
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-sonko-medium text-xs uppercase tracking-[0.15em] text-[#4A6444] transition-colors hover:text-[#3A5235]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/auth/signin">
            <BrutalistButton variant="ghost" size="sm">
              Sign In
            </BrutalistButton>
          </Link>
          <Link href="/auth/signup">
            <BrutalistButton size="sm">Get Started</BrutalistButton>
          </Link>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center md:hidden"
        >
          {isOpen ? (
            <X className="h-6 w-6 text-[#4A6444]" />
          ) : (
            <Menu className="h-6 w-6 text-[#4A6444]" />
          )}
        </button>
      </Container>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t-2 border-[#4A6444] bg-[#F5E5B1] md:hidden"
          >
            <Container as="div" className="flex flex-col gap-4 py-6">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="font-sonko-medium text-sm uppercase tracking-wider text-[#4A6444]"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex gap-3 pt-4 border-t border-[#4A6444]/20">
                <Link href="/auth/signin" onClick={() => setIsOpen(false)}>
                  <BrutalistButton variant="ghost" size="sm">
                    Sign In
                  </BrutalistButton>
                </Link>
                <Link href="/auth/signup" onClick={() => setIsOpen(false)}>
                  <BrutalistButton size="sm">Get Started</BrutalistButton>
                </Link>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
