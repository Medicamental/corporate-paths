import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { reasonGroups, type SacProcess } from "@/data/process";

type SearchHit = { processId: string; nodeId: string; title: string; processTitle: string };

export function ProcessSidebar({
  processes,
  activeProcessId,
  view,
  onSelectProcess,
  onSelectCatalog,
  onSelectSearchHit,
}: {
  processes: SacProcess[];
  activeProcessId: string;
  view: "flow" | "catalog";
  onSelectProcess: (id: string) => void;
  onSelectCatalog: () => void;
  onSelectSearchHit: (processId: string, nodeId: string) => void;
}) {
  const [query, setQuery] = useState("");
  const totalReasons = reasonGroups.reduce((a, g) => a + g.items.length, 0);

  const searchIndex = useMemo<SearchHit[]>(
    () =>
      processes.flatMap((p) =>
        Object.values(p.nodes).map((n) => ({
          processId: p.id,
          nodeId: n.id,
          title: n.title,
          processTitle: p.title,
        })),
      ),
    [processes],
  );

  const results =
    query.trim().length >= 2
      ? searchIndex
          .filter(
            (hit) =>
              hit.title.toLowerCase().includes(query.toLowerCase()) ||
              hit.processTitle.toLowerCase().includes(query.toLowerCase()),
          )
          .slice(0, 8)
      : [];

  return (
    <aside className="flex w-64 flex-none flex-col border-r border-border bg-surface">
      <div className="relative p-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar processo ou etapa..."
          className="w-full rounded-md border border-transparent bg-secondary px-3 py-2 text-[12.5px] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:bg-surface focus:ring-2 focus:ring-primary/15"
        />
        {results.length > 0 && (
          <div className="absolute left-3 right-3 top-full z-40 mt-1.5 max-h-72 overflow-y-auto rounded-lg border border-border bg-surface shadow-lift">
            {results.map((hit) => (
              <button
                key={hit.processId + hit.nodeId}
                type="button"
                onClick={() => {
                  onSelectSearchHit(hit.processId, hit.nodeId);
                  setQuery("");
                }}
                className="block w-full border-b border-border/60 px-3 py-2 text-left last:border-none hover:bg-secondary"
              >
                <div className="text-[12.5px] font-medium text-foreground">{hit.title}</div>
                <div className="text-[11px] text-muted-foreground">{hit.processTitle}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="px-4 pb-1.5 pt-3 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
        Fluxos de atendimento
      </div>
      <nav className="flex flex-col gap-0.5 px-2.5">
        {processes.map((p: SacProcess) => (
          <NavItem
            key={p.id}
            active={view === "flow" && activeProcessId === p.id}
            label={p.title}
            count={Object.keys(p.nodes).length}
            onClick={() => onSelectProcess(p.id)}
          />
        ))}
        <NavItem
          active={view === "catalog"}
          label="Motivos de devolução"
          count={totalReasons}
          tone="redirect"
          onClick={onSelectCatalog}
        />
      </nav>

      <div className="mt-auto border-t border-border p-4">
        <div className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
          Legenda
        </div>
        <div className="mt-2.5 flex flex-col gap-2 text-[11.5px] text-muted-foreground">
          <LegendRow dotClass="bg-primary" label="Início" />
          <LegendRow dotClass="bg-line" label="Etapa" />
          <LegendRow dotClass="bg-decision" label="Decisão" />
          <LegendRow dotClass="bg-redirect" label="Direcionamento" />
          <LegendRow dotClass="bg-success" label="Finalização" />
        </div>
      </div>
    </aside>
  );
}

function NavItem({
  active,
  label,
  count,
  onClick,
  tone = "primary",
}: {
  active: boolean;
  label: string;
  count: number;
  onClick: () => void;
  tone?: "primary" | "redirect";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-2.5 rounded-md px-3.5 py-2 text-left text-[12.5px] font-medium transition-colors",
        active ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
      )}
    >
      {active && (
        <span
          className={cn(
            "absolute inset-y-1.5 left-0 w-[3px] rounded-r-full",
            tone === "redirect" ? "bg-redirect" : "bg-primary",
          )}
        />
      )}
      <span
        className={cn(
          "h-1.5 w-1.5 flex-none rounded-full",
          active ? (tone === "redirect" ? "bg-redirect" : "bg-primary") : "bg-line",
        )}
      />
      <span className="flex-1 truncate">{label}</span>
      <span className="rounded-full border border-border bg-secondary px-1.5 py-0.5 text-[10px] tabular-nums text-muted-foreground">
        {count}
      </span>
    </button>
  );
}

function LegendRow({ dotClass, label }: { dotClass: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={cn("h-2 w-2 flex-none rounded-full", dotClass)} />
      {label}
    </div>
  );
}
