import { projects } from "./data.js";

// URL name for a project, taken from the part of the title before the dash:
// "YODA - Your Offline Data Agent" -> "yoda". Short enough to read out loud,
// which a 60-character slug is not.
export function slugify(title) {
  return title
    .split(" - ")[0]
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function findProject(slug) {
  return projects.find((p) => slugify(p.title) === slug);
}

// Two projects colliding on one slug would make the second unreachable, with
// nothing to show for it but a page quietly serving the wrong project. Checked
// at import time so it fails during `npm run build`, not in front of a visitor.
{
  const seen = new Map();
  for (const p of projects) {
    const s = slugify(p.title);
    if (seen.has(s))
      throw new Error(`duplicate project slug "${s}": "${seen.get(s)}" and "${p.title}"`);
    seen.set(s, p.title);
  }
}
