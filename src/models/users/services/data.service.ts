// types
import type { CacheUser } from '@cache/types';
import type { AdminGuild } from '../types/users.type';
import type { Channel } from '@models/discord-api/types/discordApi.type';
// @nestjs
import { Injectable, UnauthorizedException } from '@nestjs/common';
// lib
import { isEmpty } from '@lib/lodash';
// cache
import { CACHE_KEYS } from '@cache/redis/keys';
// configs
import { refreshTokenTTL } from '@config/jwt.config';
// messages
import { AUTH_ERROR_MESSAGES, DISCORD_ERROR_MESSAGES } from '@common/messages';
// helpers
import { UtilHelper } from '../helper/util.helper';
import { FilterHelper } from '../helper/filter.helper';
// services
import { CacheService } from '@cache/redis/cache.service';
// repositories
import { UserRepository } from '@databases/repositories/user';

// ----------------------------------------------------------------------

@Injectable()
export class UsersDataService {
    /**************************************************
     * Constructor
     **************************************************/
    constructor(
        private readonly utilHelper: UtilHelper,
        private readonly filterHelper: FilterHelper,

        private readonly cacheService: CacheService,

        private readonly userRepository: UserRepository,
    ) {}

    /**************************************************
     * Public Methods
     **************************************************/
    /**
     * 디스니티 유저 가져오기
     * @param {string} userId
     */
    async getUser(userId: string) {
        const cacheUser = await this.cacheService.getUser(userId);
        if (!cacheUser) {
            const refreshUser = await this.userRepository.selectOne<'base'>({
                select: {
                    sql: {
                        base: true,
                    },
                },
                where: {
                    id: userId,
                },
            });
            if (!refreshUser) {
                throw new UnauthorizedException(AUTH_ERROR_MESSAGES.LOGIN_PLEASE);
            }

            await this.cacheService.set<CacheUser>(CACHE_KEYS.DISNITY_USER(userId), refreshUser, refreshTokenTTL);

            return refreshUser;
        }

        return cacheUser;
    }

    /**
     * 디스코드 유저 가져오기
     * @param {string} userId
     */
    async getDiscordUser(userId: string) {
        const cacheDiscordUser = await this.cacheService.getDiscordUser(userId);

        if (!cacheDiscordUser || !cacheDiscordUser?.access_token) {
            throw new UnauthorizedException(DISCORD_ERROR_MESSAGES.LOGIN_PLEASE);
        }

        return cacheDiscordUser;
    }

    /**
     * 관리자 권한이 있는 나의 길드 목록 조회
     * @param {string} userId
     */
    async getAdminGuilds(userId: string): Promise<AdminGuild[]> {
        const discordUser = await this.getDiscordUser(userId);

        const adminGuilds = this.filterHelper.removeRegisteredGuild(discordUser.admin_guilds);

        return adminGuilds;
    }

    /**
     * 초대생성 권한이 있는 길드 채널 목록 조회
     * @param {string} guildId
     * @param {string} userId
     * @param {boolean} refresh
     */
    async getChannels(guildId: string, userId: string, refresh: boolean): Promise<Channel[]> {
        const discordUser = await this.getDiscordUser(userId);

        let channels = [];

        const adminGuild: any = this.utilHelper.getAdminGuild(guildId, discordUser.admin_guilds);
        if (adminGuild) {
            if (refresh) {
                channels = [];
            } else {
                channels = isEmpty(adminGuild.channels) ? [] : adminGuild.channels;
            }

            if (isEmpty(channels)) {
                channels = await this.filterHelper.inviteCodeCreatePermissionChannelsFilter(guildId);
                adminGuild.channels = channels;

                await this.cacheService.set(CACHE_KEYS.DISCORD_USER(userId), discordUser, refreshTokenTTL);
            }
        }

        return channels;
    }
}
