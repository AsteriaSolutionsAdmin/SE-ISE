// Pure helper functions: every statistic is derived from the JSON data.

export const ATTENDANCE_THRESHOLD = 75;
export const MARKS_THRESHOLD = 40;

const round1 = (n) => Math.round(n * 10) / 10;

// Average of all subject marks of one student (reduce)
export function averageMarks(student) {
  const values = Object.values(student.marks);
  return round1(values.reduce((sum, m) => sum + m, 0) / values.length);
}

export function assignmentPercent(student) {
  const { completed, total } = student.assignments;
  return Math.round((completed / total) * 100);
}

// Returns the list of reasons a student is at risk (empty array = safe)
export function riskReasons(student) {
  const reasons = [];
  if (student.attendance < ATTENDANCE_THRESHOLD) reasons.push(`Attendance below ${ATTENDANCE_THRESHOLD}%`);
  if (averageMarks(student) < MARKS_THRESHOLD) reasons.push(`Marks below ${MARKS_THRESHOLD}%`);
  return reasons;
}

export const isAtRisk = (student) => riskReasons(student).length > 0;

export function grade(avg) {
  if (avg >= 85) return "A+";
  if (avg >= 75) return "A";
  if (avg >= 60) return "B";
  if (avg >= 50) return "C";
  if (avg >= 40) return "D";
  return "F";
}

// Adds derived fields once so components don't recompute them
export function enrich(students) {
  return students.map((s) => ({
    ...s,
    avgMarks: averageMarks(s),
    assignmentPct: assignmentPercent(s),
    atRisk: isAtRisk(s),
    risks: riskReasons(s),
  }));
}

export function summarize(students) {
  const n = students.length;
  if (n === 0) return { total: 0, avgAttendance: 0, avgMarks: 0, atRisk: 0, avgAssignments: 0 };
  const totals = students.reduce(
    (acc, s) => {
      acc.attendance += s.attendance;
      acc.marks += s.avgMarks;
      acc.assignments += s.assignmentPct;
      if (s.atRisk) acc.atRisk += 1;
      return acc;
    },
    { attendance: 0, marks: 0, assignments: 0, atRisk: 0 }
  );
  return {
    total: n,
    avgAttendance: round1(totals.attendance / n),
    avgMarks: round1(totals.marks / n),
    avgAssignments: round1(totals.assignments / n),
    atRisk: totals.atRisk,
  };
}

export const unique = (arr) => [...new Set(arr)].sort();

export const subjectsOf = (students) =>
  students.length ? Object.keys(students[0].marks) : [];

// Bar chart: average mark per subject
export function subjectAverages(students) {
  return subjectsOf(students).map((subject) => ({
    subject,
    average: students.length
      ? round1(students.reduce((sum, s) => sum + s.marks[subject], 0) / students.length)
      : 0,
  }));
}

// Pie chart: counts per key (e.g. grade or status)
export function countBy(students, keyFn) {
  const counts = students.reduce((acc, s) => {
    const k = keyFn(s);
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

// Line chart: per-class averages
export function classTrend(students) {
  return unique(students.map((s) => s.class)).map((cls) => {
    const group = students.filter((s) => s.class === cls);
    const sum = summarize(group);
    return {
      class: cls,
      attendance: sum.avgAttendance,
      marks: sum.avgMarks,
      assignments: sum.avgAssignments,
    };
  });
}
