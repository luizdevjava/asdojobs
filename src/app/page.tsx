'use client';

import { useState, useEffect } from 'react';
import { Star, MapPin, DollarSign, Heart, Search, Filter, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Anuncio {
  id: string;
  titulo: string;
  cidade: string;
  bairro?: string;
  precoHora: number;
  imagens: string;
  estrelas: number;
  destaque: boolean;
  user: {
    name?: string;
  };
}

const mockAnuncios: Anuncio[] = [
  {
    id: '1',
    titulo: 'Bella - Acompanante de Luxo',
    cidade: 'São Paulo',
    bairro: 'Jardins',
    precoHora: 500,
    imagens: '["https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop"]',
    estrelas: 5,
    destaque: true,
    user: { name: 'Bella' }
  },
  {
    id: '2',
    titulo: 'Maria - Massagem Relaxante',
    cidade: 'Rio de Janeiro',
    bairro: 'Copacabana',
    precoHora: 300,
    imagens: '["https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop"]',
    estrelas: 4,
    destaque: true,
    user: { name: 'Maria' }
  },
  {
    id: '3',
    titulo: 'Ana - Loira Sensual',
    cidade: 'São Paulo',
    bairro: 'Vila Madalena',
    precoHora: 400,
    imagens: '["https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop"]',
    estrelas: 5,
    destaque: false,
    user: { name: 'Ana' }
  },
  {
    id: '4',
    titulo: 'Carla - Morena Gata',
    cidade: 'Brasília',
    bairro: 'Asa Norte',
    precoHora: 350,
    imagens: '["https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=400&fit=crop"]',
    estrelas: 4,
    destaque: false,
    user: { name: 'Carla' }
  },
  {
    id: '5',
    titulo: 'Juliana - Ruiva Ardente',
    cidade: 'Belo Horizonte',
    bairro: 'Savassi',
    precoHora: 450,
    imagens: '["https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=400&fit=crop"]',
    estrelas: 5,
    destaque: false,
    user: { name: 'Juliana' }
  }
];

const tags = [
  'loira', 'novinha', 'acompanhante de luxo', 'massagem', 'ruiva', 'morena', 'gata', 'safada',
  'delicinha', 'tesuda', 'gostosa', 'peituda', 'bunda perfeita', 'sensual', 'carinhosa'
];

export default function Home() {
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [anunciosDestaque, setAnunciosDestaque] = useState<Anuncio[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cidadeFilter, setCidadeFilter] = useState('');
  const [precoMax, setPrecoMax] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setAnuncios(mockAnuncios);
    setAnunciosDestaque(mockAnuncios.filter(a => a.destaque));
  }, []);

  const filteredAnuncios = anuncios.filter(anuncio => {
    const matchesSearch = anuncio.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         anuncio.cidade.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCidade = !cidadeFilter || anuncio.cidade === cidadeFilter;
    const matchesPreco = !precoMax || anuncio.precoHora <= parseInt(precoMax);
    
    return matchesSearch && matchesCidade && matchesPreco && !anuncio.destaque;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-current star-rating' : 'text-gray-600'}`}
      />
    ));
  };

  const AnuncioCard = ({ anuncio, isDestaque = false }: { anuncio: Anuncio; isDestaque?: boolean }) => {
    const imagens = JSON.parse(anuncio.imagens || '[]');
    const primeiraImagem = imagens[0] || 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop';

    return (
      <Card className={`anuncio-card ${isDestaque ? 'neon-border' : ''} relative`}>
        {isDestaque && (
          <Badge className="absolute top-2 right-2 z-10 bg-primary text-primary-foreground neon-glow">
            DESTAQUE
          </Badge>
        )}
        <div className="relative overflow-hidden h-48">
          <img
            src={primeiraImagem}
            alt={anuncio.titulo}
            className="anuncio-image w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        <CardContent className="p-4">
          <h3 className="text-lg font-bold text-white mb-1 neon-text">{anuncio.titulo}</h3>
          <div className="flex items-center text-gray-300 text-sm mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            {anuncio.cidade}{anuncio.bairro && `, ${anuncio.bairro}`}
          </div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 mr-1 text-primary" />
              <span className="text-white font-bold">R$ {anuncio.precoHora}/h</span>
            </div>
            <div className="flex">
              {renderStars(anuncio.estrelas)}
            </div>
          </div>
          <div className="flex gap-2">
            <Button className="flex-1 bg-primary hover:bg-primary/90 neon-hover">
              Ver Perfil
            </Button>
            <Button variant="outline" size="icon" className="neon-border">
              <Heart className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground blurry-bg">
      {/* Header */}
      <header className="glass-morphism sticky top-0 z-50 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center neon-glow">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <h1 className="text-2xl font-bold text-white neon-text">Acompanhantes</h1>
            </div>
            
            <nav className="hidden md:flex items-center space-x-4">
              <Button 
                variant="outline" 
                className="neon-border hover:neon-hover"
                onClick={() => window.location.href = '/login'}
              >
                <User className="w-4 h-4 mr-2" />
                Login
              </Button>
              <Button 
                className="bg-primary hover:bg-primary/90 neon-hover"
                onClick={() => window.location.href = '/register'}
              >
                Anunciar
              </Button>
            </nav>

            <Button
              variant="ghost"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 space-y-2">
              <Button 
                variant="outline" 
                className="w-full neon-border"
                onClick={() => window.location.href = '/login'}
              >
                <User className="w-4 h-4 mr-2" />
                Login
              </Button>
              <Button 
                className="w-full bg-primary hover:bg-primary/90"
                onClick={() => window.location.href = '/register'}
              >
                Anunciar
              </Button>
            </nav>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Tag Cloud */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4 neon-text">Categorias Populares</h2>
          <div className="tag-cloud">
            {tags.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* Filtros */}
        <section className="mb-8">
          <Card className="glass-morphism">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 glass-morphism border-border"
                  />
                </div>
                <Select value={cidadeFilter} onValueChange={setCidadeFilter}>
                  <SelectTrigger className="glass-morphism border-border">
                    <SelectValue placeholder="Cidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas</SelectItem>
                    <SelectItem value="São Paulo">São Paulo</SelectItem>
                    <SelectItem value="Rio de Janeiro">Rio de Janeiro</SelectItem>
                    <SelectItem value="Brasília">Brasília</SelectItem>
                    <SelectItem value="Belo Horizonte">Belo Horizonte</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Preço máximo"
                  type="number"
                  value={precoMax}
                  onChange={(e) => setPrecoMax(e.target.value)}
                  className="glass-morphism border-border"
                />
                <Button className="bg-primary hover:bg-primary/90 neon-hover">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtrar
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Anúncios em Destaque */}
        {anunciosDestaque.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 neon-text">Anúncios em Destaque</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {anunciosDestaque.map((anuncio) => (
                <AnuncioCard key={anuncio.id} anuncio={anuncio} isDestaque />
              ))}
            </div>
          </section>
        )}

        {/* Demais Anúncios */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6 neon-text">Todos os Anúncios</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAnuncios.map((anuncio) => (
              <AnuncioCard key={anuncio.id} anuncio={anuncio} />
            ))}
          </div>
          
          {filteredAnuncios.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">Nenhum anúncio encontrado com os filtros selecionados.</p>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="glass-morphism border-t border-border mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold text-white mb-4 neon-text">Acompanhantes</h3>
              <p className="text-gray-400 text-sm">
                A melhor plataforma para encontrar acompanhantes de luxo em sua cidade.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Links Rápidos</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-primary transition-colors">Sobre Nós</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Como Funciona</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacidade</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Cidades</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-primary transition-colors">São Paulo</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Rio de Janeiro</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Brasília</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Belo Horizonte</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Contato</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>suporte@acompanhantes.com</li>
                <li>WhatsApp: (11) 99999-9999</li>
                <li>Atendimento 24/7</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 Acompanhantes. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}