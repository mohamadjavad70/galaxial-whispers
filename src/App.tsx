import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Index from "./pages/Index";
import StarWorld from "./pages/StarWorld";
import QCore from "./pages/QCore";
import CommandCenter from "./pages/CommandCenter";
import Command from "./pages/Command";
import SunCorePage from "./pages/SunCore";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/star/:slug" element={<StarWorld />} />
        <Route path="/q" element={<QCore />} />
        <Route path="/command-center" element={<CommandCenter />} />
        <Route path="/command" element={<Command />} />
        <Route path="/sun-core" element={<SunCorePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

const App = () => {
  useEffect(() => {
    const handleRejection = (event: PromiseRejectionEvent) => {
      // Suppress errors from browser extensions (e.g. MetaMask)
      const msg = String(event.reason?.message || event.reason || "");
      if (msg.includes("MetaMask") || msg.includes("ethereum")) {
        event.preventDefault();
      }
    };
    window.addEventListener("unhandledrejection", handleRejection);
    return () => window.removeEventListener("unhandledrejection", handleRejection);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
