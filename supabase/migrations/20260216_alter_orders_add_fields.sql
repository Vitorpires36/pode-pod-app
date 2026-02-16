/*
  # Atualizar tabela de pedidos com campos adicionais

  Adiciona campos para rastrear:
  - Data da venda
  - Frete cobrado do cliente
  - Frete custo (operacional)
  - Campo para observações/lucro
*/

-- Adicionar colunas à tabela orders se não existirem
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS customer_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS sale_date DATE DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS frete_cobrado NUMERIC(10, 2),
ADD COLUMN IF NOT EXISTS frete_custo NUMERIC(10, 2),
ADD COLUMN IF NOT EXISTS observacoes TEXT,
ADD COLUMN IF NOT EXISTS lucro_margem NUMERIC(10, 2);

-- Criar índices adicionais
CREATE INDEX IF NOT EXISTS idx_orders_customer_name ON orders(customer_name);
CREATE INDEX IF NOT EXISTS idx_orders_sale_date ON orders(sale_date DESC);
CREATE INDEX IF NOT EXISTS idx_orders_lucro ON orders(lucro_margem);

-- Comentários descritivos das colunas
COMMENT ON COLUMN orders.customer_name IS 'Nome do cliente';
COMMENT ON COLUMN orders.sale_date IS 'Data da venda (02/02, 03/02, etc)';
COMMENT ON COLUMN orders.frete_cobrado IS 'Valor do frete cobrado do cliente';
COMMENT ON COLUMN orders.frete_custo IS 'Custo real do frete (o que pagamos)';
COMMENT ON COLUMN orders.observacoes IS 'Observações, lucro/perda na operação';
COMMENT ON COLUMN orders.lucro_margem IS 'Margem de lucro calculada (total - custo_total)';

-- Atualizar trigger para também atualizar lucro_margem
CREATE OR REPLACE FUNCTION update_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  -- Calcular margem de lucro se for um UPDATE que altera custos
  IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND (
    OLD.total IS DISTINCT FROM NEW.total OR
    OLD.frete_custo IS DISTINCT FROM NEW.frete_custo
  )) THEN
    NEW.lucro_margem = NEW.total - COALESCE(NEW.frete_custo, 0);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
