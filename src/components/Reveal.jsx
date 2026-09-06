import { useEffect, useRef } from "react";

// Fades sections in on scroll via IntersectionObserver.
// Re-triggers: the class toggles off when the section leaves the viewport,
// so entrances replay when scrolling back (in either direction).
export default function Reveal({ children, as: Tag = "div", className = "", ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    // Never gate on intersectionRatio - it is the fraction of THE ELEMENT that
    // is visible, so a section taller than the viewport can never reach 15% and
    // stays invisible forever. Projects on a phone is ~10x the screen height:
    // it was permanently stuck at opacity 0 while still taking up its full
    // height, which reads as "the page won't scroll".
    // Any overlap reveals; only leaving the viewport entirely resets it.
    const io = new IntersectionObserver(
      ([entry]) => {
        el.classList.toggle("visible", entry.isIntersecting);
      },
      { threshold: 0 }
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
