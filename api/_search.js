// Hybrid search over the chat index (api/_index.json). The underscore keeps
// Vercel from serving this file as an endpoint; api/chat.js and
// scripts/eval-search.mjs both import it, so the eval measures the exact code
// that runs live.
//
// Two searches, then one merged list:
// - keyword (BM25): counts the question's words in each chunk, weighting rare
//   words (CORD, NPR, RA 10911) far above common ones (project, model). Finds
//   exact names that meaning search blurs.
// - meaning: cosine similarity between the question's embedding and each
//   chunk's. Finds reworded questions that share no words with the answer.
// - fusion (reciprocal rank fusion): a chunk scores 1/(60 + its rank) in each
//   list, summed. Only ranks are used, so the two searches' very different
//   score scales never need matching up.

const words = (s) => (s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").match(/[a-z0-9]+/g) || []);

// BM25's two knobs at their textbook values: k1 caps how much repeating a word
// helps, b how much long chunks are marked down.
const K1 = 1.2, B = 0.75, RRF_K = 60;

export function buildKeywordIndex(records) {
  const docs = records.map((r) => {
    const tf = new Map();
    for (const w of words(`${r.title} ${r.text}`)) tf.set(w, (tf.get(w) || 0) + 1);
    let len = 0;
    for (const n of tf.values()) len += n;
    return { tf, len };
  });
  const df = new Map();
  for (const d of docs) for (const w of d.tf.keys()) df.set(w, (df.get(w) || 0) + 1);
  const avg = docs.reduce((s, d) => s + d.len, 0) / docs.length;
  return { docs, df, avg, n: docs.length };
}

function keywordScores(kw, query) {
  const q = [...new Set(words(query))];
  return kw.docs.map((d) => {
    let s = 0;
    for (const w of q) {
      const f = d.tf.get(w);
      if (!f) continue;
      const idf = Math.log(1 + (kw.n - kw.df.get(w) + 0.5) / (kw.df.get(w) + 0.5));
      s += idf * ((f * (K1 + 1)) / (f + K1 * (1 - B + (B * d.len) / kw.avg)));
    }
    return s;
  });
}

function cosine(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1);
}

// "FORGE - Fake Or Real Image Examiner" -> "forge"; "Hangin' - ..." -> "hangin"
export const projectKey = (title) => words(String(title).split(" - ")[0]).join("");

// Does this chunk belong to the project? Checks the card title and the README
// name ("readme/FORGE"), then the start of the text, because a few repos are
// named differently from their cards.
export function belongs(r, key) {
  const head = words(`${r.title} ${r.source}`).join("");
  return head.includes(key) || words(r.text.slice(0, 300)).join("").includes(key);
}

// mode: "keyword" | "meaning" | "hybrid". focus: a project title from the
// "ask about this project" buttons, or undefined.
export function search(records, kw, query, qv, { mode = "hybrid", k = 6, focus } = {}) {
  let ids = records.map((_, i) => i);
  if (focus) {
    const key = projectKey(focus);
    const mine = ids.filter((i) => belongs(records[i], key));
    // a project with almost nothing indexed falls back to everything
    if (mine.length >= 2) ids = mine;
  }
  const rank = (scores) => [...ids].sort((a, b) => scores[b] - scores[a]);
  const lists = [];
  if (mode !== "meaning") {
    const s = keywordScores(kw, focus ? `${focus} ${query}` : query);
    lists.push(rank(s).filter((i) => s[i] > 0));
  }
  if (mode !== "keyword" && qv) {
    const s = records.map((r) => cosine(qv, r.embedding));
    lists.push(rank(s));
  }
  const fused = new Map();
  for (const list of lists) list.forEach((i, r) => fused.set(i, (fused.get(i) || 0) + 1 / (RRF_K + r + 1)));
  return [...fused.entries()].sort((a, b) => b[1] - a[1]).slice(0, k).map(([i]) => records[i]);
}
