import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const initials = (name) =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

export default function StudentAvatar({ name, className }) {
  return (
    <Avatar className={cn("size-8", className)}>
      <AvatarFallback className="bg-secondary text-[11px] font-medium text-secondary-foreground">
        {initials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
