import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n";

export type BookingStatus =
  | "pending"
  | "claimed"
  | "en_route"
  | "completed"
  | "cancelled"
  | "no_show";

const STATUS_CLASSES: Record<BookingStatus, string> = {
  pending: "bg-status-pending/12 text-status-pending",
  claimed: "bg-status-claimed/12 text-status-claimed",
  en_route: "bg-status-en-route/12 text-status-en-route",
  completed: "bg-status-completed/12 text-status-completed",
  cancelled: "bg-status-cancelled/12 text-status-cancelled",
  no_show: "bg-status-cancelled/12 text-status-cancelled",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const t = useT();
  const known = (status in STATUS_CLASSES ? status : "pending") as BookingStatus;
  return (
    <Badge variant="outline" className={cn("border-transparent", STATUS_CLASSES[known], className)}>
      {t.account.status[known]}
    </Badge>
  );
}
