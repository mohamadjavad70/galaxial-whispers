import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import ProceduralPlanet from "@/components/galaxy/ProceduralPlanet";
import type { StarConfig } from "@/data/starRegistry";

/**
 * OrbitingPlanet — A planet orbiting the sun at a given radius and speed.
 */

interface OrbitingPlanetProps {
  star: StarConfig;
  orbitRadius: number;
  orbitSpeed: number;
  orbitOffset: number;
  timeScale: number;
  planetRadius: number;
  onClick: () => void;
  isHovered: boolean;
  onHover: (star: StarConfig | null) => void;
}

// Derive planet colors from star config
function getColors(star: StarConfig) {
  const base: Record<string, { base: string; accent: string; clouds: boolean }> = {
    tesla: { base: "#0a2a3a", accent: "#00d4ff", clouds: true },
    matrix: { base: "#0a1a0a", accent: "#00ff41", clouds: false },
    molana: { base: "#2a0a1a", accent: "#ff6b9d", clouds: true },
    davinci: { base: "#2a2a0a", accent: "#ffd700", clouds: true },
    beethoven: { base: "#2a1a0a", accent: "#ff8c00", clouds: true },
    nebula: { base: "#1a1a2a", accent: "#8888aa", clouds: false },
    aurora: { base: "#0a1a2a", accent: "#7799aa", clouds: false },
  };
  return base[star.slug] || { base: "#1a1a2a", accent: star.chakraColor, clouds: false };
}

export default function OrbitingPlanet({
  star,
  orbitRadius,
  orbitSpeed,
  orbitOffset,
  timeScale,
  planetRadius,
  onClick,
  isHovered,
  onHover,
}: OrbitingPlanetProps) {
  const groupRef = useRef<THREE.Group>(null);
  const angleRef = useRef(orbitOffset);

  useFrame((_, delta) => {
    angleRef.current += delta * orbitSpeed * timeScale;
    if (groupRef.current) {
      groupRef.current.position.x = Math.cos(angleRef.current) * orbitRadius;
      groupRef.current.position.z = Math.sin(angleRef.current) * orbitRadius;
      // Slight Y wobble
      groupRef.current.position.y = Math.sin(angleRef.current * 2) * 0.3;
    }
  });

  const colors = getColors(star);

  return (
    <group ref={groupRef}>
      {/* Invisible click sphere */}
      <mesh
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerOver={(e) => { e.stopPropagation(); onHover(star); document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { onHover(null); document.body.style.cursor = "auto"; }}
      >
        <sphereGeometry args={[planetRadius * 1.3, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      <ProceduralPlanet
        position={[0, 0, 0]}
        radius={planetRadius}
        baseColor={colors.base}
        accentColor={colors.accent}
        showClouds={colors.clouds}
        rotationSpeed={0.06}
        atmosphereIntensity={isHovered ? 1.8 : 0.8}
      />

      <Html center position={[0, planetRadius + 0.6, 0]} style={{ pointerEvents: "none" }}>
        <div className="text-center whitespace-nowrap select-none">
          <p className={`text-foreground text-xs font-bold drop-shadow-lg ${isHovered ? "opacity-100" : "opacity-70"}`}>
            {star.displayNameFa}
          </p>
          <p className="text-muted-foreground text-[9px]">{star.displayNameEn}</p>
        </div>
      </Html>
    </group>
  );
}
