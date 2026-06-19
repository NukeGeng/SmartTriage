// LandingShotGrid.tsx - Asymmetric product capability grid for SmartTriage.
import { LandingShotCard } from "@/components/landing/LandingShotCard";
import type { LandingShot } from "@/data/landingContent";

type LandingShotGridProps = {
  shots: LandingShot[];
};

const layoutClasses = [
  "lg:col-span-6",
  "lg:col-span-6",
  "lg:col-span-4",
  "lg:col-span-4",
  "lg:col-span-4",
  "lg:col-span-4",
  "lg:col-span-4",
  "lg:col-span-4",
];

export function LandingShotGrid({ shots }: LandingShotGridProps) {
  return (
    <section className="mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-6 px-5 py-8 md:grid-cols-2 md:px-8 lg:grid-cols-12">
      {shots.map((shot, index) => (
        <LandingShotCard
          key={shot.title}
          shot={shot}
          index={index}
          featured={index < 2}
          className={layoutClasses[index] ?? "lg:col-span-4"}
        />
      ))}
    </section>
  );
}
