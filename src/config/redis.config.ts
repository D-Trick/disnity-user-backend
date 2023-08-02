// @nestjs
import { CacheModuleOptions } from '@nestjs/cache-manager';
// lib
import { redisStore } from 'cache-manager-redis-yet';
import { ENV_CONFIG } from './env.config';

// ----------------------------------------------------------------------
const config = {
    name: 'discord',
    host: ENV_CONFIG.REDIS_HOST,
    port: 6379,
};
// ----------------------------------------------------------------------

/**
 * Redis Cache Config
 */
export const cacheConfig: CacheModuleOptions = {
    useFactory: async () => ({
        store: redisStore,
        url: `redis://${config.host}:${config.port}`,
        ttl: 1000 * 30,
    }),
    isGlobal: true,
};
