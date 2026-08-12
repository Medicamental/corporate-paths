import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { processes, type ProcessNode } from "@/data/process";
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
          "Central de consulta e direcionamento dos fluxos de atendimento do Sac Medicamental: devoluções, recusas, canhoto e motivos de devolução.",
      },
      { property: "og:title", content: "Processos do SAC" },
      {
        property: "og:description",
        content: "Mapa visual dos fluxos de atendimento do Sac, com etapas, decisões e responsáveis.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [view, setView] = useState<"flow" | "catalog">("flow");
  const [processId, setProcessId] = useState(processes[0]!.id);
  const process = useMemo(
    () => processes.find((p) => p.id === processId) ?? processes[0]!,
    [processId],
  );
  const [activeId, setActiveId] = useState(process.startId);

  function selectProcess(id: string) {
    const next = processes.find((p) => p.id === id);
    if (!next) return;
    setProcessId(id);
    setActiveId(next.startId);
    setView("flow");
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
    <div className="flex h-screen flex-col bg-background">
      <header className="flex h-14 flex-none items-center justify-between border-b border-border bg-surface px-6">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-[11px] font-bold text-primary-foreground">
            M
          </span>
          <div className="leading-tight">
            <h1 className="text-[13.5px] font-semibold text-foreground">Processos do SAC</h1>
            <p className="text-[11px] text-muted-foreground">
              Central de consulta e direcionamento dos fluxos de atendimento
            </p>
          </div>
        </div>
        <span className="rounded-full border border-border bg-secondary px-2.5 py-1 text-[10.5px] text-muted-foreground">
          Uso interno · Medicamental
        </span>
      </header>

      <div className="flex min-h-0 flex-1">
        <ProcessSidebar
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
            {view === "catalog" ? (
              <span className="font-semibold text-foreground">Motivos de devolução</span>
            ) : (
              <>
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
                <section aria-label="Fluxo do processo" className="flex flex-col items-center">
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
