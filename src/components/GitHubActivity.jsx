import { useEffect, useState } from "react";
import { LuGitCommitHorizontal, LuBookMarked, LuUsers, LuStar } from "react-icons/lu";

const USER = "Zeref538";

// Public GitHub REST API (unauthenticated: 60 req/hr per visitor - fine for a portfolio).
// Fails soft: if rate-limited or offline, the section still shows the contribution chart.
export default function GitHubActivity() {
  const [commits, setCommits] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetch(`https://api.github.com/users/${USER}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((u) => {
        if (!cancelled && u) {
          setStats({ repos: u.public_repos, followers: u.followers });
        }
      })
      .catch(() => {});

    fetch(`https://api.github.com/users/${USER}/events/public?per_page=100`)
      .then((r) => (r.ok ? r.json() : []))
      .then((events) => {
        if (cancelled || !Array.isArray(events)) return;
        const list = [];
        for (const ev of events) {
          if (ev.type !== "PushEvent") continue;
          for (const c of ev.payload.commits ?? []) {
            list.push({
              sha: c.sha.slice(0, 7),
              message: c.message.split("\n")[0],
              repo: ev.repo.name.replace(`${USER}/`, ""),
              date: ev.created_at,
              url: `https://github.com/${ev.repo.name}/commit/${c.sha}`,
            });
            if (list.length >= 6) break;
          }
          if (list.length >= 6) break;
        }
        setCommits(list);
      })
      .catch(() => {});

    return () => { cancelled = true; };
  }, []);

  const timeAgo = (iso) => {
    const s = (Date.now() - new Date(iso).getTime()) / 1000;
    if (s < 3600) return `${Math.max(1, Math.floor(s / 60))}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    return `${Math.floor(s / 86400)}d ago`;
  };

  return (
    <div className="gh-activity">
      <div className="gh-top">
        <a
          href={`https://github.com/${USER}`}
          target="_blank"
          rel="noreferrer"
          className="gh-chart-link"
          aria-label="GitHub profile"
        >
          <img
            className="gh-chart"
            src={`https://ghchart.rshah.org/8b5cf6/${USER}`}
            alt={`${USER}'s GitHub contribution chart`}
            loading="lazy"
          />
        </a>
        <div className="gh-stats">
          <span className="gh-stat">
            <LuBookMarked /> {stats ? stats.repos : "–"} public repos
          </span>
          <span className="gh-stat">
            <LuUsers /> {stats ? stats.followers : "–"} followers
          </span>
          <span className="gh-stat">
            <LuStar /> @{USER}
          </span>
        </div>
      </div>

      {commits.length > 0 && (
        <div className="gh-log">
          <div className="gh-log-title">$ git log --oneline -{commits.length}</div>
          {commits.map((c) => (
            <a
              key={c.url}
              href={c.url}
              target="_blank"
              rel="noreferrer"
              className="gh-commit"
            >
              <LuGitCommitHorizontal className="gh-commit-icon" />
              <span className="gh-sha">{c.sha}</span>
              <span className="gh-msg">{c.message}</span>
              <span className="gh-repo">{c.repo}</span>
              <span className="gh-when">{timeAgo(c.date)}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
