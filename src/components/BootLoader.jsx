import { useEffect, useRef, useState } from "react";

// Start-up animation: a small MLP runs a forward pass while the site "deploys".
//
// It runs on every page load, including a reload — an earlier version skipped
// repeat views via sessionStorage and that just read as the loader being broken.
// Two rules keep it from being a tax on the visitor:
//   1. Skipped entirely for anyone who asked for reduced motion.
//   2. Dismisses on window `load` OR at MAX_MS, whichever is first — it never
//      holds back a page that is already ready.
const RUN_MS = 2600;      // full sweep + settle when the page is still loading
const MAX_MS = 3200;      // hard ceiling, even on a slow connection

// blue -> indigo -> violet -> purple, one hue per layer
const HUE = [[59, 130, 246], [99, 102, 241], [139, 92, 246], [168, 85, 247]];
const LAYERS = [4, 7, 7, 3];

const STAGES = [
  [0.06, 'pull <b>zeref/portfolio:2026.09</b>'],
  [0.32, 'load weights <b>20 projects</b> · 18 live'],
  [0.60, 'warm zeref-bot <b>cosine k=6</b>'],
  [0.94, 'serving <b>john andrei martinez</b> <i class="bl-caret"></i>'],
];

export default function BootLoader() {
  const canvasRef = useRef(null);
  const logRef = useRef(null);
  const pctRef = useRef(null);
  const [show, setShow] = useState(() => {
    if (typeof window === "undefined") return false;
    return !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  });
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!show) return;

    const cv = canvasRef.current;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = Math.min(window.innerWidth * 0.82, 640);
    const H = Math.min(window.innerHeight * 0.42, 300);
    cv.width = W * dpr; cv.height = H * dpr;
    cv.style.width = W + "px"; cv.style.height = H + "px";
    const g = cv.getContext("2d");
    g.setTransform(dpr, 0, 0, dpr, 0, 0);

    const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
    const mix = (a, b, t) => [0, 1, 2].map((i) => Math.round(a[i] + (b[i] - a[i]) * t));
    const LAST = LAYERS.length - 1;

    // ---- build a SPARSE net: most weights near zero, a few dead units ----
    const nodes = [];
    const gapY = (H * 0.72) / Math.max(...LAYERS);
    LAYERS.forEach((n, l) => {
      const x = 52 + l * ((W - 104) / LAST);
      for (let i = 0; i < n; i++)
        nodes.push({ x, y: H / 2 + (i - (n - 1) / 2) * gapY, l, a: 0, ring: -1 });
    });
    for (const n of nodes) n.dead = n.l > 0 && n.l < LAST && Math.random() < 0.2;

    const edges = [];
    for (const a of nodes) for (const b of nodes)
      if (b.l === a.l + 1)
        edges.push({ a, b, w: 0.25 + Math.random() * 0.75,
                     live: !a.dead && !b.dead && Math.random() < 0.42 });

    // Repair: every live unit past the input needs at least one live wire into
    // it, or the signal stops dead and the output layer never lights — which
    // reads as broken rather than sparse.
    for (const n of nodes) {
      if (n.l === 0 || n.dead) continue;
      const inc = edges.filter((e) => e.b === n && !e.a.dead);
      if (inc.length && !inc.some((e) => e.live))
        inc[(Math.random() * inc.length) | 0].live = true;
    }

    // dot grid painted once and blitted — redrawing ~400 arcs a frame is waste
    const grid = document.createElement("canvas");
    grid.width = W * dpr; grid.height = H * dpr;
    const gg = grid.getContext("2d");
    gg.setTransform(dpr, 0, 0, dpr, 0, 0);
    gg.fillStyle = "rgba(255,255,255,0.035)";
    for (let x = 14; x < W; x += 22)
      for (let y = 14; y < H; y += 22) { gg.beginPath(); gg.arc(x, y, 1, 0, 7); gg.fill(); }

    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const smooth = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));

    const t0 = performance.now();
    let raf = 0, done = false;

    const frame = (now) => {
      const ms = now - t0;
      const p = Math.min(1, ms / (RUN_MS * 0.78));
      const tail = Math.max(0, Math.min(1, (ms - RUN_MS * 0.78) / (RUN_MS * 0.22)));
      const front = ease(p) * LAST;
      const drift = Math.sin(ms / 1400) * 2.5;

      g.clearRect(0, 0, W, H);
      g.save(); g.translate(0, drift);
      g.drawImage(grid, 0, 0, W, H);

      g.strokeStyle = "rgba(255,255,255,0.075)"; g.lineWidth = 0.8;
      g.beginPath();
      for (const e of edges) { g.moveTo(e.a.x, e.a.y); g.lineTo(e.b.x, e.b.y); }
      g.stroke();
      g.lineCap = "round";

      for (const e of edges) {
        if (!e.live) continue;                       // this weight never fires
        const t = smooth(front - e.a.l);
        if (t <= 0) continue;
        const from = HUE[e.a.l], to = HUE[e.b.l];
        const x = e.a.x + (e.b.x - e.a.x) * t, y = e.a.y + (e.b.y - e.a.y) * t;
        g.strokeStyle = rgba(mix(from, to, t * 0.6), 0.14 + e.w * 0.4);
        g.lineWidth = 0.7 + e.w * 1.3;
        g.beginPath(); g.moveTo(e.a.x, e.a.y); g.lineTo(x, y); g.stroke();
        if (t < 1) {
          const head = mix(from, to, t);
          g.fillStyle = rgba(head, 0.16);
          g.beginPath(); g.arc(x, y, 6, 0, 7); g.fill();
          g.fillStyle = rgba(head, 0.92);
          g.beginPath(); g.arc(x, y, 2.1, 0, 7); g.fill();
        }
      }

      for (const n of nodes) {
        const c = HUE[n.l], on = !n.dead && front >= n.l;
        if (on && n.ring < 0) n.ring = ms;
        n.a += ((on ? 1 : 0) - n.a) * 0.13;
        const r = 3 + n.a * 2.1;
        if (n.ring >= 0) {                            // one-shot spike ring
          const rp = (ms - n.ring) / 520;
          if (rp < 1) {
            g.strokeStyle = rgba(c, (1 - rp) * 0.5);
            g.lineWidth = 1.4 * (1 - rp);
            g.beginPath(); g.arc(n.x, n.y, r + rp * 16, 0, 7); g.stroke();
          }
        }
        if (n.a > 0.04) {
          g.fillStyle = rgba(c, 0.12 * n.a);
          g.beginPath(); g.arc(n.x, n.y, r + 8 * n.a, 0, 7); g.fill();
        }
        g.fillStyle = n.a > 0.5 ? rgba(c, 1) : "rgba(255,255,255,0.16)";
        g.beginPath(); g.arc(n.x, n.y, r, 0, 7); g.fill();
      }

      if (tail > 0) {
        for (const n of nodes) {
          if (n.l !== LAST || n.a < 0.5) continue;
          const beat = 0.5 + 0.5 * Math.sin(ms / 420 + n.y);
          g.fillStyle = rgba(HUE[3], 0.1 * tail * beat);
          g.beginPath(); g.arc(n.x, n.y, 11 + beat * 4, 0, 7); g.fill();
        }
      }

      g.restore();
      if (!done) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    // ---- deploy log: stage lines, with a transfer line moving between them ----
    const logEl = logRef.current, pctEl = pctRef.current;
    let stage = 0, live = null;
    const push = (html) => {
      [...logEl.children].forEach((c) => c.classList.add("dim"));
      const d = document.createElement("div");
      d.innerHTML = html;
      logEl.appendChild(d);
      while (logEl.children.length > 5) logEl.removeChild(logEl.firstChild);
      return d;
    };
    const logTimer = setInterval(() => {
      const prog = Math.min(1, (performance.now() - t0) / RUN_MS);
      pctEl.textContent = String(Math.round(prog * 100)).padStart(3, "0");
      if (stage < STAGES.length && prog >= STAGES[stage][0]) {
        push("<span>›</span> " + STAGES[stage][1]);
        stage++;
        live = null;
      }
      // once the last stage lands, stop — a 'deploy 20/20' under 'serving'
      // would undo the ending
      if (stage >= STAGES.length) return;
      const mods = String(Math.round(prog * 20)).padStart(2, "0");
      const html = `<span>›</span> deploy <b>${mods}</b>/20  ${(prog * 18.4).toFixed(1)} MB  ` +
                   `${(14 + Math.random() * 7).toFixed(1)} MB/s <i class="bl-caret"></i>`;
      if (live && logEl.lastChild === live) live.innerHTML = html;
      else live = push(html);
    }, 90);

    // ---- dismissal: page ready, or the ceiling, whichever comes first ----
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      done = true;
      cancelAnimationFrame(raf);
      clearInterval(logTimer);
      setLeaving(true);
      setTimeout(() => setShow(false), 800);       // matches the CSS lift
    };
    const ready = () =>
      setTimeout(finish, Math.max(0, RUN_MS - (performance.now() - t0)));
    if (document.readyState === "complete") ready();
    else window.addEventListener("load", ready, { once: true });
    const ceiling = setTimeout(finish, MAX_MS);

    return () => {
      done = true;
      cancelAnimationFrame(raf);
      clearInterval(logTimer);
      clearTimeout(ceiling);
      window.removeEventListener("load", ready);
    };
  }, [show]);

  if (!show) return null;

  return (
    <div className={`bootloader${leaving ? " leaving" : ""}`} aria-hidden="true">
      <div className="bl-cam">
        <i className="tl" /><i className="tr" /><i className="bl" /><i className="br" />
        <u className="t" /><u className="b" /><u className="l" /><u className="r" />
      </div>
      <div className="bl-rec"><s />DEPLOY</div>
      <canvas ref={canvasRef} />
      <div className="bl-log" ref={logRef} />
      <div className="bl-pct"><b ref={pctRef}>000</b>LOADING</div>
    </div>
  );
}
