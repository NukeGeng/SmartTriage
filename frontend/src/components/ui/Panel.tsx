// Panel.tsx - Token-based white surface primitive for redesigned SmartTriage screens.
import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type PanelVariant = "surface" | "elevated" | "glass" | "light";

interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  variant?: PanelVariant;
  interactive?: boolean;
}

const variants: Record<PanelVariant, string> = {
  surface: "border-line bg-white text-ink shadow-soft",
  elevated: "border-line bg-command-elevated text-ink shadow-command",
  glass: "border-line bg-white text-ink shadow-soft",
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
        "min-w-0 rounded-lg border transition duration-150 ease-smooth",
        variants[variant],
        interactive && "hover:border-brand-600/40",
        className,
      )}
      {...props}
    />
  );
}
