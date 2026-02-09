import { useMemo } from "react";
import * as THREE from "three";

/**
 * OrbitRing — Renders a thin circular orbit line at a given radius.
 */

interface OrbitRingProps {
  radius: number;
  color?: string;
  opacity?: number;
}

export default function OrbitRing({ radius, color = "#ffffff", opacity = 0.12 }: OrbitRingProps) {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 64; i++) {
      const a = (i / 64) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
    }
    return pts;
  }, [radius]);

  const geo = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  const mat = useMemo(() => new THREE.LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false }), [color, opacity]);

  return <primitive object={new THREE.Line(geo, mat)} />;
}
