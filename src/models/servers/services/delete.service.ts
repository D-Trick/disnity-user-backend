// @nestjs
import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
// lib
import { DataSource } from 'typeorm';
import { isEmpty } from '@lib/lodash';
// utils
import { promiseAllSettled } from '@utils/index';
// messages
import { SERVER_ERROR_MESSAGES, HTTP_ERROR_MESSAGES } from '@common/messages';
// repositories
import { TagRepository } from '@databases/repositories/tag';
import { UserRepository } from '@databases/repositories/user';
import { GuildRepository } from '@databases/repositories/guild';
import { EmojiRepository } from '@databases/repositories/emoji';
import { GuildScheduledRepository } from '@databases/repositories/guild-scheduled';
import { GuildAdminPermissionRepository } from '@databases/repositories/guild-admin-permission';

// ----------------------------------------------------------------------

@Injectable()
export class ServersDeleteService {
    /**************************************************
     * Constructor
     **************************************************/
    constructor(
        private readonly dataSource: DataSource,

        private readonly tagRepository: TagRepository,
        private readonly userRepository: UserRepository,
        private readonly emojiRepository: EmojiRepository,
        private readonly guildRepository: GuildRepository,

        private readonly guildScheduledRepository: GuildScheduledRepository,
        private readonly guildAdminPermissionRepository: GuildAdminPermissionRepository,
    ) {}

    /**************************************************
     * Public Methods
     **************************************************/
    /**
     * 서버 삭제
     * @param {string} userId
     * @param {string} serverId
     */
    async delete(userId: string, serverId: string): Promise<{ result: boolean }> {
        const queryRunner = this.dataSource.createQueryRunner();

        try {
            const user = await this.userRepository.selectOne({
                select: {
                    sql: {
                        base: true,
                    },
                },
                where: {
                    id: userId,
                },
            });

            const guild = await this.guildRepository.selectOne({
                select: {
                    columns: {
                        id: true,
                        is_admin_open: true,
                    },
                },
                where: {
                    id: serverId,
                    user_id: user.id,
                },
            });
            if (isEmpty(guild)) {
                throw new NotFoundException(SERVER_ERROR_MESSAGES.SERVER_NOT_FOUND);
            }

            if (guild.is_admin_open === 0) {
                throw new ForbiddenException(HTTP_ERROR_MESSAGES['403']);
            }

            await queryRunner.startTransaction();

            const serversDelete = await this.guildRepository.cDelete({
                transaction: queryRunner,
                where: {
                    id: serverId,
                    user_id: user.id,
                },
            });
            const isNotServer = serversDelete.affected === 0;
            if (isNotServer) {
                throw new BadRequestException(SERVER_ERROR_MESSAGES.DELETE_FAILED_SERVER_NOT_FOUND);
            }

            const promise1 = this.tagRepository.cDelete({
                transaction: queryRunner,
                where: {
                    guild_id: serverId,
                },
            });

            const promise2 = this.emojiRepository.cDelete({
                transaction: queryRunner,
                where: {
                    guild_id: serverId,
                },
            });

            const promise3 = this.guildAdminPermissionRepository.cDelete({
                transaction: queryRunner,
                where: {
                    guild_id: serverId,
                },
            });

            const promise4 = this.guildScheduledRepository.cDelete({
                transaction: queryRunner,
                where: {
                    guild_id: serverId,
                },
            });
            await promiseAllSettled([promise1, promise2, promise3, promise4]);

            await queryRunner.commitTransaction();

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
