// Render scripts/og-image.html to public/og-image.png at 1200x630.
//
//   node scripts/og-image.mjs
//
// Needs playwright available (npm i -D playwright, then npx playwright install
// chromium). Run it whenever the photo, the tagline or the project count
// changes - the share card is the only part of the site nobody sees while
// working on it, which is exactly why it goes stale.
import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { statSync } from "node:fs";

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, "..", "public", "og-image.png");

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 2,          // retina-sharp; platforms downscale, never up
});
await page.goto("file:///" + join(here, "og-image.html").replace(/\\/g, "/"));
// Wait for the webfont, not a fixed timer: screenshotting mid-swap bakes the
// fallback font into the PNG and the card silently ships in Arial.
await page.waitForFunction(() => document.fonts.ready.then(() => true));
await page.waitForTimeout(400);
await page.screenshot({ path: out });
await browser.close();

const kb = Math.round(statSync(out).size / 1024);
console.log(`og-image.png written: ${kb} KB`);
