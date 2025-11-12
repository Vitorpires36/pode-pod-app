// src/components/CheckoutDialog.tsx

import { useState, useEffect } from 'react';
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
import { Copy, Check, MessageCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { BairroSelector } from '@/components/BairroSelector';
import type { BairroSP } from '@/lib/bairros';

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
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState<'form' | 'pix'>('form');

  const pixKey = '5511948453681';

  useEffect(() => {
    if (open) {
      setName('');
      setPhone('');
      setEndereco('');
      setSelectedBairro(null);
      setStep('form');
    }
  }, [open]);

  const valorFrete = selectedBairro ? selectedBairro.valorBase : 0;
  const freteGratis = total >= 100;
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
      ? 'GRÁTIS (pedido acima de R$ 100)' 
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
          <DialogTitle className="text-foreground text-xl">
            {step === 'form' ? 'Finalizar Pedido' : 'Pagamento PIX'}
          </DialogTitle>
        </DialogHeader>

        {step === 'form' ? (
          <div className="space-y-4 py-4">
            {/* Dados Pessoais */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">Nome Completo</Label>
              <Input
                id="name"
                placeholder="Seu nome"
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

            {/* Seletor de Bairro */}
            <div className="border-t border-border pt-4">
              <BairroSelector 
                onSelect={setSelectedBairro}
                selectedBairro={selectedBairro}
              />
            </div>

            {/* Aviso Frete Grátis */}
            {!freteGratis && total < 100 && selectedBairro && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-lg">
                <div className="flex gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-yellow-600 dark:text-yellow-400">
                    Faltam R$ {(100 - total).toFixed(2)} para frete grátis!
                  </span>
                </div>
              </div>
            )}

            {freteGratis && (
              <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-lg">
                <p className="text-sm font-semibold text-green-600 dark:text-green-400 text-center">
                  🎉 Você ganhou FRETE GRÁTIS!
                </p>
              </div>
            )}

            {/* Resumo */}
            <div className="bg-muted p-4 rounded-lg space-y-2">
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
                    '–'
                  )}
                </span>
              </div>
              {selectedBairro && (
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Tempo estimado</span>
                  <span>~{selectedBairro.tempoEntregaMin} minutos</span>
                </div>
              )}
              <div className="border-t border-border pt-2 flex justify-between font-bold">
                <span className="text-foreground">Total</span>
                <span className="text-primary text-lg">R$ {totalComFrete.toFixed(2)}</span>
              </div>
            </div>

            <Button
              onClick={handleGeneratePix}
              disabled={!selectedBairro}
              className="w-full"
              size="lg"
            >
              Gerar PIX
            </Button>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="bg-muted p-6 rounded-lg text-center space-y-3">
              <div className="w-48 h-48 mx-auto bg-white rounded-lg flex items-center justify-center">
                <div className="text-6xl">📱</div>
              </div>
              <p className="text-sm text-muted-foreground">
                Escaneie o QR Code ou copie a chave PIX
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Chave PIX</Label>
              <div className="flex gap-2">
                <Input
                  value={pixKey}
                  readOnly
                  className="bg-background border-border text-foreground"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyPix}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg">
              <p className="text-sm font-semibold text-primary mb-1">
                Valor a pagar
              </p>
              <p className="text-2xl font-bold text-foreground">
                R$ {totalComFrete.toFixed(2)}
              </p>
            </div>

            <Button
              onClick={handleSendWhatsApp}
              className="w-full"
              size="lg"
              variant="whatsapp"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Confirmar Pagamento via WhatsApp
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Após realizar o pagamento, clique no botão acima para confirmar
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
