// Build-time RAG indexer for zeref-bot.
// Ingests the portfolio's real content (structured data.js + knowledge/*.md +
// project READMEs), chunks it, embeds each chunk with Azure OpenAI embeddings,
// and writes api/_index.json — the static vector index the chat function retrieves over.
//
// Run locally (needs the Azure key + an embeddings deployment):
//   node scripts/build-index.mjs
// Then commit api/_index.json. No external vector DB — retrieval is cosine similarity.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT?.replace(/\/$/, "");
const KEY = process.env.AZURE_OPENAI_KEY;
const EMBED_DEPLOYMENT = process.env.AZURE_OPENAI_EMBED_DEPLOYMENT || "text-embedding-3-small";
const API_VERSION = "2024-02-01";

if (!ENDPOINT || !KEY) {
  console.error("Missing AZURE_OPENAI_ENDPOINT / AZURE_OPENAI_KEY. Set them (e.g. in .env.local) and retry.");
  process.exit(1);
}

// ---- 1. gather source documents -------------------------------------------
async function loadDocs() {
  const docs = [];

  // structured data.js — one focused doc per section so retrieval is granular
  const data = await import(pathToFileURL(path.join(ROOT, "src", "data.js")).href);
  const { profile, experience, projects, skills, certifications, education } = data;

  docs.push({
    source: "profile",
    title: `${profile.name} — ${profile.role}`,
    text: `${profile.name}, ${profile.role}. ${profile.tagline}\nLocation: ${profile.location}. Email: ${profile.email}.\n${profile.about.join("\n")}`,
  });

  for (const e of experience) {
    docs.push({
      source: "experience",
      title: `${e.role} @ ${e.company}`,
      text: `${e.role} at ${e.company} (${e.period}, ${e.location}).\n${e.bullets.map((b) => `- ${b}`).join("\n")}`,
    });
  }

  for (const p of projects) {
    docs.push({
      source: "project",
      title: p.title,
      text: `${p.title} [${p.category}, ${p.date}] — ${p.description}\nTech: ${p.tags.join(", ")}\nHighlights:\n${p.highlights.map((h) => `- ${h}`).join("\n")}\nRepo: ${p.link}${p.demo ? ` | Demo: ${p.demo}` : ""}`,
    });
  }

  docs.push({
    source: "skills",
    title: "Skills",
    text: skills.map((g) => `${g.group}: ${g.items.join(", ")}`).join("\n"),
  });
  docs.push({
    source: "certifications",
    title: "Certifications",
    text: certifications.map((c) => `- ${c.name} (${c.issuer}, ${c.year})`).join("\n"),
  });
  docs.push({
    source: "education",
    title: "Education",
    text: education.map((e) => `${e.degree}, ${e.school} (${e.period}). ${e.highlights.join("; ")}`).join("\n"),
  });

  // free-form markdown: knowledge/*.md (about, faq, notes)
  const kdir = path.join(ROOT, "knowledge");
  if (fs.existsSync(kdir)) {
    for (const f of fs.readdirSync(kdir).filter((f) => f.endsWith(".md"))) {
      const text = fs.readFileSync(path.join(kdir, f), "utf8").trim();
      if (text) docs.push({ source: `knowledge/${f}`, title: f.replace(/\.md$/, ""), text });
    }
  }

  // project READMEs that live in the repo (deep implementation detail)
  const idir = path.join(ROOT, "img");
  if (fs.existsSync(idir)) {
    for (const dir of fs.readdirSync(idir)) {
      const rp = path.join(idir, dir, "README.md");
      if (fs.existsSync(rp)) {
        const text = fs.readFileSync(rp, "utf8").trim();
        if (text) docs.push({ source: `readme/${dir}`, title: `${dir} README`, text });
      }
    }
  }

  return docs;
}

// ---- 2. chunk long docs ----------------------------------------------------
function chunk(text, target = 900, overlap = 150) {
  const paras = text.split(/\n{2,}/);
  const chunks = [];
  let buf = "";
  for (const p of paras) {
    if ((buf + "\n\n" + p).length > target && buf) {
      chunks.push(buf.trim());
      buf = buf.slice(Math.max(0, buf.length - overlap));
    }
    buf += (buf ? "\n\n" : "") + p;
  }
  if (buf.trim()) chunks.push(buf.trim());
  return chunks;
}

// ---- 3. embed --------------------------------------------------------------
async function embed(input) {
  const r = await fetch(
    `${ENDPOINT}/openai/deployments/${EMBED_DEPLOYMENT}/embeddings?api-version=${API_VERSION}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "api-key": KEY },
      body: JSON.stringify({ input }),
    }
  );
  if (!r.ok) throw new Error(`embed failed ${r.status}: ${(await r.text()).slice(0, 300)}`);
  const j = await r.json();
  return j.data.map((d) => d.embedding);
}

// ---- main ------------------------------------------------------------------
const docs = await loadDocs();
const records = [];
for (const d of docs) {
  for (const c of chunk(d.text)) {
    records.push({ source: d.source, title: d.title, text: c });
  }
}
console.log(`Embedding ${records.length} chunks from ${docs.length} docs via ${EMBED_DEPLOYMENT} ...`);

// batch to stay well under request limits
const BATCH = 16;
for (let i = 0; i < records.length; i += BATCH) {
  const batch = records.slice(i, i + BATCH);
  const vecs = await embed(batch.map((b) => b.text));
  batch.forEach((b, j) => (b.embedding = vecs[j]));
  process.stdout.write(`  ${Math.min(i + BATCH, records.length)}/${records.length}\r`);
}

const out = {
  model: EMBED_DEPLOYMENT,
  dim: records[0]?.embedding.length || 0,
  built_at: new Date().toISOString(),
  records,
};
fs.writeFileSync(path.join(ROOT, "api", "_index.json"), JSON.stringify(out));
console.log(`\nWrote api/_index.json — ${records.length} chunks, dim ${out.dim}`);
