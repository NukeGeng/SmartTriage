// ModelReanalyzePanel.tsx - Admin action to re-score every ticket with the current model.
"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";

import { reanalyzeAllTickets } from "@/features/tickets/api";
import type { TicketReanalyzeResult } from "@/types/ticket";

export function ModelReanalyzePanel() {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<TicketReanalyzeResult | null>(null);
  const [error, setError] = useState("");

  async function handleReanalyze() {
    setRunning(true);
    setError("");
    setResult(null);
    try {
      setResult(await reanalyzeAllTickets());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không chạy lại được phân tích");
    } finally {
      setRunning(false);
    }
  }

  return (
    <section className="st-card rounded-xl bg-card p-6 shadow-soft md:p-7">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">
            Đồng bộ sau khi train
          </p>
          <h2 className="mt-1 font-display text-xl font-black text-ink">Phân tích lại toàn bộ ticket</h2>
          <p className="mt-1.5 max-w-xl text-sm leading-6 text-neutral-600">
            Ticket cũ giữ nguyên điểm ưu tiên/confidence từ lúc tạo. Chạy lại để mọi ticket dùng
            model hiện tại. Nhãn chỉnh tay và phòng ban đã gán sẽ được giữ nguyên.
          </p>
        </div>
        <button
          type="button"
          onClick={handleReanalyze}
          disabled={running}
          className="st-button inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-pill bg-[#ff8a3d] px-5 text-sm font-bold text-[#11131d] shadow-[0_12px_28px_rgba(255,138,61,0.22)] disabled:cursor-not-allowed disabled:opacity-55"
        >
          <RefreshCw className={`h-4 w-4 ${running ? "animate-spin" : ""}`} aria-hidden="true" />
          {running ? "Đang chạy lại..." : "Phân tích lại"}
        </button>
      </div>

      {error ? (
        <p className="mt-4 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          {error}
        </p>
      ) : null}

      {result ? (
        <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Tổng ticket" value={result.total} />
          <Stat label="Đã cập nhật" value={result.updated} tone="text-[#3fd0a4]" />
          <Stat label="Tạo mới" value={result.created} />
          <Stat label="Thất bại" value={result.failed} tone={result.failed > 0 ? "text-[#ff7b8a]" : undefined} />
          {result.model_version ? (
            <div className="col-span-2 sm:col-span-4">
              <p className="font-mono text-[11px] text-neutral-400">đang dùng model {result.model_version}</p>
            </div>
          ) : null}
        </dl>
      ) : null}
    </section>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: string }) {
  return (
    <div className="rounded-md bg-neutral-50 p-3">
      <dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-neutral-500">{label}</dt>
      <dd className={`mt-1 font-display text-2xl font-black ${tone ?? "text-ink"}`}>{value}</dd>
    </div>
  );
}
