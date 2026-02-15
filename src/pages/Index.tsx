import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import MatrixLayout from "@/components/MatrixLayout";
import { useQStore } from "@/state/useQStore";

export default function Index() {
  const navigate = useNavigate();
  const user = useQStore((state) => state.user);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <MatrixLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Hero Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center z-20 max-w-2xl mx-auto px-4"
        >
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-mono font-black text-green-400 mb-4 tracking-widest"
            style={{
              textShadow: "0 0 20px rgba(0, 255, 0, 0.5)",
            }}
          >
            Q-METARAM
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-300 mb-2 font-light tracking-wide"
          >
            The Choice Is Yours
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="text-sm text-gray-500 mb-8 font-mono"
          >
            Decentralized • Modular • Autonomous
          </motion.p>

          {/* Capsule Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col md:flex-row gap-6 justify-center mt-12"
          >
            {/* RED PILL */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/galaxy")}
              className="relative px-8 py-4 md:px-12 md:py-6 font-mono font-bold text-lg rounded-full overflow-hidden group"
              style={{
                background: "linear-gradient(135deg, #ff0000 0%, #cc0000 100%)",
                boxShadow: "0 0 20px rgba(255, 0, 0, 0.6), inset 0 0 10px rgba(255, 255, 255, 0.1)",
              }}
            >
              <div className="absolute inset-0 bg-red-600 opacity-0 group-hover:opacity-20 transition" />
              <span className="relative text-black">
                RED PILL
              </span>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-900 opacity-50" />
            </motion.button>

            {/* BLUE PILL */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/hub")}
              className="relative px-8 py-4 md:px-12 md:py-6 font-mono font-bold text-lg rounded-full overflow-hidden group"
              style={{
                background: "linear-gradient(135deg, #0066ff 0%, #0044cc 100%)",
                boxShadow: "0 0 20px rgba(0, 102, 255, 0.6), inset 0 0 10px rgba(255, 255, 255, 0.1)",
              }}
            >
              <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-20 transition" />
              <span className="relative text-white">
                BLUE PILL
              </span>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-900 opacity-50" />
            </motion.button>
          </motion.div>

          {/* Instructions */}
          <motion.div
            variants={itemVariants}
            className="mt-12 text-xs md:text-sm text-gray-400 font-mono border border-green-400/30 p-4 rounded bg-black/40"
          >
            <div className="mb-2">▌ GATEWAY INITIALIZATION ▌</div>
            <div className="text-green-400">✓ System online</div>
            <div className="text-green-400">✓ Sector: {user.tier}</div>
            <div className="text-yellow-400 mt-2">Select your path...</div>
          </motion.div>
        </motion.div>

        {/* Bottom Menu */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-6 left-6 right-6 flex justify-between text-xs font-mono text-gray-500 z-20"
        >
          <button
            onClick={() => navigate("/settings")}
            className="hover:text-green-400 transition"
          >
            [SETTINGS]
          </button>
          <div>Q-Metaram v1.0</div>
        </motion.div>
      </motion.div>
    </MatrixLayout>
  );
}
