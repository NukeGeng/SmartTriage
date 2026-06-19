// TicketPagination.tsx - Compact pagination controls for paged ticket lists.
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

type TicketPaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  loading?: boolean;
  onPageChange: (page: number) => void;
};

export function TicketPagination({
  page,
  pageSize,
  total,
  loading = false,
  onPageChange,
}: TicketPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const end = Math.min(safePage * pageSize, total);
  const canGoBack = safePage > 1 && !loading;
  const canGoNext = safePage < totalPages && !loading;

  if (total <= pageSize && safePage === 1) {
    return (
      <div className="rounded-xl border border-line bg-card px-4 py-3 text-sm font-semibold text-command-muted shadow-soft">
        Đang hiển thị {total} ticket trong page hiện tại.
      </div>
    );
  }

  return (
    <nav
      className="flex flex-col gap-3 rounded-xl border border-line bg-card px-4 py-3 shadow-soft md:flex-row md:items-center md:justify-between"
      aria-label="Ticket pagination"
    >
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand-700">
          Paged loading
        </p>
        <p className="mt-1 text-sm font-semibold text-command-muted">
          Hiển thị <span className="font-black text-ink">{start}-{end}</span> trong{" "}
          <span className="font-black text-ink">{total}</span> ticket, {pageSize} ticket/page.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className={cn(
            "st-button inline-flex h-10 items-center gap-2 rounded-pill border border-line bg-command-elevated px-3 text-sm font-bold text-ink",
            !canGoBack && "opacity-50",
          )}
          disabled={!canGoBack}
          onClick={() => onPageChange(safePage - 1)}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Trước
        </button>
        <span className="rounded-pill border border-line bg-panel px-3 py-2 text-sm font-black text-ink">
          {safePage}/{totalPages}
        </span>
        <button
          type="button"
          className={cn(
            "st-button inline-flex h-10 items-center gap-2 rounded-pill border border-line bg-command-elevated px-3 text-sm font-bold text-ink",
            !canGoNext && "opacity-50",
          )}
          disabled={!canGoNext}
          onClick={() => onPageChange(safePage + 1)}
        >
          Sau
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}
