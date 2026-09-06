import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { LuArrowLeft, LuArrowUpRight, LuArrowRight } from "react-icons/lu";
import { SiGithub } from "react-icons/si";
import { projects } from "./data.js";
import { findProject, slugify } from "./slug.js";
import Noise from "./components/Noise.jsx";
import Reveal from "./components/Reveal.jsx";
import StatusBar from "./components/StatusBar.jsx";
import { ChatDial } from "./components/ChatWidget.jsx";
import "./project-page.css";

// The homepage cards already carried all of this in a hover overlay, which is
// unreachable on a phone, impossible to link to, and invisible to search. The
// content did not need writing -- it needed a URL.

// The metric field is one sentence with the numbers buried in it, e.g.
// "P@50 0.88 vs 0.551 base - and still no clear win over a 5-line rule".
// Split on the dash so the figure leads and the caveat sits under it, rather
// than running the whole thing across the page as one long line.
function splitMetric(metric) {
  const i = metric.indexOf(" - ");
  return i === -1
    ? { head: metric, tail: "" }
    : { head: metric.slice(0, i), tail: metric.slice(i + 3) };
}

export default function ProjectPage() {
  const { slug } = useParams();
  const project = findProject(slug);

  const idx = projects.findIndex((p) => slugify(p.title) === slug);
  const prev = idx > 0 ? projects[idx - 1] : null;
  const next = idx >= 0 && idx < projects.length - 1 ? projects[idx + 1] : null;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!project) return;
    // Per-page title and description. Without this every project shares the
    // homepage's tags, so a shared link and a search result both say
    // "John Andrei Martinez - AI/ML Engineer" no matter which project it is.
    const prevTitle = document.title;
    document.title = `${project.title} - John Andrei Martinez`;
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.content;
    if (meta) meta.content = project.description.slice(0, 300);
    return () => {
      document.title = prevTitle;
      if (meta && prevDesc) meta.content = prevDesc;
    };
  }, [project]);

  if (!project) {
    return (
      <div className="pp-wrap">
        <Noise patternAlpha={22} />
        <div className="pp-container pp-missing">
          <div className="section-label">$ cat projects/{slug}</div>
          <p>No project by that name. It may have been renamed.</p>
          <Link className="btn btn-ghost" to="/#projects">
            <LuArrowLeft /> back to all projects
          </Link>
        </div>
      </div>
    );
  }

  const { head, tail } = project.metric ? splitMetric(project.metric) : {};
  const gallery = (project.images || []).filter((s) => s !== project.image);

  return (
    <div className="pp-wrap">
      <Noise patternAlpha={22} />

      <div className="pp-container">
        <Link className="pp-back" to="/#projects">
          <LuArrowLeft /> all projects
        </Link>

        <header className="pp-head">
          <div className="pp-eyebrow">
            {(project.groups || []).join(" · ")}
            {project.date && <span className="pp-dot">·</span>}
            {project.date}
          </div>
          <h1>{project.title}</h1>
          {project.category && <div className="pp-category">{project.category}</div>}

          {project.metric && (
            <div className="pp-metric">
              <div className="pp-metric-head">{head}</div>
              {tail && <div className="pp-metric-tail">{tail}</div>}
            </div>
          )}

          <div className="pp-actions">
            {project.demo && (
              <a className="btn btn-primary" href={project.demo} target="_blank" rel="noreferrer">
                <LuArrowUpRight /> {project.demoLabel || "live demo"}
              </a>
            )}
            {project.link && (
              <a className="btn btn-ghost" href={project.link} target="_blank" rel="noreferrer">
                <SiGithub /> source
              </a>
            )}
          </div>
        </header>

        {project.image && (
          <img
            className="pp-hero"
            src={project.image}
            alt={`${project.title} screenshot`}
            loading="eager"
            onError={(e) => { e.target.style.display = "none"; }}
          />
        )}

        <div className="pp-body">
          <main className="pp-main">
            <h2 className="pp-sec">// what it does</h2>
            <p className="pp-desc">{project.description}</p>

            {project.highlights?.length > 0 && (
              <>
                <h2 className="pp-sec">// what I found</h2>
                {/* Numbered, not bulleted: six findings in order read as a
                    piece of work; six bullets read as a feature list. */}
                <ol className="pp-highlights">
                  {project.highlights.map((h, i) => (
                    <li key={h}>
                      <span className="pp-num">{String(i + 1).padStart(2, "0")}</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ol>
              </>
            )}

            {gallery.length > 0 && (
              <>
                <h2 className="pp-sec">// screens</h2>
                <div className="pp-gallery">
                  {gallery.map((src) => (
                    <img
                      key={src}
                      src={src}
                      alt={`${project.title} screenshot`}
                      loading="lazy"
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  ))}
                </div>
              </>
            )}
          </main>

          <aside className="pp-rail">
            <div className="pp-rail-inner">
              <div className="pp-rail-label"># stack</div>
              <div className="tags pp-rail-tags">
                {project.tags.map((t) => <span className="tag" key={t}>{t}</span>)}
              </div>

              <div className="pp-rail-label"># links</div>
              <div className="pp-rail-links">
                {project.demo && (
                  <a href={project.demo} target="_blank" rel="noreferrer">
                    <LuArrowUpRight /> {project.demoLabel || "live demo"}
                  </a>
                )}
                {project.link && (
                  <a href={project.link} target="_blank" rel="noreferrer">
                    <SiGithub /> source code
                  </a>
                )}
              </div>
            </div>
          </aside>
        </div>

        {/* a <div>, not a <nav>: index.css styles the bare `nav` tag as the
            site's floating rail (position: fixed), which yanked this block to
            the middle-left of the viewport. */}
        <div className="pp-nav">
          {prev ? (
            <Link to={`/projects/${slugify(prev.title)}`} className="pp-nav-item pp-nav-prev">
              <span className="pp-nav-label"><LuArrowLeft /> previous</span>
              <span className="pp-nav-title">{prev.title.split(" - ")[0]}</span>
            </Link>
          ) : <span />}
          {next && (
            <Link to={`/projects/${slugify(next.title)}`} className="pp-nav-item pp-nav-next">
              <span className="pp-nav-label">next <LuArrowRight /></span>
              <span className="pp-nav-title">{next.title.split(" - ")[0]}</span>
            </Link>
          )}
        </div>
      </div>

      <StatusBar />
      <ChatDial />
    </div>
  );
}
