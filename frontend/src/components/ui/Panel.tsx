// Panel.tsx - Token-based surface primitive for redesigned command-center screens.
import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type PanelVariant = "surface" | "elevated" | "glass" | "light";

interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  variant?: PanelVariant;
  interactive?: boolean;
}

const variants: Record<PanelVariant, string> = {
  surface: "border-white/10 bg-command-surface text-command-text shadow-command",
  elevated: "border-white/[0.12] bg-command-elevated text-command-text shadow-command",
  glass: "border-white/[0.12] bg-white/[0.06] text-command-text shadow-command backdrop-blur-xl",
  light: "border-line bg-white text-ink shadow-soft",
};

export function Panel({
  className,
  variant = "surface",
  interactive = false,
  ...props
}: PanelProps) {
  return (
    <div
      className={cn(
        "min-w-0 rounded-lg border transition duration-300 ease-out-expo",
        variants[variant],
        interactive && "hover:-translate-y-1 hover:border-brand-500/40 hover:shadow-glow",
        className,
      )}
      {...props}
    />
  );
}
