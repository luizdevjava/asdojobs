'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  Star, 
  Crown, 
  Check, 
  X, 
  Ban, 
  Trash2,
  Edit,
  Eye,
  LogOut,
  Menu,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  name?: string;
  banned: boolean;
  createdAt: string;
  _count: {
    anuncios: number;
  };
}

interface Anuncio {
  id: string;
  titulo: string;
  precoHora: number;
  cidade: string;
  bairro?: string;
  estrelas: number;
  destaque: boolean;
  ativo: boolean;
  createdAt: string;
  user: {
    id: string;
    name?: string;
    email: string;
  };
}

interface DestaquePedido {
  id: string;
  status: string;
  createdAt: string;
  anuncio: {
    id: string;
    titulo: string;
    precoHora: number;
    user: {
      name?: string;
      email: string;
    };
  };
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [destaquePedidos, setDestaquePedidos] = useState<DestaquePedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('usuarios');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, anunciosRes, destaquesRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/anuncios'),
        fetch('/api/destaques')
      ]);

      if (usersRes.ok) setUsers(await usersRes.json());
      if (anunciosRes.ok) setAnuncios(await anunciosRes.json());
      if (destaquesRes.ok) setDestaquePedidos(await destaquesRes.json());
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (userId: string, banned: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ banned })
      });

      if (response.ok) {
        setUsers(users.map(u => u.id === userId ? { ...u, banned } : u));
      }
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
    }
  };

  const handleUpdateAnuncio = async (anuncioId: string, data: any) => {
    try {
      const response = await fetch(`/api/admin/anuncios/${anuncioId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        setAnuncios(anuncios.map(a => a.id === anuncioId ? { ...a, ...data } : a));
      }
    } catch (error) {
      console.error('Erro ao atualizar anúncio:', error);
    }
  };

  const handleDeleteAnuncio = async (anuncioId: string) => {
    if (!confirm('Tem certeza que deseja excluir este anúncio?')) return;

    try {
      const response = await fetch(`/api/admin/anuncios/${anuncioId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setAnuncios(anuncios.filter(a => a.id !== anuncioId));
      }
    } catch (error) {
      console.error('Erro ao excluir anúncio:', error);
    }
  };

  const handleAprovarDestaque = async (pedidoId: string, anuncioId: string) => {
    try {
      const response = await fetch(`/api/admin/destaques/${pedidoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'aprovado' })
      });

      if (response.ok) {
        setDestaquePedidos(destaquePedidos.filter(p => p.id !== pedidoId));
        setAnuncios(anuncios.map(a => a.id === anuncioId ? { ...a, destaque: true } : a));
      }
    } catch (error) {
      console.error('Erro ao aprovar destaque:', error);
    }
  };

  const handleReprovarDestaque = async (pedidoId: string) => {
    try {
      const response = await fetch(`/api/admin/destaques/${pedidoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'negado' })
      });

      if (response.ok) {
        setDestaquePedidos(destaquePedidos.filter(p => p.id !== pedidoId));
      }
    } catch (error) {
      console.error('Erro ao reprovar destaque:', error);
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

  return (
    <div className="min-h-screen bg-background text-foreground blurry-bg">
      {/* Header */}
      <header className="glass-morphism sticky top-0 z-50 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center neon-glow">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <h1 className="text-2xl font-bold text-white neon-text">Painel Administrativo</h1>
            </div>
            
            <Link href="/">
              <Button variant="outline" className="neon-border hover:neon-hover">
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="glass-morphism">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">{users.length}</div>
              <div className="text-gray-400 text-sm">Total de Usuários</div>
            </CardContent>
          </Card>
          <Card className="glass-morphism">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">{anuncios.length}</div>
              <div className="text-gray-400 text-sm">Total de Anúncios</div>
            </CardContent>
          </Card>
          <Card className="glass-morphism">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {destaquePedidos.filter(p => p.status === 'pendente').length}
              </div>
              <div className="text-gray-400 text-sm">Solicitações Pendentes</div>
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
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="glass-morphism border-border">
            <TabsTrigger value="usuarios" className="data-[state=active]:bg-primary">
              <Users className="w-4 h-4 mr-2" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="anuncios" className="data-[state=active]:bg-primary">
              <FileText className="w-4 h-4 mr-2" />
              Anúncios
            </TabsTrigger>
            <TabsTrigger value="destaques" className="data-[state=active]:bg-primary">
              <Crown className="w-4 h-4 mr-2" />
              Solicitações de Destaque
            </TabsTrigger>
          </TabsList>

          {/* Usuários Tab */}
          <TabsContent value="usuarios">
            <Card className="glass-morphism">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white neon-text">
                  Gerenciar Usuários
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-4 text-gray-400">Usuário</th>
                        <th className="text-left p-4 text-gray-400">E-mail</th>
                        <th className="text-left p-4 text-gray-400">Anúncios</th>
                        <th className="text-left p-4 text-gray-400">Status</th>
                        <th className="text-left p-4 text-gray-400">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-border">
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarFallback className="bg-primary text-white">
                                  {user.name?.charAt(0).toUpperCase() || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-white">{user.name || 'Sem nome'}</span>
                            </div>
                          </td>
                          <td className="p-4 text-gray-300">{user.email}</td>
                          <td className="p-4 text-gray-300">{user._count.anuncios}</td>
                          <td className="p-4">
                            <Badge className={user.banned ? 'bg-red-600' : 'bg-green-600'}>
                              {user.banned ? 'Banido' : 'Ativo'}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <Button
                              variant={user.banned ? "default" : "destructive"}
                              size="sm"
                              onClick={() => handleBanUser(user.id, !user.banned)}
                            >
                              {user.banned ? (
                                <>
                                  <Check className="w-4 h-4 mr-1" />
                                  Desbanir
                                </>
                              ) : (
                                <>
                                  <Ban className="w-4 h-4 mr-1" />
                                  Banir
                                </>
                              )}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Anúncios Tab */}
          <TabsContent value="anuncios">
            <Card className="glass-morphism">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white neon-text">
                  Gerenciar Anúncios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {anuncios.map((anuncio) => (
                    <Card key={anuncio.id} className="glass-morphism">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-bold text-white neon-text truncate">
                            {anuncio.titulo}
                          </h3>
                          <div className="flex gap-1">
                            {renderStars(anuncio.estrelas)}
                          </div>
                        </div>
                        
                        <p className="text-gray-300 text-sm mb-2">
                          {anuncio.cidade}{anuncio.bairro && `, ${anuncio.bairro}`}
                        </p>
                        
                        <p className="text-primary font-bold mb-3">
                          R$ {anuncio.precoHora}/h
                        </p>

                        <div className="flex gap-2 mb-3">
                          <Badge className={anuncio.destaque ? 'bg-primary' : 'bg-gray-600'}>
                            {anuncio.destaque ? 'Destaque' : 'Normal'}
                          </Badge>
                          <Badge className={anuncio.ativo ? 'bg-green-600' : 'bg-red-600'}>
                            {anuncio.ativo ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </div>

                        <div className="text-xs text-gray-400 mb-3">
                          Por: {anuncio.user.name || anuncio.user.email}
                        </div>

                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <Select
                              value={anuncio.estrelas.toString()}
                              onValueChange={(value) => handleUpdateAnuncio(anuncio.id, { estrelas: parseInt(value) })}
                            >
                              <SelectTrigger className="flex-1 h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {[0, 1, 2, 3, 4, 5].map(star => (
                                  <SelectItem key={star} value={star.toString()}>
                                    {star} estrelas
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            
                            <Button
                              size="sm"
                              variant={anuncio.destaque ? "destructive" : "default"}
                              className="h-8 px-2"
                              onClick={() => handleUpdateAnuncio(anuncio.id, { destaque: !anuncio.destaque })}
                            >
                              <Crown className="w-3 h-3" />
                            </Button>
                          </div>
                          
                          <Button
                            variant="destructive"
                            size="sm"
                            className="w-full h-8"
                            onClick={() => handleDeleteAnuncio(anuncio.id)}
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Excluir
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Destaques Tab */}
          <TabsContent value="destaques">
            <Card className="glass-morphism">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white neon-text">
                  Solicitações de Destaque
                </CardTitle>
              </CardHeader>
              <CardContent>
                {destaquePedidos.length === 0 ? (
                  <div className="text-center py-12">
                    <Crown className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Nenhuma solicitação pendente
                    </h3>
                    <p className="text-gray-400">
                      Não há solicitações de destaque no momento
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {destaquePedidos.map((pedido) => (
                      <Card key={pedido.id} className="glass-morphism">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-bold text-white mb-1">
                                {pedido.anuncio.titulo}
                              </h3>
                              <p className="text-gray-300 text-sm mb-1">
                                Por: {pedido.anuncio.user.name || pedido.anuncio.user.email}
                              </p>
                              <p className="text-primary font-bold">
                                R$ {pedido.anuncio.precoHora}/h
                              </p>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleAprovarDestaque(pedido.id, pedido.anuncio.id)}
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Aprovar
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => handleReprovarDestaque(pedido.id)}
                              >
                                <X className="w-4 h-4 mr-1" />
                                Recusar
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}