import { apiFetch } from "@/lib/api";
import type { ModelInfo } from "@/types/ai";

export function getModelInfo() {
  return apiFetch<ModelInfo>("/api/v1/ai/model-info");
}
