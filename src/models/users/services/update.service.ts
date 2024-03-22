// types
import type { AdminGuild } from '../types/users.type';
// lib
import { Injectable } from '@nestjs/common';
//uitls
import { filterAdminGuilds } from '@utils/discord/permission';
// helpers
import { FilterHelper } from '../helper/filter.helper';
// services
import { CacheDataService } from '@cache/cache-data.service';
import { UsersDataService } from './data.service';
import { DiscordApiUsersService } from '@models/discord-api/services/users.service';

// ----------------------------------------------------------------------

@Injectable()
export class UsersUpdateService {
    /**************************************************
     * Constructor
     **************************************************/
    constructor(
        private readonly filterHelper: FilterHelper,

        private readonly dataService: UsersDataService,
        private readonly cacheDataService: CacheDataService,
        private readonly discordApiUsersService: DiscordApiUsersService,
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
        const discordGuilds = await this.discordApiUsersService.guilds(discordUser.access_token);
        const discordAdminGuilds = filterAdminGuilds(discordGuilds);

        await this.cacheDataService.setDiscordUser({
            ...discordUser,
            admin_guilds: discordAdminGuilds,
        });

        const adminGuilds = this.filterHelper.removeRegisteredGuild(discordAdminGuilds);

        return adminGuilds;
    }
}
