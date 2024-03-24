// @nestjs
import { Injectable } from '@nestjs/common';
// lodash
import isEmpty from 'lodash/isEmpty';
// dtos
import { ServerFilterRequestDto } from '@models/servers/dtos';
// repositories
import { TagRepository } from '@databases/repositories/tag';
import { GuildRepository } from '@databases/repositories/guild';

// ----------------------------------------------------------------------

@Injectable()
export class ServersPaginationService {
    /**************************************************
     * Constructor
     **************************************************/
    constructor(
        private readonly tagRepository: TagRepository,
        private readonly guildRepository: GuildRepository,
    ) {}

    /**************************************************
     * Public Methods
     **************************************************/
    /**
     * 카테고리와 일치한 서버 목록 페이지네이션
     * @param {ServerFilterRequestDto} request
     */
    async categoryServerPaginate(categoryId: number, request: ServerFilterRequestDto) {
        const serverIds = await this.guildRepository.findCategoryGuildIds({
            where: {
                category_id: categoryId,
                ...request.toMemberRange(),
            },

            orderBy: {
                sort: request.toServerSort(),
            },

            ...request.toPagination(),
        });
        if (isEmpty(serverIds)) {
            return { totalCount: '0', list: [] };
        }

        const promise1 = this.guildRepository.totalCategoryGuildsCount({
            where: {
                category_id: categoryId,
                ...request.toMemberRange(),
            },
        });
        const promise2 = this.guildRepository.findGuildsByIds<'base'>({
            select: {
                sql: {
                    base: true,
                },
            },
            where: {
                IN: {
                    ids: serverIds,
                },
            },
            orderBy: {
                sort: request.toServerSort(),
            },
        });
        const [total, servers] = await Promise.all([promise1, promise2]);

        return {
            totalCount: total.count,
            list: servers,
        };
    }

    /**
     * 태그와 일치한 서버 목록 페이지네이션
     * @param {string} tagName
     * @param {ServerFilterRequestDto} request
     */
    async tagServerPaginate(tagName: string, request: ServerFilterRequestDto) {
        const serverIds = await this.tagRepository.findTagGuildIds({
            where: {
                tag_name: tagName,
                ...request.toMemberRange(),
            },

            orderBy: {
                sort: request.toServerSort(),
            },

            ...request.toPagination(),
        });
        if (isEmpty(serverIds)) {
            return { totalCount: '0', list: [] };
        }

        const promise1 = this.tagRepository.totalTagGuildsCount({
            where: {
                tag_name: tagName,
                ...request.toMemberRange(),
            },
        });
        const promise2 = this.guildRepository.findGuildsByIds<'base'>({
            select: {
                sql: {
                    base: true,
                },
            },
            where: {
                IN: {
                    ids: serverIds,
                },
            },
            orderBy: {
                sort: request.toServerSort(),
            },
        });
        const [total, servers] = await Promise.all([promise1, promise2]);

        return {
            totalCount: total.count,
            list: servers,
        };
    }

    /**
     * 검색 키워드와 일치한 서버 목록 페이지네이션
     * @param {string} keyword
     * @param {ServerFilterRequestDto} request
     */
    async searchServerPaginate(keyword: string, request: ServerFilterRequestDto) {
        const serverIds = await this.guildRepository.findSearchGuildIds({
            where: {
                keyword,
                ...request.toMemberRange(),
            },

            orderBy: {
                sort: request.toServerSort(),
            },

            ...request.toPagination(),
        });
        if (isEmpty(serverIds)) {
            return { totalCount: '0', list: [] };
        }

        const promise1 = this.guildRepository.totalSearchGuildsCount({
            where: {
                keyword,
                ...request.toMemberRange(),
            },
        });
        const promise2 = this.guildRepository.findGuildsByIds<'base'>({
            select: {
                sql: {
                    base: true,
                },
            },
            where: {
                IN: {
                    ids: serverIds,
                },
            },
            orderBy: {
                sort: request.toServerSort(),
            },
        });
        const [total, servers] = await Promise.all([promise1, promise2]);

        return {
            totalCount: total.count,
            list: servers,
        };
    }

    /**
     * 나의 서버 목록 페이지네이션
     * @param {string} userId
     * @param {ServerFilterRequestDto} request
     */
    async myServerPaginate(userId: string, request: ServerFilterRequestDto) {
        const serverIds = await this.guildRepository.findMyGuildIds({
            where: {
                user_id: userId,
            },

            orderBy: {
                sort: request.toServerSort(),
            },

            ...request.toPagination(),
        });
        if (isEmpty(serverIds)) {
            return { totalCount: '0', list: [] };
        }

        const promise1 = this.guildRepository.totalMyGuildsCount({
            where: {
                user_id: userId,
            },
        });
        const promise2 = this.guildRepository.findGuildsByIds<'myGuild'>({
            select: {
                sql: {
                    myGuild: true,
                },
            },
            where: {
                IN: {
                    ids: serverIds,
                },
            },
            orderBy: {
                sort: request.toServerSort(),
            },
        });
        const [total, servers] = await Promise.all([promise1, promise2]);

        return {
            totalCount: total.count,
            list: servers,
        };
    }

    /**************************************************
     * Private Methods
     **************************************************/
}
