// types
import type { CacheDiscordUser, CacheGuildAdmin, CacheMenus, CacheUser } from '@cache/types';
// lib
import { Injectable } from '@nestjs/common';
// configs
import { REFRESH_TOKEN_TTL } from '@config/jwt.config';
// cache
import { CACHE_KEYS } from './keys';
// services
import { CacheService } from './cache.service';

// ----------------------------------------------------------------------

@Injectable()
export class CacheDataService {
    /**************************************************
     * Constructor
     **************************************************/
    constructor(private readonly cacheService: CacheService) {}

    /**************************************************
     * Public Methods
     **************************************************/
    /******************************
     * 디스니티 유저정보
     ******************************/
    async getUserById(userId: string) {
        return await this.cacheService.get<CacheUser>(CACHE_KEYS.DISNITY_USER(userId));
    }
    async setUser(user: CacheUser) {
        return await this.cacheService.set(CACHE_KEYS.DISNITY_USER(user.id), user, REFRESH_TOKEN_TTL);
    }

    /******************************
     * 디스코드 유저정보
     ******************************/
    async getDiscordUserById(userId: string) {
        return await this.cacheService.get<CacheDiscordUser>(CACHE_KEYS.DISCORD_USER(userId));
    }
    async setDiscordUser(user: CacheDiscordUser) {
        return await this.cacheService.set<CacheDiscordUser>(CACHE_KEYS.DISCORD_USER(user.id), user, REFRESH_TOKEN_TTL);
    }

    /******************************
     * 디스니티 봇이 서버에 추가될때 가져왔던 서버 관리자 목록을 조회한다.
     ******************************/
    async getGuildAdminsByGuildId(guildId: string) {
        return await this.cacheService.get<CacheGuildAdmin[]>(CACHE_KEYS.DISNITY_BOT_ADMINS(guildId));
    }

    /******************************
     * Menu 목록
     ******************************/
    async getMenusByType(type: string) {
        return await this.cacheService.get<CacheMenus>(CACHE_KEYS.MENUES(type));
    }
    async setMenus(type: string, menus: CacheMenus) {
        const ttl1Day = 1000 * 60 * 60 * 24;

        return await this.cacheService.set<CacheMenus>(CACHE_KEYS.MENUES(type), menus, ttl1Day);
    }
}
