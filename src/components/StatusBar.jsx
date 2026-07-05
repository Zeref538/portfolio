import { useEffect, useState } from "react";

// tmux-style fixed status bar. Isolated component so the 1s clock tick
// re-renders only this tiny bar, never the app.
export default function StatusBar({ section }) {
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setUptime((v) => v + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const mm = String(Math.floor(uptime / 60)).padStart(2, "0");
  const ss = String(uptime % 60).padStart(2, "0");

  return (
    <div className="statusbar" aria-hidden="true">
      <span className="sb-cell sb-session">⬢ zeref@portfolio</span>
      <span className="sb-cell sb-mode">OPEN TO WORK</span>
      <span className="sb-cell sb-path">~{section ? `/${section.replace("#", "")}` : ""}</span>
      <span className="sb-fill" />
      <span className="sb-cell sb-meta">⚡ react · vite</span>
      <span className="sb-cell sb-clock">session {mm}:{ss}</span>
    </div>
  );
}
