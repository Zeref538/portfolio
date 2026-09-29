// The small slice of markdown the bot is told to use: **bold**, `code`,
// [links](https://...), "- " bullets, "1. " steps and "### " headings.
// Builds React elements, never HTML strings, so whatever the model outputs
// can't inject markup. Works on half-streamed text: an unclosed ** just shows
// as-is until its partner arrives.
// ponytail: no tables or nesting; add them if answers start needing them.

const INLINE = /\*\*(.+?)\*\*|`([^`]+)`|\[([^\]]+)\]\(((?:https?:\/\/|mailto:)[^)\s]+)\)/g;

function inline(text) {
  const out = [];
  let last = 0;
  for (const m of text.matchAll(INLINE)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const k = out.length;
    if (m[1]) out.push(<strong key={k}>{m[1]}</strong>);
    else if (m[2]) out.push(<code key={k} className="chat-code">{m[2]}</code>);
    else out.push(<a key={k} href={m[4]} target="_blank" rel="noopener noreferrer">{m[3]}</a>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export default function ChatText({ text }) {
  const blocks = [];
  let list = null;
  for (const line of text.split("\n")) {
    const item = line.match(/^\s*(?:([-*•])|(\d+)[.)])\s+(.*)$/);
    if (item) {
      const type = item[1] ? "ul" : "ol";
      if (!list || list.type !== type) blocks.push((list = { type, items: [] }));
      list.items.push(item[3]);
      continue;
    }
    list = null;
    if (!line.trim()) continue;
    const head = line.match(/^#{1,6}\s+(.*)$/);
    blocks.push(head ? { type: "h", text: head[1] } : { type: "p", text: line });
  }
  return blocks.map((b, i) =>
    b.type === "h" ? <p key={i} className="chat-h">{inline(b.text)}</p>
    : b.type === "p" ? <p key={i}>{inline(b.text)}</p>
    : <b.type key={i} className="chat-list">{b.items.map((t, j) => <li key={j}>{inline(t)}</li>)}</b.type>
  );
}
