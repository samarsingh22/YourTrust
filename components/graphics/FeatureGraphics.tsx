"use client";

export default function FeatureGraphics() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden select-none">
      {/* AI Chat / Mediation */}
      <svg
        className="absolute left-[3%] top-[8%] h-20 w-20 text-[#4A6444]/8"
        viewBox="0 0 80 80"
        fill="none"
      >
        <rect x="4" y="8" width="72" height="48" stroke="currentColor" strokeWidth="2" />
        <line x1="20" y1="24" x2="60" y2="24" stroke="currentColor" strokeWidth="2" />
        <line x1="20" y1="36" x2="50" y2="36" stroke="currentColor" strokeWidth="2" />
        <line x1="20" y1="48" x2="34" y2="48" stroke="currentColor" strokeWidth="2" />
        <polygon points="34,56 24,72 44,56" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>

      {/* Shield / Trust Score */}
      <svg
        className="absolute right-[4%] top-[12%] h-28 w-24 text-[#4A6444]/8"
        viewBox="0 0 96 112"
        fill="none"
      >
        <path d="M48 4 L6 22 L6 50 Q6 78 48 108 Q90 78 90 50 L90 22 L48 4Z" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M34 56 L44 66 L62 44" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
      </svg>

      {/* Document / Agreement */}
      <svg
        className="absolute left-[5%] bottom-[10%] h-24 w-20 text-[#4A6444]/8"
        viewBox="0 0 64 80"
        fill="none"
      >
        <rect x="4" y="4" width="56" height="72" stroke="currentColor" strokeWidth="2" fill="none" />
        <line x1="18" y1="24" x2="46" y2="24" stroke="currentColor" strokeWidth="2" />
        <line x1="18" y1="36" x2="46" y2="36" stroke="currentColor" strokeWidth="2" />
        <line x1="18" y1="48" x2="36" y2="48" stroke="currentColor" strokeWidth="2" />
        <rect x="38" y="52" width="16" height="16" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <line x1="42" y1="60" x2="50" y2="60" stroke="currentColor" strokeWidth="1.5" />
      </svg>

      {/* Bar Chart / Analytics */}
      <svg
        className="absolute right-[6%] bottom-[12%] h-20 w-24 text-[#4A6444]/8"
        viewBox="0 0 96 80"
        fill="none"
      >
        <rect x="8" y="48" width="14" height="24" stroke="currentColor" strokeWidth="2" fill="none" />
        <rect x="28" y="30" width="14" height="42" stroke="currentColor" strokeWidth="2" fill="none" />
        <rect x="48" y="20" width="14" height="52" stroke="currentColor" strokeWidth="2" fill="none" />
        <rect x="68" y="8" width="14" height="64" stroke="currentColor" strokeWidth="2" fill="none" />
        <line x1="4" y1="76" x2="92" y2="76" stroke="currentColor" strokeWidth="2" />
      </svg>

      {/* Network Nodes / Group Lending */}
      <svg
        className="absolute left-[55%] top-[3%] h-32 w-32 text-[#4A6444]/7"
        viewBox="0 0 128 128"
        fill="none"
      >
        <circle cx="64" cy="20" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="20" cy="64" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="108" cy="64" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="64" cy="108" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
        <line x1="64" y1="30" x2="28" y2="56" stroke="currentColor" strokeWidth="1.5" />
        <line x1="64" y1="30" x2="100" y2="56" stroke="currentColor" strokeWidth="1.5" />
        <line x1="28" y1="72" x2="56" y2="100" stroke="currentColor" strokeWidth="1.5" />
        <line x1="100" y1="72" x2="72" y2="100" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="64" cy="64" r="5" fill="currentColor" />
      </svg>

      {/* Coin / Currency */}
      <svg
        className="absolute right-[30%] top-[55%] h-16 w-16 text-[#4A6444]/8"
        viewBox="0 0 64 64"
        fill="none"
      >
        <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="32" cy="32" r="18" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <line x1="32" y1="16" x2="32" y2="48" stroke="currentColor" strokeWidth="2" />
        <line x1="20" y1="26" x2="44" y2="26" stroke="currentColor" strokeWidth="2" />
        <line x1="18" y1="38" x2="46" y2="38" stroke="currentColor" strokeWidth="2" />
      </svg>

      {/* Calendar / Due Dates */}
      <svg
        className="absolute left-[30%] bottom-[5%] h-20 w-20 text-[#4A6444]/7"
        viewBox="0 0 72 72"
        fill="none"
      >
        <rect x="6" y="14" width="60" height="52" stroke="currentColor" strokeWidth="2" fill="none" />
        <line x1="6" y1="32" x2="66" y2="32" stroke="currentColor" strokeWidth="2" />
        <line x1="24" y1="6" x2="24" y2="18" stroke="currentColor" strokeWidth="2" />
        <line x1="48" y1="6" x2="48" y2="18" stroke="currentColor" strokeWidth="2" />
        <rect x="16" y="40" width="10" height="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <rect x="32" y="40" width="10" height="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <rect x="48" y="40" width="10" height="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <rect x="16" y="54" width="10" height="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <rect x="32" y="54" width="10" height="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>

      {/* Handshake / Trust */}
      <svg
        className="absolute left-[40%] top-[55%] h-16 w-20 text-[#4A6444]/7"
        viewBox="0 0 80 64"
        fill="none"
      >
        <path d="M8 36 Q8 22 22 18" stroke="currentColor" strokeWidth="2.5" fill="none" />
        <path d="M72 36 Q72 22 58 18" stroke="currentColor" strokeWidth="2.5" fill="none" />
        <path d="M22 18 Q36 10 40 22 Q44 10 58 18" stroke="currentColor" strokeWidth="2" fill="none" />
        <line x1="40" y1="22" x2="40" y2="50" stroke="currentColor" strokeWidth="2" />
        <rect x="22" y="36" width="36" height="16" stroke="currentColor" strokeWidth="2" fill="none" />
        <line x1="8" y1="52" x2="72" y2="52" stroke="currentColor" strokeWidth="2" />
      </svg>

      {/* Checkmark / Verified */}
      <svg
        className="absolute right-[50%] top-[70%] h-12 w-12 text-[#4A6444]/8"
        viewBox="0 0 48 48"
        fill="none"
      >
        <rect x="2" y="2" width="44" height="44" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M14 24 L22 32 L34 18" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
