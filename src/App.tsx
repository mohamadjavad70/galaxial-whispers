import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Suspense, lazy } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy load heavy pages
const GalacticQ = lazy(() => import("./pages/GalacticQ"));
const QHub = lazy(() => import("./pages/QHub"));
const SettingsPage = lazy(() => import("./pages/Settings"));
const StarWorld = lazy(() => import("./pages/StarWorld"));
const QCore = lazy(() => import("./pages/QCore"));

// Fallback component for lazy loading
const LoadingFallback = () => (
  <div className="flex items-center justify-center w-full h-screen bg-background text-foreground">
    <div className="animate-spin">⌛</div>
  </div>
);

const queryClient = new QueryClient();

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route
          path="/galaxy"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <GalacticQ />
            </Suspense>
          }
        />
        <Route
          path="/hub"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <QHub />
            </Suspense>
          }
        />
        <Route
          path="/settings"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <SettingsPage />
            </Suspense>
          }
        />
        <Route
          path="/star/:slug"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <StarWorld />
            </Suspense>
          }
        />
        <Route
          path="/q"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <QCore />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

const App = () => (
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

export default App;
