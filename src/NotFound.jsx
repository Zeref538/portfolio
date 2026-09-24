import { useEffect } from "react";
import { Link } from "react-router-dom";
import { LuArrowLeft } from "react-icons/lu";
import "./project-page.css";

export default function NotFound() {
  // The catch-all rewrite in vercel.json serves index.html for every unknown
  // path, so this page arrives with HTTP 200, not 404. Without noindex, search
  // engines treat each mistyped URL as a real page and index it.
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Page not found - John Andrei Martinez";
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex";
    document.head.appendChild(meta);
    return () => {
      document.title = prevTitle;
      meta.remove();
    };
  }, []);

  return (
    <div className="pp-wrap">
      <div className="pp-container pp-missing">
        <div className="section-label">$ cat {window.location.pathname}</div>
        <h1>404 - no such page</h1>
        <p>That URL does not exist here. It may have been renamed or never existed.</p>
        <Link className="btn btn-ghost" to="/">
          <LuArrowLeft /> back to the homepage
        </Link>
      </div>
    </div>
  );
}
