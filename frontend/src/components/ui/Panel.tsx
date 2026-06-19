// Panel.tsx - Token-based white surface primitive for redesigned SmartTriage screens.
import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type PanelVariant = "surface" | "elevated" | "glass" | "light";

interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  variant?: PanelVariant;
  interactive?: boolean;
}

const variants: Record<PanelVariant, string> = {
  surface: "border-line bg-card text-ink shadow-soft",
  elevated: "border-line bg-command-elevated text-ink shadow-command",
  glass: "border-line bg-card text-ink shadow-soft",
  light: "border-line bg-card text-ink shadow-soft",
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
        "st-card min-w-0 rounded-lg border",
        variants[variant],
        interactive && "hover:bg-neutral-50",
        className,
      )}
      {...props}
    />
  );
}
