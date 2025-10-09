import { SendGridMail } from '@/app/infrastructure/mail/sendgrid.mail';
import { container } from '@/container';
import { formatBRL, formatBTC } from '@/helpers/money';

export default async function notifyPurchaseBTCHandler(payload: any) {
  const mail = container.resolve<SendGridMail>(SendGridMail.name);
  await mail.send(
    payload.email,
    'Confirmação de Compra de BTC',
    `Olá, ${payload.name}!\n\nSua compra de ₿ ${formatBTC(payload.btcAmount)} foi processada com sucesso ao preço de R$ ${formatBRL(payload.btcPrice)} por BTC.\n\nObrigado por negociar conosco!`
  );
  console.info('\nPurchase processed successfully');
}
