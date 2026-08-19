import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { processesByVariant, variantLabel, type ProcessNode, type Variant } from "@/data/process";
import { FlowChain } from "@/components/flow/FlowChain";
import { DetailPanel } from "@/components/flow/DetailPanel";
import { ProcessSidebar } from "@/components/flow/ProcessSidebar";
import { ReasonCatalog } from "@/components/flow/ReasonCatalog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Processos do SAC | Medicamental" },
      {
        name: "description",
        content:
          "Fluxos ATUAIS exercidos pelo Sac Medicamental: devoluções, recusas, canhoto e motivos de devolução — central de consulta e direcionamento dos atendimentos.",
      },
      { property: "og:title", content: "Processos do SAC — Fluxos atuais" },
      {
        property: "og:description",
        content: "Mapa visual dos fluxos ATUAIS de atendimento do Sac, com etapas, decisões e responsáveis.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [view, setView] = useState<"flow" | "catalog">("flow");
  const [variant, setVariant] = useState<Variant>("atual");
  const processes = processesByVariant[variant];
  const [processId, setProcessId] = useState(processes[0]!.id);
  const process = useMemo(
    () => processes.find((p) => p.id === processId) ?? processes[0]!,
    [processes, processId],
  );
  const [activeId, setActiveId] = useState(process.startId);

  function selectProcess(id: string) {
    const next = processes.find((p) => p.id === id);
    if (!next) return;
    setProcessId(id);
    setActiveId(next.startId);
    setView("flow");
  }

  function selectVariant(next: Variant) {
    setVariant(next);
    const nextProcesses = processesByVariant[next];
    const stillExists = nextProcesses.find((p) => p.id === processId);
    setActiveId((stillExists ?? nextProcesses[0]!).startId);
  }

  function selectSearchHit(pId: string, nodeId: string) {
    setProcessId(pId);
    setActiveId(nodeId);
    setView("flow");
  }

  function selectNode(node: ProcessNode) {
    setActiveId(node.id);
  }

  const activeNode = process.nodes[activeId] ?? process.nodes[process.startId]!;

  return (
    <div
      className="dark flex h-screen flex-col bg-background"
      style={{
        backgroundImage: "linear-gradient(150deg, #020617 0%, #0a1f3d 48%, #000000 100%)",
      }}
    >
      <header className="flex h-16 flex-none items-center justify-between border-b border-border bg-surface px-6">
        <div className="flex items-center gap-3">
          <img src="/logo-medicamental.png" alt="Medicamental" className="h-9 w-auto" />
          <div className="leading-tight">
            <h1 className="text-[13.5px] font-semibold text-foreground">Processos do SAC</h1>
            <p className="text-[11px] text-muted-foreground">
              Fluxos atuais exercidos pelo Sac · central de consulta e direcionamento dos atendimentos
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-0.5 rounded-full border border-border bg-secondary p-0.5">
            {(["atual", "reformulado"] as Variant[]).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => selectVariant(v)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-[11.5px] font-medium transition-colors",
                  variant === v
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {variantLabel[v]}
              </button>
            ))}
          </div>
          <span className="rounded-full border border-border bg-secondary px-2.5 py-1 text-[10.5px] text-muted-foreground">
            Uso interno · Medicamental
          </span>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <ProcessSidebar
          processes={processes}
          activeProcessId={processId}
          view={view}
          onSelectProcess={selectProcess}
          onSelectCatalog={() => setView("catalog")}
          onSelectSearchHit={selectSearchHit}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="flex items-center gap-1.5 border-b border-border px-8 py-3.5 text-[12.5px] text-muted-foreground">
            <span className="font-medium text-foreground/80">Processos do SAC</span>
            <span className="opacity-60">/</span>
            <span>{variantLabel[variant]}</span>
            {view === "catalog" ? (
              <>
                <span className="opacity-60">/</span>
                <span className="font-semibold text-foreground">Motivos de devolução</span>
              </>
            ) : (
              <>
                <span className="opacity-60">/</span>
                <span>{process.title}</span>
                <span className="opacity-60">/</span>
                <span className="font-semibold text-foreground">Fluxo principal</span>
              </>
            )}
          </div>

          <div className="px-8 py-10">
            {view === "catalog" ? (
              <ReasonCatalog />
            ) : (
              <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-14">
                <section aria-label="Fluxo do processo" className="flex w-full flex-col items-center">
                  {variant === "reformulado" && process.changeNote ? (
                    <div className="mb-8 w-full max-w-2xl rounded-xl border border-redirect/35 bg-redirect-soft px-5 py-4">
                      <span className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-redirect">
                        O que mudou neste fluxo
                      </span>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-foreground/85">
                        {process.changeNote}
                      </p>
                    </div>
                  ) : null}
                  <FlowChain
                    process={process}
                    nodeId={process.startId}
                    activeId={activeId}
                    onSelect={selectNode}
                  />
                </section>

                <div className="lg:sticky lg:top-10 lg:self-start">
                  <DetailPanel process={process} node={activeNode} onNavigate={selectNode} />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
