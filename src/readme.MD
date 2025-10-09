# Desafio Eduzz - Sistema de Trades com Bitcoin

Este projeto é uma aplicação para gerenciar trades de Bitcoin, incluindo compra, venda e reinvestimento de valores. Ele utiliza tecnologias modernas como TypeScript, Prisma, Docker e RabbitMQ.

## Estrutura do Projeto

A estrutura do projeto está organizada da seguinte forma:

```
.env
.env.dist
.gitignore
.prettierrc.js
docker-compose.yml
eslint.config.js
jest.config.ts
Makefile
package.json
tsconfig.json
docker/
keys/
prisma/
  schema.prisma
  seed.ts
  migrations/
    migration_lock.toml
    20251009020200_init/
    20251009090144_add_enum/
shell/
  container
  gen-keys
  prisma
  rabbitmq
  yarn
src/
  container.ts
  main.ts
  app/
    application/
    controller/
    domain/
    factories/
    infrastructure/
  config/
    app.ts
  dependecies/
  generated/
  middlewares/
  routes/
  tests/
  workers/
```

### Principais Diretórios

- **`src/app/application`**: Contém os casos de uso e lógica de aplicação.
- **`src/app/infrastructure`**: Contém implementações de infraestrutura como filas e repositórios.
- **`prisma/`**: Contém o esquema do banco de dados e scripts de migração.
- **`docker/`**: Scripts e configurações para containers Docker.
- **`shell/`**: Scripts utilitários para automação de tarefas.

## Tecnologias Utilizadas

- **Node.js** com **TypeScript**
- **Prisma** para ORM
- **RabbitMQ** para filas de mensagens
- **Docker** para containerização
- **Jest** para testes unitários
- **ESLint** e **Prettier** para padronização de código

## Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas:

- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Yarn](https://yarnpkg.com/)

## Configuração do Ambiente

1. Clone o repositório:

   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd desafio-eduzz
   ```

2. Copie o arquivo `.env.dist` para `.env` e configure as variáveis de ambiente:

   ```bash
   cp .env.dist .env
   ```

3. Instale as dependências:

   ```bash
   yarn install
   ```

4. Gere os arquivos do Prisma:

   ```bash
   yarn prisma generate
   ```

5. Execute as migrações do banco de dados:

   ```bash
   yarn prisma migrate dev
   ```

## Como Rodar o Projeto

### Com Docker

1. Suba os containers com o Docker Compose:

   ```bash
   docker-compose up -d
   ```

2. Acesse a aplicação no navegador ou via API.

### Localmente

1. Inicie o RabbitMQ e o banco de dados (se necessário, use o Docker para isso).
2. Execute o servidor:

   ```bash
   yarn dev
   ```

3. Acesse a aplicação no navegador ou via API.

## Testes

Para rodar os testes, execute:

```bash
yarn test
```

## Scripts Disponíveis

- **`yarn dev`**: Inicia o servidor em modo de desenvolvimento.
- **`yarn build`**: Compila o projeto para produção.
- **`yarn test`**: Executa os testes unitários.
- **`yarn prisma generate`**: Gera os arquivos do Prisma.
- **`yarn prisma migrate dev`**: Executa as migrações do banco de dados.

## Contribuição

1. Faça um fork do projeto.
2. Crie uma branch para sua feature (`git checkout -b feature/nome-da-feature`).
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`).
4. Envie para o repositório remoto (`git push origin feature/nome-da-feature`).
5. Abra um Pull Request.

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).