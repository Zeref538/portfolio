import { useEffect, useState } from "react";

// tmux-style fixed status bar. Isolated component so the 1s clock tick
// re-renders only this tiny bar, never the app.
export default function StatusBar({ section }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");

  return (
    <div className="statusbar" aria-hidden="true">
      <span className="sb-cell sb-session">⬢ zeref@portfolio</span>
      <span className="sb-cell sb-mode">OPEN TO WORK</span>
      <span className="sb-cell sb-path">~{section ? `/${section.replace("#", "")}` : ""}</span>
      <span className="sb-fill" />
      <span className="sb-cell sb-meta">bulacan, ph</span>
      <span className="sb-cell sb-clock">{hh}:{mm}:{ss}</span>
    </div>
  );
}
