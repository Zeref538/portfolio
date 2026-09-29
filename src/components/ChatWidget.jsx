import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import ChatText from "./ChatText";
import ThoughtLine from "./ThoughtLine.jsx";
import "./ChatWidget.css";

// The project cards' "ask" buttons call this. It is an event, not a prop,
// because the cards and the chat dial sit far apart in the page and share no
// parent that could pass it down.
export const askAbout = (project, question) =>
  window.dispatchEvent(new CustomEvent("zeref-ask", { detail: { project, question, at: Date.now() } }));

// the ready-made questions offered for a project
export const PROJECT_QUESTIONS = ["how was it evaluated?", "how does it compare to a simple baseline?", "how does it work, simply?"];

// Floating dial (bottom-right) that pops the same terminal open anywhere on the page
export function ChatDial() {
  const [open, setOpen] = useState(false);
  const [ask, setAsk] = useState(null);
  useEffect(() => {
    const on = (e) => {
      setAsk(e.detail);
      setOpen(true);
    };
    window.addEventListener("zeref-ask", on);
    return () => window.removeEventListener("zeref-ask", on);
  }, []);
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
          <ChatWidget windowed ask={ask} onClose={() => setOpen(false)} />
        </div>
      )}
    </>
  );
}

const GREETING =
  "hi! i'm zeref-bot - think of me as Andrei's AI counterpart. ask me anything about him: what he's built, how he works, or whether he's open to roles.";

const SUGGESTIONS = ["what has he built?", "top skills?", "is he open to work?"];

// Terminal-style chat grounded on the portfolio, powered by /api/chat
// (Vercel serverless → Azure OpenAI). Rendered embedded in the About section,
// and again (windowed) inside the floating ChatDial popup.
//
// Traffic lights are functional in BOTH modes:
//   red    → windowed: close the dial · embedded: collapse to a reopen pill
//   yellow → minimize to the header bar (and, when windowed, drag-to-move)
//   green  → toggle full-screen overlay
export default function ChatWidget({ windowed = false, onClose, ask }) {
  const [messages, setMessages] = useState([{ role: "assistant", content: GREETING }]);
  // the project an "ask" button pointed at; sent with every question so the
  // server searches that project's chunks first (api/_search.js)
  const [focus, setFocus] = useState(null);
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

  // project and before come straight from an ask button: state set in the same
  // moment would not be readable yet, so they are passed in, not read back
  const send = async (text, project = focus, before = []) => {
    const content = (text ?? input).trim();
    if (!content || busy) return;
    setInput("");
    const next = [...messages, ...before, { role: "user", content }];
    // The answer bubble opens at once with a thinking line in it. Its steps
    // are the stages api/chat.js really runs, in order: keyword search, meaning
    // search, merging the two rankings (api/_search.js), then the model writes.
    // The server doesn't report each stage, so they're paced on a timer; a
    // stage not reached before the first word arrives is simply never shown.
    // The line settles ("thought for 1.8s") the moment the first word arrives.
    const where = project ? project.split(" - ")[0] : "Andrei's portfolio";
    const STAGES = [
      [0, project ? `reading your question about ${where}` : "reading your question"],
      [300, `keyword search in ${where}`],
      [650, "meaning search (embeddings)"],
      [1000, "merging both rankings"],
      [1350, "picking the top 6 passages"],
      [1750, "writing the answer"],
    ];
    setMessages([...next, { role: "assistant", content: "", think: { working: true, steps: [STAGES[0][1]] } }]);
    setBusy(true);
    // rewrite only the last message; copying the array keeps React's
    // "state is immutable" rule so the re-render actually fires
    const update = (fn) =>
      setMessages((m) => {
        const copy = m.slice();
        copy[copy.length - 1] = fn(copy[copy.length - 1]);
        return copy;
      });
    const settle = (last, content, extra = {}) => ({ ...last, content, ...extra, think: { ...last.think, working: false } });
    const timers = STAGES.slice(1).map(([at, step]) =>
      setTimeout(() => update((last) => (last.think?.working ? { ...last, think: { ...last.think, steps: [...last.think.steps, step] } } : last)), at)
    );
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.filter((m) => !m.note).slice(1), project: project || undefined }),
      });

      // Two shapes come back. A good answer streams as plain text; every failure
      // path still answers with JSON, because once a 200 and the first byte are
      // out the door the status can no longer be changed.
      const isStream = r.ok && (r.headers.get("content-type") || "").startsWith("text/plain");

      if (!isStream) {
        const data = await r.json().catch(() => ({}));
        const reply =
          data.reply || (r.ok ? "…no output. try rephrasing?" : "bot is offline right now - email me instead!");
        update((last) => settle(last, reply));
        return;
      }

      // the first byte is here: thinking is over, the answer grows from now on
      update((last) => settle(last, "", { streaming: true }));
      const setLast = (content, streaming) => update((last) => ({ ...last, content, streaming }));

      // Two loops run side by side. The network loop collects text as fast as
      // it arrives. The display loop reveals it at a steady pace. Measured on
      // the live site the server sends ~13 lumps over under 2 seconds, so
      // painting each lump as it lands looks like a stutter, not typing.
      // Separating "received" from "shown" is what makes it read word by word.
      let acc = "";
      let shown = 0;
      let networkDone = false;

      const revealed = new Promise((resolve) => {
        const tick = () => {
          const backlog = acc.length - shown;
          if (backlog > 0) {
            // 2 to 8 characters a frame: roughly 120-480 a second, which reads as
            // typing. It speeds up only when far behind. The first version used
            // backlog/14 with no ceiling, and an 850-character answer that
            // arrived in one go typed itself out in a third of a second.
            let next = Math.min(acc.length, shown + Math.min(8, Math.max(2, Math.ceil(backlog / 120))));
            // finish the current word rather than cutting it mid-letter
            const space = acc.indexOf(" ", next);
            if (space !== -1 && space - next < 10) next = space + 1;
            shown = next;
            setLast(acc.slice(0, shown), true);
          }
          if (networkDone && shown >= acc.length) return resolve();
          requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });

      const reader = r.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
      }
      networkDone = true;
      await revealed;
      setLast(acc || "…no output. try rephrasing?", false);
    } catch {
      update((last) => settle(last, "network error - try again?", { streaming: false }));
    } finally {
      timers.forEach(clearTimeout);
      setBusy(false);
    }
  };

  // an ask button was pressed: note which project we're on, then either ask the
  // chosen question or offer the ready-made ones
  // handled remembers which press was already acted on, so running this twice
  // (React's StrictMode does, in development) can't add the note or send twice
  const handled = useRef(null);
  useEffect(() => {
    if (!ask || handled.current === ask.at) return;
    handled.current = ask.at;
    setFocus(ask.project);
    setMinimized(false);
    const note = { role: "assistant", note: true, content: `» asking about ${ask.project.split(" - ")[0]}` };
    if (ask.question) send(ask.question, ask.project, [note]);
    else setMessages((m) => [...m, note]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ask?.at]);

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
        <span className="chat-reopen-dot" /> zeref-bot - click to reopen
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
              <div key={i} className={`chat-msg chat-${m.role}${m.note ? " chat-note" : ""}`}>
                {!m.note && <span className="chat-prefix">{m.role === "user" ? "you $" : "bot #"}</span>}
                {m.think && (
                  <ThoughtLine
                    className="chat-thought"
                    working={m.think.working}
                    steps={m.think.steps}
                    label="thinking…"
                    doneLabel="thought for"
                    fontSize={13}
                    color="var(--text-muted)"
                    glyphColor="var(--accent)"
                  />
                )}
                {/* under a thinking line the answer starts on its own line */}
                {m.think ? (
                  (m.content || m.streaming) && (
                    <div className="chat-md">
                      <ChatText text={m.content} />
                      {m.streaming && <span className="chat-caret" aria-hidden="true" />}
                    </div>
                  )
                ) : (
                  <>
                    {m.content}
                    {m.streaming && <span className="chat-caret" aria-hidden="true" />}
                  </>
                )}
              </div>
            ))}
            {!busy && (messages.length === 1 || messages[messages.length - 1].note) && (
              <div className="chat-suggestions">
                {(messages.length === 1 ? SUGGESTIONS : PROJECT_QUESTIONS).map((s) => (
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
              placeholder="ask about andrei…"
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
