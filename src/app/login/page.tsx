'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, User, Lock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/dashboard');
      } else {
        setError(data.error || 'Erro ao fazer login');
      }
    } catch (error) {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundColor: '#0a0a0a',
        color: '#f8f8f8',
        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255, 0, 51, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 0, 51, 0.2) 0%, transparent 50%)'
      }}
    >
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-red-500 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para o site
        </Link>

        <Card
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <CardHeader className="text-center">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ 
                backgroundColor: '#ff0033',
                boxShadow: '0 0 20px rgba(255, 0, 51, 0.5)'
              }}
            >
              <User className="w-8 h-8 text-white" />
            </div>
            <CardTitle 
              className="text-2xl font-bold"
              style={{ 
                color: '#f8f8f8',
                textShadow: '0 0 10px rgba(255, 0, 51, 0.8)'
              }}
            >
              Login
            </CardTitle>
            <p className="text-gray-400">Entre para gerenciar seus anúncios</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" style={{ color: '#f8f8f8' }}>E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="mt-1"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    color: '#f8f8f8'
                  }}
                  required
                />
              </div>

              <div>
                <Label htmlFor="password" style={{ color: '#f8f8f8' }}>Senha</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="•••••••••"
                    className="pr-10"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      color: '#f8f8f8'
                    }}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <div 
                  className="p-3 rounded-lg text-sm"
                  style={{
                    background: 'rgba(255, 0, 51, 0.1)',
                    border: '1px solid rgba(255, 0, 51, 0.2)',
                    color: '#ff0033'
                  }}
                >
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full hover:shadow-lg transition-shadow"
                style={{ backgroundColor: '#ff0033' }}
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Não tem uma conta?{' '}
                <Link href="/register" className="text-red-500 hover:underline">
                  Cadastre-se
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}