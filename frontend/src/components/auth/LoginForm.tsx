// LoginForm.tsx - Credential form + demo quick-fill; owns login state and redirect.
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";

import { DemoAccountList } from "@/components/auth/DemoAccountList";
import { Input } from "@/components/ui/Input";
import { demoAccounts } from "@/data/loginContent";
import { login } from "@/features/auth/api";
import { setStoredUser, setToken } from "@/lib/auth";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("student@example.com");
  const [password, setPassword] = useState("12345678");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await login({ email, password });
      setToken(result.access_token);
      setStoredUser(result.user);
      router.replace(result.user.role === "student" ? "/tickets" : "/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="st-enter w-full max-w-md rounded-xl bg-card p-7 shadow-command md:p-8" style={{ animationDelay: "120ms" }}>
      <div className="mb-6 flex items-center gap-3 lg:hidden">
        <span className="grid h-10 w-10 place-items-center rounded-md bg-brand-600 font-display text-sm font-black text-white">
          ST
        </span>
        <span className="font-display text-lg font-black tracking-tight text-ink">SmartTriage</span>
      </div>

      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">SmartTriage console</p>
      <h1 className="mt-2 font-display text-3xl font-black tracking-[-0.02em] text-ink">Chào mừng quay lại</h1>
      <p className="mt-2 text-sm leading-6 text-neutral-600">
        Đăng nhập để theo dõi phản ánh, xem phân tích AI và điều phối xử lý.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <Input
          label="Email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
        />
        <Input
          label="Mật khẩu"
          name="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
        />
        {error ? <p className="text-sm font-medium text-signal-rose">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="st-button inline-flex h-12 w-full items-center justify-center gap-2 rounded-pill bg-brand-600 text-sm font-bold text-white shadow-[0_12px_28px_rgba(37,99,235,0.24)] disabled:cursor-not-allowed disabled:opacity-55"
        >
          <LogIn className="h-4 w-4" aria-hidden="true" />
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>

      <div className="mt-7 flex items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1 bg-line" />
        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-400">Tài khoản demo</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <div className="mt-4">
        <DemoAccountList
          accounts={demoAccounts}
          onSelect={(account) => {
            setEmail(account.email);
            setPassword(account.password);
          }}
        />
      </div>
    </div>
  );
}
