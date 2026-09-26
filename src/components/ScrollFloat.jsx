import { useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './ScrollFloat.css';

gsap.registerPlugin(ScrollTrigger);

const ScrollFloat = ({
  children,
  scrollContainerRef,
  containerClassName = '',
  textClassName = '',
  animationDuration = 1,
  ease = 'back.inOut(2)',
  scrollStart = 'center bottom+=50%',
  scrollEnd = 'bottom bottom-=40%',
  stagger = 0.03,
  accentFrom = -1 // letters from this position on get the accent style (-1: none)
}) => {
  const containerRef = useRef(null);

  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : '';
    // Letters are grouped per word in a no-wrap box. Each letter is its own
    // inline box, and without the group the browser may wrap between any two
    // of them, which split "matters" across two lines on a phone. `index`
    // still counts every character, spaces included, so accentFrom keeps working.
    let index = 0;
    const cls = (i) => (accentFrom >= 0 && i >= accentFrom ? "char char-accent" : "char");
    return text.split(' ').map((word, w, words) => {
      const letters = [...word].map((char) => { const i = index++; return <span className={cls(i)} key={i}>{char}</span>; });
      const gap = w < words.length - 1 ? index++ : null;
      return (
        <span className="word" key={w} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
          {letters}
          {gap !== null && <span className={cls(gap)} key={gap}>{' '}</span>}
        </span>
      );
    });
  }, [children, accentFrom]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;

    const charElements = el.querySelectorAll('.char');

    const tween = gsap.fromTo(
      charElements,
      {
        willChange: 'opacity, transform',
        opacity: 0,
        yPercent: 120,
        scaleY: 2.3,
        scaleX: 0.7,
        transformOrigin: '50% 0%'
      },
      {
        duration: animationDuration,
        ease: ease,
        opacity: 1,
        yPercent: 0,
        scaleY: 1,
        scaleX: 1,
        stagger: stagger,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: scrollStart,
          end: scrollEnd,
          scrub: true
        }
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [scrollContainerRef, animationDuration, ease, scrollStart, scrollEnd, stagger]);

  return (
    <h2 ref={containerRef} className={`scroll-float ${containerClassName}`}>
      <span className={`scroll-float-text ${textClassName}`}>{splitText}</span>
    </h2>
  );
};

export default ScrollFloat;
