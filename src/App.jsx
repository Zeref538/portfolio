import Cursor from "./components/Cursor.jsx";
import ParticleField from "./components/ParticleField.jsx";
import Reveal from "./components/Reveal.jsx";
import ScrollFloat from "./components/ScrollFloat.jsx";
import ScrollReveal from "./components/ScrollReveal.jsx";
import Magnet from "./components/Magnet.jsx";
import BorderGlow from "./components/BorderGlow.jsx";
import RotatingText from "./components/RotatingText.jsx";
import { useEffect, useRef, useState } from "react";
import { profile, experience, projects, skills, certifications, education } from "./data.js";
import ContactForm from "./components/ContactForm.jsx";
import GradualBlur from "./components/GradualBlur.jsx";
import Noise from "./components/Noise.jsx";
import StatusBar from "./components/StatusBar.jsx";
import ChatWidget from "./components/ChatWidget.jsx";
import { SkillIcon, IssuerIcon } from "./skillIcons.jsx";
import { LuExternalLink, LuBadgeCheck, LuArrowUpRight, LuFileText, LuMessageSquare, LuLinkedin } from "react-icons/lu";
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
      <Noise patternAlpha={22} />
      {/* zIndex -20 (+100 for page target = 80) keeps nav/rail/statusbar sharp above the veil */}
      <GradualBlur
        target="page"
        position="bottom"
        height="5rem"
        strength={1.5}
        divCount={2}
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
                href="/cv.pdf"
                className="nav-icon"
                download
                aria-label="Download CV"
                data-label="Download CV"
              >
                <LuFileText />
              </a>
              <a
                href={`mailto:${profile.email}`}
                className="nav-icon"
                aria-label="Get in touch"
                data-label="Get in Touch"
              >
                <LuMessageSquare />
              </a>
            </div>
          </div>
        </BorderGlow>
      </nav>

      <StatusBar section={activeSection} />

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
          <div className="hero-status">
            <span className="dot" />
            training — ML Engineering Intern @ FlyRank AI
          </div>
          <div className="boot-log" aria-hidden="true">
            <span>[ ok ] modules loaded — cv · ml · data</span>
            <span>[ ok ] models warm · pipeline ready</span>
          </div>
          <TypedPrompt text="zeref@portfolio:~$ whoami" />
          <h1>
            <span className="name-anim">{profile.name.split(" ").slice(0, -1).join(" ")}</span>{" "}
            <span className="name-anim name-accent">{profile.name.split(" ").slice(-1)[0]}</span>
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
                  rotationInterval={4200}
                />
              </span>
            </span>
          </h1>
          <p className="tagline">{profile.tagline}</p>
          <div className="hero-actions">
            <Magnet padding={60} magnetStrength={4}>
              <a href={`mailto:${profile.email}`} className="btn btn-primary">Get in Touch</a>
            </Magnet>
            <a href="/cv.pdf" className="btn btn-ghost btn-cv" download>
              Download CV
            </a>
          </div>
        </div>
      </header>

      <main>
        <section id="about">
          <Reveal className="container">
            <div className="section-label">$ cat about.md</div>
            <div className="section-out"># rendering bio — 3 blocks · zeref-bot attached</div>
            <div className="about-grid">
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
            <div className="section-label">$ git log --career</div>
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
            <div className="section-out"># {projects.length} repos · 2 live deployments</div>
            <div className="projects-grid">
              {projects.map((p, i) => (
                <Reveal key={p.title} className="pj-item" style={{ "--i": i }}>
                  <GlowCard className="pj3-glow">
                    <article className="pj3">
                      {/* cover: screenshot / gif of the live app */}
                      <div className="pj3-cover">
                        <div className="pj3-ph">
                          <span className="pj-shot-mono">{p.title.split(" ")[0]}</span>
                          {p.metric && <span className="pj-shot-metric">▸ {p.metric}</span>}
                        </div>
                        {p.image && (
                          <img
                            src={p.image}
                            alt={`${p.title} preview`}
                            loading="lazy"
                            onError={(e) => { e.target.style.display = "none"; }}
                          />
                        )}
                        <div className="pj3-caption">
                          <h3>{p.title.split("—")[0].trim()}</h3>
                          <span>{p.category} · {p.date}</span>
                        </div>
                      </div>

                      {/* hover: full details */}
                      <div className="pj3-overlay">
                        <h3>{p.title.split("—")[0].trim()}</h3>
                        <span className="pj3-meta">{p.category} · {p.date}{p.metric ? ` · ${p.metric}` : ""}</span>
                        <p className="pj3-desc">{p.description}</p>
                        <ul className="pj3-highlights">
                          {p.highlights.map((h) => <li key={h}>{h}</li>)}
                        </ul>
                        <div className="tags pj3-tags">
                          {p.tags.map((t) => <span className="tag" key={t}>{t}</span>)}
                        </div>
                        <div className="pj3-links">
                          {p.demo && (
                            <a href={p.demo} target="_blank" rel="noreferrer">
                              <LuArrowUpRight /> live demo
                            </a>
                          )}
                          {p.link && (
                            <a href={p.link} target="_blank" rel="noreferrer">
                              <SiGithub /> source
                            </a>
                          )}
                        </div>
                      </div>
                    </article>
                  </GlowCard>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </section>

        <section id="certifications">
          <Reveal className="container">
            <div className="section-label">$ ls certs/</div>
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

        <section id="skills">
          <Reveal className="container">
            <div className="section-label">$ nvidia-smi --skills</div>
            <div className="section-out"># {skills.reduce((n, g) => n + g.items.length, 0)} packages installed across {skills.length} groups</div>
            {skills.map((g) => (
              <div className="stack-group" key={g.group}>
                <h3 className="stack-group-title">{g.group}</h3>
                <div className="stack-grid">
                  {g.items.map((s, i) => (
                    <div className="stack-tile" key={s} style={{ "--i": i }}>
                      <SkillIcon name={s} />
                      <span className="stack-tile-name">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </Reveal>
        </section>

        <section id="education">
          <Reveal className="container">
            <div className="section-label">$ cat education.txt</div>
            <div className="section-out"># {education.length} records · 2011 → 2027</div>
            {education.map((ed) => (
              <GlowCard key={ed.school}>
                <div className="card-body edu-card">
                  <div className="edu-main">
                    <div className="timeline-period">{ed.period}</div>
                    <h3 className="edu-school-big">{ed.school}</h3>
                    <div className="edu-degree">{ed.degree}</div>
                  </div>
                  {ed.highlights.length > 0 && (
                    <div className="edu-side">
                      <div className="edu-side-label"># honors & awards</div>
                      <div className="edu-highlights">
                        {ed.highlights.map((h) => <span className="tag" key={h}>{h}</span>)}
                      </div>
                    </div>
                  )}
                </div>
              </GlowCard>
            ))}
          </Reveal>
        </section>

        <section id="contact" className="contact">
          <Reveal className="container">
            <div className="section-label" style={{ justifyContent: "center" }}>$ ssh zeref@contact</div>
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
              Open to ML/AI engineering internships and entry-level roles —
              especially in accessibility and civic tech. Based in {profile.location}.
            </p>
            <ContactForm />
            <div className="hero-actions contact-links" style={{ justifyContent: "center" }}>
              <a href={`mailto:${profile.email}`} className="btn btn-ghost">
                Email
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

    </>
  );
}
