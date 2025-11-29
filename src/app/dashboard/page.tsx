'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Star, 
  MapPin, 
  DollarSign, 
  Eye, 
  Heart,
  LogOut,
  User,
  Crown,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';

interface Anuncio {
  id: string;
  titulo: string;
  descricao: string;
  precoHora: number;
  cidade: string;
  bairro?: string;
  imagens: string;
  estrelas: number;
  destaque: boolean;
  ativo: boolean;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    fetchAnuncios(parsedUser.id);
  }, [router]);

  const fetchAnuncios = async (userId: string) => {
    try {
      const response = await fetch(`/api/anuncios?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setAnuncios(data);
      }
    } catch (error) {
      console.error('Erro ao buscar anúncios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  const handleDeleteAnuncio = async (anuncioId: string) => {
    if (!confirm('Tem certeza que deseja excluir este anúncio?')) {
      return;
    }

    try {
      const response = await fetch(`/api/anuncios/${anuncioId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setAnuncios(anuncios.filter(a => a.id !== anuncioId));
      }
    } catch (error) {
      console.error('Erro ao excluir anúncio:', error);
    }
  };

  const handleSolicitarDestaque = async (anuncioId: string) => {
    try {
      const response = await fetch('/api/destaques', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ anuncioId })
      });

      if (response.ok) {
        alert('Solicitação de destaque enviada com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao solicitar destaque:', error);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-current star-rating' : 'text-gray-600'}`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground blurry-bg">
      {/* Header */}
      <header className="glass-morphism sticky top-0 z-50 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center neon-glow">
                  <span className="text-white font-bold text-xl">A</span>
                </div>
                <h1 className="text-2xl font-bold text-white neon-text">Painel</h1>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarFallback className="bg-primary text-white">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="text-white hidden md:block">{user.name || user.email}</span>
              </div>
              <Button 
                variant="outline" 
                className="neon-border hover:neon-hover"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Card */}
        <Card className="glass-morphism mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2 neon-text">
                  Bem-vinda, {user.name || 'Anunciante'}!
                </h2>
                <p className="text-gray-400">
                  Gerencie seus anúncios e acompanhe seu desempenho
                </p>
              </div>
              <Button 
                className="bg-primary hover:bg-primary/90 neon-hover"
                onClick={() => router.push('/dashboard/novo-anuncio')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Anúncio
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="glass-morphism">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">{anuncios.length}</div>
              <div className="text-gray-400 text-sm">Total de Anúncios</div>
            </CardContent>
          </Card>
          <Card className="glass-morphism">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {anuncios.filter(a => a.ativo).length}
              </div>
              <div className="text-gray-400 text-sm">Anúncios Ativos</div>
            </CardContent>
          </Card>
          <Card className="glass-morphism">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {anuncios.filter(a => a.destaque).length}
              </div>
              <div className="text-gray-400 text-sm">Anúncios em Destaque</div>
            </CardContent>
          </Card>
          <Card className="glass-morphism">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {anuncios.reduce((acc, a) => acc + a.estrelas, 0) / (anuncios.length || 1)}
              </div>
              <div className="text-gray-400 text-sm">Média de Estrelas</div>
            </CardContent>
          </Card>
        </div>

        {/* Anúncios */}
        <Card className="glass-morphism">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white neon-text">
              Meus Anúncios
            </CardTitle>
          </CardHeader>
          <CardContent>
            {anuncios.length === 0 ? (
              <div className="text-center py-12">
                <ImageIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Nenhum anúncio ainda
                </h3>
                <p className="text-gray-400 mb-6">
                  Crie seu primeiro anúncio para começar a receber clientes
                </p>
                <Button 
                  className="bg-primary hover:bg-primary/90 neon-hover"
                  onClick={() => router.push('/dashboard/novo-anuncio')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeiro Anúncio
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {anuncios.map((anuncio) => {
                  const imagens = JSON.parse(anuncio.imagens || '[]');
                  const primeiraImagem = imagens[0] || 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop';

                  return (
                    <Card key={anuncio.id} className="glass-morphism overflow-hidden">
                      <div className="relative">
                        <img
                          src={primeiraImagem}
                          alt={anuncio.titulo}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        
                        {/* Status Badges */}
                        <div className="absolute top-2 left-2 flex gap-2">
                          {anuncio.destaque && (
                            <Badge className="bg-primary text-primary-foreground neon-glow">
                              <Crown className="w-3 h-3 mr-1" />
                              Destaque
                            </Badge>
                          )}
                          <Badge className={anuncio.ativo ? 'bg-green-600' : 'bg-red-600'}>
                            {anuncio.ativo ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </div>
                      </div>
                      
                      <CardContent className="p-4">
                        <h3 className="text-lg font-bold text-white mb-1 neon-text">
                          {anuncio.titulo}
                        </h3>
                        
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
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 neon-border"
                            onClick={() => router.push(`/dashboard/editar-anuncio/${anuncio.id}`)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Editar
                          </Button>
                          
                          {!anuncio.destaque && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="neon-border"
                              onClick={() => handleSolicitarDestaque(anuncio.id)}
                            >
                              <Crown className="w-4 h-4" />
                            </Button>
                          )}
                          
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive border-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteAnuncio(anuncio.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}