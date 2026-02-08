import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import GalaxyScene from "@/components/GalaxyScene";
import GolGolab from "@/components/GolGolab";
import ChatOverlay from "@/components/ChatOverlay";

export default function Index() {
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative w-full h-screen overflow-hidden bg-background"
    >
      <GalaxyScene onStarClick={(slug) => navigate(`/star/${slug}`)} />

      {/* Title overlay */}
      <div className="absolute inset-0 pointer-events-none flex flex-col items-center pt-12 z-10">
        <motion.h1
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-5xl md:text-7xl font-black tracking-wider text-foreground text-glow"
          style={{ fontFamily: "Vazirmatn, sans-serif" }}
        >
          QMETARAM
        </motion.h1>
        <motion.p
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-lg md:text-xl text-muted-foreground mt-2"
        >
          شبکه کهکشانی هفت ستاره
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="text-sm text-muted-foreground/60 mt-1"
        >
          Galactic 7-Star Network
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="text-xs text-muted-foreground/40 mt-8"
        >
          روی یک ستاره کلیک کن ✦
        </motion.p>
      </div>

      <GolGolab onClick={() => setChatOpen(true)} />
      <ChatOverlay open={chatOpen} onOpenChange={setChatOpen} />
    </motion.div>
  );
}
