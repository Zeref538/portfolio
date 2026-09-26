// Start-up loader: parked, not deleted. It works in every browser I could
// test (live site, reloads, cache on/off) but skips on John's machine for a
// reason we have not pinned down yet, so it is off until that is diagnosed.
// To bring it back: uncomment this import and the <BootLoader /> below.
// import BootLoader from "./components/BootLoader.jsx";
import Cursor from "./components/Cursor.jsx";
import ParticleField from "./components/ParticleField.jsx";
import Reveal from "./components/Reveal.jsx";
import ScrollFloat from "./components/ScrollFloat.jsx";
import Magnet from "./components/Magnet.jsx";
import BorderGlow from "./components/BorderGlow.jsx";
import RotatingText from "./components/RotatingText.jsx";
import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { profile, experience, projects, skills, certifications, education } from "./data.js";
import ProjectModal from "./components/ProjectModal.jsx";
import ContactForm from "./components/ContactForm.jsx";
import GradualBlur from "./components/GradualBlur.jsx";
import StatusBar from "./components/StatusBar.jsx";
import ChatWidget, { ChatDial } from "./components/ChatWidget.jsx";
import { SkillIcon, IssuerIcon } from "./skillIcons.jsx";
import { LuExternalLink, LuBadgeCheck, LuArrowUpRight, LuFileText, LuLinkedin, LuMail, LuCheck, LuPhone, LuSun, LuMoon } from "react-icons/lu";
import { SiGithub } from "react-icons/si";

const NAV = [
  ["About", "#about"],
  ["Experience", "#experience"],
  ["Projects", "#projects"],
  ["Certifications", "#certifications"],
  ["Skills", "#skills"],
  ["Contact", "#contact"],
];

const GLOW_CARD_PROPS = {
  edgeSensitivity: 20,
  glowColor: "258 90 76",
  backgroundColor: "var(--surface)",
  borderRadius: 12,
  glowRadius: 30,
  glowIntensity: 1.0,
  coneSpread: 25,
  colors: ["var(--accent)", "var(--accent-2)", "var(--accent)"],
};

function TypedPrompt({ text }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (n >= text.length) return;
    const t = setTimeout(() => setN(n + 1), 55);
    return () => clearTimeout(t);
  }, [n, text]);
  return (
    <div className="typed-prompt" aria-label={text}>
      {text.slice(0, n)}
      <span className="caret" />
    </div>
  );
}

function GlowCard({ className = "", children, ...rest }) {
  return (
    <BorderGlow {...GLOW_CARD_PROPS} className={className} {...rest}>
      {children}
    </BorderGlow>
  );
}

// Kaggle's "K" app-icon mark - not in simple-icons (which only ships the
// old wordmark logotype), so it's hand-built: a rounded bar + two
// round-capped diagonal strokes meeting at a point, like the real mark.
// Official Kaggle "K" glyph, recolored to currentColor so it inherits the
// theme (grey → white on the violet hover fill) like the other nav icons.
function KaggleMark(props) {
  return (
    <svg viewBox="0 0 512 512" role="img" aria-label="Kaggle" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fill="currentColor"
        d="M106,103c-.06,.3-.3,.4-.8,.4h-8c-.5,0-.9-.2-1.3-.6L82.746,86.028l-3.655,3.477v13c0,.6-.3,.9-.9,.9h-6.152c-.6,0-.9-.3-.9-.9V44c0-.6,.3-.9,.9-.9h6.1c.6,0,.9,.3,.9,.9v36l15.692-15.87c.416-.415,.832-.624,1.248-.624h8.204c.356,0,.593,.149,.713,.445c.119,.4,.1,.6-.1,.8L88,81C106,102,106,103,106,103"
        transform="scale(5.5,5.5) translate(-40-30)"
      />
    </svg>
  );
}

// Certification card - enlarges gently on hover (no full-screen preview).
function CertCard({ c }) {
  return (
    <div className="cert-item">
    <GlowCard className="cert-glow">
      <div className="badge-card">
        <div className="badge-art">
          <IssuerIcon issuer={c.issuer} />
          <span className="badge-art-name">{c.name}</span>
          <LuBadgeCheck className="badge-check" />
          <span className="badge-art-label">completion badge</span>
          {c.image && (
            <img
              className="badge-img"
              src={c.image}
              alt={`${c.name} badge`}
              loading="lazy"
              onError={(e) => { e.target.style.display = "none"; }}
            />
          )}
        </div>
        <span className="cert-name">{c.name}</span>
        <div className="badge-meta">
          <span className="badge-issuer">
            <IssuerIcon issuer={c.issuer} />
            {c.issuer}
          </span>
          <span className="cert-meta">{c.year}</span>
        </div>
        {c.url && (
          <a href={c.url} target="_blank" rel="noreferrer" className="badge-verify">
            <LuExternalLink /> Verify
          </a>
        )}
      </div>
    </GlowCard>
    </div>
  );
}

// copies a value (email, phone) to the clipboard and flips the icon + tooltip
// to a confirmation for a couple seconds so the user knows it worked
function CopyButton({ value, className = "", labelIdle = "Copy", icon = <LuMail /> }) {
  const [copied, setCopied] = useState(false);

  const onClick = async (e) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // clipboard API unavailable/blocked - fall back to a temp textarea
      const ta = document.createElement("textarea");
      ta.value = value;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch { /* ignore */ }
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${className} ${copied ? "is-copied" : ""}`}
      aria-label={copied ? "Copied" : labelIdle}
      data-label={copied ? "Copied!" : labelIdle}
    >
      {copied ? <LuCheck /> : icon}
    </button>
  );
}

// cross-fades through a project's screenshots so covers don't sit static
// One FlyRank track: the line that matters, plus a toggle for the rest.
// Four long bullets per track would make the card taller than the screen, and
// the two tracks under ML Engineering were invisible below the fold.
function ExpTrack({ t }) {
  const [open, setOpen] = useState(false);
  const done = t.status === "completed";
  return (
    <div className="exp-track">
      <div className="exp-track-head">
        <span className={`exp-track-dot ${done ? "done" : "wip"}`} />
        <span className="exp-track-name">{t.name}</span>
        {t.verify ? (
          <a className="exp-track-verify" href={t.verify} target="_blank" rel="noreferrer">
            <LuBadgeCheck /> verify
          </a>
        ) : (
          <span className="exp-track-status">{t.status}</span>
        )}
      </div>
      <p className="exp-track-summary">{t.summary}</p>
      {t.more?.length > 0 && (
        <>
          <button
            type="button"
            className="exp-track-toggle"
            onClick={() => setOpen((v) => !v)}
            // aria-expanded tells a screen reader whether the hidden list is
            // currently open; without it the button just announces as "button"
            aria-expanded={open}
          >
            {open ? "hide details" : `+${t.more.length} more`}
          </button>
          {open && (
            <ul className="exp-track-more">
              {t.more.map((m, i) => <li key={i}>{m}</li>)}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

function CyclingCover({ images, alt }) {
  const [idx, setIdx] = useState(0);
  const ref = useRef(null);
  // only cross-fade while the card is actually on screen - keeps 8 cards from
  // each running a timer + image swap in the background
  useEffect(() => {
    if (!images || images.length < 2) return;
    const host = ref.current?.parentNode;
    let id = null;
    const start = () => { if (id == null) id = setInterval(() => setIdx((i) => (i + 1) % images.length), 4600); };
    const stop = () => { if (id != null) { clearInterval(id); id = null; } };
    if (!host || typeof IntersectionObserver === "undefined") {
      start();
      return stop;
    }
    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting ? start() : stop()),
      { threshold: 0.1 }
    );
    io.observe(host);
    return () => { io.disconnect(); stop(); };
  }, [images]);
  if (!images?.length) return null;
  return images.map((src, i) => (
    <img
      key={src}
      ref={i === 0 ? ref : undefined}
      src={src}
      alt={alt}
      loading="lazy"
      className={`pj3-img ${i === idx ? "pj3-img-on" : ""}`}
      onError={(e) => { e.target.style.display = "none"; }}
    />
  ));
}

// Light or dark. Starts dark; a click is
// remembered in this browser (storage can be blocked, so it is guarded).
// Its own component on purpose: only this button re-renders on a switch, not
// the whole page, which is what made the circle start late.
function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "light" || saved === "dark") return saved;
    } catch { /* blocked: use the system setting */ }
    return "dark"; // dark is the default look; light only when chosen
  });
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    try { localStorage.setItem("theme", theme); } catch { /* not saved, still works */ }
  }, [theme]);

  // The new theme grows out of the button as a circle. The browser snapshots
  // the old page, we swap the theme, then the new page is revealed through a
  // circle clip that expands from the button to the farthest corner.
  const toggle = (e) => {
    const next = theme === "dark" ? "light" : "dark";
    const root = document.documentElement;
    const apply = () => {
      root.dataset.theme = next;
      flushSync(() => setTheme(next));
    };
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || calm) return apply(); // older browsers: instant swap
    const r = e.currentTarget.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    const end = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    root.classList.add("theme-switching"); // pauses the background animations meanwhile
    const vt = document.startViewTransition(apply);
    vt.ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`] },
        { duration: 550, easing: "cubic-bezier(0.4, 0, 0.2, 1)", pseudoElement: "::view-transition-new(root)" }
      );
    });
    vt.finished.finally(() => root.classList.remove("theme-switching"));
  };
  return (
    <button
      type="button"
      className="nav-icon nav-theme"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      data-label={theme === "dark" ? "Light mode" : "Dark mode"}
    >
      {theme === "dark" ? <LuSun /> : <LuMoon />}
    </button>
  );
}

// A window from the ZerefOS test: drag it by its title bar. The drag is kept
// as an offset from where the layout placed it, so on phones (no dragging)
// the windows just sit in the normal flow.
function Win({ title, className = "", children }) {
  const ref = useRef(null);
  const drag = useRef(null);
  const [z, setZ] = useState(1);
  const down = (e) => {
    if (window.innerWidth < 1400 || !window.matchMedia("(pointer: fine)").matches) return;
    const el = ref.current;
    drag.current = {
      sx: e.clientX, sy: e.clientY,
      x: parseFloat(el.style.getPropertyValue("--dx")) || 0,
      y: parseFloat(el.style.getPropertyValue("--dy")) || 0,
    };
    setZ(Date.now() % 1e6); // the window you grab comes to the front
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const move = (e) => {
    const d = drag.current;
    if (!d) return;
    // capped so a window can't be dragged off and lost
    const clamp = (v) => Math.max(-380, Math.min(380, v));
    ref.current.style.setProperty("--dx", `${clamp(d.x + e.clientX - d.sx)}px`);
    ref.current.style.setProperty("--dy", `${clamp(d.y + e.clientY - d.sy)}px`);
  };
  return (
    <div ref={ref} className={`win ${className}`} style={{ zIndex: z }}>
      <div className="win-bar" onPointerDown={down} onPointerMove={move} onPointerUp={() => (drag.current = null)}>
        <span>{title}</span>
        <i aria-hidden="true" /><i aria-hidden="true" /><i aria-hidden="true" />
      </div>
      <div className="win-body">{children}</div>
    </div>
  );
}

// Local time in Bulacan, so a visitor abroad can tell whether a reply comes today.
function LocalTime() {
  const fmt = () =>
    new Date().toLocaleTimeString("en-PH", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Manila" });
  const [t, setT] = useState(fmt);
  useEffect(() => {
    const id = setInterval(() => setT(fmt()), 20_000);
    return () => clearInterval(id);
  }, []);
  return <p className="win-time">{t}</p>;
}

function HeroDesk() {
  const now = experience[0].tracks?.find((t) => t.status !== "completed");
  return (
    <div className="hero-desk">
      <Win title="now.log" className="win-now">
        <p className="win-k">right now</p>
        <p className="win-now-title">{now?.name || experience[0].role}</p>
        <p className="win-mute">{experience[0].company}</p>
      </Win>
      <Win title="stats" className="win-stats">
        <p><b>{projects.length}</b> projects</p>
        <p><b>{projects.filter((p) => p.demo).length}</b> live demos</p>
        <p><b>{certifications.length}</b> certificates</p>
      </Win>
      <Win title="clock" className="win-clock">
        <p className="win-k">in bulacan it's</p>
        <LocalTime />
      </Win>
    </div>
  );
}

export default function App() {
  const [activeSection, setActiveSection] = useState("");
  const timelineRef = useRef(null);
  const railRef = useRef(null);

  // scroll-following fills: career timeline + right-side section rail (rAF-throttled)
  useEffect(() => {
    const el = timelineRef.current;
    let raf = null;
    const update = () => {
      raf = null;
      if (el) {
        const rect = el.getBoundingClientRect();
        const anchor = window.innerHeight * 0.55;
        const p = Math.min(1, Math.max(0, (anchor - rect.top) / rect.height));
        el.style.setProperty("--tl-progress", p.toFixed(4));
      }
      if (railRef.current) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const rp = max > 0 ? Math.min(1, window.scrollY / max) : 0;
        railRef.current.style.setProperty("--rail-progress", rp.toFixed(4));
      }
    };
    const onScroll = () => {
      if (raf == null) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf != null) cancelAnimationFrame(raf);
    };
  }, []);
  const [projFilter, setProjFilter] = useState("All");
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [openProject, setOpenProject] = useState(null);
  // projects are ordered strongest-first, so collapsing the tail hides only the
  // weakest cards (currently CafèSync, Portfolio, CLICKSILOG, Smart Scheduling)
  const PROJ_PREVIEW = projects.length - 4;
  const projGroups = ["Agentic AI", "RAG", "Building LLMs", "Fine-Tuning LLMs", "ML & Forecasting", "Web & Apps"];
  const filteredProjects =
    projFilter === "All"
      ? projects
      : projects.filter((p) => p.groups?.includes(projFilter));
  // collapse only applies to the unfiltered "All" view; a category filter shows all its matches
  const collapsing = projFilter === "All" && !showAllProjects && filteredProjects.length > PROJ_PREVIEW;
  const visibleProjects = collapsing ? filteredProjects.slice(0, PROJ_PREVIEW) : filteredProjects;

  const [certFilter, setCertFilter] = useState("All");
  const issuers = [...new Set(certifications.map((c) => c.issuer))];
  const visibleCerts =
    certFilter === "All"
      ? certifications
      : certifications.filter((c) => c.issuer === certFilter);

  useEffect(() => {
    const sections = NAV.map(([, href]) => document.querySelector(href)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(`#${entry.target.id}`);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* <BootLoader /> */}
      <Cursor />
      <ParticleField />
      <div className="bokeh" aria-hidden="true">{[1, 2, 3, 4].map((i) => <i key={i} />)}</div>
      {/* zIndex -20 (+100 for page target = 80) keeps nav/rail/statusbar sharp above the veil */}
      <GradualBlur
        target="page"
        position="bottom"
        height="5rem"
        strength={1.5}
        divCount={1}
        curve="bezier"
        zIndex={-20}
      />

      <nav>
        <BorderGlow {...GLOW_CARD_PROPS} borderRadius={18} className="nav-glow">
          <div className="nav-bar">
            <a href="#" className="nav-logo">
              zeref<span>.</span>
            </a>
            <div className="nav-actions">
              <ThemeToggle />
              <a
                href="https://github.com/Zeref538"
                target="_blank"
                rel="noreferrer"
                className="nav-icon"
                aria-label="GitHub profile"
                data-label="GitHub"
              >
                <SiGithub />
              </a>
              <a
                href="https://linkedin.com/in/john-andrei-martinez-499a0b343"
                target="_blank"
                rel="noreferrer"
                className="nav-icon"
                aria-label="LinkedIn profile"
                data-label="LinkedIn"
              >
                <LuLinkedin />
              </a>
              <a
                href="https://www.kaggle.com/johnandreimartinez"
                target="_blank"
                rel="noreferrer"
                className="nav-icon"
                aria-label="Kaggle profile"
                data-label="Kaggle"
              >
                <KaggleMark />
              </a>
              <a
                href="/cv.pdf"
                className="nav-icon"
                download
                aria-label="Download CV"
                data-label="Download CV"
              >
                <LuFileText />
              </a>
            </div>
          </div>
        </BorderGlow>
      </nav>

      <StatusBar section={activeSection} />
      {(() => {
        // Arrow keys walk the whole filtered list, not just the cards visible
        // before "show more", and wrap at both ends.
        const list = filteredProjects;
        const idx = openProject ? list.indexOf(openProject) : -1;
        const step = (d) => setOpenProject(list[(idx + d + list.length) % list.length]);
        return (
          <ProjectModal
            project={openProject}
            onClose={() => setOpenProject(null)}
            onPrev={() => step(-1)}
            onNext={() => step(1)}
          />
        );
      })()}
      <ChatDial />

      <aside className="section-rail" aria-label="Section progress" ref={railRef}>
        {NAV.map(([label, href], i) => {
          const activeIdx = NAV.findIndex(([, h]) => h === activeSection);
          const state =
            href === activeSection ? "current" : activeIdx > i ? "done" : "";
          return (
            <a key={href} href={href} className={`rail-step ${state}`}>
              <span className="rail-label">{label}</span>
              <span className="rail-dot" />
            </a>
          );
        })}
      </aside>

      <header className="hero" id="home">
        <div className="container">
          <div className="hero-text">
          <div className="hero-status">
            <span className="dot" />
            training - Backend AI Engineering @ FlyRank AI
          </div>
          <div className="boot-log" aria-hidden="true">
            <span>[ ok ] modules loaded - cv · ml · data</span>
            <span>[ ok ] models warm · pipeline ready</span>
          </div>
          <TypedPrompt text="zeref@portfolio:~$ whoami" />
          <h1>
            <span className="name-anim">{profile.name.split(" ").slice(0, -1).join(" ")}</span>{" "}
            <span className="name-anim name-accent">{profile.name.split(" ").slice(-1)[0]}</span>
            <br />
            <span className="role-line">
              <span className="role-lead">Aspiring</span>{" "}
              <span className="rotating-slot">
                <span className="rotating-placeholder" aria-hidden="true">
                  Machine Learning Engineer
                </span>
                <RotatingText
                texts={[
                  "Data Analyst",
                  "AI Engineer",
                  "Machine Learning Engineer",
                ]}
                mainClassName="rotating-role"
                staggerFrom="last"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-120%" }}
                staggerDuration={0.025}
                splitLevelClassName="rotating-role-split"
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                  rotationInterval={4200}
                />
              </span>
            </span>
          </h1>
          <p className="tagline">{profile.tagline}</p>
          <div className="hero-actions">
            <Magnet padding={60} magnetStrength={4}>
              <a href="#contact" className="btn btn-primary">Get in Touch</a>
            </Magnet>
            <a href="/cv.pdf" className="btn btn-ghost btn-cv" download>
              Download CV
            </a>
          </div>
          </div>
          <HeroDesk />
        </div>
      </header>

      <main>
        <section id="about">
          <Reveal className="container">
            <div className="section-label"><span className="prompt-sym" aria-hidden="true">❯</span> cat about.md</div>
            <div className="section-out"># identity · education · zeref-bot attached</div>
            <div className="about-grid">
              <div className="about-text">
                {/* One card: the photo and name used to float above it, which
                    read as two unrelated blocks next to a single chat panel.
                    Education was also its own section further down, and the bio
                    prose repeated what the card already showed - so all of it
                    collapsed into this. */}
                {education.map((ed) => (
                  <GlowCard key={ed.school} className="edu-glow">
                    <div className="card-body edu-card">
                      <div className="about-id">
                        <img
                          className="about-photo"
                          src={profile.photo}
                          alt={profile.name}
                          width="320"
                          height="320"
                          loading="lazy"
                        />
                        <div>
                          <div className="about-id-name">{profile.name}</div>
                          <div className="about-id-role">{profile.role} · {profile.location}</div>
                        </div>
                      </div>
                      <div className="edu-main">
                        <div className="timeline-period">{ed.period}</div>
                        <h3 className="edu-school-big">{ed.school}</h3>
                        <div className="edu-degree">{ed.degree}</div>
                      </div>
                      {ed.highlights.length > 0 && (
                        <div className="edu-side">
                          <div className="edu-side-label"># honors &amp; awards</div>
                          <div className="edu-highlights">
                            {ed.highlights.map((h) => (
                              <div className="hon" key={h}>- {h}</div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </GlowCard>
                ))}
              </div>
              <div className="about-chat">
                <GlowCard>
                  <ChatWidget />
                </GlowCard>
              </div>
            </div>
          </Reveal>
        </section>

        <section id="experience">
          <Reveal className="container">
            <div className="section-label"><span className="prompt-sym" aria-hidden="true">❯</span> git log --career</div>
            <div className="section-out"># {experience.length} commits on branch career/main</div>
            <div className="timeline" ref={timelineRef}>
              {experience.map((exp, idx) => (
                <div
                  className={`timeline-item ${idx % 2 === 0 ? "left" : "right"}`}
                  key={exp.role + exp.company}
                >
                  <div className="timeline-marker" />
                  <BorderGlow
                    edgeSensitivity={20}
                    glowColor="258 90 76"
                    backgroundColor="var(--surface)"
                    borderRadius={16}
                    glowRadius={30}
                    glowIntensity={1.0}
                    coneSpread={25}
                    colors={["var(--accent)", "var(--accent-2)", "var(--accent)"]}
                    className="timeline-card"
                  >
                    <div className="timeline-content">
                      <div className="timeline-period">
                        {exp.period} · {exp.location}
                      </div>
                      <h3 className="exp-role">{exp.role}</h3>
                      <div className="exp-company">{exp.company}</div>
                      {exp.tracks ? (
                        <div className="exp-tracks">
                          {exp.tracks.map((t) => <ExpTrack key={t.name} t={t} />)}
                        </div>
                      ) : (
                        <ul className="exp-bullets">
                          {exp.bullets.map((b, i) => <li key={i}>{b}</li>)}
                        </ul>
                      )}
                    </div>
                  </BorderGlow>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        <section id="projects">
          <Reveal className="container">
            <div className="section-label"><span className="prompt-sym" aria-hidden="true">❯</span> ls projects/</div>
            <div className="section-out"># {projects.length} repos · {projects.filter((p) => p.demo).length} live deployments</div>
            <div className="cert-filters">
              <button
                type="button"
                className={`cert-filter ${projFilter === "All" ? "active" : ""}`}
                onClick={() => setProjFilter("All")}
              >
                All <span className="cert-count">{projects.length}</span>
              </button>
              {projGroups.map((g) => (
                <button
                  type="button"
                  key={g}
                  className={`cert-filter ${projFilter === g ? "active" : ""}`}
                  onClick={() => setProjFilter(g)}
                >
                  {g}
                  <span className="cert-count">
                    {projects.filter((p) => p.groups?.includes(g)).length}
                  </span>
                </button>
              ))}
            </div>
            <div className="projects-grid">
              {visibleProjects.map((p, i) => (
                <Reveal key={p.title} className="pj-item" style={{ "--i": i }}>
                  <GlowCard className="pj3-glow" borderRadius={30}>
                    {(() => {
                      // A click opens the enlarged card (ProjectModal) on every
                      // device. The case-study page is its "Check out" button.
                      const open = () => setOpenProject(p);
                      return (
                    <article
                      className="pj3"
                      role="button"
                      tabIndex={0}
                      aria-haspopup="dialog"
                      onClick={open}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          open();
                        }
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      {/* cover: screenshot / gif of the live app */}
                      <div className="pj3-cover">
                        <div className="pj3-ph">
                          <span className="pj-shot-mono">{p.title.split(" ")[0]}</span>
                          {p.metric && <span className="pj-shot-metric">▸ {p.metric}</span>}
                        </div>
                        <CyclingCover
                          images={p.images?.length ? p.images : p.image ? [p.image] : []}
                          alt={`${p.title} preview`}
                        />
                      </div>

                      {/* always-visible details under the cover */}
                      <div className="pj3-info">
                        <h3>{p.title}</h3>
                        <span className="pj3-meta">{p.category}</span>
                        <p className="pj3-desc">{p.description}</p>
                        <div className="tags pj3-tags">
                          {p.tags.slice(0, 5).map((t) => <span className="tag" key={t}>{t}</span>)}
                        </div>
                        <div className="pj3-links">
                          {p.demo && (
                            <a href={p.demo} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
                              <LuArrowUpRight /> {p.demoLabel || "live demo"}
                            </a>
                          )}
                          {p.link && (
                            <a href={p.link} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
                              <SiGithub /> source
                            </a>
                          )}
                        </div>
                      </div>

                      {/* hover: full details */}
                      <div className="pj3-overlay">
                        <h3>{p.title}</h3>
                        <span className="pj3-meta">{p.category} · {p.date}</span>
                        {p.metric && <div className="pj3-stat">▸ {p.metric}</div>}
                        <p className="pj3-desc">{p.description}</p>
                        <div className="pj3-sec">// impact</div>
                        <ul className="pj3-highlights">
                          {p.highlights.map((h) => <li key={h}>{h}</li>)}
                        </ul>
                        <div className="pj3-sec">// full stack</div>
                        <div className="tags pj3-tags">
                          {p.tags.map((t) => <span className="tag" key={t}>{t}</span>)}
                        </div>
                        <div className="pj3-links">
                          {p.demo && (
                            <a href={p.demo} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
                              <LuArrowUpRight /> {p.demoLabel || "live demo"}
                            </a>
                          )}
                          {p.link && (
                            <a href={p.link} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
                              <SiGithub /> source
                            </a>
                          )}
                        </div>
                      </div>
                    </article>
                      );
                    })()}
                  </GlowCard>
                </Reveal>
              ))}
            </div>
            {projFilter === "All" && filteredProjects.length > PROJ_PREVIEW && (
              <button
                type="button"
                className="pj-showmore"
                onClick={() => setShowAllProjects((v) => !v)}
              >
                {showAllProjects
                  ? "show less"
                  : `show ${filteredProjects.length - PROJ_PREVIEW} more`}
              </button>
            )}
          </Reveal>
        </section>

        <section id="certifications">
          <Reveal className="container">
            <div className="section-label"><span className="prompt-sym" aria-hidden="true">❯</span> ls certs/</div>
            <div className="section-out"># {certifications.length} credentials · all verified ✓</div>
            <div className="cert-filters">
              <button
                type="button"
                className={`cert-filter ${certFilter === "All" ? "active" : ""}`}
                onClick={() => setCertFilter("All")}
              >
                All <span className="cert-count">{certifications.length}</span>
              </button>
              {issuers.map((iss) => (
                <button
                  type="button"
                  key={iss}
                  className={`cert-filter ${certFilter === iss ? "active" : ""}`}
                  onClick={() => setCertFilter(iss)}
                >
                  <IssuerIcon issuer={iss} />
                  {iss}
                  <span className="cert-count">
                    {certifications.filter((c) => c.issuer === iss).length}
                  </span>
                </button>
              ))}
            </div>
            <div className="certs-grid">
              {visibleCerts.map((c) => (
                <CertCard key={c.name} c={c} />
              ))}
            </div>
          </Reveal>
        </section>

        <section id="skills">
          <Reveal className="container">
            <div className="section-label"><span className="prompt-sym" aria-hidden="true">❯</span> nvidia-smi --skills</div>
            <div className="section-out"># {skills.reduce((n, g) => n + g.items.length, 0)} packages installed across {skills.length} groups</div>
            {skills.map((g) => (
              <div className="stack-group" key={g.group}>
                <h3 className="stack-group-title">{g.group}</h3>
                <div className="stack-grid">
                  {g.items.map((s, i) => (
                    <GlowCard key={s} className="stack-glow">
                      <div className="stack-tile" style={{ "--i": i }}>
                        <SkillIcon name={s} />
                        <span className="stack-tile-name">{s}</span>
                      </div>
                    </GlowCard>
                  ))}
                </div>
              </div>
            ))}
          </Reveal>
        </section>

        <section id="contact" className="contact">
          <Reveal className="container">
            <div className="section-label" style={{ justifyContent: "center" }}><span className="prompt-sym" aria-hidden="true">❯</span> ssh zeref@contact</div>
            <div className="section-out" style={{ textAlign: "center" }}># connection open · awaiting message</div>
            <ScrollFloat
              animationDuration={1}
              ease="back.inOut(2)"
              scrollStart="top bottom-=10%"
              scrollEnd="center center+=20%"
              stagger={0.03}
            >
              Let's build something that matters.
            </ScrollFloat>
            <p>
              Open to AI / ML engineering and data analytics roles - internships or
              entry-level. I ship end-to-end and learn fast. Based in {profile.location}.
            </p>
            <ContactForm />
            <div className="contact-links">
              <CopyButton value={profile.email} className="contact-icon" labelIdle="Email" />
              <CopyButton
                value="09934466975"
                className="contact-icon"
                labelIdle="Phone"
                icon={<LuPhone />}
              />
              {profile.links.map((l) => (
                <a
                  key={l.label}
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                  className="contact-icon"
                  aria-label={l.label}
                  data-label={l.label}
                >
                  {l.label === "GitHub" ? <SiGithub /> : <LuLinkedin />}
                </a>
              ))}
              <a
                href="https://www.kaggle.com/johnandreimartinez"
                target="_blank"
                rel="noreferrer"
                className="contact-icon"
                aria-label="Kaggle"
                data-label="Kaggle"
              >
                <KaggleMark />
              </a>
            </div>
          </Reveal>
        </section>
      </main>

    </>
  );
}
