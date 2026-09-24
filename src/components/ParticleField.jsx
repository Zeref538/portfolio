import { useEffect, useRef } from "react";

// Sparse dot grid that brightens and drifts toward the cursor.
// Canvas-based, transform-free DOM, pauses when tab is hidden.
export default function ParticleField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const GAP = 22;          // px between dots, same as the LiitLLM case study
    const RADIUS = 150;      // cursor influence radius
    // plain white at 9%: on pure black it reads as texture, not as a grid
    const IDLE = "rgba(255, 255, 255, 0.09)";
    const dot = (x, y, size) => {
      ctx.beginPath();
      ctx.arc(x, y, size / 2, 0, Math.PI * 2);
      ctx.fill();
    };
    let dots = [];
    let mouse = { x: -9999, y: -9999 };
    let raf;
    let running = true;

    const build = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = [];
      for (let x = GAP / 2; x < window.innerWidth; x += GAP) {
        for (let y = GAP / 2; y < window.innerHeight; y += GAP) {
          dots.push({ ox: x, oy: y, x, y });
        }
      }
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.fillStyle = IDLE;
      for (const d of dots) dot(d.ox, d.oy, 2);
    };

    let idleFrames = 0;

    const frame = () => {
      // pause the loop entirely once the cursor is gone and dots have settled
      if (mouse.x === -9999) {
        idleFrames++;
        if (idleFrames > 30) {
          drawStatic();
          raf = null;
          return;
        }
      } else {
        idleFrames = 0;
      }
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (const d of dots) {
        const dx = mouse.x - d.ox;
        const dy = mouse.y - d.oy;
        const dist2 = dx * dx + dy * dy;
        let size = 2;
        if (dist2 < RADIUS * RADIUS) {
          const t = 1 - Math.sqrt(dist2) / RADIUS; // 0..1 proximity
          size = 2 + t * 2;
          // slight pull toward cursor
          d.x += (d.ox + dx * 0.08 * t - d.x) * 0.2;
          d.y += (d.oy + dy * 0.08 * t - d.y) * 0.2;
          ctx.fillStyle = `rgba(139, 92, 246, ${0.35 + t * 0.65})`;
        } else {
          d.x += (d.ox - d.x) * 0.2;
          d.y += (d.oy - d.y) * 0.2;
          ctx.fillStyle = IDLE;
        }
        dot(d.x, d.y, size);
      }
      if (running) raf = requestAnimationFrame(frame);
    };

    build();

    if (reducedMotion) {
      drawStatic();
      const onResizeStatic = () => { build(); drawStatic(); };
      window.addEventListener("resize", onResizeStatic);
      return () => window.removeEventListener("resize", onResizeStatic);
    }

    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      // wake the loop if it paused while idle
      if (running && raf === null) raf = requestAnimationFrame(frame);
    };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };
    const onResize = () => build();
    const onVisibility = () => {
      running = !document.hidden;
      if (running) raf = requestAnimationFrame(frame);
      else cancelAnimationFrame(raf);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseout", onLeave, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas" aria-hidden="true" />;
}
