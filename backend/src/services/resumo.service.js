import * as transacoesRepository from '../repositories/transacoes.repository.js';

function criarErro(mensagem, status) {
  const erro = new Error(mensagem);
  erro.status = status;
  return erro;
}

// Regra de negocio: calcula saldo, totais e agrupa despesas por categoria
// para alimentar o dashboard e os graficos do front-end.
export async function gerarResumo({ mes, ano }) {
  if (!mes || !ano) {
    throw criarErro('Os parametros "mes" e "ano" sao obrigatorios.', 400);
  }

  const linhas = await transacoesRepository.resumoPorPeriodo({ mes, ano });

  let totalReceitas = 0;
  let totalDespesas = 0;
  const despesasPorCategoria = [];

  for (const linha of linhas) {
    const total = Number(linha.total);

    if (linha.tipo === 'receita') {
      totalReceitas += total;
    } else {
      totalDespesas += total;
      despesasPorCategoria.push({
        categoria: linha.categoria_nome || 'Sem categoria',
        cor: linha.categoria_cor || '#94a3b8',
        total,
      });
    }
  }

  const evolucaoBruta = await transacoesRepository.evolucaoMensal();

  // Reorganiza [{mes, tipo, total}] em [{mes, receita, despesa}]
  const mapaEvolucao = new Map();
  for (const item of evolucaoBruta) {
    if (!mapaEvolucao.has(item.mes)) {
      mapaEvolucao.set(item.mes, { mes: item.mes, receita: 0, despesa: 0 });
    }
    mapaEvolucao.get(item.mes)[item.tipo] = Number(item.total);
  }

  return {
    mes: Number(mes),
    ano: Number(ano),
    totalReceitas,
    totalDespesas,
    saldo: totalReceitas - totalDespesas,
    despesasPorCategoria,
    evolucaoMensal: Array.from(mapaEvolucao.values()),
  };
}
