export type Cliente = {
  telefone: string;
  nome: string;
};

export type ItemPedido = {
  id: string;
  tipo?: string;
  servico?: string;
  preco?: number;
};
