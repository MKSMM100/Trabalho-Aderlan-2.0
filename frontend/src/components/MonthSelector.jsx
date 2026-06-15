const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

export default function MonthSelector({ mes, ano, onChange }) {
  const anos = [ano - 1, ano, ano + 1];

  return (
    <div className="flex flex-wrap items-center gap-3 bg-white rounded-xl shadow-sm border border-slate-200 p-4">
      <span className="text-sm font-medium text-slate-500">Período</span>

      <select
        className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400"
        value={mes}
        onChange={(e) => onChange(Number(e.target.value), ano)}
      >
        {MESES.map((nome, indice) => (
          <option key={nome} value={indice + 1}>
            {nome}
          </option>
        ))}
      </select>

      <select
        className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400"
        value={ano}
        onChange={(e) => onChange(mes, Number(e.target.value))}
      >
        {anos.map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>
    </div>
  );
}
