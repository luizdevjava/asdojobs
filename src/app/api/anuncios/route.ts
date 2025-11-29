import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (userId) {
      // Buscar anúncios de um usuário específico
      const anuncios = await db.anuncio.findMany({
        where: { userId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      return NextResponse.json(anuncios);
    } else {
      // Buscar todos os anúncios ativos para a página inicial
      const anuncios = await db.anuncio.findMany({
        where: { ativo: true },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: [
          { destaque: 'desc' },
          { createdAt: 'desc' }
        ]
      });

      return NextResponse.json(anuncios);
    }

  } catch (error) {
    console.error('Erro ao buscar anúncios:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, titulo, descricao, precoHora, cidade, bairro, imagens } = await request.json();

    if (!userId || !titulo || !descricao || !precoHora || !cidade || !imagens) {
      return NextResponse.json(
        { error: 'Todos os campos obrigatórios devem ser preenchidos' },
        { status: 400 }
      );
    }

    // Verificar se o usuário existe
    const user = await db.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Criar anúncio
    const anuncio = await db.anuncio.create({
      data: {
        userId,
        titulo,
        descricao,
        precoHora,
        cidade,
        bairro,
        imagens,
        estrelas: 0,
        destaque: false,
        ativo: true
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({
      message: 'Anúncio criado com sucesso',
      anuncio
    });

  } catch (error) {
    console.error('Erro ao criar anúncio:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}