// @nestjs
import { Injectable } from '@nestjs/common';
// lodash
import isEmpty from 'lodash/isEmpty';
// lib
import { DataSource } from 'typeorm';
// uitls
import { generateSnowflakeId, promiseAllSettled } from '@utils/index';
// cache
import { CACHE_KEYS } from '@cache/redis/keys';
// configs
import { refreshTokenTTL } from '@config/jwt.config';
// dtos
import { AuthDiscordUserDto } from '@models/auth/dtos/auth-discord-user.dto';
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
    async saveLoginInfo(discordUser: AuthDiscordUserDto, ip: string): Promise<{ result: boolean }> {
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
                    id: discordUser.id,
                },
            });

            await queryRunner.startTransaction();
            if (isEmpty(user)) {
                promise1 = this.userRepository.cInsert({
                    transaction: queryRunner,
                    values: {
                        id: discordUser.id,
                        global_name: discordUser.globalName,
                        username: discordUser.username,
                        discriminator: discordUser.discriminator,
                        email: discordUser.email,
                        verified: discordUser.verified,
                        avatar: discordUser.avatar,
                        banner: discordUser.banner,
                        locale: discordUser.locale,
                        premium_type: discordUser.premiumType,
                        created_at: () => 'now()',
                    },
                });
            } else {
                promise1 = this.userRepository.cUpdate({
                    transaction: queryRunner,
                    values: {
                        global_name: discordUser.globalName,
                        username: discordUser.username,
                        discriminator: discordUser.discriminator,
                        email: discordUser.email,
                        verified: discordUser.verified,
                        avatar: discordUser.avatar,
                        banner: discordUser.banner,
                        locale: discordUser.locale,
                        premium_type: discordUser.premiumType,
                        created_at: isEmpty(user.created_at) ? () => 'now()' : undefined,
                        updated_at: () => 'now()',
                    },
                    where: {
                        id: discordUser.id,
                    },
                });
            }
            promise2 = this.accessLogRepository.cInsert({
                transaction: queryRunner,
                values: {
                    id: generateSnowflakeId(),
                    user_id: discordUser.id,
                    ip,
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
                    id: discordUser.id,
                },
            });
            const cacheDiscordUser = {
                ...disnityUser,
                guilds: discordUser.guilds,
                admin_guilds: discordUser.admin_guilds,
                access_token: discordUser.access_token,
                refresh_token: discordUser.refresh_token,
            };
            promise1 = this.cacheService.set(
                CACHE_KEYS.DISCORD_USER(discordUser.id),
                cacheDiscordUser,
                refreshTokenTTL,
            );
            promise2 = this.cacheService.set(CACHE_KEYS.DISNITY_USER(discordUser.id), disnityUser, refreshTokenTTL);
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
