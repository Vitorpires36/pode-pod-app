import { useState } from 'react';
import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { Chatbot } from '@/components/Chatbot';
import { products } from '@/lib/products';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const [filter, setFilter] = useState<'all' | 'pod' | 'juice'>('all');

  const filteredProducts = products.filter(
    product => filter === 'all' || product.category === filter
  );

  const podProducts = products.filter(p => p.category === 'pod');
  const juiceProducts = products.filter(p => p.category === 'juice');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Banner de Aviso */}
      <div className="bg-muted text-foreground py-3 px-4 text-center">
        <p className="text-sm font-light italic">
          ⚠️ Proibida venda para menores de 18 anos • Produto contém nicotina
        </p>
      </div>

      {/* Conteúdo Principal */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-card">
            <TabsTrigger value="all" onClick={() => setFilter('all')}>
              Todos ({products.length})
            </TabsTrigger>
            <TabsTrigger value="pods" onClick={() => setFilter('pod')}>
              Pods ({podProducts.length})
            </TabsTrigger>
            <TabsTrigger value="juices" onClick={() => setFilter('juice')}>
              Juices ({juiceProducts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pods" className="mt-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {podProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="juices" className="mt-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {juiceProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">Nenhum produto encontrado</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-black text-white text-center py-6 mt-12 border-t-2 border-primary">
        <p className="text-sm">
          © 2024 PODE POD - Todos os direitos reservados
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Venda proibida para menores de 18 anos
        </p>
      </footer>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
};

export default Index;
