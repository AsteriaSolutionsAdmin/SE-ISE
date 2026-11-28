import { Search, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const INITIAL = { search: "", cls: "All", status: "All", risk: "All" };

export default function Filters({ filters, classes, statuses, onChange, onReset, resultCount, total }) {
  const dirty = Object.keys(INITIAL).some((k) => filters[k] !== INITIAL[k]);

  const select = (field, label, options) => (
    <Select value={filters[field]} onValueChange={(v) => onChange(field, v)}>
      <SelectTrigger size="sm" className="w-[150px] bg-card" aria-label={label}>
        <span className="text-muted-foreground">{label}:</span>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {["All", ...options].map((o) => (
          <SelectItem key={o} value={o}>
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  return (
    <section className="flex flex-wrap items-center gap-2">
      <div className="relative w-full sm:w-72">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search name or ID"
          value={filters.search}
          onChange={(e) => onChange("search", e.target.value)}
          className="h-8 bg-card pl-8"
        />
      </div>
      {select("cls", "Class", classes)}
      {select("status", "Status", statuses)}
      {select("risk", "Risk", ["At Risk", "Safe"])}
      {dirty && (
        <Button variant="ghost" size="sm" onClick={onReset}>
          <RotateCcw /> Reset
        </Button>
      )}
      <span className="ml-auto text-sm text-muted-foreground tabular-nums">
        {resultCount} of {total} students.
      </span>
    </section>
  );
}
