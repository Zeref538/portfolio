// Maps each skill name in data.js to a real SVG logo in its brand color.
// Brands: Simple Icons (react-icons/si) · Concepts: Lucide (react-icons/lu)
import {
  SiPython,
  SiOnnx,
  SiR,
  SiPostgresql,
  SiFastapi,
  SiReact,
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
  SiExpo,
  SiExpress,
  SiDocker,
  SiVercel,
  SiGit,
  SiGithub,
  SiFigma,
  SiNotion,
  SiKaggle,
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
  "Vercel": [SiVercel, "#e6edf3"],
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

export function IssuerIcon({ issuer }) {
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

export function SkillIcon({ name }) {
  const entry = ICONS[name];
  if (!entry) return null;
  const [Icon, color] = entry;
  return <Icon className="skill-icon" style={{ color }} aria-hidden="true" />;
}
