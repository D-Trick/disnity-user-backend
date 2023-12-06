// types
import type { AdminGuild } from '../types/users.type';
// lib
import { Injectable } from '@nestjs/common';
//uitls
import { filterAdminGuilds } from '@utils/discord/permission';
// cache
import { CACHE_KEYS } from '@cache/redis/keys';
// configs
import { refreshTokenTTL } from '@config/jwt.config';
// helpers
import { FilterHelper } from '../helper/filter.helper';
// services
import { CacheService } from '@cache/redis/cache.service';
import { UsersDataService } from './data.service';
import { DiscordApiService } from '@models/discord-api/discordApi.service';

// ----------------------------------------------------------------------

@Injectable()
export class UsersUpdateService {
    /**************************************************
     * Constructor
     **************************************************/
    constructor(
        private readonly filterHelper: FilterHelper,

        private readonly cacheService: CacheService,
        private readonly dataService: UsersDataService,
        private readonly discordApiService: DiscordApiService,
    ) {}

    /**************************************************
     * Public Methods
     **************************************************/
    /**
     * 관리자 권한이 있는 길드 목록 새로고침
     * @param {string} userId
     */
    async refreshAdminGuilds(userId: string): Promise<AdminGuild[]> {
        const discordUser = await this.dataService.getDiscordUser(userId);
        const discordGuilds = await this.discordApiService.users().guilds(discordUser.access_token);
        const discordAdminGuilds = filterAdminGuilds(discordGuilds);

        await this.cacheService.set(
            CACHE_KEYS.DISCORD_USER(userId),
            {
                ...discordUser,
                admin_guilds: discordAdminGuilds,
            },
            refreshTokenTTL,
        );

        const adminGuilds = this.filterHelper.removeRegisteredGuild(discordAdminGuilds);

        return adminGuilds;
    }
}
