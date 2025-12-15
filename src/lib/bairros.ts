// src/lib/bairros.ts

export interface BairroSP {
  nome: string;
  distanciaKm: number;
  zona: string;
  tempoEntregaMin: number;
  valorBase: number;
}

// =====================
// CONFIGURAÇÃO DE MARGEM
// =====================

// Valor fixo garantido por entrega (sua margem mínima)
export const MARGEM_FIXA_ENTREGA = 15;

// Percentual aplicado sobre o valor dos produtos
export const MARGEM_PERCENTUAL_PRODUTOS = 0.03; // 3%

// Teto máximo do percentual (protege o cliente)
export const TETO_PERCENTUAL_ENTREGA = 10;

// =====================
// DADOS DOS BAIRROS (SP)
// =====================
export const BAIRROS_SP: BairroSP[] = [
  // ZONA CENTRO
  { nome: "República", distanciaKm: 1.8, zona: "Centro", tempoEntregaMin: 8, valorBase: 12.50 },
  { nome: "Sé", distanciaKm: 2.1, zona: "Centro", tempoEntregaMin: 10, valorBase: 12.80 },
  { nome: "Santa Ifigênia", distanciaKm: 1.5, zona: "Centro", tempoEntregaMin: 7, valorBase: 12.10 },
  { nome: "Luz", distanciaKm: 2.3, zona: "Centro", tempoEntregaMin: 11, valorBase: 12.90 },
  { nome: "Bom Retiro", distanciaKm: 2.8, zona: "Centro", tempoEntregaMin: 13, valorBase: 13.50 },

  // ZONA OESTE
  { nome: "Vila Madalena", distanciaKm: 4.2, zona: "Oeste", tempoEntregaMin: 15, valorBase: 14.70 },
  { nome: "Pinheiros", distanciaKm: 4.8, zona: "Oeste", tempoEntregaMin: 18, valorBase: 15.30 },
  { nome: "Jardins", distanciaKm: 3.5, zona: "Oeste", tempoEntregaMin: 12, valorBase: 14.20 },
  { nome: "Itaim Bibi", distanciaKm: 5.2, zona: "Oeste", tempoEntregaMin: 20, valorBase: 16.40 },
  { nome: "Vila Olímpia", distanciaKm: 5.5, zona: "Oeste", tempoEntregaMin: 22, valorBase: 17.00 },
  { nome: "Brooklin", distanciaKm: 6.8, zona: "Oeste", tempoEntregaMin: 25, valorBase: 18.50 },

  // ZONA SUL
  { nome: "Vila Mariana", distanciaKm: 6.2, zona: "Sul", tempoEntregaMin: 23, valorBase: 16.90 },
  { nome: "Ipiranga", distanciaKm: 8.1, zona: "Sul", tempoEntregaMin: 30, valorBase: 18.90 },
  { nome: "Santo Amaro", distanciaKm: 9.5, zona: "Sul", tempoEntregaMin: 35, valorBase: 20.50 },
  { nome: "Saúde", distanciaKm: 7.3, zona: "Sul", tempoEntregaMin: 27, valorBase: 17.80 },
  { nome: "Campo Belo", distanciaKm: 7.8, zona: "Sul", tempoEntregaMin: 29, valorBase: 18.20 },
  { nome: "Jabaquara", distanciaKm: 10.2, zona: "Sul", tempoEntregaMin: 38, valorBase: 21.00 },

  // ZONA NORTE
  { nome: "Santana", distanciaKm: 6.3, zona: "Norte", tempoEntregaMin: 24, valorBase: 17.00 },
  { nome: "Tucuruvi", distanciaKm: 7.1, zona: "Norte", tempoEntregaMin: 26, valorBase: 17.90 },
  { nome: "Casa Verde", distanciaKm: 8.5, zona: "Norte", tempoEntregaMin: 32, valorBase: 19.20 },
  { nome: "Vila Guilherme", distanciaKm: 7.9, zona: "Norte", tempoEntregaMin: 30, valorBase: 18.70 },
  { nome: "Vila Maria", distanciaKm: 9.2, zona: "Norte", tempoEntregaMin: 34, valorBase: 19.80 },

  // ZONA LESTE
  { nome: "Tatuapé", distanciaKm: 8.7, zona: "Leste", tempoEntregaMin: 33, valorBase: 18.90 },
  { nome: "Vila Prudente", distanciaKm: 9.2, zona: "Leste", tempoEntregaMin: 35, valorBase: 19.30 },
  { nome: "Penha", distanciaKm: 10.8, zona: "Leste", tempoEntregaMin: 40, valorBase: 20.80 },
  { nome: "Carrão", distanciaKm: 9.8, zona: "Leste", tempoEntregaMin: 37, valorBase: 19.70 },
  { nome: "Vila Formosa", distanciaKm: 11.2, zona: "Leste", tempoEntregaMin: 42, valorBase: 21.20 },
];

export const ZONAS = ['Todas', 'Centro', 'Oeste', 'Sul', 'Norte', 'Leste'] as const;

// =====================
// FUNÇÕES UTILITÁRIAS
// =====================

export function getZonaColor(zona: string): string {
  const colors: Record<string, string> = {
    Centro: 'bg-purple-500',
    Oeste: 'bg-blue-500',
    Sul: 'bg-green-500',
    Norte: 'bg-red-500',
    Leste: 'bg-yellow-500',
  };
  return colors[zona] || 'bg-gray-500';
}

export function buscarBairroPorNome(nome: string): BairroSP | undefined {
  return BAIRROS_SP.find(
    b => b.nome.toLowerCase() === nome.toLowerCase()
  );
}

/**
 * Calcula o valor final da entrega (MODELO HÍBRIDO)
 */
export function calcularValorEntrega(
  bairro: BairroSP,
  valorProdutos: number
): number {
  const percentualCalculado = valorProdutos * MARGEM_PERCENTUAL_PRODUTOS;
  const percentualFinal = Math.min(
    percentualCalculado,
    TETO_PERCENTUAL_ENTREGA
  );

  return Number(
    (
      bairro.valorBase +
      MARGEM_FIXA_ENTREGA +
      percentualFinal
    ).toFixed(2)
  );
}
