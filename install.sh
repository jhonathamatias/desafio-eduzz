#!/bin/bash

echo "Iniciando a instalação do projeto..."

if [ ! -f ".env" ]; then
  echo
  echo -e "\033[1;32mCriando o arquivo .env a partir de .env.dist...\033[0m"
  cp .env.dist .env
else
  echo
  echo -e "\033[1;33mArquivo .env já existe. Pulando este passo.\033[0m"
fi

echo
echo -e "\033[1;34mSubindo os containers com Docker Compose...\033[0m"
docker compose up -d

echo
echo -e "\033[1;34mAguardando os containers subirem...\033[0m"
sleep 10

echo
echo -e "\033[1;34mGerando as chaves...\033[0m"
./shell/gen-keys

echo
echo -e "\033[1;34mExecutando as migrações do banco de dados...\033[0m"
./shell/prisma migrate dev

echo
echo -e "\033[1;34mExecutando o seed do banco de dados...\033[0m"
./shell/prisma db seed

echo
echo -e "\033[1;32mInstalação concluída com sucesso!\033[0m"


