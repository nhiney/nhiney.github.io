"use client";

// A real 3D hardcover book: one box, six painted faces (front cover, back,
// spine, fore-edge pages, top/bottom edges). The front cover uses a real photo
// when `meta.cover` is set, otherwise a clean designed canvas cover. Matte
// materials + light env reflection so it reads like a product render, not "AI".
//
// Axis: X = thickness → +X front cover / -X back; Y = height; Z = cover width →
// +Z spine / -Z fore-edge. So rotating about Y reveals every face.

import { useEffect, useMemo } from "react";
import { ThreeElements } from "@react-three/fiber";
import * as THREE from "three";
import type { BookMeta } from "@/data/books";
import { makeCoverTexture, makePagesTexture, makeSpineTexture } from "@/lib/library/textures";

type GroupProps = ThreeElements["group"];

export interface Book3DProps extends GroupProps {
  title: string;
  meta: BookMeta;
  thickness?: number;
  height?: number;
  coverWidth?: number;
}

export function Book3D({
  title,
  meta,
  thickness = 0.5,
  height = 2.4,
  coverWidth = 1.62,
  ...group
}: Book3DProps) {
  const { materials, owned } = useMemo(() => {
    const coverTex = makeCoverTexture(meta, title);
    const spineTex = makeSpineTexture(meta, title);
    const pagesTex = makePagesTexture();

    const cover = new THREE.MeshStandardMaterial({ map: coverTex, roughness: 0.78, metalness: 0, envMapIntensity: 0.4 });
    const back = new THREE.MeshStandardMaterial({
      color: new THREE.Color(`hsl(${meta.hue}, ${meta.saturation}%, ${Math.max(8, meta.lightness - 8)}%)`),
      roughness: 0.82,
      metalness: 0,
      envMapIntensity: 0.35,
    });
    const spine = new THREE.MeshStandardMaterial({ map: spineTex, roughness: 0.8, metalness: 0, envMapIntensity: 0.4 });
    // Aged-paper page edges — warm but dim, with barely any env reflection, so
    // they read as real pages, never a glaring white band beside the cover.
    const pages = new THREE.MeshStandardMaterial({ map: pagesTex, color: new THREE.Color("#9b8e70"), roughness: 1, metalness: 0, envMapIntensity: 0.1 });
    const edge = new THREE.MeshStandardMaterial({ color: new THREE.Color("#94886c"), roughness: 1, metalness: 0, envMapIntensity: 0.1 });

    // BoxGeometry face order: +X, -X, +Y, -Y, +Z, -Z
    const materials = [cover, back, edge, edge, spine, pages];
    return { materials, owned: [coverTex, spineTex] };
  }, [meta, title]);

  useEffect(() => {
    return () => {
      owned.forEach((t) => t.dispose());
      materials.forEach((m) => m.dispose());
    };
  }, [materials, owned]);

  // Swap in real photos onto the front (+X), back (-X) and spine (+Z) faces
  // whenever provided, replacing the procedural artwork on those faces.
  useEffect(() => {
    const jobs: [string, number][] = [];
    if (meta.cover) jobs.push([meta.cover, 0]); // +X front
    if (meta.coverBack) jobs.push([meta.coverBack, 1]); // -X back
    if (meta.coverSpine) jobs.push([meta.coverSpine, 4]); // +Z spine
    if (!jobs.length) return;

    let disposed = false;
    const loaded: THREE.Texture[] = [];
    const loader = new THREE.TextureLoader();
    for (const [url, idx] of jobs) {
      loader.load(url, (tex) => {
        if (disposed) return tex.dispose();
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 8;
        loaded.push(tex);
        const m = materials[idx] as THREE.MeshStandardMaterial;
        m.map?.dispose();
        m.map = tex;
        m.color.set("#ffffff");
        m.needsUpdate = true;
      });
    }
    return () => {
      disposed = true;
      loaded.forEach((t) => t.dispose());
    };
  }, [meta.cover, meta.coverBack, meta.coverSpine, materials]);

  return (
    <group {...group}>
      <mesh castShadow receiveShadow material={materials}>
        <boxGeometry args={[thickness, height, coverWidth]} />
      </mesh>
    </group>
  );
}
