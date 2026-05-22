"use client";

export default function DashboardMockup() {
  return (
    <div className="w-full max-w-md border-2 border-[#4A6444] bg-[#F0DFA8] p-6 shadow-[8px_8px_0px_#3A5235]">
      <div className="mb-4 flex items-center justify-between border-b-2 border-[#4A6444]/30 pb-3">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-none bg-[#4A6444]" />
          <span className="font-sonko-bold text-xs uppercase tracking-widest text-[#4A6444]">
            Agreement #1248
          </span>
        </div>
        <span className="rounded-none border border-[#4A6444] px-2 py-0.5 font-sonko-medium text-[10px] uppercase tracking-wider text-[#4A6444]">
          Active
        </span>
      </div>

      <div className="mb-4 space-y-2">
        <Row label="Borrower" value="Alice Sharma" />
        <Row label="Amount" value="₹10,000" />
        <Row label="Due Date" value="Jun 15, 2026" />
        <Row label="Purpose" value="Emergency medical" />
      </div>

      <div className="mb-4 border-t-2 border-[#4A6444]/30 pt-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-sonko-bold text-xs uppercase tracking-widest text-[#4A6444]">
            Trust Score
          </span>
          <span className="font-sonko-black text-sm text-[#4A6444]">72</span>
        </div>
        <div className="h-2 border border-[#4A6444] bg-[#F5E5B1]">
          <div
            className="h-full bg-[#4A6444] transition-all"
            style={{ width: "72%" }}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex-1 border-2 border-[#4A6444] bg-[#4A6444] px-3 py-2 text-center font-sonko-bold text-[10px] uppercase tracking-wider text-[#F5E5B1]">
          AI Analyze
        </div>
        <div className="flex-1 border-2 border-[#4A6444] px-3 py-2 text-center font-sonko-bold text-[10px] uppercase tracking-wider text-[#4A6444]">
          Pay Now
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-sonko-medium text-[11px] uppercase tracking-wider text-[#6B7F5A]">
        {label}
      </span>
      <span className="font-sonko-bold text-xs text-[#4A6444]">{value}</span>
    </div>
  );
}
