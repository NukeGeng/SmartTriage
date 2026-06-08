// SectionLabel.tsx - Compact section marker for dense triage panels.
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface SectionLabelProps {
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export function SectionLabel({ children, icon, className }: SectionLabelProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-command-muted",
        className,
      )}
    >
      {icon}
      <span>{children}</span>
    </div>
  );
}
