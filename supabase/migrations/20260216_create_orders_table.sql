/*
  # Criar tabela de Pedidos/Vendas

  1. Nova Tabela
    - `orders` (tabela principal de pedidos/vendas)
      - `id` (serial, primary key)
      - `customer` (jsonb, dados do cliente)
      - `items` (jsonb, itens do pedido)
      - `total` (numeric, valor total)
      - `frete` (numeric, valor do frete)
      - `paymentMethod` (varchar, método de pagamento)
      - `status` (varchar, status do pedido)
      - `created_at` (timestamp, data de criação)
      - `updated_at` (timestamp, data de atualização)

  2. Segurança
    - Enable RLS (Row Level Security)
    - Add policy for public access (vendas são públicas)
*/

-- Criar tabela de orders/vendas
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customer JSONB NOT NULL,
  items JSONB NOT NULL,
  total NUMERIC(10, 2) NOT NULL,
  frete NUMERIC(10, 2) DEFAULT 0,
  "paymentMethod" VARCHAR(50) DEFAULT 'pix',
  status VARCHAR(50) DEFAULT 'pending_confirmation',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_customer_name ON orders USING GIN(customer);

-- Ativar RLS (Row Level Security)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Política para leitura pública (vendas podem ser vistas por todos)
CREATE POLICY "Qualquer um pode ler pedidos de venda"
  ON orders
  FOR SELECT
  TO public
  USING (true);

-- Política para inserção pública (qualquer um pode criar pedidos)
CREATE POLICY "Qualquer um pode criar pedidos"
  ON orders
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Política para atualização pública (qualquer um pode atualizar seus pedidos)
CREATE POLICY "Qualquer um pode atualizar pedidos"
  ON orders
  FOR UPDATE
  TO public
  USING (true);

-- Política para deleção pública
CREATE POLICY "Qualquer um pode deletar pedidos"
  ON orders
  FOR DELETE
  TO public
  USING (true);

-- Criar trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_orders_updated_at ON orders;
CREATE TRIGGER trigger_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_orders_updated_at();
