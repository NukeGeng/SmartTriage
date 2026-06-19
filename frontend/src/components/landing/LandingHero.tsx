// LandingHero.tsx - Product promise hero with TriageBot and live triage signals.
import Link from "next/link";
import { ArrowRight, GitMerge, ShieldAlert, Sparkles } from "lucide-react";

import { TriageBotAvatar } from "@/components/assistant/TriageBotAvatar";
import { LandingAnimatedPhrase } from "@/components/landing/LandingAnimatedPhrase";

type LandingHeroProps = {
  badge: string;
  titlePrefix: string;
  titleWords: string[];
  subtitle: string;
  related: string[];
  botMessage: string;
};

const aiCards = [
  { label: "Phân loại", value: "Tài khoản / Hệ thống", icon: Sparkles, className: "left-0 top-8" },
  { label: "Ưu tiên", value: "Cao · 86/100", icon: ShieldAlert, className: "right-0 top-32" },
  { label: "Sự cố", value: "3 phản ánh liên quan", icon: GitMerge, className: "bottom-6 left-12" },
];

export function LandingHero({ badge, titlePrefix, titleWords, subtitle, related, botMessage }: LandingHeroProps) {
  return (
    <section className="mx-auto grid w-full max-w-[1280px] items-center gap-10 px-5 pb-12 pt-10 md:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.92fr)] lg:pb-16 lg:pt-14">
      <div className="st-enter min-w-0">
        <p className="inline-flex rounded-pill bg-brand-50 px-4 py-2 text-sm font-bold text-brand-700 shadow-soft">
          {badge}
        </p>
        <h1 className="mt-6 max-w-3xl font-display text-[1.85rem] font-black leading-[1.02] text-ink sm:text-[2.25rem] md:text-[2.75rem] lg:text-[3.25rem]">
          {titlePrefix} <LandingAnimatedPhrase words={titleWords} />.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-neutral-500 md:text-lg">{subtitle}</p>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/tickets/new" className="st-button rounded-pill bg-brand-600 px-6 py-3 text-sm font-bold text-white">
            Gửi phản ánh thử
          </Link>
          <Link
            href="/admin/triage"
            className="st-button inline-flex items-center gap-2 rounded-pill bg-card px-6 py-3 text-sm font-bold text-ink shadow-soft"
          >
            Mở buồng điều phối
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-7 flex max-w-2xl flex-wrap items-center gap-2 text-sm text-neutral-500">
          <span className="font-bold text-ink">Các mô-đun AI:</span>
          {related.map((tag) => (
            <span key={tag} className="rounded-pill border border-line bg-card/78 px-3 py-1.5 font-bold text-ink shadow-soft">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="relative mx-auto h-[430px] w-full max-w-[520px] overflow-visible">
        <div
          className="absolute left-1/2 top-1/2 h-[330px] w-[330px] -translate-x-1/2 -translate-y-1/2 rounded-pill bg-gradient-to-br from-command-elevated to-brand-50"
          aria-hidden="true"
        />
        <div
          className="st-idle-drift absolute left-1/2 top-1/2 h-[390px] w-[390px] -translate-x-1/2 -translate-y-1/2 rounded-pill border border-line bg-card/20"
          aria-hidden="true"
        />
        <div className="absolute bottom-12 left-1/2 w-48 -translate-x-1/2" aria-hidden="true">
          <div className="st-bot-shadow h-5 rounded-pill bg-ink/30 blur-[6px]" />
        </div>
        <div className="absolute left-1/2 top-12 -translate-x-1/2">
          <div className="st-idle-float">
            <TriageBotAvatar />
          </div>
        </div>

        <div className="st-bubble absolute right-2 top-0 z-10 max-w-[260px] rounded-xl bg-card p-4 shadow-command">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-500">
            <span className="h-1.5 w-1.5 rounded-pill bg-emerald-500" aria-hidden="true" />
            TriageBot
          </p>
          <p className="mt-1.5 text-sm font-bold leading-6 text-ink">{botMessage}</p>
          <span className="absolute -bottom-1.5 left-9 h-3 w-3 rotate-45 rounded-sm bg-card" aria-hidden="true" />
        </div>

        {aiCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`st-card absolute ${card.className} z-20 rounded-lg bg-card px-4 py-3 shadow-command`}
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-pill bg-brand-50 text-brand-700">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-xs font-bold text-neutral-500">{card.label}</span>
                  <span className="block text-sm font-black text-ink">{card.value}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
