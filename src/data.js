// ============================================================
//  EDIT THIS FILE to change any content on the site.
//  Add / remove items in any array — the UI updates itself.
// ============================================================

export const profile = {
  name: "John Andrei Martinez",
  role: "AI/ML Engineer",
  tagline:
    "Computer Science student building AI/ML systems end-to-end — from local AI agents and RAG to forecasting and computer vision — and shipping them to production.",
  location: "San Jose del Monte, Bulacan",
  email: "martinezjandrei8425@gmail.com",
  links: [
    { label: "GitHub", url: "https://github.com/Zeref538" },
    { label: "LinkedIn", url: "https://linkedin.com/in/john-andrei-martinez-499a0b343" },
  ],
  about: [
    "I'm a Computer Science student at Our Lady of Fatima University working across AI/ML — and I care about shipping complete systems, not just training models in a notebook.",
    "My work spans agentic AI, RAG, forecasting, computer vision, and full-stack products: a fully local data-cleaning agent where the LLM never sees a raw row, an AI contract-screening system, a Philippine air-quality forecaster, an AI resort concierge with live Stripe booking, and the chatbot you're talking to right now. I own the whole pipeline — data, modeling, evaluation, and deployment.",
    "I'm looking for internship and entry-level roles in AI / ML Engineering or Data Analytics, where I can ship real systems, take on hard problems, and keep leveling up fast.",
  ],
};

export const experience = [
  {
    role: "ML Engineering Intern",
    company: "FlyRank AI",
    period: "Jun 2026 — Present",
    location: "Remote",
    bullets: [
      // TODO: replace these placeholder bullets with your real work at FlyRank
      "Contribute to real-world AI/ML projects in a remote, async environment with portfolio-driven deliverables.",
      "Support model development workflows — data preparation, training experiments, and evaluation.",
      "Collaborate on ML pipelines powering FlyRank's organic-growth automation platform.",
    ],
  },
  {
    role: "Freelance Virtual Assistant",
    company: "Self-employed",
    period: "2025 — 2026",
    location: "Remote",
    bullets: [
      "Sourced and screened candidates via Indeed, streamlining HR recruitment workflows and reducing time-to-hire.",
      "Managed data encoding and digital filing, improving record accuracy and retrieval speed.",
      "Produced graphics and short-form video content, maintaining consistent brand identity across platforms.",
    ],
  },
];

export const projects = [
  {
    title: "YODA — Your Offline Data Agent",
    description:
      "Privacy-first, fully local data-cleaning agent for CSV / Excel / SQLite — the LLM never sees a single raw row and nothing leaves the machine. A pandas profiler produces a PII-redacted metadata profile; a local LLM (Ollama, qwen3.5:4b) plans repairs as strict JSON; a human approves each step; deterministic pandas executes with a full audit log; a verifier re-profiles to confirm. Benchmarked against 1,589 ground-truth labeled errors with a published false-fix rate, plus a 39-instruction plain-language benchmark and a local 'Mission Control' web UI.",
    tags: ["Agentic AI", "Ollama", "Python", "pandas", "FastAPI"],
    metric: "96.4% fix · 0.00% false-fix",
    category: "Agentic AI · Privacy",
    date: "2026",
    image: "/projects/yoda-1.jpg",
    images: [
      "/projects/yoda-1.jpg",
      "/projects/yoda-2.jpg",
      "/projects/yoda-3.jpg",
      "/projects/yoda-4.jpg",
      "/projects/yoda-5.jpg",
      "/projects/yoda-6.jpg",
      "/projects/yoda-7.jpg",
    ],
    link: "https://github.com/Zeref538/yoda",
    demo: "https://zeref538.github.io/yoda/demo/",
    highlights: [
      "AI plans, pandas executes: the LLM sees only a PII-redacted profile — a unit test proves no raw value reaches a prompt",
      "Ground-truth benchmark: 99.1% detection / 96.4% fix / 0.00% false-fix across 1,589 labeled errors (vs rule-based baseline)",
      "Human-in-the-loop gate, JSONL audit log, recipes, data contracts, and a WebAssembly browser demo — runs with Wi-Fi off",
    ],
  },
  {
    title: "Aegix AI — Contract Compliance Screening",
    description:
      "RAG system that screens Philippine employment contracts against the Labor Code, grading every clause Compliant / Non-compliant / Vague / Missing with a statutory citation and plain-English reason. Contracts are segmented and judged by two LangChain LCEL chains with structured output, over a MongoDB Atlas vector-search knowledge base of curated statute rules. Verdicts stream live via Server-Sent Events as parallel workers finish.",
    tags: ["RAG", "LangChain", "Azure OpenAI", "Vector Search", "FastAPI"],
    metric: "84.5% verdict accuracy",
    category: "AI · RAG · Full-Stack",
    date: "2026",
    image: "/projects/aegix-1.jpg",
    images: ["/projects/aegix-1.jpg", "/projects/aegix-2.jpg", "/projects/aegix-3.jpg"],
    link: "https://github.com/Zeref538/aegix-ai",
    demo: "https://aegix-ai-zeref.vercel.app",
    highlights: [
      "RAG pipeline: LangChain LCEL + structured output over MongoDB Atlas $vectorSearch",
      "Live SSE streaming — parallel clause workers cut a 9-clause run ~128s → ~62s",
      "Evaluated on 18 labeled contracts: 100% recall, 94.8% citation accuracy",
    ],
  },
  {
    title: "Hangin' — PH Air-Quality Forecasting Dashboard",
    description:
      "Forecasts PM2.5 for Philippine cities 1–24 hours ahead and translates it into plain-language health advice — unlike existing PH trackers that only show the current reading. One pooled scikit-learn model (HistGradientBoosting) across 5 metros, trained on ~1.9 years of free Open-Meteo air-quality + weather history, backtested honestly against a naive persistence baseline. A scheduled job re-fetches data and republishes live forecasts to an interactive React dashboard with a heatmap, AQI health gauge, and a model-performance panel.",
    tags: ["scikit-learn", "Time-Series", "Forecasting", "Python", "Open-Meteo", "React"],
    metric: "+15–23% MAE vs. naive",
    category: "ML · Forecasting · Dashboard",
    date: "2026",
    image: "/projects/hangin-1.jpg",
    images: ["/projects/hangin-1.jpg", "/projects/hangin-2.jpg", "/projects/hangin-3.jpg"],
    link: "https://github.com/Zeref538/hangin",
    demo: "https://hangin-zeref.vercel.app",
    highlights: [
      "Pooled HistGradientBoosting over 5 metros, ~1.9 yrs of free Open-Meteo data",
      "Honest backtest: beats naive persistence by +15–23% MAE at the 6–24h horizons",
      "Hourly GitHub Actions refresh republishes live 1/6/12/24h forecasts + EPA-AQI health advice",
    ],
  },
  {
    title: "ACRA — Adaptive Color Re-Encoding Algorithm",
    description:
      "CNN-powered system that detects color-critical regions in public signage and re-encodes them for color vision deficiency without altering original design. Trained YOLOv8m on a custom 5-class dataset (33,774 annotated boxes) reaching 0.740 mAP50, and built the core re-encoding algorithm: CLAHE → CIELAB → Fuzzy C-Means → CIEDE2000 conflict detection → constrained optimization. Deployed via FastAPI + ONNX with Supabase (RLS, 24h auto-delete).",
    tags: ["YOLOv8", "Computer Vision", "ONNX", "FastAPI", "Supabase", "React"],
    metric: "0.740 mAP50",
    category: "Computer Vision · Thesis",
    date: "2025 — 2026",
    image: "/projects/acra.jpg",
    images: ["/projects/acra.jpg", "/projects/acra-2.jpg", "/projects/acra-3.jpg"],
    link: "https://github.com/Zeref538/ACRA",
    demo: "https://acra-sandy.vercel.app/dashboard",
    highlights: [
      "Trained YOLOv8m on 33,774 custom-annotated boxes → 0.740 mAP50",
      "Built the re-encoding core: CLAHE → CIELAB → Fuzzy C-Means → CIEDE2000",
      "Deployed FastAPI + ONNX inference with Supabase RLS & 24h auto-delete",
    ],
  },
  {
    title: "Solmara Resort & Villas — AI-Concierge Booking Platform",
    description:
      "A modern-luxury resort platform with Selene, a RAG concierge grounded in a curated knowledge base (rooms, rates, events, policies) via Azure OpenAI embeddings + chat, with an offline extractive fallback. Full booking flow with live availability, conflict detection (no double-booking), 15-minute payment holds, and Stripe Checkout (PHP). The concierge answers live availability questions straight from the booking system and doubles as a time-blocked itinerary planner.",
    tags: ["RAG", "Azure OpenAI", "Stripe", "React", "Node.js"],
    metric: "AI concierge + live booking",
    category: "Full-Stack · AI Concierge",
    date: "2026",
    image: "/projects/solmara-1.jpg",
    images: ["/projects/solmara-1.jpg", "/projects/solmara-2.jpg", "/projects/solmara-3.jpg"],
    link: "https://github.com/Zeref538/Solmara-Resort",
    demo: "https://solmara-resort-zeref.vercel.app",
    highlights: [
      "Selene RAG concierge: Azure OpenAI embeddings + chat over a curated KB, offline fallback",
      "Booking engine: live availability, conflict detection, 15-min payment holds, confirmation codes",
      "Stripe Checkout (PHP) with redirect verification + webhook; concierge answers live availability",
    ],
  },
  {
    title: "Portfolio — ML Terminal Website",
    description:
      "This site. A React + Vite portfolio with an 'ML terminal' personality — boot log, CRT scanlines, tmux-style status bar — plus zeref-bot: a RAG chatbot (Azure OpenAI gpt-5-mini) that embeds each question and retrieves over a vector index of the whole site — projects, READMEs, and a recruiter FAQ — through a rate-limited Vercel serverless function.",
    tags: ["RAG", "Azure OpenAI", "React", "Vite", "Vercel"],
    metric: "RAG chatbot",
    category: "Web · AI",
    date: "2026",
    image: "/projects/portfolio.jpg",
    images: ["/projects/portfolio.jpg"],
    link: "https://github.com/Zeref538/portfolio",
    demo: "https://johnandrei.vercel.app",
    highlights: [
      "zeref-bot: RAG over an embedded index of the site (cosine retrieval, top-6 chunks), per-IP rate limited",
      "Terminal identity: boot log, CRT scanlines, session status bar",
      "Perf-tuned animations: rAF-throttled scroll effects, vendor chunk splitting",
    ],
  },
  {
    title: "CafèSync — Smart Coffee Shop Operations",
    description:
      "Centralized coffee shop management for orders, inventory, and sales analytics. Node.js backend synced live via Firebase Firestore (zero-refresh multi-screen updates), PayMongo payments, and a Python AI insights layer generating operational alerts — ingredient reorder triggers and staffing recommendations from order-volume forecasting.",
    tags: ["Forecasting", "Python", "Firebase", "Node.js", "PayMongo"],
    metric: "Live multi-screen sync",
    category: "Full-Stack Platform",
    date: "2025",
    image: "/projects/cafesync.jpg",
    images: ["/projects/cafesync.jpg", "/projects/cafesync-2.jpg", "/projects/cafesync-3.jpg"],
    link: "https://github.com/Zeref538/CafeSync",
    demo: "https://cafesync-3b25a.web.app/station/management",
    highlights: [
      "Zero-refresh multi-screen sync with Firestore realtime listeners",
      "Python AI insights: ingredient reorder triggers & staffing forecasts",
      "PayMongo payment integration with live sales analytics",
    ],
  },
  {
    title: "CLICKSILOG — Self-Ordering & Kitchen Display",
    description:
      "Self-ordering and kitchen display system replacing manual order-taking. Built the order-routing logic linking customer orders to a real-time Kitchen Display System, integrated PayMongo for online payments, and automated inventory deduction on each order — keeping ordering, kitchen, and stock fully in sync.",
    tags: ["JavaScript", "Node.js", "Express", "REST APIs", "React"],
    metric: "End-to-end order sync",
    category: "Web App",
    date: "2025",
    image: "/projects/clicksilog/menu.jpg",
    images: [
      "/projects/clicksilog/menu.jpg",
      "/projects/clicksilog/kds-2.jpg",
      "/projects/clicksilog/kds-3.jpg",
    ],
    link: "https://github.com/Zeref538/ClickSilog",
    demo: "",
    highlights: [
      "Order routing from customer screen to real-time Kitchen Display",
      "Automated inventory deduction on every confirmed order",
      "Role-based flows: Customer, Kitchen, Cashier, Admin",
    ],
  },
  {
    title: "Smart Scheduling System",
    description:
      "Desktop class-scheduling platform in Java that auto-generates a conflict-free weekly timetable from courses, professors, rooms, and sections. A constraint-driven engine searches candidate day/time/room combinations and validates each against professor double-booking, room clashes, load balancing, and room optimization — with a live generation log and one-click CSV export.",
    tags: ["Algorithms", "Java 21", "MySQL", "Swing", "JDBC"],
    metric: "Conflict-free in seconds",
    category: "Desktop App · Algorithms",
    date: "2025",
    image: "/projects/scheduler-1.jpg",
    images: ["/projects/scheduler-1.jpg", "/projects/scheduler-2.jpg", "/projects/scheduler-3.jpg"],
    link: "https://github.com/Zeref538/smart-scheduling-system",
    demo: "",
    highlights: [
      "Constraint engine: avoids professor, room & time-slot conflicts",
      "Configurable strategies — load balancing, room optimization, lunch breaks",
      "Interface-driven backend, SHA-256 auth, full CRUD over MySQL/JDBC",
    ],
  },
];

export const skills = [
  {
    group: "AI / Machine Learning",
    items: [
      "Python",
      "PyTorch",
      "TensorFlow",
      "scikit-learn",
      "LangChain",
      "RAG",
      "Agentic AI",
      "Ollama",
      "CNNs",
      "Hugging Face",
      "Kaggle",
    ],
  },
  {
    group: "Data",
    items: ["SQL", "PostgreSQL", "MongoDB", "Tableau", "Power BI"],
  },
  {
    group: "Engineering",
    items: [
      "JavaScript",
      "TypeScript",
      "React",
      "Node.js",
      "FastAPI",
      "Docker",
      "Stripe",
      "Firebase",
      "Supabase",
    ],
  },
  {
    group: "Cloud & Tools",
    items: ["Azure", "Google Cloud", "Vercel", "Render", "Git", "GitHub", "Figma"],
  },
];

// url: public verify link (enables the "Verify Badge" button)
// image: badge artwork — save the PNG in public/certs/ with the filename below
export const certifications = [
  {
    name: "Google AI Professional Certificate",
    issuer: "Google",
    year: "2026",
    url: "https://www.coursera.org/account/accomplishments/specialization/OVWHUIPY22YS",
    image: "/certs/google-ai-pro.jpeg",
  },
  {
    name: "Google Advanced Data Analytics Professional Certificate",
    issuer: "Google",
    year: "2026",
    url: "https://www.coursera.org/account/accomplishments/specialization/PW3PERYUBRH0",
    image: "/certs/advanced-data-analytics.jpeg",
  },
  {
    name: "Google Advanced Data Analytics Capstone",
    issuer: "Google",
    year: "2026",
    url: "https://www.coursera.org/account/accomplishments/verify/U7SVUTS082OA",
    image: "/certs/capstone-data-analytics.jpeg",
  },
  {
    name: "AWS AI Practitioner",
    issuer: "AWS",
    year: "2026",
    url: "https://www.udacity.com/certificate/e/4e7cbba8-2c4d-11f1-a1ae-434577b9e921",
    image: "/certs/aws-ai.png",
  },
  {
    name: "Cisco Certified Support Technician — Cybersecurity",
    issuer: "Cisco",
    year: "2026",
    url: "https://www.credly.com/badges/42e85a15-aaac-4481-8f59-9ee5e679ef00/linked_in_profile",
    image: "/certs/ccst-cybersecurity.png",
  },
  {
    name: "Oracle Cloud Infrastructure Certified AI Foundations Associate",
    issuer: "Oracle",
    year: "2025",
    url: "https://catalog-education.oracle.com/ords/certview/sharebadge?id=016F034CEE51B778CA019B17844681C3281C47DC3872217B0B5C4FCC1017255F",
    image: "/certs/oci-ai-foundations.png",
  },
  {
    name: "Google Data Analytics Professional Certificate",
    issuer: "Google",
    year: "2025",
    url: "https://www.coursera.org/account/accomplishments/specialization/2HF46JKGRGU9",
    image: "/certs/data-analytics.jpeg",
  },
  {
    name: "Google Cybersecurity Professional Certificate",
    issuer: "Google",
    year: "2025",
    url: "https://www.coursera.org/account/accomplishments/professional-cert/certificate/Z09O6H72G4CX",
    image: "/certs/cybersecurity.jpg",
  },
  {
    name: "Building RAG Apps Using MongoDB",
    issuer: "MongoDB",
    year: "2026",
    url: "https://www.credly.com/badges/9c5941b9-a0c2-4736-926b-1a83aba0d210/public_url",
    image: "/certs/rag-mongodb.jpg",
  },
];

export const education = [
  {
    school: "Our Lady of Fatima University",
    degree: "BS Computer Science",
    period: "2023 — 2027",
    location: "",
    highlights: [
      "Dean's Lister 2023–2026",
      "Technical Member — English Society",
      "Member — Junior Philippines Computer Studies Directorate",
      "2nd Place — Python Programming Competition",
      "3rd Place — Database Designing Competition",
      "3rd Place — C Programming Competition",
    ],
  },
];
