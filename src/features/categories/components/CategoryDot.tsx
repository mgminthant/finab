import type { CategoryOption } from "@/types/category";

export default function CategoryDot({
  color,
  icon,
  name,
}: {
  color?: string | null;
  icon?: string | null;
  name: string;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs leading-none"
        style={{ backgroundColor: color || "hsl(var(--muted-foreground))" }}
        aria-hidden
      >
        {icon || ""}
      </span>
      <span className="truncate">{name}</span>
    </span>
  );
}

export function categoryDotProps(c: CategoryOption) {
  return { color: c.color, icon: c.icon, name: c.name };
}
