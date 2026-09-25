import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { LuArrowUpRight, LuX } from "react-icons/lu";
import { SiGithub } from "react-icons/si";
import { slugify } from "../slug.js";

// The enlarged card a project opens into. Built on the browser's own <dialog>:
// showModal() gives Esc-to-close, a focus trap and the "dialog" role for screen
// readers for free, and ::backdrop is the dimmed layer behind it.
export default function ProjectModal({ project, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const d = ref.current;
    if (!project || !d) return;
    d.showModal();
    // a dialog does not stop the page behind it scrolling on its own
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
      if (d.open) d.close();
    };
  }, [project]);

  if (!project) return null;
  const p = project;
  // three bullets cut to two lines each: the popup is the summary, "Check out"
  // is the full text. Four uncut bullets made it twice the height of the image.
  const bullets = p.highlights.slice(0, 3);

  return (
    <dialog
      ref={ref}
      className="pm"
      aria-labelledby="pm-title"
      onClose={onClose}
      // a click that lands on the dialog element itself, not its content, is a
      // click on the backdrop around the card
      onClick={(e) => { if (e.target === ref.current) onClose(); }}
    >
      <div className="pm-card">
        <button type="button" className="pm-close" aria-label="Close" onClick={onClose}>
          <LuX />
        </button>

        <div className="pm-shot">
          {p.image ? (
            <img src={p.image} alt={`${p.title} screenshot`} />
          ) : (
            <span className="pm-shot-ph">{p.title.split(" ")[0]}</span>
          )}
        </div>

        <div className="pm-body">
          <div className="pm-head">
            <h3 id="pm-title">{p.title.split(" - ")[0]}</h3>
            <Link className="pm-check" to={`/projects/${slugify(p.title)}`} onClick={onClose}>
              Check out <LuArrowUpRight />
            </Link>
          </div>
          <p className="pm-sub">{p.title.split(" - ")[1] || p.category}</p>
          {p.metric && <p className="pm-metric">{p.metric}</p>}

          <ul className="pm-list">
            {bullets.map((h) => <li key={h}>{h}</li>)}
          </ul>

          <div className="tags pm-tags">
            {p.tags.map((t) => <span className="tag" key={t}>{t}</span>)}
          </div>

          <div className="pm-links">
            {p.demo && (
              <a href={p.demo} target="_blank" rel="noreferrer">
                <LuArrowUpRight /> {p.demoLabel || "live demo"}
              </a>
            )}
            {p.link && (
              <a href={p.link} target="_blank" rel="noreferrer">
                <SiGithub /> source
              </a>
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
}
