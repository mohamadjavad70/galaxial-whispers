import { Suspense, lazy } from "react";
import { motion } from "framer-motion";
import MatrixLayout from "@/components/MatrixLayout";
import { cn } from "@/lib/utils";

const SolarSystemScene = lazy(() => import("@/components/SolarSystemScene"));

export default function GalacticQ() {
  return (
    <MatrixLayout showRain={false}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="relative w-full h-screen overflow-hidden"
      >
        <Suspense fallback={<LoadingGalaxy />}>
          <SolarSystemScene onNavigate={() => {}} onSunClick={() => {}} />
        </Suspense>

        {/* HUD Overlay */}
        <div className="absolute top-4 left-4 z-20 text-xs font-mono text-green-400">
          <div className="border border-green-400 p-2 rounded bg-black/50">
            <div>▌ GALACTIC Q NAVIGATION SYSTEM ▌</div>
            <div className="text-green-300 mt-1">Status: Online</div>
            <div className="text-green-300">Ships: Active</div>
          </div>
        </div>
      </motion.div>
    </MatrixLayout>
  );
}

function LoadingGalaxy() {
  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div className="text-center">
        <div className="animate-pulse text-green-400 font-mono mb-4">
          ▌ INITIALIZING GALAXY ▌
        </div>
        <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );
}
