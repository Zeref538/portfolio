import { useEffect, useState } from "react";

const read = () => document.documentElement.dataset.theme || "dark";

// The current theme ("dark" or "light"). The theme button sets data-theme on
// <html>; this watches that attribute so any component can follow a switch.
export function useTheme() {
  const [theme, setTheme] = useState(read);
  useEffect(() => {
    const o = new MutationObserver(() => setTheme(read()));
    o.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    // The theme button (a child) sets data-theme in its own effect, which React
    // runs before this parent's, so that first change happened before we were
    // listening. Read it once now.
    setTheme(read());
    return () => o.disconnect();
  }, []);
  return theme;
}

// A project's screenshots for the current theme: its light-mode set when it has
// one (only projects whose own site has a light mode do), otherwise the default.
export function projectImages(p, theme) {
  if (theme === "light" && p.imagesLight?.length) return p.imagesLight;
  return p.images?.length ? p.images : p.image ? [p.image] : [];
}
