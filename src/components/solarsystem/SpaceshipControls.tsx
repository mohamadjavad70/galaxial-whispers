import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * SpaceshipControls — Free-fly WASD/QE camera with mouse-look.
 * Active only when `enabled` is true.
 */

interface SpaceshipControlsProps {
  enabled: boolean;
}

const SPEED = 8;
const BOOST = 20;
const SENSITIVITY = 0.003;

export default function SpaceshipControls({ enabled }: SpaceshipControlsProps) {
  const { camera, gl } = useThree();
  const keys = useRef<Set<string>>(new Set());
  const euler = useRef(new THREE.Euler(0, 0, 0, "YXZ"));
  const isLocked = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    const down = (e: KeyboardEvent) => keys.current.add(e.key.toLowerCase());
    const up = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase());
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      keys.current.clear();
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    const canvas = gl.domElement;
    const onDown = () => {
      isLocked.current = true;
      euler.current.setFromQuaternion(camera.quaternion);
    };
    const onUp = () => { isLocked.current = false; };
    const onMove = (e: MouseEvent) => {
      if (!isLocked.current) return;
      euler.current.y -= e.movementX * SENSITIVITY;
      euler.current.x -= e.movementY * SENSITIVITY;
      euler.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.current.x));
      camera.quaternion.setFromEuler(euler.current);
    };
    canvas.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("mousemove", onMove);
    return () => {
      canvas.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("mousemove", onMove);
    };
  }, [enabled, camera, gl]);

  useFrame((_, delta) => {
    if (!enabled) return;
    const k = keys.current;
    const speed = k.has("shift") ? BOOST : SPEED;
    const dir = new THREE.Vector3();
    if (k.has("w")) dir.z -= 1;
    if (k.has("s")) dir.z += 1;
    if (k.has("a")) dir.x -= 1;
    if (k.has("d")) dir.x += 1;
    if (k.has("q")) dir.y -= 1;
    if (k.has("e")) dir.y += 1;
    if (dir.lengthSq() > 0) {
      dir.normalize().multiplyScalar(speed * delta);
      dir.applyQuaternion(camera.quaternion);
      camera.position.add(dir);
    }
  });

  return null;
}
