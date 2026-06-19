// ModelInfoDashboard.tsx - Client orchestration for AI model transparency data.
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, Brain, Layers3, Target } from "lucide-react";

import { ModelCategoryCloud } from "@/components/model/ModelCategoryCloud";
import { ModelInfoHero } from "@/components/model/ModelInfoHero";
import { ModelMetricCard } from "@/components/model/ModelMetricCard";
import { ModelPipelinePanel } from "@/components/model/ModelPipelinePanel";
import { Loading } from "@/components/ui/Loading";
import { getModelInfo } from "@/features/ai/api";
import { getStoredUser } from "@/lib/auth";
import { formatPercent } from "@/lib/utils";
import type { ModelInfo } from "@/types/ai";

export function ModelInfoDashboard() {
  const router = useRouter();
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadModelInfo = useCallback(async () => {
    setError("");
    try {
      const result = await getModelInfo();
      setModelInfo(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không tải được thông tin model");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const user = getStoredUser();
    if (user?.role === "student") {
      router.replace("/tickets");
      return;
    }
    void loadModelInfo();
  }, [loadModelInfo, router]);

  const metrics = [
    {
      label: "Model version",
      value: modelInfo?.model_version ?? "Chưa có",
      detail: "Artifact đang phục vụ endpoint analyze-ticket.",
      icon: <Layers3 className="h-5 w-5" aria-hidden="true" />,
    },
    {
      label: "Algorithm",
      value: modelInfo?.algorithm ?? "Đang tải",
      detail: "Pipeline chính cho category classification.",
      icon: <Brain className="h-5 w-5" aria-hidden="true" />,
    },
    {
      label: "Accuracy",
      value: formatPercent(modelInfo?.accuracy),
      detail: "Độ đúng tổng thể trên tập đánh giá.",
      icon: <Target className="h-5 w-5" aria-hidden="true" />,
    },
    {
      label: "Macro F1",
      value: formatPercent(modelInfo?.macro_f1),
      detail: "Cân bằng hiệu năng giữa các category.",
      icon: <Activity className="h-5 w-5" aria-hidden="true" />,
    },
  ];

  return (
    <div className="space-y-6">
      <ModelInfoHero loaded={modelInfo?.model_loaded} loading={loading} onRefresh={() => {
        setLoading(true);
        void loadModelInfo();
      }} />

      {loading ? <Loading label="Đang đọc telemetry từ AI service..." /> : null}
      {error ? <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-bold text-rose-700">{error}</div> : null}

      {!loading && !error ? (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <ModelMetricCard key={metric.label} {...metric} />
            ))}
          </section>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="min-w-0">
              <ModelPipelinePanel />
            </div>
            <ModelCategoryCloud categories={modelInfo?.categories ?? []} />
          </div>
        </>
      ) : null}
    </div>
  );
}
