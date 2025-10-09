# Desafio Eduzz - Sistema de Trades com Bitcoin

Este projeto é uma aplicação para gerenciar trades de Bitcoin, incluindo compra, venda e reinvestimento de valores.

---

## Arquitetura do Projeto

A arquitetura do projeto segue os princípios de **Clean Architecture**, separando as responsabilidades em camadas bem definidas:

- **`application`**: Contém os casos de uso e lógica de aplicação. Aqui estão os serviços que implementam as regras de negócio.
- **`domain`**: Define as entidades e regras de domínio. É a camada mais central e independente.
- **`infrastructure`**: Contém implementações de infraestrutura, como repositórios, filas e integrações externas.
- **`controller`**: Responsável por receber as requisições e delegar para os casos de uso apropriados.
- **`workers`**: Processos assíncronos, como consumidores de filas.

## Tecnologias Utilizadas

- **Node.js** com **TypeScript**
- **Prisma** para ORM
- **RabbitMQ** para filas de mensagens
- **Docker** para containerização
- **Jest** para testes unitários
- **ESLint** e **Prettier** para padronização de código

---

## Rotas do Sistema

### **Autenticação**

- **POST `/login`**  
  Realiza a autenticação do usuário e retorna um token JWT.  
  **Body**:
  ```json
  {
    "email": "usuario@exemplo.com",
    "password": "senha123"
  }
  ```
  **Resposta**:
  ```json
  {
    "token": "jwt-token-gerado"
  }
  ```

---

### **Conta**

- **POST `/account`**  
  Cria uma nova conta de usuário.  
  **Body**:
  ```json
  {
    "name": "Usuário Exemplo",
    "email": "usuario@exemplo.com",
    "password": "senha123"
  }
  ```

- **POST `/account/deposit`**  
  Realiza um depósito na conta do usuário.  
    **Headers**:
  ```
  Authorization: Bearer <seu-token-jwt>
  ```
  **Body**:
  ```json
  {
    "amount": 1000
  }
  ```

- **GET `/account/balance`**  
  Retorna o saldo atual da conta do usuário.  
  **Headers**:
  ```
  Authorization: Bearer <seu-token-jwt>
  ```

- **GET `/extract`**  
  Retorna o extrato de transações da conta do usuário.  
  **Headers**:
  ```
  Authorization: Bearer <seu-token-jwt>
  ```

---

### **Bitcoin**

- **GET `/btc/price`**  
  Retorna o preço atual do Bitcoin.  
  **Headers**:
  ```
  Authorization: Bearer <seu-token-jwt>
  ```

- **POST `/btc/purchase`**  
  Realiza a compra de Bitcoin.  
  **Body**:
  ```json
  {
    "amount": 500
  }
  ```

- **POST `/btc/sell`**  
  Realiza a venda de Bitcoin.  
  **Body**:
  ```json
  {
    "amount": 500
  }
  ```

- **GET `/btc/position`**  
  Retorna posição do investimento.  
  **Headers**:
  ```
  Authorization: Bearer <seu-token-jwt>
  ```

- **GET `/volume`**  
  Retorna o volume diário total de transações de Bitcoin.  
  **Headers**:
  ```
  Authorization: Bearer <seu-token-jwt>
  ```

- **GET `/history`**  
  Retorna o histórico de preços do Bitcoin.  
  **Headers**:
  ```
  Authorization: Bearer <seu-token-jwt>
  ```
---

### **Outras Rotas**

- **GET `/`**  
  Retorna uma mensagem indicando que o servidor está em execução.

---

## Como Funciona a Autenticação

O sistema utiliza **JWT (JSON Web Token)** para autenticação e autorização. O fluxo funciona da seguinte forma:

1. O usuário realiza login na rota `/login` com suas credenciais.
2. Se as credenciais forem válidas, o sistema retorna um token JWT.
3. O token deve ser enviado no cabeçalho `Authorization` em todas as requisições protegidas:
   ```
   Authorization: Bearer <seu-token-jwt>
   ```
4. O servidor valida o token em cada requisição. Se o token for inválido ou expirado, a requisição é rejeitada com o código de status `401 Unauthorized`.

---

### Estrutura de Diretórios

```
src/
├── app/
│   ├── application/       # Casos de uso e lógica de aplicação
│   ├── controller/        # Controladores para lidar com requisições
│   ├── domain/            # Entidades e regras de domínio
│   ├── factories/         # Criação de instâncias e injeção de dependências
│   ├── infrastructure/    # Implementações de infraestrutura (repositórios, filas, etc.)
│   └── tests/             # Testes unitários e de integração
├── config/                # Configurações gerais do projeto
├── middlewares/           # Middlewares para tratamento de requisições
├── routes/                # Definição de rotas da API
├── workers/               # Processos assíncronos (ex: consumidores de filas)
```

---

## Tecnologias Utilizadas

- **Node.js** com **TypeScript**
- **Prisma** para ORM
- **RabbitMQ** para filas de mensagens
- **Docker** para containerização
- **Jest** para testes unitários
- **ESLint** e **Prettier** para padronização de código

---

## Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas:

- **Node.js**: v18.x ou superior ([Instalar Node.js](https://nodejs.org/))
- **Yarn**: v1.22.x ou superior ([Instalar Yarn](https://yarnpkg.com/))
- **Docker**: v20.10.x ou superior ([Instalar Docker](https://www.docker.com/))
- **Docker Compose**: v2.x ou superior ([Instalar Docker Compose](https://docs.docker.com/compose/))

Para verificar as versões instaladas, use os comandos abaixo:

```bash
node -v
yarn -v
docker -v
docker compose version
```

---

## Configuração do Ambiente

### Instalação Automática

1. Clone o repositório:

   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd desafio-eduzz
   ```

2. Execute o script de instalação:

   ```bash
   ./install.sh
   ```

   O script irá:
   - Criar o arquivo `.env` a partir de `.env.dist`.
   - Subir os containers com Docker Compose.
   - Gerar as chaves necessárias.
   - Rodar as migrações do banco de dados.
   - Executar o seed do banco de dados.

### Instalação Manual

Caso prefira configurar manualmente, siga os passos abaixo:

1. Copie o arquivo `.env.dist` para `.env` e configure as variáveis de ambiente:

   ```bash
   cp .env.dist .env
   ```

2. Suba os containers com Docker Compose:

   ```bash
   docker-compose up -d
   ```

3. Gere as chaves necessárias:

   ```bash
   ./shell/gen-keys
   ```

4. Execute as migrações do banco de dados:

   ```bash
   ./shell/prisma migrate dev
   ```

5. Execute o seed do banco de dados:

   ```bash
   ./shell/prisma db seed
   ```

---

## Execução dos Workers

Para que o sistema funcione corretamente, é **crucial** executar os workers responsáveis por:

- Processar o histórico.
- Enviar notificações por e-mail.
- Processar depósitos.

Para iniciar os workers, execute o comando abaixo:

```bash
make workers ou ./shell/yarn start-workers
```

Certifique-se de que o RabbitMQ está em execução antes de iniciar os workers.

---

## Comandos Disponíveis

### Makefile

O projeto inclui um `Makefile` para facilitar a execução de tarefas comuns:

- **`make setup`**: Configura o ambiente (cria `.env`, sobe containers, gera chaves, executa migrações e seed).
- **`make start`**: Sobe os containers com Docker Compose.
- **`make stop`**: Para os containers.
- **`make restart`**: Reinicia os containers.
- **`make logs`**: Exibe os logs do container principal.
- **`make test`**: Executa os testes unitários.
- **`make gen-keys`**: Gera as chaves necessárias.
- **`make migrate`**: Executa as migrações do banco de dados.
- **`make seed`**: Executa o seed do banco de dados.

### Shell Scripts

Além do `Makefile`, o projeto inclui scripts utilitários na pasta `shell/`:

- **`gen-keys`**: Gera as chaves necessárias para o projeto.
- **`prisma`**: Scripts relacionados ao Prisma (migrações, seed, etc.).
- **`rabbitmq`**: Scripts para gerenciar o RabbitMQ.

---

## Como Rodar o Projeto

### Com Docker

1. Suba os containers com o Docker Compose:

   ```bash
   docker-compose up -d
   ```

2. Acesse a aplicação no navegador ou via API.

3. Acesse a aplicação no navegador ou via API.

---

## Testes

Para rodar os testes, execute:

```bash
make test ou ./shell/yarn test
```

---