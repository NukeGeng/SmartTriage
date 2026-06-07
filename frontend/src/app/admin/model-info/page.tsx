"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Brain, CheckCircle2, RefreshCcw, XCircle } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Loading } from "@/components/ui/Loading";
import { getModelInfo } from "@/features/ai/api";
import { getStoredUser } from "@/lib/auth";
import { formatPercent } from "@/lib/utils";
import type { ModelInfo } from "@/types/ai";

export default function ModelInfoPage() {
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

  return (
    <AppShell>
      <div className="space-y-5">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold text-brand-700">AI transparency</p>
            <h1 className="text-2xl font-semibold text-ink">Model Info</h1>
            <p className="mt-1 text-sm text-neutral-600">
              Thông tin model đang dùng để phân loại ticket và giải trình demo kỹ thuật.
            </p>
          </div>
          <Button
            variant="secondary"
            icon={<RefreshCcw className="h-4 w-4" aria-hidden="true" />}
            onClick={() => {
              setLoading(true);
              void loadModelInfo();
            }}
          >
            Làm mới
          </Button>
        </div>

        {loading ? (
          <Loading />
        ) : error ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">
            {error}
          </div>
        ) : modelInfo ? (
          <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin model</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <Metric label="Model version" value={modelInfo.model_version ?? "Chưa có"} />
                <Metric label="Algorithm" value={modelInfo.algorithm} />
                <Metric label="Accuracy" value={formatPercent(modelInfo.accuracy)} />
                <Metric label="Macro F1" value={formatPercent(modelInfo.macro_f1)} />
                <Metric label="Number of categories" value={String(modelInfo.categories.length)} />
                <div className="rounded-md border border-line bg-panel p-4">
                  <p className="text-sm text-neutral-500">Model loaded</p>
                  <div className="mt-2 flex items-center gap-2">
                    {modelInfo.model_loaded ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-700" aria-hidden="true" />
                    ) : (
                      <XCircle className="h-5 w-5 text-rose-700" aria-hidden="true" />
                    )}
                    <Badge tone={modelInfo.model_loaded ? "green" : "rose"}>
                      {modelInfo.model_loaded ? "Loaded" : "Not loaded"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                {modelInfo.categories.length === 0 ? (
                  <p className="text-sm text-neutral-500">Chưa có danh sách category từ AI service.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {modelInfo.categories.map((category) => (
                      <Badge key={category} tone="cyan">
                        {category}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-line bg-panel p-4">
      <div className="flex items-center gap-2 text-sm text-neutral-500">
        <Brain className="h-4 w-4 text-brand-600" aria-hidden="true" />
        <span>{label}</span>
      </div>
      <p className="mt-2 text-xl font-semibold text-ink">{value}</p>
    </div>
  );
}
