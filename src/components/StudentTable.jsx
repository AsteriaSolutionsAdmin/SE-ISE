import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import RiskBadge from "./RiskBadge";
import StatusBadge from "./StatusBadge";
import StudentAvatar from "./StudentAvatar";
import ProgressBar from "./ProgressBar";
import { ATTENDANCE_THRESHOLD, MARKS_THRESHOLD } from "../utils/analytics";

const COLUMNS = [
  { key: "name", label: "Student" },
  { key: "class", label: "Class" },
  { key: "attendance", label: "Attendance", numeric: true },
  { key: "avgMarks", label: "Avg marks", numeric: true },
  { key: "assignmentPct", label: "Assignments", numeric: true },
  { key: "status", label: "Status" },
  { key: "atRisk", label: "Risk" },
];

function SortHeader({ column, sort, onSort }) {
  const active = sort.key === column.key;
  const Icon = !active ? ChevronsUpDown : sort.dir === "asc" ? ArrowUp : ArrowDown;
  return (
    <TableHead className={cn("h-9", column.key === "name" && "pl-6")}>
      <button
        type="button"
        onClick={() => onSort(column.key)}
        className={cn(
          "-ml-1.5 inline-flex items-center gap-1 rounded px-1.5 py-1 text-xs font-medium hover:bg-accent",
          active ? "text-foreground" : "text-muted-foreground"
        )}
      >
        {column.label}
        <Icon className={cn("size-3.5", !active && "opacity-50")} />
      </button>
    </TableHead>
  );
}

function Metric({ value, threshold }) {
  const low = value < threshold;
  return (
    <div className="flex w-24 items-center gap-2">
      <span className={cn("w-10 text-right tabular-nums", low && "font-medium text-destructive")}>{value}%</span>
      <ProgressBar value={value} threshold={threshold} className="h-1 flex-1" />
    </div>
  );
}

export default function StudentTable({ students, sort, onSort, selectedId, onSelect }) {
  return (
    <Card className="gap-0 overflow-hidden py-0 shadow-none">
      <CardHeader className="border-b py-4">
        <CardTitle className="text-base">Student records</CardTitle>
        <CardDescription>Sort by any column. Select a row to open the student's profile.</CardDescription>
      </CardHeader>
      <div className="max-h-[560px] overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-card shadow-[inset_0_-1px_0_var(--border)]">
            <TableRow className="hover:bg-transparent">
              {COLUMNS.map((c) => (
                <SortHeader key={c.key} column={c} sort={sort} onSort={onSort} />
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={COLUMNS.length} className="h-32 text-center text-muted-foreground">
                  No students match the current filters.
                </TableCell>
              </TableRow>
            ) : (
              students.map((s) => (
                <TableRow
                  key={s.id}
                  onClick={() => onSelect(s)}
                  data-state={selectedId === s.id ? "selected" : undefined}
                  className="cursor-pointer"
                >
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-3">
                      <StudentAvatar name={s.name} />
                      <div className="leading-tight">
                        <div className="font-medium">{s.name}</div>
                        <div className="font-mono text-xs text-muted-foreground">{s.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{s.class}</TableCell>
                  <TableCell>
                    <Metric value={s.attendance} threshold={ATTENDANCE_THRESHOLD} />
                  </TableCell>
                  <TableCell>
                    <Metric value={s.avgMarks} threshold={MARKS_THRESHOLD} />
                  </TableCell>
                  <TableCell className="tabular-nums text-muted-foreground">
                    {s.assignments.completed}/{s.assignments.total}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={s.status} />
                  </TableCell>
                  <TableCell className="pr-6">
                    <RiskBadge atRisk={s.atRisk} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
