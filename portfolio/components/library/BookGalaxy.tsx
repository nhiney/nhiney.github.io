"use client";

// A floating book galaxy: the books are spread on a sphere and tumble gently;
// orbit the camera a FULL 360 (drag any direction) to bring every book around
// and see it from all sides. Hover lifts a book and shows its title; click to
// read. Adapts to light/dark theme. Real cover photos.

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveEvents, Html, OrbitControls, PerformanceMonitor, Sparkles, Stars } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, SMAA } from "@react-three/postprocessing";
import * as THREE from "three";
import { Book3D } from "./Book3D";
import { makeStudioEnv } from "@/lib/library/textures";
import type { LibBookView } from "@/lib/library/types";

function Env() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  useEffect(() => {
    const tex = makeStudioEnv();
    const pmrem = new THREE.PMREMGenerator(gl);
    const rt = pmrem.fromEquirectangular(tex);
    // Three.js scene environment is intentionally imperative.
    // eslint-disable-next-line react-hooks/immutability
    scene.environment = rt.texture;
    tex.dispose();
    pmrem.dispose();
    return () => {
      rt.dispose();
      scene.environment = null;
    };
  }, [gl, scene]);
  return null;
}

// Golden-spiral spread on a sphere so a full orbit reveals every book.
function spherePositions(n: number, R: number): [number, number, number][] {
  const ga = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: n }, (_, i) => {
    const y = n === 1 ? 0 : 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const th = i * ga;
    return [Math.cos(th) * r * R, y * R * 0.72, Math.sin(th) * r * R];
  });
}

function FloatingBook({
  book,
  pos,
  index,
  onHover,
  onSelect,
}: {
  book: LibBookView;
  pos: [number, number, number];
  index: number;
  onHover: (b: LibBookView | null) => void;
  onSelect: (slug: string) => void;
}) {
  const [hot, setHot] = useState(false);
  const inner = useRef<THREE.Group>(null);
  // Orient the cover to face radially outward, so whichever books are on the
  // near side of the sphere always show their COVER to the camera (never a
  // blank page side). Book3D's cover is its +X face.
  const baseRy = Math.atan2(-pos[2], pos[0]);

  useFrame((state, dt) => {
    const g = inner.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    g.rotation.y = Math.sin(t * 0.4 + index) * 0.14; // gentle sway, cover stays out
    g.rotation.x = Math.sin(t * 0.32 + index * 1.3) * 0.07;
    g.position.y = Math.sin(t * 0.6 + index * 1.7) * 0.18;
    const s = THREE.MathUtils.damp(g.scale.x, hot ? 1.2 : 1, 9, dt);
    g.scale.setScalar(s);
  });

  return (
    <group
      position={pos}
      rotation={[0, baseRy, 0]}
      userData={{ slug: book.slug }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHot(true);
        onHover(book);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHot(false);
        onHover(null);
        document.body.style.cursor = "";
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(book.slug);
      }}
    >
      <group ref={inner}>
        {/* Slightly smaller than the sphere spacing so neighbours don't crowd —
           each cover reads clearly on its own. */}
        <Book3D title={book.title} meta={book.meta} height={1.28} thickness={0.27} coverWidth={0.88} />
      </group>
      {hot && (
        <>
          <pointLight position={[0, 0, 1]} distance={3} intensity={4} color="#ffe6c0" />
          <Html position={[0, 1.15, 0]} center distanceFactor={9} style={{ pointerEvents: "none" }}>
            <div
              style={{
                whiteSpace: "nowrap",
                textAlign: "center",
                fontFamily: "Georgia, serif",
                color: "#fff",
                background: "rgba(10,12,24,0.72)",
                padding: "5px 12px",
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.14)",
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 600 }}>{book.title.split("—")[0].trim()}</div>
              <div style={{ fontSize: 10, opacity: 0.7, fontStyle: "italic" }}>{book.meta.author}</div>
            </div>
          </Html>
        </>
      )}
    </group>
  );
}

function GalaxyContent({
  books,
  onSelect,
  setDpr,
  isDark,
}: {
  books: LibBookView[];
  onSelect: (slug: string) => void;
  setDpr: (n: number) => void;
  isDark: boolean;
}) {
  const positions = useMemo(() => spherePositions(books.length, 4.7), [books.length]);

  return (
    <>
      {isDark ? (
        <>
          <color attach="background" args={["#07080f"]} />
          <fog attach="fog" args={["#07080f", 16, 46]} />
        </>
      ) : (
        <fog attach="fog" args={["#eef1f6", 20, 50]} />
      )}
      <Env />

      {isDark ? (
        <>
          <Stars radius={80} depth={50} count={6000} factor={5} saturation={0} fade speed={1} />
          <Stars radius={26} depth={16} count={1200} factor={3} saturation={0} fade speed={2} />
        </>
      ) : (
        <Sparkles count={60} scale={[16, 12, 16]} size={5} speed={0.3} opacity={0.5} color="#b98ac0" />
      )}

      <ambientLight intensity={isDark ? 0.34 : 0.8} color={isDark ? "#9fb0d8" : "#ffffff"} />
      <directionalLight position={[5, 6, 6]} intensity={isDark ? 1.4 : 1.7} color="#fff1da" />
      <directionalLight position={[-6, 2, -5]} intensity={isDark ? 1.0 : 0.7} color={isDark ? "#7da0ff" : "#dfe6ff"} />
      <directionalLight position={[0, 3, -9]} intensity={isDark ? 1.6 : 1.0} color="#ffd6a6" />
      <pointLight position={[0, 0, 8]} intensity={isDark ? 16 : 10} distance={26} color="#ffe9cf" />

      {books.map((b, i) => (
        <FloatingBook key={b.slug} book={b} pos={positions[i]} index={i} onHover={() => {}} onSelect={onSelect} />
      ))}

      {/* Full 360 orbit in any direction → see every book from all sides */}
      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        autoRotate
        autoRotateSpeed={0.5}
        minDistance={4}
        maxDistance={20}
        minPolarAngle={0.25}
        maxPolarAngle={Math.PI - 0.25}
      />

      <EffectComposer multisampling={0}>
        <Bloom intensity={0.32} luminanceThreshold={0.9} luminanceSmoothing={0.25} mipmapBlur />
        <Vignette eskil={false} offset={0.3} darkness={isDark ? 0.78 : 0.3} />
        <SMAA />
      </EffectComposer>

      <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(1.5)} onFallback={() => setDpr(1)} />
      <AdaptiveEvents />
    </>
  );
}

export default function BookGalaxy({
  books,
  onSelect,
  paused,
  isDark = true,
}: {
  books: LibBookView[];
  onSelect: (slug: string) => void;
  paused?: boolean;
  isDark?: boolean;
}) {
  const [dpr, setDpr] = useState(1.5);
  return (
    <Canvas
      frameloop={paused ? "never" : "always"}
      dpr={dpr}
      camera={{ fov: 50, near: 0.1, far: 160, position: [0, 1, 11] }}
      gl={{ alpha: true, antialias: false, powerPreference: "high-performance", toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0 }}
    >
      <Suspense fallback={null}>
        <GalaxyContent books={books} onSelect={onSelect} setDpr={setDpr} isDark={isDark} />
      </Suspense>
    </Canvas>
  );
}
