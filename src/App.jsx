import { useEffect, useMemo, useState } from "react";
import { Database, GraduationCap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import ThemeToggle from "./components/ThemeToggle";
import { enrich, summarize, unique } from "./utils/analytics";
import SummaryCards from "./components/SummaryCards";
import Filters from "./components/Filters";
import StudentTable from "./components/StudentTable";
import StudentDetails from "./components/StudentDetails";
import Charts from "./components/Charts";
import Leaderboard from "./components/Leaderboard";

const INITIAL_FILTERS = { search: "", cls: "All", status: "All", risk: "All" };

export default function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [sort, setSort] = useState({ key: "id", dir: "asc" });
  const [selected, setSelected] = useState(null);

  // Load the predefined JSON dataset once on mount
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}students.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setStudents(enrich(data)))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const classes = useMemo(() => unique(students.map((s) => s.class)), [students]);
  const statuses = useMemo(() => unique(students.map((s) => s.status)), [students]);

  // Search + filter (filter) then sort (sort)
  const visible = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    const filtered = students.filter(
      (s) =>
        (!q || s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q)) &&
        (filters.cls === "All" || s.class === filters.cls) &&
        (filters.status === "All" || s.status === filters.status) &&
        (filters.risk === "All" || (filters.risk === "At Risk" ? s.atRisk : !s.atRisk))
    );
    const { key, dir } = sort;
    return [...filtered].sort((a, b) => {
      const x = a[key];
      const y = b[key];
      const cmp = typeof x === "number" ? x - y : String(x).localeCompare(String(y));
      return dir === "asc" ? cmp : -cmp;
    });
  }, [students, filters, sort]);

  const summary = useMemo(() => summarize(visible), [visible]);

  const handleSort = (key) =>
    setSort((prev) => ({
      key,
      dir: prev.key === key && prev.dir === "asc" ? "desc" : "asc",
    }));

  if (loading) return <LoadingState />;
  if (error)
    return (
      <div className="grid min-h-svh place-items-center p-6 text-sm text-destructive">
        Could not load dataset: {error}
      </div>
    );

  return (
    <div className="min-h-svh">
      <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-6">
          <div className="grid size-7 place-items-center rounded-md bg-primary text-primary-foreground">
            <GraduationCap className="size-4" />
          </div>
          <span className="font-semibold tracking-tight">Smart Campus</span>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm text-muted-foreground">Analytics</span>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-xs text-muted-foreground sm:inline-flex">
              <Database className="size-3" /> students.json
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Attendance, performance and assignment insights across {classes.length} classes.
          </p>
        </div>

        <Filters
          filters={filters}
          classes={classes}
          statuses={statuses}
          onChange={(field, value) => setFilters((f) => ({ ...f, [field]: value }))}
          onReset={() => setFilters(INITIAL_FILTERS)}
          resultCount={visible.length}
          total={students.length}
        />

        <SummaryCards summary={summary} />

        <Charts students={visible} />

        <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
          <StudentTable
            students={visible}
            sort={sort}
            onSort={handleSort}
            selectedId={selected?.id}
            onSelect={setSelected}
          />
          <Leaderboard students={visible} onSelect={setSelected} />
        </div>
      </main>

      <StudentDetails student={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function LoadingState() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-24 sm:px-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className="h-28" />
        ))}
      </div>
      <Skeleton className="h-72" />
    </div>
  );
}
