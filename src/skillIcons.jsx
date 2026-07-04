// Maps each skill name in data.js to a real SVG logo in its brand color.
// Brands: Simple Icons (react-icons/si) · Concepts: Lucide (react-icons/lu)
import {
  SiGoogle,
  SiCisco,
  SiPython,
  SiOnnx,
  SiR,
  SiPostgresql,
  SiFastapi,
  SiReact,
  SiNodedotjs,
  SiSupabase,
  SiFirebase,
} from "react-icons/si";
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
} from "react-icons/lu";

// [Icon, official brand color] — concept glyphs use theme colors
const ICONS = {
  "Python": [SiPython, "#3776AB"],
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

// certification issuers (Oracle/AWS logos aren't in Simple Icons — themed glyphs)
const ISSUERS = {
  "Google": [SiGoogle, "#4285F4"],
  "Cisco": [SiCisco, "#1BA0D7"],
  "AWS": [LuCloud, "#FF9900"],
  "Oracle": [LuDatabase, "#F80000"],
};

export function IssuerIcon({ issuer }) {
  const entry = ISSUERS[issuer];
  if (!entry) return null;
  const [Icon, color] = entry;
  return <Icon className="issuer-icon" style={{ color }} aria-hidden="true" />;
}

export function SkillIcon({ name }) {
  const entry = ICONS[name];
  if (!entry) return null;
  const [Icon, color] = entry;
  return <Icon className="skill-icon" style={{ color }} aria-hidden="true" />;
}
