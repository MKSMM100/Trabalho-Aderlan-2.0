import { useCallback, useEffect, useState } from 'react';
import MonthSelector from './components/MonthSelector.jsx';
import Dashboard from './components/Dashboard.jsx';
import TransactionForm from './components/TransactionForm.jsx';
import TransactionList from './components/TransactionList.jsx';
import { getResumo, getTransacoes, getCategorias } from './services/api.js';

const hoje = new Date();

export default function App() {
  const [mes, setMes] = useState(hoje.getMonth() + 1);
  const [ano, setAno] = useState(hoje.getFullYear());

  const [resumo, setResumo] = useState(null);
  const [transacoes, setTransacoes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [transacaoEmEdicao, setTransacaoEmEdicao] = useState(null);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const carregarDados = useCallback(async () => {
    setCarregando(true);
    setErro(null);

    try {
      const [resumoData, transacoesData, categoriasData] = await Promise.all([
        getResumo(mes, ano),
        getTransacoes(mes, ano),
        getCategorias(),
      ]);

      setResumo(resumoData);
      setTransacoes(transacoesData);
      setCategorias(categoriasData);
    } catch (e) {
      setErro('Não foi possível carregar os dados. Verifique se a API (backend) está em execução.');
    } finally {
      setCarregando(false);
    }
  }, [mes, ano]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const handleChangePeriodo = (novoMes, novoAno) => {
    setTransacaoEmEdicao(null);
    setMes(novoMes);
    setAno(novoAno);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-4">
          <h1 className="text-lg md:text-xl font-semibold">Controle Financeiro Pessoal</h1>
          <p className="text-slate-400 text-sm">Acompanhe suas receitas e despesas mensais</p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-6 space-y-4">
        <MonthSelector mes={mes} ano={ano} onChange={handleChangePeriodo} />

        {erro && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-sm">
            {erro}
          </div>
        )}

        {carregando ? (
          <p className="text-slate-500 text-sm">Carregando dados...</p>
        ) : (
          <>
            <Dashboard resumo={resumo} />

            <TransactionForm
              categorias={categorias}
              transacaoEmEdicao={transacaoEmEdicao}
              onSalvar={async () => {
                setTransacaoEmEdicao(null);
                await carregarDados();
              }}
              onCancelar={() => setTransacaoEmEdicao(null)}
            />

            <TransactionList
              transacoes={transacoes}
              onEditar={setTransacaoEmEdicao}
              onRemover={carregarDados}
            />
          </>
        )}
      </main>
    </div>
  );
}
