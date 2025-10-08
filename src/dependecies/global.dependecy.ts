import { JwtFactory } from '@/app/factories/jwt.factory';
import Jwt from '@/app/infrastructure/auth/jwt';
import { SendGridMail } from '@/app/infrastructure/mail/sendgrid.mail';
import RabbitMQQueue from '@/app/infrastructure/queue/rabbitmq.queue';
import { container as c } from '@/container';

export default function () {
  c.register(Jwt.name, () => JwtFactory.factory());

  c.register(RabbitMQQueue.name, () => new RabbitMQQueue());

  c.register(SendGridMail.name, () => new SendGridMail());
}
