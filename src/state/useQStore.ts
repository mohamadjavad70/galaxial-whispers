import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type UserTier = "FREE" | "EXPLORER" | "COMMANDER";

export interface User {
  id: string;
  name?: string;
  tier: UserTier;
  tokenBalance: number;
  connectedSocials: Record<string, string>;
}

export interface GalaxyState {
  shipPosition: [number, number, number];
  autopilotActive: boolean;
  autopilotTarget?: [number, number, number];
  discoveredPlanets: string[];
}

export interface HubState {
  chatHistory: { role: "user" | "ai"; message: string; timestamp: number }[];
  favoriteAIs: string[];
  aiRatings: Record<string, number>;
}

export interface QMetaramState {
  // User
  user: User;
  setUser: (user: Partial<User>) => void;

  // Galaxy
  galaxyState: GalaxyState;
  setGalaxyState: (state: Partial<GalaxyState>) => void;

  // Hub
  hubState: HubState;
  addChatMessage: (role: "user" | "ai", message: string) => void;
  setFavoriteAI: (aiId: string, isFavorite: boolean) => void;
  rateAI: (aiId: string, rating: number) => void;

  // Sync status
  lastSyncTime: number;
  syncUp: () => Promise<void>;
  syncDown: () => Promise<void>;
}

const defaultUser: User = {
  id: "anon_" + Date.now(),
  tier: "FREE",
  tokenBalance: 100,
  connectedSocials: {},
};

const defaultGalaxyState: GalaxyState = {
  shipPosition: [0, 0, 0],
  autopilotActive: false,
  discoveredPlanets: [],
};

const defaultHubState: HubState = {
  chatHistory: [],
  favoriteAIs: [],
  aiRatings: {},
};

export const useQStore = create<QMetaramState>()(
  persist(
    (set) => ({
      user: defaultUser,
      setUser: (user) =>
        set((state) => ({
          user: { ...state.user, ...user },
        })),

      galaxyState: defaultGalaxyState,
      setGalaxyState: (state) =>
        set((curr) => ({
          galaxyState: { ...curr.galaxyState, ...state },
        })),

      hubState: defaultHubState,
      addChatMessage: (role, message) =>
        set((state) => ({
          hubState: {
            ...state.hubState,
            chatHistory: [
              ...state.hubState.chatHistory,
              { role, message, timestamp: Date.now() },
            ],
          },
        })),
      setFavoriteAI: (aiId, isFavorite) =>
        set((state) => ({
          hubState: {
            ...state.hubState,
            favoriteAIs: isFavorite
              ? [...new Set([...state.hubState.favoriteAIs, aiId])]
              : state.hubState.favoriteAIs.filter((id) => id !== aiId),
          },
        })),
      rateAI: (aiId, rating) =>
        set((state) => ({
          hubState: {
            ...state.hubState,
            aiRatings: { ...state.hubState.aiRatings, [aiId]: rating },
          },
        })),

      lastSyncTime: Date.now(),
      syncUp: async () => {
        // Placeholder: implement actual sync to backend
        set({ lastSyncTime: Date.now() });
      },
      syncDown: async () => {
        // Placeholder: implement actual sync from backend
        set({ lastSyncTime: Date.now() });
      },
    }),
    {
      name: "qmetaram_v1",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);
