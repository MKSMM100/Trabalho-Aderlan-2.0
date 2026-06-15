import { removerTransacao } from '../services/api.js';

const formatarMoeda = (valor) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

const formatarData = (data) =>
  new Date(data).toLocaleDateString('pt-BR', { timeZone: 'UTC' });

export default function TransactionList({ transacoes, onEditar, onRemover }) {
  const handleRemover = async (id) => {
    const confirmou = window.confirm('Tem certeza que deseja excluir esta transação?');
    if (!confirmou) return;

    await removerTransacao(id);
    onRemover();
  };

  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
      <h2 className="text-sm font-semibold text-slate-600 mb-3">Transações do período</h2>

      {transacoes.length === 0 ? (
        <p className="text-sm text-slate-400 py-6 text-center">
          Nenhuma transação encontrada para este período.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-100">
                <th className="py-2 pr-3 font-medium">Data</th>
                <th className="py-2 pr-3 font-medium">Descrição</th>
                <th className="py-2 pr-3 font-medium">Categoria</th>
                <th className="py-2 pr-3 font-medium text-right">Valor</th>
                <th className="py-2 pr-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {transacoes.map((transacao) => (
                <tr key={transacao.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                  <td className="py-2 pr-3 whitespace-nowrap text-slate-600">
                    {formatarData(transacao.data)}
                  </td>
                  <td className="py-2 pr-3 text-slate-700">{transacao.descricao}</td>
                  <td className="py-2 pr-3 text-slate-600">
                    <span
                      className="inline-block w-2.5 h-2.5 rounded-full mr-1.5 align-middle"
                      style={{ backgroundColor: transacao.categoria_cor || '#cbd5e1' }}
                    />
                    {transacao.categoria_nome || 'Sem categoria'}
                  </td>
                  <td
                    className={`py-2 pr-3 text-right font-medium whitespace-nowrap ${
                      transacao.tipo === 'receita' ? 'text-emerald-600' : 'text-red-500'
                    }`}
                  >
                    {transacao.tipo === 'receita' ? '+ ' : '- '}
                    {formatarMoeda(transacao.valor)}
                  </td>
                  <td className="py-2 pr-3 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onEditar(transacao)}
                      className="text-slate-400 hover:text-slate-700 transition-colors mr-3"
                      title="Editar"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemover(transacao.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                      title="Excluir"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
