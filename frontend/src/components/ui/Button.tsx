// Button.tsx - Accessible command button atom. Props: native button props plus variant/icon.
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  icon?: ReactNode;
  fullWidth?: boolean;
};

const variants: Record<ButtonVariant, string> = {
  primary: "border-brand-600 bg-brand-600 text-white hover:bg-brand-700",
  secondary: "border-line bg-card text-ink hover:bg-neutral-50",
  ghost: "border-transparent bg-transparent text-ink hover:bg-neutral-50",
  danger: "border-signal-rose bg-signal-rose text-white hover:bg-rose-700",
};

export function Button({
  className,
  children,
  variant = "primary",
  icon,
  fullWidth = false,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "st-button inline-flex min-h-10 items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold focus-visible:ring-2 focus-visible:ring-brand-500/25 disabled:cursor-not-allowed disabled:opacity-55",
        variants[variant],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
}
