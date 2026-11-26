import { Mail, TrendingDown, TrendingUp } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import RiskBadge from "./RiskBadge";
import StatusBadge from "./StatusBadge";
import StudentAvatar from "./StudentAvatar";
import ProgressBar from "./ProgressBar";
import { ATTENDANCE_THRESHOLD, MARKS_THRESHOLD, grade } from "../utils/analytics";

function Stat({ label, children, bad }) {
  return (
    <div className="rounded-lg border px-3 py-2.5">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={cn("mt-0.5 text-lg font-semibold tabular-nums", bad && "text-destructive")}>{children}</div>
    </div>
  );
}

// Side sheet with the full profile of one student.
// The Sheet (Radix Dialog) handles Esc, outside click and focus trapping.
export default function StudentDetails({ student, onClose }) {
  const open = Boolean(student);

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full gap-0 overflow-y-auto p-0 sm:max-w-md">
        {student && <Profile student={student} />}
      </SheetContent>
    </Sheet>
  );
}

function Profile({ student }) {
  const subjects = Object.entries(student.marks);
  const best = subjects.reduce((a, b) => (b[1] > a[1] ? b : a));
  const weakest = subjects.reduce((a, b) => (b[1] < a[1] ? b : a));

  return (
    <>
      <SheetHeader className="gap-3 p-6">
        <div className="flex items-center gap-3">
          <StudentAvatar name={student.name} className="size-11" />
          <div className="min-w-0">
            <SheetTitle className="text-lg">{student.name}</SheetTitle>
            <SheetDescription className="font-mono text-xs">
              {student.id} · {student.class}
            </SheetDescription>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <StatusBadge status={student.status} />
          <RiskBadge atRisk={student.atRisk} />
          <a
            href={`mailto:${student.email}`}
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <Mail className="size-3.5" />
            {student.email}
          </a>
        </div>
      </SheetHeader>

      <Separator />

      <div className="space-y-6 p-6">
        <div className="grid grid-cols-3 gap-2">
          <Stat label="Attendance" bad={student.attendance < ATTENDANCE_THRESHOLD}>
            {student.attendance}%
          </Stat>
          <Stat label="Average" bad={student.avgMarks < MARKS_THRESHOLD}>
            {student.avgMarks}%
          </Stat>
          <Stat label="Grade">{grade(student.avgMarks)}</Stat>
        </div>

        {student.atRisk && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm">
            <p className="font-medium text-destructive">Needs attention</p>
            <ul className="mt-1 list-disc space-y-0.5 pl-5 text-muted-foreground">
              {student.risks.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
        )}

        <section>
          <h3 className="mb-3 text-sm font-medium">Subject marks</h3>
          <div className="space-y-3">
            {subjects.map(([subject, mark]) => (
              <div key={subject} className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1.5 text-sm">
                <span className="text-muted-foreground">{subject}</span>
                <span className={cn("font-medium tabular-nums", mark < MARKS_THRESHOLD && "text-destructive")}>
                  {mark}
                </span>
                <ProgressBar value={mark} threshold={MARKS_THRESHOLD} className="col-span-2" />
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-start gap-2 rounded-lg bg-muted/60 p-3">
              <TrendingUp className="mt-0.5 size-4 text-success" />
              <div>
                <div className="text-xs text-muted-foreground">Strongest</div>
                <div className="font-medium">
                  {best[0]} <span className="text-muted-foreground tabular-nums">{best[1]}</span>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2 rounded-lg bg-muted/60 p-3">
              <TrendingDown className="mt-0.5 size-4 text-destructive" />
              <div>
                <div className="text-xs text-muted-foreground">Needs work</div>
                <div className="font-medium">
                  {weakest[0]} <span className="text-muted-foreground tabular-nums">{weakest[1]}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-2 flex items-baseline justify-between text-sm">
            <h3 className="font-medium">Assignments</h3>
            <span className="text-muted-foreground tabular-nums">
              {student.assignments.completed} of {student.assignments.total} · {student.assignmentPct}%
            </span>
          </div>
          <ProgressBar value={student.assignmentPct} threshold={50} className="h-2" />
        </section>
      </div>
    </>
  );
}
