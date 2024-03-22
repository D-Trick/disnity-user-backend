// types
import type { AdminGuild } from '../types/users.type';
import type { Channel } from '@models/discord-api/types/discord-api.type';
// @nestjs
import { Injectable, UnauthorizedException } from '@nestjs/common';
// lodash
import isEmpty from 'lodash/isEmpty';
// messages
import { AUTH_ERROR_MESSAGES, DISCORD_ERROR_MESSAGES } from '@common/messages';
// helpers
import { UtilHelper } from '../helper/util.helper';
import { FilterHelper } from '../helper/filter.helper';
// services
import { CacheDataService } from '@cache/cache-data.service';
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

        private readonly cacheDataService: CacheDataService,

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
        const cacheUser = await this.cacheDataService.getUserById(userId);
        if (!cacheUser) {
            const refreshUser = await this.userRepository.cFindOne({
                select: {
                    id: true,
                    global_name: true,
                    username: true,
                    discriminator: true,
                    email: true,
                    verified: true,
                    avatar: true,
                    locale: true,
                    created_at: true,
                    updated_at: true,
                },
                where: {
                    id: userId,
                },
            });
            if (!refreshUser) {
                throw new UnauthorizedException(AUTH_ERROR_MESSAGES.LOGIN_PLEASE);
            }

            await this.cacheDataService.setUser(refreshUser);

            return refreshUser;
        }

        return cacheUser;
    }

    /**
     * 디스코드 유저 가져오기
     * @param {string} userId
     */
    async getDiscordUser(userId: string) {
        const cacheDiscordUser = await this.cacheDataService.getDiscordUserById(userId);

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

        let channels: Channel[] = [];

        const adminGuild = this.utilHelper.getAdminGuild(guildId, discordUser.admin_guilds);
        if (adminGuild) {
            if (refresh) {
                channels = [];
            } else {
                channels = isEmpty(adminGuild.channels) ? [] : adminGuild.channels;
            }

            if (isEmpty(channels)) {
                channels = await this.filterHelper.inviteCodeCreatePermissionChannelsFilter(guildId);
                adminGuild.channels = channels;

                await this.cacheDataService.setDiscordUser(discordUser);
            }
        }

        return channels;
    }
}
