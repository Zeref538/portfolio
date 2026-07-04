import { useRef, useCallback } from "react";

// 3D phone-frame showcase for mobile app screenshots.
// The stage tilts toward the cursor (CSS vars, rAF-throttled, no re-renders);
// each phone bobs on its own float cycle.
export default function PhoneShowcase({ screens, alts = [] }) {
  const stageRef = useRef(null);
  const rafRef = useRef(null);
  const lastRef = useRef(null);

  const apply = useCallback(() => {
    rafRef.current = null;
    const el = stageRef.current;
    const e = lastRef.current;
    if (!el || !e) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;  // -0.5 .. 0.5
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--tilt-x", x.toFixed(3));
    el.style.setProperty("--tilt-y", y.toFixed(3));
  }, []);

  const onPointerMove = useCallback(
    (e) => {
      lastRef.current = e;
      if (rafRef.current == null) rafRef.current = requestAnimationFrame(apply);
    },
    [apply]
  );

  const onPointerLeave = useCallback(() => {
    const el = stageRef.current;
    if (!el) return;
    el.style.setProperty("--tilt-x", "0");
    el.style.setProperty("--tilt-y", "0");
  }, []);

  return (
    <div
      className="phone-stage"
      ref={stageRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {screens.map((src, i) => (
        <div className={`phone phone-${i}`} key={src}>
          <div className="phone-float">
            <img
              src={src}
              alt={alts[i] || `App screen ${i + 1}`}
              loading="lazy"
              onError={(e) => {
                e.target.closest(".phone").style.display = "none";
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
