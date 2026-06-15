import * as transacoesRepository from '../repositories/transacoes.repository.js';
import * as categoriasRepository from '../repositories/categorias.repository.js';

// Camada de Negocio: validacoes e regras antes de falar com o banco.

function criarErro(mensagem, status, detalhes) {
  const erro = new Error(mensagem);
  erro.status = status;
  if (detalhes) erro.detalhes = detalhes;
  return erro;
}

async function validarTransacao(dados) {
  const { descricao, valor, data, tipo, categoria_id } = dados;
  const erros = [];

  if (!descricao || String(descricao).trim().length === 0) {
    erros.push('A descricao e obrigatoria.');
  }

  if (valor === undefined || valor === null || Number.isNaN(Number(valor)) || Number(valor) <= 0) {
    erros.push('O valor deve ser um numero maior que zero.');
  }

  if (!data) {
    erros.push('A data e obrigatoria.');
  }

  if (!['receita', 'despesa'].includes(tipo)) {
    erros.push('O tipo deve ser "receita" ou "despesa".');
  }

  if (!categoria_id) {
    erros.push('A categoria e obrigatoria.');
  } else {
    const categoria = await categoriasRepository.buscarPorId(categoria_id);
    if (!categoria) {
      erros.push('Categoria informada nao existe.');
    } else if (categoria.tipo !== tipo) {
      erros.push(`A categoria "${categoria.nome}" e do tipo "${categoria.tipo}", incompativel com o tipo "${tipo}".`);
    }
  }

  if (erros.length > 0) {
    throw criarErro('Dados invalidos', 400, erros);
  }
}

export async function listarTransacoes(filtros) {
  return transacoesRepository.listar(filtros);
}

export async function criarTransacao(dados) {
  await validarTransacao(dados);
  return transacoesRepository.criar(dados);
}

export async function atualizarTransacao(id, dados) {
  await validarTransacao(dados);

  const existente = await transacoesRepository.buscarPorId(id);
  if (!existente) {
    throw criarErro('Transacao nao encontrada.', 404);
  }

  return transacoesRepository.atualizar(id, dados);
}

export async function removerTransacao(id) {
  const removido = await transacoesRepository.remover(id);
  if (!removido) {
    throw criarErro('Transacao nao encontrada.', 404);
  }
  return removido;
}
