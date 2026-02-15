import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/galaxial-whispers/",
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // 3D Graphics
          "vendor-3d": ["three", "@react-three/fiber", "@react-three/drei"],
          // UI & Animation
          "vendor-ui": ["framer-motion", "lucide-react", "react-router-dom"],
          // Utilities
          "vendor-utils": ["@tanstack/react-query", "sonner", "recharts"],
        },
      },
    },
  },
}));
