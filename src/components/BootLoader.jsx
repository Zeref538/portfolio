import { useEffect, useRef, useState } from "react";

// Start-up animation: a small MLP runs a forward pass while the site "deploys".
//
// The net is a BOX. The flat 2D layout — layers left to right, units down — is
// its front face, and every unit is repeated DEPTH times going back. It starts
// dead-on, so frame one looks exactly like the flat version, then eases into a
// slow turn and the depth opens out.
//
// It runs on every page load, including a reload — an earlier version skipped
// repeat views via sessionStorage and that just read as the loader being broken.
// Two rules keep it from being a tax on the visitor:
//   1. Skipped entirely for anyone who asked for reduced motion.
//   2. Dismisses on window `load` OR at MAX_MS, whichever is first — it never
//      holds back a page that is already ready.
const DUR = 2500;              // the turn
const TAIL = 1000;             // the settle
const RUN_MS = DUR + TAIL;
const MAX_MS = RUN_MS + 700;   // hard ceiling, even on a slow connection

// blue -> indigo -> violet -> purple -> magenta, one hue per layer
const HUE = [[59, 130, 246], [88, 110, 244], [124, 97, 247], [155, 89, 247], [186, 84, 240]];
const LAYERS = [5, 9, 9, 9, 5];
const DEPTH = 5;               // copies of each unit going back

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
    // 1.5 rather than 2: on a retina phone that is ~44% fewer pixels to paint,
    // and the softening is invisible on hairlines and 3px dots.
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const W = Math.min(window.innerWidth * 0.92, 900);
    const H = Math.min(window.innerHeight * 0.62, 450);
    cv.width = W * dpr; cv.height = H * dpr;
    cv.style.width = W + "px"; cv.style.height = H + "px";
    const g = cv.getContext("2d");
    g.setTransform(dpr, 0, 0, dpr, 0, 0);

    const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
    const LAST = LAYERS.length - 1;
    const FOV = 430, CAM = 150, CX = W / 2, CY = H / 2;

    // ---- build the box ----
    const nodes = [];
    LAYERS.forEach((n, l) => {
      // Spacing must beat the slab depth or neighbouring layers interleave.
      // Found by grid search, not by the tan() rule: perspective enlarges the
      // near slices, so they crowd sooner than the flat formula predicts.
      const x = (l - LAST / 2) * 180;
      const PY = 32, PZ = 22;
      for (let i = 0; i < n; i++)
        for (let d = 0; d < DEPTH; d++)
          nodes.push({
            x,
            y: (i - (n - 1) / 2) * PY,          // the 2D position
            z: (d - (DEPTH - 1) / 2) * PZ,      // ...pushed back
            d,
            halfY: ((n - 1) / 2) * PY + 15,
            halfZ: ((DEPTH - 1) / 2) * PZ + 10,
            l, a: 0, ring: -1,
          });
    });

    // ~35% of units never fire — closer to a real trained net than "everything
    // lights", and with 185 nodes it is also what keeps the picture readable.
    // Every layer keeps at least two survivors or it would go dark and read as
    // broken rather than sparse.
    for (const n of nodes) n.dead = Math.random() < 0.35;
    for (let l = 0; l <= LAST; l++) {
      const inLayer = nodes.filter((n) => n.l === l);
      const alive = inLayer.filter((n) => !n.dead);
      for (let k = alive.length; k < 2; k++)
        inLayer[(Math.random() * inLayer.length) | 0].dead = false;
    }

    // Wires stay inside their own depth slice, plus a thin 4% across, so the
    // box reads as DEPTH parallel copies of the flat net. Full connectivity
    // would be thousands of lines and unreadable.
    const edges = [];
    for (const a of nodes) for (const b of nodes) {
      if (b.l !== a.l + 1) continue;
      const same = a.d === b.d;
      if (!same && Math.random() > 0.04) continue;
      edges.push({ a, b, w: 0.25 + Math.random() * 0.75,
                   live: !a.dead && !b.dead && Math.random() < (same ? 0.2 : 0.4) });
    }
    // Repair. Reviving an existing wire is not enough: because wires are
    // slice-local, a layer's survivors can sit in slices with no wire at all
    // back to the previous layer's survivors, and then that layer never lights.
    // Measured at 1 run in 2000. If no candidate exists, create one.
    for (const n of nodes) {
      if (n.l === 0 || n.dead) continue;
      const inc = edges.filter((e) => e.b === n && !e.a.dead);
      if (inc.some((e) => e.live)) continue;
      if (inc.length) inc[(Math.random() * inc.length) | 0].live = true;
      else {
        const prev = nodes.filter((m) => m.l === n.l - 1 && !m.dead);
        if (prev.length)
          edges.push({ a: prev[(Math.random() * prev.length) | 0], b: n,
                       w: 0.25 + Math.random() * 0.75, live: true });
      }
    }

    // A fixed drift looks authored by the second view, so each run picks its
    // own heading and its own turn direction. Magnitude stays modest so the box
    // cannot wander off the canvas in any direction.
    const driftDir = Math.random() * Math.PI * 2;
    const driftMag = 34 + Math.random() * 22;
    const DRIFT_X = Math.cos(driftDir) * driftMag;
    const DRIFT_Y = Math.sin(driftDir) * driftMag;
    const SPIN = Math.random() < 0.5 ? 1 : -1;

    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const smooth = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));

    const t0 = performance.now();
    let raf = 0, done = false;

    const frame = (now) => {
      const ms = now - t0;
      const p = Math.min(1, ms / DUR);
      const tail = Math.max(0, Math.min(1, (ms - DUR) / TAIL));
      const front = ease(p) * LAST;

      const turn = smooth(ms / RUN_MS);         // 0..1 across the whole run
      const ang = turn * 0.70 * SPIN;           // 0 -> 40deg, either way
      const tilt = turn * 0.20;
      const ca = Math.cos(ang), sa = Math.sin(ang);
      const ct = Math.cos(tilt), st = Math.sin(tilt);
      const slideX = turn * DRIFT_X, riseY = turn * DRIFT_Y;

      // one projection used by nodes, wires and layer frames alike
      const project = (x, y, z) => {
        const rx = x * ca + z * sa;             // rotate about the vertical axis
        const rz = -x * sa + z * ca;
        const ry = y * ct - rz * st;            // then tip forward a touch
        const dz = rz * ct + y * st;
        // depth scaled by `turn` too, so at turn 0 every copy lands on exactly
        // the same pixel and the opening frame is genuinely flat
        const sc = FOV / (FOV + dz * turn + CAM);
        return { sx: CX + slideX + rx * sc, sy: CY + riseY + ry * sc, sc, depth: dz };
      };
      for (const n of nodes) Object.assign(n, project(n.x, n.y, n.z));

      g.clearRect(0, 0, W, H);

      // Painter's algorithm for nodes only — solid dots occlude. Edges are not
      // sorted: sorting all of them measured 0.267ms/frame, the single biggest
      // cost in the loop, while hairline translucent lines show no visible
      // difference from paint order.
      const order = [...nodes].sort((a, b) => b.depth - a.depth);

      // A wireframe box per layer. Without it, five stacked copies just look
      // like scattered dots. Corners bend with a quadratic whose control point
      // is the corner itself, so it stays smooth under perspective where the
      // quad is no longer a rectangle.
      for (let l = 0; l <= LAST; l++) {
        const any = nodes.find((n) => n.l === l);
        if (!any) continue;
        const c = HUE[l], lit = front >= l - 0.2;
        const corner = (yy, zz) => project(any.x, yy, zz);
        const fz = any.halfZ, bz = -any.halfZ, hy = any.halfY;
        const quad = [corner(-hy, fz), corner(hy, fz), corner(hy, bz), corner(-hy, bz)];
        const K = 0.26;                    // how far along each edge to start bending
        const lerp = (a, b, t) => ({ sx: a.sx + (b.sx - a.sx) * t,
                                     sy: a.sy + (b.sy - a.sy) * t });
        g.strokeStyle = rgba(c, lit ? 0.24 : 0.08);
        g.lineWidth = lit ? 1.1 : 0.8;
        g.lineJoin = "round";
        g.beginPath();
        for (let i = 0; i < 4; i++) {
          const cur = quad[i], prev = quad[(i + 3) % 4], next = quad[(i + 1) % 4];
          const inn = lerp(cur, prev, K), out = lerp(cur, next, K);
          if (i === 0) g.moveTo(inn.sx, inn.sy); else g.lineTo(inn.sx, inn.sy);
          g.quadraticCurveTo(cur.sx, cur.sy, out.sx, out.sy);
        }
        g.closePath();
        g.stroke();
      }

      // Dim wiring, depth-faded. One stroke() per wire was ~750 draw calls a
      // frame; bucketing into 4 depth bands makes it 4 calls for the same look.
      const BANDS = 4;
      for (let bnd = 0; bnd < BANDS; bnd++) {
        const t = (bnd + 0.5) / BANDS;
        g.strokeStyle = `rgba(255,255,255,${(0.03 + t * 0.05).toFixed(3)})`;
        g.lineWidth = 0.7 * (0.55 + t * 0.45);
        g.beginPath();
        for (const e of edges) {
          const d = (e.a.sc + e.b.sc) / 2;
          if (Math.min(BANDS - 1, (d * BANDS) | 0) !== bnd) continue;
          g.moveTo(e.a.sx, e.a.sy); g.lineTo(e.b.sx, e.b.sy);
        }
        g.stroke();
      }

      g.lineCap = "round";
      for (const e of edges) {
        if (!e.live) continue;                       // this weight never fires
        const t = smooth(front - e.a.l);
        if (t <= 0) continue;
        const from = HUE[e.a.l], to = HUE[e.b.l], d = (e.a.sc + e.b.sc) / 2;
        const x = e.a.sx + (e.b.sx - e.a.sx) * t, y = e.a.sy + (e.b.sy - e.a.sy) * t;
        const m = t * 0.6;                     // inline blend, no array per edge
        const cr = (from[0] + (to[0] - from[0]) * m) | 0;
        const cg = (from[1] + (to[1] - from[1]) * m) | 0;
        const cb = (from[2] + (to[2] - from[2]) * m) | 0;
        g.strokeStyle = `rgba(${cr},${cg},${cb},${(0.12 + e.w * 0.38) * d})`;
        g.lineWidth = (0.7 + e.w * 1.2) * d;
        g.beginPath(); g.moveTo(e.a.sx, e.a.sy); g.lineTo(x, y); g.stroke();
        if (t < 1) {
          const hr = (from[0] + (to[0] - from[0]) * t) | 0;
          const hg = (from[1] + (to[1] - from[1]) * t) | 0;
          const hb = (from[2] + (to[2] - from[2]) * t) | 0;
          g.fillStyle = `rgba(${hr},${hg},${hb},${0.15 * d})`;
          g.beginPath(); g.arc(x, y, 6 * d, 0, 7); g.fill();
          g.fillStyle = `rgba(${hr},${hg},${hb},${0.9 * d})`;
          g.beginPath(); g.arc(x, y, 2.1 * d, 0, 7); g.fill();
        }
      }

      for (const n of order) {
        const c = HUE[n.l], on = !n.dead && front >= n.l;
        if (on && n.ring < 0) n.ring = ms;
        n.a += ((on ? 1 : 0) - n.a) * 0.13;
        // clamp the depth scale for the DOT only — unclamped, a near node
        // balloons while a far one vanishes
        const rs = Math.max(0.72, Math.min(1.05, n.sc));
        const r = (2.6 + n.a * 1.4) * rs;
        if (n.ring >= 0) {                            // one-shot spike ring
          const rp = (ms - n.ring) / 520;
          if (rp < 1) {
            g.strokeStyle = rgba(c, (1 - rp) * 0.45);
            g.lineWidth = 1.4 * (1 - rp) * n.sc;
            g.beginPath(); g.arc(n.sx, n.sy, r + rp * 16 * n.sc, 0, 7); g.stroke();
          }
        }
        if (n.a > 0.04) {
          g.fillStyle = rgba(c, 0.12 * n.a * n.sc);
          g.beginPath(); g.arc(n.sx, n.sy, r + 8 * n.a * n.sc, 0, 7); g.fill();
        }
        g.fillStyle = n.a > 0.5 ? rgba(c, Math.min(1, n.sc + 0.25))
                                : `rgba(255,255,255,${0.14 * n.sc})`;
        g.beginPath(); g.arc(n.sx, n.sy, r, 0, 7); g.fill();
      }

      if (tail > 0) {
        for (const n of nodes) {
          if (n.l !== LAST || n.a < 0.5) continue;
          const beat = 0.5 + 0.5 * Math.sin(ms / 420 + n.y);
          g.fillStyle = rgba(HUE[3], 0.1 * tail * beat * n.sc);
          g.beginPath(); g.arc(n.sx, n.sy, (11 + beat * 4) * n.sc, 0, 7); g.fill();
        }
      }

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
