// types
import type { CacheUser } from '@cache/types';
import type { AdminGuild, SaveLoginInfo } from './types/users.type';
import type { Channel } from '@models/discord-api/types/discordApi.type';
// lib
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { isEmpty } from '@lib/lodash';
//uitls
import { generateSnowflakeId } from '@utils/index';
import { filterAdminGuilds } from '@utils/discord/permission';
// cache
import { CACHE_KEYS } from '@cache/redis/keys';
// configs
import { refreshTokenTTL } from '@config/jwt.config';
// helpers
import { UtilHelper } from './helper/util.helper';
import { FilterHelper } from './helper/filter.helper';
// services
import { CacheService } from '@cache/redis/cache.service';
import { DiscordApiService } from '@models/discord-api/discordApi.service';
// repositories
import { UserRepository } from '@databases/repositories/user';
import { AccessLogRepository } from '@databases/repositories/access-log';

// ----------------------------------------------------------------------

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);

    /**************************************************
     * Constructor
     **************************************************/
    constructor(
        private readonly dataSource: DataSource,

        private readonly utilHelper: UtilHelper,
        private readonly filterHelper: FilterHelper,

        private readonly cacheService: CacheService,
        private readonly discordApiService: DiscordApiService,

        private readonly userRepository: UserRepository,
        private readonly accessLogRepository: AccessLogRepository,
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
                throw new UnauthorizedException();
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
            throw new UnauthorizedException();
        }

        return cacheDiscordUser;
    }

    /**
     * 로그인 유저 정보 저장
     * @param user
     */
    async saveLoginInfo(loginUser: SaveLoginInfo): Promise<{ result: boolean }> {
        let promise1 = undefined;
        let promise2 = undefined;

        const queryRunner = this.dataSource.createQueryRunner();
        try {
            const user = await this.userRepository.selectOne({
                select: {
                    columns: {
                        id: true,
                        created_at: true,
                    },
                },
                where: {
                    id: loginUser.id,
                },
            });

            await queryRunner.startTransaction();
            if (isEmpty(user)) {
                promise1 = this.userRepository.cInsert({
                    transaction: queryRunner,
                    values: {
                        id: loginUser.id,
                        global_name: loginUser.global_name,
                        username: loginUser.username,
                        discriminator: loginUser.discriminator,
                        email: loginUser.email,
                        verified: loginUser.verified,
                        avatar: loginUser.avatar,
                        banner: loginUser.banner,
                        locale: loginUser.locale,
                        premium_type: loginUser.premium_type,
                        created_at: () => 'now()',
                    },
                });
            } else {
                promise1 = this.userRepository.cUpdate({
                    transaction: queryRunner,
                    values: {
                        global_name: loginUser.global_name,
                        username: loginUser.username,
                        discriminator: loginUser.discriminator,
                        email: loginUser.email,
                        verified: loginUser.verified,
                        avatar: loginUser.avatar,
                        banner: loginUser.banner,
                        locale: loginUser.locale,
                        premium_type: loginUser.premium_type,
                        created_at: isEmpty(user.created_at) ? () => 'now()' : undefined,
                        updated_at: () => 'now()',
                    },
                    where: {
                        id: loginUser.id,
                    },
                });
            }
            promise2 = this.accessLogRepository.cInsert({
                transaction: queryRunner,
                values: {
                    id: generateSnowflakeId(),
                    user_id: loginUser.id,
                    ip: loginUser.ip,
                },
            });
            await Promise.all([promise1, promise2]);
            await queryRunner.commitTransaction();

            const disnityUser = await this.userRepository.selectOne<'base'>({
                select: {
                    sql: {
                        base: true,
                    },
                },
                where: {
                    id: loginUser.id,
                },
            });
            const discordUser = {
                ...disnityUser,
                guilds: loginUser.guilds,
                admin_guilds: loginUser.admin_guilds,
                access_token: loginUser.access_token,
                refresh_token: loginUser.refresh_token,
            };
            promise1 = this.cacheService.set(CACHE_KEYS.DISCORD_USER(loginUser.id), discordUser, refreshTokenTTL);
            promise2 = this.cacheService.set(CACHE_KEYS.DISNITY_USER(loginUser.id), disnityUser, refreshTokenTTL);
            await Promise.all([promise1, promise2]);

            return { result: true };
        } catch (error: any) {
            this.logger.error(error.message, error.stack);

            if (queryRunner.isTransactionActive) {
                await queryRunner.rollbackTransaction();
            }

            throw new UnauthorizedException();
        } finally {
            await queryRunner.release();
        }
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
     * 관리자 권한이 있는 길드 목록 새로고침
     * @param {string} userId
     */
    async refreshAdminGuilds(userId: string): Promise<AdminGuild[]> {
        const discordUser = await this.getDiscordUser(userId);
        const discordGuilds = await this.discordApiService.users(discordUser.access_token).guilds;
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

    /**
     * 초대생성 권한이 있는 길드 채널 목록 조회
     * @param {string} guildId
     * @param {string} userId
     */
    async channels(guildId: string, userId: string, refresh: boolean): Promise<Channel[]> {
        await this.refreshAdminGuilds(userId);

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
