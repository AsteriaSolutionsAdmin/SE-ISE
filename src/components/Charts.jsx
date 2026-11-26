import { useState } from "react";
import {
  Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ReferenceLine, XAxis, YAxis,
} from "recharts";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent,
} from "@/components/ui/chart";
import Toggle from "./Toggle";
import {
  ATTENDANCE_THRESHOLD, MARKS_THRESHOLD, subjectAverages, countBy, classTrend, grade,
} from "../utils/analytics";

const GRADE_ORDER = ["A+", "A", "B", "C", "D", "F"];
const PALETTE = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)", "var(--muted-foreground)"];
const RISK_COLORS = { Safe: "var(--chart-1)", "At Risk": "var(--destructive)" };

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
const shortSubject = (s) => (s.includes(" ") ? s.split(" ").map((w) => w[0]).join("") : s.slice(0, 4));

const barConfig = { average: { label: "Average", color: "var(--chart-1)" } };
const lineConfig = {
  attendance: { label: "Attendance", color: "var(--chart-1)" },
  marks: { label: "Avg marks", color: "var(--chart-3)" },
  assignments: { label: "Assignments", color: "var(--chart-5)" },
};

function ChartCard({ title, description, action, children, className }) {
  return (
    <Card className={`gap-4 shadow-none ${className ?? ""}`}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        {action && <CardAction>{action}</CardAction>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export default function Charts({ students }) {
  const [pieMode, setPieMode] = useState("risk");
  const [lineMode, setLineMode] = useState("student");

  if (students.length === 0) {
    return (
      <Card className="items-center py-16 text-sm text-muted-foreground shadow-none">
        No data to chart for the current filters.
      </Card>
    );
  }

  const barData = subjectAverages(students);

  let pieRaw;
  if (pieMode === "risk") pieRaw = countBy(students, (s) => (s.atRisk ? "At Risk" : "Safe"));
  else if (pieMode === "grade")
    pieRaw = countBy(students, (s) => grade(s.avgMarks)).sort(
      (a, b) => GRADE_ORDER.indexOf(a.name) - GRADE_ORDER.indexOf(b.name)
    );
  else pieRaw = countBy(students, (s) => s.status);

  // shadcn charts read colours from a config keyed by series name
  const pieConfig = Object.fromEntries(
    pieRaw.map((d, i) => [
      slug(d.name),
      { label: d.name, color: pieMode === "risk" ? RISK_COLORS[d.name] : PALETTE[i % PALETTE.length] },
    ])
  );
  const pieData = pieRaw.map((d) => ({ ...d, key: slug(d.name), fill: `var(--color-${slug(d.name)})` }));

  const lineData =
    lineMode === "student"
      ? [...students]
          .sort((a, b) => a.id.localeCompare(b.id))
          .map((s) => ({
            label: s.id.slice(-3),
            name: s.name,
            attendance: s.attendance,
            marks: s.avgMarks,
            assignments: s.assignmentPct,
          }))
      : classTrend(students).map((c) => ({ ...c, label: c.class }));

  return (
    <div className="grid gap-4 lg:grid-cols-7">
      <ChartCard
        className="lg:col-span-4"
        title="Subject averages"
        description={`Mean score per subject · dashed line is the ${MARKS_THRESHOLD}% pass mark`}
      >
        <ChartContainer config={barConfig} className="aspect-auto h-[240px] w-full">
          <BarChart data={barData} margin={{ left: -20, right: 8 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="subject" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={shortSubject} />
            <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tickMargin={4} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <ReferenceLine y={MARKS_THRESHOLD} stroke="var(--destructive)" strokeDasharray="4 4" strokeOpacity={0.6} />
            <Bar dataKey="average" radius={4} maxBarSize={56}>
              {barData.map((d) => (
                <Cell
                  key={d.subject}
                  fill={d.average < MARKS_THRESHOLD ? "var(--destructive)" : "var(--color-average)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </ChartCard>

      <ChartCard
        className="lg:col-span-3"
        title="Distribution"
        description={`Students by ${pieMode}`}
        action={
          <Toggle
            value={pieMode}
            onChange={setPieMode}
            options={[
              { value: "risk", label: "Risk" },
              { value: "grade", label: "Grade" },
              { value: "status", label: "Status" },
            ]}
          />
        }
      >
        <ChartContainer config={pieConfig} className="mx-auto aspect-auto h-[240px] w-full">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="key" hideLabel />} />
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="key"
              innerRadius={58}
              outerRadius={88}
              strokeWidth={3}
              stroke="var(--card)"
            />
            <ChartLegend
              content={<ChartLegendContent nameKey="key" />}
              itemSorter={(item) => pieData.findIndex((d) => d.key === item.value)}
              className="flex-wrap gap-x-4 gap-y-1"
            />
          </PieChart>
        </ChartContainer>
      </ChartCard>

      <ChartCard
        className="lg:col-span-7"
        title="Attendance vs performance"
        description={`Dashed lines mark the ${ATTENDANCE_THRESHOLD}% attendance and ${MARKS_THRESHOLD}% marks thresholds`}
        action={
          <Toggle
            value={lineMode}
            onChange={setLineMode}
            options={[
              { value: "student", label: "By student" },
              { value: "class", label: "By class" },
            ]}
          />
        }
      >
        <ChartContainer config={lineConfig} className="aspect-auto h-[260px] w-full">
          <LineChart data={lineData} margin={{ left: -20, right: 8, top: 4 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} minTickGap={8} />
            <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tickMargin={4} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(l, p) => (p?.[0]?.payload?.name ? `${p[0].payload.name} · ${l}` : l)}
                />
              }
            />
            <ReferenceLine y={ATTENDANCE_THRESHOLD} stroke="var(--warning)" strokeDasharray="4 4" />
            <ReferenceLine y={MARKS_THRESHOLD} stroke="var(--destructive)" strokeDasharray="4 4" strokeOpacity={0.6} />
            <Line dataKey="attendance" type="monotone" stroke="var(--color-attendance)" strokeWidth={2} dot={false} />
            <Line dataKey="marks" type="monotone" stroke="var(--color-marks)" strokeWidth={2} dot={false} />
            <Line
              dataKey="assignments"
              type="monotone"
              stroke="var(--color-assignments)"
              strokeWidth={1.5}
              strokeDasharray="4 3"
              dot={false}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </LineChart>
        </ChartContainer>
      </ChartCard>
    </div>
  );
}
