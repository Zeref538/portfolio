// ============================================================
//  EDIT THIS FILE to change any content on the site.
//  Add / remove items in any array — the UI updates itself.
// ============================================================

export const profile = {
  name: "John Andrei Martinez",
  role: "AI/ML Engineer",
  tagline:
    "Computer Science undergraduate focused on computer vision and accessibility-driven ML — building full pipelines from dataset annotation to deployed models.",
  location: "Bulacan, Philippines",
  email: "martinezjandrei8425@gmail.com",
  links: [
    { label: "GitHub", url: "https://github.com/Zeref538" },
    { label: "LinkedIn", url: "https://linkedin.com/in/john-andrei-martinez-499a0b343" },
  ],
  about: [
    "I'm a Computer Science undergraduate at Our Lady of Fatima University focused on AI/ML — and I like shipping complete systems, not just models.",
    "My recent work spans computer vision, data analytics, and full-stack products: a YOLOv8-powered color-accessibility tool, a smart coffee-shop platform with AI demand insights, a self-ordering kitchen display system, and the Azure OpenAI chatbot living on this very page. I handle the whole pipeline — data, training, evaluation, deployment.",
    "I'm actively seeking internship and entry-level opportunities in Machine Learning / AI Engineering where I can apply real-world model development experience to meaningful, impact-driven problems — especially in accessibility and civic tech.",
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
    title: "ACRA — Adaptive Color Re-Encoding Algorithm",
    description:
      "CNN-powered system that detects color-critical regions in public signage and re-encodes them for color vision deficiency without altering original design. Trained YOLOv8m on a custom 5-class dataset (33,774 annotated boxes) reaching 0.740 mAP50, and built the core re-encoding algorithm: CLAHE → CIELAB → Fuzzy C-Means → CIEDE2000 conflict detection → constrained optimization. Deployed via FastAPI + ONNX with Supabase (RLS, 24h auto-delete).",
    tags: ["YOLOv8", "Computer Vision", "FastAPI", "ONNX", "Supabase", "React"],
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
    title: "Smart Scheduling System",
    description:
      "Desktop class-scheduling platform in Java that auto-generates a conflict-free weekly timetable from courses, professors, rooms, and sections. A constraint-driven engine searches candidate day/time/room combinations and validates each against professor double-booking, room clashes, load balancing, and room optimization — with a live generation log and one-click CSV export.",
    tags: ["Java 21", "Swing", "MySQL", "JDBC", "Algorithms"],
    metric: "Conflict-free in seconds",
    category: "Desktop App · Algorithms",
    date: "2026",
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
  {
    title: "CafèSync — Smart Coffee Shop Operations",
    description:
      "Centralized coffee shop management for orders, inventory, and sales analytics. Node.js backend synced live via Firebase Firestore (zero-refresh multi-screen updates), PayMongo payments, and a Python AI insights layer generating operational alerts — ingredient reorder triggers and staffing recommendations from order-volume forecasting.",
    tags: ["Node.js", "Firebase", "Python", "Forecasting", "PayMongo"],
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
    title: "Portfolio — ML Terminal Website",
    description:
      "This site. A React + Vite portfolio with an 'ML terminal' personality — boot log, CRT scanlines, tmux-style status bar — plus zeref-bot: a grounded Azure OpenAI (gpt-5-mini) chatbot served through a rate-limited Vercel serverless function that answers recruiter questions about me from live site data.",
    tags: ["React", "Vite", "Azure OpenAI", "Vercel", "GSAP"],
    metric: "Azure OpenAI chatbot",
    category: "Web · AI",
    date: "2026",
    image: "/projects/portfolio.jpg",
    images: ["/projects/portfolio.jpg"],
    link: "https://github.com/Zeref538/portfolio",
    demo: "https://johnandrei.vercel.app",
    highlights: [
      "zeref-bot: Azure OpenAI behind a Vercel serverless function with per-IP rate limiting",
      "Terminal identity: boot log, CRT scanlines, session status bar",
      "Perf-tuned animations: rAF-throttled scroll effects, vendor chunk splitting",
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
      "Firebase",
      "Supabase",
    ],
  },
  {
    group: "Cloud & Tools",
    items: ["Azure", "Vercel", "Git", "GitHub", "Figma"],
  },
];

// url: public verify link (enables the "Verify Badge" button)
// image: badge artwork — save the PNG in public/certs/ with the filename below
export const certifications = [
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
    image: "/certs/google-ai.jpeg",
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
    name: "Google Project Management Professional Certificate",
    issuer: "Google",
    year: "2026",
    url: "https://www.coursera.org/account/accomplishments/specialization/OVWHUIPY22YS",
    image: "", // no badge image yet — drop one in public/certs/ and set the path
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
