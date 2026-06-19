// LoginShowcase.tsx - Light command-center panel with animated TriageBot. Data: data/loginContent.ts
import { TriageBotAvatar } from "@/components/assistant/TriageBotAvatar";
import { loginBotMessage, loginFeatures } from "@/data/loginContent";

export function LoginShowcase() {
  return (
    <section className="st-enter relative hidden overflow-hidden rounded-[28px] border border-line bg-card p-10 text-ink shadow-command lg:flex lg:flex-col">
      <div className="st-idle-drift absolute -right-20 -top-20 h-64 w-64 rounded-pill bg-brand-100/75" aria-hidden="true" />
      <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-pill bg-amber-50" aria-hidden="true" />

      <div className="relative flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-md bg-brand-600 font-display text-sm font-black text-white">
          ST
        </span>
        <span className="font-display text-lg font-black tracking-tight">SmartTriage</span>
      </div>

      <div className="relative mx-auto mt-10 w-fit">
        <div className="st-bubble absolute -right-24 -top-4 z-10 w-52 rounded-[20px] bg-card p-3.5 text-ink shadow-command">
          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-500">
            <span className="h-1.5 w-1.5 rounded-pill bg-[#20a67a]" aria-hidden="true" />
            TriageBot
          </p>
          <p className="mt-1 text-[13px] font-semibold leading-5">{loginBotMessage}</p>
          <span className="absolute -bottom-1.5 left-7 h-3 w-3 rotate-45 rounded-[3px] bg-card" aria-hidden="true" />
        </div>
        <div className="st-idle-float">
          <TriageBotAvatar className="h-52 w-52 md:h-52 md:w-52" />
        </div>
        <div className="mx-auto mt-1 w-32" aria-hidden="true">
          <div className="st-bot-shadow h-4 rounded-pill bg-black/40 blur-[5px]" />
        </div>
      </div>

      <h2 className="relative mt-10 max-w-md font-display text-3xl font-black leading-[1.08] tracking-[-0.02em]">
        AI triage command center cho phản ánh sinh viên
      </h2>

      <ul className="relative mt-8 space-y-5">
        {loginFeatures.map((feature) => {
          const Icon = feature.icon;
          return (
            <li key={feature.title} className="flex items-start gap-3.5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-brand-50 text-brand-700">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold">{feature.title}</span>
                <span className="mt-0.5 block text-sm leading-6 text-command-muted">{feature.description}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
