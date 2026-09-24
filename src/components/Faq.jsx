import faqRaw from "../../knowledge/faq.md?raw";

// The same file feeds zeref-bot, so the page and the bot cannot drift into
// giving two different answers. `?raw` is Vite's way of importing a file as a
// plain string at build time - nothing is fetched when the page loads.
const PICK = [
  "Are you currently open to work",
  "When can you start",
  "Do you prefer remote",
  "What is your location and timezone",
  "What's the best way to reach you",
];

const ALL = [...faqRaw.matchAll(/\*\*Q: (.+?)\*\*\s*\nA: (.+)/g)].map((m) => ({ q: m[1], a: m[2] }));
const ITEMS = PICK.map((start) => {
  const hit = ALL.find((x) => x.q.startsWith(start));
  // Fail the build, not the visitor: a renamed question in faq.md would
  // otherwise silently drop out of the page.
  if (!hit) throw new Error(`FAQ question not found in knowledge/faq.md: "${start}"`);
  return hit;
});

export default function Faq() {
  return (
    <div className="faq">
      {/* <details> opens and closes with no JavaScript, and works with the
          keyboard and screen readers out of the box. */}
      {ITEMS.map(({ q, a }) => (
        <details className="faq-item" key={q}>
          <summary>{q}</summary>
          <p>{a}</p>
        </details>
      ))}
    </div>
  );
}
