import { useEffect, useMemo, useState } from "react";
import type { ItemPedido } from "../types";
import { PRECO_TABLE, TIPOS, SERVICOS } from "../constants";
import { MOCK_CLIENTES } from "../mocks/clientes";
import { uid, itemsSubtotal } from "../utils";
import { useSnackbar } from "../hooks/useSnackbar";
import "./PedidoCliente.css";

export default function TelaPedidoCliente() {
  // Cliente
  const [telefone, setTelefone] = useState("");
  const [nome, setNome] = useState("");
  const [nomeReadOnly, setNomeReadOnly] = useState(false);

  // Itens
  const [itens, setItens] = useState<ItemPedido[]>([]);

  // Snackbar
  const { snack, showSnack } = useSnackbar();

  // Effects: quando telefone atingir 11 (ou mais) dígitos, procura nos mocks
  useEffect(() => {
    const onlyDigits = telefone.replace(/\D/g, "");
    if (onlyDigits.length >= 11) {
      const found = MOCK_CLIENTES.find((c) => c.telefone === onlyDigits);
      if (found) {
        setNome(found.nome);
        setNomeReadOnly(true);
      } else {
        setNomeReadOnly(false);
      }
    } else {
      setNomeReadOnly(false);
    }
  }, [telefone]);

  // calcular subtotal e desconto
  const subtotal = useMemo(() => itemsSubtotal(itens), [itens]);
  const descontoAplicavel = useMemo(() => {
    return itens.some((it) => it.servico === "Pacote Completo");
  }, [itens]);
  const totalComDesconto = descontoAplicavel ? +(subtotal * 0.9).toFixed(2) : subtotal;

  // validações para habilitar finalizar
  const podeFinalizar = telefone.replace(/\D/g, "").length >= 11 && nome.trim() !== "" && itens.length > 0;

  // funções de manipulação de itens
  function adicionarItem() {
    setItens((s) => [...s, { id: uid("item") }]);
  }

  function removerItem(id: string) {
    setItens((s) => s.filter((i) => i.id !== id));
  }

  function atualizarItem(id: string, patch: Partial<ItemPedido>) {
    setItens((s) =>
      s.map((it) => {
        if (it.id !== id) return it;
        const updated = { ...it, ...patch };
        if (updated.tipo && updated.servico) {
          const key = `${updated.tipo}|${updated.servico}`;
          const p = PRECO_TABLE[key];
          if (p === undefined) {
            showSnack("error", `Preço não encontrado para ${updated.tipo} / ${updated.servico}`);
            updated.preco = undefined;
          } else {
            updated.preco = p;
          }
        } else {
          updated.preco = undefined;
        }
        return updated;
      })
    );
  }

  function handleFinalizar() {
    if (!podeFinalizar) return;
    const ok = window.confirm("Confirma finalizar a compra?");
    if (!ok) return;
    const invalido = itens.some((it) => it.preco === undefined);
    if (invalido) {
      showSnack("error", "Existem itens sem preço válido. Corrija antes de finalizar.");
      return;
    }
    showSnack("success", "Compra finalizada com sucesso!");
    setTelefone("");
    setNome("");
    setNomeReadOnly(false);
    setItens([]);
  }

  return (
    <div className="pedido-container">
      <div className="pedido-wrapper">
        <div className="pedido-header">
          <h1 className="pedido-title">🧺 Lavanderia Premium</h1>
          <p className="pedido-subtitle">Sistema de Pedidos</p>
        </div>

        <div className="pedido-card">
          <h2 className="section-title">
            <span className="section-icon">👤</span> Dados do Cliente
          </h2>

          <div className="cliente-form">
            <div className="form-group">
              <label className="form-label">📱 Telefone</label>
              <input
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(11) 99999-8888"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">✍️ Nome Completo</label>
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome do cliente"
                readOnly={nomeReadOnly}
                className="form-input"
              />
            </div>
          </div>

          <div className="itens-header">
            <h2 className="section-title">
              <span className="section-icon">🛍️</span> Itens do Pedido
            </h2>
            <button onClick={adicionarItem} className="btn-adicionar">
              <span>+</span> Adicionar Item
            </button>
          </div>

          <div className="table-container">
            <table className="itens-table">
              <thead>
                <tr>
                  <th>Tipo de Roupa</th>
                  <th>Serviço</th>
                  <th>Preço (R$)</th>
                  <th style={{ textAlign: 'center' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {itens.map((it) => (
                  <tr key={it.id}>
                    <td>
                      <select
                        value={it.tipo ?? ""}
                        onChange={(e) => atualizarItem(it.id, { tipo: e.target.value })}
                        className="table-select"
                      >
                        <option value="">🔽 Selecione o tipo</option>
                        {TIPOS.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </td>

                    <td>
                      <select
                        value={it.servico ?? ""}
                        onChange={(e) => atualizarItem(it.id, { servico: e.target.value })}
                        className="table-select"
                      >
                        <option value="">🔽 Selecione o serviço</option>
                        {SERVICOS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>

                    <td>
                      <div className="preco-container">
                        <span className="preco-simbolo">R$</span>
                        <input
                          value={it.preco !== undefined ? it.preco.toFixed(2) : ""}
                          readOnly
                          placeholder="0,00"
                          className="preco-input"
                        />
                      </div>
                    </td>

                    <td style={{ textAlign: 'center' }}>
                      <button onClick={() => removerItem(it.id)} className="btn-remover">
                        🗑️ Remover
                      </button>
                    </td>
                  </tr>
                ))}

                {itens.length === 0 && (
                  <tr>
                    <td colSpan={4}>
                      <div className="empty-state">
                        <div className="empty-icon">🧺</div>
                        <p className="empty-text">Nenhum item adicionado ainda</p>
                        <p className="empty-subtext">Clique em "Adicionar Item" para começar</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="resumo-container">
            <div className="resumo-valores">
              <div className="subtotal">
                Subtotal: <span className="subtotal-valor">R$ {subtotal.toFixed(2)}</span>
              </div>
              {descontoAplicavel && (
                <div className="desconto-container">
                  <span className="desconto-icon">🎉</span>
                  Total com desconto (10%): 
                  <span className="total-valor">R$ {totalComDesconto.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div>
              <button
                onClick={handleFinalizar}
                disabled={!podeFinalizar}
                className="btn-finalizar"
              >
                {podeFinalizar ? "✅ Finalizar Compra" : "🔒 Preencha os Dados"}
              </button>
            </div>
          </div>

          {snack && (
            <div className={`snackbar ${snack.type === "error" ? "snackbar-error" : "snackbar-success"}`}>
              <span className="snackbar-icon">{snack.type === "error" ? "❌" : "✅"}</span>
              <span className="snackbar-message">{snack.msg}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="pedido-footer">
        <p className="footer-text">© 2025 Lavanderia Premium - Todos os direitos reservados</p>
      </div>
    </div>
  );
}
