// src/rabbitmq/rabbitmq.service.ts
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqp-connection-manager';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private readonly logger = new Logger(RabbitMQService.name);
  private connection: amqp.AmqpConnectionManager;
  private channelWrapper: amqp.ChannelWrapper;

  constructor(private config: ConfigService) {}

  async onModuleInit() {
    const url = `amqp://${this.config.get('RABBITMQ_USER')}:${this.config.get('RABBITMQ_PASS')}@${this.config.get('RABBITMQ_HOST')}:${this.config.get('RABBITMQ_PORT')}`;

    this.connection = amqp.connect([url], {
      heartbeatIntervalInSeconds: 5,
      reconnectTimeInSeconds: 5,
    });

    this.connection.on('connect', () =>
      this.logger.log('Connected to RabbitMQ'),
    );
    this.connection.on('disconnect', (err) =>
      this.logger.error('RabbitMQ disconnected', err),
    );

    this.channelWrapper = this.connection.createChannel({
      json: true,
      setup: (channel) =>
        Promise.all([
          channel.assertQueue(this.config.get('RABBITMQ_QUEUE_TAX'), {
            durable: true,
          }),
          channel.assertQueue(this.config.get('RABBITMQ_QUEUE_PERMIT'), {
            durable: true,
          }),
        ]),
    });
  }

  async publishToQueue(queue: string, message: any) {
    try {
      await this.channelWrapper.sendToQueue(queue, message, {
      });
    } catch (err) {
      this.logger.error(`Error publishing to ${queue}`, err);
      throw err;
    }
  }
}
