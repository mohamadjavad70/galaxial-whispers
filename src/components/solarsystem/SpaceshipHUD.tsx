import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Eye, EyeOff, Play, Pause, Rocket, Orbit,
  Navigation, Radio, ChevronDown, ChevronUp,
  Lock, Terminal, Anchor, Square, Volume2, VolumeX,
} from "lucide-react";
import { useAmbientPad } from "@/hooks/useAmbientPad";
import LanguagePicker from "@/components/LanguagePicker";
import { isOwnerUnlocked } from "@/lib/ownerGate";
import type { StarConfig } from "@/data/starRegistry";
import type { HUDSettings } from "@/hooks/useHUDSettings";
import type { NavMode, FlightTelemetry } from "./FlightCore";
import { getLedger } from "@/lib/geneticHash";

const speedPresets = [0.25, 1, 4, 16];

interface SpaceshipHUDProps {
  settings: HUDSettings;
  onUpdate: (patch: Partial<HUDSettings>) => void;
  telemetry: FlightTelemetry;
  stars: StarConfig[];
  navMode: NavMode;
  autopilotName: string | null;
  focusedStar: StarConfig | null;
  timeScrub: number;
  onTimeScrub: (v: number) => void;
  onNavSubmit: (query: string) => void;
  onCancelAutopilot: () => void;
  onReleaseFocus: () => void;
  onQuickPlanet: (slug: string) => void;
  onEnterWorld: () => void;
  onToggleExplorer: () => void;
  onBrake: () => void;
}

export default function SpaceshipHUD({
  settings, onUpdate, telemetry, stars, navMode,
  autopilotName, focusedStar, timeScrub, onTimeScrub,
  onNavSubmit, onCancelAutopilot, onReleaseFocus,
  onQuickPlanet, onEnterWorld, onToggleExplorer, onBrake,
}: SpaceshipHUDProps) {
  const navigate = useNavigate();
  const [navQuery, setNavQuery] = useState("");
  const [feedExpanded, setFeedExpanded] = useState(true);
  const ownerMode = isOwnerUnlocked();
  const { started: padStarted, start: startPad } = useAmbientPad(settings.feedMuted);

  // Auto-start ambient pad on first user interaction
  useEffect(() => {
    if (padStarted) return;
    const kick = () => { startPad(); window.removeEventListener("click", kick); window.removeEventListener("keydown", kick); };
    window.addEventListener("click", kick, { once: true });
    window.addEventListener("keydown", kick, { once: true });
    return () => { window.removeEventListener("click", kick); window.removeEventListener("keydown", kick); };
  }, [padStarted, startPad]);

  // H key toggle HUD, C key cancel autopilot
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const key = e.key.toLowerCase();
      if (key === "h" && !e.ctrlKey && !e.metaKey) {
        onUpdate({ hudVisible: !settings.hudVisible });
      }
      if (key === "c" && navMode === "AUTOPILOT") {
        onCancelAutopilot();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [settings.hudVisible, onUpdate, navMode, onCancelAutopilot]);

  const handleNavKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && navQuery.trim()) {
        onNavSubmit(navQuery.trim());
        setNavQuery("");
      }
    },
    [navQuery, onNavSubmit]
  );

  const ledger = getLedger().slice(-4).reverse();

  const modeLabel = navMode === "FREE" ? "کاوشگر" : navMode === "AUTOPILOT" ? "اتوپایلوت" : "فوکوس";
  const modeLabelEn = navMode === "FREE" ? "Free" : navMode === "AUTOPILOT" ? "Autopilot" : "Focus";

  // Hidden mode
  if (!settings.hudVisible) {
    return (
      <button
        onClick={() => onUpdate({ hudVisible: true })}
        className="absolute top-3 right-3 z-20 pointer-events-auto bg-card/20 backdrop-blur-sm rounded-full p-2 border border-border/10 text-muted-foreground/50 hover:text-foreground transition-colors"
        title="Show HUD (H)"
      >
        <Eye className="w-3.5 h-3.5" />
      </button>
    );
  }

  const glassPanel = "bg-card/25 backdrop-blur-xl border border-border/15 rounded-xl";

  return (
    <div className="absolute inset-0 z-20 pointer-events-none" dir="rtl">
      {/* ─── Top Bar ─── */}
      <div className="flex items-center justify-between p-3 md:p-4">
        <div className={`pointer-events-auto flex items-center gap-2 ${glassPanel} px-3 py-1.5`}>
          <span className="text-primary font-bold text-xs tracking-wider">QMETARAM</span>
          <span className="text-border/40">|</span>
          <span className="text-foreground text-[10px]">{modeLabel}</span>
          <span className="text-muted-foreground/40 text-[8px]">{modeLabelEn}</span>
          {navMode === "AUTOPILOT" && autopilotName && (
            <Badge className="text-[8px] bg-accent/20 text-accent border-none px-1.5 py-0">
              ← {autopilotName}
              {telemetry.autopilotDist > 0 && (
                <span className="ml-1 text-muted-foreground">
                  {telemetry.autopilotDist.toFixed(0)}u
                  {telemetry.autopilotETA > 0 && ` ~${telemetry.autopilotETA.toFixed(0)}s`}
                </span>
              )}
            </Badge>
          )}
          <span className="text-border/40">|</span>
          <span className="text-primary/60 text-[9px]">● متصل</span>
        </div>
        <div className="pointer-events-auto flex items-center gap-1.5">
          <LanguagePicker compact className="mr-1" />
          {ownerMode ? (
            <button
              onClick={() => navigate("/command-center")}
              className={`${glassPanel} px-2 py-1 text-[9px] text-primary hover:text-foreground transition-colors flex items-center gap-1`}
              title="Command Center"
            >
              <Terminal className="w-3 h-3" /> فرمان
            </button>
          ) : (
            <button
              className={`${glassPanel} px-2 py-1 text-[9px] text-muted-foreground/40 flex items-center gap-1 cursor-default`}
              title="فقط برای فرمانده"
            >
              <Lock className="w-3 h-3" />
            </button>
          )}
          <button
            onClick={() => onUpdate({ hudVisible: false })}
            className={`${glassPanel} p-1.5 text-muted-foreground hover:text-foreground transition-colors`}
            title="Hide HUD (H)"
          >
            <EyeOff className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ─── Center Reticle ─── */}
      {navMode === "FREE" && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="relative w-7 h-7">
            <div className="absolute inset-0 border border-primary/15 rounded-full" />
            <div className="absolute top-1/2 left-0 w-1.5 h-px bg-primary/25" />
            <div className="absolute top-1/2 right-0 w-1.5 h-px bg-primary/25" />
            <div className="absolute top-0 left-1/2 w-px h-1.5 bg-primary/25 -translate-x-px" />
            <div className="absolute bottom-0 left-1/2 w-px h-1.5 bg-primary/25 -translate-x-px" />
          </div>
        </div>
      )}

      {/* ─── Focused Planet Info ─── */}
      {navMode === "FOCUS" && focusedStar && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-16 pointer-events-none">
          <div className={`${glassPanel} px-5 py-3 text-center`}>
            <p className="text-foreground font-bold">{focusedStar.displayNameFa}</p>
            <p className="text-muted-foreground text-xs">{focusedStar.displayNameEn}</p>
            <p className="text-muted-foreground text-[10px] mt-1">{focusedStar.missionFa}</p>
            <p className="text-muted-foreground/60 text-[9px]">{focusedStar.missionEn}</p>
          </div>
        </div>
      )}

      {/* ─── Bottom Panels ─── */}
      <div className="absolute bottom-3 left-3 right-3 md:bottom-4 md:left-4 md:right-4 flex items-end justify-between gap-3">
        {/* ─── Right Panel: Telemetry + Time + Toggles ─── */}
        <div className={`pointer-events-auto ${glassPanel} p-3 space-y-2.5 min-w-[190px] max-w-[230px]`}>
          {/* Telemetry */}
          <div className="space-y-1">
            <p className="text-primary text-[10px] font-bold">تلمتری پرواز</p>
            <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[9px]">
              <span className="text-muted-foreground">سرعت:</span>
              <span className="text-foreground font-mono">{telemetry.speed.toFixed(1)}</span>
              <span className="text-muted-foreground">ارتفاع:</span>
              <span className="text-foreground font-mono">{telemetry.altitude.toFixed(1)}</span>
              <span className="text-muted-foreground">X:</span>
              <span className="text-foreground font-mono">{telemetry.position[0].toFixed(0)}</span>
              <span className="text-muted-foreground">Z:</span>
              <span className="text-foreground font-mono">{telemetry.position[2].toFixed(0)}</span>
            </div>
          </div>

          {/* Time Controls */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <p className="text-primary text-[10px] font-bold">زمان مدار</p>
              <Button
                variant="ghost" size="icon"
                className="h-5 w-5 text-foreground"
                onClick={() => onUpdate({ paused: !settings.paused })}
              >
                {settings.paused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
              </Button>
            </div>
            <div className="flex gap-0.5">
              {speedPresets.map((s) => (
                <Button
                  key={s}
                  variant={settings.timeSpeed === s ? "default" : "outline"}
                  size="sm"
                  className="h-5 text-[8px] px-1.5 flex-1"
                  onClick={() => onUpdate({ timeSpeed: s })}
                >
                  {s}x
                </Button>
              ))}
            </div>
            <div>
              <p className="text-muted-foreground text-[8px] mb-0.5">اسکرول: {timeScrub}</p>
              <Slider
                value={[timeScrub]}
                onValueChange={([v]) => onTimeScrub(v)}
                min={-1000}
                max={1000}
                step={5}
                className="w-full"
              />
            </div>
          </div>

          {/* Inertia Slider */}
          <div>
            <p className="text-muted-foreground text-[8px] mb-0.5">اینرسی: {(settings.inertia * 100).toFixed(0)}%</p>
            <Slider
              value={[settings.inertia]}
              onValueChange={([v]) => onUpdate({ inertia: v })}
              min={0}
              max={1}
              step={0.05}
              className="w-full"
            />
          </div>

          {/* Toggles */}
          <div className="space-y-0.5">
            <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-[9px] h-5 text-foreground"
              onClick={() => onUpdate({ showOrbits: !settings.showOrbits })}>
              {settings.showOrbits ? <Eye className="w-2.5 h-2.5" /> : <EyeOff className="w-2.5 h-2.5" />} مدارها
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-[9px] h-5 text-foreground"
              onClick={() => onUpdate({ showLabels: !settings.showLabels })}>
              {settings.showLabels ? <Eye className="w-2.5 h-2.5" /> : <EyeOff className="w-2.5 h-2.5" />} برچسب‌ها
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-[9px] h-5 text-foreground"
              onClick={() => onUpdate({ mouseLook: !settings.mouseLook })}>
              {settings.mouseLook ? <Eye className="w-2.5 h-2.5" /> : <EyeOff className="w-2.5 h-2.5" />} نگاه ماوس
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-[9px] h-5 text-foreground"
              onClick={() => onUpdate({ feedMuted: !settings.feedMuted })}>
              {settings.feedMuted ? <VolumeX className="w-2.5 h-2.5" /> : <Volume2 className="w-2.5 h-2.5" />} صدای فضا
            </Button>
            <div className="flex gap-0.5">
              <Button
                variant={navMode === "FREE" ? "default" : "outline"}
                size="sm"
                className="flex-1 justify-center gap-1 text-[9px] h-5"
                onClick={onToggleExplorer}
              >
                {navMode === "FREE" ? <Rocket className="w-2.5 h-2.5" /> : <Orbit className="w-2.5 h-2.5" />}
                {navMode === "FREE" ? "آزاد" : "اوربیت"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 justify-center gap-1 text-[9px] h-5"
                onClick={onBrake}
                title="ترمز (Space)"
              >
                <Square className="w-2.5 h-2.5" /> ترمز
              </Button>
            </div>
          </div>
        </div>

        {/* ─── Left Panel: Nav Console + Signals ─── */}
        <div className="pointer-events-auto space-y-2 min-w-[190px] max-w-[230px]">
          {/* Nav Console */}
          <div className={`${glassPanel} p-3 space-y-2`}>
            <p className="text-primary text-[10px] font-bold">کنسول ناوبری</p>
            <div className="flex gap-1">
              <Input
                value={navQuery}
                onChange={(e) => setNavQuery(e.target.value)}
                placeholder="برو به سیاره..."
                className="text-[10px] h-6 bg-input/30 border-border/20 text-foreground"
                dir="rtl"
                onKeyDown={handleNavKeyDown}
              />
              <Button size="sm" className="h-6 px-2" onClick={() => {
                if (navQuery.trim()) { onNavSubmit(navQuery.trim()); setNavQuery(""); }
              }}>
                <Navigation className="w-3 h-3" />
              </Button>
            </div>
            {navMode === "AUTOPILOT" && (
              <Button variant="outline" size="sm" className="w-full text-[9px] h-5" onClick={onCancelAutopilot}>
                لغو اتوپایلوت (C)
              </Button>
            )}
            {navMode === "FOCUS" && (
              <div className="flex gap-1">
                <Button variant="outline" size="sm" className="flex-1 text-[9px] h-5" onClick={onReleaseFocus}>
                  آزاد
                </Button>
                <Button size="sm" className="flex-1 text-[9px] h-5" onClick={onEnterWorld}>
                  ورود ✦
                </Button>
              </div>
            )}
            {/* Quick planet buttons */}
            <div className="flex flex-wrap gap-1">
              {stars.slice(0, 7).map((s) => (
                <button
                  key={s.slug}
                  onClick={() => onQuickPlanet(s.slug)}
                  className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-secondary/20 hover:bg-secondary/40 transition-colors text-[8px] text-foreground"
                >
                  <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: s.chakraColor }} />
                  {s.displayNameFa}
                </button>
              ))}
            </div>
          </div>

          {/* Signals Feed */}
          <div className={`${glassPanel} p-3`}>
            <div className="flex items-center justify-between">
              <p className="text-primary text-[10px] font-bold flex items-center gap-1">
                <Radio className="w-2.5 h-2.5" /> سیگنال‌ها
              </p>
              <div className="flex gap-0.5">
                <Button variant="ghost" size="icon" className="h-4 w-4" onClick={() => onUpdate({ feedMuted: !settings.feedMuted })}>
                  {settings.feedMuted ? <EyeOff className="w-2.5 h-2.5" /> : <Eye className="w-2.5 h-2.5" />}
                </Button>
                <Button variant="ghost" size="icon" className="h-4 w-4" onClick={() => setFeedExpanded(!feedExpanded)}>
                  {feedExpanded ? <ChevronDown className="w-2.5 h-2.5" /> : <ChevronUp className="w-2.5 h-2.5" />}
                </Button>
              </div>
            </div>
            {feedExpanded && !settings.feedMuted && (
              <div className="mt-1.5 space-y-1">
                {ledger.length === 0 && (
                  <p className="text-muted-foreground/50 text-[9px]">هنوز سیگنالی نیست</p>
                )}
                {ledger.map((e, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[9px]">
                    <Badge variant="outline" className="text-[7px] px-1 py-0 font-mono text-muted-foreground border-border/20">
                      {e.hash.slice(0, 6)}
                    </Badge>
                    <span className="text-foreground truncate">{e.action}</span>
                    <span className="text-muted-foreground text-[8px] mr-auto">{e.starSlug}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
