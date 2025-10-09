import { container } from '@/container';
import registerDependencies from '@/dependecies';

import { depositNotificationHandler, processPurchaseHandler } from './handlers';
import { Queues } from '../app/infrastructure/queue/enums/queue.enum';
import RabbitMQQueue from '../app/infrastructure/queue/rabbitmq.queue';

/** O ideal aqui era estar em um container com worker seperado */
(() => {
  console.log('Starting workers...\n');

  try {
    registerDependencies();

    const queueService = container.resolve<RabbitMQQueue>(RabbitMQQueue.name);

    console.log('Listening messages...\n');

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
          default:
            console.warn(`No handler for queue ${queue}`);
        }
      }
    );
  } catch (error) {
    console.error('Error starting workers:', error);
    process.exit(1);
  }
})();
