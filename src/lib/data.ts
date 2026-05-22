export const siteConfig = {
  name: "YourTrust",
  tagline: "Trust & Transparency in Informal Finance",
  description:
    "YourTrust transforms informal lending between friends and family into a secure, trackable experience. No lawyers. No courts. Just transparency.",
  url: "https://yourtrust.app",
};

export const statsData = [
  { value: "10K+", label: "Active Users", suffix: "" },
  { value: "₹2M+", label: "Amount Managed", suffix: "" },
  { value: "99%", label: "Trust Rate", suffix: "" },
];

export const featuresData = [
  {
    title: "AI Mediation",
    description:
      "Privacy-preserving AI negotiation chat and voice calling that mediates repayment discussions without straining relationships. Powered by NEAR AI Cloud TEE.",
    icon: "bot",
    details: [
      "AI-powered negotiation chat",
      "Smart voice calling via VAPI",
      "Privacy-preserving TEE technology",
    ],
  },
  {
    title: "Trust Scores",
    description:
      "Data-driven trust analysis using credit history, payment behavior, and witness involvement. Build your reputation with every on-time repayment.",
    icon: "shield",
    details: [
      "Dynamic trust score algorithm",
      "Buffer days & grace periods",
      "Color-coded trust gauge (0-100)",
    ],
  },
  {
    title: "Digital Agreements",
    description:
      "Create legally-informed digital lending agreements with full lifecycle tracking. Support for both money and asset lending with group contributions.",
    icon: "fileText",
    details: [
      "Money & asset lending support",
      "Witness verification system",
      "Group lending (many-to-one)",
    ],
  },
];

export const howItWorksData = [
  {
    step: 1,
    title: "Create a Digital Agreement",
    subtitle: "Set Terms in Minutes",
    description:
      "Choose between money or asset lending. Add borrower details, amount, due date, and optional witness. Our 4-step wizard guides you through the entire process.",
    details: [
      "Borrower details & verification",
      "Buffer days (0-14, private to lender)",
      "Optional witness for verification",
      "Transaction proof upload with auto-ID",
    ],
  },
  {
    step: 2,
    title: "AI Analyzes & Mediates",
    subtitle: "Smart Risk Assessment",
    description:
      "Our AI analyzes both parties' credit history, payment behavior, and trust scores. NEAR AI Cloud generates risk analysis and mediation strategies in real-time.",
    details: [
      "NEAR AI trust score analysis",
      "Installment plan generation (3 options)",
      "AI negotiation chat with smart fallbacks",
      "Location-aware voice calling",
    ],
  },
  {
    step: 3,
    title: "Repay with Confidence",
    subtitle: "Transparent Tracking",
    description:
      "Borrowers get flexible repayment options, installment plans, and proof management. Lenders get full visibility with timeline tracking and notifications.",
    details: [
      "Installment plan with proof uploads",
      "Real-time timeline & status tracking",
      "Push & email notifications",
      "Trust score impact & history",
    ],
  },
];

export const testimonialsData = [
  {
    name: "Alice Sharma",
    role: "Borrower",
    quote:
      "I borrowed ₹10,000 from my college friends group for an emergency. YourTrust made it painless — the AI installment plan helped me repay in 3 months without any awkward conversations.",
    initials: "AS",
  },
  {
    name: "Bob Patel",
    role: "Lender",
    quote:
      "I've lent money to friends before and it always got messy. With YourTrust, I could see the trust score, set buffer days, and the AI handled reminders. My ₹3,000 contribution came back on time.",
    initials: "BP",
  },
  {
    name: "Charlie Singh",
    role: "Group Contributor",
    quote:
      "Being part of a group lend was seamless. I contributed ₹4,000 through the platform, and the individual agreement was created automatically. No paperwork, no stress.",
    initials: "CS",
  },
  {
    name: "David Kumar",
    role: "Witness",
    quote:
      "I was added as a witness to a lending agreement between two friends. The process was simple — I reviewed and approved digitally. It adds real accountability to informal loans.",
    initials: "DK",
  },
  {
    name: "Priya Mehta",
    role: "Borrower",
    quote:
      "The AI negotiation chat saved me. When I needed an extension, I just asked in the chat and got 5 extra buffer days automatically. The system actually understands real-life situations.",
    initials: "PM",
  },
];

export const whyTrustData = {
  title: "How Trust Scores Work",
  description:
    "YourTrust uses a sophisticated algorithm to calculate trust scores based on repayment history, agreement volume, and behavioral data.",
  gaugeStops: [
    { value: 0, label: "0", color: "#dc2626" },
    { value: 40, label: "40", color: "#ea580c" },
    { value: 60, label: "60", color: "#ca8a04" },
    { value: 80, label: "80", color: "#4A6444" },
    { value: 100, label: "100", color: "#3A5235" },
  ],
  mechanics: [
    {
      title: "Initial Score",
      description: "Every user starts with a trust score of 70. New borrowers with 0 agreements are classified as medium risk.",
      icon: "gauge",
    },
    {
      title: "Payment Impact",
      description: "On-time payments increase your score. Late payments deduct points based on days overdue and strict mode settings.",
      icon: "trendingUp",
    },
    {
      title: "Buffer Days",
      description: "Lenders can set 0-14 private buffer days. Borrowers only see the original due date — grace period is confidential.",
      icon: "calendar",
    },
    {
      title: "Witness Boost",
      description: "Agreements with witness verification earn higher credibility. AI analysis considers witness involvement as a trust factor.",
      icon: "users",
    },
  ],
};

export const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "About", href: "#about" },
];

export const footerData = {
  product: [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Trust Scores", href: "#trust" },
    { label: "FAQ", href: "#" },
  ],
  resources: [
    { label: "Documentation", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Community", href: "#" },
    { label: "Support", href: "#" },
  ],
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
  social: [
    { label: "Twitter", href: "#" },
    { label: "GitHub", href: "#" },
    { label: "LinkedIn", href: "#" },
  ],
};
