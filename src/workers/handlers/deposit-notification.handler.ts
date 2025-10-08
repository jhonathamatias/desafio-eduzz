import { type DepositNotificationDto } from '@/app/application/dtos';
import { DepositNotificationUseCase } from '@/app/application/use-cases/account/deposit-notification.usecase';
import { container } from '@/container';

export default async function depositNoficationHandler(payload: DepositNotificationDto) {
  const depositNotification = container.resolve<DepositNotificationUseCase>(DepositNotificationUseCase.name);

  await depositNotification.execute(payload);

  console.info('\nDeposit notification sent successfully');
}
