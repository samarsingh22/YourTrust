"use client";

import Container from "@/components/brutalist/Container";
import { footerData, siteConfig } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="border-t-2 border-[#4A6444] bg-[#4A6444] py-16 md:py-20">
      <Container>
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <a href="#" className="flex items-center gap-2">
              <img src="/logo.png" alt="YourTrust" className="h-10 w-10 object-contain" />
              <span className="font-sonko-black text-base tracking-tight text-[#F5E5B1]">
                YourTrust
              </span>
            </a>
            <p className="mt-4 font-sonko-light text-xs leading-relaxed text-[#F5E5B1]/60">
              Transforming informal lending between friends and family into a
              secure, trackable experience.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-sonko-bold text-[10px] uppercase tracking-[0.2em] text-[#F5E5B1]/50">
              Product
            </h4>
            <ul className="space-y-2.5">
              {footerData.product.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="font-sonko-medium text-xs tracking-wider text-[#F5E5B1]/70 transition-colors hover:text-[#F5E5B1]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-sonko-bold text-[10px] uppercase tracking-[0.2em] text-[#F5E5B1]/50">
              Resources
            </h4>
            <ul className="space-y-2.5">
              {footerData.resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="font-sonko-medium text-xs tracking-wider text-[#F5E5B1]/70 transition-colors hover:text-[#F5E5B1]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-sonko-bold text-[10px] uppercase tracking-[0.2em] text-[#F5E5B1]/50">
              Connect
            </h4>
            <ul className="space-y-2.5">
              {footerData.social.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="font-sonko-medium text-xs tracking-wider text-[#F5E5B1]/70 transition-colors hover:text-[#F5E5B1]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#F5E5B1]/20 pt-8 md:flex-row">
          <p className="font-sonko-light text-[10px] uppercase tracking-[0.15em] text-[#F5E5B1]/40">
            &copy; {new Date().getFullYear()} {siteConfig.name}. Building trust,
            one agreement at a time.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="font-sonko-medium text-[10px] uppercase tracking-[0.15em] text-[#F5E5B1]/40 transition-colors hover:text-[#F5E5B1]/70"
            >
              Privacy
            </a>
            <a
              href="#"
              className="font-sonko-medium text-[10px] uppercase tracking-[0.15em] text-[#F5E5B1]/40 transition-colors hover:text-[#F5E5B1]/70"
            >
              Terms
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
