import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

// Small segmented control (wraps shadcn ToggleGroup). Always keeps one value selected.
export default function Toggle({ options, value, onChange }) {
  return (
    <ToggleGroup
      type="single"
      size="sm"
      value={value}
      onValueChange={(v) => v && onChange(v)}
      className="h-8 gap-0 rounded-lg bg-muted p-[3px]"
    >
      {options.map((o) => (
        <ToggleGroupItem
          key={o.value}
          value={o.value}
          className="h-full rounded-md px-2.5 text-xs text-muted-foreground hover:bg-transparent hover:text-foreground data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm"
        >
          {o.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
