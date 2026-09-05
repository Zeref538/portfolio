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
  SiUnity,
  SiN8N,
  SiGooglecloud,
  SiOllama,
  SiNvidia,
  SiGithubactions,
  SiSqlite,
} from "react-icons/si";
import { VscAzure } from "react-icons/vsc";
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
} from "react-icons/lu";

// [Icon, official brand color] — concept glyphs use theme colors
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
  "C": [SiC, "#A8B9CC"],
  "C++": [SiCplusplus, "#659AD2"],
  "Java": [SiOpenjdk, "#E76F00"],
  "Rust": [SiRust, "#DEA584"],
  "HTML": [SiHtml5, "#E34F26"],
  "CSS": [SiCss, "#7c5fd3"],
  "MySQL": [SiMysql, "#4479A1"],
  "MongoDB": [SiMongodb, "#47A248"],
  "React Native (Expo)": [SiExpo, "#e6edf3"],
  "Express.js": [SiExpress, "#e6edf3"],
  "Docker": [SiDocker, "#2496ED"],
  "Stripe": [SiStripe, "#635BFF"],
  "Vercel": [SiVercel, "#e6edf3"],
  "Render": [SiRender, "#e6edf3"],
  "Google Cloud": [SiGooglecloud, "#4285F4"],
  "LangChain": [SiLangchain, "#e6edf3"],
  "RAG": [LuLayers, "#22d3ee"],
  "Agentic AI": [LuBot, "#22d3ee"],
  "LLM Fine-Tuning": [LuSlidersHorizontal, "#8b5cf6"],
  "LoRA": [LuSlidersVertical, "#8b5cf6"],
  "QLoRA": [LuLayers2, "#8b5cf6"],
  "Computer Vision": [LuEye, "#22d3ee"],
  "SQLite": [SiSqlite, "#003B57"],
  "Automation": [LuWorkflow, "#22d3ee"],
  "n8n": [SiN8N, "#EA4B71"],
  "Unity": [SiUnity, "#e6edf3"],
  "Transformers": [LuBoxes, "#8b5cf6"],
  "NLP": [LuLanguages, "#8b5cf6"],
  "Code-Switching": [LuMessagesSquare, "#22d3ee"],
  "From Scratch": [LuHammer, "#22d3ee"],
  "BPE Tokenizer": [LuType, "#22d3ee"],
  "Ollama": [SiOllama, "#e6edf3"],
  "NVIDIA NIM": [SiNvidia, "#76B900"],
  "Azure": [VscAzure, "#0078D4"],
  "Kaggle": [SiKaggle, "#20BEFF"],
  "Power BI": [LuChartPie, "#F2C811"],
  "Git": [SiGit, "#F05032"],
  "GitHub": [SiGithub, "#e6edf3"],
  "Figma": [SiFigma, "#F24E1E"],
  "Notion": [SiNotion, "#e6edf3"],
  "YOLOv8": [LuScanSearch, "#22d3ee"],
  "CNNs": [LuBrain, "#8b5cf6"],
  "Model Evaluation": [LuGauge, "#22d3ee"],
  "ONNX": [SiOnnx, "#a1a1aa"],
  "Forecasting": [LuTrendingUp, "#22d3ee"],
  "Time-Series": [LuTrendingUp, "#8b5cf6"],
  "Open-Meteo": [LuCloud, "#22d3ee"],
  "River": [LuWaves, "#22d3ee"],
  "Online Learning": [LuRefreshCw, "#8b5cf6"],
  "GitHub Actions": [SiGithubactions, "#2088FF"],
  "Leaflet": [SiLeaflet, "#199900"],
  "SQL": [LuDatabase, "#8b5cf6"],
  "R": [SiR, "#276DC3"],
  "Tableau": [LuChartColumn, "#E97627"],
  "PostgreSQL": [SiPostgresql, "#4169E1"],
  "Data Analysis": [LuFilter, "#22d3ee"],
  "Regression": [LuChartScatter, "#8b5cf6"],
  "FastAPI": [SiFastapi, "#009688"],
  "React": [SiReact, "#61DAFB"],
  "Node.js": [SiNodedotjs, "#5FA04E"],
  "Supabase": [SiSupabase, "#3FCF8E"],
  "Firebase": [SiFirebase, "#FFCA28"],
  "REST APIs": [LuNetwork, "#8b5cf6"],
  "Cybersecurity": [LuShieldCheck, "#22d3ee"],
  "Cloud (GCP · AWS · OCI)": [LuCloud, "#8b5cf6"],
  "Agile": [LuKanban, "#22d3ee"],
};

// certification issuers — official brand logos served from public/logos/
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

export function SkillIcon({ name }) {
  const entry = ICONS[name] ?? ICONS_LC[name?.toLowerCase()];
  if (!entry) return null;
  const [Icon, color] = entry;
  return <Icon className="skill-icon" style={{ color }} aria-hidden="true" />;
}
