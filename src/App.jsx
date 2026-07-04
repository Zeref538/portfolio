import Cursor from "./components/Cursor.jsx";
import ParticleField from "./components/ParticleField.jsx";
import Reveal from "./components/Reveal.jsx";
import Shuffle from "./components/Shuffle.jsx";
import ScrollFloat from "./components/ScrollFloat.jsx";
import ScrollReveal from "./components/ScrollReveal.jsx";
import Magnet from "./components/Magnet.jsx";
import BorderGlow from "./components/BorderGlow.jsx";
import RotatingText from "./components/RotatingText.jsx";
import { useEffect, useRef, useState } from "react";
import { profile, experience, projects, skills, certifications, education } from "./data.js";
import GitHubActivity from "./components/GitHubActivity.jsx";
import { SkillIcon, IssuerIcon } from "./skillIcons.jsx";
import { LuEye, LuExternalLink, LuBadgeCheck, LuArrowUpRight, LuDownload } from "react-icons/lu";
import { SiGithub } from "react-icons/si";

const NAV = [
  ["About", "#about"],
  ["Experience", "#experience"],
  ["Projects", "#projects"],
  ["GitHub", "#github"],
  ["Skills", "#skills"],
  ["Certifications", "#certifications"],
  ["Contact", "#contact"],
];

const GLOW_CARD_PROPS = {
  edgeSensitivity: 20,
  glowColor: "258 90 76",
  backgroundColor: "#0d1117",
  borderRadius: 12,
  glowRadius: 30,
  glowIntensity: 1.0,
  coneSpread: 25,
  colors: ["#8b5cf6", "#22d3ee", "#a78bfa"],
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

function GlowCard({ className = "", children }) {
  return (
    <BorderGlow {...GLOW_CARD_PROPS} className={className}>
      {children}
    </BorderGlow>
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
      <Cursor />
      <ParticleField />

      <nav>
        <div className="nav-bar">
          <a href="#" className="nav-logo">
            zeref<span>.</span>
          </a>
          <div className="nav-actions">
            <a
              href="https://github.com/Zeref538"
              target="_blank"
              rel="noreferrer"
              className="nav-icon"
              aria-label="GitHub profile"
            >
              <SiGithub />
            </a>
            <a href="/resume.pdf" className="nav-resume" download>
              <LuDownload /> Resume
            </a>
            <a href={`mailto:${profile.email}`} className="nav-cta">
              Get in Touch
            </a>
          </div>
        </div>
      </nav>

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

      <header className="hero">
        <div className="container">
          <div className="hero-status">
            <span className="dot" />
            training — ML Engineering Intern @ FlyRank AI
          </div>
          <TypedPrompt text="zeref@portfolio:~$ whoami" />
          <h1>
            <Shuffle
              tag="span"
              text={profile.name.split(" ").slice(0, -1).join(" ")}
              textAlign="left"
              shuffleDirection="right"
              duration={0.35}
              animationMode="evenodd"
              shuffleTimes={1}
              ease="power3.out"
              stagger={0.03}
              threshold={0.1}
              triggerOnce={true}
              triggerOnHover
              respectReducedMotion={true}
            />{" "}
            <Shuffle
              tag="span"
              className="accent"
              text={profile.name.split(" ").slice(-1)[0]}
              textAlign="left"
              shuffleDirection="right"
              duration={0.35}
              animationMode="evenodd"
              shuffleTimes={1}
              ease="power3.out"
              stagger={0.03}
              threshold={0.1}
              triggerOnce={true}
              triggerOnHover
              respectReducedMotion={true}
            />
            <br />
            <span className="role-line">
              Aspiring{" "}
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
                  rotationInterval={2800}
                />
              </span>
            </span>
          </h1>
          <p className="tagline">{profile.tagline}</p>
          <div className="hero-actions">
            <Magnet padding={60} magnetStrength={4}>
              <a href={`mailto:${profile.email}`} className="btn btn-primary">Get in Touch</a>
            </Magnet>
            <a href="/resume.pdf" className="btn btn-ghost" download>
              Download Resume
            </a>
          </div>
        </div>
      </header>

      <main>
        <section id="about">
          <Reveal className="container">
            <div className="section-label">$ cat about.md</div>
            <div className="about-text">
              <ScrollReveal
                baseOpacity={0.1}
                enableBlur
                baseRotation={3}
                blurStrength={4}
              >
                {profile.about[0]}
              </ScrollReveal>
              {profile.about.slice(1).map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </Reveal>
        </section>

        <section id="experience">
          <Reveal className="container">
            <div className="section-label">$ git log --career</div>
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
                    backgroundColor="#0d1117"
                    borderRadius={16}
                    glowRadius={30}
                    glowIntensity={1.0}
                    coneSpread={25}
                    colors={["#8b5cf6", "#22d3ee", "#a78bfa"]}
                    className="timeline-card"
                  >
                    <div className="timeline-content">
                      <div className="timeline-period">
                        {exp.period} · {exp.location}
                      </div>
                      <h3 className="exp-role">{exp.role}</h3>
                      <div className="exp-company">{exp.company}</div>
                      <ul className="exp-bullets">
                        {exp.bullets.map((b, i) => <li key={i}>{b}</li>)}
                      </ul>
                    </div>
                  </BorderGlow>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        <section id="projects">
          <Reveal className="container">
            <div className="section-label">$ ls projects/</div>
            <div className="projects-grid">
              {projects.map((p, i) => (
                <Reveal
                  key={p.title}
                  className={`pj-item ${i % 2 === 0 ? "from-left" : "from-right"}`}
                >
                <GlowCard>
                  <article className="card-body project-card">
                    <div className="pj-head">
                      <span className="pj-num">{String(i + 1).padStart(2, "0")}</span>
                      <span className="pj-dash" />
                      <span className="pj-cat">{p.category}</span>
                      <span className="pj-dash" />
                      <span className="pj-date">{p.date}</span>
                    </div>
                    <div className="pj-title-row">
                      <span className="pj-logo">{p.title.charAt(0)}</span>
                      <h3>{p.title}</h3>
                      <span className="pj-actions">
                        {p.link && (
                          <a
                            href={p.link}
                            target="_blank"
                            rel="noreferrer"
                            className="pj-open"
                            aria-label={`${p.title} source on GitHub`}
                            title="Source code"
                          >
                            <SiGithub />
                          </a>
                        )}
                        {p.demo && (
                          <a
                            href={p.demo}
                            target="_blank"
                            rel="noreferrer"
                            className="pj-open pj-open-demo"
                            aria-label={`${p.title} live demo`}
                            title="Live demo"
                          >
                            <LuArrowUpRight />
                          </a>
                        )}
                      </span>
                    </div>
                    <p className="project-desc">{p.description}</p>
                    <div className="pj-shot">
                      {p.image ? (
                        <img src={p.image} alt={`${p.title} screenshot`} loading="lazy" />
                      ) : (
                        <div className="pj-shot-ph">
                          <span className="pj-shot-mono">{p.title.split(" ")[0]}</span>
                          {p.metric && <span className="pj-shot-metric">▸ {p.metric}</span>}
                        </div>
                      )}
                      {(p.demo || p.link) && (
                        <a
                          href={p.demo || p.link}
                          target="_blank"
                          rel="noreferrer"
                          className="pj-explore"
                          aria-label={`Explore ${p.title}`}
                        >
                          <LuEye />
                          <span>{p.demo ? "open live demo" : "view source"}</span>
                        </a>
                      )}
                    </div>
                    <div className="tags">
                      {p.tags.map((t) => <span className="tag" key={t}>{t}</span>)}
                    </div>
                  </article>
                </GlowCard>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </section>

        <section id="github">
          <Reveal className="container">
            <div className="section-label">$ git log --github</div>
            <GitHubActivity />
          </Reveal>
        </section>

        <section id="skills">
          <Reveal className="container">
            <div className="section-label">$ nvidia-smi --skills</div>
            {skills.map((g) => (
              <div className="stack-group" key={g.group}>
                <h3 className="stack-group-title">{g.group}</h3>
                <div className="stack-grid">
                  {g.items.map((s, i) => (
                    <div className="stack-tile" key={s.name} style={{ "--i": i }}>
                      <SkillIcon name={s.name} />
                      <span className="stack-tile-name">{s.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </Reveal>
        </section>

        <section id="certifications">
          <Reveal className="container">
            <div className="section-label">$ ls certs/</div>
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
                <GlowCard key={c.name}>
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
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noreferrer"
                        className="badge-verify"
                      >
                        <LuExternalLink /> Verify
                      </a>
                    )}
                  </div>
                </GlowCard>
              ))}
            </div>
          </Reveal>
        </section>

        <section id="education">
          <Reveal className="container">
            <div className="section-label">$ cat education.txt</div>
            <div className="timeline-h">
              {[...education].reverse().map((ed) => (
                <div className="timeline-h-item" key={ed.school}>
                  <div className="timeline-marker" />
                  <GlowCard>
                    <div className="card-body">
                      <div className="timeline-period">{ed.period}</div>
                      <h3 className="edu-school">{ed.school}</h3>
                      <div className="exp-company">{ed.degree}</div>
                      {ed.highlights.length > 0 && (
                        <div className="edu-highlights">
                          {ed.highlights.map((h) => <span className="tag" key={h}>{h}</span>)}
                        </div>
                      )}
                    </div>
                  </GlowCard>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        <section id="contact" className="contact">
          <Reveal className="container">
            <div className="section-label" style={{ justifyContent: "center" }}>$ ssh zeref@contact</div>
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
              Open to ML/AI engineering internships and entry-level roles —
              especially in accessibility and civic tech. Based in {profile.location}.
            </p>
            <div className="hero-actions" style={{ justifyContent: "center" }}>
              <a href={`mailto:${profile.email}`} className="btn btn-primary">
                {profile.email}
              </a>
              {profile.links.map((l) => (
                <a key={l.label} href={l.url} target="_blank" rel="noreferrer" className="btn btn-ghost">
                  {l.label}
                </a>
              ))}
            </div>
          </Reveal>
        </section>
      </main>

      <footer>
        <div className="container">
          <span className="footer-exit">process exited with code 0</span>
          <br />
          © {new Date().getFullYear()} {profile.name} · Built with React + Vite
        </div>
      </footer>
    </>
  );
}
