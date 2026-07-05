import { useEffect, useRef, useState } from "react";
import "./ChatWidget.css";

const GREETING =
  "hi! i'm zeref-bot — ask me anything about John: projects, skills, experience, availability.";

const SUGGESTIONS = ["what is ACRA?", "top skills?", "is he open to work?"];

// Terminal-style chat grounded on the portfolio, powered by /api/chat
// (Vercel serverless → Azure OpenAI). Rendered embedded in the About section.
export default function ChatWidget() {
  const [messages, setMessages] = useState([{ role: "assistant", content: GREETING }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const bodyRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, busy]);

  const send = async (text) => {
    const content = (text ?? input).trim();
    if (!content || busy) return;
    setInput("");
    const next = [...messages, { role: "user", content }];
    setMessages(next);
    setBusy(true);
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // greeting is client-only; send real turns
        body: JSON.stringify({ messages: next.slice(1) }),
      });
      const data = await r.json().catch(() => ({}));
      const reply =
        data.reply || (r.ok ? "…no output. try rephrasing?" : "bot is offline right now — email me instead!");
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "network error — try again?" }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="chat-terminal" role="region" aria-label="zeref-bot chat">
      <div className="chat-head">
        <span className="chat-traffic">
          <i /><i /><i />
        </span>
        <span className="chat-title">zeref-bot</span>
        <span className="chat-model">gpt-5-mini · azure</span>
        <span className="chat-live">
          <span className="chat-dot" /> online
        </span>
      </div>

      <div className="chat-body" ref={bodyRef}>
        {messages.map((m, i) => (
          <div key={i} className={`chat-msg chat-${m.role}`}>
            <span className="chat-prefix">{m.role === "user" ? "you $" : "bot #"}</span>
            {m.content}
          </div>
        ))}
        {busy && (
          <div className="chat-msg chat-assistant">
            <span className="chat-prefix">bot #</span>
            <span className="chat-typing">
              <i /><i /><i />
            </span>
          </div>
        )}
        {messages.length === 1 && (
          <div className="chat-suggestions">
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => send(s)}>{s}</button>
            ))}
          </div>
        )}
      </div>

      <form
        className="chat-input"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <span className="chat-prompt">$</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="ask about john…"
          maxLength={400}
          disabled={busy}
        />
        <button type="submit" disabled={busy || !input.trim()}>↵</button>
      </form>
    </div>
  );
}
