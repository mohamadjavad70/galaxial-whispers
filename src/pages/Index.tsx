import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import GalaxyScene from "@/components/GalaxyScene";
import GolGolab from "@/components/GolGolab";
import ChatOverlay from "@/components/ChatOverlay";
import WarpOverlay from "@/components/galaxy/WarpOverlay";
import { getContentBlocks } from "@/data/contentBlocks";

export default function Index() {
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(false);
  const [warpState, setWarpState] = useState<{ active: boolean; color: string; slug: string }>({
    active: false,
    color: "#00d4ff",
    slug: "",
  });
  const blocks = getContentBlocks();

  // Scroll-based parallax for DOM overlay
  const { scrollYProgress } = useScroll();
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const subtitleY = useTransform(scrollYProgress, [0, 1], [0, -20]);

  const handleStarClick = useCallback((slug: string, chakraColor: string) => {
    setWarpState({ active: true, color: chakraColor, slug });
  }, []);

  const handleWarpComplete = useCallback(() => {
    navigate(`/star/${warpState.slug}`);
  }, [navigate, warpState.slug]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative w-full h-screen overflow-hidden bg-background"
    >
      <GalaxyScene onStarClick={handleStarClick} />

      {/* Title overlay with pointer-based parallax */}
      <div className="absolute inset-0 pointer-events-none flex flex-col items-center pt-12 z-10">
        <motion.h1
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          style={{ y: titleY, fontFamily: "Vazirmatn, sans-serif" }}
          className="text-5xl md:text-7xl font-black tracking-wider text-foreground text-glow"
        >
          {blocks.home.titleEn}
        </motion.h1>
        <motion.p
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          style={{ y: subtitleY }}
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

      {/* Cinematic warp overlay */}
      <WarpOverlay
        active={warpState.active}
        chakraColor={warpState.color}
        onComplete={handleWarpComplete}
      />
    </motion.div>
  );
}
