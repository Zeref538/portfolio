import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { LuArrowUpRight, LuX, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { LinkIcon } from "../linkIcon.jsx";
import { SiGithub } from "react-icons/si";
import { slugify } from "../slug.js";

// The enlarged card a project opens into. Built on the browser's own <dialog>:
// showModal() gives Esc-to-close, a focus trap and the "dialog" role for screen
// readers for free, and ::backdrop is the dimmed layer behind it.
// The screenshot stays 16:9. Stretching it to the card's height and cropping
// with object-fit turned it into a square with its sides cut off. The space
// under it holds the project's other screenshots instead.
// Lives inside the keyed card, so it resets to the first image per project.
function Gallery({ project: p, name }) {
  const shots = p.images?.length ? p.images : p.image ? [p.image] : [];
  const [i, setI] = useState(0);
  if (!shots.length) return <div className="pm-shot"><span className="pm-shot-ph">{name}</span></div>;
  return (
    <div className="pm-gallery">
      <div className="pm-shot">
        <img src={shots[i]} alt={`${p.title} screenshot ${i + 1} of ${shots.length}`} />
      </div>
      {shots.length > 1 && (
        <div className="pm-thumbs">
          {shots.map((src, k) => (
            <button
              type="button"
              key={src}
              className={`pm-thumb ${k === i ? "on" : ""}`}
              aria-label={`Show screenshot ${k + 1}`}
              aria-pressed={k === i}
              onClick={() => setI(k)}
            >
              <img src={src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProjectModal({ project, onClose, onPrev, onNext }) {
  const ref = useRef(null);
  const isOpen = Boolean(project);

  // Keyed on open/closed, NOT on which project. Keyed on the project, moving to
  // the next one would run the cleanup, close() the dialog, fire its "close"
  // event and clear the selection - the arrow key would shut the popup.
  useEffect(() => {
    const d = ref.current;
    if (!isOpen || !d) return;
    d.showModal();
    // a dialog does not stop the page behind it scrolling on its own
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
      if (d.open) d.close();
    };
  }, [isOpen]);

  if (!project) return null;
  const p = project;
  const [name, subtitle] = p.title.split(" - ");

  const onKeyDown = (e) => {
    // leave arrows alone while someone is typing or selecting inside a control
    if (e.target.closest("input, textarea, select")) return;
    if (e.key === "ArrowLeft") { e.preventDefault(); onPrev(); }
    if (e.key === "ArrowRight") { e.preventDefault(); onNext(); }
  };

  return (
    <dialog
      ref={ref}
      className="pm"
      aria-labelledby="pm-title"
      onClose={onClose}
      onKeyDown={onKeyDown}
      // a click that lands on the dialog element itself, not its content, is a
      // click on the backdrop around the card
      onClick={(e) => { if (e.target === ref.current) onClose(); }}
    >
      <button type="button" className="pm-nav pm-prev" aria-label="Previous project" onClick={onPrev}>
        <LuChevronLeft />
      </button>

      {/* key: remount on each project so the entry animation replays and the
          body scroll resets to the top */}
      <div className="pm-card" key={p.title}>
        <button type="button" className="pm-close" aria-label="Close" onClick={onClose}>
          <LuX />
        </button>

        <Gallery project={p} name={name} />

        <div className="pm-body">
          <div className="pm-head">
            <h3 id="pm-title">{name}</h3>
            <Link className="pm-check" to={`/projects/${slugify(p.title)}`} onClick={onClose}>
              Check out <LuArrowUpRight />
            </Link>
          </div>
          {subtitle && <p className="pm-sub">{subtitle}</p>}
          <p className="pm-meta">
            {p.category}{p.date ? ` · ${p.date}` : ""}
          </p>
          {p.metric && <p className="pm-metric">{p.metric}</p>}

          {/* links up top, so trying the project never needs a scroll */}
          <div className="pm-links">
            {p.live && (
              <a href={p.live} target="_blank" rel="noreferrer">
                <LinkIcon label="try it" /> try it
              </a>
            )}
            {p.demo && (
              <a href={p.demo} target="_blank" rel="noreferrer">
                <LinkIcon label={p.demoLabel || "try it"} /> {p.demoLabel || "try it"}
              </a>
            )}
            {p.link && (
              <a href={p.link} target="_blank" rel="noreferrer">
                <SiGithub /> source
              </a>
            )}
          </div>

          <p className="pm-desc">{p.description}</p>

          <ul className="pm-list">
            {p.highlights.map((h) => <li key={h}>{h}</li>)}
          </ul>

          <div className="tags pm-tags">
            {p.tags.map((t) => <span className="tag" key={t}>{t}</span>)}
          </div>

        </div>
      </div>

      <button type="button" className="pm-nav pm-next" aria-label="Next project" onClick={onNext}>
        <LuChevronRight />
      </button>
    </dialog>
  );
}
