// CategoryBadge.tsx - Category-colored label for quick AI classification scanning.
import { cn } from "@/lib/utils";

type CategoryBadgeProps = {
  category?: string | null;
  label?: string | null;
  className?: string;
};

type CategoryTone = {
  label: string;
  dot: string;
  text: string;
};

const categoryTones: Record<string, CategoryTone> = {
  account_system: {
    label: "Tài khoản / Hệ thống",
    dot: "bg-blue-600",
    text: "text-blue-700",
  },
  network: {
    label: "Mạng",
    dot: "bg-cyan-600",
    text: "text-cyan-700",
  },
  learning_platform: {
    label: "Nền tảng học tập",
    dot: "bg-emerald-600",
    text: "text-emerald-700",
  },
  classroom_device: {
    label: "Thiết bị phòng học",
    dot: "bg-orange-500",
    text: "text-orange-700",
  },
  facility: {
    label: "Cơ sở vật chất",
    dot: "bg-stone-500",
    text: "text-stone-700",
  },
  schedule_exam: {
    label: "Lịch học / Lịch thi",
    dot: "bg-rose-600",
    text: "text-rose-700",
  },
  tuition_payment: {
    label: "Học phí",
    dot: "bg-lime-600",
    text: "text-lime-700",
  },
  document_profile: {
    label: "Hồ sơ",
    dot: "bg-sky-600",
    text: "text-sky-700",
  },
  feedback: {
    label: "Góp ý",
    dot: "bg-amber-500",
    text: "text-amber-700",
  },
  other: {
    label: "Khác",
    dot: "bg-neutral-400",
    text: "text-neutral-600",
  },
};

const fallbackTone: CategoryTone = {
  label: "Chưa phân loại",
  dot: "bg-neutral-300",
  text: "text-neutral-500",
};

export function CategoryBadge({ category, label, className }: CategoryBadgeProps) {
  const tone = category ? categoryTones[category] ?? fallbackTone : fallbackTone;
  const displayLabel = label ?? tone.label;

  return (
    <span
      className={cn(
        "inline-flex min-h-7 max-w-52 items-center gap-2 py-1 text-xs font-semibold",
        tone.text,
        className,
      )}
    >
      <span className={cn("h-2 w-2 shrink-0 rounded-pill", tone.dot)} aria-hidden="true" />
      <span className="truncate">{displayLabel}</span>
    </span>
  );
}
