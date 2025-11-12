// src/lib/bairros.ts

export interface BairroSP {
  nome: string;
  distanciaKm: number;
  zona: string;
  tempoEntregaMin: number;
  valorBase: number;
}

export const BAIRROS_SP: BairroSP[] = [
  // ZONA CENTRO (0-3km)
  { nome: "República", distanciaKm: 1.8, zona: "Centro", tempoEntregaMin: 8, valorBase: 13.24 },
  { nome: "Sé", distanciaKm: 2.1, zona: "Centro", tempoEntregaMin: 10, valorBase: 13.78 },
  { nome: "Santa Ifigênia", distanciaKm: 1.5, zona: "Centro", tempoEntregaMin: 7, valorBase: 12.70 },
  { nome: "Luz", distanciaKm: 2.3, zona: "Centro", tempoEntregaMin: 11, valorBase: 14.14 },
  { nome: "Bom Retiro", distanciaKm: 2.8, zona: "Centro", tempoEntregaMin: 13, valorBase: 15.04 },
  
  // ZONA OESTE (2-8km)
  { nome: "Vila Madalena", distanciaKm: 4.2, zona: "Oeste", tempoEntregaMin: 15, valorBase: 17.56 },
  { nome: "Pinheiros", distanciaKm: 4.8, zona: "Oeste", tempoEntregaMin: 18, valorBase: 18.64 },
  { nome: "Jardins", distanciaKm: 3.5, zona: "Oeste", tempoEntregaMin: 12, valorBase: 16.30 },
  { nome: "Itaim Bibi", distanciaKm: 5.2, zona: "Oeste", tempoEntregaMin: 20, valorBase: 19.36 },
  { nome: "Vila Olímpia", distanciaKm: 5.5, zona: "Oeste", tempoEntregaMin: 22, valorBase: 19.90 },
  { nome: "Brooklin", distanciaKm: 6.8, zona: "Oeste", tempoEntregaMin: 25, valorBase: 22.24 },
  
  // ZONA SUL (5-12km)
  { nome: "Vila Mariana", distanciaKm: 6.2, zona: "Sul", tempoEntregaMin: 23, valorBase: 21.16 },
  { nome: "Ipiranga", distanciaKm: 8.1, zona: "Sul", tempoEntregaMin: 30, valorBase: 24.58 },
  { nome: "Santo Amaro", distanciaKm: 9.5, zona: "Sul", tempoEntregaMin: 35, valorBase: 27.10 },
  { nome: "Saúde", distanciaKm: 7.3, zona: "Sul", tempoEntregaMin: 27, valorBase: 23.14 },
  { nome: "Campo Belo", distanciaKm: 7.8, zona: "Sul", tempoEntregaMin: 29, valorBase: 24.04 },
  { nome: "Jabaquara", distanciaKm: 10.2, zona: "Sul", tempoEntregaMin: 38, valorBase: 28.36 },
  
  // ZONA NORTE (4-10km)
  { nome: "Santana", distanciaKm: 6.3, zona: "Norte", tempoEntregaMin: 24, valorBase: 21.34 },
  { nome: "Tucuruvi", distanciaKm: 7.1, zona: "Norte", tempoEntregaMin: 26, valorBase: 22.78 },
  { nome: "Casa Verde", distanciaKm: 8.5, zona: "Norte", tempoEntregaMin: 32, valorBase: 25.30 },
  { nome: "Vila Guilherme", distanciaKm: 7.9, zona: "Norte", tempoEntregaMin: 30, valorBase: 24.22 },
  { nome: "Vila Maria", distanciaKm: 9.2, zona: "Norte", tempoEntregaMin: 34, valorBase: 26.56 },
  
  // ZONA LESTE (6-15km)
  { nome: "Tatuapé", distanciaKm: 8.7, zona: "Leste", tempoEntregaMin: 33, valorBase: 25.66 },
  { nome: "Vila Prudente", distanciaKm: 9.2, zona: "Leste", tempoEntregaMin: 35, valorBase: 26.56 },
  { nome: "Penha", distanciaKm: 10.8, zona: "Leste", tempoEntregaMin: 40, valorBase: 29.44 },
  { nome: "Carrão", distanciaKm: 9.8, zona: "Leste", tempoEntregaMin: 37, valorBase: 27.64 },
  { nome: "Vila Formosa", distanciaKm: 11.2, zona: "Leste", tempoEntregaMin: 42, valorBase: 30.16 },
];

export const ZONAS = ['Todas', 'Centro', 'Oeste', 'Sul', 'Norte', 'Leste'] as const;

export function getZonaColor(zona: string): string {
  const colors: Record<string, string> = {
    'Centro': 'bg-purple-500',
    'Oeste': 'bg-blue-500',
    'Sul': 'bg-green-500',
    'Norte': 'bg-red-500',
    'Leste': 'bg-yellow-500'
  };
  return colors[zona] || 'bg-gray-500';
}

export function buscarBairroPorNome(nome: string): BairroSP | undefined {
  return BAIRROS_SP.find(b => b.nome.toLowerCase() === nome.toLowerCase());
}
