import { JwtFactory } from '@/app/factories/jwt.factory';
import Jwt from '@/app/infrastructure/auth/jwt';
import RabbitMQQueue from '@/app/infrastructure/queue/rabbitmq.queue';
import { container } from '@/container';

export default function () {
  container.register(Jwt.name, () => JwtFactory.factory());

  container.register(RabbitMQQueue.name, () => new RabbitMQQueue());
}
