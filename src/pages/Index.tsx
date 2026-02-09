import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import GalaxyScene from "@/components/GalaxyScene";
import GolGolab from "@/components/GolGolab";
import ChatOverlay from "@/components/ChatOverlay";
import { getContentBlocks } from "@/data/contentBlocks";

export default function Index() {
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(false);
  const blocks = getContentBlocks();

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
          {blocks.home.titleEn}
        </motion.h1>
        <motion.p
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-lg md:text-xl text-muted-foreground mt-2"
        >
          {blocks.home.subtitleFa}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="text-sm text-muted-foreground/60 mt-1"
        >
          {blocks.home.subtitleEn}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="text-xs text-muted-foreground/40 mt-8"
        >
          {blocks.home.cta}
        </motion.p>
      </div>

      <GolGolab onClick={() => setChatOpen(true)} />
      <ChatOverlay open={chatOpen} onOpenChange={setChatOpen} />
    </motion.div>
  );
}
