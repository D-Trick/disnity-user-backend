// types
import type {
    MyServerPaginateOptions,
    TagServerPaginateOptions,
    SearchServerPaginateOptions,
    CategoryServerPaginateOptions,
} from '../types/servers-pagination.type';
// @nestjs
import { Injectable } from '@nestjs/common';
// lib
import { isEmpty } from '@lib/lodash';
// utils
import { filterQueryFormat } from '../utils/query-format';
// repositories
import { TagRepository } from '@databases/repositories/tag';
import { GuildRepository } from '@databases/repositories/guild';

// ----------------------------------------------------------------------

@Injectable()
export class PaginateService {
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
     * @param {CategoryServerPaginateOptions} options
     */
    async categoryServerPaginate(options: CategoryServerPaginateOptions) {
        const { categoryId, filterQuery } = options;
        const { itemSize, page, min, max, sort } = filterQueryFormat(filterQuery);

        const serverIds = await this.guildRepository.findCategoryGuildIds({
            where: {
                category_id: categoryId,
                max,
                min,
            },

            orderBy: {
                sort,
            },

            limit: itemSize,
            offset: page,
        });
        if (isEmpty(serverIds)) {
            return { totalCount: 0, list: [] };
        }

        const promise1 = this.guildRepository.totalCategoryGuildsCount({
            where: {
                category_id: categoryId,
                min,
                max,
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
                sort,
            },
        });
        const [total, servers] = await Promise.all([promise1, promise2]);

        return {
            totalCount: parseInt(total.count),
            list: servers,
        };
    }

    /**
     * 태그와 일치한 서버 목록 페이지네이션
     * @param {TagServerPaginateOptions} options
     */
    async tagServerPaginate(options: TagServerPaginateOptions) {
        const { tagName, filterQuery } = options;
        const { itemSize, page, min, max, sort } = filterQueryFormat(filterQuery);

        const serverIds = await this.tagRepository.findTagGuildIds({
            where: {
                tag_name: tagName,
                max,
                min,
            },

            orderBy: {
                sort,
            },

            limit: itemSize,
            offset: page,
        });
        if (isEmpty(serverIds)) {
            return { totalCount: 0, list: [] };
        }

        const promise1 = this.tagRepository.totalTagGuildsCount({
            where: {
                tag_name: tagName,
                min,
                max,
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
                sort,
            },
        });
        const [total, servers] = await Promise.all([promise1, promise2]);

        return {
            totalCount: parseInt(total.count),
            list: servers,
        };
    }

    /**
     * 검색 키워드와 일치한 서버 목록 페이지네이션
     * @param {searchServerPaginateOptions} options
     */
    async searchServerPaginate(options: SearchServerPaginateOptions) {
        const { keyword, filterQuery } = options;
        const { itemSize, page, min, max, sort } = filterQueryFormat(filterQuery);

        const serverIds = await this.guildRepository.findSearchGuildIds({
            where: {
                keyword,
                max,
                min,
            },

            orderBy: {
                sort,
            },

            limit: itemSize,
            offset: page,
        });
        if (isEmpty(serverIds)) {
            return { totalCount: 0, list: [] };
        }

        const promise1 = this.guildRepository.totalSearchGuildsCount({
            where: {
                keyword,
                min,
                max,
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
                sort,
            },
        });
        const [total, servers] = await Promise.all([promise1, promise2]);

        return {
            totalCount: parseInt(total.count),
            list: servers,
        };
    }

    /**
     * 나의 서버 목록 페이지네이션
     * @param {MyServerPaginateOptions} options
     */
    async myServerPaginate(options: MyServerPaginateOptions) {
        const { userId, filterQuery } = options;
        const { itemSize, page, sort } = filterQueryFormat(filterQuery);

        const serverIds = await this.guildRepository.findMyGuildIds({
            where: {
                user_id: userId,
            },

            orderBy: {
                sort,
            },

            limit: itemSize,
            offset: page,
        });
        if (isEmpty(serverIds)) {
            return { totalCount: 0, list: [] };
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
                sort,
            },
        });
        const [total, servers] = await Promise.all([promise1, promise2]);

        return {
            totalCount: parseInt(total.count),
            list: servers,
        };
    }

    /**************************************************
     * Private Methods
     **************************************************/
}
