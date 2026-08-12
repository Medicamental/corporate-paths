export type NodeKind = "start" | "step" | "decision" | "end";

export type Branch = {
  label: string;
  condition: string;
  outcome: string;
};

export type ProcessNode = {
  id: string;
  code: string;
  kind: NodeKind;
  title: string;
  summary: string;
  owner: string;
  sla: string;
  inputs?: string[];
  notes?: string;
  branches?: Branch[];
};

export const processMeta = {
  name: "Solicitação de Compras",
  area: "Suprimentos · Financeiro",
  version: "v2.4",
  updatedAt: "Agosto de 2026",
  owner: "Diretoria de Operações",
};

export const processNodes: ProcessNode[] = [
  {
    id: "inicio",
    code: "01",
    kind: "start",
    title: "Início · Necessidade identificada",
    summary:
      "A área requisitante identifica a necessidade de compra de um produto ou serviço.",
    owner: "Área requisitante",
    sla: "—",
    inputs: ["Justificativa da necessidade", "Centro de custo"],
    notes: "Toda compra começa obrigatoriamente por este passo. Não há exceções.",
  },
  {
    id: "solicitacao",
    code: "02",
    kind: "step",
    title: "Abertura da solicitação",
    summary:
      "Preenchimento da requisição no portal interno, com escopo, quantidade e prazo desejado.",
    owner: "Solicitante",
    sla: "Até 1 dia útil",
    inputs: ["Requisição preenchida", "Especificação técnica"],
  },
  {
    id: "triagem",
    code: "03",
    kind: "step",
    title: "Triagem de Suprimentos",
    summary:
      "Suprimentos confere se a solicitação está completa e classifica a categoria de compra.",
    owner: "Suprimentos",
    sla: "2 dias úteis",
    notes: "Solicitações incompletas retornam ao solicitante com apontamentos.",
  },
  {
    id: "decisao-valor",
    code: "04",
    kind: "decision",
    title: "O valor estimado é superior a R$ 50.000?",
    summary:
      "O valor define o nível de aprovação necessário e a exigência de concorrência entre fornecedores.",
    owner: "Suprimentos",
    sla: "1 dia útil",
    branches: [
      {
        label: "Sim",
        condition: "Acima de R$ 50.000",
        outcome: "Segue para cotação com três fornecedores e aprovação da Diretoria.",
      },
      {
        label: "Não",
        condition: "Até R$ 50.000",
        outcome: "Segue com cotação simplificada e aprovação do gestor da área.",
      },
    ],
  },
  {
    id: "cotacao",
    code: "05",
    kind: "step",
    title: "Cotação e análise comercial",
    summary:
      "Coleta de propostas, comparação técnica e comercial e recomendação do fornecedor.",
    owner: "Suprimentos",
    sla: "5 dias úteis",
    inputs: ["Mapa comparativo", "Propostas assinadas"],
  },
  {
    id: "decisao-aprovacao",
    code: "06",
    kind: "decision",
    title: "A compra foi aprovada?",
    summary:
      "Aprovação formal registrada no portal pelo nível de alçada definido na etapa 04.",
    owner: "Gestor ou Diretoria",
    sla: "3 dias úteis",
    branches: [
      {
        label: "Aprovado",
        condition: "Alçada confirma o gasto",
        outcome: "Pedido de compra é emitido ao fornecedor selecionado.",
      },
      {
        label: "Reprovado",
        condition: "Escopo ou valor rejeitado",
        outcome: "Retorna à etapa 02 com ajustes ou o processo é encerrado.",
      },
    ],
  },
  {
    id: "pedido",
    code: "07",
    kind: "step",
    title: "Emissão do pedido de compra",
    summary:
      "Formalização contratual, envio do pedido ao fornecedor e registro no ERP.",
    owner: "Suprimentos",
    sla: "2 dias úteis",
    inputs: ["Pedido de compra", "Contrato ou proposta aceita"],
  },
  {
    id: "recebimento",
    code: "08",
    kind: "step",
    title: "Recebimento e conferência",
    summary:
      "Conferência de quantidade, qualidade e nota fiscal antes da liberação do pagamento.",
    owner: "Área requisitante · Fiscal",
    sla: "3 dias úteis",
    notes: "Divergências bloqueiam o pagamento até tratativa com o fornecedor.",
  },
  {
    id: "fim",
    code: "09",
    kind: "end",
    title: "Fim · Pagamento liberado",
    summary:
      "Financeiro efetua o pagamento conforme condições acordadas e arquiva o processo.",
    owner: "Financeiro",
    sla: "Conforme contrato",
    notes: "Processo encerrado e disponível para auditoria por 5 anos.",
  },
];
