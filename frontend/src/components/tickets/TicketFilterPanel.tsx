// TicketFilterPanel.tsx - Filter form inside the gallery flyout. Data: data/ticketOptions.ts
"use client";

import { useState } from "react";
import { Search } from "lucide-react";

import {
  ticketCategoryFilterOptions,
  ticketPriorityFilterOptions,
  ticketStatusFilterOptions,
} from "@/data/ticketOptions";
import type { TicketFilters } from "@/types/ticket";

type TicketFilterPanelProps = {
  value: TicketFilters;
  onApply: (filters: TicketFilters) => void;
  onReset: () => void;
};

const selectClass =
  "h-10 w-full rounded-md border border-line bg-card px-3 text-sm text-ink outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100";

export function TicketFilterPanel({ value, onApply, onReset }: TicketFilterPanelProps) {
  const [draft, setDraft] = useState<TicketFilters>(value);

  function setField(field: keyof TicketFilters, fieldValue: string) {
    setDraft((prev) => ({ ...prev, [field]: fieldValue || undefined }));
  }

  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        onApply(draft);
      }}
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">Lọc phản ánh</p>

      <label className="relative block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" aria-hidden="true" />
        <input
          type="search"
          placeholder="Tìm theo từ khóa..."
          className={`${selectClass} pl-9`}
          value={draft.search ?? ""}
          onChange={(event) => setField("search", event.target.value)}
        />
      </label>

      <FilterSelect label="Category" value={draft.category ?? ""} options={ticketCategoryFilterOptions} onChange={(v) => setField("category", v)} />
      <FilterSelect label="Ưu tiên" value={draft.priority ?? ""} options={ticketPriorityFilterOptions} onChange={(v) => setField("priority", v)} />
      <FilterSelect label="Trạng thái" value={draft.status ?? ""} options={ticketStatusFilterOptions} onChange={(v) => setField("status", v)} />

      <div className="flex items-center justify-between gap-3 pt-1">
        <button
          type="button"
          className="st-link text-sm font-semibold text-neutral-500 hover:text-ink"
          onClick={onReset}
        >
          Đặt lại
        </button>
        <button
          type="submit"
          className="st-button rounded-pill bg-brand-600 px-5 py-2.5 text-sm font-bold text-white"
        >
          Áp dụng
        </button>
      </div>
    </form>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: ReadonlyArray<readonly [string, string]>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-semibold text-neutral-600">{label}</span>
      <select className={selectClass} value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue || "all"} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
}
