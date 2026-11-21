"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import { createDandelion, createGlobe, createIdeaNetwork, createScatter, mulberry32 } from "./sceneShapes";

// One fixed WebGL layer behind the whole homepage. The particles are dandelion
// seeds; as the page scrolls they travel between shapes, telling one story:
// a dandelion (each seed a question) → its close-up → seeds in the air →
// a network of ideas (a problem branching into solutions) → seeds → a globe
// (the people it reaches) → seeds.
// Sections mark where each "scene" starts with data-scene.

// ─── Scenes ──────────────────────────────────────────────────────────────────

// shape: 0 dandelion, 1 scatter, 2 idea network, 3 globe. x is a fraction of the viewport
// width, y/s are world units (the view is 2.69 units tall at z = 0).
type Scene = { shape: number; x: number; y: number; s: number; rx: number; ry: number; spin: number; dim: number };

const DESKTOP: Scene[] = [
  { shape: 0, x: 0.2, y: 0.02, s: 0.82, rx: 0.06, ry: 0, spin: 0.03, dim: 1 }, // hero: the dandelion
  { shape: 0, x: -0.27, y: -0.55, s: 1.55, rx: 0.15, ry: 0.5, spin: 0.03, dim: 0.9 }, // about: the seed head up close
  { shape: 1, x: 0, y: 0, s: 1, rx: 0, ry: 0, spin: 0.025, dim: 0.6 }, // manifesto: seeds in the air
  { shape: 2, x: -0.2, y: 0, s: 0.82, rx: 0.25, ry: 0, spin: 0.07, dim: 1 }, // projects: ideas branching from a problem
  { shape: 1, x: 0, y: 0, s: 1, rx: 0, ry: 0.6, spin: 0.025, dim: 0.4 }, // project carousel
  { shape: 3, x: 0.27, y: -0.02, s: 0.86, rx: 0.32, ry: -0.6, spin: 0.07, dim: 1 }, // experience + skills: connection
  { shape: 1, x: 0, y: 0, s: 1, rx: 0, ry: 1.2, spin: 0.025, dim: 0.5 }, // certificates
  { shape: 1, x: 0, y: 0, s: 1.15, rx: 0, ry: 1.6, spin: 0.025, dim: 0.55 }, // contact
];

// Phones: shapes sit centred and dim behind full-width text.
const MOBILE: Scene[] = [
  { shape: 0, x: 0.05, y: 0.62, s: 0.46, rx: 0.06, ry: 0, spin: 0.03, dim: 1 },
  { shape: 0, x: 0, y: -0.2, s: 0.9, rx: 0.15, ry: 0.5, spin: 0.03, dim: 0.35 },
  { shape: 1, x: 0, y: 0, s: 0.8, rx: 0, ry: 0, spin: 0.025, dim: 0.45 },
  { shape: 2, x: 0, y: 0.15, s: 0.7, rx: 0.25, ry: 0, spin: 0.07, dim: 0.35 },
  { shape: 1, x: 0, y: 0, s: 0.8, rx: 0, ry: 0.6, spin: 0.025, dim: 0.3 },
  { shape: 3, x: 0, y: 0.15, s: 0.85, rx: 0.32, ry: -0.6, spin: 0.07, dim: 0.35 },
  { shape: 1, x: 0, y: 0, s: 0.8, rx: 0, ry: 1.2, spin: 0.025, dim: 0.35 },
  { shape: 1, x: 0, y: 0, s: 0.9, rx: 0, ry: 1.6, spin: 0.025, dim: 0.4 },
];

// ─── Shaders ─────────────────────────────────────────────────────────────────

const PALETTE = /* glsl */ `
  // One cool family (violet → blue → cyan → moonlight) with rare amber sparks.
  vec3 palette(float t) {
    float i = fract(t);
    if (i < 0.34) return vec3(0.50, 0.36, 1.00);
    if (i < 0.62) return vec3(0.30, 0.50, 1.00);
    if (i < 0.82) return vec3(0.34, 0.82, 1.00);
    if (i < 0.95) return vec3(0.82, 0.82, 1.00);
    return vec3(1.00, 0.72, 0.22);
  }

  // Light theme: saturated inks that hold their colour on paper white.
  vec3 inkPalette(float t) {
    float i = fract(t);
    if (i < 0.38) return vec3(0.40, 0.20, 0.88); // violet
    if (i < 0.66) return vec3(0.20, 0.26, 0.80); // indigo
    if (i < 0.84) return vec3(0.04, 0.50, 0.62); // teal
    if (i < 0.96) return vec3(0.55, 0.16, 0.62); // plum
    return vec3(0.86, 0.50, 0.06);               // amber
  }
`;

const shapeVertex = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uIntro;
  uniform float uFrom;
  uniform float uTo;
  uniform float uMix;
  uniform float uBurst;
  uniform float uDim;
  uniform float uPointerStrength;
  uniform vec3  uPointer;
  uniform float uLight; // 1 on the light theme: ink tones, normal blending

  attribute float aOrder;
  attribute vec3  aScatter;
  attribute vec3  aIdea;
  attribute vec3  aGlobe;
  attribute vec4  aRandom;
  attribute float aKind;

  varying vec3  vColor;
  varying float vAlpha;
  varying float vRot;
  varying float vShape;
  varying float vSoft;

  ${PALETTE}

  vec3 shapePos(float s) {
    if (s < 0.5) return position;
    if (s < 1.5) return aScatter;
    if (s < 2.5) return aIdea;
    return aGlobe;
  }

  void main() {
    // Morph: each particle leaves at its own moment, bursting outward mid-flight.
    float m = clamp((uMix - aRandom.x * 0.35) / 0.65, 0.0, 1.0);
    m = m * m * (3.0 - 2.0 * m);
    vec3 base = mix(shapePos(uFrom), shapePos(uTo), m);
    base += (aRandom.yzw - 0.5) * sin(m * 3.14159) * 1.4 * uBurst;

    // How much of the dandelion is on screen (0 during the other shapes).
    float dw = (uFrom < 0.5 ? 1.0 - m : 0.0) + (uTo < 0.5 ? m : 0.0);

    // The head nods in the breeze (more at the top, none at the root)…
    float bend = clamp((position.y + 1.35) / 2.7, 0.0, 1.0);
    base.x += dw * sin(uTime * 0.5) * 0.06 * bend * bend;

    // …and some seeds let go and drift up and away on the wind, again and again.
    float drift = fract(uTime * 0.035 + aRandom.z * 7.0);
    float flying = step(1.5, aKind) * step(aKind, 2.5) * dw;
    base += flying * vec3(
      drift * 2.8,
      drift * 1.1 + sin(drift * 6.2831 + aRandom.y * 20.0) * 0.12,
      sin(drift * 4.0 + aRandom.x * 10.0) * 0.35
    );

    // Intro: the stem rises first, then the head opens from its core to the tufts.
    float k = clamp((uIntro - aOrder * 0.7 - aRandom.x * 0.1) / 0.3, 0.0, 1.0);
    k = 1.0 - pow(1.0 - k, 3.0);
    vec3 origin = position.y > 0.0 ? vec3(0.0, 0.45, 0.0) : vec3(0.0, -1.35, 0.0);
    vec3 p = mix(origin, base, k);
    p += (aRandom.yzw - 0.5) * sin(uTime * 0.9 + aRandom.w * 6.2831) * 0.012;

    // On the dandelion a soft band of light climbs the stem and opens into the head;
    // on the other shapes a slow wave of light crosses them.
    float climb = smoothstep(0.92, 1.0, fract(aOrder - uTime * 0.14)) * dw;
    float w = sin(dot(base, normalize(vec3(0.25, 0.55, 1.0))) * 5.0 - uTime * 1.6 + aRandom.x * 0.5);
    float pulse = smoothstep(0.88, 1.0, w) * (1.0 - dw);

    vec4 world = modelMatrix * vec4(p, 1.0);

    // Pointer: seeds part around the cursor, like breath on a dandelion.
    vec3 d = world.xyz - uPointer;
    float f = smoothstep(0.8, 0.0, length(d)) * uPointerStrength;
    world.xyz += normalize(d + 1e-4) * f * 0.34;

    vec4 mv = viewMatrix * world;

    // Colour: moonlit white filaments and tufts with a lilac/blue tint, a warm amber
    // core, a cool stem. Other shapes use the palette.
    vec3 tuft = aRandom.w < 0.6 ? vec3(0.92, 0.93, 1.0) : (aRandom.w < 0.85 ? vec3(0.72, 0.68, 1.0) : vec3(0.55, 0.72, 1.0));
    vec3 own = aKind > 2.5 ? vec3(1.0, 0.74, 0.32)
             : aKind > 0.5 ? tuft
             : (position.y < 0.3 ? vec3(0.42, 0.62, 0.95) : vec3(0.68, 0.74, 1.0));
    vec3 col = mix(palette(aRandom.w + dot(position, vec3(0.32, 0.6, 0.22)) * 0.2), own, dw);
    vColor = col * (1.0 + pulse * 0.6 + f * 0.4) + vec3(0.6, 0.75, 1.0) * climb;

    float baseA = aKind > 2.5 ? 0.9 : (aKind > 1.5 ? 0.85 : (aKind > 0.5 ? 0.62 : 0.42));
    float near = smoothstep(0.6, 1.6, -mv.z); // fade anything about to touch the lens
    vAlpha = baseA * (1.0 + pulse * 0.6 + climb) * k * uDim * near;
    vAlpha *= mix(1.0, sin(drift * 3.14159), flying);

    // Light theme: saturated inks on paper (the dandelion keeps an amber core).
    vec3 ink = inkPalette(aRandom.w + dot(position, vec3(0.32, 0.6, 0.22)) * 0.2);
    vec3 inkOwn = aKind > 2.5 ? vec3(0.86, 0.5, 0.06)
               : aKind > 0.5 ? (aRandom.w < 0.6 ? vec3(0.36, 0.2, 0.86) : vec3(0.18, 0.3, 0.82))
               : vec3(0.26, 0.26, 0.5);
    vec3 lightCol = mix(ink, inkOwn, dw) + vec3(0.25, 0.15, 0.6) * (pulse * 0.3 + climb * 0.5);
    vColor = mix(vColor, lightCol, uLight);
    vAlpha *= mix(1.0, 1.15, uLight);

    // Tufts and drifting seeds are seed-shaped; filaments, stem and core are fine dots.
    float isSeed = step(0.5, aKind) * step(aKind, 2.5);
    float size = uSize * (0.55 + aRandom.y * 0.5) * mix(0.34, 1.0, isSeed) * (1.0 + flying * 0.6);
    size *= 1.0 + pulse * 0.35 + f * 0.6 + climb * 0.4;
    gl_PointSize = min(size * uPixelRatio / -mv.z, 72.0 * uPixelRatio);
    gl_Position = projectionMatrix * mv;

    // Seeds face outward from the head and turn slowly as they fly.
    vRot = atan(position.x, position.y - 0.45) + flying * uTime * 0.4;
    vShape = isSeed * 2.0;
    vSoft = 0.0;
  }
`;

// Ambient field: larger seeds drifting upward at many depths; the nearest are soft.
const ambientVertex = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uScroll;
  uniform float uIntro;
  uniform float uLight;

  attribute vec4 aRandom;

  varying vec3  vColor;
  varying float vAlpha;
  varying float vRot;
  varying float vShape;
  varying float vSoft;

  ${PALETTE}

  void main() {
    vec3 p = position;
    p.y = mod(p.y + uTime * 0.03 * (0.4 + aRandom.x) + uScroll + 3.5, 7.0) - 3.5;
    p.x += sin(uTime * 0.1 + aRandom.y * 6.2831) * 0.15;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float depth = -mv.z;

    vColor = mix(palette(aRandom.w), vec3(0.9, 0.9, 1.0), 0.45);
    vSoft = smoothstep(2.6, 0.9, depth);
    vAlpha = 0.45 * uIntro * (1.0 - vSoft * 0.55) * smoothstep(12.0, 5.0, depth) * smoothstep(0.35, 0.9, depth);
    vColor = mix(vColor, inkPalette(aRandom.w), uLight);
    vAlpha *= mix(1.0, 0.7, uLight);

    gl_PointSize = min(uSize * (0.6 + aRandom.y * 1.1) * uPixelRatio / depth, 90.0 * uPixelRatio);
    gl_Position = projectionMatrix * mv;

    vRot = (aRandom.x - 0.5) * 1.2 + sin(uTime * 0.4 + aRandom.y * 6.2831) * 0.25;
    vShape = 2.0;
  }
`;

const seedFragment = /* glsl */ `
  varying vec3  vColor;
  varying float vAlpha;
  varying float vRot;
  varying float vShape;
  varying float vSoft;

  float seg(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a, ba = b - a;
    return length(pa - ba * clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0));
  }

  // A dandelion seed: a fan of fine rays (the pappus) on a thin stalk, with the
  // seed itself at the bottom.
  float sdSeed(vec2 p) {
    vec2 o = vec2(0.0, 0.06);
    float d = 1e3;
    for (int k = 0; k < 9; k++) {
      float a = (float(k) / 8.0 - 0.5) * 2.4;
      d = min(d, seg(p, o, o + vec2(sin(a), cos(a)) * 0.33));
    }
    d = min(d, seg(p, o, vec2(0.0, -0.3)));
    d = min(d, length((p - vec2(0.0, -0.35)) * vec2(1.0, 0.6)) - 0.02);
    return d - 0.012;
  }

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    uv.y = -uv.y;
    float c = cos(vRot), s = sin(vRot);
    uv = mat2(c, s, -s, c) * uv;

    float a;
    if (vShape > 1.5) {
      float w = 0.03 + vSoft * 0.12;
      a = 1.0 - smoothstep(0.0, w, sdSeed(uv));
    } else {
      a = pow(smoothstep(0.5, 0.0, length(uv)), 1.6);
    }
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor, a * vAlpha);
  }
`;

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Tracks the site theme (the .dark class on <html>), also when it is toggled. */
export function useIsDark() {
  const [dark, setDark] = useState(() => typeof document === "undefined" || document.documentElement.classList.contains("dark"));
  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setDark(root.classList.contains("dark"));
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);
  return dark;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => t * t * (3 - 2 * t);
const TAU = Math.PI * 2;

export type Env = { reduced: boolean; mobile: boolean; dpr: number };

/**
 * Device pixel ratio for a full-screen canvas, capped so the canvas never
 * renders more than ~4.2M pixels (large Retina windows were GPU-bound at ~40fps).
 */
export function canvasDpr(max: number) {
  const native = window.devicePixelRatio || 1;
  const budget = Math.sqrt(4.2e6 / Math.max(1, window.innerWidth * window.innerHeight));
  return Math.max(1, Math.min(native, max, budget));
}
type Pointer = { x: number; y: number; active: number };

// Scroll position → continuous scene index. Scene i "arrives" while its marker's
// top travels from 80% to 20% of the viewport height.
function readStage(markers: Element[]) {
  const vh = window.innerHeight;
  let stage = 0;
  for (let i = 1; i < markers.length; i++) {
    const top = markers[i].getBoundingClientRect().top;
    stage += Math.min(1, Math.max(0, (vh * 0.8 - top) / (vh * 0.6)));
  }
  return stage;
}

// ─── Morphing shape ──────────────────────────────────────────────────────────

function ShapePoints({ count, env, pointer }: { count: number; env: Env; pointer: React.RefObject<Pointer> }) {
  const group = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { camera, size, viewport, gl, invalidate } = useThree();
  const scenes = env.mobile ? MOBILE : DESKTOP;

  const geometry = useMemo(() => {
    const flower = createDandelion(count);
    const r = mulberry32(9);
    const random = Float32Array.from({ length: count * 4 }, () => r());
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(flower.position, 3));
    g.setAttribute("aScatter", new THREE.BufferAttribute(createScatter(count), 3));
    g.setAttribute("aIdea", new THREE.BufferAttribute(createIdeaNetwork(count), 3));
    g.setAttribute("aGlobe", new THREE.BufferAttribute(createGlobe(count), 3));
    g.setAttribute("aRandom", new THREE.BufferAttribute(random, 4));
    g.setAttribute("aKind", new THREE.BufferAttribute(flower.kind, 1));
    g.setAttribute("aOrder", new THREE.BufferAttribute(flower.order, 1));
    return g;
  }, [count]);

  const [uniforms] = useState(() => ({
    uTime: { value: 0 },
    uSize: { value: 40 },
    uPixelRatio: { value: 1 },
    uIntro: { value: env.reduced ? 1 : 0 },
    uFrom: { value: 0 },
    uTo: { value: 0 },
    uMix: { value: 0 },
    uBurst: { value: 0 },
    uDim: { value: 1 },
    uPointerStrength: { value: 0 },
    uPointer: { value: new THREE.Vector3(99, 99, 0) },
    uLight: { value: 0 },
  }));
  const dark = useIsDark();

  useEffect(() => () => geometry.dispose(), [geometry]);

  useEffect(() => {
    const m = materialRef.current;
    if (!m) return;
    m.uniforms.uLight.value = dark ? 0 : 1;
    invalidate();
  }, [dark, invalidate]);

  useEffect(() => {
    const m = materialRef.current;
    if (!m) return;
    m.uniforms.uSize.value = 40 * Math.min(1.2, Math.max(0.7, size.height / 900));
    m.uniforms.uPixelRatio.value = gl.getPixelRatio();
    invalidate();
  }, [size.height, gl, invalidate]);

  const state = useRef({
    t: 0,
    intro: env.reduced ? 1 : 0,
    stage: -1,
    spin: 0,
    markers: [] as Element[],
    v: new THREE.Vector3(),
    dir: new THREE.Vector3(),
    target: new THREE.Vector3(),
  });

  useFrame((_, rawDelta) => {
    const g = group.current;
    const m = materialRef.current;
    if (!g || !m) return;
    const st = state.current;
    const dt = Math.min(rawDelta, 1 / 20);
    const u = m.uniforms;

    if (!env.reduced) {
      st.t += dt;
      st.intro = Math.min(1, st.intro + dt / 2.6);
    }
    u.uTime.value = st.t;
    u.uIntro.value = st.intro;

    if (st.markers.length === 0) st.markers = Array.from(document.querySelectorAll("[data-scene]"));
    const last = Math.min(scenes.length, Math.max(1, st.markers.length)) - 1;
    const target = Math.min(last, readStage(st.markers));
    // Light follow (Lenis already smooths the scroll, so a heavy ease here would
    // make the scene trail behind the hand); reduced motion snaps to a scene.
    if (env.reduced) st.stage = Math.round(target);
    else st.stage = st.stage < 0 ? target : st.stage + (target - st.stage) * (1 - Math.pow(0.0002, dt));

    const from = Math.floor(st.stage);
    const to = Math.min(from + 1, last);
    const f = st.stage - from;
    const A = scenes[from];
    const B = scenes[to];
    const e = smooth(f);

    u.uFrom.value = A.shape;
    u.uTo.value = B.shape;
    u.uMix.value = f;
    u.uBurst.value = A.shape === B.shape ? 0 : 1;
    u.uDim.value = lerp(A.dim, B.dim, e);

    // Spin accumulates in spinning scenes and unwinds to a full turn in still ones,
    // so a shape always comes back facing the same way.
    const spin = lerp(A.spin, B.spin, e);
    if (!env.reduced) st.spin += dt * spin;
    if (spin < 0.01) {
      const home = Math.round(st.spin / TAU) * TAU;
      st.spin += (home - st.spin) * (1 - Math.pow(0.05, dt));
    }

    // Pointer → world position on the z = 0 plane.
    const p = pointer.current;
    st.v.set(p.x, p.y, 0.5).unproject(camera);
    st.dir.copy(st.v).sub(camera.position).normalize();
    st.target.copy(camera.position).addScaledVector(st.dir, -camera.position.z / st.dir.z);
    (u.uPointer.value as THREE.Vector3).lerp(st.target, 1 - Math.pow(0.0008, dt));
    u.uPointerStrength.value += (p.active - u.uPointerStrength.value) * (1 - Math.pow(0.02, dt));

    const idle = env.reduced ? 0 : Math.sin(st.t * 0.16) * 0.13;
    g.position.set(lerp(A.x, B.x, e) * viewport.width, lerp(A.y, B.y, e), 0);
    g.scale.setScalar(lerp(A.s, B.s, e));
    g.rotation.set(
      lerp(A.rx, B.rx, e) - p.y * 0.1 * p.active,
      lerp(A.ry, B.ry, e) + st.spin + idle + p.x * 0.25 * p.active,
      0,
    );
  });

  return (
    <group ref={group}>
      <points geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          ref={materialRef}
          vertexShader={shapeVertex}
          fragmentShader={seedFragment}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={dark ? THREE.AdditiveBlending : THREE.NormalBlending}
        />
      </points>
    </group>
  );
}

// ─── Ambient seeds ───────────────────────────────────────────────────────────

// Also used on the inner pages (components/effects/SeedField.tsx).
export function AmbientField({ count, env }: { count: number; env: Env }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { gl } = useThree();

  const geometry = useMemo(() => {
    const r = mulberry32(5);
    const pos = new Float32Array(count * 3);
    const rnd = new Float32Array(count * 4);
    for (let i = 0; i < count; i++) {
      pos.set([(r() - 0.5) * 12, (r() - 0.5) * 7, -9 + r() * 12], i * 3);
      rnd.set([r(), r(), r(), r()], i * 4);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aRandom", new THREE.BufferAttribute(rnd, 4));
    return g;
  }, [count]);

  const [uniforms] = useState(() => ({
    uTime: { value: 0 },
    uSize: { value: 80 },
    uPixelRatio: { value: 1 },
    uScroll: { value: 0 },
    uIntro: { value: env.reduced ? 1 : 0 },
    uLight: { value: 0 },
  }));
  const dark = useIsDark();

  useEffect(() => () => geometry.dispose(), [geometry]);

  useEffect(() => {
    const m = materialRef.current;
    if (m) m.uniforms.uLight.value = dark ? 0 : 1;
  }, [dark]);

  const clock = useRef({ t: 0, intro: env.reduced ? 1 : 0 });

  useFrame((_, rawDelta) => {
    const m = materialRef.current;
    if (!m) return;
    const dt = Math.min(rawDelta, 1 / 20);
    if (!env.reduced) {
      clock.current.t += dt;
      clock.current.intro = Math.min(1, clock.current.intro + dt / 2);
    }
    m.uniforms.uTime.value = clock.current.t;
    m.uniforms.uIntro.value = clock.current.intro;
    m.uniforms.uPixelRatio.value = gl.getPixelRatio();
    // Parallax: the field rises a little as the page scrolls.
    m.uniforms.uScroll.value = window.scrollY * 0.0009;
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={ambientVertex}
        fragmentShader={seedFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={dark ? THREE.AdditiveBlending : THREE.NormalBlending}
      />
    </points>
  );
}

// ─── Public component ────────────────────────────────────────────────────────

export default function ParticleScene({ className }: { className?: string }) {
  const pointer = useRef<Pointer>({ x: 0, y: 0, active: 0 });
  const [hidden, setHidden] = useState(false);
  const [env] = useState<Env>(() => {
    if (typeof window === "undefined") return { reduced: false, mobile: false, dpr: 1 };
    const mobile = window.matchMedia("(max-width: 1023px)").matches;
    return {
      reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      mobile,
      dpr: canvasDpr(mobile ? 1.5 : 1.75),
    };
  });

  // Stop rendering while the tab is in the background.
  useEffect(() => {
    const sync = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  useEffect(() => {
    if (env.reduced) return;
    const move = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
      pointer.current.active = e.pointerType === "touch" ? 0 : 1;
    };
    const leave = () => {
      pointer.current.active = 0;
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [env.reduced]);

  const frameloop = hidden ? "never" : env.reduced ? "demand" : "always";

  return (
    <div className={className} aria-hidden="true">
      <Canvas
        frameloop={frameloop}
        dpr={env.dpr}
        camera={{ position: [0, 0, 4.4], fov: 34, near: 0.1, far: 50 }}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        style={{ pointerEvents: "none" }}
      >
        <AmbientField count={env.mobile ? 120 : 260} env={env} />
        <ShapePoints count={env.mobile ? 8000 : 16000} env={env} pointer={pointer} />
        {env.reduced && <ScrollInvalidate />}
      </Canvas>
    </div>
  );
}

// Reduced motion renders on demand: redraw when the page scrolls so scenes still change.
function ScrollInvalidate() {
  const { invalidate } = useThree();
  useEffect(() => {
    const on = () => invalidate();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, [invalidate]);
  return null;
}
