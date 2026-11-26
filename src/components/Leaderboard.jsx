import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Toggle from "./Toggle";
import StudentAvatar from "./StudentAvatar";

// Additional feature: performance leaderboard ranked by a chosen metric
const METRICS = {
  avgMarks: { label: "Marks" },
  attendance: { label: "Attendance" },
  assignmentPct: { label: "Assignments" },
};

export default function Leaderboard({ students, onSelect }) {
  const [metric, setMetric] = useState("avgMarks");
  const [size, setSize] = useState(5);

  const ranked = [...students].sort((a, b) => b[metric] - a[metric]).slice(0, size);
  const top = ranked[0]?.[metric] || 100;

  return (
    <Card className="gap-4 shadow-none">
      <CardHeader>
        <CardTitle className="text-base">Top performers</CardTitle>
        <CardDescription>Ranked within the current filters</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Toggle
          value={metric}
          onChange={setMetric}
          options={Object.entries(METRICS).map(([value, m]) => ({ value, label: m.label }))}
        />
        {ranked.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No students to rank.</p>
        ) : (
          <ol className="-mx-2">
            {ranked.map((s, i) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => onSelect(s)}
                  className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors hover:bg-accent"
                >
                  <span
                    className={cn(
                      "w-4 text-right font-mono text-xs tabular-nums",
                      i < 3 ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {i + 1}
                  </span>
                  <StudentAvatar name={s.name} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{s.name}</span>
                    <span className="mt-1 block h-1 overflow-hidden rounded-full bg-muted">
                      <span
                        className="block h-full rounded-full bg-chart-1"
                        style={{ width: `${(s[metric] / top) * 100}%` }}
                      />
                    </span>
                  </span>
                  <span className="text-sm font-medium tabular-nums">{s[metric]}%</span>
                </button>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
      {students.length > 5 && (
        <CardFooter>
          <Button variant="outline" size="sm" className="w-full" onClick={() => setSize(size === 5 ? 10 : 5)}>
            {size === 5 ? "Show top 10" : "Show top 5"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
