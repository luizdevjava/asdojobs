import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { anuncioId } = await request.json();

    if (!anuncioId) {
      return NextResponse.json(
        { error: 'ID do anúncio é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar se o anúncio existe
    const anuncio = await db.anuncio.findUnique({
      where: { id: anuncioId }
    });

    if (!anuncio) {
      return NextResponse.json(
        { error: 'Anúncio não encontrado' },
        { status: 404 }
      );
    }

    // Verificar se já existe uma solicitação pendente
    const solicitacaoExistente = await db.destaquePedido.findFirst({
      where: {
        anuncioId,
        status: 'pendente'
      }
    });

    if (solicitacaoExistente) {
      return NextResponse.json(
        { error: 'Já existe uma solicitação de destaque pendente para este anúncio' },
        { status: 409 }
      );
    }

    // Criar solicitação de destaque
    const solicitacao = await db.destaquePedido.create({
      data: {
        anuncioId,
        userId: anuncio.userId,
        status: 'pendente'
      },
      include: {
        anuncio: {
          select: {
            id: true,
            titulo: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json({
      message: 'Solicitação de destaque criada com sucesso',
      solicitacao
    });

  } catch (error) {
    console.error('Erro ao criar solicitação de destaque:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Buscar todas as solicitações de destaque
    const solicitacoes = await db.destaquePedido.findMany({
      include: {
        anuncio: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(solicitacoes);

  } catch (error) {
    console.error('Erro ao buscar solicitações de destaque:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}