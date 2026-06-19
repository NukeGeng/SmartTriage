// page.tsx - Paginated student ticket gallery route.
import { AppShell } from "@/components/layout/AppShell";
import { TicketGalleryShell } from "@/components/tickets/TicketGalleryShell";

export default function TicketsPage() {
  return (
    <AppShell>
      <TicketGalleryShell />
    </AppShell>
  );
}
