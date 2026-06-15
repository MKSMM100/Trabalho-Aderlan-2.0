-- ============================================================
-- Script de inicialização do banco de dados
-- Executado automaticamente pelo container do Postgres
-- ============================================================

CREATE TYPE tipo_transacao AS ENUM ('receita', 'despesa');

CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    tipo tipo_transacao NOT NULL,
    cor VARCHAR(7) NOT NULL DEFAULT '#999999'
);

CREATE TABLE transacoes (
    id SERIAL PRIMARY KEY,
    descricao VARCHAR(255) NOT NULL,
    valor NUMERIC(12, 2) NOT NULL CHECK (valor > 0),
    data DATE NOT NULL,
    tipo tipo_transacao NOT NULL,
    categoria_id INTEGER REFERENCES categorias(id) ON DELETE RESTRICT
);

-- ------------------------------------------------------------
-- Categorias padrão
-- ------------------------------------------------------------
INSERT INTO categorias (nome, tipo, cor) VALUES
    ('Salário',         'receita', '#22c55e'),
    ('Freelance',       'receita', '#06b6d4'),
    ('Outras Receitas', 'receita', '#84cc16'),
    ('Alimentação',     'despesa', '#ef4444'),
    ('Transporte',      'despesa', '#f97316'),
    ('Moradia',         'despesa', '#a855f7'),
    ('Lazer',           'despesa', '#ec4899'),
    ('Saúde',           'despesa', '#3b82f6'),
    ('Outros',          'despesa', '#6b7280');

-- ------------------------------------------------------------
-- Transações de exemplo (mock para apresentação/demo)
-- ------------------------------------------------------------
INSERT INTO transacoes (descricao, valor, data, tipo, categoria_id) VALUES
    ('Salário mensal',        4500.00, '2026-06-01', 'receita', 1),
    ('Projeto freelance',      800.00, '2026-06-08', 'receita', 2),
    ('Supermercado',           380.50, '2026-06-02', 'despesa', 4),
    ('Restaurante',             65.00, '2026-06-04', 'despesa', 4),
    ('Combustível',            150.00, '2026-06-03', 'despesa', 5),
    ('Aluguel',               1200.00, '2026-06-05', 'despesa', 6),
    ('Cinema',                  60.00, '2026-06-07', 'despesa', 7),
    ('Farmácia',                90.00, '2026-06-06', 'despesa', 8),
    ('Salário mensal',        4500.00, '2026-05-01', 'receita', 1),
    ('Supermercado',           420.00, '2026-05-03', 'despesa', 4),
    ('Aluguel',               1200.00, '2026-05-05', 'despesa', 6),
    ('Internet',               99.90,  '2026-05-10', 'despesa', 6);
