import { Suspense, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Float, Html, OrbitControls } from "@react-three/drei";
import { getStarRegistry, starPositions } from "@/data/starRegistry";
import type { StarConfig } from "@/data/starRegistry";
import * as THREE from "three";

interface StarSphereProps {
  star: StarConfig;
  position: [number, number, number];
  onClick: () => void;
  isHovered: boolean;
  onHover: (s: StarConfig | null) => void;
}

function StarSphere({ star, position, onClick, isHovered, onHover }: StarSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const baseScale = star.bgStyle === "placeholder" ? 0.3 : 0.45;

  useFrame((_, delta) => {
    if (meshRef.current) {
      const target = isHovered ? baseScale * 1.4 : baseScale;
      meshRef.current.scale.lerp(new THREE.Vector3(target, target, target), delta * 6);
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.6}>
      <group position={position}>
        <mesh
          ref={meshRef}
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          onPointerOver={(e) => { e.stopPropagation(); onHover(star); document.body.style.cursor = "pointer"; }}
          onPointerOut={() => { onHover(null); document.body.style.cursor = "auto"; }}
        >
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial
            color={star.chakraColor}
            emissive={star.chakraColor}
            emissiveIntensity={isHovered ? 2.5 : 1.2}
            transparent
            opacity={star.bgStyle === "placeholder" ? 0.5 : 0.9}
          />
        </mesh>
        <pointLight color={star.chakraColor} intensity={isHovered ? 3 : 1} distance={5} />
        <Html center position={[0, 1.2, 0]} style={{ pointerEvents: "none" }}>
          <div className="text-center whitespace-nowrap select-none">
            <p className="text-foreground text-sm font-bold drop-shadow-lg">{star.displayNameFa}</p>
            <p className="text-muted-foreground text-[10px]">{star.displayNameEn}</p>
          </div>
        </Html>
      </group>
    </Float>
  );
}

interface GalaxySceneProps {
  onStarClick: (slug: string) => void;
}

export default function GalaxyScene({ onStarClick }: GalaxySceneProps) {
  const [hovered, setHovered] = useState<StarConfig | null>(null);
  const stars = getStarRegistry();

  return (
    <div className="relative w-full h-full">
      <Canvas camera={{ position: [0, 0, 14], fov: 55 }} dpr={[1, 1.5]}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.15} />
          <pointLight position={[10, 10, 10]} intensity={0.3} />
          <Stars radius={80} depth={60} count={4000} factor={4} saturation={0.2} fade speed={0.5} />
          <OrbitControls
            autoRotate
            autoRotateSpeed={0.3}
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI * 0.7}
            minPolarAngle={Math.PI * 0.3}
          />
          {stars.map((star, i) => (
            <StarSphere
              key={star.slug}
              star={star}
              position={starPositions[i] || [0, 0, 0]}
              onClick={() => onStarClick(star.slug)}
              isHovered={hovered?.slug === star.slug}
              onHover={setHovered}
            />
          ))}
        </Suspense>
      </Canvas>
      {hovered && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-card/90 backdrop-blur-md rounded-xl px-5 py-3 text-center border border-border pointer-events-none">
          <p className="text-foreground font-bold text-base">{hovered.displayNameFa}</p>
          <p className="text-muted-foreground text-sm">{hovered.missionFa}</p>
          <p className="text-muted-foreground text-xs mt-1">{hovered.missionEn}</p>
        </div>
      )}
    </div>
  );
}
