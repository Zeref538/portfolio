import { useEffect, useRef, useState, useCallback } from "react";
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
// Traffic lights are functional in BOTH modes:
//   red    → windowed: close the dial · embedded: collapse to a reopen pill
//   yellow → minimize to the header bar (and, when windowed, drag-to-move)
//   green  → toggle full-screen overlay
export default function ChatWidget({ windowed = false, onClose }) {
  const [messages, setMessages] = useState([{ role: "assistant", content: GREETING }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [closed, setClosed] = useState(false); // embedded-only "exit" state
  const [pos, setPos] = useState(null); // drag offset {x,y} when minimized
  const bodyRef = useRef(null);
  const inputRef = useRef(null);
  const dragRef = useRef(null);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, busy, minimized]);

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

  const onClose_ = () => {
    if (windowed && onClose) onClose();
    else setClosed(true);
  };

  // drag the minimized chip by its header (windowed only)
  const onHeaderPointerDown = useCallback(
    (e) => {
      if (!windowed || !minimized) return;
      if (e.target.closest(".chat-traffic-dot")) return; // don't drag when hitting a button
      const start = { x: e.clientX, y: e.clientY };
      const base = pos || { x: 0, y: 0 };
      dragRef.current = { start, base };
      e.currentTarget.setPointerCapture?.(e.pointerId);

      const move = (ev) => {
        if (!dragRef.current) return;
        setPos({
          x: dragRef.current.base.x + (ev.clientX - dragRef.current.start.x),
          y: dragRef.current.base.y + (ev.clientY - dragRef.current.start.y),
        });
      };
      const up = () => {
        dragRef.current = null;
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
    },
    [windowed, minimized, pos]
  );

  // embedded "exit" state → a slim pill that reopens the chat
  if (closed) {
    return (
      <button className="chat-reopen" onClick={() => setClosed(false)}>
        <span className="chat-reopen-dot" /> zeref-bot — click to reopen
      </button>
    );
  }

  const dragStyle =
    windowed && minimized && pos ? { transform: `translate(${pos.x}px, ${pos.y}px)` } : undefined;

  const terminal = (
    <div
      className={`chat-terminal ${minimized ? "chat-min" : ""} ${fullscreen ? "chat-full" : ""} ${
        windowed && minimized ? "chat-draggable" : ""
      }`}
      role="region"
      aria-label="zeref-bot chat"
      style={dragStyle}
    >
      <div
        className={`chat-head ${windowed && minimized ? "chat-head-drag" : ""}`}
        onPointerDown={onHeaderPointerDown}
      >
        <span className="chat-traffic">
          <button
            type="button"
            className="chat-traffic-dot chat-dot-red"
            aria-label="Close chat"
            onClick={onClose_}
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
  // viewport-fixed, not scoped inside an ancestor's stacking/transform context.
  if (fullscreen) {
    return createPortal(
      <div className="chat-fullscreen-overlay">{terminal}</div>,
      document.body
    );
  }

  return terminal;
}
