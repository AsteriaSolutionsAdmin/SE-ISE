import { cn } from "@/lib/utils";

// Reusable horizontal bar with a threshold-based colour
export default function ProgressBar({ value, max = 100, threshold = 40, className }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-muted", className)}>
      <div
        className={cn("h-full rounded-full transition-all", pct < threshold ? "bg-destructive" : "bg-foreground/80")}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
