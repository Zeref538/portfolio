import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import ProjectPage from "./ProjectPage.jsx";
import NotFound from "./NotFound.jsx";
import Privacy from "./Privacy.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// Fonts ship with the site instead of loading from fonts.googleapis.com. A
// Google-hosted font sends every visitor's IP address to Google on every page
// view, which is a disclosure nobody agreed to, and it is one more network
// round trip before any text can paint.
import "@fontsource/sora/600.css";
import "@fontsource/sora/700.css";
import "@fontsource/sora/800.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource-variable/jetbrains-mono";
import "./index.css";
import "./theme-fonts.css"; // TEST: try/mix2
import "./theme-mix.css"; // TEST: try/mix2
// Analytics is a count of visits, not a tracker: no cookies, no cross-site
// profile, so no consent banner is needed. SpeedInsights reports the load speed
// real visitors get, which is the only speed number that matters -- my machine on
// my connection is not a measurement of anything.
// Both stay silent until Analytics and Speed Insights are switched on for this
// project in the Vercel dashboard.
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Two routes: the single-page site, and one case-study page per project.
        Deep links like /projects/yoda need the rewrite in vercel.json, or the
        host looks for a file at that path and returns its own 404. */}
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/projects/:slug" element={<ProjectPage />} />
        {/* Anything else. Without this, a mistyped URL fell through to the
            host's own bare 404 with no link back to the site. */}
        <Route path="/privacy" element={<Privacy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
    <Analytics />
    <SpeedInsights />
  </React.StrictMode>
);
