import { useState } from "react";
import { cn } from "@/lib/utils";
import type { ReasonGroup } from "@/data/process";

export function ReasonCatalog({ groups }: { groups: ReasonGroup[] }) {
  const flat = groups.flatMap((g) => g.items);
  const [selected, setSelected] = useState(flat[0]!);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-14">
      <div className={cn("grid gap-4", groups.length > 1 && "sm:grid-cols-2")}>
        {groups.map((group) => (
          <div key={group.title} className="rounded-xl border border-border bg-surface p-5 shadow-card">
            <h3 className="text-sm font-semibold text-foreground">{group.title}</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => setSelected(item)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors",
                    selected.title === item.title
                      ? "border-primary/50 bg-accent text-primary"
                      : "border-border bg-secondary text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.title}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <aside className="rounded-xl border border-border bg-surface p-6 shadow-card lg:sticky lg:top-10 lg:self-start">
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Critério de tratamento
        </span>
        <h2 className="mt-3 text-lg font-semibold leading-snug tracking-[-0.01em] text-foreground">
          {selected.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{selected.text}</p>
      </aside>
    </div>
  );
}
