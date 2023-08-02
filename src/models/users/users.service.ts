// types
import type { Select } from '@databases/ts/types/user.type';
import type { QueryRunner } from 'typeorm';
import type { AdminGuild, LoginUserSave } from './ts/interfaces/users.interface';
import type { Channel } from '@models/discord-api/ts/interfaces/discordApi.interface';
// lib
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { isEmpty } from '@lib/lodash';
import { getAdminGuilds } from '@lib/discord/permission';
// configs
import { refreshTokenTTL } from '@config/jwt.config';
// helpers
import { UtilHelper } from './helper/util.helper';
import { FilterHelper } from './helper/filter.helper';
// services
import { CacheService } from '@cache/redis/cache.service';
import { DiscordApiService } from '@models/discord-api/discordApi.service';
// repositorys
import { UserRepository } from '@databases/repositories/user.repository';
import { AccessLogRepository } from '@databases/repositories/access-log.repository';
import { generateSnowflakeId } from '@lib/snowflake';

// ----------------------------------------------------------------------

@Injectable()
export class UsersService {
    constructor(
        private readonly dataSource: DataSource,

        private readonly cacheService: CacheService,
        private readonly discordApiService: DiscordApiService,

        private readonly utilHelper: UtilHelper,
        private readonly filterHelper: FilterHelper,

        private readonly userRepository: UserRepository,
        private readonly accessLogRepository: AccessLogRepository,
    ) {}

    /**
     * 유저 가져오기
     * @param {string} userId
     */
    async getUser(userId: string, queryRunner?: QueryRunner): Promise<Select | undefined> {
        const user = await this.userRepository.selectOne({
            transaction: queryRunner,
            where: {
                id: userId,
            },
        });

        return user;
    }

    /**
     * 유저 정보 저장
     * @param user
     */
    async infoSave(loginUser: LoginUserSave): Promise<{ result: boolean }> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            let promise1 = undefined;
            let promise2 = undefined;

            const user = await this.getUser(loginUser.id, queryRunner);

            let userValues = undefined;
            if (isEmpty(user)) {
                userValues = {
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
                };

                promise1 = this.userRepository._insert({
                    transaction: queryRunner,
                    values: userValues,
                });
            } else {
                userValues = {
                    global_name: loginUser.global_name,
                    username: loginUser.username,
                    discriminator: loginUser.discriminator,
                    email: loginUser.email,
                    verified: loginUser.verified,
                    avatar: loginUser.avatar,
                    banner: loginUser.banner,
                    locale: loginUser.locale,
                    premium_type: loginUser.premium_type,
                    updated_at: () => 'now()',
                };

                if (isEmpty(user.created_at)) {
                    userValues.created_at = () => 'now()';
                }

                promise1 = this.userRepository._update({
                    transaction: queryRunner,
                    values: userValues,
                    where: {
                        id: loginUser.id,
                    },
                });
            }

            promise2 = this.accessLogRepository._insert({
                transaction: queryRunner,
                values: {
                    id: generateSnowflakeId(),
                    user_id: loginUser.id,
                    ip: loginUser.ip,
                },
            });
            await Promise.all([promise1, promise2]);
            await queryRunner.commitTransaction();

            const reloadUser = await this.getUser(loginUser.id);
            await this.cacheService.set(
                loginUser.id,
                {
                    ...reloadUser,
                    guilds: loginUser.guilds,
                    admin_guilds: loginUser.admin_guilds,
                    access_token: loginUser.access_token,
                    refresh_token: loginUser.refresh_token,
                },
                refreshTokenTTL,
            );

            return { result: true };
        } catch {
            if (queryRunner.isTransactionActive) {
                await queryRunner.rollbackTransaction();
            }

            throw new HttpException(null, HttpStatus.UNAUTHORIZED);
        } finally {
            await queryRunner.release();
        }
    }

    /**
     * 관리자 권한이 있는 길드 목록 조회
     * @param {string} userId
     */
    async guilds(userId: string): Promise<AdminGuild[]> {
        const cacheUser = await this.cacheService.getUser(userId);

        const promise = this.filterHelper.adminGuildsFilter(userId, cacheUser.admin_guilds);
        return promise;
    }

    /**
     * 관리자 권한이 있는 길드 목록 새로고침
     * @param {string} userId
     */
    async refreshGuilds(userId: string): Promise<AdminGuild[]> {
        const cacheUser = await this.cacheService.getUser(userId);
        const guilds = await this.discordApiService.users(cacheUser.access_token).guilds;

        const adminGuilds = getAdminGuilds(guilds);

        await this.cacheService.set(
            userId,
            {
                ...cacheUser,
                admin_guilds: adminGuilds,
            },
            refreshTokenTTL,
        );

        const promise = this.filterHelper.adminGuildsFilter(userId, adminGuilds);
        return promise;
    }

    /**
     * 초대생성 권한이 있는 길드 채널 목록 조회
     * @param {string} guildId
     * @param {string} userId
     */
    async channels(guildId: string, userId: string, refresh: boolean): Promise<Channel[]> {
        const cacheUser = await this.cacheService.getUser(userId);

        let channels = [];

        const adminGuild: any = this.utilHelper.getGuildByGuildId(guildId, cacheUser.admin_guilds);
        if (adminGuild) {
            if (refresh) {
                channels = [];
            } else {
                channels = isEmpty(adminGuild.channels) ? [] : adminGuild.channels;
            }

            if (isEmpty(channels)) {
                channels = await this.filterHelper.inviteCodeCreatePermissionChannelsFilter(guildId);
                adminGuild.channels = channels;

                await this.cacheService.set(userId, cacheUser, refreshTokenTTL);
            }
        }

        return channels;
    }
}
