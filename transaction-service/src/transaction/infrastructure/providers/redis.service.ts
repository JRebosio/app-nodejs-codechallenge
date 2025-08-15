import Redis from 'ioredis';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService implements OnModuleInit {
  private redis: Redis;
  private readonly logger = new Logger(RedisService.name);
  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const host = this.configService.get<string>('REDIS_HOST');

    if (!host) {
      throw new Error('REDIS_HOST is not defined');
    }

    const url = `redis://${host}`;

    try {
      const client = new Redis(url);

      this.redis = client;

      const pong = await client.ping();
      if (pong === 'PONG') {
        this.logger.log('RedisService dependencies initialized');
      } else {
        this.logger.error(
          'RedisService connection error: unexpected PING response',
        );
      }
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      this.logger.error('RedisService connection error', e.stack ?? e.message);
      throw e;
    }
  }

  async setKey<T = unknown>(
    key: string,
    data: T,
    ttlSeconds?: number,
  ): Promise<void> {
    try {
      if (!this.redis) {
        this.logger.warn(
          `[WARN-Redis-Save]: Redis client not initialized — skipping cache for key=${key}`,
        );
        return;
      }

      const value = JSON.stringify(data);
      if (typeof ttlSeconds === 'number') {
        await this.redis.set(key, value, 'EX', ttlSeconds);
      } else {
        await this.redis.set(key, value);
      }
    } catch (err: unknown) {
      const e = err instanceof Error ? err : new Error(String(err));
      this.logger.error(`[ERROR-Redis-Save]: ${e.message}`, e.stack);
    }
  }

  async getKey<T = string>(key: string): Promise<T | null> {
    try {
      const raw = (await this.redis?.get(key)) ?? null;
      if (raw === null) return null;

      try {
        const parsed: unknown = JSON.parse(raw);
        return parsed as T;
      } catch {
        return raw as unknown as T;
      }
    } catch (err: unknown) {
      const e = err instanceof Error ? err : new Error(String(err));
      this.logger.error(`[ERROR-Redis-Get]: ${e.message}`, e.stack);
      return null;
    }
  }

  async deleteKey(key: string): Promise<boolean> {
    try {
      if (!this.redis) {
        this.logger.warn(
          `[WARN-Redis-Delete]: Redis client not initialized — key=${key}`,
        );
        return false;
      }

      const result = await this.redis.del(key);
      if (result > 0) {
        this.logger.log(
          `[Redis-Delete]: Key deleted successfully — key=${key}`,
        );
        return true;
      } else {
        this.logger.warn(`[Redis-Delete]: Key not found — key=${key}`);
        return false;
      }
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      this.logger.error(`[ERROR-Redis-Delete]: ${e.message}`, e.stack);
      return false;
    }
  }
}
