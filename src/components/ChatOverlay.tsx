import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface Message {
  role: "user" | "golab";
  text: string;
}

const toneResponses: Record<string, string[]> = {
  default: [
    "سلام! من گل‌گلاب هستم 🌸 خوشحالم که اینجایی!",
    "هر سوالی داری بپرس، با هم پیدا می‌کنیم.",
    "روی هر ستاره کلیک کن تا واردش بشی!",
    "کهکشان قشنگه نه؟ ✨",
  ],
  tesla: [
    "آزمایشگاه تسلا آماده‌ست. ایده‌ات رو بنویس تا نقشه بکشیم.",
    "هر اختراع بزرگ با یک سوال کوچک شروع شد ⚡",
    "سیستم تحلیل آماده‌ست. داده‌ها رو بررسی کنیم؟",
  ],
  matrix: [
    "سیگنال دریافت شد.",
    "واقعیت لایه‌هایی داره. بیا رمزگشایی کنیم.",
    "متن رو وارد کن. الگوها رو پیدا می‌کنم.",
  ],
  molana: [
    "قلبت چه می‌گوید؟ 🌹",
    "هر احساسی یک پیام دارد. بیا گوش بدیم.",
    "آرام باش. اینجا فضای امن است.",
  ],
  davinci: [
    "معما حل کن تا دروازه‌ها باز بشن! 🎨",
    "هنر و علم دو بال یک پرنده‌اند.",
  ],
  beethoven: [
    "موسیقی زبان روحه 🎵",
    "یه جمله بنویس تا ملودی بسازیم.",
    "پیانو رو امتحان کن!",
  ],
};

function getResponse(starSlug?: string): string {
  const pool = toneResponses[starSlug || "default"] || toneResponses.default;
  return pool[Math.floor(Math.random() * pool.length)];
}

interface ChatOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  starSlug?: string;
}

export default function ChatOverlay({ open, onOpenChange, starSlug }: ChatOverlayProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "golab", text: getResponse(starSlug) },
  ]);
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", text: input };
    const botMsg: Message = { role: "golab", text: getResponse(starSlug) };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-80 flex flex-col bg-card border-border">
        <SheetHeader>
          <SheetTitle className="text-foreground">🌸 گل‌گلاب</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto space-y-3 py-4">
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
