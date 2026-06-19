import { LandingCategoryBar } from "@/components/landing/LandingCategoryBar";
import { LandingFinalCta } from "@/components/landing/LandingFinalCta";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingShotGrid } from "@/components/landing/LandingShotGrid";
import { LandingWorkflowStrip } from "@/components/landing/LandingWorkflowStrip";
import { PublicHeader } from "@/components/landing/PublicHeader";
import { landingCategories, landingHero, landingNavItems, landingShots, landingWorkflow } from "@/data/landingContent";

export default function HomePage() {
  return (
    <main className="st-canvas min-h-screen">
      <PublicHeader navItems={landingNavItems} searchPlaceholder={landingHero.searchPlaceholder} />
      <LandingHero
        badge={landingHero.badge}
        titlePrefix={landingHero.titlePrefix}
        titleWords={landingHero.titleWords}
        subtitle={landingHero.subtitle}
        related={landingHero.related}
        botMessage={landingHero.botMessage}
      />
      <LandingCategoryBar categories={landingCategories} />
      <LandingShotGrid shots={landingShots} />
      <LandingWorkflowStrip steps={landingWorkflow} />
      <LandingFinalCta />
    </main>
  );
}
