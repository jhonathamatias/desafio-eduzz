import { container } from '@/container';

import { depositNotificationHandler, notifyPurchaseBTCHandler, processPurchaseHandler } from './handlers';
import { Queues } from '../app/infrastructure/queue/enums/queue.enum';
import RabbitMQQueue from '../app/infrastructure/queue/rabbitmq.queue';

export default function () {
  const queueService = container.resolve<RabbitMQQueue>(RabbitMQQueue.name);

  console.log('Queue worker started...\n');

  queueService.consume(
    [Queues.DEPOSIT_NOTIFICATION, Queues.BTC_PURCHASE, Queues.PURCHASE_NOTIFICATION],
    async (queue, message) => {
      console.log(`Received message from queue ${queue}:`, message);

      switch (queue) {
        case Queues.DEPOSIT_NOTIFICATION:
          await depositNotificationHandler(message);
          break;
        case Queues.BTC_PURCHASE:
          await processPurchaseHandler(message);
          break;
        case Queues.PURCHASE_NOTIFICATION:
          await notifyPurchaseBTCHandler(message);
          break;
        default:
          console.warn(`No handler for queue ${queue}`);
      }
    }
  );
}
