import { RedisModuleOptions } from 'nestjs-redis';
export const redisConfig: RedisModuleOptions = {
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
};
