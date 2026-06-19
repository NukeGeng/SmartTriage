// CreateTicketAction.tsx - Primary action link for opening the ticket submission flow.
import Link from "next/link";
import { Plus } from "lucide-react";

export function CreateTicketAction() {
  return (
    <Link
      href="/tickets/new"
      className="st-button inline-flex h-11 items-center gap-2 rounded-pill bg-brand-600 px-4 text-sm font-bold text-white shadow-soft"
    >
      <Plus className="h-4 w-4" aria-hidden="true" />
      Tạo phản ánh
    </Link>
  );
}
