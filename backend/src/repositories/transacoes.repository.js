import pool from '../db.js';

// Camada de Dados: responsavel apenas por falar com o banco (SQL puro).
// Nao contem regra de negocio - isso fica na camada de servico.

export async function listar({ mes, ano }) {
  const params = [];
  let query = `
    SELECT t.*, c.nome AS categoria_nome, c.cor AS categoria_cor
    FROM transacoes t
    LEFT JOIN categorias c ON c.id = t.categoria_id
  `;

  if (mes && ano) {
    params.push(ano, mes);
    query += ' WHERE EXTRACT(YEAR FROM t.data) = $1 AND EXTRACT(MONTH FROM t.data) = $2';
  }

  query += ' ORDER BY t.data DESC, t.id DESC';

  const { rows } = await pool.query(query, params);
  return rows;
}

export async function buscarPorId(id) {
  const { rows } = await pool.query('SELECT * FROM transacoes WHERE id = $1', [id]);
  return rows[0];
}

export async function criar({ descricao, valor, data, tipo, categoria_id }) {
  const { rows } = await pool.query(
    `INSERT INTO transacoes (descricao, valor, data, tipo, categoria_id)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [descricao, valor, data, tipo, categoria_id]
  );
  return rows[0];
}

export async function atualizar(id, { descricao, valor, data, tipo, categoria_id }) {
  const { rows } = await pool.query(
    `UPDATE transacoes
     SET descricao = $1, valor = $2, data = $3, tipo = $4, categoria_id = $5
     WHERE id = $6
     RETURNING *`,
    [descricao, valor, data, tipo, categoria_id, id]
  );
  return rows[0];
}

export async function remover(id) {
  const { rows } = await pool.query('DELETE FROM transacoes WHERE id = $1 RETURNING *', [id]);
  return rows[0];
}

// Totais agrupados por tipo e categoria, dentro de um periodo (mes/ano)
export async function resumoPorPeriodo({ mes, ano }) {
  const { rows } = await pool.query(
    `SELECT t.tipo, c.nome AS categoria_nome, c.cor AS categoria_cor,
            SUM(t.valor) AS total
     FROM transacoes t
     LEFT JOIN categorias c ON c.id = t.categoria_id
     WHERE EXTRACT(YEAR FROM t.data) = $1 AND EXTRACT(MONTH FROM t.data) = $2
     GROUP BY t.tipo, c.nome, c.cor`,
    [ano, mes]
  );
  return rows;
}

// Totais de receita/despesa agrupados por mes (para o grafico de evolucao)
// Limitado aos ultimos 12 meses para evitar queries pesadas
export async function evolucaoMensal() {
  const { rows } = await pool.query(
    `SELECT TO_CHAR(data, 'YYYY-MM') AS mes, tipo, SUM(valor) AS total
     FROM transacoes
     WHERE data >= DATE_TRUNC('month', NOW()) - INTERVAL '11 months'
     GROUP BY mes, tipo
     ORDER BY mes`
  );
  return rows;
}
