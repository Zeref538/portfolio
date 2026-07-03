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
    "I'm a Computer Science undergraduate at Our Lady of Fatima University with a growing focus on AI/ML, particularly computer vision and accessibility-driven solutions.",
    "I'm currently leading the development of ACRA (Adaptive Color Re-Encoding Algorithm), a thesis system that uses YOLOv8m for semantic region detection to enhance color accessibility in public visual materials for individuals with color vision deficiency — spanning the full pipeline: dataset annotation, model training and evaluation (Precision, Recall, mAP50/50-95 under ISO/IEC 25010), and deployment with FastAPI, Supabase, and React.",
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
    subtitle: "Daltonism-aware accessibility · Thesis / ML Lead",
    description:
      "CNN-powered system that detects color-critical regions in public signage and re-encodes them for color vision deficiency without altering original design. Trained YOLOv8m on a custom 5-class dataset (33,774 annotated boxes) reaching 0.740 mAP50, and built the core re-encoding algorithm: CLAHE → CIELAB → Fuzzy C-Means → CIEDE2000 conflict detection → constrained optimization. Deployed via FastAPI + ONNX with Supabase (RLS, 24h auto-delete).",
    tags: ["YOLOv8", "Computer Vision", "FastAPI", "ONNX", "Supabase", "React"],
    metric: "0.740 mAP50",
    link: "",
  },
  {
    title: "CafèSync — Smart Coffee Shop Operations",
    subtitle: "Real-time ops platform with AI insights",
    description:
      "Centralized coffee shop management for orders, inventory, and sales analytics. Node.js backend synced live via Firebase Firestore (zero-refresh multi-screen updates), PayMongo payments, and a Python AI insights layer generating operational alerts — ingredient reorder triggers and staffing recommendations from order-volume forecasting.",
    tags: ["Node.js", "Firebase", "Python", "Forecasting", "PayMongo"],
    metric: "Live multi-screen sync",
    link: "",
  },
  {
    title: "CLICKSILOG — Self-Ordering & Kitchen Display",
    subtitle: "Digital workflow for a local restaurant",
    description:
      "Self-ordering and kitchen display system replacing manual order-taking. Built the order-routing logic linking customer orders to a real-time Kitchen Display System, integrated PayMongo for online payments, and automated inventory deduction on each order — keeping ordering, kitchen, and stock fully in sync.",
    tags: ["JavaScript", "Node.js", "Express", "REST APIs", "React"],
    metric: "End-to-end order sync",
    link: "",
  },
];

export const skills = [
  {
    group: "AI / Machine Learning",
    items: ["Python", "YOLOv8 / Object Detection", "CNNs", "Model Evaluation (mAP, P/R)", "ONNX Deployment", "Forecasting"],
  },
  {
    group: "Data",
    items: ["SQL", "R", "Tableau", "PostgreSQL", "Data Cleaning & Analysis", "Regression Modeling"],
  },
  {
    group: "Engineering",
    items: ["FastAPI", "React", "Node.js / Express", "Supabase", "Firebase", "REST APIs"],
  },
  {
    group: "Other",
    items: ["Cybersecurity & Network Defense", "Cloud (GCP, AWS, OCI)", "Agile Project Management"],
  },
];

export const certifications = [
  { name: "Google Advanced Data Analytics Professional Certificate", issuer: "Google", year: "2026" },
  { name: "Google AI Professional Certificate", issuer: "Google", year: "2026" },
  { name: "AWS AI Practitioner", issuer: "Amazon Web Services", year: "2026" },
  { name: "Cisco Certified Support Technician — Cybersecurity", issuer: "Cisco", year: "2026" },
  { name: "Google Project Management Professional Certificate", issuer: "Google", year: "2026" },
  { name: "Oracle Cloud Infrastructure Certified AI Foundations Associate", issuer: "Oracle", year: "2025" },
  { name: "Google Data Analytics Professional Certificate", issuer: "Google", year: "2025" },
  { name: "Google Cybersecurity Professional Certificate", issuer: "Google", year: "2025" },
];

export const education = {
  school: "Our Lady of Fatima University",
  degree: "BS Computer Science",
  period: "2023 — 2027",
  highlights: [
    "Dean's Lister 2023–2026",
    "2nd Place — Python Programming Competition",
    "3rd Place — Database Designing Competition",
    "3rd Place — C Programming Competition",
  ],
};
