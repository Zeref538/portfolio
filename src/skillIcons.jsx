// Maps each skill name in data.js to a real SVG logo in its brand color.
// Brands: Simple Icons (react-icons/si) · Concepts: Lucide (react-icons/lu)
import {
  SiPython,
  SiOnnx,
  SiR,
  SiPostgresql,
  SiFastapi,
  SiReact,
  SiLeaflet,
  SiNodedotjs,
  SiSupabase,
  SiFirebase,
  SiPytorch,
  SiTensorflow,
  SiScikitlearn,
  SiHuggingface,
  SiOpencv,
  SiPandas,
  SiNumpy,
  SiJavascript,
  SiTypescript,
  SiC,
  SiCplusplus,
  SiOpenjdk,
  SiRust,
  SiHtml5,
  SiCss,
  SiMysql,
  SiMongodb,
  SiAnthropic,
  SiExpo,
  SiExpress,
  SiDocker,
  SiStripe,
  SiVercel,
  SiGit,
  SiGithub,
  SiFigma,
  SiNotion,
  SiKaggle,
  SiLangchain,
  SiRender,
  SiNetlify,
  SiUnity,
  SiN8N,
  SiGooglecloud,
  SiOllama,
  SiNvidia,
  SiGithubactions,
  SiSqlite,
} from "react-icons/si";
import { VscAzure } from "react-icons/vsc";
import { TbAdjustmentsHorizontal, TbBinary, TbChartLine, TbDatabaseSearch, TbGridPattern, TbMatrix, TbRobot, TbScan, TbSeo, TbSql, TbTargetArrow, TbTopologyStar3 } from "react-icons/tb";
import {
  LuBrain,
  LuScanSearch,
  LuGauge,
  LuTrendingUp,
  LuDatabase,
  LuFilter,
  LuChartScatter,
  LuChartColumn,
  LuNetwork,
  LuShieldCheck,
  LuCloud,
  LuKanban,
  LuChartPie,
  LuLayers,
  LuBot,
  LuSlidersHorizontal,
  LuBoxes,
  LuHammer,
  LuType,
  LuWaves,
  LuRefreshCw,
  LuLanguages,
  LuMessagesSquare,
  LuSlidersVertical,
  LuLayers2,
  LuEye,
  LuWorkflow,
  LuSearchCheck,
} from "react-icons/lu";

// [Icon, official brand color] - concept glyphs use theme colors
const ICONS = {
  "Python": [SiPython, "#3776AB"],
  "PyTorch": [SiPytorch, "#EE4C2C"],
  "TensorFlow": [SiTensorflow, "#FF6F00"],
  "scikit-learn": [SiScikitlearn, "#F7931E"],
  "Hugging Face": [SiHuggingface, "#FFD21E"],
  "OpenCV": [SiOpencv, "#5C3EE8"],
  "Pandas": [SiPandas, "#8a7fd6"],
  "NumPy": [SiNumpy, "#4DABCF"],
  "JavaScript": [SiJavascript, "#F7DF1E"],
  "TypeScript": [SiTypescript, "#3178C6"],
  "C": [SiC, "#6f84a0"],
  "C++": [SiCplusplus, "#659AD2"],
  "Java": [SiOpenjdk, "#E76F00"],
  "Rust": [SiRust, "#DEA584"],
  "HTML": [SiHtml5, "#E34F26"],
  "CSS": [SiCss, "#7c5fd3"],
  "MySQL": [SiMysql, "#4479A1"],
  "MongoDB": [SiMongodb, "#47A248"],
  "React Native (Expo)": [SiExpo, "var(--text)"],
  "Express.js": [SiExpress, "var(--text)"],
  "Docker": [SiDocker, "#2496ED"],
  "Stripe": [SiStripe, "#635BFF"],
  "Vercel": [SiVercel, "var(--text)"],
  "Render": [SiRender, "var(--text)"],
  "Netlify": [SiNetlify, "#00C7B7"],
  "SEO": [TbSeo, ["#facc15", "#a16207"]], // no official logo: an icon + its own colour (dark, light)
  "Google Cloud": [SiGooglecloud, "#4285F4"],
  "LangChain": [SiLangchain, "var(--text)"],
  "RAG": [TbDatabaseSearch, ["#2dd4bf", "#0d9488"]], // no official logo: an icon + its own colour (dark, light)
  "Agentic AI": [TbRobot, ["#fb923c", "#c2410c"]], // no official logo: an icon + its own colour (dark, light)
  "LLM Fine-Tuning": [TbAdjustmentsHorizontal, ["#a78bfa", "#6d28d9"]], // no official logo: an icon + its own colour (dark, light)
  "LoRA": [TbMatrix, ["#f472b6", "#be185d"]], // no official logo: an icon + its own colour (dark, light)
  "QLoRA": [TbBinary, ["#4ade80", "#15803d"]], // no official logo: an icon + its own colour (dark, light)
  "Computer Vision": [TbScan, ["#fb7185", "#be123c"]], // no official logo: an icon + its own colour (dark, light)
  "SQLite": [SiSqlite, "#003B57"],
  "Automation": [LuWorkflow, "var(--text-muted)"],
  "n8n": [SiN8N, "#EA4B71"],
  "Unity": [SiUnity, "var(--text)"],
  "Transformers": [TbTopologyStar3, ["#fbbf24", "#b45309"]], // no official logo: an icon + its own colour (dark, light)
  "NLP": [LuLanguages, "var(--accent)"],
  "Code-Switching": [LuMessagesSquare, "var(--text-muted)"],
  "From Scratch": [LuHammer, "var(--text-muted)"],
  "BPE Tokenizer": [LuType, "var(--text-muted)"],
  "Ollama": [SiOllama, "var(--text)"],
  "NVIDIA NIM": [SiNvidia, "#76B900"],
  "Azure": [VscAzure, "#0078D4"],
  "Kaggle": [SiKaggle, "#20BEFF"],
  "Power BI": [LuChartPie, "#F2C811"],
  "Git": [SiGit, "#F05032"],
  "GitHub": [SiGithub, "var(--text)"],
  "Figma": [SiFigma, "#F24E1E"],
  "Notion": [SiNotion, "var(--text)"],
  "YOLOv8": [LuScanSearch, "var(--text-muted)"],
  "CNNs": [TbGridPattern, ["#e879f9", "#a21caf"]], // no official logo: an icon + its own colour (dark, light)
  "Model Evaluation": [TbTargetArrow, ["#a3e635", "#4d7c0f"]], // no official logo: an icon + its own colour (dark, light)
  "ONNX": [SiOnnx, "#a1a1aa"],
  "Forecasting": [LuTrendingUp, "var(--text-muted)"],
  "Time-Series": [TbChartLine, ["#22d3ee", "#0e7490"]], // no official logo: an icon + its own colour (dark, light)
  "Open-Meteo": [LuCloud, "var(--text-muted)"],
  "River": [LuWaves, "var(--text-muted)"],
  "Online Learning": [LuRefreshCw, "var(--accent)"],
  "GitHub Actions": [SiGithubactions, "#2088FF"],
  "Leaflet": [SiLeaflet, "#199900"],
  "SQL": [TbSql, ["#818cf8", "#4338ca"]], // no official logo: an icon + its own colour (dark, light)
  "R": [SiR, "#276DC3"],
  "Tableau": [LuChartColumn, "#E97627"],
  "PostgreSQL": [SiPostgresql, "#4169E1"],
  "Data Analysis": [LuFilter, "var(--text-muted)"],
  "Regression": [LuChartScatter, "var(--accent)"],
  "FastAPI": [SiFastapi, "#009688"],
  "React": [SiReact, "#61DAFB"],
  "Node.js": [SiNodedotjs, "#5FA04E"],
  "Supabase": [SiSupabase, "#3FCF8E"],
  "Firebase": [SiFirebase, "#FFCA28"],
  "REST APIs": [LuNetwork, "var(--accent)"],
  "Cybersecurity": [LuShieldCheck, "var(--text-muted)"],
  "Cloud (GCP · AWS · OCI)": [LuCloud, "var(--accent)"],
  "Agile": [LuKanban, "var(--text-muted)"],
};

// certification issuers - official brand logos served from public/logos/
const ISSUER_LOGOS = {
  "Google": "/logos/google.svg",
  "Cisco": "/logos/cisco.svg",
  "AWS": "/logos/aws.svg",
  "Oracle": "/logos/oracle.svg",
};

// issuers whose logo comes from react-icons instead of a file [Icon, color]
const ISSUER_ICONS = {
  "MongoDB": [SiMongodb, "#47A248"],
  "Anthropic": [SiAnthropic, "#D97757"],
};

export function IssuerIcon({ issuer }) {
  const entry = ISSUER_ICONS[issuer];
  if (entry) {
    const [Icon, color] = entry;
    return <Icon className="issuer-icon" style={{ color }} aria-label={`${issuer} logo`} />;
  }
  const src = ISSUER_LOGOS[issuer];
  if (!src) return null;
  return (
    <img
      className="issuer-icon"
      src={src}
      alt={`${issuer} logo`}
      loading="lazy"
    />
  );
}

// lower-cased mirror of ICONS, so a tag written "pandas" still finds "Pandas".
// casing drifts between data.js and this map, and a miss renders nothing at all
// rather than throwing, which is exactly the kind of bug nobody notices.
const ICONS_LC = Object.fromEntries(Object.entries(ICONS).map(([k, v]) => [k.toLowerCase(), v]));

// Brand colours are picked for dark backgrounds, so on a white tile the pale ones
// (JavaScript yellow, Hugging Face, Power BI...) fade out. Darkening them changed the
// brand and looked wrong; instead they keep their colour and get a thin dark outline
// in light mode. This decides which ones need it: under 3:1 against white.
const lum = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(n >> 16) + 0.7152 * f((n >> 8) & 255) + 0.0722 * f(n & 255);
};
const paleOnWhite = (hex) => /^#[0-9a-f]{6}$/i.test(hex) && 1.05 / (lum(hex) + 0.05) < 3;

export function SkillIcon({ name }) {
  const entry = ICONS[name] ?? ICONS_LC[name?.toLowerCase()];
  if (!entry) return null;
  const [Icon, color] = entry;
  // [dark, light] pairs are for icons with no brand colour of their own
  const [dark, light] = Array.isArray(color) ? color : [color, color];
  return (
    <Icon
      className={`skill-icon${paleOnWhite(light) ? " is-pale" : ""}`}
      style={{ "--c": dark, "--c-light": light }}
      aria-hidden="true"
    />
  );
}
