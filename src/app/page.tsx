'use client';

import { useState, useEffect } from 'react';
import { Star, MapPin, DollarSign, Heart, Search, Filter, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';

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
        className={`w-4 h-4 ${i < rating ? 'fill-current' : 'text-gray-600'}`}
        style={{ color: '#ff0033' }}
      />
    ));
  };

  const AnuncioCard = ({ anuncio, isDestaque = false }: { anuncio: Anuncio; isDestaque?: boolean }) => {
    const imagens = JSON.parse(anuncio.imagens || '[]');
    const primeiraImagem = imagens[0] || 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop';

    return (
      <Card 
        className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
          isDestaque ? 'ring-2 ring-red-500' : ''
        }`}
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        {isDestaque && (
          <Badge 
            className="absolute top-2 right-2 z-10" 
            style={{ backgroundColor: '#ff0033' }}
          >
            DESTAQUE
          </Badge>
        )}
        <div className="relative overflow-hidden h-48">
          <img
            src={primeiraImagem}
            alt={anuncio.titulo}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        <CardContent className="p-4">
          <h3 
            className="text-lg font-bold mb-1"
            style={{ 
              color: '#f8f8f8',
              textShadow: '0 0 10px rgba(255, 0, 51, 0.8)'
            }}
          >
            {anuncio.titulo}
          </h3>
          <div className="flex items-center text-gray-300 text-sm mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            {anuncio.cidade}{anuncio.bairro && `, ${anuncio.bairro}`}
          </div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 mr-1" style={{ color: '#ff0033' }} />
              <span className="font-bold" style={{ color: '#f8f8f8' }}>
                R$ {anuncio.precoHora}/h
              </span>
            </div>
            <div className="flex">
              {renderStars(anuncio.estrelas)}
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              className="flex-1 hover:shadow-lg transition-shadow"
              style={{ backgroundColor: '#ff0033' }}
            >
              Ver Perfil
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              style={{ borderColor: '#ff0033' }}
            >
              <Heart className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundColor: '#0a0a0a',
        color: '#f8f8f8',
        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255, 0, 51, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 0, 51, 0.2) 0%, transparent 50%), radial-gradient(circle at 40% 20%, rgba(255, 0, 51, 0.2) 0%, transparent 50%)'
      }}
    >
      {/* Header */}
      <header 
        className="sticky top-0 z-50 border-b"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          borderBottomColor: 'rgba(255, 255, 255, 0.1)'
        }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ 
                  backgroundColor: '#ff0033',
                  boxShadow: '0 0 20px rgba(255, 0, 51, 0.5)'
                }}
              >
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <h1 
                className="text-2xl font-bold"
                style={{ 
                  color: '#f8f8f8',
                  textShadow: '0 0 10px rgba(255, 0, 51, 0.8)'
                }}
              >
                Acompanhantes
              </h1>
            </div>
            
            <nav className="hidden md:flex items-center space-x-4">
              <Link href="/login">
                <Button 
                  variant="outline"
                  style={{ borderColor: '#ff0033' }}
                  className="hover:shadow-lg transition-shadow"
                >
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button 
                  style={{ backgroundColor: '#ff0033' }}
                  className="hover:shadow-lg transition-shadow"
                >
                  Anunciar
                </Button>
              </Link>
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
              <Link href="/login">
                <Button 
                  variant="outline" 
                  className="w-full"
                  style={{ borderColor: '#ff0033' }}
                >
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button 
                  className="w-full"
                  style={{ backgroundColor: '#ff0033' }}
                >
                  Anunciar
                </Button>
              </Link>
            </nav>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Tag Cloud */}
        <section className="mb-12">
          <h2 
            className="text-xl font-bold mb-4"
            style={{ 
              color: '#f8f8f8',
              textShadow: '0 0 10px rgba(255, 0, 51, 0.8)'
            }}
          >
            Categorias Populares
          </h2>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span 
                key={index} 
                className="inline-block px-3 py-1 text-xs rounded-full cursor-pointer transition-all duration-300 hover:shadow-lg"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#ff0033';
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(255, 0, 51, 0.3)';
                  e.currentTarget.style.background = 'rgba(255, 0, 51, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* Filtros */}
        <section className="mb-8">
          <Card
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderColor: 'rgba(255, 255, 255, 0.1)'
                    }}
                  />
                </div>
                <Select value={cidadeFilter} onValueChange={setCidadeFilter}>
                  <SelectTrigger 
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderColor: 'rgba(255, 255, 255, 0.1)'
                    }}
                  >
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
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'rgba(255, 255, 255, 0.1)'
                  }}
                />
                <Button 
                  style={{ backgroundColor: '#ff0033' }}
                  className="hover:shadow-lg transition-shadow"
                >
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
            <h2 
              className="text-2xl font-bold mb-6"
              style={{ 
                color: '#f8f8f8',
                textShadow: '0 0 10px rgba(255, 0, 51, 0.8)'
              }}
            >
              Anúncios em Destaque
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {anunciosDestaque.map((anuncio) => (
                <AnuncioCard key={anuncio.id} anuncio={anuncio} isDestaque />
              ))}
            </div>
          </section>
        )}

        {/* Demais Anúncios */}
        <section>
          <h2 
            className="text-2xl font-bold mb-6"
            style={{ 
              color: '#f8f8f8',
              textShadow: '0 0 10px rgba(255, 0, 51, 0.8)'
            }}
          >
            Todos os Anúncios
          </h2>
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
      <footer 
        className="border-t mt-16"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          borderTopColor: 'rgba(255, 255, 255, 0.1)'
        }}
      >
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 
                className="text-lg font-bold mb-4"
                style={{ 
                  color: '#f8f8f8',
                  textShadow: '0 0 10px rgba(255, 0, 51, 0.8)'
                }}
              >
                Acompanhantes
              </h3>
              <p className="text-gray-400 text-sm">
                A melhor plataforma para encontrar acompanhantes de luxo em sua cidade.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Links Rápidos</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-red-500 transition-colors">Sobre Nós</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors">Como Funciona</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors">Privacidade</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Cidades</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-red-500 transition-colors">São Paulo</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors">Rio de Janeiro</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors">Brasília</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors">Belo Horizonte</a></li>
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
          <div 
            className="border-t mt-8 pt-8 text-center text-gray-400 text-sm"
            style={{ borderTopColor: 'rgba(255, 255, 255, 0.1)' }}
          >
            <p>© 2024 Acompanhantes. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}