import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { getLang, setLang, type Lang } from "@/lib/i18n";

interface LanguagePickerProps {
  className?: string;
  compact?: boolean;
}

export default function LanguagePicker({ className, compact }: LanguagePickerProps) {
  const [lang, setLangState] = useState<Lang>(getLang);

  const toggle = useCallback(() => {
    const next: Lang = lang === "fa" ? "en" : "fa";
    setLang(next);
    setLangState(next);
    // Force re-render across app
    window.dispatchEvent(new Event("lang-change"));
  }, [lang]);

  if (compact) {
    return (
      <button
        onClick={toggle}
        className={`flex items-center gap-1 text-[9px] text-muted-foreground hover:text-foreground transition-colors ${className}`}
      >
        <Globe className="w-2.5 h-2.5" />
        {lang === "fa" ? "EN" : "فا"}
      </button>
    );
  }

  return (
    <Button variant="ghost" size="sm" onClick={toggle} className={`gap-1 text-xs ${className}`}>
      <Globe className="w-3.5 h-3.5" />
      {lang === "fa" ? "English" : "فارسی"}
    </Button>
  );
}
