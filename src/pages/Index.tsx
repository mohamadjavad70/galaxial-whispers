import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import SolarSystemScene from "@/components/SolarSystemScene";
import BiometricGate from "@/components/BiometricGate";
import GolGolab from "@/components/GolGolab";
import SunCoreChat from "@/components/SunCoreChat";
import { emitGolGolabEvent } from "@/components/ChatOverlay";
import { getContentBlocks } from "@/data/contentBlocks";

export default function Index() {
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(false);
  const [sunGateOpen, setSunGateOpen] = useState(false);
  const blocks = getContentBlocks();

  useEffect(() => {
    emitGolGolabEvent("first_galaxy_entry");
  }, []);

  const handleNavigate = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  const handleSunClick = useCallback(() => {
    setSunGateOpen(true);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative w-full h-screen overflow-hidden bg-background"
    >
      <SolarSystemScene onNavigate={handleNavigate} onSunClick={handleSunClick} />

      {/* Title overlay */}
      <div className="absolute inset-0 pointer-events-none flex flex-col items-center pt-8 z-10">
        <motion.h1
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          style={{ fontFamily: "Vazirmatn, sans-serif" }}
          className="text-4xl md:text-6xl font-black tracking-wider text-foreground text-glow"
        >
          {blocks.home.titleEn}
        </motion.h1>
        <motion.p
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-base md:text-lg text-muted-foreground mt-1"
        >
          {blocks.home.subtitleFa}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="text-xs text-muted-foreground/60 mt-0.5"
        >
          {blocks.home.subtitleEn}
        </motion.p>
      </div>

      <BiometricGate open={sunGateOpen} onClose={() => setSunGateOpen(false)} onNavigate={handleNavigate} />
      <GolGolab onClick={() => setChatOpen(true)} />
      <SunCoreChat open={chatOpen} onOpenChange={setChatOpen} />
    </motion.div>
  );
}
