import { useState, useCallback } from "react";

export interface HUDSettings {
  showOrbits: boolean;
  showLabels: boolean;
  timeSpeed: number;
  paused: boolean;
  hudVisible: boolean;
  mouseLook: boolean;
  feedMuted: boolean;
}

const STORAGE_KEY = "qmetaram-hud-settings";

const defaults: HUDSettings = {
  showOrbits: true,
  showLabels: true,
  timeSpeed: 1,
  paused: false,
  hudVisible: true,
  mouseLook: true,
  feedMuted: false,
};

function load(): HUDSettings {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? { ...defaults, ...JSON.parse(s) } : defaults;
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
