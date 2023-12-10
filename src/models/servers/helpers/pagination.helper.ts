// types
import type { SelectFilter } from '@common/types/select-filter.type';
import type {
    CategoryServerPaginateOptions,
    MyServerPaginateOptions,
    SearchServerPaginateOptions,
    TagServerPaginateOptions,
} from '../types/pagination.type';
// @nestjs
import { Injectable } from '@nestjs/common';
// lib
import { isEmpty } from '@lib/lodash';
// utils
import { pagination } from '@utils/index';
// repositories
import { TagRepository } from '@databases/repositories/tag';
import { GuildRepository } from '@databases/repositories/guild';

// ----------------------------------------------------------------------

@Injectable()
export class PaginationHelper {
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
    async categoryServerPaginate(options: CategoryServerPaginateOptions) {
        const { categoryId, filter } = options;
        const { itemSize, page, min, max, sort } = this.filterFormat(filter);

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

    async tagServerPaginate(options: TagServerPaginateOptions) {
        const { tagName, filter } = options;
        const { itemSize, page, min, max, sort } = this.filterFormat(filter);

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
        const { keyword, filter } = options;
        const { itemSize, page, min, max, sort } = this.filterFormat(filter);

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
     * @param {myServerPaginateOptions} options
     */
    async myServerPaginate(options: MyServerPaginateOptions) {
        const { userId, filter } = options;
        const { itemSize, page, sort } = this.filterFormat(filter);

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
    /**
     * QueryString(page,itemSize, sort, min, max)를 가져와서 DB에 SELECT가능한 포맷형태로 변경
     * @param {SelectFilter} filter
     */
    private filterFormat(filter: SelectFilter): SelectFilter {
        const { page, itemSize, sort, min = 0, max = 0 } = filter || {};

        const pageFormat = pagination(page, itemSize);

        let tempSort = sort;
        if (sort === 'create') {
            tempSort = 'created_at';
        } else if (sort === 'member') {
            tempSort = 'member';
        } else {
            tempSort = 'refresh_date';
        }

        return {
            ...pageFormat,
            sort: tempSort,
            min,
            max,
        };
    }
}
