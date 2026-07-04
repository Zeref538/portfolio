import { useEffect, useRef } from 'react';

// Magnetic pull toward the cursor. Writes transforms straight to the DOM node
// (no React state) so mousemove never triggers re-renders.
const Magnet = ({
  children,
  padding = 100,
  disabled = false,
  magnetStrength = 2,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.5s ease-in-out',
  wrapperClassName = '',
  innerClassName = '',
  ...props
}) => {
  const magnetRef = useRef(null);
  const innerRef = useRef(null);

  useEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;

    if (disabled) {
      inner.style.transform = 'translate3d(0, 0, 0)';
      return;
    }

    let active = false;
    let raf = null;
    let lastEvent = null;

    const apply = () => {
      raf = null;
      const wrap = magnetRef.current;
      const e = lastEvent;
      if (!wrap || !e) return;

      const { left, top, width, height } = wrap.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      const distX = Math.abs(centerX - e.clientX);
      const distY = Math.abs(centerY - e.clientY);

      const inRange = distX < width / 2 + padding && distY < height / 2 + padding;
      if (inRange) {
        if (!active) {
          active = true;
          inner.style.transition = activeTransition;
        }
        const offsetX = (e.clientX - centerX) / magnetStrength;
        const offsetY = (e.clientY - centerY) / magnetStrength;
        inner.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
      } else if (active) {
        active = false;
        inner.style.transition = inactiveTransition;
        inner.style.transform = 'translate3d(0, 0, 0)';
      }
    };

    const handleMouseMove = e => {
      lastEvent = e;
      // coalesce to one layout read per frame
      if (raf == null) raf = requestAnimationFrame(apply);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (raf != null) cancelAnimationFrame(raf);
    };
  }, [padding, disabled, magnetStrength, activeTransition, inactiveTransition]);

  return (
    <div
      ref={magnetRef}
      className={wrapperClassName}
      style={{ position: 'relative', display: 'inline-block' }}
      {...props}
    >
      <div
        ref={innerRef}
        className={innerClassName}
        style={{
          transform: 'translate3d(0, 0, 0)',
          transition: inactiveTransition,
          willChange: 'transform'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Magnet;
