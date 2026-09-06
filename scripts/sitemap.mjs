// Regenerate public/sitemap.xml so every project page is listed.
//
//   node scripts/sitemap.mjs
//
// A sitemap is the list a search engine reads to learn which URLs exist. The
// project pages are reachable only by clicking a card, so without this entry
// Google would likely never find them.
import { writeFileSync } from "node:fs";
import { projects } from "../src/data.js";
import { slugify } from "../src/slug.js";

const BASE = "https://johnandrei.vercel.app";
const today = new Date().toISOString().slice(0, 10);

const urls = [
  { loc: `${BASE}/`, priority: "1.0", changefreq: "monthly" },
  ...projects.map((p) => ({
    loc: `${BASE}/projects/${slugify(p.title)}`,
    priority: "0.7",
    changefreq: "monthly",
  })),
];

const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map((u) =>
    `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n` +
    `    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
  ).join("\n") +
  `\n</urlset>\n`;

writeFileSync(new URL("../public/sitemap.xml", import.meta.url), xml);
console.log(`sitemap.xml: ${urls.length} urls`);
