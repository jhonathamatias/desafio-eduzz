import { ProcessPurchaseBTCUseCase } from '@/app/application/use-cases/trades/process-purchase-btc.usecase';
import { container } from '@/container';

export default async function processPurchaseHandler(payload: any) {
  const processPurchase = container.resolve<ProcessPurchaseBTCUseCase>(ProcessPurchaseBTCUseCase.name);
  await processPurchase.execute(payload);
  console.info('\nPurchase processed successfully');
}
