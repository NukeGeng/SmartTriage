// TicketCreateShell.tsx - Client orchestration for creating a ticket and showing AI triage feedback.
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";

import { TicketAnalysisPreview } from "@/components/tickets/create/TicketAnalysisPreview";
import { TicketCreateForm } from "@/components/tickets/create/TicketCreateForm";
import { TicketCreateHero } from "@/components/tickets/create/TicketCreateHero";
import { TicketTriageGuide } from "@/components/tickets/create/TicketTriageGuide";
import { createTicket } from "@/features/tickets/api";
import type { Ticket } from "@/types/ticket";

export function TicketCreateShell() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [createdTicket, setCreatedTicket] = useState<Ticket | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const titleError = title.length > 0 && title.trim().length < 5 ? "Tiêu đề cần ít nhất 5 ký tự" : "";
  const descriptionError =
    description.length > 0 && description.trim().length < 10 ? "Mô tả cần ít nhất 10 ký tự" : "";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (title.trim().length < 5 || description.trim().length < 10) {
      setError("Vui lòng nhập đủ tiêu đề và mô tả để AI có tín hiệu phân tích.");
      return;
    }

    setSubmitting(true);
    try {
      const ticket = await createTicket({ title: title.trim(), description: description.trim() });
      setCreatedTicket(ticket);
      window.setTimeout(() => router.push(`/tickets/${ticket.id}`), 900);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tạo ticket");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <TicketCreateHero />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-5">
          <TicketCreateForm
            title={title}
            description={description}
            titleError={titleError}
            descriptionError={descriptionError}
            submitting={submitting}
            error={error}
            onTitleChange={setTitle}
            onDescriptionChange={setDescription}
            onTemplateSelect={(templateTitle, templateDescription) => {
              setTitle(templateTitle);
              setDescription(templateDescription);
            }}
            onSubmit={handleSubmit}
          />
          <TicketAnalysisPreview ticket={createdTicket} />
        </div>
        <TicketTriageGuide />
      </div>
    </div>
  );
}
