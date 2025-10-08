import type IMail from '@/app/infrastructure/mail/interfaces/mail.interface';

import { type DepositNotificationDto } from '../../dtos';
import type IApplicationCommand from '../interfaces/application-command.interface';

export class DepositNotificationUseCase implements IApplicationCommand<void> {
  constructor(protected readonly mail: IMail) {}

  public async execute({ email, name, amount }: DepositNotificationDto): Promise<void> {
    console.log('Sending deposit notification email...');
    this.mail.send(
      email,
      'Notificação de Depósito',
      `Olá ${name},\n\nTemos o prazer de informar 
      que um depósito no valor de ${amount} 
      foi realizado com sucesso na sua conta.\n\nObrigado por escolher 
      nossos serviços!\n\nAtenciosamente,\nEduzz Investimentos`
    );
  }
}
