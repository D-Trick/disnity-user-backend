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

        const paginationFormat = this.paginationQueryStringFormat(page, itemSize);
        const sortFormat = this.sortQueryStringFormat(sort);
        const minAndMaxFormat = this.minAndMaxQueryStringFormat(min, max);

        return {
            page: paginationFormat.page,
            itemSize: paginationFormat.itemSize,

            sort: sortFormat,

            min: minAndMaxFormat.min,
            max: minAndMaxFormat.max,
        };
    }

    /**
     * pagination을 위한 querystring format
     * @param {number} page
     * @param {number} itemSize
     * @param {number} defaultItemSize?
     */
    private paginationQueryStringFormat(page: number = 0, itemSize: number, defaultItemSize: number = 30) {
        let currentPage = page;
        let currentItemSize = itemSize || defaultItemSize;

        const MIN_ITEM_SIZE = 1;
        const MAX_ITEM_SIZE = 100;

        // 표시 목록 수
        if (currentItemSize < MIN_ITEM_SIZE || currentItemSize > MAX_ITEM_SIZE) {
            currentItemSize = defaultItemSize;
        }

        // 현재 페이지
        if (currentPage > 1) {
            currentPage = (page - 1) * currentItemSize;
        } else {
            currentPage = 0;
        }

        return {
            page,
            itemSize,
        };
    }

    /**
     * 정렬을 위한 querystring format
     * @param {string} sort
     */
    private sortQueryStringFormat(sort: string = 'refresh') {
        if (sort === 'create') {
            return 'created_at';
        } else if (sort === 'member') {
            return 'member';
        } else {
            return 'refresh_date';
        }
    }

    /**
     * 멤버수 범위 querystring format
     * @param {number} min
     * @param {number} max
     */
    private minAndMaxQueryStringFormat(min: number = 0, max: number = 0) {
        return {
            min,
            max,
        };
    }
}
