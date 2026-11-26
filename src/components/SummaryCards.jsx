import { Users, CalendarCheck, GraduationCap, ClipboardCheck, TriangleAlert } from "lucide-react";
import SummaryCard from "./SummaryCard";
import { ATTENDANCE_THRESHOLD, MARKS_THRESHOLD } from "../utils/analytics";

export default function SummaryCards({ summary }) {
  const riskPct = summary.total ? Math.round((summary.atRisk / summary.total) * 100) : 0;
  const attOk = summary.avgAttendance >= ATTENDANCE_THRESHOLD;
  const marksOk = summary.avgMarks >= MARKS_THRESHOLD;
  const empty = summary.total === 0;

  return (
    <section className="grid grid-cols-2 gap-4 lg:grid-cols-5">
      <SummaryCard label="Students" value={summary.total} icon={Users} hint="in current view" />
      <SummaryCard
        label="Attendance"
        value={summary.avgAttendance}
        suffix="%"
        icon={CalendarCheck}
        tone={empty ? "default" : attOk ? "good" : "bad"}
        hint={empty ? "no students" : `${attOk ? "Above" : "Below"} the ${ATTENDANCE_THRESHOLD}% requirement`}
      />
      <SummaryCard
        label="Average marks"
        value={summary.avgMarks}
        suffix="%"
        icon={GraduationCap}
        tone={empty ? "default" : marksOk ? "good" : "bad"}
        hint={`Pass mark is ${MARKS_THRESHOLD}%`}
      />
      <SummaryCard
        label="Assignments"
        value={summary.avgAssignments}
        suffix="%"
        icon={ClipboardCheck}
        hint="average completion"
      />
      <SummaryCard
        label="At risk"
        value={summary.atRisk}
        icon={TriangleAlert}
        tone={summary.atRisk > 0 ? "bad" : "good"}
        hint={`${riskPct}% of students shown`}
      />
    </section>
  );
}
