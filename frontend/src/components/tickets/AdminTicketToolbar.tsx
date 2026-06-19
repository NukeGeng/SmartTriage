// AdminTicketToolbar.tsx - Dense filter/sort controls for the admin ticket queue.
"use client";

import { ArrowDownWideNarrow, RotateCcw, Search } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { ticketCategoryFilterOptions, ticketPriorityFilterOptions, ticketStatusFilterOptions } from "@/data/ticketOptions";
import { cn } from "@/lib/utils";
import type { TicketFilters as TicketFiltersType } from "@/types/ticket";

export type AdminTicketSortKey = "created_at" | "priority";

type AdminTicketToolbarProps = {
  filters: TicketFiltersType;
  department: string;
  sortBy: AdminTicketSortKey;
  onFiltersChange: (filters: TicketFiltersType) => void;
  onDepartmentChange: (department: string) => void;
  onSortChange: (sortBy: AdminTicketSortKey) => void;
  onReset: () => void;
};

const controlClass =
  "st-field h-10 min-w-0 rounded-md border border-line bg-card px-3 text-sm text-ink outline-none focus:border-neutral-300 focus:ring-2 focus:ring-neutral-200";

export function AdminTicketToolbar({
  filters,
  department,
  sortBy,
  onFiltersChange,
  onDepartmentChange,
  onSortChange,
  onReset,
}: AdminTicketToolbarProps) {
  function updateFilter(key: keyof TicketFiltersType, value: string) {
    onFiltersChange({ ...filters, [key]: value });
  }

  return (
    <div className="rounded-lg border border-line bg-card p-3 shadow-soft">
      <div className="grid gap-2 lg:grid-cols-[minmax(220px,1.3fr)_160px_150px_190px_minmax(160px,1fr)_145px_auto]">
        <label className="relative min-w-0">
          <span className="sr-only">Tìm ticket</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            className={cn(controlClass, "w-full pl-9")}
            placeholder="Tìm tiêu đề hoặc mô tả"
            value={filters.search ?? ""}
            onChange={(event) => updateFilter("search", event.target.value)}
          />
        </label>

        <select
          className={controlClass}
          value={filters.status ?? ""}
          onChange={(event) => updateFilter("status", event.target.value)}
          aria-label="Lọc trạng thái"
        >
          {ticketStatusFilterOptions.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <select
          className={controlClass}
          value={filters.priority ?? ""}
          onChange={(event) => updateFilter("priority", event.target.value)}
          aria-label="Lọc ưu tiên"
        >
          {ticketPriorityFilterOptions.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <select
          className={controlClass}
          value={filters.category ?? ""}
          onChange={(event) => updateFilter("category", event.target.value)}
          aria-label="Lọc category"
        >
          {ticketCategoryFilterOptions.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <input
          className={controlClass}
          value={department}
          onChange={(event) => onDepartmentChange(event.target.value)}
          placeholder="Phòng phụ trách"
          aria-label="Lọc theo phòng phụ trách"
        />

        <label className="relative min-w-0">
          <span className="sr-only">Sắp xếp</span>
          <ArrowDownWideNarrow className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <select
            className={cn(controlClass, "w-full pl-9")}
            value={sortBy}
            onChange={(event) => onSortChange(event.target.value as AdminTicketSortKey)}
          >
            <option value="created_at">Mới nhất</option>
            <option value="priority">Ưu tiên</option>
          </select>
        </label>

        <Button
          variant="secondary"
          icon={<RotateCcw className="h-4 w-4" aria-hidden="true" />}
          className="min-h-10 px-3"
          onClick={onReset}
        >
          Xóa
        </Button>
      </div>
    </div>
  );
}
