import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { estrelas, destaque, ativo } = await request.json();

    // Verificar se o anúncio existe
    const anuncioExistente = await db.anuncio.findUnique({
      where: { id }
    });

    if (!anuncioExistente) {
      return NextResponse.json(
        { error: 'Anúncio não encontrado' },
        { status: 404 }
      );
    }

    // Atualizar anúncio
    const anuncio = await db.anuncio.update({
      where: { id },
      data: {
        ...(estrelas !== undefined && { estrelas }),
        ...(destaque !== undefined && { destaque }),
        ...(ativo !== undefined && { ativo })
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
      message: 'Anúncio atualizado com sucesso',
      anuncio
    });

  } catch (error) {
    console.error('Erro ao atualizar anúncio:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Verificar se o anúncio existe
    const anuncioExistente = await db.anuncio.findUnique({
      where: { id }
    });

    if (!anuncioExistente) {
      return NextResponse.json(
        { error: 'Anúncio não encontrado' },
        { status: 404 }
      );
    }

    // Excluir anúncio
    await db.anuncio.delete({
      where: { id }
    });

    return NextResponse.json({
      message: 'Anúncio excluído com sucesso'
    });

  } catch (error) {
    console.error('Erro ao excluir anúncio:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}