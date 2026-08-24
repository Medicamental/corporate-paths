import type { ProcessNode, SacProcess } from "@/data/process";
import { processMeta } from "@/data/process";

export function DetailPanel({
  node,
  process,
  onNavigate,
}: {
  node: ProcessNode;
  process: SacProcess;
  onNavigate: (node: ProcessNode) => void;
}) {
  return (
    <aside className="rounded-xl border border-border bg-surface p-6 shadow-card">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Detalhe da etapa
        </span>
        <span className="rounded-md border border-border bg-secondary px-1.5 py-0.5 text-[11px] font-semibold tabular-nums text-muted-foreground">
          {node.code}
        </span>
      </div>

      <h2 className="mt-4 text-xl font-semibold leading-snug tracking-[-0.015em] text-foreground">
        {node.title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{node.summary}</p>

      <dl className="mt-6 space-y-3.5 border-t border-border pt-5 text-sm">
        <div>
          <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Responsável
          </dt>
          <dd className="mt-1 text-foreground">{node.owner}</dd>
        </div>
        <div>
          <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Prazo
          </dt>
          <dd className="mt-1 text-foreground">{node.sla}</dd>
        </div>
        {node.inputs?.length ? (
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Documentos
            </dt>
            <dd className="mt-1.5 space-y-1.5">
              {node.inputs.map((item) => (
                <p key={item} className="flex gap-2 text-foreground/85">
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-line" />
                  {item}
                </p>
              ))}
            </dd>
          </div>
        ) : null}
        {node.branches?.length ? (
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Caminhos possíveis
            </dt>
            <dd className="mt-1.5 space-y-2">
              {node.branches.map((branch) => {
                const target = process.nodes[branch.next];
                return (
                  <button
                    key={branch.label}
                    type="button"
                    onClick={() => target && onNavigate(target)}
                    className="block w-full rounded-lg border border-border bg-secondary/50 px-3 py-2 text-left transition-colors hover:border-primary/40 hover:bg-secondary"
                  >
                    <span className="font-semibold text-foreground">{branch.label}</span>
                    <span className="text-foreground/70"> · {branch.outcome}</span>
                  </button>
                );
              })}
            </dd>
          </div>
        ) : null}
        {node.next && process.nodes[node.next] ? (
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Próxima etapa
            </dt>
            <dd className="mt-1.5">
              <button
                type="button"
                onClick={() => onNavigate(process.nodes[node.next!]!)}
                className="block w-full rounded-lg border border-border bg-secondary/50 px-3 py-2 text-left transition-colors hover:border-primary/40 hover:bg-secondary"
              >
                <span className="font-medium text-foreground">{process.nodes[node.next!]!.title}</span>
              </button>
            </dd>
          </div>
        ) : null}
      </dl>

      {node.sideNote ? (
        <p className="mt-6 rounded-lg border border-dashed border-decision/45 bg-decision-soft px-4 py-3 text-[13px] leading-relaxed text-foreground/85">
          <span className="mr-1 font-semibold text-decision">Atenção —</span>
          {node.sideNote}
        </p>
      ) : null}

      {node.notes ? (
        <p className="mt-6 rounded-lg border border-border bg-secondary/70 px-4 py-3 text-[13px] leading-relaxed text-muted-foreground">
          {node.notes}
        </p>
      ) : null}

      <p className="mt-6 text-[11px] leading-relaxed text-muted-foreground">
        Processo {processMeta.version} · Mantido por {processMeta.owner}
      </p>
    </aside>
  );
}
