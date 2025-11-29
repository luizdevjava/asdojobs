'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, X, Image as ImageIcon, DollarSign, MapPin, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  email: string;
}

export default function NovoAnuncioPage() {
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    precoHora: '',
    cidade: '',
    bairro: ''
  });
  const [imagens, setImagens] = useState<string[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (imagens.length + files.length > 3) {
      setError('Máximo de 3 imagens permitidas');
      return;
    }

    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        setError('Cada imagem deve ter no máximo 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImagens(prev => [...prev, result]);
        setPreviews(prev => [...prev, result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImagens(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!user) {
      setError('Usuário não autenticado');
      setIsLoading(false);
      return;
    }

    if (imagens.length === 0) {
      setError('Adicione pelo menos uma imagem');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/anuncios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          titulo: formData.titulo,
          descricao: formData.descricao,
          precoHora: parseFloat(formData.precoHora),
          cidade: formData.cidade,
          bairro: formData.bairro,
          imagens: JSON.stringify(imagens)
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/dashboard');
      } else {
        setError(data.error || 'Erro ao criar anúncio');
      }
    } catch (error) {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

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
              <Link href="/dashboard" className="flex items-center text-gray-400 hover:text-primary transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Link>
              <h1 className="text-2xl font-bold text-white neon-text">Criar Anúncio</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white neon-text">
                Informações do Anúncio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Título */}
                <div>
                  <Label htmlFor="titulo" className="text-white">Título do Anúncio</Label>
                  <Input
                    id="titulo"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleInputChange}
                    placeholder="Ex: Bella - Acompanhante de Luxo"
                    className="glass-morphism border-border mt-1"
                    required
                  />
                </div>

                {/* Descrição */}
                <div>
                  <Label htmlFor="descricao" className="text-white">Descrição</Label>
                  <Textarea
                    id="descricao"
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleInputChange}
                    placeholder="Descreva seus serviços, características, etc..."
                    className="glass-morphism border-border mt-1 min-h-[120px]"
                    required
                  />
                </div>

                {/* Preço e Localização */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="precoHora" className="text-white">Preço por Hora</Label>
                    <div className="relative mt-1">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="precoHora"
                        name="precoHora"
                        type="number"
                        value={formData.precoHora}
                        onChange={handleInputChange}
                        placeholder="300"
                        className="glass-morphism border-border pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="cidade" className="text-white">Cidade</Label>
                    <div className="relative mt-1">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="cidade"
                        name="cidade"
                        value={formData.cidade}
                        onChange={handleInputChange}
                        placeholder="São Paulo"
                        className="glass-morphism border-border pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="bairro" className="text-white">Bairro (opcional)</Label>
                  <Input
                    id="bairro"
                    name="bairro"
                    value={formData.bairro}
                    onChange={handleInputChange}
                    placeholder="Jardins"
                    className="glass-morphism border-border mt-1"
                  />
                </div>

                {/* Upload de Imagens */}
                <div>
                  <Label className="text-white">Fotos (máximo 3)</Label>
                  <div className="mt-2">
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center glass-morphism">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer inline-flex items-center justify-center w-full"
                      >
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-gray-400 text-sm">
                          Clique para adicionar fotos ou arraste e solte
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          JPG, PNG, GIF (máx. 5MB cada)
                        </p>
                      </label>
                    </div>

                    {/* Preview das Imagens */}
                    {previews.length > 0 && (
                      <div className="mt-4 grid grid-cols-3 gap-4">
                        {previews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 neon-border"
                    onClick={() => router.push('/dashboard')}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary/90 neon-hover"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Criando...' : 'Criar Anúncio'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}