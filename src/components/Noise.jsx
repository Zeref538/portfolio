import { useRef, useEffect } from 'react';
import './Noise.css';

// Film-grain overlay — static by default (patternRefreshInterval 0 = draw
// once, no animation loop). Pass an interval > 0 to re-enable live flicker.
const Noise = ({
  patternRefreshInterval = 0,
  patternAlpha = 12
}) => {
  const grainRef = useRef(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canvas = grainRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let frame = 0;
    let animationId;
    const canvasSize = 256;
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    const drawGrain = () => {
      const imageData = ctx.createImageData(canvasSize, canvasSize);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255;
        data[i] = value;
        data[i + 1] = value;
        data[i + 2] = value;
        data[i + 3] = patternAlpha;
      }
      ctx.putImageData(imageData, 0, 0);
    };

    if (reducedMotion || !patternRefreshInterval) {
      drawGrain(); // static grain, no flicker, zero per-frame cost
      return;
    }

    const loop = () => {
      if (frame % patternRefreshInterval === 0) drawGrain();
      frame++;
      animationId = window.requestAnimationFrame(loop);
    };

    const onVisibility = () => {
      if (document.hidden) {
        window.cancelAnimationFrame(animationId);
      } else {
        animationId = window.requestAnimationFrame(loop);
      }
    };

    document.addEventListener('visibilitychange', onVisibility);
    loop();

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.cancelAnimationFrame(animationId);
    };
  }, [patternRefreshInterval, patternAlpha]);

  return <canvas className="noise-overlay" ref={grainRef} style={{ imageRendering: 'pixelated' }} />;
};

export default Noise;
