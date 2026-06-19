// ReviewCorrectionForm.tsx - Manual category and priority correction controls.
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Route, Save } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { reviewDecisionHints } from "@/data/reviewQueueContent";
import { ticketCategoryFilterOptions, ticketPriorityFilterOptions } from "@/data/ticketOptions";
import type { TriageTicket } from "@/types/triage";

type ReviewCorrectionFormProps = {
  ticket: TriageTicket;
  saving: boolean;
  onSave: (ticketId: string, category: string, priority: string) => Promise<void>;
};

export function ReviewCorrectionForm({ ticket, saving, onSave }: ReviewCorrectionFormProps) {
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    setCategory(ticket.category ?? "");
    setPriority(ticket.priority ?? "");
    setNote("");
  }, [ticket.id, ticket.category, ticket.priority]);

  const canSave = Boolean((category || priority) && !saving);

  return (
    <form
      className="rounded-lg border border-line bg-command-elevated p-4"
      onSubmit={(event) => {
        event.preventDefault();
        void onSave(ticket.id, category, priority);
      }}
    >
      <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-command-muted">
        <Route className="h-4 w-4 text-brand-700" aria-hidden="true" />
        Manual decision
      </p>

      <div className="mt-4 space-y-4">
        <label className="block space-y-1.5 text-sm font-bold text-ink">
          Category đúng
          <select
            className="st-field h-11 w-full rounded-md border border-line bg-card px-3 text-sm text-ink outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {ticketCategoryFilterOptions.map(([value, label]) => (
              <option key={value || "empty-category"} value={value}>
                {value ? label : "Chọn category"}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-1.5 text-sm font-bold text-ink">
          Priority đúng
          <select
            className="st-field h-11 w-full rounded-md border border-line bg-card px-3 text-sm text-ink outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
          >
            {ticketPriorityFilterOptions.map(([value, label]) => (
              <option key={value || "empty-priority"} value={value}>
                {value ? label : "Chọn priority"}
              </option>
            ))}
          </select>
        </label>

        <Textarea
          label="Ghi chú quyết định"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Ví dụ: sinh viên có lịch thi sáng mai nên giữ high priority."
          className="min-h-28 bg-card"
        />

        <div className="rounded-lg border border-line bg-card p-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-command-muted">
            Review checklist
          </p>
          <ul className="mt-2 space-y-2">
            {reviewDecisionHints.map((hint) => (
              <li key={hint} className="text-xs font-semibold leading-5 text-command-muted">
                {hint}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="submit"
            icon={<Save className="h-4 w-4" aria-hidden="true" />}
            disabled={!canSave}
          >
            {saving ? "Đang lưu..." : "Lưu correction"}
          </Button>
          <Link href={`/tickets/${ticket.id}`}>
            <Button variant="secondary" icon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}>
              Mở ticket
            </Button>
          </Link>
        </div>
      </div>
    </form>
  );
}
