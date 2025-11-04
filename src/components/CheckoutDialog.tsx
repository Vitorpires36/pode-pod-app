import { useState } from 'react';
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
import { Copy, Check, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CheckoutDialog = ({ open, onOpenChange }: CheckoutDialogProps) => {
  const { cart, total, clearCart } = useCart();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState<'form' | 'pix'>('form');

  const pixKey = 'podepod@pix.com.br'; // Chave PIX fictícia

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    toast.success('Chave PIX copiada!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGeneratePix = () => {
    if (!name || !phone || !address) {
      toast.error('Preencha todos os campos!');
      return;
    }
    setStep('pix');
  };

  const handleSendWhatsApp = () => {
    const message = `🛍️ *Novo Pedido - PODE POD*\n\n` +
      `👤 *Nome:* ${name}\n` +
      `📱 *Telefone:* ${phone}\n` +
      `📍 *Endereço:* ${address}\n\n` +
      `*Produtos:*\n` +
      cart.map(item => 
        `• ${item.quantity}x ${item.name}${item.selectedFlavor ? ` (${item.selectedFlavor})` : ''} - R$ ${(item.price * item.quantity).toFixed(2)}`
      ).join('\n') +
      `\n\n💰 *Total:* R$ ${total.toFixed(2)}\n\n` +
      `✅ Pagamento via PIX confirmado!`;

    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    clearCart();
    onOpenChange(false);
    setStep('form');
    toast.success('Pedido enviado! Aguarde o contato.');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground text-xl">
            {step === 'form' ? 'Finalizar Pedido' : 'Pagamento PIX'}
          </DialogTitle>
        </DialogHeader>

        {step === 'form' ? (
          <div className="space-y-4 py-4">
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
              <Label htmlFor="address" className="text-foreground">Endereço de Entrega</Label>
              <Input
                id="address"
                placeholder="Rua, número, bairro"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="bg-background border-border text-foreground"
              />
            </div>

            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold text-foreground">R$ {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Entrega</span>
                <span className="font-semibold text-foreground">Grátis</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between font-bold">
                <span className="text-foreground">Total</span>
                <span className="text-primary text-lg">R$ {total.toFixed(2)}</span>
              </div>
            </div>

            <Button
              onClick={handleGeneratePix}
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
                R$ {total.toFixed(2)}
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
