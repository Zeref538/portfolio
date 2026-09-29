// Does hybrid search beat keyword-only and meaning-only for the portfolio chat?
// Runs the same 40 questions through all three modes of api/_search.js (the
// code the live chat uses) and counts how often the right source lands in the
// top 6 chunks, which is what the bot actually gets to read.
//
//   node --env-file=.env.local scripts/eval-search.mjs
//
// Needs the Azure key only to embed the 40 questions (one batched call).
import { createRequire } from "node:module";
import { buildKeywordIndex, search, projectKey, belongs } from "../api/_search.js";

const INDEX = createRequire(import.meta.url)("../api/_index.json");
const records = INDEX.records;
const kw = buildKeywordIndex(records);

// [question, the source that holds the answer]. A project name is matched the
// way the ask buttons match it; "faq:" / "skills" / "certifications" etc. match
// a chunk's source. Half name the thing exactly, half describe it in other words.
const QUESTIONS = [
  ["what is FORGE?", "FORGE"],
  ["which project tells real photos from AI-generated ones?", "FORGE"],
  ["how did the image detector do on a generator it never saw?", "FORGE"],
  ["what is CORD?", "TAB"],
  ["which project reads receipts and checks the math?", "TAB"],
  ["what's the silent error rate on the receipt tool?", "TAB"],
  ["tell me about YODA", "YODA"],
  ["did he build something that cleans messy spreadsheets offline?", "YODA"],
  ["what is Alfred?", "Alfred"],
  ["does he have a voice assistant that controls the computer?", "Alfred"],
  ["how does Alfred stop a bad command?", "Alfred"],
  ["what is DEFER?", "DEFER"],
  ["did he test whether small models read the document or answer from memory?", "DEFER"],
  ["what is LiitLLM?", "LiitLLM"],
  ["has he trained a language model for Taglish?", "LiitLLM"],
  ["what is Munti?", "Munti"],
  ["tiny transformer trained on children's stories", "Munti"],
  ["what is callback-ai?", "callback-ai"],
  ["which project runs mock job interviews?", "callback-ai"],
  ["what was the Spearman correlation with human grades?", "callback-ai"],
  ["what is APAW?", "APAW"],
  ["does he forecast dam water levels?", "APAW"],
  ["what online learning library did the reservoir forecaster use?", "APAW"],
  ["what is Aegix?", "Aegix"],
  ["which project checks employment contracts against labor law?", "Aegix"],
  ["refusal calibration results", "Refusal"],
  ["did he teach a model to say I don't know?", "Refusal"],
  ["what is Hangin?", "Hangin"],
  ["air quality forecasting in the Philippines", "Hangin"],
  ["what is Fix First?", "Fix"],
  ["what did he build at the FlyRank internship capstone?", "Fix"],
  ["what is CafeSync?", "CafeSync"],
  ["coffee shop point of sale system", "CafeSync"],
  ["what is ACRA?", "ACRA"],
  ["color blindness thesis", "ACRA"],
  ["Solmara resort booking site", "Solmara"],
  ["what certifications does he have?", "certifications"],
  ["what's his education?", "education"],
  ["what are his top skills?", "skills"],
  ["is he open to work and how do I contact him?", "faq"],
];

const hit = (rec, want) =>
  /^[a-z]+$/.test(want) && records.some((r) => r.source === want || r.source.startsWith(`knowledge/${want}`))
    ? rec.source === want || rec.source.startsWith(`knowledge/${want}`)
    : belongs(rec, projectKey(want));

const endpoint = process.env.AZURE_OPENAI_ENDPOINT?.replace(/\/$/, "");
const key = process.env.AZURE_OPENAI_KEY;
const dep = process.env.AZURE_OPENAI_EMBED_DEPLOYMENT || "text-embedding-3-small";
if (!endpoint || !key) {
  console.error("Missing AZURE_OPENAI_ENDPOINT / AZURE_OPENAI_KEY. Run with --env-file=.env.local");
  process.exit(1);
}
const r = await fetch(`${endpoint}/openai/deployments/${dep}/embeddings?api-version=2024-02-01`, {
  method: "POST",
  headers: { "Content-Type": "application/json", "api-key": key },
  body: JSON.stringify({ input: QUESTIONS.map(([q]) => q) }),
});
if (!r.ok) throw new Error(`embed ${r.status}: ${(await r.text()).slice(0, 200)}`);
const vecs = (await r.json()).data.sort((a, b) => a.index - b.index).map((d) => d.embedding);

const modes = ["keyword", "meaning", "hybrid"];
const score = Object.fromEntries(modes.map((m) => [m, { hit: 0, first: 0 }]));
const misses = Object.fromEntries(modes.map((m) => [m, []]));
QUESTIONS.forEach(([q, want], i) => {
  for (const m of modes) {
    const top = search(records, kw, q, vecs[i], { mode: m, k: 6 });
    const at = top.findIndex((rec) => hit(rec, want));
    if (at >= 0) score[m].hit++;
    if (at === 0) score[m].first++;
    else if (at < 0) misses[m].push(q);
  }
});

const n = QUESTIONS.length;
console.log(`\n${n} questions, ${records.length} chunks. "in top 6" = the answer's source reached the bot.\n`);
console.log("mode      in top 6        ranked first");
for (const m of modes) console.log(`${m.padEnd(9)} ${String(score[m].hit).padStart(2)}/${n} (${Math.round((100 * score[m].hit) / n)}%)    ${String(score[m].first).padStart(2)}/${n}`);
for (const m of modes) if (misses[m].length) console.log(`\n${m} missed:\n  - ${misses[m].join("\n  - ")}`);
