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
  pending: "bg-muted text-muted-foreground",
  claimed: "bg-accent/15 text-accent-deep",
  en_route: "bg-accent/15 text-accent-deep",
  completed: "bg-primary/10 text-primary",
  cancelled: "bg-destructive/10 text-destructive",
  no_show: "bg-destructive/10 text-destructive",
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
