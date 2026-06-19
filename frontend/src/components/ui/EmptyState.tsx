// EmptyState.tsx - Reusable empty state with optional action and icon.
import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

export function EmptyState({
  title,
  description,
  action,
  icon,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex min-h-52 flex-col items-center justify-center rounded-lg border border-dashed border-line bg-card px-6 py-10 text-center ${className ?? ""}`}>
      <div className="mb-3 text-neutral-400">
        {icon ?? <Inbox className="h-10 w-10" aria-hidden="true" />}
      </div>
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      {description ? <p className="mt-1 max-w-md text-sm text-neutral-500">{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
