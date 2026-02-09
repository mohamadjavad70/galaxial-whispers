/**
 * Owner gate — client-side demo passphrase for Q Core / Command Center.
 */

export const OWNER_PASSPHRASE = "qmetaram";
const OWNER_KEY = "qcore_owner_unlocked";

export function isOwnerUnlocked(): boolean {
  try { return localStorage.getItem(OWNER_KEY) === "true"; } catch { return false; }
}

export function unlockOwner() {
  try { localStorage.setItem(OWNER_KEY, "true"); } catch {}
}

export function lockOwner() {
  try { localStorage.removeItem(OWNER_KEY); } catch {}
}
