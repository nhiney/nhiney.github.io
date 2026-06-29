"use client";

import { useEffect, useRef } from "react";

/* Inchworm geometry. Fewer, chunkier segments read as a little looping
 * inchworm. Segment 0 is the tail, the last is the head. */
const SEGMENTS = 9;
const SEG_SIZE = 7; // px, body thickness
const HEAD_SIZE = 13; // px, head is clearly bigger
const BODY_LEN = 46; // px, fully-extended tail→head distance
const ARCH = 8; // px, peak height of the hump
const PERIOD = 0.8; // seconds per crawl step

/**
 * Scroll indicator shaped like a crawling inchworm. A thin trail marks how far
 * the page is scrolled; the worm's head rides the leading edge of that trail.
 *
 * Locomotion is the classic inchworm gait, driven per-frame: the body bunches
 * up into a hump (tail catching up to the anchored head) then extends flat
 * again, stepping forward in rhythm. It steps livelier while scrolling and
 * keeps a gentle idle bunching when still. Segments cycle through a rainbow.
 */
export function ScrollProgress() {
  const trackRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const wormRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const worm = wormRef.current;
    if (!worm) return;
    const segs = Array.from(worm.children) as HTMLElement[];

    // One-time sizing. The container spans the worm's extended length so its
    // right edge (after translateX(-100%)) lands exactly on the scroll point.
    worm.style.width = `${BODY_LEN}px`;
    segs.forEach((seg, i) => {
      const f = i / (SEGMENTS - 1); // 0 tail → 1 head
      // Body holds a steady thickness, then swells over the last stretch into
      // a clearly bigger head — a smooth "neck" rather than an abrupt jump.
      const grow = Math.max(0, (f - 0.65) / 0.35);
      const size = SEG_SIZE + (HEAD_SIZE - SEG_SIZE) * (grow * grow);
      seg.style.width = `${size}px`;
      seg.style.height = `${size}px`;
      seg.style.marginLeft = `${-size / 2}px`;
      seg.style.marginTop = `${-size / 2}px`;
    });

    let crawl = 0; // 0 = idle, 1 = active while the wheel turns
    let idleTimer: number | undefined;

    const placeOnScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const pct = max > 0 ? Math.min(1, Math.max(0, doc.scrollTop / max)) : 0;
      const headX = BODY_LEN + pct * Math.max(0, doc.clientWidth - BODY_LEN);
      worm.style.left = `${headX}px`;
      if (trailRef.current) trailRef.current.style.width = `${headX - BODY_LEN}px`;

      if (!reduce) {
        crawl = 1;
        window.clearTimeout(idleTimer);
        idleTimer = window.setTimeout(() => {
          crawl = 0;
        }, 220);
      }
    };

    placeOnScroll();
    window.addEventListener("scroll", placeOnScroll, { passive: true });
    window.addEventListener("resize", placeOnScroll);

    // Lay each segment out along the body for a given compression `c`
    // (0 = extended flat, 1 = fully bunched hump) and arch scale.
    const layout = (c: number, archScale: number, hueDrift: number) => {
      // Bunching pulls the tail toward the anchored head.
      const span = BODY_LEN * (1 - 0.32 * c);
      segs.forEach((seg, i) => {
        const s = i / (SEGMENTS - 1); // 0 tail → 1 head
        const x = BODY_LEN - (1 - s) * span;
        // A single smooth hump along the body, dipping downward so it never
        // clips above the viewport edge.
        const y = ARCH * archScale * c * Math.sin(Math.PI * s);
        seg.style.transform = `translate(${x}px, ${y}px)`;
        const hue = (s * 300 + hueDrift) % 360;
        seg.style.background = `hsl(${hue} 85% 56%)`;
      });
    };

    if (reduce) {
      layout(0, 0, 0); // flat, static rainbow
      return () => {
        window.removeEventListener("scroll", placeOnScroll);
        window.removeEventListener("resize", placeOnScroll);
      };
    }

    let intensity = 0; // smoothed follower of `crawl`
    let phase = 0; // accumulated crawl phase (cycles)
    let last = performance.now();
    let raf = requestAnimationFrame(function tick(now) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      intensity += (crawl - intensity) * 0.08;

      // Steps faster and bunches deeper while scrolling.
      const speed = (0.55 + intensity * 0.9) / PERIOD;
      phase += dt * speed;
      const p = phase % 1;
      // Smooth bunch→extend per cycle, eased to dwell a moment when extended.
      let c = (1 - Math.cos(2 * Math.PI * p)) / 2;
      c = c * c * (3 - 2 * c);
      // Bunch amount and arch height grow with intensity but never fully rest.
      const bunch = (0.32 + intensity * 0.68) * c;
      const archScale = 0.4 + intensity * 0.6;

      layout(bunch, archScale, now / 18);
      raf = requestAnimationFrame(tick);
    });

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(idleTimer);
      window.removeEventListener("scroll", placeOnScroll);
      window.removeEventListener("resize", placeOnScroll);
    };
  }, []);

  return (
    <div ref={trackRef} className="worm-track" aria-hidden="true">
      <div ref={trailRef} className="worm-trail" style={{ width: "0px" }} />
      <div ref={wormRef} className="worm" style={{ left: "0px" }}>
        {Array.from({ length: SEGMENTS }).map((_, i) => (
          <span key={i} className="worm-seg" />
        ))}
      </div>
    </div>
  );
}
