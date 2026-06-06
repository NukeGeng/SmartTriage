"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";

import { login } from "@/features/auth/api";
import { getStoredUser, isAuthenticated, setStoredUser, setToken } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

const demoAccounts = [
  ["admin@example.com", "12345678"],
  ["student@example.com", "12345678"],
  ["it.staff@example.com", "12345678"],
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("student@example.com");
  const [password, setPassword] = useState("12345678");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated()) {
      const user = getStoredUser();
      router.replace(user?.role === "student" ? "/tickets" : "/dashboard");
    }
  }, [router]);

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
    <main className="flex min-h-screen items-center justify-center bg-panel px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-5">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-md bg-brand-600 text-base font-bold text-white">
            ST
          </div>
          <h1 className="text-2xl font-semibold text-ink">SmartTriage</h1>
          <p className="mt-1 text-sm text-neutral-600">Đăng nhập để theo dõi và xử lý phản ánh.</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Đăng nhập</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
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
              <Button
                className="w-full"
                type="submit"
                disabled={loading}
                icon={<LogIn className="h-4 w-4" aria-hidden="true" />}
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </form>
            <div className="mt-5 rounded-md border border-line bg-panel p-3">
              <p className="text-xs font-semibold uppercase text-neutral-500">Demo accounts</p>
              <div className="mt-2 space-y-2">
                {demoAccounts.map(([demoEmail, demoPassword]) => (
                  <button
                    key={demoEmail}
                    className="block w-full rounded-md px-2 py-1 text-left text-sm text-neutral-700 hover:bg-white"
                    type="button"
                    onClick={() => {
                      setEmail(demoEmail);
                      setPassword(demoPassword);
                    }}
                  >
                    {demoEmail} / {demoPassword}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
