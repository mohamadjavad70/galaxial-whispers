import { Suspense, useState, useCallback, useRef, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { getStarRegistry } from "@/data/starRegistry";
import type { StarConfig } from "@/data/starRegistry";
import { getLedger, logAction } from "@/lib/geneticHash";
import { getPlanetSeeds } from "@/lib/planetSeeds";
import QSun from "./solarsystem/QSun";
import OrbitingPlanet from "./solarsystem/OrbitingPlanet";
import OrbitRing from "./solarsystem/OrbitRing";
import UserPlanetOrb from "./solarsystem/UserPlanetOrb";
import SpaceshipControls from "./solarsystem/SpaceshipControls";
import SolarHUD from "./solarsystem/SolarHUD";
import QGateModal from "./solarsystem/QGateModal";
import PlanetSeedPanel from "./solarsystem/PlanetSeedPanel";
import WarpOverlay from "./galaxy/WarpOverlay";
import type { PlanetSeed } from "./solarsystem/UserPlanetOrb";

/* ─── Orbit config for 7 planets ─── */
const orbitConfigs = [
  { radius: 5, speed: 0.35, offset: 0, pRadius: 0.45 },
  { radius: 7, speed: 0.25, offset: 1.2, pRadius: 0.5 },
  { radius: 9, speed: 0.2, offset: 2.5, pRadius: 0.55 },
  { radius: 11, speed: 0.15, offset: 3.8, pRadius: 0.4 },
  { radius: 13, speed: 0.12, offset: 5.0, pRadius: 0.48 },
  { radius: 15, speed: 0.1, offset: 0.8, pRadius: 0.3 },
  { radius: 17, speed: 0.08, offset: 4.2, pRadius: 0.3 },
];

const USER_ORBIT_RADIUS = 20;

interface SolarSystemSceneProps {
  onNavigate: (path: string, chakraColor?: string) => void;
}

export default function SolarSystemScene({ onNavigate }: SolarSystemSceneProps) {
  const stars = useMemo(() => getStarRegistry(), []);
  const [hovered, setHovered] = useState<StarConfig | null>(null);
  const [showOrbits, setShowOrbits] = useState(true);
  const [timeScale, setTimeScale] = useState(1);
  const [explorerMode, setExplorerMode] = useState(false);
  const [focusedPlanet, setFocusedPlanet] = useState<string | null>(null);
  const [warpState, setWarpState] = useState<{ active: boolean; color: string; path: string }>({ active: false, color: "#00d4ff", path: "" });
  const [seedPanel, setSeedPanel] = useState(false);
  const [selectedSeed, setSelectedSeed] = useState<PlanetSeed | null>(null);
  const [qGate, setQGate] = useState<{ open: boolean; purpose: "q-core" | "planet-seed"; callback: () => void }>({ open: false, purpose: "q-core", callback: () => {} });
  const [gateCleared, setGateCleared] = useState(false);
  const [seedsVersion, setSeedsVersion] = useState(0);
  const orbitControlsRef = useRef<any>(null);
  const ledgerCount = useMemo(() => getLedger().length, []);
  const seeds = useMemo(() => getPlanetSeeds(), [seedsVersion]);

  const handlePlanetClick = useCallback((star: StarConfig) => {
    if (explorerMode) {
      // Focus mode
      setFocusedPlanet(star.slug);
      setExplorerMode(false);
    }
    setWarpState({ active: true, color: star.chakraColor, path: `/star/${star.slug}` });
  }, [explorerMode]);

  const handleSunClick = useCallback(() => {
    setQGate({
      open: true,
      purpose: "q-core",
      callback: () => {
        setGateCleared(true);
        setWarpState({ active: true, color: "#ffd700", path: "/q" });
      },
    });
  }, []);

  const handleWarpComplete = useCallback(() => {
    onNavigate(warpState.path, warpState.color);
  }, [onNavigate, warpState]);

  const handleReleaseFocus = useCallback(() => {
    setFocusedPlanet(null);
  }, []);

  const handleGatePass = useCallback(() => {
    setGateCleared(true);
    setQGate((g) => ({ ...g, open: false }));
    qGate.callback();
  }, [qGate]);

  const handleSeedGateRequest = useCallback(() => {
    setQGate({
      open: true,
      purpose: "planet-seed",
      callback: () => { setGateCleared(true); },
    });
  }, []);

  return (
    <div className="relative w-full h-full">
      <Canvas camera={{ position: [0, 12, 25], fov: 55 }} dpr={[1, 1.5]}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.08} />
          <Stars radius={100} depth={80} count={3000} factor={4} saturation={0.2} fade speed={0.3} />

          {/* Camera controls */}
          {!explorerMode && (
            <OrbitControls
              ref={orbitControlsRef}
              enableZoom
              enablePan={false}
              autoRotate={!focusedPlanet}
              autoRotateSpeed={0.15}
              maxDistance={60}
              minDistance={5}
              maxPolarAngle={Math.PI * 0.85}
              minPolarAngle={Math.PI * 0.1}
            />
          )}
          <SpaceshipControls enabled={explorerMode} />

          {/* Q Sun */}
          <QSun ledgerCount={ledgerCount} onClick={handleSunClick} />

          {/* Orbit rings */}
          {showOrbits && orbitConfigs.map((o, i) => (
            <OrbitRing key={`orbit-${i}`} radius={o.radius} color={stars[i]?.chakraColor || "#444"} opacity={0.08} />
          ))}
          {showOrbits && seeds.length > 0 && (
            <OrbitRing radius={USER_ORBIT_RADIUS} color="#ffffff" opacity={0.04} />
          )}

          {/* 7 orbiting planets */}
          {stars.map((star, i) => {
            const cfg = orbitConfigs[i];
            if (!cfg) return null;
            return (
              <OrbitingPlanet
                key={star.slug}
                star={star}
                orbitRadius={cfg.radius}
                orbitSpeed={cfg.speed}
                orbitOffset={cfg.offset}
                timeScale={timeScale}
                planetRadius={cfg.pRadius}
                onClick={() => handlePlanetClick(star)}
                isHovered={hovered?.slug === star.slug}
                onHover={setHovered}
              />
            );
          })}

          {/* User planet seeds in outer ring */}
          {seeds.map((seed, i) => (
            <UserPlanetOrb
              key={seed.id}
              seed={seed}
              orbitRadius={USER_ORBIT_RADIUS}
              orbitOffset={(i / Math.max(seeds.length, 1)) * Math.PI * 2}
              timeScale={timeScale}
              onClick={() => { setSelectedSeed(seed); setSeedPanel(true); }}
            />
          ))}
        </Suspense>
      </Canvas>

      {/* HUD overlay */}
      <SolarHUD
        showOrbits={showOrbits}
        onToggleOrbits={() => setShowOrbits((v) => !v)}
        timeScale={timeScale}
        onTimeScale={setTimeScale}
        explorerMode={explorerMode}
        onToggleExplorer={() => { setExplorerMode((v) => !v); setFocusedPlanet(null); }}
        focusedPlanet={focusedPlanet}
        onReleaseFocus={handleReleaseFocus}
      />

      {/* Hover tooltip */}
      {hovered && !warpState.active && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-card/90 backdrop-blur-md rounded-xl px-5 py-3 text-center border border-border pointer-events-none z-10">
          <p className="text-foreground font-bold text-base">{hovered.displayNameFa}</p>
          <p className="text-muted-foreground text-sm">{hovered.missionFa}</p>
          <p className="text-muted-foreground text-xs mt-1">{hovered.missionEn}</p>
        </div>
      )}

      {/* Planet seed panel toggle */}
      <button
        className="absolute bottom-6 right-6 z-20 bg-card/80 backdrop-blur-md border border-border rounded-full px-4 py-2 text-foreground text-xs font-medium hover:bg-card transition-colors"
        onClick={() => setSeedPanel((v) => !v)}
      >
        🌱 سیاره‌ها
      </button>

      <PlanetSeedPanel
        open={seedPanel}
        onClose={() => setSeedPanel(false)}
        onRefresh={() => setSeedsVersion((v) => v + 1)}
        selectedSeed={selectedSeed}
        onRequestGate={handleSeedGateRequest}
        gateCleared={gateCleared}
      />

      <QGateModal
        open={qGate.open}
        purpose={qGate.purpose}
        onClose={() => setQGate((g) => ({ ...g, open: false }))}
        onPass={handleGatePass}
      />

      <WarpOverlay
        active={warpState.active}
        chakraColor={warpState.color}
        onComplete={handleWarpComplete}
      />
    </div>
  );
}
