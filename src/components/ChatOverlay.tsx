import { useState, useEffect, useCallback, useRef } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface Message {
  role: "user" | "golab";
  text: string;
}

const GREETING_KEY = "golgolab_greeted";
const EVENT_PREFIX = "golgolab_evt_";

const milestoneMessages: Record<string, string> = {
  first_galaxy_entry: "به کهکشان خوش اومدی! ✨ هر سیاره یه دنیای جدیده.",
  first_planet_focus: "آفرین! روی سیاره کلیک کردی. می‌تونی واردش بشی 🪐",
  first_autopilot: "اتوپایلوت فعال شد! بشین و لذت ببر 🚀",
  enter_qcore: "وارد هسته‌ی کیو شدی. اینجا آرامشه 🌿",
};

const replies: string[] = [
  "جالبه! بیشتر بگو.",
  "فهمیدم 🌸",
  "خوبه، ادامه بده.",
  "دارم فکر می‌کنم...",
  "چه سوال قشنگی!",
];

function hasFlag(key: string): boolean {
  try { return localStorage.getItem(key) === "true"; } catch { return false; }
}
function setFlag(key: string) {
  try { localStorage.setItem(key, "true"); } catch {}
}

function getInitialMessages(): Message[] {
  if (!hasFlag(GREETING_KEY)) {
    setFlag(GREETING_KEY);
    return [{ role: "golab", text: "سلام! من گل‌گلاب هستم 🌸 خوشحالم که اینجایی!" }];
  }
  return [];
}

interface ChatOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  starSlug?: string;
}

export default function ChatOverlay({ open, onOpenChange, starSlug }: ChatOverlayProps) {
  const [messages, setMessages] = useState<Message[]>(getInitialMessages);
  const [input, setInput] = useState("");
  const processedEvents = useRef<Set<string>>(new Set());

  const pushBotMessage = useCallback((text: string) => {
    setMessages((prev) => {
      if (prev.length > 0 && prev[prev.length - 1].text === text) return prev;
      return [...prev, { role: "golab", text }];
    });
  }, []);

  // Listen for milestone events dispatched from other components
  useEffect(() => {
    const handler = (e: Event) => {
      const eventName = (e as CustomEvent).detail as string;
      const flagKey = EVENT_PREFIX + eventName;
      if (hasFlag(flagKey) || processedEvents.current.has(eventName)) return;
      const msg = milestoneMessages[eventName];
      if (!msg) return;
      setFlag(flagKey);
      processedEvents.current.add(eventName);
      pushBotMessage(msg);
    };
    window.addEventListener("golgolab-event", handler);
    return () => window.removeEventListener("golgolab-event", handler);
  }, [pushBotMessage]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", text: input };
    const reply: Message = { role: "golab", text: replies[Math.floor(Math.random() * replies.length)] };
    setMessages((prev) => [...prev, userMsg, reply]);
    setInput("");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-80 flex flex-col bg-card border-border">
        <SheetHeader>
          <SheetTitle className="text-foreground">🌸 گل‌گلاب</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto space-y-3 py-4">
          {messages.length === 0 && (
            <p className="text-xs text-muted-foreground text-center mt-8">پیامی نیست. سوالت رو بنویس!</p>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-start" : "justify-end"}`}>
              <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                m.role === "user"
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-primary/20 text-foreground"
              }`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2 pt-2 border-t border-border">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="پیامت رو بنویس..."
            className="flex-1 bg-input text-foreground"
            dir="rtl"
          />
          <Button size="icon" onClick={send} variant="default">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/** Dispatch from anywhere: emitGolGolabEvent("first_planet_focus") */
export function emitGolGolabEvent(eventName: string) {
  window.dispatchEvent(new CustomEvent("golgolab-event", { detail: eventName }));
}
