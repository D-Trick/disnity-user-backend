// types
import type { SelectFilter } from '@common/ts/interfaces/select-filter.interface';
import type { FindOptions } from '../ts/interfaces/options.interface';
import type { ServerPagination } from '../ts/interfaces/pagination.interface';

// lib
import { Injectable } from '@nestjs/common';
import { pagination } from '@lib/utiles';
import { isEmpty } from '@lib/lodash';

// repositorys
import { TagRepository } from '@databases/repositories/tag.repository';
import { GuildRepository } from '@databases/repositories/guild.repository';

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
     * @param {FindOptions} options
     * @returns 서버목록
     */
    async paginate(options: FindOptions): Promise<ServerPagination> {
        const { filter, userId } = options;
        this.selectFilter = this.filterFormat(filter);
        const { sort } = this.selectFilter;

        const serverIds = await this.getServerIds(options);
        if (isEmpty(serverIds)) return { totalCount: 0, list: [] };

        const totalPromise = this.getTotalCount(options);
        const serversPromise = this.guildRepository.findMany({
            where: {
                user_id: userId,
                IN: {
                    ids: serverIds,
                },
            },
            orderBy: {
                sort,
            },
        });

        const [total, _servers] = await Promise.all([totalPromise, serversPromise]);

        return {
            totalCount: parseInt(total.count),
            list: _servers,
        };
    }

    /**************************************************
     * Private Methods
     **************************************************/
    /**
     * 리스트타입에 맞는 총 합계 가져오기
     * (Pagination을 위해 총 개수를 구한다.)
     * @param options
     * @returns 총 합계
     */
    private async getTotalCount(options: FindOptions): Promise<{ count: string }> {
        const { listType, keyword, tagName, categoryId, userId } = options;
        const { min, max } = this.selectFilter;

        let promise = undefined;
        if (listType === 'tag') {
            promise = this.tagRepository.serverTotalCount({
                where: {
                    tag_name: tagName,
                    min,
                    max,
                },
            });
        } else if (listType === 'search') {
            promise = this.guildRepository.searchTotalCount({
                where: {
                    keyword,
                    min,
                    max,
                },
            });
        } else {
            promise = this.guildRepository.totalCount({
                where: {
                    category_id: categoryId,
                    user_id: userId,
                    min,
                    max,
                },
            });
        }

        return promise;
    }

    /**
     * 리스트타입에 맞는 server id 목록 가져오기
     * type list: tag, search
     * @param {string} type
     * @param {FindOptions} options
     * @returns ids
     */
    private async getServerIds(options: FindOptions) {
        const { listType, tagName, keyword, categoryId, userId } = options;
        const { itemSize, page, min, max, sort } = this.selectFilter;

        const commonOptions = {
            orderBy: {
                sort,
            },

            limit: itemSize,
            offset: page,
        };

        let ids = [];
        if (listType === 'tag') {
            ids = await this.tagRepository.getIdsByServer({
                ...commonOptions,
                where: {
                    tag_name: tagName,
                    max,
                    min,
                },
            });
        } else if (listType === 'search') {
            ids = await this.guildRepository.getIdsBySearch({
                ...commonOptions,
                where: {
                    keyword,
                    max,
                    min,
                },
            });
        } else {
            ids = await this.guildRepository.getIds({
                ...commonOptions,
                where: {
                    category_id: categoryId,
                    user_id: userId,
                    max,
                    min,
                },
            });
        }

        return ids;
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
            tempSort = 'server_refresh_date';
        }

        return {
            ...pageFormat,
            sort: tempSort,
            min,
            max,
        };
    }
}
