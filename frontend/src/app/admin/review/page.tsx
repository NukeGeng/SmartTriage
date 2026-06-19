// page.tsx - Admin AI Review Queue route.
import { AppShell } from "@/components/layout/AppShell";
import { ReviewQueueShell } from "@/components/review/ReviewQueueShell";

export default function AIReviewQueuePage() {
  return (
    <AppShell>
      <ReviewQueueShell />
    </AppShell>
  );
}
