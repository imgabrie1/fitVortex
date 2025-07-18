# FitVortex - Sistema de Treinamento Personalizado

## Descrição do Projeto

O FitVortex é um sistema de acompanhamento de treinos personalizado, projetado para ajudar os usuários a gerenciar e adaptar seu volume de treinamento ao longo do tempo, com base em seu progresso. A aplicação permite que os usuários criem e acompanhem treinos dentro de microciclos e os organizem em macrociclos, com ajustes automáticos de volume baseados no desempenho.

Essa estrutura de dois níveis permite que os usuários progridam em blocos de treinamento curtos sem mudanças bruscas, enquanto ainda se beneficiam de ajustes de volume baseados no desempenho em macrociclos mais amplos.

## Funcionalidades

- **Autenticação de Usuário**: Registro e login de usuário seguros.
- **Gerenciamento de Treinos**: Crie, acompanhe e gerencie treinos.
- **Acompanhamento de Microciclos**: Agrupe treinos em microciclos (por exemplo, blocos de treinamento de 5 dias) e acompanhe o volume por grupo muscular.
- **Gerenciamento de Macrociclos**: Organize microciclos em macrociclos para acompanhamento do progresso a longo prazo.
- **Ajuste Automático de Volume**: Ajuste automaticamente o volume de treino com base no desempenho em macrociclos anteriores.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript.
- **TypeScript**: Superset de JavaScript que adiciona tipagem estática.
- **Express.js**: Framework para aplicações web em Node.js.
- **TypeORM**: Object-Relational Mapper (ORM) para TypeScript e JavaScript.
- **PostgreSQL**: Banco de dados relacional.
- **Zod**: Biblioteca para validação de dados.

## Pré-requisitos

- Node.js
- npm ou yarn
- PostgreSQL

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/fitvortex.git
   ```
2. Navegue até o diretório do projeto:
   ```bash
   cd fitvortex
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Crie um arquivo `.env` na raiz do diretório e adicione as seguintes variáveis de ambiente:

   ```
   DATABASE_URL="postgres://user:password@host:port/db"
   SECRET_KEY=sua_chave_secreta
   EXPIRES_IN="24h"
   NODE_ENV="postgres"
   ```

## Executando a Aplicação

### Modo de Desenvolvimento

Para executar a aplicação em modo de desenvolvimento com recarregamento automático, use:

```bash
npm run dev
```

### Modo de Produção

Para construir e executar a aplicação em modo de produção, use os seguintes comandos:

```bash
npm run build
npm start
```

## Estrutura do Projeto

O projeto segue uma estrutura padrão para uma aplicação Node.js e TypeScript:

- **`src/`**: Contém o código-fonte da aplicação.
  - **`controllers/`**: Lida com as requisições recebidas, valida dados e chama os serviços.
  - **`services/`**: Contém a lógica de negócios da aplicação.
  - **`middlewares/`**: Contém funções de middleware para tratamento de requisições.
  - **`routes/`**: Define as rotas da API da aplicação.
  - **`entities/`**: Define as entidades do banco de dados (modelos).
  - **`migrations/`**: Contém os arquivos de migração do banco de dados.
  - **`enum/`**: Contém os arquivos de enumeração.
  - **`app.ts`**: Arquivo principal da aplicação, onde o Express é configurado.
  - **`server.ts`**: Arquivo de inicialização do servidor.
  - **`data-source.ts`**: Configuração da fonte de dados do TypeORM.
- **`package.json`**: Lista as dependências e scripts do projeto.
- **`tsconfig.json`**: Arquivo de configuração do compilador TypeScript.
- **`.gitignore`**: Especifica quais arquivos e diretórios ignorar no Git.
- **`README.md`**: Documentação do projeto.

## Migrações do Banco de Dados

Para gerar uma nova migração, use o seguinte comando, substituindo `InitialMigration` por um nome descritivo para sua migração:

```bash
npm run typeorm migration:generate ./src/migrations/InitialMigration -- -d ./src/data-source.ts
```

Para executar as migrações, use o seguinte comando:

```bash
npm run typeorm migration:run -- -d ./src/data-source
```

## Endpoints da API

Os endpoints da API são definidos no diretório `src/routes/`. As rotas disponíveis são:

- **Usuários**: `/users`
- **Login**: `/login`
- **Treinos**: `/workouts`
- **Microciclos**: `/micro-cycles`
- **Macrociclos**: `/macro-cycles`
- **Exercícios**: `/exercises`
