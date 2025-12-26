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
import {
  Copy,
  Check,
  MessageCircle,
  MapPin,
  Clock,
  Search,
  Truck,
  Star,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

import {
  BAIRROS_SP,
  ZONAS,
  getZonaColor,
  type BairroSP,
  calcularFrete,
  freteFullSpDisponivel,
  FRETE_FULL_SP_VALOR,
} from '@/lib/bairros';

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CheckoutDialog = ({ open, onOpenChange }: CheckoutDialogProps) => {
  const { cart, total, clearCart } = useCart();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [selectedBairro, setSelectedBairro] = useState<BairroSP | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZona, setSelectedZona] = useState('Todos');
  const [step, setStep] = useState<'form' | 'pix'>('form');
  const [tipoFrete, setTipoFrete] = useState<'FULL_SP' | 'DINAMICO'>('DINAMICO');

  const pixKey = '5511948453681';
  const freteGratis = total >= 300;

  useEffect(() => {
    if (freteFullSpDisponivel()) {
      setTipoFrete('FULL_SP');
    } else {
      setTipoFrete('DINAMICO');
    }
  }, []);

  const bairrosFiltrados = useMemo(() => {
    return BAIRROS_SP.filter(b =>
      b.nome.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedZona === 'Todos' || b.zona === selectedZona)
    ).sort((a, b) => a.distanciaKm - b.distanciaKm);
  }, [searchTerm, selectedZona]);

  const valorFrete = useMemo(() => {
    if (freteGratis) return 0;

    try {
      return calcularFrete(tipoFrete, {
        bairro: selectedBairro ?? undefined,
        valorProdutos: total,
      });
    } catch {
      return 0;
    }
  }, [tipoFrete, selectedBairro, total, freteGratis]);

  const totalComFrete = total + valorFrete;

  const handleGeneratePix = () => {
    if (!name || !phone || !endereco || !selectedBairro) {
      toast.error('Preencha todos os dados');
      return;
    }
    setStep('pix');
  };

  const handleSendWhatsApp = () => {
    const freteTexto = freteGratis
      ? 'GRÁTIS'
      : tipoFrete === 'FULL_SP'
      ? `FULL SP — R$ ${FRETE_FULL_SP_VALOR.toFixed(2)}`
      : `R$ ${valorFrete.toFixed(2)}`;

    const message =
      `🛍️ *Novo Pedido*\n\n` +
      `👤 ${name}\n📱 ${phone}\n📍 ${endereco}\n` +
      `🏘️ ${selectedBairro?.nome} (${selectedBairro?.zona})\n` +
      `🚚 Frete: ${freteTexto}\n` +
      `💰 Total: R$ ${totalComFrete.toFixed(2)}\n\n` +
      `Pagamento via PIX confirmado`;

    window.open(
      `https://wa.me/5511981878093?text=${encodeURIComponent(message)}`,
      '_blank'
    );

    clearCart();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" /> Finalizar Pedido
          </DialogTitle>
        </DialogHeader>

        {tipoFrete === 'FULL_SP' && (
          <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg flex items-center gap-2">
            <Zap className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-semibold text-blue-600">
              Frete FULL SP — Entrega hoje por R$ 15,00
            </span>
          </div>
        )}

        <Button onClick={handleGeneratePix} className="w-full">
          Continuar para PIX
        </Button>
      </DialogContent>
    </Dialog>
  );
};
