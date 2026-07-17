import { useEffect, useRef } from "react";

// Custom cursor: dot follows instantly, ring trails with lerp.
// Only active on fine pointers (mouse) and when reduced motion is off.
export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reducedMotion) return;

    document.body.classList.add("custom-cursor");
    const dot = dotRef.current;
    const ring = ringRef.current;
    let mx = -100, my = -100;   // mouse position
    let rx = -100, ry = -100;   // ring (lerped) position
    let raf;

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx - 3.5}px, ${my - 3.5}px)`;
    };

    const onOver = (e) => {
      const link = e.target.closest("a");
      const interactive = !link && e.target.closest("button, .card");
      const text =
        !link && !interactive &&
        e.target.closest("p, h1, h2, h3, h4, li, blockquote, code, pre, td, label, input, textarea");
      ring.classList.toggle("linking", !!link);
      ring.classList.toggle("hovering", !!interactive);
      ring.classList.toggle("texting", !!text);
    };

    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      // -50% self-translate centers the ring without reading offsetWidth (layout) every frame
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      document.body.classList.remove("custom-cursor");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
