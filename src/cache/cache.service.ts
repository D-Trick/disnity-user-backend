// types
import type { Cache } from 'cache-manager';
// @nestjs
import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

// ----------------------------------------------------------------------

@Injectable()
export class CacheService {
    /**************************************************
     * Constructor
     **************************************************/
    constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

    /**************************************************
     * Public Methods
     **************************************************/
    async get<T = any>(key: string | number) {
        return this.cacheManager.get<T>(key.toString());
    }

    async set<T = any>(key: string | number, value: T, ttl?: number): Promise<void> {
        return this.cacheManager.set(key.toString(), value, ttl);
    }

    async del(key: string | number): Promise<any> {
        return this.cacheManager.del(key.toString());
    }

    async reset(): Promise<any> {
        return this.cacheManager.reset();
    }
}
