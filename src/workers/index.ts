import { container } from '@/container';
import registerDependencies from '@/dependecies';

import { depositNotificationHandler } from './handlers';
import { Queues } from '../app/infrastructure/queue/enums/queue.enum';
import RabbitMQQueue from '../app/infrastructure/queue/rabbitmq.queue';

(() => {
  console.log('Starting workers...\n');

  try {
    registerDependencies();

    const amq = container.resolve<RabbitMQQueue>(RabbitMQQueue.name);

    console.log('Listening messages...\n');

    amq.consume([Queues.DEPOSIT_NOTIFICATION], async (queue, message) => {
      console.log(`Received message from queue ${queue}:`, message);

      switch (queue) {
        case Queues.DEPOSIT_NOTIFICATION:
          await depositNotificationHandler(message);
          break;
        default:
          console.warn(`No handler for queue ${queue}`);
      }
    });
  } catch (error) {
    console.error('Error starting workers:', error);
    process.exit(1);
  }
})();
