import { motion } from "framer-motion";
import { useQStore } from "@/state/useQStore";
import MatrixLayout from "@/components/MatrixLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function QHub() {
  const navigate = useNavigate();
  const hubState = useQStore((state) => state.hubState);
  const setFavoriteAI = useQStore((state) => state.setFavoriteAI);
  const favoriteAIs = useQStore((state) => state.hubState.favoriteAIs);

  const mockAIs = [
    { id: "tesla", name: "Tesla Matrix", rating: 4.8, category: "Physics" },
    { id: "davinci", name: "Da Vinci Codex", rating: 4.9, category: "Art" },
    { id: "beethoven", name: "Beethoven Harmonic", rating: 4.7, category: "Music" },
  ];

  return (
    <MatrixLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen p-6"
      >
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-mono font-bold text-green-400 mb-2">
              ▌ Q-HUB MARKETPLACE ▌
            </h1>
            <p className="text-gray-400 text-sm">
              Select an AI specialist and engage in modular knowledge exchange
            </p>
          </div>

          {/* AI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {mockAIs.map((ai) => (
              <Card
                key={ai.id}
                className="p-4 border border-green-400/30 bg-black/40 hover:border-green-400 transition cursor-pointer"
                onClick={() => navigate(`/hub/${ai.id}`)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-mono text-green-400">{ai.name}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFavoriteAI(ai.id, !favoriteAIs.includes(ai.id));
                    }}
                    className="text-xs"
                  >
                    {favoriteAIs.includes(ai.id) ? "★" : "☆"}
                  </Button>
                </div>
                <p className="text-xs text-gray-400 mb-3">{ai.category}</p>
                <div className="flex items-center">
                  <span className="text-yellow-400">★ {ai.rating}</span>
                </div>
              </Card>
            ))}
          </div>

          {/* Chat History */}
          <div className="border border-green-400/30 rounded p-4 bg-black/40">
            <h2 className="font-mono text-green-400 mb-4">▌ CHAT HISTORY ▌</h2>
            <div className="h-48 overflow-y-auto space-y-2">
              {hubState.chatHistory.length === 0 ? (
                <p className="text-gray-500 text-sm">No messages yet</p>
              ) : (
                hubState.chatHistory.map((msg, idx) => (
                  <div key={idx} className="text-xs">
                    <span className="text-green-400">[{msg.role.toUpperCase()}]</span>{" "}
                    <span className="text-gray-300">{msg.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </MatrixLayout>
  );
}
