// Loading.tsx - Small loading indicator for route and data states.
import { Loader2 } from "lucide-react";

export function Loading({ label = "Đang tải dữ liệu..." }: { label?: string }) {
  return (
    <div className="flex min-h-40 items-center justify-center gap-3 text-sm font-medium text-neutral-600">
      <Loader2 className="h-5 w-5 animate-spin text-brand-600" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
