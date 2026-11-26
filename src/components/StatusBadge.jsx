import { cn } from "@/lib/utils";

const DOT = {
  Active: "bg-success",
  Probation: "bg-warning",
  "On Leave": "bg-chart-2",
  Inactive: "bg-muted-foreground/50",
};

export default function StatusBadge({ status }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm">
      <span className={cn("size-1.5 rounded-full", DOT[status] ?? "bg-muted-foreground")} />
      {status}
    </span>
  );
}
