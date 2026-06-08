import { Badge } from "@/components/ui/Badge";
import type { TicketPriority } from "@/types/ticket";

export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  return <Badge priority={priority}>{priority}</Badge>;
}
