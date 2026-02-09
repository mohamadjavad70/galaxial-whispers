/**
 * Planet Seeds — localStorage-backed user planet creation system.
 */

import type { PlanetSeed, PlanetRecord } from "@/components/solarsystem/UserPlanetOrb";

const STORAGE_KEY = "qmetaram-planet-seeds";

export function getPlanetSeeds(): PlanetSeed[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
  catch { return []; }
}

export function savePlanetSeeds(seeds: PlanetSeed[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seeds));
}

export function addPlanetSeed(seed: Omit<PlanetSeed, "id" | "supports" | "forks" | "createdAt" | "records">): PlanetSeed {
  const newSeed: PlanetSeed = {
    ...seed,
    id: crypto.randomUUID?.() || Date.now().toString(36),
    supports: 0,
    forks: 0,
    createdAt: Date.now(),
    records: [],
  };
  const seeds = getPlanetSeeds();
  seeds.push(newSeed);
  savePlanetSeeds(seeds);
  return newSeed;
}

export function supportSeed(id: string) {
  const seeds = getPlanetSeeds();
  const s = seeds.find((x) => x.id === id);
  if (s) { s.supports++; savePlanetSeeds(seeds); }
}

export function forkSeed(id: string): PlanetSeed | null {
  const seeds = getPlanetSeeds();
  const s = seeds.find((x) => x.id === id);
  if (!s) return null;
  s.forks++;
  const fork: PlanetSeed = {
    ...s,
    id: crypto.randomUUID?.() || Date.now().toString(36),
    name: s.name + " (Fork)",
    supports: 0,
    forks: 0,
    createdAt: Date.now(),
    records: [],
  };
  seeds.push(fork);
  savePlanetSeeds(seeds);
  return fork;
}

export function addRecord(seedId: string, record: Omit<PlanetRecord, "id" | "createdAt">) {
  const seeds = getPlanetSeeds();
  const s = seeds.find((x) => x.id === seedId);
  if (!s) return;
  s.records.push({
    ...record,
    id: crypto.randomUUID?.() || Date.now().toString(36),
    createdAt: Date.now(),
  });
  savePlanetSeeds(seeds);
}
