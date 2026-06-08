import { CheckCircle2 } from "lucide-react";

export function SuggestedActions({ actions }: { actions: string[] }) {
  if (actions.length === 0) {
    return <p className="text-sm text-neutral-500">Chưa có gợi ý xử lý.</p>;
  }

  return (
    <ul className="space-y-2">
      {actions.map((action) => (
        <li key={action} className="flex gap-2 text-sm text-neutral-700">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
          <span>{action}</span>
        </li>
      ))}
    </ul>
  );
}
