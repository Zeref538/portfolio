import { useEffect, useRef } from "react";

// Fades sections in on scroll via IntersectionObserver.
// Re-triggers: the class toggles off when the section leaves the viewport,
// so entrances replay when scrolling back (in either direction).
export default function Reveal({ children, as: Tag = "div", className = "", ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const io = new IntersectionObserver(
      ([entry]) => {
        el.classList.toggle("visible", entry.isIntersecting);
      },
      // enter at 12% visible; the negative margin resets it only once
      // the section is well past the edge, avoiding flicker at boundaries
      { threshold: 0.12, rootMargin: "-5% 0px -5% 0px" }
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
