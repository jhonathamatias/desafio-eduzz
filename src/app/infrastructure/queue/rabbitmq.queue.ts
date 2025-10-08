import amqp from 'amqplib';

import { type Queues } from './enums/queue.enum';
import type IQueue from './interfaces/queue.interface';

export default class RabbitMQQueue implements IQueue {
  private static connection: amqp.ChannelModel;
  private static channel: amqp.Channel;

  private static async getChannel(): Promise<amqp.Channel> {
    if (!this.connection) {
      this.connection = await amqp.connect(process.env.RABBITMQ_URI as string);
      this.channel = await this.connection.createChannel();
    }

    return this.channel;
  }

  public async publish(queue: Queues, payload: any): Promise<void> {
    const channel = await RabbitMQQueue.getChannel();

    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(payload)), { persistent: true });
  }

  public async consume(queues: Queues[], callback: (queue: Queues, message: any) => Promise<void>): Promise<void> {}
}
