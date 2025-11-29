# Site de Anúncios de Acompanhantes

Um projeto completo de site de anúncios para acompanhantes com design moderno dark neon e glassmorphism.

## 🚀 Tecnologias Utilizadas

- **Frontend**: Next.js 15 com TypeScript e App Router
- **Styling**: Tailwind CSS 4 com shadcn/ui
- **Database**: Prisma ORM com SQLite
- **UI Components**: Componentes shadcn/ui com Lucide icons
- **Auth**: Sistema de autenticação próprio com bcryptjs

## 🎨 Design Features

- **Dark Mode**: Design dark permanente com tema neon vermelho (#ff0033)
- **Glassmorphism**: Efeitos de vidro fosco nos cards
- **Neon Effects**: Brilhos neon vermelhos interativos
- **Responsive Design**: Totalmente responsivo para mobile e desktop
- **Modern Typography**: Font Inter com hierarquia clara

## 📋 Funcionalidades

### 🏠 Página Inicial
- Header com logo e botão "Anunciar"
- Nuvem de tags interativa
- 2 anúncios em destaque
- Grid de anúncios (3 por linha)
- Sistema de filtros (cidade, preço, busca)
- Cards com: título, localização, preço, imagem, estrelas, botão "Ver Perfil"

### 🔐 Sistema de Autenticação
- Registro de anunciantes
- Login seguro
- Validação de dados
- Redirecionamento automático

### 👤 Painel da Anunciante
- Dashboard com estatísticas
- Criar/editar/excluir anúncios
- Upload de até 3 imagens
- Solicitar destaque
- Visualização de anúncios ativos

### 🛠️ Painel Administrativo
- Acesso via `/admin/654321`
- Gerenciar usuários (banir/desbanir)
- Gerenciar anúncios (destacar, ajustar estrelas, excluir)
- Aprovar/recusar solicitações de destaque
- Estatísticas em tempo real

## 🗄️ Banco de Dados

### Estrutura:
- **users**: ID, email, password, name, banned, timestamps
- **anuncios**: ID, user_id, título, descrição, preço, localização, imagens, destaque, estrelas, ativo
- **destaque_pedidos**: ID, anuncio_id, user_id, status (pendente/aprovado/negado)
- **favoritos**: ID, anuncio_id, user_id (para funcionalidade futura)

## 🚀 Instalação

### Pré-requisitos:
- Node.js 18+
- npm ou yarn

### Passos:

1. **Clonar o projeto:**
```bash
git clone <repositorio>
cd nome-do-projeto
```

2. **Instalar dependências:**
```bash
npm install
```

3. **Configurar variáveis de ambiente:**
```bash
# Copiar .env.example para .env
cp .env.example .env

# Editar o arquivo .env com suas configurações
DATABASE_URL="file:./dev.db"
```

4. **Configurar o banco de dados:**
```bash
# Push do schema para o banco
npm run db:push

# Gerar Prisma Client
npm run db:generate
```

5. **Iniciar o servidor de desenvolvimento:**
```bash
npm run dev
```

O projeto estará disponível em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── api/                    # APIs REST
│   │   ├── auth/              # Autenticação
│   │   ├── anuncios/          # CRUD de anúncios
│   │   ├── admin/             # APIs admin
│   │   └── destaques/         # Sistema de destaques
│   ├── dashboard/             # Painel do anunciante
│   ├── admin/654321/         # Painel administrativo
│   ├── login/                 # Página de login
│   ├── register/              # Página de registro
│   ├── page.tsx               # Página inicial
│   ├── layout.tsx             # Layout principal
│   └── globals.css            # Estilos globais
├── components/
│   └── ui/                    # Componentes shadcn/ui
├── lib/
│   ├── db.ts                  # Configuração do Prisma
│   └── utils.ts               # Utilitários
└── hooks/                     # Hooks personalizados
```

## 🔧 Acesso ao Sistema

### Acesso Público:
- Site: `http://localhost:3000`
- Registro: `http://localhost:3000/register`
- Login: `http://localhost:3000/login`

### Acesso Restrito:
- Painel do Anunciante: `http://localhost:3000/dashboard` (após login)
- Painel Administrativo: `http://localhost:3000/admin/654321`

## 🎯 Funcionalidades Implementadas

### ✅ Core Features:
- [x] Página inicial com design dark neon
- [x] Sistema de autenticação completo
- [x] CRUD de anúncios
- [x] Upload de imagens
- [x] Sistema de destaques
- [x] Painel administrativo
- [x] Filtros e busca
- [x] Design responsivo

### ✅ Advanced Features:
- [x] Glassmorphism effects
- [x] Neon animations
- [x] Real-time statistics
- [x] User management
- [x] Content moderation
- [x] Mobile responsive

## 🎨 Customização

### Cores:
- Primary: `#ff0033` (neon vermelho)
- Background: `oklch(0.09 0 0)` (dark)
- Cards: `oklch(0.12 0 0)` (dark medium)

### Efeitos:
- Glassmorphism: `background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px);`
- Neon Glow: `box-shadow: 0 0 20px rgba(255, 0, 51, 0.5);`
- Neon Text: `text-shadow: 0 0 10px rgba(255, 0, 51, 0.8);`

## 🚀 Deploy

### Para produção:

1. **Build do projeto:**
```bash
npm run build
```

2. **Configurar variáveis de ambiente de produção**
3. **Fazer deploy na plataforma desejada (Vercel, Netlify, etc.)**

## 📝 Considerações

### Segurança:
- Senhas hasheadas com bcryptjs
- Validação de inputs
- Proteção contra SQL injection via Prisma
- Sanitização de dados

### Performance:
- Next.js 15 com otimizações automáticas
- Imagens otimizadas
- Lazy loading
- Component otimizado

### SEO:
- Meta tags semânticas
- Estrutura HTML5
- URLs amigáveis

## 🔄 Futuras Melhorias

- [ ] Sistema de pagamentos
- [ ] Chat em tempo real
- [ ] Sistema de avaliações
- [ ] Geolocalização
- [ ] Integração com redes sociais
- [ ] Sistema de favoritos completo
- [ ] Notificações push

## 📞 Suporte

Para dúvidas ou suporte, entre em contato através do painel administrativo ou abra uma issue no repositório.

---

**Desenvolvido com Next.js 15, TypeScript, Tailwind CSS e Prisma**