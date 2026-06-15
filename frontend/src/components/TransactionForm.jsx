import { useEffect, useState } from 'react';
import { criarTransacao, atualizarTransacao } from '../services/api.js';

const valoresIniciais = {
  descricao: '',
  valor: '',
  data: new Date().toISOString().slice(0, 10),
  tipo: 'despesa',
  categoria_id: '',
};

export default function TransactionForm({ categorias, transacaoEmEdicao, onSalvar, onCancelar }) {
  const [form, setForm] = useState(valoresIniciais);
  const [erros, setErros] = useState([]);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (transacaoEmEdicao) {
      setForm({
        descricao: transacaoEmEdicao.descricao,
        valor: transacaoEmEdicao.valor,
        data: String(transacaoEmEdicao.data).slice(0, 10),
        tipo: transacaoEmEdicao.tipo,
        categoria_id: transacaoEmEdicao.categoria_id ?? '',
      });
    } else {
      setForm(valoresIniciais);
    }
    setErros([]);
  }, [transacaoEmEdicao]);

  const categoriasFiltradas = categorias.filter((categoria) => categoria.tipo === form.tipo);

  const handleChange = (campo, valor) => {
    setForm((atual) => ({
      ...atual,
      [campo]: valor,
      // ao trocar o tipo, limpa a categoria (ela pertence ao tipo anterior)
      ...(campo === 'tipo' ? { categoria_id: '' } : {}),
    }));
  };

  const handleSubmit = async (evento) => {
    evento.preventDefault();
    setErros([]);
    setSalvando(true);

    try {
      const payload = {
        ...form,
        valor: Number(form.valor),
        categoria_id: Number(form.categoria_id),
      };

      if (transacaoEmEdicao) {
        await atualizarTransacao(transacaoEmEdicao.id, payload);
      } else {
        await criarTransacao(payload);
      }

      setForm(valoresIniciais);
      onSalvar();
    } catch (erro) {
      const detalhes = erro.response?.data?.detalhes;
      setErros(detalhes || ['Não foi possível salvar a transação. Verifique a conexão com a API.']);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-3">
      <h2 className="text-sm font-semibold text-slate-600">
        {transacaoEmEdicao ? 'Editar transação' : 'Nova transação'}
      </h2>

      {erros.length > 0 && (
        <ul className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3 list-disc list-inside space-y-0.5">
          {erros.map((erro, indice) => (
            <li key={indice}>{erro}</li>
          ))}
        </ul>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <input
          type="text"
          placeholder="Descrição"
          className="lg:col-span-2 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
          value={form.descricao}
          onChange={(e) => handleChange('descricao', e.target.value)}
        />

        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="Valor (R$)"
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
          value={form.valor}
          onChange={(e) => handleChange('valor', e.target.value)}
        />

        <input
          type="date"
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
          value={form.data}
          onChange={(e) => handleChange('data', e.target.value)}
        />

        <select
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
          value={form.tipo}
          onChange={(e) => handleChange('tipo', e.target.value)}
        >
          <option value="despesa">Despesa</option>
          <option value="receita">Receita</option>
        </select>
      </div>

      <select
        className="w-full sm:w-64 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
        value={form.categoria_id}
        onChange={(e) => handleChange('categoria_id', e.target.value)}
      >
        <option value="">Selecione a categoria</option>
        {categoriasFiltradas.map((categoria) => (
          <option key={categoria.id} value={categoria.id}>
            {categoria.nome}
          </option>
        ))}
      </select>

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={salvando}
          className="bg-slate-900 text-white text-sm font-medium rounded-lg px-4 py-2 hover:bg-slate-700 disabled:opacity-50 transition-colors"
        >
          {salvando ? 'Salvando...' : transacaoEmEdicao ? 'Atualizar' : 'Adicionar'}
        </button>

        {transacaoEmEdicao && (
          <button
            type="button"
            onClick={onCancelar}
            className="text-sm font-medium text-slate-500 px-4 py-2 hover:text-slate-700 transition-colors"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
