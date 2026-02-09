import { Suspense, useState, useCallback, useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { getStarRegistry } from "@/data/starRegistry";
import type { StarConfig } from "@/data/starRegistry";
import { getLedger, logAction } from "@/lib/geneticHash";
import { getPlanetSeeds } from "@/lib/planetSeeds";
import { useHUDSettings } from "@/hooks/useHUDSettings";
import type { TelemetryData } from "./solarsystem/SpaceshipControls";
import QSun from "./solarsystem/QSun";
import OrbitingPlanet from "./solarsystem/OrbitingPlanet";
import OrbitRing from "./solarsystem/OrbitRing";
import UserPlanetOrb from "./solarsystem/UserPlanetOrb";
import SpaceshipControls from "./solarsystem/SpaceshipControls";
import SpaceshipHUD from "./solarsystem/SpaceshipHUD";
import MobileFlightControls from "./solarsystem/MobileFlightControls";
import QGateModal from "./solarsystem/QGateModal";
import PlanetSeedPanel from "./solarsystem/PlanetSeedPanel";
import WarpOverlay from "./galaxy/WarpOverlay";
import type { PlanetSeed } from "./solarsystem/UserPlanetOrb";
import { emitGolGolabEvent } from "./ChatOverlay";

/* ─── Elliptical orbit configs for 7 planets ─── */
const orbitConfigs = [
  { radiusX: 5, radiusZ: 4.3, speed: 0.35, offset: 0, pRadius: 0.45 },
  { radiusX: 7.5, radiusZ: 6.8, speed: 0.25, offset: 1.2, pRadius: 0.5 },
  { radiusX: 10, radiusZ: 9.2, speed: 0.2, offset: 2.5, pRadius: 0.55 },
  { radiusX: 12.5, radiusZ: 11.5, speed: 0.15, offset: 3.8, pRadius: 0.4 },
  { radiusX: 15, radiusZ: 13.8, speed: 0.12, offset: 5.0, pRadius: 0.48 },
  { radiusX: 17.5, radiusZ: 16.5, speed: 0.1, offset: 0.8, pRadius: 0.3 },
  { radiusX: 20, radiusZ: 18.5, speed: 0.08, offset: 4.2, pRadius: 0.3 },
];
const USER_ORBIT_RX = 24;
const USER_ORBIT_RZ = 22;

type CameraMode = "freefly" | "focus" | "autopilot";

/* ─── TimeDriver: accumulates global orbit time inside Canvas ─── */
function TimeDriver({ timeScale, timeRef }: { timeScale: number; timeRef: React.MutableRefObject<number> }) {
  useFrame((_, delta) => { timeRef.current += delta * timeScale; });
  return null;
}

/* ─── FocusCameraController: OrbitControls around a target ─── */
function FocusCameraController({
  targetSlug,
  planetPositionsRef,
}: {
  targetSlug: string | null;
  planetPositionsRef: React.MutableRefObject<Map<string, THREE.Vector3>>;
}) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const initialized = useRef<string | null>(null);

  useFrame(() => {
    if (!controlsRef.current) return;
    const pos = targetSlug
      ? planetPositionsRef.current.get(targetSlug) || new THREE.Vector3()
      : new THREE.Vector3();
    controlsRef.current.target.lerp(pos, 0.05);
    controlsRef.current.update();

    // On first activation or slug change, move camera near target
    if (initialized.current !== targetSlug) {
      camera.position.copy(pos).add(new THREE.Vector3(3, 2, 3));
      initialized.current = targetSlug;
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      maxDistance={10}
      minDistance={2}
      autoRotate
      autoRotateSpeed={0.5}
    />
  );
}

/* ─── Main Scene ─── */
interface SolarSystemSceneProps {
  onNavigate: (path: string, chakraColor?: string) => void;
  onSunClick?: () => void;
}

export default function SolarSystemScene({ onNavigate, onSunClick }: SolarSystemSceneProps) {
  const stars = useMemo(() => getStarRegistry(), []);
  const { settings, update: updateSettings } = useHUDSettings();

  // Shared refs
  const keysRef = useRef<Set<string>>(new Set());
  const globalTimeRef = useRef(0);
  const telemetryRef = useRef<TelemetryData>({ speed: 0, position: [0, 12, 25], altitude: 12 });
  const planetPositionsRef = useRef<Map<string, THREE.Vector3>>(new Map());

  // State
  const [cameraMode, setCameraMode] = useState<CameraMode>("freefly");
  const [focusedSlug, setFocusedSlug] = useState<string | null>(null);
  const [autopilotSlug, setAutopilotSlug] = useState<string | null>(null);
  const [hovered, setHovered] = useState<StarConfig | null>(null);
  const [warpState, setWarpState] = useState({ active: false, color: "#00d4ff", path: "" });
  const [timeScrub, setTimeScrub] = useState(0);
  const [telemetrySnapshot, setTelemetrySnapshot] = useState<TelemetryData>(telemetryRef.current);
  const [seedPanel, setSeedPanel] = useState(false);
  const [selectedSeed, setSelectedSeed] = useState<PlanetSeed | null>(null);
  const [qGate, setQGate] = useState<{ open: boolean; purpose: "q-core" | "planet-seed"; callback: () => void }>({ open: false, purpose: "q-core", callback: () => {} });
  const [gateCleared, setGateCleared] = useState(false);
  const [seedsVersion, setSeedsVersion] = useState(0);

  const focusedStar = focusedSlug ? stars.find((s) => s.slug === focusedSlug) || null : null;
  const autopilotName = autopilotSlug ? stars.find((s) => s.slug === autopilotSlug)?.displayNameFa || null : null;
  const effectiveTimeScale = settings.paused ? 0 : settings.timeSpeed;
  const seeds = useMemo(() => getPlanetSeeds(), [seedsVersion]);

  // Telemetry polling for DOM updates
  useEffect(() => {
    const id = setInterval(() => setTelemetrySnapshot({ ...telemetryRef.current }), 250);
    return () => clearInterval(id);
  }, []);

  // Handlers
  const handlePlanetClick = useCallback((star: StarConfig) => {
    setCameraMode("focus");
    setFocusedSlug(star.slug);
    setAutopilotSlug(null);
    logAction("focus_planet", star.slug);
    emitGolGolabEvent("first_planet_focus");
  }, []);

  const handleSunClick = useCallback(() => {
    if (onSunClick) {
      onSunClick();
    } else {
      setWarpState({ active: true, color: "#ffd700", path: "/q" });
    }
    emitGolGolabEvent("enter_qcore");
  }, [onSunClick]);

  const handleWarpComplete = useCallback(() => {
    onNavigate(warpState.path, warpState.color);
  }, [onNavigate, warpState]);

  const handleNavSubmit = useCallback((query: string) => {
    const q = query.toLowerCase();
    const target = stars.find((s) =>
      s.slug === q ||
      s.displayNameEn.toLowerCase().includes(q) ||
      s.displayNameFa.includes(query)
    );
    if (target && planetPositionsRef.current.has(target.slug)) {
      setAutopilotSlug(target.slug);
      setCameraMode("autopilot");
      logAction("autopilot_started", target.slug);
      emitGolGolabEvent("first_autopilot");
    }
  }, [stars]);

  const handleAutopilotArrived = useCallback(() => {
    if (autopilotSlug) {
      setCameraMode("focus");
      setFocusedSlug(autopilotSlug);
      logAction("autopilot_completed", autopilotSlug);
    }
    setAutopilotSlug(null);
  }, [autopilotSlug]);

  const handleCancelAutopilot = useCallback(() => {
    setAutopilotSlug(null);
    setCameraMode("freefly");
    logAction("autopilot_canceled", "system");
  }, []);

  const handleReleaseFocus = useCallback(() => {
    setFocusedSlug(null);
    setCameraMode("freefly");
  }, []);

  const handleEnterWorld = useCallback(() => {
    if (focusedStar) {
      setWarpState({ active: true, color: focusedStar.chakraColor, path: `/star/${focusedStar.slug}` });
      logAction("enter_world", focusedStar.slug);
    }
  }, [focusedStar]);

  const handleToggleExplorer = useCallback(() => {
    if (cameraMode === "freefly") {
      setCameraMode("focus");
      setFocusedSlug(null);
    } else {
      setCameraMode("freefly");
      setFocusedSlug(null);
      setAutopilotSlug(null);
    }
  }, [cameraMode]);

  const handleQuickPlanet = useCallback((slug: string) => {
    if (planetPositionsRef.current.has(slug)) {
      setAutopilotSlug(slug);
      setCameraMode("autopilot");
      logAction("nav_prompt_submitted", slug);
    }
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

          <TimeDriver timeScale={effectiveTimeScale} timeRef={globalTimeRef} />

          {/* Camera controllers — only one active at a time */}
          {(cameraMode === "freefly" || cameraMode === "autopilot") && (
            <SpaceshipControls
              enabled
              mouseLook={settings.mouseLook}
              keysRef={keysRef}
              telemetryRef={telemetryRef}
              planetPositionsRef={planetPositionsRef}
              autopilotSlug={cameraMode === "autopilot" ? autopilotSlug : null}
              onAutopilotArrived={handleAutopilotArrived}
            />
          )}
          {cameraMode === "focus" && (
            <FocusCameraController
              targetSlug={focusedSlug}
              planetPositionsRef={planetPositionsRef}
            />
          )}

          {/* Q Sun */}
          <QSun ledgerCount={getLedger().length} onClick={handleSunClick} />

          {/* Orbit rings */}
          {settings.showOrbits && orbitConfigs.map((o, i) => (
            <OrbitRing
              key={`orbit-${i}`}
              radiusX={o.radiusX}
              radiusZ={o.radiusZ}
              color={stars[i]?.chakraColor || "#444"}
              opacity={0.07}
            />
          ))}
          {settings.showOrbits && seeds.length > 0 && (
            <OrbitRing radiusX={USER_ORBIT_RX} radiusZ={USER_ORBIT_RZ} color="#ffffff" opacity={0.03} />
          )}

          {/* 7 orbiting planets */}
          {stars.map((star, i) => {
            const cfg = orbitConfigs[i];
            if (!cfg) return null;
            return (
              <OrbitingPlanet
                key={star.slug}
                star={star}
                orbitRadiusX={cfg.radiusX}
                orbitRadiusZ={cfg.radiusZ}
                orbitSpeed={cfg.speed}
                orbitOffset={cfg.offset}
                globalTimeRef={globalTimeRef}
                timeScrub={timeScrub}
                planetRadius={cfg.pRadius}
                showLabel={settings.showLabels}
                onClick={() => handlePlanetClick(star)}
                isHovered={hovered?.slug === star.slug}
                onHover={setHovered}
                planetPositionsRef={planetPositionsRef}
              />
            );
          })}

          {/* User planet seeds */}
          {seeds.map((seed, i) => (
            <UserPlanetOrb
              key={seed.id}
              seed={seed}
              orbitRadius={USER_ORBIT_RX}
              orbitOffset={(i / Math.max(seeds.length, 1)) * Math.PI * 2}
              timeScale={effectiveTimeScale}
              onClick={() => { setSelectedSeed(seed); setSeedPanel(true); }}
            />
          ))}
        </Suspense>
      </Canvas>

      {/* Glass Cockpit HUD */}
      <SpaceshipHUD
        settings={settings}
        onUpdate={updateSettings}
        telemetry={telemetrySnapshot}
        stars={stars}
        cameraMode={cameraMode}
        autopilotName={autopilotName}
        focusedStar={focusedStar}
        timeScrub={timeScrub}
        onTimeScrub={setTimeScrub}
        onNavSubmit={handleNavSubmit}
        onCancelAutopilot={handleCancelAutopilot}
        onReleaseFocus={handleReleaseFocus}
        onQuickPlanet={handleQuickPlanet}
        onEnterWorld={handleEnterWorld}
        onToggleExplorer={handleToggleExplorer}
      />

      {/* Mobile flight controls */}
      <MobileFlightControls keysRef={keysRef} visible={cameraMode === "freefly"} />

      {/* Hover tooltip */}
      {hovered && !warpState.active && cameraMode !== "focus" && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-card/80 backdrop-blur-md rounded-xl px-5 py-3 text-center border border-border/20 pointer-events-none z-10">
          <p className="text-foreground font-bold text-base">{hovered.displayNameFa}</p>
          <p className="text-muted-foreground text-sm">{hovered.missionFa}</p>
          <p className="text-muted-foreground text-xs mt-1">{hovered.missionEn}</p>
        </div>
      )}

      {/* Planet seed panel */}
      <button
        className="absolute bottom-6 right-6 z-20 bg-card/60 backdrop-blur-md border border-border/20 rounded-full px-4 py-2 text-foreground text-xs font-medium hover:bg-card/80 transition-colors"
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
