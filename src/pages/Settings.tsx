import { motion } from "framer-motion";
import { useQStore } from "@/state/useQStore";
import MatrixLayout from "@/components/MatrixLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();
  const user = useQStore((state) => state.user);

  return (
    <MatrixLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen p-6"
      >
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-mono font-bold text-green-400 mb-2">
              ▌ SETTINGS ▌
            </h1>
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="text-sm"
            >
              ← Back
            </Button>
          </div>

          {/* User Profile */}
          <Card className="p-6 border border-green-400/30 bg-black/40 mb-6">
            <h2 className="font-mono text-green-400 mb-4">▌ PROFILE ▌</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400">User ID</label>
                <div className="font-mono text-sm text-gray-300 mt-1">
                  {user.id}
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400">Tier</label>
                <div className="font-mono text-sm text-green-400 mt-1">
                  {user.tier}
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400">Token Balance</label>
                <div className="font-mono text-sm text-yellow-400 mt-1">
                  {user.tokenBalance} Q-Tokens
                </div>
              </div>
            </div>
          </Card>

          {/* Subscription */}
          <Card className="p-6 border border-green-400/30 bg-black/40">
            <h2 className="font-mono text-green-400 mb-4">▌ SUBSCRIPTION ▌</h2>
            <p className="text-sm text-gray-300 mb-4">
              Upgrade your tier to unlock advanced features
            </p>
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-black font-mono"
              onClick={() => alert("Stripe integration coming soon")}
            >
              Upgrade Plan
            </Button>
          </Card>
        </div>
      </motion.div>
    </MatrixLayout>
  );
}
