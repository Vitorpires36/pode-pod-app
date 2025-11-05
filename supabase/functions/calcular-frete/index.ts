const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface FreteResponse {
  distanciaKm: number;
  duracaoMin: number;
  preco: number;
}

function calcularDistanciaSimulada(origem: string, destino: string): number {
  const hashOrigem = origem
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hashDestino = destino
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

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

  preco = Math.round(preco * 100) / 100;

  return preco;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(req.url);
    const origem = url.searchParams.get("origem");
    const destino = url.searchParams.get("destino");

    let distanciaKm: number;

    if (origem && destino) {
      distanciaKm = calcularDistanciaSimulada(origem, destino);
    } else {
      distanciaKm = gerarDistanciaAleatoria();
    }

    const duracaoMin = calcularDuracao(distanciaKm);
    const preco = calcularPreco(distanciaKm);

    const resultado: FreteResponse = {
      distanciaKm: Math.round(distanciaKm * 10) / 10,
      duracaoMin: Math.round(duracaoMin),
      preco: preco,
    };

    return new Response(JSON.stringify(resultado), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";

    return new Response(
      JSON.stringify({
        erro: "Erro ao calcular frete",
        mensagem: errorMessage,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
