"""Đo hiệu năng API SmartTriage: end-to-end tạo ticket, p50/p95, error rate.

Cách dùng (cần backend + ai-service + postgres đang chạy):
    python scripts/benchmark_api.py
    python scripts/benchmark_api.py --requests 200 --concurrency 10
    python scripts/benchmark_api.py --base-url http://localhost:8000 --email student@example.com --password 12345678

Yêu cầu: pip install httpx
Ý nghĩa kết quả:
  - p50/p95/mean/max  -> "Thời gian API phản hồi" và "Thời gian tạo ticket end-to-end"
  - error rate        -> "Error rate dưới tải thông thường"
"""
from __future__ import annotations

import argparse
import asyncio
import statistics as st
import time

import httpx


async def login(client: httpx.AsyncClient, base_url: str, email: str, password: str) -> str:
    resp = await client.post(f"{base_url}/api/v1/auth/login", json={"email": email, "password": password})
    resp.raise_for_status()
    return resp.json()["data"]["access_token"]


async def create_ticket(client: httpx.AsyncClient, base_url: str, headers: dict, idx: int) -> tuple[float, bool]:
    payload = {
        "title": f"[bench] Không đăng nhập được hệ thống thi #{idx}",
        "description": (
            "Em không đăng nhập được vào hệ thống thi online từ tối nay, "
            "sáng mai có lịch thi lúc 8h và đã thử đổi mật khẩu nhưng vẫn lỗi."
        ),
    }
    start = time.perf_counter()
    try:
        resp = await client.post(f"{base_url}/api/v1/tickets", json=payload, headers=headers)
        elapsed_ms = (time.perf_counter() - start) * 1000
        return elapsed_ms, resp.status_code == 201
    except Exception:
        return (time.perf_counter() - start) * 1000, False


def percentile(sorted_vals: list[float], p: float) -> float:
    if not sorted_vals:
        return 0.0
    k = max(0, min(len(sorted_vals) - 1, round(p / 100 * len(sorted_vals)) - 1))
    return sorted_vals[k]


async def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--base-url", default="http://localhost:8000")
    parser.add_argument("--email", default="student@example.com")
    parser.add_argument("--password", default="12345678")
    parser.add_argument("--requests", type=int, default=200)
    parser.add_argument("--concurrency", type=int, default=10)
    parser.add_argument("--warmup", type=int, default=5)
    args = parser.parse_args()

    async with httpx.AsyncClient(timeout=30.0) as client:
        token = await login(client, args.base_url, args.email, args.password)
        headers = {"Authorization": f"Bearer {token}"}

        # Warm-up (không tính vào kết quả)
        for i in range(args.warmup):
            await create_ticket(client, args.base_url, headers, i)

        sem = asyncio.Semaphore(args.concurrency)
        latencies: list[float] = []
        ok = 0

        async def worker(idx: int) -> None:
            nonlocal ok
            async with sem:
                ms, success = await create_ticket(client, args.base_url, headers, idx)
                latencies.append(ms)
                if success:
                    ok += 1

        wall_start = time.perf_counter()
        await asyncio.gather(*(worker(i) for i in range(args.requests)))
        wall_s = time.perf_counter() - wall_start

    latencies.sort()
    total = len(latencies)
    errors = total - ok
    print("=== SmartTriage API benchmark — POST /api/v1/tickets ===")
    print(f"base_url        : {args.base_url}")
    print(f"requests        : {total}  | concurrency: {args.concurrency}")
    print(f"throughput      : {total / wall_s:8.1f} req/s  (wall {wall_s:.2f}s)")
    print(f"latency mean    : {st.mean(latencies):8.1f} ms")
    print(f"latency p50     : {percentile(latencies, 50):8.1f} ms")
    print(f"latency p95     : {percentile(latencies, 95):8.1f} ms")
    print(f"latency p99     : {percentile(latencies, 99):8.1f} ms")
    print(f"latency min/max : {min(latencies):.1f} / {max(latencies):.1f} ms")
    print(f"success         : {ok}/{total}")
    print(f"error rate      : {errors / total * 100:8.2f} %")


if __name__ == "__main__":
    asyncio.run(main())
