// types
import type { ServerDetail } from '../types/servers.type';
// @nestjs
import { Injectable, NotFoundException } from '@nestjs/common';
// lib
import { isEmpty } from '@lib/lodash';
// messages
import { HTTP_ERROR_MESSAGES } from '@common/messages';
// repositories
import { GuildRepository } from '@databases/repositories/guild';
import { EmojiRepository } from '@databases/repositories/emoji';
import { TagRepository } from '@databases/repositories/tag';
import { GuildAdminPermissionRepository } from '@databases/repositories/guild-admin-permission';

// ----------------------------------------------------------------------

@Injectable()
export class ServersDetailService {
    /**************************************************
     * Constructor
     **************************************************/
    constructor(
        private readonly tagRepository: TagRepository,
        private readonly emojiRepository: EmojiRepository,
        private readonly guildRepository: GuildRepository,
        private readonly guildAdminPermissionRepository: GuildAdminPermissionRepository,
    ) {}

    /**************************************************
     * Public Methods
     **************************************************/
    /**
     * 서버 상세조회
     * @param {string} id
     * @param {string} userId
     * @returns 서버상세 정보
     */
    async server(id: string, userId: string): Promise<ServerDetail> {
        let server = await this.guildRepository.findGuildDetailById({
            where: {
                id,
            },
        });

        const isEmptyPublicServerAndIsLogin = isEmpty(server) && !!userId;
        if (isEmptyPublicServerAndIsLogin) {
            server = await this.guildRepository.findMyGuildDetailById({
                where: {
                    id,
                    user_id: userId,
                },
            });
        }
        if (isEmpty(server)) {
            throw new NotFoundException(HTTP_ERROR_MESSAGES['404']);
        }

        const promise1 = this.tagRepository.selectMany({
            select: {
                columns: {
                    name: true,
                },
            },
            where: {
                guild_id: id,
            },
        });
        const promise2 = this.guildAdminPermissionRepository.findGuildAdmins({
            where: {
                guild_id: id,
            },
        });
        const promise3 = this.emojiRepository.selectMany({
            select: {
                columns: {
                    id: true,
                    name: true,
                    animated: true,
                },
            },
            where: {
                guild_id: id,
                animated: false,
            },
        });
        const promise4 = this.emojiRepository.selectMany({
            select: {
                columns: {
                    id: true,
                    name: true,
                    animated: true,
                },
            },
            where: {
                guild_id: id,
                animated: true,
            },
        });
        const [tags, admins, emojis, animate_emojis] = await Promise.all([promise1, promise2, promise3, promise4]);

        return {
            ...server,
            tags,
            admins,
            emojis,
            animate_emojis,
        };
    }

    /**
     * [Mypage] 나의 서버 상세 정보 조회
     * @param {string} id
     * @param {string } userId
     */
    async myServer(id: string, userId: string) {
        const server = await this.guildRepository.findMyGuildDetailById({
            where: {
                id,
                user_id: userId,
            },
        });
        if (isEmpty(server)) {
            throw new NotFoundException(HTTP_ERROR_MESSAGES['404']);
        }

        const tags = await this.tagRepository.selectMany({
            select: {
                columns: {
                    name: true,
                },
            },
            where: {
                guild_id: id,
            },
        });

        return {
            ...server,
            tags,
        };
    }
}
