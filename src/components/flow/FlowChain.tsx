import type { ProcessNode, SacProcess } from "@/data/process";
import { BranchSplit, Connector } from "@/components/flow/Connector";
import { BranchCard, NodeCard } from "@/components/flow/NodeCard";

/**
 * Percorre o grafo do processo a partir de `nodeId`, renderizando cada nó em
 * sequência. Quando encontra uma decisão, renderiza os dois ramos lado a
 * lado — cada um seguindo seu próprio caminho recursivamente — sem exigir
 * que os caminhos se reencontrem depois (na maioria dos fluxos do Sac, cada
 * ramo termina em uma finalização própria).
 */
export function FlowChain({
  process,
  nodeId,
  activeId,
  onSelect,
}: {
  process: SacProcess;
  nodeId: string;
  activeId: string;
  onSelect: (node: ProcessNode) => void;
}) {
  const node = process.nodes[nodeId];
  if (!node) return null;

  return (
    <div className="flex w-full flex-col items-center">
      <NodeCard node={node} active={node.id === activeId} onSelect={() => onSelect(node)} />

      {node.branches ? (
        <div className="w-full max-w-2xl">
          <BranchSplit />
          <div className="grid gap-4 sm:grid-cols-2">
            {node.branches.map((branch, i) => (
              <div key={branch.label} className="flex flex-col items-center gap-3">
                <BranchCard
                  label={branch.label}
                  condition={branch.label === "SIM" ? "Canhoto localizado" : "Canhoto não localizado"}
                  outcome={branch.outcome}
                  tone={i === 0 ? "primary" : "alt"}
                />
                <FlowChain process={process} nodeId={branch.next} activeId={activeId} onSelect={onSelect} />
              </div>
            ))}
          </div>
        </div>
      ) : node.next ? (
        <>
          <Connector />
          <FlowChain process={process} nodeId={node.next} activeId={activeId} onSelect={onSelect} />
        </>
      ) : null}
    </div>
  );
}
