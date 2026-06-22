"use client";

// Reading-mode book viewer: the opened book as a true 3D object. It stays still
// and only turns when the viewer drags it (no auto-rotate). Transparent canvas
// so it sits on the reading overlay's backdrop.

import { Suspense, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Book3D } from "./Book3D";
import { makeStudioEnv } from "@/lib/library/textures";
import type { BookMeta } from "@/data/books";

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

function StaticBook({ title, meta }: { title: string; meta: BookMeta }) {
  // Still by default — the cover faces the viewer; dragging spins it.
  // Always show the real cover photo (like the live site); only fall back to the
  // designed cover when a book has no photo at all.
  return (
    <Book3D
      rotation={[0, -Math.PI / 2, 0]}
      title={title}
      meta={meta}
      height={2.5}
      thickness={0.24}
      coverWidth={1.7}
      showDesignedCover={!meta.cover && !!meta.coverBlurb}
    />
  );
}

export default function BookViewer3D({ title, meta }: { title: string; meta: BookMeta }) {
  return (
    <Canvas
      dpr={[1, 2]}
      shadows={false}
      camera={{ fov: 40, near: 0.1, far: 50, position: [0.5, 0.35, 3.6] }}
      gl={{ alpha: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.08 }}
      style={{ background: "transparent" }}
    >
      <Env />
      <ambientLight intensity={0.6} color="#fff6ec" />
      <directionalLight position={[4, 6, 5]} intensity={1.7} color="#fff3e2" />
      <directionalLight position={[-5, 2, -3]} intensity={0.8} color="#cdd8ff" />
      <pointLight position={[0, -2, 3]} intensity={5} distance={9} color="#ffe6c4" />

      <Suspense fallback={null}>
        <StaticBook title={title} meta={meta} />
      </Suspense>

      <ContactShadows position={[0, -1.7, 0]} scale={6} blur={2.6} opacity={0.3} far={4} resolution={512} color="#000000" />

      {/* No auto-rotate — the book stays still and only turns when dragged */}
      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        minDistance={2.6}
        maxDistance={6}
        minPolarAngle={0.4}
        maxPolarAngle={1.6}
      />
    </Canvas>
  );
}
