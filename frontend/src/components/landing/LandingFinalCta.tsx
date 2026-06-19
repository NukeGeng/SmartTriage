// LandingFinalCta.tsx - Final action band for demo and cockpit routes.
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function LandingFinalCta() {
  return (
    <section className="mx-auto w-full max-w-[1280px] px-5 pb-16 pt-4 md:px-8">
      <div className="grid gap-6 rounded-xl bg-card p-6 shadow-command md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:p-8">
        <div className="min-w-0">
          <p className="text-sm font-bold text-brand-700">Sẵn sàng xem toàn bộ quy trình?</p>
          <h2 className="mt-2 max-w-2xl font-display text-4xl font-black leading-none text-ink">
            Chạy thử tình huống thi online trong 3 phút.
          </h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/demo" className="st-button rounded-pill bg-brand-600 px-6 py-3 text-sm font-black text-white">
            Xem bản trình diễn
          </Link>
          <Link
            href="/admin/triage"
            className="st-button inline-flex items-center gap-2 rounded-pill border border-line bg-command-elevated px-6 py-3 text-sm font-black text-ink"
          >
            Mở buồng điều phối
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
