// Takes down the loading screen from index.html. The loader holds itself open
// with data-hold until its boot log has finished typing; this waits for that
// and for the fonts, then lifts the curtain and starts the page's opening
// animation (html.intro in theme-mix.css).
export function finishLoader() {
  const loader = document.getElementById("loader");
  if (!loader) return;
  const root = document.documentElement;

  const unheld = new Promise((r) => (function check() { loader.dataset.hold ? setTimeout(check, 50) : r(); })());
  // never keep a visitor behind the loader past 5s, finished or not
  Promise.race([Promise.all([unheld, document.fonts.ready]), new Promise((r) => setTimeout(r, 5000))]).then(() => {
    // A link like /#projects: the browser tries to jump there while the page
    // is still an empty shell, finds no section and stays at the top. Jump now,
    // under the curtain, so the lift reveals the right section.
    try { if (location.hash) document.querySelector(location.hash)?.scrollIntoView({ behavior: "instant" }); } catch { /* not a valid selector */ }
    loader.classList.add("gone");
    // The opening animation waits until the curtain has cleared the middle of
    // the screen. Started together, the nav and hero were already arriving in
    // the corners while the curve still covered the centre.
    setTimeout(() => {
      root.classList.add("intro");
      root.classList.remove("loading", "pre-intro");
    }, 450);
    setTimeout(() => loader.remove(), 1100);
  });
}
