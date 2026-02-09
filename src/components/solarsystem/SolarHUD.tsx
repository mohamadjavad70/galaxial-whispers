import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { getLedger } from "@/lib/geneticHash";
import { Eye, EyeOff, Rocket, Orbit } from "lucide-react";

/**
 * SolarHUD — Overlay showing galactic rules, ledger entries, health gauge,
 * orbit toggle, time slider, and camera mode switch.
 */

interface SolarHUDProps {
  showOrbits: boolean;
  onToggleOrbits: () => void;
  timeScale: number;
  onTimeScale: (v: number) => void;
  explorerMode: boolean;
  onToggleExplorer: () => void;
  focusedPlanet: string | null;
  onReleaseFocus: () => void;
}

export default function SolarHUD({
  showOrbits, onToggleOrbits,
  timeScale, onTimeScale,
  explorerMode, onToggleExplorer,
  focusedPlanet, onReleaseFocus,
}: SolarHUDProps) {
  const ledger = useMemo(() => getLedger().slice(-3).reverse(), []);
  const healthPct = useMemo(() => Math.min(100, 40 + getLedger().length * 5), []);

  return (
    <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none p-3 md:p-5">
      <div className="flex items-start justify-between gap-4">
        {/* Left: Q Core Status */}
        <div className="pointer-events-auto bg-card/80 backdrop-blur-md rounded-xl border border-border p-3 max-w-[220px] space-y-2">
          <p className="text-foreground text-xs font-bold">Q Core Status</p>

          {/* 3 Rules */}
          <div className="space-y-0.5 text-[10px]" dir="rtl">
            <p className="text-accent">✦ پندار نیک</p>
            <p className="text-accent">✦ گفتار نیک</p>
            <p className="text-accent">✦ کردار نیک</p>
          </div>

          {/* Ledger */}
          <div className="space-y-1">
            <p className="text-muted-foreground text-[9px]">آخرین اقدامات:</p>
            {ledger.length === 0 && <p className="text-muted-foreground/50 text-[9px]">هنوز فعالیتی نیست</p>}
            {ledger.map((e, i) => (
              <div key={i} className="flex items-center gap-1">
                <Badge variant="outline" className="text-[8px] font-mono px-1 py-0 text-muted-foreground border-border">
                  {e.hash.slice(0, 8)}
                </Badge>
                <span className="text-muted-foreground text-[8px]">{e.action}</span>
              </div>
            ))}
          </div>

          {/* Earth Health */}
          <div>
            <p className="text-muted-foreground text-[9px] mb-1">Earth Health</p>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${healthPct}%`,
                  background: `linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))`,
                }}
              />
            </div>
            <p className="text-muted-foreground text-[8px] mt-0.5">{healthPct}%</p>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="pointer-events-auto bg-card/80 backdrop-blur-md rounded-xl border border-border p-3 space-y-3 min-w-[160px]">
          {/* Orbit toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-xs text-foreground h-7"
            onClick={onToggleOrbits}
          >
            {showOrbits ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            مدارها
          </Button>

          {/* Time slider */}
          <div>
            <p className="text-muted-foreground text-[9px] mb-1">سرعت مدار: {timeScale.toFixed(1)}x</p>
            <Slider
              value={[timeScale]}
              onValueChange={([v]) => onTimeScale(v)}
              min={0}
              max={5}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Camera mode */}
          <Button
            variant={explorerMode ? "default" : "outline"}
            size="sm"
            className="w-full justify-start gap-2 text-xs h-7"
            onClick={onToggleExplorer}
          >
            {explorerMode ? <Rocket className="w-3 h-3" /> : <Orbit className="w-3 h-3" />}
            {explorerMode ? "Explorer ON" : "Explorer OFF"}
          </Button>

          {/* Release focus */}
          {focusedPlanet && (
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs h-7 text-foreground"
              onClick={onReleaseFocus}
            >
              آزاد کردن فوکوس
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
