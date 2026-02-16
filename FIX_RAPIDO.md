# ⚡ FIX RÁPIDO - 5 MINUTOS

## 🎯 Você Precisa Fazer Isso Agora:

### 1️⃣ Executar a Migração SQL no Neon

Copie todo Este SQL e execute no seu banco:

```sql
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

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_customer_name ON orders USING GIN(customer);

-- Ativar RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "Qualquer um pode ler pedidos" ON orders FOR SELECT TO public USING (true);
CREATE POLICY "Qualquer um pode criar pedidos" ON orders FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Qualquer um pode atualizar pedidos" ON orders FOR UPDATE TO public USING (true);
CREATE POLICY "Qualquer um pode deletar pedidos" ON orders FOR DELETE TO public USING (true);

-- Trigger para atualizar updated_at
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
```

### ONDE EXECUTAR?

**Opção A (Preferida - via Supabase):**
1. Acesse: https://supabase.com
2. Login
3. Abra seu projeto
4. Clique em **SQL Editor** (lado esquerdo)
5. Clique em **New Query**
6. Cole o SQL acima
7. Clique em **Run**
8. Aguarde verde ✅

**Opção B (via Vercel):**
Se configurou direto no Vercel, fazer redeploy:
1. https://vercel.com/dashboard
2. Seu projeto (`pode-pod-app`)
3. Clique **Redeploy**

### 2️⃣ Fazer Deploy no Vercel

```bash
# Se quiser fazer from terminal:
cd /Users/maikao/pode-pod-app-backup
git push origin main  # Já fiz, mas confirme
```

Depois:
1. https://vercel.com/dashboard
2. Selecione `pode-pod-app` 
3. Clique em **Deployments**
4. Se não estiver atualizando, clique **Redeploy**

### 3️⃣ Testar

```bash
# Abra um terminal e rode:
curl -X POST "https://pode-pod-app.vercel.app/api/sales" \
  -H "Content-Type: application/json" \
  -d '{"customer":{"name":"Test"},"items":[],"total":100}'
```

✅ **Se retornar `{"success":true}` = FUNCIONANDO!**  
❌ **Se retornar erro = falta executar SQL**

---

## STATUS ATUAL

```
✅ Problema identificado: tabela orders não existe
✅ Código encontrado: api/index.ts
✅ Migração SQL criada: supabase/migrations/20260216_create_orders_table.sql
✅ Commit feito: c4300e8
✅ Push para GitHub: done
⏳ Você precisa executar SQL no banco
⏳ Você precisa fazer deploy no Vercel
⏳ Testar se vendas funcionam
```

---

**Precisa de ajuda? Me chama!** 🚀
