import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { status } = await request.json();

    if (!['pendente', 'aprovado', 'negado'].includes(status)) {
      return NextResponse.json(
        { error: 'Status inválido' },
        { status: 400 }
      );
    }

    // Buscar solicitação
    const solicitacao = await db.destaquePedido.findUnique({
      where: { id },
      include: {
        anuncio: true
      }
    });

    if (!solicitacao) {
      return NextResponse.json(
        { error: 'Solicitação não encontrada' },
        { status: 404 }
      );
    }

    // Atualizar solicitação
    const updatedSolicitacao = await db.destaquePedido.update({
      where: { id },
      data: { status },
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
      }
    });

    // Se aprovado, atualizar o anúncio
    if (status === 'aprovado') {
      await db.anuncio.update({
        where: { id: solicitacao.anuncioId },
        data: { destaque: true }
      });
    }

    return NextResponse.json({
      message: `Solicitação ${status === 'aprovado' ? 'aprovada' : status === 'negado' ? 'negada' : 'atualizada'} com sucesso`,
      solicitacao: updatedSolicitacao
    });

  } catch (error) {
    console.error('Erro ao atualizar solicitação de destaque:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}