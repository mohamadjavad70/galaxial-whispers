import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Shield, Save, RotateCcw, Activity, FileText } from "lucide-react";
import { getStarRegistry, saveStarRegistry, defaultStarRegistry } from "@/data/starRegistry";
import type { StarConfig } from "@/data/starRegistry";
import { getContentBlocks, saveContentBlocks, defaultContentBlocks } from "@/data/contentBlocks";
import type { ContentBlocks } from "@/data/contentBlocks";
import { getLedger } from "@/lib/geneticHash";
import type { LedgerEntry } from "@/lib/geneticHash";

const DEMO_PASS = "qmetaram";

export default function CommandCenter() {
  const navigate = useNavigate();
  const [pass, setPass] = useState("");
  const [authed, setAuthed] = useState(false);
  const [registry, setRegistry] = useState<StarConfig[]>([]);
  const [content, setContent] = useState<ContentBlocks>(defaultContentBlocks);
  const [logs, setLogs] = useState<LedgerEntry[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (authed) {
      setRegistry(getStarRegistry());
      setContent(getContentBlocks());
      setLogs(getLedger());
    }
  }, [authed]);

  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-80">
          <CardHeader>
            <CardTitle className="text-foreground text-center">
              <Shield className="w-8 h-8 mx-auto mb-2 text-primary" />
              مرکز فرماندهی
              <p className="text-xs text-muted-foreground mt-1">Command Center — Demo</p>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && pass === DEMO_PASS && setAuthed(true)}
              placeholder="رمز عبور دمو..."
              className="bg-input text-foreground"
              dir="ltr"
            />
            <Button className="w-full" onClick={() => pass === DEMO_PASS && setAuthed(true)}>ورود</Button>
            <p className="text-xs text-muted-foreground text-center">🔓 دمو — رمز: qmetaram</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const updateStar = (idx: number, field: keyof StarConfig, value: string | boolean) => {
    setRegistry((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
    setSaved(false);
  };

  const updateHomeContent = (field: keyof ContentBlocks["home"], value: string) => {
    setContent((prev) => ({
      ...prev,
      home: { ...prev.home, [field]: value },
    }));
    setSaved(false);
  };

  const updateStarContent = (slug: string, field: "introFa" | "introEn", value: string) => {
    setContent((prev) => ({
      ...prev,
      stars: {
        ...prev.stars,
        [slug]: { ...prev.stars[slug], [field]: value },
      },
    }));
    setSaved(false);
  };

  const publish = () => {
    saveStarRegistry(registry);
    saveContentBlocks(content);
    setSaved(true);
  };

  const rollback = () => {
    setRegistry(defaultStarRegistry);
    setContent(defaultContentBlocks);
    saveStarRegistry(defaultStarRegistry);
    saveContentBlocks(defaultContentBlocks);
    setSaved(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background p-6"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/")} className="gap-2 text-foreground">
            <ArrowRight className="w-4 h-4" />
            کهکشان
          </Button>
          <h1 className="text-xl font-bold text-foreground">مرکز فرماندهی</h1>
          <div className="flex gap-2">
            <Button size="sm" onClick={publish} className="gap-1">
              <Save className="w-3 h-3" /> ذخیره
            </Button>
            <Button size="sm" variant="outline" onClick={rollback} className="gap-1">
              <RotateCcw className="w-3 h-3" /> بازگشت
            </Button>
          </div>
        </div>

        {saved && <Badge variant="default" className="text-xs">✅ ذخیره شد</Badge>}

        <Tabs defaultValue="registry" dir="rtl">
          <TabsList className="bg-secondary">
            <TabsTrigger value="registry">رجیستری ستارگان</TabsTrigger>
            <TabsTrigger value="content">محتوا</TabsTrigger>
            <TabsTrigger value="logs">لاگ فعالیت</TabsTrigger>
          </TabsList>

          {/* Star Registry Tab */}
          <TabsContent value="registry" className="space-y-3 mt-4">
            {registry.map((star, i) => (
              <Card key={star.slug} className="bg-card border-border">
                <CardContent className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground">نام فارسی</label>
                    <Input
                      value={star.displayNameFa}
                      onChange={(e) => updateStar(i, "displayNameFa", e.target.value)}
                      className="bg-input text-foreground text-sm"
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">مأموریت</label>
                    <Input
                      value={star.missionFa}
                      onChange={(e) => updateStar(i, "missionFa", e.target.value)}
                      className="bg-input text-foreground text-sm"
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">رنگ چاکرا</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={star.chakraColor}
                        onChange={(e) => updateStar(i, "chakraColor", e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer"
                      />
                      <span className="text-xs text-muted-foreground font-mono">{star.chakraColor}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">صدا</label>
                    <Button
                      size="sm"
                      variant={star.ambientSound ? "default" : "outline"}
                      onClick={() => updateStar(i, "ambientSound", !star.ambientSound)}
                      className="w-full text-xs"
                    >
                      {star.ambientSound ? "فعال" : "غیرفعال"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Content Blocks Tab */}
          <TabsContent value="content" className="space-y-4 mt-4">
            {/* Home Page Content */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-foreground text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  صفحه اصلی — Home
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground">عنوان انگلیسی</label>
                  <Input
                    value={content.home.titleEn}
                    onChange={(e) => updateHomeContent("titleEn", e.target.value)}
                    className="bg-input text-foreground text-sm"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">زیرعنوان فارسی</label>
                  <Input
                    value={content.home.subtitleFa}
                    onChange={(e) => updateHomeContent("subtitleFa", e.target.value)}
                    className="bg-input text-foreground text-sm"
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">زیرعنوان انگلیسی</label>
                  <Input
                    value={content.home.subtitleEn}
                    onChange={(e) => updateHomeContent("subtitleEn", e.target.value)}
                    className="bg-input text-foreground text-sm"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">متن دعوت (CTA)</label>
                  <Input
                    value={content.home.cta}
                    onChange={(e) => updateHomeContent("cta", e.target.value)}
                    className="bg-input text-foreground text-sm"
                    dir="rtl"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Star Intro Content */}
            {Object.entries(content.stars).map(([slug, intro]) => {
              const star = registry.find((s) => s.slug === slug);
              return (
                <Card key={slug} className="bg-card border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-foreground text-sm flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full inline-block"
                        style={{ backgroundColor: star?.chakraColor || "#888" }}
                      />
                      {star?.displayNameFa || slug} — {star?.displayNameEn || slug}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-xs text-muted-foreground">معرفی فارسی</label>
                      <Textarea
                        value={intro.introFa}
                        onChange={(e) => updateStarContent(slug, "introFa", e.target.value)}
                        className="bg-input text-foreground text-sm min-h-[60px]"
                        dir="rtl"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">معرفی انگلیسی</label>
                      <Textarea
                        value={intro.introEn}
                        onChange={(e) => updateStarContent(slug, "introEn", e.target.value)}
                        className="bg-input text-foreground text-sm min-h-[60px]"
                        dir="ltr"
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          {/* Logs Tab */}
          <TabsContent value="logs" className="mt-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" />
                  Genetic Ledger ({logs.length} عمل)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {logs.length === 0 ? (
                  <p className="text-muted-foreground text-sm">هنوز فعالیتی ثبت نشده.</p>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {[...logs].reverse().map((entry, i) => (
                      <div key={i} className="flex items-center justify-between text-xs p-2 bg-secondary/30 rounded">
                        <div className="flex gap-2">
                          <Badge variant="outline" className="font-mono text-[10px]">🧬 {entry.hash}</Badge>
                          <span className="text-foreground">{entry.action}</span>
                        </div>
                        <div className="flex gap-2 text-muted-foreground">
                          <span>{entry.starSlug}</span>
                          <span>{new Date(entry.timestamp).toLocaleTimeString("fa-IR")}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
}
