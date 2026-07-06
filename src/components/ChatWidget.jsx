import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./ChatWidget.css";

// Floating dial (bottom-right) that pops the same terminal open anywhere on the page
export function ChatDial() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className={`chat-fab ${open ? "chat-fab-open" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Chat with zeref-bot"}
      >
        {open ? "×" : ">_"}
      </button>
      {open && (
        <div className="chat-dial-panel" role="dialog" aria-label="zeref-bot chat">
          <ChatWidget windowed onClose={() => setOpen(false)} />
        </div>
      )}
    </>
  );
}

const GREETING =
  "hi! i'm zeref-bot — ask me anything about John: projects, skills, experience, availability.";

const SUGGESTIONS = ["what is ACRA?", "top skills?", "is he open to work?"];

// Terminal-style chat grounded on the portfolio, powered by /api/chat
// (Vercel serverless → Azure OpenAI). Rendered embedded in the About section,
// and again (windowed) inside the floating ChatDial popup.
//
// `windowed` + `onClose` only get passed from ChatDial — the embedded About
// instance keeps the traffic lights purely decorative, since "close" has no
// meaning for a widget that's part of the page layout.
export default function ChatWidget({ windowed = false, onClose }) {
  const [messages, setMessages] = useState([{ role: "assistant", content: GREETING }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
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

  const terminal = (
    <div
      className={`chat-terminal ${minimized ? "chat-min" : ""} ${fullscreen ? "chat-full" : ""}`}
      role="region"
      aria-label="zeref-bot chat"
    >
      <div className="chat-head">
        <span className="chat-traffic">
          {windowed ? (
            <>
              <button
                type="button"
                className="chat-traffic-dot chat-dot-red"
                aria-label="Close chat"
                onClick={onClose}
              />
              <button
                type="button"
                className="chat-traffic-dot chat-dot-yellow"
                aria-label={minimized ? "Restore chat" : "Minimize chat"}
                onClick={() => setMinimized((m) => !m)}
              />
              <button
                type="button"
                className="chat-traffic-dot chat-dot-green"
                aria-label={fullscreen ? "Exit full screen" : "Full screen"}
                onClick={() => setFullscreen((f) => !f)}
              />
            </>
          ) : (
            <><i /><i /><i /></>
          )}
        </span>
        <span className="chat-title">zeref-bot</span>
        <span className="chat-model">gpt-5-mini · azure</span>
        <span className="chat-live">
          <span className="chat-dot" /> online
        </span>
      </div>

      {!minimized && (
        <>
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
        </>
      )}
    </div>
  );

  // fullscreen: portal straight to <body> so the overlay is genuinely
  // viewport-fixed, not scoped inside the dial panel's own stacking context
  // (same reasoning as CertCard's preview — avoids relying on z-index
  // ordering to "win" against ancestors).
  if (fullscreen) {
    return createPortal(
      <div className="chat-fullscreen-overlay">{terminal}</div>,
      document.body
    );
  }

  return terminal;
}
