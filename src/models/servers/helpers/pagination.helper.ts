// types
import type { SelectFilter } from '@common/types/select-filter.type';
import type { PaginateOptions } from '../types/pagination.type';
import type { FindGuildsByIdsSqlName } from '@databases/types/guild.type';
// lib
import { Injectable } from '@nestjs/common';
import { isEmpty } from '@lib/lodash';
// utils
import { pagination } from '@utils/index';
// repositories
import { TagRepository } from '@databases/repositories/tag';
import { GuildRepository } from '@databases/repositories/guild';

// ----------------------------------------------------------------------

@Injectable()
export class PaginationHelper {
    private selectFilter: SelectFilter;

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
     * Server Pagination
     * @param {PaginateOptions} options
     * @returns 서버목록
     */
    async paginate<T extends FindGuildsByIdsSqlName>(options: PaginateOptions) {
        const { listType, filter } = options;

        this.selectFilter = this.filterFormat(filter);
        const { sort } = this.selectFilter;

        const serverIds = await this.getServerIds(options);
        if (isEmpty(serverIds)) return { totalCount: 0, list: [] };

        const promise1 = this.getTotalCount(options);
        const promise2 = this.guildRepository.findGuildsByIds<T>({
            select: {
                sql: {
                    base: listType !== 'my-server',
                    myGuild: listType === 'my-server',
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
     * listType에 맞는 총 길드 수 가져오기
     * (Pagination을 위해 총 개수를 구한다.)
     * @param {PaginateOptions} options
     */
    private async getTotalCount(options: PaginateOptions): Promise<{ count: string }> {
        const { listType, keyword, tagName, categoryId, userId } = options;
        const { min, max } = this.selectFilter;

        switch (listType) {
            case 'tag-server':
                return this.tagRepository.totalTagGuildsCount({
                    where: {
                        tag_name: tagName,
                        min,
                        max,
                    },
                });

            case 'search-server':
                return this.guildRepository.totalSearchGuildsCount({
                    where: {
                        keyword,
                        min,
                        max,
                    },
                });

            case 'my-server':
                return this.guildRepository.totalMyGuildsCount({
                    where: {
                        user_id: userId,
                    },
                });

            default:
                return this.guildRepository.totalCategoryGuildsCount({
                    where: {
                        category_id: categoryId,
                        min,
                        max,
                    },
                });
        }
    }

    /**
     * listType에 맞는 server ids 가져오기
     * type list: tag, search
     * @param {PaginateOptions} options
     */
    private async getServerIds(options: PaginateOptions) {
        const { listType, tagName, keyword, categoryId, userId } = options;
        const { itemSize, page, min, max, sort } = this.selectFilter;

        const commonOptions = {
            orderBy: {
                sort,
            },

            limit: itemSize,
            offset: page,
        };

        switch (listType) {
            case 'tag-server':
                return this.tagRepository.findTagGuildIds({
                    ...commonOptions,
                    where: {
                        tag_name: tagName,
                        max,
                        min,
                    },
                });

            case 'search-server':
                return this.guildRepository.findSearchGuildIds({
                    ...commonOptions,
                    where: {
                        keyword,
                        max,
                        min,
                    },
                });

            case 'my-server':
                return this.guildRepository.findMyGuildIds({
                    where: {
                        user_id: userId,
                    },
                });

            default:
                return this.guildRepository.findCategoryGuildIds({
                    ...commonOptions,
                    where: {
                        category_id: categoryId,
                        max,
                        min,
                    },
                });
        }
    }

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
