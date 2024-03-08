// @nestjs
import { CacheModuleOptions } from '@nestjs/cache-manager';
// lib
import { redisStore } from 'cache-manager-redis-yet';
// configs
import { ENV_CONFIG } from './env.config';

// ----------------------------------------------------------------------
const CONFIG = {
    name: 'discord',
    host: ENV_CONFIG.REDIS_HOST,
    port: 6379,
} as const;
// ----------------------------------------------------------------------

export const REDIS_CONFIG: CacheModuleOptions = {
    useFactory: async () => ({
        store: redisStore,
        url: `redis://${CONFIG.host}:${CONFIG.port}`,
        ttl: 1000 * 30,
    }),
    isGlobal: true,
} as const;
