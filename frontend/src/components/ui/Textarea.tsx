import type { TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

export function Textarea({ className, label, error, id, ...props }: TextareaProps) {
  const inputId = id ?? props.name;

  return (
    <label className="block space-y-1.5" htmlFor={inputId}>
      {label ? <span className="text-sm font-medium text-ink">{label}</span> : null}
      <textarea
        id={inputId}
        className={cn(
          "st-field min-h-36 w-full resize-y rounded-md border border-line bg-card px-3 py-3 text-sm text-ink outline-none placeholder:text-neutral-400 focus:border-neutral-300 focus:ring-2 focus:ring-neutral-200",
          error && "border-signal-rose focus:border-signal-rose focus:ring-rose-100",
          className,
        )}
        {...props}
      />
      {error ? <span className="block text-xs font-medium text-signal-rose">{error}</span> : null}
    </label>
  );
}
