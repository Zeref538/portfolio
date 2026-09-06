import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import ProjectPage from "./ProjectPage.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
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
      </Routes>
    </BrowserRouter>
    <Analytics />
    <SpeedInsights />
  </React.StrictMode>
);
