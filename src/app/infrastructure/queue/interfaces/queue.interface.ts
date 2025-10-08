import { type Queues } from '../enums/queue.enum';

export default interface IQueue {
  publish(queue: Queues, payload: any): Promise<void>;

  consume(queues: Queues[], callback: (queueName: Queues, message: any) => Promise<void>): Promise<void>;
}
