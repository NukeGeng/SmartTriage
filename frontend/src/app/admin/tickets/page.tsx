// page.tsx - Admin paginated ticket queue route.
import { AppShell } from "@/components/layout/AppShell";
import { AdminTicketQueue } from "@/components/tickets/AdminTicketQueue";

export default function AdminTicketsPage() {
  return (
    <AppShell>
      <AdminTicketQueue />
    </AppShell>
  );
}
