import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  const currencies = [
    { code: 'BRL', name: 'Real Brasileiro', symbol: 'R$', precision: 2, is_crypto: false },
    { code: 'BTC', name: 'Bitcoin', symbol: '₿', precision: 8, is_crypto: true }
  ];

  for (const currency of currencies) {
    await prisma.currency.upsert({
      where: { code: currency.code },
      update: {},
      create: currency
    });
  }

  console.log('Dados iniciais inseridos na tabela currencies.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
