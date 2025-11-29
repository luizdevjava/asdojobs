import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { banned } = await request.json();

    if (typeof banned !== 'boolean') {
      return NextResponse.json(
        { error: 'Campo banned deve ser booleano' },
        { status: 400 }
      );
    }

    // Atualizar usuário
    const user = await db.user.update({
      where: { id },
      data: { banned },
      select: {
        id: true,
        email: true,
        name: true,
        banned: true,
        createdAt: true
      }
    });

    return NextResponse.json({
      message: `Usuário ${banned ? 'banido' : 'desbanido'} com sucesso`,
      user
    });

  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}