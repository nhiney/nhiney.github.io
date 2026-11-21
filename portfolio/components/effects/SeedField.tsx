"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

import { AmbientField, canvasDpr, type Env } from "@/components/home/ParticleScene";

// A quiet 3D backdrop for the inner pages: the homepage's dandelion seeds,
// far fewer of them, drifting at many depths. The camera leans a little toward
// the pointer so the depth reads, and the field rises as the page scrolls.

function CameraLean({ pointer }: { pointer: React.RefObject<{ x: number; y: number }> }) {
  useFrame((state, dt) => {
    const camera = state.camera;
    const k = 1 - Math.pow(0.05, Math.min(dt, 1 / 20));
    camera.position.x += (pointer.current.x * 0.35 - camera.position.x) * k;
    camera.position.y += (pointer.current.y * 0.22 - camera.position.y) * k;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function SeedField() {
  const pointer = useRef({ x: 0, y: 0 });
  const [hidden, setHidden] = useState(false);
  const [env] = useState<Env>(() => {
    if (typeof window === "undefined") return { reduced: false, mobile: false, dpr: 1 };
    const mobile = window.matchMedia("(max-width: 1023px)").matches;
    return {
      reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      mobile,
      dpr: canvasDpr(1.5),
    };
  });

  useEffect(() => {
    const sync = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  useEffect(() => {
    if (env.reduced) return;
    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [env.reduced]);

  return (
    <div className="absolute inset-0 opacity-80" aria-hidden="true">
      <Canvas
        frameloop={hidden ? "never" : env.reduced ? "demand" : "always"}
        dpr={env.dpr}
        camera={{ position: [0, 0, 4.4], fov: 34, near: 0.1, far: 50 }}
        gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
        style={{ pointerEvents: "none" }}
      >
        <AmbientField count={env.mobile ? 90 : 220} env={env} />
        {!env.reduced && <CameraLean pointer={pointer} />}
      </Canvas>
    </div>
  );
}
