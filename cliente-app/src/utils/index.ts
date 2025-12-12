import type { ItemPedido } from "../types";

export function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export function itemsSubtotal(itens: ItemPedido[]) {
  return itens.reduce((acc, it) => acc + (it.preco ?? 0), 0);
}
