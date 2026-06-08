import { formatPercent } from "@/lib/utils";

export function ConfidenceMeter({ value }: { value: number }) {
  const boundedValue = Math.max(0, Math.min(value, 1));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-medium text-neutral-600">
        <span>Confidence</span>
        <span>{formatPercent(boundedValue)}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
        <div
          className="h-full rounded-full bg-brand-600"
          style={{ width: `${boundedValue * 100}%` }}
        />
      </div>
    </div>
  );
}
