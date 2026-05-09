import { RefObject } from "react";

export type CursorTrailOptions = {
  ref: RefObject<HTMLCanvasElement | null>;
  color?: string;
};

export function cursorTrail({ ref, color }: CursorTrailOptions) {
  const ctx = ref.current?.getContext("2d");
  if (!ctx) return { cleanUp: () => {}, renderTrailCursor: () => {} };

  const primaryRaw = getComputedStyle(document.documentElement).getPropertyValue("--primary").trim();
  const defaultColor = `hsla(${primaryRaw ? primaryRaw.split(" ").join(",") : "217,100%,50%"}, 0.4)`;

  const config = { friction: 0.5, trails: 20, size: 40, dampening: 0.2, tension: 0.98 };
  const cursor = { x: 0, y: 0 };
  let running = true;

  class Node {
    x = 0; y = 0; vx = 0; vy = 0;
  }

  class Line {
    spring: number;
    friction: number;
    nodes: Node[];

    constructor(spring: number) {
      this.spring = spring + 0.1 * Math.random() - 0.05;
      this.friction = config.friction + 0.01 * Math.random() - 0.005;
      this.nodes = Array.from({ length: config.size }, () => {
        const n = new Node();
        n.x = cursor.x;
        n.y = cursor.y;
        return n;
      });
    }

    update() {
      let spring = this.spring;
      let head = this.nodes[0];
      head.vx += (cursor.x - head.x) * spring;
      head.vy += (cursor.y - head.y) * spring;
      for (let i = 0; i < this.nodes.length; i++) {
        const node = this.nodes[i];
        if (i > 0) {
          const prev = this.nodes[i - 1];
          node.vx += (prev.x - node.x) * spring;
          node.vy += (prev.y - node.y) * spring;
          node.vx += prev.vx * config.dampening;
          node.vy += prev.vy * config.dampening;
        }
        node.vx *= this.friction;
        node.vy *= this.friction;
        node.x += node.vx;
        node.y += node.vy;
        spring *= config.tension;
      }
    }

    draw() {
      let x = this.nodes[0].x;
      let y = this.nodes[0].y;
      ctx!.beginPath();
      ctx!.moveTo(x, y);
      for (let i = 1; i < this.nodes.length - 2; i++) {
        const a = this.nodes[i];
        const b = this.nodes[i + 1];
        ctx!.quadraticCurveTo(a.x, a.y, (a.x + b.x) * 0.5, (a.y + b.y) * 0.5);
      }
      const second = this.nodes[this.nodes.length - 2];
      const last = this.nodes[this.nodes.length - 1];
      ctx!.quadraticCurveTo(second.x, second.y, last.x, last.y);
      ctx!.stroke();
      ctx!.closePath();
    }
  }

  let lines: Line[] = [];

  function render() {
    if (!running || !ctx) return;
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.globalCompositeOperation = "lighter";
    ctx.strokeStyle = color ?? defaultColor;
    ctx.lineWidth = 1;
    lines.forEach((line) => { line.update(); line.draw(); });
    requestAnimationFrame(render);
  }

  function initLines() {
    lines = Array.from({ length: config.trails }, (_, i) =>
      new Line(0.45 + (i / config.trails) * 0.025)
    );
  }

  function onMove(e: MouseEvent | TouchEvent) {
    if (e instanceof MouseEvent) {
      cursor.x = e.clientX;
      cursor.y = e.clientY;
    } else {
      cursor.x = e.touches[0].pageX;
      cursor.y = e.touches[0].pageY;
    }
    e.preventDefault();
  }

  function onFirstMove(e: MouseEvent | TouchEvent) {
    document.removeEventListener("mousemove", onFirstMove as EventListener);
    document.removeEventListener("touchstart", onFirstMove as EventListener);
    document.addEventListener("mousemove", onMove as EventListener);
    document.addEventListener("touchmove", onMove as EventListener, { passive: false });
    onMove(e);
    initLines();
    render();
  }

  function resizeCanvas() {
    if (!ctx) return;
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
  }

  function stopAnimation() { running = false; }
  function startAnimation() {
    if (!running) { running = true; render(); }
  }

  function renderTrailCursor() {
    document.addEventListener("mousemove", onFirstMove as EventListener);
    document.addEventListener("touchstart", onFirstMove as EventListener);
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("focus", startAnimation);
    window.addEventListener("blur", stopAnimation);
    resizeCanvas();
  }

  function cleanUp() {
    running = false;
    document.removeEventListener("mousemove", onFirstMove as EventListener);
    document.removeEventListener("touchstart", onFirstMove as EventListener);
    document.removeEventListener("mousemove", onMove as EventListener);
    document.removeEventListener("touchmove", onMove as EventListener);
    window.removeEventListener("resize", resizeCanvas);
    window.removeEventListener("focus", startAnimation);
    window.removeEventListener("blur", stopAnimation);
  }

  return { renderTrailCursor, cleanUp };
}
