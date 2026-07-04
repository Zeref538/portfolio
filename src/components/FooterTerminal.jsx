import { useEffect, useState } from "react";
import { LuArrowUp, LuLinkedin } from "react-icons/lu";
import { SiGithub } from "react-icons/si";
import { profile } from "../data.js";

// Live "session uptime" — isolated so the 1s tick re-renders only this span.
function Uptime() {
  const [s, setS] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setS((v) => v + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return <span className="ft-uptime">{mm}:{ss}</span>;
}

export default function FooterTerminal() {
  const github = profile.links.find((l) => l.label === "GitHub")?.url;
  const linkedin = profile.links.find((l) => l.label === "LinkedIn")?.url;

  return (
    <footer className="ft">
      <div className="container">
        <div className="ft-terminal">
          <div className="ft-line">
            <span className="ft-prompt">zeref@portfolio:~$</span> exit
          </div>
          <div className="ft-line ft-dim">saving session · uptime <Uptime /></div>
          <div className="ft-line ft-ok">process exited with code 0</div>
          <div className="ft-line ft-dim">
            # thanks for scrolling this far — let's build something.
          </div>
        </div>

        <div className="ft-bottom">
          <span className="ft-copy">
            © {new Date().getFullYear()} {profile.name} · Bulacan, PH
          </span>
          <div className="ft-links">
            {github && (
              <a href={github} target="_blank" rel="noreferrer" aria-label="GitHub">
                <SiGithub />
              </a>
            )}
            {linkedin && (
              <a href={linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <LuLinkedin />
              </a>
            )}
            <a href={`mailto:${profile.email}`} className="ft-mail">
              {profile.email}
            </a>
          </div>
          <button
            type="button"
            className="ft-top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
          >
            <LuArrowUp /> ./top
          </button>
        </div>
      </div>
    </footer>
  );
}
