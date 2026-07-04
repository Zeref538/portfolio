import { useEffect, useRef } from "react";

// Fades sections in on scroll via IntersectionObserver.
// Re-triggers: the class toggles off when the section leaves the viewport,
// so entrances replay when scrolling back (in either direction).
export default function Reveal({ children, as: Tag = "div", className = "", ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    // Hysteresis: enter at 15% visible, reset only when fully off-screen.
    // A single toggle threshold flickers when scroll sits near the boundary.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.15) {
          el.classList.add("visible");
        } else if (!entry.isIntersecting) {
          el.classList.remove("visible");
        }
      },
      { threshold: [0, 0.15] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`reveal ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
