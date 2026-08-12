import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { processMeta, processNodes } from "@/data/process";
import { BranchCard, NodeCard } from "@/components/flow/NodeCard";
import { BranchMerge, BranchSplit, Connector } from "@/components/flow/Connector";
import { DetailPanel } from "@/components/flow/DetailPanel";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fluxo de Solicitação de Compras | Processos Corporativos" },
      {
        name: "description",
        content:
          "Fluxograma corporativo do processo de Solicitação de Compras: etapas, responsáveis, prazos, decisões e critérios de aprovação.",
      },
      { property: "og:title", content: "Fluxo de Solicitação de Compras" },
      {
        property: "og:description",
        content:
          "Mapa visual do processo de compras da empresa, com etapas, decisões, responsáveis e prazos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const legend = [
  { label: "Início e conclusão", className: "bg-primary" },
  { label: "Etapa de execução", className: "bg-line" },
  { label: "Ponto de decisão", className: "bg-decision" },
];

function Index() {
  const [activeId, setActiveId] = useState(processNodes[0].id);
  const activeNode = processNodes.find((n) => n.id === activeId) ?? processNodes[0];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-6 px-6 py-7 lg:px-10">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Processos Corporativos · {processMeta.area}
            </p>
            <h1 className="mt-2 font-display text-3xl leading-tight tracking-[-0.01em] text-foreground sm:text-[2.35rem]">
              {processMeta.name}
            </h1>
          </div>
          <dl className="flex items-center gap-8 text-[12px]">
            <div>
              <dt className="uppercase tracking-[0.14em] text-muted-foreground">Versão</dt>
              <dd className="mt-1 font-medium text-foreground">{processMeta.version}</dd>
            </div>
            <div>
              <dt className="uppercase tracking-[0.14em] text-muted-foreground">Atualizado</dt>
              <dd className="mt-1 font-medium text-foreground">{processMeta.updatedAt}</dd>
            </div>
            <div className="hidden sm:block">
              <dt className="uppercase tracking-[0.14em] text-muted-foreground">Gestor</dt>
              <dd className="mt-1 font-medium text-foreground">{processMeta.owner}</dd>
            </div>
          </dl>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12 lg:px-10">
        <div className="flex flex-wrap items-center gap-x-7 gap-y-3 border-b border-border pb-6">
          {legend.map((item) => (
            <span key={item.label} className="flex items-center gap-2 text-[12px] text-muted-foreground">
              <span className={`h-2 w-2 rounded-full ${item.className}`} />
              {item.label}
            </span>
          ))}
          <span className="ml-auto text-[12px] text-muted-foreground">
            Leitura de cima para baixo · clique em uma etapa para ver os detalhes
          </span>
        </div>

        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-14">
          <section aria-label="Fluxo do processo" className="flex flex-col items-center">
            {processNodes.map((node, index) => {
              const isLast = index === processNodes.length - 1;
              return (
                <div key={node.id} className="flex w-full flex-col items-center">
                  <NodeCard
                    node={node}
                    active={node.id === activeId}
                    onSelect={() => setActiveId(node.id)}
                  />

                  {node.branches ? (
                    <div className="w-full max-w-xl">
                      <BranchSplit />
                      <div className="grid gap-4 sm:grid-cols-2">
                        {node.branches.map((branch, i) => (
                          <BranchCard
                            key={branch.label}
                            label={branch.label}
                            condition={branch.condition}
                            outcome={branch.outcome}
                            tone={i === 0 ? "primary" : "alt"}
                          />
                        ))}
                      </div>
                      {!isLast ? <BranchMerge /> : null}
                    </div>
                  ) : !isLast ? (
                    <Connector />
                  ) : null}
                </div>
              );
            })}
          </section>

          <div className="lg:sticky lg:top-10 lg:self-start">
            <DetailPanel node={activeNode} />
          </div>
        </div>
      </main>

      <footer className="border-t border-border bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-6 text-[12px] text-muted-foreground lg:px-10">
          Documento oficial de processo · Uso interno · Dúvidas: suprimentos@empresa.com
        </div>
      </footer>
    </div>
  );
}
