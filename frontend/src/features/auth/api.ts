import { apiFetch } from "@/lib/api";
import type { LoginRequest, LoginResponse, User } from "@/types/auth";

export function login(payload: LoginRequest) {
  return apiFetch<LoginResponse>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getCurrentUser() {
  return apiFetch<User>("/api/v1/auth/me");
}
