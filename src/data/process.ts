/**
 * Dados dos processos do Sac Medicamental — separados da camada visual.
 *
 * Cada processo é um grafo simples: nós ligados por `next` (fluxo principal)
 * ou, no caso de uma decisão, por `branches` (cada ramo aponta para o `next`
 * do seu próprio caminho). Para adicionar um novo processo, inclua um novo
 * objeto em `processes` — a interface se adapta automaticamente.
 *
 * Fonte: "Fluxo atual — Devolução e Portal do Cliente" e
 * "Motivos de Devolução — Sac Medicamental".
 */

export type NodeKind = "start" | "step" | "decision" | "redirect" | "end";

export type Branch = {
  label: string;
  outcome: string;
  next: string;
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
  /** Observação de destaque, sempre visível no fluxo (não só ao clicar no nó) — usada
   * para condições relevantes que não são mais uma decisão no fluxo, como a
   * reativação de título no fluxo reformulado. */
  sideNote?: string;
  branches?: Branch[];
  next?: string;
};

export type SacProcess = {
  id: string;
  title: string;
  entry: string;
  startId: string;
  nodes: Record<string, ProcessNode>;
  /** Só presente na variante "reformulado", quando o processo muda em relação ao atual. */
  changeNote?: string;
};

export type Variant = "atual" | "reformulado";

export const processMeta = {
  name: "Processos do Sac",
  area: "Sac · Medicamental",
  version: "v1.0",
  updatedAt: "Agosto de 2026",
  owner: "Sac Medicamental",
};

function byId(nodes: ProcessNode[]): Record<string, ProcessNode> {
  return Object.fromEntries(nodes.map((n) => [n.id, n]));
}

/**
 * "Atual" = o que é praticado hoje no Sac. "Reformulado" = a nova versão do
 * processo, fruto da reestruturação do Sac, que passará a valer em breve.
 * `Devolução total` e `Devolução parcial` mudam entre as duas variantes —
 * `Recusa no ato da entrega` e `Canhoto` permanecem idênticos (o mesmo objeto
 * é reaproveitado nas duas listas, sem duplicar dados).
 */
export const processesAtual: SacProcess[] = [
  {
    id: "total",
    title: "Devolução total",
    entry: "Sac ou Portal do Cliente",
    startId: "t1",
    nodes: byId([
      {
        id: "t1",
        code: "01",
        kind: "start",
        title: "Abertura da devolução",
        summary: "Cliente ou atendente formaliza a solicitação de devolução total do pedido.",
        owner: "Sac / Portal do Cliente",
        sla: "7 dias",
        notes: "Confirme o número do pedido e o motivo da devolução antes de registrar a abertura.",
        next: "t2",
      },
      {
        id: "t2",
        code: "02",
        kind: "step",
        title: "Emissão do espelho",
        summary:
          "É gerado o espelho da devolução, documento-base para a nota fiscal de devolução (NFD).",
        owner: "Sac / Portal do Cliente",
        sla: "5 dias",
        notes: "Verifique se todos os itens do pedido original constam no espelho gerado.",
        next: "t3",
      },
      {
        id: "t3",
        code: "03",
        kind: "step",
        title: "Anexar a NFD",
        summary: "A nota fiscal de devolução é anexada ao protocolo.",
        owner: "Sac / Portal do Cliente",
        sla: "5 dias",
        inputs: ["Nota Fiscal de Devolução (NFD)"],
        notes:
          "Pelo Sac, o atendente anexa a NFD e dá andamento manualmente. Pelo Portal do Cliente, o cliente anexa a NFD e o andamento é automático.",
        next: "t4",
      },
      {
        id: "t4",
        code: "04",
        kind: "step",
        title: "Análise da NFD e coleta",
        summary: "O setor de devolução confere a NFD e agenda a coleta da mercadoria.",
        owner: "Setor de Devolução",
        sla: "5 dias",
        notes: "Confirme divergências entre a NFD e o pedido original antes de solicitar a coleta.",
        next: "t5",
      },
      {
        id: "t5",
        code: "05",
        kind: "step",
        title: "Sustação de título",
        summary: "O financeiro sustém a cobrança do título vinculado ao pedido em devolução.",
        owner: "Financeiro",
        sla: "5 dias",
        notes: "A sustação deve ocorrer antes do vencimento do título para evitar cobrança indevida.",
        next: "t6",
      },
      {
        id: "t6",
        code: "06",
        kind: "step",
        title: "Coleta",
        summary: "A transportadora realiza a coleta da mercadoria devolvida no endereço do cliente.",
        owner: "Transportadora",
        sla: "15 dias",
        notes: "Acompanhe o prazo de coleta junto à transportadora; atrasos devem ser registrados.",
        next: "t7",
      },
      {
        id: "t7",
        code: "07",
        kind: "decision",
        title: "Canhoto foi localizado durante o processo?",
        summary: "Em qualquer etapa anterior, verifica-se se o canhoto assinado da entrega foi localizado.",
        owner: "Sac / Financeiro",
        sla: "—",
        notes: "Sempre que o canhoto for localizado, priorize o encerramento do protocolo e a reativação do título.",
        branches: [
          { label: "SIM", outcome: "Financeiro reativa o título e o protocolo é encerrado.", next: "t8" },
          { label: "NÃO", outcome: "O processo segue para recebimento no CD e efetivação.", next: "t10" },
        ],
      },
      {
        id: "t8",
        code: "07A",
        kind: "redirect",
        title: "Financeiro reativa o título",
        summary: "O canhoto localizado é anexado ao protocolo e o financeiro reativa a cobrança do título.",
        owner: "Financeiro",
        sla: "—",
        notes: "Anexe o canhoto ao protocolo antes de solicitar a reativação.",
        next: "t9",
      },
      {
        id: "t9",
        code: "08A",
        kind: "end",
        title: "Protocolo reativado e finalizado",
        summary: "O protocolo é finalizado com o título reativado — a devolução não é efetivada.",
        owner: "Financeiro",
        sla: "—",
      },
      {
        id: "t10",
        code: "08",
        kind: "step",
        title: "Recebimento no CD",
        summary: "A devolução retorna ao CD e passa por conferência da nota fiscal.",
        owner: "CD Medicamental",
        sla: "5 dias",
        notes: "Confira quantidade e integridade dos itens recebidos antes de liberar a efetivação.",
        next: "t11",
      },
      {
        id: "t11",
        code: "09",
        kind: "end",
        title: "Efetivação da devolução",
        summary: "Após a conferência, a devolução total é efetivada no sistema.",
        owner: "Setor de Devolução",
        sla: "—",
      },
    ]),
  },
  {
    id: "parcial",
    title: "Devolução parcial",
    entry: "Sac ou Portal do Cliente",
    startId: "p1",
    nodes: byId([
      {
        id: "p1",
        code: "01",
        kind: "start",
        title: "Abertura da devolução",
        summary: "Cliente ou atendente formaliza a solicitação de devolução parcial do pedido.",
        owner: "Sac / Portal do Cliente",
        sla: "7 dias",
        notes: "Especifique claramente quais itens do pedido fazem parte da devolução parcial.",
        next: "p2",
      },
      {
        id: "p2",
        code: "02",
        kind: "step",
        title: "Emissão do espelho",
        summary:
          "É gerado o espelho da devolução, documento-base para a nota fiscal de devolução (NFD).",
        owner: "Sac / Portal do Cliente",
        sla: "5 dias",
        notes: "Verifique se apenas os itens da devolução parcial constam no espelho.",
        next: "p3",
      },
      {
        id: "p3",
        code: "03",
        kind: "step",
        title: "Anexar a NFD",
        summary: "A nota fiscal de devolução é anexada ao protocolo.",
        owner: "Sac / Portal do Cliente",
        sla: "5 dias",
        inputs: ["Nota Fiscal de Devolução (NFD)"],
        notes:
          "Pelo Sac, o atendente anexa a NFD e dá andamento manualmente. Pelo Portal do Cliente, o cliente anexa a NFD e o andamento é automático.",
        next: "p4",
      },
      {
        id: "p4",
        code: "04",
        kind: "step",
        title: "Análise da NFD e coleta",
        summary: "O setor de devolução confere a NFD e agenda a coleta da parte devolvida.",
        owner: "Setor de Devolução",
        sla: "5 dias",
        notes: "Confirme que o volume a coletar corresponde apenas aos itens da devolução parcial.",
        next: "p5",
      },
      {
        id: "p5",
        code: "05",
        kind: "step",
        title: "Coleta",
        summary: "A transportadora realiza a coleta da mercadoria devolvida no endereço do cliente.",
        owner: "Transportadora",
        sla: "15 dias",
        notes: "Acompanhe o prazo de coleta junto à transportadora; atrasos devem ser registrados.",
        next: "p6",
      },
      {
        id: "p6",
        code: "06",
        kind: "decision",
        title: "Canhoto foi localizado durante o processo?",
        summary: "Em qualquer etapa anterior, verifica-se se o canhoto assinado da entrega foi localizado.",
        owner: "Sac / Financeiro",
        sla: "—",
        notes: "Sempre que o canhoto for localizado, priorize o encerramento do protocolo e a reativação do título.",
        branches: [
          { label: "SIM", outcome: "Financeiro reativa o título e o protocolo é encerrado.", next: "p7" },
          { label: "NÃO", outcome: "O processo segue para recebimento no CD e efetivação.", next: "p9" },
        ],
      },
      {
        id: "p7",
        code: "06A",
        kind: "redirect",
        title: "Financeiro reativa o título",
        summary: "O canhoto localizado é anexado ao protocolo e o financeiro reativa a cobrança do título.",
        owner: "Financeiro",
        sla: "—",
        notes: "Anexe o canhoto ao protocolo antes de solicitar a reativação.",
        next: "p8",
      },
      {
        id: "p8",
        code: "07A",
        kind: "end",
        title: "Protocolo reativado e finalizado",
        summary: "O protocolo é finalizado com o título reativado — a devolução não é efetivada.",
        owner: "Financeiro",
        sla: "—",
      },
      {
        id: "p9",
        code: "07",
        kind: "step",
        title: "Recebimento no CD",
        summary: "A devolução retorna ao CD e passa por conferência da nota fiscal.",
        owner: "CD Medicamental",
        sla: "5 dias",
        notes: "Confira quantidade e integridade dos itens recebidos antes de liberar a efetivação.",
        next: "p10",
      },
      {
        id: "p10",
        code: "08",
        kind: "end",
        title: "Efetivação da devolução",
        summary: "Após a conferência, a devolução parcial é efetivada no sistema.",
        owner: "Setor de Devolução",
        sla: "—",
      },
    ]),
  },
  {
    id: "recusa",
    title: "Recusa no ato da entrega",
    entry: "Transporte / Transportadora",
    startId: "r1",
    nodes: byId([
      {
        id: "r1",
        code: "01",
        kind: "start",
        title: "Abertura da recusa",
        summary: "A recusa no momento da entrega é registrada pelo transporte ou pela transportadora.",
        owner: "Transporte / Transportadora",
        sla: "7 dias",
        notes: "Registre o motivo da recusa informado no momento da entrega.",
        next: "r2",
      },
      {
        id: "r2",
        code: "02",
        kind: "step",
        title: "Análise de canhoto",
        summary: "O Sac verifica se consta canhoto assinado da entrega e segue com o andamento.",
        owner: "Sac",
        sla: "5 dias",
        notes: "Consulte o histórico de entrega antes de confirmar a ausência de canhoto.",
        next: "r3",
      },
      {
        id: "r3",
        code: "03",
        kind: "step",
        title: "Sustação de título",
        summary: "O financeiro sustém a cobrança do título vinculado ao pedido recusado.",
        owner: "Financeiro",
        sla: "5 dias",
        notes: "A sustação deve ocorrer antes do vencimento do título para evitar cobrança indevida.",
        next: "r4",
      },
      {
        id: "r4",
        code: "04",
        kind: "decision",
        title: "Canhoto foi localizado pelo transporte?",
        summary: "O transporte verifica se o canhoto da entrega foi localizado.",
        owner: "Transporte",
        sla: "—",
        notes: "Caso localizado, anexe o canhoto ao protocolo antes de encaminhar ao financeiro.",
        branches: [
          { label: "SIM", outcome: "Financeiro reativa o título e o protocolo é encerrado.", next: "r5" },
          { label: "NÃO", outcome: "O transporte dá andamento e o processo segue para efetivação.", next: "r7" },
        ],
      },
      {
        id: "r5",
        code: "04A",
        kind: "redirect",
        title: "Financeiro reativa o título",
        summary: "O canhoto localizado é anexado ao protocolo e o financeiro reativa a cobrança do título.",
        owner: "Financeiro",
        sla: "—",
        notes: "Anexe o canhoto ao protocolo antes de solicitar a reativação.",
        next: "r6",
      },
      {
        id: "r6",
        code: "05A",
        kind: "end",
        title: "Protocolo reativado e finalizado",
        summary: "O protocolo é finalizado com o título reativado.",
        owner: "Financeiro",
        sla: "—",
      },
      {
        id: "r7",
        code: "05",
        kind: "step",
        title: "Transporte dá andamento",
        summary: "Sem o canhoto localizado, o transporte dá andamento ao processo de recusa.",
        owner: "Transporte",
        sla: "—",
        notes: "Registre a justificativa da ausência de canhoto antes de dar andamento.",
        next: "r8",
      },
      {
        id: "r8",
        code: "06",
        kind: "end",
        title: "Efetivação da recusa",
        summary: "O setor de devolução segue com a efetivação do processo de recusa.",
        owner: "Setor de Devolução",
        sla: "—",
      },
    ]),
  },
  {
    id: "canhoto",
    title: "Canhoto",
    entry: "Solicitação apenas pelo Sac",
    startId: "c1",
    nodes: byId([
      {
        id: "c1",
        code: "01",
        kind: "start",
        title: "Abertura da solicitação",
        summary: "A solicitação de canhoto é aberta exclusivamente pelo atendimento Sac.",
        owner: "Sac",
        sla: "—",
        notes: "Confirme com o cliente os dados da entrega antes de abrir a solicitação.",
        next: "c2",
      },
      {
        id: "c2",
        code: "02",
        kind: "step",
        title: "Sustação de título",
        summary: "O financeiro sustém a cobrança do título enquanto o canhoto é localizado.",
        owner: "Financeiro",
        sla: "5 dias",
        notes: "A sustação deve ocorrer antes do vencimento do título para evitar cobrança indevida.",
        next: "c3",
      },
      {
        id: "c3",
        code: "03",
        kind: "decision",
        title: "Consta canhoto da entrega?",
        summary: "O transporte analisa se consta canhoto assinado da entrega.",
        owner: "Transporte",
        sla: "5 dias",
        notes: "Consulte o histórico de rastreio e o motorista responsável pela entrega.",
        branches: [
          { label: "SIM", outcome: "O canhoto é anexado e o financeiro reativa e finaliza o protocolo.", next: "c4" },
          { label: "NÃO", outcome: "O Sac gera uma ordem e o processo segue para efetivação.", next: "c6" },
        ],
      },
      {
        id: "c4",
        code: "03A",
        kind: "redirect",
        title: "Anexa o canhoto",
        summary: "O canhoto localizado é anexado ao protocolo.",
        owner: "Transporte",
        sla: "—",
        notes: "Envie o canhoto digitalizado com boa legibilidade da assinatura.",
        next: "c5",
      },
      {
        id: "c5",
        code: "04A",
        kind: "end",
        title: "Financeiro reativa e finaliza",
        summary: "O financeiro reativa o título e finaliza o protocolo.",
        owner: "Financeiro",
        sla: "5 dias",
      },
      {
        id: "c6",
        code: "04",
        kind: "step",
        title: "Sac gera ordem",
        summary: "Sem o canhoto localizado, o Sac dá andamento gerando uma ordem de serviço.",
        owner: "Sac",
        sla: "5 dias",
        notes: "Informe o cliente sobre o andamento e o novo prazo estimado.",
        next: "c7",
      },
      {
        id: "c7",
        code: "05",
        kind: "end",
        title: "Efetivação",
        summary: "O setor de devolução segue com a efetivação do processo.",
        owner: "Setor de Devolução",
        sla: "—",
      },
    ]),
  },
];

/**
 * Reformulação do Sac: a verificação de canhoto deixa de ser um ponto de
 * decisão dentro dos fluxos de devolução total e parcial. A reativação de
 * título só volta a aparecer em um cenário específico (registrado como nota
 * na etapa "Coleta" da devolução total) — fora disso, os dois fluxos passam
 * a ser lineares, sem bifurcação.
 */
export const processesReformulado: SacProcess[] = [
  {
    id: "total",
    title: "Devolução total",
    entry: "Sac ou Portal do Cliente",
    startId: "tr1",
    changeNote:
      "A verificação de canhoto deixou de ser um ponto de decisão no meio do fluxo. A reativação do título agora só ocorre em um cenário específico, durante a coleta — veja a etapa \"Coleta\". Fora esse caso, o processo segue direto até a efetivação.",
    nodes: byId([
      {
        id: "tr1",
        code: "01",
        kind: "start",
        title: "Abertura da devolução",
        summary: "Cliente ou atendente formaliza a solicitação de devolução total do pedido.",
        owner: "Sac / Portal do Cliente",
        sla: "7 dias",
        notes: "Confirme o número do pedido e o motivo da devolução antes de registrar a abertura.",
        next: "tr2",
      },
      {
        id: "tr2",
        code: "02",
        kind: "step",
        title: "Emissão do espelho",
        summary:
          "É gerado o espelho da devolução, documento-base para a nota fiscal de devolução (NFD).",
        owner: "Sac / Portal do Cliente",
        sla: "5 dias",
        notes: "Verifique se todos os itens do pedido original constam no espelho gerado.",
        next: "tr3",
      },
      {
        id: "tr3",
        code: "03",
        kind: "step",
        title: "Anexar a NFD",
        summary: "A nota fiscal de devolução é anexada ao protocolo.",
        owner: "Sac / Portal do Cliente",
        sla: "5 dias",
        inputs: ["Nota Fiscal de Devolução (NFD)"],
        notes:
          "Pelo Sac, o atendente anexa a NFD e dá andamento manualmente. Pelo Portal do Cliente, o cliente anexa a NFD e o andamento é automático.",
        next: "tr4",
      },
      {
        id: "tr4",
        code: "04",
        kind: "step",
        title: "Análise da NFD e solicitação de coleta",
        summary: "O setor de devolução confere a NFD e solicita a coleta da mercadoria.",
        owner: "Setor de Devolução",
        sla: "5 dias",
        notes: "Confirme divergências entre a NFD e o pedido original antes de solicitar a coleta.",
        next: "tr5",
      },
      {
        id: "tr5",
        code: "05",
        kind: "step",
        title: "Sustação de título",
        summary: "O financeiro sustém a cobrança do título vinculado ao pedido em devolução.",
        owner: "Financeiro",
        sla: "5 dias",
        notes: "A sustação deve ocorrer antes do vencimento do título para evitar cobrança indevida.",
        next: "tr6",
      },
      {
        id: "tr6",
        code: "06",
        kind: "step",
        title: "Coleta",
        summary: "A transportadora realiza a coleta da mercadoria devolvida no endereço do cliente.",
        owner: "Transportadora",
        sla: "15 dias",
        notes: "Acompanhe o prazo de coleta junto à transportadora; atrasos devem ser registrados.",
        sideNote:
          "Reativação: se, no momento da coleta, o cliente não disponibilizar a mercadoria, a transportadora envia a ressalva e o título é reativado.",
        next: "tr7",
      },
      {
        id: "tr7",
        code: "07",
        kind: "end",
        title: "Recebimento e efetivação",
        summary:
          "A devolução retorna ao CD; após a conferência da nota fiscal, o processo segue para efetivação.",
        owner: "Setor de Devolução",
        sla: "5 dias",
      },
    ]),
  },
  {
    id: "parcial",
    title: "Devolução parcial",
    entry: "Sac ou Portal do Cliente",
    startId: "pr1",
    changeNote:
      "O ponto de decisão sobre o canhoto foi removido — o fluxo de devolução parcial agora é totalmente linear, sem previsão de reativação de título nesta etapa.",
    nodes: byId([
      {
        id: "pr1",
        code: "01",
        kind: "start",
        title: "Abertura da devolução",
        summary: "Cliente ou atendente formaliza a solicitação de devolução parcial do pedido.",
        owner: "Sac / Portal do Cliente",
        sla: "7 dias",
        notes: "Especifique claramente quais itens do pedido fazem parte da devolução parcial.",
        next: "pr2",
      },
      {
        id: "pr2",
        code: "02",
        kind: "step",
        title: "Emissão do espelho",
        summary:
          "É gerado o espelho da devolução, documento-base para a nota fiscal de devolução (NFD).",
        owner: "Sac / Portal do Cliente",
        sla: "5 dias",
        notes: "Verifique se apenas os itens da devolução parcial constam no espelho.",
        next: "pr3",
      },
      {
        id: "pr3",
        code: "03",
        kind: "step",
        title: "Anexar a NFD",
        summary: "A nota fiscal de devolução é anexada ao protocolo.",
        owner: "Sac / Portal do Cliente",
        sla: "5 dias",
        inputs: ["Nota Fiscal de Devolução (NFD)"],
        notes:
          "Pelo Sac, o atendente anexa a NFD e dá andamento manualmente. Pelo Portal do Cliente, o cliente anexa a NFD e o andamento é automático.",
        next: "pr4",
      },
      {
        id: "pr4",
        code: "04",
        kind: "step",
        title: "Análise da NFD e solicitação de coleta",
        summary: "O setor de devolução confere a NFD e solicita a coleta da parte devolvida.",
        owner: "Setor de Devolução",
        sla: "5 dias",
        notes: "Confirme que o volume a coletar corresponde apenas aos itens da devolução parcial.",
        next: "pr5",
      },
      {
        id: "pr5",
        code: "05",
        kind: "step",
        title: "Coleta",
        summary: "A transportadora realiza a coleta da mercadoria devolvida no endereço do cliente.",
        owner: "Transportadora",
        sla: "15 dias",
        notes: "Acompanhe o prazo de coleta junto à transportadora; atrasos devem ser registrados.",
        next: "pr6",
      },
      {
        id: "pr6",
        code: "06",
        kind: "end",
        title: "Recebimento e efetivação",
        summary:
          "A devolução retorna ao CD; após a conferência da nota fiscal, o processo segue para efetivação.",
        owner: "Setor de Devolução",
        sla: "5 dias",
      },
    ]),
  },
  processesAtual.find((p) => p.id === "recusa")!,
  processesAtual.find((p) => p.id === "canhoto")!,
];

export const processesByVariant: Record<Variant, SacProcess[]> = {
  atual: processesAtual,
  reformulado: processesReformulado,
};

export const variantLabel: Record<Variant, string> = {
  atual: "Fluxo atual",
  reformulado: "Fluxo reformulado",
};

export type ReasonGroup = {
  title: string;
  items: { title: string; text: string }[];
};

export const reasonGroups: ReasonGroup[] = [
  {
    title: "Pedido & comercial",
    items: [
      { title: "Erro do cliente", text: "Comprou errado e desistência." },
      { title: "Erro de digitação", text: "Quantidade errada que o vendedor colocou no pedido." },
      { title: "Não solicitado", text: "Pedido gerado indevidamente pelo vendedor." },
      { title: "Duplicidade", text: "Quando constam 2 pedidos iguais." },
      { title: "Desacordo comercial", text: "Valor errado ou alto; reversão realizada por Medweb." },
      { title: "Bonificação", text: "Solicitar a coleta por e-mail." },
    ],
  },
  {
    title: "Logística & transporte",
    items: [
      {
        title: "Mercadoria não expedida",
        text: "A mercadoria não saiu do CD, por solicitação de supervisor (pedido errado).",
      },
      {
        title: "Falta de volume",
        text: "Cliente recebeu o pedido faltando volume e fez ressalva. Caso contrário, pedir filmagem e rastrear.",
      },
      {
        title: "Extravio / roubo",
        text: "Transportador assina a NF porém o cliente não recebeu volume; mercadoria entregue em outra drogaria com canhoto assinado.",
      },
      {
        title: "Volume incorreto",
        text: "Volume recebido com etiqueta de outro distribuidor, ou de outra farmácia com etiqueta Medicamental.",
      },
      { title: "Erro do depósito", text: "O pedido foi encaminhado para a transportadora errada." },
      { title: "Atraso", text: "O pedido atrasou." },
      {
        title: "Transportadora — Hospitalar",
        text: "Motivo específico vinculado à transportadora Hospitalar.",
      },
    ],
  },
  {
    title: "Produto & qualidade",
    items: [
      {
        title: "Sobra de produto",
        text: "Canhoto assinado, mas o transporte informou volume sobrando no CD, ou cliente relatou sobra não constante na NF.",
      },
      {
        title: "Falta de produto",
        text: "Sobra de quantidade pequena, até 20 unidades — tratada no mesmo protocolo da sobra.",
      },
      {
        title: "Etiqueta trocada",
        text: "Caixa de embarque fechada com produto trocado — ex.: dipirona recebida como hidroclorotiazida.",
      },
      {
        title: "Validade próxima / vencido",
        text: "Negociação de até 3 meses de validade, ou crédito de até R$ 100,00.",
      },
      { title: "Erro de fabricação", text: "Até 2 anos, com protocolo junto à indústria por erro de fabricação." },
      { title: "Recall", text: "Até 2 anos, com lote confirmado pelo farmacêutico." },
      { title: "Lote incorreto", text: "Lote errado com solicitação de devolução, ou lote de outro CD." },
      { title: "Mercadoria avariada", text: "Mercadoria danificada." },
    ],
  },
  {
    title: "Cadastro & documentação",
    items: [
      {
        title: "Cadastro incorreto",
        text: "Cadastro do cliente — por exemplo, o endereço — está errado na Medicamental.",
      },
      { title: "Carta de correção", text: "Cliente solicita a carta de correção em até 30 dias." },
    ],
  },
];

/**
 * Catálogos de motivos específicos da reestruturação do Sac — só existem no
 * fluxo reformulado, ao lado (não em substituição) do catálogo geral de
 * "Motivos de devolução" acima, que continua o mesmo nas duas variantes.
 */
export type ReasonItem = { title: string; text: string };

export const recusaReasons: ReasonItem[] = [
  { title: "Atraso", text: "O pedido atrasou." },
  { title: "Duplicidade", text: "Quando constam 2 pedidos iguais." },
  { title: "Não solicitado", text: "Pedido gerado indevidamente pelo vendedor." },
  { title: "Avaria", text: "Mercadoria danificada." },
  {
    title: "Falta de volume",
    text: "Cliente recebeu o pedido faltando volume e fez ressalva. Caso contrário, pedir filmagem e rastrear.",
  },
  { title: "Desacordo comercial", text: "Valor errado ou alto; reversão realizada por Medweb." },
  {
    title: "Volume incorreto",
    text: "Volume recebido com etiqueta de outro distribuidor, ou de outra farmácia com etiqueta Medicamental.",
  },
];

export const mercadoriaNaoApresentadaReasons: ReasonItem[] = [
  {
    title: "Falta de volume",
    text: "Cliente recebeu o pedido faltando volume e fez ressalva. Caso contrário, pedir filmagem e rastrear.",
  },
  { title: "Transportadora", text: "Motivo relacionado à transportadora responsável pela entrega." },
  {
    title: "Mercadoria não expedida",
    text: "A mercadoria não saiu do CD, por solicitação de supervisor (pedido errado).",
  },
  {
    title: "Cadastro incorreto",
    text: "Cadastro do cliente — por exemplo, o endereço — está errado na Medicamental.",
  },
  { title: "Mercadoria avariada", text: "Mercadoria danificada." },
  {
    title: "Extravio",
    text: "Transportador assina a NF porém o cliente não recebeu volume; mercadoria entregue em outra drogaria com canhoto assinado.",
  },
];
