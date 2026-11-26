import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Reusable statistic card
export default function SummaryCard({ label, value, suffix = "", hint, icon: Icon, tone = "default" }) {
  return (
    <Card className="gap-0 px-5 py-4 shadow-none">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{label}</span>
        {Icon && <Icon className="size-4" />}
      </div>
      <div className="mt-3 flex items-baseline gap-0.5">
        <span className="text-3xl font-semibold tracking-tight tabular-nums">{value}</span>
        {suffix && <span className="text-lg text-muted-foreground">{suffix}</span>}
      </div>
      {hint && (
        <p
          className={cn(
            "mt-1 text-xs",
            tone === "bad" ? "text-destructive" : tone === "good" ? "text-success" : "text-muted-foreground"
          )}
        >
          {hint}
        </p>
      )}
    </Card>
  );
}
