import { useState, useCallback } from "react";

export type HUDMode = "COMPACT" | "EXPANDED" | "CINEMATIC";

export interface HUDSettings {
  showOrbits: boolean;
  showLabels: boolean;
  timeSpeed: number;
  paused: boolean;
  hudMode: HUDMode;
  mouseLook: boolean;
  audioMuted: boolean;
  inertia: number; // 0..1
}

const STORAGE_KEY = "qmetaram-hud-settings";

const defaults: HUDSettings = {
  showOrbits: true,
  showLabels: true,
  timeSpeed: 1,
  paused: false,
  hudMode: "COMPACT",
  mouseLook: true,
  audioMuted: false,
  inertia: 0.4,
};

function load(): HUDSettings {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (!s) return defaults;
    const parsed = JSON.parse(s);
    // Migrate old keys
    if ("hudVisible" in parsed) {
      parsed.hudMode = parsed.hudVisible ? (parsed.hudMode || "COMPACT") : "CINEMATIC";
      delete parsed.hudVisible;
    }
    if ("feedMuted" in parsed) {
      parsed.audioMuted = parsed.feedMuted;
      delete parsed.feedMuted;
    }
    return { ...defaults, ...parsed };
  } catch {
    return defaults;
  }
}

export function useHUDSettings() {
  const [settings, setSettings] = useState<HUDSettings>(load);

  const update = useCallback((patch: Partial<HUDSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { settings, update };
}
