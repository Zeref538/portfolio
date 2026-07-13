import { useRef, useEffect } from 'react';
import './Noise.css';

// Film-grain overlay that scrolls WITH the page: the grain is a repeating
// background tile on an element spanning the whole document, so the pattern
// changes as you scroll. refreshMs > 0 re-randomizes the tile occasionally
// (very subtle life); 0 = fully static.
// refreshMs default 0 = fully static grain: paints once, no periodic toDataURL /
// full-page repaint (the animated re-randomize was a recurring scroll hitch).
const Noise = ({ patternAlpha = 12, refreshMs = 0 }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const paint = () => {
      const imageData = ctx.createImageData(size, size);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 255;
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = patternAlpha;
      }
      ctx.putImageData(imageData, 0, 0);
      el.style.backgroundImage = `url(${canvas.toDataURL()})`;
    };

    paint();

    if (reducedMotion || !refreshMs) return;

    const id = setInterval(() => {
      if (!document.hidden) paint();
    }, refreshMs);
    return () => clearInterval(id);
  }, [patternAlpha, refreshMs]);

  return <div className="noise-overlay" ref={ref} aria-hidden="true" />;
};

export default Noise;
