// src/components/CheckoutDialog.tsx

import { useState, useEffect, useMemo } from 'react';
import { useCart } from '@/contexts/CartContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Check, MessageCircle, AlertCircle, MapPin, Clock, Search, Truck, Star, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// ==================== DADOS COMPLETOS DOS BAIRROS ====================
interface BairroSP {
  nome: string;
  distanciaKm: number;
  zona: string;
  tempoEntregaMin: number;
  valorBase: number;
}

// Fórmula para cálculo do frete baseado na distância
const calcularFretePorDistancia = (distanciaKm: number): number => {
  const valorBase = 8.00; // Valor base para até 2km
  const valorPorKm = 1.20; // Valor adicional por km
  
  if (distanciaKm <= 2) {
    return valorBase;
  }
  
  const valorCalculado = valorBase + (distanciaKm - 2) * valorPorKm;
  return Math.min(valorCalculado, 35.00); // Valor máximo do frete
};

const calcularTempoEntrega = (distanciaKm: number): number => {
  const tempoBase = 15; // minutos base
  const tempoPorKm = 2.5; // minutos adicionais por km
  
  return Math.min(tempoBase + Math.round(distanciaKm * tempoPorKm), 120); // Máximo 120 minutos
};

// LISTA COMPLETA DE TODOS OS BAIRROS/DISTRITOS DE SÃO PAULO
const BAIRROS_SP: BairroSP[] = [
  // ZONA CENTRO EXPANDIDO (32 bairros)
  { nome: "Sé", distanciaKm: 1.0, zona: "Centro", tempoEntregaMin: 15, valorBase: 8.00 },
  { nome: "República", distanciaKm: 1.2, zona: "Centro", tempoEntregaMin: 16, valorBase: 8.24 },
  { nome: "Santa Ifigênia", distanciaKm: 1.3, zona: "Centro", tempoEntregaMin: 17, valorBase: 8.36 },
  { nome: "Liberdade", distanciaKm: 1.5, zona: "Centro", tempoEntregaMin: 18, valorBase: 8.60 },
  { nome: "Bela Vista", distanciaKm: 1.8, zona: "Centro", tempoEntregaMin: 19, valorBase: 8.96 },
  { nome: "Consolação", distanciaKm: 2.1, zona: "Centro", tempoEntregaMin: 20, valorBase: 9.32 },
  { nome: "Cambuci", distanciaKm: 2.3, zona: "Centro", tempoEntregaMin: 21, valorBase: 9.56 },
  { nome: "Bom Retiro", distanciaKm: 2.5, zona: "Centro", tempoEntregaMin: 22, valorBase: 9.80 },
  { nome: "Brás", distanciaKm: 2.8, zona: "Centro", tempoEntregaMin: 23, valorBase: 10.16 },
  { nome: "Pari", distanciaKm: 3.1, zona: "Centro", tempoEntregaMin: 24, valorBase: 10.52 },
  { nome: "Barra Funda", distanciaKm: 3.3, zona: "Centro", tempoEntregaMin: 25, valorBase: 10.76 },
  { nome: "Água Branca", distanciaKm: 3.6, zona: "Centro", tempoEntregaMin: 26, valorBase: 11.12 },
  { nome: "Perdizes", distanciaKm: 3.8, zona: "Centro", tempoEntregaMin: 27, valorBase: 11.36 },
  { nome: "Vila Buarque", distanciaKm: 2.0, zona: "Centro", tempoEntregaMin: 19, valorBase: 8.00 },
  { nome: "Higienópolis", distanciaKm: 2.2, zona: "Centro", tempoEntregaMin: 20, valorBase: 9.44 },
  { nome: "Pacaembu", distanciaKm: 2.7, zona: "Centro", tempoEntregaMin: 22, valorBase: 10.04 },
  { nome: "Vila Mariana", distanciaKm: 4.2, zona: "Centro", tempoEntregaMin: 28, valorBase: 11.84 },
  { nome: "Aclimação", distanciaKm: 3.5, zona: "Centro", tempoEntregaMin: 26, valorBase: 11.00 },
  { nome: "Paraíso", distanciaKm: 3.2, zona: "Centro", tempoEntregaMin: 25, valorBase: 10.64 },
  { nome: "Vila Clementino", distanciaKm: 4.5, zona: "Centro", tempoEntregaMin: 29, valorBase: 12.20 },
  { nome: "Ipiranga", distanciaKm: 5.8, zona: "Centro", tempoEntregaMin: 33, valorBase: 13.76 },
  { nome: "Sacomã", distanciaKm: 6.2, zona: "Centro", tempoEntregaMin: 34, valorBase: 14.24 },
  { nome: "Vila Prudente", distanciaKm: 7.1, zona: "Centro", tempoEntregaMin: 37, valorBase: 15.32 },
  { nome: "Mooca", distanciaKm: 4.8, zona: "Centro", tempoEntregaMin: 31, valorBase: 12.56 },
  { nome: "Belém", distanciaKm: 5.2, zona: "Centro", tempoEntregaMin: 32, valorBase: 12.92 },
  { nome: "Tatuapé", distanciaKm: 6.5, zona: "Centro", tempoEntregaMin: 35, valorBase: 14.20 },
  { nome: "Carrão", distanciaKm: 7.3, zona: "Centro", tempoEntregaMin: 38, valorBase: 15.56 },
  { nome: "Vila Formosa", distanciaKm: 8.1, zona: "Centro", tempoEntregaMin: 40, valorBase: 16.52 },
  { nome: "Água Rasa", distanciaKm: 4.1, zona: "Centro", tempoEntregaMin: 29, valorBase: 11.72 },
  { nome: "Vila Guilherme", distanciaKm: 7.8, zona: "Centro", tempoEntregaMin: 39, valorBase: 16.16 },
  { nome: "Vila Maria", distanciaKm: 8.5, zona: "Centro", tempoEntregaMin: 41, valorBase: 16.60 },
  { nome: "Vila Medeiros", distanciaKm: 9.2, zona: "Centro", tempoEntregaMin: 43, valorBase: 17.84 },

  // ZONA OESTE (18 bairros)
  { nome: "Pinheiros", distanciaKm: 5.5, zona: "Oeste", tempoEntregaMin: 34, valorBase: 13.40 },
  { nome: "Vila Madalena", distanciaKm: 6.1, zona: "Oeste", tempoEntregaMin: 35, valorBase: 13.72 },
  { nome: "Jardim Paulista", distanciaKm: 4.9, zona: "Oeste", tempoEntregaMin: 32, valorBase: 12.68 },
  { nome: "Jardim América", distanciaKm: 5.3, zona: "Oeste", tempoEntregaMin: 33, valorBase: 12.92 },
  { nome: "Itaim Bibi", distanciaKm: 6.8, zona: "Oeste", tempoEntregaMin: 37, valorBase: 14.96 },
  { nome: "Vila Olímpia", distanciaKm: 7.2, zona: "Oeste", tempoEntregaMin: 38, valorBase: 15.04 },
  { nome: "Morumbi", distanciaKm: 9.5, zona: "Oeste", tempoEntregaMin: 43, valorBase: 17.00 },
  { nome: "Alto de Pinheiros", distanciaKm: 6.5, zona: "Oeste", tempoEntregaMin: 35, valorBase: 14.20 },
  { nome: "Lapa", distanciaKm: 5.8, zona: "Oeste", tempoEntregaMin: 34, valorBase: 13.76 },
  { nome: "Vila Leopoldina", distanciaKm: 7.5, zona: "Oeste", tempoEntregaMin: 39, valorBase: 15.80 },
  { nome: "Jaguara", distanciaKm: 8.3, zona: "Oeste", tempoEntregaMin: 41, valorBase: 16.16 },
  { nome: "Jaguaré", distanciaKm: 8.9, zona: "Oeste", tempoEntregaMin: 42, valorBase: 16.88 },
  { nome: "Butantã", distanciaKm: 9.8, zona: "Oeste", tempoEntregaMin: 44, valorBase: 17.96 },
  { nome: "Rio Pequeno", distanciaKm: 11.2, zona: "Oeste", tempoEntregaMin: 48, valorBase: 19.04 },
  { nome: "Raposo Tavares", distanciaKm: 12.5, zona: "Oeste", tempoEntregaMin: 51, valorBase: 20.60 },
  { nome: "Vila Sônia", distanciaKm: 10.3, zona: "Oeste", tempoEntregaMin: 45, valorBase: 18.56 },
  { nome: "Jardim Bonfiglioli", distanciaKm: 9.1, zona: "Oeste", tempoEntregaMin: 43, valorBase: 17.72 },
  { nome: "City Butantã", distanciaKm: 10.8, zona: "Oeste", tempoEntregaMin: 47, valorBase: 19.16 },

  // ZONA SUL (28 bairros)
  { nome: "Moema", distanciaKm: 6.3, zona: "Sul", tempoEntregaMin: 36, valorBase: 14.36 },
  { nome: "Indianópolis", distanciaKm: 6.8, zona: "Sul", tempoEntregaMin: 37, valorBase: 14.96 },
  { nome: "Saúde", distanciaKm: 5.6, zona: "Sul", tempoEntregaMin: 34, valorBase: 13.52 },
  { nome: "Jardim Paulistano", distanciaKm: 5.1, zona: "Sul", tempoEntregaMin: 33, valorBase: 12.92 },
  { nome: "Campo Belo", distanciaKm: 7.4, zona: "Sul", tempoEntregaMin: 39, valorBase: 15.68 },
  { nome: "Brooklin", distanciaKm: 7.1, zona: "Sul", tempoEntregaMin: 38, valorBase: 15.32 },
  { nome: "Santo Amaro", distanciaKm: 10.2, zona: "Sul", tempoEntregaMin: 45, valorBase: 18.44 },
  { nome: "Jabaquara", distanciaKm: 8.7, zona: "Sul", tempoEntregaMin: 42, valorBase: 17.24 },
  { nome: "Cursino", distanciaKm: 7.8, zona: "Sul", tempoEntregaMin: 40, valorBase: 16.16 },
  { nome: "Jardim São Luís", distanciaKm: 13.5, zona: "Sul", tempoEntregaMin: 53, valorBase: 21.80 },
  { nome: "Campo Grande", distanciaKm: 12.8, zona: "Sul", tempoEntregaMin: 51, valorBase: 20.96 },
  { nome: "Pedreira", distanciaKm: 14.2, zona: "Sul", tempoEntregaMin: 55, valorBase: 22.64 },
  { nome: "Cidade Ademar", distanciaKm: 15.8, zona: "Sul", tempoEntregaMin: 59, valorBase: 24.56 },
  { nome: "Capão Redondo", distanciaKm: 17.5, zona: "Sul", tempoEntregaMin: 63, valorBase: 26.60 },
  { nome: "Jardim Ângela", distanciaKm: 19.2, zona: "Sul", tempoEntregaMin: 67, valorBase: 28.64 },
  { nome: "Grajaú", distanciaKm: 22.8, zona: "Sul", tempoEntregaMin: 75, valorBase: 32.96 },
  { nome: "Socorro", distanciaKm: 16.3, zona: "Sul", tempoEntregaMin: 60, valorBase: 25.16 },
  { nome: "Cidade Dutra", distanciaKm: 18.7, zona: "Sul", tempoEntregaMin: 66, valorBase: 28.04 },
  { nome: "Interlagos", distanciaKm: 17.9, zona: "Sul", tempoEntregaMin: 64, valorBase: 27.08 },
  { nome: "Jardim Planalto", distanciaKm: 15.2, zona: "Sul", tempoEntregaMin: 58, valorBase: 23.84 },
  { nome: "Parque do Carmo", distanciaKm: 13.8, zona: "Sul", tempoEntregaMin: 54, valorBase: 22.16 },
  { nome: "Itaim Paulista", distanciaKm: 16.8, zona: "Sul", tempoEntregaMin: 62, valorBase: 26.48 },
  { nome: "Jardim Helena", distanciaKm: 17.3, zona: "Sul", tempoEntregaMin: 63, valorBase: 26.96 },
  { nome: "São Mateus", distanciaKm: 16.1, zona: "Sul", tempoEntregaMin: 60, valorBase: 24.92 },
  { nome: "São Rafael", distanciaKm: 14.9, zona: "Sul", tempoEntregaMin: 57, valorBase: 23.48 },
  { nome: "Jardim Iguatemi", distanciaKm: 18.2, zona: "Sul", tempoEntregaMin: 65, valorBase: 27.44 },
  { nome: "Cidade Tiradentes", distanciaKm: 20.5, zona: "Sul", tempoEntregaMin: 70, valorBase: 30.20 },
  { nome: "Guaianases", distanciaKm: 19.8, zona: "Sul", tempoEntregaMin: 68, valorBase: 29.36 },

  // ZONA NORTE (22 bairros)
  { nome: "Santana", distanciaKm: 6.8, zona: "Norte", tempoEntregaMin: 37, valorBase: 14.96 },
  { nome: "Tucuruvi", distanciaKm: 7.5, zona: "Norte", tempoEntregaMin: 39, valorBase: 15.80 },
  { nome: "Jardim São Paulo", distanciaKm: 7.2, zona: "Norte", tempoEntregaMin: 38, valorBase: 15.32 },
  { nome: "Casa Verde", distanciaKm: 8.9, zona: "Norte", tempoEntregaMin: 42, valorBase: 16.88 },
  { nome: "Vila Maria", distanciaKm: 9.6, zona: "Norte", tempoEntregaMin: 44, valorBase: 17.72 },
  { nome: "Vila Guilherme", distanciaKm: 8.4, zona: "Norte", tempoEntregaMin: 41, valorBase: 16.52 },
  { nome: "Vila Medeiros", distanciaKm: 10.3, zona: "Norte", tempoEntregaMin: 45, valorBase: 18.56 },
  { nome: "Jardim França", distanciaKm: 11.1, zona: "Norte", tempoEntregaMin: 47, valorBase: 19.16 },
  { nome: "Parada Inglesa", distanciaKm: 9.1, zona: "Norte", tempoEntregaMin: 43, valorBase: 17.72 },
  { nome: "Imirim", distanciaKm: 10.8, zona: "Norte", tempoEntregaMin: 46, valorBase: 19.16 },
  { nome: "Vila Sabrina", distanciaKm: 9.8, zona: "Norte", tempoEntregaMin: 44, valorBase: 18.56 },
  { nome: "Água Fria", distanciaKm: 8.2, zona: "Norte", tempoEntregaMin: 40, valorBase: 16.64 },
  { nome: "Carandiru", distanciaKm: 7.8, zona: "Norte", tempoEntregaMin: 39, valorBase: 16.16 },
  { nome: "Jardim Cabuçu", distanciaKm: 12.5, zona: "Norte", tempoEntregaMin: 50, valorBase: 20.60 },
  { nome: "Parque Novo Mundo", distanciaKm: 11.8, zona: "Norte", tempoEntregaMin: 48, valorBase: 19.76 },
  { nome: "Vila Penteado", distanciaKm: 10.5, zona: "Norte", tempoEntregaMin: 45, valorBase: 18.20 },
  { nome: "Jardim Fontalis", distanciaKm: 13.2, zona: "Norte", tempoEntregaMin: 52, valorBase: 21.44 },
  { nome: "Vila Barbosa", distanciaKm: 9.3, zona: "Norte", tempoEntregaMin: 43, valorBase: 17.96 },
  { nome: "Vila Ede", distanciaKm: 8.7, zona: "Norte", tempoEntregaMin: 42, valorBase: 17.24 },
  { nome: "Vila Nivi", distanciaKm: 11.5, zona: "Norte", tempoEntregaMin: 47, valorBase: 19.40 },
  { nome: "Vila Santista", distanciaKm: 10.1, zona: "Norte", tempoEntregaMin: 44, valorBase: 18.32 },
  { nome: "Vila Zatt", distanciaKm: 12.1, zona: "Norte", tempoEntregaMin: 49, valorBase: 20.12 },

  // ZONA LESTE (26 bairros)
  { nome: "Tatuapé", distanciaKm: 7.6, zona: "Leste", tempoEntregaMin: 39, valorBase: 15.92 },
  { nome: "Carrão", distanciaKm: 8.3, zona: "Leste", tempoEntregaMin: 41, valorBase: 16.52 },
  { nome: "Vila Formosa", distanciaKm: 9.1, zona: "Leste", tempoEntregaMin: 43, valorBase: 17.48 },
  { nome: "Vila Prudente", distanciaKm: 9.8, zona: "Leste", tempoEntregaMin: 45, valorBase: 18.56 },
  { nome: "Sapopemba", distanciaKm: 12.8, zona: "Leste", tempoEntregaMin: 51, valorBase: 20.96 },
  { nome: "Penha", distanciaKm: 11.2, zona: "Leste", tempoEntregaMin: 48, valorBase: 19.04 },
  { nome: "Artur Alvim", distanciaKm: 13.5, zona: "Leste", tempoEntregaMin: 53, valorBase: 21.80 },
  { nome: "Cidade Líder", distanciaKm: 14.3, zona: "Leste", tempoEntregaMin: 55, valorBase: 22.76 },
  { nome: "Itaquera", distanciaKm: 16.2, zona: "Leste", tempoEntregaMin: 60, valorBase: 25.04 },
  { nome: "São Mateus", distanciaKm: 17.1, zona: "Leste", tempoEntregaMin: 62, valorBase: 26.12 },
  { nome: "Cidade Tiradentes", distanciaKm: 19.8, zona: "Leste", tempoEntregaMin: 68, valorBase: 29.36 },
  { nome: "Guaianases", distanciaKm: 18.5, zona: "Leste", tempoEntregaMin: 66, valorBase: 27.80 },
  { nome: "Ermelino Matarazzo", distanciaKm: 15.2, zona: "Leste", tempoEntregaMin: 58, valorBase: 23.84 },
  { nome: "São Miguel Paulista", distanciaKm: 16.8, zona: "Leste", tempoEntregaMin: 62, valorBase: 26.48 },
  { nome: "Itaim Paulista", distanciaKm: 17.5, zona: "Leste", tempoEntregaMin: 63, valorBase: 26.60 },
  { nome: "Jardim Helena", distanciaKm: 18.9, zona: "Leste", tempoEntregaMin: 67, valorBase: 28.28 },
  { nome: "Aricanduva", distanciaKm: 10.5, zona: "Leste", tempoEntregaMin: 46, valorBase: 18.20 },
  { nome: "Vila Matilde", distanciaKm: 9.3, zona: "Leste", tempoEntregaMin: 43, valorBase: 17.96 },
  { nome: "Cidade Patriarca", distanciaKm: 12.1, zona: "Leste", tempoEntregaMin: 49, valorBase: 20.12 },
  { nome: "São Rafael", distanciaKm: 11.8, zona: "Leste", tempoEntregaMin: 48, valorBase: 19.76 },
  { nome: "Jardim Iguatemi", distanciaKm: 14.8, zona: "Leste", tempoEntregaMin: 57, valorBase: 23.36 },
  { nome: "Cidade Nova Heliópolis", distanciaKm: 8.6, zona: "Leste", tempoEntregaMin: 42, valorBase: 17.12 },
  { nome: "Vila Jacuí", distanciaKm: 13.8, zona: "Leste", tempoEntregaMin: 54, valorBase: 22.16 },
  { nome: "Jardim Nove de Julho", distanciaKm: 15.6, zona: "Leste", tempoEntregaMin: 59, valorBase: 24.32 },
  { nome: "Parque São Lucas", distanciaKm: 10.2, zona: "Leste", tempoEntregaMin: 45, valorBase: 18.44 },
  { nome: "Vila Aricanduva", distanciaKm: 11.5, zona: "Leste", tempoEntregaMin: 47, valorBase: 19.40 }
].map(bairro => ({
  ...bairro,
  valorBase: calcularFretePorDistancia(bairro.distanciaKm),
  tempoEntregaMin: calcularTempoEntrega(bairro.distanciaKm)
}));

const ZONAS = ['Todos', 'Centro', 'Oeste', 'Sul', 'Norte', 'Leste'];

const getZonaColor = (zona: string): string => {
  const colors: Record<string, string> = {
    'Centro': 'bg-purple-500',
    'Oeste': 'bg-blue-500',
    'Sul': 'bg-green-500',
    'Norte': 'bg-red-500',
    'Leste': 'bg-yellow-500'
  };
  return colors[zona] || 'bg-gray-500';
};

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CheckoutDialog = ({ open, onOpenChange }: CheckoutDialogProps) => {
  const { cart, total, clearCart } = useCart();
  
  // Estados
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [selectedBairro, setSelectedBairro] = useState<BairroSP | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZona, setSelectedZona] = useState('Todos');
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState<'form' | 'pix'>('form');

  const pixKey = '5511948453681';

  // Reset ao abrir
  useEffect(() => {
    if (open) {
      setName('');
      setPhone('');
      setEndereco('');
      setSelectedBairro(null);
      setSearchTerm('');
      setSelectedZona('Todos');
      setStep('form');
    }
  }, [open]);

  // Filtrar bairros
  const bairrosFiltrados = useMemo(() => {
    return BAIRROS_SP.filter(bairro => {
      const matchSearch = bairro.nome.toLowerCase().includes(searchTerm.toLowerCase());
      const matchZona = selectedZona === 'Todos' || bairro.zona === selectedZona;
      return matchSearch && matchZona;
    }).sort((a, b) => a.distanciaKm - b.distanciaKm);
  }, [searchTerm, selectedZona]);

  // Cálculos
  const valorFrete = selectedBairro ? selectedBairro.valorBase : 0;
  const freteGratis = total >= 300;
  const totalComFrete = freteGratis ? total : total + valorFrete;

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    toast.success('Chave PIX copiada!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGeneratePix = () => {
    if (!name || !phone || !endereco) {
      toast.error('Preencha todos os campos!');
      return;
    }
    if (!selectedBairro) {
      toast.error('Selecione seu bairro!');
      return;
    }
    setStep('pix');
  };

  const handleSendWhatsApp = () => {
    const freteTexto = freteGratis 
      ? 'GRÁTIS (pedido acima de R$ 300)' 
      : `R$ ${valorFrete.toFixed(2)}`;

    const message = `🛍️ *Novo Pedido - PODE POD*\n\n` +
      `👤 *Nome:* ${name}\n` +
      `📱 *Telefone:* ${phone}\n` +
      `📍 *Endereço:* ${endereco}\n` +
      `🏘️ *Bairro:* ${selectedBairro?.nome} (${selectedBairro?.zona})\n` +
      `📏 *Distância:* ${selectedBairro?.distanciaKm.toFixed(1)} km\n` +
      `🚚 *Prazo Entrega:* ~${selectedBairro?.tempoEntregaMin} minutos\n\n` +
      `*Produtos:*\n` +
      cart.map(item =>
        `• ${item.quantity}x ${item.name}${item.selectedFlavor ? ` (${item.selectedFlavor})` : ''} - R$ ${(item.price * item.quantity).toFixed(2)}`
      ).join('\n') +
      `\n\n*Resumo:*\n` +
      `💳 Subtotal: R$ ${total.toFixed(2)}\n` +
      `🚚 Frete: ${freteTexto}\n` +
      `💰 *Total:* R$ ${totalComFrete.toFixed(2)}\n\n` +
      `✅ Pagamento via PIX confirmado!`;

    const whatsappUrl = `https://wa.me/5511981878093?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    clearCart();
    onOpenChange(false);
    setStep('form');
    toast.success('Pedido enviado! Aguarde o contato.');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground text-xl flex items-center gap-2">
            {step === 'form' ? (
              <>
                <Truck className="h-5 w-5" />
                Finalizar Pedido - Entrega em SP
              </>
            ) : (
              <>
                <Zap className="h-5 w-5" />
                Pagamento PIX
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        {step === 'form' ? (
          <div className="space-y-4 py-4">
            {/* Dados Pessoais */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">Nome Completo</Label>
              <Input
                id="name"
                placeholder="Seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-background border-border text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-foreground">Telefone</Label>
              <Input
                id="phone"
                placeholder="(11) 99999-9999"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-background border-border text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endereco" className="text-foreground">
                Endereço Completo (Rua, Número, Complemento)
              </Label>
              <Input
                id="endereco"
                placeholder="Rua Exemplo, 123, Apto 45"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                className="bg-background border-border text-foreground"
              />
            </div>

            {/* SELETOR DE BAIRRO */}
            <div className="border-t border-border pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-foreground text-lg font-semibold">
                  Selecione seu Bairro
                </Label>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  {bairrosFiltrados.length} de {BAIRROS_SP.length} bairros
                </span>
              </div>
              
              {/* Busca */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar bairro pelo nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background border-border text-foreground"
                />
              </div>

              {/* Filtro por Zona */}
              <div className="flex flex-wrap gap-2">
                {ZONAS.map(zona => (
                  <Button
                    key={zona}
                    onClick={() => setSelectedZona(zona)}
                    variant={selectedZona === zona ? 'default' : 'outline'}
                    size="sm"
                    className="text-xs"
                  >
                    {zona}
                  </Button>
                ))}
              </div>

              {/* Lista de Bairros */}
              <div className="border border-border rounded-lg max-h-[300px] overflow-y-auto bg-card">
                {bairrosFiltrados.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhum bairro encontrado</p>
                    <p className="text-sm">Tente buscar com outro termo ou zona</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {bairrosFiltrados.map((bairro) => (
                      <button
                        key={bairro.nome}
                        onClick={() => setSelectedBairro(bairro)}
                        className={cn(
                          "w-full p-3 text-left transition-all hover:bg-muted/50",
                          selectedBairro?.nome === bairro.nome && "bg-primary/10 border-l-4 border-primary"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-sm font-semibold text-foreground truncate">
                                {bairro.nome}
                              </h3>
                              <span className={cn(
                                "px-2 py-0.5 text-xs rounded-full text-white flex-shrink-0",
                                getZonaColor(bairro.zona)
                              )}>
                                {bairro.zona}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {bairro.distanciaKm.toFixed(1)} km
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                ~{bairro.tempoEntregaMin} min
                              </span>
                            </div>
                          </div>
                          <div className="text-right ml-3 flex-shrink-0">
                            <div className="text-base font-bold text-primary">
                              R$ {bairro.valorBase.toFixed(2)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              frete
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Bairro Selecionado */}
              {selectedBairro && (
                <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="h-4 w-4 text-primary" />
                    <p className="text-sm font-semibold text-primary">
                      Bairro Selecionado
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-base font-bold text-foreground">
                        {selectedBairro.nome}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {selectedBairro.distanciaKm.toFixed(1)} km
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          ~{selectedBairro.tempoEntregaMin} min
                        </span>
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-white text-xs",
                          getZonaColor(selectedBairro.zona)
                        )}>
                          {selectedBairro.zona}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Valor do frete</p>
                      <p className="text-lg font-bold text-primary">
                        R$ {selectedBairro.valorBase.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Avisos Frete */}
            {!freteGratis && total < 300 && selectedBairro && (
              <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg">
                <div className="flex gap-2">
                  <Star className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                      Faltam R$ {(300 - total).toFixed(2)} para frete grátis!
                    </span>
                    <p className="text-xs text-amber-600/80 dark:text-amber-400/80 mt-1">
                      Adicione mais itens ao carrinho e ganhe frete grátis
                    </p>
                  </div>
                </div>
              </div>
            )}

            {freteGratis && (
              <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-lg">
                <div className="flex items-center gap-2 justify-center">
                  <Check className="h-4 w-4 text-green-500" />
                  <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                    🎉 Parabéns! Você ganhou FRETE GRÁTIS!
                  </p>
                </div>
              </div>
            )}

            {/* Resumo do Pedido */}
            <div className="bg-muted/50 p-4 rounded-lg space-y-3 border">
              <h3 className="font-semibold text-foreground text-sm">Resumo do Pedido</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold text-foreground">R$ {total.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Entrega</span>
                  <span className="font-semibold text-foreground">
                    {selectedBairro ? (
                      freteGratis ? (
                        <span className="text-green-500 font-bold">GRÁTIS</span>
                      ) : (
                        `R$ ${valorFrete.toFixed(2)}`
                      )
                    ) : (
                      <span className="text-muted-foreground">Selecione o bairro</span>
                    )}
                  </span>
                </div>

                {selectedBairro && (
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Tempo estimado</span>
                    <span>~{selectedBairro.tempoEntregaMin} minutos</span>
                  </div>
                )}
              </div>

              <div className="border-t border-border pt-2 flex justify-between items-center">
                <span className="text-foreground font-bold">Total</span>
                <span className="text-primary text-lg font-bold">R$ {totalComFrete.toFixed(2)}</span>
              </div>
            </div>

            <Button
              onClick={handleGeneratePix}
              disabled={!selectedBairro}
              className="w-full"
              size="lg"
            >
              <Check className="mr-2 h-5 w-5" />
              Continuar para PIX
            </Button>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="bg-muted p-6 rounded-lg text-center space-y-3">
              <div className="w-48 h-48 mx-auto bg-white rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/20">
                <div className="text-center">
                  <div className="text-4xl mb-2">📱</div>
                  <p className="text-xs text-muted-foreground">QR Code PIX</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Escaneie o QR Code ou copie a chave PIX abaixo
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Chave PIX (Telefone)</Label>
              <div className="flex gap-2">
                <Input
                  value={pixKey}
                  readOnly
                  className="bg-background border-border text-foreground font-mono"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyPix}
                  className="flex-shrink-0"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg">
              <p className="text-sm font-semibold text-primary mb-1">
                Valor total a pagar
              </p>
              <p className="text-2xl font-bold text-foreground">
                R$ {totalComFrete.toFixed(2)}
              </p>
              {freteGratis && (
                <p className="text-xs text-green-500 mt-1">
                  ✓ Frete grátis incluído
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleSendWhatsApp}
                className="w-full"
                size="lg"
                variant="default"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Confirmar Pagamento via WhatsApp
              </Button>

              <Button
                onClick={() => setStep('form')}
                variant="outline"
                className="w-full"
              >
                Voltar para Dados
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Após realizar o pagamento PIX, clique no botão acima para confirmar seu pedido
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
