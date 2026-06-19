import { X } from "lucide-react";

import { cn } from "@/lib/utils";

export function Toast({
  message,
  onClose,
  className,
}: {
  message: string;
  onClose: () => void;
  className?: string;
}) {
  if (!message) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed right-4 top-4 z-50 flex max-w-sm items-start gap-3 rounded-lg border border-line bg-card px-4 py-3 text-sm font-medium text-ink shadow-soft",
        className,
      )}
      role="status"
    >
      <span className="mt-1 h-2 w-2 shrink-0 rounded-sm bg-brand-600" aria-hidden="true" />
      <span className="min-w-0 flex-1">{message}</span>
      <button
        type="button"
        className="st-icon-button rounded-md border border-transparent p-1 text-neutral-500 hover:border-line hover:bg-card hover:text-ink"
        onClick={onClose}
        aria-label="Đóng thông báo"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
