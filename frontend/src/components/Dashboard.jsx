import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';

const formatarMoeda = (valor) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor || 0);

export default function Dashboard({ resumo }) {
  if (!resumo) return null;

  const { totalReceitas, totalDespesas, saldo, despesasPorCategoria, evolucaoMensal } = resumo;
  const saldoPositivo = saldo >= 0;

  return (
    <section className="space-y-4">
      {/* Cards de indicadores */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Receitas no período</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            {formatarMoeda(totalReceitas)}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Despesas no período</p>
          <p className="text-2xl font-bold text-red-500 mt-1">
            {formatarMoeda(totalDespesas)}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Saldo</p>
          <p className={`text-2xl font-bold mt-1 ${saldoPositivo ? 'text-slate-800' : 'text-red-500'}`}>
            {formatarMoeda(saldo)}
          </p>
        </div>
      </div>

      {/* Graficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <h2 className="text-sm font-semibold text-slate-600 mb-3">
            Despesas por categoria
          </h2>

          {despesasPorCategoria.length === 0 ? (
            <p className="text-sm text-slate-400 py-10 text-center">
              Nenhuma despesa registrada neste período.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={despesasPorCategoria}
                  dataKey="total"
                  nameKey="categoria"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={(entry) => entry.categoria}
                >
                  {despesasPorCategoria.map((entrada, indice) => (
                    <Cell key={indice} fill={entrada.cor} />
                  ))}
                </Pie>
                <Tooltip formatter={(valor) => formatarMoeda(valor)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <h2 className="text-sm font-semibold text-slate-600 mb-3">
            Receitas x despesas (mês a mês)
          </h2>

          {evolucaoMensal.length === 0 ? (
            <p className="text-sm text-slate-400 py-10 text-center">
              Sem dados suficientes para exibir a evolução.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={evolucaoMensal}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(valor) => formatarMoeda(valor)} />
                <Legend />
                <Bar dataKey="receita" name="Receita" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="despesa" name="Despesa" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </section>
  );
}
