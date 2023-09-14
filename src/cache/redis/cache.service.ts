// types
import type { Cache } from 'cache-manager';
import type { CacheDiscordUser, CacheUser } from '@cache/types';
// lib
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
    async get<T = any>(key: string | number): Promise<T> {
        return this.cacheManager.get(key.toString());
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

    async getUser(userId: string) {
        return this.get<CacheUser>(`disnity-user-${userId}`);
    }

    async getDiscordUser(userId: string) {
        return this.get<CacheDiscordUser>(`discord-user-${userId}`);
    }
}
