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
  // a loader can also hold itself open with data-hold until its own animation ends
  const unheld = new Promise((r) => (function check() { loader.dataset.hold ? setTimeout(check, 50) : r(); })());
  const ready = Promise.all([unheld, document.fonts.ready, new Promise((r) => setTimeout(r, { 1: 700, 8: 1900, 11: 2000, 12: 1700, 13: 2700 }[loader.dataset.v] || 1300))]);
  Promise.race([ready, new Promise((r) => setTimeout(r, 3000))]).then(() => {
    loader.classList.add("done");
    const from = [...loader.querySelectorAll(".ld-name span")];
    const to = [...document.querySelectorAll(".hero h1 .name-anim")];

    const end = () => {
      root.classList.remove("loading");
      loader.remove();
    };
    // 6 and 7 have no name on the loader: it fades, and the page's own opening
    // animation (html.intro in theme-mix.css) builds the page in behind it
    // (8 lifts its backdrop away instead of fading)
    const v = loader.dataset.v;
    // (12 switches off like an old TV)
    if (!still && ["6", "7", "8", "11", "12", "13"].includes(v)) {
      const exit = { 8: ["gone", 1100], 11: ["gone", 1100], 13: ["gone", 1100], 12: ["crt", 600] }[v] || ["fade", 450];
      root.classList.add("intro");
      root.classList.remove("loading");
      loader.classList.add(exit[0]);
      setTimeout(() => loader.remove(), exit[1]);
      return;
    }
    if (still || to.length !== 2) {
      loader.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300 }).onfinish = end;
      return;
    }

    const ms = 1100;
    // slow start, long soft landing: reads smoother than an even ease
    const ease = "cubic-bezier(0.83, 0, 0.17, 1)";
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
    setTimeout(() => loader.classList.add("gone"), 200);
    // +150ms so 10's last column finishes lifting; the name is already in place
    setTimeout(() => {
      root.classList.add("handoff");
      end();
    }, ms + 150);
  });
}
