import express, { Request, Response } from 'express';
import cors from 'cors';
import { NeonDatabase } from './lib/database';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/products', async (req: Request, res: Response) => {
  try {
    const products = await NeonDatabase.query('SELECT * FROM products ORDER BY name');
    res.json(products);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

app.post('/api/products', async (req: Request, res: Response) => {
  try {
    const products = Array.isArray(req.body) ? req.body : [req.body];
    
    for (const p of products) {
      await NeonDatabase.query(`
        INSERT INTO products (id, name, description, price, image, category, brand, puffs, "inStock", flavors)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          price = EXCLUDED.price,
          image = EXCLUDED.image,
          category = EXCLUDED.category,
          brand = EXCLUDED.brand,
          puffs = EXCLUDED.puffs,
          "inStock" = EXCLUDED."inStock",
          flavors = EXCLUDED.flavors;
      `, [
        p.id, p.name, p.description, p.price, p.image, p.category, p.brand, p.puffs, p.inStock, p.flavors
      ]);
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao salvar produtos:', error);
    res.status(500).json({ error: 'Erro ao salvar produtos' });
  }
});

app.get('/api/bairros', async (req: Request, res: Response) => {
  try {
    const bairros = await NeonDatabase.query('SELECT * FROM bairros ORDER BY nome');
    res.json(bairros);
  } catch (error) {
    console.error('Erro ao buscar bairros:', error);
    res.status(500).json({ error: 'Erro ao buscar bairros' });
  }
});

app.post('/api/bairros', async (req: Request, res: Response) => {
  try {
    const bairros = Array.isArray(req.body) ? req.body : [req.body];
    
    for (const b of bairros) {
      await NeonDatabase.query(`
        INSERT INTO bairros (nome, "distanciaKm", zona, "tempoEntregaMin", "valorBase")
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (nome) DO UPDATE SET
          "distanciaKm" = EXCLUDED."distanciaKm",
          zona = EXCLUDED.zona,
          "tempoEntregaMin" = EXCLUDED."tempoEntregaMin",
          "valorBase" = EXCLUDED."valorBase";
      `, [
        b.nome, b.distanciaKm, b.zona, b.tempoEntregaMin, b.valorBase
      ]);
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao salvar bairros:', error);
    res.status(500).json({ error: 'Erro ao salvar bairros' });
  }
});

// Orders / Sales
app.post('/api/sales', async (req: Request, res: Response) => {
  try {
    const { customer, customer_name, items, total, frete, paymentMethod, status, sale_date } = req.body;

    // Normalize customer: can be object or string
    const customerObj = (typeof customer === 'string' && customer.length)
      ? { name: customer }
      : (customer && typeof customer === 'object') ? customer : { name: customer_name || null };

    // Normalize items: accept array or JSON string
    let itemsJson: any = items;
    if (typeof items === 'string') {
      try { itemsJson = JSON.parse(items); } catch { itemsJson = [] }
    }

    const custName = customer_name || (customerObj && customerObj.name) || null;

    await NeonDatabase.query(`
      INSERT INTO orders (customer, items, total, frete, "paymentMethod", status, customer_name, sale_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      JSON.stringify(customerObj),
      JSON.stringify(itemsJson),
      total || 0,
      frete || 0,
      paymentMethod || null,
      status || 'pending',
      custName,
      sale_date || null
    ]);

    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao salvar pedido:', error);
    res.status(500).json({ error: 'Erro ao salvar pedido' });
  }
});

// Get sales (orders)
app.get('/api/sales', async (req: Request, res: Response) => {
  try {
    const rows = await NeonDatabase.query(`
      SELECT id, customer, customer_name, items, total, frete, "paymentMethod", status, sale_date, created_at
      FROM orders
      ORDER BY created_at DESC
      LIMIT 500
    `);
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    res.status(500).json({ error: 'Erro ao buscar pedidos' });
  }
});

// Freight Logic
function calcularDistanciaSimulada(origem: string, destino: string): number {
  const hashOrigem = origem.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hashDestino = destino.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const distancia = Math.abs(hashOrigem - hashDestino) / 10;

  return Math.max(0.5, Math.min(distancia, 50));
}

function gerarDistanciaAleatoria(): number {
  return Math.random() * 20 + 1;
}

function calcularDuracao(distanciaKm: number): number {
  return distanciaKm * 2.5;
}

function calcularPreco(distanciaKm: number): number {
  let preco = 5 + distanciaKm * 2.5;

  if (preco < 10) {
    preco = 10;
  }

  preco *= 1.15;

  return Math.round(preco * 100) / 100;
}

app.get('/api/frete', (req: Request, res: Response) => {
  try {
    const { origem, destino } = req.query;

    let distanciaKm: number;

    if (origem && destino && typeof origem === 'string' && typeof destino === 'string') {
      distanciaKm = calcularDistanciaSimulada(origem, destino);
    } else {
      distanciaKm = gerarDistanciaAleatoria();
    }

    const duracaoMin = calcularDuracao(distanciaKm);
    const preco = calcularPreco(distanciaKm);

    const resultado = {
      distanciaKm: Math.round(distanciaKm * 10) / 10,
      duracaoMin: Math.round(duracaoMin),
      preco: preco
    };

    console.log(`📦 Frete calculado: ${resultado.distanciaKm}km - R$ ${resultado.preco}`);

    res.json(resultado);

  } catch (error: any) {
    console.error('❌ Erro ao calcular frete:', error.message);
    res.status(500).json({
      erro: 'Erro ao calcular frete',
      mensagem: error.message
    });
  }
});

app.get('/health', async (req: Request, res: Response) => {
  let dbStatus = 'unknown';
  try {
    await NeonDatabase.query('SELECT 1');
    dbStatus = 'connected';
  } catch (error) {
    dbStatus = 'error';
    console.error('DB Health Check Failed:', error);
  }

  res.json({
    status: 'ok',
    servidor: 'API de Frete (Neon DB)',
    versao: '2.0.0',
    database: dbStatus
  });
});

export default app;
