// Runs after `vite build`. The site is a single-page app, so every URL gets the
// same index.html - including the homepage's title, description and canonical
// link. Google read each /projects/<slug> page as a copy of the homepage, and a
// shared project link previewed as the homepage card.
//
// This writes dist/projects/<slug>.html per project with that project's own
// head tags (vercel.json's cleanUrls serves it at /projects/<slug>), and builds
// sitemap.xml from the same project list so the two can't drift apart.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const SITE = "https://johnandrei.vercel.app";

const { projects } = await import(pathToFileURL(path.join(ROOT, "src", "data.js")).href);
const { slugify } = await import(pathToFileURL(path.join(ROOT, "src", "slug.js")).href);

const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Google shows about 155 characters of a description; cut at a word, not mid-word.
function clip(text, max = 155) {
  if (text.length <= max) return text;
  return text.slice(0, text.lastIndexOf(" ", max - 1)).replace(/[\s,;:-]+$/, "") + "...";
}

// Replace one attribute value on the single tag matched by `tag`. Throws if the
// tag is missing, so a renamed tag in index.html fails the build loudly instead
// of shipping 20 pages that silently kept the homepage's value.
function set(html, tag, attr, value) {
  const re = new RegExp(`(<${tag}[^>]*?\\s${attr}=")[^"]*(")`);
  if (!re.test(html)) throw new Error(`prerender-meta: no <${tag} ${attr}=...> in dist/index.html`);
  return html.replace(re, `$1${esc(value)}$2`);
}

const base = fs.readFileSync(path.join(DIST, "index.html"), "utf8");
fs.mkdirSync(path.join(DIST, "projects"), { recursive: true });

const urls = [`${SITE}/`];
for (const p of projects) {
  const slug = slugify(p.title);
  const url = `${SITE}/projects/${slug}`;
  const title = `${p.title} - John Andrei Martinez`;
  const desc = clip(p.description);
  const cover = p.images?.[0] || p.image;
  let html = base.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`);
  html = set(html, 'meta name="description"', "content", desc);
  html = set(html, 'link rel="canonical"', "href", url);
  html = set(html, 'meta property="og:type"', "content", "article");
  html = set(html, 'meta property="og:url"', "content", url);
  html = set(html, 'meta property="og:title"', "content", title);
  html = set(html, 'meta property="og:description"', "content", desc);
  html = set(html, 'meta name="twitter:title"', "content", title);
  html = set(html, 'meta name="twitter:description"', "content", desc);
  if (cover) {
    // a screenshot's size isn't known here, so drop the homepage card's 1200x630
    html = html.replace(/\s*<meta property="og:image:(width|height)"[^>]*>/g, "");
    html = set(html, 'meta property="og:image"', "content", SITE + cover);
    html = set(html, 'meta property="og:image:alt"', "content", `${p.title} preview`);
    html = set(html, 'meta name="twitter:image"', "content", SITE + cover);
  }
  fs.writeFileSync(path.join(DIST, "projects", `${slug}.html`), html);
  urls.push(url);
}

fs.writeFileSync(
  path.join(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((u) => `  <url><loc>${u}</loc></url>`).join("\n") +
    `\n</urlset>\n`
);
console.log(`prerender-meta: ${projects.length} project pages + sitemap (${urls.length} URLs)`);
