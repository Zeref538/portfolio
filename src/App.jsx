import Cursor from "./components/Cursor.jsx";
import ParticleField from "./components/ParticleField.jsx";
import Reveal from "./components/Reveal.jsx";
import Shuffle from "./components/Shuffle.jsx";
import ScrollFloat from "./components/ScrollFloat.jsx";
import ScrollReveal from "./components/ScrollReveal.jsx";
import Magnet from "./components/Magnet.jsx";
import ProfileCard from "./components/ProfileCard.jsx";
import { profile, experience, projects, skills, certifications, education } from "./data.js";

const NAV = [
  ["About", "#about"],
  ["Experience", "#experience"],
  ["Projects", "#projects"],
  ["Skills", "#skills"],
  ["Certifications", "#certifications"],
  ["Contact", "#contact"],
];

export default function App() {
  return (
    <>
      <Cursor />
      <ParticleField />

      <nav>
        <div className="container nav-inner">
          <a href="#" className="nav-logo">
            zeref<span>.</span>
          </a>
          <div className="nav-links">
            {NAV.map(([label, href]) => (
              <a key={href} href={href}>{label}</a>
            ))}
          </div>
        </div>
      </nav>

      <header className="hero">
        <div className="container hero-inner">
        <div className="hero-copy">
          <div className="hero-status">
            <span className="dot" />
            ML Engineering Intern @ FlyRank AI
          </div>
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
            {profile.role}
          </h1>
          <p className="tagline">{profile.tagline}</p>
          <div className="hero-actions">
            <a href="#projects" className="btn btn-primary">View Projects</a>
            <Magnet padding={60} magnetStrength={4}>
              <a href={`mailto:${profile.email}`} className="btn btn-ghost">Get in Touch</a>
            </Magnet>
          </div>
        </div>
        <div className="hero-card">
          <ProfileCard
            name={profile.name}
            title={profile.role}
            handle="Zeref538"
            status="Open to work"
            contactText="Contact Me"
            avatarUrl="/avatar.png"
            showUserInfo={true}
            enableTilt={true}
            enableMobileTilt={false}
            behindGlowEnabled
            behindGlowColor="rgba(139, 92, 246, 0.45)"
            innerGradient="linear-gradient(145deg, rgba(139, 92, 246, 0.4) 0%, rgba(251, 191, 36, 0.15) 100%)"
            onContactClick={() => { window.location.href = `mailto:${profile.email}`; }}
          />
        </div>
        </div>
      </header>

      <main>
        <section id="about">
          <Reveal className="container">
            <div className="section-label">About</div>
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
            <div className="section-label">Experience</div>
            <div className="timeline">
              {experience.map((exp) => (
                <div className="timeline-item" key={exp.role + exp.company}>
                  <div className="timeline-marker" />
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
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        <section id="projects">
          <Reveal className="container">
            <div className="section-label">Projects</div>
            <div className="projects-grid">
              {projects.map((p) => (
                <article className="card project-card" key={p.title}>
                  <span className="project-subtitle">{p.subtitle}</span>
                  <h3>{p.title}</h3>
                  <p className="project-desc">{p.description}</p>
                  {p.metric && <span className="project-metric">{p.metric}</span>}
                  <div className="tags">
                    {p.tags.map((t) => <span className="tag" key={t}>{t}</span>)}
                  </div>
                  {p.link && (
                    <a href={p.link} target="_blank" rel="noreferrer" className="btn btn-ghost">
                      View Project
                    </a>
                  )}
                </article>
              ))}
            </div>
          </Reveal>
        </section>

        <section id="skills">
          <Reveal className="container">
            <div className="section-label">Skills</div>
            <div className="skills-grid">
              {skills.map((g) => (
                <div className="card skill-group" key={g.group}>
                  <h3>{g.group}</h3>
                  <ul>
                    {g.items.map((s) => <li key={s}>{s}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        <section id="certifications">
          <Reveal className="container">
            <div className="section-label">Certifications</div>
            <div className="certs-grid">
              {certifications.map((c) => (
                <div className="card cert" key={c.name}>
                  <span className="cert-name">{c.name}</span>
                  <span className="cert-meta">{c.issuer} · {c.year}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        <section id="education">
          <Reveal className="container">
            <div className="section-label">Education</div>
            <div className="card">
              <h3>{education.school}</h3>
              <p style={{ color: "var(--text-muted)", marginTop: 6 }}>
                {education.degree} · {education.period}
              </p>
              <div className="edu-highlights">
                {education.highlights.map((h) => <span className="tag" key={h}>{h}</span>)}
              </div>
            </div>
          </Reveal>
        </section>

        <section id="contact" className="contact">
          <Reveal className="container">
            <div className="section-label" style={{ justifyContent: "center" }}>Contact</div>
            <ScrollFloat
              animationDuration={1}
              ease="back.inOut(2)"
              scrollStart="center bottom+=50%"
              scrollEnd="bottom bottom-=40%"
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
          © {new Date().getFullYear()} {profile.name} · Built with React + Vite
        </div>
      </footer>
    </>
  );
}
