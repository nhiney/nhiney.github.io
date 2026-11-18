"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { MotionValue } from "framer-motion";
import * as THREE from "three";

import { createBrain } from "./brainGeometry";

// ─── Shaders ─────────────────────────────────────────────────────────────────

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uIntro;
  uniform float uScroll;
  uniform float uPointerStrength;
  uniform vec3  uPointer;

  attribute vec3  aNormal;
  attribute vec4  aRandom;
  attribute float aKind;

  varying vec3  vColor;
  varying float vAlpha;
  varying float vRot;
  varying float vShape;

  // Iridescent cosine palette (gold → magenta → violet → cyan → lime).
  vec3 palette(float t) {
    return 0.52 + 0.48 * cos(6.28318 * (vec3(1.0, 1.0, 1.0) * t + vec3(0.02, 0.36, 0.67)));
  }

  void main() {
    vec3 p = position;

    // Assembly: every particle flies in from a scattered start position.
    float delay = aRandom.x * 0.45;
    float k = clamp((uIntro - delay) / 0.55, 0.0, 1.0);
    k = 1.0 - pow(1.0 - k, 3.0);
    vec3 scatter = (aRandom.yzw - 0.5) * 7.0 + aNormal * 1.6;
    p = mix(p + scatter, p, k);

    // Breathing + slow orbit for the dust halo.
    float breath = sin(uTime * 1.1 + aRandom.w * 6.2831) * 0.007;
    p += aNormal * breath * (aKind > 1.5 ? 5.0 : 1.0);
    if (aKind > 1.5) {
      float a = uTime * 0.04 * (0.4 + aRandom.x);
      p.xz = mat2(cos(a), -sin(a), sin(a), cos(a)) * p.xz;
    }

    // Neural wave sweeping across the cortex + random synapse sparks.
    float w = sin(dot(position, normalize(vec3(0.25, 0.55, 1.0))) * 5.0 - uTime * 1.6 + aRandom.x * 0.5);
    float pulse = smoothstep(0.88, 1.0, w) * (aKind < 0.5 ? 1.0 : 0.35);
    float s = fract(aRandom.z * 91.7 + floor(uTime * 2.2 + aRandom.y * 9.0) * 0.6180339);
    float spark = step(0.993, s) * (aKind < 1.5 ? 1.0 : 0.0);

    vec4 world = modelMatrix * vec4(p, 1.0);

    // Scroll: the brain dissolves outward as the hero leaves the viewport.
    world.xyz += (aRandom.xyz - 0.5) * uScroll * 4.0;

    // Pointer: particles part around the cursor like iron filings.
    vec3 d = world.xyz - uPointer;
    float dist = length(d);
    float f = smoothstep(0.8, 0.0, dist) * uPointerStrength;
    world.xyz += normalize(d + 1e-4) * f * 0.34;

    vec4 mv = viewMatrix * world;

    vec3 nView = normalize(mat3(viewMatrix) * mat3(modelMatrix) * aNormal);
    float rim = pow(1.0 - abs(nView.z), 2.2);

    float t = dot(position, vec3(0.32, 0.6, 0.22)) * 0.5 + uTime * 0.03 + aRandom.w * 0.1;
    vec3 col = palette(t);
    col = mix(col, vec3(1.0, 0.8, 0.36), 0.22 * (1.0 - rim));
    col += vec3(0.6, 0.55, 1.0) * pulse * 0.9 + spark * 1.4 + f * 0.5;
    vColor = col;

    float base = aKind > 1.5 ? 0.22 : (aKind > 0.5 ? 0.3 : 0.5 + rim * 0.55);
    vAlpha = (base + pulse * 0.45 + spark) * k * (1.0 - uScroll * 0.9);

    float size = uSize * (0.55 + aRandom.y * 0.95) * (aKind > 1.5 ? 0.55 : 1.0);
    size *= 1.0 + pulse * 1.1 + spark * 2.2 + f * 1.1;
    gl_PointSize = size * uPixelRatio / -mv.z;
    gl_Position = projectionMatrix * mv;

    vRot = aRandom.x * 6.2831 + uTime * 0.25 * (aRandom.y - 0.5);
    vShape = step(0.32, aRandom.z);
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3  vColor;
  varying float vAlpha;
  varying float vRot;
  varying float vShape;

  float sdTri(vec2 p, float r) {
    const float k = 1.7320508;
    p.x = abs(p.x) - r;
    p.y = p.y + r / k;
    if (p.x + k * p.y > 0.0) p = vec2(p.x - k * p.y, -k * p.x - p.y) / 2.0;
    p.x -= clamp(p.x, -2.0 * r, 0.0);
    return -length(p) * sign(p.y);
  }

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float c = cos(vRot), s = sin(vRot);
    uv = mat2(c, -s, s, c) * uv;

    float a;
    if (vShape > 0.5) {
      float d = sdTri(uv, 0.3);
      float fill = 1.0 - smoothstep(-0.02, 0.03, d);
      float edge = 1.0 - smoothstep(0.0, 0.06, abs(d));
      a = max(fill * 0.4, edge);
    } else {
      a = pow(smoothstep(0.5, 0.0, length(uv)), 1.6);
    }
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor, a * vAlpha);
  }
`;

// ─── Scene ───────────────────────────────────────────────────────────────────

type SceneProps = {
  count: number;
  progress?: MotionValue<number>;
  pointer: React.RefObject<{ x: number; y: number; active: number }>;
  reducedMotion: boolean;
  placement: "right" | "center";
};

function BrainPoints({ count, progress, pointer, reducedMotion, placement }: SceneProps) {
  const group = useRef<THREE.Group>(null);
  const { camera, size, viewport, gl, invalidate } = useThree();

  const geometry = useMemo(() => {
    const b = createBrain(count);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(b.position, 3));
    g.setAttribute("aNormal", new THREE.BufferAttribute(b.normal, 3));
    g.setAttribute("aRandom", new THREE.BufferAttribute(b.random, 4));
    g.setAttribute("aKind", new THREE.BufferAttribute(b.kind, 1));
    g.computeBoundingSphere();
    return g;
  }, [count]);

  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const [uniforms] = useState(() => ({
    uTime: { value: 0 },
    uSize: { value: 20 },
    uPixelRatio: { value: 1 },
    uIntro: { value: reducedMotion ? 1 : 0 },
    uScroll: { value: 0 },
    uPointerStrength: { value: 0 },
    uPointer: { value: new THREE.Vector3(99, 99, 0) },
  }));

  useEffect(() => () => geometry.dispose(), [geometry]);

  // Point size tracks the canvas size so the cloud looks the same at any size.
  useEffect(() => {
    const m = materialRef.current;
    if (!m) return;
    // Narrow screens shrink the brain, so shrink points too or additive overlap washes it out white.
    m.uniforms.uSize.value = 22 * Math.min(1.25, Math.max(0.45, Math.min(size.height / 900, size.width / 1100)));
    m.uniforms.uPixelRatio.value = gl.getPixelRatio();
    invalidate();
  }, [size.height, size.width, gl, invalidate]);

  const tmp = useRef({ v: new THREE.Vector3(), dir: new THREE.Vector3(), target: new THREE.Vector3(99, 99, 0) });
  const clock = useRef({ t: 0, intro: reducedMotion ? 1 : 0 });

  useFrame((_, rawDelta) => {
    const g = group.current;
    const m = materialRef.current;
    if (!g || !m) return;
    const dt = Math.min(rawDelta, 1 / 20);
    const u = m.uniforms;
    const tv = tmp.current;
    const scroll = progress ? progress.get() : 0;

    if (!reducedMotion) {
      clock.current.t += dt;
      clock.current.intro = Math.min(1, clock.current.intro + dt / 2.4);
    }
    const t = clock.current.t;
    u.uTime.value = t;
    u.uIntro.value = clock.current.intro;
    u.uScroll.value = scroll;

    // Pointer → world position on the z = 0 plane.
    const p = pointer.current;
    tv.v.set(p.x, p.y, 0.5).unproject(camera);
    tv.dir.copy(tv.v).sub(camera.position).normalize();
    const dist = -camera.position.z / tv.dir.z;
    tv.target.copy(camera.position).addScaledVector(tv.dir, dist);
    (u.uPointer.value as THREE.Vector3).lerp(tv.target, 1 - Math.pow(0.0008, dt));
    u.uPointerStrength.value += (p.active - u.uPointerStrength.value) * (1 - Math.pow(0.02, dt));

    // Placement + gentle parallax toward the cursor.
    const right = placement === "right";
    const baseX = right ? viewport.width * 0.2 : 0;
    // Mobile: sit in the gap between the status pill and the headline, not behind the text.
    const baseY = right ? -0.02 : viewport.height * 0.29;
    g.position.x = baseX;
    g.position.y = baseY + scroll * 0.6;
    const s = (right ? Math.min(1.08, viewport.height * 0.36) : Math.min(0.66, viewport.width * 0.29)) * (1 + scroll * 0.25);
    g.scale.setScalar(s);

    const idle = reducedMotion ? 0 : Math.sin(t * 0.16) * 0.22;
    const ry = -0.95 + idle + p.x * 0.28 * p.active;
    const rx = 0.16 - p.y * 0.12 * p.active;
    g.rotation.y += (ry - g.rotation.y) * (1 - Math.pow(0.06, dt));
    g.rotation.x += (rx - g.rotation.x) * (1 - Math.pow(0.06, dt));
  });

  return (
    <group ref={group} rotation={[0.16, -0.95, 0]}>
      <points geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

// ─── Public component ────────────────────────────────────────────────────────

export type ParticleBrainProps = {
  /** 0 → 1 while the hero scrolls away; dissolves the cloud. */
  progress?: MotionValue<number>;
  /** Element whose pointer movement drives the interaction (defaults to the canvas wrapper). */
  interactionTarget?: React.RefObject<HTMLElement | null>;
  className?: string;
};

export default function ParticleBrain({ progress, interactionTarget, className }: ParticleBrainProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0, active: 0 });
  const [visible, setVisible] = useState(true);
  const [env] = useState(() => {
    if (typeof window === "undefined") {
      return { reduced: false, mobile: false, dpr: 1 };
    }
    const mobile = window.matchMedia("(max-width: 1023px)").matches;
    return {
      reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      mobile,
      dpr: Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 1.75),
    };
  });

  // Pause rendering when the hero is off-screen or the tab is hidden.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    let inView = true;
    const sync = () => setVisible(inView && !document.hidden);
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  useEffect(() => {
    const target = interactionTarget?.current ?? wrapRef.current;
    if (!target || env.reduced) return;
    const move = (e: PointerEvent) => {
      const r = wrapRef.current?.getBoundingClientRect();
      if (!r) return;
      pointer.current.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      pointer.current.y = -((e.clientY - r.top) / r.height) * 2 + 1;
      pointer.current.active = e.pointerType === "touch" ? 0.7 : 1;
    };
    const leave = () => {
      pointer.current.active = 0;
    };
    target.addEventListener("pointermove", move, { passive: true });
    target.addEventListener("pointerdown", move, { passive: true });
    target.addEventListener("pointerleave", leave);
    target.addEventListener("pointercancel", leave);
    return () => {
      target.removeEventListener("pointermove", move);
      target.removeEventListener("pointerdown", move);
      target.removeEventListener("pointerleave", leave);
      target.removeEventListener("pointercancel", leave);
    };
  }, [interactionTarget, env.reduced]);

  const frameloop = env.reduced ? "demand" : visible ? "always" : "never";

  return (
    <div ref={wrapRef} className={className} aria-hidden="true">
      <Canvas
        frameloop={frameloop}
        dpr={env.dpr}
        camera={{ position: [0, 0, 4.4], fov: 34, near: 0.1, far: 50 }}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        style={{ pointerEvents: "none" }}
      >
        <BrainPoints
          count={env.mobile ? 12000 : 26000}
          progress={progress}
          pointer={pointer}
          reducedMotion={env.reduced}
          placement={env.mobile ? "center" : "right"}
        />
      </Canvas>
    </div>
  );
}
