import { cn } from "@/lib/utils";
import type { ProcessNode } from "@/data/process";

const kindLabel: Record<ProcessNode["kind"], string> = {
  start: "Início",
  step: "Etapa",
  decision: "Decisão",
  redirect: "Direcionamento",
  end: "Conclusão",
};

export function NodeCard({
  node,
  active,
  onSelect,
}: {
  node: ProcessNode;
  active: boolean;
  onSelect: () => void;
}) {
  const isDecision = node.kind === "decision";
  const isRedirect = node.kind === "redirect";
  const isStriped = node.kind === "start" || node.kind === "end" || isRedirect;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={cn(
        "group relative w-full max-w-xl text-left transition-all duration-200",
        "rounded-xl border bg-surface px-6 py-5 shadow-card",
        "hover:-translate-y-0.5 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        isDecision ? "border-decision/35 bg-decision-soft" : "border-border",
        node.kind === "start" && "border-primary/25",
        node.kind === "end" && "border-success/25",
        isRedirect && "border-redirect/25",
        active && "border-primary/60 shadow-lift",
      )}
    >
      {isStriped ? (
        <span
          className={cn(
            "absolute inset-y-0 left-0 w-[3px] rounded-l-xl",
            node.kind === "start" && "bg-primary",
            node.kind === "end" && "bg-success",
            isRedirect && "bg-redirect",
          )}
        />
      ) : null}

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "flex h-7 min-w-7 items-center justify-center rounded-md border px-1.5 text-[11px] font-semibold tabular-nums",
              isDecision
                ? "border-decision/40 bg-surface text-decision"
                : "border-border bg-secondary text-muted-foreground",
            )}
          >
            {node.code}
          </span>
          <span
            className={cn(
              "text-[11px] font-semibold uppercase tracking-[0.14em]",
              isDecision ? "text-decision" : "text-muted-foreground",
            )}
          >
            {kindLabel[node.kind]}
          </span>
        </div>
        <span className="text-[11px] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
          Ver detalhes
        </span>
      </div>

      <h3
        className={cn(
          "mt-3 text-[17px] font-semibold leading-snug tracking-[-0.01em] text-foreground",
          isDecision && "text-[18px]",
        )}
      >
        {node.title}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{node.summary}</p>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1.5 border-t border-border/70 pt-3 text-[12px] text-muted-foreground">
        <span>
          <span className="text-foreground/70">Responsável:</span> {node.owner}
        </span>
        <span>
          <span className="text-foreground/70">Prazo:</span> {node.sla}
        </span>
      </div>
    </button>
  );
}

export function BranchCard({
  label,
  condition,
  outcome,
  tone,
}: {
  label: string;
  condition: string;
  outcome: string;
  tone: "primary" | "alt";
}) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-surface px-4 py-3.5 shadow-card",
        tone === "primary" ? "border-success/30" : "border-border",
      )}
    >
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.1em]",
            tone === "primary"
              ? "bg-success-soft text-success"
              : "bg-secondary text-muted-foreground",
          )}
        >
          {label}
        </span>
        <span className="text-[12px] text-muted-foreground">{condition}</span>
      </div>
      <p className="mt-2 text-[13px] leading-relaxed text-foreground/80">{outcome}</p>
    </div>
  );
}
