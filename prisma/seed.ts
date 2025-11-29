import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar usuário admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@acompanhantes.com' },
    update: {},
    create: {
      email: 'admin@acompanhantes.com',
      password: adminPassword,
      name: 'Administrador',
    },
  });

  console.log('✅ Usuário admin criado:', admin.email);

  // Criar usuário anunciante de exemplo
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'bella@acompanhantes.com' },
    update: {},
    create: {
      email: 'bella@acompanhantes.com',
      password: userPassword,
      name: 'Bella',
    },
  });

  console.log('✅ Usuário exemplo criado:', user.email);

  // Criar anúncios de exemplo
  const anuncios = [
    {
      userId: user.id,
      titulo: 'Bella - Acompanhante de Luxo',
      descricao: 'Garota de programa elegante e sofisticada, pronta para proporcionar momentos inesquecíveis. Atendo em hotéis de luxo e residências.',
      precoHora: 500,
      cidade: 'São Paulo',
      bairro: 'Jardins',
      imagens: JSON.stringify([
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop'
      ]),
      estrelas: 5,
      destaque: true,
      ativo: true,
    },
    {
      userId: user.id,
      titulo: 'Maria - Massagem Relaxante',
      descricao: 'Especialista em massagens eróticas e relaxantes. Técnicas variadas para seu prazer e bem-estar.',
      precoHora: 300,
      cidade: 'Rio de Janeiro',
      bairro: 'Copacabana',
      imagens: JSON.stringify([
        'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop'
      ]),
      estrelas: 4,
      destaque: true,
      ativo: true,
    },
    {
      userId: user.id,
      titulo: 'Ana - Loira Sensual',
      descricao: 'Loira gostosa e carinhosa, pronta para realizar suas fantasias. Atendo 24h.',
      precoHora: 400,
      cidade: 'São Paulo',
      bairro: 'Vila Madalena',
      imagens: JSON.stringify([
        'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=400&fit=crop'
      ]),
      estrelas: 5,
      destaque: false,
      ativo: true,
    },
  ];

  for (const anuncioData of anuncios) {
    const anuncio = await prisma.anuncio.create({
      data: anuncioData,
    });
    console.log('✅ Anúncio criado:', anuncio.titulo);
  }

  console.log('🎉 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });