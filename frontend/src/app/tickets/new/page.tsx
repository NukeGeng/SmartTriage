"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { createTicket } from "@/features/tickets/api";
import type { Ticket } from "@/types/ticket";

export default function NewTicketPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [createdTicket, setCreatedTicket] = useState<Ticket | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const titleError = title.length > 0 && title.trim().length < 5 ? "Title cần ít nhất 5 ký tự" : "";
  const descriptionError =
    description.length > 0 && description.trim().length < 10 ? "Description cần ít nhất 10 ký tự" : "";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (title.trim().length < 5 || description.trim().length < 10) {
      setError("Vui lòng nhập đủ title và description.");
      return;
    }

    setSubmitting(true);
    try {
      const ticket = await createTicket({ title: title.trim(), description: description.trim() });
      setCreatedTicket(ticket);
      window.setTimeout(() => router.push(`/tickets/${ticket.id}`), 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tạo ticket");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl space-y-5">
        <div>
          <p className="text-sm font-semibold text-brand-700">Tạo phản ánh</p>
          <h1 className="text-2xl font-semibold text-ink">Gửi phản ánh mới</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Backend sẽ lưu ticket và gọi AI service để phân loại, tính ưu tiên và tìm trùng lặp.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Nội dung phản ánh</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input
                label="Title"
                value={title}
                error={titleError}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Không đăng nhập được hệ thống thi online"
                disabled={submitting}
              />
              <Textarea
                label="Description"
                value={description}
                error={descriptionError}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Mô tả chi tiết vấn đề, thời gian xảy ra và mức độ ảnh hưởng."
                disabled={submitting}
              />
              {submitting ? (
                <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800">
                  Đang gửi và phân tích bằng AI...
                </p>
              ) : null}
              {error ? <p className="text-sm font-medium text-signal-rose">{error}</p> : null}
              <Button
                type="submit"
                disabled={submitting}
                icon={<Send className="h-4 w-4" aria-hidden="true" />}
              >
                Gửi phản ánh
              </Button>
            </form>
          </CardContent>
        </Card>

        {createdTicket ? (
          <Card>
            <CardHeader>
              <CardTitle>AI analysis preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {createdTicket.analysis ? (
                <div className="flex flex-wrap gap-2">
                  <Badge tone="cyan">{createdTicket.analysis.category_label}</Badge>
                  <Badge priority={createdTicket.analysis.priority} />
                  <Badge tone="green">{createdTicket.analysis.suggested_department}</Badge>
                  <Badge tone="amber">
                    {createdTicket.analysis.duplicate_candidates.length} phản ánh tương tự
                  </Badge>
                </div>
              ) : (
                <p className="text-sm text-neutral-500">Ticket đã tạo, AI analysis đang được xử lý hoặc đã fallback.</p>
              )}
            </CardContent>
          </Card>
        ) : null}
      </div>
    </AppShell>
  );
}
