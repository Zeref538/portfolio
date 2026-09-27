// Takes down the loading screen from index.html. On the home page the name on
// the loader flies to where the hero's name sits, then the hero takes over, so
// it reads as one element moving rather than one screen swapped for another.
// The trick is FLIP: measure where the name is now and where it has to end up,
// then let the browser animate the difference with a transform.
export function finishLoader() {
  const loader = document.getElementById("loader");
  if (!loader) return;
  const root = document.documentElement;
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // wait for the fonts (or the name jumps shape mid-flight), and show the
  // loader at least briefly so it doesn't flash; never hold it past 3s
  const ready = Promise.all([document.fonts.ready, new Promise((r) => setTimeout(r, 700))]);
  Promise.race([ready, new Promise((r) => setTimeout(r, 3000))]).then(() => {
    loader.classList.add("done");
    const from = [...loader.querySelectorAll(".ld-name span")];
    const to = [...document.querySelectorAll(".hero h1 .name-anim")];

    const end = () => {
      root.classList.remove("loading");
      loader.remove();
    };
    if (still || to.length !== 2) {
      loader.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300 }).onfinish = end;
      return;
    }

    const ms = 800;
    const ease = "cubic-bezier(0.65, 0, 0.35, 1)";
    from.forEach((el, i) => {
      const a = el.getBoundingClientRect();
      const b = to[i].getBoundingClientRect();
      // scale by width: the two fonts have different line heights, so height lies
      el.animate(
        [{ transform: "none" }, { transform: `translate(${b.left - a.left}px, ${b.top - a.top}px) scale(${b.width / a.width})` }],
        { duration: ms, easing: ease, fill: "forwards" }
      );
    });
    // the background clears while the name is still moving, so the page rises
    // up around it instead of appearing after it lands
    setTimeout(() => loader.classList.add("gone"), 150);
    setTimeout(() => {
      root.classList.add("handoff");
      end();
    }, ms);
  });
}
