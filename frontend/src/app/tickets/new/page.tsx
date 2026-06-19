// page.tsx - New ticket route composed from the SmartTriage creation shell.
import { AppShell } from "@/components/layout/AppShell";
import { TicketCreateShell } from "@/components/tickets/create/TicketCreateShell";

export default function NewTicketPage() {
  return (
    <AppShell>
      <TicketCreateShell />
    </AppShell>
  );
}
