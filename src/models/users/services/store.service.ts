// types
import type { SaveLoginInfo } from '../types/users.type';
// @nestjs
import { Injectable } from '@nestjs/common';
// lib
import { DataSource } from 'typeorm';
import { isEmpty } from '@lib/lodash';
//uitls
import { generateSnowflakeId, promiseAllSettled } from '@utils/index';
// cache
import { CACHE_KEYS } from '@cache/redis/keys';
// configs
import { refreshTokenTTL } from '@config/jwt.config';
// services
import { CacheService } from '@cache/redis/cache.service';
// repositories
import { UserRepository } from '@databases/repositories/user';
import { AccessLogRepository } from '@databases/repositories/access-log';

// ----------------------------------------------------------------------

@Injectable()
export class UsersStoreService {
    /**************************************************
     * Constructor
     **************************************************/
    constructor(
        private readonly dataSource: DataSource,

        private readonly cacheService: CacheService,

        private readonly userRepository: UserRepository,
        private readonly accessLogRepository: AccessLogRepository,
    ) {}

    /**************************************************
     * Public Methods
     **************************************************/

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
            await promiseAllSettled([promise1, promise2]);

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
        } catch (error) {
            if (queryRunner.isTransactionActive) {
                await queryRunner.rollbackTransaction();
            }

            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}
