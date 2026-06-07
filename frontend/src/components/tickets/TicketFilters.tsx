"use client";

import { Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { TicketFilters as TicketFiltersType } from "@/types/ticket";

const statusOptions = [
  ["", "Tất cả trạng thái"],
  ["new", "Mới"],
  ["analyzing", "Đang phân tích"],
  ["open", "Đang mở"],
  ["in_progress", "Đang xử lý"],
  ["resolved", "Đã xử lý"],
  ["rejected", "Từ chối"],
];

const priorityOptions = [
  ["", "Tất cả ưu tiên"],
  ["high", "Cao"],
  ["medium", "Trung bình"],
  ["low", "Thấp"],
];

const categoryOptions = [
  ["", "Tất cả category"],
  ["account_system", "Tài khoản / Hệ thống"],
  ["network", "Mạng"],
  ["classroom_device", "Thiết bị phòng học"],
  ["facility", "Cơ sở vật chất"],
  ["schedule_exam", "Lịch học / lịch thi"],
  ["tuition_payment", "Học phí"],
  ["document_profile", "Hồ sơ"],
  ["learning_platform", "Nền tảng học tập"],
  ["feedback", "Góp ý"],
  ["other", "Khác"],
];

export function TicketFilters({
  filters,
  onChange,
  onReset,
}: {
  filters: TicketFiltersType;
  onChange: (filters: TicketFiltersType) => void;
  onReset: () => void;
}) {
  function update(key: keyof TicketFiltersType, value: string) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="rounded-lg border border-line bg-white p-4 shadow-soft">
      <div className="grid gap-3 md:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
        <Input
          name="search"
          placeholder="Tìm theo tiêu đề hoặc mô tả"
          value={filters.search ?? ""}
          onChange={(event) => update("search", event.target.value)}
        />
        <select
          className="h-11 rounded-md border border-line bg-white px-3 text-sm text-ink outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
          value={filters.status ?? ""}
          onChange={(event) => update("status", event.target.value)}
          aria-label="Lọc trạng thái"
        >
          {statusOptions.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          className="h-11 rounded-md border border-line bg-white px-3 text-sm text-ink outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
          value={filters.priority ?? ""}
          onChange={(event) => update("priority", event.target.value)}
          aria-label="Lọc ưu tiên"
        >
          {priorityOptions.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          className="h-11 rounded-md border border-line bg-white px-3 text-sm text-ink outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
          value={filters.category ?? ""}
          onChange={(event) => update("category", event.target.value)}
          aria-label="Lọc category"
        >
          {categoryOptions.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            icon={<SlidersHorizontal className="h-4 w-4" aria-hidden="true" />}
            onClick={onReset}
          >
            Xóa
          </Button>
          <Button
            variant="ghost"
            icon={<Search className="h-4 w-4" aria-hidden="true" />}
            className="md:hidden"
          >
            Lọc
          </Button>
        </div>
      </div>
    </div>
  );
}
