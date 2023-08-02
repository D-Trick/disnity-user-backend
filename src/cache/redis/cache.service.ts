// types
import type { CacheUser } from '@models/users/ts/interfaces/users.interface';
import type { Cache } from 'cache-manager';
// lib
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

// ----------------------------------------------------------------------

@Injectable()
export class CacheService {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

    async set<T = any>(key: string | number, value: T, ttl?: number): Promise<void> {
        return this.cacheManager.set(key.toString(), value, ttl);
    }

    async get<T = any>(key: string | number): Promise<T> {
        return this.cacheManager.get(key.toString());
    }

    async del(key: string | number): Promise<any> {
        return this.cacheManager.del(key.toString());
    }

    async reset(): Promise<any> {
        return this.cacheManager.reset();
    }

    async getUser(userId: string): Promise<CacheUser> {
        const user = await this.get<CacheUser>(userId);

        if (!user) {
            throw new HttpException(null, HttpStatus.UNAUTHORIZED);
        }

        return user;
    }
}
