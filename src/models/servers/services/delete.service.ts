// @nestjs
import {
    Injectable,
    HttpException,
    HttpStatus,
    BadRequestException,
    NotFoundException,
    ForbiddenException,
    Logger,
} from '@nestjs/common';
// lib
import { DataSource } from 'typeorm';
import { isEmpty } from '@lib/lodash';
// utils
import { promiseAllSettled } from '@utils/index';
// messages
import { ERROR_MESSAGES } from '@common/messages';
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
    private readonly logger = new Logger(ServersDeleteService.name);

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
                throw new NotFoundException(ERROR_MESSAGES.SERVER_NOT_FOUND);
            }

            if (guild.is_admin_open === 0) {
                throw new ForbiddenException(ERROR_MESSAGES.E403);
            }

            await queryRunner.startTransaction();

            const serversDelete = await this.guildRepository.cDelete({
                transaction: queryRunner,
                where: {
                    id: serverId,
                    user_id: user.id,
                },
            });
            if (serversDelete.affected === 0) {
                throw new BadRequestException(ERROR_MESSAGES.DELETE_SERVER_NOT_FOUND);
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
        } catch (error: any) {
            this.logger.error(error.message, error.stack);

            if (queryRunner.isTransactionActive) {
                await queryRunner.rollbackTransaction();
            }

            throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
        } finally {
            await queryRunner.release();
        }
    }
}
