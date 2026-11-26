import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function RiskBadge({ atRisk, className }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 font-medium",
        atRisk ? "border-destructive/30 text-destructive" : "text-muted-foreground",
        className
      )}
    >
      <span className={cn("size-1.5 rounded-full", atRisk ? "bg-destructive" : "bg-success")} />
      {atRisk ? "At risk" : "On track"}
    </Badge>
  );
}
