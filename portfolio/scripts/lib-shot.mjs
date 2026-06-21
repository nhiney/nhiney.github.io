// Headless screenshot of /library so we can actually SEE the 3D scene.
// Software WebGL (SwiftShader) — shows composition/lighting, not real FPS.
//   node scripts/lib-shot.mjs <url> <out.png> <waitMs> <mode: still|walk>
import { chromium } from "playwright";

const url = process.argv[2] || "http://localhost:3000/library/";
const out = process.argv[3] || "/tmp/library-shot.png";
const waitMs = Number(process.argv[4] || 9000);
const mode = process.argv[5] || "still";

const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
  args: [
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
    "--ignore-gpu-blocklist",
    "--enable-webgl",
  ],
});
const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
if (process.env.THEME) await page.emulateMedia({ colorScheme: process.env.THEME });

const errors = [];
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text().slice(0, 200));
});
page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message.slice(0, 200)));

await page.goto(url, { waitUntil: "load", timeout: 60000 });

// Legacy gate (if present) — harmless if it isn't.
try {
  await page.getByRole("button", { name: /reading room|phòng đọc|enter/i }).first().click({ timeout: 3000 });
} catch {}

await page.waitForTimeout(waitMs);

if (mode === "hover") {
  const hx = Number(process.argv[6] || 683);
  const hy = Number(process.argv[7] || 360);
  await page.mouse.move(hx, hy, { steps: 6 });
  await page.waitForTimeout(1400);
  await page.screenshot({ path: out });
} else if (mode === "spin") {
  // Drag to orbit/rotate, then capture a different angle.
  const sx = Number(process.argv[6] || 900);
  await page.mouse.move(sx, 384);
  await page.mouse.down();
  await page.mouse.move(sx - 380, 384, { steps: 24 });
  await page.mouse.up();
  await page.waitForTimeout(900);
  await page.screenshot({ path: out });
} else {
  await page.screenshot({ path: out });
}

console.log("SCREENSHOT:", out);
console.log("CONSOLE ERRORS (first 12):");
for (const e of [...new Set(errors)].slice(0, 12)) console.log(" -", e);
await browser.close();
