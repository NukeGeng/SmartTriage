// TicketCreateForm.tsx - Controlled ticket form with SmartTriage example templates.
import type { FormEvent } from "react";
import { Send, Wand2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { ticketTemplates } from "@/data/newTicketContent";

type TicketCreateFormProps = {
  title: string;
  description: string;
  titleError: string;
  descriptionError: string;
  submitting: boolean;
  error: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onTemplateSelect: (title: string, description: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function TicketCreateForm({
  title,
  description,
  titleError,
  descriptionError,
  submitting,
  error,
  onTitleChange,
  onDescriptionChange,
  onTemplateSelect,
  onSubmit,
}: TicketCreateFormProps) {
  return (
    <section className="st-card rounded-xl bg-card p-5 shadow-command md:p-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand-700">Smart input</p>
          <h2 className="mt-1 font-display text-2xl font-black text-ink">Nội dung phản ánh</h2>
        </div>
        <p className="text-sm font-semibold text-neutral-500">{description.trim().length} ký tự mô tả</p>
      </div>

      <form className="mt-5 space-y-4" onSubmit={onSubmit}>
        <Input
          label="Tiêu đề"
          value={title}
          error={titleError}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder="Không đăng nhập được hệ thống thi online"
          disabled={submitting}
          className="h-12 rounded-lg"
        />
        <Textarea
          label="Mô tả chi tiết"
          value={description}
          error={descriptionError}
          onChange={(event) => onDescriptionChange(event.target.value)}
          placeholder="Nêu hệ thống/phòng học, thời điểm, deadline và mức độ ảnh hưởng."
          disabled={submitting}
          className="min-h-44 rounded-lg"
        />

        <div className="grid gap-3 lg:grid-cols-3">
          {ticketTemplates.map((template) => (
            <button
              key={template.title}
              type="button"
              className="st-card rounded-lg border border-line bg-panel p-3 text-left"
              onClick={() => onTemplateSelect(template.title, template.description)}
              disabled={submitting}
            >
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700">
                <Wand2 className="h-3.5 w-3.5" aria-hidden="true" />
                {template.signal}
              </span>
              <span className="mt-2 block text-sm font-black text-ink">{template.title}</span>
            </button>
          ))}
        </div>

        {submitting ? (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
            Đang gửi ticket và chờ AI phân tích...
          </p>
        ) : null}
        {error ? <p className="text-sm font-bold text-signal-rose">{error}</p> : null}

        <Button
          type="submit"
          disabled={submitting}
          icon={<Send className="h-4 w-4" aria-hidden="true" />}
          className="h-12 rounded-pill px-6"
        >
          Gửi để AI triage
        </Button>
      </form>
    </section>
  );
}
