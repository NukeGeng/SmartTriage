// page.tsx - Admin ML Feedback Loop route.
import { AppShell } from "@/components/layout/AppShell";
import { MLFeedbackShell } from "@/components/feedback/MLFeedbackShell";

export default function MLFeedbackPage() {
  return (
    <AppShell>
      <MLFeedbackShell />
    </AppShell>
  );
}
