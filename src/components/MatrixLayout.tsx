import { ReactNode } from "react";
import { MatrixRain } from "./stars/MatrixTool";
import { cn } from "@/lib/utils";

interface MatrixLayoutProps {
  children: ReactNode;
  showRain?: boolean;
  className?: string;
}

export default function MatrixLayout({
  children,
  showRain = true,
  className,
}: MatrixLayoutProps) {
  return (
    <div className={cn("relative w-full min-h-screen bg-background", className)}>
      {/* Matrix Rain Background */}
      {showRain && (
        <div className="absolute inset-0 z-0">
          <MatrixRain />
        </div>
      )}

      {/* Grid overlay (subtle) */}
      <div
        className="absolute inset-0 z-5 pointer-events-none opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(0deg, transparent 24%, rgba(0, 255, 0, 0.1) 25%, rgba(0, 255, 0, 0.1) 26%, transparent 27%, transparent 74%, rgba(0, 255, 0, 0.1) 75%, rgba(0, 255, 0, 0.1) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0, 255, 0, 0.1) 25%, rgba(0, 255, 0, 0.1) 26%, transparent 27%, transparent 74%, rgba(0, 255, 0, 0.1) 75%, rgba(0, 255, 0, 0.1) 76%, transparent 77%, transparent)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 z-5 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.7) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
