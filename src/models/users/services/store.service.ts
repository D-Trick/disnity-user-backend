// @nestjs
import { Injectable } from '@nestjs/common';
// lodash
import isEmpty from 'lodash/isEmpty';
// lib
import { DataSource } from 'typeorm';
// uitls
import { generateSnowflakeId, promiseAllSettled } from '@utils/index';
// dtos
import { AuthDiscordUserDto } from '@models/auth/dtos/auth-discord-user.dto';
// services
import { CacheDataService } from '@cache/cache-data.service';
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

        private readonly cacheDataService: CacheDataService,

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
    async loginUser(discordUser: AuthDiscordUserDto, accessIp: string) {
        const promiseList1 = [undefined, undefined];
        const promiseList2 = [undefined, undefined];

        const queryRunner = this.dataSource.createQueryRunner();
        try {
            const user = await this.userRepository.cFindOne({
                where: {
                    id: discordUser.id,
                },
            });

            await queryRunner.startTransaction();
            if (isEmpty(user)) {
                promiseList1[0] = this.userRepository.cInsert({
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
                promiseList1[0] = this.userRepository.cUpdate({
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
            promiseList1[1] = this.accessLogRepository.cInsert({
                transaction: queryRunner,
                values: {
                    id: generateSnowflakeId(),
                    user_id: discordUser.id,
                    ip: accessIp,
                },
            });
            await promiseAllSettled(promiseList1);
            await queryRunner.commitTransaction();

            const disnityUser = await this.userRepository.cFindOne({
                where: {
                    id: discordUser.id,
                },
            });
            const cacheDiscordUser = {
                ...disnityUser,
                guilds: discordUser.guilds,
                admin_guilds: discordUser.adminAuilds,
                access_token: discordUser.accessToken,
                refresh_token: discordUser.refreshToken,
            };
            promiseList2[0] = this.cacheDataService.setDiscordUser(cacheDiscordUser);
            promiseList2[1] = this.cacheDataService.setUser(disnityUser);
            await Promise.all(promiseList2);

            return true;
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
