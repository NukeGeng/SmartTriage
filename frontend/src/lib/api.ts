import { clearToken, getToken } from "./auth";

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
  detail?: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? ((await response.json()) as ApiEnvelope<T>)
    : null;

  if (response.status === 401) {
    clearToken();
  }

  if (!response.ok || payload?.success === false) {
    throw new Error(payload?.detail ?? payload?.message ?? `Request failed with status ${response.status}`);
  }

  if (!payload) {
    return undefined as T;
  }

  return payload.data;
}
