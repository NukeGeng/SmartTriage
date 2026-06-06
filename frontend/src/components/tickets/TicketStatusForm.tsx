"use client";

import { useState } from "react";
import { Save } from "lucide-react";

import { updateTicket, updateTicketStatus } from "@/features/tickets/api";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import type { Ticket, TicketStatus } from "@/types/ticket";

const statuses: Array<[TicketStatus, string]> = [
  ["new", "Mới"],
  ["analyzing", "Đang phân tích"],
  ["open", "Đang mở"],
  ["in_progress", "Đang xử lý"],
  ["resolved", "Đã xử lý"],
  ["rejected", "Từ chối"],
];

const priorities = [
  ["", "Không ghi đè"],
  ["high", "Cao"],
  ["medium", "Trung bình"],
  ["low", "Thấp"],
];

export function TicketStatusForm({
  ticket,
  onSaved,
}: {
  ticket: Ticket;
  onSaved: (ticket: Ticket) => void;
}) {
  const [status, setStatus] = useState<TicketStatus>(ticket.status);
  const [assignedDepartment, setAssignedDepartment] = useState(ticket.assigned_department ?? "");
  const [manualCategory, setManualCategory] = useState(ticket.manual_category ?? "");
  const [manualPriority, setManualPriority] = useState(ticket.manual_priority ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      let nextTicket = ticket;
      if (status !== ticket.status) {
        nextTicket = await updateTicketStatus(ticket.id, status);
      }
      nextTicket = await updateTicket(ticket.id, {
        assigned_department: assignedDepartment || null,
        manual_category: manualCategory || null,
        manual_priority: manualPriority || null,
      });
      onSaved({ ...nextTicket, analysis: nextTicket.analysis ?? ticket.analysis });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể cập nhật ticket");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cập nhật xử lý</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-ink">Trạng thái</span>
            <select
              className="h-11 w-full rounded-md border border-line bg-white px-3 text-sm text-ink outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
              value={status}
              onChange={(event) => setStatus(event.target.value as TicketStatus)}
            >
              {statuses.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <Input
            label="Phòng phụ trách"
            value={assignedDepartment}
            onChange={(event) => setAssignedDepartment(event.target.value)}
          />
          <Input
            label="Category thủ công"
            value={manualCategory}
            onChange={(event) => setManualCategory(event.target.value)}
          />
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-ink">Priority thủ công</span>
            <select
              className="h-11 w-full rounded-md border border-line bg-white px-3 text-sm text-ink outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
              value={manualPriority}
              onChange={(event) => setManualPriority(event.target.value)}
            >
              {priorities.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          {error ? <p className="text-sm font-medium text-signal-rose">{error}</p> : null}
          <Button
            type="submit"
            disabled={saving}
            icon={<Save className="h-4 w-4" aria-hidden="true" />}
          >
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
