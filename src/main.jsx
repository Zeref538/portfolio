import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
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
    <App />
    <Analytics />
    <SpeedInsights />
  </React.StrictMode>
);
