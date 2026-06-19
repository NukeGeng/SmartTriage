// ExportFeedbackButton.tsx - Client-side CSV export for corrected feedback samples.
"use client";

import { Download } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { getAiCategory, getAiPriority, getTicketConfidence } from "@/lib/feedback";
import type { Ticket } from "@/types/ticket";

type ExportFeedbackButtonProps = {
  tickets: Ticket[];
};

function csvEscape(value: string | number | null | undefined) {
  const text = String(value ?? "");
  return `"${text.replaceAll("\"", "\"\"")}"`;
}

export function ExportFeedbackButton({ tickets }: ExportFeedbackButtonProps) {
  function handleExport() {
    const rows = [
      [
        "ticket_id",
        "title",
        "description",
        "manual_category",
        "manual_priority",
        "ai_category",
        "ai_priority",
        "confidence",
        "source",
      ],
      ...tickets.map((ticket) => [
        ticket.id,
        ticket.title,
        ticket.description ?? "",
        ticket.manual_category ?? "",
        ticket.manual_priority ?? "",
        getAiCategory(ticket),
        getAiPriority(ticket),
        getTicketConfidence(ticket) ?? "",
        "manual",
      ]),
    ];
    const csv = rows.map((row) => row.map(csvEscape).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "smarttriage-ml-feedback.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Button
      icon={<Download className="h-4 w-4" aria-hidden="true" />}
      onClick={handleExport}
      disabled={tickets.length === 0}
      className="w-full rounded-pill"
    >
      Export CSV
    </Button>
  );
}
