import { Badge } from "@/components/ui/Badge";

export function DetectedSignals({ signals }: { signals: string[] }) {
  if (signals.length === 0) {
    return <p className="text-sm text-neutral-500">Chưa phát hiện tín hiệu đặc trưng rõ ràng.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {signals.map((signal) => (
        <Badge key={signal} tone="cyan">
          {signal}
        </Badge>
      ))}
    </div>
  );
}
