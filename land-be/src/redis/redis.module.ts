import { Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import type { RedisClientOptions } from 'redis';

@Module({
  imports: [
    CacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const logger = new Logger('RedisModule');
        const options = {
          store: redisStore,
          host: config.get('REDIS_HOST'),
          port: config.get('REDIS_PORT'),
          ttl: config.get('REDIS_TTL'),
        };

        logger.log(
          `Attempting to connect to Redis at ${options.host}:${options.port}`,
        );

        return {
          ...options,
          onReady: (client) => {
            logger.log('Successfully connected to Redis');
            client.on('error', (err) => {
              logger.error('Redis connection error', err);
            });
            client.on('end', () => {
              logger.warn('Redis connection ended');
            });
            client.on('reconnecting', () => {
              logger.log('Attempting to reconnect to Redis...');
            });
          },
        };
      },
    }),
  ],
  exports: [CacheModule],
})
export class RedisModule {}
